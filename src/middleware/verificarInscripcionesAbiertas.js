const { estadoInscripciones } = require('../utils/ventanaInscripciones');

const MENSAJES = {
  no_iniciada: 'Las inscripciones todavía no han abierto.',
  cerrada: 'Las inscripciones para el concurso ya cerraron.',
};

function verificarInscripcionesAbiertas(req, res, next) {
  const { abierta, motivo } = estadoInscripciones();
  if (!abierta) {
    return res.status(403).json({ error: MENSAJES[motivo] });
  }
  return next();
}

module.exports = { verificarInscripcionesAbiertas };
