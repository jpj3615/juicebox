from collections import defaultdict

from sqlalchemy.orm import Session

from ..models import Player, PlayerStat, Season, Team


def search_players(db: Session, query: str, limit: int = 20) -> list[dict]:
    results = (
        db.query(Player, Team.abbreviation)
        .outerjoin(Team, Player.team_id == Team.id)
        .filter(Player.name.ilike(f"%{query}%"))
        .order_by(Player.active.desc(), Player.name)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": p.id,
            "name": p.name,
            "display_name": p.display_name,
            "position": p.position,
            "team_abbreviation": abbr,
            "headshot_url": p.headshot_url,
        }
        for p, abbr in results
    ]


def get_player_stats(db: Session, player_id: int, season_year: int) -> dict | None:
    player = db.query(Player).get(player_id)
    if not player:
        return None

    team_abbr = None
    if player.team_id:
        team = db.query(Team).get(player.team_id)
        team_abbr = team.abbreviation if team else None

    season = db.query(Season).filter_by(year=season_year, season_type="REG").first()
    if not season:
        return None

    # Season totals (week=NULL)
    totals_rows = (
        db.query(PlayerStat)
        .filter_by(player_id=player_id, season_id=season.id, week=None)
        .all()
    )
    season_totals = {r.stat_category: r.stat_value for r in totals_rows}

    # Weekly breakdown
    weekly_rows = (
        db.query(PlayerStat)
        .filter(
            PlayerStat.player_id == player_id,
            PlayerStat.season_id == season.id,
            PlayerStat.week.isnot(None),
        )
        .order_by(PlayerStat.week)
        .all()
    )
    weekly_by_week: dict[int, dict] = defaultdict(dict)
    for r in weekly_rows:
        weekly_by_week[r.week][r.stat_category] = r.stat_value

    weekly = [{"week": w, **stats} for w, stats in sorted(weekly_by_week.items())]

    return {
        "player": {
            "id": player.id,
            "name": player.name,
            "display_name": player.display_name,
            "position": player.position,
            "team_abbreviation": team_abbr,
            "headshot_url": player.headshot_url,
        },
        "season": season_year,
        "season_totals": season_totals,
        "weekly": weekly,
    }


def get_comparison_data(
    db: Session,
    player_ids: list[int],
    stat_categories: list[str],
    season_year: int,
) -> dict | None:
    season = db.query(Season).filter_by(year=season_year, season_type="REG").first()
    if not season:
        return None

    players_data = []
    for pid in player_ids:
        player = db.query(Player).get(pid)
        if not player:
            continue

        team_abbr = None
        if player.team_id:
            team = db.query(Team).get(player.team_id)
            team_abbr = team.abbreviation if team else None

        # Season totals
        totals_rows = (
            db.query(PlayerStat)
            .filter(
                PlayerStat.player_id == pid,
                PlayerStat.season_id == season.id,
                PlayerStat.week.is_(None),
                PlayerStat.stat_category.in_(stat_categories),
            )
            .all()
        )
        stats = {r.stat_category: r.stat_value for r in totals_rows}

        # Weekly for trend
        weekly_rows = (
            db.query(PlayerStat)
            .filter(
                PlayerStat.player_id == pid,
                PlayerStat.season_id == season.id,
                PlayerStat.week.isnot(None),
                PlayerStat.stat_category.in_(stat_categories),
            )
            .order_by(PlayerStat.week)
            .all()
        )
        weekly_by_week: dict[int, dict] = defaultdict(dict)
        for r in weekly_rows:
            weekly_by_week[r.week][r.stat_category] = r.stat_value
        weekly = [{"week": w, **s} for w, s in sorted(weekly_by_week.items())]

        players_data.append({
            "player_id": player.id,
            "name": player.name,
            "display_name": player.display_name,
            "position": player.position,
            "team_abbreviation": team_abbr,
            "headshot_url": player.headshot_url,
            "stats": stats,
            "weekly": weekly,
        })

    return {
        "season": season_year,
        "stat_categories": stat_categories,
        "players": players_data,
    }
