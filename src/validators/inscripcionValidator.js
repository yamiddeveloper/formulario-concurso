const { body } = require('express-validator');
const { calcularEdad, edadEsValida, EDAD_MINIMA, EDAD_MAXIMA } = require('../utils/edad');
const { CATEGORIAS } = require('../utils/categorias');

const NOMBRE_REGEX = /^[\p{L}\s'-]+$/u;

function esEstudianteTruthy(valor) {
  return valor === true || valor === 'true';
}

const inscripcionValidator = [
  body('nombres')
    .trim()
    .notEmpty()
    .withMessage('Ingresa tus nombres.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Los nombres deben tener entre 2 y 100 caracteres.')
    .matches(NOMBRE_REGEX)
    .withMessage('Los nombres solo pueden contener letras, espacios, guiones y apóstrofes.'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('Ingresa tus apellidos.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Los apellidos deben tener entre 2 y 100 caracteres.')
    .matches(NOMBRE_REGEX)
    .withMessage('Los apellidos solo pueden contener letras, espacios, guiones y apóstrofes.'),

  body('fecha_nacimiento')
    .notEmpty()
    .withMessage('Ingresa tu fecha de nacimiento.')
    .isISO8601()
    .withMessage('La fecha de nacimiento no es válida.')
    .toDate()
    .custom((fechaNacimiento) => {
      if (fechaNacimiento > new Date()) {
        throw new Error('La fecha de nacimiento no puede ser futura.');
      }
      const edad = calcularEdad(fechaNacimiento);
      if (!edadEsValida(edad)) {
        throw new Error(`Debes tener entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años para participar.`);
      }
      return true;
    }),

  body('es_estudiante')
    .notEmpty()
    .withMessage('Indica si eres estudiante.')
    .isBoolean()
    .withMessage('es_estudiante debe ser verdadero o falso.')
    .toBoolean(),

  body('institucion')
    .trim()
    .custom((valor, { req }) => {
      if (esEstudianteTruthy(req.body.es_estudiante) && !valor) {
        throw new Error('Ingresa el nombre de tu institución.');
      }
      return true;
    })
    .isLength({ max: 150 })
    .withMessage('El nombre de la institución es demasiado largo.'),

  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Ingresa un título para tu fotografía.')
    .isLength({ min: 3, max: 150 })
    .withMessage('El título debe tener entre 3 y 150 caracteres.'),

  body('lugar')
    .trim()
    .notEmpty()
    .withMessage('Ingresa el lugar donde tomaste la fotografía.')
    .isLength({ min: 2, max: 150 })
    .withMessage('El lugar debe tener entre 2 y 150 caracteres.'),

  body('categoria')
    .trim()
    .notEmpty()
    .withMessage('Selecciona una categoría.')
    .isIn(CATEGORIAS)
    .withMessage('La categoría seleccionada no es válida.'),

  body('porque_tomo_la_foto')
    .trim()
    .notEmpty()
    .withMessage('Cuéntanos por qué tomaste esta fotografía.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Esta respuesta debe tener entre 10 y 1000 caracteres.'),

  body('que_quiere_mostrar')
    .trim()
    .notEmpty()
    .withMessage('Cuéntanos qué quieres mostrarnos con esta fotografía.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Esta respuesta debe tener entre 10 y 1000 caracteres.'),

  body('significado_del_lugar')
    .trim()
    .notEmpty()
    .withMessage('Cuéntanos qué significa este lugar para ti.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Esta respuesta debe tener entre 10 y 1000 caracteres.'),
];

module.exports = { inscripcionValidator };
