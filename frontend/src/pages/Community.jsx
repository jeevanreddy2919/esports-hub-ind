import React from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaInstagram, FaTelegramPlane, FaYoutube, FaUsers, FaTrophy, FaHandshake, FaArrowRight } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const STATS = [
  { icon: <FaUsers />, label: 'Active Members', value: '48K+', color: '#5865F2' },
  { icon: <FaHandshake />, label: 'Registered Clans', value: '1,200', color: '#ff2d78' },
  { icon: <FaTrophy />, label: 'Matches Played', value: '85K+', color: '#ffd60a' },
];

const NEWS = [
  {
    id: 1,
    title: 'NODWIN Gaming Announces Masters Series Season 3',
    date: 'April 20, 2026',
    source: 'Esports Insider',
    category: 'Tournament',
    color: '#FF6B35',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500',
  },
  {
    id: 2,
    title: 'India Wins Big at International Valorant Invitationals',
    date: 'April 18, 2026',
    source: 'AFK Gaming',
    category: 'News',
    color: '#FF4655',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500',
  },
  {
    id: 3,
    title: 'Top 5 BGMI Strategies for the Upcoming Pro League',
    date: 'April 15, 2026',
    source: 'TalkEsport',
    category: 'Guide',
    color: '#00F3FF',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500',
  },
  {
    id: 4,
    title: 'New Anti-Cheat Update: Securing the Future of Arena',
    date: 'April 12, 2026',
    source: 'Arena Dev Team',
    category: 'Update',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=500',
  },
];

export default function Community() {
  return (
    <div className="page" style={{ paddingTop: 100, paddingBottom: 100, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 className="hero-title anim-fade-up">
            <span className="gradient-text">THE ARENA </span> COMMUNITY
          </h1>
          <p className="hero-description anim-fade-up delay-100" style={{ maxWidth: 600, margin: '20px auto 0' }}>
            Connect with India's most elite gaming squads, find teammates, and engage in daily scrims and giveaways!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid-3" style={{ gap: 24, marginBottom: 80 }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="glass-card shape-oval"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '30px 20px', textAlign: 'center', borderTop: `4px solid ${s.color}` }}
            >
              <div style={{ fontSize: '2.5rem', color: s.color, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '2rem', color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* News Section */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Latest <span className="gradient-text">Updates</span></h2>
            <div style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem' }}>Updated 2 hours ago</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {NEWS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="glass-card" style={{ height: '100%', overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,16,0.9), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, padding: '4px 12px', borderRadius: 4, background: item.color, color: '#000', fontSize: '0.65rem', fontFamily: 'Orbitron', fontWeight: 900, textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.source}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.1rem', color: '#fff', lineHeight: 1.5, marginBottom: 20 }}>{item.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cyan)', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', cursor: 'pointer' }}>
                      READ MORE <FaArrowRight style={{ fontSize: '0.7rem' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Networks */}
        <h2 className="section-title anim-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>Our <span className="gradient-text" style={{ color: 'var(--cyan)' }}>Networks</span></h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30 }}>
          {[
            { id: 'ig', name: 'Instagram', icon: <FaInstagram />, color: '#E1306C', desc: 'Tournament highlights & clips', action: 'FOLLOW @ARENA_HUB', delay: 0 },
            { id: 'yt', name: 'YouTube', icon: <FaYoutube />, color: '#FF0000', desc: 'Live streams and pro casting', action: 'SUBSCRIBE NOW', delay: 0.1 },
            { id: 'x', name: 'X (Twitter)', icon: <FaXTwitter />, color: '#ffffff', desc: 'Breaking news & quick updates', action: 'FOLLOW ON X', delay: 0.2 },
            { id: 'tg', name: 'Telegram', icon: <FaTelegramPlane />, color: '#0088CC', desc: 'Instant registration alerts', action: 'GET ALERTS', delay: 0.3 },
            { id: 'dc', name: 'Discord', icon: <FaDiscord />, color: '#5865F2', desc: 'Main hub for scrims & chat', action: 'JOIN 48K+ MEMBERS', delay: 0.4 },
          ].map((ch) => (
            <motion.a
              key={ch.id}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: ch.delay }}
              className="glass-card"
              style={{
                padding: '40px 24px', textAlign: 'center', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: `linear-gradient(90deg, transparent, ${ch.color}, transparent)`
                }}
              />
              <div 
                className="shape-hex" 
                style={{
                  width: 80, height: 80, background: `${ch.color}15`,
                  border: `1px solid ${ch.color}44`, margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', color: ch.color,
                  boxShadow: `0 0 30px ${ch.color}20`,
                }}
              >
                {ch.icon}
              </div>
              <h3 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.2rem', marginBottom: 8 }}>{ch.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>{ch.desc}</p>
              <div style={{ color: ch.color, fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                {ch.action} →
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
}

