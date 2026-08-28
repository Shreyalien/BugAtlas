# 🐛 BUGATLAS // INVESTIGATION SYSTEM

> **Every bug leaves evidence. Your job is to find it.**

BugAtlas is a gamified full-stack bug investigation platform built around one idea:

**Don't just fix the bug. Investigate it.**

Instead of treating incidents as ordinary tickets, BugAtlas turns them into interactive technical cases. Investigators explore clues, inspect evidence, connect observations, collaborate with others, and work toward the root cause — while earning XP throughout the process.

```text
┌──────────────────────────────────────────────────────────┐
│                    BUGATLAS // OS                         │
│                                                          │
│   INCIDENT DETECTED                                      │
│        ↓                                                 │
│   INVESTIGATION STARTED                                  │
│        ↓                                                 │
│   CLUES DISCOVERED                                       │
│        ↓                                                 │
│   EVIDENCE ANALYZED                                      │
│        ↓                                                 │
│   ROOT CAUSE IDENTIFIED                                  │
│        ↓                                                 │
│   CASE RESOLVED                                          │
└──────────────────────────────────────────────────────────┘
```

---

## `// SYSTEM OVERVIEW`

Traditional bug tracking usually follows:

```text
REPORT → ASSIGN → FIX → CLOSE
```

BugAtlas introduces an investigation layer:

```text
INCIDENT
   │
   ├── CLUES
   │
   ├── EVIDENCE
   │
   ├── TIMELINE
   │
   ├── INVESTIGATION NOTES
   │
   └── COLLABORATION
          │
          ▼
      ROOT CAUSE
          │
          ▼
      RESOLUTION
```

The platform combines:

* Bug / incident management
* Interactive investigations
* Technical evidence
* Collaborative debugging
* XP and progression
* Achievements
* Leaderboards
* Real-time events

---

## `// CORE FEATURES`

### `[01] CASE BOARD`

Browse active and resolved incidents through an investigation-focused case board.

Cases can contain:

* Severity
* Status
* Environment
* Category
* Investigation progress
* Evidence
* Clues

---

### `[02] INVESTIGATION MODE`

Every case becomes an investigation.

Instead of revealing everything immediately, information is progressively discovered.

```text
CASE BH-0001
JWT EXPIRATION FAILURE

STATUS     : INVESTIGATING
SEVERITY   : CRITICAL
PROGRESS   : ███████░░░ 72%

[ CLUE 01 ]  Token Lifetime Mismatch
             +25 XP

[ CLUE 02 ]  Refresh Route
             +35 XP

[ CLUE 03 ]  Clock Drift
             +45 XP
```

The investigator must connect the evidence instead of simply reading the answer.

---

### `[03] CLUE SYSTEM`

Clues are the building blocks of an investigation.

Each clue can reveal another piece of the incident:

```text
Observation
     ↓
Clue
     ↓
Technical Evidence
     ↓
Hypothesis
     ↓
Root Cause
```

Discovering clues contributes XP and investigation progress.

---

### `[04] EVIDENCE`

Cases can contain technical evidence such as:

```text
SERVER LOGS
API RESPONSES
AUTHENTICATION DATA
ERROR DETAILS
SYSTEM OBSERVATIONS
DIAGNOSTIC INFORMATION
```

The objective is to make the investigator reason from evidence rather than simply guess the solution.

---

### `[05] XP & PROGRESSION`

Investigation activity feeds into a progression system.

Users can:

```text
DISCOVER CLUE
      ↓
    +XP
      ↓
LEVEL UP
      ↓
UNLOCK ACHIEVEMENT
      ↓
CLIMB LEADERBOARD
```

---

### `[06] ACHIEVEMENTS`

Investigators can unlock achievements based on their activity.

Examples:

```text
FIRST BLOOD
Solve your first investigation.

EVIDENCE COLLECTOR
Discover 25 clues.

NIGHT SHIFT
Complete an investigation late at night.

ROOT CAUSE
Successfully complete a critical case.
```

---

### `[07] COLLABORATION`

Investigators can discuss cases, share findings, and develop hypotheses through investigation notes.

A case can therefore evolve from:

```text
Individual Investigation
          ↓
Shared Findings
          ↓
Collaborative Analysis
          ↓
Root Cause
```

---

### `[08] REAL-TIME EVENTS`

Socket.IO powers real-time events across connected clients.

Example:

```text
ADMIN
  │
  │ creates new case
  ▼
SERVER
  │
  │ Socket.IO event
  ▼
CONNECTED INVESTIGATORS
  │
  └── NEW INCIDENT DETECTED
```

No manual refresh is required for supported real-time events.

---

### `[09] ADMIN CONTROL`

Administrators can manage the investigation environment.

Admin functionality includes case management and platform-level controls.

---

## `// TECH STACK`

| Layer           | Technology       |
| --------------- | ---------------- |
| Frontend        | React, Vite      |
| State           | Zustand          |
| Animation       | Framer Motion    |
| Icons           | Lucide React     |
| Charts          | Recharts         |
| HTTP            | Axios            |
| Backend         | Node.js, Express |
| Database        | SQLite           |
| Database Driver | Better-SQLite3   |
| Authentication  | JWT + bcryptjs   |
| Real-Time       | Socket.IO        |
| Package Manager | npm              |

