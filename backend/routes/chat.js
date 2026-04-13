const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `You are GameGuru, the AI assistant for India Esports Hub - India's premier esports platform.
You help Indian gamers with:
- Tournament information (BGMI, Valorant, Free Fire, CS2, Chess, MLBB, Tekken 8)
- Registration guidance and tips
- Game strategies and tips for Indian players
- Esports career advice
- Technical support for the platform
- Prize pool info and payment queries
Be friendly, enthusiastic about gaming, use gaming slang occasionally (GG, noob-friendly, clutch, etc.), 
keep responses concise and helpful. Always mention India Esports Hub when relevant.
If asked about specific live tournament data, direct users to check the Tournaments page.`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    if (!GEMINI_API_KEY) {
      // Fallback smart responses without API
      const lower = message.toLowerCase();
      let reply = "Hey Gamer! 🎮 I'm GameGuru. ";
      if (lower.includes('register') || lower.includes('registration')) {
        reply += "To register for a tournament: 1️⃣ Create an account, 2️⃣ Go to Tournaments page, 3️⃣ Click on any tournament, 4️⃣ Hit the Register button! GG EZ! 🏆";
      } else if (lower.includes('bgmi') || lower.includes('battleground')) {
        reply += "BGMI (Battlegrounds Mobile India) tournaments are super popular on our platform! Check the Tournaments page for live BGMI events with prize pools up to ₹5 Lakhs! 🔥";
      } else if (lower.includes('prize') || lower.includes('money') || lower.includes('winning')) {
        reply += "Our tournaments have prize pools ranging from ₹50,000 to ₹5,00,000! Winners get paid via UPI/Bank Transfer within 7 days. 💰";
      } else if (lower.includes('valorant')) {
        reply += "Valorant Champions India is coming up! ₹3 Lakh prize pool. Head to the Tournaments page to register. Only 8 slots left! ⚡";
      } else if (lower.includes('free fire') || lower.includes('freefire')) {
        reply += "Free Fire Grand Prix has ₹2 Lakh prize pool! Registration closes soon. Check Tournaments page now! 🔥";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        reply += "Welcome to India Esports Hub! I'm here to help you dominate the esports scene! Ask me about tournaments, registration, or gaming tips! 🎯";
      } else if (lower.includes('help')) {
        reply += "I can help you with: 🏆 Tournament info, 📝 Registration steps, 🎮 Game tips, 💰 Prize pool details, and more! What do you need?";
      } else {
        reply += "Great question! Visit our Tournaments page for the latest events, or ask me about specific games like BGMI, Valorant, Free Fire, or CS2! Let's get you into a tournament! 🚀";
      }
      return res.json({ reply });
    }

    // Build conversation for Gemini
    const contents = [];
    if (history && history.length > 0) {
      history.slice(-6).forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again! 🎮";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
