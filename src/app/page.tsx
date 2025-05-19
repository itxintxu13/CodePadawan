
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
      <StarField /> 
      {/* Logo */}
      <div className="flex justify-center mt-8">
        <div
          className="bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-500 rounded-full p-2 shadow-2xl flex items-center justify-center border border-white/40 ring-2 ring-blue-400/40 ring-offset-2 ring-offset-gray-950"
          style={{ width: 150, height: 150, boxShadow: "0 6px 30px 0 #7c3aed55" }}
        >
          <img
            src="/logo.svg"
            alt="Logo CodePadawan"
            style={{
              width: 130,
              height: 130,
              display: "block",
              filter: "drop-shadow(0 6px 20px #7c3aedcc) brightness(1.18) contrast(1.12)",
            }}
            className="rounded-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">CodePadawan</h1>
        <p className="text-xl md:text-2xl text-center text-blue-300 mb-8">
          Domina el arte de la programación
        </p>

        {/* Selector de rol */}
        <div className="w-full max-w-2xl mt-12 mb-20 p-8 bg-gray-800 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Elige tu camino en la Fuerza</h2>
          <SelectorDeRol />
        </div>

        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">¿Quiénes Somos?</h2>
              <p className="text-gray-300 mb-4">
                Somos una comunidad dedicada a formar la próxima generación de desarrolladores.
                En CodePadawan, creemos que el aprendizaje práctico es la clave para dominar
                la programación.
              </p>
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




      </section>
    </div>
  );
}