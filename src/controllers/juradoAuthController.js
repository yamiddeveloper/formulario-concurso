const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Jurado = require('../models/Jurado');

function firmarToken(jurado) {
  return jwt.sign({ sub: jurado._id.toString(), nombre: jurado.nombre }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  });
}

async function login(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: 'Hay errores en el formulario.',
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }

  const { usuario, password } = req.body;

  try {
    const jurado = await Jurado.findOne({ usuario: usuario.trim().toLowerCase(), activo: true }).select(
      '+password_hash',
    );

    // Mismo mensaje genérico exista o no el usuario, para no filtrar
    // qué usuarios están registrados.
    if (!jurado) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const coincide = await bcrypt.compare(password, jurado.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    return res.json({
      token: firmarToken(jurado),
      jurado: { id: jurado._id, nombre: jurado.nombre },
    });
  } catch (err) {
    return next(err);
  }
}

async function obtenerPerfil(req, res) {
  return res.json({ jurado: req.jurado });
}

module.exports = { login, obtenerPerfil };
