export const obtenerHorarios = () => {
  const data = localStorage.getItem("horarios_estudiantes");
  return data ? JSON.parse(data) : [];
};

export const guardarHorarios = (horarios) => {
  localStorage.setItem("horarios_estudiantes", JSON.stringify(horarios));
};

export const obtenerHorarioPorId = (estudianteId) => {
  const horarios = obtenerHorarios();
  return horarios.find((h) => h.estudianteId === estudianteId) || null;
};

export const guardarMateriaEnHorario = (estudianteId, datosFormulario) => {
  const horarios = obtenerHorarios();

  const nuevaMateria = {
    sigla: datosFormulario.sigla,
    grupo: datosFormulario.grupo,
    materia: datosFormulario.materia,
    dias: datosFormulario.dias,
    numeroHoras: Number(datosFormulario.numeroHoras),
    minutosPorHora: Number(datosFormulario.minutosPorHora),
    horaInicio: datosFormulario.horaInicio,
    horaFin: datosFormulario.horaFin,
    tipoBreak: datosFormulario.tipoBreak,
    breakAdicional: datosFormulario.breakAdicional,
    modalidadVirtualPresencial: datosFormulario.MvirtualPresencial,
    bloques: datosFormulario.bloques || [],
  };

  const index = horarios.findIndex((h) => h.estudianteId === estudianteId);

  if (index !== -1) {
    const yaExiste = horarios[index].materias.some(
      (m) =>
        m.sigla === nuevaMateria.sigla &&
        m.grupo === nuevaMateria.grupo &&
        m.materia === nuevaMateria.materia &&
        m.horaInicio === nuevaMateria.horaInicio
    );

    if (yaExiste) {
      return {
        ok: false,
        mensaje: "La materia ya está registrada en el horario.",
      };
    }

    horarios[index].carrera = datosFormulario.carrera;
    horarios[index].modalidad = datosFormulario.modalidad;
    horarios[index].nivel = datosFormulario.nivel;
    horarios[index].turno = datosFormulario.turno;
    horarios[index].materias.push(nuevaMateria);
  } else {
    horarios.push({
      estudianteId,
      carrera: datosFormulario.carrera,
      modalidad: datosFormulario.modalidad,
      nivel: datosFormulario.nivel,
      turno: datosFormulario.turno,
      materias: [nuevaMateria],
    });
  }

  guardarHorarios(horarios);

  return {
    ok: true,
    mensaje: "Materia guardada correctamente.",
  };
};

export const eliminarHorarioPorId = (estudianteId) => {
  const horarios = obtenerHorarios();
  const nuevosHorarios = horarios.filter((h) => h.estudianteId !== estudianteId);
  guardarHorarios(nuevosHorarios);
};

export const eliminarMateriaDelHorario = (estudianteId, indexMateria) => {
  const horarios = obtenerHorarios();
  const indexHorario = horarios.findIndex((h) => h.estudianteId === estudianteId);

  if (indexHorario === -1) return;

  horarios[indexHorario].materias.splice(indexMateria, 1);

  if (horarios[indexHorario].materias.length === 0) {
    horarios.splice(indexHorario, 1);
  }

  guardarHorarios(horarios);
};

export const obtenerPerfilPorId = (userId) => {
  const data = localStorage.getItem(`perfil_${userId}`);
  return data ? JSON.parse(data) : null;
};

export const guardarPerfil = (userId, datosPerfil) => {
  localStorage.setItem(`perfil_${userId}`, JSON.stringify(datosPerfil));
};

export const eliminarPerfilPorId = (userId) => {
  localStorage.removeItem(`perfil_${userId}`);
};