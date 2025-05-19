
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
        className="cursor-pointer w-80 rounded-xl p-6 bg-gradient-to-br from-purple-700 to-indigo-800 hover:scale-105 transition shadow-xl"
        onClick={() => handleRoleSelect("padawan")}
      >
        <h2 className="text-2xl font-bold mb-2">👶 Soy Padawan</h2>
        <p>Empieza tu camino en la Fuerza. Aprende desde cero.</p>
      </div>
      <div
        className="cursor-pointer w-80 rounded-xl p-6 bg-gradient-to-br from-blue-700 to-teal-700 hover:scale-105 transition shadow-xl"
        onClick={() => handleRoleSelect("jedi")}
      >
        <h2 className="text-2xl font-bold mb-2">🧙‍♂️ Soy Jedi</h2>
        <p>Domina la programación como un verdadero maestro Jedi.</p>
      </div>
    </div>
  );
}
