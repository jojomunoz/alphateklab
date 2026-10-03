// La página contra los datos: enlaces al catálogo, cifras que dice el texto, rutas y librerías.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICIOS } from '../../../datos/catalogo.mjs';
import { SENSORES } from '../js/nucleo/sensores.mjs';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (r) => readFileSync(join(raiz, r), 'utf8');
const index = leer('index.html');
const telefono = leer('telefono.html');
const modulos = [
  ...readdirSync(join(raiz, 'js')).filter((f) => f.endsWith('.mjs')).map((f) => `js/${f}`),
  ...readdirSync(join(raiz, 'js/nucleo')).map((f) => `js/nucleo/${f}`),
];
const porSlug = new Map(SERVICIOS.map((s) => [s.slug, s]));

// Cada href relativo tiene que llevar a un archivo que existe en el sitio (como lo serviría GitHub Pages:
// una carpeta sirve su index.html) y, si lleva #ancla, a un id que exista en ese archivo.
const raizSitio = resolve(raiz, '../..');
function destino(desdeArchivo, href) {
  const [sinAncla, ancla] = href.split('#');
  const ruta = sinAncla.split('?')[0];
  let archivo = ruta === '' ? desdeArchivo : resolve(dirname(desdeArchivo), ruta);
  if (ruta.endsWith('/') || (existsSync(archivo) && statSync(archivo).isDirectory())) archivo = join(archivo, 'index.html');
  return { archivo, ancla };
}
function enlacesRelativos(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]).filter((h) => !/^(https?:|mailto:|tel:)/.test(h));
}

test('cada enlace relativo de las dos páginas lleva a un archivo que existe y a un ancla que existe', () => {
  for (const [nombre, html] of [['index.html', index], ['telefono.html', telefono]]) {
    const enlaces = enlacesRelativos(html);
    assert.ok(enlaces.length >= (nombre === 'index.html' ? 15 : 2), `${nombre}: ${enlaces.length} enlaces`);
    for (const href of enlaces) {
      const { archivo, ancla } = destino(join(raiz, nombre), href);
      assert.ok(archivo.startsWith(raizSitio), `${nombre}: ${href} sale del sitio`);
      assert.ok(existsSync(archivo), `${nombre}: ${href} → no existe ${archivo.slice(raizSitio.length)}`);
      if (ancla) {
        const otro = archivo === join(raiz, nombre) ? html : readFileSync(archivo, 'utf8');
        assert.ok(new RegExp(`id="${ancla}"`).test(otro), `${nombre}: ${href} → no hay id="${ancla}" en ${archivo.slice(raizSitio.length)}`);
      }
    }
  }
});

// El visitante no ve códigos internos (regla del sitio, 3-oct): cada enlace lleva el nombre del servicio, sin I01/R10.
test('cada servicio relacionado lleva a su ficha del catálogo con su nombre y sin código, y el botón al cotizador con I01', () => {
  const enlaces = [...index.matchAll(/<a href="\.\.\/\.\.\/servicios\/([a-z0-9-]+)\/">(.*?)<\/a>/g)];
  assert.ok(enlaces.length >= 8);
  for (const [, slug, dentro] of enlaces) {
    const s = porSlug.get(slug);
    assert.ok(s, `el slug ${slug} no está en el catálogo`);
    assert.doesNotMatch(dentro, />[A-Z]\d\d</, `el enlace de ${slug} muestra un código interno`);
    assert.ok(dentro.replace(/<[^>]+>/g, '').trim().length > 3, `al enlace de ${slug} le falta el nombre`);
  }
  const deEstaDemo = SERVICIOS.filter((s) => s.demo === 'laboratorio/sensores/');
  assert.ok(deEstaDemo.length >= 3);
  for (const s of deEstaDemo) assert.ok(index.includes(`href="../../servicios/${s.slug}/"`), `falta ${s.id} ${s.slug}`);
  assert.match(index, /href="\.\.\/\.\.\/cotizar\/\?servicio=I01">Preguntar por este servicio</);
  assert.equal(porSlug.get('tablero-de-sensores').id, 'I01');
  assert.match(readFileSync(join(raizSitio, 'js/cotizar.js'), 'utf8'), /params\.get\('servicio'\)/, 'el cotizador lee ?servicio=');
});

