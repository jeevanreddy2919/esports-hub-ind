import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const INDIAN_STATES = [
  '',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const GAMES_LIST = ['BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];

const STEPS = ['Account Info', 'Gaming Profile', 'Ready!'];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    state: '', games: [],
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const toggleGame = (game) => {
    setForm(p => ({
      ...p,
      games: p.games.includes(game) ? p.games.filter(g => g !== game) : [...p.games, game]
    }));
  };

  const nextStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password) return toast.error('Fill all fields!');
      if (form.password.length < 8) return toast.error('Password must be at least 8 characters!');
      if (form.password !== form.confirmPassword) return toast.error('Passwords do not match!');
    } else if (step === 1) {
      if (!form.state) return toast.error('Please select your state!');
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password, state: form.state, games: form.games });
      toast.success('Account created! Welcome to the arena! 🎮🔥');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed!');
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      {['🎯', '⚡', '🔥', '🏆', '🎮', '⚔️', '👊', '♟️'].map((emoji, i) => (
        <div key={i} style={{
          position: 'fixed', fontSize: `${1.3 + (i % 3) * 0.4}rem`,
          top: `${8 + i * 11}%`,
          left: i % 2 === 0 ? `${2 + i}%` : undefined,
          right: i % 2 !== 0 ? `${2 + i}%` : undefined,
          opacity: 0.1, animation: `float ${3 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
          pointerEvents: 'none',
        }}>{emoji}</div>
      ))}

      <div className="auth-card" style={{ maxWidth: 520, position: 'relative', zIndex: 2 }}>
        <div style={{
          position: 'absolute', top: -1, left: '15%', right: '15%', height: 2,
          background: 'linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent)',
        }} />

        <div className="auth-logo">
          <img src={logo} alt="India Esports Hub" />
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: i <= step ? 'linear-gradient(135deg, var(--purple), var(--cyan))' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${i <= step ? 'transparent' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.8rem',
                color: i <= step ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.4s ease',
                boxShadow: i <= step ? '0 0 15px rgba(0,243,255,0.3)' : 'none',
              }}>{i < step ? '✓' : i + 1}</div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 40, height: 2, background: i < step ? 'var(--cyan)' : 'var(--border)', borderRadius: 1, transition: 'all 0.4s ease' }} />
              )}
            </div>
          ))}
        </div>

        <h1 className="auth-title"><span className="gradient-text">{STEPS[step]}</span></h1>
        <p className="auth-subtitle">
          {step === 0 && 'Create your player account'}
          {step === 1 && 'Tell us about your gaming preferences'}
          {step === 2 && 'You\'re all set to join the arena!'}
        </p>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {step === 0 && (
            <>
              <div className="form-group">
                <label className="form-label">👤 Full Name</label>
                <input className="form-input" type="text" placeholder="Your gaming name" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">📧 Email</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">🔒 Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={show ? 'text' : 'password'} placeholder="Min 8 characters"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ paddingRight: 48 }} />
                  <button type="button" onClick={() => setShow(s => !s)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', fontSize: '1rem',
                  }}>{show ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">🔒 Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">📍 Select Your State *</label>
                <select className="form-select" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required>
                  <option value="" disabled>-- Select your state --</option>
                  {INDIAN_STATES.filter(s => s !== '').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">🎮 Favourite Games (Select all)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {GAMES_LIST.map(game => (
                    <button key={game} type="button" onClick={() => toggleGame(game)} style={{
                      padding: '8px 16px', borderRadius: 100,
                      background: form.games.includes(game) ? 'linear-gradient(135deg, var(--purple), var(--cyan))' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${form.games.includes(game) ? 'transparent' : 'var(--border)'}`,
                      color: form.games.includes(game) ? '#fff' : 'var(--text-secondary)',
                      fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                      transform: form.games.includes(game) ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: form.games.includes(game) ? '0 0 15px rgba(0,243,255,0.3)' : 'none',
                    }}>{game}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }} className="anim-bounce-in">🎉</div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border)', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.85rem', width: 60 }}>NAME</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{form.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.85rem', width: 60 }}>STATE</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{form.state}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.85rem', width: 60 }}>GAMES</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--cyan)' }}>
                    {form.games.length > 0 ? form.games.join(', ') : 'Not selected'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 0 && (
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
              {loading ? <><div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> Creating...</>
                : step < 2 ? 'Next →'
                  : '🚀 Create Account!'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          Already a player? <Link to="/login">Login →</Link>
        </p>
      </div>
    </div>
  );
}
