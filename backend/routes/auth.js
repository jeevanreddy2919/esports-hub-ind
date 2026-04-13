const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db/database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'esportshubindia_secret_2025';

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, state, games } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
    
    const db = getDB();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password, state, games) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, hashed, state || 'Maharashtra', JSON.stringify(games || []));

    const user = db.prepare('SELECT id, name, email, state, games, rank, points, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ error: 'Email or Full Name and password required' });

    const db = getDB();
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR name = ?').get(identifier, identifier);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDB();
    const user = db.prepare('SELECT id, name, email, state, games, rank, points, created_at FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
