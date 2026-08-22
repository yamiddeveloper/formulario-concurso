const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularEdad, edadEsValida, EDAD_MINIMA, EDAD_MAXIMA } = require('./edad');

test('calcularEdad: cumpleanos ya pasado este ano', () => {
  const referencia = new Date('2026-08-21');
  assert.equal(calcularEdad('2010-01-15', referencia), 16);
});

test('calcularEdad: cumpleanos aun no llega este ano', () => {
  const referencia = new Date('2026-08-21');
  assert.equal(calcularEdad('2010-12-15', referencia), 15);
});

test('calcularEdad: cumpleanos es hoy', () => {
  const referencia = new Date('2026-08-21');
  assert.equal(calcularEdad('2012-08-21', referencia), 14);
});

test('edadEsValida: acepta el limite inferior', () => {
  assert.equal(edadEsValida(EDAD_MINIMA), true);
});

test('edadEsValida: acepta el limite superior', () => {
  assert.equal(edadEsValida(EDAD_MAXIMA), true);
});

test('edadEsValida: rechaza por debajo del minimo', () => {
  assert.equal(edadEsValida(EDAD_MINIMA - 1), false);
});

test('edadEsValida: rechaza por encima del maximo', () => {
  assert.equal(edadEsValida(EDAD_MAXIMA + 1), false);
});
