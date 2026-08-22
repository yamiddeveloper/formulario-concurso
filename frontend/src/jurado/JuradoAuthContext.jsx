import { createContext, useContext, useMemo, useState } from "react";
import { iniciarSesion as iniciarSesionApi } from "./juradoApi";

const CLAVE_SESION = "chitaga-jurado-sesion";

const JuradoAuthContext = createContext(null);

function cargarSesion() {
  try {
    const guardada = window.localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

export function JuradoAuthProvider({ children }) {
  const [sesion, setSesion] = useState(cargarSesion);

  const iniciarSesion = async (usuario, password) => {
    const respuesta = await iniciarSesionApi(usuario, password);
    const nuevaSesion = { token: respuesta.token, nombre: respuesta.jurado.nombre };
    window.localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  };

  const valor = useMemo(
    () => ({
      token: sesion?.token || null,
      nombre: sesion?.nombre || null,
      autenticado: Boolean(sesion?.token),
      iniciarSesion,
      cerrarSesion,
    }),
    [sesion],
  );

  return <JuradoAuthContext.Provider value={valor}>{children}</JuradoAuthContext.Provider>;
}

export function useJuradoAuth() {
  const contexto = useContext(JuradoAuthContext);
  if (!contexto) {
    throw new Error("useJuradoAuth debe usarse dentro de JuradoAuthProvider.");
  }
  return contexto;
}
