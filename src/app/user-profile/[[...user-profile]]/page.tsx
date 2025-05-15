"use client";
import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import Sidebar from "@/app/components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import Estadisticas from '@/app/components/Estadisticas';

interface RetoCompletado {
  id: number;
  titulo: string;
  puntos: number;
  fechaEntrega: string;
}

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Mostrar confetti al cargar el perfil
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white animate-fade-in">
        <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-slide-down">
          Mi Perfil
        </h1>
        <p className="text-lg text-indigo-200 mt-4 text-center mb-2 animate-fade-in-delay">
          Visualiza tu progreso y estadísticas
        </p>
      </div>

      {/* Tarjetas de resumen con animaciones y gráficos */}
      <div className="flex flex-wrap gap-4 justify-center w-full">
        <Estadisticas
          titulo="Puntos Totales"
          maximo={1000}
          label="Progreso"
          color="#facc15"
          link="/ranking"
          tipoDato="puntos"
        />

        <Estadisticas
          titulo="Retos Resueltos"
          maximo={10}
          label="Retos"
          color="#60a5fa"
          link="/retos"
          tipoDato="retos"
        />

        <Estadisticas
          titulo="Logros Desbloqueados"
          maximo={10}
          label="Logros"
          color="#22c55e"
          link="/user-profile"
          tipoDato="logros"
        />
      </div>

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
      </main>
    </div>
  );
}