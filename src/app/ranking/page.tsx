"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Usuario {
  id: string;
  nombre: string;
  puntos: number;
  retosResueltos: number[];
}

export default function RankingPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useUser();
  const [resultado, setResultado] = useState<{ success: boolean; message: string } | null>(null);


  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch("/api/updatePoints");
        if (!response.ok) throw new Error("Error en la respuesta de la API");
  
        const data = await response.json();
        console.log("Datos recibidos de la API:", JSON.stringify(data, null, 2));
  
        // 🔥 Corrección: Cambiar "usuario" por "user"
       const usuariosClerk = data.map((user: any) => {
       const retosResueltos = typeof user.retosResueltos === "number" ? user.retosResueltos : 0; // Ahora asignamos correctamente el número de retos
       const logros = getLogros(retosResueltos); // Simular un array con retos para la función de logros

  return {
    id: user.id,
    nombre: user.username || "Usuario",
    puntos: typeof user.points === "number" ? user.points : 0,
    retosResueltos: retosResueltos, // ✅ Ahora reflejamos el número correcto
    logros: getLogros(retosResueltos),
  };
});
  
        console.log("Usuarios después del mapeo:", JSON.stringify(usuariosClerk, null, 2));
  
        // Ordenar usuarios por puntos de mayor a menor
        const usuariosOrdenados = [...usuariosClerk].sort(
          (a: Usuario, b: Usuario) => (b.puntos ?? 0) - (a.puntos ?? 0)
        );
  
        console.log("Usuarios después de ordenar:", JSON.stringify(usuariosOrdenados, null, 2));
  
        setUsuarios(usuariosOrdenados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setCargando(false);
      }
    };
  
    cargarUsuarios();
  }, [user, resultado]); // ✅ Se ejecuta cuando `user` cambia Y también cuando se entrega una solución
  
  // Función para determinar el emoji de la posición
  const getPositionEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}`;
    }
  };

  // Función para determinar los logros del usuario
const getLogros = (numRetosResueltos: number) => {
  const logros = [];

  console.log("Número de retos resueltos en getLogros:", numRetosResueltos);

  if (numRetosResueltos >= 1) {
    logros.push('🌱 Principiante');
    console.log("Asignado logro: Principiante");
  }
  if (numRetosResueltos >= 3) {
    logros.push('🚀 Explorador');
    console.log("Asignado logro: Explorador");
  }
  if (numRetosResueltos >= 5) {
    logros.push('⭐ Experto');
    console.log("Asignado logro: Experto");
  }
  if (numRetosResueltos >= 10) {
    logros.push('🏆 Maestro');
    console.log("Asignado logro: Maestro");
  }

  console.log("Logros generados:", logros);

  return logros;
};


  console.log("Usuarios en el render:", usuarios); // ✅ Fuera del return
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
                <th className="py-3 px-4 text-left">Logros</th>
              </tr>
            </thead>
            <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id} 
                  className={`border-t border-gray-700 ${user && usuario.id === user.id ? 'bg-blue-900 bg-opacity-30' : ''}`}
              >
                <td className="py-3 px-4">
                  <span className="text-xl">{getPositionEmoji(index)}</span>
                </td>
                <td className="py-3 px-4">
                  {usuario.nombre}
                  {user && usuario.id === user.id && (
                    <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">Tú</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-yellow-400">{usuario.puntos}</span>
                </td>
                <td className="py-3 px-4">{usuario.retosResueltos ?? 0}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {getLogros(usuario.retosResueltos).map((logro, i) => (
                      <span key={i} className="bg-green-700 px-2 py-1 rounded text-xs">
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
