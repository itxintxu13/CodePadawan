"use client";
import { useState, useEffect } from "react";
import { UserProfile, useUser } from "@clerk/nextjs";
import Sidebar from "@/app/components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import Estadisticas from "@/app/components/Estadisticas";

interface RetoCompletado {
  id: number;
  titulo: string;
  puntos: number;
  fechaEntrega: string;
}

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const [retosCompletados, setRetosCompletados] = useState<RetoCompletado[]>(
    []
  );
  const [cargando, setCargando] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const cargarRetosCompletados = async () => {
      try {
        let retosResueltos =
          (user.publicMetadata.retosResueltos as number[]) || [];

        // Asegurar que retosResueltos sea un array
        retosResueltos = Array.isArray(retosResueltos)
          ? retosResueltos
          : [retosResueltos];

        const response = await fetch("/api/retos");
        if (!response.ok) {
          throw new Error("Error al cargar los retos");
        }
        const todosRetos = await response.json();

        const retosDelUsuario = todosRetos
          .filter((reto: any) => retosResueltos.includes(reto.id)) // Ahora retosResueltos es siempre un array
          .map((reto: any) => ({
            id: reto.id,
            titulo: reto.titulo,
            puntos: reto.puntos,
            fechaEntrega: new Date().toLocaleDateString(),
          }));

        setRetosCompletados(retosDelUsuario);

        // Mostrar confetti si se desbloquea un logro nuevo
        if (getLogros().length > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } catch (error) {
        console.error("Error al cargar retos completados:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarRetosCompletados();
  }, [isLoaded, user]);

  // Función para determinar los logros del usuario
  const getLogros = () => {
    if (!user) return [];

    const retosResueltos =
      (user.publicMetadata.retosResueltos as number[]) || [];
    console.log(typeof retosResueltos);

    const logros = [];

    if (retosResueltos.length >= 1)
      logros.push({
        nombre: "🌱 Principiante",
        descripcion: "Resolviste tu primer reto",
      });
    if (retosResueltos.length >= 3)
      logros.push({
        nombre: "🚀 Explorador",
        descripcion: "Resolviste 3 retos",
      });
    if (retosResueltos.length >= 5)
      logros.push({ nombre: "⭐ Experto", descripcion: "Resolviste 5 retos" });
    if (retosResueltos.length >= 10)
      logros.push({ nombre: "🏆 Maestro", descripcion: "Resolviste 10 retos" });

    return logros;
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  return (
  <div className="flex">
    <div className="w-64 bg-gray-800 text-white">
      <Sidebar />
    </div>

    {/* Contenedor principal que ocupa el espacio restante sin superposición */}
    <div className="flex-grow ml-64 p-8 flex flex-col items-start">
      {/* Tarjetas de resumen con animaciones y gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Estadisticas
          titulo="Puntos Totales"
          maximo={1000}
          label="Progreso"
          color="#facc15"
          link="/ranking"
          tipoDato="puntos"
          tamano="w-94"
        />

        <Estadisticas
          titulo="Retos Resueltos"
          maximo={10}
          label="Retos"
          color="#60a5fa"
          link="/retos"
          tipoDato="retos"
          tamano="w-94"
        />

        <Estadisticas
          titulo="Logros Desbloqueados"
          maximo={10}
          label="Logros"
          color="#22c55e"
          link="/user-profile"
          tipoDato="logros"
          tamano="w-94"
        />
      </div>
    </div>
  </div>
);

}
