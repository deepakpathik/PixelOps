from pydantic import BaseModel, Field

class ScoreSubmit(BaseModel):
    gameId: str
    value: int = Field(..., ge=0)
