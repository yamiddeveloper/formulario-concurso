const test = require('node:test');
const assert = require('node:assert/strict');

// Ventana ya cerrada, para probar que el endpoint la respeta.
process.env.INSCRIPCIONES_INICIO = '2000-01-01T00:00:00-05:00';
process.env.INSCRIPCIONES_FIN = '2000-01-02T00:00:00-05:00';
process.env.MAX_UPLOAD_MB = '10';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const sharp = require('sharp');

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

test('GET /api/inscripciones/estado reporta la ventana cerrada', async () => {
  const res = await request(app).get('/api/inscripciones/estado');
  assert.equal(res.status, 200);
  assert.equal(res.body.abierta, false);
  assert.equal(res.body.motivo, 'cerrada');
});

test('POST /api/inscripciones rechaza envíos fuera de la ventana de inscripción', async () => {
  const buffer = await sharp({
    create: { width: 10, height: 10, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .jpeg()
    .toBuffer();

  const res = await request(app)
    .post('/api/inscripciones')
    .field('nombres', 'Ana')
    .field('apellidos', 'Perez')
    .field('fecha_nacimiento', '2010-06-01')
    .field('es_estudiante', 'false')
    .field('titulo', 'Titulo de prueba')
    .field('lugar', 'Lugar de prueba')
    .field('categoria', 'natural')
    .field('porque_tomo_la_foto', 'Una razón de prueba con suficiente longitud.')
    .field('que_quiere_mostrar', 'Algo que quiero mostrar con suficiente longitud.')
    .field('significado_del_lugar', 'Un significado de prueba con longitud suficiente.')
    .attach('imagen', buffer, 'foto.jpg');

  assert.equal(res.status, 403);
});
