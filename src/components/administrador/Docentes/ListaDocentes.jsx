import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

const diasOpciones = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const carrerasOpciones = [
  "Agropecuaria",
  "Comercial",
  "Contaduria",
  "Derecho",
  "Educacion",
  "Empresas",
  "Enfermeria",
  "Industrial",
  "Sistemas",
  "Veterinaria",
];

function ListaDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    cargarDocentes();
  }, []);

  const normalizar = (valor) => String(valor || "").trim().toLowerCase();

  const cargarDocentes = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];
      setDocentes(Array.isArray(registros) ? registros : []);
    } catch (error) {
      console.error("Error al cargar docentes:", error);
      setDocentes([]);
    }
  };

  const guardarDocentes = (nuevosDocentes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDocentes));
    setDocentes(nuevosDocentes);
  };

  const cambiarEstadoDocente = (id) => {
    const nuevosDocentes = docentes.map((docente) =>
      docente.id === id
        ? {
            ...docente,
            estado: docente.estado === "Activo" ? "Inactivo" : "Activo",
          }
        : docente
    );

    guardarDocentes(nuevosDocentes);
    setMensaje("Estado de la asignación actualizado correctamente.");
  };

  const eliminarDocente = (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta asignación docente?"
    );
    if (!confirmar) return;

    const nuevosDocentes = docentes.filter((docente) => docente.id !== id);
    guardarDocentes(nuevosDocentes);
    setMensaje("Asignación docente eliminada correctamente.");
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroDia("");
    setFiltroCarrera("");
    setFiltroMateria("");
    setFiltroEstado("");
    setMensaje("");
  };

  const docentesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return [...docentes]
      .filter((docente) => {
        const cod = normalizar(docente.cod);
        const nombre = normalizar(docente.nombre);
        const sigla = normalizar(docente.sigla);
        const dia = String(docente.dia || "");
        const carrera = String(docente.carrera || "");
        const estado = String(docente.estado || "");

        const coincideBusqueda =
          cod.includes(texto) ||
          nombre.includes(texto) ||
          sigla.includes(texto);

        const coincideDia = filtroDia ? dia === filtroDia : true;
        const coincideCarrera = filtroCarrera ? carrera === filtroCarrera : true;
        const coincideMateria = filtroMateria
          ? sigla.includes(filtroMateria.toLowerCase())
          : true;
        const coincideEstado = filtroEstado ? estado === filtroEstado : true;

        return (
          coincideBusqueda &&
          coincideDia &&
          coincideCarrera &&
          coincideMateria &&
          coincideEstado
        );
      })
      .sort((a, b) => {
        const codA = normalizar(a.cod);
        const codB = normalizar(b.cod);

        if (codA !== codB) return codA.localeCompare(codB);

        const nombreA = normalizar(a.nombre);
        const nombreB = normalizar(b.nombre);

        if (nombreA !== nombreB) return nombreA.localeCompare(nombreB);

        const diaA = normalizar(a.dia);
        const diaB = normalizar(b.dia);

        return diaA.localeCompare(diaB);
      });
  }, [
    docentes,
    busqueda,
    filtroDia,
    filtroCarrera,
    filtroMateria,
    filtroEstado,
  ]);

  const resumen = useMemo(() => {
    const codigosUnicos = new Set(docentes.map((d) => normalizar(d.cod)));

    return {
      totalAsignaciones: docentes.length,
      docentesUnicos: codigosUnicos.size,
      activos: docentes.filter((d) => d.estado === "Activo").length,
      inactivos: docentes.filter((d) => d.estado === "Inactivo").length,
    };
  }, [docentes]);

  const resumenPorDocente = useMemo(() => {
    const mapa = new Map();

    docentesFiltrados.forEach((item) => {
      const clave = `${normalizar(item.cod)}__${normalizar(item.nombre)}`;

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          cod: item.cod,
          nombre: item.nombre,
          totalAsignaciones: 0,
          carreras: new Set(),
          materias: new Set(),
          activos: 0,
          inactivos: 0,
        });
      }

      const actual = mapa.get(clave);
      actual.totalAsignaciones += 1;
      actual.carreras.add(item.carrera || "-");
      actual.materias.add(item.sigla || "-");

      if (item.estado === "Activo") {
        actual.activos += 1;
      } else {
        actual.inactivos += 1;
      }
    });

    return Array.from(mapa.values()).map((item) => ({
      ...item,
      carreras: Array.from(item.carreras),
      materias: Array.from(item.materias),
    }));
  }, [docentesFiltrados]);

  return (
    <div>
      <h2>Lista de Docentes</h2>
      <p style={{ marginBottom: "20px" }}>
        Consulta, búsqueda y administración de asignaciones docentes.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Total de asignaciones</h4>
          <p>{resumen.totalAsignaciones}</p>
        </div>

        <div className="info-card">
          <h4>Docentes únicos</h4>
          <p>{resumen.docentesUnicos}</p>
        </div>

        <div className="info-card">
          <h4>Activas</h4>
          <p>{resumen.activos}</p>
        </div>

        <div className="info-card">
          <h4>Inactivas</h4>
          <p>{resumen.inactivos}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Filtros de búsqueda</h3>

        <div className="form-grid">
          <div className="grupo-input">
            <label>Buscar por código, nombre o sigla</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar docente"
            />
          </div>

          <div className="grupo-input">
            <label>Filtrar por día</label>
            <select
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
            >
              <option value="">Todos</option>
              {diasOpciones.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label>Filtrar por carrera</label>
            <select
              value={filtroCarrera}
              onChange={(e) => setFiltroCarrera(e.target.value)}
            >
              <option value="">Todas</option>
              {carrerasOpciones.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label>Filtrar por materia</label>
            <input
              type="text"
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value)}
              placeholder="Ej.: ADM"
            />
          </div>

          <div className="grupo-input">
            <label>Filtrar por estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="acciones-horario" style={{ marginTop: "20px" }}>
          <button className="btn-login" type="button" onClick={cargarDocentes}>
            Actualizar lista
          </button>

          <button className="btn-login" type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}

      <div className="seccion-formulario-docente" style={{ marginTop: "30px" }}>
        <h3>Resumen por docente</h3>

        {resumenPorDocente.length > 0 ? (
          <div className="card-grid">
            {resumenPorDocente.map((docente, index) => (
              <div className="info-card docente-resumen-card" key={index}>
                <h4>{docente.nombre}</h4>
                <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                  Código: <strong>{docente.cod}</strong>
                </p>
                <p style={{ fontSize: "15px", marginBottom: "8px" }}>
                  Asignaciones: <strong>{docente.totalAsignaciones}</strong>
                </p>
                <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                  Carreras: {docente.carreras.join(", ")}
                </p>
                <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                  Materias: {docente.materias.join(", ")}
                </p>
                <p style={{ fontSize: "14px" }}>
                  Activas: {docente.activos} | Inactivas: {docente.inactivos}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "white", marginTop: "10px" }}>
            No hay docentes para mostrar en el resumen.
          </p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Detalle de asignaciones</h3>

        <table className="tabla-dashboard">
          <thead>
            <tr>
              <th>Cod</th>
              <th>Docente</th>
              <th>Sigla</th>
              <th>Gr</th>
              <th>Ins</th>
              <th>S/A</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Carrera</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.length > 0 ? (
              docentesFiltrados.map((docente) => (
                <tr key={docente.id}>
                  <td>{docente.cod || "-"}</td>
                  <td>{docente.nombre || "-"}</td>
                  <td>{docente.sigla || "-"}</td>
                  <td>{docente.gr || "-"}</td>
                  <td>{docente.ins || "-"}</td>
                  <td>{docente.sa || "-"}</td>
                  <td>{docente.dia || "-"}</td>
                  <td>{docente.horario || "-"}</td>
                  <td>{docente.carrera || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        display: "inline-block",
                        background:
                          docente.estado === "Activo"
                            ? "rgba(40, 167, 69, 0.18)"
                            : "rgba(220, 53, 69, 0.18)",
                        color:
                          docente.estado === "Activo"
                            ? "#7CFC98"
                            : "#FF9A9A",
                      }}
                    >
                      {docente.estado || "Activo"}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-tabla">
                    <button
                      className="btn-estado-docente"
                      onClick={() => cambiarEstadoDocente(docente.id)}
                       >
                      {docente.estado === "Activo" ? "Desactivar" : "Activar"}
                      </button>
                       <button
                      className="btn-eliminar-docente"
                      onClick={() => eliminarDocente(docente.id)}
                        >
                         Eliminar
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No existen asignaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaDocentes;