// La portada de Citas Médicas: lo publicado está al día con datos/, dice los precios decididos, no tiene enlaces ni
// imágenes rotas y sus datos estructurados se leen. Corre con: node --test pruebas/citas.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRECIOS, PRUEBA_DIAS, PREGUNTAS, PARTES, PRODUCTO } from '../datos/producto.mjs';
import { CONTACTO, REGISTRO } from '../datos/sitio.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (r) => readFileSync(join(RAIZ, r), 'utf8');
const PAGINAS = ['index.html', 'privacidad/index.html', '404.html'];
const textoVisible = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/&[a-z#0-9]+;/g, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' })[e] || ' ').replace(/\s+/g, ' ');

test('lo publicado está al día: generar otra vez da lo mismo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'citas-'));
  try {
    const env = { ...process.env, SALIDA: dir };
    delete env.WHATSAPP;
    delete env.CORREO;
    execFileSync(process.execPath, [join(RAIZ, 'herramientas/generar-citas.mjs')], { env, stdio: 'pipe' });
    for (const r of [...PAGINAS, 'terminos/index.html', 'citasmed/index.html', 'sitemap.xml', 'robots.txt']) assert.equal(readFileSync(join(dir, r), 'utf8'), leer(r), `${r}: corre node herramientas/generar-citas.mjs`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('la portada dice los precios decididos, la prueba y cada pregunta', () => {
  const t = textoVisible(leer('index.html'));
  assert.ok(t.includes(`$${PRECIOS.expediente}`), 'precio del expediente');
  for (const a of PRECIOS.agenda) assert.ok(t.includes(`$${a.precio}`) && t.includes(String(a.mensajes)), `agenda con ${a.mensajes} mensajes`);
  assert.ok(t.includes(`${PRUEBA_DIAS} días gratis`), 'la prueba');
  for (const p of PARTES) assert.ok(t.includes(p.nombre), p.nombre);
  for (const [q] of PREGUNTAS) assert.ok(t.includes(q), q);
  // ningún otro precio con signo de dólar que no esté en los datos
  const decididos = new Set([PRECIOS.expediente, ...PRECIOS.agenda.map((a) => a.precio)]);
  const sueltos = [...t.matchAll(/\$(\d+)/g)].map((m) => Number(m[1])).filter((n) => !decididos.has(n));
  // los totales de ejemplo de la calculadora salen de sumar precios decididos: solo se aceptan esos
  const posibles = new Set();
  for (const a of [0, ...PRECIOS.agenda.map((x) => x.precio)]) for (let n = 0; n <= 50; n++) posibles.add(a + n * PRECIOS.expediente);
  assert.deepEqual(sueltos.filter((n) => !posibles.has(n)), [], 'un precio que no sale de datos/producto.mjs');
});

test('sin códigos internos ni textos de la agencia a la vista', () => {
  for (const r of PAGINAS) {
    const t = textoVisible(leer(r));
    assert.doesNotMatch(t, /\b[RSTHCE]\d{2}\b/, `${r}: código interno`);
    assert.doesNotMatch(t, /cotiza|Agregar a mi lista|Soluciones por negocio/i, `${r}: texto del sitio de la agencia`);
  }
});

test('un solo H1 por página y el título de la portada nombra el producto', () => {
  for (const r of PAGINAS) assert.equal((leer(r).match(/<h1[\s>]/g) || []).length, 1, r);
  assert.match(leer('index.html'), new RegExp(`<title>${PRODUCTO}`));
});

test('nada roto: cada archivo enlazado existe y cada ancla tiene a dónde ir', () => {
  for (const r of ['index.html', 'privacidad/index.html']) {
    const html = leer(r);
    const base = dirname(join(RAIZ, r));
    const rutas = [...html.matchAll(/(?:src|href)="([^"]+)"/g), ...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(' ')[0]));
    for (const u of rutas) {
      if (/^(https?:|mailto:|data:|#)/.test(u) || !u) continue;
      const limpia = u.split('#')[0].split('?')[0];
      const destino = normalize(join(base, limpia));
      assert.ok(existsSync(destino) && (!limpia.endsWith('/') || existsSync(join(destino, 'index.html'))), `${r}: ${u}`);
    }
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, a] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(a), `${r}: #${a} no existe`);
  }
});

test('cada imagen tiene texto alternativo y medidas', () => {
  for (const r of PAGINAS) {
    for (const [img] of leer(r).matchAll(/<img\b[^>]*>/g)) {
      assert.match(img, /\salt="/, `${r}: ${img.slice(0, 80)}`);
      assert.match(img, /\swidth="\d+"/, `${r}: sin ancho`);
      assert.match(img, /\sheight="\d+"/, `${r}: sin alto`);
    }
  }
});

test('los datos estructurados se leen y llevan los precios', () => {
  const m = leer('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, 'sin JSON-LD');
  const ld = JSON.parse(m[1]);
  const app = ld['@graph'].find((n) => n['@type'] === 'SoftwareApplication');
  assert.ok(app, 'sin SoftwareApplication');
  const precios = app.offers.map((o) => o.price).sort((a, b) => a - b);
  assert.deepEqual(precios, [...PRECIOS.agenda.map((a) => a.precio), PRECIOS.expediente].sort((a, b) => a - b));
  assert.ok(ld['@graph'].some((n) => n['@type'] === 'FAQPage'));
});

test('«Probar gratis» lleva al registro si está en línea; si no, al formulario si hay a dónde mandarlo', () => {
  const html = leer('index.html');
  if (REGISTRO) {
    assert.equal(/data-prueba/.test(html), false);
    assert.ok((html.match(new RegExp(REGISTRO.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'), 'g')) || []).length >= 4, 'cabecera, héroe, precios y la prueba');
    assert.match(leer('terminos/index.html'), /Términos del servicio/);
    return;
  }
  const hay = Boolean(CONTACTO.whatsapp || CONTACTO.correo);
  assert.equal(/data-prueba/.test(html), hay);
  if (CONTACTO.whatsapp) assert.ok(html.includes(`https://wa.me/${CONTACTO.whatsapp}`));
});

test('/citasmed/ lleva a la portada y el sitemap tiene las páginas', () => {
  assert.match(leer('citasmed/index.html'), /http-equiv="refresh" content="0; url=\.\.\/"/);
  const s = leer('sitemap.xml');
  assert.ok(s.includes('<loc>https://alphateklab.com/</loc>') && s.includes('<loc>https://alphateklab.com/privacidad/</loc>'));
});
