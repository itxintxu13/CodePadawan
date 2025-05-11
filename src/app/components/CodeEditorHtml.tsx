"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import {
  autocompletion,
  completionKeymap,
  CompletionContext,
  Completion,
} from "@codemirror/autocomplete";
import { PyodideInterface } from "../types/pyodide";

const CodeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<"html">("html");

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

    const initialDoc = `<p style="font-size: 18px; line-height: 1.6; max-width: 600px; color: #ddd;">¡Hola, mundo! 🚀</p>`;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        html(),
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
      const wrappedHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
    p { font-size: 1em; margin-bottom: 1em; }
    div { font-size: 1em; }
  </style>
</head>
<body>
${codigo}
</body>
</html>`;
      setOutput(wrappedHtml);
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
            borderBottom: "4px solid #FF9800",
            marginBottom: "10px",
            background: "#222",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "12px",
            width: "120px",
            color: "#FF9800",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "default",
            userSelect: "none",
          }}
        >
          HTML - CSS
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
          background: "#FF9800",
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
        {language === "html" ? (
          <div dangerouslySetInnerHTML={{ __html: output }} />
        ) : (
          <>
            <strong>Salida:</strong>
            <pre>{output || "Aquí se mostrará la salida..."}</pre>
          </>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
