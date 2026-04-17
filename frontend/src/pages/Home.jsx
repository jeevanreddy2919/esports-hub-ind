import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import CountdownTimer from '../components/CountdownTimer';
import logo from '../assets/logo_final.png';
import { GameIcon } from '../utils/gameLogos';

/* ─────────────── DATA ─────────────── */
const GAMES = [
  { name: 'BGMI', color: '#FF6B35', players: '12K+', tournaments: 38 },
  { name: 'Valorant', color: '#FF4655', players: '8K+', tournaments: 24 },
  { name: 'Free Fire Max', color: '#FF9500', players: '15K+', tournaments: 42 },
  { name: 'CS2', color: '#F59E0B', players: '5K+', tournaments: 16 },
  { name: 'MLBB', color: '#06B6D4', players: '6K+', tournaments: 20 },
  { name: 'Tekken 8', color: '#EC4899', players: '3K+', tournaments: 12 },
  { name: 'Pokemon Unite', color: '#8B5CF6', players: '2K+', tournaments: 9 },
  { name: 'Call of Duty Mobile', color: '#10B981', players: '9K+', tournaments: 28 },
  { name: 'Clash Royale', color: '#3B82F6', players: '4K+', tournaments: 14 },
];

const STATS = [
  { value: '50K+', label: 'Players', color: 'var(--cyan)', icon: '👥' },
  { value: '₹2Cr+', label: 'Prize Pool', color: '#ffd60a', icon: '🏆' },
  { value: '200+', label: 'Tournaments', color: 'var(--purple)', icon: '🎮' },
  { value: '28', label: 'States', color: 'var(--green)', icon: '🗺️' },
];

const TICKER_ITEMS = [
  '🏆 BGMI India Masters LIVE NOW — ₹5 Lakh Prize Pool',
  '🔥 Free Fire Max Grand Prix — Registration Open — 1500 Teams Signed Up!',
  '⚡ Valorant Champions India — Only 8 Slots Left!',
  '🎮 CS2 India Open — May 10-12, 2026 — New Delhi Gaming Arena',
  '🔮 Pokemon Unite Championship — Season 4 Results Out!',
  '👊 Tekken 8 India Clash — Register Before April 25',
  '🪖 CODM Masters Q2 — ₹2 Lakh Prize Pool Opening Soon',
  '📊 Leaderboard Update: Scout_GG leads BGMI All-India Rankings!',
];

// Removed GAME_ICONS object

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '👤',
    title: 'Create Your Profile',
    desc: 'Sign up in 60 seconds. Pick your games, set your state, and build your player card. Your esports identity starts here.',
    color: 'var(--cyan)',
  },
  {
    step: '02',
    icon: '🔍',
    title: 'Discover Tournaments',
    desc: 'Browse 200+ live and upcoming tournaments filtered by game, prize pool, format, and region — all in one place.',
    color: 'var(--purple)',
  },
  {
    step: '03',
    icon: '⚔️',
    title: 'Register & Compete',
    desc: 'Secure your slot instantly. Get countdown timers, real-time slot tracking, and AI match tips from NeuroGamer.',
    color: 'var(--pink)',
  },
  {
    step: '04',
    icon: '🏆',
    title: 'Win & Rise the Ranks',
    desc: 'Earn points, climb the all-India leaderboard, collect prize money, and earn recognition across 28 states.',
    color: '#ffd60a',
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun "Scout_GG" Singh',
    state: 'Punjab',
    game: 'BGMI',
    avatar: '🎯',
    color: '#FF6B35',
    quote: 'Won my first ₹1 Lakh prize through India Esports Hub. The tournament discovery feature is insane — I found 3 back-to-back tournaments in my city!',
    wins: 12,
    rank: '#1 BGMI India',
  },
  {
    name: 'Priya "StarViper" Nair',
    state: 'Kerala',
    game: 'Valorant',
    avatar: '⚡',
    color: '#FF4655',
    quote: 'As a female player in India, I finally found a platform that takes competitive gaming seriously. The community here is fire 🔥',
    wins: 7,
    rank: '#3 Valorant India',
  },
  {
    name: 'Rohan "Phantom" Mehta',
    state: 'Maharashtra',
    game: 'CS2',
    avatar: '🎮',
    color: '#F59E0B',
    quote: 'NeuroGamer AI gave me a clutch strat before my semi-final. We won the match. This platform is literally changing how we prep for tournaments.',
    wins: 9,
    rank: '#2 CS2 India',
  },
];

