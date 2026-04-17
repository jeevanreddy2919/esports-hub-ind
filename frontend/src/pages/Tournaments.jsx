import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import CountdownTimer from '../components/CountdownTimer';
import { GameIcon } from '../utils/gameLogos';

const GAMES = ['all', 'BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];
const STATUSES = ['all', 'live', 'upcoming', 'past'];

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
        <div className="glass-card shape-oval" style={{
          height: '100%', overflow: 'hidden',
          position: 'relative', display: 'flex', flexDirection: 'column',
          transition: 'all 0.4s ease',
        }}>
          {/* Top accent bar - pill style */}
          <div style={{ height: 6, width: '40%', margin: '0 auto', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, borderRadius: '0 0 100px 100px' }} />
          
          <div style={{ padding: '24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="shape-soft-hex" style={{ width: 52, height: 52, background: `${accentColor}22`, border: `1px solid ${accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GameIcon game={t.game} size={28} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {t.status === 'live' ? (
                  <div style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(255,45,120,0.15)', border: '1px solid rgba(255,45,120,0.5)', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.75rem', color: '#ff2d78' }}>🔴 LIVE</div>
                ) : (
                  <div style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.25)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', color: 'var(--cyan)' }}>UPCOMING</div>
                )}
              </div>
            </div>

            <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.4, marginBottom: 4, color: '#fff' }}>{t.title}</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: accentColor, marginBottom: 16, textTransform: 'uppercase' }}>{t.game} • {t.format || 'SQUAD'}</div>

            <div style={{ padding: '14px 18px', borderRadius: 20, marginBottom: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>🏆 Prize</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.95rem', color: '#ffd60a' }}>{t.prize_pool}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>📍 Region</div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{t.location}</div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <CountdownTimer targetDate={t.start_date} status={t.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--text-muted)' }}>🎯 {t.slots_filled}/{t.slots} FILLED</span>
              <div style={{ width: '60%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(t.slots_filled/t.slots)*100}%`, background: accentColor, borderRadius: 999 }} />
              </div>
            </div>

            <div className="shape-pill" style={{ marginTop: 'auto', padding: '12px 16px', textAlign: 'center', fontFamily: 'Rajdhani', fontWeight: 800, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`, color: '#fff', boxShadow: `0 8px 20px ${accentColor}30` }}>
              {t.status === 'past' ? 'RESULTS →' : 'JOIN ARENA ⚔️'}
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
  const [minPrize, setMinPrize] = useState('');
  const [maxPrize, setMaxPrize] = useState('');
  const [format, setFormat] = useState('all');
  const [region, setRegion] = useState('all');

  const fetchTournaments = useCallback(() => {
    setLoading(true);
    tournamentAPI.getAll({
      game: game === 'all' ? undefined : game,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
      minPrize: minPrize || undefined,
      maxPrize: maxPrize || undefined,
      format: format === 'all' ? undefined : format,
      region: region === 'all' ? undefined : region,
    })
      .then(r => setTournaments(r.data?.tournaments || []))
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, [game, status, search, minPrize, maxPrize, format, region]);

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
        <div className="shape-oval" style={{
          padding: '30px', marginBottom: 32,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Main Filter Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
              <input
                type="text" placeholder="Search tournaments..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="form-input shape-pill"
                style={{ paddingLeft: 44, width: '100%' }}
              />
            </div>

            {/* Region Select */}
            <select className="form-select shape-pill" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">🌐 All Regions</option>
              {['Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Format Select */}
            <select className="form-select shape-pill" value={format} onChange={e => setFormat(e.target.value)}>
               <option value="all">🎮 All Formats</option>
               <option value="SOLO">Solo (1v1)</option>
               <option value="DUO">Duo (2v2)</option>
               <option value="SQUAD">Squad (4v4)</option>
            </select>
          </div>

          {/* Prize Range Row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
             <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem', color: 'var(--yellow)' }}>PRIZE RANGE (₹):</span>
             <input type="number" placeholder="Min" className="form-input shape-pill" style={{ width: 100, height: 38 }} value={minPrize} onChange={e => setMinPrize(e.target.value)} />
             <span style={{ color: 'var(--text-muted)' }}>—</span>
             <input type="number" placeholder="Max" className="form-input shape-pill" style={{ width: 100, height: 38 }} value={maxPrize} onChange={e => setMaxPrize(e.target.value)} />
             
             <button onClick={() => { setSearch(''); setMinPrize(''); setMaxPrize(''); setFormat('all'); setRegion('all'); setGame('all'); setStatus('all'); }} 
               className="btn btn-secondary shape-pill" style={{ height: 38, padding: '0 20px', fontSize: '0.8rem' }}>
               RESET FILTERS
             </button>
          </div>

          {/* Type Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
             {STATUSES.map(s => (
               <button key={s} onClick={() => setStatus(s)} className="shape-pill" style={{
                 padding: '8px 20px',
                 fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem',
                 background: status === s ? 'var(--cyan)' : 'rgba(255,255,255,0.05)',
                 color: status === s ? '#000' : 'var(--text-muted)',
                 border: 'none', cursor: 'pointer', transition: '0.3s'
               }}>
                 {s.toUpperCase()}
               </button>
             ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
             {GAMES.map(g => (
               <button key={g} onClick={() => setGame(g)} className="shape-pill" style={{
                 padding: '8px 20px',
                 fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem',
                 background: game === g ? 'var(--purple)' : 'rgba(255,255,255,0.03)',
                 color: game === g ? '#fff' : 'var(--text-muted)',
                 border: 'none', cursor: 'pointer', transition: '0.3s'
               }}>
                 {g}
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
