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
    Paginate and fetch all notifications for the current user ordered by newest first.
    """
    skip = (page - 1) * limit
    data = await notification_service.get_user_notifications(current_user.id, skip, limit)
    return success_response(data, "Notifications retrieved successfully")

@router.patch("/read-all")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)) -> Any:
    """
    Mark all unread notifications for the current user as read.
    """
    count = await notification_service.mark_all_read(current_user.id)
    return success_response({"updated": count}, "All notifications marked as read")

@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user)) -> Any:
    """
    Mark a single notification as read by its ID.
    """
    data = await notification_service.mark_read(notification_id, current_user.id)
    return success_response(data, "Notification marked as read")
