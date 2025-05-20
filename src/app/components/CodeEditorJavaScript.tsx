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

interface CodeEditorJavaScriptProps {
  codigo: string;
  setCodigo: React.Dispatch<React.SetStateAction<string>>;
}
const CodeEditor: React.FC<CodeEditorJavaScriptProps> = ({
  codigo,
  setCodigo,
}) => {
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
    if (!editorRef.current || editorInstance.current) return;
    const state = EditorState.create({
      doc: codigo,
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        customTheme,
        autocompletion({ override: [jsCompletions] }),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCodigo(update.state.doc.toString());
          }
        }),
      ],
    });
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
  }, []);

  // Sincroniza el contenido externo sin recrear el editor
  useEffect(() => {
    if (
      editorInstance.current &&
      editorInstance.current.state.doc.toString() !== codigo
    ) {
      editorInstance.current.dispatch({
        changes: {
          from: 0,
          to: editorInstance.current.state.doc.length,
          insert: codigo,
        },
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
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        boxSizing: "border-box",
        width: "100%",
        minWidth: 0,
      }}
    >
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
          fontSize: "clamp(1rem, 4vw, 1.3rem)",
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
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      />
      <button
        onClick={ejecutarCodigo}
        className="mt-2 px-4 py-2 rounded bg-yellow-300 text-black w-50 max-w-[300px] block mx-auto text-[clamp(1rem,4vw,1.1rem)] hover:bg-yellow-400 cursor-pointer"
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
          wordBreak: "break-word",
          fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <strong>Salida:</strong>
        <pre>{output || "Aquí se mostrará la salida..."}</pre>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div[style*='max-width: 800px'] {
            padding: 8px !important;
            max-width: 100vw !important;
          }
          h1 {
            font-size: 24px !important;
          }
          div[style*='width: 120px'] {
            width: 100% !important;
            font-size: 18px !important;
            padding: 8px !important;
          }
          button {
            font-size: 16px !important;
            padding: 8px 0 !important;
          }
          div[style*='min-height: 200px'] {
            min-height: 120px !important;
          }
          div[style*='padding: 10px'] {
            font-size: 14px !important;
            padding: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
