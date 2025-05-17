"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressChart from "./ProgressChart";
import { obtenerUsuarios } from "../services/dataservices";
import { database } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

interface EstadisticasProps {
  titulo: string;
  maximo: number;
  label: string;
  color: string;
  link?: string;
  tipoDato: "puntos" | "retos" | "logros";
  tamano?: string;
}

const DEFAULT_LINK = "/dashboard";

function calcularLogros(retosResueltos: number): string[] {
  const logros = [];
  if (retosResueltos >= 1) logros.push("🌱 Principiante");
  if (retosResueltos >= 3) logros.push("🚀 Explorador");
  if (retosResueltos >= 5) logros.push("⭐ Experto");
  if (retosResueltos >= 10) logros.push("🏆 Maestro");
  return logros;
}

export default function Estadisticas({
  titulo,
  maximo,
  label,
  color,
  link,
  tipoDato,
  tamano = "w-80",
}: EstadisticasProps) {
  const { isLoaded, user } = useUser();
  const [valor, setValor] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!isLoaded || !user) {
        setCargando(false);
        return;
      }

      try {
        // Obtener datos directamente de Firebase usando el ID de Clerk
        const userRef = ref(database, `users/${user.id}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("📌 Datos del usuario de Firebase:", userData);

          switch (tipoDato) {
            case "puntos":
              setValor(userData.puntos || 0);
              break;
            case "retos":
              setValor(userData.retos_completados || 0);
              break;
            case "logros":
              const logros = calcularLogros(userData.retos_completados || 0);
              setValor(logros.length);
              break;
            default:
              console.warn("🚨 Tipo de dato desconocido:", tipoDato);
          }
        } else {
          console.warn("🚨 No se encontraron datos del usuario en Firebase");
          setValor(0);
        }
      } catch (error) {
        console.error("🚨 Error al cargar datos:", error);
        setValor(0);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [isLoaded, user, tipoDato]);

  return (
    <div className={`bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in ${tamano}`}>
      <h2 className="text-xl font-bold mb-2" style={{ color }}>{titulo}</h2>
      {cargando ? (
        <p className="text-lg text-gray-400">Cargando...</p>
      ) : (
        <>
          <div className="flex justify-center mb-2">
            <ProgressChart value={valor} max={maximo} label={label} color={color} />
          </div>
          <p className="text-3xl font-extrabold drop-shadow" style={{ color }}>
            {valor}
          </p>
          {tipoDato === "logros" && (
            <p className="text-sm text-gray-400 mt-1">
              Último logro: {calcularLogros(valor).slice(-1)[0] || "Ninguno aún"}
            </p>
          )}
          {link && (
        <Link href={link || DEFAULT_LINK} className="text-blue-400 text-sm hover:underline block mt-2">
          Ver detalles
        </Link>
      )}
        </>
      )}
    </div>
  );
}
