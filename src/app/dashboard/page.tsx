import { SignOutButton } from "@clerk/nextjs";

export default function Dashboard() {

  return (
    <main className="container mx-auto text-center p-8">
      <h1 className="text-4xl font-bold">Bienvenido al Dashboard 🚀</h1>
      <p className="text-lg text-gray-600 mt-4">
        Aquí puedes gestionar tu cuenta y explorar contenido exclusivo.
      </p>
      
      <SignOutButton>Cerrar sesion</SignOutButton>
    </main>
  );
}
