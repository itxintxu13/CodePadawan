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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  const snap = await get(ref(database, `blogs/html-css/codes/${id}`));
  return NextResponse.json({ code: snap.val()?.code || "" });
}

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });
  const newRef = push(ref(database, "blogs/html-css/codes"));
  await set(newRef, { code }); // <-- Cambia aquí
  return NextResponse.json({ id: newRef.key });
}
