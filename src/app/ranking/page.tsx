"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { database } from "../firebase/page";
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

        const usuariosOrdenados = usuariosClerk.sort((a, b) => b.puntos - a.puntos);
        setUsuarios(usuariosOrdenados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  return (
    <main className="container mx-auto p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Ranking de Usuarios 🏆</h1>

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
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id} className={`border-t border-gray-700 ${user && usuario.id === user.id ? 'bg-blue-900 bg-opacity-30' : ''}`}>
                  <td className="py-3 px-4">
                    <span className="text-xl">{index + 1}</span>
                  </td>
                  <td className="py-3 px-4">{usuario.nombre}</td>
                  <td className="py-3 px-4 font-bold text-yellow-400">{usuario.puntos}</td>
                  <td className="py-3 px-4">{usuario.retosResueltos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
