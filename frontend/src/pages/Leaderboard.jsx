import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import { leaderboardAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import { GameIcon } from '../utils/gameLogos';

const GAMES = ['all', 'Valorant', 'BGMI', 'MLBB', 'Free Fire Max', 'Pokemon Unite', 'Minecraft', 'CS2', 'Call of Duty Mobile', 'Tekken 8', 'Clash Royale', 'FC Mobile'];

const RankBadge = ({ rank }) => {
  const colors = {
    1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', shadow: 'rgba(255, 215, 0, 0.4)', label: '1' },
    2: { bg: 'linear-gradient(135deg, #C0C0C0, #808080)', shadow: 'rgba(192, 192, 192, 0.3)', label: '2' },
    3: { bg: 'linear-gradient(135deg, #CD7F32, #8B4513)', shadow: 'rgba(205, 127, 50, 0.3)', label: '3' }
  };
  
  const config = colors[rank] || { bg: 'rgba(255,255,255,0.06)', shadow: 'transparent', label: rank };

  return (
    <div className="shape-circle" style={{
      width: 44, height: 44,
      background: config.bg,
      boxShadow: `0 0 20px ${config.shadow}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: rank <= 3 ? '1.4rem' : '0.9rem',
      fontFamily: 'Orbitron', fontWeight: 900,
      color: rank <= 3 ? '#000' : '#fff',
      flexShrink: 0,
      border: rank <= 3 ? 'none' : '1px solid rgba(255,255,255,0.1)'
    }}>
      {config.label}
    </div>
  );
};

const PodiumCard = ({ player, rank, gameIcon }) => {
  const isFirst = rank === 1;
  const color = isFirst ? '#FFD700' : rank === 2 ? '#E2E8F0' : '#F6AD55';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: rank * 0.1, duration: 0.6 }}
      style={{
        width: '100%',
        maxWidth: isFirst ? 320 : 260,
        position: 'relative',
        zIndex: isFirst ? 2 : 1,
        marginBottom: isFirst ? 0 : 20
      }}
    >
      <div className="glass-card shape-oval" style={{
        padding: isFirst ? '48px 32px' : '36px 24px',
        textAlign: 'center',
        background: `linear-gradient(180deg, rgba(15,15,35,0.9), ${color}08)`,
        border: `1px solid ${color}33`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 30px ${color}10`,
      }}>
        {/* Avatar Circle */}
        <div className="shape-circle" style={{
          width: isFirst ? 110 : 80, height: isFirst ? 110 : 80,
          margin: '0 auto 24px',
          background: `linear-gradient(135deg, ${player.avatar_color}, ${player.avatar_color}aa)`,
          border: `3px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: isFirst ? '2.5rem' : '1.8rem',
          color: '#fff',
          boxShadow: `0 15px 35px ${player.avatar_color}40`,
          position: 'relative'
        }}>
          { (player.player_name || '?')[0] }
          <div style={{ position: 'absolute', top: -12, right: -8, fontSize: isFirst ? '2.2rem' : '1.6rem' }}>
            {rank === 1 ? <FaTrophy style={{ color: '#FFD700', fontSize: '1.5rem' }} /> : rank === 2 ? '2' : '3'}
          </div>
        </div>

        <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: isFirst ? '1.4rem' : '1.1rem', color: '#fff', marginBottom: 6 }}>
          {player.player_name}
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span>{player.state}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: color, fontSize: '0.8rem' }}>{player.game || 'Gamer'}</span>
        </div>

        <div className="shape-pill" style={{ 
          background: 'rgba(255,255,255,0.03)', 
          padding: '12px 20px',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 24
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Skill Rating</div>
          <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: isFirst ? '1.8rem' : '1.4rem', color: color }}>
            { (player.points || 0).toLocaleString() }
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{player.wins}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wins</div>
          </div>
          <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{player.tournaments_played}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Played</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [game, setGame] = useState('all');

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get({ game: game === 'all' ? undefined : game })
      .then(r => {
        setLeaderboard(r.data?.players || []);
        setLastUpdated(new Date());
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, [game]);

  const getUpdateString = () => {
    const mins = Math.floor((new Date() - lastUpdated) / 60000);
    if (mins < 1) return 'Just now';
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ p: top3[1], r: 2 });
  if (top3[0]) podiumOrder.push({ p: top3[0], r: 1 });
  if (top3[2]) podiumOrder.push({ p: top3[2], r: 3 });

  return (
    <div className="page" style={{ background: 'var(--bg-primary)', overflowX: 'hidden', paddingTop: 100 }}>
      {/* Back Button */}
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--cyan)',
            fontFamily: 'Rajdhani',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: '1px solid rgba(0,243,255,0.2)',
            cursor: 'pointer',
            marginBottom: 30,
            background: 'rgba(0,243,255,0.05)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.1)'; e.currentTarget.style.borderColor = 'var(--cyan)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,243,255,0.2)'; }}
        >
          <FaArrowLeft /> BACK
        </motion.button>
      </div>

        {/* Hero Header */}
        <div style={{
          padding: '40px 0 60px',
        position: 'relative',
        background: 'radial-gradient(ellipse at center 0%, rgba(123,47,255,0.15) 0%, transparent 75%)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 20px', borderRadius: 100, mb: 20,
              background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.3)',
              color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700,
              fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20
            }}
          >
            Pro League Season 2026
          </motion.div>
          
          <h1 style={{ 
            fontFamily: 'Orbitron', fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 900, marginBottom: 12, lineHeight: 1.1 
          }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500 50%, #FFD700)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.3))'
            }}>HALL OF CHAMPIONS</span>
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600, margin: '0 auto 40px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            Last updated: {getUpdateString()}
          </div>

          {/* Dynamic Filter */}
          <div className="shape-oval" style={{ 
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            padding: '10px 20px', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)', maxWidth: 'fit-content', margin: '0 auto',
            backdropFilter: 'blur(10px)'
          }}>
            {GAMES.map(g => (
              <button 
                key={g} 
                className={`shape-pill ${game === g ? 'active' : ''}`} 
                onClick={() => setGame(g)}
                style={{
                  height: 44,
                  padding: '0 24px',
                  fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  ...(game === g ? {
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 20px rgba(255,215,0,0.2)'
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-muted)',
                    transform: 'scale(1)'
                  })
                }}
              >
                {g === 'all' ? 'All Games' : <><GameIcon game={g} size={16} /> {g}</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 24px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="leaderboard-row" style={{ height: 80, padding: '16px 24px', opacity: 1 - i * 0.15 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                  <Skeleton width="40px" height="40px" borderRadius="10px" />
                  <Skeleton width="44px" height="44px" borderRadius="12px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="120px" height="18px" className="mb-2" />
                    <Skeleton width="80px" height="12px" />
                  </div>
                  <Skeleton width="80px" height="24px" />
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ 
            textAlign: 'center', padding: '100px 0', 
            background: 'rgba(15,15,35,0.5)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: 20 }}>🦅</div>
            <h3 style={{ fontFamily: 'Orbitron', color: '#fff' }}>No Champions Yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Be the first to dominate the {game} arena!</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', alignItems: 'flex-end', 
              gap: 20, marginBottom: 80, flexWrap: 'wrap'
            }}>
              {podiumOrder.map(({ p, r }) => (
                <PodiumCard 
                  key={p.id || p._id} 
                  player={p} 
                  rank={r} 
                />
              ))}
            </div>

            {/* List Header */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 15
            }}>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                TOP RANKINGS
              </h2>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {leaderboard.length} Elite Players
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {rest.map((player, i) => (
                <motion.div
                  key={player.id || player._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="shape-pill"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 24,
                    padding: '16px 32px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative', overflow: 'hidden'
                  }}
                  whileHover={{ 
                    x: 12, background: 'rgba(255, 255, 255, 0.05)', 
                    borderColor: 'rgba(255,215,0,0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
                  }}
                >
                  <RankBadge rank={i + 4} />
                  
                  <div className="shape-circle" style={{ 
                    width: 52, height: 52,
                    background: `linear-gradient(135deg, ${player.avatar_color}, ${player.avatar_color}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.3rem',
                    color: '#fff', boxShadow: `0 8px 15px ${player.avatar_color}30`
                  }}>
                    { (player.player_name || '?')[0] }
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '0.05em' }}>
                      {player.player_name}
                    </div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', gap: 12, marginTop: 2 }}>
                      <span>REGION: {player.state}</span>
                      {game === 'all' && <span style={{ color: 'var(--cyan)' }}>• {player.game}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }} className="hide-mobile">
                      <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{player.wins}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WINS</div>
                    </div>
                    
                    <div className="shape-pill" style={{ 
                      padding: '10px 24px',
                      background: 'rgba(255,255,255,0.03)', minWidth: 120, textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{ fontFamily: 'Orbitron', fontWeight: 900, color: '#ffd60a', fontSize: '1.2rem' }}>
                        { (player.points || 0).toLocaleString() }
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.1em' }}>RATING</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
