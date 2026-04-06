from fastapi import APIRouter
from app.schemas.user import UserCreate, UserLogin
from app.services import auth_service
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    """
    Register a new user account seamlessly handling implicit password hashes tracking bounds natively.
    """
    data = await auth_service.register_user(
        {"email": user.email, "username": user.username, "password": user.password}
    )
    return success_response(data, "User registered successfully")

@router.post("/login")
async def login(user: UserLogin):
    """
    Authenticate a user returning a signed JWT access token tracking implicit logging securely seamlessly properly natively.
    """
    data = await auth_service.login_user(user.email, user.password)
    return success_response(data, "Login successful")
