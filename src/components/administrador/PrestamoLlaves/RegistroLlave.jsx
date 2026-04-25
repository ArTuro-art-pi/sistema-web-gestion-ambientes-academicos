import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "prestamos_llaves";

const formularioInicial = {
  fecha: "",
  dia: "",
  hora: "",
  turno: "",
  nombreApellido: "",
  llave: "",
  controlEquipo: "",
  controlAire: "",
  entregadoPor: "",
  observaciones: "",
  estado: "Prestado",
  observacionFinal: "",
};

function RegistroLlave() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [prestamos, setPrestamos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    cargarPrestamos();
    asignarFechaActual();
  }, []);

    const asignarFechaActual = () => {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaActual = `${anio}-${mes}-${dia}`;

    const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

    const diaActual = dias[hoy.getDay()];

    setFormulario((prev) => ({
    ...prev,
    fecha: fechaActual,
    dia: diaActual,
  }));
  };

  const cargarPrestamos = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registros = data ? JSON.parse(data) : [];
      setPrestamos(Array.isArray(registros) ? registros : []);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
      setPrestamos([]);
    }
  };

  const guardarPrestamos = (nuevosPrestamos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosPrestamos));
    setPrestamos(nuevosPrestamos);
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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.hora.trim()) nuevosErrores.hora = "Campo obligatorio.";
    if (!formulario.turno.trim()) nuevosErrores.turno = "Campo obligatorio.";
    if (!formulario.nombreApellido.trim()) {
      nuevosErrores.nombreApellido = "Campo obligatorio.";
    }
    if (!formulario.llave.trim()) nuevosErrores.llave = "Campo obligatorio.";
    if (!formulario.controlEquipo.trim()) {
      nuevosErrores.controlEquipo = "Campo obligatorio.";
    }
    if (!formulario.controlAire.trim()) {
      nuevosErrores.controlAire = "Campo obligatorio.";
    }
    if (!formulario.entregadoPor.trim()) {
      nuevosErrores.entregadoPor = "Campo obligatorio.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setErrores({});
    setEditandoId(null);
    setMensaje("");
    asignarFechaActual();
  };

  const registrarPrestamo = () => {
    if (!validarFormulario()) {
      setMensaje("Complete correctamente los campos obligatorios.");
      return;
    }

    const nuevoRegistro = {
      id: editandoId || Date.now(),
      fecha: formulario.fecha || "",
      dia: formulario.dia || "",
      hora: formulario.hora || "",
      turno: formulario.turno || "",
      nombreApellido: formulario.nombreApellido || "",
      llave: formulario.llave || "",
      controlEquipo: formulario.controlEquipo || "",
      controlAire: formulario.controlAire || "",
      entregadoPor: formulario.entregadoPor || "",
      observaciones: formulario.observaciones || "",
      estado: formulario.estado || "Prestado",
      observacionFinal: formulario.observacionFinal || "",
      usuarioRegistro: "Secretaría",
    };

    let nuevosPrestamos = [];

    if (editandoId) {
      nuevosPrestamos = prestamos.map((item) =>
        item.id === editandoId ? nuevoRegistro : item
      );
      setMensaje("Registro actualizado correctamente.");
    } else {
      nuevosPrestamos = [nuevoRegistro, ...prestamos];
      setMensaje("Préstamo registrado correctamente.");
    }

    guardarPrestamos(nuevosPrestamos);
    limpiarFormulario();
  };

  const editarRegistro = (registro) => {
    setFormulario({
      fecha: registro.fecha || "",
      dia: registro.dia || "",
      hora: registro.hora || "",
      turno: registro.turno || "",
      nombreApellido: registro.nombreApellido || "",
      llave: registro.llave || "",
      controlEquipo: registro.controlEquipo || "",
      controlAire: registro.controlAire || "",
      entregadoPor: registro.entregadoPor || "",
      observaciones: registro.observaciones || "",
      estado: registro.estado || "Prestado",
      observacionFinal: registro.observacionFinal || "",
    });

    setEditandoId(registro.id);
    setMensaje("Modo edición activado.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actualizarDevolucion = (id) => {
    const nuevosPrestamos = prestamos.map((item) =>
      item.id === id
        ? {
            ...item,
            estado: "Devuelto",
            observacionFinal:
              item.observacionFinal || "Llave devuelta correctamente.",
          }
        : item
    );

    guardarPrestamos(nuevosPrestamos);
    setMensaje("Estado de devolución actualizado.");
  };

  const eliminarRegistro = (id) => {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este registro?"
    );
    if (!confirmar) return;

    const nuevosPrestamos = prestamos.filter((item) => item.id !== id);
    guardarPrestamos(nuevosPrestamos);
    setMensaje("Registro eliminado correctamente.");
  };

  const prestamosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return [...prestamos]
      .filter((item) => {
        const fecha = String(item.fecha || "").toLowerCase();
        const turno = String(item.turno || "").toLowerCase();
        const nombre = String(item.nombreApellido || "").toLowerCase();
        const llave = String(item.llave || "").toLowerCase();
        const estado = String(item.estado || "").toLowerCase();

        return (
          fecha.includes(texto) ||
          turno.includes(texto) ||
          nombre.includes(texto) ||
          llave.includes(texto) ||
          estado.includes(texto)
        );
      })
      .sort((a, b) => {
        const fechaHoraA = new Date(
          `${a.fecha || "1900-01-01"}T${a.hora || "00:00"}`
        );
        const fechaHoraB = new Date(
          `${b.fecha || "1900-01-01"}T${b.hora || "00:00"}`
        );

        return fechaHoraA - fechaHoraB;
      });
  }, [prestamos, busqueda]);

  const imprimirHistorial = () => {
    if (prestamosFiltrados.length === 0) {
      setMensaje("No hay registros en el historial para imprimir.");
      return;
    }

    const fechaImpresion = new Date();
    const fechaTexto = fechaImpresion.toLocaleDateString("es-BO");
    const diaTexto = fechaImpresion.toLocaleDateString("es-BO", {
      weekday: "long",
    });

    const filasConDatos = prestamosFiltrados.map(
      (item) => `
        <tr>
          <td>${item.hora || ""}</td>
          <td>${item.turno || ""}</td>
          <td>${item.nombreApellido || ""}</td>
          <td>${item.llave || ""}</td>
          <td>${item.controlEquipo || ""}</td>
          <td>${item.controlAire || ""}</td>
          <td>${item.entregadoPor || ""}</td>
          <td>${item.observaciones || ""}</td>
        </tr>
      `
    );

    const totalFilasDeseadas = 30;
    const filasVacias = Array.from({
      length: Math.max(totalFilasDeseadas - prestamosFiltrados.length, 0),
    }).map(
      () => `
        <tr>
          <td>&nbsp;</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `
    );

    const filasHTML = [...filasConDatos, ...filasVacias].join("");

    const ventana = window.open("", "_blank", "width=1100,height=900");

    if (!ventana) {
      setMensaje("No se pudo abrir la ventana de impresión.");
      return;
    }

    ventana.document.write(`
      <html>
        <head>
          <title>Historial de Préstamo de Llaves</title>
          <style>
            body {
              font-family: "Times New Roman", serif;
              margin: 18px;
              color: #000;
            }

            .encabezado {
              text-align: center;
              margin-bottom: 6px;
            }

            .encabezado h1,
            .encabezado h2,
            .encabezado h3,
            .encabezado p {
              margin: 2px 0;
              font-weight: normal;
            }

            .linea-superior {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
              font-size: 14px;
            }

            .titulo-centro {
              flex: 1;
              text-align: center;
            }

            .datos-fecha {
              display: flex;
              justify-content: flex-end;
              gap: 18px;
              margin-bottom: 8px;
              font-size: 13px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 3px 4px;
              text-align: center;
              vertical-align: middle;
            }

            th {
              font-weight: bold;
            }

            .col-hora { width: 8%; }
            .col-turno { width: 8%; }
            .col-nombre { width: 22%; }
            .col-llave { width: 10%; }
            .col-equipo { width: 15%; }
            .col-aire { width: 13%; }
            .col-entregado { width: 10%; }
            .col-observaciones { width: 14%; }

            @media print {
              @page {
                size: landscape;
                margin: 12mm;
              }

              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="linea-superior">
            <div></div>
            <div class="titulo-centro">Facultad Integral de Ichilo</div>
            <div></div>
          </div>

          <div class="linea-superior">
            <div></div>
            <div class="titulo-centro">Prestamo de Llaves</div>
            <div>Día: ${diaTexto} &nbsp;&nbsp;&nbsp; Fecha: ${fechaTexto}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-hora">Hora</th>
                <th class="col-turno">Turno</th>
                <th class="col-nombre">Nombre y Apellido</th>
                <th class="col-llave">Llave</th>
                <th class="col-equipo">Control de Equipo</th>
                <th class="col-aire">C. de Aire</th>
                <th class="col-entregado">Entregado</th>
                <th class="col-observaciones">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              ${filasHTML}
            </tbody>
          </table>

          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    ventana.document.close();
  };

  return (
    <div>
      <h2>Préstamo de llaves</h2>
      <p style={{ marginBottom: "20px" }}>
        Registro y control administrativo del préstamo de llaves de ambientes.
      </p>

      <div className="form-grid">
        <div className="grupo-input">
          <label>Fecha</label>
          <input type="date" name="fecha" value={formulario.fecha} readOnly />
        </div>

        <div className="grupo-input">
          <label>Día</label>
          <input type="text" name="dia" value={formulario.dia} readOnly />
        </div>

        <div className="grupo-input">
          <label>Hora *</label>
          <input
            type="time"
            name="hora"
            value={formulario.hora}
            onChange={handleChange}
          />
          {errores.hora && <small className="error-text">{errores.hora}</small>}
        </div>

        <div className="grupo-input">
          <label>Turno *</label>
          <select
            name="turno"
            value={formulario.turno}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
          {errores.turno && (
            <small className="error-text">{errores.turno}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Nombre y apellido del solicitante *</label>
          <input
            type="text"
            name="nombreApellido"
            value={formulario.nombreApellido}
            onChange={handleChange}
          />
          {errores.nombreApellido && (
            <small className="error-text">{errores.nombreApellido}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Llave / Ambiente *</label>
          <input
            type="text"
            name="llave"
            value={formulario.llave}
            onChange={handleChange}
            placeholder="Ej.: Aula N-12"
          />
          {errores.llave && (
            <small className="error-text">{errores.llave}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Control de equipo *</label>
          <select
            name="controlEquipo"
            value={formulario.controlEquipo}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Conforme">Conforme</option>
            <option value="Observado">Observado</option>
            <option value="No aplica">No aplica</option>
          </select>
          {errores.controlEquipo && (
            <small className="error-text">{errores.controlEquipo}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Control de aire *</label>
          <select
            name="controlAire"
            value={formulario.controlAire}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Conforme">Conforme</option>
            <option value="Observado">Observado</option>
            <option value="No aplica">No aplica</option>
          </select>
          {errores.controlAire && (
            <small className="error-text">{errores.controlAire}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Entregado por *</label>
          <input
            type="text"
            name="entregadoPor"
            value={formulario.entregadoPor}
            onChange={handleChange}
          />
          {errores.entregadoPor && (
            <small className="error-text">{errores.entregadoPor}</small>
          )}
        </div>

        <div className="grupo-input" style={{ gridColumn: "1 / -1" }}>
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formulario.observaciones}
            onChange={handleChange}
            rows="3"
          />
        </div>
      </div>

      <div className="acciones-horario" style={{ marginTop: "25px" }}>
        <button className="btn-login" type="button" onClick={registrarPrestamo}>
          {editandoId ? "Actualizar préstamo" : "Registrar préstamo"}
        </button>

        <button className="btn-login" type="button" onClick={limpiarFormulario}>
          Limpiar formulario
        </button>

        <button
          className="btn-login"
          type="button"
          onClick={() => setMostrarHistorial((prev) => !prev)}
        >
          {mostrarHistorial
            ? "Ocultar historial de préstamos"
            : "Ver historial de préstamos"}
        </button>

        {mostrarHistorial && (
          <button
            className="btn-login btn-imprimir"
            type="button"
            onClick={imprimirHistorial}
          >
            Imprimir historial
          </button>
        )}
      </div>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}

      {mostrarHistorial && (
        <div
          className="bloque-historial-prestamos"
          style={{ marginTop: "35px" }}
        >
          <h3>Historial de préstamos</h3>

          <div className="grupo-input" style={{ marginBottom: "15px" }}>
            <label>Buscar registro</label>
            <input
              type="text"
              placeholder="Buscar por fecha, turno, solicitante, llave o estado"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
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
                <th>Equipo</th>
                <th>Aire</th>
                <th>Entregado por</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamosFiltrados.length > 0 ? (
                prestamosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fecha || "-"}</td>
                    <td>{item.dia || "-"}</td>
                    <td>{item.hora || "-"}</td>
                    <td>{item.turno || "-"}</td>
                    <td>{item.nombreApellido || "-"}</td>
                    <td>{item.llave || "-"}</td>
                    <td>{item.controlEquipo || "-"}</td>
                    <td>{item.controlAire || "-"}</td>
                    <td>{item.entregadoPor || "-"}</td>
                    <td>{item.estado || "-"}</td>
                    <td>{item.observaciones || "-"}</td>
                    <td>

                    <div className="acciones-tabla">
                       <button
                       className="btn-tabla-editar"
                       onClick={() => editarRegistro(item)}
                       >
                        Editar
                       </button>

                       {item.estado !== "Devuelto" && (
                       <button
                        className="btn-tabla-devolver"
                       onClick={() => actualizarDevolucion(item.id)}
                       >
                          Devolver
                       </button>
                     )}

                      <button
                      className="btn-tabla-eliminar"
                      onClick={() => eliminarRegistro(item.id)}
                      >
                      Eliminar
                   </button>
                </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">No existen registros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RegistroLlave;