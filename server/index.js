import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  },
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked'));
      }
    },
  })
);

app.use(express.json({ limit: '200kb' }));

const PORT = Number(process.env.PORT || 5000);
const SECRET = process.env.JWT_SECRET || 'bugatlas-dev-secret-change-me';

const dbPath = path.join(process.cwd(), 'bugatlas.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'DETECTIVE',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN',
    environment TEXT DEFAULT 'Production',
    category TEXT DEFAULT 'Backend',
    language TEXT,
    framework TEXT,
    root_cause TEXT,
    solution TEXT,
    tags TEXT,
    created_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS clues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 20,
    order_no INTEGER,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    case_id INTEGER NOT NULL,
    clue_id INTEGER NOT NULL,
    unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, clue_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (clue_id) REFERENCES clues(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const sanitizeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  xp: u.xp,
  level: u.level,
});

const calculateLevel = (xp) => Math.floor(xp / 500) + 1;

// Seed initial database records if empty
function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role, xp, level) VALUES (?, ?, ?, ?, ?, ?)'
  );
  insertUser.run('Shreya', 'shreya@bugatlas.dev', bcrypt.hashSync('shreya123', 10), 'DETECTIVE', 460, 1);
  insertUser.run('Admin', 'admin@bugatlas.dev', bcrypt.hashSync('admin123', 10), 'ADMIN', 1450, 3);

  const insertCase = db.prepare(
    'INSERT INTO cases (title, description, severity, status, environment, category, language, framework, root_cause, solution, tags, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const case1 = insertCase.run(
    'JWT Session Ghosts',
    'Authenticated users are silently kicked out after a successful login when the access token reaches its short lifetime.',
    'CRITICAL',
    'INVESTIGATING',
    'Production',
    'SECURITY',
    'Java',
    'Spring Boot',
    'Token lifetime mismatch',
    'Add refresh-token rotation and validate expiry consistently across services.',
    'jwt,auth,security,session',
    2
  ).lastInsertRowid;

  const case2 = insertCase.run(
    'Payment Timeout Cascade',
    'Checkout becomes unreliable when a payment provider slows down; retries create a second wave of traffic.',
    'HIGH',
    'OPEN',
    'Production',
    'PERFORMANCE',
    'JavaScript',
    'Node.js',
    'No request deadline',
    'Use explicit timeouts, bounded retries and circuit breaking.',
    'payment,timeout,retry,api',
    2
  ).lastInsertRowid;

  const case3 = insertCase.run(
    'Dashboard Listener Leak',
    'A long-running dashboard tab consumes more memory after repeated navigation.',
    'MEDIUM',
    'RESOLVED',
    'Staging',
    'FRONTEND',
    'TypeScript',
    'React',
    'Effect cleanup missing',
    'Remove event listeners on unmount and avoid duplicate subscriptions.',
    'react,memory,events,leak',
    2
  ).lastInsertRowid;

  const case4 = insertCase.run(
    'Cache Stampede at the Edge',
    'A product page becomes unstable when a popular cache key expires and hundreds of requests hit the origin at once.',
    'HIGH',
    'OPEN',
    'Production',
    'PERFORMANCE',
    'Go',
    'Redis',
    'Synchronized cache expiry without request coalescing',
    'Add stale-while-revalidate, jittered TTLs and request coalescing for hot keys.',
    'cache,redis,latency,traffic',
    2
  ).lastInsertRowid;

  const case5 = insertCase.run(
    'Webhook Replay Storm',
    'A partner retries the same webhook several times and the order service creates duplicate fulfillment jobs.',
    'CRITICAL',
    'INVESTIGATING',
    'Production',
    'BACKEND',
    'TypeScript',
    'Node.js',
    'Webhook handler is not idempotent',
    'Persist an idempotency key before side effects and make job creation transactional.',
    'webhook,idempotency,queue,orders',
    2
  ).lastInsertRowid;

  const case6 = insertCase.run(
    'The Dark Mode Contrast Trap',
    'A settings release passes visual QA but important form controls become almost unreadable in the dark theme.',
    'MEDIUM',
    'RESOLVED',
    'Staging',
    'FRONTEND',
    'CSS',
    'React',
    'Theme token falls back to a low-contrast text value',
    'Replace hard-coded fallback tokens with semantic theme variables and add contrast checks to CI.',
    'css,accessibility,theme,contrast',
    2
  ).lastInsertRowid;

  const insertClue = db.prepare(
    'INSERT INTO clues (case_id, title, description, evidence, xp_reward, order_no) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const clues = [
    [case1, 'The timestamp mismatch', 'Compare the token issued time with the client session timer', 'iat: 02:40:11\nexp: 03:10:11\nclient refresh: never', 25, 1],
    [case1, 'The silent refresh', 'The API exposes refresh-token support but the client has no refresh interceptor', 'POST /auth/refresh → never called\n401 → logout', 35, 2],
    [case1, 'The clock drift', 'Production nodes disagree by 41 seconds, making expiry failures look random', 'node-a clock: 03:10:10\nnode-b clock: 03:10:51', 45, 3],
    [case2, 'The slow provider', 'The payment provider occasionally takes longer than the UX budget', 'POST /charge\nTTFB: 10.8s\nstatus: 200', 20, 1],
    [case2, 'The missing deadline', 'The HTTP wrapper waits forever for a response', 'timeout: undefined\nabort controller: absent', 30, 2],
    [case2, 'The retry storm', 'Three retries multiply load while the provider is already degraded', 'attempts: 1 → 2 → 4\nqueue depth: +187%', 50, 3],
    [case3, 'The repeated listener', 'Each mount registers another resize handler', 'resize listeners: 1 → 4 → 9', 20, 1],
    [case3, 'The missing cleanup', 'The effect has no teardown function', 'useEffect(() => addEventListener(...))\ncleanup: undefined', 30, 2],
    [case3, 'The heap fingerprint', 'Detached handlers remain reachable after navigation', 'Detached listeners: 9\nretained heap: 4.8 MB', 50, 3],
  ];

  clues.push(
    [case4, 'The hot key', 'Identify the product route receiving the sudden traffic spike', 'GET /product/42\ncache_hit: false\norigin_qps: 1180', 20, 1],
    [case4, 'The synchronized expiry', 'Compare expiry timestamps across the busiest keys', 'TTL values: 0s, 0s, 0s, 1s\nrequest_coalescing: false', 30, 2],
    [case4, 'The recovery path', 'Confirm that stale data can safely serve while the origin recovers', 'stale-while-revalidate: disabled\norigin p95: 4.8s', 50, 3],
    [case5, 'The duplicate event', 'Compare delivery identifiers across the repeated webhook', 'event_id: wh_7842\nattempts: 1 → 2 → 3\nsame payload hash: true', 25, 1],
    [case5, 'The side effect', 'Trace when the fulfillment job is created', 'INSERT job → payment check → commit\nidempotency_key: null', 35, 2],
    [case5, 'The safe boundary', 'Find the point where duplicate delivery can be rejected', 'UNIQUE(order_id, event_id): missing\nqueue publish: after insert', 50, 3],
    [case6, 'The token fallback', 'Inspect the computed text color for the affected control', 'color: #667085\nbackground: #111827\ncontrast ratio: 3.1:1', 20, 1],
    [case6, 'The semantic token', 'Compare light and dark theme variables', '--text-muted used as primary label color', 30, 2],
    [case6, 'The regression gate', 'Confirm the final accessibility check', 'axe contrast: 0 violations\nWCAG AA: pass', 50, 3]
  );

  clues.forEach(clue => insertClue.run(...clue));
}

