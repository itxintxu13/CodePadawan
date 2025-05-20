
"use client";

import { useRouter } from "next/navigation";

export default function SelectorDeRol() {
  const router = useRouter();

  const handleRoleSelect = (role: "padawan" | "jedi") => {
    localStorage.setItem("rolElegido", role);
    router.push("/sign-in/");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center mt-10">
      <div
        className="cursor-pointer w-[450px] rounded-xl p-8 hover:scale-105 transition relative overflow-hidden border-2 border-yellow-400 shadow-[0_0_35px_rgba(255,215,0,0.8)]" 
        onClick={() => handleRoleSelect("padawan")}
        style={{
          backgroundImage: `url('/stars.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h2 className="text-2xl font-bold mb-2 text-yellow-400 flex items-center gap-1 whitespace-nowrap" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 1), 0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8)' }}>
          <img src="/padawan-symbol.svg" alt="Padawan" className="w-10 h-10" />
          Soy Padawan
        </h2>
        <p className="text-white text-lg">Empieza tu camino en la Fuerza. Aprende desde cero.</p>
      </div>
      <div
        className="cursor-pointer w-[450px] rounded-xl p-8 hover:scale-105 transition relative overflow-hidden border-2 border-yellow-400 shadow-[0_0_35px_rgba(255,215,0,0.8)]"
        onClick={() => handleRoleSelect("jedi")}
        style={{
          backgroundImage: `url('/stars.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h2 className="text-2xl font-bold mb-2 text-yellow-400 flex items-center gap-1 whitespace-nowrap" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 1), 0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8)' }}>
          <img src="/jedi-symbol.svg" alt="Jedi" className="w-10 h-10" />
          Soy Jedi
        </h2>
        <p className="text-white text-lg">Domina la programación como un verdadero maestro Jedi.</p>
      </div>
    </div>
  );
}
