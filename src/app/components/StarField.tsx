"use client";

import React from 'react';

const StarField: React.FC = () => {
  const stars = Array.from({ length: 200 }).map((_, index) => ({
    size: 1.5, // Tamaño fijo
    top: `${(index % 20) * 5}%`, // Posición calculada
    left: `${Math.floor(index / 20) * 5}%`,
    delay: 0, // Sin retraso
    opacity: 0.75, // Opacidad fija
  }));

  return (
    <div className="absolute inset-0 bg-[#020414] -z-10 pointer-events-none overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            backgroundColor: '#ffffff',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px #ffffff, 0 0 ${star.size * 4}px #ffffff`,
            animation: `pulse 2s ease-in-out infinite`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default StarField;