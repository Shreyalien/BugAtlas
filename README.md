# 🐛 BugAtlas — Investigation OS

> A gamified full-stack bug investigation platform where developers discover clues, analyze evidence, collaborate on incidents, and earn XP by solving technical cases.

BugAtlas transforms traditional bug tracking into an interactive investigation experience.

Instead of simply reading a bug report, developers investigate the incident step by step — unlocking clues, reviewing technical evidence, discussing findings, and working toward the root cause.

---

## ✨ Core Idea

Traditional bug trackers usually follow:

```text
Bug Report → Fix → Close
```

BugAtlas introduces an investigation layer:

```text
Incident
   ↓
Investigation
   ↓
Clues
   ↓
Evidence
   ↓
Discussion
   ↓
Root Cause
   ↓
Resolution
   ↓
XP & Achievements
```

The goal is to make technical debugging more engaging while creating a structured knowledge base around real software incidents.

---

## 🚀 Features

### 🔐 Authentication

* User registration
* Secure login
* JWT-based authentication
* Protected API routes
* Role-based authorization

### 🐛 Case Management

* Create investigation cases
* Case severity levels
* Case status tracking
* Environment classification
* Backend category management
* Search and filtering

### 🕵️ Investigation System

Each case contains hidden clues.

Detectives can:

* Discover clues
* Unlock technical information
* Track investigation progress
* Earn XP from discoveries
* Unlock the complete case story

### 🔎 Evidence System

Cases can contain technical evidence such as:

* Server logs
* JWT payloads
* API traces
* Browser heap snapshots
* Diagnostic information

### ⚡ Gamification

* XP rewards
* Detective levels
* Leaderboard
* Achievements
* Investigation progress

### 💬 Collaboration

Detectives can leave investigation notes and discuss findings inside each case.

### ⚡ Real-Time Updates

Socket.IO is used to notify connected users when new investigation cases are created.

### 👑 Admin Controls

Administrators can manage investigation cases through a dedicated control panel.

---

## 🧠 Example Investigation

### Case

```text
BH-0001
JWT Expiration Failure
Severity: CRITICAL
```

A user is randomly logged out after authentication.

The detective investigates three clues:

```text
CLUE 01
Token Lifetime Mismatch
+25 XP

        ↓

CLUE 02
Refresh Route
+35 XP

        ↓

CLUE 03
Clock Drift
+45 XP
```

After all clues are discovered, the complete investigation story becomes available.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │  Investigation OS   │
                    └──────────┬──────────┘
                               │
                         Axios / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express API      │
                    │ Authentication       │
                    │ Cases                │
                    │ Clues                │
                    │ Evidence             │
                    │ XP                   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │ Users               │
                    │ Cases               │
                    │ Clues               │
                    │ Evidence            │
                    │ Progress            │
                    │ Comments            │
                    └─────────────────────┘

              ┌─────────────────────────────┐
              │          Socket.IO          │
              │     Real-Time Events        │
              └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Zustand
* Framer Motion
* Axios
* Lucide React
* Socket.IO Client

### Backend

* Node.js
* Express.js
* SQLite
* Better-SQLite3
* JWT
* bcryptjs
* Socket.IO

---

## 📁 Project Structure

```text
BugAtlas-Investigation-OS/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── store.js
│   │   ├── main.jsx
│   │   └── styles.css
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

## ⚙️ Installation

### Requirements

Install:

* Node.js 20+
* npm
* Git

Check your versions:

```bash
node -v
npm -v
git --version
```

---

## ▶️ Run Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/bugatlas-investigation-os.git
```

Enter the project:

```bash
cd bugatlas-investigation-os
```

Install root dependencies:

```bash
npm install
```

Install frontend and backend dependencies:

```bash
npm run install:all
```

Start the complete application:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

---

## 🔑 Demo Accounts

### Detective

```text
Email: shreya@bugatlas.dev
Password: shreya123
```

### Admin

```text
Email: admin@bugatlas.dev
Password: admin123
```

> These credentials are for local/demo development only.

---

## 🗄️ Database

BugAtlas uses SQLite for local development.

The database is automatically created by the backend.

```text
server/
└── bughunt.db
```

The database file is ignored by Git using `.gitignore`.

---

## 🎮 Investigation Flow

```text
Login
  ↓
Case Board
  ↓
Select Case
  ↓
Investigate
  ↓
Unlock Clues
  ↓
Collect Evidence
  ↓
Discuss Findings
  ↓
Discover Root Cause
  ↓
Earn XP
  ↓
Unlock Achievements
```

---

## 🔮 Future Roadmap

Planned improvements:

* GitHub Issues integration
* Repository connection
* Pull Request linking
* Stack trace analysis
* AI-assisted root cause suggestions
* Similar incident detection
* Advanced analytics
* Case tags
* Team workspaces
* Notifications
* PostgreSQL production database
* Docker deployment
* Cloud deployment
* Automated test suite

---

## 🎯 Why BugAtlas?

BugAtlas is designed around a simple idea:

> Debugging should not only be about fixing a problem — it should be about understanding why it happened.

By combining incident management, technical evidence, collaboration, and gamification, BugAtlas creates a more engaging way to investigate software failures.

---

## 📌 Project Status

**Status:** Active Development

This project is currently an MVP focused on the core investigation experience and full-stack architecture.

---

## 👩‍💻 Author

**Shreya Golder**

Computer Science & Engineering

GitHub: `@Shreyalien`

---

## 📄 License

This project is intended for educational and development purposes.