seedDatabase();

// Middleware: Authentication
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware: Admin role check
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'BugAtlas API', timestamp: new Date().toISOString() });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (name.length < 2 || !email || password.length < 6) {
    return res.status(400).json({ message: 'Name, valid email and 6+ character password are required' });
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, passwordHash);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(409).json({ message: 'Email already registered' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: sanitizeUser(user) });
});

// Get current user profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  res.json({ user: sanitizeUser(user) });
});

// List all cases
app.get('/api/cases', requireAuth, (req, res) => {
  const cases = db
    .prepare(
      `SELECT c.*, COUNT(cl.id) AS clue_count
       FROM cases c
       LEFT JOIN clues cl ON cl.case_id = c.id
       GROUP BY c.id
       ORDER BY c.id DESC`
    )
    .all();

  res.json({ cases });
});

// Get single case details with clues, discovery status, and comments
app.get('/api/cases/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid case ID' });
  }

  const incident = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
  if (!incident) {
    return res.status(404).json({ message: 'Case not found' });
  }

  const clues = db
    .prepare('SELECT id, title, description, xp_reward, order_no FROM clues WHERE case_id = ? ORDER BY order_no')
    .all(id);

  const foundClueIds = db
    .prepare('SELECT clue_id FROM progress WHERE user_id = ? AND case_id = ?')
    .all(req.user.id, id)
    .map(x => x.clue_id);

  const cluesWithEvidence = clues.map(clue => {
    if (foundClueIds.includes(clue.id)) {
      const full = db.prepare('SELECT evidence FROM clues WHERE id = ?').get(clue.id);
      return { ...clue, evidence: full.evidence };
    }
    return clue;
  });

  const comments = db
    .prepare(
      `SELECT comments.id, comments.content, comments.created_at, users.name
       FROM comments
       JOIN users ON users.id = comments.user_id
       WHERE case_id = ?
       ORDER BY comments.id DESC`
    )
    .all(id);

  res.json({
    case: incident,
    clues: cluesWithEvidence,
    found: foundClueIds,
    comments,
  });
});

