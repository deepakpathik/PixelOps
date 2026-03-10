from fastapi import APIRouter
from app.schemas.user import UserCreate, UserLogin
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    return await auth_service.register_user(
        {"email": user.email, "username": user.username, "password": user.password}
    )

@router.post("/login")
async def login(user: UserLogin):
    return await auth_service.login_user(user.email, user.password)
