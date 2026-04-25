import { useState, useRef, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { FaBrain, FaTrophy, FaCoins, FaGamepad, FaBolt, FaClipboardList, FaPaperPlane, FaTimes } from 'react-icons/fa';

const QUICK_PROMPTS = [
  { label: 'Live Tournaments', icon: <FaTrophy /> },
  { label: 'Prize & Payouts', icon: <FaCoins /> },
  { label: 'BGMI Tournaments', icon: <FaGamepad /> },
  { label: 'Valorant Events', icon: <FaBolt /> },
  { label: 'How to Register', icon: <FaClipboardList /> },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const hasSeen = sessionStorage.getItem('hasSeenIntro');
    return [{
      role: 'bot',
      text: hasSeen
        ? "Welcome back! How can I help you dominate today?"
        : "Welcome! I'm **NeuroGamer**, your AI Esports Mentor for India Esports Hub. Ask me about live tournaments, registration, prizes, or gaming tips!"
    }];
  });
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const windowRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (windowRef.current && !windowRef.current.contains(e.target)) {
        const toggle = document.getElementById('chatbot-toggle-btn');
        if (toggle && toggle.contains(e.target)) return;
        setOpen(false);
        sessionStorage.setItem('hasSeenIntro', 'true');
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6);
      const res = await chatAPI.send({ message: msg, history });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm having a slight connection glitch. Check the **Tournaments** page for live schedules. Try again in a moment!"
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKey = (e) => { if (e.key === 'Enter') sendMessage(); };

  const formatText = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  const closeBot = () => {
    setOpen(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  return (
    <>
      {/* Chatbot Window */}
      {open && (
        <div ref={windowRef} className="chatbot-window" style={{
          position: 'fixed', bottom: 104, right: 28,
          width: 'min(380px, calc(100vw - 40px))',
          maxHeight: 540,
          borderRadius: 20,
          background: 'rgba(6,6,22,0.98)',
          border: '1px solid rgba(0,243,255,0.2)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 60px rgba(123,47,255,0.15)',
          zIndex: 10000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          backdropFilter: 'blur(30px)',
          animation: 'bounce-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(123,47,255,0.35), rgba(0,243,255,0.12))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14,
              background: 'linear-gradient(135deg, #7b2fff, #00f3ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
              boxShadow: '0 0 20px rgba(0,243,255,0.4)',
              border: '1px solid rgba(0,243,255,0.3)',
            }}><FaBrain style={{ fontSize: '1.3rem' }} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', fontWeight: 700, marginBottom: 2 }}>
                NeuroGamer <span style={{ color: 'var(--cyan)', fontSize: '0.7rem' }}>AI</span>
              </div>
              <div style={{
                fontSize: '0.72rem', color: '#10B981',
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'Rajdhani', fontWeight: 600,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'live-pulse 1.5s ease-in-out infinite', display: 'inline-block' }}/>
                Online & Ready
              </div>
            </div>
            <button onClick={closeBot} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.9rem',
              borderRadius: 8, width: 32, height: 32, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,45,120,0.2)'; e.target.style.color = '#ff2d78'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}
            ><FaTimes /></button>
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 10,
            minHeight: 280, maxHeight: 330,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'fadeInUp 0.3s ease' }}>
                {msg.role === 'bot' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                    background: 'linear-gradient(135deg, #7b2fff, #00f3ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', boxShadow: '0 0 10px rgba(0,243,255,0.3)',
                  }}><FaBrain /></div>
                )}
                <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} style={{
                  padding: '10px 14px', borderRadius: msg.role === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  fontSize: '0.865rem', lineHeight: 1.55, maxWidth: '82%',
                  background: msg.role === 'bot'
                    ? 'rgba(123,47,255,0.18)'
                    : 'linear-gradient(135deg, #7b2fff, #00f3ff)',
                  border: msg.role === 'bot' ? '1px solid rgba(123,47,255,0.3)' : 'none',
                  color: '#fff',
                }} />
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg, #7b2fff, #00f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}><FaBrain /></div>
                <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(123,47,255,0.18)', border: '1px solid rgba(123,47,255,0.3)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)', animation: `live-pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q.label} onClick={() => sendMessage(q.label)} style={{
                  padding: '5px 11px', borderRadius: 100,
                  background: 'rgba(0,243,255,0.07)', border: '1px solid rgba(0,243,255,0.2)',
                  color: 'var(--text-secondary)', fontSize: '0.75rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Rajdhani', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.15)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                ><span style={{ opacity: 0.8 }}>{q.icon}</span> {q.label}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: 8, flexShrink: 0,
            background: 'rgba(0,0,0,0.2)',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff',
                fontSize: '0.875rem', outline: 'none',
                fontFamily: 'Inter',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,243,255,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <button onClick={() => sendMessage()} disabled={loading} style={{
              width: 42, height: 42,
              borderRadius: 10, flexShrink: 0,
              background: loading ? 'rgba(123,47,255,0.3)' : 'linear-gradient(135deg, #7b2fff, #00f3ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              color: '#fff',
            }}><FaPaperPlane /></button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button id="chatbot-toggle-btn" onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 28, right: 28,
        width: 62, height: 62, borderRadius: '50%', zIndex: 10000,
        background: open ? 'linear-gradient(135deg, #ff2d78, #7b2fff)' : 'linear-gradient(135deg, #7b2fff, #00f3ff)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: open ? '1.4rem' : '1.8rem',
        boxShadow: open ? '0 0 30px rgba(255,45,120,0.5)' : '0 0 30px rgba(123,47,255,0.6)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        animation: open ? 'none' : 'pulse-glow 2.5s ease-in-out infinite',
      }}
      title="NeuroGamer AI">
        {open ? <FaTimes style={{ fontSize: '1.2rem' }} /> : <FaBrain style={{ fontSize: '1.6rem' }} />}
      </button>
    </>
  );
}
