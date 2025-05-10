import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto text-center p-8">
      <h1 className="text-4xl font-bold">Bienvenido a CodePadawan 🚀</h1>
      <p className="text-lg text-gray-600 mt-4">
        Una plataforma para aprender y compartir conocimiento sobre desarrollo.
      </p>

      <div className="mt-8 flex gap-4 justify-center">
        <a href="/sign-in" className="px-4 py-2 bg-blue-500 text-white rounded">
          Iniciar sesión
        </a>
        <a href="/sign-up" className="px-4 py-2 bg-green-500 text-white rounded">
          Registrarse
        </a>
      </div>
    </main>
  );
}
