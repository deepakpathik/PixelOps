from fastapi import HTTPException, status
from app.repositories import score_repository, game_repository
from prisma.models import Score
from typing import List

async def get_top_players(game_id: str, limit: int = 10) -> List[Score]:
    game = await game_repository.get_game_by_id(game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found for leaderboard"
        )
        
    return await score_repository.get_scores_by_game(game_id, limit)
