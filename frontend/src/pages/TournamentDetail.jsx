import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tournamentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    tournamentAPI.getById(id)
      .then(r => setTournament(r.data.tournament))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user) {
      tournamentAPI.myRegistrations()
        .then(r => setRegistered(r.data.tournaments.some(t => t.id === parseInt(id))))
        .catch(() => {});
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) { toast.error('Please login to register! 🔒'); return; }
    setRegistering(true);
    try {
      await tournamentAPI.register(id);
      toast.success('Successfully registered! Get ready to compete! 🏆🔥');
      setRegistered(true);
      setTournament(prev => ({ ...prev, slots_filled: prev.slots_filled + 1 }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed!';
      if (msg.includes('Already')) { toast.success('Already registered for this tournament! 🎮'); setRegistered(true); }
      else toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="page loading-screen"><div className="loader" /><span className="loading-text">Loading...</span></div>;
  if (!tournament) return (
    <div className="page not-found">
      <div className="not-found-code gradient-text">404</div>
      <p>Tournament not found!</p>
      <Link to="/tournaments" className="btn btn-primary">← Back to Tournaments</Link>
    </div>
  );

  const pct = Math.round((tournament.slots_filled / tournament.slots) * 100);
  const rules = (() => { try { return JSON.parse(tournament.rules); } catch { return []; } })();
  const isFull = tournament.slots_filled >= tournament.slots;
  const isPast = tournament.status === 'past';

  return (
    <div className="page">
      <div className="container" style={{ padding: '32px 24px' }}>
        <Link to="/tournaments" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 24, transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--cyan)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          ← Back to Tournaments
        </Link>

        {/* Hero Banner */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 32,
          position: 'relative',
          height: 280,
          background: `linear-gradient(135deg, ${tournament.banner_color}33, ${tournament.banner_color}11)`,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 60% 80% at 20% 50%, ${tournament.banner_color}30 0%, transparent 70%)`,
          }} />
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(${tournament.banner_color}08 1px, transparent 1px), linear-gradient(90deg, ${tournament.banner_color}08 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,4,15,0.95) 0%, transparent 60%)' }} />

          <div style={{
            position: 'absolute', bottom: 32, left: 32, right: 32, zIndex: 1,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '3.5rem', marginBottom: 8, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}>
                {GAME_ICONS[tournament.game] || '🎮'}
              </div>
              <span className={`badge badge-${tournament.status}`} style={{ marginBottom: 10, display: 'inline-flex' }}>
                {tournament.status.toUpperCase()}
              </span>
              <h1 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.2 }}>
                {tournament.title}
              </h1>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', marginTop: 4 }}>
                Organized by {tournament.organizer}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.1em' }}>PRIZE POOL</div>
              <div style={{
                fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900,
                background: 'linear-gradient(135deg, #ffd60a, #ff9500)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(255,214,10,0.5))',
              }}>{tournament.prize_pool}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Description */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: 'var(--cyan)' }}>
                📋 About This Tournament
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                {tournament.description}
              </p>
            </div>

            {/* Tournament Details Grid */}
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--cyan)' }}>
                📊 Tournament Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { icon: '🎮', label: 'Game', value: tournament.game },
                  { icon: '📍', label: 'Location', value: tournament.location },
                  { icon: '📅', label: 'Start Date', value: tournament.start_date },
                  { icon: '🏁', label: 'End Date', value: tournament.end_date || 'TBD' },
                  { icon: '⏰', label: 'Registration Deadline', value: tournament.registration_deadline || 'Open' },
                  { icon: '🏢', label: 'Organizer', value: tournament.organizer },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '16px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            {rules.length > 0 && (
              <div className="glass-card" style={{ padding: 28 }}>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--cyan)' }}>
                  📜 Tournament Rules
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rules.map((rule, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 14, alignItems: 'flex-start',
                      padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,243,255,0.04)', border: '1px solid rgba(0,243,255,0.1)',
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.7rem',
                      }}>{i + 1}</div>
                      <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, lineHeight: 1.5, paddingTop: 2 }}>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 100 }}>
            {/* Register Card */}
            <div className="glass-card" style={{ padding: 28, borderColor: registered ? 'rgba(0,255,136,0.3)' : 'rgba(0,243,255,0.2)' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>PRIZE POOL</div>
                <div style={{
                  fontFamily: 'Orbitron', fontSize: '2.2rem', fontWeight: 900,
                  background: 'linear-gradient(135deg, #ffd60a, #ff9500)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{tournament.prize_pool}</div>
              </div>

              {/* Slots progress */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Slots Filled</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: pct >= 90 ? 'var(--pink)' : 'var(--cyan)' }}>
                    {tournament.slots_filled}/{tournament.slots} ({pct}%)
                  </span>
                </div>
                <div className="slots-bar" style={{ height: 8 }}>
                  <div className="slots-fill" style={{ width: `${pct}%`, background: pct >= 90 ? 'var(--pink)' : `linear-gradient(90deg, var(--purple), var(--cyan))` }} />
                </div>
                {isFull && <p style={{ color: 'var(--pink)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.82rem', marginTop: 8, textAlign: 'center' }}>⚠️ Tournament is FULL</p>}
              </div>

              {registered ? (
                <div style={{
                  padding: '16px', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>✅</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 700, color: 'var(--green)', fontSize: '0.9rem' }}>REGISTERED!</div>
                  <div style={{ fontFamily: 'Rajdhani', color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4 }}>You're in! Good luck! 🏆</div>
                </div>
              ) : (
                <button
                  className={`btn ${isPast || isFull ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleRegister}
                  disabled={registering || isPast || isFull}
                >
                  {registering ? <><div className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> Registering...</>
                    : isPast ? '🏁 Tournament Ended'
                    : isFull ? '❌ Slots Full'
                    : '🚀 Register Now — FREE'}
                </button>
              )}

              {!user && !isPast && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12, fontFamily: 'Rajdhani' }}>
                  <Link to="/login" style={{ color: 'var(--cyan)' }}>Login</Link> or <Link to="/signup" style={{ color: 'var(--cyan)' }}>Sign up</Link> to register
                </p>
              )}
            </div>

            {/* Share */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Share Tournament</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: '🐦 Twitter', color: '#1DA1F2' },
                  { label: '💬 WhatsApp', color: '#25D366' },
                  { label: '📋 Copy Link', color: 'var(--purple)' },
                ].map(s => (
                  <button key={s.label} onClick={() => toast.success('Link copied! Share with friends! 🎮')}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 'var(--radius-sm)',
                      background: `${s.color}18`, border: `1px solid ${s.color}40`,
                      color: s.color, fontSize: '0.72rem', fontFamily: 'Rajdhani', fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
