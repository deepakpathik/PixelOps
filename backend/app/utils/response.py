from typing import Any, Optional, Dict
from fastapi.responses import JSONResponse

def success_response(data: Any = None, message: Optional[str] = None) -> Dict[str, Any]:
    response = {
        "success": True,
        "data": data,
    }
    if message:
        response["message"] = message
    return response

def error_response(message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None
        }
    )
