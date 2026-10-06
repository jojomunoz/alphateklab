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

// Lo que pidió Jonathan el 3-oct, sin los equipos (el 3D de propiedades, las cámaras, el contador, los sensores y la
// pantalla táctil se fueron con el paso a solo software, oct-2026).
test('lo que pidió Jonathan el 3-oct que es software sigue en el catálogo', () => {
  const texto = SERVICIOS.map((s) => `${s.nombre} ${s.para}`).join('\n').toLowerCase();
  for (const cosa of ['restaurante|mesa|cocina', 'mapa de mesas', 'página web', 'automatizaciones', 'software a medida', 'apps', 'whatsapp', 'factura electrónica', 'yappy']) {
    assert.match(texto, new RegExp(cosa), cosa);
  }
});

test('solo software: nada se instala, nadie va a la propiedad y no hay tipos ni textos de equipos', () => {
  assert.deepEqual(SERVICIOS.filter((s) => s.instala || s.visita || s.equipo.length).map((s) => s.id), []);
  assert.deepEqual(TIPOS.map((t) => t.id), ['software', 'web', 'ia', 'pagos']);
  assert.ok(!SECTORES.some((s) => s.id === 'operacion'), 'el sector de bodegas e industria se juntó con «Cualquier negocio»');
  const texto = SERVICIOS.map((s) => [s.nombre, s.corto, s.para, ...s.incluye].join(' ')).join('\n').toLowerCase();
  for (const cosa of ['instalamos', 'sensor', 'cerradura', 'dron', 'gps', 'nfc', 'rfid', 'kiosco', 'cámaras? de seguridad', 'recorrido 3d', 'fotos profesionales', 'soporte técnico', 'wi-?fi']) {
    assert.doesNotMatch(texto, new RegExp(cosa), cosa);
  }
});

test('la regla de solo software detecta un servicio que se instala, que va a la propiedad o que lista equipo', () => {
  const falso = SERVICIOS.map((s) => (s.id === 'R05' ? { ...s, instala: true, equipo: ['Pantalla con soporte de pared'] } : s.id === 'B05' ? { ...s, visita: true } : s));
  const e = validarCatalogo({ SECTORES, TIPOS, SERVICIOS: falso }, () => true);
  assert.ok(e.some((x) => x.startsWith('R05') && /se instala/.test(x)));
  assert.ok(e.some((x) => x.startsWith('R05') && /lista equipo/.test(x)));
  assert.ok(e.some((x) => x.startsWith('B05') && /propiedad/.test(x)));
});
