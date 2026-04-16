export function guardarSesion(usuario) {
  localStorage.setItem("usuario_activo", JSON.stringify(usuario));
}

export function obtenerSesion() {
  const usuario = localStorage.getItem("usuario_activo");
  return usuario ? JSON.parse(usuario) : null;
}

export function cerrarSesionSistema() {
  localStorage.removeItem("usuario_activo");
}