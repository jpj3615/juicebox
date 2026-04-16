"""Main ingestion script — pulls NFL data from nfl_data_py and loads into SQLite."""

import sys
from pathlib import Path

import nfl_data_py as nfl
import pandas as pd
from sqlalchemy import text

# Allow running as `python -m app.data_ingestion.ingest` from backend/
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.database import Base, engine, SessionLocal
from app.models import Sport, Team, Player, Season, StatCategory, PlayerStat, TeamStat
from app.data_ingestion.column_mapping import WEEKLY_STAT_COLUMNS, TEAM_STAT_CATEGORIES

SEASONS = [2023, 2024]
BATCH_SIZE = 5000


def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)


def insert_sport(session) -> Sport:
    sport = session.query(Sport).filter_by(code="NFL").first()
    if not sport:
        sport = Sport(name="National Football League", code="NFL")
        session.add(sport)
        session.commit()
    print(f"Sport: {sport.name} (id={sport.id})")
    return sport


def insert_teams(session, sport: Sport) -> dict[str, Team]:
    print("Importing teams...")
    df = nfl.import_team_desc()
    # Filter to 32 active NFL teams (exclude historical like SD, OAK, STL)
    active_abbrs = {
        "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE",
        "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC",
        "LAC", "LAR", "LV", "MIA", "MIN", "NE", "NO", "NYG",
        "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS",
    }
    teams_map = {}
    for _, row in df.iterrows():
        abbr = row["team_abbr"]
        if abbr not in active_abbrs:
            continue
        existing = session.query(Team).filter_by(abbreviation=abbr).first()
        if existing:
            teams_map[abbr] = existing
            continue
        team = Team(
            sport_id=sport.id,
            name=row["team_name"],
            abbreviation=abbr,
            conference=row.get("team_conf"),
            division=row.get("team_division"),
            logo_url=row.get("team_logo_espn"),
            primary_color=row.get("team_color"),
            secondary_color=row.get("team_color2"),
        )
        session.add(team)
        teams_map[abbr] = team
    session.commit()
    print(f"  Inserted/found {len(teams_map)} teams")
    return teams_map


def insert_seasons(session, sport: Sport) -> dict[int, Season]:
    print("Creating seasons...")
    seasons_map = {}
    for year in SEASONS:
        existing = session.query(Season).filter_by(
            sport_id=sport.id, year=year, season_type="REG"
        ).first()
        if existing:
            seasons_map[year] = existing
        else:
            s = Season(sport_id=sport.id, year=year, season_type="REG")
            session.add(s)
            seasons_map[year] = s
    session.commit()
    print(f"  Created seasons: {list(seasons_map.keys())}")
    return seasons_map


def insert_stat_categories(session, sport: Sport):
    print("Inserting stat categories...")
    existing = {
        c.name for c in session.query(StatCategory).filter_by(sport_id=sport.id).all()
    }
    categories = []
    for _, cat_name, display_name, group in WEEKLY_STAT_COLUMNS:
        if cat_name not in existing:
            categories.append(StatCategory(
                sport_id=sport.id,
                name=cat_name,
                display_name=display_name,
                category_group=group,
            ))
            existing.add(cat_name)
    for cat_name, display_name, group in TEAM_STAT_CATEGORIES:
        if cat_name not in existing:
            categories.append(StatCategory(
                sport_id=sport.id,
                name=cat_name,
                display_name=display_name,
                category_group=group,
            ))
            existing.add(cat_name)
    session.add_all(categories)
    session.commit()
    print(f"  Inserted {len(categories)} stat categories")


def insert_players(session, sport: Sport, teams_map: dict[str, Team]) -> dict[str, Player]:
    print("Importing rosters...")
    rosters = nfl.import_seasonal_rosters(SEASONS)
    # Deduplicate by player_id — take the most recent season's record
    rosters = rosters.sort_values("season", ascending=False).drop_duplicates(subset="player_id", keep="first")

    players_map = {}
    existing_ids = {
        p.external_id: p
        for p in session.query(Player).filter_by(sport_id=sport.id).all()
    }

    batch = []
    for _, row in rosters.iterrows():
        pid = row.get("player_id")
        if not pid or pd.isna(pid):
            continue

        if pid in existing_ids:
            players_map[pid] = existing_ids[pid]
            continue

        team_abbr = row.get("team")
        team = teams_map.get(team_abbr)

        jersey = row.get("jersey_number")
        if pd.notna(jersey):
            jersey = int(jersey)
        else:
            jersey = None

        player = Player(
            external_id=pid,
            sport_id=sport.id,
            team_id=team.id if team else None,
            name=row.get("player_name") or "Unknown",
            display_name=row.get("football_name") or row.get("player_name"),
            position=row.get("position"),
            jersey_number=jersey,
            headshot_url=row.get("headshot_url"),
            active=row.get("status") == "ACT",
        )
        batch.append(player)
        players_map[pid] = player

        if len(batch) >= BATCH_SIZE:
            session.add_all(batch)
            session.commit()
            batch = []

    if batch:
        session.add_all(batch)
        session.commit()
    print(f"  Inserted/found {len(players_map)} players")
    return players_map


