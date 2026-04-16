import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiHorario from "./MiHorario";
import MisCursos from "./MisCursos";
import { obtenerSesion, cerrarSesionSistema } from "../../utils/session";

function DashboardDocente() {
  const [seccionActiva, setSeccionActiva] = useState("horario");
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "docente") {
      navigate("/login-docente");
      return;
    }

    setUsuarioActivo(sesion);
  }, [navigate]);

  const renderContenido = () => {
    switch (seccionActiva) {
      case "horario":
        return <MiHorario />;
      case "cursos":
        return <MisCursos />;
      default:
        return <MiHorario />;
    }
  };

  const cerrarSesion = () => {
    cerrarSesionSistema();
    navigate("/");
  };

  if (!usuarioActivo) {
    return <h2 style={{ color: "white" }}>Cargando sesión del docente...</h2>;
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Docente</h2>
        <button onClick={() => setSeccionActiva("horario")}>Mi horario</button>
        <button onClick={() => setSeccionActiva("cursos")}>Mis cursos</button>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel del Docente</h1>
          <p>Bienvenido: {usuarioActivo.id}</p>
        </div>

        <div className="dashboard-box">{renderContenido()}</div>
      </main>
    </div>
  );
}

export default DashboardDocente;