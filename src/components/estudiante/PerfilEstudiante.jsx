import React from "react";
import { obtenerPerfilPorId } from "../../utils/estudianteStorage";

function PerfilEstudiante({ userId }) {
  const perfil = obtenerPerfilPorId(userId);

  if (!perfil) {
    return (
      <div>
        <h2>Perfil del estudiante</h2>
        <p>Aún no existen datos registrados.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Perfil del estudiante</h2>

      <div className="card-grid">
        <div className="info-card"><strong>Registro universitario:</strong><br />{perfil.registroUniversitario}</div>
        <div className="info-card"><strong>Apellido y nombre:</strong><br />{perfil.apellidoNombre}</div>
        <div className="info-card"><strong>C.I.:</strong><br />{perfil.ci}</div>
        <div className="info-card"><strong>Sexo:</strong><br />{perfil.sexo}</div>
        <div className="info-card"><strong>Estado civil:</strong><br />{perfil.estadoCivil}</div>
        <div className="info-card"><strong>Fecha de nacimiento:</strong><br />{perfil.fechaNacimiento}</div>
        <div className="info-card"><strong>País:</strong><br />{perfil.pais}</div>
        <div className="info-card"><strong>Departamento:</strong><br />{perfil.departamento}</div>
        <div className="info-card"><strong>Provincia:</strong><br />{perfil.provincia}</div>
        <div className="info-card"><strong>Dirección:</strong><br />{perfil.direccion}</div>
        <div className="info-card"><strong>Teléfono:</strong><br />{perfil.telefono}</div>
        <div className="info-card"><strong>Carrera:</strong><br />{perfil.carrera}</div>
        <div className="info-card"><strong>Correo:</strong><br />{perfil.correo}</div>
      </div>

      {perfil.fotografia && (
        <div className="foto-perfil-box">
          <img src={perfil.fotografia} alt="Perfil" className="foto-perfil" />
        </div>
      )}
    </div>
  );
}

export default PerfilEstudiante;



