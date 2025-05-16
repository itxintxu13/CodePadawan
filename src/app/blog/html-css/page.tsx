"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Importar Clerk para obtener el usuario

interface Comment {
  id: string;
  user: string;
  content: string;
  replies: Comment[];
  createdAt: string;
}

export default function HTmlCssBlogPage() {
  const { user } = useUser(); // Obtener el usuario autenticado
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Cargar comentarios desde Firebase
  const fetchComments = async () => {
    const res = await fetch("/api/comments/html-css");
    const data = await res.json();
    setComments(data.comments || []); // Asegurarse de que siempre sea un array
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Publicar un comentario
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
  
    const formData = new FormData();
    formData.append("content", newComment);
    formData.append("user", user?.fullName || user?.username || "Usuario Anónimo"); // Agregar el nombre del usuario
    if (replyTo) formData.append("parentId", replyTo);
  
    await fetch("/api/comments/html-css", {
      method: "POST",
      body: formData,
    });
  
    setNewComment("");
    setReplyTo(null);
    await fetchComments(); // Recargar comentarios desde el servidor
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
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
        <button
          onClick={() => setReplyTo(comment.id)}
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
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="flex-1 p-2 border rounded-lg text-black"
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