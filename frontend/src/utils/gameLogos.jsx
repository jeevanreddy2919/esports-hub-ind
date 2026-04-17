import React from 'react';

export const GAME_LOGOS = {
  'BGMI': 'https://upload.wikimedia.org/wikipedia/en/2/2f/Battlegrounds_Mobile_India_logo.png',
  'Valorant': 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg',
  'Free Fire Max': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Free_Fire_logo.svg/320px-Free_Fire_logo.svg.png',
  'CS2': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Counter-Strike_2_text_logo.svg',
  'MLBB': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Mobile_Legends_Bang_Bang_logo.png/320px-Mobile_Legends_Bang_Bang_logo.png',
  'Tekken 8': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Tekken_8_Logo.webp/320px-Tekken_8_Logo.webp.png',
  'Pokemon Unite': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Pok%C3%A9mon_Unite_logo.png/320px-Pok%C3%A9mon_Unite_logo.png',
  'Call of Duty Mobile': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Call_of_Duty_Mobile_logo.png/320px-Call_of_Duty_Mobile_logo.png',
  'Clash Royale': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Clash_Royale_logo.png/320px-Clash_Royale_logo.png'
};

export const GameIcon = ({ game, size = 24, className = '', style = {} }) => {
  const url = GAME_LOGOS[game];
  if (url) {
    return (
      <img 
        src={url} 
        alt={game} 
        className={className}
        style={{ width: size, height: size, objectFit: 'contain', ...style }} 
      />
    );
  }
  return <span className={className} style={{ fontSize: size * 0.8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}>🎮</span>;
};
