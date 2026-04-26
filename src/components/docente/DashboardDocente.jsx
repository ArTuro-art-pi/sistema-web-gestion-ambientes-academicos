import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PanelPrincipal from "./PanelPrincipal";
import MiHorario from "./MiHorario";
import MisCursos from "./MisCursos";
import Avisos from "./Avisos";
import PerfilDocente from "./PerfilDocente";
import ChatSe from "./ChatSe";

import { obtenerSesion, cerrarSesionSistema } from "../../utils/session";

function DashboardDocente() {
  const navigate = useNavigate();

  const [seccionActiva, setSeccionActiva] = useState("panel");
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "docente") {
      navigate("/login-docente");
      return;
    }

    setUsuarioActivo(sesion);
  }, [navigate]);

  const cerrarSesion = () => {
    cerrarSesionSistema();
    navigate("/login-docente");
  };

  const renderContenido = () => {
    if (!usuarioActivo) {
      return <p>Cargando información del docente...</p>;
    }

    switch (seccionActiva) {
      case "panel":
        return (
          <PanelPrincipal
            usuarioActivo={usuarioActivo}
            setSeccionActiva={setSeccionActiva}
          />
        );

      case "mi-horario":
        return <MiHorario usuarioActivo={usuarioActivo} />;

      case "mis-cursos":
        return <MisCursos usuarioActivo={usuarioActivo} />;

      case "avisos":
        return <Avisos usuarioActivo={usuarioActivo} />;

      case "perfil":
        return <PerfilDocente usuarioActivo={usuarioActivo} />;

      case "chat-secretaria":
        return <ChatSe usuarioActivo={usuarioActivo} />;

      default:
        return (
          <PanelPrincipal
            usuarioActivo={usuarioActivo}
            setSeccionActiva={setSeccionActiva}
          />
        );
    }
  };

  if (!usuarioActivo) {
    return (
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <h2 style={{ color: "white" }}>Cargando sesión del docente...</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Docente</h2>

        <button
          className={seccionActiva === "panel" ? "activo" : ""}
          onClick={() => setSeccionActiva("panel")}
        >
          Panel principal
        </button>

        <button
          className={seccionActiva === "mi-horario" ? "activo" : ""}
          onClick={() => setSeccionActiva("mi-horario")}
        >
          Mi horario
        </button>

        <button
          className={seccionActiva === "mis-cursos" ? "activo" : ""}
          onClick={() => setSeccionActiva("mis-cursos")}
        >
          Mis cursos
        </button>

        <button
          className={seccionActiva === "avisos" ? "activo" : ""}
          onClick={() => setSeccionActiva("avisos")}
        >
          Avisos
        </button>

        <button
          className={seccionActiva === "perfil" ? "activo" : ""}
          onClick={() => setSeccionActiva("perfil")}
        >
          Perfil docente
        </button>

        <button
          className={seccionActiva === "chat-secretaria" ? "activo" : ""}
          onClick={() => setSeccionActiva("chat-secretaria")}
        >
          Chat con Secretaría
        </button>

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