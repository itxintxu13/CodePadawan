import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Usa la API correcta
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Importación correcta para Server Components

export async function GET() {
  try {
    const users = await clerkClient.users.getUserList();
    const userIds = users.map(user => ({ id: user.id,username: user.username, points: user.publicMetadata.points, retosResueltos: Number(user.publicMetadata?.retosResueltos ?? 0) }));

    return NextResponse.json(userIds);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return NextResponse.json({ error: "Error obteniendo usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, points, retosResueltos } = await req.json();

    // Obtener el usuario actual
    const user = await clerkClient.users.getUser(userId);
   // ✅ Asegurar que `points` y `retosResueltos` sean valores numéricos correctos
    const puntosActuales = Number(user.publicMetadata?.points ?? 0); // 🔥 Convertimos a número
    const retosResueltosActuales = Number(user.publicMetadata.retosResueltos ?? 0 )


    // Actualizar los puntos en Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        points: puntosActuales + points,
        retosResueltos: retosResueltosActuales + 1, // 🔥 Ahora estamos sumando retos completados
      },
    });

    return NextResponse.json({ success: true, points: puntosActuales + points, retosResueltos: retosResueltosActuales + 1});
  } catch (error) {
    console.error("Error actualizando puntos:", error);
    return NextResponse.json({ error: "Error actualizando puntos" }, { status: 500 });
  }
}

