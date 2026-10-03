// Recorrido en el navegador del tablero de sensores (Playwright, Chromium).
//
//   node pruebas/navegador/recorrido.mjs            (desde laboratorio/sensores/)
//
// Levanta su propio servidor estático sobre ~/alphateklab/repos (como GitHub Pages: /alphateklab/...)
// en el puerto 4830 si no hay uno, recorre la demo con clics reales a 390 y 1280 px, en claro y oscuro,
// y guarda capturas en pruebas/capturas/. Sale con código 1 si algo falla.
// Necesita Playwright: PLAYWRIGHT=/ruta/a/playwright/index.mjs (por defecto, el que indica el BRIEF).

import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raizDemo = resolve(aqui, '../..');
const raizRepos = resolve(raizDemo, '../../..');
const capturas = join(raizDemo, 'pruebas/capturas');
mkdirSync(capturas, { recursive: true });
const PUERTO = Number(process.env.PUERTO || 4830);
const BASE = `http://localhost:${PUERTO}/alphateklab/laboratorio/sensores/`;
const { chromium } = await import(process.env.PLAYWRIGHT || '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs');

const resultados = [];
let fallos = 0;
function ok(cond, que) {
  resultados.push(`${cond ? 'ok  ' : 'FALLA'} ${que}`);
  if (!cond) fallos++;
  return cond;
}
function nota(que) {
  resultados.push(`nota  ${que}`);
}

