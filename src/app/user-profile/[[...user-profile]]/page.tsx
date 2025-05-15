"use client";
import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import Sidebar from "@/app/components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import Estadisticas from '@/app/components/Estadisticas';
import { useSearchParams } from "next/navigation";
import CodeEditor from '@/app/components/CodeEditor';
import { FaGithub } from 'react-icons/fa';

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

  // Muestra el playground
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

  // Muestra la info sobre nosotros
  if (tab === 'about') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
                🚀 Acerca de CodePadawan
              </h1>
              <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                Una plataforma para aprender a programar de manera interactiva y divertida
              </p>
            </div>

            {/* Equipo */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-12">
              {/* Itxine */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4">
                    👨‍💻
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Itxine</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  CodePadawan es el lugar ideal para aprender a programar de manera interactiva y emocionante.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/itxintxu13" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>


              {/* Jonan */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4">
                    👨‍💻
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Jon Ander</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Que la Fuerza del código te guíe—explora, aprende y conquista los desafíos en CodePadawan.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/jrincon00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>


              {/* Ale */}
              <div className="md:col-span-2 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300 text-center max-w-md mx-auto">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4">
                    👨‍💻
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Alejandra</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  No necesitas un destornillador sónico para aprender a programar, solo curiosidad y CodePadawan para viajar por el universo del desarrollo.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/ARP-10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Tecnologías */}
            {/* <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Tecnologías que usamos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Next.js', 'TypeScript', 'Clerk', 'React', 'Tailwind CSS'].map((tech) => (
                  <div key={tech} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center hover:scale-105 transition-transform">
                    <span className="text-yellow-400">{tech}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
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