import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ref, push, get } from "firebase/database";
import { initializeApp, getApps, getApp } from "firebase/app";
import { update } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCks4yUeDnd8gZKVh12Z0x6mSgNJEnqWWs",
  authDomain: "codepadawan-e909a.firebaseapp.com",
  databaseURL: "https://codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "codepadawan-e909a",
  storageBucket: "codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app",
  messagingSenderId: "739998345731",
  appId: "1:739998345731:web:a6e9e036438359eac33c36",
  measurementId: "G-EFRX0BPMG0"
};

// Inicialización de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

// Endpoint GET para obtener todos los comentarios
export async function GET() {
  try {
    // Referencia a la colección de comentarios en Firebase
    const commentsRef = ref(database, "blogs/python/comments");
    const snapshot = await get(commentsRef);
    const data = snapshot.val();

    // Convierte los datos de Firebase en un array de objetos
    const comments = data
      ? Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
      : [];

    // Retorna la lista de comentarios
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    return NextResponse.json({ error: "Error al obtener comentarios" }, { status: 500 });
  }
}

// Endpoint POST para crear un nuevo comentario
export async function POST(req: NextRequest) {
  try {
    // Obtiene los datos del formulario
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const user = formData.get("user") as string || "Usuario Anónimo";
    const parentId = formData.get("parentId") as string | null;
    const codeId = formData.get("codeId") as string | null; 

    if (!content) {
      return NextResponse.json({ error: "Contenido es requerido" }, { status: 400 });
    }

    const newComment = {
      content,
      user,
      replies: [],
      createdAt: new Date().toISOString(),
      ...(codeId ? { codeId } : {}), 
    };

    const commentsRef = ref(database, "blogs/python/comments");

    if (parentId) {
      // Si es una respuesta, actualiza el comentario padre
      const snapshot = await get(commentsRef);
      const data = snapshot.val() || {};

      // Buscar el comentario padre
      const parentCommentKey = Object.keys(data).find(
        (key) => data[key].id === parentId
      );

      if (!parentCommentKey) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }

      const parentComment = data[parentCommentKey];
      const existingReplies = parentComment.replies || [];

      // Agregar la nueva respuesta
      const replyId = push(ref(database)).key; // Generar un ID único para la respuesta
      const updatedReplies = [...existingReplies, { id: replyId, ...newComment }];

      // Actualizar el comentario padre con las nuevas respuestas
      await update(ref(database, `blogs/python/comments/${parentCommentKey}`), {
        ...parentComment,
        replies: updatedReplies,
      });
    } else {
      // Si es un comentario nuevo, utiliza el ID generado por Firebase
      const newCommentRef = push(commentsRef); // Generar una nueva referencia
      const newCommentId = newCommentRef.key; // Obtener el ID generado
      await update(ref(database, `blogs/python/comments/${newCommentId}`), {
        id: newCommentId,
        ...newComment,
      });
    }

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}