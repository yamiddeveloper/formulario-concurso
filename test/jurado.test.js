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
const Historia = require('../src/models/Historia');
const Calificacion = require('../src/models/Calificacion');

let mongod;
let app;
let fotografiaId;
let token;

async function crearInscripcionDePrueba() {
  const participante = await Participante.create({
    nombres: 'Ana',
    apellidos: 'Perez',
    fecha_nacimiento: new Date('2010-06-01'),
    es_estudiante: false,
  });
  const fotografia = await Fotografia.create({
    titulo: 'Amanecer en el paramo',
    lugar: 'Paramo de Chitaga',
    categoria: 'natural',
    imagen_url: 'https://res.cloudinary.com/test/image/upload/foto.jpg',
    imagen_public_id: 'concurso-fotografia-chitaga/foto-test',
    imagen_mimetype: 'image/jpeg',
    participante_id: participante._id,
  });
  await Historia.create({
    porque_tomo_la_foto: 'Porque el amanecer se veia impresionante ese dia.',
    que_quiere_mostrar: 'Quiero mostrar la belleza natural de mi territorio.',
    significado_del_lugar: 'Este lugar representa mis raices y mi infancia.',
    fotografia_id: fotografia._id,
  });
  return fotografia._id;
}

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = crearApp();

  const password_hash = await bcrypt.hash('claveSegura123', 12);
  await Jurado.create({ nombre: 'Juan Fotografo', usuario: 'juan', password_hash, activo: true });

  fotografiaId = await crearInscripcionDePrueba();
});

test.after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('rechaza login con contraseña incorrecta', async () => {
  const res = await request(app).post('/api/jurado/login').send({ usuario: 'juan', password: 'incorrecta' });
  assert.equal(res.status, 401);
});

test('rechaza login con usuario inexistente', async () => {
  const res = await request(app).post('/api/jurado/login').send({ usuario: 'noexiste', password: 'claveSegura123' });
  assert.equal(res.status, 401);
});

test('acepta login con credenciales correctas y devuelve token', async () => {
  const res = await request(app).post('/api/jurado/login').send({ usuario: 'juan', password: 'claveSegura123' });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.equal(res.body.jurado.nombre, 'Juan Fotografo');
  token = res.body.token;
});

test('rechaza acceso a rutas protegidas sin token', async () => {
  const res = await request(app).get('/api/jurado/fotografias');
  assert.equal(res.status, 401);
});

test('rechaza token inválido', async () => {
  const res = await request(app).get('/api/jurado/fotografias').set('Authorization', 'Bearer token-invalido');
  assert.equal(res.status, 401);
});

test('lista fotografías con participante y sin calificación previa', async () => {
  const res = await request(app).get('/api/jurado/fotografias').set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.fotografias.length, 1);
  const foto = res.body.fotografias[0];
  assert.equal(foto.titulo, 'Amanecer en el paramo');
  assert.equal(foto.participante.nombres, 'Ana');
  assert.equal(foto.mi_calificacion, null);
});

test('obtiene el detalle de una fotografía con su historia', async () => {
  const res = await request(app)
    .get(`/api/jurado/fotografias/${fotografiaId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.fotografia.historia.significado_del_lugar, 'Este lugar representa mis raices y mi infancia.');
});

test('rechaza una calificación fuera de rango', async () => {
  const res = await request(app)
    .put(`/api/jurado/fotografias/${fotografiaId}/calificacion`)
    .set('Authorization', `Bearer ${token}`)
    .send({ contenido: 5, organizacion_estetica: 3, creatividad: 2, tecnica: 4 });
  assert.equal(res.status, 400);
});

test('guarda y luego actualiza la calificación (upsert)', async () => {
  const primera = await request(app)
    .put(`/api/jurado/fotografias/${fotografiaId}/calificacion`)
    .set('Authorization', `Bearer ${token}`)
    .send({ contenido: 3, organizacion_estetica: 3, creatividad: 3, tecnica: 3 });
  assert.equal(primera.status, 200);
  assert.equal(primera.body.mi_calificacion.total, 12);

  const segunda = await request(app)
    .put(`/api/jurado/fotografias/${fotografiaId}/calificacion`)
    .set('Authorization', `Bearer ${token}`)
    .send({ contenido: 4, organizacion_estetica: 4, creatividad: 4, tecnica: 4 });
  assert.equal(segunda.status, 200);
  assert.equal(segunda.body.mi_calificacion.total, 16);

  const total = await Calificacion.countDocuments({ fotografia_id: fotografiaId });
  assert.equal(total, 1);
});

test('elimina la calificación guardada', async () => {
  const antes = await Calificacion.countDocuments({ fotografia_id: fotografiaId });
  assert.equal(antes, 1);

  const res = await request(app)
    .delete(`/api/jurado/fotografias/${fotografiaId}/calificacion`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 200);

  const despues = await Calificacion.countDocuments({ fotografia_id: fotografiaId });
  assert.equal(despues, 0);

  const detalle = await request(app)
    .get(`/api/jurado/fotografias/${fotografiaId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(detalle.body.fotografia.mi_calificacion, null);
});

test('eliminar una calificación inexistente no falla', async () => {
  const res = await request(app)
    .delete(`/api/jurado/fotografias/${fotografiaId}/calificacion`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 200);
});
