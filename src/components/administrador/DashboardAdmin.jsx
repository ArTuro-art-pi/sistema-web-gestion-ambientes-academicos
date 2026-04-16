import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuAdmin from "./MenuAdmin";
import PanelPrincipal from "./PanelPrincipal";
import EstadoDeAulas from "./EstadoDeAulas";
import RegistroLlave from "./PrestamoLlaves/RegistroLlave";
import HorarioPorCarrera from "./HorarioCarrera/HorarioPorCarrera";
import RegistroDocentes from "./Docentes/RegistroDocentes";
import ListaDocentes from "./Docentes/ListaDocentes";
import Reportes from "./Reportes";
import { obtenerSesion, cerrarSesionSistema } from "../../utils/session";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("panel");
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== "secretaria") {
      navigate("/login-secretaria");
      return;
    }

    setUsuarioActivo(sesion);
  }, [navigate]);

  const cerrarSesion = () => {
    cerrarSesionSistema();
    navigate("/login-secretaria");
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "panel":
        return <PanelPrincipal setSeccionActiva={setSeccionActiva} />;
      case "estado-aulas":
        return <EstadoDeAulas />;
      case "prestamo-llaves":
        return <RegistroLlave />;
      case "horario-carrera":
        return <HorarioPorCarrera />;
      case "registro-docentes":
        return <RegistroDocentes />;
      case "lista-docentes":
        return <ListaDocentes />;
      case "reportes":
        return <Reportes />;
      default:
        return <PanelPrincipal setSeccionActiva={setSeccionActiva} />;
    }
  };

  if (!usuarioActivo) {
    return <h2 style={{ color: "white" }}>Cargando sesión de secretaría...</h2>;
  }

  return (
    <div className="dashboard-layout">
      <MenuAdmin
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        cerrarSesion={cerrarSesion}
      />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel de Secretaría</h1>
          <p>Bienvenida: {usuarioActivo.id}</p>
        </div>

        <div className="dashboard-box">{renderContenido()}</div>
      </main>
    </div>
  );
}

export default DashboardAdmin;