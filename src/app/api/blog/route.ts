import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { title, content } = data;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Aquí implementarías la lógica para guardar el post
    // Por ejemplo, guardando en un archivo JSON o base de datos

    return NextResponse.json({
      success: true,
      post: {
        id: Date.now(),
        title,
        content,
        author: user.id,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}