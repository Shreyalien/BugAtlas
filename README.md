# ≡ƒÉ¢ BUGATLAS // INVESTIGATION SYSTEM

> **Every bug leaves evidence. Your job is to find it.**

BugAtlas is a gamified full-stack bug investigation platform built around one idea:

**Don't just fix the bug. Investigate it.**

Instead of treating incidents as ordinary tickets, BugAtlas turns them into interactive technical cases. Investigators explore clues, inspect evidence, connect observations, collaborate through investigation notes, and work toward the root cause ΓÇö while earning XP throughout the process.

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
   ├── EVIDENCE
   ├── INVESTIGATION NOTES
   ├── PROGRESS
   └── COLLABORATION
          │
          ▼
      ROOT CAUSE
          │
          ▼
      RESOLUTION
```

The platform combines:

- Bug / incident management
- Interactive investigations
- Technical evidence
- Investigation notes and collaboration
- XP and progression
- Achievements
- Leaderboards
- Analytics
- Real-time incident events
- Role-based administration

---

## `// CORE FEATURES`

### `[01] CASE BOARD`

Browse active and resolved incidents through an investigation-focused case board.

Each case can include:

- Severity
- Status
- Environment
- Category
- Language
- Framework
- Tags
- Investigation progress
- Clues
- Evidence
- Root cause
- Resolution

---

### `[02] INVESTIGATION MODE`

Every case becomes an investigation.

Instead of revealing everything immediately, information is progressively discovered.

```text
CASE BH-0001
JWT EXPIRATION FAILURE

STATUS     : INVESTIGATING
SEVERITY   : CRITICAL
PROGRESS   : ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûæΓûæΓûæ 72%

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
     →
Clue
     →
Technical Evidence
     →
Hypothesis
     →
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

The objective is to reason from evidence rather than simply guess the solution.

---

### `[05] XP & PROGRESSION`

Investigation activity feeds into a progression system.

```text
DISCOVER CLUE
      →
    +XP
      →
LEVEL UP
      →
UNLOCK ACHIEVEMENT
      →
CLIMB LEADERBOARD
```

---

### `[06] ACHIEVEMENTS`

Investigators can unlock achievements based on their activity.

Examples include:

```text
FIRST DISCOVERY
Unlock your first piece of incident evidence.

PATTERN RECOGNITION
Discover 5 pieces of technical evidence.

ROOT CAUSE MASTER
Reach 500 investigation points.

SENIOR INVESTIGATOR
Reach Level 3.

INCIDENT COMMANDER
Earn 2,000+ technical XP.
```

---

### `[07] COLLABORATION`

Investigators can discuss cases, share findings, and document hypotheses through investigation notes.

A case can evolve from:

```text
Individual Investigation
          →
Shared Findings
          →
Collaborative Analysis
          →
Root Cause
```

---

### `[08] REAL-TIME EVENTS`

Socket.IO powers real-time incident events across connected clients.

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

Supported clients can receive new incident notifications without manually refreshing the application.

---

### `[09] ANALYTICS`

The analytics layer provides an overview of the investigation network, including:

- Total incidents
- Critical incidents
- Resolved incidents
- Evidence / clue activity
- Category distribution

---

### `[10] ADMIN & CREATOR CONTROL`

Administrators and case creators can manage the investigation environment, including secure incident deletion and access control.

---

### `[11] INCIDENT STATE LIFECYCLE & RESOLUTION BONUS`

Cases move through a live investigation lifecycle:

```text
OPEN → INVESTIGATING → RESOLVED (+100 XP)
```

When investigators uncover all evidence layers and isolate the root cause, they can transition the incident to `RESOLVED` status to earn a completion toast notification and a **+100 XP** solver bonus.

---

### `[12] AUTOMATED POSTMORTEM REPORT GENERATOR`

Turn technical findings into production-ready postmortems with a single click:

- Auto-compiles telemetry evidence, timelines, root-cause isolation, and discussion notes.
- **Copy Markdown**: Instant copy for GitHub Issues, pull requests, or engineering docs.
- **Download (.md)**: Export standardized incident postmortem reports.

---

### `[13] MULTI-CRITERIA INCIDENT FILTERING`

Quickly navigate active outages through multi-dimensional filters:
- **Severity**: Critical, High, Medium, Low
- **Status**: Open, Investigating, Resolved
- **Category**: Backend, Frontend, Security, Performance


---

## `// TECH STACK`

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| State Management | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | SQLite |
| Database Driver | Better-SQLite3 |
| Authentication | JWT + bcryptjs |
| Real-Time | Socket.IO |
| Package Manager | npm |

