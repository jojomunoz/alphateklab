// Saca la captura real de cada demo para la portada (assets/demos/<clave>.webp, 1280×800 reducida a 640×400).
// Uso: servir ~/alphateklab/repos en un puerto y: node herramientas/capturas.mjs http://localhost:4900
// Las demos de otros repos se abren en local con la misma ruta que tienen en GitHub Pages.
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMOS } from '../datos/demos.mjs';
import { PREPARAR, local as localDe } from './preparar-demos.mjs';

const local = (url) => localDe(url, BASE);

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const solo = process.argv[3];

const tmp = mkdtempSync(join(tmpdir(), 'atk-capturas-'));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  for (const d of DEMOS) {
    if (solo && d.clave !== solo) continue;
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'light', locale: 'es-PA' });
    const p = await c.newPage();
    try {
      // «load» y una pausa: las demos con relevo (ntfy.sh) mantienen una conexión abierta y nunca llegan a «networkidle»
      await p.goto(local(d.url), { waitUntil: 'load', timeout: 30000 });
      await p.waitForTimeout(1500);
      if (PREPARAR[d.clave]) await PREPARAR[d.clave](p);
      // la captura enfoca la demo, no la cabecera del sitio
      const zona = await p.$('[data-captura]');
      if (zona) await zona.scrollIntoViewIfNeeded();
      await p.waitForTimeout(400);
      const png = join(tmp, `${d.clave}.png`);
      if (zona) await zona.screenshot({ path: png });
      else await p.screenshot({ path: png });
      execFileSync('magick', [png, '-resize', '1280x800^', '-gravity', 'north', '-extent', '1280x800', '-resize', '640x400', '-quality', '78', join(RAIZ, d.imagen)]);
      console.log('ok', d.clave, '→', d.imagen);
    } catch (e) {
      console.log('FALLA', d.clave, e.message.split('\n')[0]);
    } finally {
      await c.close();
    }
  }
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
