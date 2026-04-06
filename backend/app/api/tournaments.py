from fastapi import APIRouter, Depends, Query
from typing import Any
from app.schemas.tournament import TournamentCreate
from app.services import tournament_service
from app.repositories import tournament_repository
from app.api.deps import get_current_user, require_developer_role
from prisma.models import User

from app.utils.response import success_response

router = APIRouter(prefix="/tournaments", tags=["tournaments"])

@router.post("/")
async def create_new_tournament(tournament: TournamentCreate, current_user: User = Depends(require_developer_role)) -> Any:
    """
    Publish a new Tournament natively tracking explicitly developer validation correctly seamlessly reliably.
    """
    data = await tournament_service.create_tournament(tournament.dict())
    return success_response(data, "Tournament created successfully")

@router.get("/")
async def get_all_tournaments(current_user: User = Depends(get_current_user), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    """
    Fetch paginated bounds matching tournament properties correctly efficiently structurally elegantly natively safely securely.
    """
    skip = (page - 1) * limit
    data = await tournament_repository.get_all_tournaments(skip, limit)
    return success_response(data, "Tournaments retrieved successfully")

@router.post("/{id}/join")
async def register_for_tournament(id: str, current_user: User = Depends(get_current_user)) -> Any:
    """
    Securely lock explicit wallet debits tracking natively inside tournament registration organically.
    """
    data = await tournament_service.join_tournament(id, current_user.id)
    return success_response(data, "Successfully joined tournament")

@router.post("/{id}/start")
async def start_tournament_event(id: str, current_user: User = Depends(require_developer_role)) -> Any:
    """
    Trigger internal bracket generators mapping native states explicitly automatically dependently seamlessly.
    """
    data = await tournament_service.start_tournament(id)
    return success_response(data, "Tournament started successfully")

@router.get("/{id}/bracket")
async def fetch_tournament_bracket(id: str, current_user: User = Depends(get_current_user)) -> Any:
    """
    Retrieve specific active matches sequentially tracking round maps correctly smoothly elegantly successfully.
    """
    data = await tournament_service.get_bracket(id)
    return success_response(data, "Tournament bracket retrieved successfully")
