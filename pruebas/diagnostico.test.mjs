import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { SERVICIOS } from '../datos/catalogo.mjs';
import { recomendar, mensajeDiagnostico, estadoDesdeParams, paramsDesdeEstado, YA_TENGO } from '../js/diagnostico-nucleo.mjs';

const restaurante = SOLUCIONES.find((s) => s.slug === 'restaurantes');

test('recomienda los servicios de los problemas marcados, la respuesta principal primero', () => {
  // «Esperan para pedir, para otra ronda y para pagar»: lo que lo resuelve es pedir y pagar desde la mesa (R02);
  // el menú QR solo muestra la carta, por eso va último (auditoría del 3-oct).
  const r = recomendar(restaurante, [0]);
  assert.equal(r[0].id, 'R02');
  assert.deepEqual(r.map((x) => x.id), ['R02', 'R03', 'R01']);
  assert.ok(r.every((x) => x.motivos.length === 1));
});

test('un servicio que resuelve dos problemas aparece una vez con los dos motivos', () => {
  const clinica = SOLUCIONES.find((s) => s.slug === 'clinicas');
  const r = recomendar(clinica, [0, 1]);
  const s01 = r.filter((x) => x.id === 'S01');
  assert.equal(s01.length, 1);
  assert.equal(s01[0].motivos.length, 2);
  assert.equal(r[0].id, 'S01');
});

test('lo que ya tienes se quita de la recomendación', () => {
  const r = recomendar(restaurante, [2], ['caja', 'factura']);
  assert.deepEqual(r.map((x) => x.id), ['R04']);
});

test('índices inválidos o repetidos no rompen nada', () => {
  assert.deepEqual(recomendar(restaurante, [99, -1, 'x']), []);
  assert.equal(recomendar(restaurante, [1, 1]).length, recomendar(restaurante, [1]).length);
  assert.deepEqual(recomendar(null, [0]), []);
});

test('todo lo que puede recomendar existe en el catálogo', () => {
  const ids = new Set(SERVICIOS.map((s) => s.id));
  for (const so of SOLUCIONES) for (const r of recomendar(so, so.problemas.map((_, i) => i))) assert.ok(ids.has(r.id), r.id);
  for (const y of YA_TENGO) for (const id of y.quita) assert.ok(ids.has(id), id);
});

test('el mensaje lleva negocio, problemas, lo extra y la recomendación', () => {
  const m = mensajeDiagnostico({ negocio: 'Restaurantes y cafés', problemas: ['Los clientes esperan.'], servicios: [{ id: 'R01', nombre: 'Menú QR a la medida' }], otro: 'tengo 12 mesas' });
  assert.equal(m, 'Hola, alphateklab. Hice el diagnóstico en su página.\nMi negocio: Restaurantes y cafés.\n\nLo que quiero resolver:\n- Los clientes esperan.\n\nAdemás: tengo 12 mesas\n\nMe recomendó:\n- Menú QR a la medida (ref. R01)');
});

test('el estado va y vuelve por la URL', () => {
  const e = { negocio: 'clinicas', problemas: [0, 2], tengo: ['web'] };
  assert.deepEqual(estadoDesdeParams(paramsDesdeEstado(e)), e);
  assert.deepEqual(estadoDesdeParams(new URLSearchParams('p=a,1')), { negocio: '', problemas: [1], tengo: [] });
});

test('lo que ya tiene cada negocio quita su servicio: un restaurante con pantalla de cocina no recibe R05', () => {
  const r = recomendar(restaurante, [1], ['pantalla-cocina']);
  assert.ok(!r.some((x) => x.id === 'R05'));
  assert.ok(recomendar(restaurante, [1]).some((x) => x.id === 'R05'));
});
