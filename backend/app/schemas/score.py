from pydantic import BaseModel

class ScoreSubmit(BaseModel):
    gameId: str
    value: int
