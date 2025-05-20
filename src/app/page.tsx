
"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SelectorDeRol from "./components/SelectorDeRol";
import StarField from "./components/StarField";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === "padawan") {
        router.push("/dashboard/padawan");
      } else if (role === "jedi") {
        router.push("/dashboard/jedi");
      }
    }
  }, [isSignedIn, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative mt-10">
      <StarField /> 
      {/* Logo */}
      <div className="flex justify-center mt-8">
  <div
    className="bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-500 rounded-full p-2 shadow-2xl flex items-center justify-center border border-white/40 ring-2 ring-blue-400/40 ring-offset-2 ring-offset-gray-950"
    style={{
      width: 180, // aumentado
      height: 180, // aumentado
      boxShadow: "0 8px 40px 0 #7c3aed55",
    }}
  >
    <img
      src="/logo.svg"
      alt="Logo CodePadawan"
      style={{
        width: 160, // aumentado
        height: 160, // aumentado
        display: "block",
        filter:
          "drop-shadow(0 8px 24px #7c3aedcc) brightness(1.18) contrast(1.12)",
      }}
      className="rounded-full transition-transform duration-300 hover:scale-105"
    />
  </div>
</div>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 flex flex-col items-center">
        <p className="text-xl md:text-2xl text-center text-blue-300 mb-8">
          Domina el arte de la programación
        </p>

        {/* Selector de rol */}
        <div className="w-full max-w-2xl mt-12 mb-20 p-8 bg-gray-800 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 1), 0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8)' }}>Elige tu camino en la Fuerza</h2>
          <SelectorDeRol />
        </div>

        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">¿Quiénes Somos?</h2>
              <p className="text-gray-300 mb-4">
              En CodePadawan somos el motor que impulsa a los talentos del mañana hacia la excelencia con cada proyecto real.
Objetivo en CodePadawan es forjar a la próxima generación con proyectos reales y retos prácticos en un espacio colaborativo.
¡Visita nuestro blog para resolver dudas y profundizar en cada reto.
Porque creemos que la mejor forma de dominar la programación es ¡picando código desde el primer día!
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">¿Qué Hacemos?</h2>
              <p className="text-gray-300 mb-4">
              En CodePadawan ofrecemos retos de programación en múltiples lenguajes, desde nivel principiante hasta avanzado.
Practica tus habilidades en un entorno interactivo y colaborativo, diseñado para impulsar tu aprendizaje con cada reto.
Compite contra otros Padawan y mejora tu destreza con cada desafío.
A medida que subes de nivel, desbloquea retos más apasionantes y lleva tu dominio del código al siguiente escalón.
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
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img src="/icons/starwars-challenge.svg" alt="Retos de programación" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2 text-center">Retos de programación</h3>
              <p className="text-gray-300 text-center">
                Resuelve retos de diferentes niveles de dificultad y gana puntos para subir en el ranking.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img src="/icons/ranking-global.svg" alt="Ranking global" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2 text-center">Ranking global</h3>
              <p className="text-gray-300 text-center">
                Compite con otros desarrolladores y demuestra tus habilidades en nuestra tabla de clasificación.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img src="/icons/starwars-editor.svg" alt="Editor de código integrado" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2 text-center">Editor de código integrado</h3>
              <p className="text-gray-300 text-center">
                Escribe y ejecuta tu código directamente en nuestra plataforma con soporte para múltiples lenguajes.
              </p>
            </div>
          </div>
        </section>




      </section>
    </div>
  );
}