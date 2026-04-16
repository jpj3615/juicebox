from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.stats import CompareRequest, CompareResponse
from ..services.player_service import get_comparison_data

router = APIRouter(tags=["compare"])


@router.post("/compare", response_model=CompareResponse)
def compare_players(req: CompareRequest, db: Session = Depends(get_db)):
    result = get_comparison_data(db, req.player_ids, req.stat_categories, req.season)
    if not result:
        raise HTTPException(status_code=404, detail="Season not found")
    return result
