const { validationResult } = require('express-validator');
const Participante = require('../models/Participante');
const Fotografia = require('../models/Fotografia');
const Historia = require('../models/Historia');
const { validarYGuardarImagen, eliminarImagen, ImagenInvalidaError } = require('../services/imagenService');
const { estadoInscripciones } = require('../utils/ventanaInscripciones');
const { normalizarTelefono } = require('../utils/telefono');

function obtenerEstado(req, res) {
  const { abierta, motivo, inicio, fin } = estadoInscripciones();
  return res.json({ abierta, motivo, inicio, fin });
}

async function crearInscripcion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: 'Hay errores en el formulario.',
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }

  if (!req.file) {
    return res.status(400).json({
      error: 'Hay errores en el formulario.',
      detalles: [{ campo: 'imagen', mensaje: 'Debes subir una fotografía.' }],
    });
  }

  const { nombres, apellidos, telefono, fecha_nacimiento, es_estudiante, institucion } = req.body;
  const { titulo, lugar, categoria, porque_tomo_la_foto, que_quiere_mostrar, significado_del_lugar } = req.body;

  let imagenGuardada;
  let participante;
  let fotografia;

  try {
    imagenGuardada = await validarYGuardarImagen(req.file.buffer);
  } catch (err) {
    if (err instanceof ImagenInvalidaError) {
      return res.status(400).json({
        error: 'Hay errores en el formulario.',
        detalles: [{ campo: 'imagen', mensaje: err.message }],
      });
    }
    return next(err);
  }

  try {
    participante = await Participante.create({
      nombres,
      apellidos,
      telefono,
      telefono_normalizado: normalizarTelefono(telefono),
      fecha_nacimiento,
      es_estudiante,
      institucion: es_estudiante ? institucion : undefined,
    });

    fotografia = await Fotografia.create({
      titulo,
      lugar,
      categoria,
      imagen_url: imagenGuardada.url,
      imagen_public_id: imagenGuardada.publicId,
      imagen_mimetype: imagenGuardada.mimetype,
      participante_id: participante._id,
    });

    const historia = await Historia.create({
      porque_tomo_la_foto,
      que_quiere_mostrar,
      significado_del_lugar,
      fotografia_id: fotografia._id,
    });

    return res.status(201).json({
      mensaje: 'Participación registrada correctamente.',
      inscripcion: {
        participante_id: participante._id,
        fotografia_id: fotografia._id,
        historia_id: historia._id,
        titulo: fotografia.titulo,
        categoria: fotografia.categoria,
        imagen_url: fotografia.imagen_url,
      },
    });
  } catch (err) {
    await eliminarImagen(imagenGuardada.publicId);
    if (fotografia) await Fotografia.findByIdAndDelete(fotografia._id).catch(() => {});
    if (participante) await Participante.findByIdAndDelete(participante._id).catch(() => {});

    if (err.code === 11000 && err.keyPattern && err.keyPattern.telefono_normalizado) {
      return res.status(400).json({
        error: 'Hay errores en el formulario.',
        detalles: [{ campo: 'telefono', mensaje: 'Este número de teléfono ya participó en el concurso.' }],
      });
    }

    return next(err);
  }
}

module.exports = { crearInscripcion, obtenerEstado };
