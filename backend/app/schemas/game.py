from pydantic import BaseModel
from typing import Optional

class GameVersionCreate(BaseModel):
    version: str
    fileUrl: str

class GameCreate(BaseModel):
    title: str
    description: Optional[str] = None
    format: str
