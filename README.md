# PixelOps — Advanced Arcade Gaming Platform

> A full-stack modular arcade gaming platform with real-time leaderboards, tournament orchestration, virtual wallet economy, fraud detection, and an Xbox-inspired dark UI.

![Version](https://img.shields.io/badge/version-1.4-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-4169E1)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Flow](#api-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Design Patterns](#design-patterns)
- [Screenshots](#screenshots)

---

## Overview

**PixelOps** is a production-ready arcade gaming platform designed as a scalable backend-driven ecosystem for hosting, managing, and monetizing digital games. Unlike traditional arcade websites that only host games, PixelOps is architected as a structured backend system with a pluggable game engine, real-time leaderboard processing, tournament orchestration, wallet-based economy, and automated fraud detection.

The platform emphasizes **clean architecture**, **object-oriented design**, and **system design best practices** across both the Python backend and React frontend.

---

## Architecture

```mermaid
graph TB
    subgraph Client["Frontend — React + Vite"]
        UI[React UI]
        AuthCtx[Auth Context]
        API[API Client]
        GameEngine[Canvas Game Engine]
    end

    subgraph Server["Backend — FastAPI"]
        Router[API Router Layer]
        
        subgraph Services["Service Layer"]
            AuthSvc[Auth Service]
            ScoreSvc[Score Service]
            WalletSvc[Wallet Service]
            TournSvc[Tournament Service]
            FraudSvc[Fraud Pipeline]
            AuditSvc[Audit Service]
            NotifSvc[Notification Service]
        end
        
        subgraph Repos["Repository Layer"]
            UserRepo[User Repository]
            GameRepo[Game Repository]
            ScoreRepo[Score Repository]
            WalletRepo[Wallet Repository]
            TournRepo[Tournament Repository]
        end
    end

    subgraph Data["Data Layer"]
        DB[(PostgreSQL)]
        Prisma[Prisma ORM]
    end

    UI --> AuthCtx
    UI --> GameEngine
    AuthCtx --> API
    API -->|HTTP/REST| Router
    Router --> Services
    Services --> Repos
    Repos --> Prisma
    Prisma --> DB
    ScoreSvc --> FraudSvc
    ScoreSvc --> WalletSvc
    ScoreSvc --> AuditSvc

    style Client fill:#1a1a2e,stroke:#107C10,color:#fff
    style Server fill:#16213e,stroke:#107C10,color:#fff
    style Data fill:#0f3460,stroke:#107C10,color:#fff
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn |
| **ORM** | Prisma Client Python |
| **Database** | PostgreSQL (Neon serverless) |
| **Auth** | JWT (python-jose), bcrypt |
| **Game Engine** | HTML5 Canvas (custom mini-games) |
| **Deployment** | Render (backend), Vercel/Render (frontend) |

---

## Features

### 🎮 Playable Game Engine
- Three built-in HTML5 Canvas mini-games: **Target Clicker**, **Space Shooter**, **Block Dodger**
- Dynamic game-engine router that selects the correct engine based on game metadata
- Real-time score tracking with 60fps render loop using `useRef` for state

### 🏆 Real-Time Leaderboard
- Per-game score rankings with Daily / Weekly / All-Time tabs
- Trend indicators showing rank movement (+/- positions)
- Highlighted current-user row with "YOU" badge

### 💰 Virtual Wallet & Economy
- Automatic score-to-coins reward pipeline (1 coin per 10 game points)
- XP-to-Coins conversion module with live calculation
- Full transaction history with categorized entries (CREDIT, DEBIT, REWARD, ENTRY_FEE)
- Deposit / Withdraw UI controls

### ⚔️ Tournament System
- Tournament creation with entry fees and date ranges
- State machine: `CREATED → OPEN → ONGOING → COMPLETED → ARCHIVED`
- Bracket visualization with match rounds
- Participant registration with wallet debit

### 🛡️ Fraud Detection Pipeline
- Chain of Responsibility pattern for score validation
- Score range validator (max score bounds)
- Rate limit validator (velocity checking)
- Automatic flagging with `FraudFlag` records for review

### 👤 Authentication & RBAC
- JWT-based stateless authentication
- Role-based access: `PLAYER` and `ADMIN`
- Protected routes on both frontend and backend
- Guest mode with limited access

### 📊 Admin Dashboard
- System health metrics (API latency, uptime, active users)
- Real-time system logs terminal with color-coded severity
- Global activity feed with user actions
- Fraud flag management and user moderation

### 🔔 Notification System
- In-app notification bell with unread count
- Mark individual or all notifications as read
- Auto-generated notifications for score milestones and tournament updates

---

## Project Structure

```
PixelOps/
├── backend/
│   ├── app/
│   │   ├── api/              # Route handlers (controllers)
│   │   │   ├── auth.py       # Login, register, profile
│   │   │   ├── games.py      # Game CRUD
│   │   │   ├── scores.py     # Score submission
│   │   │   ├── leaderboard.py
│   │   │   ├── wallet.py     # Balance & transactions
│   │   │   ├── tournaments.py
│   │   │   ├── notifications.py
│   │   │   ├── admin.py      # Admin-only endpoints
│   │   │   └── deps.py       # Dependency injection (auth)
│   │   ├── services/         # Business logic layer
│   │   │   ├── auth_service.py
│   │   │   ├── score_service.py
│   │   │   ├── wallet_service.py
│   │   │   ├── fraud_service.py
│   │   │   └── audit_service.py
│   │   ├── repositories/     # Data access layer
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── core/             # Config, security, JWT utils
│   │   ├── db/               # Prisma client singleton
│   │   └── main.py           # FastAPI app entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema definition
│   ├── seed.py               # Demo data seeder
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # Route-level components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── Tournaments.tsx
│   │   │   ├── Wallet.tsx
│   │   │   └── Admin.tsx
│   │   ├── components/
│   │   │   ├── PlayableGameModal.tsx
│   │   │   └── games/        # Canvas game engines
│   │   │       ├── TargetClicker.tsx
│   │   │       ├── SpaceShooter.tsx
│   │   │       └── BlockDodger.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts        # Centralized API client
│   │   └── routes.tsx
│   ├── public/images/games/  # Game card artwork
│   └── vite.config.ts
│
├── render.yaml               # Render deployment config
├── ErDiagram.md
├── classDiagram.md
├── sequenceDiagram.md
└── useCaseDiagram.md
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ Score : submits
    User ||--o| Wallet : has
    User ||--o{ TournamentParticipant : joins
    User ||--o{ Notification : receives

    Game ||--o{ Score : records
    Game ||--o{ GameVersion : has
    Game ||--o{ Tournament : hosts

    Score ||--o{ FraudFlag : flagged_by

    Wallet ||--o{ Transaction : records

    Tournament ||--o{ TournamentParticipant : includes
    Tournament ||--o{ Match : contains

    User {
        uuid id PK
        string email UK
        string username
        string password
        enum role "PLAYER | ADMIN"
        boolean isActive
        datetime createdAt
    }

    Game {
        uuid id PK
        string title
        string description
        enum format "HTML5 | WEBGL | IFRAME"
        string developerId
        boolean isActive
    }

    Score {
        uuid id PK
        string userId FK
        string gameId FK
        int value
        datetime createdAt
    }

    Wallet {
        uuid id PK
        string userId FK_UK
        float balance
    }

    Transaction {
        uuid id PK
        string walletId FK
        string type
        float amount
        datetime createdAt
    }

    Tournament {
        uuid id PK
        string name
        string gameId FK
        enum status "CREATED | OPEN | ONGOING | COMPLETED"
        float entryFee
        datetime startDate
        datetime endDate
    }

    FraudFlag {
        uuid id PK
        string scoreId FK
        string reason
        string status
    }

    Notification {
        uuid id PK
        string userId
        string message
        boolean isRead
    }

    AuditLog {
        uuid id PK
        string userId
        string action
        string entity
    }
```

---

## API Flow

### Score Submission Pipeline

```mermaid
sequenceDiagram
    actor Player
    participant FE as React Frontend
    participant API as FastAPI Router
    participant ScoreSvc as Score Service
    participant Fraud as Fraud Pipeline
    participant WalletSvc as Wallet Service
    participant Audit as Audit Service
    participant DB as PostgreSQL

    Player->>FE: Finish game (canvas)
    FE->>API: POST /scores/ {gameId, value}
    API->>API: Validate JWT token
    API->>ScoreSvc: submit_score(userId, gameId, value)

    Note over ScoreSvc: Rate limit check (50/min)

    ScoreSvc->>DB: Verify user exists
    ScoreSvc->>DB: Verify game exists

    ScoreSvc->>Fraud: evaluate(score_data)
    Note over Fraud: Chain of Responsibility<br/>ScoreLimitValidator → RateLimitValidator

    alt Score is valid
        Fraud-->>ScoreSvc: ✅ Valid
        ScoreSvc->>DB: INSERT score
        ScoreSvc->>WalletSvc: credit_user(coins)
        WalletSvc->>DB: UPDATE wallet balance
        WalletSvc->>DB: INSERT transaction (REWARD)
        ScoreSvc->>Audit: log_action (async)
        ScoreSvc-->>API: Score object
        API-->>FE: 200 OK {score}
        FE->>FE: Refresh balance & activity
    else Score is flagged
        Fraud-->>ScoreSvc: ❌ Flagged
        ScoreSvc->>DB: INSERT score (flagged)
        ScoreSvc->>DB: INSERT fraud_flag
        ScoreSvc-->>API: 400 Error
        API-->>FE: Score rejected
    end
```

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as React Frontend
    participant Auth as AuthContext
    participant API as FastAPI
    participant JWT as JWT Utils
    participant DB as PostgreSQL

    User->>FE: Enter credentials
    FE->>API: POST /auth/login {email, password}
    API->>DB: Find user by email
    API->>API: Verify bcrypt hash
    API->>JWT: Create access token
    JWT-->>API: Signed JWT
    API-->>FE: {access_token, user}
    FE->>Auth: Store token in localStorage
    Auth->>FE: Update auth state

    Note over FE,API: Subsequent requests include<br/>Authorization: Bearer {token}
```

---

## Getting Started

### Prerequisites

- **Python** 3.9+
- **Node.js** 18+
- **PostgreSQL** database (or [Neon](https://neon.tech) serverless)

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY

# Generate Prisma client
prisma generate

# Apply database migrations
prisma db push

# Seed demo data
python seed.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend dev server starts at `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@pixelops.io` | `PixelOps@2026` |
| Player | `neon@pixelops.io` | `PixelOps@2026` |
| Player | `grid@pixelops.io` | `PixelOps@2026` |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT signing secret | `your_secure_random_key` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL in minutes | `60` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL (production only) | `https://api.pixelops.com` |

---

## Deployment

### Render (Recommended)

The project includes a `render.yaml` for one-click deployment:

1. Push to GitHub
2. Connect repo to [Render](https://render.com)
3. Render auto-detects `render.yaml` and creates both services
4. Set `DATABASE_URL` and `SECRET_KEY` in Render environment

### Manual Deployment

**Backend:**
```bash
cd backend
pip install -r requirements.txt
prisma generate
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Frontend:**
```bash
cd frontend
npm install && npm run build
# Serve the dist/ directory with any static host
```

---

## Design Patterns

```mermaid
graph LR
    subgraph Patterns["Design Patterns Used"]
        A["🔗 Chain of Responsibility<br/>Fraud Detection Pipeline"]
        B["🏗️ Repository Pattern<br/>Data Access Abstraction"]
        C["📦 Service Layer<br/>Business Logic Isolation"]
        D["🔒 Strategy Pattern<br/>Game Engine Selection"]
        E["🎯 Singleton<br/>Prisma DB Client"]
        F["📡 Observer<br/>Audit Log Events"]
    end

    style Patterns fill:#0d1117,stroke:#107C10,color:#fff
```

| Pattern | Where Used | Purpose |
|---------|-----------|---------|
| **Chain of Responsibility** | `fraud_service.py` | Score validators chained sequentially |
| **Repository** | `repositories/` | Decouples DB queries from business logic |
| **Service Layer** | `services/` | Centralizes business rules away from routes |
| **Strategy** | `PlayableGameModal.tsx` | Dynamically selects game engine by title |
| **Singleton** | `db/prisma.py` | Single database connection instance |
| **Observer** | `audit_service.py` | Async fire-and-forget logging on actions |

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/auth/me` | Get current user profile |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/games/` | List all games (paginated) |
| `POST` | `/games/` | Create game (admin) |

### Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/scores/` | Submit a score |
| `GET` | `/scores/{game_id}` | Get scores for a game |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/leaderboard/{game_id}` | Get ranked players |

### Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wallet/` | Get wallet balance |
| `GET` | `/transactions` | Get transaction history |

### Tournaments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tournaments/` | List tournaments |
| `POST` | `/tournaments/` | Create tournament (admin) |
| `POST` | `/tournaments/{id}/join` | Join a tournament |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications/` | Get user notifications |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `PUT` | `/notifications/{id}/read` | Mark one as read |

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with 🎮 by <strong>PixelOps Team</strong>
</p>
