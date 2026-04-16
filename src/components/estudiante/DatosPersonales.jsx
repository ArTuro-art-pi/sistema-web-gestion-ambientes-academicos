import React, { useEffect, useState } from "react";
import {
  obtenerPerfilPorId,
  guardarPerfil,
} from "../../utils/estudianteStorage";

const perfilVacio = {
  registroUniversitario: "",
  apellidoNombre: "",
  ci: "",
  sexo: "",
  estadoCivil: "",
  fechaNacimiento: "",
  pais: "",
  departamento: "",
  provincia: "",
  direccion: "",
  telefono: "",
  correo: "",
  carrera: "",
  fotografia: "",
};

function DatosPersonales({ userId }) {
  const [formulario, setFormulario] = useState(perfilVacio);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const perfilGuardado = obtenerPerfilPorId(userId);
    if (perfilGuardado) {
      setFormulario({
        ...perfilVacio,
        ...perfilGuardado,
      });
    } else {
      setFormulario({
        ...perfilVacio,
        registroUniversitario: userId,
      });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormulario((prev) => ({
        ...prev,
        fotografia: reader.result,
      }));
    };
    reader.readAsDataURL(archivo);
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formulario.registroUniversitario.trim()) {
      nuevosErrores.registroUniversitario = "Este campo es obligatorio.";
    }

    if (!formulario.apellidoNombre.trim()) {
      nuevosErrores.apellidoNombre = "Este campo es obligatorio.";
    }

    if (!formulario.ci.trim()) {
      nuevosErrores.ci = "Este campo es obligatorio.";
    }

    if (!formulario.sexo.trim()) {
      nuevosErrores.sexo = "Este campo es obligatorio.";
    }

    if (!formulario.fechaNacimiento.trim()) {
      nuevosErrores.fechaNacimiento = "Este campo es obligatorio.";
    }

    if (!formulario.correo.trim()) {
      nuevosErrores.correo = "Este campo es obligatorio.";
    }

    if (!formulario.carrera.trim()) {
      nuevosErrores.carrera = "Este campo es obligatorio.";
    }

    if (
      formulario.correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo)
    ) {
      nuevosErrores.correo = "Correo no válido.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) {
      setMensaje("Revise los campos obligatorios.");
      return;
    }

    guardarPerfil(userId, formulario);
    setMensaje("Datos personales guardados correctamente.");

    setFormulario({
      ...perfilVacio,
      registroUniversitario: userId,
    });

    setErrores({});
  };

  return (
    <div>
      <h2>Registro y edición de datos personales</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="grupo-input">
          <label>Registro universitario</label>
          <input
            type="text"
            name="registroUniversitario"
            value={formulario.registroUniversitario}
            onChange={handleChange}
          />
          {errores.registroUniversitario && (
            <small className="error-text">{errores.registroUniversitario}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Apellido y nombre</label>
          <input
            type="text"
            name="apellidoNombre"
            value={formulario.apellidoNombre}
            onChange={handleChange}
          />
          {errores.apellidoNombre && (
            <small className="error-text">{errores.apellidoNombre}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Cédula de identidad</label>
          <input
            type="text"
            name="ci"
            value={formulario.ci}
            onChange={handleChange}
          />
          {errores.ci && <small className="error-text">{errores.ci}</small>}
        </div>

        <div className="grupo-input">
          <label>Sexo</label>
          <select name="sexo" value={formulario.sexo} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          {errores.sexo && <small className="error-text">{errores.sexo}</small>}
        </div>

        <div className="grupo-input">
          <label>Estado civil</label>
          <select
            name="estadoCivil"
            value={formulario.estadoCivil}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Soltero(a)">Soltero(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viudo(a)">Viudo(a)</option>
          </select>
        </div>

        <div className="grupo-input">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formulario.fechaNacimiento}
            onChange={handleChange}
          />
          {errores.fechaNacimiento && (
            <small className="error-text">{errores.fechaNacimiento}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>País</label>
          <input
            type="text"
            name="pais"
            value={formulario.pais}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Departamento</label>
          <input
            type="text"
            name="departamento"
            value={formulario.departamento}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Provincia</label>
          <input
            type="text"
            name="provincia"
            value={formulario.provincia}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formulario.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formulario.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="grupo-input">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
          />
          {errores.correo && (
            <small className="error-text">{errores.correo}</small>
          )}
        </div>

        <div className="grupo-input">
          <label>Carrera</label>
          <select
            name="carrera"
            value={formulario.carrera}
            onChange={handleChange}
          >
            <option value="">Seleccione una carrera</option>
            <option value="Enfermería">Enfermería</option>
            <option value="Industrial">Industrial</option>
            <option value="Comercial">Comercial</option>
            <option value="Administración">Administración</option>
            <option value="Ciencias de la Educación">
              Ciencias de la Educación
            </option>
            <option value="Medicina Veterinaria y Zootecnia">
              Medicina Veterinaria y Zootecnia
            </option>
            <option value="Agropecuaria">Agropecuaria</option>
            <option value="Sistemas">Sistemas</option>
            <option value="Derecho">Derecho</option>
            <option value="Contaduría">Contaduría</option>
          </select>
          {errores.carrera && (
            <small className="error-text">{errores.carrera}</small>
          )}
        </div>

        <div className="grupo-input grupo-foto">
          <label>Fotografía</label>
          <input type="file" accept="image/*" onChange={handleImagen} />
        </div>

        {formulario.fotografia && (
          <div className="preview-foto">
            <img src={formulario.fotografia} alt="Foto del estudiante" />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-login">
            Guardar datos
          </button>
        </div>
      </form>

      {mensaje && <p className="mensaje-login">{mensaje}</p>}
    </div>
  );
}

export default DatosPersonales;