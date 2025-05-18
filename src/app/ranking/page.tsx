"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { database } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

interface Usuario {
  id: string;
  nombre: string;
  puntos: number;
  retosResueltos: number;
}

export default function RankingPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch("/api/updatePoints");
        if (!response.ok) throw new Error("Error en la respuesta de la API");

        const data = await response.json();
        console.log("Datos de Clerk recibidos:", JSON.stringify(data, null, 2));

        const usuariosClerk = await Promise.all(
          data.map(async (user: any) => {
            // Consultar en Firebase usando el id_clerk
            const userRef = ref(database, `users/${user.id}`);
            const snapshot = await get(userRef);

            let firebaseUserData = snapshot.exists() ? snapshot.val() : {};

            return {
              id: user.id,
              nombre: user.username || "Usuario",
              puntos: firebaseUserData?.puntos ?? 0,
              retosResueltos: firebaseUserData?.retos_completados ?? 0,
            };
          })
        );

        const usuariosOrdenados = usuariosClerk.sort(
          (a, b) => b.puntos - a.puntos
        );
        setUsuarios(usuariosOrdenados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  // Función para determinar el emoji de la posición
  const getPositionEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}`;
    }
  };

  // Función para determinar los logros del usuario
  const getLogros = (numRetosResueltos: number) => {
    const logros = [];

    console.log("Número de retos resueltos en getLogros:", numRetosResueltos);

    if (numRetosResueltos >= 1) {
      logros.push("🌱 Padawan");
      console.log("Asignado logro: Padawan");
    }
    if (numRetosResueltos >= 3) {
      logros.push("🚀 Rebelde");
      console.log("Asignado logro: Rebelde");
    }
    if (numRetosResueltos >= 5) {
      logros.push("⭐ Caballero Jedi");
      console.log("Asignado logro: Caballero Jedi");
    }
    if (numRetosResueltos >= 10) {
      logros.push("🏆 Maestro Jedi");
      console.log("Asignado logro: Maestro Jedi");
    }
    if (numRetosResueltos >= 20) {
      logros.push("🌌 Jedi Legendario");
      console.log("Asignado logro: Jedi Legendario");
    }

    console.log("Logros generados:", logros);

    return logros;
  };

  return (
    <main className="container mx-auto p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        Ranking de Usuarios 🏆
      </h1>

      {cargando ? (
        <div className="text-center">
          <p>Cargando ranking...</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left">Posición</th>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left">Puntos</th>
                <th className="py-3 px-4 text-left">Retos Resueltos</th>
                <th className="py-3 px-4 text-left">Logros</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr
                  key={usuario.id}
                  className={`border-t border-gray-700 ${
                    user && usuario.id === user.id
                      ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 bg-opacity-70"
                      : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="text-xl">{getPositionEmoji(index)}</span>
                  </td>
                  <td className="py-3 px-4">
                    {usuario.nombre}
                    {user && usuario.id === user.id && (
                      <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 px-2 py-1 rounded text-gray-900 font-semibold shadow-sm">
                        Tú
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-yellow-400">
                      {usuario.puntos}
                    </span>
                  </td>
                  <td className="py-3 px-4">{usuario.retosResueltos ?? 0}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {getLogros(usuario.retosResueltos).map((logro, i) => (
                        <span
                          key={i}
                          className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm"
                        >
                          {logro}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
