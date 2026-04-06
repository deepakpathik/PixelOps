from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from app.schemas.game import GameCreate, GameVersionCreate
from app.services import game_service
from app.repositories import game_repository
from app.api.deps import require_developer_role
from app.utils.response import success_response
from prisma.models import User

router = APIRouter(prefix="/games", tags=["games"])

@router.post("/")
async def create_new_game(game: GameCreate, current_user: User = Depends(require_developer_role)) -> Any:
    """
    Create a new game natively accurately isolating explicit developer scoping properly cleanly.
    """
    data = await game_service.create_game(
        data={"title": game.title, "description": game.description, "format": game.format},
        developer_id=current_user.id
    )
    return success_response(data, "Game created successfully")

from fastapi import Query

@router.get("/")
async def list_all_games(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    """
    Fetch paginated bounds tracking mapping effectively scaling dynamically seamlessly natively reliably.
    """
    skip = (page - 1) * limit
    data = await game_service.list_games(skip, limit)
    return success_response(data, "Games retrieved successfully")

@router.get("/{id}")
async def get_game_by_id(id: str) -> Any:
    """
    Fetch raw exact identifiers cleanly retrieving structural logic smoothly intrinsically mapping schemas explicitly.
    """
    game = await game_repository.get_game_by_id(id)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return success_response(game, "Game retrieved successfully")

@router.post("/{id}/versions")
async def create_new_version(id: str, version: GameVersionCreate, current_user: User = Depends(require_developer_role)) -> Any:
    """
    Publish a new structural build natively strictly scoped specifically cleanly natively efficiently mapping precisely.
    """
    data = await game_service.add_version(
        game_id=id,
        data={"version": version.version, "fileUrl": version.fileUrl}
    )
    return success_response(data, "Game version added successfully")
