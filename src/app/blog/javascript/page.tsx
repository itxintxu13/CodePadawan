"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CodeEditorJavaScript from "../../components/CodeEditorJavaScript";
import BotonVolver from "@/app/components/BotonVolver";

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
    fetch(`/api/codes/javascript?id=${codeId}`)
      .then((res) => res.json())
      .then((data) => setCode(data.code || ""));
  }, [codeId]);
  if (!code) return null;
  return (
    <pre className="bg-gray-900 text-green-200 rounded p-2 mt-2 overflow-x-auto text-xs">
      {code}
    </pre>
  );
}

export default function JavaScriptBlogPage() {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("// Escribe tu código JavaScript aquí");
  const [savedCodeId, setSavedCodeId] = useState<string | null>(null);

  // Cargar comentarios desde Firebase
  const fetchComments = async () => {
    const res = await fetch("/api/comments/javascript");
    const data = await res.json();
    setComments((data.comments || []).reverse());
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
    alert(
      "Código guardado y pegado en el comentario. Ahora puedes publicarlo o editarlo."
    );
  };

  // Publicar un comentario (con código opcional)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const formData = new FormData();
    formData.append("content", newComment);
    formData.append(
      "user",
      user?.fullName || user?.username || "Usuario Anónimo"
    );
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

  // Copiar código del comentario al editor al responder
  const handleReply = async (comment: Comment) => {
    setReplyTo(comment.id);
    if (comment.codeId) {
      const res = await fetch(`/api/codes/javascript?id=${comment.codeId}`);
      const data = await res.json();
      setCodigo(data.code || "// Código no encontrado");
    }
  };

  return (
    <div>
      {/* Título y subtítulo centrados */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-4xl font-bold mb-4 text-white">Blog de Javascript</h1>
        <p className="text-gray-300 text-lg">
          Bienvenido al blog de Javascript. Publica tus dudas y participa en la comunidad.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <BotonVolver />
      </div>

      <div className="flex gap-4 mr-20 ml-20 mb-20">
        {/* Blog a la izquierda */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="px-2 py-2 border rounded-lg shadow-sm bg-[#1a1a2e]"
                >
                  <p className="font-bold text-yellow-400 pl-0">{comment.user}</p>
                  <div>
                    <p className="text-white whitespace-pre-wrap break-words break-all w-full px-[1cm]">
                      {comment.content}
                    </p>
                  </div>
                  {comment.codeId && <ShowCode codeId={comment.codeId} />}
                  <button
                    onClick={() => handleReply(comment)}
                    className="text-blue-400 text-sm mt-2"
                  >
                    Responder
                  </button>
                  {Array.isArray(comment.replies) &&
                    comment.replies.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="px-1 py-1 border rounded-lg bg-[#2a2a40]"
                          >
                            <p className="font-bold text-yellow-400 pl-0">{reply.user}</p>
                            <p className="text-white whitespace-pre-wrap break-words break-all w-full pl-0 pr-[3cm]">
                              {reply.content}
                            </p>
                            {reply.codeId && <ShowCode codeId={reply.codeId} />}
                            <button
                              onClick={() => handleReply(reply)}
                              className="text-blue-400 text-xs mt-1 ml-2"
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
          <div className="mt-6 flex flex-col gap-4 border p-4 rounded-lg shadow-sm bg-[#1a1a2e]">
            {replyTo && (
              <div className="text-sm text-gray-400">
                Respondiendo a un comentario.{" "}
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-blue-400"
                >
                  Cancelar
                </button>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Mensaje:</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full p-2 border rounded-lg bg-[#2a2a40] text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Código adjunto:</label>
                <textarea
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="El código se mostrará en el editor de JavaScript a la derecha"
                  className="w-full p-2 border rounded-lg bg-[#2a2a40] text-white"
                  rows={4}
                />
              </div>
            </div>
            {savedCodeId && (
              <div className="text-xs text-green-400">
                Código adjuntado al comentario.
              </div>
            )}
            <button
              onClick={handleSaveCode}
              className="w-full max-w-[320px] bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 cursor-pointer mt-4"
            >
              Guardar código para pregunta
            </button>
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {replyTo ? "Responder" : "Publicar"}
            </button>
          </div>
        </div>

        {/* Editor/compilador Javascript a la derecha */}
        <div className="flex-1 min-w-0 flex flex-col items-center p-6 rounded-lg shadow-md">
          <CodeEditorJavaScript codigo={codigo} setCodigo={setCodigo} />
        </div>
      </div>
    </div>
  );
}
