import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cambiarPassword } from "../../utils/auth";

function CambiarPassword() {
  const { rol } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    id: "",
    nuevaPassword: "",
    confirmarPassword: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formulario.nuevaPassword !== formulario.confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    const actualizado = cambiarPassword(
      rol,
      formulario.id,
      formulario.nuevaPassword
    );

    if (actualizado) {
      setMensaje("Contraseña actualizada correctamente.");
      setTimeout(() => {
        navigate(`/login-${rol}`);
      }, 1500);
    } else {
      setMensaje("ID no encontrado.");
    }
  };

  return (
    <div className="pantalla-login">
      <div className="fondo-animado"></div>

      <div className="contenedor-login">
        <div className="login-box">
          <h2>Cambiar contraseña</h2>
          <p className="login-subtexto">
            Rol: <strong>{rol}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grupo-input">
              <label>ID de usuario</label>
              <input
                type="text"
                name="id"
                placeholder="Ingrese su ID"
                value={formulario.id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupo-input">
              <label>Nueva contraseña</label>
              <input
                type="password"
                name="nuevaPassword"
                placeholder="Ingrese nueva contraseña"
                value={formulario.nuevaPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupo-input">
              <label>Confirmar nueva contraseña</label>
              <input
                type="password"
                name="confirmarPassword"
                placeholder="Repita la nueva contraseña"
                value={formulario.confirmarPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Guardar nueva contraseña
            </button>
          </form>

          {mensaje && <p className="mensaje-login">{mensaje}</p>}

          <div className="acciones-login">
            <Link to="/">← Volver al inicio principal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CambiarPassword;