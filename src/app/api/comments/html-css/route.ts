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

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

// Obtener comentarios
export async function GET() {
  try {
    const commentsRef = ref(database, "blogs/html-css/comments");
    const snapshot = await get(commentsRef);
    const data = snapshot.val();

    // Convertir los datos en un array
    const comments = data
      ? Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
      : [];

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const user = formData.get("user") as string || "Usuario Anónimo";
    const parentId = formData.get("parentId") as string | null;
    const codeId = formData.get("codeId") as string | null; // <-- Añadido para asociar código

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const newComment = {
      content,
      user,
      replies: [],
      createdAt: new Date().toISOString(),
      ...(codeId ? { codeId } : {}), // <-- Añade codeId si existe
    };

    const commentsRef = ref(database, "blogs/html-css/comments");

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
      await update(ref(database, `blogs/html-css/comments/${parentCommentKey}`), {
        ...parentComment,
        replies: updatedReplies,
      });
    } else {
      // Si es un comentario nuevo, utiliza el ID generado por Firebase
      const newCommentRef = push(commentsRef); // Generar una nueva referencia
      const newCommentId = newCommentRef.key; // Obtener el ID generado
      await update(ref(database, `blogs/html-css/comments/${newCommentId}`), {
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