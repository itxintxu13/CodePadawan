"use client";
import React, { useEffect, useRef, useState } from "react";

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

import { PyodideInterface } from "../types/pyodide";

const loadPyodide = async (): Promise<PyodideInterface> => {
  console.log("🔄 Cargando Pyodide...");
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.js";
  script.async = true;
  document.body.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = async () => {
      if (!(window as any).loadPyodide) {
        reject("❌ Pyodide no se cargó correctamente.");
        return;
      }
      const pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/",
      });
      console.log("✅ Pyodide cargado correctamente");
      resolve(pyodide as PyodideInterface);
    };
    script.onerror = () => reject("❌ Error al cargar Pyodide desde el CDN.");
  });
};

interface CodeEditorPythonProps {
  codigo: string;
  setCodigo: (code: string) => void;
}

const CodeEditorPython: React.FC<CodeEditorPythonProps> = ({ codigo, setCodigo }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const [output, setOutput] = useState<string>("");
  const [pyodideInstance, setPyodideInstance] =
    useState<PyodideInterface | null>(null);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);

  const customTheme = EditorView.theme({
    "& .cm-content": {
      fontFamily: "'Fira Code', monospace",
      fontSize: "16px",
      color: "#ff5733",
    },
    "& .cm-editor": { backgroundColor: "#000" },
    "&.cm-line": { overflowWrap: "break-word" },
    ".cm-completionList": {
      backgroundColor: "#222",
      border: "1px solid #444",
      color: "#fff",
    },
    ".cm-completionItem": {
      padding: "2px 8px",
    },
    ".cm-completionItem:hover": {
      backgroundColor: "#333",
    },
  });

  useEffect(() => {
    loadPyodide()
      .then((pyodide) => {
        setPyodideInstance(pyodide);
        setIsPyodideReady(true);
      })
      .catch((error) => console.error("❌ Error al cargar Pyodide:", error));
  }, []);

  // Inicializa el editor SOLO una vez al montar
  useEffect(() => {
    if (!editorRef.current || editorInstance.current) return;

    const state = EditorState.create({
      doc: codigo,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        customTheme,
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            if (newCode !== codigo) {
              setCodigo(newCode); // Solo actualiza si el contenido realmente cambió
            }
          }
        }),
      ],
    });

    editorInstance.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    console.log(`Editor initialized for Python`);

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  // Sincroniza el contenido externo sin recrear el editor
  useEffect(() => {
    if (
      editorInstance.current &&
      editorInstance.current.state.doc.toString() !== codigo
    ) {
      editorInstance.current.dispatch({
        changes: { from: 0, to: editorInstance.current.state.doc.length, insert: codigo },
      });
    }
  }, [codigo]);

  const ejecutarCodigo = async () => {
    const codigo = editorInstance.current?.state.doc.toString();
    if (!codigo) {
      setOutput("❌ No hay código para ejecutar.");
      return;
    }

    try {
        if (!pyodideInstance) {
          setOutput("❌ Pyodide aún no está listo, intenta nuevamente...");
          return;
        }
        const wrappedCode = `
import sys
import io
sys.stdout = io.StringIO()
${codigo.trim()}
sys.stdout.getvalue()`;
        const output = await pyodideInstance.runPythonAsync(wrappedCode);
        setOutput(output || "❌ No se recibió salida.");
      
    } catch (error) {
      setOutput(`❌ Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
          fontSize: "40px",
        }}
      >
      </h1>
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "4px solid #007BFF",
          marginBottom: "10px",
          background: "#222",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "12px",
          width: "120px",
          color: "#007BFF",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "default",
          userSelect: "none",
        }}
      >
        Python
      </div>
      

      <div
        ref={editorRef}
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <button
        onClick={ejecutarCodigo}
               className="mt-2 px-4 py-2 rounded bg-[#007BFF] text-black w-50 max-w-[300px] block mx-auto text-[clamp(1rem,4vw,1.1rem)] hover:bg-yellow-400 cursor-pointer"

      >
        {isPyodideReady ? "Ejecutar Código" : "Cargando Pyodide..."}
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#1e1e1e",
          color: "#fff",
          borderRadius: "5px",
          textAlign: "left",
          border: "1px solid #ddd",
        }}
      >
            <strong>Salida:</strong>
            <pre>{output || "Aquí se mostrará la salida..."}</pre>
      </div>
    </div>
  );
};

export default CodeEditorPython;
