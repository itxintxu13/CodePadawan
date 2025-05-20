import React from 'react';

const Obras: React.FC = () => {
  return (
    <div
      className="text-yellow-400 font-sans text-center h-screen flex flex-col justify-center items-center"
      style={{ backgroundColor: '#101828' }}
    >
      <div className="space-y-4">
        <h1 className="text-6xl">404</h1>
        <h2 className="text-2xl">¡Ups! Esta galaxia está en construcción...</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Los droides están trabajando en esta sección. La Fuerza está tomando un descanso.
       
        </p>
        <img
          src="./droides.jpg" 
          alt="R2-D2"
          className="w-36 animate-float"
        />
      </div>
    </div>
  );
};

export default Obras;
