import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarLogin } from "../../utils/auth";
import { guardarSesion } from "../../utils/session";

function LoginEstudiante() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    usuario: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (mensaje) setMensaje("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioValido = validarLogin(
      "estudiante",
      formulario.usuario.trim(),
      formulario.password.trim()
    );

    if (usuarioValido) {
      guardarSesion({
        id: usuarioValido.id,
        rol: "estudiante",
      });

      navigate("/dashboard-estudiante");
    } else {
      setMensaje("ID o contraseña incorrectos.");
    }
  };

  return (
    <div className="pantalla-login">
      <div className="fondo-animado"></div>

      <div className="contenedor-login">
        <div className="login-box">
          <h2>Login Estudiante</h2>
          <p className="login-subtexto">
            Ingrese sus credenciales para acceder al sistema.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grupo-input">
              <label>ID</label>
              <input
                type="text"
                name="usuario"
                placeholder="Ingrese su ID"
                value={formulario.usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupo-input">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                value={formulario.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Iniciar sesión
            </button>
          </form>

          {mensaje && <p className="mensaje-login">{mensaje}</p>}

          <div className="acciones-login">
            <Link to="/cambiar-password/estudiante">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/">← Volver al inicio principal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginEstudiante;