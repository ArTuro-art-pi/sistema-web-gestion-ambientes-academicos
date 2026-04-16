import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarLogin } from "../../utils/auth";
import { guardarSesion } from "../../utils/session";

function LoginSecretaria() {
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
      "secretaria",
      formulario.usuario.trim(),
      formulario.password.trim()
    );

    if (usuarioValido) {
      guardarSesion({
        id: usuarioValido.id,
        rol: "secretaria",
      });

      navigate("/dashboard-admin");
    } else {
      setMensaje("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="pantalla-login">
      <div className="fondo-animado"></div>

      <div className="contenedor-login">
        <div className="login-box">
          <h2>Login Secretaría</h2>
          <p className="login-subtexto">
            Ingrese sus credenciales para acceder al sistema.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grupo-input">
              <label>Usuario</label>
              <input
                type="text"
                name="usuario"
                placeholder="Ingrese su usuario"
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
            <Link to="/cambiar-password/secretaria">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/">← Volver al inicio principal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSecretaria;