# ER Diagram — PixelOps

## Overview

This Entity-Relationship diagram defines the database schema for the PixelOps platform.

The schema supports:

- Modular game hosting
- Leaderboard management
- Tournament orchestration
- Wallet & transaction ledger
- Achievement tracking
- Fraud detection
- Notification system
- Audit logging

---

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        enum role "PLAYER | DEVELOPER | MODERATOR | ADMIN"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    GAMES {
        uuid id PK
        varchar title
        text description
        enum format "HTML5 | WEBGL | IFRAME"
        uuid developer_id FK
        boolean is_active
        timestamp created_at
    }

    GAME_VERSIONS {
        uuid id PK
        uuid game_id FK
        varchar version_number
        varchar file_path
        timestamp created_at
    }

    SCORES {
        uuid id PK
        uuid user_id FK
        uuid game_id FK
        integer score_value
        boolean is_flagged
        timestamp created_at
    }

    LEADERBOARDS {
        uuid id PK
        uuid game_id FK
        varchar season
        integer top_score
        timestamp updated_at
    }

    TOURNAMENTS {
        uuid id PK
        varchar name
        uuid game_id FK
        enum status "CREATED | OPEN | ONGOING | COMPLETED | ARCHIVED"
        decimal entry_fee
        timestamp start_date
        timestamp end_date
        timestamp created_at
    }

    TOURNAMENT_PARTICIPANTS {
        uuid id PK
        uuid tournament_id FK
        uuid user_id FK
        timestamp joined_at
    }

    MATCHES {
        uuid id PK
        uuid tournament_id FK
        integer round_number
        uuid player1_id FK
        uuid player2_id FK
        uuid winner_id FK
        timestamp played_at
    }

    ACHIEVEMENTS {
        uuid id PK
        varchar name
        varchar criteria_type
        integer criteria_value
        timestamp created_at
    }

    USER_ACHIEVEMENTS {
        uuid id PK
        uuid user_id FK
        uuid achievement_id FK
        timestamp unlocked_at
    }

    WALLETS {
        uuid id PK
        uuid user_id FK, UK
        decimal balance
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        enum type "CREDIT | DEBIT | REWARD | ENTRY_FEE | REFUND"
        decimal amount
        uuid reference_id
        timestamp created_at
    }

    FRAUD_FLAGS {
        uuid id PK
        uuid score_id FK
        varchar reason
        enum status "PENDING | REVIEWED | CONFIRMED | REJECTED"
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar type
        text message
        boolean is_read
        timestamp created_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        timestamp created_at
    }

    PLATFORM_CONFIG {
        uuid id PK
        varchar config_key UK
        varchar config_value
        timestamp updated_at
    }

    %% Relationships

    USERS ||--o{ GAMES : "develops"
    USERS ||--o{ SCORES : "submits"
    USERS ||--o{ TOURNAMENT_PARTICIPANTS : "joins"
    USERS ||--o{ USER_ACHIEVEMENTS : "earns"
    USERS ||--o| WALLETS : "has"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "generates"

    GAMES ||--o{ GAME_VERSIONS : "has"
    GAMES ||--o{ SCORES : "records"
    GAMES ||--o{ TOURNAMENTS : "hosts"
    GAMES ||--o{ LEADERBOARDS : "maintains"

    TOURNAMENTS ||--o{ TOURNAMENT_PARTICIPANTS : "includes"
    TOURNAMENTS ||--o{ MATCHES : "contains"

    WALLETS ||--o{ TRANSACTIONS : "records"

    SCORES ||--o{ FRAUD_FLAGS : "flags"

    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : "unlocked by"
```

---

## Table Summary

| Table | Description |
|-------|------------|
| USERS | All platform users |
| GAMES | Game metadata |
| GAME_VERSIONS | Game version control |
| SCORES | Player score submissions |
| LEADERBOARDS | Ranking data |
| TOURNAMENTS | Tournament records |
| MATCHES | Tournament matches |
| WALLETS | Virtual currency |
| TRANSACTIONS | Wallet ledger |
| FRAUD_FLAGS | Suspicious score tracking |
| NOTIFICATIONS | User alerts |
| AUDIT_LOGS | System activity tracking |
