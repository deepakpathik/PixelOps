from fastapi import HTTPException, status
from app.repositories import user_repository
from app.core import security
from prisma.types import UserCreateInput

async def register_user(data: UserCreateInput):
    existing_user = await user_repository.get_user_by_email(data["email"])
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    data["password"] = security.hash_password(data["password"])
    
    new_user = await user_repository.create_user(data)
    
    access_token = security.create_access_token(subject=new_user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

async def login_user(email: str, password: str):
    user = await user_repository.get_user_by_email(email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
        
    if not security.verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
        
    access_token = security.create_access_token(subject=user.id)
    
    from app.services.audit_service import log_action
    import asyncio
    asyncio.create_task(log_action(user.id, "LOGIN", "User"))
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
