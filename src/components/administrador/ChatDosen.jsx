import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const CHAT_COLLECTION = "chat_docente_secretaria";

const respuestasRapidas = [
  "Espere un momento, por favor.",
  "Pase por secretaría.",
];

function ChatDosen({ usuarioActivo }) {
  const [todosMensajes, setTodosMensajes] = useState([]);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [enviando, setEnviando] = useState(false);
  const finalChatRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, CHAT_COLLECTION), orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setTodosMensajes(lista);
    });

    return () => unsubscribe();
  }, []);

  const docentesConChat = useMemo(() => {
    const mapa = new Map();

    todosMensajes.forEach((mensaje) => {
      if (!mensaje.docenteId) return;

      if (!mapa.has(mensaje.docenteId)) {
        mapa.set(mensaje.docenteId, {
          docenteId: mensaje.docenteId,
          docenteNombre: mensaje.docenteNombre || `Docente ${mensaje.docenteId}`,
          ultimoMensaje: mensaje.mensaje,
          fecha: mensaje.fecha,
          noLeidos: 0,
          prioridad: mensaje.prioridad || "Normal",
        });
      }

      const actual = mapa.get(mensaje.docenteId);

      if (mensaje.emisor === "docente" && mensaje.leido === false) {
        actual.noLeidos += 1;
      }

      if (mensaje.prioridad === "Emergencia") {
        actual.prioridad = "Emergencia";
      } else if (mensaje.prioridad === "Urgente" && actual.prioridad !== "Emergencia") {
        actual.prioridad = "Urgente";
      }
    });

    return Array.from(mapa.values()).filter((docente) => {
      const textoBusqueda = busqueda.trim().toLowerCase();

      return (
        docente.docenteNombre.toLowerCase().includes(textoBusqueda) ||
        String(docente.docenteId).toLowerCase().includes(textoBusqueda)
      );
    });
  }, [todosMensajes, busqueda]);

  useEffect(() => {
    if (!docenteSeleccionado?.docenteId) {
      setMensajesChat([]);
      return;
    }

    const q = query(
      collection(db, CHAT_COLLECTION),
      where("docenteId", "==", String(docenteSeleccionado.docenteId)),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setMensajesChat(lista);
    });

    marcarMensajesComoLeidos(docenteSeleccionado.docenteId);

    return () => unsubscribe();
  }, [docenteSeleccionado]);

  useEffect(() => {
    finalChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesChat]);

  const marcarMensajesComoLeidos = async (docenteId) => {
    try {
      const q = query(
        collection(db, CHAT_COLLECTION),
        where("docenteId", "==", String(docenteId)),
        where("emisor", "==", "docente"),
        where("leido", "==", false)
      );

      const snapshot = await getDocs(q);

      const actualizaciones = snapshot.docs.map((documento) =>
        updateDoc(doc(db, CHAT_COLLECTION, documento.id), {
          leido: true,
        })
      );

      await Promise.all(actualizaciones);
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error);
    }
  };

  const enviarRespuesta = async (e) => {
    e.preventDefault();

    const mensajeLimpio = texto.trim();

    if (!mensajeLimpio || !docenteSeleccionado || enviando) return;

    setEnviando(true);
    setTexto("");

    const mensajeFirebase = {
      docenteId: String(docenteSeleccionado.docenteId),
      docenteNombre: docenteSeleccionado.docenteNombre,
      emisor: "secretaria",
      receptor: "docente",
      secretariaId: usuarioActivo?.id || "SEC001",
      mensaje: mensajeLimpio,
      fecha: serverTimestamp(),
      leido: false,
      prioridad: "Normal",
    };

    try {
      await Promise.race([
        addDoc(collection(db, CHAT_COLLECTION), mensajeFirebase),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tiempo de espera agotado")), 8000)
        ),
      ]);
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      setTexto(mensajeLimpio);
      alert("No se pudo enviar la respuesta. Verifique Firebase o internet.");
    } finally {
      setEnviando(false);
    }
  };

  const obtenerFechaMensaje = (fecha) => {
    if (!fecha?.toDate) return "Sin fecha";

    const fechaMensaje = fecha.toDate();
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const mismoDia = (a, b) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (mismoDia(fechaMensaje, hoy)) return "Hoy";
    if (mismoDia(fechaMensaje, ayer)) return "Ayer";

    return fechaMensaje.toLocaleDateString("es-BO");
  };

  const formatearHora = (fecha) => {
    if (!fecha?.toDate) return "";

    return fecha.toDate().toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMensajesConFecha = () => {
    let fechaAnterior = "";

    return mensajesChat.map((item) => {
      const fechaActual = obtenerFechaMensaje(item.fecha);
      const mostrarSeparador = fechaActual !== fechaAnterior;
      fechaAnterior = fechaActual;

      return (
        <React.Fragment key={item.id}>
          {mostrarSeparador && (
            <div className="separador-fecha-chat">{fechaActual}</div>
          )}

          <div
            className={
              item.emisor === "secretaria"
                ? "mensaje-chat mensaje-propio"
                : "mensaje-chat mensaje-recibido"
            }
          >
            <div
              className={`mensaje-burbuja ${
                item.prioridad === "Urgente"
                  ? "prioridad-urgente"
                  : item.prioridad === "Emergencia"
                  ? "prioridad-emergencia"
                  : ""
              }`}
            >
              <strong>
                {item.emisor === "secretaria"
                  ? "Secretaría"
                  : item.docenteNombre}
              </strong>

              {item.prioridad && item.prioridad !== "Normal" && (
                <span className="etiqueta-prioridad">{item.prioridad}</span>
              )}

              <p>{item.mensaje}</p>

              <div className="estado-mensaje-chat">
                <span>{formatearHora(item.fecha)}</span>
                {item.emisor === "secretaria" && (
                  <span>{item.leido ? "Leído ✓✓" : "Enviado ✓"}</span>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="modulo-chat">
      <div className="chat-header">
        <div>
          <h2>Chat con Docentes</h2>
          <p>Atención de consultas y emergencias enviadas por los docentes.</p>
        </div>

        <div className="chat-usuario-box">
          <strong>Secretaría</strong>
          <span>{usuarioActivo?.id}</span>
        </div>
      </div>

      <div className="chat-admin-layout">
        <aside className="chat-lista-docentes">
          <h3>Docentes</h3>

          <div className="chat-buscador-docente">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar docente o código..."
            />
          </div>

          {docentesConChat.length > 0 ? (
            docentesConChat.map((docente) => (
              <button
                key={docente.docenteId}
                className={
                  docenteSeleccionado?.docenteId === docente.docenteId
                    ? "chat-docente-item activo"
                    : "chat-docente-item"
                }
                onClick={() => setDocenteSeleccionado(docente)}
              >
                <div className="chat-docente-linea">
                  <strong>{docente.docenteNombre}</strong>

                  {docente.noLeidos > 0 && (
                    <span className="badge-no-leido">
                      {docente.noLeidos} nuevos
                    </span>
                  )}
                </div>

                <span>Código: {docente.docenteId}</span>

                {docente.prioridad !== "Normal" && (
                  <small className={`prioridad-lista ${docente.prioridad}`}>
                    {docente.prioridad}
                  </small>
                )}

                <small>{docente.ultimoMensaje}</small>
              </button>
            ))
          ) : (
            <p className="chat-vacio-lista">Aún no hay mensajes.</p>
          )}
        </aside>

        <section className="chat-contenedor">
          {docenteSeleccionado ? (
            <>
              <div className="chat-conversacion-titulo">
                <strong>{docenteSeleccionado.docenteNombre}</strong>
                <span>Código: {docenteSeleccionado.docenteId}</span>
              </div>

              <div className="chat-mensajes">
                {mensajesChat.length > 0 ? (
                  renderMensajesConFecha()
                ) : (
                  <div className="chat-vacio">
                    No hay mensajes en esta conversación.
                  </div>
                )}

                <div ref={finalChatRef}></div>
              </div>

              <div className="respuestas-rapidas-chat">
                {respuestasRapidas.map((respuesta) => (
                  <button
                    key={respuesta}
                    type="button"
                    onClick={() => setTexto(respuesta)}
                  >
                    {respuesta}
                  </button>
                ))}
              </div>

              <form
                className="chat-formulario chat-formulario-pro"
                onSubmit={enviarRespuesta}
              >
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escriba una respuesta..."
                  disabled={enviando}
                />

                <button type="submit" disabled={enviando || !texto.trim()}>
                  {enviando ? "Enviando..." : "Responder"}
                </button>
              </form>
            </>
          ) : (
            <div className="chat-vacio">
              Seleccione un docente para responder sus mensajes.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChatDosen;