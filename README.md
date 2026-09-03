# 🐛 BugAtlas

### An Interactive Incident Investigation Platform for Developers

BugAtlas is a full-stack developer platform designed to make software bugs and outages easier to **report, investigate, understand, and learn from**.

Instead of treating a bug as just another ticket, BugAtlas turns incidents into structured investigation cases with clues, telemetry evidence, root-cause isolation, status lifecycles, automated postmortem generation, and collaborative progress tracking.

---

## ✨ Key Features

### 🔎 Incident Investigation Workbench
Create and investigate software incidents through progressive evidence disclosure:
* Incident overview, environment metadata, technology stack, and severity badges
* Locked telemetry layers and discoverable evidence clues
* Multi-stage status lifecycle (`OPEN` → `INVESTIGATING` → `RESOLVED`)
* Root-cause analysis (RCA) isolation upon finding all clues
* +100 XP completion bonus when an incident is solved and resolved

### 📄 Automated Incident Postmortem Generator
* Generates an executive and technical postmortem document automatically from collected telemetry, clues, notes, and root-cause findings
* 1-Click **Copy Markdown** for engineering docs / GitHub discussions
* Direct **Download (.md)** capability for incident postmortem records

### 🗺️ Interactive Atlas Map
A spatial radar map showing failure distribution across architecture domains:
* Visual clustering across **Frontend**, **Backend**, **Security**, and **Performance**
* Failure pressure and risk index analytics
* Real-time signal stream filtering

### 📋 Incident Board & Multi-Filter Search
* Real-time search across incident titles, descriptions, stack, and tags
* Multi-dimensional filtering by **Severity** (Critical, High, Medium, Low), **Category**, and **Status** (Open, Investigating, Resolved)
* Quick-action shortcuts and Command Palette (`Ctrl+K` / `⌘K`)

### 💬 Collaborative Incident Field Notes
* Real-time note taking and hypothesis sharing for team investigators
* Character countdown and user attribution for every field observation

### 🏆 Gamification & Milestones
* Experience points (XP) and investigator levels (e.g. Level 1 Detective → Senior Investigator)
* Engineering leaderboard and achievement milestone badges

### ⚡ Real-time Updates (Socket.IO)
* Instant notifications across connected clients when new incidents are reported or resolved
* Live synchronization of incident board and analytics telemetry

---

## 🧠 How It Works

```text
Report an Incident
        ↓
Observe Observed Symptoms
        ↓
Progressively Unlock Clues & Telemetry
        ↓
Isolate Underlying Root Cause
        ↓
Document Remediation & Proposed Fix
        ↓
Resolve Incident (+100 XP Bonus)
        ↓
Export Automated Engineering Postmortem (.md)
```

---

## 🖥️ Tech Stack

### Frontend
* **React 19** & **Vite 7**
* **Framer Motion** for smooth state transitions
* **Recharts** for engineering metrics and failure taxonomy
* **Lucide React** for UI icons
* **Socket.IO Client** & **Axios**
* **Zustand** for state management

### Backend
* **Node.js** & **Express.js** (ES Modules)
* **better-sqlite3** (SQLite with WAL mode)
* **Socket.IO** for real-time broadcasts
* **bcryptjs** for secure password hashing
* **jsonwebtoken (JWT)** for role-based authentication

---

## 📁 Project Structure

```text
BugAtlas/
│
├── client/
│   ├── src/
│   │   ├── api/             # Axios client & socket connection
│   │   ├── components/      # Header, Sidebar, CommandPalette, StatCard, etc.
│   │   ├── pages/           # Cases, Atlas, Investigation, Analytics, Leaderboard, etc.
│   │   ├── store/           # Zustand authentication store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css       # Engineering dark theme
│   │
│   └── package.json
│
├── server/
│   ├── index.js             # Express API, SQLite schema, Auth, Realtime
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js 20+**
* **npm**

### 2. Clone the repository
```bash
git clone https://github.com/Shreyalien/BugAtlas.git
cd BugAtlas
```

### 3. Install dependencies
```bash
npm run install:all
```
*(This installs root, backend, and frontend dependencies in one command)*

### 4. Configure environment (Optional)
The project includes development fallbacks out of the box. You can configure:

Root `.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key
CLIENT_ORIGIN=http://localhost:5173
```

Client `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Start development servers
```bash
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **API Server**: `http://localhost:5000/api/health`

---

## 🔐 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Detective** | `shreya@bugatlas.dev` | `shreya123` |
| **Admin** | `admin@bugatlas.dev` | `admin123` |

You can also register a new account anytime from the login page.

---

## 🎯 Project Goals

BugAtlas was built around a simple idea:

> **Debugging is an investigation.**

The platform turns the traditional debugging process into an engaging, structured investigation where every clue contributes to a larger technical story.

---

## 📌 Project Status

**Active Development**

BugAtlas is continuously upgraded with new features, telemetry improvements, and investigation tools.

---

## 👩‍💻 Author

**Shreya Golder**  
Computer Science & Engineering  
GitHub: [@Shreyalien](https://github.com/Shreyalien)

---

### Built to explore a different way of looking at bugs.
**Find the clue. Trace the failure. Understand the cause.**
