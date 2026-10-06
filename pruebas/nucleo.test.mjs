import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coincide, filtroDesdeParams, paramsDesdeFiltro, armarMensaje, enlaceWhatsApp, alternar, elegidosValidos } from '../js/nucleo.mjs';

const S = [
  { id: 'R01', nombre: 'Menú QR a la medida', precio: '$10 al mes', sectores: ['restaurantes'], tipos: ['web'], demo: true },
  { id: 'C08', nombre: 'Programa de clientes frecuentes', precio: 'A cotizar', sectores: ['comercio', 'restaurantes'], tipos: ['web', 'software'], demo: false },
  { id: 'T01', nombre: 'Página web', precio: 'A cotizar', sectores: ['todos'], tipos: ['web'], demo: false },
];

test('el filtro por sector encuentra también los servicios cuyo sector principal es otro', () => {
  assert.deepEqual(S.filter((s) => coincide(s, { sector: 'restaurantes' })).map((s) => s.id), ['R01', 'C08']);
});

test('los filtros se combinan', () => {
  assert.deepEqual(S.filter((s) => coincide(s, { tipo: 'web', demo: true })).map((s) => s.id), ['R01']);
  assert.deepEqual(S.filter((s) => coincide(s, { sector: 'comercio', tipo: 'software' })).map((s) => s.id), ['C08']);
  assert.equal(S.filter((s) => coincide(s, {})).length, 3);
});

test('el filtro va y vuelve por la URL', () => {
  const f = { sector: 'comercio', tipo: 'pagos', demo: true };
  assert.deepEqual(filtroDesdeParams(paramsDesdeFiltro(f)), f);
  assert.equal(paramsDesdeFiltro({ sector: '', tipo: '', demo: false }).toString(), '');
  // el filtro «Se instala en el local» se fue con los equipos (oct-2026): un enlace viejo con ?instala=1 se ignora
  assert.deepEqual(filtroDesdeParams(new URLSearchParams('instala=1&sector=salud')), { sector: 'salud', tipo: '', demo: false });
});

test('el mensaje lista los servicios en el orden elegido, con precio solo si lo hay', () => {
  const m = armarMensaje({ elegidos: ['C08', 'R01'], servicios: S, negocio: 'Fonda X', tipo: 'Restaurantes y cafés', lugar: 'David', notas: '' });
  assert.equal(m, 'Hola, alphateklab.\nNegocio: Fonda X (Restaurantes y cafés), David\n\nQuiero una cotización de:\n- Programa de clientes frecuentes (ref. C08)\n- Menú QR a la medida, $10 al mes (ref. R01)');
  const conNotas = armarMensaje({ elegidos: ['R01'], servicios: S, notas: 'algo para la cocina' });
  assert.equal(conNotas, 'Hola, alphateklab.\n\nLo que necesito: algo para la cocina\n\nServicios que me interesan:\n- Menú QR a la medida, $10 al mes (ref. R01)');
  assert.equal(armarMensaje({ elegidos: [], servicios: S, notas: 'imprimir camisetas' }), 'Hola, alphateklab.\n\nLo que necesito: imprimir camisetas');
});

test('sin servicios pide orientación y descarta ids desconocidos', () => {
  const m = armarMensaje({ elegidos: ['ZZZ'], servicios: S });
  assert.match(m, /Todavía no elegí servicios/);
  assert.doesNotMatch(m, /ZZZ/);
});

test('el enlace de WhatsApp codifica el texto y limpia el número', () => {
  assert.equal(enlaceWhatsApp('Hola & chao\n2', '+507 6000-0001'), 'https://wa.me/50760000001?text=Hola%20%26%20chao%0A2');
  assert.equal(enlaceWhatsApp('x', null), 'https://wa.me/?text=x');
});

test('alternar agrega y quita; elegidosValidos limpia lo guardado', () => {
  assert.deepEqual(alternar(['R01'], 'C08'), ['R01', 'C08']);
  assert.deepEqual(alternar(['R01', 'C08'], 'R01'), ['C08']);
  assert.deepEqual(elegidosValidos(['R01', 'R01', 'X', 3, 'T01'], S), ['R01', 'T01']);
  assert.deepEqual(elegidosValidos('basura', S), []);
});

test('si lo escrito ya empieza con «necesito», no se repite «Lo que necesito:»', () => {
  const m = armarMensaje({ elegidos: [], servicios: [], notas: 'necesito un sistema para mi gimnasio' });
  assert.match(m, /\n\nNecesito un sistema para mi gimnasio/);
  assert.doesNotMatch(m, /Lo que necesito: necesito/i);
});
