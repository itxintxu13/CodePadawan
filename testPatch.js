const updateMetadata = async () => {
  const response = await fetch("http://localhost:3000/api/update-user-metadata", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "USER_ID" }) // Reemplaza con un ID válido de Clerk
  });

  const data = await response.json();
  console.log("Respuesta del servidor:", data);
};

// Ejecutar la función
updateMetadata();
