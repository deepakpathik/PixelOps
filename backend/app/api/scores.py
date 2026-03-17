from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.score import ScoreSubmit
from app.services import score_service
from app.api.deps import get_current_user
from prisma.models import User

router = APIRouter(prefix="/scores", tags=["scores"])

@router.post("/")
async def submit_new_score(score: ScoreSubmit, current_user: User = Depends(get_current_user)) -> Any:
    return await score_service.submit_score(
        user_id=current_user.id,
        game_id=score.gameId,
        value=score.value
    )

@router.get("/{game_id}")
async def get_scores(game_id: str, limit: int = 50) -> Any:
    return await score_service.get_game_scores(game_id=game_id, limit=limit)
