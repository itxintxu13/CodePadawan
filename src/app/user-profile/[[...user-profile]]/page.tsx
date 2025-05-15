"use client";
import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import Sidebar from "@/app/components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import Estadisticas from '@/app/components/Estadisticas';
import { useSearchParams } from "next/navigation";
import CodeEditor from '@/app/components/CodeEditor';

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (!isLoaded || !user) return;
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  // Si el tab es 'playground', mostramos el editor de código
  if (tab === 'playground') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-400">
              🛸 Bienvenido al Playground Jedi 🛸
            </h1>
            <p className="text-indigo-300 italic">
              "Hazlo o no lo hagas, pero no lo intentes" - Yoda
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <p className="text-green-400 text-lg font-semibold">
              💻 Usa la Fuerza... y codea padawan 💻
            </p>
          </div>

          <CodeEditor />

        </main>
      </div>
    );
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

      </main>
    </div>
  );
}