"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressChart from "../components/ProgressChart";
import AchievementBadge from "../components/AchievementBadge";
import ActivityFeed from './ActivityFeed';
export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [puntos, setPuntos] = useState(0);
  const [retosResueltos, setRetosResueltos] = useState(0);
  const [logros, setLogros] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      // Obtener datos del usuario desde Clerk
      const puntosUsuario = (user.publicMetadata.puntos as number) || 0;
      const retosResueltosUsuario = ((user.publicMetadata.retosResueltos as number[]) || []).length;
      
      // Calcular logros
      let logrosDesbloqueados = 0;
      if (retosResueltosUsuario >= 1) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 3) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 5) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 10) logrosDesbloqueados++;
      
      setPuntos(puntosUsuario);
      setRetosResueltos(retosResueltosUsuario);
      setLogros(logrosDesbloqueados);
    }
  }, [isLoaded, user]);

  return (
    <main className="container mx-auto p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 min-h-screen text-white animate-fade-in">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-slide-down">¡Bienvenido{user?.firstName ? `, ${user.firstName}` : ""} al Dashboard 🚀</h1>
        <p className="text-lg text-indigo-200 mt-4 text-center mb-2 animate-fade-in-delay">
          Gestiona tu cuenta y explora contenido exclusivo.
        </p>
      </div>
      {/* Tarjetas de resumen con animaciones y gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in">
          <h2 className="text-xl font-bold mb-2 text-yellow-300">Puntos Totales</h2>
          <div className="flex justify-center mb-2">
            <ProgressChart value={puntos} max={1000} label="Progreso" color="#facc15" />
          </div>
          <p className="text-3xl font-extrabold text-yellow-400 drop-shadow">{puntos}</p>
          <Link href="/ranking" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver ranking
          </Link>
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in">
          <h2 className="text-xl font-bold mb-2 text-blue-300">Retos Resueltos</h2>
          <div className="flex justify-center mb-2">
            <ProgressChart value={retosResueltos} max={10} label="Retos" color="#60a5fa" />
          </div>
          <p className="text-3xl font-extrabold text-blue-400 drop-shadow">{retosResueltos}</p>
          <Link href="/retos" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver retos
          </Link>
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in">
          <h2 className="text-xl font-bold mb-2 text-green-300">Logros Desbloqueados</h2>
          <div className="flex justify-center gap-2 mb-2">
            <AchievementBadge unlocked={retosResueltos>=1} label="Primer reto" icon="🏅" color="#fbbf24" />
            <AchievementBadge unlocked={retosResueltos>=3} label="3 retos" icon="🥈" color="#60a5fa" />
            <AchievementBadge unlocked={retosResueltos>=5} label="5 retos" icon="🥇" color="#34d399" />
            <AchievementBadge unlocked={retosResueltos>=10} label="10 retos" icon="🏆" color="#f472b6" />
          </div>
          <p className="text-3xl font-extrabold text-green-400 drop-shadow">{logros}</p>
          <Link href="/user-profile" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver perfil
          </Link>
        </div>
      </div>
    </main>
  );
}