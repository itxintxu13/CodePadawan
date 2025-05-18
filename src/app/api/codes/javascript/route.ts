import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ref, push, get, set } from "firebase/database";
import { initializeApp, getApps, getApp } from "firebase/app";

// Configuración de Firebase (usa la misma que ya tienes)
const firebaseConfig = { 
  apiKey: "AIzaSyCks4yUeDnd8gZKVh12Z0x6mSgNJEnqWWs",
  authDomain: "codepadawan-e909a.firebaseapp.com",
  databaseURL: "https://codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "codepadawan-e909a",
  storageBucket: "codepadawan-e909a-default-rtdb.europe-west1.firebasedatabase.app",
  messagingSenderId: "739998345731",
  appId: "1:739998345731:web:a6e9e036438359eac33c36",
  measurementId: "G-EFRX0BPMG0"    
};

// Inicialización de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

// Endpoint GET para obtener código JavaScript por ID
export async function GET(req: NextRequest) {
  // Extrae el ID del código de los parámetros de la URL
  const id = req.nextUrl.searchParams.get("id");
  
  // Valida que se haya proporcionado un ID
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  
  // Obtiene el código de Firebase
  const snap = await get(ref(database, `blogs/javascript/codes/${id}`));
  
  // Retorna el código o una cadena vacía si no existe
  return NextResponse.json({ code: snap.val()?.code || "" });
}

// Endpoint POST para guardar nuevo código JavaScript
export async function POST(req: NextRequest) {
  // Extrae el código del cuerpo de la solicitud
  const { code } = await req.json();
  
  // Valida que se haya proporcionado código
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });
  
  // Crea una nueva referencia en Firebase
  const newRef = push(ref(database, "blogs/javascript/codes"));
  
  // Guarda el código en Firebase
  await set(newRef, { code });
  
  // Retorna el ID del código guardado
  return NextResponse.json({ id: newRef.key });
}