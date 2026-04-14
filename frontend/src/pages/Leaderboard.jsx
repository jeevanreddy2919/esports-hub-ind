import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

const GAMES = ['all', 'BGMI', 'Valorant', 'Free Fire Max', 'CS2', 'MLBB', 'Tekken 8', 'Pokemon Unite', 'Call of Duty Mobile', 'Clash Royale'];
const GAME_ICONS = { BGMI: '🎯', Valorant: '⚡', 'Free Fire Max': '🔥', CS2: '🎮', MLBB: '⚔️', 'Tekken 8': '👊', 'Pokemon Unite': '🔮', 'Call of Duty Mobile': '🪖', 'Clash Royale': '👑' };

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState('all');

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get({ game: game === 'all' ? undefined : game })
      .then(r => setPlayers(r.data.players))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [game]);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        padding: '48px 0 32px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,243,255,0.07) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(255,214,10,0.12)', border: '1px solid rgba(255,214,10,0.3)',
            fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--yellow)',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>🏆 Hall of Champions</div>
          <h1 className="section-title anim-fade-up">
            <span className="gradient-text-gold">Leaderboard</span>
          </h1>
          <p className="section-subtitle">India's top esports players ranked by performance</p>

          {/* Game filter */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {GAMES.map(g => (
              <button key={g} className={`filter-btn ${game === g ? 'active' : ''}`} onClick={() => setGame(g)}
                style={game === g ? { borderColor: '#ffd60a', color: '#ffd60a', background: 'rgba(255,214,10,0.1)' } : {}}>
                {g !== 'all' && (GAME_ICONS[g] + ' ')}{g === 'all' ? '🌐 All Games' : g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {loading ? (
          <div className="loading-screen">
            <div className="loader" />
            <span className="loading-text">Loading champions...</span>
          </div>
        ) : players.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
            <p>No players found for this game yet!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {top3.length === 3 && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16, marginBottom: 48, alignItems: 'flex-end',
              }} className="anim-fade-up leaderboard-podium">
                {/* 2nd Place */}
                <div className="glass-card" style={{
                  padding: '28px 20px', textAlign: 'center',
                  borderColor: 'rgba(192,192,192,0.25)',
                  background: 'linear-gradient(to bottom, rgba(192,192,192,0.06), transparent)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🥈</div>
                  <div style={{
                    width: 60, height: 60, borderRadius: 16, margin: '0 auto 12px',
                    background: top3[1].avatar_color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.3rem',
                    boxShadow: `0 0 20px ${top3[1].avatar_color}60`,
                  }}>{top3[1].player_name[0]}</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{top3[1].player_name}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{top3[1].state}</div>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800, color: '#c0c0c0' }}>{top3[1].points.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', marginTop: 2 }}>{top3[1].wins} wins</div>
                </div>

                {/* 1st Place */}
                <div className="glass-card" style={{
                  padding: '36px 24px', textAlign: 'center',
                  borderColor: 'rgba(255,214,10,0.4)',
                  background: 'linear-gradient(to bottom, rgba(255,214,10,0.08), transparent)',
                  boxShadow: '0 0 40px rgba(255,214,10,0.15)',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8, animation: 'float 2s ease-in-out infinite' }}>👑</div>
                  <div style={{
                    width: 76, height: 76, borderRadius: 20, margin: '0 auto 14px',
                    background: top3[0].avatar_color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.6rem',
                    boxShadow: `0 0 30px ${top3[0].avatar_color}80, 0 0 60px rgba(255,214,10,0.2)`,
                    border: '2px solid rgba(255,214,10,0.4)',
                  }}>{top3[0].player_name[0]}</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{top3[0].player_name}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{top3[0].state}</div>
                  <div style={{
                    fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, #ffd60a, #ff9500)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{top3[0].points.toLocaleString()}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', marginTop: 4 }}>{top3[0].wins} wins · {top3[0].tournaments_played} tournaments</div>
                  {game === 'all' && (
                    <div style={{
                      marginTop: 12, padding: '5px 12px', borderRadius: 100, display: 'inline-block',
                      background: 'rgba(255,214,10,0.15)', border: '1px solid rgba(255,214,10,0.3)',
                      fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.78rem', color: '#ffd60a',
                    }}>{GAME_ICONS[top3[0].game]} {top3[0].game}</div>
                  )}
                </div>

                {/* 3rd Place */}
                <div className="glass-card" style={{
                  padding: '24px 20px', textAlign: 'center',
                  borderColor: 'rgba(205,127,50,0.2)',
                  background: 'linear-gradient(to bottom, rgba(205,127,50,0.05), transparent)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🥉</div>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px',
                    background: top3[2].avatar_color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.2rem',
                    boxShadow: `0 0 20px ${top3[2].avatar_color}60`,
                  }}>{top3[2].player_name[0]}</div>
                  <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{top3[2].player_name}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>{top3[2].state}</div>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', fontWeight: 800, color: '#cd7f32' }}>{top3[2].points.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', marginTop: 2 }}>{top3[2].wins} wins</div>
                </div>
              </div>
            )}

            {/* Rest of leaderboard */}
            {rest.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>
                  OTHER TOP PLAYERS
                </h2>
                {rest.map((player, i) => (
                  <div key={player.id} className="leaderboard-row anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="leaderboard-row-left">
                      <div className={`rank-badge rank-other`}>#{i + 4}</div>
                      <div className="player-avatar" style={{ background: player.avatar_color, boxShadow: `0 0 15px ${player.avatar_color}50` }}>
                        {player.player_name[0]}
                      </div>
                      <div className="player-info">
                        <div className="player-name">{player.player_name}</div>
                        <div className="player-meta">
                          {player.state}
                          {game === 'all' && <span className="hide-mobile"> · {GAME_ICONS[player.game]} {player.game}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="leaderboard-row-stats">
                      <div className="row-stat hide-small">
                        <div className="stat-val">{player.wins}</div>
                        <div className="stat-label">wins</div>
                      </div>
                      <div className="player-points-box">
                        <div className="player-points">{player.points.toLocaleString()}</div>
                        <div className="player-wins">PTS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
