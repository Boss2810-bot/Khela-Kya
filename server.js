/**
 * Khela Kya — Server
 * Migrated from SQLite to MongoDB (Mongoose).
 * All existing API endpoints preserved for frontend compatibility.
 */
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { connectDB, disconnectDB } = require('./config/database');

// ─── Route modules ────────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const turfRoutes    = require('./routes/turfRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');

const SECRET       = process.env.JWT_SECRET || process.env.KK_SECRET || 'change_this_secret_in_prod';
const isProduction = process.env.NODE_ENV === 'production';
const PORT         = process.env.PORT || 5000;

if (isProduction && SECRET === 'change_this_secret_in_prod') {
  console.warn('[Warn] JWT_SECRET is not set. Use a strong secret in production.');
}

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
}));

app.use(express.json({ limit: '50kb' }));

// ─── API Routes ────────────────────────────────────────────────────────────────
// Auth: /api/signup, /api/login, /api/profile, /api/auth/register, /api/auth/login
app.use('/api', authRoutes);

// Turfs: /api/turfs, /api/turfs/nearby, /api/turfs/:id
app.use('/api/turfs', turfRoutes);

// Bookings: /api/bookings
app.use('/api/bookings', bookingRoutes);

// Contact: /api/contact
app.use('/api/contact', contactRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'khela-kya-server',
    database: 'mongodb',
    time: new Date().toISOString(),
  });
});

// ─── Static file serving ──────────────────────────────────────────────────────
const staticOptions = { dotfiles: 'deny', index: false };

// Serve /img directory
app.use('/img', express.static(path.join(__dirname, 'img'), staticOptions));

// Serve Instagram files (images only)
app.use((req, res, next) => {
  let decoded;
  try { decoded = decodeURIComponent(req.path).replace(/\\/g, '/'); } catch { decoded = req.path; }

  const prefix = '/(2) Instagram_files/';
  if (!decoded.startsWith(prefix)) return next();

  const relative = decoded.slice(prefix.length);
  if (!/\.(gif|jpe?g|png|webp)$/i.test(relative)) return res.status(404).send('Not found');

  const root = path.resolve(__dirname, '(2) Instagram_files');
  const file = path.resolve(root, relative);
  const rel  = path.relative(root, file);

  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(file, (err) => { if (err) next(); });
});

// Public HTML / JS / CSS / JSON files
const publicFiles = new Set([
  'auth.js',
  'basketball.html',
  'cricket.html',
  'football.html',
  'khela_kya.css',
  'khela_kya.html',
  'tennis.html',
  'turfs.html',
  'turfs.css',
  'turfs.js',
  'turfs.json',
]);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'khela_kya.html'));
});

app.get('/:file', (req, res, next) => {
  if (!publicFiles.has(req.params.file)) return next();
  res.sendFile(path.join(__dirname, req.params.file));
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] Khela Kya listening on http://localhost:${PORT}`);
    console.log(`[Server] Database: MongoDB`);
  });

  // Graceful shutdown
  async function shutdown(signal) {
    console.log(`\n[Server] ${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Force exit after 10 s
    setTimeout(() => process.exit(1), 10000);
  }

  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
