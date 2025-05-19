"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { database } from "@/lib/firebase/config";
import { get, ref } from "firebase/database";

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  puntos: number;
  lenguajes: string[];
}

const LENGUAJES = [
  {
    id: "javascript",
    nombre: "JavaScript",
    color: "#F7B801",
    icon: "/icons/javascript.svg",
    bg: "#FFF8E1",
  },
  {
    id: "python",
    nombre: "Python",
    color: "#007BFF",
    icon: "/icons/python.svg",
    bg: "#E8F5E9",
  },
  {
    id: "java",
    nombre: "Java",
    color: "#C62828",
    icon: "/icons/java.svg",
    bg: "#FFEBEE",
  },
  {
    id: "html",
    nombre: "HTML",
    color: "#E54C21",
    icon: "/icons/html.svg",
    bg: "#FFF3E0",
  },
];

export default function RetosPage() {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [lenguajeSeleccionado, setLenguajeSeleccionado] = useState<string>("");
  const [dificultadSeleccionada, setDificultadSeleccionada] =
    useState<string>("");
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [puntosUsuario, setPuntosUsuario] = useState(0);

  useEffect(() => {
    const cargarPuntosDesdeFirebase = async () => {
      if (user?.id) {
        try {
          const userRef = ref(database, `users/${user.id}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const datos = snapshot.val();
            const puntosFirebase = datos.puntos || 0;
            setPuntosUsuario(puntosFirebase);
            console.log("Puntos cargados desde Firebase:", puntosFirebase);
          } else {
            setPuntosUsuario(0);
            console.log("No hay datos en Firebase para este usuario.");
          }
        } catch (error) {
          console.error("Error cargando puntos desde Firebase:", error);
        }
      }
    };

    cargarPuntosDesdeFirebase();
  }, [user?.id]);

  // Filtrar retos disponibles según los puntos del usuario
  const retosDisponibles = retos.filter((reto) => {
    const puntosNecesarios = reto.puntos || 0;
    return puntosUsuario + 10 >= puntosNecesarios;
  });

  // Filtrar retos por lenguaje y dificultad
  const retosFiltrados = retosDisponibles.filter((reto) => {
    const cumpleLenguaje =
      !lenguajeSeleccionado || reto.lenguajes.includes(lenguajeSeleccionado);
    const cumpleDificultad =
      !dificultadSeleccionada || reto.dificultad === dificultadSeleccionada;
    return cumpleLenguaje && cumpleDificultad;
  });

  useEffect(() => {
    const cargarRetos = async () => {
      try {
        const response = await fetch("/api/retos");
        if (!response.ok) throw new Error("Error al cargar los retos");
        const data = await response.json();
        setRetos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarRetos();
  }, []);

  const seleccionarReto = (reto: Reto) => {
    const retoString = encodeURIComponent(JSON.stringify(reto)); // Codificamos el objeto
    router.push(`/retos/${reto.id}?reto=${retoString}`);
  };

  return (
    <main className="container mx-auto p-8 bg-gray-900 text-white">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #ffe29f 0%, #ffa99f 100%)",
            }}
          >
            <span className="text-5xl">🏆</span>
          </div>
          <h1
            className="text-4xl font-bold text-center mb-2"
            style={{ color: "#FFB800" }}
          >
            Retos de Programación
          </h1>
          <p className="text-center text-gray-400 text-lg">
            El poder de tu sabiduría desbloqueará nuevos retos
          </p>
        </div>

        {/* Selección de Lenguaje */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Elige un lenguaje de programación
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            {LENGUAJES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLenguajeSeleccionado(lang.id)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg shadow transition-all border-2 ${
                  lenguajeSeleccionado === lang.id
                    ? "border-yellow-400 bg-gray-800"
                    : "border-transparent bg-gray-700 hover:bg-gray-800"
                }`}
                style={{ minWidth: 120 }}
              >
                <img
                  src={lang.icon}
                  alt={lang.nombre}
                  className="w-24 h-24 mb-2"
                />
                <span
                  className="font-semibold text-lg"
                  style={{ color: lang.color }}
                >
                  {lang.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Filtrar retos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Dificultad
              </label>
              <select
                value={dificultadSeleccionada}
                onChange={(e) => setDificultadSeleccionada(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              >
                <option value="">Todas las dificultades</option>
                <option value="Fácil">Fácil</option>
                <option value="Medio">Medio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Lenguaje
              </label>
              <select
                value={lenguajeSeleccionado}
                onChange={(e) => setLenguajeSeleccionado(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              >
                <option value="">Todos los lenguajes</option>
                {LENGUAJES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setLenguajeSeleccionado("");
                  setDificultadSeleccionada("");
                }}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Retos */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Retos disponibles
          </h2>

          {cargando ? (
            <p className="text-center text-gray-400">Cargando retos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {retosFiltrados.length > 0 ? (
                retosFiltrados.map((reto) => (
                  <Link
                    key={reto.id}
                    href={`/retos/${reto.id}`}
                    className="block"
                  >
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 h-full flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">
                            {reto.titulo}
                          </h3>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                reto.dificultad === "Fácil"
                                  ? "#4CAF50"
                                  : reto.dificultad === "Medio"
                                  ? "#FFC107"
                                  : "#F44336",
                              color:
                                reto.dificultad === "Medio" ? "#000" : "#fff",
                            }}
                          >
                            {reto.dificultad}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{reto.descripcion}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {reto.lenguajes.map((langId) => {
                            const lang = LENGUAJES.find((l) => l.id === langId);
                            return lang ? (
                              <span
                                key={lang.id}
                                className="px-2 py-1 rounded text-xs"
                                style={{
                                  backgroundColor: `transparent`,
                                  color: lang.color,
                                  border: `1px solid ${lang.color}`,
                                }}
                              >
                                {lang.nombre}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 font-semibold">
                            {reto.puntos} puntos
                          </span>
                          <button
                            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              seleccionarReto(reto);
                            }}
                          >
                            Empezar reto
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-400 text-lg">
                    No hay retos disponibles que coincidan con tus filtros.
                  </p>
                  <button
                    onClick={() => {
                      setLenguajeSeleccionado("");
                      setDificultadSeleccionada("");
                    }}
                    className="mt-4 text-blue-400 hover:text-blue-300"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
