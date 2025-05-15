import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

// Utilidad para leer FormData (si quieres soportar archivos en el futuro)
async function parseFormData(req: NextRequest) {
  const formData = await req.formData();
  return {
    content: formData.get("content") as string,
    parentId: formData.get("parentId") as string,
    // file: formData.get("file") as File | null, // Si quieres manejar archivos
    // fileUrl: ... // Aquí puedes poner la URL si subes el archivo
  };
}

function addUserToReplies(replies: any[], username: string): any[] {
  return (replies || []).map(reply => ({
    ...reply,
    user: reply.user ?? username,
    replies: addUserToReplies(reply.replies, username)
  }));
}

export async function GET() {
  try {
    const allUsers = await clerkClient.users.getUserList();

    // Combina los comentarios de todos los usuarios
    const allComments = allUsers
      .map((user) => user.publicMetadata?.commentsHtmlCss || [])
      .flat(); // Aplana el array para obtener una lista única de comentarios

    return NextResponse.json({ comments: allComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);

    // Lee los datos del FormData
    const { content, parentId } = await parseFormData(req);

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Crea un nuevo comentario con un id único
    const newComment = {
      id: uuidv4(), // Genera un id único
      content,
      fileUrl: null,
      replies: [],
      createdAt: new Date().toISOString(),
      user: user.username || "Usuario anonimo", // Usa el username del usuario o un valor por defecto
      userId: userId, // Agrega el userId para referencia
    };

    // Actualiza los comentarios en todos los usuarios
    const allUsers = await clerkClient.users.getUserList();
    for (const u of allUsers) {
      const existingComments = (u.publicMetadata?.commentsHtmlCss || []) as any[];

      // Verifica si el comentario ya existe para evitar duplicados
      const isDuplicate = existingComments.some((comment) => comment.id === newComment.id);
      if (isDuplicate) continue;

      let updatedComments: any[];

      if (parentId) {
        // Es una respuesta a un comentario existente
        updatedComments = existingComments.map((comment: any) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        });
      } else {
        // Es un comentario nuevo
        updatedComments = [...existingComments, { ...newComment, userId: u.id }];
      }

      // Actualiza el `publicMetadata` del usuario
      await clerkClient.users.updateUser(u.id, {
        publicMetadata: {
          ...u.publicMetadata,
          commentsHtmlCss: updatedComments,
        },
      });
    }

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
export async function DELETE() {
  try {
    const allUsers = await clerkClient.users.getUserList();

    for (const u of allUsers) {
      await clerkClient.users.updateUser(u.id, {
        publicMetadata: {
          points: u.publicMetadata?.points ?? 0,
          retosResueltos: u.publicMetadata?.retosResueltos ?? 0,
          commentsHtmlCss: [] // Borra todos los comentarios
        }
      });
    }

    return NextResponse.json({ success: true, message: "Comentarios borrados en todos los usuarios" });
  } catch (error) {
    console.error("Error borrando comentarios:", error);
    return NextResponse.json({ error: "Error borrando comentarios" }, { status: 500 });
  }
}