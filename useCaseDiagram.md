# Use Case Diagram — PixelOps

## Overview

This use case diagram represents all major interactions between users and the PixelOps platform.

Primary Actors:

- Player
- Developer
- Moderator
- Admin

The system also includes internal automated processes such as score validation, leaderboard updates, and reward processing.

---

```mermaid
graph TB

    subgraph PixelOps Platform
        UC1["Register / Login"]
        UC2["Manage Profile"]
        UC3["Play Game"]
        UC4["Submit Score"]
        UC5["View Leaderboard"]
        UC6["Join Tournament"]
        UC7["View Tournament Bracket"]
        UC8["Manage Wallet"]
        UC9["Earn Achievement"]
        UC10["Receive Notifications"]
        UC11["Upload Game"]
        UC12["Manage Game Versions"]
        UC13["Review Fraud Flags"]
        UC14["Moderate Scores"]
        UC15["Manage Users"]
        UC16["Configure Platform Settings"]
        UC17["View Analytics Dashboard"]
        UC18["Generate Reports"]
        UC19["Create Tournament"]
        UC20["Auto Validate Score"]
        UC21["Update Leaderboard"]
        UC22["Process Rewards"]
    end

    Player((Player))
    Developer((Developer))
    Moderator((Moderator))
    Admin((Admin))

    %% Player Use Cases
    Player --> UC1
    Player --> UC2
    Player --> UC3
    Player --> UC4
    Player --> UC5
    Player --> UC6
    Player --> UC7
    Player --> UC8
    Player --> UC9
    Player --> UC10

    %% Developer Use Cases
    Developer --> UC1
    Developer --> UC2
    Developer --> UC11
    Developer --> UC12
    Developer --> UC17

    %% Moderator Use Cases
    Moderator --> UC1
    Moderator --> UC13
    Moderator --> UC14
    Moderator --> UC17

    %% Admin Use Cases
    Admin --> UC1
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19

    %% System Internal Flows
    UC4 -.->|triggers| UC20
    UC20 -.->|on success| UC21
    UC21 -.->|triggers| UC22
    UC22 -.->|notifies| UC10
```

---

## Use Case Summary

| Actor | Major Use Cases |
|--------|----------------|
| Player | Play Game, Submit Score, View Leaderboard, Join Tournament, Manage Wallet, Earn Achievements |
| Developer | Upload Game, Manage Game Versions, View Game Analytics |
| Moderator | Review Fraud Flags, Moderate Suspicious Scores |
| Admin | Manage Users, Configure Platform, Create Tournaments, View Reports |

---

## System-Triggered Use Cases

| Use Case | Description |
|----------|------------|
| Auto Validate Score | Fraud validation pipeline runs automatically on score submission |
| Update Leaderboard | Ranking recalculated after valid score |
| Process Rewards | XP and wallet rewards processed |
| Receive Notifications | Real-time WebSocket notification sent to user |

