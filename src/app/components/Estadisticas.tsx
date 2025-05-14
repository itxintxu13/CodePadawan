"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressChart from "./ProgressChart";
import { obtenerUsuarios } from "../services/dataservices";

interface EstadisticasProps {
  titulo: string;
  maximo: number;
  label: string;
  color: string;
  link: string;
  tipoDato: "puntos" | "retos" | "logros";
  tamano?: string;
}

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
        const usuarios = await obtenerUsuarios();
        console.log("📌 Usuarios obtenidos:", usuarios);

        if (!usuarios || usuarios.length === 0) {
          console.warn("🚨 No se encontraron usuarios.");
          setCargando(false);
          return;
        }

        const datosUsuario = usuarios.find((u) => u.id === user.id);
        console.log("📌 Datos del usuario:", datosUsuario);

        if (datosUsuario) {
          switch (tipoDato) {
            case "puntos":
              setValor(datosUsuario.puntos || 0);
              break;
            case "retos":
              setValor(datosUsuario.retosResueltos || 0);
              break;
            case "logros":
              setValor(calcularLogros(datosUsuario.retosResueltos || 0).length);
              break;
            default:
              console.warn("🚨 Tipo de dato desconocido:", tipoDato);
          }
        }
      } catch (error) {
        console.error("🚨 Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [isLoaded, user, tipoDato]);

  return (
<div className={`bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in ${tamano}`}>      <h2 className="text-xl font-bold mb-2" style={{ color }}>{titulo}</h2>
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
          <Link href={link} className="text-blue-400 text-sm hover:underline block mt-2">
            Ver más
          </Link>
        </>
      )}
    </div>
  );
}