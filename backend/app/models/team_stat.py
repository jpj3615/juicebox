from typing import Optional

from sqlalchemy import Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class TeamStat(Base):
    __tablename__ = "team_stats"
    __table_args__ = (
        Index("ix_team_stat_lookup", "team_id", "season_id", "stat_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    season_id: Mapped[int] = mapped_column(ForeignKey("seasons.id"), nullable=False)
    week: Mapped[Optional[int]]
    stat_category: Mapped[str] = mapped_column(String(50), nullable=False)
    stat_value: Mapped[float] = mapped_column(Float, nullable=False)

    team: Mapped["Team"] = relationship(back_populates="team_stats")
    season: Mapped["Season"] = relationship(back_populates="team_stats")


from .team import Team  # noqa: E402
from .season import Season  # noqa: E402
