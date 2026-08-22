// Colombia no observa horario de verano: UTC-5 todo el año, por lo que el
// offset se puede fijar directamente en las fechas ISO.
function fechaInicio() {
  return new Date(process.env.INSCRIPCIONES_INICIO || '2026-08-24T00:00:00-05:00');
}

function fechaFin() {
  return new Date(process.env.INSCRIPCIONES_FIN || '2026-08-28T16:00:00-05:00');
}

function estadoInscripciones(ahora = new Date()) {
  const inicio = fechaInicio();
  const fin = fechaFin();

  let abierta = true;
  let motivo = null;

  if (ahora < inicio) {
    abierta = false;
    motivo = 'no_iniciada';
  } else if (ahora > fin) {
    abierta = false;
    motivo = 'cerrada';
  }

  return { abierta, motivo, inicio, fin };
}

module.exports = { estadoInscripciones };
