import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tournamentAPI.myRegistrations()
      .then(r => setMyTournaments(r.data?.tournaments || []))
      .catch(() => setMyTournaments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out. GG! See you next time! 👋');
    navigate('/');
  };

  if (!user) return null;

  const games = (() => { try { return JSON.parse(user.games || '[]'); } catch { return []; } })();
  const avatarLetter = user.name?.[0]?.toUpperCase() || '?';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown';

  const liveReg = myTournaments.filter(t => t.status === 'live').length;
  const upcomingReg = myTournaments.filter(t => t.status === 'upcoming').length;
  const pastReg = myTournaments.filter(t => t.status === 'past').length;

  return (
    <div className="page" style={{ background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60vh',
        background: 'radial-gradient(circle at 50% 0%, rgba(123,47,255,0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="container" style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* Left Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ position: 'sticky', top: 100 }}
          >
            <div style={{
              background: 'rgba(15, 15, 35, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 32,
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              {/* Avatar with Glow */}
              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
                <div style={{
                  position: 'absolute', inset: -5,
                  background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                  borderRadius: '50%', opacity: 0.5, blur: '10px',
                  animation: 'live-pulse 2s ease-in-out infinite'
                }} />
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a1a3a, #0a0a1a)',
                  border: '3px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Orbitron', fontWeight: 900, fontSize: '3rem',
                  color: '#fff', position: 'relative', zIndex: 1
                }}>
                  {avatarLetter}
                </div>
              </div>

              <h1 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: 8 }}>{user.name}</h1>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, color: 'var(--cyan)', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: 20 }}>
                {user.email}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                <span style={{ 
                  padding: '6px 16px', borderRadius: 100, background: 'rgba(123,47,255,0.1)', 
                  border: '1px solid rgba(123,47,255,0.3)', color: 'var(--purple)', 
                  fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem'
                }}>🏆 {user.rank || 'PRO GAMER'}</span>
                <span style={{ 
                  padding: '6px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', 
                  fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem'
                }}>📍 {user.state || 'India'}</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, textAlign: 'left' }}>FAVORITE GAMES</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {games.length > 0 ? games.map(g => (
                    <div key={g} style={{
                      padding: '8px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.85rem', color: '#fff', fontFamily: 'Rajdhani', fontWeight: 600
                    }}>
                      {GAME_ICONS[g] || '🎮'} {g}
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No games added</div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '14px', borderRadius: 16,
                  background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
                  color: 'var(--pink)', fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.1)'; e.currentTarget.style.color = 'var(--pink)'; }}
              >
                LOGOUT SESSION
              </button>
            </div>
          </motion.div>

          {/* Right Column: Stats & Tournaments */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 40 }}>
              {[
                { label: 'Total XP', value: user.points || 0, icon: '⚡', color: 'var(--cyan)' },
                { label: 'Live Events', value: liveReg, icon: '🔴', color: 'var(--pink)' },
                { label: 'Upcoming', value: upcomingReg, icon: '⏳', color: '#ffd60a' },
                { label: 'Won/Past', value: pastReg, icon: '🏆', color: '#10B981' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(15,15,35,0.6)', border: '1px solid rgba(255,255,255,0.04)',
                  padding: '24px 20px', borderRadius: 24, textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', mt: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tournaments List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>My Arena</h2>
                <Link to="/tournaments" style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--cyan)', fontSize: '0.9rem' }}>FIND MORE +</Link>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[1, 2, 3].map(i => <Skeleton key={i} height="100px" borderRadius="16px" />)}
                </div>
              ) : myTournaments.length === 0 ? (
                <div style={{ 
                  padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 24
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎮</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: 24 }}>You haven't joined any battle yet.</p>
                  <Link to="/tournaments" className="btn btn-primary">JOIN FIRST TOURNAMENT</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {myTournaments.map((t, i) => (
                    <motion.div
                      key={t.id || t._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <Link to={`/tournaments/${t.id || t._id}`} style={{
                        display: 'flex', alignItems: 'center', gap: 20,
                        padding: '20px 24px', borderRadius: 24,
                        background: 'rgba(15, 15, 35, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 14,
                          background: `${t.banner_color || 'var(--purple)'}22`,
                          border: `1px solid ${t.banner_color || 'var(--purple)'}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.6rem'
                        }}>
                          {GAME_ICONS[t.game] || '🎮'}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 2 }}>{t.title}</div>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600 }}>{t.game}</span>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600 }}>{t.start_date}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            padding: '6px 14px', borderRadius: 100, border: '1px solid currentColor',
                            fontSize: '0.72rem', fontFamily: 'Rajdhani', fontWeight: 800,
                            color: t.status === 'live' ? 'var(--pink)' : t.status === 'upcoming' ? 'var(--cyan)' : 'var(--text-muted)',
                            background: t.status === 'live' ? 'rgba(255,45,120,0.1)' : t.status === 'upcoming' ? 'rgba(0,243,255,0.1)' : 'rgba(255,255,255,0.05)',
                            display: 'inline-flex', alignItems: 'center', gap: 4
                          }}>
                            {t.status === 'live' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', animation: 'live-pulse 1s infinite' }} />}
                            {t.status.toUpperCase()}
                          </div>
                          <div style={{ 
                            fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 800, mt: 8,
                            background: 'linear-gradient(135deg, #ffd60a, #ff9500)', 
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                          }}>
                            {t.prize_pool}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
