import React from "react";
import { useNavigate } from "react-router-dom";

function SeleccionUsuario() {
  const navigate = useNavigate();

  return (
    <section className="panel-usuarios">
      <h3>Seleccione su tipo de usuario</h3>
      <p className="texto-panel">
        Ingrese al sistema según el perfil correspondiente.
      </p>

      <div className="tarjetas-usuarios">
        <div className="tarjeta-usuario">
          <div className="icono">🎓</div>
          <h4>Estudiante</h4>
          <p>Acceso a información académica, horarios y datos personales.</p>
          <button onClick={() => navigate("/login-estudiante")}>
            Ingresar
          </button>
        </div>

        <div className="tarjeta-usuario">
          <div className="icono">👨‍🏫</div>
          <h4>Docente</h4>
          <p>Gestión de horarios, asignaciones, control y seguimiento.</p>
          <button onClick={() => navigate("/login-docente")}>
            Ingresar
          </button>
        </div>

        <div className="tarjeta-usuario">
          <div className="icono">🗂️</div>
          <h4>Secretaría</h4>
          <p>Administración de ambientes, usuarios, registros y reportes.</p>
          <button onClick={() => navigate("/login-secretaria")}>
            Ingresar
          </button>
        </div>
      </div>
    </section>
  );
}

export default SeleccionUsuario;