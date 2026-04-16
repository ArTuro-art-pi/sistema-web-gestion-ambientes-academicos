import React from "react";
import { obtenerPerfilPorId, obtenerHorarioPorId } from "../../utils/estudianteStorage";

function DashboardInicio({ userId, setSeccionActiva }) {
  const perfil = obtenerPerfilPorId(userId);
  const horario = obtenerHorarioPorId(userId);

  return (
    <div>
      <h2>Bienvenido al panel principal del estudiante</h2>
      <p style={{ marginTop: "10px" }}>
        Desde aquí podrá gestionar su información personal y consultar su horario académico.
      </p>

      <div className="card-grid" style={{ marginTop: "25px" }}>
        <div className="info-card">
          <strong>ID de estudiante:</strong>
          <br />
          {userId}
        </div>

        <div className="info-card">
          <strong>Nombre registrado:</strong>
          <br />
          {perfil?.apellidoNombre || "Aún no registrado"}
        </div>

        <div className="info-card">
          <strong>Correo:</strong>
          <br />
          {perfil?.correo || "Aún no registrado"}
        </div>

        <div className="info-card">
          <strong>Hacer mi Horario:</strong>
          <br />
          {horario ? "Registrado" : "No registrado"}
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Accesos rápidos</h3>

      <div className="card-grid" style={{ marginTop: "20px" }}>
        <div className="info-card acceso-card" onClick={() => setSeccionActiva("datos")}>
          Completar datos personales
        </div>
        <div className="info-card acceso-card" onClick={() => setSeccionActiva("perfil")}>
          Ver perfil
        </div>
        <div className="info-card acceso-card" onClick={() => setSeccionActiva("horario")}>
          Ver horario académico
        </div>
        <div className="info-card acceso-card" onClick={() => setSeccionActiva("password")}>
          Cambiar contraseña
        </div>
      </div>
    </div>
  );
}

export default DashboardInicio;