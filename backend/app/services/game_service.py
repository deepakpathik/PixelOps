from fastapi import HTTPException, status
from app.repositories import game_repository
from prisma.types import GameCreateInput, GameVersionCreateInput
from prisma.models import Game, GameVersion
from typing import List

async def create_game(data: GameCreateInput, developer_id: str) -> Game:
    data["developerId"] = developer_id
    return await game_repository.create_game(data)

async def list_games(skip: int = 0, limit: int = 10) -> List[Game]:
    return await game_repository.get_all_games(skip, limit)

async def add_version(game_id: str, data: GameVersionCreateInput) -> GameVersion:
    game = await game_repository.get_game_by_id(game_id)
    
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
        
    data["gameId"] = game_id
    
    return await game_repository.create_game_version(data)
