import React, { useMemo, useState } from "react";

const avisosIniciales = [
  {
    id: 1,
    titulo: "Reunión docente",
    categoria: "Reunión",
    fecha: "2026-04-25",
    descripcion:
      "Se convoca a reunión general de docentes para tratar temas académicos y administrativos.",
    prioridad: "Alta",
  },
  {
    id: 2,
    titulo: "Entrega de notas",
    categoria: "Académico",
    fecha: "2026-04-28",
    descripcion:
      "Se recuerda a los docentes realizar la entrega de notas dentro del plazo establecido.",
    prioridad: "Media",
  },
  {
    id: 3,
    titulo: "Cambio de aula",
    categoria: "Horario",
    fecha: "2026-04-30",
    descripcion:
      "Algunas asignaciones podrán sufrir cambios de aula por mantenimiento de ambientes.",
    prioridad: "Media",
  },
  {
    id: 4,
    titulo: "Suspensión de clases",
    categoria: "Comunicado",
    fecha: "2026-05-01",
    descripcion:
      "Se comunica la suspensión de clases por actividad institucional.",
    prioridad: "Alta",
  },
];

function Avisos({ usuarioActivo }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const avisosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return avisosIniciales.filter((aviso) => {
      const coincideBusqueda =
        aviso.titulo.toLowerCase().includes(texto) ||
        aviso.descripcion.toLowerCase().includes(texto) ||
        aviso.categoria.toLowerCase().includes(texto);

      const coincideCategoria = filtroCategoria
        ? aviso.categoria === filtroCategoria
        : true;

      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, filtroCategoria]);

  return (
    <div>
      <h2>Avisos</h2>
      <p style={{ marginBottom: "20px" }}>
        Comunicados institucionales dirigidos al personal docente.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Total avisos</h4>
          <p>{avisosIniciales.length}</p>
        </div>

        <div className="info-card">
          <h4>Avisos visibles</h4>
          <p>{avisosFiltrados.length}</p>
        </div>

        <div className="info-card">
          <h4>Docente</h4>
          <p style={{ fontSize: "22px" }}>{usuarioActivo?.id}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Buscar avisos</h3>

        <div className="form-grid">
          <div className="grupo-input">
            <label>Buscar por título, descripción o categoría</label>
            <input
              type="text"
              placeholder="Buscar aviso"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="grupo-input">
            <label>Filtrar por categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Reunión">Reunión</option>
              <option value="Académico">Académico</option>
              <option value="Horario">Horario</option>
              <option value="Comunicado">Comunicado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: "25px" }}>
        {avisosFiltrados.length > 0 ? (
          avisosFiltrados.map((aviso) => (
            <div className="info-card" key={aviso.id}>
              <h4>{aviso.titulo}</h4>

              <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                Categoría: <strong>{aviso.categoria}</strong>
              </p>

              <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                Fecha: <strong>{aviso.fecha}</strong>
              </p>

              <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                Prioridad: <strong>{aviso.prioridad}</strong>
              </p>

              <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                {aviso.descripcion}
              </p>
            </div>
          ))
        ) : (
          <div className="mensaje-login">
            No existen avisos con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}

export default Avisos;