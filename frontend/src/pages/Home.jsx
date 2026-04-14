import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentAPI } from '../services/api';
import logo from '../assets/logo.png';

const GAMES = [
  { name: 'BGMI', icon: '🎯', color: '#FF6B35' },
  { name: 'Valorant', icon: '⚡', color: '#FF4655' },
  { name: 'Free Fire Max', icon: '🔥', color: '#FF9500' },
  { name: 'CS2', icon: '🎮', color: '#F59E0B' },
  { name: 'MLBB', icon: '⚔️', color: '#06B6D4' },
  { name: 'Tekken 8', icon: '👊', color: '#EC4899' },
  { name: 'Pokemon Unite', icon: '🔮', color: '#8B5CF6' },
  { name: 'Call of Duty Mobile', icon: '🪖', color: '#10B981' },
  { name: 'Clash Royale', icon: '👑', color: '#3B82F6' },
];

const STATS = [
  { value: '50K+', label: 'Players', color: 'var(--cyan)' },
  { value: '₹2Cr+', label: 'Prize Pool', color: 'var(--yellow)' },
  { value: '200+', label: 'Tournaments', color: 'var(--purple)' },
  { value: '28', label: 'States', color: 'var(--green)' },
];

const TICKER_ITEMS = [
  '🏆 BGMI India Masters LIVE NOW — ₹5 Lakh Prize Pool',
  '🔥 Free Fire Max Grand Prix — Registration Open',
  '⚡ Valorant Champions India — 8 Slots Left!',
  '🎮 CS2 India Open — May 10-12',
  '🔮 Pokemon Unite Championship — Results Out!',
  '👊 Tekken 8 India Clash — Register Now',
];

