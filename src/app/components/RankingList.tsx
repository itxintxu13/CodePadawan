import { UsuarioRanking } from '@/app/services/dataservices';
import { useEffect, useState } from 'react';
import { obtenerUsuarios } from '@/app/services/dataservices';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { FaCrown } from 'react-icons/fa';

export default function RankingList() {
  const [usuarios, setUsuarios] = useState<UsuarioRanking[]>([]);

  useEffect(() => {
    const cargarRanking = async () => {
      const data = await obtenerUsuarios();
      setUsuarios(data);
      // Efecto de confeti al cargar
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };
    cargarRanking();
  }, []);

  if (!usuarios.length) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-gray-800/50" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-br from-gray-900/80 to-indigo-900/50 p-6 shadow-2xl backdrop-blur-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-yellow-400">
          <FaCrown className="mr-2 inline-block" />
          Ranking Jedi
        </h2>
        <span className="rounded-full bg-indigo-600/30 px-4 py-2 text-sm">
          Actualizado: {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 px-4 font-semibold text-indigo-300">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Usuario</div>
          <div className="col-span-3">Puntos</div>
          <div className="col-span-2">Retos</div>
        </div>

        {usuarios.map((usuario, index) => (
          <div 
            key={usuario.id}
            className="grid grid-cols-12 items-center gap-4 rounded-lg bg-gray-800/30 p-4 transition-all hover:bg-indigo-900/30"
          >
            <div className="col-span-1 text-xl font-bold text-yellow-400">
              {index + 1}
            </div>
            <div className="col-span-6 flex items-center space-x-4">
              <img
                src={usuario.imagen || '/default-avatar.png'}
                alt={usuario.nombre}
                className="h-10 w-10 rounded-full border-2 border-indigo-400"
              />
              <span className="text-lg">{usuario.nombre}</span>
            </div>
            <div className="col-span-3 text-indigo-300">
              {usuario.puntos} pts
            </div>
            <div className="col-span-2 text-green-400">
              {usuario.retosResueltos} ✅
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}