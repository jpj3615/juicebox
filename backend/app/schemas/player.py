from pydantic import BaseModel


class PlayerSearchResult(BaseModel):
    id: int
    name: str
    display_name: str | None
    position: str | None
    team_abbreviation: str | None
    headshot_url: str | None

    model_config = {"from_attributes": True}


class PlayerStatsResponse(BaseModel):
    player: PlayerSearchResult
    season: int
    season_totals: dict[str, float]
    weekly: list[dict]
