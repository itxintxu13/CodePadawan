import React, { useRef, useState, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

interface CodeEditorProps {
  codigo: string;
  setCodigo: React.Dispatch<React.SetStateAction<string>>;
}

const CodeEditorHtml: React.FC<CodeEditorProps> = ({ codigo, setCodigo }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorView | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [output, setOutput] = useState<string>("");
  const [iframeHeight, setIframeHeight] = useState<number>(100);

  // Inicializar CodeMirror
  useEffect(() => {
    if (!editorRef.current || editorInstance.current) return;

    const state = EditorState.create({
      doc: codigo,
      extensions: [
        basicSetup,
        html(),
        oneDark,
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

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, []);

  // Sincronizar cambios externos
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

  // Escuchar mensajes del iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.iframeHeight) {
        setIframeHeight(event.data.iframeHeight);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const ejecutarCodigo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const codigoActual = editorInstance.current?.state.doc.toString();
    if (!codigoActual) {
      setOutput("❌ No hay código para ejecutar.");
      return;
    }

    // Inyectar script para comunicar altura al padre
    const wrappedHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { overflow: hidden; scroll-behavior: smooth; background: #1e1e1e; color: white;}
  </style>
</head>
<body>
  ${codigoActual}

  <script>
    function sendHeight() {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ iframeHeight: height }, '*');
    }
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
    const observer = new MutationObserver(sendHeight);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  </script>
</body>
</html>
`;

    setOutput(wrappedHtml);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
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
          width: "150px",
          color: "#FF9800",
          fontWeight: "bold",
          textAlign: "center",
          cursor: "default",
          userSelect: "none",
          fontSize: "clamp(1rem, 4vw, 1.3rem)",
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
          overflow: "auto",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          background: "#1e1e1e",
          color: "#fff",
          padding: "10px",
          fontFamily: "'Fira Code', monospace",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
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
          width: "100%",
          maxWidth: "300px",
          display: "block",
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
          border: "1px solid #ddd",
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={output}
          style={{
            display: "block",
            width: "100%",
            height: iframeHeight,
            border: "none",
            overflow: "hidden",
          }}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default CodeEditorHtml;
