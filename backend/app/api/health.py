from fastapi import APIRouter
from app.utils.response import success_response

router = APIRouter()

@router.get("/health")
def health_check():
    return success_response({"status": "ok"}, "Service is healthy")
