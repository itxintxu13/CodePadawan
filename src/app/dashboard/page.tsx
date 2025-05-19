"use client";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white p-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Panel general</h1>
        <p className="text-lg">Por favor, accede a tu dashboard correspondiente: <span className="font-semibold">/dashboard/padawan</span> o <span className="font-semibold">/dashboard/jedi</span>.</p>
      </div>
    </main>
  );
}
