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
  const [lenguaje, setLenguaje] = useState<string>('javascript');
  const [codigo, setCodigo] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [editorInstance, setEditorInstance] = useState<EditorView | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ success: boolean; message: string } | null>(null);

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

  const ejecutarCodigo = async () => {
    if (!codigo) {
      setOutput('❌ No hay código para ejecutar.');
      return;
    }

    try {
      // Simulamos la ejecución del código
      // En un entorno real, esto se conectaría con el backend para ejecutar el código
      setOutput(`Ejecutando código en ${lenguaje}...\n${codigo}\n\nResultado: Ejecución exitosa`);
    } catch (error) {
      setOutput(`❌ Error: ${error}`);
    }
  };

  const entregarSolucion = async () => {
    if (!codigo || !reto || !user) {
      setResultado({
        success: false,
        message: 'Falta información necesaria para entregar la solución'
      });
      return;
    }

    setEnviando(true);
    try {
      // Enviar la solución al servidor
      const response = await fetch('/api/retos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error('Error al entregar la solución');
      }

      const data = await response.json();
      setResultado({
        success: true,
        message: 'Solución entregada correctamente. Has ganado ' + reto.puntos + ' puntos!'
      });

      // Actualizar los metadatos del usuario en Clerk
      await actualizarPuntosUsuario(reto.puntos);
    } catch (error) {
      console.error('Error:', error);
      setResultado({
        success: false,
        message: 'Error al entregar la solución'
      });
    } finally {
      setEnviando(false);
    }
  };

  const actualizarPuntosUsuario = async (puntos: number) => {
    if (!user) return;

    try {
      // Obtener los puntos actuales del usuario
      const puntosActuales = user.publicMetadata.puntos || 0;
      const retosResueltos = user.publicMetadata.retosResueltos || [];
      
      // Actualizar los metadatos del usuario
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          puntos: puntosActuales + puntos,
          retosResueltos: [...retosResueltos, reto?.id],
        },
      });
    } catch (error) {
      console.error('Error al actualizar los puntos del usuario:', error);
    }
  };

  const cambiarLenguaje = (nuevoLenguaje: string) => {
    if (reto?.lenguajes.includes(nuevoLenguaje)) {
      setLenguaje(nuevoLenguaje);
      setOutput('');
      setResultado(null);
    }
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
          <span className={`px-3 py-1 rounded-full text-sm ${
            reto.dificultad === 'Fácil' ? 'bg-green-600' : 
            reto.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {reto.dificultad}
          </span>
          <span className="text-yellow-400 font-bold">{reto.puntos} puntos</span>
        </div>
        <p className="text-gray-300 mb-6">{reto.descripcion}</p>
      </div>

      <div className="mb-4">
        <div className="flex border-b border-gray-700 mb-4">
          {reto.lenguajes.map((lang) => (
            <button
              key={lang}
              onClick={() => cambiarLenguaje(lang)}
              className={`px-4 py-2 ${lenguaje === lang 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-400 hover:text-gray-200'}`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        <div 
          id="editor-container" 
          className="border border-gray-700 rounded-lg overflow-hidden mb-4"
          style={{ minHeight: '300px' }}
        />

        <div className="flex gap-4 mb-6">
          <button
            onClick={ejecutarCodigo}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ejecutar
          </button>
          <button
            onClick={entregarSolucion}
            disabled={enviando}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${enviando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {enviando ? 'Entregando...' : 'Entregar'}
          </button>
        </div>

        {resultado && (
          <div className={`p-4 rounded-lg mb-6 ${resultado.success ? 'bg-green-800' : 'bg-red-800'}`}>
            <p>{resultado.message}</p>
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Salida:</h3>
          <pre className="whitespace-pre-wrap">{output || 'Aquí se mostrará la salida de tu código...'}</pre>
        </div>
      </div>
    </div>
  );
}