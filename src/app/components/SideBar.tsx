"use client";
import React from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const rol =
    typeof user?.publicMetadata?.rol === "string"
      ? user.publicMetadata.rol
      : undefined;

  return (
    <div className="min-h-screen w-1/5 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col p-4 shadow-lg overflow-y-auto">
      <nav className="flex flex-col gap-4 flex-grow">
        <a href="/retos" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <span className="mr-3 text-yellow-400">🏆</span>
          <span>Retos</span>
        </a>
        <a href="/ranking" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <span className="mr-3 text-green-400">📊</span>
          <span>Ranking</span>
        </a>
        <a href="/user-profile?tab=playground" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <span className="mr-3 text-white-400">🎮</span>
          <span>Playground</span>
        </a>

        {/* Solo para padawan */}
        {rol === "padawan" && (
          <a href="/user-profile?tab=logros" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
            <span className="mr-3 text-pink-400">🎯</span>
            <span>Mis logros</span>
          </a>
        )}

        {/* Dashboard según rol */}
        {rol === "padawan" && (
          <a href="/dashboard/padawan" className="hover:bg-green-800/70 p-3 rounded-lg flex items-center">
            <span className="mr-3 text-green-300">🌱</span>
            <span>Dashboard Padawan</span>
          </a>
        )}
        {rol === "jedi" && (
          <a href="/dashboard/jedi" className="hover:bg-blue-800/70 p-3 rounded-lg flex items-center">
            <span className="mr-3 text-blue-300">🧙</span>
            <span>Dashboard Jedi</span>
          </a>
        )}

        <div className="pb-4">
          <a href="/user-profile?tab=about" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
            <span className="mr-3 text-blue-400">ℹ️</span>
            <span>Acerca de nosotros</span>
          </a>
        </div>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="hover:bg-gray-700 p-3 rounded-lg flex items-center group cursor-pointer">
          <SignOutButton>
            <button className="flex items-center w-full text-left">
              <span className="mr-3 text-red-400">🔒</span>
              <span>Cerrar sesión</span>
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}


