from typing import List
from prisma.models import Score
from prisma.types import ScoreCreateInput
from app.db.prisma import db

async def create_score(data: ScoreCreateInput) -> Score:
    return await db.score.create(data=data)

async def get_scores_by_game(game_id: str, limit: int = 50) -> List[Score]:
    return await db.score.find_many(
        where={"gameId": game_id},
        order={"value": "desc"},
        take=limit,
        include={"user": True}
    )

async def get_user_scores(user_id: str) -> List[Score]:
    return await db.score.find_many(
        where={"userId": user_id},
        order={"createdAt": "desc"},
        include={"game": True}
    )
