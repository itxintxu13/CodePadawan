import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

// Crear el archivo y la carpeta si no existen
await fs.mkdir(path.dirname(POSTS_FILE), { recursive: true });
try {
  await fs.access(POSTS_FILE);
} catch {
  await fs.writeFile(POSTS_FILE, JSON.stringify({ posts: [] }, null, 2));
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    const { posts } = JSON.parse(data);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error al obtener posts:', error);
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

    const existingData = await fs.readFile(POSTS_FILE, 'utf-8');
    const { posts } = JSON.parse(existingData);

    const newPost = {
      id: Date.now(),
      title,
      content,
      author: user.id,
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [...posts, newPost];
    await fs.writeFile(POSTS_FILE, JSON.stringify({ posts: updatedPosts }, null, 2));

    return NextResponse.json({ success: true, post: newPost });

  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}