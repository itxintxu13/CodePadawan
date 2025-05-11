"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import {
  autocompletion,
  CompletionContext,
  Completion,
} from "@codemirror/autocomplete";

// Fuente de autocompletado personalizada para JavaScript
const jsCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const completions: Completion[] = [
    { label: "console.log", type: "function", detail: "Log to console" },
    { label: "alert", type: "function", detail: "Show alert" },
    { label: "document", type: "variable", detail: "DOM document" },
    { label: "window", type: "variable", detail: "Browser window" },
    // Agrega más completados según sea necesario
  ];

  return {
    from: word.from,
    options: completions,
  };
};

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<"javascript">("javascript");

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
    if (!editorRef.current) return;

    const initialDoc = "console.log('¡Hola, mundo! 🚀');";

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        javascript(), 
        oneDark,
        customTheme,
        autocompletion({ override: [jsCompletions] }), 
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
      const worker = new Worker(
        new URL("../workers/worker.js", import.meta.url)
      );

      let timeout = setTimeout(() => {
        worker.terminate();
        setOutput(
          "❌ Error: Se ha detenido la ejecución por posible bucle infinito."
        );
      }, 3000); // Limita ejecución a 3 segundos

      worker.onmessage = (e) => {
        clearTimeout(timeout);
        setOutput(e.data);
        worker.terminate();
      };

      worker.postMessage({ codigo });
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
      ></h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "4px solid #FFEB3B",
          marginBottom: "10px",
          background: "#222",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "12px",
          width: "120px",
          color: "#FFEB3B",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "default",
          userSelect: "none",
        }}
      >
        JavaScript
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
          background: "#FFEB3B",
          border: "none",
          cursor: "pointer",
          color: "#000",
        }}
      >
        Ejecutar Código
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
