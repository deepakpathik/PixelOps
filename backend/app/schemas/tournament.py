from pydantic import BaseModel
from datetime import datetime

class TournamentCreate(BaseModel):
    name: str
    gameId: str
    entryFee: float
    startDate: datetime
    endDate: datetime
