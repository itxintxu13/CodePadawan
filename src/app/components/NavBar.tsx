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

  const dashboardLink = rol === "padawan" ? "/dashboard/padawan" : rol === "jedi" ? "/dashboard/jedi" : "/dashboard";

  return (
    <nav className="bg-gray-950 text-white px-8 py-3 flex items-center justify-between shadow-md border-b border-gray-800">
      {/* Logo + Navegación */}
      <div className="flex items-center gap-8">
        <Link href={dashboardLink} className="flex items-center gap-4 group">
          <div className="bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-500 rounded-full p-1.5 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 border border-white/40 ring-2 ring-blue-400/40 ring-offset-2 ring-offset-gray-950" style={{ width: 76, height: 76, boxShadow: '0 4px 24px 0 #7c3aed55' }}>
            <img src="/logo.svg" alt="Logo CodePadawan" style={{ width: 62, height: 62, display: 'block', filter: 'drop-shadow(0 4px 16px #7c3aedcc) brightness(1.18) contrast(1.12)' }} className="rounded-full transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="text-3xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 drop-shadow-2xl select-none ml-4">CodePadawan</span>
        </Link>
        <div className="flex gap-6 ml-6">
          {rol !== "jedi" && (
            <Link href="/retos" className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60">
              Retos
            </Link>
          )}
          <Link href="/ranking" className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60">
            Ranking
          </Link>
          <Link href="/blog" className="hover:text-blue-400 transition-colors font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60">
            Blog
          </Link>
        </div>
      </div>

      {/* Perfil + Notificaciones */}
      <div className="flex items-center gap-8">
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'ring-2 ring-blue-400 ring-offset-2' } }} />
        <Link href="/user-profile" className="hover:text-gray-300 font-semibold text-lg px-2 py-1 rounded-lg hover:bg-gray-800/60">
          Área personal
        </Link>
      </div>
    </nav>
  );
}
