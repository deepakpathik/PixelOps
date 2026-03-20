from prisma.models import Wallet, Transaction
from prisma.types import WalletCreateInput, TransactionCreateInput
from typing import Optional, List
from app.db.prisma import db

async def get_wallet_by_user(user_id: str) -> Optional[Wallet]:
    return await db.wallet.find_unique(where={"userId": user_id})

async def create_wallet(user_id: str) -> Wallet:
    return await db.wallet.create(data={"userId": user_id, "balance": 0.0})

async def update_balance(wallet_id: str, new_balance: float) -> Wallet:
    return await db.wallet.update(where={"id": wallet_id}, data={"balance": new_balance})

async def create_transaction(data: TransactionCreateInput) -> Transaction:
    return await db.transaction.create(data=data)

async def get_transactions(wallet_id: str, limit: int = 50) -> List[Transaction]:
    return await db.transaction.find_many(
        where={"walletId": wallet_id},
        order={"createdAt": "desc"},
        take=limit
    )
