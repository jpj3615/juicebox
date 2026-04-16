from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.team import TeamResponse, TeamStatsResponse
from ..services.team_service import get_all_teams, get_team_stats

router = APIRouter(tags=["teams"])


@router.get("/teams", response_model=list[TeamResponse])
def list_teams(db: Session = Depends(get_db)):
    return get_all_teams(db)


@router.get("/teams/{team_id}/stats", response_model=TeamStatsResponse)
def team_stats(
    team_id: int,
    season: int = Query(2024),
    db: Session = Depends(get_db),
):
    result = get_team_stats(db, team_id, season)
    if not result:
        raise HTTPException(status_code=404, detail="Team or season not found")
    return result
