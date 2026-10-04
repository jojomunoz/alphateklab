// Las pantallas reales que van encima de las fotos del equipo (herramientas/componer-equipo.py): la cocina, el
// kiosco y la carta en el teléfono de la demo de la mesa, la placa impresa de la mesa 7 (con un QR que abre la demo),
// la agenda de la demo de reservas, una pantalla de turnos (servicio S02) y el teclado de la cerradura. Uso: con ~/alphateklab/repos servido, node herramientas/pantallas-equipo.mjs http://localhost:4900 <carpeta>
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const SALIDA = process.argv[3] || 'pantallas';
const MESA = `${BASE}/alphateklab-mesa/`;
const DEMO_PUBLICA = 'https://jojomunoz.github.io/alphateklab-mesa/';
mkdirSync(SALIDA, { recursive: true });
// Desde 1b15188 el héroe de la portada es la foto y la caja de avisos ya no está en la página: los avisos del teléfono
// se toman de la portada anterior a ese commit (sus estilos siguen en sitio.css, que la usa de respaldo).
const AVISOS_DESDE = '1b15188^';
const avisosAnteriores = () => {
  const h = execFileSync('git', ['show', `${AVISOS_DESDE}:index.html`], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  const i = h.lastIndexOf('<figure', h.indexOf('data-avisos'));
  return h.slice(i, h.indexOf('</figure>', i) + '</figure>'.length);
};

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
  // Kiosco vertical de 22 pulgadas (1080×1920), con el pedido vacío: fotos y sugerencias de la casa.
  {
    const c = await b.newContext({ viewport: { width: 1080, height: 1920 }, locale: 'es-PA' });
    const p = await c.newPage();
    await p.goto(`${MESA}kiosco.html`, { waitUntil: 'load' });
    await p.waitForTimeout(1500);
    const toque = p.locator('.reposo__toque, .reposo button').first();
    if (await toque.count()) { await toque.click().catch(() => {}); await p.waitForTimeout(800); }
    await p.addStyleTag({ content: '.barra-demo { display: none !important; }' });
    await p.evaluate(async () => {
      const fotos = [...document.querySelectorAll('img')];
      for (const f of fotos) f.loading = 'eager';
      await Promise.all(fotos.map((f) => (f.complete ? null : new Promise((listo) => { f.onload = f.onerror = listo; }))));
    });
    await p.waitForTimeout(400);
    await p.screenshot({ path: join(SALIDA, 'kiosco.png') });
    await c.close();
  }
  // La placa impresa de la mesa 7, la misma del panel de la demo, en un cuadrado; el QR abre la demo publicada.
  {
    const c = await b.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 3, locale: 'es-PA' });
    const p = await c.newPage();
    await p.goto(`${MESA}admin.html#mesas`, { waitUntil: 'load' });
    await p.waitForSelector('.placa-impresa .placa-impresa__qr svg');
    await p.waitForTimeout(500); // el panel termina de dibujar los QR de todas las placas
    await p.evaluate(async (url) => {
      const placa = [...document.querySelectorAll('.placa-impresa')].find((x) => x.querySelector('.placa-impresa__mesa strong')?.textContent.trim() === '7');
      if (!placa) throw new Error('no está la placa de la mesa 7');
      const qrLib = (await import('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm')).default;
      const qr = qrLib(0, 'Q');
      qr.addData(url);
      qr.make();
      const caja = placa.querySelector('.placa-impresa__qr');
      caja.replaceChildren();
      caja.insertAdjacentHTML('beforeend', qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
      caja.querySelector('svg').setAttribute('class', 'qr');
      placa.querySelector('.placa-impresa__dominio').textContent = url.replace(/^https:\/\//, '').replace(/\/$/, '');
      placa.querySelector('.placa-impresa__pin')?.remove();
      Object.assign(placa.style, { width: '330px', height: '330px', boxSizing: 'border-box', border: '0', borderRadius: '0', background: '#fff', alignContent: 'center', gap: '4px', padding: '10px', overflow: 'hidden' });
      placa.querySelector('.placa-impresa__mesa strong').style.fontSize = '2.6rem';
      placa.querySelector('.placa-impresa__qr').style.width = '8.6rem';
      placa.id = 'placa-captura';
    }, DEMO_PUBLICA);
    await p.waitForTimeout(300);
    await p.locator('#placa-captura').screenshot({ path: join(SALIDA, 'placa.png') });
    await c.close();
  }
  // Teclado de la cerradura: números blancos con un halo suave sobre negro, como un panel táctil encendido.
  {
    const c = await b.newContext({ viewport: { width: 300, height: 420 }, deviceScaleFactor: 3 });
    const p = await c.newPage();
    const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''];
    await p.setContent(`<html><body style="margin:0;background:#000;display:grid;place-items:center;height:100vh">
      <div style="display:grid;grid-template-columns:repeat(3,64px);gap:30px 34px;font:500 40px/1 'Inter',system-ui,sans-serif;color:#f4f7fb;text-align:center;text-shadow:0 0 10px rgba(170,205,255,.85),0 0 22px rgba(120,170,255,.45)">
      ${teclas.map((t) => `<span>${t || '&nbsp;'}</span>`).join('')}</div></body></html>`);
    await p.screenshot({ path: join(SALIDA, 'teclado.png') });
    await c.close();
  }
  // La carta de la mesa 7 en un teléfono (para el héroe de la portada): la primera pantalla, con las fotos.
  {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-PA' });
    const p = await c.newPage();
    await p.goto(MESA, { waitUntil: 'load' });
    const href = await p.getAttribute('#abrir-mesa-telefono', 'href');
    await p.goto(new URL(href, MESA).href, { waitUntil: 'load' });
    await p.waitForSelector('img.plato__foto');
    await p.addStyleTag({ content: '.barra-demo { display: none !important; }' });
    await p.evaluate(async () => {
      const fotos = [...document.querySelectorAll('img.plato__foto')];
      for (const f of fotos) f.loading = 'eager';
      await Promise.all(fotos.map((f) => (f.complete ? null : new Promise((listo) => { f.onload = f.onerror = listo; }))));
    });
    await p.waitForTimeout(500);
    await p.screenshot({ path: join(SALIDA, 'telefono.png') });
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
  // Para el héroe de la portada: los avisos de distintos negocios como notificaciones en un teléfono (copiados del
  // héroe del sitio, desprendidos de su animación) y una placa cuyo QR abre las demos del sitio publicado.
  {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'light', locale: 'es-PA' });
    const p = await c.newPage();
    await p.goto(`${BASE}/alphateklab/`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate((anterior) => {
      if (!document.querySelector('[data-avisos]')) document.body.insertAdjacentHTML('beforeend', anterior);
      const fig = document.querySelector('[data-avisos]').cloneNode(true); // la copia ya no la mueve el script
      fig.querySelectorAll('li[hidden]').forEach((li) => { li.hidden = false; });
      fig.querySelector('.avisos-heroe__pausa')?.remove();
      const titulo = fig.querySelector('.avisos-heroe__cabeza p');
      titulo.textContent = 'Avisos de hoy';
      titulo.style.color = '#c3d3cf';
      // el sprite de los íconos, si va dentro del body, se queda (sin él los íconos salen vacíos)
      const sprite = [...document.querySelectorAll('body svg')].find((x) => x.querySelector('symbol'));
      document.body.replaceChildren(...(sprite ? [sprite] : []), fig);
      document.body.className = '';
      Object.assign(document.body.style, { margin: '0', background: '#0a1f1c', padding: '58px 12px 16px', minHeight: '844px', boxSizing: 'border-box' });
      Object.assign(fig.style, { margin: '0', width: '100%', maxWidth: 'none' });
    }, avisosAnteriores());
    await p.waitForTimeout(400);
    await p.screenshot({ path: join(SALIDA, 'avisos-telefono.png') });
    await c.close();
  }
  {
    const c = await b.newContext({ viewport: { width: 330, height: 330 }, deviceScaleFactor: 3 });
    const p = await c.newPage();
    const f = `${BASE}/alphateklab/assets/fuentes/`;
    await p.setContent(`<html><head><style>
      @font-face { font-family: Manrope; src: url('${f}manrope-latin.woff2') format('woff2'); font-weight: 200 800; }
      @font-face { font-family: Inter; src: url('${f}inter-latin.woff2') format('woff2'); font-weight: 100 900; }
      body { margin: 0; width: 330px; height: 330px; background: #fff; color: #202729; display: grid; justify-items: center; align-content: center; gap: 6px; font-family: Inter, sans-serif; text-align: center; }
      img { height: 20px; } h1 { margin: 2px 0 0; font: 800 27px/1.05 Manrope, sans-serif; letter-spacing: -0.01em; }
      #qr { width: 156px; height: 156px; } #qr svg { width: 100%; height: 100%; display: block; }
      p { margin: 0; } .a { font-weight: 700; font-size: 15px; } .b { font-size: 11.5px; color: #5b6466; }
    </style></head><body>
      <img src="${BASE}/alphateklab/assets/marca/logo-claro.svg" alt="">
      <h1>Prueba las demos</h1><div id="qr"></div>
      <p class="a">Escanéalo con tu teléfono</p><p class="b">jojomunoz.github.io/alphateklab</p>
    </body></html>`, { waitUntil: 'load' });
    await p.evaluate(async () => {
      const qrLib = (await import('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm')).default;
      const qr = qrLib(0, 'Q');
      qr.addData('https://jojomunoz.github.io/alphateklab/laboratorio/');
      qr.make();
      document.getElementById('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      await document.fonts.ready;
    });
    await p.screenshot({ path: join(SALIDA, 'placa-demos.png') });
    await c.close();
  }
  console.log('ok pantallas en', SALIDA);
} finally {
  await b.close();
}
