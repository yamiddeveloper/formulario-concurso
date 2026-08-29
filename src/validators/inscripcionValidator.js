const { body } = require('express-validator');
const { calcularEdad, edadEsValida, EDAD_MINIMA, EDAD_MAXIMA } = require('../utils/edad');
const { CATEGORIAS } = require('../utils/categorias');
const { normalizarTelefono } = require('../utils/telefono');
const Participante = require('../models/Participante');

const NOMBRE_REGEX = /^[\p{L}\s'-]+$/u;
// Solo caracteres razonables de un numero de telefono: digitos, espacios,
// guiones, parentesis y un + inicial para el indicativo de pais.
const TELEFONO_CARACTERES_REGEX = /^[0-9+\-\s()]+$/;

function esEstudianteTruthy(valor) {
  return valor === true || valor === 'true';
}

function contarDigitos(valor) {
  return (valor.match(/\d/g) || []).length;
}

function escaparRegex(valor) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Una persona no deberia poder participar dos veces. No hay documento de
// identidad en el formulario, asi que se detecta por telefono (chequeo
// aparte, en el propio campo) o por nombre completo + fecha de nacimiento
// exactos (sin importar mayusculas/minusculas).
async function existeParticipanteConMismoNombre(nombres, apellidos, fechaNacimiento) {
  const existente = await Participante.findOne({
    fecha_nacimiento: fechaNacimiento,
    nombres: { $regex: `^${escaparRegex(nombres.trim())}$`, $options: 'i' },
    apellidos: { $regex: `^${escaparRegex(apellidos.trim())}$`, $options: 'i' },
  }).lean();
  return Boolean(existente);
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

  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('Ingresa tu número de teléfono.')
    .matches(TELEFONO_CARACTERES_REGEX)
    .withMessage('El teléfono solo puede contener números, espacios, guiones y paréntesis.')
    .custom(async (valor) => {
      const digitos = contarDigitos(valor);
      if (digitos < 7 || digitos > 15) {
        throw new Error('Ingresa un número de teléfono válido.');
      }
      const yaExiste = await Participante.exists({ telefono_normalizado: normalizarTelefono(valor) });
      if (yaExiste) {
        throw new Error('Este número de teléfono ya participó en el concurso.');
      }
      return true;
    }),

  body('fecha_nacimiento')
    .notEmpty()
    .withMessage('Ingresa tu fecha de nacimiento.')
    .isISO8601()
    .withMessage('La fecha de nacimiento no es válida.')
    .toDate()
    .custom(async (fechaNacimiento, { req }) => {
      if (fechaNacimiento > new Date()) {
        throw new Error('La fecha de nacimiento no puede ser futura.');
      }
      const edad = calcularEdad(fechaNacimiento);
      if (!edadEsValida(edad)) {
        throw new Error(`Debes tener entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años para participar.`);
      }
      if (req.body.nombres && req.body.apellidos) {
        const yaExiste = await existeParticipanteConMismoNombre(req.body.nombres, req.body.apellidos, fechaNacimiento);
        if (yaExiste) {
          throw new Error('Ya existe una participación registrada con este nombre y fecha de nacimiento.');
        }
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
