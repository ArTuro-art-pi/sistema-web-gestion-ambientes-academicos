import React, { useState } from "react";
import { obtenerHorarioPorId } from "../../../utils/estudianteStorage";
import RegistroHorario from "./RegistroHorario";
import VistaHorario from "./VistaHorario";

function HorarioAcademico({ userId }) {
  const [actualizar, setActualizar] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const horarioRegistrado = obtenerHorarioPorId(userId);

  const recargar = () => {
    setActualizar((prev) => !prev);
    setModoEdicion(false);
  };

  return (
    <div key={actualizar}>
      {!horarioRegistrado || modoEdicion ? (
        <RegistroHorario userId={userId} onHorarioRegistrado={recargar} />
      ) : (
        <VistaHorario
          userId={userId}
          onEditar={() => setModoEdicion(true)}
          onEliminado={recargar}
        />
      )}
    </div>
  );
}

export default HorarioAcademico;