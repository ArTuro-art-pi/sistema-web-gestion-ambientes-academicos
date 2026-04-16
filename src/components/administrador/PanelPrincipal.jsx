import React from "react";

function PanelPrincipal({ setSeccionActiva }) {
  return (
    <div>
      <h2>Bienvenida al panel principal de secretaría</h2>
      <p style={{ marginTop: "10px" }}>
        Desde este módulo podrá gestionar el préstamo de llaves, consultar
        horarios por carrera, registrar docentes y generar reportes
        administrativos.
      </p>

      <div className="card-grid" style={{ marginTop: "25px" }}>
        <div className="info-card">
          <strong>Préstamo de llaves</strong>
          <br />
          Registro y control de entrega
        </div>

        <div className="info-card">
          <strong>Horarios por carrera</strong>
          <br />
          Consulta de horarios académicos
        </div>

        <div className="info-card">
          <strong>Registro de docentes</strong>
          <br />
          Administración de personal docente
        </div>

        <div className="info-card">
          <strong>Reportes</strong>
          <br />
          Generación de reportes del sistema
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Accesos rápidos</h3>

      <div className="card-grid" style={{ marginTop: "20px" }}>
        <div
          className="info-card acceso-card"
          onClick={() => setSeccionActiva("prestamo-llaves")}
        >
          Ir a préstamo de llaves
        </div>

        <div
          className="info-card acceso-card"
          onClick={() => setSeccionActiva("horario-carrera")}
        >
          Ver horario por carrera
        </div>

        <div
          className="info-card acceso-card"
          onClick={() => setSeccionActiva("registro-docentes")}
        >
          Registrar docente
        </div>

        <div
          className="info-card acceso-card"
          onClick={() => setSeccionActiva("lista-docentes")}
        >
          Lista de docentes
        </div>

        <div
          className="info-card acceso-card"
          onClick={() => setSeccionActiva("reportes")}
        >
          Ver reportes
        </div>
      </div>
    </div>
  );
}

export default PanelPrincipal;