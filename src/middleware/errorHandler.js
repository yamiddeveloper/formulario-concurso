const multer = require('multer');
const { MAX_UPLOAD_MB } = require('./upload');

function manejarErroresMulter(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Hay errores en el formulario.',
        detalles: [{ campo: 'imagen', mensaje: `La imagen no puede superar ${MAX_UPLOAD_MB}MB.` }],
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Hay errores en el formulario.',
        detalles: [{ campo: 'imagen', mensaje: 'El archivo debe ser una imagen JPG, PNG o WEBP.' }],
      });
    }
    return res.status(400).json({
      error: 'Hay errores en el formulario.',
      detalles: [{ campo: 'imagen', mensaje: 'No fue posible procesar la imagen.' }],
    });
  }
  return next(err);
}

// eslint-disable-next-line no-unused-vars
function manejadorErroresGeneral(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Hay errores en el formulario.',
      detalles: Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message })),
    });
  }

  console.error('Error no controlado:', err.name, err.message);

  return res.status(500).json({
    error: 'Ocurrió un error inesperado. Intenta nuevamente en unos minutos.',
  });
}

module.exports = { manejarErroresMulter, manejadorErroresGeneral };
