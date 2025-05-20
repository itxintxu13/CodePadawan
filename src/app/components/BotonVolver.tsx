"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors duration-200 flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver
    </button>
  );
}
