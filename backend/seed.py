"""
PixelOps Demo Data Seeder
Run with: python seed.py
Creates a full set of demo data so the website looks visually complete.
"""

import asyncio
from passlib.context import CryptContext
from prisma import Prisma
from datetime import datetime, timedelta
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hp(password: str) -> str:
    return pwd_context.hash(password)

GAMES = [
    {"title": "Neon Dash",       "description": "High-speed infinite runner through a neon-lit cybercity. Dodge obstacles and rack up combos.", "format": "HTML5"},
    {"title": "Pixel Warriors",  "description": "1v1 fighting game with 8 unique pixel-art characters. Master combos to dominate the arena.", "format": "WEBGL"},
    {"title": "Space Invaders X","description": "Classic space shooter reimagined with modern bullet-hell mechanics and boss raids.", "format": "HTML5"},
    {"title": "Grid Breaker",    "description": "Strategic puzzle game where you break blocks before the grid fills. Think fast.", "format": "HTML5"},
    {"title": "Drift Zone",      "description": "Top-down racing game with drift mechanics. Earn coins for perfect corners.", "format": "WEBGL"},
    {"title": "Shadow Realm",    "description": "Dark fantasy platformer with procedurally generated dungeons and permadeath.", "format": "IFRAME"},
]

PLAYERS = [
    {"username": "NeonByte",    "email": "neon@pixelops.io"},
    {"username": "GridHunter",  "email": "grid@pixelops.io"},
    {"username": "VoxelKing",   "email": "voxel@pixelops.io"},
    {"username": "CyberPulse",  "email": "cyber@pixelops.io"},
    {"username": "PhantomAce",  "email": "phantom@pixelops.io"},
    {"username": "StarForge",   "email": "star@pixelops.io"},
]

PASSWORD = "PixelOps@2026"


