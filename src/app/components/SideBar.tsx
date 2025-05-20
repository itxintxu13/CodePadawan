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
    <div className="hidden md:flex min-h-screen md:w-64 lg:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-col p-4 shadow-lg overflow-y-auto">
      {/* Botón hamburguesa para móvil */}
      <button className="md:hidden p-2 mb-4 text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <nav className="flex flex-col gap-2 md:gap-4 flex-grow mt-2 md:mt-5 ml-2 md:ml-5">
        {/* Elementos del menú con iconos responsive */}
        {rol === "padawan" && (
          <a href="/dashboard/padawan" className="hover:bg-green-800/70 p-2 md:p-3 rounded-lg flex items-center">
            <img src="/padawan-symbol.svg" alt="Padawan Logo" className="mr-2 md:mr-3 w-5 h-5 md:w-7 md:h-7 flex-shrink-0" />
            <span className="text-sm md:text-base truncate">Dashboard</span>
          </a>
        )}
        
        {rol === "jedi" && (
          <a href="/dashboard/jedi" className="hover:bg-blue-800/70 p-3 rounded-lg flex items-center">
            <img src="/jedi-symbol.svg" alt="Jedi Logo" className="mr-3 w-7 h-7" />
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
              <img src="/icons/logout-modern.svg" alt="Cerrar sesión" className="mr-3 w-6 h-6" />
              <span>Cerrar sesión</span>
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}