// ── servidor ──
let servidor = null;
async function hayServidor() {
  try {
    const r = await fetch(BASE);
    return r.ok;
  } catch {
    return false;
  }
}
if (!(await hayServidor())) {
  servidor = spawn('python3', ['-m', 'http.server', String(PUERTO), '-d', raizRepos], { stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hayServidor()); i++) await new Promise((r) => setTimeout(r, 150));
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function vigilarConsola(page, errores) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errores.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    // las conexiones largas al relevo se cortan al cerrar la página: no son un error de la demo
    if (!r.url().startsWith('https://ntfy.sh/')) errores.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`);
  });
}

async function sinDesborde(page, etiqueta) {
  const d = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok(d.sw <= d.cw, `${etiqueta}: sin scroll horizontal del cuerpo (${d.sw} ≤ ${d.cw})`);
}

async function burbujas(page) {
  return page.$$eval('#chat .burbuja', (bs) => bs.map((b) => b.innerText));
}

async function esperarBurbujas(page, n, ms = 30000) {
  await page.waitForFunction((n) => document.querySelectorAll('#chat .burbuja').length >= n, n, { timeout: ms });
}

async function irA(page, selector, margen = 150) {
  await page.evaluate(
    ([sel, m]) => {
      const el = document.querySelector(sel);
      scrollTo(0, el.getBoundingClientRect().top + scrollY - m);
    },
    [selector, margen],
  );
  await esperar(250);
}

// Contraste de texto medido con los colores calculados (fondo: el primer ancestro con fondo opaco).
async function contrastes(page, selectores) {
  return page.evaluate((sels) => {
    const rgb = (c) => (c.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const fondo = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c.length < 4 || c[3] > 0.95)) return c;
      }
      return [255, 255, 255];
    };
    const salida = [];
    for (const sel of sels) {
      const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null);
      if (!el) {
        salida.push({ sel, ratio: null });
        continue;
      }
      const cs = getComputedStyle(el);
      const color = rgb(cs.color);
      const f = fondo(el);
      const a = lum(color);
      const b = lum(f);
      salida.push({ sel, ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100 });
    }
    return salida;
  }, selectores);
}

const TEXTOS_A_MEDIR = [
  '.intro__linea', '.reloj__rotulo', '.consola__nota', '.falla__estado', '.nota', '.tira__nombre', '.tira__estado',
  '.tira__unidad', '.leyenda li', '.chat__sub', '.chat__vacio', '.bitacora .vacio', '.regla__situacion', '.campo span',
  '.equipo dd', '.aviso-demo', '.pie p', '.migas a', '.segmentos label > span', '.general',
];

async function objetivosTactiles(page) {
  return page.evaluate(() => {
    const chicos = [];
    for (const el of document.querySelectorAll('button, .boton, select, input:not([type="radio"]):not([type="checkbox"]), .segmentos label, .regla__activa, .opcion, summary')) {
      if (el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 43.5 || r.width < 43.5) chicos.push(`${el.tagName.toLowerCase()}.${el.className} ${Math.round(r.width)}×${Math.round(r.height)} «${(el.textContent || el.name || '').trim().slice(0, 30)}»`);
    }
    return chicos;
  });
}

// ── recorrido completo en una medida y un esquema ──
async function recorrido(browser, { ancho, alto, esquema, completo, tactil }) {
  const nombre = `${ancho}-${esquema === 'dark' ? 'oscuro' : 'claro'}`;
  const ctx = await browser.newContext({
    viewport: { width: ancho, height: alto },
    colorScheme: esquema,
    hasTouch: !!tactil,
    isMobile: !!tactil,
    deviceScaleFactor: 1,
    acceptDownloads: true,
  });
  const page = await ctx.newPage();
  const errores = [];
  vigilarConsola(page, errores);
  try {
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]', { timeout: 15000 });
    ok(true, `${nombre}: la demo arranca`);
    const reloj = await page.textContent('#reloj');
    ok(/10:3\d/.test(reloj), `${nombre}: el reloj arranca a las 10:30 del día 1 («${reloj}»)`);
    ok((await page.textContent('#general-texto')).includes('Todo en rango'), `${nombre}: estado general «Todo en rango»`);
    ok(await page.isVisible('#chat-vacio'), `${nombre}: el teléfono muestra su estado vacío`);
    ok(await page.isVisible('#bitacora-vacia'), `${nombre}: la bitácora muestra su estado vacío`);
    ok(!(await page.isVisible('#demo-error')), `${nombre}: sin el mensaje de error`);
    await sinDesborde(page, nombre);
    await page.screenshot({ path: join(capturas, `${nombre}-1-inicio.png`) });

    if (!completo) {
      // recorrido corto: falla y capturas
      await page.click('label:has(input[name="velocidad"][value="600"])');
      await page.click('.falla__boton[data-falla="puerta"]');
      await esperarBurbujas(page, 2);
      await page.click('#pausa');
      await irA(page, '#registro-titulo', ancho < 700 ? 70 : 180);
      await page.screenshot({ path: join(capturas, `${nombre}-2-falla-puerta.png`) });
      await irA(page, '#telefono', 180);
      await page.screenshot({ path: join(capturas, `${nombre}-3-telefono.png`) });
      await page.screenshot({ path: join(capturas, `${nombre}-pagina-completa.png`), fullPage: true });
      await sinDesborde(page, `${nombre} con avisos`);
      const medidas = await contrastes(page, TEXTOS_A_MEDIR);
      const bajos = medidas.filter((m) => m.ratio !== null && m.ratio < 4.5);
      ok(bajos.length === 0, `${nombre}: contraste ≥ 4.5:1 en ${medidas.filter((m) => m.ratio !== null).length} textos medidos${bajos.length ? ` (bajos: ${JSON.stringify(bajos)})` : ''}`);
      return errores;
    }

    // 1. Falla: puerta de la nevera abierta → avisos
    await page.click('label:has(input[name="velocidad"][value="600"])');
    ok((await page.textContent('#velocidad-nota')).includes('diez minutos'), `${nombre}: ×600 explica su ritmo`);
    await page.click('.falla__boton[data-falla="puerta"]');
    ok((await page.textContent('.falla__boton[data-falla="puerta"]')).includes('Cerrar la puerta'), `${nombre}: el botón pasa a «Cerrar la puerta de la nevera»`);
    await esperarBurbujas(page, 2);
    const b1 = await burbujas(page);
    ok(b1[0].includes('Puerta de la nevera') && b1[0].includes('abierta'), `${nombre}: primer aviso, la puerta («${b1[0].split(/\n+/)[1]}»)`);
    ok(b1[1].includes('Nevera de la cocina') && /por encima de 5\s°C/.test(b1[1]), `${nombre}: segundo aviso, la temperatura («${b1[1].split(/\n+/)[1]}»)`);
    await page.click('#pausa');
    ok((await page.textContent('#general-texto')).includes('2 avisos activos'), `${nombre}: estado general con 2 avisos`);
    ok((await page.$$('#bitacora tr')).length === 2, `${nombre}: 2 filas en la bitácora`);
    ok((await page.textContent('[data-tira="nevera"] [data-estado]')).includes('aviso'), `${nombre}: la tira de la nevera dice «aviso»`);
    ok((await page.$$('[data-tira="nevera"] .g-linea--fuera')).length === 1, `${nombre}: la línea fuera de rango se repinta en rojo`);
    ok((await page.$$('[data-tira="nevera"] .g-tramo-aviso')).length >= 1, `${nombre}: el tramo del aviso está marcado`);
    ok((await page.$$('[data-tira="fallas"] .g-falla')).length === 1, `${nombre}: la falla aparece en la tira de fallas`);
    await irA(page, '#registro-titulo', ancho < 700 ? 70 : 180);
    await page.screenshot({ path: join(capturas, `${nombre}-2-falla-puerta.png`) });

    // 2. Cursor: puntero (o dedo) y teclado
    const caja = await page.locator('#registrador').boundingBox();
    if (tactil) {
      await page.touchscreen.tap(caja.x + caja.width * 0.4, caja.y + 160);
    } else {
      await page.mouse.move(caja.x + caja.width * 0.4, caja.y + 160);
    }
    await esperar(300);
    const lectura = await page.textContent('#lectura');
    ok(lectura.startsWith('Lectura de ') && !lectura.includes('ahora'), `${nombre}: el cursor lee otro momento («${lectura}»)`);
    ok((await page.$$('[data-tira="nevera"] .g-cursor')).length === 1, `${nombre}: el cursor se dibuja en las tiras`);
    await page.screenshot({ path: join(capturas, `${nombre}-3-cursor.png`) });
    if (tactil) {
      ok(await page.isVisible('#volver-ahora'), `${nombre}: con el dedo el cursor queda fijo y aparece «Volver a ahora»`);
      await page.click('#volver-ahora');
    } else {
      await page.mouse.move(5, 5);
    }
    await esperar(250);
    ok((await page.textContent('#lectura')).includes('ahora'), `${nombre}: el cursor vuelve a ahora`);
    await page.focus('#registrador');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Shift+ArrowLeft');
    await esperar(500);
    const conTeclado = await page.textContent('#lectura');
    ok(conTeclado.includes('hace 11'), `${nombre}: con el teclado retrocede 11 min («${conTeclado}»)`);
    ok((await page.textContent('#registrador-anuncio')).length > 20, `${nombre}: el lector de pantalla recibe la lectura del cursor`);
    await page.keyboard.press('Escape');
    await esperar(200);
    ok((await page.textContent('#lectura')).includes('ahora'), `${nombre}: Escape vuelve a ahora`);

    // 3. Cerrar la puerta → avisos resueltos
    await page.click('#pausa');
    await page.click('.falla__boton[data-falla="puerta"]');
    await esperarBurbujas(page, 4, 60000);
    const b2 = await burbujas(page);
    ok(b2.slice(2).every((t) => t.includes('Resuelto')), `${nombre}: llegan los dos «Resuelto»`);
    await page.waitForFunction(() => document.querySelector('#general-texto').textContent.includes('Todo en rango'), null, { timeout: 10000 });
    ok(true, `${nombre}: el estado general vuelve a «Todo en rango»`);
    await page.click('#pausa');
    await irA(page, '#telefono', 180);
    await page.screenshot({ path: join(capturas, `${nombre}-4-telefono.png`) });

    // 4. Tabla equivalente
    await page.click('#ver-tabla');
    const filas = await page.$$('#tabla-cuerpo tr');
    ok(filas.length >= 20, `${nombre}: la tabla equivalente tiene ${filas.length} renglones`);
    ok((await page.$$('#tabla-cuerpo .celda-fuera')).length >= 1, `${nombre}: la tabla marca lo que quedó fuera de rango`);
    await irA(page, '#tabla', 120);
    await page.screenshot({ path: join(capturas, `${nombre}-5-tabla.png`) });
    await page.click('#ver-tabla');

    // 5. Reglas: editar, error, agregar y quitar
    const reglaNevera = page.locator('#reglas .regla[data-regla="r1"]');
    ok(!(await reglaNevera.locator('input[name="max"]').isVisible()), `${nombre}: los campos de cada regla empiezan plegados`);
    await reglaNevera.locator('.regla__editar').click();
    ok((await reglaNevera.locator('.regla__editar').getAttribute('aria-expanded')) === 'true', `${nombre}: «Cambiar» despliega los campos (aria-expanded)`);
    await reglaNevera.locator('input[name="max"]').fill('3');
    await reglaNevera.locator('input[name="max"]').press('Tab');
    ok(/fuera de 0 a 3\s°C/.test(await reglaNevera.locator('.regla__texto').textContent()), `${nombre}: editar el máximo cambia la regla`);
    await reglaNevera.locator('input[name="min"]').fill('9');
    await reglaNevera.locator('input[name="min"]').press('Tab');
    ok((await reglaNevera.locator('.error').textContent()).includes('El mínimo tiene que ser menor que el máximo'), `${nombre}: un mínimo mayor que el máximo muestra el error`);
    ok((await reglaNevera.locator('input[name="min"]').getAttribute('aria-invalid')) === 'true', `${nombre}: el campo con error queda marcado (aria-invalid)`);
    await reglaNevera.locator('input[name="min"]').fill('0');
    await reglaNevera.locator('input[name="min"]').press('Tab');
    await reglaNevera.locator('input[name="max"]').fill('5');
    await reglaNevera.locator('input[name="max"]').press('Tab');
    ok((await reglaNevera.locator('.error').textContent()) === '', `${nombre}: al corregirlo el error desaparece`);
    await page.selectOption('#nueva-sensor', 'humedad');
    await page.fill('#nueva-regla input[name="max"]', '60');
    await page.fill('#nueva-regla input[name="minutos"]', '5');
    await page.click('#nueva-regla button[type="submit"]');
    const nueva = page.locator('#reglas .regla[data-regla="r11"]');
    ok(/Humedad de la bodega por encima de 60\s%/.test(await nueva.locator('.regla__texto').textContent()), `${nombre}: la regla nueva aparece en la lista`);
    await page.selectOption('#nueva-sensor', 'nevera');
    await page.fill('#nueva-regla input[name="minutos"]', '0');
    await page.click('#nueva-regla button[type="submit"]');
    ok((await page.textContent('#nueva-error')).length > 10, `${nombre}: agregar una regla sin límites ni minutos válidos explica qué falta`);
    await irA(page, '#reglas-titulo', 100);
    await page.screenshot({ path: join(capturas, `${nombre}-6-reglas.png`) });
    await nueva.locator('.regla__editar').click();
    await nueva.locator('.regla__quitar').click();
    ok((await page.$$('#reglas .regla[data-regla="r11"]')).length === 0, `${nombre}: «Quitar» borra la regla`);

    // 6. CSV
    await page.click('.muestra-csv summary');
    await page.waitForFunction(() => document.querySelector('#csv-muestra').textContent.length > 0, null, { timeout: 5000 });
    const muestra = await page.textContent('#csv-muestra');
    ok(muestra.startsWith('Datos simulados de un restaurante ficticio'), `${nombre}: el CSV dice en su primera fila que los datos son simulados`);
    ok(muestra.includes('\r\nFecha,Hora,Nevera de la cocina (°C),Cuarto frío (°C),Congelador (°C)') || muestra.includes('\nFecha,Hora,Nevera de la cocina (°C),Cuarto frío (°C),Congelador (°C)'), `${nombre}: la vista previa del CSV trae el encabezado`);
    const [descarga] = await Promise.all([page.waitForEvent('download'), page.click('#descargar')]);
    const ruta = await descarga.path();
    const csv = readFileSync(ruta, 'utf8');
    const lineas = csv.trim().split('\r\n');
    ok(csv.startsWith('\ufeff') && descarga.suggestedFilename().startsWith('temperaturas-restaurante-de-ejemplo-'), `${nombre}: el CSV se descarga con BOM y nombre ${descarga.suggestedFilename()}`);
    ok(lineas[0].replace('\ufeff', '').startsWith('Datos simulados') && lineas[1].startsWith('Fecha,Hora'), `${nombre}: el archivo empieza con la nota de datos simulados y el encabezado`);
    ok(lineas.length >= 90 && lineas.slice(2).every((l) => /^\d{4}-\d\d-\d\d,\d\d:\d\d,-?\d/.test(l)), `${nombre}: ${lineas.length - 2} filas de lecturas con fecha, hora y números`);
    ok(lineas.some((l) => l.includes('Nevera de la cocina; Puerta de la nevera') || l.includes('Nevera de la cocina')), `${nombre}: el CSV marca la nevera fuera de rango`);
    await irA(page, '#exportar-titulo', 100);
    await page.screenshot({ path: join(capturas, `${nombre}-7-exportar.png`) });

    // 7. Recargar: lo hecho sigue ahí
    const antes = await page.textContent('#reloj');
    await page.reload();
    await page.waitForSelector('#demo[data-estado="lista"]');
    const filasBitacora = (await page.$$('#bitacora tr')).length;
    ok(filasBitacora >= 2, `${nombre}: tras recargar, la bitácora conserva ${filasBitacora} avisos`);
    const despues = await page.textContent('#reloj');
    const minutos = (t) => {
      const [h, m] = t.slice(-5).split(':').map(Number);
      return h * 60 + m;
    };
    const salto = minutos(despues) - minutos(antes);
    ok(despues.slice(0, -6) === antes.slice(0, -6) && salto >= 0 && salto <= 10, `${nombre}: el reloj sigue donde iba (${antes} → ${despues})`);
    ok((await page.$$('#reglas .regla')).length === 10, `${nombre}: tras recargar quedan las 10 reglas`);
    ok((await burbujas(page)).length >= 4, `${nombre}: el teléfono vuelve a mostrar los mensajes`);

    // 8. Las otras tres fallas
    await page.click('label:has(input[name="velocidad"][value="600"])');
    const n0 = (await burbujas(page)).length;
    await page.click('.falla__boton[data-falla="corte"]');
    await esperarBurbujas(page, n0 + 1);
    ok((await burbujas(page))[n0].includes('sin corriente'), `${nombre}: el corte avisa «sin corriente»`);
    await page.waitForFunction(() => document.querySelector('[data-tira="energia"] [data-estado]').textContent.includes('sin corriente'), null, { timeout: 5000 });
    ok(true, `${nombre}: la tira de consumo dice «sin corriente»`);
    ok((await page.textContent('.falla__boton[data-falla="corte"]')).includes('Devolver la corriente'), `${nombre}: el corte ofrece devolver la corriente`);
    await page.click('#pausa');
    await irA(page, '#registro-titulo', ancho < 700 ? 70 : 180);
    await page.screenshot({ path: join(capturas, `${nombre}-8-corte.png`) });
    await page.click('#pausa');
    await page.click('.falla__boton[data-falla="corte"]');
    await page.waitForFunction(() => [...document.querySelectorAll('#chat .burbuja')].some((b) => b.innerText.includes('Volvió la corriente')), null, { timeout: 30000 });
    ok(true, `${nombre}: al devolver la corriente llega «Volvió la corriente»`);
    await page.click('.falla__boton[data-falla="fuga"]');
    await page.waitForFunction(() => [...document.querySelectorAll('#chat .burbuja')].some((b) => b.innerText.includes('Tanque de agua:')), null, { timeout: 40000 });
    ok(true, `${nombre}: la fuga avisa el tanque bajo`);
    await page.click('.falla__boton[data-falla="fuga"]');
    await page.click('.falla__boton[data-falla="compresora"]');
    await page.waitForFunction(() => [...document.querySelectorAll('#chat .burbuja')].some((b) => b.innerText.includes('Vibración de la compresora')), null, { timeout: 30000 });
    ok(true, `${nombre}: la compresora dañada avisa por vibración`);
    await page.click('.falla__boton[data-falla="compresora"]');
    await page.click('#pausa');
    await page.screenshot({ path: join(capturas, `${nombre}-pagina-completa.png`), fullPage: true });
    await sinDesborde(page, `${nombre} con muchos avisos`);

    // 9. Contraste y objetivos táctiles
    const medidas = await contrastes(page, TEXTOS_A_MEDIR);
    const bajos = medidas.filter((m) => m.ratio !== null && m.ratio < 4.5);
    ok(bajos.length === 0, `${nombre}: contraste ≥ 4.5:1 en ${medidas.filter((m) => m.ratio !== null).length} textos medidos${bajos.length ? ` (bajos: ${JSON.stringify(bajos)})` : ''}`);
    const chicos = await objetivosTactiles(page);
    ok(chicos.length === 0, `${nombre}: objetivos táctiles ≥ 44 px${chicos.length ? ` (chicos: ${chicos.join('; ')})` : ''}`);

    // 10. Restablecer
    await page.click('#restablecer');
    await page.click('#restablecer-si');
    await esperar(300);
    ok(/10:3\d/.test(await page.textContent('#reloj')), `${nombre}: «Restablecer» vuelve a las 10:30`);
    ok(await page.isVisible('#bitacora-vacia'), `${nombre}: «Restablecer» vacía la bitácora`);
    ok(await page.isVisible('#chat-vacio'), `${nombre}: «Restablecer» vacía el teléfono`);
    ok((await page.textContent('.falla__boton[data-falla="puerta"]')).includes('Dejar la puerta'), `${nombre}: «Restablecer» quita las fallas`);
  } catch (e) {
    ok(false, `${nombre}: el recorrido se cortó: ${e.message.split('\n')[0]}`);
    try {
      await page.screenshot({ path: join(capturas, `${nombre}-error.png`), fullPage: true });
    } catch {
      /* sin captura */
    }
  } finally {
    await ctx.close();
  }
  return errores;
}

// ── relevo entre dispositivos (ntfy.sh de verdad: el teléfono va en otro contexto, sin BroadcastChannel) ──
async function relevo(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const tel = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errores = [];
  try {
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]');
    await page.click('#mi-telefono');
    ok(await page.isVisible('#relevo'), 'relevo: el panel del teléfono se abre');
    ok((await page.textContent('.relevo__aviso')).startsWith('Modo demostración entre dispositivos: los datos pasan por un servidor público de pruebas (ntfy.sh). No escribas datos reales.'), 'relevo: el aviso de ntfy.sh tiene el texto exacto');
    await page.waitForSelector('#relevo-qr svg path', { timeout: 15000 }).then(
      () => ok(true, 'relevo: el código QR se dibuja (qrcode-generator 1.4.4 desde jsDelivr)'),
      () => ok(false, 'relevo: el código QR no se dibujó'),
    );
    const enlace = await page.getAttribute('#relevo-enlace', 'href');
    const sala = await page.textContent('#relevo-sala');
    ok(/telefono\.html#[a-z0-9]{10}$/.test(enlace) && enlace.endsWith(sala), `relevo: enlace con la sala (${sala})`);
    await irA(page, '#telefono', 180);
    await page.screenshot({ path: join(capturas, 'relevo-tablero.png') });

    const p2 = await tel.newPage();
    vigilarConsola(p2, errores);
    await p2.goto(enlace);
    const conectado = await p2
      .waitForFunction(() => document.querySelector('#estado').dataset.tipo === 'ok', null, { timeout: 20000 })
      .then(() => true, () => false);
    if (!conectado) {
      nota(`relevo: ntfy.sh no respondió desde aquí (estado del teléfono: «${await p2.textContent('#estado')}»); no se pudo comprobar entre dispositivos`);
      return errores;
    }
    ok(true, 'relevo: el teléfono se conecta a la sala por ntfy.sh');
    const saludo = await page
      .waitForFunction(() => document.querySelector('#relevo-estado').dataset.tipo === 'ok', null, { timeout: 20000 })
      .then(() => true, () => false);
    ok(saludo, 'relevo: el tablero se entera de que el teléfono se conectó');
    await page.click('#relevo-prueba');
    const prueba = await p2
      .waitForFunction(() => [...document.querySelectorAll('#chat .burbuja')].some((b) => b.innerText.includes('Prueba')), null, { timeout: 20000 })
      .then(() => true, () => false);
    ok(prueba, 'relevo: el aviso de prueba llega al teléfono');
    await page.click('label:has(input[name="velocidad"][value="600"])');
    await page.click('.falla__boton[data-falla="puerta"]');
    const real = await p2
      .waitForFunction(() => [...document.querySelectorAll('#chat .burbuja')].some((b) => b.innerText.includes('Puerta de la nevera')), null, { timeout: 30000 })
      .then(() => true, () => false);
    ok(real, 'relevo: el aviso de la puerta llega al teléfono');
    await p2.screenshot({ path: join(capturas, 'relevo-telefono-390.png') });
    await page.click('#relevo-apagar');
    ok(!(await page.isVisible('#relevo')), 'relevo: «Dejar de enviar» cierra el panel');
  } catch (e) {
    ok(false, `relevo: se cortó: ${e.message.split('\n')[0]}`);
  } finally {
    await tel.close();
    await ctx.close();
  }
  return errores;
}

async function telefonoSinSala(browser, esquema) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: esquema, hasTouch: true, isMobile: true });
  const errores = [];
  try {
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(`${BASE}telefono.html`);
    ok(await page.isVisible('#sala-form'), `teléfono (${esquema}): sin sala pide el código`);
    await page.fill('#sala-codigo', '123');
    await page.click('#sala-form button[type="submit"]');
    ok((await page.textContent('#sala-error')).includes('10 letras'), `teléfono (${esquema}): un código corto explica cómo es`);
    await sinDesborde(page, `teléfono (${esquema})`);
    await page.screenshot({ path: join(capturas, `telefono-390-${esquema === 'dark' ? 'oscuro' : 'claro'}.png`), fullPage: true });
  } finally {
    await ctx.close();
  }
  return errores;
}

async function sinJS(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  try {
    const page = await ctx.newPage();
    await page.goto(BASE);
    ok(await page.isVisible('.demo__sinjs'), 'sin JavaScript: dice que la demo lo necesita');
    ok(!(await page.isVisible('.demo__rejilla')) && !(await page.isVisible('#velocidad-nota')), 'sin JavaScript: no muestra controles que no funcionan ni promete «Cargando…»');
    ok(await page.isVisible('h1') && (await page.isVisible('.ficha')), 'sin JavaScript: el título y la explicación se ven');
    await page.screenshot({ path: join(capturas, 'sin-js-390.png'), fullPage: true });
  } finally {
    await ctx.close();
  }
}

async function sinAlmacenamiento(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const errores = [];
  try {
    await ctx.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('bloqueado');
        },
      });
    });
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]', { timeout: 15000 });
    await page.click('.falla__boton[data-falla="puerta"]');
    await esperar(400);
    ok(true, 'sin localStorage: la demo arranca y responde');
    ok((await page.textContent('.restablecer')).includes('no deja guardar'), 'sin localStorage: avisa que al recargar empieza de cero');
  } catch (e) {
    ok(false, `sin localStorage: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
  return errores;
}

