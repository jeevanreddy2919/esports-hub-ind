import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tournamentAPI } from '../services/api';

const GAMES = ['all', 'BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];
const STATUSES = ['all', 'live', 'upcoming', 'past'];
const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

function TournamentCard({ t, delay = 0 }) {
  const pct = Math.round((t.slots_filled / t.slots) * 100);
  const deadline = t.registration_deadline ? new Date(t.registration_deadline) : null;
  const daysLeft = deadline ? Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <Link to={`/tournaments/${t.id}`}>
      <div className="glass-card tournament-card anim-fade-up" style={{ animationDelay: `${delay}s`, cursor: 'pointer', height: '100%' }}>
        <div className="tournament-card-banner" style={{ background: t.banner_color || 'var(--purple)', height: 8 }} />
        <div className="tournament-card-body">
          <div className="tournament-card-header">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{GAME_ICONS[t.game] || '🎮'}</div>
              <div className="tournament-card-title">{t.title}</div>
              <div className="tournament-card-game" style={{ color: t.banner_color }}>{t.game}</div>
            </div>
            <span className={`badge badge-${t.status}`}>{t.status.toUpperCase()}</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.6 }}>
            {t.description?.slice(0, 80)}...
          </p>

          <div className="tournament-card-info">
            <div className="info-item">
              <span className="info-label">💰 Prize Pool</span>
              <span className="prize-amount">{t.prize_pool}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📅 Starts</span>
              <span className="info-value">{t.start_date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🎯 Slots</span>
              <span className="info-value">{t.slots_filled}/{t.slots}</span>
              <div className="slots-bar">
                <div className="slots-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--pink)' : t.banner_color || 'var(--cyan)' }} />
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">📍 Mode</span>
              <span className="info-value" style={{ fontSize: '0.82rem' }}>{t.location}</span>
            </div>
          </div>

          {deadline && t.status !== 'past' && (
            <div style={{
              padding: '8px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 16,
              background: daysLeft <= 3 ? 'rgba(255,45,120,0.12)' : 'rgba(0,243,255,0.08)',
              border: `1px solid ${daysLeft <= 3 ? 'rgba(255,45,120,0.3)' : 'rgba(0,243,255,0.2)'}`,
              fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.82rem',
              color: daysLeft <= 3 ? 'var(--pink)' : 'var(--cyan)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⏰ {daysLeft === 0 ? 'Registration closes TODAY!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to register`}
            </div>
          )}

          <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>
            {t.status === 'past' ? '📊 View Results' : 'View & Register →'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(searchParams.get('game') || 'all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    tournamentAPI.getAll({ game: game === 'all' ? undefined : game, status: status === 'all' ? undefined : status, search: search || undefined })
      .then(r => setTournaments(r.data.tournaments))
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, [game, status, search]);

  const liveCt = tournaments.filter(t => t.status === 'live').length;
  const upcomingCt = tournaments.filter(t => t.status === 'upcoming').length;

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        padding: '48px 0 32px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,47,255,0.12) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div className="anim-fade-up">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.35)',
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--purple)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
            }}>🏆 Tournament Hub</div>
            <h1 className="section-title"><span className="gradient-text">All Tournaments</span></h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              {liveCt > 0 && <><span style={{ color: 'var(--pink)', fontWeight: 700 }}>{liveCt} LIVE</span> · </>}
              {upcomingCt > 0 && <><span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{upcomingCt} Upcoming</span> · </>}
              {tournaments.length} tournaments found
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{ marginBottom: 12 }}>
          <div className="filter-bar" style={{ marginBottom: 12 }}>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search tournaments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 0', alignSelf: 'center' }}>STATUS:</span>
            {STATUSES.map(s => (
              <button key={s} className={`filter-btn ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
                {s === 'live' ? '🔴 ' : s === 'upcoming' ? '🔵 ' : s === 'past' ? '⚫ ' : ''}{s.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 0', alignSelf: 'center' }}>GAME:</span>
            {GAMES.map(g => (
              <button key={g} className={`filter-btn ${game === g ? 'active' : ''}`} onClick={() => setGame(g)}
                style={ g !== 'all' ? { borderColor: game === g ? undefined : 'transparent' } : {}}>
                {g !== 'all' && (GAME_ICONS[g] + ' ')}{g === 'all' ? 'All Games' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-screen">
            <div className="loader" />
            <span className="loading-text">Loading tournaments...</span>
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎮</div>
            <h3 style={{ fontFamily: 'Orbitron', marginBottom: 8 }}>No tournaments found</h3>
            <p>Try different filters or check back later!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {tournaments.map((t, i) => <TournamentCard key={t.id} t={t} delay={i * 0.06} />)}
          </div>
        )}
      </div>
    </div>
  );
}
