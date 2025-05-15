"use client";
import React from "react";
import { SignOutButton } from "@clerk/nextjs";

export default function Sidebar() {
  return (
<div className="h-screen w-1/5 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col p-4 shadow-lg overflow-y-auto">      <div className="mb-6">
{/* <p className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-transparent bg-clip-text tracking-wider text-center mt-2 pb-2 px-4 py-2 border border-gray-600 rounded-md shadow-lg">
  Que el código te acompañe.
</p> */}
      </div>

      <nav className="flex flex-col gap-4 flex-grow">
        <a
          href="/retos"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group "
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
          href="/user-profile?tab=playground"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-white-400 group-hover:text-purple-300 transition-colors duration-200">
            🎮
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Playground
          </span>
        </a>
      <div className="pb-4">
       <a
          href="/user-profile?tab=about"
          className="hover:bg-gray-700 p-3 rounded-lg flex items-center transition-all duration-200 hover:translate-x-1 hover:shadow-md group"
        >
          <span className="mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            ℹ️
          </span>
          <span className="group-hover:text-blue-100 transition-colors duration-200">
            Acerca de nosotros
          </span>
        </a>

      </div>
      </nav>
      

      <div className="mt-auto pt-4 border-t border-gray-700">
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
      </div>
    </div>
  );
}