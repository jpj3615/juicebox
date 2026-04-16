from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Sport(Base):
    __tablename__ = "sports"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)

    teams: Mapped[list["Team"]] = relationship(back_populates="sport")
    players: Mapped[list["Player"]] = relationship(back_populates="sport")
    seasons: Mapped[list["Season"]] = relationship(back_populates="sport")
    stat_categories: Mapped[list["StatCategory"]] = relationship(back_populates="sport")


from .team import Team  # noqa: E402
from .player import Player  # noqa: E402
from .season import Season  # noqa: E402
from .stat_category import StatCategory  # noqa: E402
