"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StarField from "@/app/components/StarField";
import Estadisticas from "@/app/components/Estadisticas";

export default function JediDashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedRole");

    if (!user?.publicMetadata) return;

    const currentRol = user.publicMetadata.rol; // <-- CAMBIADO A 'rol'

    if (!currentRol && selectedRole) {
      (user as any)
        .update({ publicMetadata: { rol: selectedRole } }) // <-- CAMBIADO A 'rol'
        .then(() => {
          localStorage.removeItem("selectedRole");
        })
        .catch((err: any) => {
          console.error("Error guardando el rol en Clerk:", err);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10 p-8">
        <h1 className="text-5xl font-bold mb-10 text-center text-blue-300 drop-shadow-lg flex items-center justify-center gap-3">
          <img src="/jedi-symbol.svg" alt="Símbolo Jedi" className="w-12 h-12 animate-pulse" />
          Panel de Maestro Jedi
          <img src="/jedi-symbol.svg" alt="Símbolo Jedi" className="w-12 h-12 animate-pulse" />
        </h1>

        <div className="flex flex-col items-center mb-8">
          <p className="text-xl text-blue-200 italic text-center max-w-2xl mb-8">
            "La sabiduría del Jedi fluye a través de la Fuerza. Guía a los demás hacia la luz."
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-blue-900/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-500/30 hover:border-blue-400 transition-all hover:shadow-blue-500/20 hover:bg-blue-800/50"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-blue-300">
              <img src="/icons/jedi-challenge.svg" alt="Retos" className="w-8 h-8 text-blue-300" /> Retos Maestros
            </h2>
            <p className="text-blue-100">Guía a los Padawan compartiendo tu sabiduría y experiencia en los desafíos.</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Retos Supervisados"
                maximo={100}
                label="Progreso"
                color="#60a5fa"
                tipoDato="retos"
                tamano="w-full"
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-blue-900/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-500/30 hover:border-blue-400 transition-all hover:shadow-blue-500/20 hover:bg-blue-800/50"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-blue-300">
              <img src="/icons/jedi-wisdom.svg" alt="Sabiduría" className="w-8 h-8 text-blue-300" /> Sabiduría
            </h2>
            <p className="text-blue-100">Tu experiencia y conocimiento son fundamentales para guiar a la siguiente generación.</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Padawans Guiados"
                maximo={15}
                label="Aprendices"
                color="#3b82f6"
                tipoDato="logros"
                tamano="w-full"
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-blue-900/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-500/30 hover:border-blue-400 transition-all hover:shadow-blue-500/20 hover:bg-blue-800/50"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-blue-300">
              <img src="/icons/jedi-mastery.svg" alt="Reconocimiento" className="w-8 h-8 text-blue-300" /> Reconocimiento
            </h2>
            <p className="text-blue-100">Tu influencia en la comunidad se refleja en tu prestigio como Maestro Jedi.</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Puntos de Maestría"
                maximo={2000}
                label="Maestría"
                color="#facc15"
                tipoDato="puntos"
                tamano="w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

