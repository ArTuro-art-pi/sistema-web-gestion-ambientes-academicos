import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

const diasOpciones = [
  "Todos",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function MiHorario({ usuarioActivo }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [filtroDia, setFiltroDia] = useState("Todos");

  useEffect(() => {
    cargarMiHorario();
  }, [usuarioActivo]);

  const cargarMiHorario = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];

      const misRegistros = registros.filter(
        (doc) =>
          String(doc.cod || "").trim() === String(usuarioActivo.id || "").trim()
      );

      setAsignaciones(misRegistros);
    } catch (error) {
      console.error("Error al cargar horario del docente:", error);
      setAsignaciones([]);
    }
  };

  const asignacionesFiltradas = useMemo(() => {
    if (filtroDia === "Todos") return asignaciones;

    return asignaciones.filter((item) => item.dia === filtroDia);
  }, [asignaciones, filtroDia]);

  const resumen = useMemo(() => {
    const materias = new Set(asignaciones.map((item) => item.sigla));
    const carreras = new Set(asignaciones.map((item) => item.carrera));

    return {
      total: asignaciones.length,
      materias: materias.size,
      carreras: carreras.size,
      activas: asignaciones.filter((item) => item.estado === "Activo").length,
    };
  }, [asignaciones]);

  return (
    <div>
      <h2>Mi horario</h2>
      <p style={{ marginBottom: "20px" }}>
        Consulta personal de asignaciones académicas registradas por secretaría.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Total asignaciones</h4>
          <p>{resumen.total}</p>
        </div>

        <div className="info-card">
          <h4>Materias asignadas</h4>
          <p>{resumen.materias}</p>
        </div>

        <div className="info-card">
          <h4>Carreras</h4>
          <p>{resumen.carreras}</p>
        </div>

        <div className="info-card">
          <h4>Activas</h4>
          <p>{resumen.activas}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Filtrar por día</h3>

        <div className="selector-dia">
          {diasOpciones.map((dia) => (
            <button
              key={dia}
              type="button"
              className={filtroDia === dia ? "activo" : ""}
              onClick={() => setFiltroDia(dia)}
            >
              {dia}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "25px" }}>
        <h3>Detalle de mi horario</h3>

        <table className="tabla-dashboard">
          <thead>
            <tr>
              <th>Día</th>
              <th>Sigla</th>
              <th>Grupo</th>
              <th>Ins</th>
              <th>Horario</th>
              <th>Carrera</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {asignacionesFiltradas.length > 0 ? (
              asignacionesFiltradas.map((item) => (
                <tr key={item.id}>
                  <td>{item.dia || "-"}</td>
                  <td>{item.sigla || "-"}</td>
                  <td>{item.gr || "-"}</td>
                  <td>{item.ins || "-"}</td>
                  <td>{item.horario || "-"}</td>
                  <td>{item.carrera || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        background:
                          item.estado === "Activo"
                            ? "rgba(40, 167, 69, 0.18)"
                            : "rgba(220, 53, 69, 0.18)",
                        color:
                          item.estado === "Activo" ? "#7CFC98" : "#FF9A9A",
                      }}
                    >
                      {item.estado || "Activo"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No existen asignaciones registradas para este docente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {asignaciones.length === 0 && (
        <div className="mensaje-login" style={{ marginTop: "20px" }}>
          Para visualizar su horario, secretaría debe registrar sus asignaciones
          usando el mismo código de usuario: <strong>{usuarioActivo.id}</strong>.
        </div>
      )}
    </div>
  );
}

export default MiHorario;