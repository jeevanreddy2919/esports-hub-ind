import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tournamentAPI } from '../services/api';
import toast from 'react-hot-toast';

const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tournamentAPI.myRegistrations()
      .then(r => setMyTournaments(r.data.tournaments))
      .catch(() => setMyTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out. GG! See you next time! 👋');
    navigate('/');
  };

  const games = (() => { try { return JSON.parse(user.games || '[]'); } catch { return []; } })();
  const avatarLetter = user.name?.[0]?.toUpperCase() || '?';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown';

  const liveReg = myTournaments.filter(t => t.status === 'live').length;
  const upcomingReg = myTournaments.filter(t => t.status === 'upcoming').length;
  const pastReg = myTournaments.filter(t => t.status === 'past').length;

  return (
    <div className="page">
      {/* Hero background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 400,
        background: 'radial-gradient(ellipse 100% 80% at 50% -10%, rgba(123,47,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="container" style={{ padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar" style={{
            background: `linear-gradient(135deg, var(--purple), var(--cyan))`,
            fontSize: '2.2rem',
          }}>{avatarLetter}</div>

          <h1 className="profile-name">{user.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{
              padding: '5px 14px', borderRadius: 100,
              background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.35)',
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: 'var(--purple)',
            }}>🏅 {user.rank || 'Rookie'}</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontSize: '0.9rem' }}>
              🇮🇳 {user.state || 'India'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.85rem' }}>
              Joined {joinDate}
            </span>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'Rajdhani' }}>
            📧 {user.email}
          </div>

          {/* Game Pills */}
          {games.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
              {games.map(g => (
                <span key={g} style={{
                  padding: '5px 14px', borderRadius: 100,
                  background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.2)',
                  fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: 'var(--cyan)',
                }}>{GAME_ICONS[g] || '🎮'} {g}</span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="profile-stats">
            {[
              { label: 'Registered', value: myTournaments.length, color: 'var(--cyan)', icon: '🏆' },
              { label: 'Live Now', value: liveReg, color: 'var(--pink)', icon: '🔴' },
              { label: 'Upcoming', value: upcomingReg, color: 'var(--yellow)', icon: '⏳' },
              { label: 'Completed', value: pastReg, color: 'var(--green)', icon: '✅' },
              { label: 'Points', value: user.points || 0, color: 'var(--purple)', icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="profile-stat-box">
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                <div className="profile-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="profile-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My Tournaments */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>
            <span className="gradient-text">My Tournaments</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontFamily: 'Rajdhani' }}>
            Tournaments you've registered for
          </p>

          {loading ? (
            <div className="loading-screen" style={{ minHeight: '200px' }}>
              <div className="loader" />
              <span className="loading-text">Loading...</span>
            </div>
          ) : myTournaments.length === 0 ? (
            <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎮</div>
              <h3 style={{ fontFamily: 'Orbitron', marginBottom: 8 }}>No tournaments yet!</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Join a tournament to start your esports journey!</p>
              <Link to="/tournaments" className="btn btn-primary">Browse Tournaments 🏆</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {myTournaments.map((t, i) => (
                <Link to={`/tournaments/${t.id}`} key={t.id}>
                  <div className="glass-card anim-fade-up" style={{
                    overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease',
                    animationDelay: `${i * 0.07}s`,
                  }}>
                    <div style={{ height: 5, background: t.banner_color || 'var(--purple)' }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{GAME_ICONS[t.game] || '🎮'}</div>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{t.title}</div>
                        </div>
                        <span className={`badge badge-${t.status}`}>{t.status.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, #ffd60a, #ff9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {t.prize_pool}
                        </span>
                        <span style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.start_date}</span>
                      </div>
                      <div style={{
                        marginTop: 10, padding: '6px 10px', borderRadius: 6,
                        background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
                        fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.78rem', color: 'var(--green)',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>✅ Registered</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Account Actions</h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/tournaments" className="btn btn-primary">🏆 Find Tournaments</Link>
            <Link to="/leaderboard" className="btn btn-secondary">📊 View Leaderboard</Link>
            <button onClick={handleLogout} className="btn btn-danger">🚪 Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
