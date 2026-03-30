from app.repositories import notification_repository
from prisma.models import Notification
from typing import List

async def send_notification(user_id: str, message: str) -> Notification:
    return await notification_repository.create_notification(user_id, message)

async def get_user_notifications(user_id: str) -> List[Notification]:
    return await notification_repository.get_notifications(user_id)
