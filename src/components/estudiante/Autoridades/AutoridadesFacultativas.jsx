import React from "react";

const autoridades = [
  {
    id: 1,
    nombre: "Msc. Luis Fernando Villarroel Santa Cruz",
    cargo: "Decano",
    tipo: "principal",
    correo: "decano@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59171026043",
    foto: "/autoridades/Decano1.png",
  },
  {
    id: 2,
    nombre: "Msc. Felix Vallejos Vallejos",
    cargo: "Vicedecano",
    tipo: "principal",
    correo: "vicedecano@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59171307973",
    foto: "/autoridades/Vicedecano1.png",
  },
  {
    id: 3,
    nombre: "Msc. Veymar Sanchez Olivera",
    cargo: "Director de Carrera Ingeniería Comercial",
    tipo: "director",
    correo: "comercial@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59171600955",
    foto: "/autoridades/Veymay.png",
  },
  {
    id: 4,
    nombre: "Msc. Alicia Serrano Rodriguez",
    cargo: "Directora de Carrera Ingeniería en Sistemas",
    tipo: "director",
    correo: "sistemas@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59169563846",
    foto: "/autoridades/Alicia1.png",
  },
  {
    id: 5,
    nombre: "Msc. Anival Avila Condori",
    cargo: "Director de Carrera Administración de Empresas",
    tipo: "director",
    correo: "empresas@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59177354905",
    foto: "/autoridades/Anival1.png",
  },
  {
    id: 6,
    nombre: "Ing. Francisco Torrez",
    cargo: "Director de Carrera Ingeniería Agropecuaria",
    tipo: "director",
    correo: "agropecuaria@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59177645943",
    foto: "/autoridades/Francisco1.png",
  },
  {
    id: 7,
    nombre: "Msc. Nilda Caballero Alvarez",
    cargo: "Directora de Carrera Ciencias de la Educación",
    tipo: "director",
    correo: "educacion@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59173134852",
    foto: "/autoridades/Nilda1.png",
  },
  {
    id: 8,
    nombre: "Doc. Jhenny Gloria Vallejos Sarabia",
    cargo: "Directora de Carrera Enfermería",
    tipo: "director",
    correo: "enfermeria@fii.edu.bo",
    facebook: "https://facebook.com/",
    whatsapp: "59176030040",
    foto: "/autoridades/Jhenny1.png",
  },
];

function TarjetaAutoridad({ autoridad }) {
  return (
    <article
      className={`tarjeta-autoridad ${
        autoridad.tipo === "principal" ? "principal" : "director"
      }`}
    >
      <img
        src={autoridad.foto}
        alt={autoridad.nombre}
        className="foto-autoridad"
      />

      <div className="contenido-autoridad">
        <h3>{autoridad.nombre}</h3>
        <p className="cargo-autoridad">{autoridad.cargo}</p>
        <p className="correo-autoridad">{autoridad.correo}</p>

        <div className="acciones-autoridad">
          <a
            href={`mailto:${autoridad.correo}`}
            className="btn-contacto correo"
            title="Enviar correo"
          >
            Correo
          </a>

          <a
            href={autoridad.facebook}
            target="_blank"
            rel="noreferrer"
            className="btn-contacto facebook"
            title="Abrir Facebook"
          >
            Facebook
          </a>

          <a
            href={`https://wa.me/${autoridad.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-contacto whatsapp"
            title="Abrir WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Autoridades() {
  const principales = autoridades.filter((item) => item.tipo === "principal");
  const directores = autoridades.filter((item) => item.tipo === "director");

  return (
    <div className="modulo-autoridades">
      <div className="cabecera-autoridades">
        <h2>Autoridades Facultativas</h2>
        <p>
          Consulte a las principales autoridades de la facultad y sus medios de
          contacto institucional.
        </p>
      </div>

      <section className="seccion-autoridades">
        <h3 className="titulo-seccion-autoridad">Autoridades principales</h3>
        <div className="grid-autoridades-principales">
          {principales.map((autoridad) => (
            <TarjetaAutoridad key={autoridad.id} autoridad={autoridad} />
          ))}
        </div>
      </section>

      <section className="seccion-autoridades">
        <h3 className="titulo-seccion-autoridad">Directores de carrera</h3>
        <div className="grid-directores">
          {directores.map((autoridad) => (
            <TarjetaAutoridad key={autoridad.id} autoridad={autoridad} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Autoridades;