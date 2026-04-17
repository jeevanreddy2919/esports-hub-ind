import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaderboardAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';

const GAMES = ['all', 'BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];
const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

const RankBadge = ({ rank }) => {
  const colors = {
    1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', shadow: 'rgba(255, 215, 0, 0.4)', icon: '👑' },
    2: { bg: 'linear-gradient(135deg, #C0C0C0, #808080)', shadow: 'rgba(192, 192, 192, 0.4)', icon: '🥈' },
    3: { bg: 'linear-gradient(135deg, #CD7F32, #8B4513)', shadow: 'rgba(205, 127, 50, 0.4)', icon: '🥉' }
  };
  
  const config = colors[rank] || { bg: 'rgba(255,255,255,0.1)', shadow: 'transparent', icon: `#${rank}` };

  return (
    <div style={{
      width: 42, height: 42, borderRadius: 12,
      background: config.bg,
      boxShadow: `0 0 15px ${config.shadow}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: rank <= 3 ? '1.2rem' : '0.9rem',
      fontFamily: 'Orbitron', fontWeight: 800,
      color: rank <= 3 ? '#000' : '#fff',
      flexShrink: 0,
      border: rank <= 3 ? 'none' : '1px solid rgba(255,255,255,0.1)'
    }}>
      {config.icon}
    </div>
  );
};

const PodiumCard = ({ player, rank, gameIcon }) => {
  const isFirst = rank === 1;
  const color = isFirst ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.5 }}
      style={{
        width: '100%',
        maxWidth: isFirst ? 320 : 280,
        position: 'relative',
        zIndex: isFirst ? 2 : 1,
        marginTop: isFirst ? 0 : 40
      }}
    >
      {/* Glow Backdrop */}
      <div style={{
        position: 'absolute', inset: -10,
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        borderRadius: 40, pointerEvents: 'none'
      }} />

      <div style={{
        background: 'rgba(15, 15, 35, 0.85)',
        backdropFilter: 'blur(15px)',
        border: `1px solid ${color}33`,
        borderRadius: 24,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${color}11`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Hexagonal Clip Area for Avatar */}
        <div style={{
          position: 'relative', width: 90, height: 90, 
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Hexagon Border SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: `drop-shadow(0 0 8px ${color}66)` }} viewBox="0 0 100 100">
            <path 
              d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z" 
              fill="none" 
              stroke={color} 
              strokeWidth="2"
            />
          </svg>
          
          <div style={{
            width: 72, height: 72,
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            background: player.avatar_color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.8rem',
            color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {player.player_name[0]}
          </div>

          {/* Crown/Badge on top of hex */}
          <div style={{
            position: 'absolute', top: -15, right: -10,
            fontSize: '1.8rem', zIndex: 3,
            animation: 'live-pulse 2s ease-in-out infinite'
          }}>
            {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}
          </div>
        </div>

        <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: isFirst ? '1.2rem' : '1rem', color: '#fff', marginBottom: 4 }}>
          {player.player_name}
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          📍 {player.state}
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: 12, 
          padding: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 16
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Skill Rating
          </div>
          <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.4rem', color: color }}>
            {player.points.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{player.wins}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wins</div>
          </div>
          <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{player.tournaments_played}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Played</div>
          </div>
        </div>

        {gameIcon && (
          <div style={{ 
            marginTop: 16, 
            fontSize: '0.8rem', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '4px 10px', 
            borderRadius: 100,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {gameIcon} {player.game}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState('all');

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get({ game: game === 'all' ? undefined : game })
      .then(r => setPlayers(r.data?.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [game]);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ p: top3[1], r: 2 });
  if (top3[0]) podiumOrder.push({ p: top3[0], r: 1 });
  if (top3[2]) podiumOrder.push({ p: top3[2], r: 3 });

  return (
    <div className="page" style={{ background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      {/* Hero Header */}
      <div style={{
        padding: '80px 0 60px',
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
            🔥 Pro League Season 2026
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
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 40px' }}>
            Experience the rivalry. Only the absolute best make it to the top.
          </p>

          {/* Dynamic Filter */}
          <div style={{ 
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            padding: '6px', borderRadius: 16, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)', maxWidth: 'fit-content', margin: '0 auto'
          }}>
            {GAMES.map(g => (
              <button 
                key={g} 
                className={`filter-btn ${game === g ? 'active' : ''}`} 
                onClick={() => setGame(g)}
                style={{
                  height: 48,
                  padding: '0 24px',
                  borderRadius: 12,
                  fontFamily: 'Rajdhani', fontWeight: 700,
                  transition: 'all 0.3s ease',
                  ...(game === g ? {
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-muted)'
                  })
                }}
              >
                {g === 'all' ? '🌐 All Games' : `${GAME_ICONS[g] || '🎮'} ${g}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 24px 100px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ 
              width: 50, height: 50, border: '3px solid rgba(255,215,0,0.1)', 
              borderTopColor: '#FFD700', borderRadius: '50%',
              margin: '0 auto 20px', animation: 'rotate 1s linear infinite'
            }} />
            <p style={{ fontFamily: 'Rajdhani', fontWeight: 600, color: 'var(--text-muted)' }}>Synching Champion Data...</p>
          </div>
        ) : players.length === 0 ? (
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
                  gameIcon={game === 'all' ? GAME_ICONS[p.game] : null}
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
                Showing {players.length} Elite Players
              </div>
            </div>

            {/* The List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rest.map((player, i) => (
                <motion.div
                  key={player.id || player._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: '16px 24px', borderRadius: 20,
                    background: 'rgba(15, 15, 35, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    position: 'relative', overflow: 'hidden'
                  }}
                  whileHover={{ 
                    x: 8, background: 'rgba(15, 15, 35, 0.9)', 
                    borderColor: 'rgba(255,215,0,0.2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
                  }}
                >
                  <RankBadge rank={i + 4} />
                  
                  <div style={{ 
                    width: 50, height: 50, borderRadius: 14, 
                    background: player.avatar_color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.2rem',
                    color: '#fff', boxShadow: `0 0 15px ${player.avatar_color}44`
                  }}>
                    {player.player_name[0]}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      {player.player_name}
                    </div>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                      <span>📍 {player.state}</span>
                      {game === 'all' && <span>· {GAME_ICONS[player.game]} {player.game}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }} className="hide-mobile">
                      <span style={{ fontSize: '0.9rem', fontFamily: 'Rajdhani', fontWeight: 700, color: '#fff' }}>{player.wins}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wins</span>
                    </div>
                    
                    <div style={{ 
                      padding: '10px 20px', borderRadius: 12, 
                      background: 'rgba(0,0,0,0.3)', minWidth: 100, textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ fontFamily: 'Orbitron', fontWeight: 800, color: 'var(--cyan)', fontSize: '1rem' }}>
                        {player.points.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>POINTS</div>
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
