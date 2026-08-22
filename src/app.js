const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const inscripcionRoutes = require('./routes/inscripcionRoutes');
const juradoRoutes = require('./routes/juradoRoutes');
const { manejadorErroresGeneral } = require('./middleware/errorHandler');

function crearApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(mongoSanitize());

  const inscripcionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Intenta nuevamente más tarde.' },
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Intenta nuevamente más tarde.' },
  });

  app.get('/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  app.use(
    '/api/inscripciones',
    (req, res, next) => (req.path === '/' && req.method === 'POST' ? inscripcionLimiter(req, res, next) : next()),
    inscripcionRoutes,
  );
  app.use(
    '/api/jurado',
    (req, res, next) => (req.path === '/login' ? loginLimiter(req, res, next) : next()),
    juradoRoutes,
  );

  app.use((req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado.' });
  });

  app.use(manejadorErroresGeneral);

  return app;
}

module.exports = { crearApp };
