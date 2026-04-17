import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import CountdownTimer from '../components/CountdownTimer';

const GAMES = ['all', 'BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];
const STATUSES = ['all', 'live', 'upcoming', 'past'];
const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

function TournamentCard({ t, isSkeleton }) {
  if (isSkeleton) {
    return (
      <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(13,13,35,0.7)', border: '1px solid rgba(255,255,255,0.05)', padding: 24 }}>
        <Skeleton width="50px" height="50px" borderRadius="14px" className="mb-3" />
        <Skeleton width="70%" height="22px" className="mb-2" />
        <Skeleton width="40%" height="16px" className="mb-4" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} height="44px" borderRadius="10px" />)}
        </div>
        <Skeleton height="44px" borderRadius="12px" />
      </div>
    );
  }

  const pct = t.slots > 0 ? Math.round((t.slots_filled / t.slots) * 100) : 0;
  const isAlmostFull = pct >= 85;
  const accentColor = t.banner_color || '#7b2fff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Link to={`/tournaments/${t._id || t.id}`} style={{ display: 'block', height: '100%' }}>
        <div style={{
          height: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(10,10,28,0.9)',
          border: `1px solid rgba(255,255,255,0.07)`,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}50`; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.6), 0 0 30px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.08)`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'; }}
        >
          {/* Top color bar */}
          <div style={{
            height: 5, width: '100%', flexShrink: 0,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          }} />

          {/* Left accent line */}
          <div style={{
            position: 'absolute', left: 0, top: 5, bottom: 0, width: 3,
            background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
            opacity: 0.7,
          }} />

          <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Game icon + badge row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>
                {GAME_ICONS[t.game] || '🎮'}
              </div>

              {/* Status Badge */}
              {t.status === 'live' ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 100,
                  background: 'rgba(255,45,120,0.15)',
                  border: '1px solid rgba(255,45,120,0.5)',
                  fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.75rem',
                  color: '#ff2d78', letterSpacing: '0.08em',
                  boxShadow: '0 0 20px rgba(255,45,120,0.2)',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', animation: 'live-pulse 1s ease-in-out infinite', display: 'inline-block' }} />
                  🔴 LIVE
                </div>
              ) : t.status === 'upcoming' ? (
                <div style={{
                  padding: '5px 12px', borderRadius: 100,
                  background: 'rgba(0,243,255,0.1)',
                  border: '1px solid rgba(0,243,255,0.3)',
                  fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem',
                  color: 'var(--cyan)', letterSpacing: '0.08em',
                }}>
                  🔵 UPCOMING
                </div>
              ) : (
                <div style={{
                  padding: '5px 12px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem',
                  color: 'var(--text-muted)', letterSpacing: '0.08em',
                }}>
                  ⚫ ENDED
                </div>
              )}
            </div>

            {/* Title & game */}
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.35, marginBottom: 4, color: '#fff' }}>
              {t.title}
            </div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', color: accentColor, marginBottom: 16 }}>
              {t.game}
            </div>

            {/* Prize + organizer */}
            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 14,
              background: 'rgba(255,214,10,0.06)', border: '1px solid rgba(255,214,10,0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>🏆 Prize Pool</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, #ffd60a, #ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {t.prize_pool}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>📅 Date</div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.start_date}</div>
              </div>
            </div>

            {/* Countdown / Live indicator */}
            <div style={{ marginBottom: 14 }}>
              <CountdownTimer targetDate={t.start_date} status={t.status} />
            </div>

            {/* Slots */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎯 Slots</span>
                <span style={{ fontSize: '0.78rem', fontFamily: 'Rajdhani', fontWeight: 700, color: isAlmostFull ? 'var(--pink)' : 'var(--text-secondary)' }}>
                  {t.slots_filled}/{t.slots} {isAlmostFull && '⚠️ Almost Full!'}
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  style={{
                    height: '100%', borderRadius: 100,
                    background: isAlmostFull
                      ? 'linear-gradient(90deg, #ff9500, #ff2d78)'
                      : `linear-gradient(90deg, ${accentColor}, ${accentColor}bb)`,
                  }}
                />
              </div>
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px', borderRadius: 8, fontSize: '0.73rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Rajdhani', fontWeight: 600, color: 'var(--text-muted)',
              }}>📍 {t.location}</span>
              <span style={{
                padding: '4px 10px', borderRadius: 8, fontSize: '0.73rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Rajdhani', fontWeight: 600, color: 'var(--text-muted)',
              }}>🏢 {t.organizer}</span>
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 'auto',
              padding: '12px 20px', borderRadius: 12, textAlign: 'center',
              fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.95rem',
              letterSpacing: '0.05em',
              background: t.status === 'past'
                ? 'rgba(255,255,255,0.06)'
                : `linear-gradient(135deg, ${accentColor}dd, ${accentColor}88)`,
              color: t.status === 'past' ? 'var(--text-muted)' : '#fff',
              border: t.status === 'past' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: t.status !== 'past' ? `0 4px 20px ${accentColor}40` : 'none',
              transition: 'all 0.2s',
            }}>
              {t.status === 'past' ? '📊 View Results' : t.status === 'live' ? '🔴 Join Now →' : '📝 Register Now →'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Tournaments() {
  const [searchParams] = useSearchParams();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(searchParams.get('game') || 'all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTournaments = useCallback(() => {
    setLoading(true);
    tournamentAPI.getAll({
      game: game === 'all' ? undefined : game,
      status: status === 'all' ? undefined : status,
      search: search || undefined
    })
      .then(r => setTournaments(r.data?.tournaments || []))
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, [game, status, search]);

  useEffect(() => {
    fetchTournaments();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTournaments, 60000);
    return () => clearInterval(interval);
  }, [fetchTournaments]);

  const liveCt = tournaments.filter(t => t.status === 'live').length;
  const upcomingCt = tournaments.filter(t => t.status === 'upcoming').length;

  return (
    <div className="page" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '56px 0 36px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,47,255,0.12) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.35)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--purple)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            🏆 Tournament Hub
          </div>
          <h1 className="section-title"><span className="gradient-text">All Tournaments</span></h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
            {liveCt > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: 'rgba(255,45,120,0.12)', border: '1px solid rgba(255,45,120,0.4)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: '#ff2d78' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', animation: 'live-pulse 1s ease-in-out infinite', display: 'inline-block' }} />
                {liveCt} LIVE NOW
              </div>
            )}
            {upcomingCt > 0 && (
              <div style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.25)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: 'var(--cyan)' }}>
                {upcomingCt} Upcoming
              </div>
            )}
            <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {tournaments.length} total tournaments found
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{
          padding: '20px 24px', borderRadius: 16, marginBottom: 28,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text" placeholder="Search tournaments..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '11px 18px 11px 42px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, color: '#fff', fontSize: '0.9rem', outline: 'none',
                fontFamily: 'Inter', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,243,255,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>STATUS:</span>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{
                padding: '6px 16px', borderRadius: 100, fontFamily: 'Rajdhani', fontWeight: 700,
                fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.04em',
                transition: 'all 0.2s',
                background: status === s
                  ? s === 'live' ? 'rgba(255,45,120,0.2)' : s === 'upcoming' ? 'rgba(0,243,255,0.15)' : 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.04)',
                border: status === s
                  ? s === 'live' ? '1px solid rgba(255,45,120,0.5)' : s === 'upcoming' ? '1px solid rgba(0,243,255,0.4)' : '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
                color: status === s
                  ? s === 'live' ? '#ff2d78' : s === 'upcoming' ? 'var(--cyan)' : '#fff'
                  : 'var(--text-muted)',
              }}>
                {s === 'live' ? '🔴 ' : s === 'upcoming' ? '🔵 ' : s === 'past' ? '⚫ ' : ''}{s.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Game filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>GAME:</span>
            {GAMES.map(g => (
              <button key={g} onClick={() => setGame(g)} className={`filter-btn ${game === g ? 'active' : ''}`}>
                {g !== 'all' && (GAME_ICONS[g] + ' ')}{g === 'all' ? 'All Games' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {loading ? (
            [1,2,3,4,5,6].map(i => <TournamentCard key={i} isSkeleton />)
          ) : tournaments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎮</div>
              <h3 style={{ fontFamily: 'Orbitron', marginBottom: 8 }}>No tournaments found</h3>
              <p>Try different filters or check back soon!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tournaments.map(t => <TournamentCard key={t._id || t.id} t={t} />)}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
