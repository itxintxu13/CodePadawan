"use client";
import { useState, useEffect } from "react";
import { UserProfile, useUser } from "@clerk/nextjs";
import Sidebar from "@/app/components/SideBar";
import Estadisticas from "@/app/components/Estadisticas";
import { useSearchParams } from "next/navigation";
import CodeEditor from "@/app/components/CodeEditor";
import { FaGithub } from "react-icons/fa";
import {
  CheckCircleIcon,
  LockClosedIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "@/lib/firebase/config"; 

export default function UserProfilePage() {
  const { isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  // Estado para logros cargados de Firebase
  const [logrosUsuario, setLogrosUsuario] = useState<any>(null);
  const [loadingLogros, setLoadingLogros] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const cargarLogrosUsuario = async () => {
      setLoadingLogros(true);
      try {
        const db = getDatabase(app);
        const logrosRef = ref(db, `users/${user.id}/logros`);
        const snapshot = await get(logrosRef);
        if (snapshot.exists()) {
          const logrosData = snapshot.val();

          // Contar logros completados (los que tienen propiedad completado === true)
          const retosCompletados = Object.values(logrosData).filter(
            (logro: any) => logro?.completado === true
          ).length;

          setLogrosUsuario({
            ...logrosData,
            retos_completados: retosCompletados,
          });
        } else {
          setLogrosUsuario({ retos_completados: 0 });
        }
      } catch (error) {
        console.error("Error al cargar logros:", error);
      } finally {
        setLoadingLogros(false);
      }
    };

    cargarLogrosUsuario();
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Cargando...</div>;
  }

   if (tab === 'playground') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-400">
              🛸 Bienvenido al Playground Jedi 🛸
            </h1>
            <p className="text-indigo-300 italic">
              "Hazlo o no lo hagas, pero no lo intentes" - Yoda
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <p className="text-green-400 text-lg font-semibold">
              💻 Usa la Fuerza... y codea padawan 💻
            </p>
          </div>

          <CodeEditor />

        </main>
      </div>
    );
  }

  if (tab === 'about') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
                🚀 Acerca de CodePadawan
              </h1>
              <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                Una plataforma para aprender a programar de manera interactiva y divertida
              </p>
            </div>

            {/* Equipo */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-12">
              {/* Itxine */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4 overflow-hidden">
                    <img
                      src="/itxine.jpg"
                      alt="Itxine"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Itxine</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  CodePadawan es el lugar ideal para aprender a programar de manera interactiva y emocionante.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/itxintxu13" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>


              {/* Jonan */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4 overflow-hidden">
                    <img
                      src="/jonan.jpg"
                      alt="Jonan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Jon Ander</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Que la Fuerza del código te guíe—explora, aprende y conquista los desafíos en CodePadawan.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/jrincon00" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>


              {/* Ale */}
              <div className="md:col-span-2 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300 text-center max-w-md mx-auto">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-900 flex items-center justify-center text-3xl mr-4 overflow-hidden">
                    <img
                      src="/ale.jpg"
                      alt="Alejandra"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Alejandra</h3>
                    <p className="text-indigo-300">Fundador & Desarrollador</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  No necesitas un destornillador sónico para aprender a programar, solo curiosidad y CodePadawan para viajar por el universo del desarrollo.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/ARP-10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Tecnologías */}
            {/* <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Tecnologías que usamos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Next.js', 'TypeScript', 'Clerk', 'React', 'Tailwind CSS'].map((tech) => (
                  <div key={tech} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-center hover:scale-105 transition-transform">
                    <span className="text-yellow-400">{tech}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </main>
      </div>
    );
  }


  if (tab === "logros") {
    // Mientras carga logros muestra spinner
    if (loadingLogros) {
      return (
        <div className="flex min-h-screen items-center justify-center text-yellow-400 text-xl">
          Cargando logros...
        </div>
      );
    }

    const logros = [
  {
    titulo: "Hola Mundo Java Completado",
    descripcion: "Has completado el reto de Hola Mundo en Java",
    desbloqueado: logrosUsuario?.hola_mundo_java?.completado === true,
    icono:
      logrosUsuario?.hola_mundo_java?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "Hola Mundo Python Completado",
    descripcion: "Has completado el reto de Hola Mundo en Python",
    desbloqueado: logrosUsuario?.hola_mundo_python?.completado === true,
    icono:
      logrosUsuario?.hola_mundo_python?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "Hola Mundo JS Completado",
    descripcion: "Has completado el reto de Hola Mundo en JavaScript",
    desbloqueado: logrosUsuario?.hola_mundo_js?.completado === true,
    icono:
      logrosUsuario?.hola_mundo_js?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "Hola Mundo HTML Completado",
    descripcion: "Has completado el reto de Hola Mundo en HTML",
    desbloqueado: logrosUsuario?.hola_mundo_html?.completado === true,
    icono:
      logrosUsuario?.hola_mundo_html?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "Java Dominado",
    descripcion: "Has completado todos los retos de Java",
    desbloqueado: logrosUsuario?.java_dominado?.completado === true,
    icono:
      logrosUsuario?.java_dominado?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "JS Dominado",
    descripcion: "Has completado todos los retos de JavaScript",
    desbloqueado: logrosUsuario?.js_dominado?.completado === true,
    icono:
      logrosUsuario?.js_dominado?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "Python Dominado",
    descripcion: "Has completado todos los retos de Python",
    desbloqueado: logrosUsuario?.python_dominado?.completado === true,
    icono:
      logrosUsuario?.python_dominado?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "HTML Dominado",
    descripcion: "Has completado todos los retos de HTML",
    desbloqueado: logrosUsuario?.html_dominado?.completado === true,
    icono:
      logrosUsuario?.html_dominado?.completado === true ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  
  {
    titulo: "5 Retos Completados",
    descripcion: "Has completado al menos 5 retos",
    desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 5,
    icono:
      (logrosUsuario?.retos_completados ?? 0) >= 5 ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "10 Retos Completados",
    descripcion: "Has completado al menos 10 retos",
    desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 10,
    icono:
      (logrosUsuario?.retos_completados ?? 0) >= 10 ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "15 Retos Completados",
    descripcion: "Has completado al menos 15 retos",
    desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 15,
    icono:
      (logrosUsuario?.retos_completados ?? 0) >= 15 ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
  {
    titulo: "20 Retos Completados",
    descripcion: "Has completado al menos 20 retos",
    desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 20,
    icono:
      (logrosUsuario?.retos_completados ?? 0) >= 20 ? (
        <CheckCircleIcon className="h-10 w-10 text-green-400" />
      ) : (
        <LockClosedIcon className="h-10 w-10 text-gray-400" />
      ),
  },
];

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center drop-shadow-lg animate-slide-down font-starwars">
            ⭐ Registro de Logros del Padawan
          </h1>
          <p className="text-lg text-indigo-200 mt-4 text-center mb-2 italic animate-fade-in-delay">
            “El camino del código, joven aprendiz, arduo es… pero recompensas
            trae.” – Maestro Yoda
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-10">
            {logros.map((logro, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-6 rounded-xl border ${
                  logro.desbloqueado
                    ? "bg-gray-800 border-green-500 shadow-lg"
                    : "bg-gray-700 border-gray-600 opacity-70"
                }`}
              >
                {logro.icono}
                <div>
                  <h3 className="text-xl font-semibold">{logro.titulo}</h3>
                  <p className="text-sm text-gray-300">{logro.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-slide-down">
            Mi Perfil
          </h1>
          <p className="text-lg text-indigo-200 mt-4 text-center mb-2 animate-fade-in-delay">
            Visualiza tu progreso y estadísticas
          </p>
        </div>

        {/* Tarjetas de resumen con animaciones y gráficos */}
        <div className="flex flex-wrap gap-4 justify-center w-full">
          <Estadisticas
            titulo="Puntos Totales"
            maximo={1000}
            label="Progreso"
            color="#facc15"
            link="/ranking"
            tipoDato="puntos"
          />

          <Estadisticas
            titulo="Retos Resueltos"
            maximo={10}
            label="Retos"
            color="#60a5fa"
            link="/retos"
            tipoDato="retos"
          />

          <Estadisticas
            titulo="Logros Desbloqueados"
            maximo={10}
            label="Logros"
            color="#22c55e"
            link="/user-profile"
            tipoDato="logros"
          />
        </div>

      </main>
    </div>
  );
}