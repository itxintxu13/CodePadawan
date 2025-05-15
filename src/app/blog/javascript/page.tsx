"use client";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  user: string;
  userId: string;
  content: string;
  fileUrl?: string;
  replies: Comment[];
}

export default function JavaScriptBlogPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Función para cargar comentarios
  const fetchComments = async () => {
    const res = await fetch("/api/comments/javascript");
    const data = await res.json();

    // Asegúrate de tipar los comentarios como Comment[]
    const commentsData: Comment[] = data.comments;

    // Elimina duplicados antes de actualizar el estado
    const uniqueComments = Array.from(
      new Map(commentsData.map((comment) => [comment.id, comment])).values()
    );

    setComments(uniqueComments || []);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const formData = new FormData();
    formData.append("parentId", replyTo || "");
    formData.append("user", "Usuario");
    formData.append("content", newComment);
    if (image) formData.append("file", image);

    await fetch("/api/comments/javascript", {
      method: "POST",
      body: formData,
    });

    // Recarga los comentarios después de publicar
    await fetchComments();

    setNewComment("");
    setImage(null);
    setReplyTo(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Blog de JavaScript</h1>
      <p className="text-center text-gray-600 mb-8">
        Bienvenido al blog de JavaScript. Publica tus dudas y participa en la comunidad.
      </p>

      <div className="space-y-6 mt-6">
        {comments
          .filter((comment) => comment && comment.user && comment.content)
          .map((comment) => (
            <div key={comment.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <p className="font-semibold">{comment.user}</p> {/* Muestra solo el username */}
              <p className="text-gray-600">{comment.content}</p>
              {comment.fileUrl && <img src={comment.fileUrl} alt="Attachment" />}
              {comment.replies.length > 0 && (
                <div className="ml-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-2 border rounded-lg bg-gray-100">
                      <p className="font-semibold">{reply.user}</p> {/* Muestra solo el username de la respuesta */}
                      <p className="text-gray-600">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Barra para añadir un comentario */}
      <div className="mt-6 flex items-center gap-4 border p-4 rounded-lg shadow-sm bg-gray-100">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="flex-1 p-2 border rounded-lg text-black"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-black"
        />
        <button
          onClick={handleCommentSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {replyTo ? "Responder" : "Publicar"}
        </button>
      </div>
    </div>
  );
}