const STREAMERS = [
  { name: 'Mortal', game: 'BGMI', followers: '7.2M', platform: 'YouTube', emoji: '🎯', color: '#FF6B35', handle: '@mortal' },
  { name: 'Jonathan Gaming', game: 'BGMI', followers: '10.5M', platform: 'YouTube', emoji: '🎯', color: '#FF9500', handle: '@jonathan' },
  { name: 'GodLike Sc0utOP', game: 'BGMI/IND Team', followers: '5.1M', platform: 'YouTube', emoji: '🏆', color: '#ffd60a', handle: '@sc0utop' },
  { name: 'Alpha Clasher', game: 'Free Fire Max', followers: '9.3M', platform: 'YouTube', emoji: '🔥', color: '#10B981', handle: '@alphaclasher' },
  { name: 'Snax', game: 'Valorant India', followers: '1.8M', platform: 'Twitch', emoji: '⚡', color: '#FF4655', handle: '@snaxval' },
  { name: 'Regaltos', game: 'BGMI', followers: '3.4M', platform: 'YouTube', emoji: '🎯', color: '#8B5CF6', handle: '@regaltos' },
];

const COMMUNITY_CHANNELS = [
  { name: 'Discord', desc: '18,000+ members online now', icon: '💬', color: '#5865F2', members: '48K', link: '#' },
  { name: 'Instagram', desc: 'Follow for match highlights', icon: '📸', color: '#E1306C', members: '120K', link: '#' },
  { name: 'Telegram', desc: 'Live tournament alerts & results', icon: '✈️', color: '#0088CC', members: '32K', link: '#' },
  { name: 'YouTube', desc: 'Match VODs and coaching content', icon: '▶️', color: '#FF0000', members: '85K', link: '#' },
];

const TOP_CLANS = [
  { name: 'GodLike Esports', tag: 'GLE', game: 'BGMI', wins: 47, emoji: '⚔️', color: '#ffd60a' },
  { name: 'Team SouLs', tag: 'TMSL', game: 'BGMI/CODM', wins: 38, emoji: '👻', color: '#FF4655' },
  { name: 'Enigma Gaming', tag: 'ENM', game: 'Valorant', wins: 29, emoji: '🔮', color: '#8B5CF6' },
  { name: 'S8UL Esports', tag: 'S8UL', game: 'Multi-title', wins: 52, emoji: '🏆', color: '#FF6B35' },
  { name: 'Team Mayavi', tag: 'MYVI', game: 'Free Fire', wins: 33, emoji: '🔥', color: '#10B981' },
];

