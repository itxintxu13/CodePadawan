"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import CodeEditorJava from "../../components/CodeEditorJava";
import CodeEditorJavaScript from "../../components/CodeEditorJavaScript";
import CodeEditorPython from "../../components/CodeEditorPython";
import CodeEditorHtml from "../../components/CodeEditorHtml";
import confetti from "canvas-confetti";

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
  plantilla: {
    [key: string]: string;
  };
  solucion: {
    [key: string]: string;
  };
  tests: {
    [key: string]: string;
  };
}

export default function RetoPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [reto, setReto] = useState<Reto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [lenguaje, setLenguaje] = useState<string>("");
  const [codigo, setCodigo] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ success: boolean; message: string } | null>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [editorInstance, setEditorInstance] = useState<EditorView | null>(null);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    const cargarReto = async () => {
      try {
        const response = await fetch('/api/retos');
        if (!response.ok) {
          throw new Error('Error al cargar los retos');
        }
        const retos = await response.json();
        const retoActual = retos.find((r: Reto) => r.id.toString() === params.id);

        if (retoActual) {
          setReto(retoActual);
          // Establecer el lenguaje predeterminado al primer lenguaje disponible
          if (retoActual.lenguajes.length > 0) {
            setLenguaje(retoActual.lenguajes[0]);
            setCodigo(retoActual.plantilla[retoActual.lenguajes[0]]);
          }
        } else {
          router.push('/retos');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarReto();
  }, [isSignedIn, params.id, router]);

  useEffect(() => {
    if (!reto || !lenguaje) return;

    // Actualizar el código cuando cambia el lenguaje
    setCodigo(reto.plantilla[lenguaje] || '');
  }, [reto, lenguaje]);

  useEffect(() => {
    if (!codigo || !lenguaje) return;

    const editorContainer = document.getElementById('editor-container');
    if (!editorContainer) return;

    // Limpiar el editor anterior si existe
    editorContainer.innerHTML = '';
    if (editorInstance) {
      editorInstance.destroy();
    }

    // Configurar el lenguaje para el editor
    const languageExtension =
      lenguaje === "javascript"
        ? javascript()
        : lenguaje === "python"
          ? python()
          : java();

    // Crear el estado del editor
    const state = EditorState.create({
      doc: codigo,
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

    // Crear la vista del editor
    const view = new EditorView({
      state,
      parent: editorContainer,
    });

    setEditorInstance(view);

    return () => {
      view.destroy();
    };
  }, [codigo, lenguaje]);

  const entregarSolucion = async () => {
    if (!codigo || !reto || !user) {
      setResultado({
        success: false,
        message: "Falta información necesaria para entregar la solución",
      });
      return;
    }

    const solucionCorrecta = reto.solucion[lenguaje].toLowerCase().replace(/'/g, '"').replace(/\s+/g, '').normalize("NFC");
    const codigoUsuario = codigo.toLowerCase().replace(/'/g, '"').replace(/\s+/g, '').normalize("NFC");

    if (codigoUsuario !== solucionCorrecta) {
      setResultado({
        success: false,
        message: "La solución no es correcta. Intenta nuevamente.",
      });
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch("/api/retos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          retoId: reto.id,
          codigo,
          lenguaje,
          puntos: reto.puntos,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al entregar la solución");
      }

      const data = await response.json();
      setResultado({
        success: true,
        message: `🎉 ¡Solución correcta! Has ganado ${reto.puntos} puntos! 🎉`,
      });

      lanzarConfeti(); // 🚀 🎊 Lanza el confeti cuando la solución es correcta

      await actualizarPuntosUsuario(reto.puntos, reto.id);
    } catch (error) {
      console.error("Error:", error);
      setResultado({
        success: false,
        message: "Error al entregar la solución",
      });
    } finally {
      setEnviando(false);
    }
  };



  useEffect(() => {
    const obtenerUsuarios = async () => {
      const response = await fetch("/api/updatePoints");
      const data = await response.json();
      setUsuarios(data); // 🔥 Actualiza el estado con los datos nuevos
    };

    obtenerUsuarios();
  }, [resultado]); // ✅ Ahora se recarga cuando el resultado cambia

  const actualizarPuntosUsuario = async (puntos: number, retoId: number) => {
    if (!user) return;

    try {
      // ✅ Convertir publicMetadata.puntos a número de forma segura
      const puntosActuales = Number(user.publicMetadata?.puntos ?? 0);
      const retosResueltosActuales = Number(user.publicMetadata?.retosResueltos ?? 0);

      const response = await fetch("/api/updatePoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          points: puntosActuales + puntos, // ✅ Ahora sí estamos sumando dos números correctamente
          retosResuletos: retosResueltosActuales + 1, //Incrementando cada vez que se complete uno
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los puntos del usuario");
      }

      console.log("Puntos actualizados correctamente en Clerk.");
    } catch (error) {
      console.error("Error al actualizar los puntos del usuario:", error);
    }
  };


  const cambiarLenguaje = (nuevoLenguaje: string) => {
    if (reto?.lenguajes.includes(nuevoLenguaje)) {
      setLenguaje(nuevoLenguaje);
      setOutput('');
      setResultado(null);
    }
  };

  const verSolucion = () => {
    setMostrarSolucion(!mostrarSolucion);
  };

  if (cargando) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Cargando reto...</p>
      </div>
    );
  }

  if (!reto) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Reto no encontrado</h1>
        <button
          onClick={() => router.push('/retos')}
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
            onClick={() => router.push('/retos')}
            className="text-blue-500 hover:underline flex items-center"
          >
            ← Volver a la lista de retos
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">{reto.titulo}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${reto.dificultad === 'Fácil' ? 'bg-green-600' :
              reto.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
              {reto.dificultad}
            </span>
            <span className="text-yellow-400 font-bold">{reto.puntos} puntos</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-2">
              {reto.lenguajes.includes('javascript') && (
                <button
                  onClick={() => cambiarLenguaje('javascript')}
                  className={`px-4 py-2 rounded font-medium transition-colors ${lenguaje === 'javascript' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  JavaScript
                </button>
              )}
              {reto.lenguajes.includes('python') && (
                <button
                  onClick={() => cambiarLenguaje('python')}
                  className={`px-4 py-2 rounded font-medium transition-colors ${lenguaje === 'python' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  Python
                </button>
              )}
              {reto.lenguajes.includes('java') && (
                <button
                  onClick={() => cambiarLenguaje('java')}
                  className={`px-4 py-2 rounded font-medium transition-colors ${lenguaje === 'java' ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  Java
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-300 mb-6">{reto.descripcion}</p>
        </div>

        <div className="mb-4">
          {/* Renderizado del editor específico según el lenguaje, pasando props */}
          {lenguaje === 'javascript' && (
            <CodeEditorJavaScript codigo={codigo} setCodigo={setCodigo} />
          )}
          {lenguaje === 'python' && (
            <CodeEditorPython codigo={codigo} setCodigo={setCodigo} />
          )}
          {lenguaje === 'java' && (
            <CodeEditorJava codigo={codigo} setCodigo={setCodigo} />
          )}
          {lenguaje === 'html' && (
            <CodeEditorHtml codigo={codigo} setCodigo={setCodigo}/>
          )}

          {/* Botones y salida */}
          {output && (
            <div className="bg-gray-900 text-green-400 p-4 rounded mt-4 whitespace-pre-wrap">
              {output}
            </div>
          )}
          {resultado && (
            <div className={`mt-4 p-4 rounded ${resultado.success ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
              {resultado.message}
            </div>
          )}
          <div className="mt-4 flex gap-4 justify-center">
            <button
              onClick={entregarSolucion}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
                value={reto.solucion[lenguaje]}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}