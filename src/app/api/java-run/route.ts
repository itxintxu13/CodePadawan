import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { exec } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  // Ruta segura para Main.java en el directorio temporal del proyecto
  const tempDir = process.cwd();
  const javaFile = path.join(tempDir, "Main.java");

  try {
    // Escribir el código en Main.java
    await writeFile(javaFile, code, { encoding: "utf-8" });

    // Ejecutar el código Java
    const output = await new Promise<string>((resolve) => {
      exec(
        `javac Main.java && java Main`,
        { cwd: tempDir, encoding: "utf8", timeout: 5000 },
        (error, stdout, stderr) => {
          if (error) {
            resolve(stderr || error.message);
          } else {
            resolve(stdout);
          }
        }
      );
    });

    // Eliminar el archivo después de ejecutar (opcional, pero recomendable)
    await unlink(javaFile).catch(() => {});

    return NextResponse.json({ output });
  } catch (err: any) {
    return NextResponse.json(
      { output: "Error ejecutando el código Java: " + err.message },
      { status: 500 }
    );
  }
}