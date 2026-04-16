from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    external_id: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    sport_id: Mapped[int] = mapped_column(ForeignKey("sports.id"), nullable=False)
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("teams.id"))
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    display_name: Mapped[Optional[str]] = mapped_column(String(200))
    position: Mapped[Optional[str]] = mapped_column(String(20))
    jersey_number: Mapped[Optional[int]]
    headshot_url: Mapped[Optional[str]] = mapped_column(String(500))
    active: Mapped[bool] = mapped_column(default=True)

    sport: Mapped["Sport"] = relationship(back_populates="players")
    team: Mapped[Optional["Team"]] = relationship(back_populates="players")
    player_stats: Mapped[list["PlayerStat"]] = relationship(back_populates="player")


from .sport import Sport  # noqa: E402
from .team import Team  # noqa: E402
from .player_stat import PlayerStat  # noqa: E402
