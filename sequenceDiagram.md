# Sequence Diagram — PixelOps

## Main Flow: Player Plays Game → Score Submission → Fraud Validation → Leaderboard Update → XP Calculation → Wallet Reward → Notification

This sequence diagram illustrates the complete lifecycle of a gameplay event in PixelOps.

The backend is implemented using FastAPI with a clean service-layer architecture.

---

```mermaid
sequenceDiagram
    actor Player
    participant FE as Frontend (React)
    participant API as FastAPI
    participant Auth as Auth Service
    participant ScoreSvc as Score Service
    participant FraudChain as Fraud Validation Chain
    participant LB as Leaderboard Service
    participant XP as XP Service
    participant Wallet as Wallet Service
    participant Notify as Notification Service
    participant DB as PostgreSQL
    participant Cache as Redis
    participant WS as WebSocket

    Note over Player,WS: Phase 1 — Game Completion & Score Submission

    Player ->> FE: Finish Game
    FE ->> API: POST /scores (game_id, score)
    API ->> Auth: Validate JWT
    Auth -->> API: Token Valid (userId)

    API ->> ScoreSvc: submitScore(userId, gameId, score)

    Note right of ScoreSvc: Clean Architecture<br/>Controller → Service Layer

    ScoreSvc ->> FraudChain: validate(score)

    Note right of FraudChain: Chain of Responsibility<br/>ScoreRangeValidator → RateLimitValidator

    FraudChain -->> ScoreSvc: Validation Passed

    ScoreSvc ->> DB: INSERT INTO scores
    DB -->> ScoreSvc: Score Stored

    Note over Player,WS: Phase 2 — Leaderboard Update

    ScoreSvc ->> LB: updateRanking(gameId)
    LB ->> Cache: GET leaderboard:gameId
    Cache -->> LB: Cached ranking
    LB ->> LB: Recalculate Top-N (Heap logic)
    LB ->> Cache: UPDATE leaderboard cache
    LB ->> DB: UPDATE leaderboard snapshot
    LB -->> ScoreSvc: Ranking Updated

    Note over Player,WS: Phase 3 — XP Calculation & Reward

    ScoreSvc ->> XP: calculateXP(score)
    XP -->> ScoreSvc: XP value

    ScoreSvc ->> Wallet: rewardUser(userId, xpReward)
    Wallet ->> DB: UPDATE wallet balance
    DB -->> Wallet: Balance Updated
    Wallet -->> ScoreSvc: Reward Credited

    Note over Player,WS: Phase 4 — Achievement Check

    ScoreSvc ->> XP: checkAchievements(userId, score)
    XP ->> DB: INSERT INTO user_achievements (if unlocked)
    XP -->> ScoreSvc: Achievement Status

    Note over Player,WS: Phase 5 — Notification & Real-Time Update

    ScoreSvc ->> Notify: sendScoreUpdate(userId, gameId)
    Notify ->> DB: INSERT INTO notifications
    Notify ->> WS: Emit leaderboard update
    WS -->> FE: Real-time leaderboard refresh
    WS -->> FE: Achievement unlocked notification

    API -->> FE: 200 OK (Score processed)
    FE -->> Player: Show updated rank, XP, rewards
```

---

## Flow Summary

| Phase | Description | Key Concepts |
|-------|------------|--------------|
| 1. Score Submission | Player submits score, JWT validated | Authentication, Clean Architecture |
| 2. Fraud Validation | Score validated via chained validators | Chain of Responsibility |
| 3. Leaderboard Update | Ranking recalculated & cached | Heap Algorithm, Redis Cache |
| 4. XP & Rewards | XP calculated and wallet credited | Strategy, Transaction Handling |
| 5. Notification | Real-time update via WebSocket | Observer Pattern |

---

## Design Patterns Represented

- Chain of Responsibility → Fraud validation
- Strategy → XP calculation
- Observer → Notification broadcasting
- Repository Pattern → DB access abstraction
- Clean Architecture → Controller → Service → Repository separation

