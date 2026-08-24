const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-prueba-no-usar-en-produccion';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

const { crearApp } = require('../src/app');
const { connectDB } = require('../src/config/db');

let mongod;
let app;

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = crearApp();
});

test.after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Regresion: en Render la app corre detras de un proxy que agrega
// X-Forwarded-For. Sin `trust proxy`, express-rate-limit lanzaba
// ERR_ERL_UNEXPECTED_X_FORWARDED_FOR y toda peticion limitada (login e
// inscripciones) respondia 500.
test('las rutas limitadas responden normal detras de un proxy con X-Forwarded-For', async () => {
  const res = await request(app)
    .post('/api/jurado/login')
    .set('X-Forwarded-For', '203.0.113.9, 198.51.100.4')
    .send({ usuario: 'inexistente', password: 'incorrecta' });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Usuario o contraseña incorrectos.');
});

test('el endpoint de inscripciones tampoco falla detras del proxy', async () => {
  const res = await request(app)
    .post('/api/inscripciones')
    .set('X-Forwarded-For', '203.0.113.9, 198.51.100.4')
    .field('nombres', 'Ana');

  // Puede rechazar por ventana cerrada o por validacion, pero nunca por un
  // fallo interno del limitador.
  assert.notEqual(res.status, 500);
});
