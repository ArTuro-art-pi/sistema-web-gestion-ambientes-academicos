import React from "react";

function MenuAdmin({ seccionActiva, setSeccionActiva, cerrarSesion }) {
  return (
    <aside className="sidebar">
      <h2>Secretaría</h2>

      <button
        className={seccionActiva === "panel" ? "activo" : ""}
        onClick={() => setSeccionActiva("panel")}
      >
        Panel principal
      </button>

      <button
        className={seccionActiva === "estado-aulas" ? "activo" : ""}
        onClick={() => setSeccionActiva("estado-aulas")}
      >
        Estado de aulas
      </button>

      <button
        className={seccionActiva === "prestamo-llaves" ? "activo" : ""}
        onClick={() => setSeccionActiva("prestamo-llaves")}
      >
        Préstamo de llaves
      </button>

      <button
        className={seccionActiva === "horario-carrera" ? "activo" : ""}
        onClick={() => setSeccionActiva("horario-carrera")}
      >
        Horario por carrera
      </button>

      <button
        className={seccionActiva === "registro-docentes" ? "activo" : ""}
        onClick={() => setSeccionActiva("registro-docentes")}
      >
        Registro de docentes
      </button>

      <button
        className={seccionActiva === "lista-docentes" ? "activo" : ""}
        onClick={() => setSeccionActiva("lista-docentes")}
      >
        Lista de docentes
      </button>

      <button
        className={seccionActiva === "reportes" ? "activo" : ""}
        onClick={() => setSeccionActiva("reportes")}
      >
        Reportes
      </button>

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </aside>
  );
}

export default MenuAdmin;