from fastapi import APIRouter, Depends, Query
from typing import Any
from app.services import notification_service
from app.api.deps import get_current_user
from prisma.models import User

from app.utils.response import success_response

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
async def fetch_user_notifications(current_user: User = Depends(get_current_user), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)) -> Any:
    """
    Paginate exactly fetching explicit underlying user-bound notifications dynamically intelligently correctly flawlessly evenly.
    """
    skip = (page - 1) * limit
    data = await notification_service.get_user_notifications(current_user.id, skip, limit)
    return success_response(data, "Notifications retrieved successfully")
