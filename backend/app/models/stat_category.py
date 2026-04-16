from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class StatCategory(Base):
    __tablename__ = "stat_categories"
    __table_args__ = (
        UniqueConstraint("sport_id", "name", name="uq_stat_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    sport_id: Mapped[int] = mapped_column(ForeignKey("sports.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    category_group: Mapped[str] = mapped_column(String(50), nullable=False)
    stat_type: Mapped[str] = mapped_column(String(20), nullable=False, default="numeric")

    sport: Mapped["Sport"] = relationship(back_populates="stat_categories")


from .sport import Sport  # noqa: E402
