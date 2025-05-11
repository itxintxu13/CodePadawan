"use client";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Logo + Navegación */}
      <div className="flex items-center gap-6">
        <span className="text-2xl"><Link href="/dashboard">🚀</Link></span>
        <div className="flex gap-4">
          <Link href="/retos" className="hover:text-blue-400 transition-colors">
            Retos
          </Link>
          <Link href="/ranking" className="hover:text-blue-400 transition-colors">
            Ranking
          </Link>
          <Link href="/blog" className="hover:text-blue-400 transition-colors">
            Blog
          </Link>
        </div>
      </div>

      {/* Perfil + Notificaciones */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <span className="text-xl">🔔</span>
          {/* Indicador de nuevas notificaciones */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <UserButton/>
        <Link href="/user-profile" className="hover:text-gray-300">
          Perfil
        </Link>
      </div>
    </nav>
  );
}
