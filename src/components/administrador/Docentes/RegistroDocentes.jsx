import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "docentes_registrados";

const formularioInicial = {
  cod: "",
  nombre: "",
  sigla: "",
  gr: "",
  ins: "",
  sa: "",
  dia: "",
  horario: "",
  carrera: "",
  estado: "Activo",
};

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

const diasOpciones = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function RegistroDocentes() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [docentes, setDocentes] = useState([]);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("");

  useEffect(() => {
    cargarDocentes();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (mensaje) setMensaje("");
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setErrores({});
    setEditandoId(null);
    setMensaje("");
  };

  const normalizar = (valor) => String(valor || "").trim().toLowerCase();

  const validarHorario = (horario) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(horario)) return false;

    const [inicio, fin] = horario.split(" - ");
    const inicioMin = convertirHoraAMinutos(inicio);
    const finMin = convertirHoraAMinutos(fin);

    return inicioMin < finMin;
  };

  const convertirHoraAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const codigoConNombreDistinto = (registroActual) => {
    return docentes.some((docente) => {
      if (editandoId && docente.id === editandoId) return false;

      return (
        normalizar(docente.cod) === normalizar(registroActual.cod) &&
        normalizar(docente.nombre) !== normalizar(registroActual.nombre)
      );
    });
  };

  const existeAsignacionDuplicada = (registroActual) => {
    return docentes.some((docente) => {
      if (editandoId && docente.id === editandoId) return false;

      return (
        normalizar(docente.cod) === normalizar(registroActual.cod) &&
        normalizar(docente.sigla) === normalizar(registroActual.sigla) &&
        normalizar(docente.gr) === normalizar(registroActual.gr) &&
        normalizar(docente.ins) === normalizar(registroActual.ins) &&
        normalizar(docente.dia) === normalizar(registroActual.dia) &&
        normalizar(docente.horario) === normalizar(registroActual.horario) &&
        normalizar(docente.carrera) === normalizar(registroActual.carrera)
      );
    });
  };

  const hayConflictoHorario = (registroActual) => {
    const [inicioNuevo, finNuevo] = registroActual.horario.split(" - ");
    const inicioNuevoMin = convertirHoraAMinutos(inicioNuevo);
    const finNuevoMin = convertirHoraAMinutos(finNuevo);

    return docentes.some((docente) => {
      if (editandoId && docente.id === editandoId) return false;

      if (normalizar(docente.cod) !== normalizar(registroActual.cod)) return false;
      if (normalizar(docente.dia) !== normalizar(registroActual.dia)) return false;

      const [inicioExistente, finExistente] = docente.horario.split(" - ");
      const inicioExistenteMin = convertirHoraAMinutos(inicioExistente);
      const finExistenteMin = convertirHoraAMinutos(finExistente);

      const mismaAsignacion =
        normalizar(docente.sigla) === normalizar(registroActual.sigla) &&
        normalizar(docente.gr) === normalizar(registroActual.gr) &&
        normalizar(docente.ins) === normalizar(registroActual.ins) &&
        normalizar(docente.horario) === normalizar(registroActual.horario) &&
        normalizar(docente.carrera) === normalizar(registroActual.carrera);

      if (mismaAsignacion) return false;

      return (
        inicioNuevoMin < finExistenteMin && finNuevoMin > inicioExistenteMin
      );
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.cod.trim()) nuevosErrores.cod = "Campo obligatorio.";
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "Campo obligatorio.";
    if (!formulario.sigla.trim()) nuevosErrores.sigla = "Campo obligatorio.";
    if (!formulario.gr.trim()) nuevosErrores.gr = "Campo obligatorio.";
    if (!formulario.ins.trim()) nuevosErrores.ins = "Campo obligatorio.";
    if (!formulario.dia.trim()) nuevosErrores.dia = "Campo obligatorio.";
    if (!formulario.horario.trim()) nuevosErrores.horario = "Campo obligatorio.";
    if (!formulario.carrera.trim()) nuevosErrores.carrera = "Campo obligatorio.";

    if (formulario.horario && !validarHorario(formulario.horario)) {
      nuevosErrores.horario =
        "Formato inválido. Ejemplo: 07:00 - 09:15";
    }

    if (codigoConNombreDistinto(formulario)) {
      nuevosErrores.nombre =
        "Este código ya pertenece a otro docente registrado.";
    }

    if (existeAsignacionDuplicada(formulario)) {
      nuevosErrores.sigla =
        "Esta asignación ya está registrada para este docente.";
    }

    if (
      formulario.cod &&
      formulario.dia &&
      formulario.horario &&
      validarHorario(formulario.horario) &&
      hayConflictoHorario(formulario)
    ) {
      nuevosErrores.horario =
        "Conflicto de horario: este docente ya tiene otra materia en ese día y rango horario.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const registrarDocente = () => {
    if (!validarFormulario()) {
      setMensaje("Revise los campos del formulario.");
      return;
    }

    const nuevoRegistro = {
      id: editandoId || Date.now(),
      cod: formulario.cod.trim(),
      nombre: formulario.nombre.trim().toUpperCase(),
      sigla: formulario.sigla.trim().toUpperCase(),
      gr: formulario.gr.trim().toUpperCase(),
      ins: formulario.ins.trim().toUpperCase(),
      sa: formulario.sa.trim(),
      dia: formulario.dia,
      horario: formulario.horario.trim(),
      carrera: formulario.carrera,
      estado: formulario.estado || "Activo",
    };

    let nuevosDocentes = [];

    if (editandoId) {
      nuevosDocentes = docentes.map((item) =>
        item.id === editandoId ? nuevoRegistro : item
      );
      guardarDocentes(nuevosDocentes);
      limpiarFormulario();
      setMensaje("Asignación docente actualizada correctamente.");
    } else {
      nuevosDocentes = [nuevoRegistro, ...docentes];
      guardarDocentes(nuevosDocentes);
      limpiarFormulario();
      setMensaje("Asignación docente registrada correctamente.");
    }
  };

  const editarDocente = (docente) => {
    setFormulario({
      cod: docente.cod || "",
      nombre: docente.nombre || "",
      sigla: docente.sigla || "",
      gr: docente.gr || "",
      ins: docente.ins || "",
      sa: docente.sa || "",
      dia: docente.dia || "",
      horario: docente.horario || "",
      carrera: docente.carrera || "",
      estado: docente.estado || "Activo",
    });

    setEditandoId(docente.id);
    setErrores({});
    setMensaje("Modo edición activado.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarDocente = (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta asignación docente?"
    );
    if (!confirmar) return;

    const nuevosDocentes = docentes.filter((item) => item.id !== id);
    guardarDocentes(nuevosDocentes);
    setMensaje("Asignación docente eliminada correctamente.");
  };

  const cambiarEstadoDocente = (id) => {
    const nuevosDocentes = docentes.map((item) =>
      item.id === id
        ? {
            ...item,
            estado: item.estado === "Activo" ? "Inactivo" : "Activo",
          }
        : item
    );

    guardarDocentes(nuevosDocentes);
    setMensaje("Estado de la asignación actualizado.");
  };

  const docentesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return [...docentes]
      .filter((item) => {
        const coincideBusqueda =
          String(item.cod || "").toLowerCase().includes(texto) ||
          String(item.nombre || "").toLowerCase().includes(texto) ||
          String(item.sigla || "").toLowerCase().includes(texto);

        const coincideDia = filtroDia ? item.dia === filtroDia : true;
        const coincideCarrera = filtroCarrera
          ? item.carrera === filtroCarrera
          : true;
        const coincideMateria = filtroMateria
          ? String(item.sigla || "")
              .toLowerCase()
              .includes(filtroMateria.toLowerCase())
          : true;

        return (
          coincideBusqueda &&
          coincideDia &&
          coincideCarrera &&
          coincideMateria
        );
      })
      .sort((a, b) => {
        const codA = String(a.cod || "").toLowerCase();
        const codB = String(b.cod || "").toLowerCase();
        return codA.localeCompare(codB);
      });
  }, [docentes, busqueda, filtroDia, filtroCarrera, filtroMateria]);

  const resumen = useMemo(() => {
    return {
      totalAsignaciones: docentes.length,
      docentesUnicos: new Set(docentes.map((d) => normalizar(d.cod))).size,
      activos: docentes.filter((d) => d.estado === "Activo").length,
    };
  }, [docentes]);

  return (
    <div>
      <h2>Registro de Docentes</h2>
      <p style={{ marginBottom: "20px" }}>
        Registro de docentes por asignación académica.
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
          <h4>Asignaciones activas</h4>
          <p>{resumen.activos}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Datos del docente</h3>

        <div className="form-grid">
          <div className="grupo-input">
            <label>Código *</label>
            <input
              type="text"
              name="cod"
              value={formulario.cod}
              onChange={handleChange}
              placeholder="Ej.: 8629"
            />
            {errores.cod && <small className="error-text">{errores.cod}</small>}
          </div>

          <div className="grupo-input" style={{ gridColumn: "span 2" }}>
            <label>Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Apellidos y nombres"
            />
            {errores.nombre && (
              <small className="error-text">{errores.nombre}</small>
            )}
          </div>
        </div>
      </div>

      <div className="seccion-formulario-docente" style={{ marginTop: "24px" }}>
        <h3>Datos de la asignación</h3>

        <div className="form-grid">
          <div className="grupo-input">
            <label>Sigla *</label>
            <input
              type="text"
              name="sigla"
              value={formulario.sigla}
              onChange={handleChange}
              placeholder="Ej.: ADM320"
            />
            {errores.sigla && (
              <small className="error-text">{errores.sigla}</small>
            )}
          </div>

          <div className="grupo-input">
            <label>Grupo *</label>
            <input
              type="text"
              name="gr"
              value={formulario.gr}
              onChange={handleChange}
              placeholder="Ej.: A"
            />
            {errores.gr && <small className="error-text">{errores.gr}</small>}
          </div>

          <div className="grupo-input">
            <label>Ins *</label>
            <input
              type="text"
              name="ins"
              value={formulario.ins}
              onChange={handleChange}
              placeholder="Ej.: IY"
            />
            {errores.ins && <small className="error-text">{errores.ins}</small>}
          </div>

          <div className="grupo-input">
            <label>S/A</label>
            <input
              type="text"
              name="sa"
              value={formulario.sa}
              onChange={handleChange}
              placeholder="Semestre/Año"
            />
          </div>

          <div className="grupo-input">
            <label>Día *</label>
            <select name="dia" value={formulario.dia} onChange={handleChange}>
              <option value="">Seleccione</option>
              {diasOpciones.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
            {errores.dia && <small className="error-text">{errores.dia}</small>}
          </div>

          <div className="grupo-input">
            <label>Horario *</label>
            <input
              type="text"
              name="horario"
              value={formulario.horario}
              onChange={handleChange}
              placeholder="07:00 - 09:15"
            />
            {errores.horario && (
              <small className="error-text">{errores.horario}</small>
            )}
          </div>

          <div className="grupo-input">
            <label>Carrera *</label>
            <select
              name="carrera"
              value={formulario.carrera}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              {carrerasOpciones.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
            {errores.carrera && (
              <small className="error-text">{errores.carrera}</small>
            )}
          </div>
        </div>
      </div>

      <div className="acciones-horario" style={{ marginTop: "25px" }}>
        <button className="btn-login" type="button" onClick={registrarDocente}>
          {editandoId ? "Actualizar asignación" : "Registrar asignación"}
        </button>

        <button className="btn-login" type="button" onClick={limpiarFormulario}>
          Limpiar formulario
        </button>
      </div>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}

      <div style={{ marginTop: "35px" }}>
        <h3>Consulta y búsqueda</h3>

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
        </div>

        <table className="tabla-dashboard" style={{ marginTop: "20px" }}>
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
              docentesFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.cod}</td>
                  <td>{item.nombre}</td>
                  <td>{item.sigla}</td>
                  <td>{item.gr}</td>
                  <td>{item.ins || "-"}</td>
                  <td>{item.sa || "-"}</td>
                  <td>{item.dia}</td>
                  <td>{item.horario}</td>
                  <td>{item.carrera}</td>
                  <td>{item.estado}</td>
                  <td>
                    <div className="acciones-tabla">
                      <button onClick={() => editarDocente(item)}>Editar</button>
                      <button onClick={() => cambiarEstadoDocente(item.id)}>
                        {item.estado === "Activo" ? "Desactivar" : "Activar"}
                      </button>
                      <button onClick={() => eliminarDocente(item.id)}>
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

export default RegistroDocentes;