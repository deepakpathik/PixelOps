from typing import Optional
from prisma.models import User
from app.db.prisma import db
from prisma.types import UserCreateInput

async def create_user(data: UserCreateInput) -> User:
    return await db.user.create(data=data)

async def get_user_by_email(email: str) -> Optional[User]:
    return await db.user.find_unique(where={"email": email})

async def get_user_by_id(user_id: str) -> Optional[User]:
    return await db.user.find_unique(where={"id": user_id})
