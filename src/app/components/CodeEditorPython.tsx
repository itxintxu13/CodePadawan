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

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<"python">("python");
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

  useEffect(() => {
    if (!editorRef.current) return;

    const initialDoc = 'print("¡Hola, mundo! 🚀")';

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        python(), 
        oneDark,
        customTheme,
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
      ],
    });

    if (editorInstance.current) {
      editorInstance.current.destroy();
      editorInstance.current = null;
    }

    editorInstance.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    console.log(`Editor initialized for ${language}`);

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [language]);

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
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          borderRadius: "5px",
          background: "#007BFF",
          border: "none",
          cursor: "pointer",
          color: "#000",
        }}
      >
        {isPyodideReady || language !== "python"
          ? "Ejecutar Código"
          : "Cargando Pyodide..."}
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

export default CodeEditor;
