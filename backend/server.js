const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDB } = require('./db/database');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const chatRoutes = require('./routes/chat');
const leaderboardRoutes = require('./routes/leaderboard');
const notificationRoutes = require('./routes/notifications');

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
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Esports Hub India Backend Running!' });
});

// Serve static frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for React SPA, ignore unhandled API routes
app.get('/:path*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🎮 Esports Hub India Backend running on port ${PORT}`);
});
