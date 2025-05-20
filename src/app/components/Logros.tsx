"use client";
import { CheckCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";

type LogrosProps = {
  logrosUsuario: any;
};

export default function Logros({ logrosUsuario }: LogrosProps) {
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
      descripcion:
        "Has completado al menos 5 retos en tu camino hacia la Fuerza",
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
      descripcion:
        "Has completado al menos 10 retos, demostrando tu habilidad con la Fuerza",
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
      descripcion:
        "Has completado al menos 15 retos, ahora eres una amenaza mayor para los Sith",
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
      descripcion:
        "Has completado al menos 20 retos, ahora eres un maestro Jedi",
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
      <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center drop-shadow-lg animate-slide-down font-starwars">
            <img src="/icons/sidebar-ranking.svg" alt="Ranking" className="mr-2 inline-block h-14 w-14 align-middle" />
            Registro de Logros del Padawan
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
            ${
              logro.desbloqueado
                ? `${
                    logro.colorClase || "bg-gray-800 border-green-500"
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
