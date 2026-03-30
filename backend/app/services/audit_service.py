from app.db.prisma import db

async def log_action(user_id: str, action: str, entity: str) -> None:
    try:
        await db.auditlog.create({
            "userId": user_id,
            "action": action,
            "entity": entity
        })
    except Exception as e:
        # Prevent audit logs from failing the primary transaction cleanly
        pass
