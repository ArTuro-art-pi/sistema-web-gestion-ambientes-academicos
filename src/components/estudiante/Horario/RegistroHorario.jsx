import React, { useState } from "react";
import { guardarMateriaEnHorario } from "../../../utils/estudianteStorage";

const formularioInicial = {
  sigla: "",
  grupo: "",
  materia: "",
  modalidad: "",
  carrera: "",
  nivel: "",
  MvirtualPresencial: "",
  turno: "",
  dias: [],
  numeroHoras: "",
  minutosPorHora: "",
  horaInicio: "",
  horaFin: "",
  tipoBreak: "",
  breakAdicional: "",
};

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function RegistroHorario({ userId, onHorarioRegistrado }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

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

  const handleDiaChange = (dia) => {
    setFormulario((prev) => {
      const yaExiste = prev.dias.includes(dia);

      return {
        ...prev,
        dias: yaExiste
          ? prev.dias.filter((item) => item !== dia)
          : [...prev.dias, dia],
      };
    });

    setErrores((prev) => ({
      ...prev,
      dias: "",
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.sigla.trim()) nuevosErrores.sigla = "Campo obligatorio.";
    if (!formulario.grupo.trim()) nuevosErrores.grupo = "Campo obligatorio.";
    if (!formulario.materia.trim()) nuevosErrores.materia = "Campo obligatorio.";
    if (!formulario.modalidad.trim()) nuevosErrores.modalidad = "Campo obligatorio.";
    if (!formulario.carrera.trim()) nuevosErrores.carrera = "Campo obligatorio.";
    if (!formulario.nivel.trim()) nuevosErrores.nivel = "Campo obligatorio.";
    if (!formulario.MvirtualPresencial.trim()) nuevosErrores.MvirtualPresencial = "Campo obligatorio.";
    if (!formulario.turno.trim()) nuevosErrores.turno = "Campo obligatorio.";
    if (!formulario.horaInicio.trim()) nuevosErrores.horaInicio = "Campo obligatorio.";
    if (!formulario.numeroHoras.trim()) nuevosErrores.numeroHoras = "Campo obligatorio.";
    if (!formulario.minutosPorHora.trim()) nuevosErrores.minutosPorHora = "Campo obligatorio.";
    if (formulario.dias.length === 0) nuevosErrores.dias = "Seleccione al menos un día.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const construirBloques = () => {
    const horas = parseInt(formulario.numeroHoras, 10);
    const minutos = parseInt(formulario.minutosPorHora, 10);

    if (!horas || !minutos || !formulario.horaInicio) return [];

    const bloques = [];
    let [hora, minuto] = formulario.horaInicio.split(":").map(Number);

    for (let i = 0; i < horas; i++) {
      const inicio = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;

      let totalMin = hora * 60 + minuto + minutos;
      let horaFin = Math.floor(totalMin / 60);
      let minFin = totalMin % 60;

      const fin = `${String(horaFin).padStart(2, "0")}:${String(minFin).padStart(2, "0")}`;

      bloques.push({
        bloque: i + 1,
        hora: `${inicio} - ${fin}`,
        inicio,
        fin,
      });

      hora = horaFin;
      minuto = minFin;

      if (formulario.tipoBreak === "Corto" && i === 1) {
        totalMin = hora * 60 + minuto + 10;
        hora = Math.floor(totalMin / 60);
        minuto = totalMin % 60;
      }

      if (formulario.breakAdicional === "Sí" && i === 3) {
        totalMin = hora * 60 + minuto + 10;
        hora = Math.floor(totalMin / 60);
        minuto = totalMin % 60;
      }
    }

    return bloques;
  };

  const registrarHorario = () => {
    if (!validarFormulario()) {
      setMensaje("Complete correctamente los campos obligatorios.");
      return;
    }

    const bloques = construirBloques();
    const ultimaHora = bloques[bloques.length - 1]?.fin || "";

    const datosCompletos = {
      ...formulario,
      horaFin: ultimaHora,
      bloques,
    };

    const respuesta = guardarMateriaEnHorario(userId, datosCompletos);

    setMensaje(respuesta.mensaje);

    if (respuesta.ok) {
      setFormulario(formularioInicial);
      setErrores({});

      if (onHorarioRegistrado) {
        onHorarioRegistrado();
      }
    }
  };

  return (
    <div>
      <h2>Registro de horario académico</h2>

      <div className="form-grid">
        <div className="grupo-input">
          <label>Sigla *</label>
          <input type="text" name="sigla" value={formulario.sigla} onChange={handleChange} />
          {errores.sigla && <small className="error-text">{errores.sigla}</small>}
        </div>

        <div className="grupo-input">
          <label>Grupo *</label>
          <input type="text" name="grupo" value={formulario.grupo} onChange={handleChange} />
          {errores.grupo && <small className="error-text">{errores.grupo}</small>}
        </div>

        <div className="grupo-input">
          <label>Materia *</label>
          <input type="text" name="materia" value={formulario.materia} onChange={handleChange} />
          {errores.materia && <small className="error-text">{errores.materia}</small>}
        </div>

        <div className="grupo-input">
          <label>Semestre o anual *</label>
          <select name="modalidad" value={formulario.modalidad} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Semestre">Semestre</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Modalidad *</label>
          <select
            name="MvirtualPresencial"
            value={formulario.MvirtualPresencial}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Carrera *</label>
          <select name="carrera" value={formulario.carrera} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Enfermería">Enfermería</option>
            <option value="Industrial">Industrial</option>
            <option value="Comercial">Comercial</option>
            <option value="Administración">Administración</option>
            <option value="Ciencias de la Educación">Ciencias de la Educación</option>
            <option value="Medicina Veterinaria y Zootecnia">Medicina Veterinaria y Zootecnia</option>
            <option value="Agropecuaria">Agropecuaria</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Derecho">Derecho</option>
            <option value="Contaduría">Contaduría</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Nivel *</label>
          <input type="text" name="nivel" value={formulario.nivel} onChange={handleChange} />
        </div>

        <div className="grupo-input">
          <label>Turno *</label>
          <select name="turno" value={formulario.turno} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Número de horas *</label>
          <input
            type="number"
            name="numeroHoras"
            value={formulario.numeroHoras}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Minutos por hora *</label>
          <input
            type="number"
            name="minutosPorHora"
            value={formulario.minutosPorHora}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Hora de inicio *</label>
          <input type="time" name="horaInicio" value={formulario.horaInicio} onChange={handleChange} />
        </div>

        <div className="grupo-input">
          <label>Hora de fin</label>
          <input type="time" name="horaFin" value={formulario.horaFin} readOnly />
        </div>

        <div className="grupo-input">
          <label>Tipo de break</label>
          <select name="tipoBreak" value={formulario.tipoBreak} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Ninguno">Ninguno</option>
            <option value="Corto">Corto</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Break adicional</label>
          <select name="breakAdicional" value={formulario.breakAdicional} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>Días *</label>
        <div className="dias-checkbox-grid">
          {diasSemana.map((dia) => (
            <label key={dia} className="dia-checkbox-item">
              <input
                type="checkbox"
                checked={formulario.dias.includes(dia)}
                onChange={() => handleDiaChange(dia)}
              />
              <span>{dia}</span>
            </label>
          ))}
        </div>
        {errores.dias && <small className="error-text">{errores.dias}</small>}
      </div>

      <div className="acciones-horario" style={{ marginTop: "25px" }}>
        <button className="btn-login" type="button" onClick={registrarHorario}>
          Guardar datos del horario
        </button>
      </div>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}
    </div>
  );
}

export default RegistroHorario;