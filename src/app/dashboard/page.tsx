"use client";
import { useUser } from "@clerk/nextjs";
import Estadisticas from "../components/Estadisticas";

export default function Dashboard() {
  const { isLoaded, user } = useUser();


  return (
    <main className="container mx-auto p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 min-h-screen text-white animate-fade-in">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-slide-down">
          ¡Bienvenido{user?.username ? `, ${user.username}` : ""} al Dashboard 🚀
        </h1>
        <p className="text-lg text-indigo-200 mt-4 text-center mb-2 animate-fade-in-delay">
          Gestiona tu cuenta y explora contenido exclusivo.
        </p>
      </div>

      {/* Tarjetas de resumen con animaciones y gráficos */}
      <div className="flex gap-4 justify-between w-full">
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
  );
}
