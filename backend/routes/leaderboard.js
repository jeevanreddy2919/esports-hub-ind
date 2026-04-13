const express = require('express');
const { getDB } = require('../db/database');
const router = express.Router();

// GET /api/leaderboard
router.get('/', (req, res) => {
  try {
    const { game } = req.query;
    const db = getDB();
    let query = 'SELECT * FROM leaderboard WHERE 1=1';
    const params = [];
    if (game && game !== 'all') { query += ' AND game = ?'; params.push(game); }
    query += ' ORDER BY points DESC';
    const players = db.prepare(query).all(...params);
    res.json({ players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
