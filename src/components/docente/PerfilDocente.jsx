import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

function PerfilDocente({ usuarioActivo }) {
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    cargarPerfilDocente();
  }, [usuarioActivo]);

  const cargarPerfilDocente = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];

      const misRegistros = registros.filter(
        (doc) =>
          String(doc.cod || "").trim() === String(usuarioActivo.id || "").trim()
      );

      setAsignaciones(misRegistros);
    } catch (error) {
      console.error("Error al cargar perfil docente:", error);
      setAsignaciones([]);
    }
  };

  const perfil = useMemo(() => {
    const primerRegistro = asignaciones[0];

    const materias = new Set(asignaciones.map((item) => item.sigla));
    const carreras = new Set(asignaciones.map((item) => item.carrera));
    const grupos = new Set(asignaciones.map((item) => item.gr));

    return {
      codigo: usuarioActivo?.id || "-",
      nombre: primerRegistro?.nombre || "Docente no encontrado",
      totalAsignaciones: asignaciones.length,
      materias: Array.from(materias).filter(Boolean),
      carreras: Array.from(carreras).filter(Boolean),
      grupos: Array.from(grupos).filter(Boolean),
      activas: asignaciones.filter((item) => item.estado === "Activo").length,
      inactivas: asignaciones.filter((item) => item.estado === "Inactivo").length,
    };
  }, [asignaciones, usuarioActivo]);

  return (
    <div>
      <h2>Perfil docente</h2>
      <p style={{ marginBottom: "20px" }}>
        Información académica del docente obtenida desde los registros de secretaría.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Código docente</h4>
          <p style={{ fontSize: "24px" }}>{perfil.codigo}</p>
        </div>

        <div className="info-card">
          <h4>Asignaciones</h4>
          <p>{perfil.totalAsignaciones}</p>
        </div>

        <div className="info-card">
          <h4>Materias</h4>
          <p>{perfil.materias.length}</p>
        </div>

        <div className="info-card">
          <h4>Carreras</h4>
          <p>{perfil.carreras.length}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Datos del docente</h3>

        <div className="card-grid" style={{ marginTop: "18px" }}>
          <div className="info-card">
            <strong>Nombre completo</strong>
            <br />
            {perfil.nombre}
          </div>

          <div className="info-card">
            <strong>Estado académico</strong>
            <br />
            Activas: {perfil.activas} | Inactivas: {perfil.inactivas}
          </div>

          <div className="info-card">
            <strong>Grupos asignados</strong>
            <br />
            {perfil.grupos.length > 0 ? perfil.grupos.join(", ") : "Sin grupos"}
          </div>

          <div className="info-card">
            <strong>Carreras asignadas</strong>
            <br />
            {perfil.carreras.length > 0
              ? perfil.carreras.join(", ")
              : "Sin carreras"}
          </div>
        </div>
      </div>

      <div className="seccion-formulario-docente" style={{ marginTop: "25px" }}>
        <h3>Materias asignadas</h3>

        {perfil.materias.length > 0 ? (
          <div className="card-grid" style={{ marginTop: "18px" }}>
            {perfil.materias.map((materia) => (
              <div className="info-card" key={materia}>
                <strong>{materia}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="mensaje-login">
            No existen materias asignadas para este docente.
          </p>
        )}
      </div>

      <div style={{ marginTop: "28px" }}>
        <h3>Detalle académico</h3>

        <table className="tabla-dashboard">
          <thead>
            <tr>
              <th>Sigla</th>
              <th>Grupo</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Carrera</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {asignaciones.length > 0 ? (
              asignaciones.map((item) => (
                <tr key={item.id}>
                  <td>{item.sigla || "-"}</td>
                  <td>{item.gr || "-"}</td>
                  <td>{item.dia || "-"}</td>
                  <td>{item.horario || "-"}</td>
                  <td>{item.carrera || "-"}</td>
                  <td>{item.estado || "Activo"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No existen datos académicos para este docente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {asignaciones.length === 0 && (
        <p className="mensaje-login" style={{ marginTop: "20px" }}>
          Secretaría debe registrar asignaciones usando el código docente:{" "}
          <strong>{perfil.codigo}</strong>.
        </p>
      )}
    </div>
  );
}

export default PerfilDocente;