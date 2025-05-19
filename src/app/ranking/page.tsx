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
    let logro = "";  // Variable para almacenar el logro

    console.log("Número de retos resueltos en getLogros:", numRetosResueltos);

    if (numRetosResueltos >= 20) {
      logro = "🌌 Jedi Legendario";  // Logro más alto
      console.log("Asignado logro: Jedi Legendario");
    } else if (numRetosResueltos >= 10) {
      logro = "🏆 Maestro Jedi";
      console.log("Asignado logro: Maestro Jedi");
    } else if (numRetosResueltos >= 5) {
      logro = "⭐ Caballero Jedi";
      console.log("Asignado logro: Caballero Jedi");
    } else if (numRetosResueltos >= 3) {
      logro = "🚀 Rebelde";
      console.log("Asignado logro: Rebelde");
    } else if (numRetosResueltos >= 1) {
      logro = "🌱 Padawan";
      console.log("Asignado logro: Padawan");
    }

    console.log("Logro generado:", logro);

    return logro;  // Retorna solo el logro correspondiente
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
                <th className="py-3 px-4 text-center">Posición</th>
                <th className="py-3 px-4 text-center">Usuario</th>
                <th className="py-3 px-4 text-center">Puntos</th>
                <th className="py-3 px-4 text-center">Retos Resueltos</th>
                <th className="py-3 px-4 text-center">Rango</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr
                  key={usuario.id}
                  className={`border-t border-gray-700 ${user && usuario.id === user.id
                      ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 bg-opacity-70"
                      : ""
                    }`}
                >
                  <td className="py-3 px-4 text-center">
                    <span className="text-xl">{getPositionEmoji(index)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {usuario.nombre}
                    {user && usuario.id === user.id && (
                      <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 px-2 py-1 rounded text-gray-900 font-semibold shadow-sm">
                        Tú
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-yellow-400">
                      {usuario.puntos}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">{usuario.retosResueltos ?? 0}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Mostramos solo un logro */}
                      <span className="bg-indigo-900 px-2 py-1 rounded text-xs text-yellow-300 font-semibold shadow-sm">
                        {getLogros(usuario.retosResueltos)}
                      </span>
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