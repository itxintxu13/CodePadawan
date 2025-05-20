"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ProgressChart from "./ProgressChart";
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

// Función para calcular logros según los retos completados
function calcularLogros(retosCompletados: number): number {
  let logros = 0;

  // Asignamos logros por cada múltiplo de 5 (5, 10, 15, 20, etc.)
  if (retosCompletados >= 5) logros++;
  if (retosCompletados >= 10) logros++;
  if (retosCompletados >= 15) logros++;
  if (retosCompletados >= 20) logros++;

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
              setValor(userData.puntos || 0); // Mostrar puntos
              break;
            case "retos":
              setValor(userData.retos_completados || 0); // Mostrar retos completados
              break;
            case "logros":
              // Obtener el número de logros completados de la rama 'logros' de Firebase
              const logrosCompletadosFirebase = userData.logros ? Object.values(userData.logros).filter((logro: any) => logro.completado === true).length : 0;
              
              // Calcular los logros por los retos completados
              const logrosPorRetos = calcularLogros(userData.retos_completados || 0);

              // Total de logros es la suma de los logros por retos y los logros completados en Firebase
              setValor(logrosPorRetos + logrosCompletadosFirebase);
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

  // Calcular el porcentaje basado en el número de puntos, retos o logros
  const calcularPorcentaje = (valor: number, maximo: number) => {
    if (maximo === 0) return 0; // Asegurarnos de que no dividimos por 0
    return (valor / maximo) * 100;
  };

  // Define los máximos según el tipo de dato
  let maximoReal = 0;
  if (tipoDato === "puntos") {
    maximoReal = 485; // Total de puntos posibles
  } else if (tipoDato === "retos") {
    maximoReal = 20; // Total de retos posibles
  } else if (tipoDato === "logros") {
    maximoReal = 12; // Total de logros posibles (solo como referencia, no se usa para logros)
  }

  return (
    <div className={`bg-gray-800 rounded-2xl p-8 shadow-2xl text-center transform hover:scale-105 transition-transform duration-300 animate-card-fade-in ${tamano}`}>
      <h2 className="text-xl font-bold mb-2" style={{ color }}>{titulo}</h2>
      {cargando ? (
        <p className="text-lg text-gray-400">Cargando...</p>
      ) : (
        <>
          <div className="flex justify-center mb-2">
            <ProgressChart value={valor} max={maximoReal} label={label} color={color} />
          </div>
          <p className="text-3xl font-extrabold drop-shadow" style={{ color }}>
            {valor}
          </p>
        </>
      )}
    </div>
  );
}
