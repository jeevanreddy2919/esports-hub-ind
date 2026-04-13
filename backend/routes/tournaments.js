const express = require('express');
const { getDB } = require('../db/database');
const router = express.Router();

// GET /api/tournaments
router.get('/', (req, res) => {
  try {
    const { game, status, search } = req.query;
    const db = getDB();
    let query = 'SELECT * FROM tournaments WHERE 1=1';
    const params = [];
    if (game && game !== 'all') { query += ' AND game = ?'; params.push(game); }
    if (status && status !== 'all') { query += ' AND status = ?'; params.push(status); }
    if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }
    query += ' ORDER BY created_at DESC';
    const tournaments = db.prepare(query).all(...params);
    res.json({ tournaments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tournaments/:id
router.get('/:id', (req, res) => {
  try {
    const db = getDB();
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ tournament });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tournaments/:id/register
router.post('/:id/register', (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'esportshubindia_secret_2025';
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Login required to register' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDB();
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (tournament.status === 'past') return res.status(400).json({ error: 'Tournament has ended' });
    if (tournament.slots_filled >= tournament.slots) return res.status(400).json({ error: 'Tournament is full' });
    db.prepare('INSERT OR IGNORE INTO registrations (user_id, tournament_id) VALUES (?, ?)').run(decoded.id, req.params.id);
    db.prepare('UPDATE tournaments SET slots_filled = slots_filled + 1 WHERE id = ? AND slots_filled < slots').run(req.params.id);
    res.json({ success: true, message: 'Successfully registered!' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Already registered' });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tournaments/user/registered
router.get('/user/registered', (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'esportshubindia_secret_2025';
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Login required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDB();
    const registrations = db.prepare(`
      SELECT t.* FROM tournaments t
      JOIN registrations r ON t.id = r.tournament_id
      WHERE r.user_id = ?
    `).all(decoded.id);
    res.json({ tournaments: registrations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
