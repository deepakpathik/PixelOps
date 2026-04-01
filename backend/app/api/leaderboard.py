from fastapi import APIRouter, Query
from typing import List
from app.schemas.leaderboard import LeaderboardEntry
from app.services import leaderboard_service

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/{game_id}", response_model=List[LeaderboardEntry])
async def get_leaderboard(game_id: str, page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    skip = (page - 1) * limit
    scores = await leaderboard_service.get_top_players(game_id, skip, limit)
    
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
