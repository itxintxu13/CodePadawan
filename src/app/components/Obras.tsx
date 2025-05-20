import React from "react";

const Obras: React.FC = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .glow-text {
          text-shadow: 0 0 10px rgba(255, 234, 0, 0.8),
            0 0 20px rgba(255, 234, 0, 0.5);
        }
      `}</style>
      <main
        className="min-h-screen flex flex-col justify-center items-center bg-[#101828] text-yellow-400 font-sans"
        aria-labelledby="maintenance-title"
      >
        <section className="flex flex-col items-center justify-center space-y-8 text-center px-4 max-w-2xl mx-auto mb-5">
          <h1
            id="maintenance-title"
            className="text-7xl sm:text-8xl font-bold glow-text"
          >
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            ¡Ups! Esta galaxia está en construcción...
          </h2>
          <p className="text-lg sm:text-xl">
            Los droides están trabajando arduamente en esta sección. La Fuerza
            está tomando un breve descanso.
          </p>
          <img
            src="./droides.jpg"
            alt="Droide R2-D2 trabajando en la construcción de la página"
            className="w-48 sm:w-64 mx-auto animate-float"
            onError={(e) =>
              (e.currentTarget.src =
                "https://via.placeholder.com/150?text=R2-D2")
            }
          />
          
        </section>
        <h3 className="mt-8 text-3xl sm:text-4xl font-bold text-yellow-400">
            Próximamente...
          </h3>

        <div className="text-center mt-6">
  <p className="text-yellow-400 text-lg">
    Se implementará un sistema de mensajería privada para que los Jedi puedan comunicarse directamente y de forma segura con sus Padawans.
  </p>
  <div className="mt-4 flex justify-center items-center text-yellow-400 text-5xl">
    📧
  </div>
  <p className="text-yellow-300 mt-2 text-sm italic">
    Comunicación directa y segura en la galaxia
  </p>
</div>
<hr className="w-100 border-t border-purple-600 my-10 mx-auto opacity-50" />

        <div className="container mx-auto p-8 bg-gray-900 text-white">
          <p className="mb-8 text-center" style={{ color: "#FFB800" }}>
            Los Jedi tendrán la capacidad de diseñar retos personalizados para
            que sus Padawans los enfrenten y superen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Tarjeta Reto Java */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 h-full flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Palíndromo en Java
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                  >
                    Fácil
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Crea una función en Java que determine si una cadena es un
                  palíndromo (se lee igual de adelante hacia atrás).
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: `transparent`,
                      color: "#C62828",
                      border: `1px solid #C62828`,
                    }}
                  >
                    Java
                  </span>
                </div>
              </div>
              <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-semibold">
                    50 puntos
                  </span>
                  <button
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105 active:scale-95"
                    onClick={() => alert("Empezando reto: Palíndromo en Java")}
                  >
                    Empezar reto
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta Reto Python */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 h-full flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Sumar números en Python
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                  >
                    Fácil
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Escribe una función en Python que reciba una lista de números
                  y devuelva la suma total.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: `transparent`,
                      color: "#007BFF",
                      border: `1px solid #007BFF`,
                    }}
                  >
                    Python
                  </span>
                </div>
              </div>
              <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-semibold">
                    40 puntos
                  </span>
                  <button
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105 active:scale-95"
                    onClick={() =>
                      alert("Empezando reto: Sumar números en Python")
                    }
                  >
                    Empezar reto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
<hr className="w-100 border-t border-purple-600 my-10 mx-auto opacity-50" />

        <p className="mt-10 mb-4 max-w-xl text-center text-yellow-300 text-lg sm:text-xl px-4">
          Los Jedi tendrán su propio ranking basado en la cantidad de Padawans a
          los que consigan guiar y ayudar.
        </p>

        <table className="min-w-full border border-[#f59e0b] rounded-lg overflow-hidden shadow-lg bg-[#1E2939] mt-5">
          <thead className="bg-[#7c3aed] text-white text-center">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold">Posición</th>
              <th className="px-6 py-3 text-sm font-semibold">Usuario</th>
              <th className="px-6 py-3 text-sm font-semibold">Puntos</th>
              <th className="px-6 py-3 text-sm font-semibold">
                Retos resueltos por Padawans
              </th>
              <th className="px-6 py-3 text-sm font-semibold">Rango</th>
            </tr>
          </thead>
          <tbody className="text-white text-sm text-center">
            <tr className="hover:bg-[#374151]">
              <td className="px-6 py-4">🥇</td>
              <td className="px-6 py-4">MaestroYoda</td>
              <td className="px-6 py-4 text-[#FDC700] font-semibold">2450</td>
              <td className="px-6 py-4">32</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm">
                  🌌 Jedi Legendario
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#374151]">
              <td className="px-6 py-4">🥈</td>
              <td className="px-6 py-4">LukeSky</td>
              <td className="px-6 py-4 text-[#FDC700] font-semibold">1920</td>
              <td className="px-6 py-4">24</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm">
                  🌌 Jedi Legendario
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#374151]">
              <td className="px-6 py-4">🥉</td>
              <td className="px-6 py-4">LeiaOrgana</td>
              <td className="px-6 py-4 text-[#FDC700] font-semibold">1850</td>
              <td className="px-6 py-4">22</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm">
                  ⭐ Caballero Jedi
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#374151]">
              <td className="px-6 py-4">4</td>
              <td className="px-6 py-4">ObiWan</td>
              <td className="px-6 py-4 text-[#FDC700] font-semibold">1600</td>
              <td className="px-6 py-4">18</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm">
                  🚀 Rebelde
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
};

export default Obras;
