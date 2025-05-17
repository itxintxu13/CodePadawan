"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CodeEditorHtml from "@/app/components/CodeEditorHtml";

interface Comment {
  id: string;
  user: string;
  content: string;
  replies: Comment[];
  createdAt: string;
  codeId?: string;
}

function ShowCode({ codeId }: { codeId: string }) {
  const [code, setCode] = useState<string>("");
  useEffect(() => {
    fetch(`/api/codes/html-css?id=${codeId}`)
      .then(res => res.json())
      .then(data => setCode(data.code || ""));
  }, [codeId]);
  if (!code) return null;
  return (
    <pre className="bg-gray-900 text-green-200 rounded p-2 mt-2 overflow-x-auto text-xs">
      {code}
    </pre>
  );
}

export default function HtmlCssBlogPage() {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("// Escribe tu código Html o Css aquí");
  const [savedCodeId, setSavedCodeId] = useState<string | null>(null);

  // Cargar comentarios desde Firebase
  const fetchComments = async () => {
    const res = await fetch("/api/comments/html-css");
    const data = await res.json();
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Guardar código en Firebase y pegarlo en el comentario
  const handleSaveCode = async () => {
    const res = await fetch("/api/codes/html-css", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codigo }),
    });
    const data = await res.json();
    setSavedCodeId(data.id);
    setNewComment(codigo);
    alert("Código guardado y pegado en el comentario. Ahora puedes publicarlo o editarlo.");
  };

  // Publicar un comentario (con código opcional)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const formData = new FormData();
    formData.append("content", newComment);
    formData.append("user", user?.fullName || user?.username || "Usuario Anónimo");
    if (replyTo) formData.append("parentId", replyTo);
    if (savedCodeId) formData.append("codeId", savedCodeId);

    await fetch("/api/comments/html-css", {
      method: "POST",
      body: formData,
    });

    setNewComment("");
    setReplyTo(null);
    setSavedCodeId(null);
    await fetchComments();
  };

  // Copiar código del comentario al editor al responder
const handleReply = async (comment: Comment) => {
  setReplyTo(comment.id);
  if (comment.codeId) {
    const res = await fetch(`/api/codes/html-css?id=${comment.codeId}`);
    const data = await res.json();
    setCodigo(data.code || "// Código no encontrado");
  } else {
    // Si no hay codeId, copia el texto del comentario al editor
    setCodigo(comment.content || "");
  }
};

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
      {/* Blog a la izquierda */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="text-3xl font-bold text-center mb-6">Blog de Html y Css</h1>
        <p className="text-center text-gray-600 mb-8">
          Bienvenido al blog de Html y Css. Publica tus dudas y participa en la comunidad.
        </p>
        <div className="space-y-6 mt-6">
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <p className="font-bold text-black">{comment.user}</p>
                <p className="text-gray-600">{comment.content}</p>
                {comment.codeId && <ShowCode codeId={comment.codeId} />}
                <button
                  onClick={() => handleReply(comment)}
                  className="text-blue-500 text-sm mt-2"
                >
                  Responder
                </button>
                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <div className="ml-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-2 border rounded-lg bg-gray-100">
                        <p className="font-bold text-black">{reply.user}</p>
                        <p className="text-gray-600">{reply.content}</p>
                        {reply.codeId && <ShowCode codeId={reply.codeId} />}
                        <button
                          onClick={() => handleReply(reply)}
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
        <div className="mt-6 flex flex-col gap-4 border p-4 rounded-lg shadow-sm bg-gray-100">
          {replyTo && (
            <div className="text-sm text-gray-500">
              Respondiendo a un comentario.{" "}
              <button onClick={() => setReplyTo(null)} className="text-blue-500">
                Cancelar
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario o código aquí..."
            className="flex-1 p-2 border rounded-lg text-black"
            rows={6}
          />
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
      {/* Editor/compilador Html y Css a la derecha */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <CodeEditorHtml codigo={codigo} setCodigo={setCodigo} />
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