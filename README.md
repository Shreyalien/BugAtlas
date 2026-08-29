# 🐛 BugAtlas — The Failure Atlas

> **Don't just report the bug. Build the evidence trail.**

BugAtlas is an original full-stack developer tool concept that turns software failures into **investigable technical cases**.

It combines:

- an interactive **Atlas Map** of failure domains
- incident reporting
- evidence-based clue discovery
- root-cause investigation
- collaboration/comments
- XP, levels and milestones
- engineering analytics
- contributor leaderboard
- realtime incident notifications

The goal is not to copy a traditional Jira-style ticket system or a debugging game. The product is deliberately designed around a different mental model:

```text
SYMPTOM
   ↓
SIGNAL
   ↓
HYPOTHESIS
   ↓
EVIDENCE
   ↓
ROOT CAUSE
   ↓
VERIFIED FIX
   ↓
ENGINEERING MEMORY
```

---

## 01 — The original idea

The core invention in this project is the **Failure Atlas**.

Instead of displaying incidents as a flat list, BugAtlas groups failures into spatial system zones:

```text
                         BUGATLAS // ATLAS

             ┌─────────────────────────────┐
             │       FRONTEND              │
             │   rendering / state / UX   │
             └──────────────┬──────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 PERFORMANCE            FAILURE FIELD          BACKEND
 cache / latency       active signals       APIs / data
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
                        SECURITY
                    auth / identity
```

The map is intentionally abstract rather than pretending to be a real infrastructure graph. It gives the project its own visual language.

---

# 02 — Six built-in incident examples

These are **synthetic engineering scenarios**, created for the demo dataset. They are inspired by real classes of software failures, not copied from a company's private incident report.

### Example 01 — JWT Session Ghosts

**Domain:** Security  
**Stack:** Java / Spring Boot  
**Severity:** Critical

```text
Symptom
Users log in successfully and are unexpectedly logged out later.

Evidence
→ token expiry mismatch
→ refresh endpoint never called
→ production clock drift

Root cause
Inconsistent session-expiry handling.

Fix
Refresh-token rotation + consistent expiry validation.
```

### Example 02 — Payment Timeout Cascade

**Domain:** Performance  
**Stack:** JavaScript / Node.js  
**Severity:** High

```text
Symptom
Checkout becomes unreliable when a payment provider slows down.

Evidence
→ provider TTFB spikes
→ request deadline is undefined
→ retries multiply traffic

Root cause
Unbounded downstream waiting and retries.

Fix
Explicit deadlines + bounded retries + circuit breaking.
```

### Example 03 — Dashboard Listener Leak

**Domain:** Frontend  
**Stack:** TypeScript / React  
**Severity:** Medium

```text
Symptom
A long-running dashboard tab becomes progressively heavier.

Evidence
→ resize listeners: 1 → 4 → 9
→ effect has no cleanup
→ detached handlers retain heap memory

Root cause
Repeated event subscriptions.

Fix
Correct effect teardown and subscription ownership.
```

### Example 04 — Cache Stampede at the Edge

**Domain:** Performance  
**Stack:** Go / Redis  
**Severity:** High

```text
Symptom
A popular product page overloads the origin when its cache expires.

Evidence
→ cache hit rate collapses
→ many hot keys expire together
→ request coalescing is disabled

Root cause
Synchronized expiry without a stale-serving strategy.

Fix
Stale-while-revalidate + TTL jitter + request coalescing.
```

### Example 05 — Webhook Replay Storm

**Domain:** Backend  
**Stack:** TypeScript / Node.js  
**Severity:** Critical

```text
Symptom
One partner webhook produces duplicate fulfillment jobs.

Evidence
→ same event arrives multiple times
→ event hash is identical
→ no idempotency key is persisted

Root cause
Side effects are not protected by an idempotency boundary.

Fix
Persist idempotency keys before side effects and enforce uniqueness.
```

### Example 06 — The Dark Mode Contrast Trap

**Domain:** Frontend  
**Stack:** CSS / React  
**Severity:** Medium

```text
Symptom
Important controls become difficult to read in dark mode.

Evidence
→ semantic token falls back to muted text
→ contrast ratio drops to 3.1:1
→ final accessibility check catches the regression

Root cause
Incorrect theme-token mapping.

Fix
Semantic color tokens + automated contrast regression checks.
```

---

# 03 — Is BugAtlas a real existing product?

**The exact BugAtlas implementation in this repository is original.**

However, the underlying problem space is real.

Real engineering teams already use:

- incident management
- bug trackers
- observability
- root-cause analysis
- postmortems
- debugging exercises
- reliability training
- gamification

There are also real products and projects that explore parts of this territory. For example, production debugging simulations and incident-response games already exist.

