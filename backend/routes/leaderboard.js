const express = require('express');
const { supabase } = require('../db/database');
const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { game } = req.query;
    let query = supabase.from('leaderboard').select('*').order('points', { ascending: false });
    
    if (game && game !== 'all') {
      query = query.eq('game', game);
    }

    const { data: players, error } = await query;
    if (error) throw error;

    res.json({ players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
