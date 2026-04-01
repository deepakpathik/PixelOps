from fastapi import HTTPException, status
from app.repositories import wallet_repository
from prisma.models import Wallet, Transaction
from typing import List

async def _get_or_create_wallet(user_id: str) -> Wallet:
    wallet = await wallet_repository.get_wallet_by_user(user_id)
    if not wallet:
        wallet = await wallet_repository.create_wallet(user_id)
    return wallet

async def get_balance(user_id: str) -> Wallet:
    return await _get_or_create_wallet(user_id)

async def credit_user(user_id: str, amount: float, tx_type: str = "CREDIT") -> Transaction:
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    wallet = await _get_or_create_wallet(user_id)
    new_balance = wallet.balance + amount
    await wallet_repository.update_balance(wallet.id, new_balance)
    
    return await wallet_repository.create_transaction({
        "walletId": wallet.id,
        "type": tx_type,
        "amount": amount
    })

async def debit_user(user_id: str, amount: float, tx_type: str = "DEBIT") -> Transaction:
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
        
    wallet = await _get_or_create_wallet(user_id)
    if wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
        
    new_balance = wallet.balance - amount
    await wallet_repository.update_balance(wallet.id, new_balance)
    
    return await wallet_repository.create_transaction({
        "walletId": wallet.id,
        "type": tx_type,
        "amount": amount
    })

async def get_user_transactions(user_id: str, skip: int = 0, limit: int = 10) -> List[Transaction]:
    wallet = await _get_or_create_wallet(user_id)
    return await wallet_repository.get_transactions(wallet.id, skip, limit)
