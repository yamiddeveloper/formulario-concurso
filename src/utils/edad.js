const EDAD_MINIMA = 14;
const EDAD_MAXIMA = 28;

function calcularEdad(fechaNacimiento, fechaReferencia = new Date()) {
  const nacimiento = new Date(fechaNacimiento);
  let edad = fechaReferencia.getFullYear() - nacimiento.getFullYear();
  const mesDiff = fechaReferencia.getMonth() - nacimiento.getMonth();
  const diaDiff = fechaReferencia.getDate() - nacimiento.getDate();

  if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
    edad -= 1;
  }

  return edad;
}

function edadEsValida(edad) {
  return Number.isInteger(edad) && edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA;
}

module.exports = { calcularEdad, edadEsValida, EDAD_MINIMA, EDAD_MAXIMA };