def insert_weekly_stats(
    session,
    players_map: dict[str, "Player"],
    seasons_map: dict[int, Season],
):
    print("Importing weekly stats...")
    # Check if we already have data
    count = session.query(PlayerStat).count()
    if count > 0:
        print(f"  Skipping — already have {count} player_stat rows")
        return

    weekly = nfl.import_weekly_data(SEASONS)
    col_map = {src: (cat, disp, grp) for src, cat, disp, grp in WEEKLY_STAT_COLUMNS}

    batch = []
    total = 0
    for _, row in weekly.iterrows():
        pid = row.get("player_id")
        season_year = row.get("season")
        week = row.get("week")

        if not pid or pid not in players_map:
            continue
        if season_year not in seasons_map:
            continue

        player = players_map[pid]
        season = seasons_map[season_year]

        for src_col, (cat_name, _, _) in col_map.items():
            val = row.get(src_col)
            if pd.isna(val) or val == 0:
                continue
            batch.append(PlayerStat(
                player_id=player.id,
                season_id=season.id,
                week=int(week) if pd.notna(week) else None,
                stat_category=cat_name,
                stat_value=float(val),
            ))

        if len(batch) >= BATCH_SIZE:
            session.add_all(batch)
            session.commit()
            total += len(batch)
            print(f"  ... inserted {total} rows")
            batch = []

    if batch:
        session.add_all(batch)
        session.commit()
        total += len(batch)
    print(f"  Total weekly player_stat rows: {total}")


def compute_season_aggregates(session, seasons_map: dict[int, Season]):
    """Sum weekly stats per player into season aggregates (week=NULL)."""
    print("Computing season aggregates...")
    count = session.query(PlayerStat).filter(PlayerStat.week.is_(None)).count()
    if count > 0:
        print(f"  Skipping — already have {count} aggregate rows")
        return

    for year, season in seasons_map.items():
        result = session.execute(text("""
            INSERT INTO player_stats (player_id, season_id, week, stat_category, stat_value)
            SELECT player_id, season_id, NULL, stat_category, SUM(stat_value)
            FROM player_stats
            WHERE season_id = :sid AND week IS NOT NULL
            GROUP BY player_id, season_id, stat_category
        """), {"sid": season.id})
        session.commit()
        print(f"  Season {year}: inserted {result.rowcount} aggregate rows")


def insert_team_stats(
    session,
    teams_map: dict[str, Team],
    seasons_map: dict[int, Season],
):
    """Derive team stats from schedule data."""
    print("Importing team stats from schedules...")
    count = session.query(TeamStat).count()
    if count > 0:
        print(f"  Skipping — already have {count} team_stat rows")
        return

    schedules = nfl.import_schedules(SEASONS)
    # Only completed regular season games
    schedules = schedules[
        (schedules["game_type"] == "REG") & schedules["home_score"].notna()
    ]

    # Accumulate per team per season
    team_season_stats: dict[tuple, dict] = {}

    for _, row in schedules.iterrows():
        season_year = row["season"]
        if season_year not in seasons_map:
            continue
        season = seasons_map[season_year]

        home = row["home_team"]
        away = row["away_team"]
        hs = row["home_score"]
        as_ = row["away_score"]
        week = row["week"]

        if pd.isna(hs) or pd.isna(as_):
            continue

        hs, as_ = int(hs), int(as_)

        for abbr, pts_for, pts_against in [(home, hs, as_), (away, as_, hs)]:
            if abbr not in teams_map:
                continue
            team = teams_map[abbr]
            key = (team.id, season.id)
            if key not in team_season_stats:
                team_season_stats[key] = {
                    "points_scored": 0, "points_allowed": 0,
                    "wins": 0, "losses": 0, "ties": 0,
                }
            s = team_season_stats[key]
            s["points_scored"] += pts_for
            s["points_allowed"] += pts_against
            if pts_for > pts_against:
                s["wins"] += 1
            elif pts_for < pts_against:
                s["losses"] += 1
            else:
                s["ties"] += 1

    batch = []
    for (team_id, season_id), stats in team_season_stats.items():
        for cat_name, value in stats.items():
            batch.append(TeamStat(
                team_id=team_id,
                season_id=season_id,
                week=None,
                stat_category=cat_name,
                stat_value=float(value),
            ))

    session.add_all(batch)
    session.commit()
    print(f"  Inserted {len(batch)} team_stat rows")


def main():
    create_tables()
    session = SessionLocal()
    try:
        sport = insert_sport(session)
        teams_map = insert_teams(session, sport)
        seasons_map = insert_seasons(session, sport)
        insert_stat_categories(session, sport)
        players_map = insert_players(session, sport, teams_map)
        insert_weekly_stats(session, players_map, seasons_map)
        compute_season_aggregates(session, seasons_map)
        insert_team_stats(session, teams_map, seasons_map)
        print("\nIngestion complete!")
        print(f"  Players: {session.query(Player).count()}")
        print(f"  PlayerStats: {session.query(PlayerStat).count()}")
        print(f"  TeamStats: {session.query(TeamStat).count()}")
    finally:
        session.close()


if __name__ == "__main__":
    main()
