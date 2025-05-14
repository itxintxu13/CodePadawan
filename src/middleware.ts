import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🔹 Aplica Clerk Middleware para asegurar la autenticación
export default clerkMiddleware();

// 🔹 Middleware personalizado para proteger rutas
export function protectedMiddleware(req: NextRequest) {
  const auth = getAuth(req); // ✅ Obtiene la autenticación correctamente

  // Si el usuario no está autenticado, redirigir al inicio
  if (!auth.userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// 🔒 Configuración de rutas protegidas
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/dashboard/:path*',
    '/elige-rol',
    '/retos/:path*',
    '/ranking',
    '/perfil',
    '/profesor/:path*',
  ],
};
