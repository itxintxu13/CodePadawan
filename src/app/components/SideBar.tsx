"use client";
import React from "react";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <nav className="flex flex-col gap-4">
        <a href="/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</a>
        <a href="/mis-cursos" className="hover:bg-gray-700 p-2 rounded">Mis Cursos</a>
        <a href="/perfil" className="hover:bg-gray-700 p-2 rounded">Retos</a>
        <a href="/perfil" className="hover:bg-gray-700 p-2 rounded">FeedBack</a>
      </nav>
    </div>
  );
}
