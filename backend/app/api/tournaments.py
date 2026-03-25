from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.tournament import TournamentCreate
from app.services import tournament_service
from app.repositories import tournament_repository
from app.api.deps import get_current_user, require_developer_role
from prisma.models import User

router = APIRouter(prefix="/tournaments", tags=["tournaments"])

@router.post("/")
async def create_new_tournament(tournament: TournamentCreate, current_user: User = Depends(require_developer_role)) -> Any:
    return await tournament_service.create_tournament(tournament.dict())

@router.get("/")
async def get_all_tournaments(current_user: User = Depends(get_current_user)) -> Any:
    return await tournament_repository.get_all_tournaments()

@router.post("/{id}/join")
async def register_for_tournament(id: str, current_user: User = Depends(get_current_user)) -> Any:
    return await tournament_service.join_tournament(id, current_user.id)

@router.post("/{id}/start")
async def start_tournament_event(id: str, current_user: User = Depends(require_developer_role)) -> Any:
    return await tournament_service.start_tournament(id)

@router.get("/{id}/bracket")
async def fetch_tournament_bracket(id: str, current_user: User = Depends(get_current_user)) -> Any:
    return await tournament_service.get_bracket(id)
