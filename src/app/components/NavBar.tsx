"use client";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const rol =
    typeof user?.publicMetadata?.rol === "string"
      ? user.publicMetadata.rol
      : undefined;

  const dashboardLink =
    rol === "padawan"
      ? "/dashboard/padawan"
      : rol === "jedi"
      ? "/dashboard/jedi"
      : "/dashboard";

  return (
    <nav
      className="text-white px-4 md:px-8 py-3 flex flex-wrap md:flex-nowrap items-center justify-between shadow-md border-b border-gray-800"
      style={{ backgroundColor: "#050E21" }}
    >
      {/* Logo + Navegación */}
      <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
        <Link href={dashboardLink} className="flex items-center gap-2 md:gap-4 group">
          <div
            className="bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-500 rounded-full p-1.5 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 border border-white/40 ring-2 ring-blue-400/40 ring-offset-2 ring-offset-gray-950"
            style={{
              width: 56,
              height: 56,
              boxShadow: "0 4px 24px 0 #7c3aed55",
            }}
          >
            <img
              src="/Logop.jpg"
              alt="Logo CodePadawan"
              style={{
                width: 44,
                height: 44,
                display: "block",
                filter:
                  "drop-shadow(0 4px 16px #7c3aedcc) brightness(1.18) contrast(1.12)",
              }}
              className="rounded-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <img
            src="/letrasCorregidaspng.png"
            alt="CodePadawan"
            className="h-10 w-auto select-none transition-transform group-hover:scale-105"
          />
        </Link>
        {/* Botón menú hamburguesa para móvil */}
        <div className="md:hidden ml-auto">
          {/* Aquí puedes agregar un botón para abrir un menú lateral en móvil si lo deseas */}
        </div>
      </div>
      <div className="hidden md:flex gap-6 ml-0 md:ml-6">
        {rol !== "jedi" && (
          <Link
            href="/retos"
            className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60"
          >
            Retos
          </Link>
        )}
        <Link
          href="/ranking"
          className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60"
        >
          Ranking
        </Link>
        <Link
          href="/blog"
          className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60"
        >
          Blog
        </Link>
      </div>
      {/* Menú móvil */}
      <div className="flex md:hidden w-full mt-4 gap-2 justify-center">
        {rol !== "jedi" && (
          <Link
            href="/retos"
            className="hover:text-blue-400 transition-colors font-semibold text-base px-2 py-1 rounded-lg hover:bg-gray-800/60"
          >
            Retos
          </Link>
        )}
        <Link
          href="/ranking"
          className="hover:text-blue-400 transition-colors font-semibold text-base px-2 py-1 rounded-lg hover:bg-gray-800/60"
        >
          Ranking
        </Link>
        <Link
          href="/blog"
          className="hover:text-blue-400 transition-colors font-semibold text-base px-2 py-1 rounded-lg hover:bg-gray-800/60"
        >
          Blog
        </Link>
      </div>
      {/* Perfil + Notificaciones */}
      <div className="flex items-center gap-4 md:gap-8 mt-4 md:mt-0 w-full md:w-auto justify-end">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "ring-2 ring-blue-400 ring-offset-2" },
          }}
        />
        <Link
          href="/user-profile"
          className="hover:text-gray-300 font-semibold text-base md:text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60"
        >
          Área personal
        </Link>
      </div>
    </nav>
  );
}
