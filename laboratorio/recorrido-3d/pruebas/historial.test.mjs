import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearHistorial } from '../js/nucleo/historial.mjs';

const A = { n: 'A' }, B = { n: 'B' }, C = { n: 'C' };

test('enfocar un nombre y salir sin escribir no deja nada que deshacer', () => {
  const h = crearHistorial();
  h.preparar(A);
  assert.equal(h.largo, 0, 'enfocar no registra nada');
  assert.equal(h.hay(A), false);
  assert.equal(h.deshacer(A), null);
});

test('escribir un nombre es un solo paso, registrado con la primera letra', () => {
  const h = crearHistorial();
  h.preparar(A);
  h.alEscribir();
  h.alEscribir();
  h.alEscribir();
  assert.equal(h.largo, 1);
  assert.equal(h.deshacer(B), A);
  assert.equal(h.deshacer(A), null);
});

test('deshacer se salta los estados iguales al actual (quitar un ambiente y deshacer lo devuelve a la primera)', () => {
  const h = crearHistorial();
  h.registrar(A);           // antes de quitar el balcón
  h.preparar(B);            // el foco cae en otro nombre: no registra nada
  assert.equal(h.deshacer(B), A);
  // Y si la pila trae copias iguales al estado actual (con otra referencia), las salta.
  h.registrar(A);
  h.registrar({ n: 'B' });
  assert.equal(h.hay({ n: 'B' }), true);
  assert.deepEqual(h.deshacer({ n: 'B' }), A);
});

test('dos registros iguales seguidos cuentan una vez; el tope descarta lo más viejo', () => {
  const h = crearHistorial({ maximo: 2 });
  h.registrar(A);
  h.registrar({ n: 'A' });
  assert.equal(h.largo, 1);
  h.registrar(B);
  h.registrar(C);
  assert.equal(h.largo, 2);
  assert.equal(h.deshacer({ n: 'D' }), C);
  assert.equal(h.deshacer(C), B);
  assert.equal(h.deshacer(B), null);
});

test('vaciar olvida la pila y lo que estaba por registrarse', () => {
  const h = crearHistorial();
  h.registrar(A);
  h.preparar(B);
  h.vaciar();
  h.alEscribir();
  assert.equal(h.largo, 0);
  assert.equal(h.hay(C), false);
});
