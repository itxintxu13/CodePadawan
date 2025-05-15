"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function RolUpdater() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const rol = localStorage.getItem("rolElegido");

    const guardarRol = async () => {
      if (isLoaded && user && rol) {
        try {
          const response = await fetch('/api/updateRol', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              rol: rol
            }),
          });

          if (!response.ok) throw new Error('Error al actualizar rol');
          
          localStorage.removeItem("rolElegido");
          await user.reload();
          router.push("/dashboard");
        } catch (error) {
          console.error("❌ Error al guardar rol en Clerk:", error);
          localStorage.setItem("rolElegido", rol);
        }
      }
    };

    guardarRol();
  }, [user, isLoaded]);

  return null;
}




