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

    // FORCE RE-SEED: Wipe existing data to ensure high-quality data is visible
    console.log('🧹 Clearing existing data for fresh seed...');
    await supabase.from('tournaments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leaderboard').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    await seedTournaments();
    await seedLeaderboard();

    console.log('✅ Supabase Initialization & Professional Seeding Complete!');
  } catch (err) {
    console.error('❌ Supabase Init Error:', err);
  }
}

async function seedTournaments() {
  const tournaments = [
    // ===== LIVE TOURNAMENTS =====
    {
      title: 'NODWIN BGMI Masters Series: Season 3',
      game: 'BGMI', status: 'live',
      prize_pool: '₹1,50,00,000', slots: 24, slots_filled: 24,
      start_date: '2026-04-15', end_date: '2026-05-10',
      registration_deadline: '2026-04-10',
      location: 'Offline — New Delhi (LAN)',
      organizer: 'NODWIN Gaming',
      banner_color: '#FF6B35',
      description: 'The pinnacle of Indian BGMI. 24 elite invited squads battle for the massive 1.5 Crore prize pool in a high-octane LAN environment.',
      rules: ['Squad of 4', 'Invited Teams', 'Device: Mobile Only']
    },
    {
      title: 'Skyesports Free Fire Max Grand Prix',
      game: 'Free Fire Max', status: 'live',
      prize_pool: '₹12,00,000', slots: 64, slots_filled: 62,
      start_date: '2026-04-22', end_date: '2026-05-01',
      registration_deadline: '2026-04-20',
      location: 'Online — South Asia',
      organizer: 'Skyesports India',
      banner_color: '#FF9500',
      description: 'Survival of the fittest! The most aggressive squads in the country compete for glory in this open-for-all grand prix.',
      rules: ['Squad BR Mode', 'No Emulators', 'Official Garena Rules']
    },

    // ===== UPCOMING TOURNAMENTS =====
    {
      title: 'Battlegrounds Mobile India Pro Series (BMPS) 2026',
      game: 'BGMI', status: 'upcoming',
      prize_pool: '₹2,00,00,000', slots: 512, slots_filled: 412,
      start_date: '2026-05-06', end_date: '2026-06-21',
      registration_deadline: '2026-05-02',
      location: 'Online/Offline (Finals)',
      organizer: 'KRAFTON India',
      banner_color: '#10B981',
      description: 'The flagship pro series returns with a massive 2 Crore prize pool. Open qualifiers start May 6th. Road to the ultimate glory!',
      rules: ['Level 40+ Account', 'Squad Mode', 'Anti-Cheat Mandatory']
    },
    {
      title: 'Free Fire MAX India Cup (FFMIC) 2026 Fall',
      game: 'Free Fire Max', status: 'upcoming',
      prize_pool: '₹1,00,00,000', slots: 256, slots_filled: 0,
      start_date: '2026-05-25', end_date: '2026-06-30',
      registration_deadline: '2026-05-20',
      location: 'Online — All India',
      organizer: 'Garena India',
      banner_color: '#F59E0B',
      description: 'The second major official cup of the year. Top teams will qualify for international tournaments.',
      rules: ['Squad Mode', 'Mobile Only', 'Official Tournament Rules']
    },
    {
      title: 'ESL India: CS2 Pro League S1',
      game: 'CS2', status: 'upcoming',
      prize_pool: '₹15,00,000', slots: 16, slots_filled: 12,
      start_date: '2026-05-20', end_date: '2026-06-05',
      registration_deadline: '2026-05-15',
      location: 'Online — Low Latency Nodes',
      organizer: 'ESL Faceit Group',
      banner_color: '#F59E0B',
      description: 'The premier CS2 league for India. 16 teams, one champion, massive stakes.',
      rules: ['Steam Level 10+', 'Prime Status', 'Anti-Cheat Mandatory']
    },
    {
      title: 'Moonton: MLBB Pro League India (MPL)',
      game: 'MLBB', status: 'upcoming',
      prize_pool: '₹20,00,000', slots: 32, slots_filled: 24,
      start_date: '2026-06-01', end_date: '2026-06-15',
      registration_deadline: '2026-05-28',
      location: 'Online — Bangalore Hub',
      organizer: 'Moonton Games',
      banner_color: '#06B6D4',
      description: 'Join the Land of Dawn. Official MPL qualifiers for the M6 World Championship.',
      rules: ['Mythical Glory Rank', '5v5 Classic Draft', 'No 3rd party apps']
    },

    // ===== PAST TOURNAMENTS =====
    {
      title: 'Free Fire MAX India Cup (FFMIC) 2026 Spring',
      game: 'Free Fire Max', status: 'past',
      prize_pool: '₹1,00,00,000', slots: 128, slots_filled: 128,
      start_date: '2026-03-20', end_date: '2026-04-26',
      registration_deadline: '2026-03-15',
      location: 'Offline — Mumbai (Grand Finals)',
      organizer: 'Garena India',
      banner_color: '#8B5CF6',
      description: 'Completed! Team Hind emerged as the champions of the Spring Cup, taking home the lion\'s share of the 1 Crore prize.',
      rules: ['Squad Mode', 'Mobile Only', 'Pro League Qualification']
    },
    {
      title: 'VALORANT Challengers 2026 South Asia: Split 1',
      game: 'Valorant', status: 'past',
      prize_pool: '₹20,00,000', slots: 32, slots_filled: 32,
      start_date: '2026-03-16', end_date: '2026-04-09',
      registration_deadline: '2026-03-10',
      location: 'Online — South Asia',
      organizer: 'Riot Games & NODWIN',
      banner_color: '#FF4655',
      description: 'The first split of the season has concluded. Intense tactical battles saw the region\'s best agents clash.',
      rules: ['Immortal+ Rank', 'Indian Citizenship', '5v5 Tactical Shooter']
    }
  ];

  await supabase.from('tournaments').insert(tournaments);
  console.log(`✅ ${tournaments.length} High-quality tournaments seeded`);
}

