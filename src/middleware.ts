import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define las rutas protegidas
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",  // Protege todo lo que esté bajo /dashboard
  "/api/(.*)",       // Protege las rutas API si lo deseas
]);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth(); // Esperamos a obtener la promesa

  if (isProtectedRoute(req)) {
    // Verificamos si el usuario está autenticado
    if (!authObj.userId) {
      // Si no está autenticado, redirigimos al inicio de sesión
      return Response.redirect("/sign-in", 302);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // Ignora los archivos estáticos
  ],
};





