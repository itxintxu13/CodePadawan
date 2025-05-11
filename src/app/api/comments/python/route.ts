import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "src/app/blog/python/comments.json");
const uploadDir = path.join(process.cwd(), "public/uploads");

// 🔹 Asegurar que las carpetas necesarias existen
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ comments: [] }, null, 2));
}

// ✅ Obtener comentarios (GET)
export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const comments = JSON.parse(data);
    console.log("📤 Comentarios cargados:", comments);

    return NextResponse.json(comments);
  } catch (error) {
    console.error("❌ Error al leer los comentarios:", error);
    return NextResponse.json({ error: "Error al leer los comentarios" }, { status: 500 });
  }
}

// ✅ Guardar comentario con posible archivo adjunto (POST)
export async function POST(req: Request) {
  try {
    let parentId, user, content, file;
    
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      parentId = formData.get("parentId") as string;
      user = formData.get("user") as string;
      content = formData.get("content") as string;
      file = formData.get("file") as File;
    } else {
      const jsonData = await req.json();
      parentId = jsonData.parentId;
      user = jsonData.user;
      content = jsonData.content;
      file = jsonData.image;
    }

    console.log("📝 Comentario recibido:", { parentId, user, content, file });

    const data = fs.readFileSync(filePath, "utf-8");
    const comments = JSON.parse(data);

    let fileUrl = null;
    if (file && file instanceof File) {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePathToSave = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());

      fs.writeFileSync(filePathToSave, buffer);
      fileUrl = `/uploads/${fileName}`;
      console.log("✅ Archivo guardado en:", fileUrl);
    }

    const newComment = {
      id: Date.now().toString(),
      user,
      content,
      fileUrl,
      replies: [],
      timestamp: new Date().toISOString(),
    };

    if (parentId) {
      const parentComment = comments.comments.find((c: any) => c.id === parentId);
      if (!parentComment) {
        console.error("❌ Comentario original no encontrado:", parentId);
        return NextResponse.json({ error: "Comentario original no encontrado" }, { status: 404 });
      }
      parentComment.replies.push(newComment);
    } else {
      comments.comments.push(newComment);
    }

    console.log("📂 Guardando en JSON:", JSON.stringify(comments, null, 2));
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
    console.log("✅ Escritura en JSON completada");

    return NextResponse.json({ message: "Comentario guardado", comment: newComment });
  } catch (error) {
    console.error("❌ Error al guardar el comentario:", error);
    return NextResponse.json({ error: "Error interno al guardar el comentario" }, { status: 500 });
  }
}
