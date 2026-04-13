const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDB } = require('./db/database');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const chatRoutes = require('./routes/chat');
const leaderboardRoutes = require('./routes/leaderboard');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize database
initDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Esports Hub India Backend Running!' });
});

app.listen(PORT, () => {
  console.log(`🎮 Esports Hub India Backend running on port ${PORT}`);
});
