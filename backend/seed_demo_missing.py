import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()

    # Get all users
    users = await db.user.find_many()
    
    for user in users:
        # Ensure wallet exists
        wallet = await db.wallet.find_unique(where={"userId": user.id})
        if not wallet:
            wallet = await db.wallet.create(data={"userId": user.id, "balance": 1000})

        # Check existing transactions
        txs = await db.transaction.find_many(where={"walletId": wallet.id})
        if len(txs) < 3:
            # Create dummy transactions
            await db.transaction.create(data={"walletId": wallet.id, "type": "CREDIT", "amount": 1000.0})
            await db.transaction.create(data={"walletId": wallet.id, "type": "ENTRY_FEE", "amount": -50.0})
            await db.transaction.create(data={"walletId": wallet.id, "type": "REWARD", "amount": 250.0})
            print(f"Added demo transactions for {user.username}")

        # Check existing notifications
        notifs = await db.notification.find_many(where={"userId": user.id})
        if len(notifs) < 3:
            await db.notification.create(data={"userId": user.id, "message": "🏆 'Neon Dash World Cup' completed!", "isRead": False})
            await db.notification.create(data={"userId": user.id, "message": "🚀 Welcome to the new Arcade UI!", "isRead": False})
            print(f"Added demo notifications for {user.username}")
            
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