---

## `// ARCHITECTURE`

```text
                         BUGATLAS
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────────┐           ┌──────────────┐
       │   React UI   │           │  Socket.IO   │
       │              │           │    Events    │
       │ Case Board   │           └──────┬───────┘
       │ Investigate  │                  │
       │ Evidence     │                  │
       │ XP / Stats   │                  │
       └──────┬───────┘                  │
              │                          │
              │ REST API                 │
              └──────────┬───────────────┘
                         ▼
                 ┌───────────────┐
                 │    Express    │
                 │     API       │
                 ├───────────────┤
                 │ Auth          │
                 │ Cases         │
                 │ Clues         │
                 │ Evidence      │
                 │ XP            │
                 │ Achievements  │
                 │ Comments      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    SQLite     │
                 ├───────────────┤
                 │ Users         │
                 │ Cases         │
                 │ Clues         │
                 │ Evidence      │
                 │ Progress      │
                 │ Comments      │
                 └───────────────┘
```

---

## `// PROJECT STRUCTURE`

```text
bugatlas/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── store.js
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── db.js
│   ├── index.js
│   ├── middleware.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## `// LOCAL SETUP`

### Requirements

```text
Node.js 20+
npm
Git
```

Check your environment:

```bash
node -v
npm -v
git --version
```

---

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/bugatlas.git
```

```bash
cd bugatlas
```

---

### Install

```bash
npm install
```

Then install client and server dependencies:

```bash
npm run install:all
```

---

### Run

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## `// DATABASE`

BugAtlas currently uses SQLite for local development.

The database is generated by the backend and is intentionally excluded from version control.

```text
server/
└── bughunt.db
```

For production deployments, the database layer can be migrated to PostgreSQL or another hosted relational database.

---

## `// AUTHENTICATION`

The application uses JWT-based authentication.

Authentication flow:

```text
REGISTER
   ↓
PASSWORD HASH
   ↓
LOGIN
   ↓
JWT ISSUED
   ↓
PROTECTED API REQUEST
   ↓
AUTHENTICATED USER
```

Passwords are hashed using `bcryptjs`.

Protected routes require a valid authentication token.

---

## `// REAL-TIME LAYER`

BugAtlas uses two communication patterns:

```text
REST API
   │
   └── Persistent application data

Socket.IO
   │
   └── Live application events
```

This separation keeps the core data flow predictable while allowing real-time functionality where it provides value.

---

## `// INVESTIGATION FLOW`

```text
┌───────────────┐
│ SELECT CASE   │
└───────┬───────┘
        ↓
┌───────────────┐
│ READ INCIDENT │
└───────┬───────┘
        ↓
┌───────────────┐
│ FIND CLUES    │
└───────┬───────┘
        ↓
┌───────────────┐
│ ANALYZE DATA  │
└───────┬───────┘
        ↓
┌───────────────┐
│ WRITE FINDING │
└───────┬───────┘
        ↓
┌───────────────┐
│ ROOT CAUSE    │
└───────┬───────┘
        ↓
┌───────────────┐
│ RESOLVE CASE  │
└───────────────┘
```

---

## `// SECURITY`

The project follows several basic security practices:

* Password hashing with bcrypt
* JWT authentication
* Protected API endpoints
* Role-based authorization
* Environment-based configuration
* Database files excluded from Git
* Secrets excluded from version control

Never commit real credentials or API keys.

Example:

```text
.env
.env.local
```

should remain untracked.

---

## `// ROADMAP`

BugAtlas is designed to grow beyond its current MVP.

### Planned

```text
[ ] GitHub Issues integration
[ ] GitHub repository investigations
[ ] Pull Request linking
[ ] Automated log ingestion
[ ] Stack trace analysis
[ ] AI-assisted root-cause analysis
[ ] Similar incident detection
[ ] Investigation analytics
[ ] Team workspaces
[ ] Case tagging
[ ] Advanced notifications
[ ] PostgreSQL production database
[ ] Docker support
[ ] Automated testing
[ ] Production deployment
```

---

## `// WHY BUGATLAS?`

Debugging is rarely:

```text
ERROR → FIX
```

Real investigations look more like:

```text
ERROR
  +
LOGS
  +
TIMELINE
  +
SYSTEM BEHAVIOR
  +
CODE CONTEXT
  +
HUMAN REASONING
       │
       ▼
   ROOT CAUSE
```

BugAtlas is built around that reality.

The platform turns the debugging process into a structured investigation where every clue contributes to a larger technical story.

---

## `// PROJECT STATUS`

```text
SYSTEM STATUS : ACTIVE DEVELOPMENT
VERSION       : MVP
TYPE          : FULL-STACK WEB APPLICATION
```

The current release focuses on the core investigation experience, authentication, case management, gamification, collaboration, and real-time functionality.

---

## `// AUTHOR`

**Shreya Golder**

Computer Science & Engineering

GitHub: **@Shreyalien**

---

## `// LICENSE`

All rights reserved.

This repository is shared for viewing and educational purposes. The code may not be reused, modified, redistributed, or commercially deployed without permission.
