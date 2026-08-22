export const EDAD_MINIMA = 14;
export const EDAD_MAXIMA = 28;
export const TAMANO_MAXIMO_MB = 10;
export const TIPOS_IMAGEN_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export const CATEGORIAS = [
  { valor: "cultural_patrimonio", nombre: "Cultural o patrimonio" },
  { valor: "natural", nombre: "Natural" },
];

const NOMBRE_REGEX = /^[\p{L}\s'-]+$/u;

export function calcularEdad(fechaNacimiento, fechaReferencia = new Date()) {
  const nacimiento = new Date(fechaNacimiento);
  let edad = fechaReferencia.getFullYear() - nacimiento.getFullYear();
  const mesDiff = fechaReferencia.getMonth() - nacimiento.getMonth();
  const diaDiff = fechaReferencia.getDate() - nacimiento.getDate();

  if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
    edad -= 1;
  }

  return edad;
}

function requerido(valor, mensaje) {
  return valor && valor.trim() ? null : mensaje;
}

function longitud(valor, min, max, mensaje) {
  const largo = valor.trim().length;
  return largo >= min && largo <= max ? null : mensaje;
}

export function validarParticipante(data) {
  const errores = {};

  errores.nombres =
    requerido(data.nombres, "Ingresa tus nombres.") ||
    longitud(data.nombres, 2, 100, "Los nombres deben tener entre 2 y 100 caracteres.") ||
    (NOMBRE_REGEX.test(data.nombres.trim())
      ? null
      : "Los nombres solo pueden contener letras, espacios, guiones y apóstrofes.");

  errores.apellidos =
    requerido(data.apellidos, "Ingresa tus apellidos.") ||
    longitud(data.apellidos, 2, 100, "Los apellidos deben tener entre 2 y 100 caracteres.") ||
    (NOMBRE_REGEX.test(data.apellidos.trim())
      ? null
      : "Los apellidos solo pueden contener letras, espacios, guiones y apóstrofes.");

  if (!data.fecha_nacimiento) {
    errores.fecha_nacimiento = "Ingresa tu fecha de nacimiento.";
  } else {
    const fecha = new Date(data.fecha_nacimiento);
    if (fecha > new Date()) {
      errores.fecha_nacimiento = "La fecha de nacimiento no puede ser futura.";
    } else {
      const edad = calcularEdad(fecha);
      if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
        errores.fecha_nacimiento = `Debes tener entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años para participar.`;
      }
    }
  }

  if (data.es_estudiante === null) {
    errores.es_estudiante = "Indica si eres estudiante.";
  }

  if (data.es_estudiante === true) {
    errores.institucion = requerido(data.institucion, "Ingresa el nombre de tu institución.");
  }

  return limpiar(errores);
}

export function validarFotografia(data) {
  const errores = {};

  errores.titulo =
    requerido(data.titulo, "Ingresa un título para tu fotografía.") ||
    longitud(data.titulo, 3, 150, "El título debe tener entre 3 y 150 caracteres.");

  errores.lugar =
    requerido(data.lugar, "Ingresa el lugar donde tomaste la fotografía.") ||
    longitud(data.lugar, 2, 150, "El lugar debe tener entre 2 y 150 caracteres.");

  if (!data.categoria) {
    errores.categoria = "Selecciona una categoría.";
  }

  if (!data.imagen) {
    errores.imagen = "Debes subir una fotografía.";
  } else if (!TIPOS_IMAGEN_PERMITIDOS.includes(data.imagen.type)) {
    errores.imagen = "El archivo debe ser una imagen JPG, PNG o WEBP.";
  } else if (data.imagen.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
    errores.imagen = `La imagen no puede superar ${TAMANO_MAXIMO_MB}MB.`;
  }

  return limpiar(errores);
}

export function validarHistoria(data) {
  const errores = {};

  errores.porque_tomo_la_foto =
    requerido(data.porque_tomo_la_foto, "Cuéntanos por qué tomaste esta fotografía.") ||
    longitud(data.porque_tomo_la_foto, 10, 1000, "Esta respuesta debe tener entre 10 y 1000 caracteres.");

  errores.que_quiere_mostrar =
    requerido(data.que_quiere_mostrar, "Cuéntanos qué quieres mostrarnos con esta fotografía.") ||
    longitud(data.que_quiere_mostrar, 10, 1000, "Esta respuesta debe tener entre 10 y 1000 caracteres.");

  errores.significado_del_lugar =
    requerido(data.significado_del_lugar, "Cuéntanos qué significa este lugar para ti.") ||
    longitud(data.significado_del_lugar, 10, 1000, "Esta respuesta debe tener entre 10 y 1000 caracteres.");

  return limpiar(errores);
}

function limpiar(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
}

const VALIDADORES_POR_PASO = {
  1: validarParticipante,
  2: validarFotografia,
  3: validarHistoria,
};

// Valida un solo campo (para feedback en blur) reutilizando el validador
// completo del paso, sin tocar los errores de los demás campos del paso.
export function validarCampo(paso, campo, datos) {
  const validar = VALIDADORES_POR_PASO[paso];
  if (!validar) return null;
  return validar(datos)[campo] || null;
}
