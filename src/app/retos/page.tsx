"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import CodeEditorJava from "../components/CodeEditorJava";
import CodeEditorJavaScript from "../components/CodeEditorJavaScript";
import CodeEditorPython from "../components/CodeEditorPython";

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  puntos: number;
  lenguajes: string[];
}

const LENGUAJES = [
  { id: "javascript", nombre: "JavaScript", color: "#F7B801", icon: "/icons/javascript.svg", bg: "#FFF8E1" },
  { id: "python", nombre: "Python", color: "#388E3C", icon: "/icons/python.svg", bg: "#E8F5E9" },
  { id: "java", nombre: "Java", color: "#C62828", icon: "/icons/java.svg", bg: "#FFEBEE" },
];

export default function RetosPage() {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const cargarRetos = async () => {
      try {
        const response = await fetch('/api/retos');
        if (!response.ok) throw new Error('Error al cargar los retos');
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
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #ffe29f 0%, #ffa99f 100%)" }}>
          <span className="text-5xl">🏆</span>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2" style={{ color: "#FFB800" }}>Retos de Programación</h1>
        <p className="text-center text-gray-400 text-lg">Pon a prueba tus habilidades con nuestros desafíos y sube en el ranking</p>
      </div>
      {cargando ? (
        <div className="text-center">
          <p>Cargando retos...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {LENGUAJES.map((lang) => {
            const retosLenguaje = retos.filter((r) => r.lenguajes.includes(lang.id)).slice(0, 3);
            return (
              <div key={lang.id}>
                <div className="flex items-center gap-3 mb-4">
                  <img src={lang.icon} alt={lang.nombre} className="w-8 h-8" />
                  <h2 className="text-2xl font-bold" style={{ color: lang.color }}>{lang.nombre}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {retosLenguaje.length === 0 ? (
                    <div className="col-span-3 text-gray-500">No hay retos disponibles para este lenguaje.</div>
                  ) : (
                    retosLenguaje.map((reto) => (
                      <div
                        key={reto.id}
                        className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group"
                        style={{ background: lang.bg }}
                        onClick={() => seleccionarReto(reto.id)}
                      >
                        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">{reto.titulo}</h3>
                        <p className="text-gray-700 mb-4 group-hover:text-gray-900 transition-colors">{reto.descripcion}</p>
                        <div className="flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            reto.dificultad === 'Fácil' ? 'bg-green-100 text-green-700' :
                            reto.dificultad === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'
                          }`}>
                            {reto.dificultad}
                          </span>
                          <span className="text-purple-700 font-bold group-hover:text-purple-900 transition-colors">{reto.puntos} pts</span>
                        </div>
                        <div className="mt-4">
                          {/* Eliminado el renderizado de editores de código aquí para evitar errores de JSX y mantener solo la información básica del reto. */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}