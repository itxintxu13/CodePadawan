import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
    const users = await clerkClient.users.getUserList();
    const baseUser = users[0];
    const comments = baseUser?.publicMetadata?.commentsPhyton || [];
    return NextResponse.json({ comments });
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

    // Lee los datos del FormData
    const { content, parentId } = await parseFormData(req);

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Obtén todos los usuarios
    const allUsers = await clerkClient.users.getUserList();

    // Usa los comentarios del primer usuario como base (o crea un array vacío si no hay)
    const baseUser = allUsers[0];
    const comments = (baseUser?.publicMetadata?.comments || []) as any[];

    let updatedComments: any[];

    if (parentId) {
      // Es una respuesta a un comentario existente
      updatedComments = comments.map((comment: any) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: Date.now().toString(),
                content,
                fileUrl: null,
                replies: [],
                createdAt: new Date().toISOString(),
                user: baseUser.username ?? baseUser.id ?? "Unknown"
              }
            ]
          };
        }
        return comment;
      });
    } else {
      // Es un comentario nuevo
      const newComment = {
        id: Date.now().toString(),
        content,
        fileUrl: null,
        replies: [],
        createdAt: new Date().toISOString(),
        user: baseUser.username ?? baseUser.id ?? "Unknown"
      };
      updatedComments = [...comments, newComment];
    }

    // Guarda los comentarios en TODOS los usuarios
    for (const u of allUsers) {
      await clerkClient.users.updateUser(u.id, {
        publicMetadata: {
          points: u.publicMetadata?.points ?? 0,
          retosResueltos: u.publicMetadata?.retosResueltos ?? 0,
          commentsPhyton: updatedComments
        }
      });
    }

    return NextResponse.json({ comment: updatedComments[updatedComments.length - 1] });
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
          commentsPhyton: [] // Borra todos los comentarios
        }
      });
    }

    return NextResponse.json({ success: true, message: "Comentarios borrados en todos los usuarios" });
  } catch (error) {
    console.error("Error borrando comentarios:", error);
    return NextResponse.json({ error: "Error borrando comentarios" }, { status: 500 });
  }
}