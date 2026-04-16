from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import StatCategory
from ..schemas.stats import StatCategoryResponse

router = APIRouter(tags=["stats"])


@router.get("/stats/categories", response_model=list[StatCategoryResponse])
def list_stat_categories(db: Session = Depends(get_db)):
    return (
        db.query(StatCategory)
        .order_by(StatCategory.category_group, StatCategory.display_name)
        .all()
    )
