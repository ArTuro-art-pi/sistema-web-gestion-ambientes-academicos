import React from "react";

function MiHorario() {
  return (
    <div>
      <h2>Mi Horario</h2>
      <table className="tabla-dashboard">
        <thead>
          <tr>
            <th>Día</th>
            <th>Curso</th>
            <th>Hora</th>
            <th>Aula</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lunes</td>
            <td>Programación I</td>
            <td>08:00 - 10:00</td>
            <td>A-1</td>
          </tr>
          <tr>
            <td>Miércoles</td>
            <td>Base de Datos</td>
            <td>10:00 - 12:00</td>
            <td>B-4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MiHorario;