from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class BaseValidator(ABC):
    def __init__(self) -> None:
        self.next_validator: Optional['BaseValidator'] = None

    def set_next(self, validator: 'BaseValidator') -> 'BaseValidator':
        self.next_validator = validator
        return validator

    @abstractmethod
    async def validate(self, score_data: Dict[str, Any]) -> bool:
        if self.next_validator:
            return await self.next_validator.validate(score_data)
        return True

class ScoreLimitValidator(BaseValidator):
    def __init__(self, max_score: int = 999999) -> None:
        super().__init__()
        self.max_score = max_score

    async def validate(self, score_data: Dict[str, Any]) -> bool:
        if score_data.get("value", 0) > self.max_score:
            return False
            
        if self.next_validator:
            return await self.next_validator.validate(score_data)
        return True

class RateLimitValidator(BaseValidator):
    async def validate(self, score_data: Dict[str, Any]) -> bool:
        # Placeholder for complex DB temporal velocity checking natively across Prisma bounds
        if not score_data.get("userId"):
            return False
            
        if self.next_validator:
            return await self.next_validator.validate(score_data)
        return True

class FraudValidationPipeline:
    def __init__(self) -> None:
        self.chain_head = ScoreLimitValidator()
        self.chain_head.set_next(RateLimitValidator())

    async def evaluate(self, score_data: Dict[str, Any]) -> bool:
        # Returns True if valid, False if flagged securely as anomalous
        return await self.chain_head.validate(score_data)

fraud_pipeline = FraudValidationPipeline()

async def get_pending_flags() -> Any:
    from app.db.prisma import db
    return await db.fraudflag.find_many(
        where={"status": "PENDING"},
        include={"score": True}
    )

async def resolve_flag(flag_id: str, action: str) -> Any:
    from app.db.prisma import db
    from fastapi import HTTPException
    flag = await db.fraudflag.find_unique(where={"id": flag_id})
    if not flag:
        raise HTTPException(status_code=404, detail="Fraud flag not found")
        
    return await db.fraudflag.update(
        where={"id": flag_id},
        data={"status": action}
    )
