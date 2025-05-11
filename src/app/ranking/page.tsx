"use client";
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

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
  const { users } = useClerk();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        // En un entorno real, esto se conectaría con Clerk para obtener todos los usuarios
        // Como ejemplo, creamos algunos usuarios ficticios y añadimos al usuario actual si existe
        const usuariosFicticios: Usuario[] = [
          { id: '1', nombre: 'Usuario1', puntos: 120, retosResueltos: [1, 2, 3] },
          { id: '2', nombre: 'Usuario2', puntos: 90, retosResueltos: [1, 2] },
          { id: '3', nombre: 'Usuario3', puntos: 50, retosResueltos: [1] },
        ];
        
        // Añadir al usuario actual si existe
        if (user) {
          const usuarioActual: Usuario = {
            id: user.id,
            nombre: user.firstName || user.username || 'Usuario',
            puntos: (user.publicMetadata.puntos as number) || 0,
            retosResueltos: (user.publicMetadata.retosResueltos as number[]) || [],
          };
          
          // Verificar si el usuario ya está en la lista
          const usuarioExistente = usuariosFicticios.findIndex(u => u.id === user.id);
          if (usuarioExistente >= 0) {
            usuariosFicticios[usuarioExistente] = usuarioActual;
          } else {
            usuariosFicticios.push(usuarioActual);
          }
        }
        
        // Ordenar por puntos (de mayor a menor)
        const usuariosOrdenados = usuariosFicticios.sort((a, b) => b.puntos - a.puntos);
        setUsuarios(usuariosOrdenados);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [user]);

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
  const getLogros = (retosResueltos: number[]) => {
    const logros = [];
    
    if (retosResueltos.length >= 1) logros.push('🌱 Principiante');
    if (retosResueltos.length >= 3) logros.push('🚀 Explorador');
    if (retosResueltos.length >= 5) logros.push('⭐ Experto');
    if (retosResueltos.length >= 10) logros.push('🏆 Maestro');
    
    return logros;
  };

  return (
    <div className="container mx-auto p-8">
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
                <tr 
                  key={usuario.id} 
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
                  <td className="py-3 px-4">{usuario.retosResueltos.length}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {getLogros(usuario.retosResueltos).map((logro, i) => (
                        <span key={i} className="bg-gray-700 px-2 py-1 rounded text-xs">
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
      
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Logros Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl mb-2">🌱 Principiante</p>
            <p className="text-gray-300">Resuelve tu primer reto</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl mb-2">🚀 Explorador</p>
            <p className="text-gray-300">Resuelve 3 retos</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl mb-2">⭐ Experto</p>
            <p className="text-gray-300">Resuelve 5 retos</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl mb-2">🏆 Maestro</p>
            <p className="text-gray-300">Resuelve 10 retos</p>
          </div>
        </div>
      </div>
    </div>
  );
}