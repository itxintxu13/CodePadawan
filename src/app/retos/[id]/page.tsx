"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html"; // Added HTML support
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import CodeEditorJava from "../../components/CodeEditorJava";
import CodeEditorJavaScript from "../../components/CodeEditorJavaScript";
import CodeEditorPython from "../../components/CodeEditorPython";
import CodeEditorHtml from "../../components/CodeEditorHtml";
import confetti from "canvas-confetti";
import { app, database } from "@/lib/firebase/config";
import { ref, get, update } from "firebase/database";

const lanzarConfeti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  puntos: number;
  lenguajes: string[];
  plantilla: { [key: string]: string };
  solucion: { [key: string]: string };
  requisitos?: { [key: string]: string[] };
  tests: { [key: string]: string };
  logro_completado?: string;
  validacion?: string;
}

const registrarLogro = async (userId: string, logroId: string) => {
  try {
    const logroRef = ref(database, `users/${userId}/logros/${logroId}`);
    await update(logroRef, { completado: true });
    console.log(`Logro registrado: ${logroId}`);
  } catch (error) {
    console.error("Error registrando logro en Firebase:", error);
    throw error;
  }
};

export default function RetoPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [reto, setReto] = useState<Reto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [lenguaje, setLenguaje] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [accesoPermitido, setAccesoPermitido] = useState(true);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);
  const editorRef = useRef<EditorView | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cargarPuntosDesdeFirebase = async () => {
      if (!user?.id) return;
      try {
        const userRef = ref(database, `users/${user.id}`);
        const snapshot = await get(userRef);
        const datos = snapshot.exists() ? snapshot.val() : {};
        const puntosFirebase = datos.puntos || 0;
        setPuntosUsuario(puntosFirebase);
        // Check access based on points
        if (reto && puntosFirebase < reto.puntos) {
          setAccesoPermitido(false);
        }
      } catch (error) {
        console.error("Error cargando puntos desde Firebase:", error);
      }
    };
    cargarPuntosDesdeFirebase();
  }, [user?.id, reto]);

  useEffect(() => {
    if (!params?.id) {
      console.error("ID de reto no encontrado");
      router.push("/retos");
      return;
    }

    const cargarReto = async () => {
      setCargando(true);
      try {
        const response = await fetch(`/api/retos`);
        if (!response.ok) throw new Error("Error al cargar los retos");
        const retos = await response.json();
        const retoActual = retos.find(
          (r: Reto) => r.id.toString() === String(params.id)
        );
        if (retoActual) {
          setReto(retoActual);
          const primerLenguaje = retoActual.lenguajes[0] || "javascript";
          setLenguaje(primerLenguaje);
          setCodigo(retoActual.plantilla[primerLenguaje] || "");
        } else {
          console.warn("Reto no encontrado");
          router.push("/retos");
        }
      } catch (error) {
        console.error("Error al cargar retos:", error);
        router.push("/retos");
      } finally {
        setCargando(false);
      }
    };
    cargarReto();
  }, [params?.id, router]);

  useEffect(() => {
    if (!reto || !lenguaje || !editorContainerRef.current) return;

    // Clean up previous editor
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    const languageExtension = {
      javascript: javascript(),
      python: python(),
      java: java(),
      html: html(),
    }[lenguaje] || javascript(); // Default to JS if language is unsupported

    const state = EditorState.create({
      doc: reto.plantilla[lenguaje] || "",
      extensions: [
        basicSetup,
        languageExtension,
        oneDark,
        autocompletion(),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCodigo(update.state.doc.toString());
          }
        }),
      ],
    });

    editorRef.current = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [lenguaje, reto]); // Removed `codigo` from dependencies

  const actualizarPuntosRealtime = async (userId: string, puntosNuevos: number) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      const datosUsuario = snapshot.exists() ? snapshot.val() : {};
      const puntosActuales = datosUsuario.puntos || 0;
      const retosActuales = datosUsuario.retos_completados || 0;

      await update(userRef, {
        puntos: puntosActuales + puntosNuevos,
        retos_completados: retosActuales + 1,
      });
      setPuntosUsuario(puntosActuales + puntosNuevos);
    } catch (error) {
      console.error("Error actualizando en Realtime Database:", error);
      throw error;
    }
  };

  const entregarSolucion = async () => {
  if (!codigo || !reto || !user || !lenguaje) {
    setResultado({
      success: false,
      message: "Falta información necesaria para entregar la solución",
    });
    return;
  }

  // Validate requirements
  if (reto.requisitos?.[lenguaje]) {
    const requisitos = reto.requisitos[lenguaje];
    let cumpleRequisitos = true;
    let mensajeError = "";

    for (const requisito of requisitos) {
      try {
        // Normalize the requirement the same way as the user code
        const requisitoNormalizado = requisito
          .toLowerCase()
          .replace(/'/g, '"')
          .replace(/\s+/g, "")
          .normalize("NFC");

        // Escape all special regex characters in the normalized requirement
        const patron = new RegExp(requisitoNormalizado.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        
        // Normalize user code
        const codigoLimpio = codigo
          .toLowerCase()
          .replace(/'/g, '"')
          .replace(/\s+/g, "")
          .normalize("NFC");

        console.log("Validating requirement:", requisitoNormalizado);
        console.log("Normalized user code:", codigoLimpio);
        console.log("Regex pattern:", patron.source);

        if (!patron.test(codigoLimpio)) {
          cumpleRequisitos = false;
          mensajeError += `Falta el requisito: ${requisito}\n`;
        }
      } catch (error) {
        console.error(`Error validating requirement: ${requisito}`, error);
        cumpleRequisitos = false;
        mensajeError += `Requisito inválido: ${requisito}\n`;
      }
    }

    if (!cumpleRequisitos) {
      setResultado({
        success: false,
        message: `La solución no cumple con los requisitos:\n${mensajeError}`,
      });
      return;
    }
  } else if (reto.solucion[lenguaje]) {
    // Fallback validation if no requirements are defined
    const solucionCorrecta = reto.solucion[lenguaje]
      .toLowerCase()
      .replace(/'/g, '"')
      .replace(/\s+/g, "")
      .normalize("NFC");
    const codigoUsuario = codigo
      .toLowerCase()
      .replace(/'/g, '"')
      .replace(/\s+/g, "")
      .normalize("NFC");

    if (!codigoUsuario.includes(solucionCorrecta)) {
      setResultado({
        success: false,
        message: "La solución no es correcta. Intenta nuevamente.",
      });
      return;
    }
  } else {
    setResultado({
      success: false,
      message: "No hay solución ni requisitos definidos para este lenguaje.",
    });
    return;
  }

  setEnviando(true);
  try {
    const response = await fetch("/api/retos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        retoId: reto.id,
        codigo,
        lenguaje,
        puntos: reto.puntos,
      }),
    });

    if (!response.ok) throw new Error("Error al entregarMgmt la solución");

    setResultado({
      success: true,
      message: `🎉 ¡Solución correcta! Has ganado ${reto.puntos} puntos! 🎉`,
    });
    lanzarConfeti();
    await actualizarPuntosRealtime(user.id, reto.puntos);

    if (reto.logro_completado) {
      const logroId = reto.logro_completado.toLowerCase().replace(/\s+/g, "_");
      await registrarLogro(user.id, logroId);
    }
  } catch (error) {
    console.error("Error al entregar solución:", error);
    setResultado({
      success: false,
      message: "Error al entregar la solución. Intenta de nuevo.",
    });
  } finally {
    setEnviando(false);
  }
};

  const cambiarLenguaje = (nuevoLenguaje: string) => {
    if (reto?.lenguajes.includes(nuevoLenguaje)) {
      setLenguaje(nuevoLenguaje);
      setCodigo(reto.plantilla[nuevoLenguaje] || "");
      setOutput("");
      setResultado(null);
      setMostrarSolucion(false);
    }
  };

  const verSolucion = () => {
    if (reto?.solucion[lenguaje]) {
      setMostrarSolucion(!mostrarSolucion);
    } else {
      setResultado({
        success: false,
        message: "Solución no disponible para este lenguaje.",
      });
    }
  };

  if (cargando) {
    return <div className="container mx-auto p-8 text-center">Cargando reto...</div>;
  }

  if (!accesoPermitido) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso restringido</h1>
          <p className="mb-4">No tienes suficientes puntos para acceder a este reto.</p>
          <p className="mb-6">
            Necesitas al menos <span className="font-bold">{reto?.puntos || 0} puntos</span>.
            Actualmente tienes: <span className="font-bold">{puntosUsuario} puntos</span>.
          </p>
          <button
            onClick={() => router.push("/retos")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Volver a los retos disponibles
          </button>
        </div>
      </div>
    );
  }

  if (!reto) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Reto no encontrado</h1>
        <button
          onClick={() => router.push("/retos")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Volver a la lista de retos
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8 bg-gray-900 text-white">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => router.push("/retos")}
            className="text-blue-500 hover:underline flex items-center"
          >
            ← Volver a la lista de retos
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">{reto.titulo}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                reto.dificultad === "Fácil"
                  ? "bg-green-600"
                  : reto.dificultad === "Medio"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {reto.dificultad}
            </span>
            <span className="text-yellow-400 font-bold">{reto.puntos} puntos</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-2">
              {reto.lenguajes.includes("javascript") && (
                <button
                  onClick={() => cambiarLenguaje("javascript")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    lenguaje === "javascript"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  JavaScript
                </button>
              )}
              {reto.lenguajes.includes("python") && (
                <button
                  onClick={() => cambiarLenguaje("python")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    lenguaje === "python"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Python
                </button>
              )}
              {reto.lenguajes.includes("java") && (
                <button
                  onClick={() => cambiarLenguaje("java")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    lenguaje === "java"
                      ? "bg-red-500 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Java
                </button>
              )}
              {reto.lenguajes.includes("html") && (
                <button
                  onClick={() => cambiarLenguaje("html")}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    lenguaje === "html"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  HTML
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-300 mb-6">{reto.descripcion}</p>
        </div>
        <div className="mb-4">
          {lenguaje === "javascript" && <CodeEditorJavaScript codigo={codigo} setCodigo={setCodigo} />}
          {lenguaje === "python" && <CodeEditorPython codigo={codigo} setCodigo={setCodigo} />}
          {lenguaje === "java" && <CodeEditorJava codigo={codigo} setCodigo={setCodigo} />}
          {lenguaje === "html" && <CodeEditorHtml codigo={codigo} setCodigo={setCodigo} />}
          {output && (
            <div className="bg-gray-900 text-green-400 p-4 rounded mt-4 whitespace-pre-wrap">
              {output}
            </div>
          )}
          {resultado && (
            <div
              className={`mt-4 p-4 rounded ${
                resultado.success ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"
              }`}
            >
              {resultado.message}
            </div>
          )}
          <div className="mt-4 flex gap-4 justify-center">
            <button
              onClick={entregarSolucion}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={enviando}
            >
              Entregar solución
            </button>
            <button
              onClick={verSolucion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mostrarSolucion ? "Ocultar solución" : "Ver solución"}
            </button>
          </div>
          {mostrarSolucion && (
            <div className="mt-8 flex flex-col items-center">
              <label className="text-white font-bold mb-2">Solución Correcta en {lenguaje}:</label>
              <textarea
                readOnly
                className="w-full max-w-lg p-4 bg-gray-900 text-yellow-400 rounded-lg border border-yellow-500"
                value={reto.solucion[lenguaje] || "No disponible"}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}