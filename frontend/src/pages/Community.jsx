import React from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaInstagram, FaTelegramPlane, FaYoutube, FaUsers, FaTrophy, FaHandshake } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const STATS = [
  { icon: <FaUsers />, label: 'Active Members', value: '48K+', color: '#5865F2' },
  { icon: <FaHandshake />, label: 'Registered Clans', value: '1,200', color: '#ff2d78' },
  { icon: <FaTrophy />, label: 'Matches Played', value: '85K+', color: '#ffd60a' },
];

export default function Community() {
  return (
    <div className="page" style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 className="hero-title anim-fade-up">
            <span className="gradient-text">THE ARENA </span> COMMUNITY
          </h1>
          <p className="hero-description anim-fade-up delay-100" style={{ maxWidth: 600, margin: '20px auto 0' }}>
            Connect with India's most elite gaming squads, find teammates, and engage in daily scrims and giveaways!
          </p>
        </div>

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

        <h2 className="section-title anim-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>Our <span className="gradient-text" style={{ color: 'var(--cyan)' }}>Networks</span></h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30, marginBottom: 80 }}>
          {[
            { id: 'ig', name: 'Instagram', icon: <FaInstagram />, color: '#E1306C', desc: 'Tournament highlights & clips', action: 'FOLLOW @INDIA_ESPORTS', delay: 0 },
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
