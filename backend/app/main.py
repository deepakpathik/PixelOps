from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.games import router as games_router
from app.api.scores import router as scores_router
from app.api.leaderboard import router as leaderboard_router
from app.api.wallet import router as wallet_router
from app.api.tournaments import router as tournament_router
from app.api.admin import router as admin_router
from app.db.prisma import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(
    title="PixelOps API",
    description="Backend for the PixelOps arcade gaming platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(games_router)
app.include_router(scores_router)
app.include_router(leaderboard_router)
app.include_router(wallet_router)
app.include_router(tournament_router)
app.include_router(admin_router)
