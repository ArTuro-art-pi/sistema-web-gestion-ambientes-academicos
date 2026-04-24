import React, { useEffect, useMemo, useState } from "react";

const STORAGE_DOCENTES = "docentes_registrados";
const STORAGE_PRESTAMOS = "prestamos_llaves";
const STORAGE_AULAS = "estado_aulas_secretaria";

const tiposReporte = [
  { id: "general", nombre: "Reporte general" },
  { id: "aulas", nombre: "Reporte de aulas" },
  { id: "horarios", nombre: "Reporte de horarios" },
  { id: "prestamos", nombre: "Reporte de préstamos" },
];

function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("general");
  const [docentes, setDocentes] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [aulas, setAulas] = useState({});

  const [filtroDia, setFiltroDia] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const docentesData = JSON.parse(localStorage.getItem(STORAGE_DOCENTES)) || [];
      const prestamosData = JSON.parse(localStorage.getItem(STORAGE_PRESTAMOS)) || [];
      const aulasData = JSON.parse(localStorage.getItem(STORAGE_AULAS)) || {};

      setDocentes(Array.isArray(docentesData) ? docentesData : []);
      setPrestamos(Array.isArray(prestamosData) ? prestamosData : []);
      setAulas(aulasData && typeof aulasData === "object" ? aulasData : {});
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      setDocentes([]);
      setPrestamos([]);
      setAulas({});
    }
  };

  const normalizar = (valor) => String(valor || "").trim().toLowerCase();

  const resumenGeneral = useMemo(() => {
    const estadosAulas = Object.values(aulas);
    const docentesUnicos = new Set(docentes.map((d) => normalizar(d.cod)));

    return {
      asignaciones: docentes.length,
      docentesUnicos: docentesUnicos.size,
      asignacionesActivas: docentes.filter((d) => d.estado === "Activo").length,
      asignacionesInactivas: docentes.filter((d) => d.estado === "Inactivo").length,
      totalAulas: estadosAulas.length,
      aulasDisponibles: estadosAulas.filter((e) => e === "disponible").length,
      aulasOcupadas: estadosAulas.filter((e) => e === "ocupada").length,
      aulasReservadas: estadosAulas.filter((e) => e === "reservada").length,
      aulasMantenimiento: estadosAulas.filter((e) => e === "mantenimiento").length,
      totalPrestamos: prestamos.length,
      prestamosPendientes: prestamos.filter((p) => p.estado === "Prestado").length,
      prestamosDevueltos: prestamos.filter((p) => p.estado === "Devuelto").length,
    };
  }, [docentes, prestamos, aulas]);

  const aulasTabla = useMemo(() => {
    return Object.entries(aulas).map(([aula, estado]) => ({
      aula,
      estado,
    }));
  }, [aulas]);

  const horariosFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);

    return docentes.filter((item) => {
      const coincideBusqueda =
        normalizar(item.cod).includes(texto) ||
        normalizar(item.nombre).includes(texto) ||
        normalizar(item.sigla).includes(texto);

      const coincideDia = filtroDia ? item.dia === filtroDia : true;
      const coincideCarrera = filtroCarrera ? item.carrera === filtroCarrera : true;
      const coincideEstado = filtroEstado ? item.estado === filtroEstado : true;

      return coincideBusqueda && coincideDia && coincideCarrera && coincideEstado;
    });
  }, [docentes, busqueda, filtroDia, filtroCarrera, filtroEstado]);

  const prestamosFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);

    return prestamos.filter((item) => {
      const coincideBusqueda =
        normalizar(item.fecha).includes(texto) ||
        normalizar(item.nombreApellido).includes(texto) ||
        normalizar(item.llave).includes(texto) ||
        normalizar(item.turno).includes(texto) ||
        normalizar(item.estado).includes(texto);

      const coincideEstado = filtroEstado ? item.estado === filtroEstado : true;

      return coincideBusqueda && coincideEstado;
    });
  }, [prestamos, busqueda, filtroEstado]);

  const asignacionesPorCarrera = useMemo(() => {
    const mapa = {};

    docentes
      .filter((d) => d.estado === "Activo")
      .forEach((item) => {
        const carrera = item.carrera || "Sin carrera";
        mapa[carrera] = (mapa[carrera] || 0) + 1;
      });

    return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
  }, [docentes]);

  const asignacionesPorDia = useMemo(() => {
    const mapa = {};

    docentes
      .filter((d) => d.estado === "Activo")
      .forEach((item) => {
        const dia = item.dia || "Sin día";
        mapa[dia] = (mapa[dia] || 0) + 1;
      });

    return Object.entries(mapa);
  }, [docentes]);

  const imprimirReporte = () => {
    window.print();
  };

  const limpiarFiltros = () => {
    setFiltroDia("");
    setFiltroCarrera("");
    setFiltroEstado("");
    setBusqueda("");
  };

  return (
    <div className="modulo-reportes">
      <div className="encabezado-reportes">
        <div>
          <h2>Reportes del sistema</h2>
          <p>
            Consulta, análisis e impresión de información académica y administrativa.
          </p>
        </div>

        <div className="acciones-reportes">
          <button className="btn-login" onClick={cargarDatos}>
            Actualizar
          </button>
          <button className="btn-login btn-imprimir" onClick={imprimirReporte}>
            Imprimir reporte
          </button>
        </div>
      </div>

      <div className="selector-reportes">
        {tiposReporte.map((tipo) => (
          <button
            key={tipo.id}
            className={tipoReporte === tipo.id ? "activo" : ""}
            onClick={() => {
              setTipoReporte(tipo.id);
              limpiarFiltros();
            }}
          >
            {tipo.nombre}
          </button>
        ))}
      </div>

      {tipoReporte === "general" && (
        <section className="seccion-reporte">
          <h3>Resumen general del sistema</h3>

          <div className="card-grid">
            <div className="info-card">
              <h4>Asignaciones</h4>
              <p>{resumenGeneral.asignaciones}</p>
            </div>

            <div className="info-card">
              <h4>Docentes únicos</h4>
              <p>{resumenGeneral.docentesUnicos}</p>
            </div>

            <div className="info-card">
              <h4>Aulas disponibles</h4>
              <p>{resumenGeneral.aulasDisponibles}</p>
            </div>

            <div className="info-card">
              <h4>Préstamos pendientes</h4>
              <p>{resumenGeneral.prestamosPendientes}</p>
            </div>
          </div>

          <div className="reporte-doble">
            <div className="reporte-card">
              <h4>Estado de aulas</h4>
              <div className="grafico-barras-simple">
                <div style={{ width: `${resumenGeneral.aulasDisponibles * 3}%` }}>
                  Disponibles: {resumenGeneral.aulasDisponibles}
                </div>
                <div style={{ width: `${resumenGeneral.aulasOcupadas * 3}%` }}>
                  Ocupadas: {resumenGeneral.aulasOcupadas}
                </div>
                <div style={{ width: `${resumenGeneral.aulasReservadas * 3}%` }}>
                  Reservadas: {resumenGeneral.aulasReservadas}
                </div>
                <div style={{ width: `${resumenGeneral.aulasMantenimiento * 3}%` }}>
                  Mantenimiento: {resumenGeneral.aulasMantenimiento}
                </div>
              </div>
            </div>

            <div className="reporte-card">
              <h4>Asignaciones por carrera</h4>
              <div className="lista-ranking-reportes">
                {asignacionesPorCarrera.length > 0 ? (
                  asignacionesPorCarrera.slice(0, 6).map(([carrera, total]) => (
                    <div key={carrera}>
                      <span>{carrera}</span>
                      <strong>{total}</strong>
                    </div>
                  ))
                ) : (
                  <p>No existen asignaciones registradas.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {tipoReporte === "aulas" && (
        <section className="seccion-reporte">
          <h3>Reporte de aulas</h3>

          <div className="card-grid">
            <div className="info-card">
              <h4>Total aulas</h4>
              <p>{resumenGeneral.totalAulas}</p>
            </div>
            <div className="info-card">
              <h4>Disponibles</h4>
              <p>{resumenGeneral.aulasDisponibles}</p>
            </div>
            <div className="info-card">
              <h4>Ocupadas</h4>
              <p>{resumenGeneral.aulasOcupadas}</p>
            </div>
            <div className="info-card">
              <h4>Mantenimiento</h4>
              <p>{resumenGeneral.aulasMantenimiento}</p>
            </div>
          </div>

          <table className="tabla-dashboard">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Estado actual</th>
              </tr>
            </thead>
            <tbody>
              {aulasTabla.length > 0 ? (
                aulasTabla.map((item) => (
                  <tr key={item.aula}>
                    <td>{item.aula}</td>
                    <td>{item.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No existen datos de aulas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {tipoReporte === "horarios" && (
        <section className="seccion-reporte">
          <h3>Reporte de horarios y asignaciones docentes</h3>

          <div className="filtros-reportes">
            <input
              type="text"
              placeholder="Buscar por código, docente o sigla"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}>
              <option value="">Todos los días</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
            </select>

            <select
              value={filtroCarrera}
              onChange={(e) => setFiltroCarrera(e.target.value)}
            >
              <option value="">Todas las carreras</option>
              <option value="Agropecuaria">Agropecuaria</option>
              <option value="Comercial">Comercial</option>
              <option value="Contaduria">Contaduría</option>
              <option value="Derecho">Derecho</option>
              <option value="Educacion">Educación</option>
              <option value="Empresas">Empresas</option>
              <option value="Enfermeria">Enfermería</option>
              <option value="Industrial">Industrial</option>
              <option value="Sistemas">Sistemas</option>
              <option value="Veterinaria">Veterinaria</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <button className="btn-login" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>

          <div className="card-grid">
            <div className="info-card">
              <h4>Resultados</h4>
              <p>{horariosFiltrados.length}</p>
            </div>
            <div className="info-card">
              <h4>Activas</h4>
              <p>{horariosFiltrados.filter((d) => d.estado === "Activo").length}</p>
            </div>
            <div className="info-card">
              <h4>Inactivas</h4>
              <p>{horariosFiltrados.filter((d) => d.estado === "Inactivo").length}</p>
            </div>
          </div>

          <div className="reporte-card">
            <h4>Carga horaria por día</h4>
            <div className="lista-ranking-reportes">
              {asignacionesPorDia.map(([dia, total]) => (
                <div key={dia}>
                  <span>{dia}</span>
                  <strong>{total}</strong>
                </div>
              ))}
            </div>
          </div>

          <table className="tabla-dashboard">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Docente</th>
                <th>Sigla</th>
                <th>Grupo</th>
                <th>Ins</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Carrera</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {horariosFiltrados.length > 0 ? (
                horariosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.cod}</td>
                    <td>{item.nombre}</td>
                    <td>{item.sigla}</td>
                    <td>{item.gr}</td>
                    <td>{item.ins}</td>
                    <td>{item.dia}</td>
                    <td>{item.horario}</td>
                    <td>{item.carrera}</td>
                    <td>{item.estado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No existen asignaciones con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {tipoReporte === "prestamos" && (
        <section className="seccion-reporte">
          <h3>Reporte de préstamos de llaves</h3>

          <div className="filtros-reportes">
            <input
              type="text"
              placeholder="Buscar por fecha, solicitante, llave o turno"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Prestado">Prestado</option>
              <option value="Devuelto">Devuelto</option>
            </select>

            <button className="btn-login" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>

          <div className="card-grid">
            <div className="info-card">
              <h4>Total préstamos</h4>
              <p>{prestamos.length}</p>
            </div>
            <div className="info-card">
              <h4>Pendientes</h4>
              <p>{prestamos.filter((p) => p.estado === "Prestado").length}</p>
            </div>
            <div className="info-card">
              <h4>Devueltos</h4>
              <p>{prestamos.filter((p) => p.estado === "Devuelto").length}</p>
            </div>
            <div className="info-card">
              <h4>Resultados</h4>
              <p>{prestamosFiltrados.length}</p>
            </div>
          </div>

          <table className="tabla-dashboard">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Turno</th>
                <th>Solicitante</th>
                <th>Llave</th>
                <th>Estado</th>
                <th>Entregado por</th>
              </tr>
            </thead>
            <tbody>
              {prestamosFiltrados.length > 0 ? (
                prestamosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fecha}</td>
                    <td>{item.dia}</td>
                    <td>{item.hora}</td>
                    <td>{item.turno}</td>
                    <td>{item.nombreApellido}</td>
                    <td>{item.llave}</td>
                    <td>{item.estado}</td>
                    <td>{item.entregadoPor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No existen préstamos con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Reportes;