"use client";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col p-4 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          CodePadawan
        </h2>
        <p className="text-sm text-gray-400">Tu camino hacia la maestría</p>
      </div>
      <nav className="flex flex-col gap-4">
        <a
          href="/dashboard"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            🏠
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Dashboard
          </span>
        </a>
        <a
          href="/retos"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200">
            🏆
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Retos
          </span>
        </a>
        <a
          href="/ranking"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-green-400 group-hover:text-green-300 transition-colors duration-200">
            📊
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Ranking
          </span>
        </a>
        <a
          href="/user-profile"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-white-400 group-hover:text-purple-300 transition-colors duration-200">
            👤
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Mi Perfil
          </span>
        </a>
        <div className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group cursor-pointer">
          <SignOutButton>
            <button className="flex items-center w-full text-left">
              <span className="mr-3 text-red-400 group-hover:text-red-300 transition-colors duration-200">
                🔒
              </span>
              <span className="group-hover:text-blue-100 transition-colors duration-200">
                Cerrar sesión
              </span>
            </button>
          </SignOutButton>
        </div>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-white flex items-center p-2 rounded hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="mr-2">ℹ️</span> Acerca de nosotros
        </a>
      </div>
    </div>
  );
}
