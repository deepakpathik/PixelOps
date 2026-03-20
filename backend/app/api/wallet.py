from fastapi import APIRouter, Depends
from typing import Any
from app.services import wallet_service
from app.api.deps import get_current_user
from prisma.models import User

router = APIRouter(tags=["wallet"])

@router.get("/wallet")
async def get_wallet(current_user: User = Depends(get_current_user)) -> Any:
    return await wallet_service.get_balance(current_user.id)

@router.get("/transactions")
async def get_transactions(current_user: User = Depends(get_current_user)) -> Any:
    return await wallet_service.get_user_transactions(current_user.id)
