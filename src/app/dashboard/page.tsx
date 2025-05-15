"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumenEstadisticas from "@/app/components/Estadisticas";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const userRol = user.publicMetadata?.rol as string | undefined;
      setRol(userRol || null);
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <p className="text-white text-center mt-10">Cargando...</p>;
  }

  if (!rol) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>No tienes un rol asignado. Por favor, vuelve a iniciar sesión desde la página principal.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white p-8 animate-fade-in">
      {rol === "padawan" ? (
        <>
          <h1 className="text-4xl font-bold mb-6 text-center">
            Bienvenido, {user.username} 🧑‍💻
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Aquí está tu panel como <strong>Padawan</strong>. Sigue practicando y acumulando puntos.
          </p>
          <ResumenEstadisticas />
        </>
      ) : rol === "jedi" ? (
        <>
          <h1 className="text-4xl font-bold mb-6 text-center">
            Bienvenido, Maestro Jedi 🧙‍♂️
          </h1>
          <p className="text-center text-indigo-300 mb-6">
            Controla el progreso de tus Padawans, gestiona retos y publica anuncios.
          </p>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-2 text-yellow-400">👨‍🏫 Lista de Padawans</h2>
              <p className="text-gray-300">(Aquí podrías mostrar una tabla o lista con el progreso de los alumnos)</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-2 text-green-400">🧩 Gestión de Retos</h2>
              <p className="text-gray-300">(Sección para crear o editar retos disponibles para los alumnos)</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg md:col-span-2">
              <h2 className="text-2xl font-semibold mb-2 text-blue-400">📣 Anuncios y Notificaciones</h2>
              <p className="text-gray-300">(Aquí podrías permitir publicar avisos o mensajes para los padawans)</p>
            </div>
          </section>
        </>
      ) : (
        <p className="text-center text-red-500">Rol desconocido: {rol}</p>
      )}
    </main>
  );
}
