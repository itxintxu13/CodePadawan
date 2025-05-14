import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { userId } = getAuth(req);

  // Si no está logueado, redirigir al inicio
  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// 🔒 Asegúrate de proteger todas las rutas necesarias
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/elige-rol',
    '/retos/:path*',
    '/ranking',
    '/perfil',
    '/profesor/:path*',
    // Añade aquí cualquier ruta privada que tengas
  ],
};








