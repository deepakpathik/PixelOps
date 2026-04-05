from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.score import ScoreSubmit
from app.services import score_service
from app.api.deps import get_current_user
from prisma.models import User

from app.utils.response import success_response

router = APIRouter(prefix="/scores", tags=["scores"])

import time
from fastapi import HTTPException

# In-memory dictionary: user_id -> [list of timestamps]
SCORE_RATE_LIMITS: dict = {}
RATE_LIMIT_DURATION = 60
RATE_LIMIT_MAX_REQUESTS = 5

@router.post("/")
async def submit_new_score(score: ScoreSubmit, current_user: User = Depends(get_current_user)) -> Any:
    # Rate Limiting Logic
    now = time.time()
    user_times = SCORE_RATE_LIMITS.get(current_user.id, [])
    # Filter array mapped explicitly bounds
    user_times = [t for t in user_times if now - t < RATE_LIMIT_DURATION]
    
    if len(user_times) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
        
    user_times.append(now)
    SCORE_RATE_LIMITS[current_user.id] = user_times
    
    data = await score_service.submit_score(
        user_id=current_user.id,
        game_id=score.gameId,
        value=score.value
    )
    return success_response(data, "Score submitted successfully")

from fastapi import Query

@router.get("/{game_id}")
async def get_scores(game_id: str, page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    skip = (page - 1) * limit
    data = await score_service.get_game_scores(game_id=game_id, skip=skip, limit=limit)
    return success_response(data, "Scores retrieved successfully")
