import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "estado_aulas_secretaria";

const aulasIniciales = {
  // Nuevo módulo
  B20: "disponible",
  B26: "disponible",
  DContabilidad: "disponible",
  C6: "disponible",
  C12: "disponible",

  VCV: "disponible",
  DSuelos: "disponible",
  LMicrobiologia: "disponible",
  LFisiopatologia: "disponible",
  BIB: "mantenimiento",

  N9: "disponible",
  DQui: "disponible",
  LQuimica: "disponible",
  SEC: "ocupada",

  B21: "disponible",
  B27: "disponible",
  ActivoF: "disponible",
  C7: "disponible",
  C13: "disponible",

  // Módulo antiguo
  LBS: "disponible",
  C: "disponible",
  A2: "disponible",
  B2: "ocupada",
  EFM: "mantenimiento",

  AU: "disponible",
  CM: "disponible",
  A1: "disponible",
  B1: "ocupada",
  C1: "disponible",

  C2: "mantenimiento",
  D2: "ocupada",
  CIE: "mantenimiento",
  E2: "mantenimiento",
  F2: "mantenimiento",
  D1: "mantenimiento",
  E1: "disponible",
  CPD: "mantenimiento",
  F1: "ocupada",

  COMEDOR: "mantenimiento",
  SLCOMP: "mantenimiento",
  CONFERENCIAS: "mantenimiento",
};

