"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

// Importa el editor de forma dinámica para evitar problemas de SSR
const CodeEditor = dynamic(() => import("../../components/CodeEditorJavaScript"), { ssr: false });

interface Comment {
  id: string;
  user: string;
  content: string;
  replies: Comment[];
  createdAt: string;
  codeId?: string;
}

export default function JavaScriptBlogPage() {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("// Escribe tu código aquí");
  const [savedCodeId, setSavedCodeId] = useState<string | null>(null);

  // Cargar comentarios
  const fetchComments = async () => {
    const res = await fetch("/api/comments/javascript");
    const data = await res.json();
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Guardar código en Firebase y pegarlo en el comentario
  const handleSaveCode = async () => {
    const res = await fetch("/api/codes/javascript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codigo }),
    });
    const data = await res.json();
    setSavedCodeId(data.id);
    setNewComment(codigo);
    alert("Código guardado y pegado en el comentario. Ahora puedes publicarlo o editarlo.");
  };

  // Publicar comentario (con código opcional)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const formData = new FormData();
    formData.append("content", newComment);
    formData.append("user", user?.fullName || user?.username || "Usuario Anónimo");
    if (replyTo) formData.append("parentId", replyTo);
    if (savedCodeId) formData.append("codeId", savedCodeId);

    await fetch("/api/comments/javascript", {
      method: "POST",
      body: formData,
    });

    setNewComment("");
    setReplyTo(null);
    setSavedCodeId(null);
    await fetchComments();
  };

  // Copiar código del comentario al editor
  const handleCopyCodeToEditor = async (codeId: string) => {
    const res = await fetch(`/api/codes/javascript?id=${codeId}`);
    const data = await res.json();
    setCodigo(data.code || "// Código no encontrado");
  };

  // Encuentra el comentario o respuesta al que se está respondiendo
  const getReplyingComment = () => {
    if (!replyTo) return null;
    let comment = comments.find(c => c.id === replyTo);
    if (comment) return comment;
    for (const c of comments) {
      if (Array.isArray(c.replies)) {
        const reply = c.replies.find(r => r.id === replyTo);
        if (reply) return reply;
      }
    }
    return null;
  };

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
      {/* Blog a la izquierda */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="text-3xl font-bold text-center mb-6">Blog de Javascript</h1>
        <p className="text-center text-gray-600 mb-8">
          Bienvenido al blog de JavaScript. Publica tus dudas y participa en la comunidad.
        </p>
        <div className="space-y-6 mt-6">
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="font-bold text-black">{comment.user}</p>
                <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                {/* Mostrar botón para copiar código si existe */}
                {comment.codeId && (
                  <button
                    onClick={() => handleCopyCodeToEditor(comment.codeId!)}
                    className="text-green-600 text-sm mt-2"
                  >
                    Copiar código a la consola
                  </button>
                )}
                <button
                  onClick={() => {
                    setReplyTo(comment.id);
                    if (comment.codeId) {
                      handleCopyCodeToEditor(comment.codeId);
                    }
                  }}
                  className="text-blue-500 text-sm mt-2 ml-2"
                >
                  Responder
                </button>
                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <div className="ml-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-2 border rounded-lg bg-gray-100">
                        <p className="font-bold text-black">{reply.user}</p>
                        <p className="text-gray-600 whitespace-pre-wrap">{reply.content}</p>
                        {reply.codeId && (
                          <button
                            onClick={() => handleCopyCodeToEditor(reply.codeId!)}
                            className="text-green-600 text-xs mt-1"
                          >
                            Copiar código a la consola
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setReplyTo(reply.id);
                            if (reply.codeId) {
                              handleCopyCodeToEditor(reply.codeId);
                            }
                          }}
                          className="text-blue-500 text-xs mt-1 ml-2"
                        >
                          Responder
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        {/* Formulario de comentario */}
        <div className="mt-6 flex flex-col gap-4 border p-4 rounded-lg shadow-sm bg-gray-100">
          {replyTo && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              Respondiendo a un comentario.{" "}
              <button onClick={() => setReplyTo(null)} className="text-blue-500">
                Cancelar
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario o pega tu código aquí..."
            className="flex-1 p-2 border rounded-lg text-black"
            rows={6}
          />
          {/* Si hay código guardado, muestra un aviso */}
          {savedCodeId && (
            <div className="text-xs text-green-600">
              Código adjuntado al comentario.
            </div>
          )}
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {replyTo ? "Responder" : "Publicar"}
          </button>
        </div>
      </div>
      {/* Editor a la derecha */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <CodeEditor codigo={codigo} setCodigo={setCodigo} />
        <button
          onClick={handleSaveCode}
          style={{
            marginTop: "12px",
            width: "100%",
            background: "#4caf50",
            color: "#fff",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Guardar código para pregunta
        </button>
      </div>
    </div>
  );
}