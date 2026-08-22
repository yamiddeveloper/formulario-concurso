const { body } = require('express-validator');

const loginValidator = [
  body('usuario').trim().notEmpty().withMessage('Ingresa tu usuario.'),
  body('password').notEmpty().withMessage('Ingresa tu contraseña.'),
];

const calificacionValidator = [
  body('contenido').isInt({ min: 1, max: 4 }).withMessage('Contenido debe ser un valor entre 1 y 4.'),
  body('organizacion_estetica')
    .isInt({ min: 1, max: 4 })
    .withMessage('Organización estética debe ser un valor entre 1 y 4.'),
  body('creatividad').isInt({ min: 1, max: 4 }).withMessage('Creatividad debe ser un valor entre 1 y 4.'),
  body('tecnica').isInt({ min: 1, max: 4 }).withMessage('Técnica debe ser un valor entre 1 y 4.'),
];

module.exports = { loginValidator, calificacionValidator };
