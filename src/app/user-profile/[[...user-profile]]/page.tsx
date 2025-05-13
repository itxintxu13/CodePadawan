"use client";
import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import Sidebar from "@/app/components/SideBar";
import { motion, AnimatePresence } from "framer-motion";

interface RetoCompletado {
  id: number;
  titulo: string;
  puntos: number;
  fechaEntrega: string;
}

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const [retosCompletados, setRetosCompletados] = useState<RetoCompletado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const cargarRetosCompletados = async () => {
      try {
        const retosResueltos = (user.publicMetadata.retosResueltos as number[]) || [];
        const response = await fetch('/api/retos');
        if (!response.ok) {
          throw new Error('Error al cargar los retos');
        }
        const todosRetos = await response.json();
        const retosDelUsuario = todosRetos
          .filter((reto: any) => retosResueltos.includes(reto.id))
          .map((reto: any) => ({
            id: reto.id,
            titulo: reto.titulo,
            puntos: reto.puntos,
            fechaEntrega: new Date().toLocaleDateString()
          }));
        setRetosCompletados(retosDelUsuario);
        // Mostrar confetti si se desbloquea un logro nuevo
        if (getLogros().length > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } catch (error) {
        console.error('Error al cargar retos completados:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarRetosCompletados();
  }, [isLoaded, user]);

  // Función para determinar los logros del usuario
  const getLogros = () => {
    if (!user) return [];
    
    const retosResueltos = (user.publicMetadata.retosResueltos as number[]) || [];
    const logros = [];
    
    if (retosResueltos.length >= 1) logros.push({ nombre: '🌱 Principiante', descripcion: 'Resolviste tu primer reto' });
    if (retosResueltos.length >= 3) logros.push({ nombre: '🚀 Explorador', descripcion: 'Resolviste 3 retos' });
    if (retosResueltos.length >= 5) logros.push({ nombre: '⭐ Experto', descripcion: 'Resolviste 5 retos' });
    if (retosResueltos.length >= 10) logros.push({ nombre: '🏆 Maestro', descripcion: 'Resolviste 10 retos' });
    
    return logros;
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <Sidebar/>
      <main className="flex flex-col items-center justify-center flex-1 pt-8">
        <div className="w-full max-w-3xl flex flex-col gap-10 mt-0 items-center">
          {/* Confetti animación */}
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed inset-0 z-50 pointer-events-none flex justify-center items-start"
              >
                <img src="https://cdn.jsdelivr.net/gh/stevensegallery/confetti/confetti.gif" alt="Confetti" className="w-full max-w-2xl mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Estadísticas */}
          <motion.div className="bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold mb-4 text-center text-purple-300 tracking-wide">Estadísticas</h2>
            <div className="flex flex-row justify-center gap-10 w-full">
              <div className="flex flex-col items-center">
                <ProgressCircle value={(user?.publicMetadata.puntos as number) || 0} max={100} color="#FFD600" />
                <p className="text-sm text-gray-400 mt-2">Puntos Totales</p>
              </div>
              <div className="flex flex-col items-center">
                <ProgressCircle value={((user?.publicMetadata.retosResueltos as number[]) || []).length} max={10} color="#3B82F6" />
                <p className="text-sm text-gray-400 mt-2">Retos Completados</p>
              </div>
              <div className="flex flex-col items-center">
                <ProgressCircle value={getLogros().length} max={4} color="#22C55E" />
                <p className="text-sm text-gray-400 mt-2">Logros Desbloqueados</p>
              </div>
            </div>
          </motion.div>
          {/* Logros */}
          <motion.div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-green-300">Logros Desbloqueados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getLogros().map((logro, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg flex items-center gap-3 shadow-lg hover:scale-105 transition-transform"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <span className="text-4xl animate-bounce-slow">{logro.nombre.split(' ')[0]}</span>
                  <div>
                    <p className="font-bold text-lg text-purple-200">{logro.nombre.split(' ').slice(1).join(' ')}</p>
                    <p className="text-sm text-gray-400">{logro.descripcion}</p>
                  </div>
                </motion.div>
              ))}
              {getLogros().length === 0 && (
                <p className="text-gray-400 col-span-2 text-center">Aún no has desbloqueado ningún logro. ¡Completa retos para conseguirlos!</p>
              )}
            </div>
          </motion.div>
          {/* Retos Completados */}
          <motion.div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-300">Retos Completados</h2>
            {cargando ? (
              <p className="text-gray-400 text-center">Cargando retos completados...</p>
            ) : retosCompletados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left">Reto</th>
                      <th className="py-2 px-4 text-left">Puntos</th>
                      <th className="py-2 px-4 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retosCompletados.map((reto) => (
                      <motion.tr key={reto.id} className="border-t border-gray-700"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <td className="py-2 px-4">{reto.titulo}</td>
                        <td className="py-2 px-4">
                          <span className="text-yellow-400 font-bold">{reto.puntos}</span>
                        </td>
                        <td className="py-2 px-4">{reto.fechaEntrega}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center">Aún no has completado ningún reto. ¡Dirígete a la sección de retos para empezar!</p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Componente de gráfico de progreso SVG
const ProgressCircle = ({ value, max, color }: { value: number, max: number, color: string }) => {
  const radius = 36;
  const stroke = 7;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference - percent * circumference;
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#444"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1 }}
        style={{ filter: "drop-shadow(0 0 6px " + color + ")" }}
      />
      <text x="50%" y="54%" textAnchor="middle" fill={color} fontSize="1.2em" fontWeight="bold" dy=".3em">
        {value}
      </text>
    </svg>
  );
};
