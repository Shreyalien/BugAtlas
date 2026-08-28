# BUGATLAS — Investigation OS

BugAtlas is an original portfolio-grade full-stack developer tool: a searchable bug intelligence atlas wrapped in a gamified investigation experience. It is not copied from a real company's product. The sample incidents are fictionalized technical scenarios designed for the demo.

## What makes this portfolio-ready
- Premium responsive dark UI with animated radar, micro-interactions, command palette and live event toast
- React + Vite + Framer Motion frontend
- Node.js + Express REST API
- SQLite persistence with foreign-key constraints and WAL mode
- JWT authentication + bcrypt password hashing
- Socket.IO live case-created events
- Case search, severity filtering and case creation
- Investigation workflow with locked/unlocked evidence clues
- XP, levels, achievements and leaderboard
- Analytics dashboard with Recharts
- Investigation notes/comments
- Admin delete endpoint
- Environment-configurable API URL and client origin

## Requirements
- Node.js 20 LTS or newer
- npm

## Run on Windows / VS Code

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open http://localhost:5173

Backend: http://localhost:5000
Health check: http://localhost:5000/api/health

### Demo account
Email: `shreya@bugatlas.dev`
Password: `shreya123`

### Admin account
Email: `admin@bugatlas.dev`
Password: `admin123`

## Environment variables

Optional server `.env`:

```env
PORT=5000
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

Optional client `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Reset demo data

Stop the server and delete `server/bugatlas.db`, then start the project again. The seed data will be recreated.

## Portfolio note

BugAtlas is an original concept and implementation. The demo case names and evidence are fictionalized examples, not claims about real incidents at specific companies. When presenting it publicly, describe it as an original portfolio project and explain the architecture, trade-offs and features you implemented.
