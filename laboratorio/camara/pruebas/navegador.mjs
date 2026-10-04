// Recorrido completo de la demo en Chromium (Playwright). No corre con `node --test`: necesita navegador, ffmpeg e
// internet (MediaPipe y el modelo se bajan de jsDelivr y Google).
//
// Uso:  node laboratorio/camara/pruebas/navegador.mjs <carpeta-para-capturas>
//   PLAYWRIGHT_MJS=/ruta/a/playwright/index.mjs para usar otra instalación de Playwright.
//   PUERTO=4810 para servir en otro puerto (por defecto 4790).
//
// Qué hace: levanta un servidor estático con soporte de Range (como GitHub Pages) en :4790 sirviendo ~/alphateklab/repos,
// genera con ffmpeg un video de prueba y un «video de cámara» a partir del video de muestra, y recorre: encender con
// la muestra, dibujar la línea con el mouse y con el teclado, dibujar la zona, avisos de aforo, campos inválidos,
// privacidad, CSV, reiniciar y deshacer, recarga con datos guardados, restablecer, la cámara falsa de Chromium,
// subir un video, y los errores (permiso negado, sin modelo, archivo que no es video). Revisa la red (solo GET a
// localhost, jsDelivr y Google Storage; nada de POST) y la consola (sin errores), y toma capturas a 390 y 1280 px en
// claro y oscuro. Sale con código 1 si algo falla.

import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DEMO = path.resolve(AQUI, '..');
const REPOS = path.resolve(DEMO, '../../..');
const PUERTO = Number(process.env.PUERTO || 4790);
const DIRECCION = `http://localhost:${PUERTO}/alphateklab/laboratorio/camara/`;
const CAPTURAS = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'capturas-camara'));
const { chromium } = await import('../../../herramientas/navegador.mjs');

fs.mkdirSync(CAPTURAS, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'camara-prueba-'));

const resultados = [];
function anotar(nombre, ok, detalle = '') {
  resultados.push({ nombre, ok, detalle });
  console.log(`${ok ? 'ok  ' : 'FALLA'} ${nombre}${detalle ? ' · ' + detalle : ''}`);
}
async function paso(nombre, fn) {
  try {
    const detalle = await fn();
    anotar(nombre, true, detalle || '');
  } catch (e) {
    anotar(nombre, false, String((e && e.message) || e).slice(0, 300));
  }
}
function afirmar(cond, mensaje) {
  if (!cond) throw new Error(mensaje);
}

// ── material de prueba ───────────────────────────────────────────────────────
const MUESTRA = path.join(DEMO, 'media/muestra-zona-peatonal.mp4');
const SUBIDO = path.join(TMP, 'tienda-de-prueba.mp4');
const CAMARA = path.join(TMP, 'camara-falsa.mjpeg');
const ROTO = path.join(TMP, 'roto.mp4');
const TEXTO = path.join(TMP, 'notas.txt');
// video para «subir»: los segundos 4 a 10 de la muestra, en espejo y a 640 px (distinto del original)
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '4', '-t', '6', '-i', MUESTRA, '-vf', 'hflip,scale=640:360', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', SUBIDO]);
// «cámara»: la muestra en MJPEG a 640 × 360 y 15 cuadros/s (Chromium lo repite en bucle como si fuera una cámara)
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', MUESTRA, '-vf', 'scale=640:360,fps=15', '-q:v', '5', '-an', CAMARA]);
fs.writeFileSync(ROTO, Buffer.from(Array.from({ length: 40000 }, (_, i) => (i * 7919) % 251)));
fs.writeFileSync(TEXTO, 'esto no es un video');

// ── servidor estático con Range ─────────────────────────────────────────────
const servidor = spawn(process.execPath, [path.join(AQUI, 'servidor.mjs'), REPOS, String(PUERTO)], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ok, mal) => {
  servidor.stdout.once('data', ok);
  servidor.once('exit', (c) => mal(new Error('el servidor salió con ' + c)));
});

