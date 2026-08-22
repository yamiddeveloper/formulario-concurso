const { Router } = require('express');
const { upload } = require('../middleware/upload');
const { manejarErroresMulter } = require('../middleware/errorHandler');
const { verificarInscripcionesAbiertas } = require('../middleware/verificarInscripcionesAbiertas');
const { inscripcionValidator } = require('../validators/inscripcionValidator');
const { crearInscripcion, obtenerEstado } = require('../controllers/inscripcionController');

const router = Router();

router.get('/estado', obtenerEstado);

router.post(
  '/',
  verificarInscripcionesAbiertas,
  upload.single('imagen'),
  manejarErroresMulter,
  inscripcionValidator,
  crearInscripcion,
);

module.exports = router;
