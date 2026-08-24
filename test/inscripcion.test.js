const test = require('node:test');
const assert = require('node:assert/strict');

process.env.MAX_UPLOAD_MB = '10';
// Ventana bien abierta para que estos tests no dependan de la fecha real
// en que se ejecutan (la ventana real del concurso se prueba aparte).
process.env.INSCRIPCIONES_INICIO = '2000-01-01T00:00:00-05:00';
process.env.INSCRIPCIONES_FIN = '2100-01-01T00:00:00-05:00';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const sharp = require('sharp');

const { crearApp } = require('../src/app');
const { connectDB } = require('../src/config/db');
const Participante = require('../src/models/Participante');
const Fotografia = require('../src/models/Fotografia');
const Historia = require('../src/models/Historia');
const cloudinaryClient = require('../src/services/cloudinaryClient');

let mongod;
let app;

// Evita llamadas de red reales a Cloudinary durante los tests: el punto de
// integracion se prueba contra un doble que simula la respuesta del SDK.
cloudinaryClient.subirBuffer = async (buffer, { publicId, formato }) => ({
  url: `https://res.cloudinary.com/test/image/upload/${publicId}.${formato}`,
  publicId,
});
cloudinaryClient.eliminarPorPublicId = async () => {};

async function imagenValidaBuffer() {
  return sharp({
    create: { width: 20, height: 20, channels: 3, background: { r: 255, g: 100, b: 0 } },
  })
    .jpeg()
    .toBuffer();
}

function datosValidos() {
  return {
    nombres: 'Ana Maria',
    apellidos: 'Perez Gomez',
    telefono: '3001234567',
    fecha_nacimiento: '2010-06-01',
    es_estudiante: 'true',
    institucion: 'Colegio Chitaga',
    titulo: 'Amanecer en el paramo',
    lugar: 'Paramo de Chitaga',
    categoria: 'natural',
    porque_tomo_la_foto: 'Porque el amanecer se veia impresionante ese dia.',
    que_quiere_mostrar: 'Quiero mostrar la belleza natural de mi territorio.',
    significado_del_lugar: 'Este lugar representa mis raices y mi infancia.',
  };
}

function enviarInscripcion(campos, buffer) {
  let req = request(app).post('/api/inscripciones');
  for (const [clave, valor] of Object.entries(campos)) {
    req = req.field(clave, valor);
  }
  if (buffer) {
    req = req.attach('imagen', buffer, 'foto.jpg');
  }
  return req;
}

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = crearApp();
});

test.after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test.afterEach(async () => {
  await Participante.deleteMany({});
  await Fotografia.deleteMany({});
  await Historia.deleteMany({});
});

test('crea la inscripcion completa con datos e imagen validos', async () => {
  const buffer = await imagenValidaBuffer();
  const res = await enviarInscripcion(datosValidos(), buffer);

  assert.equal(res.status, 201);
  assert.ok(res.body.inscripcion.participante_id);
  assert.ok(res.body.inscripcion.fotografia_id);
  assert.ok(res.body.inscripcion.historia_id);
  assert.match(res.body.inscripcion.imagen_url, /^https:\/\/res\.cloudinary\.com\//);

  const participantes = await Participante.find({});
  assert.equal(participantes.length, 1);
  assert.equal(participantes[0].institucion, 'Colegio Chitaga');
});

test('rechaza a un participante fuera del rango de edad', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), fecha_nacimiento: '1950-01-01' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'fecha_nacimiento'));
});

test('rechaza un telefono con muy pocos digitos', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), telefono: '123' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'telefono'));
});

test('rechaza un telefono con letras', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), telefono: '300abc4567' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'telefono'));
});

test('acepta un telefono con formato con espacios y guiones', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), telefono: '300 123-4567' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 201);
});

test('exige institucion cuando es_estudiante es true', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), institucion: '' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'institucion'));
});

test('no exige institucion cuando es_estudiante es false', async () => {
  const buffer = await imagenValidaBuffer();
  const datos = { ...datosValidos(), es_estudiante: 'false', institucion: '' };
  const res = await enviarInscripcion(datos, buffer);

  assert.equal(res.status, 201);
});

test('rechaza el envio sin imagen', async () => {
  const res = await enviarInscripcion(datosValidos(), null);

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'imagen'));
});

test('rechaza un archivo que no es una imagen real', async () => {
  const buffer = Buffer.from('esto no es una imagen');
  const res = await request(app)
    .post('/api/inscripciones')
    .field(datosValidos())
    .attach('imagen', buffer, { filename: 'foto.jpg', contentType: 'image/jpeg' });

  assert.equal(res.status, 400);
  assert.ok(res.body.detalles.some((d) => d.campo === 'imagen'));
});
