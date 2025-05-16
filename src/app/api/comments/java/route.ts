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
    const commentsRef = ref(database, "blogs/java/comments");
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
    const user = formData.get("user") as string || "Usuario Anónimo"; // Obtener el usuario del formulario
    const parentId = formData.get("parentId") as string | null;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const newComment = {
      id: Date.now().toString(), // ID único basado en timestamp
      content,
      user, // Guardar el usuario
      replies: [],
      createdAt: new Date().toISOString(),
    };

    const commentsRef = ref(database, "blogs/java/comments");

    if (parentId) {
      // Si es una respuesta, actualiza el comentario padre
      const snapshot = await get(commentsRef);
      const data = snapshot.val() || {};

      // Convertir los datos en un array si es necesario
      const comments = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        ...value,
      }));

      const updatedComments = comments.map((comment: any) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        }
        return comment;
      });

      // Actualizar los comentarios en Firebase
      const updates: any = {};
      updatedComments.forEach((comment) => {
        updates[comment.id] = comment;
      });

      // Usar la función 'update' para actualizar los datos
      await update(commentsRef, updates);
    } else {
      // Si es un comentario nuevo, simplemente agrégalo
      await push(commentsRef, newComment);
    }

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}