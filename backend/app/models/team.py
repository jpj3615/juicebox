from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    sport_id: Mapped[int] = mapped_column(ForeignKey("sports.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    abbreviation: Mapped[str] = mapped_column(String(10), nullable=False)
    conference: Mapped[Optional[str]] = mapped_column(String(50))
    division: Mapped[Optional[str]] = mapped_column(String(50))
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))
    primary_color: Mapped[Optional[str]] = mapped_column(String(10))
    secondary_color: Mapped[Optional[str]] = mapped_column(String(10))

    sport: Mapped["Sport"] = relationship(back_populates="teams")
    players: Mapped[list["Player"]] = relationship(back_populates="team")
    team_stats: Mapped[list["TeamStat"]] = relationship(back_populates="team")


from .sport import Sport  # noqa: E402
from .player import Player  # noqa: E402
from .team_stat import TeamStat  # noqa: E402
