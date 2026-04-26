import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const CHAT_COLLECTION = "chat_docente_secretaria";

function ChatDosen({ usuarioActivo }) {
  const [todosMensajes, setTodosMensajes] = useState([]);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const finalChatRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, CHAT_COLLECTION), orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTodosMensajes(lista);
    });

    return () => unsubscribe();
  }, []);

  const docentesConChat = useMemo(() => {
    const mapa = new Map();

    todosMensajes.forEach((mensaje) => {
      if (!mapa.has(mensaje.docenteId)) {
        mapa.set(mensaje.docenteId, {
          docenteId: mensaje.docenteId,
          docenteNombre: mensaje.docenteNombre || `Docente ${mensaje.docenteId}`,
          ultimoMensaje: mensaje.mensaje,
          fecha: mensaje.fecha,
        });
      }
    });

    return Array.from(mapa.values());
  }, [todosMensajes]);

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
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMensajesChat(lista);
    });

    return () => unsubscribe();
  }, [docenteSeleccionado]);

  useEffect(() => {
    finalChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesChat]);

  const enviarRespuesta = async (e) => {
  e.preventDefault();

  const mensajeLimpio = texto.trim();

  if (!mensajeLimpio || !docenteSeleccionado || enviando) return;

  setEnviando(true);
  setTexto("");

  try {
    await addDoc(collection(db, CHAT_COLLECTION), {
      docenteId: String(docenteSeleccionado.docenteId),
      docenteNombre: docenteSeleccionado.docenteNombre,
      emisor: "secretaria",
      receptor: "docente",
      secretariaId: usuarioActivo?.id || "SEC001",
      mensaje: mensajeLimpio,
      fecha: serverTimestamp(),
      leido: false,
    });
  } catch (error) {
    console.error("Error al enviar respuesta:", error);
    setTexto(mensajeLimpio);
    alert("No se pudo enviar la respuesta. Revise Firebase o internet.");
  } finally {
    setEnviando(false);
  }
};

  const formatearFecha = (fecha) => {
    if (!fecha?.toDate) return "";
    return fecha.toDate().toLocaleString("es-BO", {
      dateStyle: "short",
      timeStyle: "short",
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
                <strong>{docente.docenteNombre}</strong>
                <span>Código: {docente.docenteId}</span>
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
                {mensajesChat.map((item) => (
                  <div
                    key={item.id}
                    className={
                      item.emisor === "secretaria"
                        ? "mensaje-chat mensaje-propio"
                        : "mensaje-chat mensaje-recibido"
                    }
                  >
                    <div className="mensaje-burbuja">
                      <strong>
                        {item.emisor === "secretaria"
                          ? "Secretaría"
                          : item.docenteNombre}
                      </strong>
                      <p>{item.mensaje}</p>
                      <span>{formatearFecha(item.fecha)}</span>
                    </div>
                  </div>
                ))}

                <div ref={finalChatRef}></div>
              </div>

              <form className="chat-formulario" onSubmit={enviarRespuesta}>
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escriba una respuesta..."
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