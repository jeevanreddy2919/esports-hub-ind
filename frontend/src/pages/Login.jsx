import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo_final.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) return toast.error('All fields required!');
    setLoading(true);
    try {
      await login(form.identifier, form.password);
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

      <div className="auth-card shape-oval" style={{ 
        position: 'relative', 
        zIndex: 2,
        padding: '50px 40px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(123,47,255,0.1)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '20%', right: '20%', height: 2,
          background: 'linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent)',
          borderRadius: 100,
        }} />

        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: '0.2s', zIndex: 10 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,45,120,0.2)'; e.currentTarget.style.color = '#ff2d78'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          ✕
        </button>

        <div className="auth-logo" style={{ marginBottom: 32 }}>
          <img src={logo} alt="India Esports Hub" style={{ height: 64, filter: 'drop-shadow(0 0 15px var(--cyan-glow))' }} />
        </div>

        <h1 className="auth-title" style={{ fontFamily: 'Orbitron', fontWeight: 900, marginBottom: 12 }}>
          <span className="gradient-text">Welcome Back</span>
        </h1>
        <p className="auth-subtitle" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 40 }}>Login to access your tournaments & stats</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-identifier" style={{ marginLeft: 20 }}>👤 Email or Player Name</label>
            <input
              id="login-identifier"
              name="username"
              className="form-input shape-pill"
              type="text"
              placeholder="Enter your email or player name"
              value={form.identifier}
              onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))}
              autoComplete="username"
              style={{ paddingLeft: 28 }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-password" style={{ marginLeft: 20 }}>🔒 Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                name="password"
                className="form-input shape-pill"
                type={show ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingLeft: 28, paddingRight: 56 }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem',
              }}>{show ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg shape-pill" style={{ width: '100%', justifyContent: 'center', height: 56 }} disabled={loading}>
            {loading ? (
              <><div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> SECURING ACCESS...</>
            ) : 'ACCESS ARENA ⚔️'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '32px 0', opacity: 0.5 }}>OR CONTINUE WITH</div>

        <div style={{ display: 'grid', gap: 12 }}>
          <button 
            type="button"
            onClick={() => toast.success('Google Auth coming soon! 🚀')}
            className="btn shape-pill"
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.64 4.88 1.94l3.65-3.65C18.25 1.15 15.35 0 12 0 7.37 0 3.39 2.67 1.49 6.59l4.28 3.32C6.73 7.36 9.17 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.85-.08-1.68-.21-2.5H12v4.73h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.71 2.87c2.17-2 3.42-4.95 3.42-8.68z"/>
              <path fill="#FBBC05" d="M5.77 14.13c-.27-.81-.42-1.67-.42-2.57 0-.9.15-1.76.42-2.57L1.49 5.67C.54 7.57 0 9.73 0 11.99c0 2.26.54 4.42 1.49 6.32l4.28-3.32v-1.1s.01.24 0 .24z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.89l-3.71-2.87c-1.1.73-2.5 1.17-4.24 1.17-3.26 0-6.03-2.2-7.02-5.17l-4.28 3.32C3.39 21.33 7.37 24 12 24z"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="auth-switch" style={{ marginTop: 32, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          New Combatant? <Link to="/signup" style={{ color: 'var(--cyan)', fontWeight: 700 }}>Deploy Identity →</Link>
        </p>
      </div>
    </div>
  );
}
