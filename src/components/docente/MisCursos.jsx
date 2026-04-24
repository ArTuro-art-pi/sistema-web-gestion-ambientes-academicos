import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

function MisCursos({ usuarioActivo }) {
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    cargarMisCursos();
  }, [usuarioActivo]);

  const cargarMisCursos = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];

      const misRegistros = registros.filter(
        (doc) =>
          String(doc.cod || "").trim() === String(usuarioActivo.id || "").trim()
      );

      setAsignaciones(misRegistros);
    } catch (error) {
      console.error("Error al cargar cursos del docente:", error);
      setAsignaciones([]);
    }
  };

  const cursosAgrupados = useMemo(() => {
    const mapa = new Map();

    asignaciones.forEach((item) => {
      const clave = `${item.sigla}-${item.gr}-${item.carrera}`;

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          sigla: item.sigla,
          grupo: item.gr,
          carrera: item.carrera,
          horarios: [],
          estado: item.estado,
        });
      }

      mapa.get(clave).horarios.push({
        dia: item.dia,
        horario: item.horario,
      });
    });

    return Array.from(mapa.values());
  }, [asignaciones]);

  return (
    <div>
      <h2>Mis cursos</h2>
      <p style={{ marginBottom: "20px" }}>
        Materias y grupos asignados al docente según el registro realizado por
        secretaría.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Total de cursos</h4>
          <p>{cursosAgrupados.length}</p>
        </div>

        <div className="info-card">
          <h4>Total asignaciones</h4>
          <p>{asignaciones.length}</p>
        </div>
      </div>

      {cursosAgrupados.length > 0 ? (
        <div className="card-grid">
          {cursosAgrupados.map((curso, index) => (
            <div className="info-card" key={index}>
              <h4>{curso.sigla}</h4>
              <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                Grupo: <strong>{curso.grupo || "-"}</strong>
              </p>

              <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                Carrera: {curso.carrera || "-"}
              </p>

              <p style={{ fontSize: "15px", marginBottom: "10px" }}>
                Estado: {curso.estado || "Activo"}
              </p>

              <hr style={{ margin: "12px 0", opacity: 0.2 }} />

              <strong>Horarios:</strong>

              {curso.horarios.map((h, i) => (
                <p key={i} style={{ fontSize: "14px", marginTop: "8px" }}>
                  {h.dia} | {h.horario}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mensaje-login">
          No existen cursos registrados para este docente.
        </div>
      )}
    </div>
  );
}

export default MisCursos;