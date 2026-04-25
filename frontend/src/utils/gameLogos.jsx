import React, { useState } from 'react';

export const GAME_LOGOS = {
  'Valorant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/512px-Valorant_logo_-_pink_color_version.svg.png',
  'BGMI': 'https://upload.wikimedia.org/wikipedia/en/2/2f/Battlegrounds_Mobile_India_logo.png',
  'MLBB': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Mobile_Legends_Bang_Bang_logo.png/512px-Mobile_Legends_Bang_Bang_logo.png',
  'Free Fire Max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Free_Fire_logo.svg/512px-Free_Fire_logo.svg.png',
  'Pokemon Unite': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Pok%C3%A9mon_Unite_logo.png/512px-Pok%C3%A9mon_Unite_logo.png',
  'Minecraft': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Minecraft_cover.png/512px-Minecraft_cover.png',
  'CS2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Counter-Strike_2_text_logo.svg/512px-Counter-Strike_2_text_logo.svg.png',
  'Call of Duty Mobile': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Call_of_Duty_Mobile_logo.png/512px-Call_of_Duty_Mobile_logo.png',
  'Tekken 8': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Tekken_8_Logo.webp/512px-Tekken_8_Logo.webp.png',
  'Clash Royale': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Clash_Royale_logo.png/512px-Clash_Royale_logo.png',
  'FC Mobile': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/EA_Sports_FC_Mobile_logo.png/512px-EA_Sports_FC_Mobile_logo.png'
};

export const GameIcon = ({ game, size = 24, className = '', style = {} }) => {
  const [error, setError] = useState(false);
  const url = GAME_LOGOS[game];

  if (url && !error) {
    return (
      <img 
        src={url} 
        alt={game} 
        className={className}
        style={{ width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))', ...style }} 
        onError={() => setError(true)}
      />
    );
  }

  // Fallback
  const getShorthand = (name) => {
    if (!name) return 'G';
    if (name === 'Free Fire Max') return 'FFM';
    if (name === 'Call of Duty Mobile') return 'CODM';
    if (name === 'Pokemon Unite') return 'PKU';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={className} style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', fontSize: size * 0.4, fontWeight: 900, fontFamily: 'Orbitron', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', ...style }}>
      {getShorthand(game)}
    </div>
  );
};
