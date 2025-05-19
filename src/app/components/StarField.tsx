"use client";

import React from 'react';

const StarField: React.FC = () => {
  const stars = Array.from({ length: 200 }).map((_, index) => ({
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  return (
    <div className="absolute inset-0 bg-[#020414] -z-10">
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
            animation: `pulse ${2 + star.delay}s ease-in-out infinite`
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