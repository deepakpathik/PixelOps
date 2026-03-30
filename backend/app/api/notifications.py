from fastapi import APIRouter, Depends
from typing import Any
from app.services import notification_service
from app.api.deps import get_current_user
from prisma.models import User

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
async def fetch_user_notifications(current_user: User = Depends(get_current_user)) -> Any:
    return await notification_service.get_user_notifications(current_user.id)
