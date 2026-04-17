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
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tournamentAPI.myRegistrations(),
      tournamentAPI.myBookmarks()
    ])
      .then(([regRes, bookRes]) => {
        setMyTournaments(regRes.data?.tournaments || []);
        setBookmarks(bookRes.data?.tournaments || []);
      })
      .catch((err) => {
        console.error('Fetcher error', err);
      })
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
            <div className="glass-card shape-oval" style={{
              padding: '50px 32px',
              textAlign: 'center',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              overflow: 'visible'
            }}>
              {/* Avatar with Glow */}
              <div className="shape-circle" style={{ 
                width: 130, height: 130, margin: '-90px auto 24px',
                background: 'linear-gradient(135deg, #1a1a3a, #0a0a1a)',
                border: '4px solid var(--purple)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron', fontWeight: 900, fontSize: '3.5rem',
                color: '#fff', position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(123,47,255,0.3)'
              }}>
                {avatarLetter}
                <div style={{ position: 'absolute', bottom: 5, right: 5, fontSize: '1.2rem' }}>💎</div>
              </div>

              <h1 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: 8 }}>{user.name}</h1>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, color: 'var(--cyan)', fontSize: '1rem', letterSpacing: '0.05em', marginBottom: 20 }}>
                {user.email}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                <span className="shape-pill" style={{ 
                  padding: '8px 18px', background: 'rgba(123,47,255,0.15)', 
                  border: '1px solid rgba(123,47,255,0.4)', color: 'var(--purple)', 
                  fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem'
                }}>🏆 {user.rank || 'ELITE WARRIOR'}</span>
                <span className="shape-pill" style={{ 
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', 
                  fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem'
                }}>📍 {user.state || 'India'}</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 18, textAlign: 'left', fontWeight: 800 }}>SPECIALIZED TITLES</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {games.length > 0 ? games.map(g => (
                    <div key={g} className="shape-pill" style={{
                      padding: '10px 16px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: '0.85rem', color: '#fff', fontFamily: 'Rajdhani', fontWeight: 700
                    }}>
                      {GAME_ICONS[g] || '🎮'} {g}
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Identity pending...</div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="shape-pill"
                style={{
                  width: '100%', padding: '16px',
                  background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
                  color: 'var(--pink)', fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.85rem',
                  cursor: 'pointer', transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                DISCONNECT SESSION
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
            <div style={{ display: 'flex', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
              {[
                { label: 'PLAYER XP', value: user.points || 0, icon: '⚡', color: 'var(--cyan)' },
                { label: 'LIVE COMBAT', value: liveReg, icon: '🔴', color: 'var(--pink)' },
                { label: 'MISSION READY', value: upcomingReg, icon: '⏳', color: '#ffd60a' },
                { label: 'LEGACY BATTLES', value: pastReg, icon: '🏆', color: '#10B981' },
              ].map(s => (
                <div key={s.label} className="shape-circle" style={{
                  width: 120, height: 120,
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}22`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 10px 20px rgba(0,0,0,0.3), 0 0 15px ${s.color}10`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 800, letterSpacing: '0.05em' }}>{s.label}</div>
                  <div style={{ fontSize: '1rem', marginTop: 4 }}>{s.icon}</div>
                </div>
              ))}
            </div>

            {/* Tournaments List */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>ACTIVE MISSIONS</h2>
                <Link to="/tournaments" className="shape-pill" style={{ padding: '8px 20px', background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)', color: 'var(--cyan)', fontSize: '0.8rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>FIND MORE +</Link>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[1, 2].map(i => <Skeleton key={i} height="100px" borderRadius="999px" />)}
                </div>
              ) : myTournaments.length === 0 ? (
                <div className="shape-oval" style={{ 
                  padding: '50px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚔️</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: 24, fontFamily: 'Rajdhani', fontWeight: 600 }}>No active mission records found.</p>
                  <Link to="/tournaments" className="btn btn-primary shape-pill">START YOUR LEGACY</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {myTournaments.map((t, i) => (
                    <motion.div
                      key={t.id || t._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/tournaments/${t.id || t._id}`} className="shape-pill" style={{
                        display: 'flex', alignItems: 'center', gap: 24,
                        padding: '16px 32px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className="shape-soft-hex" style={{
                          width: 52, height: 52,
                          background: `${t.banner_color || 'var(--purple)'}22`,
                          border: `1px solid ${t.banner_color || 'var(--purple)'}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.6rem'
                        }}>
                          {GAME_ICONS[t.game] || '🎮'}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: 2 }}>{t.title}</div>
                          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{t.game}</span>
                            <span style={{ color: 'var(--cyan)', fontSize: '0.85rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>{t.start_date}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div className="shape-pill" style={{ 
                            padding: '6px 14px', border: '1px solid currentColor',
                            fontSize: '0.7rem', fontFamily: 'Rajdhani', fontWeight: 900,
                            color: t.status === 'live' ? 'var(--pink)' : t.status === 'upcoming' ? 'var(--cyan)' : 'var(--text-muted)',
                            background: t.status === 'live' ? 'rgba(255,45,120,0.1)' : t.status === 'upcoming' ? 'rgba(0,243,255,0.1)' : 'rgba(255,255,255,0.05)',
                          }}>
                            {t.status.toUpperCase()}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarks Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 900, color: 'var(--yellow)' }}>SAVED BATTLES ⭐</h2>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Skeleton height="80px" borderRadius="999px" />
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="shape-pill" style={{ 
                  padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)',
                  fontSize: '0.9rem', fontFamily: 'Rajdhani', fontWeight: 600
                }}>
                  No bookmarked tournaments found. Save some to track them later!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {bookmarks.map((t, i) => (
                    <motion.div
                      key={t.id || t._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/tournaments/${t.id || t._id}`} className="shape-pill" style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '12px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: '0.3s'
                      }}>
                         <span style={{ fontSize: '1.2rem' }}>{GAME_ICONS[t.game]}</span>
                         <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{t.title}</div>
                            <div style={{ color: 'var(--yellow)', fontSize: '0.75rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>{t.prize_pool}</div>
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
