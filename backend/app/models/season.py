from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Season(Base):
    __tablename__ = "seasons"
    __table_args__ = (
        UniqueConstraint("sport_id", "year", "season_type", name="uq_season"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    sport_id: Mapped[int] = mapped_column(ForeignKey("sports.id"), nullable=False)
    year: Mapped[int] = mapped_column(nullable=False)
    season_type: Mapped[str] = mapped_column(String(20), nullable=False, default="REG")

    sport: Mapped["Sport"] = relationship(back_populates="seasons")
    player_stats: Mapped[list["PlayerStat"]] = relationship(back_populates="season")
    team_stats: Mapped[list["TeamStat"]] = relationship(back_populates="season")


from .sport import Sport  # noqa: E402
from .player_stat import PlayerStat  # noqa: E402
from .team_stat import TeamStat  # noqa: E402
