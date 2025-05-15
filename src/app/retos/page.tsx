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
  { id: "html", nombre: "HTML", color: "#E44D26", icon: "/icons/html.svg", bg: "#FFF3E0" },
];

export default function RetosPage() {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [lenguajeSeleccionado, setLenguajeSeleccionado] = useState<string>("");
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState<string>("");
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
    <main className="container mx-auto p-8 bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #ffe29f 0%, #ffa99f 100%)" }}>
            <span className="text-5xl">🏆</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2" style={{ color: "#FFB800" }}>Retos de Programación</h1>
          <p className="text-center text-gray-400 text-lg">Pon a prueba tus habilidades con nuestros desafíos y sube en el ranking</p>
        </div>

        {/* Selección de Lenguaje */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Elige un lenguaje de programación</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {LENGUAJES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLenguajeSeleccionado(lang.id)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg shadow transition-all border-2 ${lenguajeSeleccionado === lang.id ? 'border-yellow-400 bg-gray-800' : 'border-transparent bg-gray-700 hover:bg-gray-800'}`}
                style={{ minWidth: 120 }}
              >
                <img src={lang.icon} alt={lang.nombre} className="w-24 h-24 mb-2" />
                <span className="font-semibold text-lg" style={{ color: lang.color }}>{lang.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de Dificultad (se muestran solo cuando se selecciona un lenguaje) */}
        {lenguajeSeleccionado && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Tarjeta Fácil */}
            <button
              onClick={() => setDificultadSeleccionada("Fácil")}
              className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition-all ${dificultadSeleccionada === "Fácil" ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Fácil</h3>
              <p className="text-gray-400 text-center">Perfectos para empezar</p>
            </button>

            {/* Tarjeta Media */}
            <button
              onClick={() => setDificultadSeleccionada("Media")}
              className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition-all ${dificultadSeleccionada === "Media" ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Media</h3>
              <p className="text-gray-400 text-center">Pon a prueba tus habilidades</p>
            </button>

            {/* Tarjeta Difícil */}
            <button
              onClick={() => setDificultadSeleccionada("Difícil")}
              className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition-all ${dificultadSeleccionada === "Difícil" ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4">
                <span className="text-4xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Difícil</h3>
              <p className="text-gray-400 text-center">Desafíos para expertos</p>
            </button>
          </div>
        )}

        {lenguajeSeleccionado && dificultadSeleccionada && !cargando && (
          <div className="space-y-8">
            {LENGUAJES.filter(l => l.id === lenguajeSeleccionado).map((lang) => {
              const retosLenguaje = retos.filter((r) => 
                r.lenguajes.includes(lang.id) && 
                r.dificultad === dificultadSeleccionada
              );
              
              return (
                <div key={lang.id} className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <img src={lang.icon} alt={lang.nombre} className="w-8 h-8" />
                    <h2 className="text-2xl font-bold" style={{ color: lang.color }}>{lang.nombre} - {dificultadSeleccionada}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {retosLenguaje.length === 0 ? (
                      <div className="col-span-3 text-center text-gray-500">No hay retos disponibles para esta combinación.</div>
                    ) : (
                      retosLenguaje.map((reto) => (
                        <div
                          key={reto.id}
                          className={`border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group ${
                            dificultadSeleccionada === "Fácil" ? 'bg-green-100' :
                            dificultadSeleccionada === "Media" ? 'bg-yellow-100' :
                            'bg-red-100'
                          }`}
                          onClick={() => seleccionarReto(reto.id)}
                        >
                          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">{reto.titulo}</h3>
                          <p className="text-gray-700 mb-4 group-hover:text-gray-900 transition-colors">{reto.descripcion}</p>
                          <div className="flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              dificultadSeleccionada === "Fácil" ? 'bg-green-100 text-green-700' :
                              dificultadSeleccionada === "Media" ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-700'
                            }`}>{dificultadSeleccionada}</span>
                            <span className="text-purple-700 font-bold group-hover:text-purple-900 transition-colors">{reto.puntos} pts</span>
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
        {cargando && (
          <div className="text-center">
            <p>Cargando retos...</p>
          </div>
        )}
      </div>
    </main >
  );
}



