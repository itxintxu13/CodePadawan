"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

function javaCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: [
      { label: "System.out.println", type: "function", detail: "Java" },
      { label: "public static void main", type: "function", detail: "Java" },
      { label: "ArrayList", type: "class", detail: "Java" },
    ],
  };
}

interface CodeEditorJavaProps {
  codigo: string;
  setCodigo: React.Dispatch<React.SetStateAction<string>>;
}

const CodeEditor: React.FC<CodeEditorJavaProps> = ({ codigo, setCodigo }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<"java">("java");

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
        java(),
        oneDark,
        customTheme,
        autocompletion({ override: [javaCompletions] }),
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
  const codigoUsuario = editorInstance.current?.state.doc.toString();
  if (!codigoUsuario) {
    setOutput("❌ No hay código para ejecutar.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codigoUsuario }), // 🚀 Envía el código tal cual
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    setOutput(data.output || "❌ No se recibió salida.");
  } catch (error) {
    console.error("Fetch error:", error);
    setOutput("❌ Error: No se pudo conectar con el servidor.");
  }
};

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", boxSizing: "border-box", width: "100%", minWidth: 0 }}>
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
          borderBottom: "4px solid #D32F2F",
          marginBottom: "10px",
          background: "#222",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "12px",
          width: "120px",
          color: "#D32F2F",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "default",
          userSelect: "none",
          fontSize: "clamp(1rem, 4vw, 1.3rem)",
        }}
      >
        Java
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
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          borderRadius: "5px",
          background: "#D32F2F",
          border: "none",
          cursor: "pointer",
          color: "#fff",
          width: "100%",
          maxWidth: "300px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "clamp(1rem, 4vw, 1.1rem)",
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
          wordBreak: "break-word",
          fontSize: "clamp(0.9rem, 3vw, 1.05rem)",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <strong>Salida:</strong>
        <pre>{output || "Aquí se mostrará la salida..."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;