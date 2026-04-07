from prisma.models import Notification
from typing import List
from app.db.prisma import db

async def create_notification(user_id: str, message: str) -> Notification:
    return await db.notification.create(
        data={
            "userId": user_id,
            "message": message
        }
    )

async def get_notifications(user_id: str, skip: int = 0, limit: int = 20) -> List[Notification]:
    return await db.notification.find_many(
        where={"userId": user_id},
        order={"createdAt": "desc"},
        skip=skip,
        take=limit
    )

async def mark_read(notification_id: str, user_id: str) -> Notification:
    return await db.notification.update(
        where={"id": notification_id},
        data={"isRead": True}
    )

async def mark_all_read(user_id: str) -> int:
    result = await db.notification.update_many(
        where={"userId": user_id, "isRead": False},
        data={"isRead": True}
    )
    return result
