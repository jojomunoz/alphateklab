// Las pantallas reales que van encima de las escenas (herramientas/componer-equipo.py): la cocina de la demo de la
// mesa, la agenda de la demo de reservas y una pantalla de turnos (servicio S02). Uso: con ~/alphateklab/repos servido,
// node herramientas/pantallas-equipo.mjs http://localhost:4900 <carpeta>
// Solo software (oct-2026): se fueron el kiosco, la placa de la mesa, el teclado de la cerradura y lo del héroe de la
// portada (la carta en el teléfono, los avisos y la placa con el QR de las demos).
import { chromium } from './navegador.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const SALIDA = process.argv[3] || 'pantallas';
const MESA = `${BASE}/alphateklab-mesa/`;
mkdirSync(SALIDA, { recursive: true });

const b = await chromium.launch();
try {
  // Pantalla de cocina: 16:10, como una tableta de 10 pulgadas; la cocina siempre va en oscuro.
  {
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, locale: 'es-PA' });
    const p = await c.newPage();
    await p.goto(`${MESA}cocina.html`, { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    await p.addStyleTag({ content: '.barra-demo, .avisos-breves { display: none !important; }' });
    await p.waitForTimeout(300);
    await p.screenshot({ path: join(SALIDA, 'cocina.png') });
    await c.close();
  }
  // La agenda de recepción del consultorio de ejemplo (demo de reservas), para la tableta del mostrador.
  {
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, colorScheme: 'light', locale: 'es-PA', timezoneId: 'America/Panama' });
    const p = await c.newPage();
    await p.goto(`${BASE}/alphateklab-reservas/citas.html`, { waitUntil: 'load' });
    await p.waitForTimeout(1500);
    await p.addStyleTag({ content: '.barra-demo, .avisos-breves { display: none !important; }' });
    await p.waitForTimeout(300);
    await p.screenshot({ path: join(SALIDA, 'recepcion.png') });
    await c.close();
  }
  // Pantalla de turnos en la sala de espera (servicio S02, sin demo todavía): el turno que pasa y los que siguen,
  // con números y no con nombres, con la marca de la barbería de ejemplo de la demo de reservas.
  {
    const c = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    const p = await c.newPage();
    const fuente = `${BASE}/alphateklab-reservas/fuentes/`;
    await p.setContent(`<html><head><style>
      @font-face { font-family: Bitter; src: url('${fuente}bitter-700-latin.woff2') format('woff2'); font-weight: 700; }
      @font-face { font-family: Hanken; src: url('${fuente}hanken-grotesk-latin.woff2') format('woff2'); font-weight: 100 900; }
      body { margin: 0; width: 1600px; height: 900px; background: #f7f3f1; color: #241417; font-family: Hanken, system-ui, sans-serif; display: grid; grid-template-rows: auto 1fr auto; }
      header { display: flex; justify-content: space-between; align-items: center; padding: 34px 56px; background: #7d2a3a; color: #fff; }
      header b { font-family: Bitter, Georgia, serif; font-size: 44px; } header span { font-size: 40px; font-variant-numeric: tabular-nums; }
      main { display: grid; grid-template-columns: 1.25fr 1fr; gap: 48px; padding: 48px 56px; }
      .ahora { background: #fff; border: 4px solid #7d2a3a; padding: 40px 48px; display: grid; align-content: center; gap: 10px; }
      .ahora small { font-size: 34px; color: #6b4a50; } .ahora strong { font-family: Bitter, Georgia, serif; font-size: 170px; line-height: .95; color: #7d2a3a; }
      .ahora em { font-style: normal; font-size: 54px; font-weight: 700; }
      ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 18px; align-content: start; }
      ol h2 { margin: 0 0 6px; font-size: 34px; color: #6b4a50; font-weight: 600; }
      li { display: flex; justify-content: space-between; align-items: baseline; padding: 22px 28px; background: #fff; font-size: 46px; font-weight: 700; font-variant-numeric: tabular-nums; }
      li span { font-size: 34px; font-weight: 500; color: #6b4a50; }
      footer { padding: 26px 56px 34px; font-size: 32px; color: #6b4a50; }
    </style></head><body>
      <header><b>Barbería Calle Cuarta</b><span>10:42 a. m.</span></header>
      <main><section class="ahora"><small>Pasa ahora</small><strong>A-24</strong><em>Silla 2</em></section>
      <ol><h2>Siguen</h2><li>A-25 <span>unos 10 min</span></li><li>A-26 <span>unos 20 min</span></li><li>A-27 <span>unos 35 min</span></li></ol></main>
      <footer>Te avisamos por WhatsApp cuando falten 10 minutos para tu turno.</footer>
    </body></html>`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: join(SALIDA, 'turnos.png') });
    await c.close();
  }
  console.log('ok pantallas en', SALIDA);
} finally {
  await b.close();
}
