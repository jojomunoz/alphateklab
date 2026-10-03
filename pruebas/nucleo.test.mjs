import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coincide, filtroDesdeParams, paramsDesdeFiltro, armarMensaje, enlaceWhatsApp, alternar, elegidosValidos } from '../js/nucleo.mjs';

const S = [
  { id: 'R01', nombre: 'Menú QR a la medida', precio: '$10 al mes', sectores: ['restaurantes'], tipos: ['web'], demo: true, instala: false },
  { id: 'C01', nombre: 'Contador de personas en la entrada', precio: 'A cotizar', sectores: ['comercio', 'restaurantes'], tipos: ['vision', 'iot'], demo: true, instala: true },
  { id: 'T01', nombre: 'Página web', precio: 'A cotizar', sectores: ['todos'], tipos: ['web'], demo: false, instala: false },
];

test('el filtro por sector encuentra también los servicios cuyo sector principal es otro', () => {
  assert.deepEqual(S.filter((s) => coincide(s, { sector: 'restaurantes' })).map((s) => s.id), ['R01', 'C01']);
});

test('los filtros se combinan', () => {
  assert.deepEqual(S.filter((s) => coincide(s, { tipo: 'web', demo: true })).map((s) => s.id), ['R01']);
  assert.deepEqual(S.filter((s) => coincide(s, { instala: true })).map((s) => s.id), ['C01']);
  assert.equal(S.filter((s) => coincide(s, {})).length, 3);
});

test('el filtro va y vuelve por la URL', () => {
  const f = { sector: 'comercio', tipo: 'vision', demo: true, instala: false };
  assert.deepEqual(filtroDesdeParams(paramsDesdeFiltro(f)), f);
  assert.equal(paramsDesdeFiltro({ sector: '', tipo: '', demo: false, instala: false }).toString(), '');
});

test('el mensaje lista los servicios en el orden elegido, con precio solo si lo hay', () => {
  const m = armarMensaje({ elegidos: ['C01', 'R01'], servicios: S, negocio: 'Fonda X', tipo: 'Restaurantes y cafés', lugar: 'David', notas: '' });
  assert.equal(m, 'Hola, alphateklab.\nNegocio: Fonda X (Restaurantes y cafés), David\n\nQuiero una cotización de:\n- C01 Contador de personas en la entrada\n- R01 Menú QR a la medida ($10 al mes)');
  const conNotas = armarMensaje({ elegidos: ['R01'], servicios: S, notas: 'algo para la cocina' });
  assert.equal(conNotas, 'Hola, alphateklab.\n\nLo que necesito: algo para la cocina\n\nServicios que me interesan:\n- R01 Menú QR a la medida ($10 al mes)');
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
  assert.deepEqual(alternar(['R01'], 'C01'), ['R01', 'C01']);
  assert.deepEqual(alternar(['R01', 'C01'], 'R01'), ['C01']);
  assert.deepEqual(elegidosValidos(['R01', 'R01', 'X', 3, 'T01'], S), ['R01', 'T01']);
  assert.deepEqual(elegidosValidos('basura', S), []);
});
