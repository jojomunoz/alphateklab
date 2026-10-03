import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { validarCatalogo, PRECIOS_DECIDIDOS } from '../js/catalogo-reglas.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const existe = (r) => existsSync(join(RAIZ, r));
const pendientes = process.env.PERMITIR_PENDIENTES === '1';

test('el catálogo cumple sus reglas', () => {
  let errores = validarCatalogo({ SECTORES, TIPOS, SERVICIOS, DEMOS }, existe);
  if (pendientes) errores = errores.filter((e) => !/no existe en el repo|falta la captura/.test(e));
  assert.deepEqual(errores, []);
});

test('solo hay precio en los servicios que decidieron los socios', () => {
  const conPrecio = SERVICIOS.filter((s) => s.precio).map((s) => [s.id, s.precio.texto]);
  assert.deepEqual(Object.fromEntries(conPrecio), PRECIOS_DECIDIDOS);
});

test('la regla de precios detecta un precio inventado', () => {
  const falso = SERVICIOS.map((s) => (s.id === 'T01' ? { ...s, precio: { texto: 'Desde $350' } } : s));
  const e = validarCatalogo({ SECTORES, TIPOS, SERVICIOS: falso }, () => true);
  assert.ok(e.some((x) => x.startsWith('T01') && /no decidido/.test(x)));
});

test('la regla de textos detecta muletillas y restos', () => {
  const falso = SERVICIOS.map((s) => (s.id === 'T01' ? { ...s, para: 'Una solución crucial para tu negocio, [Nombre de la empresa] lo tiene todo.' } : s));
  const e = validarCatalogo({ SECTORES, TIPOS, SERVICIOS: falso }, () => true);
  assert.ok(e.some((x) => x.startsWith('T01') && /crucial/.test(x)));
  assert.ok(e.some((x) => x.startsWith('T01') && /\[/.test(x)));
});

test('códigos y slugs únicos y todos los sectores con algún servicio', () => {
  assert.equal(new Set(SERVICIOS.map((s) => s.id)).size, SERVICIOS.length);
  assert.equal(new Set(SERVICIOS.map((s) => s.slug)).size, SERVICIOS.length);
  for (const sec of SECTORES) assert.ok(SERVICIOS.some((s) => s.sectores.includes(sec.id)), sec.id);
  for (const t of TIPOS) assert.ok(SERVICIOS.some((s) => s.tipos.includes(t.id)), t.id);
});

test('lo que pidió Jonathan el 3-oct está en el catálogo', () => {
  const texto = SERVICIOS.map((s) => `${s.nombre} ${s.para}`).join('\n').toLowerCase();
  for (const cosa of ['3d', 'restaurante|mesa|cocina', 'cámara', 'contador|cuenta', 'sensor', 'pantalla táctil', 'mapa de mesas', 'página web', 'automatizaciones', 'software a medida', 'apps']) {
    assert.match(texto, new RegExp(cosa), cosa);
  }
});
