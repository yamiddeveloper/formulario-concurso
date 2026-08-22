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
let tokens;
let fotoA;
let fotoB;
let fotoC;

async function crearFotografia(titulo, categoria) {
  const participante = await Participante.create({
    nombres: 'Test',
    apellidos: titulo,
    fecha_nacimiento: new Date('2010-01-01'),
    es_estudiante: false,
  });
  const fotografia = await Fotografia.create({
    titulo,
    lugar: 'Lugar de prueba',
    categoria,
    imagen_url: 'https://res.cloudinary.com/test/image/upload/foto.jpg',
    imagen_public_id: `concurso-fotografia-chitaga/${titulo}`,
    imagen_mimetype: 'image/jpeg',
    participante_id: participante._id,
  });
  return fotografia._id;
}

async function calificar(token, fotoId, valores) {
  return request(app)
    .put(`/api/jurado/fotografias/${fotoId}/calificacion`)
    .set('Authorization', `Bearer ${token}`)
    .send(valores);
}

function encontrarCategoria(body, clave) {
  return body.categorias.find((c) => c.clave === clave);
}

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = crearApp();

  const password_hash = await bcrypt.hash('claveSegura123', 12);
  await Jurado.create([
    { nombre: 'Jurado Uno', usuario: 'jurado1', password_hash, activo: true },
    { nombre: 'Jurado Dos', usuario: 'jurado2', password_hash, activo: true },
    { nombre: 'Jurado Tres', usuario: 'jurado3', password_hash, activo: true },
  ]);

  const logins = await Promise.all(
    ['jurado1', 'jurado2', 'jurado3'].map((usuario) =>
      request(app).post('/api/jurado/login').send({ usuario, password: 'claveSegura123' }),
    ),
  );
  tokens = logins.map((r) => r.body.token);

  fotoA = await crearFotografia('Foto A', 'natural');
  fotoB = await crearFotografia('Foto B', 'natural');
  fotoC = await crearFotografia('Foto C', 'cultural_patrimonio');
});

test.after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('separa los resultados por categoría y detecta cuando falta un jurado', async () => {
  await calificar(tokens[0], fotoA, { contenido: 3, organizacion_estetica: 2, creatividad: 3, tecnica: 2 }); // 10
  await calificar(tokens[1], fotoA, { contenido: 3, organizacion_estetica: 3, creatividad: 3, tecnica: 3 }); // 12
  await calificar(tokens[0], fotoB, { contenido: 4, organizacion_estetica: 4, creatividad: 4, tecnica: 4 }); // 16
  await calificar(tokens[1], fotoB, { contenido: 4, organizacion_estetica: 4, creatividad: 4, tecnica: 4 }); // 16
  await calificar(tokens[2], fotoB, { contenido: 4, organizacion_estetica: 4, creatividad: 4, tecnica: 4 }); // 16
  await calificar(tokens[0], fotoC, { contenido: 3, organizacion_estetica: 2, creatividad: 2, tecnica: 2 }); // 9
  await calificar(tokens[1], fotoC, { contenido: 3, organizacion_estetica: 2, creatividad: 2, tecnica: 2 }); // 9
  await calificar(tokens[2], fotoC, { contenido: 3, organizacion_estetica: 2, creatividad: 2, tecnica: 2 }); // 9

  const res = await request(app).get('/api/jurado/resultados').set('Authorization', `Bearer ${tokens[0]}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.jurados_totales, 3);
  assert.equal(res.body.evaluacion_completa, false);

  const natural = encontrarCategoria(res.body, 'natural');
  const cultural = encontrarCategoria(res.body, 'cultural_patrimonio');

  assert.equal(natural.completa, false);
  assert.equal(cultural.completa, true);

  const filaB = natural.resultados.find((r) => r.id === fotoB.toString());
  const filaA = natural.resultados.find((r) => r.id === fotoA.toString());
  assert.equal(filaB.completa, true);
  assert.equal(filaB.puntaje_total, 48);
  assert.equal(filaA.completa, false);
  assert.equal(filaA.puntaje_total, 22);
});

test('marca ganadores (1ro y 2do) por categoría y completa la evaluación cuando faltaba un solo jurado', async () => {
  await calificar(tokens[2], fotoA, { contenido: 2, organizacion_estetica: 2, creatividad: 2, tecnica: 2 }); // 8

  const res = await request(app).get('/api/jurado/resultados').set('Authorization', `Bearer ${tokens[0]}`);
  assert.equal(res.body.evaluacion_completa, true);

  const natural = encontrarCategoria(res.body, 'natural');
  assert.equal(natural.resultados[0].titulo, 'Foto B');
  assert.equal(natural.resultados[0].posicion, 1);
  assert.equal(natural.resultados[0].es_ganador, true);
  assert.equal(natural.resultados[1].titulo, 'Foto A');
  assert.equal(natural.resultados[1].posicion, 2);
  assert.equal(natural.resultados[1].es_ganador, true);

  const cultural = encontrarCategoria(res.body, 'cultural_patrimonio');
  assert.equal(cultural.resultados.length, 1);
  assert.equal(cultural.resultados[0].es_ganador, true);
});