const ARGS = ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'];
const ARGS_CAMARA = [...ARGS, '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${CAMARA}`];
const HOSTS_PERMITIDOS = new Set([`localhost:${PUERTO}`, 'cdn.jsdelivr.net', 'storage.googleapis.com']);

const navegadores = [];
async function abrir({ args = ARGS, ancho = 1280, alto = 800, tema = 'light', movimiento = 'no-preference', escala = 1, js = true, antes } = {}) {
  const nav = await chromium.launch({ args });
  navegadores.push(nav);
  const ctx = await nav.newContext({ viewport: { width: ancho, height: alto }, colorScheme: tema, reducedMotion: movimiento, deviceScaleFactor: escala, acceptDownloads: true, javaScriptEnabled: js });
  // Cerrar el contexto cierra también su navegador: así no se acumulan Chromium abiertos durante el recorrido.
  const cerrarContexto = ctx.close.bind(ctx);
  ctx.close = async () => {
    await cerrarContexto().catch(() => {});
    await nav.close().catch(() => {});
  };
  const pag = await ctx.newPage();
  const registro = { errores: [], peticiones: [] };
  pag.on('console', (m) => {
    if (m.type() === 'error') registro.errores.push(m.text().slice(0, 200));
  });
  pag.on('pageerror', (e) => registro.errores.push('pageerror: ' + String(e).slice(0, 200)));
  ctx.on('request', (r) => registro.peticiones.push({ metodo: r.method(), url: r.url(), cuerpo: Boolean(r.postData()) }));
  if (antes) await antes(pag, ctx);
  await pag.goto(DIRECCION);
  return { nav, ctx, pag, registro };
}
const estadoDemo = (pag) => pag.evaluate(() => ({ fase: window.__camara.fase, ...window.__camara.cifras, fps: window.__camara.fps, pistas: window.__camara.pistas.length, config: window.__camara.config }));
async function esperarFase(pag, fases, ms = 150_000) {
  await pag.waitForFunction((f) => f.includes(window.__camara.fase), fases, { timeout: ms });
  return pag.evaluate(() => window.__camara.fase);
}
async function sinScrollHorizontal(pag) {
  const r = await pag.evaluate(() => ({ ancho: document.documentElement.scrollWidth, vista: document.documentElement.clientWidth }));
  afirmar(r.ancho <= r.vista, `scroll horizontal: ${r.ancho} > ${r.vista}`);
}
/** Deja el video entero a la vista (el mouse de Playwright trabaja en coordenadas de la ventana). */
async function videoALaVista(pag) {
  await pag.evaluate(() => document.getElementById('escenario').scrollIntoView({ block: 'center' }));
  await pag.waitForTimeout(400);
}
async function puntoEnLienzo(pag, nx, ny) {
  return pag.evaluate(
    ([x, y]) => {
      const lienzo = document.getElementById('lienzo');
      const caja = lienzo.getBoundingClientRect();
      // el video se dibuja con «contain»: se calcula su rectángulo dentro del lienzo
      const v = document.getElementById('video');
      const prop = v.videoWidth / v.videoHeight || 16 / 9;
      let w = caja.width;
      let h = w / prop;
      if (h > caja.height) {
        h = caja.height;
        w = h * prop;
      }
      return { x: caja.left + (caja.width - w) / 2 + x * w, y: caja.top + (caja.height - h) / 2 + y * h };
    },
    [nx, ny],
  );
}

try {
  // ── 1. recorrido principal con el video de muestra (1280, claro) ──────────
  const { pag, registro, ctx } = await abrir({ escala: 1 });
  const inicio = Date.now();
  await paso('la página carga apagada, con la captura de vista previa a la vista', async () => {
    afirmar((await esperarFase(pag, ['apagada'])) === 'apagada', 'no arrancó apagada');
    const previa = await pag.evaluate(() => {
      const i = document.getElementById('previa');
      return { ok: i.complete && i.naturalWidth > 0, visible: i.getBoundingClientRect().height > 100 };
    });
    afirmar(previa.ok && previa.visible, 'la vista previa no cargó');
    await sinScrollHorizontal(pag);
    await pag.screenshot({ path: path.join(CAPTURAS, '1280-claro-1-apagada.png') });
  });

  await paso('el archivo sin elegir dice qué hacer', async () => {
    await pag.check('input[name="fuente"][value="archivo"]');
    await pag.click('#encender');
    const t = await pag.textContent('#error-archivo');
    afirmar(/elige un video/i.test(t) && (await pag.isVisible('#error-archivo')), 'sin mensaje: ' + t);
    await pag.check('input[name="fuente"][value="muestra"]');
  });

  await paso('«Encender la demo» con la muestra: baja el modelo, elige procesador y analiza', async () => {
    await pag.click('#encender');
    afirmar(await pag.isVisible('#carga'), 'no se vio el estado de carga');
    const fase = await esperarFase(pag, ['encendida', 'error']);
    afirmar(fase === 'encendida', 'quedó en ' + fase + ': ' + (await pag.textContent('#falla')));
    await pag.waitForFunction(() => window.__camara.fps > 0 && window.__camara.pistas.length > 0, null, { timeout: 60_000 });
    const e = await estadoDemo(pag);
    const extra = await pag.evaluate(() => ({ delegado: window.__camara.delegado, worker: window.__camara.enWorker }));
    return `${e.fps.toFixed(1)} análisis/s con ${extra.delegado}${extra.worker ? ' en worker' : ' en hilo principal'}`;
  });

  await paso('a los 25 s ya contó cruces, sigue personas y el mapa de calor acumula', async () => {
    await pag.waitForTimeout(25_000);
    const e = await estadoDemo(pag);
    const calor = await pag.evaluate(() => window.__camara.calorTotal);
    afirmar(e.entradas + e.salidas >= 1, `sin cruces: ${JSON.stringify(e)}`);
    afirmar(calor > 1, 'mapa de calor vacío');
    await pag.screenshot({ path: path.join(CAPTURAS, '1280-claro-2-encendida.png') });
    await pag.locator('#lienzo').screenshot({ path: path.join(CAPTURAS, '1280-claro-lienzo.png') });
    return `entradas ${e.entradas}, salidas ${e.salidas}, dentro ${e.dentro}, ${e.visibles} a la vista, calor ${calor.toFixed(0)} s`;
  });

  await paso('el aviso de fila de ejemplo salta en la primera vuelta del video, aunque vaya más lento que 1×', async () => {
    // la escena mide en tiempo de video: a 0,25× el seguimiento no pierde a la gente de la zona (ver muestra.test.mjs)
    await pag.waitForFunction(() => window.__camara.cifras.avisosFila >= 1, null, { timeout: 90_000 });
    const v = await pag.evaluate(() => window.__camara.velocidad);
    return `video a ${v}×`;
  });

  await paso('arrastrar sobre el video traza una línea nueva', async () => {
    await pag.check('input[name="modo"][value="linea"]');
    await videoALaVista(pag);
    const a = await puntoEnLienzo(pag, 0.3, 0.9);
    const b = await puntoEnLienzo(pag, 0.32, 0.35);
    await pag.mouse.move(a.x, a.y);
    await pag.mouse.down();
    await pag.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 4 });
    await pag.mouse.move(b.x, b.y, { steps: 4 });
    await pag.mouse.up();
    const l = (await estadoDemo(pag)).config.linea;
    afirmar(Math.abs(l.a.x - 0.3) < 0.02 && Math.abs(l.b.y - 0.35) < 0.02, 'línea: ' + JSON.stringify(l));
  });

  await paso('una línea demasiado corta no se acepta y lo dice', async () => {
    const antes = (await estadoDemo(pag)).config.linea;
    const a = await puntoEnLienzo(pag, 0.5, 0.5);
    await pag.mouse.move(a.x, a.y);
    await pag.mouse.down();
    await pag.mouse.move(a.x + 4, a.y + 2, { steps: 2 });
    await pag.mouse.up();
    afirmar(JSON.stringify((await estadoDemo(pag)).config.linea) === JSON.stringify(antes), 'la línea cambió');
    afirmar(/muy corta/.test(await pag.textContent('#aviso-lienzo')), 'sin aviso');
  });

  await paso('con el teclado, la punta de la línea se mueve con las flechas', async () => {
    const antes = (await estadoDemo(pag)).config.linea.a.x;
    await pag.focus('.manija[data-clave="a"]');
    for (let i = 0; i < 5; i++) await pag.keyboard.press('ArrowRight');
    await pag.keyboard.press('Shift+ArrowRight');
    const despues = (await estadoDemo(pag)).config.linea.a.x;
    afirmar(Math.abs(despues - antes - 0.1) < 0.005, `${antes} → ${despues}`);
  });

  await paso('«Invertir entrada y salida» cambia el sentido y el texto', async () => {
    const antes = (await estadoDemo(pag)).config.sentido;
    await pag.click('#invertir');
    const e = await estadoDemo(pag);
    afirmar(e.config.sentido === -antes, 'sentido igual');
    afirmar(/hacia la izquierda/.test(await pag.textContent('#sentido-texto')), await pag.textContent('#sentido-texto'));
    await pag.click('#invertir');
  });

  await paso('dibujar una zona de fila de 4 esquinas y cerrarla tocando la primera', async () => {
    await pag.check('input[name="modo"][value="zona"]');
    await pag.click('#zona-nueva');
    await videoALaVista(pag);
    const pts = [
      [0.1, 0.5],
      [0.4, 0.5],
      [0.4, 0.9],
      [0.1, 0.9],
    ];
    for (const [x, y] of pts) {
      const p = await puntoEnLienzo(pag, x, y);
      await pag.mouse.click(p.x, p.y);
    }
    afirmar(/Llevas 4 esquinas/.test(await pag.textContent('#ayuda-modo')), await pag.textContent('#ayuda-modo'));
    await pag.click('.manija[data-clave="n0"]');
    const z = (await estadoDemo(pag)).config.zona;
    afirmar(z && z.length === 4 && Math.abs(z[2].y - 0.9) < 0.02, JSON.stringify(z));
    await pag.screenshot({ path: path.join(CAPTURAS, '1280-claro-3-zona.png') });
  });

  await paso('una esquina de la zona se mueve con las flechas', async () => {
    const antes = (await estadoDemo(pag)).config.zona[0].y;
    await pag.focus('.manija[data-clave="z0"]');
    await pag.keyboard.press('ArrowDown');
    const despues = (await estadoDemo(pag)).config.zona[0].y;
    afirmar(Math.abs(despues - antes - 0.01) < 0.002, `${antes} → ${despues}`);
  });

  await paso('una zona nueva solo con el teclado: «Agregar una esquina», flechas y «Cerrar la zona»', async () => {
    const antes = (await estadoDemo(pag)).config.zona;
    await pag.focus('#zona-nueva');
    await pag.keyboard.press('Enter');
    for (let i = 0; i < 4; i++) {
      await pag.focus('#zona-esquina');
      await pag.keyboard.press('Enter');
      const foco = await pag.evaluate(() => document.activeElement && document.activeElement.dataset.clave);
      afirmar(foco === 'n' + i, `la esquina ${i + 1} no quedó enfocada (${foco})`);
      await pag.keyboard.press('ArrowDown');
    }
    await pag.focus('#zona-cerrar');
    await pag.keyboard.press('Enter');
    const z = (await estadoDemo(pag)).config.zona;
    afirmar(z.length === 4 && Math.abs(z[0].y - 0.31) < 0.005, JSON.stringify(z));
    // se deja la zona que se dibujó con el mouse, que es la que esperan los pasos siguientes
    await pag.focus('#zona-nueva');
    await pag.keyboard.press('Enter');
    await videoALaVista(pag);
    for (const p of antes) {
      const q = await puntoEnLienzo(pag, p.x, p.y);
      await pag.mouse.click(q.x, q.y);
    }
    await pag.click('#zona-cerrar');
    afirmar((await estadoDemo(pag)).config.zona.length === 4, 'no volvió a la zona de antes');
    await pag.check('input[name="modo"][value="ver"]');
  });

  await paso('un número inválido en los ajustes se marca, dice qué hacer y no se aplica', async () => {
    const antes = (await estadoDemo(pag)).config.filaSegundos;
    await pag.fill('#fila-segundos', '0');
    afirmar((await pag.getAttribute('#fila-segundos', 'aria-invalid')) === 'true', 'sin aria-invalid');
    afirmar(/entre 1 y 600/.test(await pag.textContent('#error-fila-segundos')), await pag.textContent('#error-fila-segundos'));
    afirmar((await estadoDemo(pag)).config.filaSegundos === antes, 'se aplicó un valor inválido');
    await pag.fill('#fila-segundos', '4');
    afirmar((await estadoDemo(pag)).config.filaSegundos === antes, 'se aplicó antes de confirmar');
    await pag.press('#fila-segundos', 'Enter');
    afirmar((await estadoDemo(pag)).config.filaSegundos === 4, 'no aplicó 4');
    afirmar(/durante 4 segundos seguidos/.test(await pag.textContent('#regla-fila')), await pag.textContent('#regla-fila'));
  });

  await paso('teclear 12 en el aforo no pasa por 1: no queda un «Aforo completo» falso', async () => {
    await pag.click('#pausar');
    for (let i = 0; i < 8; i++) if (await pag.isEnabled('#menos')) await pag.click('#menos');
    await pag.click('#mas');
    await pag.click('#mas');
    const antes = await pag.$$eval('#bitacora li', (l) => l.length);
    await pag.click('#aforo-max');
    await pag.keyboard.press('Control+A');
    await pag.keyboard.type('12', { delay: 80 });
    await pag.keyboard.press('Tab');
    const despues = await pag.$$eval('#bitacora li', (l) => l.length);
    afirmar((await estadoDemo(pag)).config.aforoMax === 12, 'no aplicó 12');
    afirmar(despues === antes, `la bitácora pasó de ${antes} a ${despues}`);
    await pag.click('#pausar');
  });

  await paso('aforo de 1 y +1: salta el aviso «Aforo completo» y queda en la bitácora', async () => {
    await pag.fill('#aforo-max', '1');
    await pag.press('#aforo-max', 'Enter');
    const e = await estadoDemo(pag);
    if (e.dentro === 0) await pag.click('#mas');
    await pag.waitForSelector('.alerta--aforo', { timeout: 5000 });
    afirmar(/Aforo completo/.test(await pag.textContent('.alerta--aforo')), 'texto del aviso');
    afirmar(/Aforo completo/.test(await pag.textContent('#bitacora')), 'bitácora vacía');
    await pag.screenshot({ path: path.join(CAPTURAS, '1280-claro-4-aforo.png') });
  });

  await paso('−1 baja el aforo y nunca de cero', async () => {
    for (let i = 0; i < 8; i++) if (await pag.isEnabled('#menos')) await pag.click('#menos');
    const e = await estadoDemo(pag);
    afirmar(e.dentro === 0 && (await pag.isDisabled('#menos')), JSON.stringify(e));
  });

  await paso('«Pixelar todo el video» y «Ver sin pixelar» cambian la vista', async () => {
    const huella = () => pag.evaluate(() => document.getElementById('lienzo').toDataURL('image/png').length);
    await pag.check('input[name="pixelado"][value="todo"]');
    await pag.waitForTimeout(800);
    await pag.locator('#lienzo').screenshot({ path: path.join(CAPTURAS, '1280-claro-lienzo-todo-pixelado.png') });
    const todo = await huella();
    await pag.check('input[name="pixelado"][value="nada"]');
    await pag.waitForTimeout(800);
    const nada = await huella();
    await pag.check('input[name="pixelado"][value="personas"]');
    // un cuadro entero en bloques comprime mucho más que el video sin tocar
    afirmar(todo < nada * 0.7, `PNG todo ${todo} vs nada ${nada}`);
  });

  await paso('el CSV del conteo por minuto se descarga con su encabezado', async () => {
    const [descarga] = await Promise.all([pag.waitForEvent('download'), pag.click('#csv')]);
    const ruta = path.join(TMP, 'conteo.csv');
    await descarga.saveAs(ruta);
    const texto = fs.readFileSync(ruta, 'utf8');
    afirmar(texto.startsWith('﻿minuto (hora local),entradas,salidas,fuente'), texto.slice(0, 80));
    return `${descarga.suggestedFilename()}, ${texto.trim().split('\n').length - 1} filas`;
  });

  await paso('«Reiniciar el conteo de hoy» deja todo en cero y «Deshacer» lo devuelve', async () => {
    const antes = await estadoDemo(pag);
    await pag.click('#reiniciar');
    const cero = await estadoDemo(pag);
    afirmar(cero.entradas === 0 && cero.salidas === 0, 'no quedó en cero');
    await pag.click('#deshacer');
    const despues = await estadoDemo(pag);
    afirmar(despues.entradas >= antes.entradas && despues.salidas >= antes.salidas, `${JSON.stringify(antes)} → ${JSON.stringify(despues)}`);
  });

  await paso('pausar detiene el análisis y seguir lo reanuda', async () => {
    await pag.click('#pausar');
    afirmar((await pag.getAttribute('#pausar', 'aria-pressed')) === 'true', 'aria-pressed');
    const t1 = await pag.evaluate(() => document.getElementById('video').currentTime);
    await pag.waitForTimeout(1500);
    const t2 = await pag.evaluate(() => document.getElementById('video').currentTime);
    afirmar(Math.abs(t2 - t1) < 0.05, 'el video siguió');
    await pag.click('#pausar');
  });

  await paso('la red: más de 60 s analizando, solo GET a este sitio, jsDelivr y Google Storage; nada sube', async () => {
    const falta = 70_000 - (Date.now() - inicio);
    if (falta > 0) await pag.waitForTimeout(falta); // MediaPipe intenta mandar estadísticas cada 60 s
    const raras = registro.peticiones.filter((r) => r.metodo !== 'GET' || r.cuerpo || !HOSTS_PERMITIDOS.has(new URL(r.url).host));
    afirmar(raras.length === 0, 'peticiones no permitidas: ' + raras.map((r) => `${r.metodo} ${r.url.slice(0, 80)}`).join(' | '));
    const hosts = {};
    for (const r of registro.peticiones) hosts[new URL(r.url).host] = (hosts[new URL(r.url).host] || 0) + 1;
    return `${registro.peticiones.length} peticiones en ${Math.round((Date.now() - inicio) / 1000)} s: ${JSON.stringify(hosts)}`;
  });

  await paso('«Apagar» vuelve a elegir fuente y guarda la configuración; al recargar sigue ahí', async () => {
    await pag.click('#apagar');
    afirmar((await esperarFase(pag, ['apagada'])) === 'apagada', 'no se apagó');
    // apagada: ningún aviso en pantalla y ninguno de fila queda abierto («(sigue)») en lo guardado
    afirmar(!(await pag.isVisible('.alerta')), 'quedó un aviso en pantalla con la demo apagada');
    const abiertos = await pag.evaluate(() => JSON.parse(localStorage.getItem('atk-camara')).fuentes.muestra.conteo.bitacora.filter((a) => a.tipo === 'fila' && a.fin === null).length);
    afirmar(abiertos === 0, `${abiertos} avisos de fila quedaron abiertos al apagar`);
    await pag.reload();
    await esperarFase(pag, ['apagada']);
    const c = await pag.evaluate(() => window.__camara.config);
    afirmar(c.zona.length === 4 && c.aforoMax === 1 && c.filaSegundos === 4, JSON.stringify(c));
    afirmar(/Hoy con el video de muestra van/.test(await pag.textContent('#resumen')), 'sin el resumen del día: ' + (await pag.textContent('#resumen')));
  });

  await paso('«Restablecer datos de ejemplo» vuelve a la línea y la zona de ejemplo', async () => {
    // los ajustes se ven con la demo encendida
    await pag.click('#encender-previa');
    afirmar((await esperarFase(pag, ['encendida', 'error'])) === 'encendida', 'no volvió a encender');
    await pag.click('#restablecer');
    const c = await pag.evaluate(() => window.__camara.config);
    afirmar(c.aforoMax === 4 && Math.abs(c.linea.a.x - 0.5) < 1e-9 && Math.abs(c.zona[0].x - 0.62) < 1e-9, JSON.stringify(c));
    afirmar(await pag.isVisible('#deshacer'), 'sin «Deshacer»');
  });

  await paso('la consola del recorrido principal no tiene errores', async () => {
    afirmar(registro.errores.length === 0, registro.errores.join(' | '));
  });
  await ctx.close();

  // ── 2. cámara falsa de Chromium (el video de muestra en MJPEG) ───────────────
  {
    const { pag, registro, ctx } = await abrir({ args: ARGS_CAMARA });
    await paso('con la cámara (falsa) del equipo: pide permiso, analiza y ajusta los avisos para probar solo', async () => {
      await pag.check('input[name="fuente"][value="camara"]');
      // los ajustes se ven al encender; antes, lo dice la opción misma
      afirmar(/avisos vienen ajustados/.test(await pag.textContent('#nota-fuente-camara')), 'al elegir la cámara no se explica que sus avisos vienen ajustados');
      await pag.click('#encender');
      const fase = await esperarFase(pag, ['encendida', 'error']);
      afirmar(fase === 'encendida', 'quedó en ' + fase + ': ' + (await pag.textContent('#falla')));
      await pag.waitForFunction(() => window.__camara.fps > 0, null, { timeout: 60_000 });
      await pag.waitForTimeout(12_000);
      const e = await estadoDemo(pag);
      afirmar(e.config.aforoMax === 1 && e.config.filaMax === 0, 'umbrales de cámara: ' + JSON.stringify(e.config));
      afirmar(await pag.isVisible('#nota-camara'), 'sin la nota de cámara');
      afirmar(/Pausar el análisis/.test(await pag.textContent('#pausar')), 'botón de pausa');
      await pag.screenshot({ path: path.join(CAPTURAS, '1280-claro-5-camara.png') });
      return `${e.fps.toFixed(1)} análisis/s, ${e.pistas} pistas, entradas ${e.entradas}, salidas ${e.salidas}`;
    });
    await paso('la consola con la cámara no tiene errores', async () => afirmar(registro.errores.length === 0, registro.errores.join(' | ')));
    await ctx.close();
  }

  // ── 3. subir un video propio ──────────────────────────────────────────────
  {
    const { pag, registro, ctx } = await abrir();
    await paso('un archivo que no es video se rechaza al elegirlo', async () => {
      await pag.check('input[name="fuente"][value="archivo"]');
      await pag.setInputFiles('#archivo', TEXTO);
      afirmar(/no es un video/.test(await pag.textContent('#error-archivo')), await pag.textContent('#error-archivo'));
    });
    await paso('un .mp4 roto da el error «No pudimos abrir ese video» con salidas', async () => {
      await pag.setInputFiles('#archivo', { name: 'roto.mp4', mimeType: 'video/mp4', buffer: fs.readFileSync(ROTO) });
      await pag.click('#encender');
      afirmar((await esperarFase(pag, ['error', 'encendida'], 60_000)) === 'error', 'no dio error');
      afirmar(/No pudimos abrir ese video/.test(await pag.textContent('#falla-titulo')), await pag.textContent('#falla-titulo'));
      await pag.click('#falla-acciones button:last-child');
    });
    await paso('subir un video propio (generado para la prueba) y analizarlo en local', async () => {
      await pag.setInputFiles('#archivo', SUBIDO);
      await pag.click('#encender');
      const fase = await esperarFase(pag, ['encendida', 'error']);
      afirmar(fase === 'encendida', 'quedó en ' + fase + ': ' + (await pag.textContent('#falla')));
      await pag.waitForFunction(() => window.__camara.fps > 0 && window.__camara.pistas.length > 0, null, { timeout: 60_000 });
      const e = await estadoDemo(pag);
      afirmar(/con tu video/.test(await pag.textContent('#cifras-fuente')), 'rótulo de la fuente');
      return `${e.pistas} pistas, ${e.fps.toFixed(1)} análisis/s`;
    });
    await paso('al subir, ningún byte del video sale del navegador', async () => {
      const subidas = registro.peticiones.filter((r) => r.metodo !== 'GET' || r.cuerpo);
      afirmar(subidas.length === 0, subidas.map((r) => r.url).join(' | '));
    });
    // el .mp4 roto genera errores de decodificación esperados en la consola; se filtran solo esos
    await paso('la consola al subir videos no tiene otros errores', async () => {
      const otros = registro.errores.filter((t) => !/roto|DEMUXER|PIPELINE_ERROR|Format error|MEDIA_ERR/i.test(t));
      afirmar(otros.length === 0, otros.join(' | '));
    });
    await ctx.close();
  }

  // ── 4. errores: permiso negado y sin modelo ─────────────────────────────────
  {
    const { pag, ctx } = await abrir({
      tema: 'dark',
      ancho: 390,
      alto: 844,
      escala: 2,
      antes: async (p) => {
        await p.addInitScript(() => {
          navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Permiso negado', 'NotAllowedError'));
        });
      },
    });
    await paso('cámara con permiso negado: dice qué pasó y qué hacer, con salidas', async () => {
      await pag.check('input[name="fuente"][value="camara"]');
      await pag.click('#encender');
      afirmar((await esperarFase(pag, ['error'], 30_000)) === 'error', 'sin error');
      afirmar(/No hay permiso para usar la cámara/.test(await pag.textContent('#falla-titulo')), await pag.textContent('#falla-titulo'));
      afirmar(/Usar el video de muestra/.test(await pag.textContent('#falla-acciones')), 'sin la salida a la muestra');
      await pag.locator('#demo').screenshot({ path: path.join(CAPTURAS, '390-oscuro-error-permiso.png') });
      await sinScrollHorizontal(pag);
    });
    await ctx.close();
  }
  {
    const { pag, ctx } = await abrir({
      antes: async (p) => {
        await p.route('https://storage.googleapis.com/**', (r) => r.abort('internetdisconnected'));
      },
    });
    await paso('sin poder bajar el modelo: lo dice y ofrece reintentar', async () => {
      await pag.click('#encender');
      afirmar((await esperarFase(pag, ['error'], 60_000)) === 'error', 'sin error');
      afirmar(/No se pudo bajar el modelo/.test(await pag.textContent('#falla-titulo')), await pag.textContent('#falla-titulo'));
      afirmar(/Volver a intentarlo/.test(await pag.textContent('#falla-acciones')), 'sin reintentar');
    });
    await ctx.close();
  }

  // ── 4b. sin JavaScript: se ve la captura y un aviso, sin controles muertos ──
  {
    const { pag, ctx } = await abrir({ ancho: 390, alto: 844, escala: 2, js: false });
    await paso('sin JavaScript: captura de la demo, aviso de qué hacer y ningún control que no funcione', async () => {
      await pag.waitForLoadState('load');
      const r = await pag.evaluate(() => ({
        aviso: [...document.querySelectorAll('.visor .aviso-demo')].some((e) => e.getBoundingClientRect().height > 0 && /JavaScript/.test(e.textContent)),
        previa: document.getElementById('previa').getBoundingClientRect().height,
        controles: ['arranque', 'herramientas', 'dibujo', 'encender-previa'].map((id) => document.getElementById(id).getBoundingClientRect().height),
        cifras: document.querySelector('.cifras').getBoundingClientRect().height,
      }));
      afirmar(r.aviso, 'sin aviso de JavaScript junto a la demo');
      afirmar(r.previa > 100, 'sin captura');
      afirmar(r.controles.every((h) => h === 0) && r.cifras === 0, 'se ven controles sin JavaScript: ' + JSON.stringify(r));
      await sinScrollHorizontal(pag);
      await pag.screenshot({ path: path.join(CAPTURAS, '390-claro-sin-js.png') });
    });
    await ctx.close();
  }

  // ── 5. capturas: 390 y 1280, claro y oscuro, apagada y encendida ────────────
  for (const [ancho, alto, escala] of [
    [390, 844, 2],
    [1280, 800, 1],
  ]) {
    for (const tema of ['light', 'dark']) {
      const nombre = `${ancho}-${tema === 'light' ? 'claro' : 'oscuro'}`;
      const { pag, registro, ctx } = await abrir({ ancho, alto, tema, escala, movimiento: tema === 'dark' ? 'reduce' : 'no-preference' });
      await paso(`${nombre}: apagada, encendida y página completa, sin scroll horizontal ni errores`, async () => {
        await esperarFase(pag, ['apagada']);
        await sinScrollHorizontal(pag);
        await pag.screenshot({ path: path.join(CAPTURAS, `${nombre}-apagada.png`) });
        await pag.click('#encender');
        afirmar((await esperarFase(pag, ['encendida', 'error'])) === 'encendida', 'no encendió');
        await pag.waitForFunction(() => window.__camara.fps > 0, null, { timeout: 60_000 });
        await pag.waitForTimeout(9000);
        await sinScrollHorizontal(pag);
        await pag.screenshot({ path: path.join(CAPTURAS, `${nombre}-encendida.png`) });
        // con la demo encendida, las entradas y salidas se ven en la misma pantalla que el video
        const cifras = await pag.evaluate(() => {
          const v = document.getElementById('escenario').getBoundingClientRect();
          const c = document.getElementById('c-salidas').getBoundingClientRect();
          return { videoArriba: v.top, cifrasAbajo: c.bottom, alto: innerHeight };
        });
        afirmar(cifras.videoArriba >= 0 && cifras.cifrasAbajo <= cifras.alto, 'el video y las cifras no caben juntos: ' + JSON.stringify(cifras));
        afirmar(!(await pag.getAttribute('#avisos', 'aria-live')), '#avisos no debe ser región viva (su texto cambia cada segundo)');
        await pag.screenshot({ path: path.join(CAPTURAS, `${nombre}-pagina.png`), fullPage: true });
        afirmar(registro.errores.length === 0, registro.errores.join(' | '));
      });
      if (ancho === 390 && tema === 'light') {
        await paso('390: objetivos táctiles de la demo de al menos 44 px', async () => {
          const chicos = await pag.evaluate(() =>
            // los enlaces dentro de una frase quedan fuera: WCAG 2.5.8 los exceptúa
            [...document.querySelectorAll('#demo button, #demo input, #demo summary, #demo label.modo, #demo label.fuente, #demo label.interruptor, .lab__servicios a, .lab__lateral .boton')]
              .filter((e) => e.offsetParent !== null && !(e.matches('input[type="radio"], input[type="checkbox"]')))
              .map((e) => ({ e: e.id || e.className || e.tagName, h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }))
              .filter((r) => r.h < 44 && !/manija/.test(r.e)),
          );
          afirmar(chicos.length === 0, JSON.stringify(chicos.slice(0, 6)));
        });
      }
      await ctx.close();
    }
  }
} finally {
  for (const n of navegadores) await n.close().catch(() => {});
  servidor.kill();
  fs.rmSync(TMP, { recursive: true, force: true });
}

const fallas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallas.length} de ${resultados.length} pasos bien. Capturas en ${CAPTURAS}`);
process.exitCode = fallas.length ? 1 : 0;
