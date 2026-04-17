const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  try {
    console.log('🚀 Connecting to Supabase PostgreSQL...');

    // 1. Create Tables via raw SQL
    await createTables();

    // 2. Default Seeding mapping via Supabase REST
    const { count: tourCount } = await supabase.from('tournaments').select('*', { count: 'exact', head: true });
    if (tourCount === 0) {
      await seedTournaments();
    }

    const { count: lbCount } = await supabase.from('leaderboard').select('*', { count: 'exact', head: true });
    if (lbCount === 0) {
      await seedLeaderboard();
    }

    console.log('✅ Supabase Connection & Initialization Complete!');
  } catch (err) {
    console.error('❌ Supabase Init Error:', err);
    process.exit(1);
  }
}

async function createTables() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      state TEXT DEFAULT 'India',
      games JSONB DEFAULT '[]'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      game TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      prize_pool TEXT,
      slots INTEGER DEFAULT 0,
      slots_filled INTEGER DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      registration_deadline TEXT,
      location TEXT,
      organizer TEXT,
      banner_color TEXT,
      description TEXT,
      rules JSONB DEFAULT '[]'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      UNIQUE(user_id, tournament_id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      player_name TEXT NOT NULL,
      game TEXT NOT NULL,
      state TEXT,
      rank INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      tournaments_played INTEGER DEFAULT 0,
      avatar_color TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
  `;
  const client = await pool.connect();
  try {
    await client.query(query);
    console.log('✅ PostgreSQL Schema initialized');
  } finally {
    client.release();
  }
}

async function seedTournaments() {
  const tournaments = [
    {
      title: 'BGMI India Masters 2025', game: 'BGMI', status: 'live',
      prize_pool: '₹5,00,000', slots: 64, slots_filled: 58,
      start_date: '2025-04-10', end_date: '2025-04-20',
      registration_deadline: '2025-04-08', location: 'Online',
      organizer: 'Krafton India', banner_color: '#FF6B35',
      description: 'The biggest BGMI tournament in India with massive prize pool. 64 teams battle for glory!',
      rules: ['Team of 4 required', 'No emulators allowed', 'Players must be Indian residents', 'Fair play policy enforced']
    },
    {
      title: 'Valorant Champions India', game: 'Valorant', status: 'upcoming',
      prize_pool: '₹3,00,000', slots: 32, slots_filled: 24,
      start_date: '2025-05-01', end_date: '2025-05-07',
      registration_deadline: '2025-04-28', location: 'Online',
      organizer: 'Riot Games India', banner_color: '#FF4655',
      description: 'India Valorant Championship - prove your worth among the best agents in India!',
      rules: ['Team of 5 required', 'Account must be Iron to Radiant', 'Players from India only', 'No account sharing']
    },
    {
      title: 'Free Fire Max Grand Prix', game: 'Free Fire Max', status: 'upcoming',
      prize_pool: '₹2,00,000', slots: 48, slots_filled: 35,
      start_date: '2025-04-25', end_date: '2025-04-27',
      registration_deadline: '2025-04-22', location: 'Online',
      organizer: 'Garena India', banner_color: '#FF9500',
      description: 'Free Fire Max India Grand Prix - the ultimate battle royale showdown!',
      rules: ['Squad of 4', 'Level 30+ accounts only', 'Indian players only', 'No hacks or mods']
    },
    {
      title: 'CS2 India Open', game: 'CS2', status: 'upcoming',
      prize_pool: '₹1,50,000', slots: 16, slots_filled: 12,
      start_date: '2025-05-10', end_date: '2025-05-12',
      registration_deadline: '2025-05-07', location: 'Online - Mumbai Server',
      organizer: 'ESL India', banner_color: '#F59E0B',
      description: 'Counter-Strike 2 India Open - the premier FPS tournament for Indian players!',
      rules: ['Team of 5 + 1 sub', 'Minimum rank: Silver Elite', 'No VAC banned players', 'Indian residents only']
    },
    {
      title: 'Pokemon Unite Championship', game: 'Pokemon Unite', status: 'past',
      prize_pool: '₹75,000', slots: 128, slots_filled: 128,
      start_date: '2025-03-15', end_date: '2025-03-20',
      registration_deadline: '2025-03-12', location: 'Online',
      organizer: 'TiMi Studio India', banner_color: '#8B5CF6',
      description: 'National Online Pokemon Unite Championship for all Indian players.',
      rules: ['Team of 5 required', 'Indian players only', 'Double elimination']
    },
    {
      title: 'Mobile Legends India Cup', game: 'MLBB', status: 'past',
      prize_pool: '₹1,00,000', slots: 32, slots_filled: 32,
      start_date: '2025-03-01', end_date: '2025-03-05',
      registration_deadline: '2025-02-27', location: 'Online',
      organizer: 'Moonton India', banner_color: '#06B6D4',
      description: 'Mobile Legends Bang Bang India Cup - the premier MOBA tournament.',
      rules: ['Team of 5', 'Mythic rank required', 'Indian players only', 'No smurfing']
    },
    {
      title: 'Tekken 8 India Clash', game: 'Tekken 8', status: 'upcoming',
      prize_pool: '₹50,000', slots: 64, slots_filled: 41,
      start_date: '2025-05-20', end_date: '2025-05-21',
      registration_deadline: '2025-05-17', location: 'Online',
      organizer: 'Bandai Namco India', banner_color: '#EC4899',
      description: "India's biggest Tekken 8 tournament with players from across the country!",
      rules: ['1v1 singles bracket', 'Double elimination', 'All characters allowed', 'Best of 3 rounds']
    },
    {
      title: 'BGMI Rookie Cup', game: 'BGMI', status: 'live',
      prize_pool: '₹50,000', slots: 32, slots_filled: 28,
      start_date: '2025-04-12', end_date: '2025-04-15',
      registration_deadline: '2025-04-11', location: 'Online',
      organizer: 'Esports Hub India', banner_color: '#10B981',
      description: 'Special tournament for beginner BGMI players to kickstart their esports journey!',
      rules: ['Solo/Duo/Squad modes', 'New players welcome', 'Bronze-Silver tier only', 'Fair play mandatory']
    }
  ];

  await supabase.from('tournaments').insert(tournaments);
  console.log('✅ Tournaments seeded');
}

async function seedLeaderboard() {
  const players = [
    { player_name: 'ScorpionX', game: 'BGMI', state: 'Maharashtra', rank: 1, points: 9850, wins: 47, tournaments_played: 62, avatar_color: '#FF6B35' },
    { player_name: 'NightHawk_IN', game: 'BGMI', state: 'Delhi', rank: 2, points: 9600, wins: 43, tournaments_played: 58, avatar_color: '#7B2FFF' },
    { player_name: 'ThunderStrike', game: 'BGMI', state: 'Punjab', rank: 3, points: 9200, wins: 41, tournaments_played: 55, avatar_color: '#00F3FF' },
    { player_name: 'ViperByte', game: 'Valorant', state: 'Karnataka', rank: 1, points: 9750, wins: 38, tournaments_played: 45, avatar_color: '#FF4655' },
    { player_name: 'CrypticAim', game: 'Valorant', state: 'Tamil Nadu', rank: 2, points: 9400, wins: 35, tournaments_played: 42, avatar_color: '#FF9500' },
    { player_name: 'ShadowAgent', game: 'Valorant', state: 'Telangana', rank: 3, points: 9100, wins: 32, tournaments_played: 40, avatar_color: '#10B981' },
    { player_name: 'FirePhoenix', game: 'Free Fire Max', state: 'West Bengal', rank: 1, points: 9900, wins: 52, tournaments_played: 68, avatar_color: '#FF9500' },
    { player_name: 'BlazingGhost', game: 'Free Fire Max', state: 'Bihar', rank: 2, points: 9500, wins: 48, tournaments_played: 63, avatar_color: '#EC4899' },
    { player_name: 'StormSurge', game: 'Free Fire Max', state: 'Uttar Pradesh', rank: 3, points: 9200, wins: 44, tournaments_played: 59, avatar_color: '#8B5CF6' },
    { player_name: 'HeadshotKing', game: 'CS2', state: 'Gujarat', rank: 1, points: 9600, wins: 28, tournaments_played: 35, avatar_color: '#F59E0B' },
    { player_name: 'AWPMaster', game: 'CS2', state: 'Rajasthan', rank: 2, points: 9300, wins: 25, tournaments_played: 32, avatar_color: '#06B6D4' },
    { player_name: 'BombSquad', game: 'CS2', state: 'Kerala', rank: 3, points: 9000, wins: 22, tournaments_played: 30, avatar_color: '#FF2D78' }
  ];

  await supabase.from('leaderboard').insert(players);
  console.log('✅ Leaderboard seeded');
}

module.exports = { initDB, supabase };
