"use client";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Logo + Mis Cursos */}
      <div className="flex items-center gap-4">
        <span className="text-2xl"><a href="/dashboard">🚀</a></span>
      </div>

      {/* Perfil + Notificaciones */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <span className="text-xl">🔔</span>
          {/* Indicador de nuevas notificaciones */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <UserButton/>
        <a href="/user-profile" className="hover:text-gray-300">
          Perfil
        </a>
      </div>
    </nav>
  );
}
