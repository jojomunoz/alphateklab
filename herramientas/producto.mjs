// Capturas del producto real (las demos) para la portada: lo que se ve dentro de los marcos de dispositivo.
// Uso: servir ~/alphateklab/repos en un puerto y: node herramientas/producto.mjs http://localhost:4900
// Escribe assets/producto/<nombre>.webp (con ImageMagick). Cada toma deja la demo trabajando, no vacía.
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const tmp = mkdtempSync(join(tmpdir(), 'atk-producto-'));
const aWebp = (png, nombre, ancho) => execFileSync('magick', [png, '-resize', `${ancho}x`, '-strip', '-quality', '82', join(RAIZ, `assets/producto/${nombre}.webp`)]);

const b = await chromium.launch();
try {
  // Sensores: el tablero con la puerta de la nevera abierta y, en el teléfono, el aviso que llega.
  const c = await b.newContext({ deviceScaleFactor: 2 });
  const tel = await c.newPage();
  await tel.setViewportSize({ width: 390, height: 844 });
  await tel.goto(`${BASE}/alphateklab/laboratorio/sensores/telefono.html`, { waitUntil: 'networkidle' });
  const tab = await c.newPage();
  await tab.setViewportSize({ width: 1040, height: 650 }); // más chico: la interfaz se lee dentro del portátil
  await tab.goto(`${BASE}/alphateklab/laboratorio/sensores/`, { waitUntil: 'networkidle' });
  await tab.waitForSelector('[data-falla="puerta"]:not([disabled])', { timeout: 30000 });
  await tab.click('[data-falla="puerta"]');
  await tab.waitForTimeout(6000);
  await tab.evaluate(() => document.getElementById('notificacion-cerrar')?.click());
  // el ciclo completo en el teléfono: el aviso y, al cerrar la puerta, el «Resuelto»
  await tab.click('[data-falla="puerta"]');
  await tab.waitForTimeout(5000);
  await tab.evaluate(() => document.getElementById('notificacion-cerrar')?.click());
  await tab.click('[data-falla="puerta"]');
  await tab.waitForTimeout(6000);
  await tab.evaluate(() => document.getElementById('notificacion-cerrar')?.click());
  await tab.evaluate(() => {
    const y = document.getElementById('registro-titulo').getBoundingClientRect().top + scrollY;
    window.scrollTo(0, Math.max(0, y - 210));
  });
  await tab.waitForTimeout(500);
  await tab.screenshot({ path: join(tmp, 'tablero.png') });
  aWebp(join(tmp, 'tablero.png'), 'sensores-tablero', 1600);
  await tel.bringToFront();
  await tel.waitForTimeout(1000);
  // En el teléfono se ve la conversación con el aviso (el elemento .chat--tel tal cual), no la configuración de la sala.
  await tel.evaluate(() => {
    const chat = document.querySelector('.chat--tel');
    chat.style.minHeight = '720px';
    chat.style.margin = '0';
  });
  await tel.waitForTimeout(300);
  await tel.locator('.chat--tel').screenshot({ path: join(tmp, 'aviso.png') });
  aWebp(join(tmp, 'aviso.png'), 'sensores-aviso', 780);
  console.log('ok sensores-tablero, sensores-aviso');
  await c.close();
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
