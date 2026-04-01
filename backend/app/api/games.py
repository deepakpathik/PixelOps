from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from app.schemas.game import GameCreate, GameVersionCreate
from app.services import game_service
from app.repositories import game_repository
from app.api.deps import require_developer_role
from prisma.models import User

router = APIRouter(prefix="/games", tags=["games"])

@router.post("/")
async def create_new_game(game: GameCreate, current_user: User = Depends(require_developer_role)) -> Any:
    return await game_service.create_game(
        data={"title": game.title, "description": game.description, "format": game.format},
        developer_id=current_user.id
    )

from fastapi import Query

@router.get("/")
async def list_all_games(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    skip = (page - 1) * limit
    return await game_service.list_games(skip, limit)

@router.get("/{id}")
async def get_game_by_id(id: str) -> Any:
    game = await game_repository.get_game_by_id(id)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return game

@router.post("/{id}/versions")
async def create_new_version(id: str, version: GameVersionCreate, current_user: User = Depends(require_developer_role)) -> Any:
    # Ensure they are developer natively via dependency
    return await game_service.add_version(
        game_id=id,
        data={"version": version.version, "fileUrl": version.fileUrl}
    )
