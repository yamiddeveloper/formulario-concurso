const { Router } = require('express');
const { authJurado } = require('../middleware/authJurado');
const { loginValidator, calificacionValidator } = require('../validators/juradoValidator');
const { login, obtenerPerfil } = require('../controllers/juradoAuthController');
const {
  listarFotografias,
  obtenerFotografia,
  guardarCalificacion,
  eliminarCalificacion,
  obtenerResultados,
} = require('../controllers/juradoController');

const router = Router();

router.post('/login', loginValidator, login);

router.use(authJurado);

router.get('/me', obtenerPerfil);
router.get('/resultados', obtenerResultados);
router.get('/fotografias', listarFotografias);
router.get('/fotografias/:id', obtenerFotografia);
router.put('/fotografias/:id/calificacion', calificacionValidator, guardarCalificacion);
router.delete('/fotografias/:id/calificacion', eliminarCalificacion);

module.exports = router;