async def main():
    db = Prisma()
    await db.connect()

    print("🌱 Seeding PixelOps demo data...\n")

    # ── Admin ──────────────────────────────────────────────────────────────────
    admin = await db.user.find_first(where={"email": "admin@pixelops.io"})
    if not admin:
        admin = await db.user.create(data={
            "email": "admin@pixelops.io",
            "username": "PixelOpsAdmin",
            "password": hp(PASSWORD),
            "role": "ADMIN",
            "isActive": True,
        })
        print(f"✅ Admin created: admin@pixelops.io / {PASSWORD}")
    else:
        print(f"♻️  Admin already exists")

    # ── Players ───────────────────────────────────────────────────────────────
    players = []
    for p in PLAYERS:
        existing = await db.user.find_first(where={"email": p["email"]})
        if not existing:
            user = await db.user.create(data={
                "email": p["email"],
                "username": p["username"],
                "password": hp(PASSWORD),
                "role": "PLAYER",
                "isActive": True,
            })
            players.append(user)
            print(f"✅ Player: {p['username']} ({p['email']})")
        else:
            players.append(existing)
            print(f"♻️  Player already exists: {p['username']}")

    # ── Games ──────────────────────────────────────────────────────────────────
    games = []
    for g in GAMES:
        existing = await db.game.find_first(where={"title": g["title"]})
        if not existing:
            game = await db.game.create(data={
                "title": g["title"],
                "description": g["description"],
                "format": g["format"],
                "developerId": admin.id,
                "isActive": True,
            })
            games.append(game)
            print(f"✅ Game: {g['title']} ({g['format']})")
        else:
            games.append(existing)
            print(f"♻️  Game already exists: {g['title']}")

    # ── Wallets ───────────────────────────────────────────────────────────────
    all_users = [admin] + players
    wallets = {}
    balances = [12500, 8750, 6200, 4800, 3100, 2400, 1800]
    for i, user in enumerate(all_users):
        existing = await db.wallet.find_first(where={"userId": user.id})
        if not existing:
            wallet = await db.wallet.create(data={
                "userId": user.id,
                "balance": balances[i] if i < len(balances) else 500.0,
            })
            wallets[user.id] = wallet
        else:
            wallets[user.id] = existing

    print(f"✅ Wallets created/verified for all users")

    # ── Transactions ──────────────────────────────────────────────────────────
    tx_templates = [
        ("REWARD", 500.0),
        ("CREDIT", 1000.0),
        ("ENTRY_FEE", -100.0),
        ("REWARD", 250.0),
        ("DEBIT", -50.0),
        ("REFUND", 100.0),
    ]
    for player in players[:4]:
        wallet = wallets.get(player.id)
        if wallet:
            for tx_type, amount in tx_templates[:4]:
                existing = await db.transaction.find_first(
                    where={"walletId": wallet.id, "type": tx_type}
                )
                if not existing:
                    await db.transaction.create(data={
                        "walletId": wallet.id,
                        "type": tx_type,
                        "amount": abs(amount),
                    })

    print("✅ Transactions seeded")

    # ── Scores ────────────────────────────────────────────────────────────────
    score_data = [
        (0, 0, 98500), (1, 0, 87200), (2, 0, 76400), (3, 0, 65100), (4, 0, 54700), (5, 0, 43200),
        (0, 1, 45000), (1, 1, 52000), (2, 1, 39000), (3, 1, 61000), (4, 1, 28000),
        (0, 2, 120000),(1, 2, 98000), (2, 2, 75000), (5, 2, 45000),
        (0, 3, 8800),  (1, 3, 7200),  (2, 3, 9100),  (3, 3, 6500),
        (0, 4, 33000), (3, 4, 41000), (4, 4, 27000), (5, 4, 36000),
        (1, 5, 15500), (2, 5, 12000), (4, 5, 9800),
    ]
    score_ids = []
    for p_idx, g_idx, value in score_data:
        if p_idx < len(players) and g_idx < len(games):
            s = await db.score.create(data={
                "userId": players[p_idx].id,
                "gameId": games[g_idx].id,
                "value": value,
            })
            score_ids.append(s.id)

    print(f"✅ {len(score_ids)} scores seeded")

    # ── Fraud Flags ───────────────────────────────────────────────────────────
    if score_ids:
        flag_data = [
            (score_ids[0], "Score spike: 3× average in under 60 seconds", "PENDING"),
            (score_ids[1], "Rate limit exceeded: 8 submissions in 1 minute", "PENDING"),
            (score_ids[2], "Score exceeds theoretical maximum for this game", "CONFIRMED"),
            (score_ids[4], "Suspicious pattern: identical scores submitted twice", "REJECTED"),
        ]
        for score_id, reason, status in flag_data:
            existing = await db.fraudflag.find_first(where={"scoreId": score_id})
            if not existing:
                await db.fraudflag.create(data={
                    "scoreId": score_id,
                    "reason": reason,
                    "status": status,
                })

    print("✅ Fraud flags seeded")

    # ── Tournaments ───────────────────────────────────────────────────────────
    now = datetime.utcnow()
    tournament_data = [
        {
            "name": "Neon Dash World Cup — Season 1",
            "gameIdx": 0,
            "status": "ONGOING",
            "entryFee": 100.0,
            "startDate": now - timedelta(days=2),
            "endDate": now + timedelta(days=5),
        },
        {
            "name": "Pixel Warriors Open Championship",
            "gameIdx": 1,
            "status": "OPEN",
            "entryFee": 50.0,
            "startDate": now + timedelta(days=2),
            "endDate": now + timedelta(days=9),
        },
        {
            "name": "Space Invaders Blitz Cup",
            "gameIdx": 2,
            "status": "OPEN",
            "entryFee": 75.0,
            "startDate": now + timedelta(days=3),
            "endDate": now + timedelta(days=10),
        },
        {
            "name": "Grid Breaker Championship 2026",
            "gameIdx": 3,
            "status": "COMPLETED",
            "entryFee": 200.0,
            "startDate": now - timedelta(days=14),
            "endDate": now - timedelta(days=7),
        },
        {
            "name": "Shadow Realm Invitational",
            "gameIdx": 5,
            "status": "CREATED",
            "entryFee": 150.0,
            "startDate": now + timedelta(days=10),
            "endDate": now + timedelta(days=17),
        },
        {
            "name": "Drift Zone Grand Prix",
            "gameIdx": 4,
            "status": "OPEN",
            "entryFee": 120.0,
            "startDate": now + timedelta(days=1),
            "endDate": now + timedelta(days=8),
        },
    ]

    tournaments = []
    for td in tournament_data:
        existing = await db.tournament.find_first(where={"name": td["name"]})
        if not existing:
            t = await db.tournament.create(data={
                "name": td["name"],
                "gameId": games[td["gameIdx"]].id,
                "status": td["status"],
                "entryFee": td["entryFee"],
                "startDate": td["startDate"],
                "endDate": td["endDate"],
            })
            tournaments.append(t)
            print(f"✅ Tournament: {td['name']} ({td['status']})")

            # Add participants to open/ongoing tournaments
            participants = players if td["status"] in ("OPEN", "ONGOING") else players[:2]
            for player in participants:
                try:
                    await db.tournamentparticipant.create(data={
                        "tournamentId": t.id,
                        "userId": player.id,
                    })
                except Exception:
                    pass  # skip duplicate
        else:
            tournaments.append(existing)
            print(f"♻️  Tournament exists: {td['name']}")


    # ── Matches for ONGOING tournament ────────────────────────────────────────
    if tournaments and players and len(players) >= 4:
        ongoing = next((t for t in tournaments if t.status == "ONGOING"), None)
        if ongoing:
            match_data = [
                # Quarter-Finals (Round 1)
                (players[0].id, players[5].id, players[0].id, 1),
                (players[1].id, players[4].id, players[1].id, 1),
                (players[2].id, players[3].id, players[2].id, 1),
                (players[3].id, players[5].id, players[3].id, 1),
                # Semi-Finals (Round 2)
                (players[0].id, players[2].id, players[0].id, 2),
                (players[1].id, players[3].id, players[1].id, 2),
                # Finals (Round 3) — still in progress
                (players[0].id, players[1].id, None, 3),
            ]
            for p1, p2, winner, rnd in match_data:
                existing = await db.match.find_first(
                    where={"tournamentId": ongoing.id, "round": rnd, "player1Id": p1}
                )
                if not existing:
                    await db.match.create(data={
                        "tournamentId": ongoing.id,
                        "round": rnd,
                        "player1Id": p1,
                        "player2Id": p2,
                        "winnerId": winner,
                    })
            print("✅ Bracket matches seeded (QF + SF + Finals) for ongoing tournament")

    # ── Notifications ─────────────────────────────────────────────────────────
    notif_data = [
        # NeonByte (players[0])
        (players[0].id, "🏆 You climbed to Rank #1 on Neon Dash!"),
        (players[0].id, "⚡ Score submission accepted — 98,500 pts recorded"),
        (players[0].id, "🎯 Tournament 'Neon Dash World Cup — Season 1' is now LIVE!"),
        (players[0].id, "💰 Reward of 500 coins credited to your wallet"),
        (players[0].id, "🥊 You advanced to the Semi-Finals! Next match loading..."),
        # GridHunter (players[1])
        (players[1].id, "🏆 You reached Rank #2 on Pixel Warriors!"),
        (players[1].id, "🎮 'Pixel Warriors Open Championship' is now open — join now!"),
        (players[1].id, "💰 Entry fee of 50 coins deducted for Pixel Warriors Open"),
        (players[1].id, "⚡ Score of 52,000 submitted on Pixel Warriors"),
        # VoxelKing (players[2])
        (players[2].id, "🎯 New tournament 'Space Invaders Blitz Cup' — you're registered!"),
        (players[2].id, "💰 Wallet credited 250 coins from game reward"),
        # CyberPulse (players[3])
        (players[3].id, "🎮 'Drift Zone Grand Prix' starts tomorrow — are you ready?"),
        (players[3].id, "🏆 Score of 61,000 is your personal best on Pixel Warriors!"),
        # Admin
        (admin.id, "🚨 2 new fraud flags require your review"),
        (admin.id, "✅ System check complete — all services nominal"),
        (admin.id, "📊 6 players registered across 4 active tournaments"),
        (admin.id, "🎯 'Neon Dash World Cup — Season 1' quarter-finals completed"),
    ]
    for user_id, message in notif_data:
        await db.notification.create(data={
            "userId": user_id,
            "message": message,
            "isRead": False,
        })

    print("✅ Notifications seeded")


    await db.disconnect()

    print("\n" + "="*60)
    print("🎮 PIXELOPS DEMO DATA SEEDED SUCCESSFULLY")
    print("="*60)
    print(f"\n🔑 ADMIN CREDENTIALS:")
    print(f"   Email    : admin@pixelops.io")
    print(f"   Password : {PASSWORD}")
    print(f"\n👤 DEMO PLAYER CREDENTIALS (all same password):")
    for p in PLAYERS:
        print(f"   {p['username']:12s} → {p['email']}")
    print(f"   Password : {PASSWORD}")
    print("\n🌐 URLs:")
    print("   Frontend  →  http://localhost:5174")
    print("   Backend   →  http://localhost:8000")
    print("   API Docs  →  http://localhost:8000/docs")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