function EstadoDeAulas() {
  const [aulas, setAulas] = useState(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (!guardado) return aulasIniciales;

    try {
      const aulasGuardadas = JSON.parse(guardado);

      return {
        ...aulasIniciales,
        ...aulasGuardadas,
      };
    } catch (error) {
      console.error("Error al leer estado de aulas desde localStorage:", error);
      return aulasIniciales;
    }
  });

  const [aulaSeleccionada, setAulaSeleccionada] = useState("VCV");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(aulas));
  }, [aulas]);

  const resumen = useMemo(() => {
    const valores = Object.values(aulas);

    return {
      disponible: valores.filter((estado) => estado === "disponible").length,
      ocupada: valores.filter((estado) => estado === "ocupada").length,
      reservada: valores.filter((estado) => estado === "reservada").length,
      mantenimiento: valores.filter((estado) => estado === "mantenimiento")
        .length,
    };
  }, [aulas]);

  const totalAulas = Object.keys(aulasIniciales).length;

  const seleccionarAula = (nombre) => {
    setAulaSeleccionada(nombre);
    setMensaje("");
  };

  const cambiarEstado = (estadoNuevo) => {
    setAulas((prev) => ({
      ...prev,
      [aulaSeleccionada]: estadoNuevo,
    }));

    setMensaje(
      `El aula ${aulaSeleccionada} fue actualizada a "${estadoNuevo}".`
    );
  };

  const generarAulasDisponibles = () => {
    const nuevasAulas = {};

    Object.keys(aulasIniciales).forEach((aula) => {
      nuevasAulas[aula] = "disponible";
    });

    return nuevasAulas;
  };

  const restablecerEstados = () => {
    const todasDisponibles = generarAulasDisponibles();

    setAulas(todasDisponibles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todasDisponibles));
    setAulaSeleccionada("VCV");
    setMensaje(`Todas las aulas fueron restablecidas a DISPONIBLE.`);
  };

  const aulaClass = (base, aula) => {
    const estado = aulas[aula] || "disponible";
    const seleccionada = aulaSeleccionada === aula ? " seleccionada" : "";
    return `${base} ${estado}${seleccionada}`;
  };

  const renderBotonAula = (
    aula,
    claseBase = "mini-aula moderna",
    etiqueta = aula
  ) => (
    <button
      key={aula}
      className={aulaClass(claseBase, aula)}
      onClick={() => seleccionarAula(aula)}
      type="button"
      title={`${etiqueta} - ${aulas[aula] || "disponible"}`}
    >
      {etiqueta}
    </button>
  );

  return (
    <main className="contenido-panel moderno-panel">
      <div className="titulo-plano-header">
        <h2>ESTADO DE AULAS</h2>

        <div className="leyenda-moderna">
          <div>
            <span className="punto disponible"></span> Disponible
          </div>
          <div>
            <span className="punto ocupada"></span> Ocupada
          </div>
          <div>
            <span className="punto reservada"></span> Reservada
          </div>
          <div>
            <span className="punto mantenimiento"></span> Mantenimiento
          </div>
        </div>
      </div>

      <div className="resumen-aulas">
        <div className="card-resumen disponible">
          <h4>Disponibles</h4>
          <p>{resumen.disponible}</p>
        </div>

        <div className="card-resumen ocupada">
          <h4>Ocupadas</h4>
          <p>{resumen.ocupada}</p>
        </div>

        <div className="card-resumen reservada">
          <h4>Reservadas</h4>
          <p>{resumen.reservada}</p>
        </div>

        <div className="card-resumen mantenimiento">
          <h4>Mantenimiento</h4>
          <p>{resumen.mantenimiento}</p>
        </div>
      </div>

      <p style={{ color: "#9ecfff", marginTop: "10px" }}>
        Total de ambientes registrados: <strong>{totalAulas}</strong>
      </p>

      <div className="panel-seleccion-estado moderno-selector">
        <div className="cabecera-selector">
          <div>
            <h3>Aula seleccionada: {aulaSeleccionada}</h3>
            <p className="estado-actual-texto">
              Estado actual:{" "}
              <strong>{aulas[aulaSeleccionada] || "disponible"}</strong>
            </p>
            <p className="texto-instruccion">
              Seleccione el estado que desea asignar:
            </p>
          </div>
        </div>

        <div className="botones-estado">
          <button
            className="btn-estado disponible"
            onClick={() => cambiarEstado("disponible")}
            type="button"
          >
            Disponible
          </button>

          <button
            className="btn-estado ocupada"
            onClick={() => cambiarEstado("ocupada")}
            type="button"
          >
            Ocupada
          </button>

          <button
            className="btn-estado reservada"
            onClick={() => cambiarEstado("reservada")}
            type="button"
          >
            Reservada
          </button>

          <button
            className="btn-estado mantenimiento"
            onClick={() => cambiarEstado("mantenimiento")}
            type="button"
          >
            Mantenimiento
          </button>

          <button
            className="btn-estado btn-restablecer"
            onClick={restablecerEstados}
            type="button"
          >
            Restablecer
          </button>
        </div>

        {mensaje && <p className="mensaje-estado-aula">{mensaje}</p>}
      </div>

      <div className="plano-moderno layout-plano-aulas">
        <section className="sector-antiguo">
          <div className="etiqueta-modulo">Módulo Antiguo</div>

          <div className="zona-arriba-antiguo">
            <div className="pisos-antiguo">
              <div className="bloque-piso">
                <div className="piso-label">PRIMER PISO</div>
                <div className="fila-aulas">
                  {["LBS", "C", "A2", "B2", "EFM"].map((aula) =>
                    renderBotonAula(aula, "aula-plano moderna")
                  )}
                </div>
              </div>

              <div className="bloque-piso">
                <div className="piso-label">PLANTA BAJA</div>
                <div className="fila-aulas">
                  {["AU", "CM", "A1", "B1", "C1"].map((aula) =>
                    renderBotonAula(aula, "aula-plano moderna")
                  )}
                </div>
              </div>
            </div>

            <div className="columna-vertical-derecha">
              {["C2", "D2", "CIE", "E2", "F2", "D1", "E1", "CPD", "F1"].map(
                (aula) => renderBotonAula(aula, "aula-vertical moderna")
              )}
            </div>
          </div>

          <div className="zona-abajo-antiguo">
            {renderBotonAula("COMEDOR", "comedor moderno")}

            <div className="lado-derecho-inferior">
              {renderBotonAula("SLCOMP", "bloque-largo moderno", "SL. COMP")}
              {renderBotonAula("CONFERENCIAS", "bloque-largo moderno")}
            </div>
          </div>
        </section>

        <section className="sector-nuevo">
          <div className="etiqueta-modulo">Nuevo Módulo</div>

          <div className="grupo-filas">
            <div className="fila-simple">
              {[
                "B20",
                "B26",
                "DContabilidad",
                "C6",
                "C12",
              ].map((aula) => renderBotonAula(aula))}
            </div>

            <div className="fila-simple fila-con-extremos">
              {[
                "VCV",
                "DSuelos",
                "LMicrobiologia",
                "LFisiopatologia",
                "BIB",
              ].map((aula) => renderBotonAula(aula))}
            </div>

            <div className="fila-simple fila-con-extremos">
              {["N9", "DQui", "LQuimica", "SEC"].map((aula) =>
                renderBotonAula(aula)
              )}
            </div>

            <div className="fila-simple">
              {["B21", "B27", "ActivoF", "C7", "C13"].map((aula) =>
                renderBotonAula(aula)
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EstadoDeAulas;