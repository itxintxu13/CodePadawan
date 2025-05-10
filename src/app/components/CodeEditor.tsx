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
import { autocompletion, completionKeymap, CompletionContext, Completion } from "@codemirror/autocomplete";
import { PyodideInterface } from "../types/pyodide";

function javaCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: [
      { label: "System.out.println", type: "function", detail: "Java" },
      { label: "public static void main", type: "function", detail: "Java" },
      { label: "ArrayList", type: "class", detail: "Java" }
    ]
  };
}

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

// Fuente de autocompletado personalizada para JavaScript
const jsCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\w*/);
  if (!word || word.from === word.to && !context.explicit) return null;

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
  const [language, setLanguage] = useState<
    "javascript" | "python" | "html" | "java"
  >("javascript");
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

    const initialDoc =
      language === "javascript"
        ? "console.log('¡Hola, mundo! 🚀');"
        : language === "python"
        ? 'print("¡Hola, mundo! 🚀")'
        : language === "html"
        ? `<p style="font-size: 18px; line-height: 1.6; max-width: 600px; color: #ddd;">¡Hola, mundo! 🚀</p>`
        : 'System.out.println("Hola, mundo!");';

    console.log(`Initializing editor for language: ${language}`);

    const languageExtension =
      language === "javascript"
        ? javascript()
        : language === "python"
        ? python()
        : language === "html"
        ? html()
        : java();

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        languageExtension,
        oneDark,
        customTheme,
        autocompletion({ override: language === "java" ? [javaCompletions] : undefined, }),
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
      if (language === "javascript") {
        const worker = new Worker(new URL("../workers/worker.js", import.meta.url));
    
    let timeout = setTimeout(() => {
      worker.terminate();
      setOutput("❌ Error: Se ha detenido la ejecución por posible bucle infinito.");
    }, 3000); // Limita ejecución a 3 segundos

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      setOutput(e.data);
      worker.terminate();
    };

    worker.postMessage({ codigo });
      } else if (language === "python") {
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
      } else if (language === "html") {
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
      } else if (language === "java") {
        const wrappedCode = `
public class Main {
  public static void main(String[] args) {
    ${codigo}
  }
}`;
        try {
          const response = await fetch("http://localhost:5000/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: wrappedCode }),
          });
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          const data = await response.json();
          setOutput(data.output || "❌ No se recibió salida.");
        } catch (error) {
          console.error("Fetch error:", error);
          setOutput(
            "❌ Error: No se pudo conectar con el servidor. Asegúrate de que el servidor esté corriendo en http://localhost:5000."
          );
        }
      }
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
        👨‍💻 CodePadawan 💫
      </h1>
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #444",
          marginBottom: "10px",
          background: "#222",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => {
            setLanguage("javascript");
            setOutput("");
          }}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            cursor: "pointer",
            background: language === "javascript" ? "#333" : "transparent",
            color: language === "javascript" ? "#FFEB3B" : "#fff",
            fontWeight: "bold",
            borderBottom:
              language === "javascript" ? "4px solid #FFEB3B" : "none",
            borderRadius: "10px 10px 0 0",
          }}
        >
          JavaScript
        </button>
        <button
          onClick={() => {
            setLanguage("python");
            setOutput("");
          }}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            cursor: "pointer",
            background: language === "python" ? "#333" : "transparent",
            color: language === "python" ? "#007BFF" : "#fff",
            fontWeight: "bold",
            borderBottom: language === "python" ? "4px solid #007BFF" : "none",
            borderRadius: "10px 10px 0 0",
          }}
        >
          Python
        </button>
        <button
          onClick={() => {
            setLanguage("html");
            setOutput("");
          }}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            cursor: "pointer",
            background: language === "html" ? "#333" : "transparent",
            color: language === "html" ? "#FF9800" : "#fff",
            fontWeight: "bold",
            borderBottom: language === "html" ? "4px solid #FF9800" : "none",
            borderRadius: "10px 10px 0 0",
          }}
        >
          HTML
        </button>
        <button
          onClick={() => {
            setLanguage("java");
            setOutput("");
          }}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            cursor: "pointer",
            background: language === "java" ? "#333" : "transparent",
            color: language === "java" ? "#D32F2F" : "#fff",
            fontWeight: "bold",
            borderBottom: language === "java" ? "4px solid #D32F2F" : "none",
            borderRadius: "10px 10px 0 0",
          }}
        >
          Java
        </button>
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
        disabled={!isPyodideReady && language === "python"}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          borderRadius: "5px",
          background:
            language === "python"
              ? "#007BFF"
              : language === "java"
              ? "#D32F2F"
              : language === "html"
              ? "#FF9800"
              : "#FFEB3B",
          color: language === "javascript" ? "#000" : "#fff",
          border: "none",
          cursor: "pointer",
          opacity: !isPyodideReady && language === "python" ? 0.5 : 1,
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