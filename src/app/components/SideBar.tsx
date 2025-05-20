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
      <nav className="flex flex-col gap-4 flex-grow mt-5 ml-5">
        {/* Dashboard según rol */}
        {rol === "padawan" && (
          <a href="/dashboard/padawan" className="hover:bg-green-800/70 p-3 rounded-lg flex items-center">
            <img src="/padawan-symbol.svg" alt="Padawan Logo" className="mr-3 w-7 h-7" />
            <span>Dashboard</span>
          </a>
        )}
        {rol === "padawan" && (
        <a href="/retos" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <img src="/icons/sidebar-retos.svg" alt="Retos" className="mr-3 w-6 h-6" />
          <span>Retos</span>
        </a> )}
        <a href="/ranking" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <img src="/icons/new-sidebar-ranking.svg" alt="Ranking" className="mr-3 w-6 h-6" />
          <span>Ranking</span>
        </a>
        <a href="/user-profile?tab=playground" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
          <img src="/icons/sidebar-playground.svg" alt="Playground" className="mr-3 w-6 h-6" />
          <span>Playground</span>
        </a>

        {/* Solo para padawan */}
        {rol === "padawan" && (
          <a href="/user-profile?tab=logros" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
            <img src="/icons/new-sidebar-achievement.svg" alt="Logros" className="mr-3 w-6 h-6" />
            <span>Mis logros</span>
          </a>
        )}

        
        {rol === "jedi" && (
          <a href="/dashboard/jedi" className="hover:bg-blue-800/70 p-3 rounded-lg flex items-center">
            <img src="/jedi-symbol.svg" alt="Jedi Logo" className="mr-3 w-7 h-7" />
            <span>Dashboard</span>
          </a>
        )}

        <div className="pb-4">
          <a href="/user-profile?tab=about" className="hover:bg-gray-700 p-3 rounded-lg flex items-center">
            <img src="/icons/new-sidebar-about.svg" alt="Holocrón" className="mr-3 w-6 h-6" />
            <span>Holocrón</span>
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


