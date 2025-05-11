"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [puntos, setPuntos] = useState(0);
  const [retosResueltos, setRetosResueltos] = useState(0);
  const [logros, setLogros] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      // Obtener datos del usuario desde Clerk
      const puntosUsuario = (user.publicMetadata.puntos as number) || 0;
      const retosResueltosUsuario = ((user.publicMetadata.retosResueltos as number[]) || []).length;
      
      // Calcular logros
      let logrosDesbloqueados = 0;
      if (retosResueltosUsuario >= 1) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 3) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 5) logrosDesbloqueados++;
      if (retosResueltosUsuario >= 10) logrosDesbloqueados++;
      
      setPuntos(puntosUsuario);
      setRetosResueltos(retosResueltosUsuario);
      setLogros(logrosDesbloqueados);
    }
  }, [isLoaded, user]);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center">Bienvenido al Dashboard 🚀</h1>
      <p className="text-lg text-gray-600 mt-4 text-center mb-8">
        Aquí puedes gestionar tu cuenta y explorar contenido exclusivo.
      </p>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Puntos Totales</h2>
          <p className="text-3xl font-bold text-yellow-400">{puntos}</p>
          <Link href="/ranking" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver ranking
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Retos Resueltos</h2>
          <p className="text-3xl font-bold text-blue-400">{retosResueltos}</p>
          <Link href="/retos" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver retos
          </Link>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Logros Desbloqueados</h2>
          <p className="text-3xl font-bold text-green-400">{logros}</p>
          <Link href="/user-profile" className="text-blue-400 text-sm hover:underline block mt-2">
            Ver perfil
          </Link>
        </div>
      </div>
      
      <div className="mb-8 text-center">
        <Link 
          href="/retos" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
        >
          Explorar Retos de Programación
        </Link>
      </div>
      
      
      
      
    </main>
  );
}