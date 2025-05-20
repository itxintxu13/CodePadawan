"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <>
      <style>{`
        .cl-footer {
          display: none !important;
        }
        .signin-prompt {
          color: rgba(255, 255, 255, 0.85);
          margin-top: 1rem;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
        }
        .signin-prompt a {
          color: #60a5fa; /* azul Tailwind (text-blue-400) */
          text-decoration: underline;
          font-weight: 600;
        }
        .signin-prompt a:hover {
          color: #3b82f6; /* azul más intenso al hover */
        }
      `}</style>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 px-4">
        <SignUp
          path="/sign-up"
          routing="path"
          appearance={{
            elements: {
              card: "bg-gradient-to-br from-purple-700 via-blue-600 to-teal-500 rounded-xl shadow-2xl border-none p-6",
              headerTitle:
                "text-2xl font-extrabold text-white flex items-center gap-2",
              headerSubtitle: "text-white/80 text-base font-medium",
              socialButtons: "flex flex-col gap-4 mt-6",
              socialButton:
                "bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-3 text-lg border-none",
              dividerRow: "my-6",
              dividerText: "text-white/70",
              formButtonPrimary:
                "bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 border-none",
              formFieldInput:
                "bg-gray-900 text-white border-none rounded-md focus:ring-2 focus:ring-purple-400",
              footerAction: "hidden", 
            },
            variables: {
              colorPrimary: "#a259f7",
              colorText: "#fff",
              colorBackground: "#181f2a",
              borderRadius: "1.25rem",
              fontSize: "1.1rem",
            },
          }}
          forceRedirectUrl="/dashboard"
        />
        <p className="signin-prompt">
          ¿Ya tienes cuenta?{" "}
          <a href="/sign-in">
            Entra aquí
          </a>
        </p>
      </div>
    </>
  );
}