---

## `// ARCHITECTURE`

```text
                         BUGATLAS
                            │
              ┌─────────────┬─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────────┐           ┌──────────────┐
       │   React UI   │           │  Socket.IO   │
       │              │           │    Events    │
       │ Case Board   │           └──────┴───────┘
       │ Investigate  │                  │
       │ Analytics    │                  │
       │ Leaderboard  │                  │
       │ Achievements │                  │
       └──────┴───────┘                  │
              │                          │
              │ REST API                 │
              └──────────┴───────────────┘
                         ▼
                 ┌───────────────┐
                 │    Express    │
                 │     API       │
                 ├───────────────┤
                 │ Authentication│
                 │ Cases         │
                 │ Clues         │
                 │ Evidence      │
                 │ Progress      │
                 │ Comments      │
                 │ Statistics    │
                 │ Achievements  │
                 └───────┴───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    SQLite     │
                 ├───────────────┤
                 │ Users         │
                 │ Cases         │
                 │ Clues         │
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
│   │   ├── api/
│   │   │   └── client.js
│   │   │
│   │   ├── components/
│   │   │   ├── CommandPalette.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Achievements.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Cases.jsx
│   │   │   ├── CreateCase.jsx
│   │   │   ├── Investigation.jsx
│   │   │   └── Leaderboard.jsx
│   │   │
│   │   ├── store/
│   │   │   └── useStore.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── .env.example
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── index.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
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

### Clone

```bash
git clone https://github.com/Shreyalien/BugAtlas.git
cd BugAtlas
```

### Install all dependencies

From the project root:

```bash
npm install
npm run install:all
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=change-me-in-production
CLIENT_ORIGIN=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, use a strong secret and the correct deployed client origin.

### Run

From the project root:

```bash
npm run dev
```

The development setup runs:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

API health check:

```text
http://localhost:5000/api/health
```

---

## `// AUTHENTICATION`

BugAtlas uses JWT-based authentication.

Authentication flow:

```text
REGISTER
   →
PASSWORD HASH
   →
LOGIN
   →
JWT ISSUED
   →
PROTECTED API REQUEST
   →
AUTHENTICATED USER
```

Passwords are hashed using `bcryptjs`.

Protected API routes require a valid authentication token.

---

## `// DATABASE`

BugAtlas currently uses SQLite for local development.

The backend creates the SQLite database automatically:

```text
server/
└── bugatlas.db
```

The database file should remain outside version control.

---

## `// REAL-TIME LAYER`

BugAtlas uses two communication patterns:

```text
REST API
   │
   └── Persistent application data

Socket.IO
   │
   └── Live incident events
```

REST handles the application's persistent data flow, while Socket.IO is used for supported live events such as newly created incidents.

---

## `// INVESTIGATION FLOW`

```text
┌───────────────┐
│ SELECT CASE   │
└───────┴───────┘
        →
┌───────────────┐
│ READ INCIDENT │
└───────┴───────┘
        →
┌───────────────┐
│ FIND CLUES    │
└───────┴───────┘
        →
┌───────────────┐
│ ANALYZE DATA  │
└───────┴───────┘
        →
┌───────────────┐
│ WRITE FINDING │
└───────┴───────┘
        →
┌───────────────┐
│ ROOT CAUSE    │
└───────┴───────┘
        →
┌───────────────┐
│ RESOLVE CASE  │
└───────────────┘
```

---

## `// SECURITY`

The project includes several basic security practices:

- Password hashing with bcrypt
- JWT authentication
- Protected API endpoints
- Role-based authorization
- CORS configuration
- Environment-based secrets
- Database exclusion from Git

Never commit real credentials, JWT secrets, or API keys.

Keep local environment files untracked:

```text
.env
.env.local
client/.env
```

---

## `// ROADMAP`

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
[ ] Advanced notifications
[ ] PostgreSQL production database
[ ] Docker support
[ ] Automated testing
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

The current release focuses on the core investigation experience, authentication, case management, gamification, analytics, collaboration, and real-time incident events.

---

## `// AUTHOR`

**Shreya Golder**

Computer Science & Engineering

GitHub: **@Shreyalien**

---

## `// LICENSE`

All rights reserved.

This repository is shared for portfolio and educational viewing. The source code may not be reused, modified, redistributed, or commercially deployed without permission.