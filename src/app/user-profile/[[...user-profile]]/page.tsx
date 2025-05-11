"use client";
import { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/nextjs';
import Sidebar from "@/app/components/SideBar";

interface RetoCompletado {
  id: number;
  titulo: string;
  puntos: number;
  fechaEntrega: string;
}

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const [retosCompletados, setRetosCompletados] = useState<RetoCompletado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const cargarRetosCompletados = async () => {
      try {
        // En un entorno real, esto se conectaría con una API para obtener los retos completados
        // Como ejemplo, creamos algunos retos ficticios basados en los IDs guardados en Clerk
        const retosResueltos = (user.publicMetadata.retosResueltos as number[]) || [];
        
        // Cargar los retos desde el archivo JSON
        const response = await fetch('/api/retos');
        if (!response.ok) {
          throw new Error('Error al cargar los retos');
        }
        const todosRetos = await response.json();
        
        // Filtrar solo los retos completados por el usuario
        const retosDelUsuario = todosRetos
          .filter((reto: any) => retosResueltos.includes(reto.id))
          .map((reto: any) => ({
            id: reto.id,
            titulo: reto.titulo,
            puntos: reto.puntos,
            fechaEntrega: new Date().toLocaleDateString() // En un caso real, esto vendría de la base de datos
          }));
        
        setRetosCompletados(retosDelUsuario);
      } catch (error) {
        console.error('Error al cargar retos completados:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarRetosCompletados();
  }, [isLoaded, user]);

  // Función para determinar los logros del usuario
  const getLogros = () => {
    if (!user) return [];
    
    const retosResueltos = (user.publicMetadata.retosResueltos as number[]) || [];
    const logros = [];
    
    if (retosResueltos.length >= 1) logros.push({ nombre: '🌱 Principiante', descripcion: 'Resolviste tu primer reto' });
    if (retosResueltos.length >= 3) logros.push({ nombre: '🚀 Explorador', descripcion: 'Resolviste 3 retos' });
    if (retosResueltos.length >= 5) logros.push({ nombre: '⭐ Experto', descripcion: 'Resolviste 5 retos' });
    if (retosResueltos.length >= 10) logros.push({ nombre: '🏆 Maestro', descripcion: 'Resolviste 10 retos' });
    
    return logros;
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

  return (
    <div>
      <Sidebar/>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna izquierda: Perfil de Clerk */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <UserProfile />
            </div>
          </div>
          
          {/* Columna derecha: Estadísticas y logros */}
          <div className="md:col-span-2">
            {/* Estadísticas */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Puntos Totales</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {(user?.publicMetadata.puntos as number) || 0}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Retos Completados</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {((user?.publicMetadata.retosResueltos as number[]) || []).length}
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Logros Desbloqueados</p>
                  <p className="text-3xl font-bold text-green-400">
                    {getLogros().length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Logros */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Logros Desbloqueados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getLogros().map((logro, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg flex items-center gap-3">
                    <div className="text-3xl">{logro.nombre.split(' ')[0]}</div>
                    <div>
                      <p className="font-bold">{logro.nombre.split(' ').slice(1).join(' ')}</p>
                      <p className="text-sm text-gray-400">{logro.descripcion}</p>
                    </div>
                  </div>
                ))}
                {getLogros().length === 0 && (
                  <p className="text-gray-400 col-span-2">Aún no has desbloqueado ningún logro. ¡Completa retos para conseguirlos!</p>
                )}
              </div>
            </div>
            
            {/* Retos Completados */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Retos Completados</h2>
              {cargando ? (
                <p className="text-gray-400">Cargando retos completados...</p>
              ) : retosCompletados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="py-2 px-4 text-left">Reto</th>
                        <th className="py-2 px-4 text-left">Puntos</th>
                        <th className="py-2 px-4 text-left">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retosCompletados.map((reto) => (
                        <tr key={reto.id} className="border-t border-gray-700">
                          <td className="py-2 px-4">{reto.titulo}</td>
                          <td className="py-2 px-4">
                            <span className="text-yellow-400 font-bold">{reto.puntos}</span>
                          </td>
                          <td className="py-2 px-4">{reto.fechaEntrega}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">Aún no has completado ningún reto. ¡Dirígete a la sección de retos para empezar!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
