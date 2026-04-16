from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.stats import MatchupResponse
from ..services.matchup_service import get_matchup_data

router = APIRouter(tags=["matchup"])


@router.get("/matchup", response_model=MatchupResponse)
def get_matchup(
    player_id: int = Query(...),
    opponent_team_id: int = Query(...),
    season: int = Query(2024),
    db: Session = Depends(get_db),
):
    result = get_matchup_data(db, player_id, opponent_team_id, season)
    if not result:
        raise HTTPException(status_code=404, detail="Player, team, or season not found")
    return result
