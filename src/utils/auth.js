import usuariosIniciales from "../data/usuarios";

const STORAGE_KEY = "usuarios_sistema";

export function inicializarUsuarios() {
  const usuariosGuardados = localStorage.getItem(STORAGE_KEY);

  if (!usuariosGuardados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosIniciales));
  }
}

export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || usuariosIniciales;
}

export function validarLogin(rol, id, password) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios[rol].find(
    (u) => u.id === id && u.password === password
  );
  return usuario;
}

export function cambiarPassword(rol, id, nuevaPassword) {
  const usuarios = obtenerUsuarios();

  const indice = usuarios[rol].findIndex((u) => u.id === id);

  if (indice === -1) {
    return false;
  }

  usuarios[rol][indice].password = nuevaPassword;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  return true;
}