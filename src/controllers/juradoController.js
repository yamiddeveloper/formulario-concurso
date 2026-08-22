const { validationResult } = require('express-validator');
const Fotografia = require('../models/Fotografia');
const Historia = require('../models/Historia');
const Calificacion = require('../models/Calificacion');
const Jurado = require('../models/Jurado');
const { CATEGORIAS, NOMBRES_CATEGORIA } = require('../utils/categorias');

function totalCalificacion(c) {
  if (!c) return null;
  return c.contenido + c.organizacion_estetica + c.creatividad + c.tecnica;
}

function serializarCalificacion(c) {
  if (!c) return null;
  return {
    contenido: c.contenido,
    organizacion_estetica: c.organizacion_estetica,
    creatividad: c.creatividad,
    tecnica: c.tecnica,
    total: totalCalificacion(c),
  };
}

async function listarFotografias(req, res, next) {
  try {
    const fotografias = await Fotografia.find({}).sort({ createdAt: 1 }).populate('participante_id', 'nombres apellidos').lean();

    const calificaciones = await Calificacion.find({ jurado_id: req.jurado.id }).lean();
    const calificacionPorFoto = new Map(calificaciones.map((c) => [c.fotografia_id.toString(), c]));

    return res.json({
      fotografias: fotografias.map((f) => ({
        id: f._id,
        titulo: f.titulo,
        lugar: f.lugar,
        categoria: f.categoria,
        imagen_url: f.imagen_url,
        participante: f.participante_id
          ? { nombres: f.participante_id.nombres, apellidos: f.participante_id.apellidos }
          : null,
        creado_en: f.createdAt,
        mi_calificacion: serializarCalificacion(calificacionPorFoto.get(f._id.toString())),
      })),
    });
  } catch (err) {
    return next(err);
  }
}

async function obtenerFotografia(req, res, next) {
  try {
    const fotografia = await Fotografia.findById(req.params.id).populate('participante_id', 'nombres apellidos').lean();
    if (!fotografia) {
      return res.status(404).json({ error: 'Fotografía no encontrada.' });
    }

    const [historia, miCalificacion] = await Promise.all([
      Historia.findOne({ fotografia_id: fotografia._id }).lean(),
      Calificacion.findOne({ jurado_id: req.jurado.id, fotografia_id: fotografia._id }).lean(),
    ]);

    return res.json({
      fotografia: {
        id: fotografia._id,
        titulo: fotografia.titulo,
        lugar: fotografia.lugar,
        categoria: fotografia.categoria,
        imagen_url: fotografia.imagen_url,
        participante: fotografia.participante_id
          ? { nombres: fotografia.participante_id.nombres, apellidos: fotografia.participante_id.apellidos }
          : null,
        historia: historia
          ? {
              porque_tomo_la_foto: historia.porque_tomo_la_foto,
              que_quiere_mostrar: historia.que_quiere_mostrar,
              significado_del_lugar: historia.significado_del_lugar,
            }
          : null,
        mi_calificacion: serializarCalificacion(miCalificacion),
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function guardarCalificacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: 'Hay errores en la calificación.',
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }

  try {
    const fotografia = await Fotografia.findById(req.params.id).lean();
    if (!fotografia) {
      return res.status(404).json({ error: 'Fotografía no encontrada.' });
    }

    const { contenido, organizacion_estetica, creatividad, tecnica } = req.body;

    const calificacion = await Calificacion.findOneAndUpdate(
      { jurado_id: req.jurado.id, fotografia_id: fotografia._id },
      { contenido, organizacion_estetica, creatividad, tecnica },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    return res.json({
      mensaje: 'Calificación guardada.',
      mi_calificacion: serializarCalificacion(calificacion),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Hay errores en la calificación.',
        detalles: Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message })),
      });
    }
    return next(err);
  }
}

async function eliminarCalificacion(req, res, next) {
  try {
    const fotografia = await Fotografia.findById(req.params.id).lean();
    if (!fotografia) {
      return res.status(404).json({ error: 'Fotografía no encontrada.' });
    }

    await Calificacion.deleteOne({ jurado_id: req.jurado.id, fotografia_id: fotografia._id });

    return res.json({ mensaje: 'Calificación eliminada.' });
  } catch (err) {
    return next(err);
  }
}

const GANADORES_POR_CATEGORIA = 2;

async function obtenerResultados(req, res, next) {
  try {
    const [fotografias, calificaciones, juradosActivos] = await Promise.all([
      Fotografia.find({}).populate('participante_id', 'nombres apellidos').lean(),
      Calificacion.find({}).lean(),
      Jurado.countDocuments({ activo: true }),
    ]);

    const agregadoPorFoto = new Map();
    for (const c of calificaciones) {
      const clave = c.fotografia_id.toString();
      const actual = agregadoPorFoto.get(clave) || { suma: 0, jurados: 0 };
      actual.suma += totalCalificacion(c);
      actual.jurados += 1;
      agregadoPorFoto.set(clave, actual);
    }

    function serializarFoto(f) {
      const agregado = agregadoPorFoto.get(f._id.toString()) || { suma: 0, jurados: 0 };
      return {
        id: f._id,
        titulo: f.titulo,
        imagen_url: f.imagen_url,
        participante: f.participante_id
          ? { nombres: f.participante_id.nombres, apellidos: f.participante_id.apellidos }
          : null,
        puntaje_total: agregado.suma,
        calificaciones_recibidas: agregado.jurados,
        completa: juradosActivos > 0 && agregado.jurados >= juradosActivos,
      };
    }

    const categorias = CATEGORIAS.map((clave) => {
      const resultados = fotografias.filter((f) => f.categoria === clave).map(serializarFoto);

      resultados.sort((a, b) => b.puntaje_total - a.puntaje_total);
      resultados.forEach((r, indice) => {
        r.posicion = indice + 1;
        r.es_ganador = r.posicion <= GANADORES_POR_CATEGORIA;
      });

      return {
        clave,
        nombre: NOMBRES_CATEGORIA[clave],
        // Una categoría sin fotografías no tiene nada pendiente por calificar,
        // así que se considera completa por definición (no debe bloquear el
        // resto de la evaluación para siempre).
        completa: resultados.every((r) => r.completa),
        resultados,
      };
    });

    const totalFotografias = fotografias.length;
    const evaluacionCompleta =
      juradosActivos > 0 && totalFotografias > 0 && categorias.every((c) => c.completa);

    return res.json({
      jurados_totales: juradosActivos,
      evaluacion_completa: evaluacionCompleta,
      categorias,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listarFotografias,
  obtenerFotografia,
  guardarCalificacion,
  eliminarCalificacion,
  obtenerResultados,
};
