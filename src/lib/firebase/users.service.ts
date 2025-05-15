import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { handleFirebaseError } from './error-handler';
import { clerkClient } from '@clerk/clerk-sdk-node';

export interface FirebaseUser {
  id: string;
  email: string;
  displayName?: string;
  puntos?: number;

  clerkData?: {
    username?: string | null;
    imageUrl?: string;
    createdAt?: number;
  };
  retos_completados?: number;
}

export async function getCombinedUsers() {
  const firebaseUsers = await getFirebaseUsers();
  const clerkUsers = await clerkClient.users.getUserList();

  return firebaseUsers.map(fbUser => {
    const clerkUser = clerkUsers.find(cu => cu.id === fbUser.id);
    return {
      ...fbUser,
      clerkData: {
        username: clerkUser?.username,
        imageUrl: clerkUser?.imageUrl,
        createdAt: clerkUser?.createdAt
      }
    };
  }).sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
}

export async function getFirebaseUsers(): Promise<FirebaseUser[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email || 'default@example.com',
      puntos: doc.data().puntos,
      retos_completados: doc.data().retos_completados,
      id_clerk: doc.data().id_clerk, // Asegurar que se obtenga el campo 'id_clerk'
      ...doc.data()
    }) as FirebaseUser);
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
}

export function combineUsers(clerkUsers: any[], firebaseUsers: FirebaseUser[]) {
  return clerkUsers.map(clerkUser => {
    const firebaseUser = firebaseUsers.find(u => u.id === clerkUser.id);
    return {
      id: clerkUser.id,
      name: clerkUser.fullName,
      email: clerkUser.emailAddress,
      puntos: firebaseUser?.puntos || 0,
      retos_completados: firebaseUser?.retos_completados || 0,
      username: clerkUser.username,
    
    };
  });
}