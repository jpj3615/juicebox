from collections import defaultdict

from sqlalchemy.orm import Session

from ..models import Player, PlayerStat, Season, Team


def get_matchup_data(
    db: Session,
    player_id: int,
    opponent_team_id: int,
    season_year: int,
) -> dict | None:
    player = db.query(Player).get(player_id)
    if not player:
        return None

    opponent_team = db.query(Team).get(opponent_team_id)
    if not opponent_team:
        return None

    season = db.query(Season).filter_by(year=season_year, season_type="REG").first()
    if not season:
        return None

    # Import schedule data to find matchup weeks
    import nfl_data_py as nfl
    schedules = nfl.import_schedules([season_year])
    schedules = schedules[schedules["game_type"] == "REG"]

    # Find player's team
    player_team = db.query(Team).get(player.team_id) if player.team_id else None
    if not player_team:
        return None

    pt_abbr = player_team.abbreviation
    ot_abbr = opponent_team.abbreviation

    # Find weeks where player's team faced opponent
    matchup_weeks = []
    for _, row in schedules.iterrows():
        if (row["home_team"] == pt_abbr and row["away_team"] == ot_abbr) or \
           (row["away_team"] == pt_abbr and row["home_team"] == ot_abbr):
            matchup_weeks.append(int(row["week"]))

    if not matchup_weeks:
        return {
            "player_name": player.name,
            "player_id": player.id,
            "opponent_team": ot_abbr,
            "season": season_year,
            "matchup_games": [],
            "matchup_averages": {},
            "season_averages": {},
        }

    # Get player stats for matchup weeks
    matchup_rows = (
        db.query(PlayerStat)
        .filter(
            PlayerStat.player_id == player_id,
            PlayerStat.season_id == season.id,
            PlayerStat.week.in_(matchup_weeks),
        )
        .all()
    )

    games_by_week: dict[int, dict] = defaultdict(dict)
    matchup_totals: dict[str, float] = defaultdict(float)
    for r in matchup_rows:
        games_by_week[r.week][r.stat_category] = r.stat_value
        matchup_totals[r.stat_category] += r.stat_value

    matchup_games = [{"week": w, **s} for w, s in sorted(games_by_week.items())]
    matchup_avgs = {k: v / len(matchup_weeks) for k, v in matchup_totals.items()}

    # Season averages from totals
    total_rows = (
        db.query(PlayerStat)
        .filter_by(player_id=player_id, season_id=season.id, week=None)
        .all()
    )

    # Count total weeks played
    weeks_played = (
        db.query(PlayerStat.week)
        .filter(
            PlayerStat.player_id == player_id,
            PlayerStat.season_id == season.id,
            PlayerStat.week.isnot(None),
        )
        .distinct()
        .count()
    )
    weeks_played = max(weeks_played, 1)

    season_avgs = {r.stat_category: r.stat_value / weeks_played for r in total_rows}

    return {
        "player_name": player.name,
        "player_id": player.id,
        "opponent_team": ot_abbr,
        "season": season_year,
        "matchup_games": matchup_games,
        "matchup_averages": matchup_avgs,
        "season_averages": season_avgs,
    }
