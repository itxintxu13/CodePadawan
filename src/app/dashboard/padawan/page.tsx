"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StarField from "@/app/components/StarField";
import Estadisticas from "@/app/components/Estadisticas";

export default function PadawanDashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const selectedRole = localStorage.getItem("selectedRole");

    if (!user?.publicMetadata) return;

    const currentRol = user.publicMetadata.rol;

    if (!currentRol && selectedRole) {
      // Usamos 'rol' en vez de 'role'
      (user as any)
        .update({ publicMetadata: { rol: selectedRole } })
        .then(() => {
          localStorage.removeItem("selectedRole");
        })
        .catch((err: any) => {
          console.error("Error guardando el rol en Clerk:", err);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-green-950 via-green-950 to-black text-white relative overflow-hidden">
      <StarField />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-900/30 to-black/50 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="mb-10 text-center flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-3">
            <img src="/padawan-symbol.svg" alt="Símbolo Padawan" className="w-12 h-12 animate-float" />
            <span className="text-5xl font-bold bg-gradient-to-r from-green-300 via-green-400 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg tracking-wider">PANEL DE PADAWAN</span>
            <img src="/padawan-symbol.svg" alt="Símbolo Padawan" className="w-12 h-12 animate-float" />
          </div>
          <div className="h-1 w-64 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full mt-2"></div>
        </h1>

        <div className="flex flex-col items-center mb-8">
          <p className="text-xl text-green-200 italic text-center max-w-2xl mb-8">
            "El aprendizaje es el camino del Padawan. Cada reto te acerca más a convertirte en Jedi."
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-green-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-500/30 hover:border-green-400 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-green-300">
              <img src="/icons/padawan-challenge.svg" alt="Retos" className="w-8 h-8 text-green-300" /> Retos Activos
            </h2>
            <p className="text-green-100">Explora y completa los desafíos pensados para tu nivel Padawan. ¡Demuestra tu progreso!</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Retos Completados"
                maximo={10}
                label="Progreso"
                color="#4ade80"
                tipoDato="retos"
                tamano="w-full"
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-green-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-green-500/30 hover:border-green-400 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-green-300">
              <img src="/icons/padawan-achievement.svg" alt="Logros" className="w-8 h-8 text-green-300" /> Logros
            </h2>
            <p className="text-green-100">Desbloquea logros especiales y demuestra tu dominio de la Fuerza.</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Logros Desbloqueados"
                maximo={10}
                label="Logros"
                color="#9370DB"
                tipoDato="logros"
                tamano="w-full"
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-green-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-green-500/30 hover:border-green-400 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-green-300">
              <img src="/icons/padawan-score.svg" alt="Puntuación" className="w-8 h-8 text-green-300" /> Puntuación
            </h2>
            <p className="text-green-100">Tu progreso en la Fuerza se refleja en tus puntos. ¡Sigue mejorando!</p>
            <div className="mt-6">
              <Estadisticas
                titulo="Puntos Totales"
                maximo={1000}
                label="Puntos"
                color="#facc15"
                tipoDato="puntos"
                tamano="w-full"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

