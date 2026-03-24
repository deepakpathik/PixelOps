from fastapi import HTTPException
from typing import List
from prisma.models import Tournament, TournamentParticipant, Match
from prisma.types import TournamentCreateInput
from app.repositories import tournament_repository, game_repository
from app.services import wallet_service

async def create_tournament(data: TournamentCreateInput) -> Tournament:
    game = await game_repository.get_game_by_id(data["gameId"])
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return await tournament_repository.create_tournament(data)

async def join_tournament(tournament_id: str, user_id: str) -> TournamentParticipant:
    tournament = await tournament_repository.get_tournament(tournament_id)
    
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    if tournament.status != "CREATED" and tournament.status != "OPEN":
        raise HTTPException(status_code=400, detail="Tournament is not open for registration")
        
    if tournament.entryFee > 0:
        await wallet_service.debit_user(user_id, tournament.entryFee, "TOURNAMENT_ENTRY")
        
    return await tournament_repository.add_participant({
        "tournamentId": tournament_id,
        "userId": user_id
    })

async def generate_bracket(tournament_id: str) -> List[Match]:
    participants = await tournament_repository.get_participants(tournament_id)
    matches = []
    
    for i in range(0, len(participants) - 1, 2):
        p1 = participants[i]
        p2 = participants[i + 1]
        
        match = await tournament_repository.create_match({
            "tournamentId": tournament_id,
            "round": 1,
            "player1Id": p1.userId,
            "player2Id": p2.userId
        })
        matches.append(match)
        
    return matches

async def start_tournament(tournament_id: str) -> List[Match]:
    tournament = await tournament_repository.get_tournament(tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
        
    matches = await generate_bracket(tournament_id)
    await tournament_repository.update_status(tournament_id, "ONGOING")
    
    return matches

async def get_bracket(tournament_id: str) -> List[Match]:
    return await tournament_repository.get_matches(tournament_id)
