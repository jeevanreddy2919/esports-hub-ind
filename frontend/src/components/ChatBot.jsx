import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';

const QUICK_PROMPTS = [
  '🏆 How to register?',
  '🎮 Active tournaments?',
  '💰 Prize pool info',
  '📋 Game rules?',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey Gamer! 🎮 I'm **GameGuru**, your esports assistant! Ask me about tournaments, registration, prize pools, or game tips! Let's GWLP! 🚀" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
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
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm offline right now! 😅 Check back soon. For help, visit our Tournaments page!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') sendMessage(); };

  const formatText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <div className="chatbot-title">GameGuru AI</div>
              <div className="chatbot-status">Online & Ready</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              marginLeft: 'auto', background: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem'
            }}>✕</button>
          </div>

          <div className="chatbot-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', flexShrink: 0
                  }}>🤖</div>
                )}
                <div
                  className={`chat-bubble ${msg.role}`}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
              </div>
            ))}
            {loading && (
              <div className="chat-message">
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', flexShrink: 0
                }}>🤖</div>
                <div className="chat-bubble bot" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--cyan)',
                      animation: `live-pulse 1.2s ease-in-out ${i*0.2}s infinite`
                    }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  padding: '5px 10px', borderRadius: 100,
                  background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.3)',
                  color: 'var(--text-secondary)', fontSize: '0.75rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 600
                }}>{q}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button className="chatbot-send" onClick={() => sendMessage()} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)} title="GameGuru AI Chat">
        {open ? '✕' : '🤖'}
      </button>
    </>
  );
}
