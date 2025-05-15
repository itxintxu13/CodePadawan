export async function obtenerUsuarios() {
  try {
    const response = await fetch("/api/updatePoints");
    if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

    const data = await response.json();
    console.log("📌 Datos crudos recibidos desde la API:", data); // ✅ Muestra los datos sin procesar

    return data.map((user: any) => ({
      id: user.id,
      nombre: user.username || "Usuario",
      puntos: Number(user.points ?? 0), // ✅ Puntos bien procesados
      retosResueltos: Number(user.retosResueltos ?? 0), // ✅ Retos ahora siempre será un número
    }));
  } catch (error) {
    console.error("🚨 Error obteniendo usuarios:", error);
    return [];
  }
}
