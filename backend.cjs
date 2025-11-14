const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'database.db'));
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';

function cookieOpts() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

app.use(express.json());
app.use(cookieParser());

const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // llamadas server-to-server o curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, nombre: user.nombre }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return res.status(409).json({ message: 'Usuario ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (nombre,email,password,role) VALUES (?,?,?,?)')
      .run(nombre, email, hash, 'user');

    const user = { id: info.lastInsertRowid, nombre, email, role: 'user' };
    const token = generateToken(user);
    res.cookie('token', token, cookieOpts());
    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!row) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = { id: row.id, nombre: row.nombre, email: row.email, role: row.role };
    const token = generateToken(user);
    res.cookie('token', token, cookieOpts());
    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/logout', (req, res) => {
  const opts = cookieOpts();
  res.clearCookie('token', { sameSite: opts.sameSite, secure: opts.secure });
  res.json({ message: 'Sesión cerrada' });
});

app.get('/api/verify', (req, res) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ','');
    if (!token) return res.status(401).json({ message: 'No autorizado' });
    const data = jwt.verify(token, JWT_SECRET);
    return res.json({ user: data });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
});

function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ','');
    if (!token) return res.status(401).json({ message: 'No autorizado' });
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'No autorizado' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autorizado' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Acceso denegado' });
    next();
  }
}

app.get('/api/admin/secret', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ secret: 'Solo admins pueden ver esto', user: req.user });
});

// Endpoint de salud para monitor y pruebas en hosting
app.get('/api/health', (req, res) => {
  try {
    const countRow = db.prepare('SELECT COUNT(*) AS total FROM users').get();
    res.json({ ok: true, timestamp: new Date().toISOString(), users: countRow.total });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de autenticación corriendo en http://localhost:${PORT}`);
});

module.exports = app;
