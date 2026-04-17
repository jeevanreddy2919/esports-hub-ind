const express = require('express');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'esportshubindia_secret_2025';

// GET /api/tournaments
router.get('/', async (req, res) => {
  try {
    const { game, status, search } = req.query;
    
    let query = supabase.from('tournaments').select('*').order('created_at', { ascending: false });
    
    if (game && game !== 'all') query = query.eq('game', game);
    if (status && status !== 'all') query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data: tournaments, error } = await query;
    if (error) throw error;

    res.json({ tournaments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tournaments/:id
router.get('/:id', async (req, res) => {
  try {
    const { data: tournament, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ tournament });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tournaments/:id/register
router.post('/:id/register', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Login required to register' });
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get tournament
    const { data: tournament, error: tErr } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (tErr || !tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (tournament.status === 'past') return res.status(400).json({ error: 'Tournament has ended' });
    if (tournament.slots_filled >= tournament.slots) return res.status(400).json({ error: 'Tournament is full' });

    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', decoded.id)
      .eq('tournament_id', req.params.id)
      .single();

    if (existing) return res.status(409).json({ error: 'Already registered' });

    // Insert registration
    const { error: insertErr } = await supabase
      .from('registrations')
      .insert([{ user_id: decoded.id, tournament_id: req.params.id }]);

    if (insertErr) throw insertErr;

    // Increment slots filled
    // Supabase has no direct increment inside JS client without an RPC, so we do it explicitly:
    await supabase
      .from('tournaments')
      .update({ slots_filled: tournament.slots_filled + 1 })
      .eq('id', req.params.id);

    res.json({ success: true, message: 'Successfully registered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tournaments/user/registered
router.get('/user/registered', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Login required' });
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user's registrations along with joined tournaments
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        tournaments (*)
      `)
      .eq('user_id', decoded.id);

    if (error) throw error;

    const tournaments = registrations.map(r => r.tournaments).filter(t => t !== null);
    
    res.json({ tournaments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
