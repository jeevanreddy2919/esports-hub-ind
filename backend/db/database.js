const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../data/esports.db');

let db;

function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDB() {
  const fs = require('fs');
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const database = getDB();

  // Create tables
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      state TEXT DEFAULT 'Maharashtra',
      games TEXT DEFAULT '[]',
      avatar TEXT DEFAULT '',
      rank TEXT DEFAULT 'Rookie',
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      game TEXT NOT NULL,
      game_icon TEXT DEFAULT '',
      status TEXT DEFAULT 'upcoming',
      prize_pool TEXT DEFAULT '₹10,000',
      slots INTEGER DEFAULT 64,
      slots_filled INTEGER DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT,
      registration_deadline TEXT,
      location TEXT DEFAULT 'Online',
      organizer TEXT DEFAULT 'Esports Hub India',
      description TEXT DEFAULT '',
      rules TEXT DEFAULT '[]',
      banner_color TEXT DEFAULT '#7B2FFF',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      tournament_id INTEGER,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      UNIQUE(user_id, tournament_id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      game TEXT NOT NULL,
      state TEXT DEFAULT 'Maharashtra',
      rank INTEGER DEFAULT 1,
      points INTEGER DEFAULT 1000,
      wins INTEGER DEFAULT 0,
      tournaments_played INTEGER DEFAULT 0,
      avatar_color TEXT DEFAULT '#7B2FFF'
    );
  `);

  // Seed data if empty
  const tourCount = database.prepare('SELECT COUNT(*) as c FROM tournaments').get();
  if (tourCount.c === 0) {
    seedTournaments(database);
  }

  const lbCount = database.prepare('SELECT COUNT(*) as c FROM leaderboard').get();
  if (lbCount.c === 0) {
    seedLeaderboard(database);
  }

  console.log('✅ SQLite Database initialized');
}

function seedTournaments(db) {
  const tournaments = [
    {
      title: 'BGMI India Masters 2025', game: 'BGMI', status: 'live',
      prize_pool: '₹5,00,000', slots: 64, slots_filled: 58,
      start_date: '2025-04-10', end_date: '2025-04-20',
      registration_deadline: '2025-04-08', location: 'Online',
      organizer: 'Krafton India', banner_color: '#FF6B35',
      description: 'The biggest BGMI tournament in India with massive prize pool. 64 teams battle for glory!',
      rules: JSON.stringify(['Team of 4 required', 'No emulators allowed', 'Players must be Indian residents', 'Fair play policy enforced'])
    },
    {
      title: 'Valorant Champions India', game: 'Valorant', status: 'upcoming',
      prize_pool: '₹3,00,000', slots: 32, slots_filled: 24,
      start_date: '2025-05-01', end_date: '2025-05-07',
      registration_deadline: '2025-04-28', location: 'Online',
      organizer: 'Riot Games India', banner_color: '#FF4655',
      description: 'India Valorant Championship - prove your worth among the best agents in India!',
      rules: JSON.stringify(['Team of 5 required', 'Account must be Iron to Radiant', 'Players from India only', 'No account sharing'])
    },
    {
      title: 'Free Fire Grand Prix', game: 'Free Fire', status: 'upcoming',
      prize_pool: '₹2,00,000', slots: 48, slots_filled: 35,
      start_date: '2025-04-25', end_date: '2025-04-27',
      registration_deadline: '2025-04-22', location: 'Online',
      organizer: 'Garena India', banner_color: '#FF9500',
      description: 'Free Fire India Grand Prix - the ultimate battle royale showdown!',
      rules: JSON.stringify(['Squad of 4', 'Level 30+ accounts only', 'Indian players only', 'No hacks or mods'])
    },
    {
      title: 'CS2 India Open', game: 'CS2', status: 'upcoming',
      prize_pool: '₹1,50,000', slots: 16, slots_filled: 12,
      start_date: '2025-05-10', end_date: '2025-05-12',
      registration_deadline: '2025-05-07', location: 'Online - Mumbai Server',
      organizer: 'ESL India', banner_color: '#F59E0B',
      description: 'Counter-Strike 2 India Open - the premier FPS tournament for Indian players!',
      rules: JSON.stringify(['Team of 5 + 1 sub', 'Minimum rank: Silver Elite', 'No VAC banned players', 'Indian residents only'])
    },
    {
      title: 'Chess Online National', game: 'Chess', status: 'past',
      prize_pool: '₹75,000', slots: 128, slots_filled: 128,
      start_date: '2025-03-15', end_date: '2025-03-20',
      registration_deadline: '2025-03-12', location: 'Online - Chess.com',
      organizer: 'Chess Federation of India', banner_color: '#8B5CF6',
      description: 'National Online Chess Championship for all Indian players.',
      rules: JSON.stringify(['Individual competition', 'FIDE ID required', 'Indian nationals only', 'Rapid format: 10+5'])
    },
    {
      title: 'Mobile Legends India Cup', game: 'MLBB', status: 'past',
      prize_pool: '₹1,00,000', slots: 32, slots_filled: 32,
      start_date: '2025-03-01', end_date: '2025-03-05',
      registration_deadline: '2025-02-27', location: 'Online',
      organizer: 'Moonton India', banner_color: '#06B6D4',
      description: 'Mobile Legends Bang Bang India Cup - the premier MOBA tournament.',
      rules: JSON.stringify(['Team of 5', 'Mythic rank required', 'Indian players only', 'No smurfing'])
    },
    {
      title: 'Tekken 8 India Clash', game: 'Tekken 8', status: 'upcoming',
      prize_pool: '₹50,000', slots: 64, slots_filled: 41,
      start_date: '2025-05-20', end_date: '2025-05-21',
      registration_deadline: '2025-05-17', location: 'Online',
      organizer: 'Bandai Namco India', banner_color: '#EC4899',
      description: 'India\'s biggest Tekken 8 tournament with players from across the country!',
      rules: JSON.stringify(['1v1 singles bracket', 'Double elimination', 'All characters allowed', 'Best of 3 rounds'])
    },
    {
      title: 'BGMI Rookie Cup', game: 'BGMI', status: 'live',
      prize_pool: '₹50,000', slots: 32, slots_filled: 28,
      start_date: '2025-04-12', end_date: '2025-04-15',
      registration_deadline: '2025-04-11', location: 'Online',
      organizer: 'Esports Hub India', banner_color: '#10B981',
      description: 'Special tournament for beginner BGMI players to kickstart their esports journey!',
      rules: JSON.stringify(['Solo/Duo/Squad modes', 'New players welcome', 'Bronze-Silver tier only', 'Fair play mandatory'])
    },
  ];

  const insert = db.prepare(`
    INSERT INTO tournaments (title, game, status, prize_pool, slots, slots_filled, start_date, end_date, registration_deadline, location, organizer, banner_color, description, rules)
    VALUES (@title, @game, @status, @prize_pool, @slots, @slots_filled, @start_date, @end_date, @registration_deadline, @location, @organizer, @banner_color, @description, @rules)
  `);

  tournaments.forEach(t => insert.run(t));
  console.log('✅ Tournaments seeded');
}

function seedLeaderboard(db) {
  const players = [
    { player_name: 'ScorpionX', game: 'BGMI', state: 'Maharashtra', rank: 1, points: 9850, wins: 47, tournaments_played: 62, avatar_color: '#FF6B35' },
    { player_name: 'NightHawk_IN', game: 'BGMI', state: 'Delhi', rank: 2, points: 9600, wins: 43, tournaments_played: 58, avatar_color: '#7B2FFF' },
    { player_name: 'ThunderStrike', game: 'BGMI', state: 'Punjab', rank: 3, points: 9200, wins: 41, tournaments_played: 55, avatar_color: '#00F3FF' },
    { player_name: 'ViperByte', game: 'Valorant', state: 'Karnataka', rank: 1, points: 9750, wins: 38, tournaments_played: 45, avatar_color: '#FF4655' },
    { player_name: 'CrypticAim', game: 'Valorant', state: 'Tamil Nadu', rank: 2, points: 9400, wins: 35, tournaments_played: 42, avatar_color: '#FF9500' },
    { player_name: 'ShadowAgent', game: 'Valorant', state: 'Telangana', rank: 3, points: 9100, wins: 32, tournaments_played: 40, avatar_color: '#10B981' },
    { player_name: 'FirePhoenix', game: 'Free Fire', state: 'West Bengal', rank: 1, points: 9900, wins: 52, tournaments_played: 68, avatar_color: '#FF9500' },
    { player_name: 'BlazingGhost', game: 'Free Fire', state: 'Bihar', rank: 2, points: 9500, wins: 48, tournaments_played: 63, avatar_color: '#EC4899' },
    { player_name: 'StormSurge', game: 'Free Fire', state: 'Uttar Pradesh', rank: 3, points: 9200, wins: 44, tournaments_played: 59, avatar_color: '#8B5CF6' },
    { player_name: 'HeadshotKing', game: 'CS2', state: 'Gujarat', rank: 1, points: 9600, wins: 28, tournaments_played: 35, avatar_color: '#F59E0B' },
    { player_name: 'AWPMaster', game: 'CS2', state: 'Rajasthan', rank: 2, points: 9300, wins: 25, tournaments_played: 32, avatar_color: '#06B6D4' },
    { player_name: 'BombSquad', game: 'CS2', state: 'Kerala', rank: 3, points: 9000, wins: 22, tournaments_played: 30, avatar_color: '#FF2D78' },
  ];

  const insert = db.prepare(`
    INSERT INTO leaderboard (player_name, game, state, rank, points, wins, tournaments_played, avatar_color)
    VALUES (@player_name, @game, @state, @rank, @points, @wins, @tournaments_played, @avatar_color)
  `);

  players.forEach(p => insert.run(p));
  console.log('✅ Leaderboard seeded');
}

module.exports = { getDB, initDB };