// Create new case
app.post('/api/cases', requireAuth, (req, res) => {
  const body = req.body || {};
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const clues = Array.isArray(body.clues) ? body.clues.slice(0, 10) : [];

  const createTransaction = db.transaction(() => {
    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const severity = validSeverities.includes(body.severity) ? body.severity : 'HIGH';

    const insertCase = db.prepare(`
      INSERT INTO cases (
        title, description, severity, environment, category, language, framework,
        root_cause, solution, tags, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertCase.run(
      title,
      description,
      severity,
      String(body.environment || 'Production').slice(0, 80),
      String(body.category || 'Backend').slice(0, 80),
      String(body.language || 'JavaScript').slice(0, 80),
      String(body.framework || 'Node.js').slice(0, 80),
      String(body.root_cause || '').slice(0, 500),
      String(body.solution || '').slice(0, 1000),
      String(body.tags || '').slice(0, 500),
      req.user.id
    );

    const caseId = result.lastInsertRowid;
    const case4 = insertCase.run(
    'Cache Stampede at the Edge',
    'A product page becomes unstable when a popular cache key expires and hundreds of requests hit the origin at once.',
    'HIGH',
    'OPEN',
    'Production',
    'PERFORMANCE',
    'Go',
    'Redis',
    'Synchronized cache expiry without request coalescing',
    'Add stale-while-revalidate, jittered TTLs and request coalescing for hot keys.',
    'cache,redis,latency,traffic',
    2
  ).lastInsertRowid;

  const case5 = insertCase.run(
    'Webhook Replay Storm',
    'A partner retries the same webhook several times and the order service creates duplicate fulfillment jobs.',
    'CRITICAL',
    'INVESTIGATING',
    'Production',
    'BACKEND',
    'TypeScript',
    'Node.js',
    'Webhook handler is not idempotent',
    'Persist an idempotency key before side effects and make job creation transactional.',
    'webhook,idempotency,queue,orders',
    2
  ).lastInsertRowid;

  const case6 = insertCase.run(
    'The Dark Mode Contrast Trap',
    'A settings release passes visual QA but important form controls become almost unreadable in the dark theme.',
    'MEDIUM',
    'RESOLVED',
    'Staging',
    'FRONTEND',
    'CSS',
    'React',
    'Theme token falls back to a low-contrast text value',
    'Replace hard-coded fallback tokens with semantic theme variables and add contrast checks to CI.',
    'css,accessibility,theme,contrast',
    2
  ).lastInsertRowid;

  const insertClue = db.prepare(
      'INSERT INTO clues (case_id, title, description, evidence, xp_reward, order_no) VALUES (?, ?, ?, ?, ?, ?)'
    );

    clues.forEach((clue, index) => {
      const clueTitle = String(clue?.title || `Clue ${index + 1}`).slice(0, 120);
      const clueDesc = String(clue?.description || 'Investigate technical evidence').slice(0, 500);
      const clueEvidence = String(clue?.evidence || 'Evidence captured').slice(0, 2000);
      const clueXp = Math.min(100, Math.max(5, Number(clue?.xp_reward) || 20));

      insertClue.run(caseId, clueTitle, clueDesc, clueEvidence, clueXp, index + 1);
    });

    return caseId;
  });

  const newCaseId = createTransaction();
  io.emit('case:created', { id: newCaseId, title });

  res.status(201).json({ id: newCaseId });
});

// Unlock / discover a clue
app.post('/api/cases/:caseId/clues/:clueId/unlock', requireAuth, (req, res) => {
  const caseId = Number(req.params.caseId);
  const clueId = Number(req.params.clueId);

  const clue = db.prepare('SELECT * FROM clues WHERE id = ? AND case_id = ?').get(clueId, caseId);
  if (!clue) {
    return res.status(404).json({ message: 'Clue not found' });
  }

  try {
    const unlockTransaction = db.transaction(() => {
      db.prepare('INSERT INTO progress (user_id, case_id, clue_id) VALUES (?, ?, ?)').run(
        req.user.id,
        caseId,
        clueId
      );

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
      const newXp = user.xp + clue.xp_reward;
      const newLevel = calculateLevel(newXp);

      db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, user.id);

      return { newXp, newLevel };
    });

    const result = unlockTransaction();
    res.json({ xp: result.newXp, level: result.newLevel, reward: clue.xp_reward });
  } catch (err) {
    res.status(409).json({ message: 'Clue already unlocked' });
  }
});

// Add comment / investigation note
app.post('/api/cases/:id/comments', requireAuth, (req, res) => {
  const caseId = Number(req.params.id);
  const content = String(req.body.content || '').trim();

  if (!Number.isInteger(caseId) || !content || content.length > 1000) {
    return res.status(400).json({ message: 'Valid comment up to 1000 characters is required' });
  }

  const caseExists = db.prepare('SELECT 1 FROM cases WHERE id = ?').get(caseId);
  if (!caseExists) {
    return res.status(404).json({ message: 'Case not found' });
  }

  const result = db
    .prepare('INSERT INTO comments (case_id, user_id, content) VALUES (?, ?, ?)')
    .run(caseId, req.user.id, content);

  res.status(201).json({ ok: true, id: result.lastInsertRowid });
});

// Leaderboard
app.get('/api/leaderboard', requireAuth, (req, res) => {
  const leaderboard = db
    .prepare('SELECT id, name, xp, level, role FROM users ORDER BY xp DESC, id ASC LIMIT 20')
    .all();
  res.json({ leaderboard });
});

// Statistics
app.get('/api/stats', requireAuth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM cases').get().count;
  const critical = db.prepare("SELECT COUNT(*) as count FROM cases WHERE severity = 'CRITICAL'").get().count;
  const resolved = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'RESOLVED'").get().count;
  const clues = db.prepare('SELECT COUNT(*) as count FROM clues').get().count;
  const categories = db
    .prepare('SELECT category, COUNT(*) as count FROM cases GROUP BY category ORDER BY count DESC')
    .all();

  res.json({ total, critical, resolved, clues, categories });
});

// Achievements
app.get('/api/achievements', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const progressCount = db.prepare('SELECT COUNT(*) as count FROM progress WHERE user_id = ?').get(user.id).count;

  const achievementsList = [
    ['FIRST_CLUE', 'First Discovery', 'Unlocked your first piece of incident evidence.', progressCount >= 1],
    ['EVIDENCE_HUNTER', 'Pattern Recognition', 'Discovered 5 pieces of technical evidence.', progressCount >= 5],
    ['ROOT_CAUSE', 'Root Cause Master', 'Reached 500 investigation points.', user.xp >= 500],
    ['SYSTEM_THINKER', 'Senior Investigator', 'Reached Level 3 rank in the network.', user.level >= 3],
    ['INCIDENT_COMMANDER', 'Incident Commander', 'Earned 2,000+ total technical XP.', user.xp >= 2000],
  ];

  res.json({
    achievements: achievementsList.map((item, index) => ({
      id: index + 1,
      code: item[0],
      title: item[1],
      description: item[2],
      unlocked: Boolean(item[3]),
    })),
  });
});

// Delete case (Admin only)
app.delete('/api/cases/:id', requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM cases WHERE id = ?').run(id);

  if (!result.changes) {
    return res.status(404).json({ message: 'Case not found' });
  }

  res.json({ ok: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[BugAtlas API Error]:', err);
  res.status(500).json({ message: 'Internal server error' });
});

io.on('connection', socket => {
  socket.emit('system:ready', { ok: true, version: '1.0.0' });
});

server.listen(PORT, () => {
  console.log(`[BugAtlas API] Server listening on http://localhost:${PORT}`);
});
