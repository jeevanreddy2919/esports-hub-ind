import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const navLinks = [
  { to: '/', label: '🏠 Home' },
  { to: '/tournaments', label: '🏆 Tournaments' },
  { to: '/leaderboard', label: '📊 Leaderboard' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-secondary btn-sm">
                  👤 {user.name.split(' ')[0]}
                </Link>
                <button onClick={logout} className="btn btn-sm" style={{
                  background: 'rgba(255,45,120,0.15)',
                  color: 'var(--pink)',
                  border: '1px solid rgba(255,45,120,0.3)'
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Join Now 🚀</Link>
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
            <button onClick={logout} className="btn" style={{
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