async function movimientoReducido(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errores = [];
  try {
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]');
    await page.click('label:has(input[name="velocidad"][value="600"])');
    await page.click('.falla__boton[data-falla="puerta"]');
    await esperarBurbujas(page, 1);
    const dur = await page.$eval('#chat .burbuja', (b) => getComputedStyle(b).animationDuration);
    ok(dur === '0.12s', `movimiento reducido: la burbuja solo funde (${dur})`);
  } finally {
    await ctx.close();
  }
  return errores;
}

// El final de la simulación (día 7): los controles quedan desactivados y la página lo dice.
async function finDeLaSimulacion(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const errores = [];
  try {
    const { T_LIMITE } = await import('../../js/nucleo/motor.mjs');
    const guardado = JSON.stringify({ v: 1, semilla: 20261003, acciones: [], t: T_LIMITE - 600, velocidad: 600, ventana: 6, baseISO: '2026-10-03', sala: null });
    await ctx.addInitScript((g) => {
      if (!sessionStorage.getItem('sembrado')) {
        localStorage.setItem('atk-sensores', g);
        sessionStorage.setItem('sembrado', '1');
      }
    }, guardado);
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]', { timeout: 20000 });
    await page.waitForFunction(() => document.querySelector('#velocidad-nota').textContent.includes('final del día 7'), null, { timeout: 15000 });
    ok(true, 'fin: la nota dice que la simulación llegó al final del día 7');
    ok(await page.isDisabled('.falla__boton[data-falla="puerta"]'), 'fin: las fallas quedan desactivadas');
    ok(await page.isDisabled('#pausa'), 'fin: «Pausar» queda desactivado');
    ok((await page.textContent('#general-texto')).includes('Fin de la simulación'), 'fin: el estado general lo dice');
    ok((await page.textContent('#reloj')).includes('vie 9 oct, 23:59') || (await page.textContent('#reloj')).includes('sáb 10 oct, 00:00'), `fin: el reloj se detiene al final del día 7 («${await page.textContent('#reloj')}»)`);
    await page.click('#restablecer');
    await page.click('#restablecer-si');
    ok(!(await page.isDisabled('.falla__boton[data-falla="puerta"]')), 'fin: «Restablecer» vuelve a activar todo');
    await page.screenshot({ path: join(capturas, 'fin-390.png') });
  } catch (e) {
    ok(false, `fin: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
  return errores;
}

// Los enlaces de la ficha llevan a páginas que existen en el sitio de ahora (cotizador y fichas del catálogo).
async function enlacesAlSitio(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const errores = [];
  try {
    const page = await ctx.newPage();
    vigilarConsola(page, errores);
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]');
    await page.click('.ficha__cotizar');
    await page.waitForLoadState('load');
    const u = new URL(page.url());
    ok(u.pathname === '/alphateklab/cotizar/' && u.searchParams.get('servicio') === 'I01', `enlaces: «Cotizar este servicio» abre el cotizador con I01 (${u.pathname}${u.search})`);
    ok((await page.textContent('body')).includes('Tablero de sensores'), 'enlaces: el cotizador muestra el servicio elegido');
    await page.goto(BASE);
    await page.click('.servicios a[href="../../servicios/tablero-de-sensores/"]');
    await page.waitForLoadState('load');
    ok((await page.textContent('h1')).length > 3 && new URL(page.url()).pathname === '/alphateklab/servicios/tablero-de-sensores/', 'enlaces: I01 abre su ficha del catálogo');
    await page.goto(BASE);
    await page.click('.migas a[href="../"]');
    await page.waitForLoadState('load');
    ok(new URL(page.url()).pathname === '/alphateklab/laboratorio/', 'enlaces: las migas llevan al laboratorio');
  } catch (e) {
    ok(false, `enlaces: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
  return errores;
}

// Dos pestañas del tablero y el teléfono en una tercera: la falla de una pestaña llega a la otra, y después de
// «Restablecer» el teléfono sigue recibiendo los avisos (los ids cambian con la partida).
async function pestanas(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const errores = [];
  try {
    const a = await ctx.newPage();
    const b = await ctx.newPage();
    const tel = await ctx.newPage();
    for (const p of [a, b, tel]) vigilarConsola(p, errores);
    await tel.goto(`${BASE}telefono.html`);
    await a.goto(BASE);
    await a.waitForSelector('#demo[data-estado="lista"]');
    await b.goto(BASE);
    await b.waitForSelector('#demo[data-estado="lista"]');
    await a.click('.falla__boton[data-falla="fuga"]');
    await b.waitForFunction(() => document.querySelector('.falla__boton[data-falla="fuga"]').textContent.includes('Reparar'), null, { timeout: 8000 });
    ok(true, 'pestañas: la falla provocada en una pestaña aparece en la otra');
    await a.waitForTimeout(3500);
    const guardadas = await a.evaluate(() => JSON.parse(localStorage.getItem('atk-sensores')).acciones.length);
    ok(guardadas === 1, `pestañas: ninguna pisa la falla de la otra (${guardadas} acción guardada)`);
    await a.click('.falla__boton[data-falla="fuga"]');
    await b.close();
    await a.locator('label:has(input[name="velocidad"][value="600"])').click();
    await a.click('.falla__boton[data-falla="puerta"]');
    await tel.waitForFunction(() => document.querySelectorAll('#chat .burbuja').length >= 1, null, { timeout: 20000 });
    const antes = await tel.$$eval('#chat .burbuja', (x) => x.length);
    await a.click('#restablecer');
    await a.click('#restablecer-si');
    await a.locator('label:has(input[name="velocidad"][value="600"])').click();
    await a.click('.falla__boton[data-falla="puerta"]');
    await tel.waitForFunction((n) => document.querySelectorAll('#chat .burbuja').length > n, antes, { timeout: 20000 });
    ok(true, 'pestañas: después de restablecer, el aviso nuevo llega al teléfono');
  } catch (e) {
    ok(false, `pestañas: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
  return errores;
}

// Si un módulo de la demo no carga, la página lo dice en vez de quedarse en «Cargando…».
async function moduloRoto(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    await ctx.route('**/js/nucleo/simulador.mjs', (r) => r.fulfill({ status: 404, body: '' }));
    const page = await ctx.newPage();
    await page.goto(BASE);
    ok(await page.isDisabled('#mi-telefono'), 'módulo roto: «Recibir los avisos en mi teléfono» empieza desactivado');
    await page.waitForSelector('#demo-error:not([hidden])', { timeout: 12000 });
    ok((await page.textContent('#demo-error')).includes('No se pudieron cargar los archivos de la demo'), 'módulo roto: a los 8 s sale el error con qué hacer');
    await page.screenshot({ path: join(capturas, 'modulo-roto-390.png') });
  } catch (e) {
    ok(false, `módulo roto: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
}

// Con Shift+Tab, el elemento enfocado no queda debajo de la cabecera ni de la consola fija (WCAG 2.4.11).
async function focoNoTapado(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  try {
    const page = await ctx.newPage();
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]');
    await page.click('#pausa');
    for (const b of await page.$$('#reglas .regla__editar')) await b.click();
    await page.focus('#restablecer');
    let tapados = 0;
    let pasos = 0;
    const ejemplos = [];
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Shift+Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const c = el.getBoundingClientRect();
        if (c.width === 0) return null;
        const x = Math.min(innerWidth - 1, Math.max(0, c.left + c.width / 2));
        const y = c.top + c.height / 2;
        if (y < 0 || y > innerHeight) return { fuera: true };
        const arriba = document.elementFromPoint(x, y);
        const tapa = arriba && arriba.closest('.consola, .cabecera') && !el.closest('.consola, .cabecera');
        return { tapa: !!tapa, que: `${el.tagName}${el.name ? `[${el.name}]` : ''}#${el.id}` };
      });
      if (!r) continue;
      pasos++;
      if (r.tapa || r.fuera) {
        tapados++;
        ejemplos.push(r.que || 'fuera');
      }
      if (await page.evaluate(() => document.activeElement?.closest('.consola'))) break;
    }
    ok(tapados === 0, `foco: ningún elemento enfocado queda tapado al retroceder con Shift+Tab (${tapados} de ${pasos}${ejemplos.length ? `: ${ejemplos.slice(0, 4).join(', ')}` : ''})`);
  } catch (e) {
    ok(false, `foco: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
}

// El tope del registro: con 600 acciones, la página lo dice y no deja agregar otra (se seguiría leyendo al volver).
async function topeDeAcciones(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const { T_INICIO } = await import('../../js/nucleo/motor.mjs');
    const acciones = Array.from({ length: 599 }, (_, i) => ({ t: T_INICIO + 10 * Math.floor(i / 2), tipo: 'falla', falla: 'fuga', activa: i % 2 === 1 }));
    const guardado = JSON.stringify({ v: 1, semilla: 20261003, acciones, t: T_INICIO + 3600, velocidad: 60, ventana: 6, baseISO: '2026-10-03', sala: null, partida: 'tope0001' });
    await ctx.addInitScript((g) => {
      if (!sessionStorage.getItem('sembrado')) {
        localStorage.setItem('atk-sensores', g);
        sessionStorage.setItem('sembrado', '1');
      }
    }, guardado);
    const page = await ctx.newPage();
    await page.goto(BASE);
    await page.waitForSelector('#demo[data-estado="lista"]');
    ok((await page.textContent('.falla__boton[data-falla="fuga"]')).includes('Provocar'), 'tope: se recuperan 599 acciones');
    await page.click('#pausa');
    await page.click('.falla__boton[data-falla="fuga"]');
    ok(await page.isVisible('#tope-acciones'), 'tope: al llegar a 600 la página lo dice');
    ok(await page.isDisabled('.falla__boton[data-falla="puerta"]'), 'tope: las fallas quedan desactivadas');
    await page.reload();
    await page.waitForSelector('#demo[data-estado="lista"]');
    ok((await page.textContent('.falla__boton[data-falla="fuga"]')).includes('Reparar'), 'tope: al recargar se recupera todo (600 acciones)');
  } catch (e) {
    ok(false, `tope: ${e.message.split('\n')[0]}`);
  } finally {
    await ctx.close();
  }
}

// ── correr ──
const browser = await chromium.launch();
const todosLosErrores = [];
try {
  todosLosErrores.push(...(await recorrido(browser, { ancho: 1280, alto: 800, esquema: 'light', completo: true })));
  todosLosErrores.push(...(await recorrido(browser, { ancho: 390, alto: 844, esquema: 'light', completo: true, tactil: true })));
  todosLosErrores.push(...(await recorrido(browser, { ancho: 1280, alto: 800, esquema: 'dark', completo: false })));
  todosLosErrores.push(...(await recorrido(browser, { ancho: 390, alto: 844, esquema: 'dark', completo: false, tactil: true })));
  todosLosErrores.push(...(await telefonoSinSala(browser, 'light')));
  todosLosErrores.push(...(await telefonoSinSala(browser, 'dark')));
  await sinJS(browser);
  todosLosErrores.push(...(await sinAlmacenamiento(browser)));
  todosLosErrores.push(...(await movimientoReducido(browser)));
  todosLosErrores.push(...(await finDeLaSimulacion(browser)));
  todosLosErrores.push(...(await enlacesAlSitio(browser)));
  todosLosErrores.push(...(await pestanas(browser)));
  await moduloRoto(browser);
  await focoNoTapado(browser);
  await topeDeAcciones(browser);
  if (!process.env.SIN_RELEVO) todosLosErrores.push(...(await relevo(browser)));
  else nota('relevo: omitido (SIN_RELEVO)');
} finally {
  await browser.close();
  if (servidor) servidor.kill();
}
ok(todosLosErrores.length === 0, `consola sin errores ni avisos${todosLosErrores.length ? `: ${todosLosErrores.join(' | ')}` : ''}`);

console.log(resultados.join('\n'));
const total = resultados.filter((r) => !r.startsWith('nota')).length;
console.log(`\n${total - fallos} de ${total} comprobaciones en verde. Capturas en ${capturas}`);
process.exit(fallos ? 1 : 0);
