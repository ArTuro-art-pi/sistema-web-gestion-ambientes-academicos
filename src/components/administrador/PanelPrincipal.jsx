import React, { useEffect, useMemo, useState } from "react";

const STORAGE_DOCENTES = "docentes_registrados";
const STORAGE_PRESTAMOS = "prestamos_llaves";
const STORAGE_AULAS = "estado_aulas_secretaria";

function PanelPrincipal({ setSeccionActiva }) {
  const [docentes, setDocentes] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [aulas, setAulas] = useState({});
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    cargarDatosDashboard();

    const hoy = new Date();
    const fechaTexto = hoy.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFechaActual(fechaTexto);
  }, []);

  const cargarDatosDashboard = () => {
    try {
      const docentesGuardados =
        JSON.parse(localStorage.getItem(STORAGE_DOCENTES)) || [];
      const prestamosGuardados =
        JSON.parse(localStorage.getItem(STORAGE_PRESTAMOS)) || [];
      const aulasGuardadas =
        JSON.parse(localStorage.getItem(STORAGE_AULAS)) || {};

      setDocentes(Array.isArray(docentesGuardados) ? docentesGuardados : []);
      setPrestamos(Array.isArray(prestamosGuardados) ? prestamosGuardados : []);
      setAulas(
        aulasGuardadas && typeof aulasGuardadas === "object"
          ? aulasGuardadas
          : {}
      );
    } catch (error) {
      console.error("Error al cargar datos del panel principal:", error);
      setDocentes([]);
      setPrestamos([]);
      setAulas({});
    }
  };

  const resumen = useMemo(() => {
    const codigosUnicos = new Set(
      docentes.map((d) => String(d.cod || "").trim().toLowerCase())
    );

    const estadosAulas = Object.values(aulas);

    return {
      totalAsignaciones: docentes.length,
      docentesUnicos: codigosUnicos.size,
      aulasDisponibles: estadosAulas.filter(
        (estado) => estado === "disponible"
      ).length,
      prestamosPendientes: prestamos.filter(
        (p) => p.estado === "Prestado"
      ).length,
    };
  }, [docentes, prestamos, aulas]);

  return (
    <div className="panel-principal-secretaria">
      <div className="panel-bienvenida">
        <h2>Bienvenida al panel principal de secretaría</h2>
        <p>
          Desde este módulo podrá gestionar el préstamo de llaves, consultar
          horarios por carrera, registrar docentes y generar reportes
          administrativos.
        </p>
        <span className="fecha-panel">Fecha actual: {fechaActual}</span>
      </div>

      {/* BANNER PRINCIPAL CON IMAGEN */}
      <div className="banner-principal-secretaria">
        <img
          src="/Modulo.png"
          alt="Facultad Integral de Ichilo"
          className="banner-principal-img"
        />
      </div>

      <div className="card-grid" style={{ marginTop: "24px" }}>
        <div className="info-card">
          <h4>Total de asignaciones</h4>
          <p>{resumen.totalAsignaciones}</p>
        </div>

        <div className="info-card">
          <h4>Docentes únicos</h4>
          <p>{resumen.docentesUnicos}</p>
        </div>

        <div className="info-card">
          <h4>Aulas disponibles</h4>
          <p>{resumen.aulasDisponibles}</p>
        </div>

        <div className="info-card">
          <h4>Préstamos pendientes</h4>
          <p>{resumen.prestamosPendientes}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente" style={{ marginTop: "28px" }}>
        <h3>Módulos principales</h3>

        <div className="card-grid" style={{ marginTop: "18px" }}>
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
      </div>

      <h3 style={{ marginTop: "30px" }}>Accesos rápidos</h3>

      <div className="card-grid" style={{ marginTop: "18px" }}>
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