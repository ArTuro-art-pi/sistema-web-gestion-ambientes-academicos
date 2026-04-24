import React from "react";

function PanelPrincipal({ usuarioActivo }) {
  return (
    <div>
      <h2>Panel principal docente</h2>
      <p>Bienvenido docente: {usuarioActivo.id}</p>
    </div>
  );
}

export default PanelPrincipal;