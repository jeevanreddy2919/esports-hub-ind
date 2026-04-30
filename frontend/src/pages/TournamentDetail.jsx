import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';
import CountdownTimer from '../components/CountdownTimer';
import { GameIcon } from '../utils/gameLogos';
import { FaShareAlt, FaMobileAlt, FaTwitter, FaTrophy, FaShieldAlt, FaScroll, FaBullseye, FaExternalLinkAlt } from 'react-icons/fa';

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    tournamentAPI.getById(id)
      .then(r => setTournament(r.data?.tournament))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user) {
      tournamentAPI.myRegistrations()
        .then(r => setRegistered(r.data?.tournaments?.some(t => (t._id || t.id) === id)))
        .catch(() => {});
      
      tournamentAPI.myBookmarks()
        .then(r => setBookmarked(r.data?.tournaments?.some(t => (t._id || t.id) === id)))
        .catch(() => {});
    }
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) { toast.error('Login to save tournaments.'); navigate('/login'); return; }
    setBookmarking(true);
    try {
      await tournamentAPI.toggleBookmark(id);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from saved.' : 'Added to saved tournaments.');
    } catch (err) {
      toast.error('Action failed!');
    } finally {
      setBookmarking(false);
    }
  };

  const handleRegister = async () => {
    if (!user) { toast.error('Please login to register.'); navigate('/login'); return; }
    setRegistering(true);
    try {
      await tournamentAPI.register(id);
      toast.success('Successfully registered! Get ready to compete.');
      setRegistered(true);
      setTournament(prev => ({ ...prev, slots_filled: prev.slots_filled + 1 }));
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed!';
      if (msg.includes('Already')) { toast.success('Already registered for this tournament.'); setRegistered(true); }
      else toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="page" style={{ background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '60px 24px' }}>
        <Skeleton width="180px" height="24px" className="mb-8" />
        <Skeleton height="350px" borderRadius="32px" className="mb-8" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Skeleton height="200px" borderRadius="24px" />
            <Skeleton height="400px" borderRadius="24px" />
          </div>
          <Skeleton height="500px" borderRadius="24px" />
        </div>
      </div>
    </div>
  );

  if (!tournament) return (
    <div className="page" style={{ textAlign: 'center', padding: '100px 0' }}>
      <div style={{ fontSize: '4rem', marginBottom: 20, display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}><FaTrophy style={{ opacity: 0.3 }} /></div>
      <h2 style={{ fontFamily: 'Orbitron', color: '#fff' }}>Tournament Not Found</h2>
      <Link to="/tournaments" style={{ color: 'var(--cyan)', marginTop: 20, display: 'inline-block' }}>← Back to All Tournaments</Link>
    </div>
  );

  const pct = Math.round((tournament.slots_filled / tournament.slots) * 100);
  const rules = (() => { 
    if (!tournament.rules) return [];
    if (Array.isArray(tournament.rules)) return tournament.rules;
    try { return JSON.parse(tournament.rules); } catch { return []; } 
  })();
  const isFull = tournament.slots_filled >= tournament.slots;
  const isPast = tournament.status === 'past';
  const accentColor = tournament.banner_color || '#7b2fff';

  return (
    <div className="page" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '70vh',
        background: `radial-gradient(circle at 50% 0%, ${accentColor}22 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="container" style={{ padding: '40px 24px 100px', position: 'relative', zIndex: 1 }}>
        <Link to="/tournaments" style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, 
          color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, 
          fontSize: '0.9rem', marginBottom: 32, transition: 'all 0.3s ease'
        }} onMouseEnter={e => e.currentTarget.style.color = accentColor} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          ← EXPLORE ALL TOURNAMENTS
        </Link>

        {/* Hero Section */}
        <div className="glass-card shape-oval" style={{
          position: 'relative',
          background: `linear-gradient(135deg, rgba(15,15,35,0.8), ${accentColor}08)`,
          padding: 'clamp(40px, 8vw, 80px)',
          marginBottom: 48,
          overflow: 'hidden',
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 30px ${accentColor}10`,
          border: `1px solid ${accentColor}22`
        }}>
          {/* Hero Decor */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
            background: `linear-gradient(90deg, transparent, ${accentColor}11)`,
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div className="shape-pill" style={{
                padding: '8px 24px',
                background: isPast ? 'rgba(255,255,255,0.1)' : tournament.status === 'live' ? 'rgba(255,45,120,0.15)' : 'rgba(0,243,255,0.1)',
                border: `1px solid ${isPast ? 'rgba(255,255,255,0.2)' : tournament.status === 'live' ? 'rgba(255,45,120,0.4)' : 'rgba(0,243,255,0.3)'}`,
                color: isPast ? 'var(--text-muted)' : tournament.status === 'live' ? 'var(--pink)' : 'var(--cyan)',
                fontFamily: 'Rajdhani', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.15em'
              }}>
                {tournament.status.toUpperCase()} {tournament.status === 'live' && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', animation: 'live-pulse 1s ease-in-out infinite', marginLeft: 6, verticalAlign: 'middle' }} />}
              </div>
              <button 
                onClick={handleBookmark}
                disabled={bookmarking}
                className="shape-circle"
                style={{ 
                  width: 44, height: 44, border: '1px solid rgba(255,255,255,0.1)', 
                  background: bookmarked ? 'var(--yellow)' : 'rgba(255,255,255,0.05)',
                  color: bookmarked ? '#000' : '#fff', cursor: 'pointer', transition: '0.3s'
                }}
              >
                {bookmarked ? '★' : '☆'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', mb: 32 }}>
              <div className="shape-soft-hex" style={{ 
                width: 110, height: 110,
                background: `${accentColor}22`, border: `2px solid ${accentColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 15px 35px ${accentColor}20`
              }}>
                <GameIcon game={tournament.game} size={56} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
                  {tournament.title}
                </h1>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 600, color: accentColor }}>
                   HOSTED BY {tournament.organizer.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div style={{ 
              display: 'flex', gap: 'clamp(20px, 4vw, 60px)', flexWrap: 'wrap', 
              marginTop: 40, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', mb: 5 }}>Prize Pool</div>
                <div style={{ 
                  fontFamily: 'Orbitron', fontWeight: 900, fontSize: '2rem',
                  background: 'linear-gradient(135deg, #ffd60a, #ff9500)', 
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>{tournament.prize_pool}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', mb: 5 }}>Launch Date</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>
                  {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase', mb: 5 }}>Mode</div>
                <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>{tournament.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="glass-card shape-oval" style={{ padding: 40 }}>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.3rem', fontWeight: 900, marginBottom: 24, color: '#fff', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 10 }}><FaBullseye style={{ color: 'var(--cyan)' }} /> TOURNAMENT OVERVIEW</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                {tournament.description}
              </p>
            </div>

            {rules.length > 0 && (
              <div className="glass-card shape-oval" style={{ padding: 40 }}>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.3rem', fontWeight: 900, marginBottom: 28, color: '#fff', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 10 }}><FaScroll style={{ color: 'var(--purple)' }} /> OFFICIAL RULES</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {rules.map((rule, i) => (
                    <div key={i} className="shape-pill" style={{ 
                      display: 'flex', gap: 18, padding: '18px 24px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '1.05rem'
                    }}>
                      <div className="shape-circle" style={{ 
                        width: 26, height: 26, background: accentColor, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#fff', flexShrink: 0
                      }}>{i + 1}</div>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Sidebar */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="glass-card shape-oval" style={{ 
              padding: '48px 40px', 
              border: `1px solid ${accentColor}33`,
              boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}10`
            }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <CountdownTimer targetDate={tournament.start_date} status={tournament.status} />
              </div>

              <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>TOTAL CAPACITY</span>
                  <span style={{ fontFamily: 'Orbitron', fontWeight: 900, color: isFull ? 'var(--pink)' : accentColor, fontSize: '0.95rem' }}>
                    {tournament.slots} SLOTS
                  </span>
                </div>
                <div className="shape-pill" style={{ height: 12, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div 
                    style={{ height: '100%', width: isFull ? '100%' : '60%', background: isFull ? 'var(--pink)' : `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)`, opacity: 0.6 }} 
                  />
                </div>
              </div>

              {/* Official Registration Button */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--yellow)', fontFamily: 'Rajdhani', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaExternalLinkAlt size={10} /> Official Tournament Portal
                </div>
                {tournament.registration_link && tournament.registration_link !== 'Completed' && tournament.registration_link !== 'Invite Only' && tournament.registration_link !== 'Coming Soon' ? (
                  <a 
                    href={tournament.registration_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shape-pill"
                    style={{
                      display: 'block', textAlign: 'center', padding: '18px',
                      background: 'rgba(255, 214, 10, 0.1)', border: '1px solid rgba(255, 214, 10, 0.4)',
                      color: 'var(--yellow)', fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.9rem',
                      textDecoration: 'none', transition: '0.3s', marginBottom: 8
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 214, 10, 0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 214, 10, 0.1)'; }}
                  >
                    OFFICIAL REGISTRATION
                  </a>
                ) : (
                  <div className="shape-pill" style={{
                    textAlign: 'center', padding: '18px',
                    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-muted)', fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.9rem',
                    marginBottom: 8
                  }}>
                    {tournament.registration_link || 'TBD'}
                  </div>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600, textAlign: 'center', marginTop: 8 }}>
                  *Use the link above to officially enter the tournament.
                </p>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '32px 0' }} />

              <div style={{ marginBottom: 16 }}>
                 <div style={{ fontSize: '0.65rem', color: accentColor, fontFamily: 'Rajdhani', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
                   Esports Hub Roster Tracking
                 </div>
              </div>

              {registered ? (
                <div className="shape-oval" style={{ 
                  padding: '32px 24px', textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.4)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16, display: 'flex', justifyContent: 'center', color: '#10B981' }}><FaShieldAlt /></div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 900, color: '#10B981', fontSize: '1.4rem', marginBottom: 8 }}>HUB SECURED</div>
                  <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your stats for this tournament are being tracked.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button 
                    onClick={handleRegister}
                    disabled={registering || isPast || isFull}
                    className="shape-pill"
                    style={{
                      width: '100%', padding: '22px',
                      background: isPast || isFull ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                      color: '#fff', border: 'none', fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.1rem',
                      cursor: registering || isPast || isFull ? 'not-allowed' : 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      boxShadow: !isPast && !isFull ? `0 15px 35px ${accentColor}40` : 'none',
                      letterSpacing: '0.05em'
                    }}
                    onMouseEnter={e => { if (!isPast && !isFull) e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)'; }}
                    onMouseLeave={e => { if (!isPast && !isFull) e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
                  >
                    {registering ? 'PROCESSING...' : isPast ? 'EXPIRED' : isFull ? 'FULL' : 'JOIN HUB ROSTER'}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600, textAlign: 'center' }}>
                    Join our Hub roster to track your rank and win Hub points.
                  </p>
                </div>
              )}

              {!user && !isPast && !isFull && (
                <p style={{ textAlign: 'center', mt: 20, color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'Rajdhani', marginTop: 20 }}>
                  Account required to follow. <Link to="/login" style={{ color: accentColor, fontWeight: 700 }}>LOGIN</Link>
                </p>
              )}
            </div>

            {/* Share & Support */}
            <div style={{ 
              marginTop: 20, background: 'rgba(15,15,35,0.6)', borderRadius: 24, padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>SHARE</div>
              <div style={{ display: 'flex', gap: 15 }}>
                {[<FaShareAlt />, <FaMobileAlt />, <FaTwitter />].map((icon, i) => (
                  <button key={i} onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} 
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
