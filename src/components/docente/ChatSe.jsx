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

    if (!texto.trim()) return;

    setEnviando(true);

    try {
      await addDoc(collection(db, CHAT_COLLECTION), {
        docenteId: String(usuarioActivo.id),
        docenteNombre: docenteInfo.nombre,
        emisor: "docente",
        receptor: "secretaria",
        mensaje: texto.trim(),
        fecha: serverTimestamp(),
        leido: false,
      });

      setTexto("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje.");
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
            mensajes.map((item) => (
              <div
                key={item.id}
                className={
                  item.emisor === "docente"
                    ? "mensaje-chat mensaje-propio"
                    : "mensaje-chat mensaje-recibido"
                }
              >
                <div className="mensaje-burbuja">
                  <strong>
                    {item.emisor === "docente" ? "Yo" : "Secretaría"}
                  </strong>
                  <p>{item.mensaje}</p>
                  <span>{formatearFecha(item.fecha)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="chat-vacio">
              Aún no existen mensajes. Escriba su primera consulta a secretaría.
            </div>
          )}

          <div ref={finalChatRef}></div>
        </div>

        <form className="chat-formulario" onSubmit={enviarMensaje}>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escriba su mensaje..."
          />

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatSe;