import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bloques, rellenar, RELACIONADOS } from '../herramientas/generar.mjs';

const DEMO = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(DEMO, 'index.html'), 'utf8');
const bloque = (texto, clave) => texto.match(new RegExp(`<!-- gen:${clave} -->([\\s\\S]*?)<!-- /gen:${clave} -->`))?.[1];

test('el plano, la tabla, el resumen y los datos del HTML están al día con plano.json', async () => {
  const esperado = rellenar(html, await bloques());
  for (const clave of ['plano', 'tabla', 'resumen', 'datos']) {
    assert.equal(bloque(html, clave), bloque(esperado, clave), `bloque gen:${clave} desactualizado: corre node herramientas/generar.mjs`);
  }
});

test('los datos incrustados son exactamente plano.json', () => {
  const incrustado = JSON.parse(html.match(/<script type="application\/json" id="datos-plano">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(incrustado, JSON.parse(readFileSync(join(DEMO, 'plano.json'), 'utf8')));
});

test('los servicios relacionados existen en el catálogo y enlazan a su ficha de la portada', async () => {
  const { SERVICIOS } = await import('../../../datos/catalogo.mjs');
  // el visitante no ve códigos internos (regla del sitio, 3-oct): el servicio se reconoce por el enlace a su ficha
  const zona = bloque(html, 'servicios');
  assert.doesNotMatch(zona, />[A-Z]\d\d</, 'se ve un código interno');
  const slugs = [...zona.matchAll(/<a href="\.\.\/\.\.\/servicios\/([\w-]+)\/">/g)].map((m) => m[1]);
  assert.ok(slugs.length >= 4, 'faltan servicios relacionados');
  for (const slug of slugs) {
    const s = SERVICIOS.find((x) => x.slug === slug);
    assert.ok(s, `${slug} no está en el catálogo`);
    assert.ok(RELACIONADOS.includes(s.id), `${s.id} no está entre los relacionados`);
  }
  assert.match(html, /href="\.\.\/\.\.\/cotizar\/\?servicio=B01"/);
});

test('cada campo tiene su etiqueta y cada botón su tipo', () => {
  const ids = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    const conFor = new RegExp(`<label[^>]*for="${id}"`).test(html);
    assert.ok(conFor, `el campo #${id} no tiene <label for>`);
  }
  for (const [b] of html.matchAll(/<button\b[^>]*>/g)) assert.match(b, /type="(button|submit)"/, b);
  // Los radios de herramientas van dentro de su <label>
  assert.equal((html.match(/<label class="herramientas__opcion"><input type="radio"/g) || []).length, 4);
});

test('rutas relativas que existen; nada apunta a la raíz del dominio', () => {
  assert.ok(!/(?:href|src|srcset)="\/(?!\/)/.test(html), 'hay una ruta absoluta (/…): en GitHub Pages el sitio vive en /alphateklab/');
  const rutas = [...html.matchAll(/(?:href|src|srcset)="((?:\.\.\/|img\/|js\/|demo\.css)[^"#?]*)/g)].map((m) => m[1]).filter((r) => !r.endsWith('/'));
  assert.ok(rutas.length >= 8);
  for (const r of rutas) assert.ok(existsSync(join(DEMO, r)), `no existe ${r}`);
  // Las fuentes que pide atk.css existen junto a él
  const css = readFileSync(join(DEMO, '../../assets/atk.css'), 'utf8');
  for (const [, f] of css.matchAll(/url\("([^"]+\.woff2)"\)/g)) assert.ok(existsSync(join(DEMO, '../../assets', f)), `atk.css pide ${f} y no existe`);
});

test('la página dice que el modelo es de ejemplo y no un escaneo, y tiene el aviso de demo', () => {
  assert.match(html, /modelo de ejemplo dibujado a partir de un plano, no un escaneo/);
  assert.match(html, /class="aviso-demo aviso-demo--pagina"/);
  assert.match(html, /<title>Recorrido 3D · alphateklab<\/title>/);
  assert.match(html, /<link rel="icon" href="\.\.\/\.\.\/assets\/marca\/favicon\.svg"/);
});

test('three.js se pide en la versión fijada por el brief', () => {
  const js = readFileSync(join(DEMO, 'js', 'recorrido.mjs'), 'utf8');
  assert.match(js, /https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.170\.0\/build\/three\.module\.min\.js/);
});

test('«cómo se hace» no promete de más: dos rutas, sin el 31 % de Matterport y con fuente en cada precio o cifra externa', () => {
  const como = html.match(/<section aria-labelledby="h-como">([\s\S]*?)<\/section>/)[1];
  assert.doesNotMatch(html, /31\s?%/, 'la cifra del 31 % la publica Matterport; no se cita');
  assert.doesNotMatch(html, /vende(?:s|rá)? más (?:caro|rápido)/i);
  // Cada precio en dólares, cada cifra en MB y el tamaño del estudio van dentro del enlace a su fuente.
  const fuera = como.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, '');
  assert.doesNotMatch(fuera, /\$\d|\d\s?MB|\d[\d.,]*\s+ventas/, 'hay una cifra sin su fuente');
  assert.match(como, /\$549\.99/);
  // Cifras como en Panamá: coma de miles («75,178»); «75.178» se lee como 75 con decimales.
  assert.doesNotMatch(html, /\d{1,3}\.\d{3}(?!\d)\s+ventas/);
  // La cámara 360 da fotos esféricas que no se caminan ni se miden; caminar y medir sale del escaneo.
  assert.match(como, /cámara 360[\s\S]*no camina ni mide/);
  assert.match(como, /href="\.\.\/recorrido-360\/"/);
  assert.match(html, /se arman con el plano que sale del escaneo \(servicio B03\)/);
  // Sin formato de chatbot: ningún párrafo de «cómo se hace» empieza con un rótulo en negrita.
  assert.doesNotMatch(como, /info__dato|<strong>/);
});

test('sin JavaScript no se ven las instrucciones de un recorrido que no se puede abrir', () => {
  const regla = html.match(/<noscript><style>([^<]*)<\/style><\/noscript>/)[1];
  for (const sel of ['.pestanas', '.visor__entrada', '.ayuda']) assert.ok(regla.includes(sel), `${sel} no se esconde sin JavaScript`);
});

test('los campos de metros aceptan la coma: son de texto con teclado decimal, no type="number"', () => {
  assert.doesNotMatch(html, /type="number"/, 'un type="number" se traga la coma: «2,5» llega como 25');
  for (const id of ['fa-x', 'fa-y', 'fa-ancho', 'fa-largo', 'fp-pos']) assert.match(html, new RegExp(`id="${id}"[^>]*inputmode="decimal"`));
});
