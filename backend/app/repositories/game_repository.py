from typing import List, Optional
from prisma.models import Game, GameVersion
from prisma.types import GameCreateInput, GameVersionCreateInput
from app.db.prisma import db

async def create_game(data: GameCreateInput) -> Game:
    return await db.game.create(data=data)

async def get_all_games() -> List[Game]:
    return await db.game.find_many(
        include={"versions": True}
    )

async def get_game_by_id(game_id: str) -> Optional[Game]:
    return await db.game.find_unique(
        where={"id": game_id},
        include={"versions": True}
    )

async def create_game_version(data: GameVersionCreateInput) -> GameVersion:
    return await db.gameversion.create(data=data)
