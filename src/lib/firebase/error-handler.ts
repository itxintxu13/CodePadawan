import type { FirebaseError } from 'firebase/app';

export interface ErrorResult {
  code: string;
  message: string;
  originalError?: unknown;
}

export function handleFirebaseError(error: unknown): ErrorResult {
  if (typeof error !== 'object' || error === null) {
    return {
      code: 'unknown',
      message: 'Error desconocido',
      originalError: error
    };
  }

  const firebaseError = error as FirebaseError;
  
  // Errores de autenticación
  if ('code' in firebaseError && firebaseError.code.startsWith('auth/')) {
    return {
      code: firebaseError.code,
      message: getAuthErrorMessage(firebaseError.code),
      originalError: firebaseError
    };
  }

  // Errores generales de Firebase
  if ('code' in firebaseError) {
    return {
      code: firebaseError.code,
      message: 'Error en la operación de Firebase',
      originalError: firebaseError
    };
  }

  // Fallback para errores no controlados
  return {
    code: 'unhandled',
    message: 'Error no controlado',
    originalError: error
  };
}

function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/user-disabled': 'Cuenta deshabilitada',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El correo ya está registrado',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/operation-not-allowed': 'Operación no permitida'
  };

  return messages[code] || 'Error de autenticación';
}