/* ─────────────── TOURNAMENT CARD ─────────────── */
function TournamentCard({ t, isSkeleton }) {
  if (isSkeleton) {
    return (
      <div className="glass-card shape-oval" style={{ overflow: 'hidden', padding: 24 }}>
        <div className="skeleton shape-circle" style={{ width: 50, height: 50, marginBottom: 12 }} />
        <Skeleton width="70%" height="22px" className="mb-2" />
        <Skeleton width="40%" height="16px" className="mb-4" />
        <Skeleton height="44px" borderRadius="999px" />
      </div>
    );
  }

  const pct = t.slots > 0 ? Math.round((t.slots_filled / t.slots) * 100) : 0;
  const isAlmostFull = pct >= 85;
  const accentColor = t.banner_color || '#7b2fff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Link to={`/tournaments/${t._id || t.id}`} style={{ display: 'block', height: '100%' }}>
        <div className="glass-card shape-oval" style={{
          height: '100%', overflow: 'hidden',
          position: 'relative', display: 'flex', flexDirection: 'column',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ height: 6, width: '60%', margin: '0 auto', flexShrink: 0, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, borderRadius: '0 0 100px 100px' }} />
          <div style={{ padding: '24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="shape-soft-hex" style={{ width: 52, height: 52, background: `${accentColor}22`, border: `1px solid ${accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GameIcon game={t.game} size={28} />
              </div>
              {t.status === 'live' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,45,120,0.15)', border: '1px solid rgba(255,45,120,0.5)', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.75rem', color: '#ff2d78', letterSpacing: '0.08em' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', animation: 'live-pulse 1s ease-in-out infinite', display: 'inline-block' }} />
                  LIVE
                </div>
              ) : (
                <div style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.25)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', color: 'var(--cyan)' }}>UPCOMING</div>
              )}
            </div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', lineHeight: 1.4, marginBottom: 6, color: '#fff' }}>{t.title}</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: accentColor, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.game}</div>
            <div style={{ padding: '14px 18px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>🏆 Prize</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1rem', color: '#ffd60a' }}>{t.prize_pool}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>🎯 Slots</div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.05rem', color: isAlmostFull ? 'var(--pink)' : '#fff' }}>{t.slots_filled}/{t.slots}</div>
              </div>
            </div>
            <div style={{ marginBottom: 18, padding: '0 4px' }}>
              <CountdownTimer targetDate={t.start_date} status={t.status} />
            </div>
            <div className="shape-pill" style={{ marginTop: 'auto', padding: '12px 16px', textAlign: 'center', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.95rem', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`, color: '#fff', boxShadow: `0 8px 20px ${accentColor}40`, letterSpacing: '0.05em' }}>
              {t.status === 'live' ? 'JOIN NOW ⚔️' : 'REGISTER NOW →'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [liveT, setLiveT] = useState([]);
  const [upcomingT, setUpcomingT] = useState([]);
  const [counter, setCounter] = useState({ players: 0, prize: 0, tournaments: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          tournamentAPI.getAll({ status: 'live' }),
          tournamentAPI.getAll({ status: 'upcoming' })
        ]);
        setLiveT(liveRes.data?.tournaments || []);
        setUpcomingT((upcomingRes.data?.tournaments || []).slice(0, 3));
      } catch (err) {
        console.error('API error, using empty state:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Count-up animation
    const targets = { players: 50000, prize: 200, tournaments: 200 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        players: Math.round(targets.players * ease),
        prize: Math.round(targets.prize * ease),
        tournaments: Math.round(targets.tournaments * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // Auto-rotate testimonials
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => { clearInterval(timer); clearInterval(testimonialTimer); };
  }, []);

  return (
    <div>
      {/* ── TICKER ── */}
      <div style={{ paddingTop: 72 }}>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ticker-item">
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="grid-2" style={{ gap: 60, alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-tag anim-fade-up delay-100" style={{ background: 'rgba(0,243,255,0.1)', borderColor: 'rgba(0,243,255,0.3)', color: 'var(--cyan)' }}>
                ⚡ India's #1 Esports Platform — 50,000+ Players Strong
              </div>
              <h1 className="hero-title anim-fade-up delay-200">
                <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple), var(--pink))', WebkitBackgroundClip: 'text' }}>DOMINATE</span>
                <br />
                THE ARENA
              </h1>
              <p className="hero-description anim-fade-up delay-300">
                India's fastest-growing competitive gaming platform. Discover tournaments across <strong>9 titles</strong>, compete with pros from <strong>28 states</strong>, win prizes up to <strong>₹5 Lakhs</strong> — and get AI-powered match prep from <strong>NeuroGamer</strong>. 🧠🔥
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }} className="anim-fade-up delay-400 hero-btns">
                <Link to="/tournaments" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}>
                  🏆 Join Tournament
                </Link>
                <Link to="/leaderboard" className="btn btn-secondary btn-lg" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}>
                  📊 View Leaderboard
                </Link>
              </div>
              <div className="hero-stats anim-fade-up delay-500" style={{ display: 'flex', gap: 24, justifyContent: 'flex-start' }}>
                {STATS.map(s => (
                  <div key={s.label} className="hero-stat shape-circle" style={{
                    width: 100, height: 100,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${s.color}33`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${s.color}15`,
                    backdropFilter: 'blur(10px)',
                  }}>
                    <span style={{ fontSize: '1.2rem', marginBottom: 2 }}>{s.icon}</span>
                    <span className="hero-stat-value" style={{ color: s.color, fontSize: '1.1rem', fontWeight: 900 }}>
                      {s.label === 'Players' ? `${(counter.players / 1000).toFixed(0)}K`
                        : s.label === 'Prize Pool' ? `₹${counter.prize}L`
                          : s.label === 'Tournaments' ? `${counter.tournaments}`
                            : s.value}
                    </span>
                    <span className="hero-stat-label" style={{ fontSize: '0.55rem', fontWeight: 800 }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div style={{ textAlign: 'center', position: 'relative', marginTop: 'clamp(40px, 8vw, 0px)' }} className="anim-slide-right delay-300 hero-visual-container">
              <div style={{
                width: 'min(360px, 80vw)', height: 'min(360px, 80vw)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(123,47,255,0.2) 0%, rgba(0,243,255,0.1) 50%, transparent 70%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', position: 'relative',
              }} className="anim-float">
                <img src={logo} alt="Esports Hub India" style={{ width: '75%', filter: 'drop-shadow(0 0 40px rgba(0,243,255,0.5))' }} />
                {['BGMI', 'Valorant', 'CS2', 'Free Fire Max'].map((game, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 50, height: 50, borderRadius: 14,
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    top: `${[10, 10, 75, 75][i]}%`, left: `${[5, 75, 5, 75][i]}%`,
                    animation: `float ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}><GameIcon game={game} size={28} /></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">Featured Games</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">
            Compete across India's most popular esports titles — from battle royale to fighting games
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 24 }}>
            {GAMES.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/tournaments?game=${g.name}`}
                  className="game-card"
                  style={{
                    '--game-color': g.color, padding: '28px 16px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', transition: 'all 0.4s ease', display: 'block',
                  }}
                >
                  <div className="shape-hex" style={{
                    width: 76, height: 76, background: `${g.color}15`,
                    border: `1px solid ${g.color}44`, margin: '0 auto 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${g.color}20`,
                  }}>
                    <GameIcon game={g.name} size={42} />
                  </div>
                  <div className="game-name" style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>{g.name}</div>
                  <div style={{ color: g.color, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                    {g.players} players
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 600 }}>
                    {g.tournaments} tournaments
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE TOURNAMENTS ── */}
      {liveT.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <h2 className="section-title"><span className="gradient-text">🔴 Live Tournaments</span></h2>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p className="section-subtitle">Happening right now — jump in before slots close!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {liveT.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING TOURNAMENTS ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.03)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 className="section-title"><span className="gradient-text">Upcoming Tournaments</span></h2>
            <Link to="/tournaments" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <p className="section-subtitle">Register now before slots fill up — countdowns are ticking! ⏳</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {isLoading
              ? [1, 2, 3].map(i => <TournamentCard key={i} isSkeleton />)
              : upcomingT.map(t => <TournamentCard key={t._id || t.id} t={t} />)
            }
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'rgba(0,243,255,0.02)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up" style={{ textAlign: 'center' }}>
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="section-subtitle anim-fade-up delay-100" style={{ textAlign: 'center' }}>
            From signup to champion — your esports journey in 4 steps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, position: 'relative' }}>
            {/* connector line */}
            <div style={{
              position: 'absolute', top: 48, left: '12.5%', right: '12.5%', height: 2,
              background: 'linear-gradient(90deg, var(--cyan), var(--purple), var(--pink), #ffd60a)',
              opacity: 0.2, borderRadius: 100,
              display: 'none', // shown via media query would need CSS, skip for simplicity
            }} />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="glass-card shape-oval" style={{ padding: '36px 28px', textAlign: 'center', height: '100%' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                    background: `${step.color}15`, border: `2px solid ${step.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', boxShadow: `0 0 24px ${step.color}20`,
                    position: 'relative',
                  }}>
                    {step.icon}
                    <div style={{
                      position: 'absolute', top: -10, right: -10,
                      width: 28, height: 28, borderRadius: '50%',
                      background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.65rem', color: '#000',
                    }}>{step.step}</div>
                  </div>
                  <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', marginBottom: 12, color: step.color }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STREAMERS / PROS ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">🎥 Indian Esports Icons</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">
            The pros who made Indian gaming go global — follow their journey and compete in their leagues
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {STREAMERS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="glass-card" style={{
                  padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
                  border: `1px solid ${s.color}22`, borderRadius: 20,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
                    background: `${s.color}15`, border: `2px solid ${s.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', boxShadow: `0 0 20px ${s.color}20`,
                  }}>{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.95rem', color: s.color, marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{s.game}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{s.followers}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>followers</span>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: '0.65rem',
                        fontFamily: 'Rajdhani', fontWeight: 700,
                        background: s.platform === 'YouTube' ? 'rgba(255,0,0,0.12)' : 'rgba(145,71,255,0.12)',
                        color: s.platform === 'YouTube' ? '#ff4444' : '#9147ff',
                        border: `1px solid ${s.platform === 'YouTube' ? 'rgba(255,0,0,0.25)' : 'rgba(145,71,255,0.25)'}`,
                      }}>{s.platform}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/leaderboard" className="btn btn-secondary">
              🏅 See Full Leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLAYER TESTIMONIALS ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.04)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up" style={{ textAlign: 'center' }}>
            <span className="gradient-text">🗣️ Players Speak</span>
          </h2>
          <p className="section-subtitle anim-fade-up delay-100" style={{ textAlign: 'center' }}>
            Real stories from India's competitive gaming arena
          </p>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, i) =>
                i === activeTestimonial ? (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="glass-card shape-oval" style={{ padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', top: -60, right: -60,
                        width: 200, height: 200, borderRadius: '50%',
                        background: `radial-gradient(circle, ${t.color}20, transparent 70%)`,
                        pointerEvents: 'none',
                      }} />
                      <div style={{ fontSize: '3rem', marginBottom: 20, opacity: 0.3, fontFamily: 'serif', lineHeight: 1 }}>"</div>
                      <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 32, fontStyle: 'italic' }}>
                        {t.quote}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                          background: `${t.color}20`, border: `2px solid ${t.color}50`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                        }}>{t.avatar}</div>
                        <div>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.95rem', color: t.color }}>{t.name}</div>
                          <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.state} · {t.rank}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: '#ffd60a' }}>{t.wins}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>WINS</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 100,
                    background: i === activeTestimonial ? 'var(--cyan)' : 'rgba(255,255,255,0.2)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SECTION ── */}
      <section id="community" className="section">
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">🤝 Join the Community</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">
            Connect with 150,000+ Indian gamers across platforms — get tournament alerts, match tips, and team-ups
          </p>

          {/* Social Platform Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 60 }}>
            {COMMUNITY_CHANNELS.map((ch, i) => (
              <motion.a
                key={ch.name}
                href={ch.link}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div style={{
                  padding: '28px 24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${ch.color}30`,
                  borderRadius: 24, textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 0 0 0 ${ch.color}20`,
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 40px ${ch.color}20, 0 0 0 1px ${ch.color}40`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${ch.color}20`}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                    background: `${ch.color}15`, border: `2px solid ${ch.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', boxShadow: `0 0 20px ${ch.color}20`,
                  }}>{ch.icon}</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', color: ch.color, marginBottom: 6 }}>{ch.name}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 900, fontSize: '1.4rem', color: '#fff', marginBottom: 4 }}>{ch.members}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>{ch.desc}</div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Top Clans */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="community-grid">
            <div>
              <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.3rem', marginBottom: 8, color: '#fff' }}>
                ⚔️ Top Clans & Orgs
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                India's most competitive esports organizations
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TOP_CLANS.map((clan, i) => (
                  <motion.div
                    key={clan.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 20px', borderRadius: 16,
                      background: 'rgba(255,255,255,0.03)', border: `1px solid ${clan.color}20`,
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: `${clan.color}15`, border: `1px solid ${clan.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                      }}>{clan.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1rem', color: clan.color }}>{clan.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{clan.game}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1rem', color: '#ffd60a' }}>{clan.wins}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>WINS</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Community Stats + CTA */}
            <div>
              <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.3rem', marginBottom: 8, color: '#fff' }}>
                📊 Community Pulse
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                Live activity across the India Esports Hub ecosystem
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Active Players Today', value: '3,241', icon: '👥', color: 'var(--cyan)' },
                  { label: 'Matches Played', value: '18,500+', icon: '⚔️', color: 'var(--purple)' },
                  { label: 'Prize Distributed', value: '₹2.1 Cr', icon: '💰', color: '#ffd60a' },
                  { label: 'States Covered', value: '28 / 28', icon: '🗺️', color: 'var(--green)' },
                  { label: 'Active Clans', value: '412', icon: '🏛️', color: 'var(--pink)' },
                  { label: 'Avg. Prize/Win', value: '₹18,400', icon: '🏆', color: '#FF9500' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card" style={{
                    padding: '16px 18px', borderRadius: 16, border: `1px solid ${stat.color}20`,
                  }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{stat.icon}</div>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1rem', color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                🚀 Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.03)' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(0,243,255,0.08))',
            borderColor: 'rgba(0,243,255,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }} className="anim-float">🏆</div>
            <h2 className="section-title anim-fade-up" style={{ marginBottom: 16 }}>
              Ready to <span className="gradient-text">Compete?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.85, fontSize: '1.05rem' }}>
              Join <strong>50,000+ Indian gamers</strong> already competing. Register for tournaments, win prizes up to <strong>₹5 Lakhs</strong>, climb the leaderboard, and make your mark in Indian esports history!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Create Account 🚀</Link>
              <Link to="/tournaments" className="btn btn-secondary btn-lg">Browse Tournaments</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,16,0.9)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 32px' }}>
          {/* Top grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <img src={logo} alt="India Esports Hub" style={{ height: 48, marginBottom: 16, filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.3))' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 20 }}>
                India's premier esports platform connecting players, tournaments, and communities across all 28 states.
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: '💬', color: '#5865F2', label: 'Discord' },
                  { icon: '📸', color: '#E1306C', label: 'Instagram' },
                  { icon: '✈️', color: '#0088CC', label: 'Telegram' },
                  { icon: '▶️', color: '#FF0000', label: 'YouTube' },
                ].map(s => (
                  <a key={s.label} href="#" title={s.label} style={{
                    width: 38, height: 38, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                    background: `${s.color}15`, border: `1px solid ${s.color}30`,
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${s.color}30`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${s.color}15`; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Platform</div>
              {[
                { label: '🏆 Tournaments', to: '/tournaments' },
                { label: '📊 Leaderboard', to: '/leaderboard' },
                { label: '👤 My Profile', to: '/profile' },
                { label: '🚀 Sign Up Free', to: '/signup' },
                { label: '🔑 Login', to: '/login' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 10,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{l.label}</Link>
              ))}
            </div>

            {/* Games */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--purple)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Games</div>
              {GAMES.slice(0, 6).map(g => (
                <Link key={g.name} to={`/tournaments?game=${g.name}`} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 10,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = g.color}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{g.icon} {g.name}</Link>
              ))}
            </div>

            {/* Community */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--pink)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Community</div>
              {[
                { label: '💬 Discord Server', href: '#' },
                { label: '📸 Instagram', href: '#' },
                { label: '✈️ Telegram Alerts', href: '#' },
                { label: '▶️ YouTube Channel', href: '#' },
                { label: '🐦 Twitter / X', href: '#' },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 10,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,243,255,0.15), rgba(123,47,255,0.15), transparent)', marginBottom: 28 }} />

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Rajdhani', fontWeight: 600 }}>
              © {new Date().getFullYear()} India Esports Hub · All Rights Reserved
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Proudly built in India 🇮🇳 · For Indian gamers, by Indian gamers
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
                <a key={l} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'Rajdhani', fontWeight: 600, transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
