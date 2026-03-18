from fastapi import APIRouter
from typing import List
from app.schemas.leaderboard import LeaderboardEntry
from app.services import leaderboard_service

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/{game_id}", response_model=List[LeaderboardEntry])
async def get_leaderboard(game_id: str):
    scores = await leaderboard_service.get_top_players(game_id)
    
    leaderboard = []
    for index, score in enumerate(scores):
        username = score.user.username if score.user else "Unknown Player"
        leaderboard.append(
            LeaderboardEntry(
                rank=index + 1,
                username=username,
                score=score.value
            )
        )
    return leaderboard
