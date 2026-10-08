// Avisa a los buscadores de IndexNow (Bing, Yandex, Seznam, Naver) de las páginas del sitemap, para que las vuelvan a
// leer sin esperar a pasar por el sitio. Bing es también de donde sacan sus resultados ChatGPT y Copilot. Google no usa
// IndexNow: para Google está el sitemap en Search Console.
// Uso, después de publicar (y de que GitHub Pages termine): node herramientas/indexnow.mjs
// Primero comprueba que el sitio en vivo sirva la clave (alphateklab.com/<clave>.txt); si no, no avisa.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEXNOW, URL_BASE } from '../datos/sitio.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const urls = [...readFileSync(join(RAIZ, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const ubicacion = `${URL_BASE}${INDEXNOW}.txt`;

const viva = await fetch(ubicacion, { cache: 'no-store' }).then((r) => (r.ok ? r.text() : `HTTP ${r.status}`)).catch((e) => e.message);
if (viva.trim() !== INDEXNOW) {
  console.error(`${ubicacion} no sirve la clave todavía (${viva.slice(0, 60)}): publica y espera a GitHub Pages.`);
  process.exit(1);
}

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(URL_BASE).host, key: INDEXNOW, keyLocation: ubicacion, urlList: urls }),
});
// 200: recibido; 202: recibido, la clave se valida después. Lo demás es un error (422: una URL no es del dominio).
console.log(`IndexNow: ${r.status} ${r.statusText} · ${urls.length} páginas`);
if (![200, 202].includes(r.status)) {
  console.error(await r.text());
  process.exit(1);
}
