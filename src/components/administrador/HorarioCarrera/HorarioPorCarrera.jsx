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
  "GENERAL",
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

const coloresCarrera = {
  Agropecuaria: "#8bc34a",
  Comercial: "#f4c20d",
  Contaduria: "#f5e6c8",
  Derecho: "#e8e4a8",
  Educacion: "#4dd0e1",
  Empresas: "#64b5f6",
  Enfermeria: "#67e8f9",
  Industrial: "#ff5252",
  Sistemas: "#9e9e9e",
  Veterinaria: "#ea80fc",
};

const horasVisuales = [
  "07:00",
  "07:45",
  "08:30",
  "09:15",
  "10:00",
  "10:45",
  "11:30",
  "12:15",
  "13:00",
  "13:45",
  "14:30",
  "15:15",
  "16:00",
  "16:45",
  "17:30",
  "18:15",
  "19:00",
  "19:45",
  "20:30",
  "21:15",
  "22:00",
  "22:45",
];

const PIXELES_POR_MINUTO = 1.35;
const HORA_INICIO_BASE = "07:00";
const HORA_FIN_BASE = "22:45";
const MARGEN_LATERAL = 14;
const ESPACIO_ENTRE_BLOQUES = 8;

function HorarioPorCarrera() {
  const [registros, setRegistros] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("GENERAL");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  const normalizar = (valor) => String(valor || "").trim().toLowerCase();

  const convertirHoraAMinutos = (hora) => {
    const [h, m] = String(hora).split(":").map(Number);
    return h * 60 + m;
  };

  const minutosBaseInicio = convertirHoraAMinutos(HORA_INICIO_BASE);
  const minutosBaseFin = convertirHoraAMinutos(HORA_FIN_BASE);

  const altoContenedor =
    (minutosBaseFin - minutosBaseInicio) * PIXELES_POR_MINUTO + 2;

  const cargarRegistros = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const registrosGuardados = data ? JSON.parse(data) : [];
      setRegistros(Array.isArray(registrosGuardados) ? registrosGuardados : []);
      setMensaje("");
    } catch (error) {
      console.error("Error al cargar horario:", error);
      setRegistros([]);
      setMensaje("No se pudo cargar la información del horario.");
    }
  };

  const asignacionesFiltradas = useMemo(() => {
    return registros
      .filter((item) => normalizar(item.estado) === "activo")
      .filter((item) => item.dia === diaSeleccionado)
      .filter((item) =>
      carreraSeleccionada === "GENERAL"
             ? true
          : item.carrera === carreraSeleccionada)
      .filter(
        (item) =>
          item.horario &&
          item.sigla &&
          item.nombre &&
          item.carrera &&
          item.horario.includes(" - ")
      )
      .map((item) => {
        const [horaInicio, horaFin] = item.horario.split(" - ");
        const inicioMin = convertirHoraAMinutos(horaInicio);
        const finMin = convertirHoraAMinutos(horaFin);

        return {
          ...item,
          inicioMin,
          finMin,
        };
      })
      .sort((a, b) => {
        if (a.inicioMin !== b.inicioMin) return a.inicioMin - b.inicioMin;
        return a.finMin - b.finMin;
      });
  }, [registros, diaSeleccionado, carreraSeleccionada]);

  const bloquesHorario = useMemo(() => {
    if (asignacionesFiltradas.length === 0) return [];

    const items = asignacionesFiltradas.map((item) => ({
      ...item,
      columna: 0,
      totalColumnas: 1,
    }));

    let i = 0;

    while (i < items.length) {
      const grupo = [items[i]];
      let maxFin = items[i].finMin;
      let j = i + 1;

      while (j < items.length && items[j].inicioMin < maxFin) {
        grupo.push(items[j]);
        maxFin = Math.max(maxFin, items[j].finMin);
        j += 1;
      }

      const columnas = [];

      grupo.forEach((bloque) => {
        let columnaAsignada = 0;

        while (true) {
          if (!columnas[columnaAsignada]) {
            columnas[columnaAsignada] = [];
            break;
          }

          const ultimoEnColumna =
            columnas[columnaAsignada][columnas[columnaAsignada].length - 1];

          if (bloque.inicioMin >= ultimoEnColumna.finMin) {
            break;
          }

          columnaAsignada += 1;
        }

        bloque.columna = columnaAsignada;
        columnas[columnaAsignada].push(bloque);
      });

      const totalColumnasGrupo = columnas.length;

      grupo.forEach((bloque) => {
        bloque.totalColumnas = totalColumnasGrupo;
      });

      i = j;
    }

    return items.map((item) => {
      const top = (item.inicioMin - minutosBaseInicio) * PIXELES_POR_MINUTO;
      const height = Math.max(
        (item.finMin - item.inicioMin) * PIXELES_POR_MINUTO,
        52
      );

      const anchoDisponible = `calc((100% - ${MARGEN_LATERAL * 2}px - ${
        (item.totalColumnas - 1) * ESPACIO_ENTRE_BLOQUES
      }px) / ${item.totalColumnas})`;

      const left = `calc(${MARGEN_LATERAL}px + (${anchoDisponible} + ${ESPACIO_ENTRE_BLOQUES}px) * ${item.columna})`;

      return {
        ...item,
        top,
        height,
        left,
        width: anchoDisponible,
      };
    });
  }, [asignacionesFiltradas, minutosBaseInicio]);

  const resumen = useMemo(() => {
    return {
      total: asignacionesFiltradas.length,
      docentes: new Set(asignacionesFiltradas.map((i) => i.cod)).size,
      materias: new Set(asignacionesFiltradas.map((i) => i.sigla)).size,
    };
  }, [asignacionesFiltradas]);

  return (
    <div>
      <h2>Horario por Carrera</h2>
      <p style={{ marginBottom: "20px" }}>
        Visualización académica del horario institucional por día y carrera.
      </p>

      <div className="card-grid" style={{ marginBottom: "25px" }}>
        <div className="info-card">
          <h4>Día seleccionado</h4>
          <p style={{ fontSize: "22px" }}>{diaSeleccionado}</p>
        </div>

        <div className="info-card">
          <h4>Carrera seleccionada</h4>
          <p style={{ fontSize: "22px" }}>{carreraSeleccionada}</p>
        </div>

        <div className="info-card">
          <h4>Asignaciones activas</h4>
          <p>{resumen.total}</p>
        </div>

        <div className="info-card">
          <h4>Docentes visibles</h4>
          <p>{resumen.docentes}</p>
        </div>
      </div>

      <div className="seccion-formulario-docente">
        <h3>Selector de día</h3>
        <div className="selector-dia">
          {diasOpciones.map((dia) => (
            <button
              key={dia}
              type="button"
              className={diaSeleccionado === dia ? "activo" : ""}
              onClick={() => setDiaSeleccionado(dia)}
            >
              {dia}
            </button>
          ))}
        </div>
      </div>

      <div className="seccion-formulario-docente" style={{ marginTop: "24px" }}>
        <h3>Selector de carrera</h3>

        <div className="selector-carrera-horario">
          <div className="grupo-input">
            <label>Carrera</label>
            <select
              value={carreraSeleccionada}
              onChange={(e) => setCarreraSeleccionada(e.target.value)}
            >
              {carrerasOpciones.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn-login"
            onClick={cargarRegistros}
          >
            Actualizar horario
          </button>
        </div>
      </div>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}

      <div className="seccion-formulario-docente" style={{ marginTop: "24px" }}>
        <h3>Leyenda por carrera</h3>

        <div className="leyenda">
          {Object.entries(coloresCarrera).map(([carrera, color]) => (
            <div key={carrera} className="item-leyenda">
              <span style={{ backgroundColor: color }}></span>
              <strong>{carrera}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="contenedor-horario">
        <div className="horario-grid" style={{ height: `${altoContenedor}px` }}>
          <div className="columna-horas">
            {horasVisuales.map((hora) => (
              <div
                key={hora}
                className="hora"
                style={{ height: `${45 * PIXELES_POR_MINUTO}px` }}
              >
                {hora}
              </div>
            ))}
          </div>

          <div className="contenedor-bloques">
            {horasVisuales.map((hora) => (
              <div
                key={hora}
                className="linea-horaria"
                style={{
                  top: `${
                    (convertirHoraAMinutos(hora) - minutosBaseInicio) *
                    PIXELES_POR_MINUTO
                  }px`,
                }}
              />
            ))}

            {bloquesHorario.length > 0 ? (
           bloquesHorario.map((item) => (
           <div
            key={item.id}
            className="bloque"
              style={{
              top: `${item.top}px`,
              height: `${item.height}px`,
              left: item.left,
              width: item.width,
              backgroundColor:
                coloresCarrera[item.carrera] || "#607d8b",
                 }}
                 title={`${item.sigla} - ${item.nombre} - ${item.horario}`}
               >
              <strong>{item.sigla}</strong>
              <div className="bloque-texto bloque-docente-nombre">
                 {item.nombre}
              </div>
              <div className="bloque-texto">Grupo: {item.gr || "-"}</div>
              <div className="bloque-texto">{item.horario}</div>
              <div className="bloque-texto bloque-carrera-etiqueta">
                 {item.carrera}
              </div>
              </div>
                 ))
                ) : (
              <div className="sin-horario-mensaje">
                    No existen asignaciones activas para{" "}
                   {carreraSeleccionada === "GENERAL"
                 ? `todas las carreras el día ${diaSeleccionado}`
                 : `${carreraSeleccionada} el día ${diaSeleccionado}`}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorarioPorCarrera;