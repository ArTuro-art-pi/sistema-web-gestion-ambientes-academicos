import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuEstudiante from "./MenuEstudiante";
import DatosPersonales from "./DatosPersonales";
import PerfilEstudiante from "./PerfilEstudiante";
import RegistroHorario from "./Horario/RegistroHorario";
import VistaHorario from "./Horario/VistaHorario";
import AutoridadesFacultativas from "./Autoridades/AutoridadesFacultativas";
import { obtenerSesion, cerrarSesionSistema } from "../../utils/session";

function DashboardEstudiante() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("datos");
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [actualizarHorario, setActualizarHorario] = useState(false);

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "estudiante") {
      navigate("/login-estudiante");
      return;
    }

    setUsuarioActivo(sesion);
  }, [navigate]);

  const cerrarSesion = () => {
    cerrarSesionSistema();
    navigate("/login-estudiante");
  };

  const refrescarHorario = () => {
    setActualizarHorario((prev) => !prev);
    setSeccionActiva("ver-horario");
  };

  const irAEditarHorario = () => {
    setSeccionActiva("registro-horario");
  };

  const renderContenido = () => {
    if (!usuarioActivo) return null;

    switch (seccionActiva) {
      case "datos":
        return <DatosPersonales userId={usuarioActivo.id} />;

      case "perfil":
        return <PerfilEstudiante userId={usuarioActivo.id} />;

      case "registro-horario":
        return (
          <RegistroHorario
            userId={usuarioActivo.id}
            onHorarioRegistrado={refrescarHorario}
          />
        );

      case "ver-horario":
        return (
          <VistaHorario
            userId={usuarioActivo.id}
            onEditar={irAEditarHorario}
            onEliminado={refrescarHorario}
            key={actualizarHorario}
          />
        );

      case "autoridades":
        return <AutoridadesFacultativas />;

      default:
        return <DatosPersonales userId={usuarioActivo.id} />;
    }
  };

  if (!usuarioActivo) {
    return <h2 style={{ color: "white" }}>Cargando sesión del estudiante...</h2>;
  }

  return (
    <div className="dashboard-layout">
      <MenuEstudiante
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        cerrarSesion={cerrarSesion}
      />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel del Estudiante</h1>
          <p>Bienvenido: {usuarioActivo.id}</p>
        </div>

        <div className="dashboard-box">{renderContenido()}</div>
      </main>
    </div>
  );
}

export default DashboardEstudiante;