from prisma.models import Tournament, TournamentParticipant, Match
from prisma.types import TournamentCreateInput, TournamentParticipantCreateInput, MatchCreateInput
from typing import Optional, List
from app.db.prisma import db

async def create_tournament(data: TournamentCreateInput) -> Tournament:
    return await db.tournament.create(data=data)

async def get_tournament(tournament_id: str) -> Optional[Tournament]:
    return await db.tournament.find_unique(
        where={"id": tournament_id},
        include={"participants": True, "matches": True, "game": True}
    )

async def add_participant(data: TournamentParticipantCreateInput) -> TournamentParticipant:
    return await db.tournamentparticipant.create(data=data)

async def get_participants(tournament_id: str) -> List[TournamentParticipant]:
    return await db.tournamentparticipant.find_many(
        where={"tournamentId": tournament_id},
        include={"user": True}
    )

async def create_match(data: MatchCreateInput) -> Match:
    return await db.match.create(data=data)

async def get_matches(tournament_id: str) -> List[Match]:
    return await db.match.find_many(
        where={"tournamentId": tournament_id},
        order={"round": "asc"}
    )
