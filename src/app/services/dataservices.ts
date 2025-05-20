import { getCombinedUsers, type FirebaseUser } from '@/lib/firebase/users.service';

export interface UsuarioRanking {
  id: string;
  nombre: string;
  puntos: number;
  imagen?: string;
  retosResueltos: number;
}

export async function obtenerUsuarios(): Promise<UsuarioRanking[]> {
  try {
    const combinedUsers = await getCombinedUsers();
    
    return combinedUsers.map((user: FirebaseUser) => ({
      id: user.id,
      nombre: user.clerkData?.username || user.displayName || 'Usuario',
      puntos: user.puntos ?? 0,
      retosResueltos: user.retos_completados?? 0,
      imagen: user.clerkData?.imageUrl,
    }));
  } catch (error) {
    console.error('🚨 Error obteniendo usuarios combinados:', error);
    throw new Error('Error al cargar datos de usuarios', { cause: error });
  }
}
