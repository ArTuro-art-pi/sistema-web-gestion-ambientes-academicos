import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

function PanelPrincipal({ usuarioActivo, setSeccionActiva }) {
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    cargarDatosDocente();
  }, [usuarioActivo]);

  const cargarDatosDocente = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];

      const misAsignaciones = registros.filter(
        (doc) =>
          String(doc.cod || "").trim() === String(usuarioActivo.id || "").trim()
      );

      setAsignaciones(misAsignaciones);
    } catch (error) {
      console.error("Error al cargar panel docente:", error);
      setAsignaciones([]);
    }
  };

  const resumen = useMemo(() => {
    const primerRegistro = asignaciones[0];

    const materias = new Set(asignaciones.map((item) => item.sigla));
    const carreras = new Set(asignaciones.map((item) => item.carrera));
    const dias = new Set(asignaciones.map((item) => item.dia));

    const activas = asignaciones.filter(
      (item) => item.estado === "Activo"
    ).length;

    const inactivas = asignaciones.filter(
      (item) => item.estado === "Inactivo"
    ).length;

    return {
      codigo: usuarioActivo?.id || "-",
      nombre: primerRegistro?.nombre || "Docente no registrado",
      totalAsignaciones: asignaciones.length,
      totalMaterias: materias.size,
      totalCarreras: carreras.size,
      totalDias: dias.size,
      carreras: Array.from(carreras).filter(Boolean),
      materias: Array.from(materias).filter(Boolean),
      estadoGeneral:
        asignaciones.length === 0
          ? "Sin asignaciones"
          : activas > 0
          ? "Activo"
          : "Inactivo",
      activas,
      inactivas,
    };
  }, [asignaciones, usuarioActivo]);

  return (
    <div className="panel-docente-principal">
      <section className="docente-hero">
        <div className="docente-foto">
          <span>{resumen.nombre.charAt(0)}</span>
        </div>

        <div className="docente-info">
          <h2>Bienvenido al sistema académico</h2>
          <h3>{resumen.nombre}</h3>
          <p>
            Código docente: <strong>{resumen.codigo}</strong>
          </p>

          <span
            className={
              resumen.estadoGeneral === "Activo"
                ? "estado-docente activo"
                : resumen.estadoGeneral === "Inactivo"
                ? "estado-docente inactivo"
                : "estado-docente sin-datos"
            }
          >
            {resumen.estadoGeneral}
          </span>
        </div>
      </section>

      <section className="card-grid" style={{ marginTop: "25px" }}>
        <div className="info-card">
          <h4>Total de asignaciones</h4>
          <p>{resumen.totalAsignaciones}</p>
        </div>

        <div className="info-card">
          <h4>Materias asignadas</h4>
          <p>{resumen.totalMaterias}</p>
        </div>

        <div className="info-card">
          <h4>Carreras asignadas</h4>
          <p>{resumen.totalCarreras}</p>
        </div>

        <div className="info-card">
          <h4>Días con clases</h4>
          <p>{resumen.totalDias}</p>
        </div>
      </section>

      <section className="seccion-formulario-docente" style={{ marginTop: "28px" }}>
        <h3>Resumen rápido</h3>

        <div className="resumen-docente-grid">
          <div className="resumen-docente-box">
            <strong>Asignaciones activas</strong>
            <span>{resumen.activas}</span>
          </div>

          <div className="resumen-docente-box">
            <strong>Asignaciones inactivas</strong>
            <span>{resumen.inactivas}</span>
          </div>

          <div className="resumen-docente-box">
            <strong>Carreras</strong>
            <p>
              {resumen.carreras.length > 0
                ? resumen.carreras.join(", ")
                : "Sin carreras asignadas"}
            </p>
          </div>

          <div className="resumen-docente-box">
            <strong>Materias</strong>
            <p>
              {resumen.materias.length > 0
                ? resumen.materias.join(", ")
                : "Sin materias asignadas"}
            </p>
          </div>
        </div>
      </section>

      <section className="acciones-panel-docente">
        <button onClick={() => setSeccionActiva("mi-horario")}>
          Ver mi horario
        </button>

        <button onClick={() => setSeccionActiva("mis-cursos")}>
          Ver mis cursos
        </button>

        <button onClick={() => setSeccionActiva("perfil")}>
          Ver perfil docente
        </button>
      </section>

      {asignaciones.length === 0 && (
        <p className="mensaje-login" style={{ marginTop: "20px" }}>
          Secretaría debe registrar sus asignaciones usando el código docente:{" "}
          <strong>{resumen.codigo}</strong>.
        </p>
      )}
    </div>
  );
}

export default PanelPrincipal;