async function seedLeaderboard() {
  const players = [
    // BGMI Legends
    { player_name: 'GodL_Jonathan', game: 'BGMI', state: 'Maharashtra', rank: 1, points: 15400, wins: 124, tournaments_played: 156, avatar_color: '#FF6B35' },
    { player_name: 'Soul_Mortal', game: 'BGMI', state: 'Delhi', rank: 2, points: 14800, wins: 110, tournaments_played: 142, avatar_color: '#7B2FFF' },
    { player_name: 'ScoutOP', game: 'BGMI', state: 'Punjab', rank: 3, points: 14200, wins: 102, tournaments_played: 135, avatar_color: '#00F3FF' },
    // Valorant Pros
    { player_name: 'GE_SkRossi', game: 'Valorant', state: 'Karnataka', rank: 1, points: 13900, wins: 95, tournaments_played: 112, avatar_color: '#FF4655' },
    { player_name: 'VLT_Lightningfast', game: 'Valorant', state: 'Kerala', rank: 2, points: 13200, wins: 88, tournaments_played: 105, avatar_color: '#FF9500' },
    // Free Fire Max Stars
    { player_name: 'Total_Gaming', game: 'Free Fire Max', state: 'Gujarat', rank: 1, points: 16800, wins: 145, tournaments_played: 180, avatar_color: '#FF9500' },
    { player_name: 'Badge99_FF', game: 'Free Fire Max', state: 'Uttarakhand', rank: 2, points: 15200, wins: 132, tournaments_played: 165, avatar_color: '#EC4899' },
    // Global/Diverse
    { player_name: 'Tekken_King_IN', game: 'Tekken 8', state: 'West Bengal', rank: 1, points: 12500, wins: 85, tournaments_played: 98, avatar_color: '#EC4899' },
    { player_name: 'MLBB_Slayer', game: 'MLBB', state: 'Assam', rank: 1, points: 11800, wins: 76, tournaments_played: 88, avatar_color: '#06B6D4' }
  ];

  await supabase.from('leaderboard').insert(players);
  console.log('✅ Professional Leaderboard seeded');
}

module.exports = { initDB, supabase };
