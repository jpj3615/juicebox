from pydantic import BaseModel, field_validator


class CompareRequest(BaseModel):
    player_ids: list[int]
    stat_categories: list[str]
    season: int

    @field_validator("player_ids")
    @classmethod
    def validate_player_count(cls, v: list[int]) -> list[int]:
        if len(v) < 2 or len(v) > 4:
            raise ValueError("Must compare 2–4 players")
        return v


class ComparePlayerData(BaseModel):
    player_id: int
    name: str
    display_name: str | None
    position: str | None
    team_abbreviation: str | None
    headshot_url: str | None
    stats: dict[str, float]
    weekly: list[dict]


class CompareResponse(BaseModel):
    season: int
    stat_categories: list[str]
    players: list[ComparePlayerData]


class StatCategoryResponse(BaseModel):
    name: str
    display_name: str
    category_group: str

    model_config = {"from_attributes": True}


class SeasonResponse(BaseModel):
    id: int
    year: int
    season_type: str

    model_config = {"from_attributes": True}


class MatchupResponse(BaseModel):
    player_name: str
    player_id: int
    opponent_team: str
    season: int
    matchup_games: list[dict]
    matchup_averages: dict[str, float]
    season_averages: dict[str, float]
