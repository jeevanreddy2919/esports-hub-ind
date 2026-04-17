import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import logo from '../assets/logo_final.png';

const navLinks = [
  { to: '/', label: '🏠 Home' },
  { to: '/tournaments', label: '🏆 Tournaments' },
  { to: '/leaderboard', label: '📊 Leaderboard' },
  { to: '/community', label: '🤝 Community' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  
  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchNotifications = useCallback(() => {
    if (!user) return;
    notificationAPI.get()
      .then(res => {
        const list = res.data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.is_read).length);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Refresh every 2 mins
    if (user) {
      const interval = setInterval(fetchNotifications, 120000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const markRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { toast.error('Check your connection'); }
  };

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="India Esports Hub" style={{ height: '72px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          <div className="navbar-links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions" style={{ gap: 14 }}>
            {user ? (
              <>
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => { setShowNotif(!showNotif); if (!showNotif) fetchNotifications(); }}
                    style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', justifyContent: 'center', border: showNotif ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)', transition: '0.3s' }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{unreadCount > 0 ? '🔔' : '🔕'}</span>
                    {unreadCount > 0 && (
                      <span className="live-pulse" style={{
                        position: 'absolute', top: 5, right: 5,
                        width: 14, height: 14, borderRadius: '50%',
                        background: 'var(--pink)', color: '#fff', fontSize: '0.6rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, border: '2px solid #000'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showNotif && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="glass-card shape-oval"
                        style={{
                          position: 'absolute', top: 55, right: 0, width: 320,
                          padding: '24px', zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                          maxHeight: 450, overflowY: 'auto'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                           <span style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>NOTIFICATIONS</span>
                           <span onClick={() => setShowNotif(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>✕</span>
                        </div>

                        {notifications.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>
                            Quiet in the arena. No alerts.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {notifications.map(n => (
                              <div 
                                key={n._id || n.id}
                                onClick={() => markRead(n._id || n.id)}
                                className="shape-pill"
                                style={{ 
                                  padding: '12px 16px', background: n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(0,243,255,0.05)',
                                  border: n.is_read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,243,255,0.2)',
                                  cursor: 'pointer', transition: '0.3s', position: 'relative'
                                }}
                              >
                                {!n.is_read && <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)' }} />}
                                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginLeft: 12 }}>{n.title}</div>
                                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 12, marginTop: 2 }}>{n.message}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/profile" className="btn btn-secondary btn-sm shape-pill">
                  👤 {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="btn btn-sm shape-pill" style={{
                  background: 'rgba(255,45,120,0.15)',
                  color: 'var(--pink)',
                  border: '1px solid rgba(255,45,120,0.3)',
                  padding: '8px 16px'
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm shape-pill">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm shape-pill">Join Now 🚀</Link>
              </>
            )}
            <button className="hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
        <Link to="/" className="navbar-logo" style={{ marginBottom: 16 }}>
          <img src={logo} alt="India Esports Hub" style={{ height: 50 }} />
        </Link>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} className="nav-link" style={{ fontSize: '1.4rem' }}>
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link to="/profile" className="btn btn-secondary">👤 Profile</Link>
            <button onClick={handleLogout} className="btn" style={{
              background: 'rgba(255,45,120,0.15)', color: 'var(--pink)', border: '1px solid rgba(255,45,120,0.3)'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Join Now 🚀</Link>
          </>
        )}
      </div>
    </>
  );
}
