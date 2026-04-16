from sqlalchemy.orm import Session

from ..models import Team, TeamStat, Season, Player


def get_all_teams(db: Session) -> list[dict]:
    teams = db.query(Team).order_by(Team.conference, Team.division, Team.name).all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "abbreviation": t.abbreviation,
            "conference": t.conference,
            "division": t.division,
            "logo_url": t.logo_url,
            "primary_color": t.primary_color,
            "secondary_color": t.secondary_color,
        }
        for t in teams
    ]


def get_team_stats(db: Session, team_id: int, season_year: int) -> dict | None:
    team = db.query(Team).get(team_id)
    if not team:
        return None

    season = db.query(Season).filter_by(year=season_year, season_type="REG").first()
    if not season:
        return None

    stat_rows = (
        db.query(TeamStat)
        .filter_by(team_id=team_id, season_id=season.id, week=None)
        .all()
    )
    stats = {r.stat_category: r.stat_value for r in stat_rows}

    roster = (
        db.query(Player)
        .filter_by(team_id=team_id)
        .order_by(Player.position, Player.name)
        .all()
    )
    roster_data = [
        {
            "id": p.id,
            "name": p.name,
            "display_name": p.display_name,
            "position": p.position,
            "jersey_number": p.jersey_number,
            "headshot_url": p.headshot_url,
        }
        for p in roster
    ]

    return {
        "team": {
            "id": team.id,
            "name": team.name,
            "abbreviation": team.abbreviation,
            "conference": team.conference,
            "division": team.division,
            "logo_url": team.logo_url,
            "primary_color": team.primary_color,
            "secondary_color": team.secondary_color,
        },
        "season": season_year,
        "stats": stats,
        "roster": roster_data,
    }
