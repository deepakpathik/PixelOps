from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.admin import FraudResolveRequest
from app.services import fraud_service
from app.api.deps import require_developer_role
from prisma.models import User

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/fraud-flags")
async def fetch_fraud_flags(current_user: User = Depends(require_developer_role)) -> Any:
    return await fraud_service.get_pending_flags()

@router.post("/fraud-flags/{id}/resolve")
async def resolve_fraud_flag(id: str, payload: FraudResolveRequest, current_user: User = Depends(require_developer_role)) -> Any:
    return await fraud_service.resolve_flag(id, payload.action)
