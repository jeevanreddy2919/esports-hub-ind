import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required!');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Gamer! 🎮');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {/* Floating game icons */}
      {['🎯','⚡','🔥','🏆','🎮','👊'].map((emoji, i) => (
        <div key={i} style={{
          position: 'fixed',
          fontSize: `${1.5 + (i % 3) * 0.5}rem`,
          top: `${10 + i * 14}%`,
          left: i % 2 === 0 ? `${3 + i * 2}%` : undefined,
          right: i % 2 !== 0 ? `${3 + i * 2}%` : undefined,
          opacity: 0.12,
          animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>{emoji}</div>
      ))}

      <div className="auth-card" style={{ position: 'relative', zIndex: 2 }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: -1, left: '20%', right: '20%', height: 2,
          background: 'linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent)',
          borderRadius: 2,
        }} />

        <div className="auth-logo">
          <img src={logo} alt="India Esports Hub" />
        </div>

        <h1 className="auth-title">
          <span className="gradient-text">Welcome Back</span>
        </h1>
        <p className="auth-subtitle">Login to access your tournaments & stats</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📧 Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={show ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', color: 'var(--text-muted)', fontSize: '1rem',
              }}>{show ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? (
              <><div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> Logging in...</>
            ) : '🚀 Login to Play'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { emoji: '🎯', game: 'BGMI Player' },
            { emoji: '⚡', game: 'Valorant Player' },
          ].map(({ emoji, game }) => (
            <div key={game} style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'default',
            }}>
              <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'Rajdhani', fontWeight: 600 }}>
                Continue as {game}
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Coming Soon</span>
            </div>
          ))}
        </div>

        <p className="auth-switch">
          New to India Esports Hub? <Link to="/signup">Create Account →</Link>
        </p>
      </div>
    </div>
  );
}
