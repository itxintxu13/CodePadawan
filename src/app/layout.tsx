import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from './components/NavBar';

// LO QUE HAY AQUI SE APLICA A TODAS LAS PAGINAS

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="antialiased">
          <Navbar />
          <main>{children}</main>
          <footer className="p-4 text-center text-sm text-gray-500">
            © 2025 CodePadawan - Todos los derechos reservados.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}