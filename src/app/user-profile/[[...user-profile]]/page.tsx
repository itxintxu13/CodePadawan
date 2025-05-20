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
import Logros from "@/app/components/Logros";
import Obras from "@/app/components/Obras";

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
        const userRef = ref(db, `users/${user.id}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const logrosData = userData.logros || {};

          // 👉 combinamos retos_completados y puntos al objeto logros
          logrosData.retos_completados = userData.retos_completados || 0;
          logrosData.puntos = userData.puntos || 0;

          console.log("✅ Datos combinados del usuario:", logrosData);
          setLogrosUsuario(logrosData);
        } else {
          setLogrosUsuario({ retos_completados: 0, puntos: 0 });
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
            <div className="flex items-center mb-10 mt-6">
              <img
                src="/icons/sidebar-about.svg"
                alt="Acerca de nosotros"
                className="w-12 h-12 mr-8"
              />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
                  Acerca de CodePadawan
                </h1>
                <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                  Una plataforma para aprender a programar de manera interactiva y divertida
                </p>
              </div>
            </div>


            {/* Equipo */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-12 mt-20">
              {/* Itxine */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 hover:shadow-[0px_0px_15px_3px_rgba(255,255,255,0.5)] transition-all duration-300 relative overflow-hidden"
                style={{
                  backgroundImage: `url('/stars.webp')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
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
                  CodePadawan, donde los padawans del código entrenan, enfrentándose a retos interactivos para dominar la Fuerza de la programación.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/itxintxu13" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub
                      size={30}
                      className="hover:text-purple-500 hover:shadow-[0_0_15px_3px_rgba(126,34,206,0.7)] hover:rounded-full hover:scale-110 transition-all duration-300"
                    />
                  </a>
                </div>
              </div>

              {/* Jonan */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 hover:shadow-[0px_0px_15px_3px_rgba(255,255,255,0.5)] transition-all duration-300 relative overflow-hidden"
                style={{
                  backgroundImage: `url('/stars.webp')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
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
                    <FaGithub
                      size={30}
                      className="hover:text-blue-500 hover:shadow-[0_0_15px_3px_rgba(59,130,245,0.7)] hover:rounded-full hover:scale-110 transition-all duration-300"
                    />                  </a>
                </div>
              </div>

              {/* Ale */}
              <div className="md:col-span-2 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 hover:shadow-[0px_0px_15px_3px_rgba(255,255,255,0.5)] transition-all duration-300 text-left max-w-md mx-auto relative overflow-hidden"
                style={{
                  backgroundImage: `url('/stars.webp')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
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
                  No necesitas un destornillador sónico para aprender a programar, solo curiosidad y CodePadawan... aunque la próxima vez debería pedirle ayuda a un Jedi para que me guíe por este universo de código.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/ARP-10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub
                      size={30}
                      className="hover:text-red-500 hover:shadow-[0_0_15px_3px_rgba(255,0,0,0.7)] hover:rounded-full hover:scale-110 transition-all duration-300"
                    />            </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }


  if (tab === "logros") {
    // Verificar si el usuario es Padawan
    const userRole = user?.publicMetadata?.rol;
    if (userRole !== 'padawan') {
      return (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <p className="text-xl text-red-400">Esta sección está disponible solo para Padawans.</p>
          </main>
        </div>
      );
    }

    // Mientras carga logros muestra spinner
    if (loadingLogros) {
      return (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <p className="text-xl text-blue-400">Cargando logros...</p>
          </main>
        </div>
      );
    }

    const logros = [
      {
        titulo: "Hola Mundo Java Completado",
        descripcion: "Has completado el reto de Hola Mundo en Java",
        desbloqueado: logrosUsuario?.hola_mundo_java?.completado === true,
        colorClase: "border-red-500",
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
        colorClase: "border-blue-500",
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
        desbloqueado: logrosUsuario?.hola_mundo_javascript?.completado === true,
        colorClase: "border-yellow-400",
        icono:
          logrosUsuario?.hola_mundo_javascript?.completado === true ? (
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "Hola Mundo HTML Completado",
        descripcion: "Has completado el reto de Hola Mundo en HTML",
        desbloqueado: logrosUsuario?.hola_mundo_html?.completado === true,
        colorClase: "border-orange-500",
        icono:
          logrosUsuario?.hola_mundo_html?.completado === true ? (
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "El Despegue del Jedi",
        descripcion: "Has completado al menos 5 retos en tu camino hacia la Fuerza",
        desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 5,
        colorClase: "border-blue-500 bg-blue-900", // Azul como los Jedi
        icono:
          (logrosUsuario?.retos_completados ?? 0) >= 5 ? (
            <span className="text-3xl">🛸</span> // TIE Fighter o X-Wing
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "La Amenaza Fantasma",
        descripcion: "Has completado al menos 10 retos, demostrando tu habilidad con la Fuerza",
        desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 10,
        colorClase: "border-green-500 bg-green-900", // Verde como los Jedi
        icono:
          (logrosUsuario?.retos_completados ?? 0) >= 10 ? (
            <span className="text-3xl">⚔️</span> // Lightsaber (Sable de Luz)
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "El Imperio Contraataca",
        descripcion: "Has completado al menos 15 retos, ahora eres una amenaza mayor para los Sith",
        desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 15,
        colorClase: "border-red-500 bg-red-900", // Rojo como los Sith
        icono:
          (logrosUsuario?.retos_completados ?? 0) >= 15 ? (
            <span className="text-3xl">💫</span> // Death Star (Estrella de la Muerte)
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "El Regreso del Jedi",
        descripcion: "Has completado al menos 20 retos, ahora eres un maestro Jedi",
        desbloqueado: (logrosUsuario?.retos_completados ?? 0) >= 20,
        colorClase: "border-yellow-500 bg-yellow-900", // Amarillo como el Halcón Milenario
        icono:
          (logrosUsuario?.retos_completados ?? 0) >= 20 ? (
            <span className="text-3xl">🌌</span> // Millennium Falcon (Halcón Milenario)
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },
      {
        titulo: "Java Dominado",
        descripcion: "Has completado todos los retos de Java",
        desbloqueado: logrosUsuario?.java_dominado?.completado === true,
        colorClase: "border-red-500",
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
        colorClase: "border-yellow-400",
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
        colorClase: "border-blue-500",
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
        colorClase: "border-orange-500",
        icono:
          logrosUsuario?.html_dominado?.completado === true ? (
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
          ) : (
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
          ),
      },

    ];

    return (
      <div className="container flex min-h-screen">
        <Sidebar />
        {/* Contenido principal */}
<main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white animate-fade-in">          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center drop-shadow-lg animate-slide-down font-starwars">
            ⭐ Registro de Logros del Padawan
          </h1>
          <p className="text-lg text-indigo-200 mt-4 text-center mb-2 italic animate-fade-in-delay">
            “El camino del código, joven aprendiz, arduo es… pero recompensas
            trae.” – Maestro Yoda
          </p>
          <div className="mt-10 max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {logros.map((logro, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300
            ${logro.desbloqueado
                      ? `${logro.colorClase || "bg-gray-800 border-green-500"
                      } shadow-lg`
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Obras/>
      {/* <Logros logrosUsuario={logrosUsuario} /> */}
    </div>
  );
}