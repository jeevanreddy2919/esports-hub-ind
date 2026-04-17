const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Required for Gemini API on Node.js
const { supabase } = require('../db/database');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT_BASE = `You are NeuroGamer, the ultimate AI Esports Mentor & Assistant for "India Esports Hub". 
Your goal is to help players dominate the Indian esports scene.

KNOWLEDGE BASE:
- PLATFORM: India Esports Hub is India's top site for BGMI, Valorant, and Free Fire Max tournaments.
- REGISTRATION: To join any tournament: 1. Sign up for an account. 2. Visit the 'Tournaments' page. 3. Click 'Join Now' on your favorite game. 
- PRIZES: We offer prize pools from ₹10,000 to ₹5,00,000. Payouts are 100% secure via UPI or Bank Transfer within 72 hours of tournament completion.
- SUPPORT: If a player is stuck, tell them to "Open a Support Ticket" in their profile or check the Rules tab.

STRICT RULES:
1. NEVER start a response with an introduction like "Hey Gamer! I'm NeuroGamer" once the conversation has started.
2. Answer every query DIRECTLY and CONCISELY.
3. Use the LIVE TOURNAMENT DATA provided below.

PERSONALITY:
- Be a Mentor/Coach: Dynamic, professional, and encouraging. Use gaming slang naturally.`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Safely Fetch Live Tournament Data
    let liveDataStr = '';
    try {
      const { data: liveTournaments, error } = await supabase.from('tournaments')
        .select('title, game, status, slots, slots_filled')
        .neq('status', 'past');
      if (error) throw error;
      liveDataStr = liveTournaments.map(t => 
        `- ${t.title} (${t.game}): ${t.status.toUpperCase()}, Slots: ${t.slots_filled}/${t.slots}`
      ).join('\n');
    } catch (dbErr) {
      console.error('ChatBot DB Error:', dbErr);
    }

    const FINAL_SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}\n\nLIVE TOURNAMENT DATA:\n${liveDataStr || 'Check the Tournaments page for updates.'}`;

    // Helper for fallback response
    const getFallbackReply = (msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('register')) return "To register: 1. Sign up. 2. Visit Tournaments page. 3. Click 'Join Now'! 🏆";
      if (lower.includes('bgmi')) return "BGMI events are live! Check the Tournaments page for details and ₹5L prize pools! 🔥";
      if (lower.includes('prize') || lower.includes('money')) return "Prizes range from ₹50k to ₹5L, paid via UPI/Bank within 72h. 💰";
      if (lower.includes('tournament')) return liveDataStr ? `Live events:\n${liveDataStr}` : "All active tournaments are listed on our main Tournaments page! 🚀";
      return "I'm currently optimizing my systems. Please check our Tournaments page for real-time info! 🎮";
    };

    if (!GEMINI_API_KEY) {
      return res.json({ reply: getFallbackReply(message) });
    }

    // Build conversation for Gemini
    const contents = [];
    if (history && history.length > 0) {
      history.slice(-6).forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: FINAL_SYSTEM_PROMPT }] },
            contents,
            generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackReply(message);
      res.json({ reply });

    } catch (aiErr) {
      console.error('ChatBot AI Error:', aiErr);
      res.json({ reply: getFallbackReply(message) });
    }
  } catch (err) {
    console.error('Critical ChatBot Route Error:', err);
    res.status(500).json({ error: 'System busy. Please try again or check Tournaments page.' });
  }
});

module.exports = router;
