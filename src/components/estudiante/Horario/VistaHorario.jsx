import React from "react";
import {
  obtenerHorarioPorId,
  eliminarHorarioPorId,
} from "../../../utils/estudianteStorage";

function VistaHorario({ userId, onEditar, onEliminado }) {
  const horario = obtenerHorarioPorId(userId);

  if (!horario) {
  return (
    <div>
      <h2>Horario académico</h2>
      <p>Aún no existe un horario registrado.</p>

      <div className="acciones-horario" style={{ marginTop: "20px" }}>
        <button className="btn-login" type="button" onClick={onEditar}>
          Registrar mi horario
        </button>
      </div>
    </div>
  );
}

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const mapaBloques = new Map();

(horario.materias || []).forEach((materia) => {
  (materia.bloques || []).forEach((bloque) => {
    if (!mapaBloques.has(bloque.hora)) {
      mapaBloques.set(bloque.hora, bloque);
    }
  });
});

const bloquesUnicos = Array.from(mapaBloques.values()).sort((a, b) => {
  const [horaA, minutoA] = a.inicio.split(":").map(Number);
  const [horaB, minutoB] = b.inicio.split(":").map(Number);

  const totalA = horaA * 60 + minutoA;
  const totalB = horaB * 60 + minutoB;

  return totalA - totalB;
});

  const handleEliminar = () => {
    const confirmar = window.confirm("¿Está seguro de eliminar el horario registrado?");
    if (!confirmar) return;

    eliminarHorarioPorId(userId);

    if (onEliminado) {
      onEliminado();
    }
  };

  const obtenerMateriaEnCelda = (dia, bloqueHora) => {
    return horario.materias.find(
      (materia) =>
        materia.dias.includes(dia) &&
        materia.bloques.some((bloque) => bloque.hora === bloqueHora)
    );
  };

  return (
    <div>
      <h2>Horario académico</h2>

      <div className="encabezado-horario">
        <h3>
          {horario.carrera} - {horario.modalidad} - {horario.nivel} - {horario.turno}
        </h3>
      </div>

      <div className="acciones-horario" style={{ marginBottom: "20px" }}>
        <button className="btn-login" type="button" onClick={onEditar}>
          Modificar horario
        </button>

        <button className="btn-login btn-eliminar" type="button" onClick={handleEliminar}>
          Eliminar horario
        </button>
      </div>

      <table className="tabla-dashboard">
        <thead>
          <tr>
            <th>Horas</th>
            {diasSemana.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bloquesUnicos.map((bloque, index) => (
            <tr key={index}>
              <td>{bloque.hora}</td>

              {diasSemana.map((dia) => {
                const materiaEnCelda = obtenerMateriaEnCelda(dia, bloque.hora);

                return (
                  <td key={dia}>
                    {materiaEnCelda ? (
                      <div className="bloque-vacio">
                        <strong>{materiaEnCelda.materia}</strong>
                        <br />
                        {materiaEnCelda.sigla}
                        <br />
                        {materiaEnCelda.grupo}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VistaHorario;