import React from "react";

function MenuEstudiante({ seccionActiva, setSeccionActiva, cerrarSesion }) {
  return (
    <aside className="sidebar">
      <h2>Estudiante</h2>

      <button
        className={seccionActiva === "datos" ? "activo" : ""}
        onClick={() => setSeccionActiva("datos")}
      >
        Datos personales
      </button>

      <button
        className={seccionActiva === "perfil" ? "activo" : ""}
        onClick={() => setSeccionActiva("perfil")}
      >
        Perfil
      </button>

      <button
        className={seccionActiva === "registro-horario" ? "activo" : ""}
        onClick={() => setSeccionActiva("registro-horario")}
      >
        Registro de horario
      </button>

      <button
        className={seccionActiva === "ver-horario" ? "activo" : ""}
        onClick={() => setSeccionActiva("ver-horario")}
      >
        Ver horario
      </button>

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </aside>
  );
}

export default MenuEstudiante;