from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.admin import FraudResolveRequest
from app.services import fraud_service
from app.api.deps import require_developer_role
from prisma.models import User

from app.utils.response import success_response

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/fraud-flags")
async def fetch_fraud_flags(current_user: User = Depends(require_developer_role)) -> Any:
    data = await fraud_service.get_pending_flags()
    return success_response(data, "Fraud flags retrieved successfully")

@router.post("/fraud-flags/{id}/resolve")
async def resolve_fraud_flag(id: str, payload: FraudResolveRequest, current_user: User = Depends(require_developer_role)) -> Any:
    data = await fraud_service.resolve_flag(id, payload.action)
    return success_response(data, "Fraud flag resolved successfully")
