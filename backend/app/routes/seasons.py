from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Season
from ..schemas.stats import SeasonResponse

router = APIRouter(tags=["seasons"])


@router.get("/seasons", response_model=list[SeasonResponse])
def list_seasons(db: Session = Depends(get_db)):
    return db.query(Season).order_by(Season.year.desc()).all()
