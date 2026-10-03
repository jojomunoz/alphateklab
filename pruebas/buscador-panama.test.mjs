// El buscador con el índice completo del sitio (frases de situación, panameñismos y relleno): las reglas generales que
// se agregaron el 3-oct-2026, cada una con un caso que no sale de la batería de control.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { PALABRAS, PALABRAS_NEGOCIO, EQUIVALENCIAS, VACIAS } from '../datos/busqueda.mjs';
import { SITUACIONES } from '../datos/situaciones.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { GUIAS } from '../datos/guias.mjs';
import { FICHAS } from '../datos/fichas.mjs';
import { construirIndice } from '../js/indice.mjs';
import { prepararIndice, buscar } from '../js/buscador.mjs';

const indice = prepararIndice(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS, PALABRAS_NEGOCIO, GUIAS, FICHAS, SITUACIONES, EQUIVALENCIAS, VACIAS }));
const ids = (q, o) => buscar(indice, q, o).map((r) => r.id).join(',');

test('cada servicio tiene frases de situación y ninguna repite el nombre del servicio tal cual', () => {
  for (const s of SERVICIOS) {
    assert.ok((SITUACIONES[s.id] || []).length >= 8, `${s.id} tiene pocas frases`);
    for (const f of SITUACIONES[s.id]) assert.notEqual(f.trim().toLowerCase(), s.nombre.toLowerCase(), `${s.id}: «${f}»`);
  }
});

test('cómo se escribe en el chat vale lo mismo que la palabra del catálogo', () => {
  assert.equal(ids('pedidos por wasap'), ids('pedidos por whatsapp'));
  assert.ok(ids('pedidos por wasap').length > 0);
});

test('el diccionario no cambia palabras que el índice ya usa', () => {
  assert.ok(indice.equivalencias, 'no se cargaron equivalencias');
  for (const palabra of ['router', 'stock', 'ach', 'dvr']) assert.equal(indice.equivalencias.mapa.has(palabra), false, palabra);
});

test('una frase sobre algo que no hacemos no trae resultados, pero sí «lo más parecido» si algo se acerca', () => {
  assert.equal(ids('imprimir camisetas para mi equipo', { prefijo: true }), '');
  assert.ok(buscar(indice, 'imprimir camisetas para mi equipo', { minimo: 3 }).length >= ids('imprimir camisetas para mi equipo').split(',').filter(Boolean).length);
});