So the correct portfolio claim is **not**:

> "Nobody has ever made anything like this."

That would be difficult to defend.

The stronger and more honest claim is:

> **"BugAtlas is my own product concept that combines incident investigation, evidence trails, spatial failure mapping and gamified learning into one developer experience."**

That is the differentiation.

---

# 04 — What makes this version different?

### Traditional bug tracker

```text
Bug
↓
Ticket
↓
Status
↓
Fix
```

### BugAtlas

```text
Incident
↓
Atlas Zone
↓
Symptoms
↓
Evidence
↓
Clues
↓
Hypotheses
↓
Root Cause
↓
Verified Fix
↓
XP / Learning Signal
```

The important difference is the **investigation journey**.

---

# 05 — Main product surfaces

## Atlas Map

Spatial overview of the failure field.

Features:

- zone filtering
- incident density
- severity signals
- live search
- clickable incidents
- abstract system topology
- animated scan/orbit effects

## Incident Board

Searchable incident inventory.

Features:

- severity filtering
- category filtering
- incident status
- framework metadata
- tags
- quick investigation access

## Investigation Workbench

Every incident becomes a case.

Features:

- locked clues
- evidence
- XP rewards
- progress tracking
- root-cause context
- comments
- completion state

## Intelligence

Engineering-level analytics.

Tracks:

- incident volume
- critical incidents
- resolved incidents
- category distribution
- evidence activity

## Contributors

A lightweight engineering leaderboard based on investigation progress.

## Milestones

Achievement system based on evidence discovery and investigations.

---

# 06 — Technical architecture

```text
┌──────────────────────────────────────┐
│              React UI                │
│                                      │
│ Atlas • Cases • Investigation        │
│ Analytics • Leaderboard • Achievements│
└──────────────────┬───────────────────┘
                   │ REST / Socket.IO
                   ▼
┌──────────────────────────────────────┐
│          Node.js + Express           │
│                                      │
│ Auth • Cases • Clues • Comments      │
│ Stats • XP • Achievements            │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          SQLite / better-sqlite3     │
│                                      │
│ Users • Cases • Clues • Progress     │
│ Comments                             │
└──────────────────────────────────────┘
```

### Frontend

- React
- Vite
- Framer Motion
- Zustand
- Recharts
- Lucide React
- Axios

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3
- JWT
- bcrypt
- Socket.IO

---

# 07 — Authentication

Demo accounts:

```text
DETECTIVE
Email: shreya@bugatlas.dev
Password: shreya123

ADMIN
Email: admin@bugatlas.dev
Password: admin123
```

For production deployment, change these credentials and provide a real `JWT_SECRET`.

---

# 08 — Run locally

Requirements:

- Node.js 20+ recommended
- npm

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Frontend:

```text
http://localhost:5173
```

API:

```text
http://localhost:5000/api/health
```

The SQLite database is created automatically by the server.

---

# 09 — Environment variables

Root `.env`:

```env
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

Client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

The application also contains development-safe fallbacks so a fresh local run does not fail simply because an `.env` file is missing.

---

# 10 — Portfolio positioning

Don't describe BugAtlas as:

> "A bug tracking website."

That undersells the project.

Use:

> **BugAtlas — an interactive incident-investigation platform that turns software failures into evidence-driven technical cases.**

And for a CV/project card:

> Built a full-stack debugging platform with interactive failure mapping, clue-based investigation, JWT authentication, realtime incident events, analytics, collaboration, XP progression and SQLite persistence.

---

# 11 — Why this is a strong portfolio project

BugAtlas demonstrates more than frontend styling.

It gives you talking points around:

- REST API design
- authentication
- authorization
- database schema design
- relational data
- CRUD operations
- state management
- realtime communication
- search and filtering
- analytics
- gamification
- UX architecture
- information visualization
- error handling
- product thinking

The visual layer gets attention.

The investigation model gives you something technical to discuss.

---

# 12 — Roadmap for the next version

The current repository intentionally stays achievable as a student-built full-stack project.

Strong future upgrades:

```text
V2
├── Evidence graph
├── Hypothesis scoring
├── Incident timeline
├── Similar-case recommendations
├── Postmortem generator
├── GitHub issue import
├── Markdown/code evidence
├── Team workspaces
└── Public investigation links
```

The most valuable next feature would be the **Evidence Graph**:

```text
Symptom
   │
   ├── supports → Hypothesis A
   │
   ├── contradicts → Hypothesis B
   │
   └── leads to → Evidence C
                         │
                         └── confirms → Root Cause
```

That would push BugAtlas from a polished student project toward a genuinely distinctive developer-tool concept.

---

## License

This project is intended as a personal portfolio / learning project.
