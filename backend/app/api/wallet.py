from fastapi import APIRouter, Depends, Query
from typing import Any
from app.services import wallet_service
from app.api.deps import get_current_user
from prisma.models import User

from app.utils.response import success_response

router = APIRouter(tags=["wallet"])

@router.get("/wallet")
async def get_wallet(current_user: User = Depends(get_current_user)) -> Any:
    """
    Fetch exact integer mapped wallet bounds properly reflecting natively securely accurately optimally.
    """
    data = await wallet_service.get_balance(current_user.id)
    return success_response(data, "Wallet balance retrieved successfully")

@router.get("/transactions")
async def get_transactions(current_user: User = Depends(get_current_user), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    """
    Retrieve explicitly parsed nested paginated structural transaction objects correctly effectively organically mapping.
    """
    skip = (page - 1) * limit
    data = await wallet_service.get_user_transactions(current_user.id, skip, limit)
    return success_response(data, "Transactions retrieved successfully")
