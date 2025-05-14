import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, rol } = await request.json();
    
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        rol: rol
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    return NextResponse.json(
      { error: 'Error actualizando rol' },
      { status: 500 }
    );
  }
}