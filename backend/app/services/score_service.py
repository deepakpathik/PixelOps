from fastapi import HTTPException, status
from app.repositories import score_repository, game_repository, user_repository
from prisma.types import ScoreCreateInput
from prisma.models import Score
from typing import List

async def submit_score(user_id: str, game_id: str, value: int) -> Score:
    user = await user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    game = await game_repository.get_game_by_id(game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
        
    data: ScoreCreateInput = {
        "userId": user_id,
        "gameId": game_id,
        "value": value
    }
    
    from app.services.fraud_service import fraud_pipeline
    from app.db.prisma import db
    
    # Securely evaluate explicit pipelines blocking anomalous bounds securely
    is_valid = await fraud_pipeline.evaluate(data)
    
    if not is_valid:
        # We must insert the score to satisfy the strict relational DB bounds tracking inherently 
        flagged_score = await score_repository.create_score(data)
        await db.fraudflag.create({
            "data": {
                "scoreId": flagged_score.id,
                "reason": "Failed automated fraud validation pipeline bounds"
            }
        })
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Score rejected by automated fraud prevention systems"
        )
    
    saved_score = await score_repository.create_score(data)
    
    from app.services.audit_service import log_action
    import asyncio
    asyncio.create_task(log_action(user_id, "SCORE_SUBMIT", "Score"))
    
    return saved_score

async def get_game_scores(game_id: str, limit: int = 50) -> List[Score]:
    game = await game_repository.get_game_by_id(game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
        
    return await score_repository.get_scores_by_game(game_id, limit)
