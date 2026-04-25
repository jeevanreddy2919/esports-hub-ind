import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo_final.png';
import { GameIcon } from '../utils/gameLogos';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaGamepad, FaEye, FaEyeSlash, FaMedal } from 'react-icons/fa';

const INDIAN_STATES = [
  '',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const GAMES_LIST = ['Valorant', 'BGMI', 'MLBB', 'Free Fire Max', 'Pokemon Unite', 'Minecraft', 'CS2', 'Call of Duty Mobile', 'Tekken 8', 'Clash Royale', 'FC Mobile'];

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
      toast.success('Account created! Welcome to the arena.');
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

      {['BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Clash Royale'].map((game, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: `${8 + i * 11}%`,
          left: i % 2 === 0 ? `${2 + i}%` : undefined,
          right: i % 2 !== 0 ? `${2 + i}%` : undefined,
          opacity: 0.15, animation: `float ${4 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
          pointerEvents: 'none', filter: 'grayscale(100%)',
        }}>
          <GameIcon game={game} size={28 + (i % 3) * 12} />
        </div>
      ))}

      <div className="auth-card shape-oval" style={{ 
        position: 'relative', 
        zIndex: 2,
        padding: '50px 40px',
        maxWidth: 500,
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(123,47,255,0.1)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          position: 'absolute', top: -1, left: '15%', right: '15%', height: 2,
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
          <img src={logo} alt="India Esports Hub" style={{ height: 60, filter: 'drop-shadow(0 0 15px var(--cyan-glow))' }} />
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i <= step ? 'linear-gradient(135deg, var(--purple), var(--cyan))' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i <= step ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.85rem',
                color: i <= step ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: i <= step ? '0 0 20px rgba(0,243,255,0.3)' : 'none',
                transform: i === step ? 'scale(1.15)' : 'scale(1)',
              }}>{i < step ? '✓' : i + 1}</div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 24, height: 2, background: i < step ? 'var(--cyan)' : 'rgba(255,255,255,0.1)', borderRadius: 100 }} />
              )}
            </div>
          ))}
        </div>

        <h1 className="auth-title" style={{ fontFamily: 'Orbitron', fontWeight: 900, marginBottom: 12 }}>
          <span className="gradient-text">{STEPS[step]}</span>
        </h1>
        <p className="auth-subtitle" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 40 }}>
          {step === 0 && 'Create your legendary player account'}
          {step === 1 && 'Define your gaming path'}
          {step === 2 && 'Identity verified. Ready for combat!'}
        </p>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {step === 0 && (
            <>
              <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" htmlFor="sigup-name" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaUser style={{ fontSize: '0.8rem' }} /> Player Name</label>
                <input id="sigup-name" name="name" className="form-input shape-pill" type="text" placeholder="Your combat alias" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ paddingLeft: 28 }} />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="signup-email" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaEnvelope style={{ fontSize: '0.8rem' }} /> Email</label>
                <input id="signup-email" name="email" className="form-input shape-pill" type="email" placeholder="Enter Email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ paddingLeft: 28 }} />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaLock style={{ fontSize: '0.8rem' }} /> Password</label>
                <div style={{ position: 'relative' }}>
                  <input id="signup-password" name="password" className="form-input shape-pill" type={show ? 'text' : 'password'} placeholder="Enter Password"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ paddingLeft: 28, paddingRight: 56 }} />
                  <button type="button" onClick={() => setShow(s => !s)} style={{
                    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', border: 'none', cursor: 'pointer',
                  }}>{show ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaLock style={{ fontSize: '0.8rem' }} /> Confirm Password</label>
                <input className="form-input shape-pill" type="password" placeholder="Verify your password"
                  value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} style={{ paddingLeft: 28 }} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaMapMarkerAlt style={{ fontSize: '0.8rem' }} /> Combat Region</label>
                <select className="form-select shape-pill" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required style={{ paddingLeft: 28 }}>
                  <option value="" disabled>-- Select your state --</option>
                  {INDIAN_STATES.filter(s => s !== '').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}><FaGamepad style={{ fontSize: '0.8rem' }} /> Specialized Games</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, padding: '0 8px' }}>
                  {GAMES_LIST.map(game => (
                    <button key={game} type="button" onClick={() => toggleGame(game)} className="shape-pill" style={{
                      padding: '10px 20px',
                      background: form.games.includes(game) ? 'linear-gradient(135deg, var(--purple), var(--cyan))' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.games.includes(game) ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                      color: form.games.includes(game) ? '#fff' : 'var(--text-secondary)',
                      fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem',
                      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transform: form.games.includes(game) ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: form.games.includes(game) ? '0 10px 20px rgba(0,243,255,0.2)' : 'none',
                    }}>{game}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 24, display: 'flex', justifyContent: 'center', color: '#ffd60a' }} className="anim-bounce-in"><FaMedal /></div>
              <div className="shape-oval" style={{ background: 'rgba(255,255,255,0.03)', padding: 32, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.9rem', width: 80, fontWeight: 700 }}>PLAYER</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.1rem' }}>{form.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.9rem', width: 80, fontWeight: 700 }}>REGION</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.1rem' }}>{form.state}</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontSize: '0.9rem', width: 80, fontWeight: 700 }}>MAINS</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.1rem', color: 'var(--cyan)' }}>
                    {form.games.length > 0 ? form.games.join(', ') : 'Versatile Player'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            {step > 0 && (
              <button type="button" className="btn btn-secondary shape-pill" style={{ flex: 1, height: 52 }} onClick={() => setStep(s => s - 1)}>
                ← REVISE
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-lg shape-pill" style={{ flex: 2, justifyContent: 'center', height: 56 }} disabled={loading}>
              {loading ? <><div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> DEPLOYING...</>
                : step < 2 ? 'PROCEED →'
                  : 'READY FOR COMBAT'}
            </button>
          </div>
        </form>

        <p className="auth-switch" style={{ marginTop: 32, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already signed the contract? <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 700 }}>Access Arena →</Link>
        </p>
      </div>
    </div>
  );
}
