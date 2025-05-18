// Componente cliente para la página del blog de Python
"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CodeEditorPython from "@/app/components/CodeEditorPython"; // Componente específico para Python con Pyodide
import BotonVolver from "@/app/components/BotonVolver";

// Interface que define la estructura de un comentario
interface Comment {
  id: string;
  user: string;
  content: string;
  replies: Comment[];
  createdAt: string;
  codeId?: string;
}

// Componente que muestra el código asociado a un comentario
function ShowCode({ codeId }: { codeId: string }) {
  const [code, setCode] = useState<string>("");
  
  // Carga el código desde la API cuando el componente se monta
  useEffect(() => {
    fetch(`/api/codes/python?id=${codeId}`)
      .then((res) => res.json())
      .then((data) => setCode(data.code || ""));
  }, [codeId]);

  // Solo muestra el código si existe
  if (!code) return null;
  
  // Muestra el código en un bloque de código con estilo
  return (
    <pre className="bg-gray-900 text-green-200 rounded p-2 mt-2 overflow-x-auto text-xs">
      {code}
    </pre>
  );
}

// Componente principal de la página del blog de Python
export default function PythonBlogPage() {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("// Escribe tu código python aquí");
  const [savedCodeId, setSavedCodeId] = useState<string | null>(null);

  // Cargar comentarios desde Firebase
  const fetchComments = async () => {
    const res = await fetch("/api/comments/python");
    const data = await res.json();
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Guardar código en Firebase y pegarlo en el comentario
  const handleSaveCode = async () => {
    const res = await fetch("/api/codes/python", {
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

  // Función para publicar un nuevo comentario
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida que el comentario no esté vacío
    if (newComment.trim() === "") return;

    // Prepara los datos del formulario
    const formData = new FormData();
    formData.append("content", newComment);
    formData.append(
      "user",
      user?.fullName || user?.username || "Usuario Anónimo"
    );
    
    // Agrega ID del comentario padre si es una respuesta
    if (replyTo) formData.append("parentId", replyTo);
    
    // Agrega ID del código si existe
    if (savedCodeId) formData.append("codeId", savedCodeId);

    // Envía el comentario a la API
    await fetch("/api/comments/python", {
      method: "POST",
      body: formData,
    });

    // Limpia los campos después de enviar
    setNewComment("");
    setReplyTo(null);
    setSavedCodeId(null);
    
    // Actualiza la lista de comentarios
    await fetchComments();
  };

  // Función para manejar respuestas a comentarios
  const handleReply = async (comment: Comment) => {
    // Establece el ID del comentario al que se responde
    setReplyTo(comment.id);
    
    // Si el comentario tiene código asociado, lo carga
    if (comment.codeId) {
      const res = await fetch(`/api/codes/python?id=${comment.codeId}`);
      const data = await res.json();
      setCodigo(data.code || "// Código no encontrado");
    } else {
      // Si no hay código, copia el contenido del comentario al editor
      setCodigo(comment.content || "");
    }
  };

  return (
    <div>
      {/* Encabezado centrado */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-4xl font-bold mb-4 text-white">Blog de Python</h1>
        <p className="text-gray-300 text-lg">
          Bienvenido al blog de Python. Publica tus dudas y participa en la comunidad.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <BotonVolver />
      </div>

      {/* Contenedor flex que agrupa blog y editor */}
      <div className="flex gap-6 mx-20 mb-20">
        {/* Blog a la izquierda */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="space-y-6 mt-6">
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg shadow-sm bg-[#1a1a2e]"
                >
                  <p className="font-bold text-yellow-400">{comment.user}</p>
                  <p className="text-white">{comment.content}</p>
                  {comment.codeId && <ShowCode codeId={comment.codeId} />}
                  <button
                    onClick={() => handleReply(comment)}
                    className="text-blue-400 text-sm mt-2"
                  >
                    Responder
                  </button>
                  {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-2 border rounded-lg bg-[#2a2a40]"
                        >
                          <p className="font-bold text-yellow-400">{reply.user}</p>
                          <p className="text-white">{reply.content}</p>
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
                <button onClick={() => setReplyTo(null)} className="text-blue-400">
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
                  placeholder="El código se mostrará en el editor de Python a la derecha"
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
              className="w-full max-w-[320px] bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 cursor-pointer mt-4"
            >
              Publicar comentario
            </button>
          </div>
        </div>

        {/* Editor/compilador Python a la derecha */}
        <div
          style={{ flex: 1, minWidth: 0 }}
          className="p-6 rounded-lg shadow-md"
        >
          <CodeEditorPython codigo={codigo} setCodigo={setCodigo} />
        </div>
      </div>
    </div>
  );

}
