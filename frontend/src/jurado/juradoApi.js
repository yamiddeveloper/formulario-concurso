import { API_URL } from "../lib/apiUrl";

export class JuradoApiError extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.name = "JuradoApiError";
    this.status = status;
  }
}

async function peticion(ruta, { token, ...opciones } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}/jurado${ruta}`, {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new JuradoApiError("No pudimos conectarnos al servidor. Revisa tu conexión e intenta de nuevo.", 0);
  }

  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new JuradoApiError(cuerpo.error || "Ocurrió un error inesperado.", respuesta.status);
  }

  return cuerpo;
}

export function iniciarSesion(usuario, password) {
  return peticion("/login", { method: "POST", body: JSON.stringify({ usuario, password }) });
}

export function obtenerPerfil(token) {
  return peticion("/me", { token });
}

export function listarFotografias(token) {
  return peticion("/fotografias", { token });
}

export function obtenerFotografia(token, id) {
  return peticion(`/fotografias/${id}`, { token });
}

export function guardarCalificacion(token, id, calificacion) {
  return peticion(`/fotografias/${id}/calificacion`, {
    token,
    method: "PUT",
    body: JSON.stringify(calificacion),
  });
}

export function eliminarCalificacion(token, id) {
  return peticion(`/fotografias/${id}/calificacion`, { token, method: "DELETE" });
}

export function obtenerResultados(token) {
  return peticion("/resultados", { token });
}
