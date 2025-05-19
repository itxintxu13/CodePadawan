"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RolUpdater() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const rol = localStorage.getItem("rolElegido");
    console.log("🧠 rolElegido en localStorage:", rol);

    const guardarRol = async () => {
      if (!isLoaded || !user || !rol) return;

      console.log("🧠 user.id:", user.id);

      try {
        const response = await fetch("/api/updateRol", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            rol: rol.toLowerCase(),
          }),
        });

        const result = await response.json();
        console.log("📨 Respuesta de /api/updateRol:", result);

        if (!response.ok) throw new Error("Error al actualizar rol");

        const target = `/dashboard/${rol.toLowerCase()}`;
        console.log("➡️ Redirigiendo a:", target);
        router.push(target);
        localStorage.removeItem("rolElegido");
      } catch (error) {
        console.error("❌ Error guardando el rol en Clerk:", error);
      }
    };

    guardarRol();
  }, [user, isLoaded]);

  return null;
}





