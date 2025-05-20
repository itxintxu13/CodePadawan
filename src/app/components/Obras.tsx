import React from 'react';

const Obras: React.FC = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 234, 0, 0.8), 0 0 20px rgba(255, 234, 0, 0.5);
        }
      `}</style>
      <main
        className="min-h-screen flex flex-col justify-center items-center bg-[#101828] text-yellow-400 font-sans"
        aria-labelledby="maintenance-title"
      >
        <section className="flex flex-col items-center justify-center space-y-8 text-center px-4 max-w-2xl mx-auto">
          <h1 id="maintenance-title" className="text-7xl sm:text-8xl font-bold glow-text">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            ¡Ups! Esta galaxia está en construcción...
          </h2>
          <p className="text-lg sm:text-xl">
            Los droides están trabajando arduamente en esta sección. La Fuerza está
            tomando un breve descanso.
          </p>
          <img
            src="./droides.jpg"
            alt="Droide R2-D2 trabajando en la construcción de la página"
            className="w-48 sm:w-64 mx-auto animate-float"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=R2-D2')}
          />
         
        </section>
      </main>
    </>
  );
};

export default Obras;