// La portada de Citas Médicas: lo publicado está al día con datos/, dice los precios decididos, no tiene enlaces ni
// imágenes rotas y sus datos estructurados se leen. Corre con: node --test pruebas/citas.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRECIOS, PRUEBA_DIAS, PREGUNTAS, PARTES, PRODUCTO, dolares, sumar } from '../datos/producto.mjs';
import { FUNCIONES } from '../datos/paginas.mjs';
import * as SITIO from '../datos/sitio.mjs';
const { CONTACTO, REGISTRO } = SITIO;

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (r) => readFileSync(join(RAIZ, r), 'utf8');
const PAGINAS = ['index.html', 'privacidad/index.html', '404.html', ...FUNCIONES.map((f) => `${f.ruta}index.html`)];
const textoVisible = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ').replace(/&[a-z#0-9]+;/g, (e) => ({ '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>' })[e] || ' ').replace(/\s+/g, ' ');

test('lo publicado está al día: generar otra vez da lo mismo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'citas-'));
  try {
    const env = { ...process.env, SALIDA: dir };
    delete env.WHATSAPP;
    delete env.CORREO;
    execFileSync(process.execPath, [join(RAIZ, 'herramientas/generar-citas.mjs')], { env, stdio: 'pipe' });
    for (const r of [...PAGINAS, 'terminos/index.html', ...(REGISTRO ? ['registro/index.html', 'entrar/index.html'] : []), 'citasmed/index.html', 'sitemap.xml', 'robots.txt']) assert.equal(readFileSync(join(dir, r), 'utf8'), leer(r), `${r}: corre node herramientas/generar-citas.mjs`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('la portada dice los precios decididos, la prueba y cada pregunta', () => {
  const t = textoVisible(leer('index.html'));
  assert.ok(t.includes(`${dolares(PRECIOS.expediente)} al mes por profesional`), 'precio del expediente');
  assert.ok(t.includes(`${dolares(PRECIOS.agenda)} al mes por clínica`), 'precio de la agenda, sin «desde»');
  assert.doesNotMatch(t, /desde \$[\d.]+ al mes por clínica/i, 'la agenda tiene un precio, no un «desde»');
  for (const m of PRECIOS.mensajes) {
    if (m.mensajes) assert.ok(t.includes(`${m.mensajes} +${dolares(m.precio)}`), `el paquete de ${m.mensajes} mensajes, aparte`);
    assert.ok(t.includes(`Total: ${dolares(sumar(PRECIOS.agenda, m.precio))} al mes`), `el total de la agenda con ${m.mensajes} mensajes`);
  }
  assert.ok(t.includes('Sin paquete'), 'la agenda sin paquete de mensajes');
  assert.ok(t.includes(`${PRUEBA_DIAS} días gratis`), 'la prueba');
  for (const p of PARTES) assert.ok(t.includes(p.nombre), p.nombre);
  for (const [q] of PREGUNTAS) assert.ok(t.includes(q), q);
  // ningún otro precio con signo de dólar que no esté en los datos: los decididos y las sumas de la agenda con su
  // paquete y del expediente por profesional (en centavos, para que 14.99 + 15 sea 29.99)
  const c = (n) => Math.round(n * 100);
  const posibles = new Set(PRECIOS.mensajes.map((m) => c(m.precio)));
  for (const a of [0, ...PRECIOS.mensajes.map((m) => c(PRECIOS.agenda) + c(m.precio))]) for (let n = 0; n <= 50; n++) posibles.add(a + n * c(PRECIOS.expediente));
  const sueltos = [...t.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => m[1]).filter((n) => !posibles.has(c(Number(n))));
  assert.deepEqual(sueltos, [], 'un precio que no sale de datos/producto.mjs');
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
  for (const r of ['index.html', 'privacidad/index.html', ...FUNCIONES.map((f) => `${f.ruta}index.html`)]) {
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
  assert.deepEqual(precios, [PRECIOS.agenda, ...PRECIOS.mensajes.filter((m) => m.mensajes).map((m) => m.precio), PRECIOS.expediente].sort((a, b) => a - b));
  assert.ok(ld['@graph'].some((n) => n['@type'] === 'FAQPage'));
});

test('«Probar gratis» lleva al registro si está en línea; si no, al formulario si hay a dónde mandarlo', () => {
  const html = leer('index.html');
  if (REGISTRO) {
    assert.equal(/data-prueba/.test(html), false);
    assert.ok((html.match(/href="(\.\/)?registro\//g) || []).length >= 4, 'cabecera, héroe, precios y la prueba van a registro/');
    assert.ok(leer('registro/index.html').includes(REGISTRO), 'registro/ pasa al servicio de cuentas');
    assert.match(leer('terminos/index.html'), /Términos del servicio/);
    return;
  }
  const hay = Boolean(CONTACTO.whatsapp || CONTACTO.correo);
  assert.equal(/data-prueba/.test(html), hay);
  if (CONTACTO.whatsapp) assert.ok(html.includes(`https://wa.me/${CONTACTO.whatsapp}`));
});

test('«Iniciar sesión» arriba (con el registro en línea) lleva a entrar/, que pasa al sistema de la clínica', () => {
  if (!REGISTRO) return;
  for (const r of ['index.html', 'privacidad/index.html', 'terminos/index.html']) {
    const html = leer(r);
    assert.match(html, /<a class="boton boton--linea cab__entrar" href="[^"]*entrar\/" data-entrar-cab><span class="cab__entrar-largo">Iniciar sesión<\/span>/, `${r}: el botón arriba`);
    assert.match(html, /<li><a href="[^"]*entrar\/">Iniciar sesión<\/a><\/li>/, `${r}: y en el menú del teléfono`);
  }
  const e = leer('entrar/index.html');
  assert.match(e, /<meta name="robots" content="noindex" \/>/);
  assert.ok(e.includes('var DOMINIO = "alphateklab.com"') && e.includes("'/entrar.html?usuario='"), 'pasa a <usuario>.alphateklab.com/entrar.html');
  assert.equal(leer('sitemap.xml').includes('entrar/'), false, 'no va en el sitemap');
});

test('/citasmed/ lleva a la portada y el sitemap tiene las páginas', () => {
  assert.match(leer('citasmed/index.html'), /http-equiv="refresh" content="0; url=\.\.\/"/);
  const s = leer('sitemap.xml');
  assert.ok(s.includes('<loc>https://alphateklab.com/</loc>') && s.includes('<loc>https://alphateklab.com/privacidad/</loc>'));
});

// ── para los buscadores ──
const cabeza = (html) => html.slice(0, html.indexOf('</head>'));
const meta = (html, re) => cabeza(html).match(re)?.[1];
const enSitemap = () => [...leer('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

test('cada página del sitemap: título y descripción únicos y a la medida de Google, canónica propia y sin noindex', () => {
  const urls = enSitemap();
  assert.ok(urls.length >= 4, 'el sitemap trae la portada, las páginas de función, términos y privacidad');
  const titulos = new Set();
  const descripciones = new Set();
  for (const u of urls) {
    const r = `${u.replace('https://alphateklab.com/', '')}index.html`;
    const html = leer(r);
    const titulo = meta(html, /<title>([^<]+)<\/title>/);
    const desc = meta(html, /<meta name="description" content="([^"]+)"/);
    assert.ok(titulo && titulo.length <= 70, `${r}: título de ${titulo?.length} caracteres`);
    assert.ok(desc && desc.length >= 50 && desc.length <= 160, `${r}: descripción de ${desc?.length} caracteres`);
    assert.ok(!titulos.has(titulo) && !descripciones.has(desc), `${r}: título o descripción repetidos`);
    titulos.add(titulo);
    descripciones.add(desc);
    assert.equal(meta(html, /<link rel="canonical" href="([^"]+)"/), u, `${r}: la canónica es ella misma`);
    assert.doesNotMatch(cabeza(html), /noindex/, `${r}: está en el sitemap y dice noindex`);
    for (const [, j] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(j);
  }
  for (const r of ['registro/index.html', 'entrar/index.html', '404.html', 'citasmed/index.html']) {
    if (existsSync(join(RAIZ, r))) assert.match(cabeza(leer(r)), /<meta name="robots" content="noindex"/, `${r}: fuera de los buscadores`);
  }
});

test('las páginas de función: en el sitemap, en el pie de todas las páginas y enlazadas desde su sección de la portada', () => {
  const urls = enSitemap();
  for (const f of FUNCIONES) {
    assert.ok(urls.includes(`https://alphateklab.com/${f.ruta}`), `${f.ruta} en el sitemap`);
    for (const r of PAGINAS) assert.match(leer(r), new RegExp(`<footer[\\s\\S]*href="[^"]*${f.ruta}"`), `${r}: el pie enlaza ${f.ruta}`);
    assert.match(leer('index.html'), new RegExp(`class="producto__mas"><a href="${f.ruta}"`), `la portada enlaza ${f.ruta} desde su sección`);
    const html = leer(`${f.ruta}index.html`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.ok(ld['@graph'].some((n) => n['@type'] === 'BreadcrumbList'), `${f.ruta}: migas`);
    const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, f.preguntas.length, `${f.ruta}: las preguntas a la vista son las del JSON-LD`);
    for (const [q] of f.preguntas) assert.ok(textoVisible(html).includes(q), `${f.ruta}: ${q}`);
  }
});

test('llms.txt, la clave de IndexNow y robots.txt', () => {
  const llms = leer('llms.txt');
  assert.match(llms, /^# /);
  for (const u of enSitemap()) assert.ok(llms.includes(`(${u})`), `llms.txt nombra ${u}`);
  assert.ok(llms.includes(dolares(PRECIOS.expediente)) && llms.includes(dolares(PRECIOS.agenda)), 'llms.txt con los precios');
  assert.doesNotMatch(llms, /salen solos|(mensajes|recordatorios|confirmaciones) automátic/i, 'llms.txt no promete mensajes que salen solos');
  const { INDEXNOW } = SITIO;
  assert.match(INDEXNOW, /^[a-f0-9]{32}$/);
  assert.equal(leer(`${INDEXNOW}.txt`), INDEXNOW);
  assert.match(leer('robots.txt'), /Sitemap: https:\/\/alphateklab\.com\/sitemap\.xml/);
});
