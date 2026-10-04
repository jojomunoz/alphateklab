// Capturas del producto real (las demos) para la portada: lo que se ve dentro de los marcos de dispositivo.
// Uso: servir ~/alphateklab/repos en un puerto y: node herramientas/producto.mjs http://localhost:4900
// Escribe assets/producto/<nombre>.webp (con ImageMagick). Cada toma deja la demo trabajando, no vacía.
import { chromium } from './navegador.mjs';
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

  // Mesa: la carta de la mesa 7 en el teléfono del comensal (el enlace con la sala lo da la página de inicio de la demo).
  const m = await b.newContext({ deviceScaleFactor: 2, locale: 'es-PA' });
  const ini = await m.newPage();
  await ini.setViewportSize({ width: 1280, height: 800 });
  await ini.goto(`${BASE}/alphateklab-mesa/`, { waitUntil: 'load' });
  await ini.waitForTimeout(2000);
  const enlaceMesa = await ini.$$eval('a', (as) => as.map((a) => a.href).find((h) => /mesa\.html\?.*sala=/.test(h)));
  const carta = await m.newPage();
  await carta.setViewportSize({ width: 390, height: 844 });
  await carta.goto(enlaceMesa, { waitUntil: 'load' });
  await carta.waitForTimeout(2500);
  // la franja «Modo demostración…» de la demo no va en la foto: la portada ya dice que es una demo de ejemplo
  await carta.addStyleTag({ content: '.barra-demo { display: none !important; }' });
  await carta.waitForTimeout(200);
  await carta.screenshot({ path: join(tmp, 'carta.png') });
  aWebp(join(tmp, 'carta.png'), 'mesa-carta', 780);
  console.log('ok mesa-carta');
  // el salón (mapa de mesas) en la computadora de la caja, con la misma sala
  const salon = await m.newPage();
  await salon.setViewportSize({ width: 1040, height: 650 });
  const enlaceSalon = await ini.$$eval('a', (as) => as.map((a) => a.href).find((h) => /salon\.html/.test(h)));
  await salon.goto(enlaceSalon, { waitUntil: 'load' });
  await salon.waitForTimeout(2000);
  await salon.addStyleTag({ content: '.barra-demo { display: none !important; }' });
  await salon.waitForTimeout(200);
  await salon.screenshot({ path: join(tmp, 'salon.png') });
  aWebp(join(tmp, 'salon.png'), 'mesa-salon', 1600);
  console.log('ok mesa-salon');
  await m.close();

  // Reservas: la agenda del consultorio, la de la barbería y el calendario de cabañas
  const r = await b.newContext({ deviceScaleFactor: 2, locale: 'es-PA', viewport: { width: 1040, height: 650 } });
  const ag = await r.newPage();
  await ag.goto(`${BASE}/alphateklab-reservas/citas.html`, { waitUntil: 'load' });
  await ag.waitForTimeout(1800);
  await ag.screenshot({ path: join(tmp, 'agenda.png') });
  aWebp(join(tmp, 'agenda.png'), 'reservas-agenda', 1600);
  const barberia = await ag.$$eval('#sel-plantilla option', (os) => os.find((o) => /barber/i.test(o.textContent))?.value);
  if (barberia) {
    await ag.selectOption('#sel-plantilla', barberia);
    await ag.waitForTimeout(2000);
    await ag.screenshot({ path: join(tmp, 'barberia.png') });
    aWebp(join(tmp, 'barberia.png'), 'reservas-barberia', 1600);
  }
  const aloj = await r.newPage();
  await aloj.goto(`${BASE}/alphateklab-reservas/alojamiento.html`, { waitUntil: 'load' });
  await aloj.waitForTimeout(1800);
  await aloj.screenshot({ path: join(tmp, 'alojamiento.png') });
  aWebp(join(tmp, 'alojamiento.png'), 'reservas-alojamiento', 1600);
  console.log('ok reservas-agenda, reservas-barberia, reservas-alojamiento');
  await r.close();

  // Recorrido 3D por dentro y la cámara contando
  const t = await b.newContext({ deviceScaleFactor: 2, locale: 'es-PA', viewport: { width: 1040, height: 650 } });
  const d3 = await t.newPage();
  await d3.goto(`${BASE}/alphateklab/laboratorio/recorrido-3d/`, { waitUntil: 'load' });
  await d3.click('#entrar');
  await d3.waitForFunction(() => document.getElementById('visor')?.dataset.estado === 'listo', null, { timeout: 60000 });
  await d3.waitForTimeout(2500);
  await d3.locator('#visor').screenshot({ path: join(tmp, '3d.png') });
  aWebp(join(tmp, '3d.png'), 'recorrido-3d', 1600);
  const cam = await t.newPage();
  await cam.goto(`${BASE}/alphateklab/laboratorio/camara/`, { waitUntil: 'load' });
  await cam.waitForTimeout(1500);
  const zona = await cam.$('[data-captura]') || await cam.$('.escenario');
  if (zona) {
    await zona.screenshot({ path: join(tmp, 'camara.png') });
    aWebp(join(tmp, 'camara.png'), 'camara', 1600);
  }
  console.log('ok recorrido-3d, camara');
  await t.close();
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
