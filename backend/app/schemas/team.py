from pydantic import BaseModel


class TeamResponse(BaseModel):
    id: int
    name: str
    abbreviation: str
    conference: str | None
    division: str | None
    logo_url: str | None
    primary_color: str | None
    secondary_color: str | None

    model_config = {"from_attributes": True}


class TeamStatsResponse(BaseModel):
    team: TeamResponse
    season: int
    stats: dict[str, float]
    roster: list[dict]
