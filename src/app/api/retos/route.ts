import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Ruta al archivo JSON de retos
    const filePath = path.join(process.cwd(), 'src/app/data/retos.json');
    
    // Leer el archivo
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parsear el JSON
    const retos = JSON.parse(fileContents);
    
    // Devolver los retos como respuesta
    return NextResponse.json(retos);
  } catch (error) {
    console.error('Error al cargar los retos:', error);
    return NextResponse.json(
      { error: 'Error al cargar los retos' },
      { status: 500 }
    );
  }
}

// API para guardar el progreso del usuario
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, retoId, codigo, lenguaje, puntos } = data;
    
    if (!userId || !retoId || !codigo || !lenguaje) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    
    // Aquí se guardaría en Clerk los datos del usuario
    // Como ejemplo, solo devolvemos los datos recibidos
    return NextResponse.json({
      success: true,
      message: 'Solución guardada correctamente',
      data: {
        userId,
        retoId,
        codigo,
        lenguaje,
        puntos,
        fechaEntrega: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error al guardar la solución:', error);
    return NextResponse.json(
      { error: 'Error al guardar la solución' },
      { status: 500 }
    );
  }
}