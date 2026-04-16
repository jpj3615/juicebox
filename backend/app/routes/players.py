from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.player import PlayerSearchResult, PlayerStatsResponse
from ..services.player_service import search_players, get_player_stats

router = APIRouter(tags=["players"])


@router.get("/players/search", response_model=list[PlayerSearchResult])
def player_search(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    return search_players(db, q)


@router.get("/players/{player_id}/stats", response_model=PlayerStatsResponse)
def player_stats(
    player_id: int,
    season: int = Query(2024),
    db: Session = Depends(get_db),
):
    result = get_player_stats(db, player_id, season)
    if not result:
        raise HTTPException(status_code=404, detail="Player or season not found")
    return result
