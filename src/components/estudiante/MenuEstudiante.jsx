import React from "react";

function MenuEstudiante({ seccionActiva, setSeccionActiva, cerrarSesion }) {
  return (
    <aside className="sidebar">
      <h2>Estudiante</h2>

      <button
        className={seccionActiva === "datos" ? "activo" : ""}
        onClick={() => setSeccionActiva("datos")}
      >
        Registro mi Perfil
      </button>

      <button
        className={seccionActiva === "perfil" ? "activo" : ""}
        onClick={() => setSeccionActiva("perfil")}
      >
        Perfil
      </button>

      <button
        className={
          seccionActiva === "registro-horario" || seccionActiva === "ver-horario"
            ? "activo"
            : ""
        }
        onClick={() => setSeccionActiva("ver-horario")}
      >
        Horario académico
      </button>

      <button
        className={seccionActiva === "autoridades" ? "activo" : ""}
        onClick={() => setSeccionActiva("autoridades")}
      >
        Autoridades
      </button>

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </aside>
  );
}

export default MenuEstudiante;