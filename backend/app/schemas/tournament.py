from pydantic import BaseModel, Field
from datetime import datetime

class TournamentCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    gameId: str
    entryFee: float = Field(..., ge=0.0)
    startDate: datetime
    endDate: datetime
