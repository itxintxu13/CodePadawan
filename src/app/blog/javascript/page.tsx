"use client";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  user: string;
  content: string;
  fileUrl?: string;
  replies: Comment[];
}

export default function JavascriptBlogPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);


  useEffect(() => {
   const fetchComments = async () => {
  try {
    const res = await fetch("/api/comments/javascript");

    if (!res.ok) {
      throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    }

    const rawText = await res.text(); // Verificar contenido
    console.log("🔍 Respuesta cruda del servidor:", rawText);

    if (!rawText.trim()) {
      throw new Error("La respuesta está vacía o malformada.");
    }

    const data = JSON.parse(rawText); // Convertir manualmente a JSON
    console.log("Comentarios cargados:", data);

    setComments(data.comments || []);
  } catch (error) {
    console.error("❌ Error al procesar JSON:", error);
    setComments([]);
  }
};

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

    try {
      const res = await fetch("/api/comments/javascript", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error al guardar el comentario: ${res.status}`);
      }

      const rawText = await res.text();
      console.log("🔍 Respuesta del POST:", rawText);

      if (!rawText.trim()) {
        throw new Error("La respuesta al guardar el comentario está vacía.");
      }

      const data = JSON.parse(rawText);

      setComments((prevComments) => {
        if (replyTo) {
          return prevComments.map((comment) =>
            comment.id === replyTo ? { ...comment, replies: [...comment.replies, data.comment] } : comment
          );
        }
        return [...prevComments, data.comment];
      });

      setNewComment("");
      setImage(null);
      setReplyTo(null);
    } catch (error) {
      console.error("❌ Error al enviar el comentario:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Blog de Javascript</h1>
      <p className="text-center text-gray-600 mb-8">Bienvenido al blog de JavaScript. Publica tus dudas y participa en la comunidad.</p>

      {/* Sección de comentarios */}
      <div className="space-y-6 mt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <p className="font-semibold">{comment.user}</p>
            <p className="text-gray-600">{comment.content}</p>

            {comment.fileUrl && (
              <a href={comment.fileUrl} download className="text-blue-500 mt-2">
                Descargar archivo
              </a>
            )}

            <button onClick={() => setReplyTo(comment.id)} className="text-blue-500 mt-2">Responder</button>

            {comment.replies.length > 0 && (
              <div className="ml-6 border-l pl-4 mt-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="p-3 bg-gray-100 rounded-lg mt-2">
                    <p className="font-semibold">{reply.user}</p>
                    <p className="text-gray-600">{reply.content}</p>

                    {reply.fileUrl && (
                      <a href={reply.fileUrl} download className="text-blue-500 mt-2">
                        Descargar archivo
                      </a>
                    )}
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
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="text-black" />
        <button onClick={handleCommentSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {replyTo ? "Responder" : "Publicar"}
        </button>
      </div>
    </div>
  );
}
