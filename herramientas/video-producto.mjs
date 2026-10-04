// Video del producto para la portada: en el teléfono se pide un plato desde la carta QR y en la computadora el salón
// recibe el pedido. Graba la demo real de la mesa cuadro por cuadro, con el tiempo bajo control, para que las
// animaciones de la propia demo salgan fluidas y cada cuadro nítido (antes eran fotos fijas unidas con fundidos):
// - temporizadores y requestAnimationFrame de las páginas van con el reloj falso de Playwright (clock.runFor);
// - las animaciones CSS y WAAPI se pausan al aparecer y se ponen en su tiempo exacto en cada cuadro;
// - el desplazamiento de la carta y la cámara del salón los mueve el guion, no el navegador;
// - el anillo de cada toque va en la capa superior (popover), así se ve también sobre los diálogos.
// Codifica AV1 (los navegadores que lo decodifican) y H.264 (el resto, como los iPhone anteriores al 15 Pro), y saca
// el póster del primer cuadro para que no haya salto al arrancar.
// Uso: servir ~/alphateklab/repos en un puerto y: node herramientas/video-producto.mjs http://localhost:4900
// Escribe assets/producto/mesa-pedido-{telefono,salon}.{av1.mp4,mp4,webp} (misma duración: van juntos).
import { chromium } from './navegador.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const FPS = 30;
const DT = 1000 / FPS;
const DURACION = 9.4; // segundos
const tmp = mkdtempSync(join(tmpdir(), 'atk-video-'));
for (const d of ['tel', 'salon']) mkdirSync(join(tmp, d));

// Lo que no va en el video: la barra de la demo, el estado del relevo y el aviso técnico del servidor de pruebas.
const OCULTAR = '.barra-demo{display:none!important} #conexion{visibility:hidden!important} .aviso-relevo,.pie-mesa__aviso{display:none!important}';

// En la página: avanza cada animación al tiempo t (ms del video). Las que aparecen se pausan y quedan ancladas al
// cuadro en que nacieron; las que terminan se dan por terminadas y no se vuelven a tocar.
function avanzarAnimaciones(t) {
  const vivas = (window.__vivas ??= new Map());
  const hechas = (window.__hechas ??= new WeakSet());
  for (const a of document.getAnimations()) {
    if (hechas.has(a)) continue;
    if (!vivas.has(a)) {
      vivas.set(a, t);
      a.pause();
    }
    const local = t - vivas.get(a);
    const fin = a.effect?.getComputedTiming().endTime ?? 0;
    if (Number.isFinite(fin) && local >= fin) {
      a.currentTime = fin;
      a.finish();
      vivas.delete(a);
      hechas.add(a);
    } else a.currentTime = local;
  }
}

