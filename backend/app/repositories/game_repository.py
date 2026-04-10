from typing import List, Optional
from prisma.models import Game, GameVersion
from prisma.types import GameCreateInput, GameVersionCreateInput
from app.db.prisma import db

async def create_game(data: GameCreateInput) -> Game:
    return await db.game.create(data=data)

async def get_all_games(skip: int = 0, limit: int = 10, include_inactive: bool = False) -> List[Game]:
    where = {} if include_inactive else {"isActive": True}
    return await db.game.find_many(
        where=where,
        skip=skip,
        take=limit,
        include={"versions": True}
    )

async def update_game_status(game_id: str, is_active: bool) -> Optional[Game]:
    return await db.game.update(
        where={"id": game_id},
        data={"isActive": is_active}
    )

async def get_game_by_id(game_id: str) -> Optional[Game]:
    return await db.game.find_unique(
        where={"id": game_id},
        include={"versions": True}
    )

async def create_game_version(data: GameVersionCreateInput) -> GameVersion:
    return await db.gameversion.create(data=data)
