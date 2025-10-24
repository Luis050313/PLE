// --- Archivo: js/mensajes.js ---

function mostrarMensaje(mensaje, tipo = "error") {
  // Eliminar cualquier mensaje previo
  const existente = document.getElementById("toast");
  if (existente) existente.remove();

  // Crear el contenedor principal
  const toast = document.createElement("div");
  toast.id = "toast";

  // Crear la tarjeta del mensaje
  const card = document.createElement("div");
  card.className = `toast-card ${tipo}`;
  card.textContent = mensaje;

  toast.appendChild(card);
  document.body.appendChild(toast);

  // Cerrar con clic (animación + eliminación)
  card.addEventListener("click", () => {
    card.style.animation = "toastOut 0.25s ease forwards";
    toast.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(() => toast.remove(), 250);
  });
}
