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
  // (las tomas de los sensores, del recorrido 3D y de la cámara se fueron con esas demos: solo software, oct-2026)
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

} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