// En la página: el anillo ámbar del toque.
function anillo({ x, y }) {
  const d = document.createElement('div');
  d.popover = 'manual';
  Object.assign(d.style, {
    position: 'fixed', inset: 'auto', margin: '0', padding: '0', left: `${x - 30}px`, top: `${y - 30}px`, width: '60px', height: '60px',
    border: '3px solid #F2B544', borderRadius: '50%', background: 'rgba(242,181,68,.30)', overflow: 'visible', pointerEvents: 'none', boxSizing: 'border-box',
  });
  document.body.append(d);
  d.showPopover();
  d.animate(
    [
      { transform: 'scale(.5)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1, offset: 0.3 },
      { transform: 'scale(1)', opacity: 1, offset: 0.55 },
      { transform: 'scale(1.35)', opacity: 0 },
    ],
    { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' },
  );
  setTimeout(() => d.remove(), 720);
}

const suave = (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2); // ease-in-out cúbica
// resorte críticamente amortiguado de 0 a 1 (sin rebote): llega al 94 % en 0,5 s con omega 9
const resorte = (tau, omega = 9) => (tau <= 0 ? 0 : 1 - (1 + omega * tau) * Math.exp(-omega * tau));

const b = await chromium.launch();
try {
  const ctx = await b.newContext({ deviceScaleFactor: 2, locale: 'es-PA', reducedMotion: 'no-preference' });
  await ctx.clock.install({ time: new Date('2026-10-03T12:28:00-05:00') });
  const ini = await ctx.newPage();
  await ini.setViewportSize({ width: 1040, height: 650 });
  await ini.goto(`${BASE}/alphateklab-mesa/`, { waitUntil: 'load' });
  await ini.clock.runFor(1500);
  const enlaces = await ini.$$eval('a', (as) => as.map((a) => a.href));
  const urlMesa = enlaces.find((h) => /mesa\.html\?.*sala=/.test(h));
  const urlSalon = enlaces.find((h) => /salon\.html/.test(h));

  const salon = await ctx.newPage();
  await salon.setViewportSize({ width: 1040, height: 650 });
  await salon.goto(urlSalon, { waitUntil: 'load' });
  await salon.addStyleTag({ content: OCULTAR });
  const tel = await ctx.newPage();
  await tel.setViewportSize({ width: 390, height: 844 });
  await tel.goto(urlMesa, { waitUntil: 'load' });
  await tel.addStyleTag({ content: OCULTAR });
  // Las fotos de la carta cargan «lazy» y la del plato tocado solo al abrir su hoja: se piden antes de grabar, para
  // que ningún cuadro salga con el recuadro gris de una foto que todavía viene en camino.
  await tel.evaluate(async (n) => {
    const fotos = [...document.querySelectorAll('img.plato__foto')];
    for (const f of fotos) f.loading = 'eager';
    const id = document.querySelectorAll('button.plato')[n]?.dataset.plato;
    const grande = id ? fetch(`img/platos/${id}-960.webp`).then((r) => r.blob()) : null;
    await Promise.all([...fotos.map((f) => (f.complete ? null : new Promise((listo) => { f.onload = f.onerror = listo; }))), grande]);
  }, 1);
  await tel.clock.runFor(2500);
  for (const p of [tel, salon]) {
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(avanzarAnimaciones, 0);
  }

  const centro = async (p, sel, n = 0) => {
    const c = await p.locator(sel).nth(n).boundingBox();
    return { x: c.x + c.width / 2, y: c.y + c.height / 2 };
  };
  const clic = (p, sel, n = 0) => p.evaluate(([s, i]) => document.querySelectorAll(s)[i].click(), [sel, n]);

  // Guion del teléfono, en segundos del video: el anillo aparece 0,35 s antes de cada toque.
  const PLATO = ['button.plato', 1]; // patacones con ceviche: el segundo plato de la carta y la foto con más color
  const AGREGAR = ['#dlg-plato button[type="submit"]', 0];
  const PEDIDO = ['#boton-carrito', 0];
  const ENVIAR = ['#dlg-carrito .boton--primario.boton--grande', 0];
  const DESPL = { desde: 0.7, dura: 1.0, px: 360 };
  let scrollIni = 0;
  const eventos = [
    [DESPL.desde, async () => { scrollIni = await tel.evaluate(() => scrollY); }],
    ...[[1.95, PLATO], [3.45, AGREGAR], [4.7, PEDIDO], [6.1, ENVIAR]].flatMap(([t, [sel, n]]) => [
      [t, async () => tel.evaluate(anillo, await centro(tel, sel, n))],
      [t + 0.35, () => clic(tel, sel, n)],
    ]),
  ];
  // Cámara del salón: cuando llega el pedido, se acerca a su tarjeta.
  const CAMARA = { desde: 6.85, zoom: 1.7, destino: { x: 520, y: 270 } };
  let foco = null;

  const total = Math.round(DURACION * FPS);
  let e = 0;
  for (let k = 0; k < total; k++) {
    const s = k / FPS;
    while (e < eventos.length && eventos[e][0] <= s + 1e-9) await eventos[e++][1]();
    if (s >= DESPL.desde && s <= DESPL.desde + DESPL.dura + DT / 1000) {
      const y = Math.round(scrollIni + DESPL.px * suave(Math.min(1, (s - DESPL.desde) / DESPL.dura)));
      await tel.evaluate((v) => window.scrollTo(0, v), y);
    }
    if (s >= CAMARA.desde) {
      // la primera vez: el centro de la tarjeta del pedido nuevo, y un contorno ámbar que aparece sobre ella (como el
      // anillo de los toques, es una marca del video, no de la demo); sin él, la tarjeta roja de otra mesa se llevaba
      // la mirada
      foco ??= await salon.evaluate(() => {
        const tarjeta = [...document.querySelectorAll('.pendiente')].find((x) => /Mesa 7/.test(x.textContent));
        if (tarjeta) {
          Object.assign(tarjeta.style, { outline: '3px solid rgba(242,181,68,0)', outlineOffset: '3px' });
          tarjeta.animate([{ outlineColor: 'rgba(242,181,68,0)' }, { outlineColor: 'rgba(242,181,68,1)', offset: 0.3 }, { outlineColor: 'rgba(242,181,68,1)' }], { duration: 1500, fill: 'forwards' });
        }
        const r = (tarjeta || document.body).getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      await salon.evaluate(({ foco, p, c }) => {
        const h = document.documentElement;
        h.style.transformOrigin = `${foco.x}px ${foco.y}px`;
        h.style.transform = `translate(${(c.destino.x - foco.x) * p}px, ${(c.destino.y - foco.y) * p}px) scale(${1 + (c.zoom - 1) * p})`;
      }, { foco, p: resorte(s - CAMARA.desde), c: CAMARA });
    }
    if (k > 0) await tel.clock.runFor(DT);
    for (const p of [tel, salon]) await p.evaluate(avanzarAnimaciones, k * DT);
    const n = String(k).padStart(4, '0');
    await tel.screenshot({ path: join(tmp, 'tel', `${n}.png`) });
    await salon.screenshot({ path: join(tmp, 'salon', `${n}.png`) });
  }
  await ctx.close();

  // Codificación. AV1 con SVT (preset 4, crf 48) y H.264 (veryslow, tune animation, crf 29), 4:2:0 de 8 bits para
  // que lo decodifique el hardware de los teléfonos; el póster en WebP desde el primer cuadro.
  const armar = (dir, ancho, salida) => {
    const entrada = ['-v', 'error', '-y', '-framerate', String(FPS), '-i', join(tmp, dir, '%04d.png')];
    const escala = ['-vf', `scale=${ancho}:-2:flags=lanczos,format=yuv420p`];
    execFileSync('ffmpeg', [...entrada, ...escala, '-c:v', 'libsvtav1', '-preset', '4', '-crf', '48', '-g', '300', '-svtav1-params', 'tune=0', '-movflags', '+faststart', `${salida}.av1.mp4`], { stdio: 'ignore' });
    execFileSync('ffmpeg', [...entrada, ...escala, '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-crf', '29', '-profile:v', 'high', '-movflags', '+faststart', `${salida}.mp4`], { stdio: 'ignore' });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', join(tmp, dir, '0000.png'), '-vf', `scale=${ancho}:-2:flags=lanczos`, '-quality', '82', `${salida}.webp`], { stdio: 'ignore' });
  };
  // el códec exacto del AV1 (perfil, nivel, profundidad) va en el type de <source>: así el navegador que no lo
  // decodifica pasa al H.264 sin descargar nada
  const codec = (archivo) => {
    const nivel = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=level', '-of', 'default=nw=1:nk=1', archivo]).toString().trim();
    return `av01.0.${String(nivel).padStart(2, '0')}M.08`;
  };
  const codecs = {};
  for (const [dir, ancho, nombre] of [['tel', 720, 'mesa-pedido-telefono'], ['salon', 1280, 'mesa-pedido-salon']]) {
    armar(dir, ancho, join(RAIZ, 'assets/producto', nombre));
    codecs[nombre] = codec(join(RAIZ, 'assets/producto', `${nombre}.av1.mp4`));
  }
  writeFileSync(join(RAIZ, 'assets/producto/video-codecs.json'), `${JSON.stringify(codecs, null, 2)}\n`);
  console.log(`ok video: ${total} cuadros a ${FPS} por segundo, ${DURACION} s`);
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
