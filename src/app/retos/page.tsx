"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  puntos: number;
  lenguajes: string[];
}

export default function RetosPage() {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // Cargar los retos desde el archivo JSON
    const cargarRetos = async () => {
      try {
        const response = await fetch('/api/retos');
        if (!response.ok) {
          throw new Error('Error al cargar los retos');
        }
        const data = await response.json();
        setRetos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarRetos();
  }, []);

  const seleccionarReto = (id: number) => {
    router.push(`/retos/${id}`);
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso Restringido</h1>
        <p className="mb-4">Debes iniciar sesión para acceder a los retos.</p>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Retos de Programación 🚀</h1>
      
      {cargando ? (
        <div className="text-center">
          <p>Cargando retos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retos.map((reto) => (
            <div 
              key={reto.id} 
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => seleccionarReto(reto.id)}
            >
              <h2 className="text-2xl font-bold mb-2">{reto.titulo}</h2>
              <p className="text-gray-300 mb-4">{reto.descripcion}</p>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  reto.dificultad === 'Fácil' ? 'bg-green-600' : 
                  reto.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {reto.dificultad}
                </span>
                <span className="text-yellow-400 font-bold">{reto.puntos} pts</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {reto.lenguajes.map((lenguaje) => (
                  <span key={lenguaje} className="px-2 py-1 bg-gray-700 rounded text-xs">
                    {lenguaje}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}