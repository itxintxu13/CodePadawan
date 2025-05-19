import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "./globals.css";
import ClientHeader from "./components/ClientHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="antialiased flex flex-col">
          <SignedIn>
            <ClientHeader />
          </SignedIn>
          <main className="bg-gray-900 text-white flex-1 flex flex-col justify-center">
            {children}
          </main>
          <footer className="p-4 text-center text-sm bg-gray-900 text-white border-t border-gray-700">
            © 2025 CodePadawan - Todos los derechos reservados.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
