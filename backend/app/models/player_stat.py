from typing import Optional

from sqlalchemy import Float, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class PlayerStat(Base):
    __tablename__ = "player_stats"
    __table_args__ = (
        Index("ix_player_stat_lookup", "player_id", "season_id", "stat_category"),
        Index("ix_player_stat_week", "player_id", "season_id", "week", "stat_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), nullable=False)
    season_id: Mapped[int] = mapped_column(ForeignKey("seasons.id"), nullable=False)
    week: Mapped[Optional[int]]
    stat_category: Mapped[str] = mapped_column(String(50), nullable=False)
    stat_value: Mapped[float] = mapped_column(Float, nullable=False)

    player: Mapped["Player"] = relationship(back_populates="player_stats")
    season: Mapped["Season"] = relationship(back_populates="player_stats")


from .player import Player  # noqa: E402
from .season import Season  # noqa: E402
