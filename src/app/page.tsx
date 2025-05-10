import { SignIn, SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto text-center p-8">
      <h1 className="text-4xl font-bold">Bienvenido a CodePadawan 🚀</h1>
      <p className="text-lg text-gray-600 mt-4">
        Una plataforma para aprender y compartir conocimiento sobre desarrollo.
      </p>

      <div className="mt-8 flex gap-4 justify-center">
        <SignIn redirectUrl="/dashboard" />
      </div>
    </main>
  );
}
