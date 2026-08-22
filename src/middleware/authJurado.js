const jwt = require('jsonwebtoken');

function authJurado(req, res, next) {
  const encabezado = req.headers.authorization || '';
  const [tipo, token] = encabezado.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Debes iniciar sesión para acceder.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.jurado = { id: payload.sub, nombre: payload.nombre };
    return next();
  } catch {
    return res.status(401).json({ error: 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.' });
  }
}

module.exports = { authJurado };
