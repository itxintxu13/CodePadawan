import { SignOutButton } from "@clerk/nextjs";
import CodeEditor from "../components/CodeEditor";

export default function Dashboard() {

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold  text-center ">Bienvenido al Dashboard 🚀</h1>
      <p className="text-lg text-gray-600 mt-4 text-center">
        Aquí puedes gestionar tu cuenta y explorar contenido exclusivo.
      </p>
      <CodeEditor/>
      <SignOutButton>Cerrar sesion</SignOutButton>
    </main>
  );
}
