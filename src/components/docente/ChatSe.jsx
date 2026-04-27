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
const STORAGE_DOCENTES = "docentes_registrados";

function ChatSe({ usuarioActivo }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [prioridad, setPrioridad] = useState("Normal");
  const [enviando, setEnviando] = useState(false);
  const finalChatRef = useRef(null);

  const docenteInfo = useMemo(() => {
    try {
      const data = localStorage.getItem(STORAGE_DOCENTES);
      const registros = data ? JSON.parse(data) : [];

      const encontrado = registros.find(
        (item) => String(item.cod) === String(usuarioActivo?.id)
      );

      return {
        id: usuarioActivo?.id,
        nombre: encontrado?.nombre || `Docente ${usuarioActivo?.id}`,
      };
    } catch {
      return {
        id: usuarioActivo?.id,
        nombre: `Docente ${usuarioActivo?.id}`,
      };
    }
  }, [usuarioActivo]);

  useEffect(() => {
    if (!usuarioActivo?.id) return;

    const q = query(
      collection(db, CHAT_COLLECTION),
      where("docenteId", "==", String(usuarioActivo.id)),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMensajes(lista);
    });

    return () => unsubscribe();
  }, [usuarioActivo]);

  useEffect(() => {
    finalChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();

    const mensajeLimpio = texto.trim();

    if (!mensajeLimpio || enviando) return;

    setEnviando(true);
    setTexto("");

    const mensajeFirebase = {
      docenteId: String(usuarioActivo.id),
      docenteNombre: docenteInfo.nombre,
      emisor: "docente",
      receptor: "secretaria",
      mensaje: mensajeLimpio,
      fecha: serverTimestamp(),
      leido: false,
      prioridad: prioridad,
    };

    try {
      await Promise.race([
        addDoc(collection(db, CHAT_COLLECTION), mensajeFirebase),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tiempo de espera agotado")), 8000)
        ),
      ]);

      setPrioridad("Normal");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setTexto(mensajeLimpio);
      alert(
        "No se pudo enviar el mensaje. Verifique Firebase, internet o las reglas de Firestore."
      );
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

    return mensajes.map((item) => {
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
              item.emisor === "docente"
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
                {item.emisor === "docente" ? "Yo" : "Secretaría"}
              </strong>

              {item.prioridad && item.prioridad !== "Normal" && (
                <span className="etiqueta-prioridad">
                  {item.prioridad}
                </span>
              )}

              <p>{item.mensaje}</p>

              <div className="estado-mensaje-chat">
                <span>{formatearHora(item.fecha)}</span>

                {item.emisor === "docente" && (
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
          <h2>Chat con Secretaría</h2>
          <p>Comunicación directa para consultas académicas o emergencias.</p>
        </div>

        <div className="chat-usuario-box">
          <strong>{docenteInfo.nombre}</strong>
          <span>Código: {usuarioActivo.id}</span>
        </div>
      </div>

      <div className="chat-contenedor">
        <div className="chat-mensajes">
          {mensajes.length > 0 ? (
            renderMensajesConFecha()
          ) : (
            <div className="chat-vacio">
              Aún no existen mensajes. Escriba su primera consulta a secretaría.
            </div>
          )}

          <div ref={finalChatRef}></div>
        </div>

        <form className="chat-formulario chat-formulario-pro" onSubmit={enviarMensaje}>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            disabled={enviando}
          >
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
            <option value="Emergencia">Emergencia</option>
          </select>

          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escriba su mensaje..."
            disabled={enviando}
          />

          <button type="submit" disabled={enviando || !texto.trim()}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatSe;