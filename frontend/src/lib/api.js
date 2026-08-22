import { API_URL } from "./apiUrl";

export class ApiError extends Error {
  constructor(mensaje, detalles = []) {
    super(mensaje);
    this.name = "ApiError";
    this.detalles = detalles;
  }
}

export async function enviarInscripcion(data) {
  const cuerpo = new FormData();
  cuerpo.append("nombres", data.nombres.trim());
  cuerpo.append("apellidos", data.apellidos.trim());
  cuerpo.append("fecha_nacimiento", data.fecha_nacimiento);
  cuerpo.append("es_estudiante", String(data.es_estudiante === true));
  if (data.es_estudiante) {
    cuerpo.append("institucion", data.institucion.trim());
  }
  cuerpo.append("titulo", data.titulo.trim());
  cuerpo.append("lugar", data.lugar.trim());
  cuerpo.append("categoria", data.categoria);
  cuerpo.append("imagen", data.imagen);
  cuerpo.append("porque_tomo_la_foto", data.porque_tomo_la_foto.trim());
  cuerpo.append("que_quiere_mostrar", data.que_quiere_mostrar.trim());
  cuerpo.append("significado_del_lugar", data.significado_del_lugar.trim());

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}/inscripciones`, {
      method: "POST",
      body: cuerpo,
    });
  } catch {
    throw new ApiError("No pudimos conectarnos al servidor. Revisa tu conexión e intenta de nuevo.");
  }

  const cuerpoRespuesta = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new ApiError(
      cuerpoRespuesta.error || "Ocurrió un error al enviar tu participación.",
      cuerpoRespuesta.detalles || [],
    );
  }

  return cuerpoRespuesta.inscripcion;
}

export async function obtenerEstadoInscripciones() {
  const respuesta = await fetch(`${API_URL}/inscripciones/estado`);
  if (!respuesta.ok) {
    throw new ApiError("No pudimos verificar el estado de las inscripciones.");
  }
  return respuesta.json();
}
