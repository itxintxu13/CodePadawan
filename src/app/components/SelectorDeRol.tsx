
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
    {/* Tarjeta Padawan */}
    <div
      className="cursor-pointer w-[450px] rounded-xl p-8 hover:scale-105 transition relative overflow-hidden border-2 border-[#40b86e] hover:shadow-[0_0_35px_rgba(64,184,110,0.8)]"
      onClick={() => handleRoleSelect("padawan")}
      style={{
        backgroundImage: `url('/stars.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-center gap-1 mb-4">
        <img src="/padawan-symbol.svg" alt="Padawan" className="w-12 h-12" />
        <h2 className="text-2xl font-bold text-amber-400 flex whitespace-nowrap">
          Soy <span className="ml-2">Padawan</span>
        </h2>
      </div>
      <p className="text-white text-lg">
        Siempre en movimiento está el futuro. Aprende desde cero.
      </p>
    </div>

    {/* Tarjeta Jedi */}
    <div
      className="cursor-pointer w-[450px] rounded-xl p-8 hover:scale-105 transition relative overflow-hidden border-2 border-[#3b82f6] hover:shadow-[0_0_35px_rgba(59,130,246,0.8)]"
      onClick={() => handleRoleSelect("jedi")}
      style={{
        backgroundImage: `url('/stars.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <img src="/jedi-symbol.svg" alt="Jedi" className="w-12 h-12" />
        <h2 className="text-2xl font-bold text-yellow-400">Soy Jedi</h2>
      </div>
      <p className="text-white text-lg">
        Enseña programación como un verdadero maestro Jedi.
      </p>
    </div>
  </div>
);
}