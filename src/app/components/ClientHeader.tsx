// src/app/components/ClientHeader.tsx
"use client";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./NavBar"), { ssr: false });
const RolUpdater = dynamic(() => import("./Rol"), { ssr: false });

export default function ClientHeader() {
  return (
    <>
      <Navbar />
      <RolUpdater />
    </>
  );
}
