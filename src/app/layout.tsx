import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import { shadesOfPurple } from "@clerk/themes";

// LO QUE HAY AQUI SE APLICA A TODAS LAS PAGINAS
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: shadesOfPurple }}>
      <html lang="es">
        <body className="antialiased flex flex-col">
          <SignedIn>
            <Navbar />
          </SignedIn>

          {/* Asegurar que main solo ocupe el espacio necesario */}
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