test('la marca va como imagen (logo claro y oscuro) en las dos páginas, sin el logotipo de texto ni la fuente vieja', () => {
  for (const [nombre, html] of [['index.html', index], ['telefono.html', telefono]]) {
    assert.match(html, /<a class="marca" href="\.\.\/\.\.\/"><picture><source srcset="\.\.\/\.\.\/assets\/marca\/logo-oscuro\.svg" media="\(prefers-color-scheme: dark\)"><img src="\.\.\/\.\.\/assets\/marca\/logo-claro\.svg" alt="alphateklab, inicio" width="142" height="32"><\/picture><\/a>/, nombre);
    assert.doesNotMatch(html, /marca__lab/, nombre);
    assert.doesNotMatch(html, /archivo-latin/, `${nombre}: precarga de Archivo, que ya no se usa`);
    assert.match(html, /assets\/marca\/favicon\.svg/, nombre);
  }
});

test('el script de rescate usa la misma clave de almacenamiento que la demo', async () => {
  const { CLAVE } = await import('../js/nucleo/estado.mjs');
  assert.match(index, new RegExp(`var CLAVE = '${CLAVE}';`));
  assert.match(index, /id="mi-telefono"[^>]*disabled/, 'el botón del teléfono empieza desactivado, como los demás controles');
});

test('la cuenta de sensores del texto coincide con los sensores del simulador', () => {
  const etiquetas = new Set(SENSORES.filter((s) => s.tipo !== 'corriente').map((s) => s.etiqueta));
  const numeros = { 10: 'diez' };
  assert.equal(etiquetas.size, 10);
  assert.match(index, new RegExp(`data-cuenta-sensores>${numeros[etiquetas.size]}<`));
  for (const e of etiquetas) assert.match(index, new RegExp(`\\b${e}\\b`), `el sensor ${e} no aparece en la página`);
});

test('el aviso del relevo público va con el texto exacto en las dos páginas', () => {
  const aviso = 'Modo demostración entre dispositivos: los datos pasan por un servidor público de pruebas (ntfy.sh). No escribas datos reales.';
  assert.ok(index.includes(aviso));
  assert.ok(telefono.includes(aviso));
});

test('rutas relativas que existen y títulos cortos', () => {
  for (const [nombre, html] of [['index.html', index], ['telefono.html', telefono]]) {
    assert.match(html, /<title>[^<]+ · alphateklab<\/title>/, nombre);
    assert.match(html, /<html lang="es-PA">/, nombre);
    for (const [, ruta] of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
      if (/^(https?:|mailto:)/.test(ruta) || ruta === '../../' || ruta === './') continue;
      assert.ok(!ruta.startsWith('/'), `${nombre}: ruta absoluta ${ruta}`);
      assert.ok(existsSync(resolve(raiz, ruta)), `${nombre}: no existe ${ruta}`);
    }
  }
  for (const m of modulos) {
    const codigo = leer(m);
    for (const [, ruta] of codigo.matchAll(/from '(\.[^']+)'/g)) {
      assert.ok(existsSync(resolve(raiz, dirname(m), ruta)), `${m}: no existe ${ruta}`);
    }
  }
});

test('librerías externas solo de jsDelivr con versión exacta', () => {
  const todo = [index, telefono, ...modulos.map(leer)].join('\n');
  const externas = [...todo.matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/([^'"\s)]+)/g)].map((m) => m[1]);
  assert.ok(externas.length >= 1);
  for (const e of externas) assert.match(e, /^(@[\w-]+\/)?[\w.-]+@\d+\.\d+\.\d+(-[\w.]+)?\//, e);
  const scripts = [...todo.matchAll(/<script[^>]+src="(https?:[^"]+)"/g)];
  assert.equal(scripts.length, 0, 'sin scripts de otros dominios en el HTML');
});

test('sin marcas prohibidas ni restos de plantilla en lo publicado', () => {
  const todo = [index, telefono, leer('demo.css'), ...modulos.map(leer)].join('\n');
  for (const prohibido of [/prototipo/i, /novahweb/i, /lorem/i, /\bTODO\b/, /\[Nombre/, /Aquí tienes/i, /localhost/]) {
    assert.ok(!prohibido.test(todo), `aparece ${prohibido}`);
  }
});

test('canonical y og:image apuntan a esta página y a una captura que está en el repo', () => {
  assert.match(index, /<link rel="canonical" href="https:\/\/jojomunoz\.github\.io\/alphateklab\/laboratorio\/sensores\/">/);
  const og = /<meta property="og:image" content="https:\/\/jojomunoz\.github\.io\/alphateklab\/laboratorio\/sensores\/([^"]+)">/.exec(index);
  assert.ok(og, 'falta og:image');
  assert.ok(existsSync(join(raiz, og[1])), `no existe ${og[1]}`);
});