function TournamentCard({ t }) {
  const pct = Math.round((t.slots_filled / t.slots) * 100);
  return (
    <div className="glass-card tournament-card anim-fade-up">
      <div className="tournament-card-banner" style={{ background: t.banner_color || 'var(--purple)' }} />
      <div className="tournament-card-body">
        <div className="tournament-card-header">
          <div>
            <div className="tournament-card-title">{t.title}</div>
            <div className="tournament-card-game">{t.game}</div>
          </div>
          <span className={`badge badge-${t.status}`}>{t.status}</span>
        </div>
        <div className="tournament-card-info">
          <div className="info-item">
            <span className="info-label">💰 Prize</span>
            <span className="prize-amount">{t.prize_pool}</span>
          </div>
          <div className="info-item">
            <span className="info-label">📅 Date</span>
            <span className="info-value">{t.start_date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🎯 Slots</span>
            <span className="info-value">{t.slots_filled}/{t.slots}</span>
            <div className="slots-bar">
              <div className="slots-fill" style={{ width: `${pct}%`, background: t.banner_color || 'var(--cyan)' }} />
            </div>
          </div>
          <div className="info-item">
            <span className="info-label">📍 Mode</span>
            <span className="info-value">{t.location}</span>
          </div>
        </div>
        <Link to={`/tournaments/${t.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [liveT, setLiveT] = useState([]);
  const [upcomingT, setUpcomingT] = useState([]);
  const [counter, setCounter] = useState({ players: 0, prize: 0, tournaments: 0 });

  useEffect(() => {
    tournamentAPI.getAll({ status: 'live' }).then(r => setLiveT(r.data.tournaments)).catch(() => { });
    tournamentAPI.getAll({ status: 'upcoming' }).then(r => setUpcomingT(r.data.tournaments.slice(0, 3))).catch(() => { });

    // Count-up animation
    const targets = { players: 50000, prize: 200, tournaments: 200 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        players: Math.round(targets.players * ease),
        prize: Math.round(targets.prize * ease),
        tournaments: Math.round(targets.tournaments * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* TICKER */}
      <div style={{ paddingTop: 72 }}>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ticker-item">
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-tag anim-fade-up delay-100">
                India's #1 Esports Platform
              </div>
              <h1 className="hero-title anim-fade-up delay-200">
                <span className="gradient-text">DOMINATE</span>
                <br />
                THE ARENA
              </h1>
              <p className="hero-description anim-fade-up delay-300">
                India's premier esports hub for BGMI, Valorant, Free Fire & more.
                Join live tournaments, track leaderboards, and rise to the top! 🏆
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }} className="anim-fade-up delay-400">
                <Link to="/tournaments" className="btn btn-primary btn-lg">
                  🏆 Join Tournament
                </Link>
                <Link to="/leaderboard" className="btn btn-secondary btn-lg">
                  📊 Leaderboard
                </Link>
              </div>
              <div className="hero-stats anim-fade-up delay-500">
                {STATS.map(s => (
                  <div key={s.label} className="hero-stat">
                    <span className="hero-stat-value" style={{ color: s.color }}>
                      {s.label === 'Players' ? `${(counter.players / 1000).toFixed(0)}K+`
                        : s.label === 'Prize Pool' ? `₹${counter.prize}L+`
                          : s.label === 'Tournaments' ? `${counter.tournaments}+`
                            : s.value}
                    </span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero Visual */}
            <div style={{ textAlign: 'center', position: 'relative' }} className="anim-slide-right delay-300">
              <div style={{
                width: 360, height: 360,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(123,47,255,0.2) 0%, rgba(0,243,255,0.1) 50%, transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                position: 'relative',
              }} className="anim-float">
                <img src={logo} alt="Esports Hub" style={{ width: 280, filter: 'drop-shadow(0 0 40px rgba(0,243,255,0.5))' }} />
                {/* Orbiting badges */}
                {['🎯', '⚡', '🔥', '🏆'].map((emoji, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 50, height: 50,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                    backdropFilter: 'blur(10px)',
                    top: `${[10, 10, 75, 75][i]}%`,
                    left: `${[5, 75, 5, 75][i]}%`,
                    animation: `float ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}>{emoji}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES SECTION */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">Featured Games</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">Tournaments across India's most played esports titles</p>
          <div className="games-grid">
            {GAMES.map((g, i) => (
              <Link to={`/tournaments?game=${g.name}`} key={g.name}
                className="glass-card game-card anim-fade-up"
                style={{ '--game-color': g.color, animationDelay: `${i * 0.08}s` }}>
                <span className="game-icon">{g.icon}</span>
                <div className="game-name">{g.name}</div>
                <div className="game-count" style={{ color: g.color }}>Active Tournaments</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TOURNAMENTS */}
      {liveT.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <h2 className="section-title"><span className="gradient-text">🔴 Live Tournaments</span></h2>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p className="section-subtitle">Happening right now — jump in!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {liveT.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.03)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 className="section-title"><span className="gradient-text">Upcoming Tournaments</span></h2>
            <Link to="/tournaments" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <p className="section-subtitle">Register now before slots fill up!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {upcomingT.map(t => <TournamentCard key={t.id} t={t} />)}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section">
        <div className="container">
          <div className="glass-card" style={{
            padding: '60px 48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(0,243,255,0.08))',
            borderColor: 'rgba(0,243,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '3rem', marginBottom: 16 }} className="anim-float">🏆</div>
            <h2 className="section-title anim-fade-up" style={{ marginBottom: 16 }}>
              Ready to <span className="gradient-text">Compete?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.8 }}>
              Join 50,000+ Indian gamers. Register for tournaments, win prizes up to ₹5 Lakhs, and make your mark in Indian esports!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Create Account 🚀</Link>
              <Link to="/tournaments" className="btn btn-secondary btn-lg">Browse Tournaments</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src={logo} alt="India Esports Hub" />
              <p className="footer-desc">
                India's premier esports platform connecting players, tournaments, and communities across all 28 states.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <Link to="/tournaments" className="footer-link">Tournaments</Link>
              <Link to="/leaderboard" className="footer-link">Leaderboard</Link>
              <Link to="/signup" className="footer-link">Join Now</Link>
            </div>
            <div>
              <div className="footer-col-title">Games</div>
              {GAMES.slice(0, 5).map(g => (
                <Link key={g.name} to={`/tournaments?game=${g.name}`} className="footer-link">{g.icon} {g.name}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', gap: '8px' }}>
            <div className="footer-copy" style={{ margin: 0, fontWeight: 500, letterSpacing: '0.5px' }}>
              © {new Date().getFullYear()} India Esports Hub. All Rights Reserved.
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Proudly Designed & Developed in India <span className="india-flag" style={{ fontSize: '1.2rem' }}></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
