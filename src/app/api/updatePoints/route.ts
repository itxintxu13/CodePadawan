import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Usa la API correcta
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Importación correcta para Server Components

export async function GET() {
  try {
    const users = await clerkClient.users.getUserList();
    const userIds = users.map(user => ({ id: user.id,username: user.username, points: user.publicMetadata.points }));

    return NextResponse.json(userIds);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return NextResponse.json({ error: "Error obteniendo usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, points } = await req.json();

    await clerkClient.users.updateUser(userId, { // ✅ Usa clerkClient correctamente
      publicMetadata: { points },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando puntos:", error);
    return NextResponse.json({ error: "Error actualizando puntos" }, { status: 500 });
  }
}

