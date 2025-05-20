
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';
import { getFirebaseUsers, combineUsers } from '@/lib/firebase/users.service';
import { useUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';


interface UserRanking {
  id: string;
  name: string;
  email: string;
  points: number;
}

export async function GET() {
  try {
    // Obtener usuarios de Clerk
    const clerkUsers = await clerkClient.users.getUserList();

    // Obtener usuarios de Firebase
    const firebaseUsers = await getFirebaseUsers();

    // Combinar datos
    const combinedUsers = combineUsers(clerkUsers, firebaseUsers);

    return NextResponse.json(combinedUsers, { status: 200 });
  
} catch (error) {
  console.error('Error al obtener el ranking:', error);
  return NextResponse.json(
    { error: 'Error al obtener el ranking' },
    { status: 500 }
  );
}
}