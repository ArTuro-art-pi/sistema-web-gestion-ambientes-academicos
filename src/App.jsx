import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import SeleccionUsuario from "./components/login/SeleccionUsuario";
import LoginEstudiante from "./components/login/LoginEstudiante";
import LoginDocente from "./components/login/LoginDocente";
import LoginSecretaria from "./components/login/LoginSecretaria";
import DashboardEstudiante from "./components/estudiante/DashboardEstudiante";
import DashboardAdmin from "./components/administrador/DashboardAdmin";
import CambiarPasswordPanel from "./components/login/CambiarPasswordPanel";

// comenta temporalmente esto si ese archivo no existe o falla
// import DashboardDocente from "./components/docente/DashboardDocente";

function InicioPrincipal() {
  return (
    <div className="app">
      <div className="fondo-animado"></div>
      <header className="hero">
        <div className="overlay"></div>
        <div className="hero-contenido">
          <p className="subtitulo">UNIVERSIDAD AUTÓNOMA</p>
          <h1>GABRIEL RENÉ MORENO</h1>
          <h2>SISTEMA WEB DE GESTIÓN ACADÉMICA</h2>
          <p className="descripcion">
            Plataforma digital para el acceso organizado de estudiantes,
            docentes y personal de secretaría.
          </p>
        </div>
      </header>

      <main className="contenedor-principal">
        <SeleccionUsuario />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioPrincipal />} />
      <Route path="/login-estudiante" element={<LoginEstudiante />} />
      <Route path="/login-docente" element={<LoginDocente />} />
      <Route path="/login-secretaria" element={<LoginSecretaria />} />
      <Route path="/cambiar-password/:rol" element={<CambiarPasswordPanel />} />
      <Route path="/dashboard-estudiante" element={<DashboardEstudiante />} />
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      <Route path="*" element={<InicioPrincipal />} />
    </Routes>
  );
}

export default App;