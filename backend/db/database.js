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
    // ===== LIVE & ACTIVE =====
    {
      title: 'Battlegrounds Mobile India Pro Series (BMPS) 2026',
      game: 'BGMI', status: 'live',
      prize_pool: '₹2,00,00,000', slots: 64, slots_filled: 64,
      start_date: '2026-05-06', end_date: '2026-06-21',
      registration_deadline: '2026-05-02',
      location: 'Online/Offline (Grand Finals)',
      organizer: 'KRAFTON India',
      banner_color: '#10B981',
      registration_link: 'Invite Only',
      description: 'The flagship pro series returns. 64 elite invited teams battle for a massive 2 Crore prize pool. Watch live on Krafton India Esports YouTube.',
      rules: ['Invite Only', 'Pro Tier Teams', 'Official BMPS 2026 Rulebook']
    },
    {
      title: 'Skyesports Free Fire Max Grand Prix',
      game: 'Free Fire Max', status: 'live',
      prize_pool: '₹12,00,000', slots: 128, slots_filled: 110,
      start_date: '2026-04-22', end_date: '2026-05-05',
      registration_deadline: '2026-04-20',
      location: 'Online — South Asia',
      organizer: 'Skyesports',
      banner_color: '#FF9500',
      registration_link: 'https://skyesports.in/',
      description: 'The Skyesports Grand Prix brings the best Free Fire MAX squads together. Open qualifiers concluded, currently in Group Stages.',
      rules: ['Squad Mode', 'Mobile Only', 'Fair Play Rules']
    },

    // ===== UPCOMING =====
    {
      title: 'VALORANT Challengers 2026 South Asia: Split 2',
      game: 'Valorant', status: 'upcoming',
      prize_pool: '₹20,00,000', slots: 32, slots_filled: 0,
      start_date: '2026-06-10', end_date: '2026-07-15',
      registration_deadline: '2026-06-05',
      location: 'Online — South Asia',
      organizer: 'Riot Games & NODWIN',
      banner_color: '#FF4655',
      registration_link: 'Coming Soon',
      description: 'The road to Ascension continues. Split 2 qualifiers will begin soon for the premier VALORANT circuit in South Asia.',
      rules: ['Immortal 3+ Rank', 'Indian/SA Citizenship', '5v5 Tactical Shooter']
    },
    {
      title: 'Free Fire MAX India Cup (FFMIC) 2026: Fall',
      game: 'Free Fire Max', status: 'upcoming',
      prize_pool: '₹1,00,00,000', slots: 512, slots_filled: 0,
      start_date: '2026-08-15', end_date: '2026-09-30',
      registration_deadline: '2026-08-10',
      location: 'Online — All India',
      organizer: 'Garena India',
      banner_color: '#F59E0B',
      registration_link: 'Coming Soon',
      description: 'The official Fall season major. Registration will open in late July. Top teams qualify for the FFWS Global Finals.',
      rules: ['Account Level 40+', 'Squad Mode', 'Mobile Only']
    },
    {
      title: 'ESL India: CS2 Pro League S1',
      game: 'CS2', status: 'upcoming',
      prize_pool: '₹15,00,000', slots: 16, slots_filled: 8,
      start_date: '2026-05-20', end_date: '2026-06-05',
      registration_deadline: '2026-05-15',
      location: 'Online — Low Latency',
      organizer: 'ESL Faceit Group',
      banner_color: '#2563EB',
      registration_link: 'https://play.eslgaming.com/india',
      description: 'The first official ESL CS2 Pro League for the Indian region. High stakes, elite competition.',
      rules: ['Prime Status', 'Steam Level 10+', 'Anti-Cheat Mandatory']
    },

    // ===== PAST =====
    {
      title: 'Free Fire MAX India Cup (FFMIC) 2026: Spring',
      game: 'Free Fire Max', status: 'past',
      prize_pool: '₹1,00,00,000', slots: 256, slots_filled: 256,
      start_date: '2026-03-20', end_date: '2026-04-26',
      registration_deadline: '2026-03-15',
      location: 'Offline — Ahmedabad (Finals)',
      organizer: 'Garena India',
      banner_color: '#8B5CF6',
      registration_link: 'Completed',
      description: 'Congratulations to **Team Hind** for winning the FFMIC 2026 Spring Cup! They dominated the Grand Finals at Mahatma Mandir.',
      rules: ['Completed Tournament']
    },
    {
      title: 'VALORANT Challengers 2026 South Asia: Split 1',
      game: 'Valorant', status: 'past',
      prize_pool: '₹20,00,000', slots: 32, slots_filled: 32,
      start_date: '2026-03-16', end_date: '2026-04-09',
      registration_deadline: '2026-03-10',
      location: 'Online — South Asia',
      organizer: 'Riot Games & NODWIN',
      banner_color: '#EC4899',
      registration_link: 'Completed',
      description: 'Split 1 has concluded. Top teams have secured their points for the seasonal leaderboard.',
      rules: ['Completed Tournament']
    }
  ];

  await supabase.from('tournaments').insert(tournaments);
  console.log(`✅ ${tournaments.length} Real & Original tournaments seeded`);
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
