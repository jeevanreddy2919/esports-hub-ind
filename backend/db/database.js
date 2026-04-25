const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function initDB() {
  try {
    console.log('🚀 Connecting to Supabase...');

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

async function seedTournaments() {
  const tournaments = [
    // ===== LIVE TOURNAMENTS =====
    {
      title: 'NODWIN BGMI Masters Series S3',
      game: 'BGMI', status: 'live',
      prize_pool: '₹12,50,000', slots: 64, slots_filled: 64,
      start_date: '2026-04-15', end_date: '2026-04-25',
      registration_deadline: '2026-04-12',
      location: 'Online — All India',
      organizer: 'NODWIN Gaming',
      banner_color: '#FF6B35',
      description: 'The biggest BGMI Masters Series returns! 64 elite squads battle for ₹12.5 Lakhs.',
      rules: ['Squad of 4', 'No emulators', 'Indian residents only']
    },
    {
      title: 'Skyesports Free Fire Max Cup',
      game: 'Free Fire Max', status: 'live',
      prize_pool: '₹4,50,000', slots: 48, slots_filled: 45,
      start_date: '2026-04-20', end_date: '2026-04-28',
      registration_deadline: '2026-04-18',
      location: 'Online — Battle Royale',
      organizer: 'Skyesports India',
      banner_color: '#FF9500',
      description: 'Survival of the fittest! ₹4.5 Lakhs on the line for India\'s top squads.',
      rules: ['4-player squads', 'Account lvl 30+', 'Mobile only']
    },
    // ===== UPCOMING TOURNAMENTS =====
    {
      title: 'Riot Games: India Valorant Championship',
      game: 'Valorant', status: 'upcoming',
      prize_pool: '₹7,00,000', slots: 32, slots_filled: 26,
      start_date: '2026-05-05', end_date: '2026-05-15',
      registration_deadline: '2026-05-02',
      location: 'Online — India Server',
      organizer: 'Riot Games India',
      banner_color: '#FF4655',
      description: '32 of India\'s sharpest agents go head-to-head for the 2026 title.',
      rules: ['5 players + 1 sub', 'Min rank: Diamond III', 'Indian accounts only']
    },
    {
      title: 'Krafton BGMI Invitational Q2',
      game: 'BGMI', status: 'upcoming',
      prize_pool: '₹8,75,000', slots: 32, slots_filled: 24,
      start_date: '2026-05-14', end_date: '2026-05-22',
      registration_deadline: '2026-05-10',
      location: 'Online — Erangel Server',
      organizer: 'Krafton India',
      banner_color: '#10B981',
      description: 'Exclusive invitational for India\'s most skilled BGMI squads.',
      rules: ['Invited teams only', 'Squad of 4', 'Fair play strictly enforced']
    },
    {
      title: 'The Arena CS2 Pro League S1',
      game: 'CS2', status: 'upcoming',
      prize_pool: '₹3,50,000', slots: 16, slots_filled: 10,
      start_date: '2026-05-22', end_date: '2026-05-30',
      registration_deadline: '2026-05-18',
      location: 'Online — Mumbai Servers',
      organizer: 'Arena Hub India',
      banner_color: '#F59E0B',
      description: '16 powerhouse teams face off for ₹3.5 Lakhs in the Pro League.',
      rules: ['5 players + 1 sub', 'Prime status required', 'No active bans']
    },
    {
      title: 'Moonton MLBB India Nationals',
      game: 'MLBB', status: 'upcoming',
      prize_pool: '₹2,50,000', slots: 32, slots_filled: 18,
      start_date: '2026-05-30', end_date: '2026-06-08',
      registration_deadline: '2026-05-25',
      location: 'Online — India Server',
      organizer: 'Moonton Games',
      banner_color: '#06B6D4',
      description: 'Battle in the Land of Dawn! ₹2.5 Lakhs for the national champions.',
      rules: ['5 players + 1 sub', 'Min rank: Mythic', 'Mobile only']
    },
    {
      title: 'Bandai Namco: Tekken 8 India Cup',
      game: 'Tekken 8', status: 'upcoming',
      prize_pool: '₹1,50,000', slots: 64, slots_filled: 42,
      start_date: '2026-06-10', end_date: '2026-06-12',
      registration_deadline: '2026-06-08',
      location: 'Online — FGC Community',
      organizer: 'Bandai Namco India',
      banner_color: '#EC4899',
      description: 'India\'s premier Tekken 8 tournament. 64 fighters, 1 champion.',
      rules: ['1v1 singles', 'Double elimination', 'Best of 3']
    },
    // ===== PAST TOURNAMENTS =====
    {
      title: 'BGMI Masters Series 2025',
      game: 'BGMI', status: 'past',
      prize_pool: '₹15,00,000', slots: 64, slots_filled: 64,
      start_date: '2025-12-01', end_date: '2025-12-15',
      registration_deadline: '2025-11-25',
      location: 'Offline — New Delhi',
      organizer: 'NODWIN Gaming',
      banner_color: '#FF6B35',
      description: 'The largest BGMI event of 2025 with a record prize pool.',
      rules: ['Squad of 4', 'LAN Finals']
    }
  ];

  await supabase.from('tournaments').insert(tournaments);
  console.log('✅ Tournaments seeded');
}

async function seedLeaderboard() {
  const players = [
    // BGMI
    { player_name: 'Jonathan', game: 'BGMI', state: 'Goa', rank: 1, points: 12500, wins: 78, tournaments_played: 95, avatar_color: '#FF6B35' },
    { player_name: 'Mortal', game: 'BGMI', state: 'Delhi', rank: 2, points: 11800, wins: 71, tournaments_played: 90, avatar_color: '#7B2FFF' },
    { player_name: 'Scout', game: 'BGMI', state: 'Punjab', rank: 3, points: 11200, wins: 65, tournaments_played: 85, avatar_color: '#00F3FF' },
    { player_name: 'Ronak', game: 'BGMI', state: 'Rajasthan', rank: 4, points: 10700, wins: 60, tournaments_played: 78, avatar_color: '#FF9500' },
    { player_name: 'GodL_Mavi', game: 'BGMI', state: 'Haryana', rank: 5, points: 10200, wins: 55, tournaments_played: 72, avatar_color: '#10B981' },
    // Valorant
    { player_name: 'Reg1na', game: 'Valorant', state: 'Kerala', rank: 1, points: 11900, wins: 58, tournaments_played: 67, avatar_color: '#FF4655' },
    { player_name: 'Lightningfast', game: 'Valorant', state: 'Karnataka', rank: 2, points: 11300, wins: 52, tournaments_played: 62, avatar_color: '#FF9500' },
    { player_name: 'SkRossi', game: 'Valorant', state: 'Tamil Nadu', rank: 3, points: 10800, wins: 48, tournaments_played: 58, avatar_color: '#10B981' },
    { player_name: 'Vyse', game: 'Valorant', state: 'Maharashtra', rank: 4, points: 10200, wins: 44, tournaments_played: 54, avatar_color: '#8B5CF6' },
    { player_name: 'Marzil', game: 'Valorant', state: 'Telangana', rank: 5, points: 9700, wins: 40, tournaments_played: 50, avatar_color: '#06B6D4' },
    // Free Fire Max
    { player_name: 'Badge99', game: 'Free Fire Max', state: 'Tamil Nadu', rank: 1, points: 12800, wins: 88, tournaments_played: 105, avatar_color: '#FF9500' },
    { player_name: 'Nobru_IND', game: 'Free Fire Max', state: 'Maharashtra', rank: 2, points: 12100, wins: 80, tournaments_played: 98, avatar_color: '#EC4899' },
    { player_name: 'Two-side Gamers', game: 'Free Fire Max', state: 'Assam', rank: 3, points: 11500, wins: 74, tournaments_played: 90, avatar_color: '#8B5CF6' },
    { player_name: 'Raistar', game: 'Free Fire Max', state: 'Gujarat', rank: 4, points: 10900, wins: 68, tournaments_played: 84, avatar_color: '#FF6B35' },
    { player_name: 'Pahadi FF', game: 'Free Fire Max', state: 'Uttarakhand', rank: 5, points: 10300, wins: 62, tournaments_played: 78, avatar_color: '#10B981' },
    // CS2
    { player_name: 'f0rsaken', game: 'CS2', state: 'Tamil Nadu', rank: 1, points: 11600, wins: 42, tournaments_played: 55, avatar_color: '#F59E0B' },
    { player_name: 'Menace', game: 'CS2', state: 'Maharashtra', rank: 2, points: 11000, wins: 38, tournaments_played: 50, avatar_color: '#06B6D4' },
    { player_name: 'brutmonster', game: 'CS2', state: 'Delhi', rank: 3, points: 10400, wins: 34, tournaments_played: 45, avatar_color: '#FF2D78' },
    // MLBB
    { player_name: 'Kaisar', game: 'MLBB', state: 'Assam', rank: 1, points: 10500, wins: 45, tournaments_played: 58, avatar_color: '#06B6D4' },
    { player_name: 'Ganesh', game: 'MLBB', state: 'Karnataka', rank: 2, points: 9900, wins: 40, tournaments_played: 52, avatar_color: '#7B2FFF' },
    { player_name: 'YourFriend', game: 'MLBB', state: 'West Bengal', rank: 3, points: 9400, wins: 36, tournaments_played: 47, avatar_color: '#FF9500' },
  ];

  await supabase.from('leaderboard').insert(players);
  console.log('✅ Leaderboard seeded');
}

module.exports = { initDB, supabase };
