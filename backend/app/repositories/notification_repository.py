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

async def get_notifications(user_id: str, limit: int = 20) -> List[Notification]:
    return await db.notification.find_many(
        where={"userId": user_id},
        order={"createdAt": "desc"},
        take=limit
    )
