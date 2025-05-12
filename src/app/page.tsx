import { SignInButton } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Barra superior con botón de inicio de sesión */}
      <div className="flex justify-end p-4">
        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
          <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-400 transition duration-300 ease-in-out">
            Iniciar sesión
          </button>

        </SignInButton>
      </div>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">CodePadawan</h1>
        <p className="text-xl md:text-2xl text-center text-blue-300 mb-8">Domina el arte de la programación</p>

        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">¿Quiénes Somos?</h2>
              <p className="text-gray-300 mb-4">
                Somos una comunidad dedicada a formar la próxima generación de desarrolladores.
                En CodePadawan, creemos que el aprendizaje práctico es la clave para dominar
                la programación.
              </p>
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                Explorar plataforma →
              </Link>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">¿Qué Hacemos?</h2>
              <p className="text-gray-300 mb-4">
                Ofrecemos retos de programación en múltiples lenguajes, desde principiante hasta avanzado.
                Nuestra plataforma te permite practicar, competir y mejorar tus habilidades en un entorno
                interactivo y colaborativo.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-600 rounded text-sm">JavaScript</span>
                <span className="px-2 py-1 bg-green-600 rounded text-sm">Python</span>
                <span className="px-2 py-1 bg-orange-600 rounded text-sm">Java</span>
                <span className="px-2 py-1 bg-purple-600 rounded text-sm">Y más</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">Únete a nosotros</h3>
          <p className="text-center text-gray-300 mb-6">
            Inicia sesión para acceder a todos los retos y comenzar tu camino hacia la maestría en programación.
          </p>

          <p className="text-center mt-4 text-gray-400 text-sm">
            ¿Aún no tienes cuenta?{" "}
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <button className="text-blue-400 hover:underline font-semibold">
                Regístrate aquí
              </button>
            </SignUpButton>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Retos de programación</h3>
            <p className="text-gray-300">
              Resuelve retos de diferentes niveles de dificultad y gana puntos para subir en el ranking.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Ranking global</h3>
            <p className="text-gray-300">
              Compite con otros desarrolladores y demuestra tus habilidades en nuestra tabla de clasificación.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">Editor de código integrado</h3>
            <p className="text-gray-300">
              Escribe y ejecuta tu código directamente en nuestra plataforma con soporte para múltiples lenguajes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
