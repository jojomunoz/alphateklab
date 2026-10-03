// Video corto del producto para la portada: en el teléfono se pide un plato desde la carta QR y en la computadora el
// salón recibe el pedido. Captura cuadros clave del flujo real de la demo de mesa y los une con ffmpeg (fundidos cortos).
// Uso: servir ~/alphateklab/repos en un puerto y: node herramientas/video-producto.mjs http://localhost:4900
// Escribe assets/producto/mesa-pedido-telefono.{webm,mp4} y mesa-pedido-salon.{webm,mp4} (misma duración: van juntos).
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const tmp = mkdtempSync(join(tmpdir(), 'atk-video-'));
const SIN_BARRA = '.barra-demo { display: none !important; }';

// Marca de toque: un círculo ámbar donde «toca» el dedo (se quita después de la foto).
async function toque(p, selector) {
  const caja = await p.locator(selector).first().boundingBox();
  await p.evaluate(({ x, y }) => {
    const d = document.createElement('div');
    d.id = 'atk-toque';
    Object.assign(d.style, { position: 'fixed', left: `${x - 22}px`, top: `${y - 22}px`, width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(242,181,68,.55)', border: '2px solid #f2b544', zIndex: 99999, pointerEvents: 'none' });
    document.body.append(d);
  }, { x: caja.x + caja.width / 2, y: caja.y + caja.height / 2 });
}
const sinToque = (p) => p.evaluate(() => document.getElementById('atk-toque')?.remove());

const b = await chromium.launch();
try {
  const c = await b.newContext({ deviceScaleFactor: 2, locale: 'es-PA' });
  const ini = await c.newPage();
  await ini.setViewportSize({ width: 1040, height: 650 });
  await ini.goto(`${BASE}/alphateklab-mesa/`, { waitUntil: 'load' });
  await ini.waitForTimeout(1500);
  const enlaces = await ini.$$eval('a', (as) => as.map((a) => a.href));
  const enlaceMesa = enlaces.find((h) => /mesa\.html\?.*sala=/.test(h));
  const enlaceSalon = enlaces.find((h) => /salon\.html/.test(h));

  const salon = await c.newPage();
  await salon.setViewportSize({ width: 1040, height: 650 });
  await salon.goto(enlaceSalon, { waitUntil: 'load' });
  await salon.addStyleTag({ content: SIN_BARRA });
  await salon.waitForTimeout(1500);

  const tel = await c.newPage();
  await tel.setViewportSize({ width: 390, height: 844 });
  await tel.goto(enlaceMesa, { waitUntil: 'load' });
  await tel.addStyleTag({ content: SIN_BARRA });
  await tel.waitForTimeout(1500);

  // cada cuadro: [archivo, segundos que dura]; el salón tiene su propia lista con la misma duración total
  const t = [];
  const s = [];
  let n = 0;
  const fotoTel = async (seg) => { const f = join(tmp, `t${String(n++).padStart(2, '0')}.png`); await tel.screenshot({ path: f }); t.push([f, seg]); };
  const fotoSalon = async (seg) => { const f = join(tmp, `s${String(n++).padStart(2, '0')}.png`); await salon.screenshot({ path: f }); s.push([f, seg]); };

  await fotoSalon(0); // el salón antes del pedido (su duración se ajusta al final)
  await fotoTel(1.4); // la carta
  const plato = 'button.plato';
  await toque(tel, plato); await fotoTel(0.45); await sinToque(tel);
  await tel.locator(plato).first().click();
  await tel.waitForTimeout(700);
  await fotoTel(1.0); // la hoja del plato
  const agregar = '#dlg-plato button[type="submit"]';
  await toque(tel, agregar); await fotoTel(0.45); await sinToque(tel);
  await tel.locator(agregar).click();
  await tel.waitForTimeout(900);
  await fotoTel(0.9); // la carta con la barra del pedido
  await toque(tel, '#boton-carrito'); await fotoTel(0.4); await sinToque(tel);
  await tel.locator('#boton-carrito').click();
  await tel.waitForTimeout(700);
  await fotoTel(1.0); // el pedido
  const enviar = '#dlg-carrito .boton--primario.boton--grande';
  await toque(tel, enviar); await fotoTel(0.45); await sinToque(tel);
  await tel.locator(enviar).click();
  await tel.waitForTimeout(1500);
  await fotoTel(2.2); // enviado
  await salon.bringToFront();
  await salon.waitForTimeout(1500);
  const antes = t.slice(0, -1).reduce((a, [, d]) => a + d, 0);
  s[0][1] = antes; // el salón espera hasta que se envía
  await fotoSalon(2.2); // el salón con el pedido de la mesa 7
  writeFileSync(join(tmp, 'resumen.json'), JSON.stringify({ t, s }));

  // une los cuadros con fundidos de 0.25 s; los dos videos duran lo mismo para que vayan juntos
  const armar = (cuadros, ancho, salida) => {
    const FUNDIDO = 0.25;
    const entradas = cuadros.flatMap(([f, d]) => ['-loop', '1', '-t', String(d + FUNDIDO), '-i', f]);
    let filtro = cuadros.map((_, i) => `[${i}:v]scale=${ancho}:-2:flags=lanczos,format=yuv420p,setsar=1[v${i}]`).join(';');
    let previo = 'v0';
    let desplazamiento = 0;
    cuadros.slice(1).forEach(([, ], i) => {
      desplazamiento += cuadros[i][1];
      filtro += `;[${previo}][v${i + 1}]xfade=transition=fade:duration=${FUNDIDO}:offset=${desplazamiento.toFixed(2)}[x${i + 1}]`;
      previo = `x${i + 1}`;
    });
    const comun = ['-y', ...entradas, '-filter_complex', filtro, '-map', `[${previo}]`, '-an', '-r', '30'];
    execFileSync('ffmpeg', [...comun, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', `${salida}.webm`], { stdio: 'ignore' });
    execFileSync('ffmpeg', [...comun, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', '-pix_fmt', 'yuv420p', `${salida}.mp4`], { stdio: 'ignore' });
  };
  armar(t, 540, join(RAIZ, 'assets/producto/mesa-pedido-telefono'));
  armar(s, 1280, join(RAIZ, 'assets/producto/mesa-pedido-salon'));
  console.log(`ok video: ${t.length} cuadros en el teléfono, ${s.length} en el salón, ${t.reduce((a, [, d]) => a + d, 0).toFixed(1)} s`);
  await c.close();
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
