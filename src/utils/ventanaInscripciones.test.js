const test = require('node:test');
const assert = require('node:assert/strict');

process.env.INSCRIPCIONES_INICIO = '2026-08-24T00:00:00-05:00';
process.env.INSCRIPCIONES_FIN = '2026-08-28T16:00:00-05:00';

const { estadoInscripciones } = require('./ventanaInscripciones');

test('reporta no_iniciada antes del lunes 24 de agosto', () => {
  const res = estadoInscripciones(new Date('2026-08-23T23:59:00-05:00'));
  assert.equal(res.abierta, false);
  assert.equal(res.motivo, 'no_iniciada');
});

test('reporta abierta justo al inicio de la ventana', () => {
  const res = estadoInscripciones(new Date('2026-08-24T00:00:01-05:00'));
  assert.equal(res.abierta, true);
  assert.equal(res.motivo, null);
});

test('reporta abierta un momento antes del cierre', () => {
  const res = estadoInscripciones(new Date('2026-08-28T15:59:59-05:00'));
  assert.equal(res.abierta, true);
});

test('reporta cerrada justo después de las 4:00 PM del viernes 28', () => {
  const res = estadoInscripciones(new Date('2026-08-28T16:00:01-05:00'));
  assert.equal(res.abierta, false);
  assert.equal(res.motivo, 'cerrada');
});
