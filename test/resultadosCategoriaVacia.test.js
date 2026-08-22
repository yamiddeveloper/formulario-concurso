const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-prueba-no-usar-en-produccion';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');

const { crearApp } = require('../src/app');
const { connectDB } = require('../src/config/db');
const Jurado = require('../src/models/Jurado');
const Participante = require('../src/models/Participante');
const Fotografia = require('../src/models/Fotografia');

let mongod;
let app;
let token;

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = crearApp();

  const password_hash = await bcrypt.hash('claveSegura123', 12);
  await Jurado.create({ nombre: 'Jurado Unico', usuario: 'jurado1', password_hash, activo: true });
  const login = await request(app).post('/api/jurado/login').send({ usuario: 'jurado1', password: 'claveSegura123' });
  token = login.body.token;

  const participante = await Participante.create({
    nombres: 'Ana',
    apellidos: 'Perez',
    fecha_nacimiento: new Date('2010-01-01'),
    es_estudiante: false,
  });
  await Fotografia.create({
    titulo: 'Unica foto',
    lugar: 'Lugar de prueba',
    categoria: 'natural',
    imagen_url: 'https://res.cloudinary.com/test/image/upload/foto.jpg',
    imagen_public_id: 'concurso-fotografia-chitaga/unica-foto',
    imagen_mimetype: 'image/jpeg',
    participante_id: participante._id,
  });
});

test.after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('una categoría sin fotografías no bloquea la evaluación completa (regresión)', async () => {
  const resultados = await request(app).get('/api/jurado/resultados').set('Authorization', `Bearer ${token}`);
  const foto = resultados.body.categorias.find((c) => c.clave === 'natural').resultados[0];

  await request(app)
    .put(`/api/jurado/fotografias/${foto.id}/calificacion`)
    .set('Authorization', `Bearer ${token}`)
    .send({ contenido: 4, organizacion_estetica: 4, creatividad: 4, tecnica: 4 });

  const res = await request(app).get('/api/jurado/resultados').set('Authorization', `Bearer ${token}`);

  const vacia = res.body.categorias.find((c) => c.clave === 'cultural_patrimonio');
  assert.equal(vacia.resultados.length, 0);
  assert.equal(vacia.completa, true);
  assert.equal(res.body.evaluacion_completa, true);
});

test('sin ninguna fotografía en el sistema, la evaluación no se marca completa', async () => {
  await Fotografia.deleteMany({});
  const res = await request(app).get('/api/jurado/resultados').set('Authorization', `Bearer ${token}`);
  assert.equal(res.body.evaluacion_completa, false);
});
