// Fallas de interacción que encontró la revisión de clase mundial (3-oct-2026), cada una como paso que debe pasar.
// Uso: servir ~/alphateklab/repos y: node pruebas/navegador/interaccion.mjs http://localhost:4900/alphateklab/
// PW apunta a otro Playwright si hace falta (el WebKit instalado en esta máquina es el de la versión de guia-anfibios-panama).
const { chromium, webkit } = await import(process.env.PW || '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs');
import assert from 'node:assert/strict';

const BASE = process.argv[2] || 'http://localhost:4900/alphateklab/';
// MOTOR=webkit corre lo mismo con el motor de Safari
// En Fedora el WebKit de Playwright necesita ICU 74 y libjpeg8 aparte: WEBKIT_EXE apunta a un lanzador que los pone.
const b = await (process.env.MOTOR === 'webkit' ? webkit : chromium).launch(process.env.MOTOR === 'webkit' && process.env.WEBKIT_EXE ? { executablePath: process.env.WEBKIT_EXE } : {});
let fallos = 0;
const paso = async (nombre, fn) => {
  try {
    await fn();
    console.log('ok   ', nombre);
  } catch (e) {
    fallos++;
    console.log('FALLA', nombre, '\n      ', e.message.split('\n')[0]);
  }
};
// contraste WCAG entre dos colores rgb()
const lum = (c) => {
  const [r, g, bl] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
};
const contraste = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const CODIGO = /\b[RCSHBITEV]\d{2}\b/;

try {
  const c = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });

  await paso('el menú abierto al pasar el ratón no se cierra con el clic que llega después', async () => {
    await p.hover('button[aria-controls="mega-soluciones"]');
    await p.waitForTimeout(250);
    await p.click('button[aria-controls="mega-soluciones"]');
    await p.waitForTimeout(100);
    assert.equal(await p.getAttribute('button[aria-controls="mega-soluciones"]', 'aria-expanded'), 'true');
    assert.equal(await p.isVisible('#mega-soluciones'), true);
    await p.mouse.move(640, 700);
    await p.keyboard.press('Escape');
  });

  await paso('el panel del menú sale en una transición corta; al pasar a otro panel, el anterior se va al instante', async () => {
    await p.waitForTimeout(300);
    await p.click('button[aria-controls="mega-soluciones"]');
    await p.waitForTimeout(250);
    await p.keyboard.press('Escape');
    const durante = await p.evaluate(() => getComputedStyle(document.querySelector('#mega-soluciones')).display);
    assert.notEqual(durante, 'none', 'justo después de cerrar debería seguir en pantalla mientras sale');
    await p.waitForTimeout(400);
    assert.equal(await p.isVisible('#mega-soluciones'), false);
    await p.click('button[aria-controls="mega-soluciones"]');
    await p.waitForTimeout(250);
    await p.click('button[aria-controls="mega-servicios"]');
    const viejo = await p.evaluate(() => getComputedStyle(document.querySelector('#mega-soluciones')).display);
    assert.equal(viejo, 'none', 'el panel anterior no debe cruzarse con el nuevo');
    assert.equal(await p.isVisible('#mega-servicios'), true);
    await p.keyboard.press('Escape');
    await p.mouse.move(640, 700);
    await p.waitForTimeout(300);
  });

  await paso('mientras se escribe «cam» no sale «No encontramos»: salen resultados', async () => {
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    await p.keyboard.type('cam');
    await p.waitForTimeout(450);
    assert.equal(await p.isVisible('[data-buscador-vacio] .sin-resultados'), false, 'sale el bloque vacío');
    assert.ok((await p.$$('#buscador-resultados [role=option]')).length >= 2);
    await p.keyboard.press('Escape');
  });

  await paso('con el buscador abierto la página de atrás no se desplaza', async () => {
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    const ov = await p.evaluate(() => getComputedStyle(document.documentElement).overflow);
    assert.match(ov, /hidden|clip/);
    await p.keyboard.press('Escape');
    assert.doesNotMatch(await p.evaluate(() => getComputedStyle(document.documentElement).overflow), /hidden|clip/);
  });

  await paso('en el buscador hay un solo resaltado: el ratón mueve la selección', async () => {
    await p.keyboard.press('/');
    await p.keyboard.type('camaras');
    await p.waitForSelector('#buscador-resultados [role=option]');
    const filas = await p.$$('#buscador-resultados [role=option]');
    await filas[1].hover();
    const sel = await p.$$eval('#buscador-resultados [aria-selected="true"]', (xs) => xs.length);
    assert.equal(sel, 1);
    assert.equal(await filas[1].getAttribute('aria-selected'), 'true');
    await p.keyboard.press('Escape');
  });

  await paso('el desplegable de la portada no queda recortado: la fila «Pregúntanos» se ve a 1440×900 y a 1280×720', async () => {
    for (const [w, h] of [[1440, 900], [1280, 720]]) {
      const c2 = await b.newContext({ viewport: { width: w, height: h } });
      const q = await c2.newPage();
      await q.goto(BASE, { waitUntil: 'networkidle' });
      await q.click('#heroe-campo');
      await q.keyboard.type('camaras');
      await q.waitForSelector('#heroe-resultados .resultado--preguntar');
      await q.waitForTimeout(200);
      const visible = await q.evaluate(() => {
        const fila = document.querySelector('#heroe-resultados .resultado--preguntar');
        const r = fila.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (y < 0 || y > innerHeight) return `fuera de pantalla (y=${Math.round(y)})`;
        return fila.contains(document.elementFromPoint(x, y)) ? 'ok' : `tapada por ${document.elementFromPoint(x, y)?.className}`;
      });
      assert.equal(visible, 'ok', `${w}×${h}: ${visible}`);
      await c2.close();
    }
  });

  await paso('el desplegable de la portada se cierra al salir con Tab', async () => {
    await p.click('#heroe-campo');
    await p.keyboard.type('menu qr');
    await p.waitForSelector('#heroe-resultados [role=option]');
    await p.keyboard.press('Tab');
    await p.keyboard.press('Tab');
    await p.waitForTimeout(100);
    assert.equal(await p.isVisible('#heroe-resultados'), false);
  });

  await paso('«Buscar» en la portada sin resultados lleva a preguntar, igual que Enter', async () => {
    await p.fill('#heroe-campo', 'imprimir camisetas para mi equipo');
    await p.waitForTimeout(300);
    await Promise.all([p.waitForNavigation(), p.click('.heroe__buscar button[type="submit"]')]);
    assert.match(decodeURIComponent(p.url()), /cotizar\/\?q=imprimir camisetas/);
  });

  await paso('el diagnóstico no muestra códigos internos y deja ver la pregunta bajo la cabecera', async () => {
    await p.goto(`${BASE}diagnostico/`, { waitUntil: 'networkidle' });
    await p.click('label.diag-negocio:has-text("Restaurantes")');
    await p.waitForTimeout(600);
    const tope = await p.$eval('[data-paso="2"] legend', (l) => l.getBoundingClientRect().top);
    const cab = await p.$eval('.cabecera', (h) => h.getBoundingClientRect().bottom);
    assert.ok(tope >= cab, `la pregunta queda bajo la cabecera (${Math.round(tope)} < ${Math.round(cab)})`);
    await p.goto(`${BASE}diagnostico/?n=restaurantes&p=0`, { waitUntil: 'networkidle' });
    const texto = await p.$eval('[data-resultado]', (r) => r.innerText);
    assert.doesNotMatch(texto, CODIGO, 'el resultado muestra un código interno');
  });

  await paso('el botón Atrás del navegador vuelve al paso anterior del diagnóstico', async () => {
    await p.goto(`${BASE}diagnostico/`, { waitUntil: 'networkidle' });
    await p.click('label.diag-negocio:has-text("Restaurantes")');
    await p.waitForSelector('[data-paso="2"]:not([hidden])');
    await p.goBack();
    await p.waitForTimeout(300);
    assert.match(p.url(), /diagnostico\/(\?.*)?$/);
    assert.equal(await p.isVisible('[data-paso="1"]'), true, 'no volvió al paso 1');
  });

  await paso('en el paso 1 del diagnóstico la flecha solo marca; Enter avanza (WCAG 3.2.2)', async () => {
    await p.goto(`${BASE}diagnostico/`, { waitUntil: 'networkidle' });
    await p.focus('input[name="negocio"][value="restaurantes"]');
    await p.keyboard.press('ArrowDown');
    await p.waitForTimeout(300);
    assert.equal(await p.isVisible('[data-paso="1"]'), true, 'la flecha cambió de paso');
    assert.equal(await p.$eval('input[name="negocio"]:checked', (x) => x.value), 'tiendas');
    await p.keyboard.press('Enter');
    await p.waitForSelector('[data-paso="2"]:not([hidden])');
  });

  await paso('el diagnóstico busca lo que la persona escribió y no dice «no está» si existe', async () => {
    await p.goto(`${BASE}diagnostico/?n=cualquier-negocio`, { waitUntil: 'networkidle' });
    await p.fill('#diag-otro', 'cobrar mensualidades y control de acceso de los socios');
    await p.click('[data-paso="2"] [data-siguiente]');
    await p.click('[data-paso="3"] [data-ver]');
    await p.waitForSelector('[data-resultado]:not([hidden])');
    const texto = await p.$eval('[data-resultado]', (r) => r.innerText);
    assert.doesNotMatch(texto, /no está en la lista/);
    assert.match(texto, /mensualidades/i);
    assert.match(texto, /acceso/i);
  });

  await paso('en el catálogo, escribir «cam» ya muestra las cámaras (no «0 resultados»)', async () => {
    await p.goto(`${BASE}servicios/`, { waitUntil: 'networkidle' });
    await p.click('#filtro-q');
    await p.keyboard.type('cam');
    await p.waitForTimeout(500);
    const visibles = await p.$$eval('.tarjeta-servicio', (xs) => xs.filter((x) => x.getBoundingClientRect().height > 0).length);
    assert.ok(visibles >= 5, `solo ${visibles}`);
    assert.equal(await p.isVisible('#catalogo-vacio'), false);
  });

  await paso('en el teléfono, tocar el buscador de la portada abre el diálogo (los resultados no quedan bajo el teclado)', async () => {
    const m = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const q = await m.newPage();
    await q.goto(BASE, { waitUntil: 'networkidle' });
    await q.tap('#heroe-campo');
    await q.waitForTimeout(300);
    assert.equal(await q.evaluate(() => document.querySelector('[data-buscador]').open), true);
    assert.equal(await q.evaluate(() => document.activeElement.id), 'buscador-campo');
    await m.close();
  });

  await paso('servicios/?q=cam desde la dirección trae las cámaras; con 2 letras no se dice «No encontramos»', async () => {
    await p.goto(`${BASE}servicios/?q=cam`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    const n = await p.$$eval('.tarjeta-servicio', (xs) => xs.filter((x) => x.getBoundingClientRect().height > 0).length);
    assert.ok(n >= 8, `solo ${n}`);
    await p.goto(`${BASE}servicios/?q=ca`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    assert.equal(await p.isVisible('#catalogo-vacio'), false);
  });

  await paso('el video de restaurantes: arrancan los dos, se pausan con el botón y no arrancan con «reducir movimiento»', async () => {
    const c2 = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const q = await c2.newPage();
    await q.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'networkidle' });
    await q.waitForTimeout(1800);
    const andando = await q.$$eval('[data-video-producto]', (vs) => vs.map((v) => !v.paused && v.currentTime > 0.3));
    assert.deepEqual(andando, [true, true], 'no corren los dos');
    await q.click('[data-pausa-video]');
    assert.equal(await q.$$eval('[data-video-producto]', (vs) => vs.every((v) => v.paused)), true);
    assert.equal(await q.getAttribute('[data-pausa-video]', 'aria-pressed'), 'true');
    await c2.close();
    const c3 = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const r = await c3.newPage();
    await r.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'networkidle' });
    await r.waitForTimeout(1200);
    assert.equal(await r.$$eval('[data-video-producto]', (vs) => vs.every((v) => v.paused)), true, 'con reducir movimiento corren');
    await c3.close();
  });

  await paso('en el teléfono el video de restaurantes avanza (la sincronía no lo devuelve a 0)', async () => {
    const c4 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const t = await c4.newPage();
    await t.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'load' });
    await t.waitForTimeout(3500);
    const tel = await t.$eval('.dispositivo--telefono [data-video-producto]', (v) => ({ t: v.currentTime, pausado: v.paused, visible: v.offsetParent !== null }));
    await c4.close();
    assert.equal(tel.visible, true, 'el video del teléfono no se ve');
    assert.equal(tel.pausado, false, 'el video del teléfono está pausado');
    assert.ok(tel.t > 1.5, `el video del teléfono va en ${tel.t.toFixed(2)} s tras 3,5 s`);
  });

  await paso('la portada: avisos de distintos negocios; entra uno nuevo arriba, la pausa lo detiene, el buscador no se mueve', async () => {
    const c5 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const t = await c5.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    const arriba = () => t.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent);
    const visibles = await t.$$eval('.avisos-heroe__lista > li:not([hidden])', (ls) => ls.map((l) => l.querySelector('strong').textContent));
    assert.equal(visibles.length, 3, `en el teléfono se ven ${visibles.length} avisos`);
    assert.equal(new Set(visibles).size, 3, 'los avisos visibles son de negocios distintos');
    assert.notEqual(visibles[0], 'Restaurante', 'la portada no abre con el restaurante');
    const y0 = await t.$eval('.heroe__buscar', (e) => e.getBoundingClientRect().bottom);
    assert.ok(y0 <= 844, `el buscador no entra en la primera pantalla (termina en ${Math.round(y0)})`);
    const primero = await arriba();
    await t.waitForTimeout(5600);
    assert.notEqual(await arriba(), primero, 'no entró un aviso nuevo en 5,6 s');
    assert.equal(Math.round(await t.$eval('.heroe__buscar', (e) => e.getBoundingClientRect().bottom)), Math.round(y0), 'el buscador se movió al entrar un aviso');
    for (const href of await t.$$eval('.aviso-heroe', (as) => as.map((a) => a.href))) {
      const r = await t.request.get(href);
      assert.ok(r.ok(), `aviso con enlace roto: ${href}`);
    }
    await t.click('[data-pausa-avisos]');
    const quieto = await arriba();
    await t.waitForTimeout(5600);
    assert.equal(await arriba(), quieto, 'con pausa siguió cambiando');
    await c5.close();
    const c6 = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const r = await c6.newPage();
    await r.goto(BASE, { waitUntil: 'load' });
    const fijo = await r.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent);
    await r.waitForTimeout(5600);
    assert.equal(await r.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent), fijo, 'con reducir movimiento rota');
    await c6.close();
  });

  await paso('el desplegable de la portada no salta mientras se escribe una frase (ni queda una franja vacía)', async () => {
    const c7 = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const t = await c7.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    await t.evaluate(() => {
      window.__altos = [];
      const caja = document.getElementById('heroe-resultados');
      new ResizeObserver(() => window.__altos.push(Math.round(caja.getBoundingClientRect().height))).observe(caja);
    });
    await t.click('#heroe-campo');
    await t.keyboard.type('sistema para mi gimnasio con membresias', { delay: 110 });
    await t.waitForTimeout(800);
    const altos = await t.evaluate(() => window.__altos);
    await c7.close();
    const cambios = altos.filter((h, i) => i && h !== altos[i - 1]).length;
    assert.ok(cambios <= 4, `cambió de alto ${cambios} veces: ${altos.join(' ')}`);
    assert.ok(!altos.some((h) => h > 0 && h < 40), `quedó una franja vacía: ${altos.join(' ')}`);
  });

  await paso('la cabecera se funde con el héroe oscuro y al bajar vuelve a ser clara, con un solo logo a la vista', async () => {
    const c8 = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const t = await c8.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    const logos = () => t.$$eval('.cabecera .marca img', (is) => is.filter((i) => i.offsetParent !== null).length);
    assert.match(await t.$eval('[data-cabecera]', (e) => e.className), /cabecera--sobre-heroe/);
    assert.equal(await logos(), 1, 'sobre el héroe se ven dos logos');
    await t.evaluate(() => scrollTo(0, 1400));
    await t.waitForTimeout(500);
    assert.doesNotMatch(await t.$eval('[data-cabecera]', (e) => e.className), /cabecera--sobre-heroe/);
    assert.equal(await logos(), 1, 'al bajar se ven dos logos');
    await c8.close();
  });

  await paso('«Agregar a mi lista» de la ficha no se mueve ni cambia de ancho, y el logo no se achica en el teléfono', async () => {
    for (const [w, movil] of [[1440, false], [390, true]]) {
      const c9 = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: movil, hasTouch: movil });
      const t = await c9.newPage();
      await t.goto(`${BASE}servicios/menu-qr/`, { waitUntil: 'load' });
      const medir = () => t.evaluate(() => { const a = document.querySelector('.ficha-heroe__agregar').getBoundingClientRect(); const l = document.querySelector('.cabecera .marca').getBoundingClientRect(); return [Math.round(a.x), Math.round(a.y), Math.round(a.width), Math.round(l.width)].join(','); });
      const antes = await medir();
      await t.click('.ficha-heroe__agregar');
      await t.waitForTimeout(250);
      assert.equal(await medir(), antes, `${w} px: cambió botón o logo`);
      assert.equal(await t.getAttribute('.ficha-heroe__agregar', 'aria-pressed'), 'true');
      assert.equal(await t.getByRole('button', { name: 'Agregar a mi lista', exact: true }).count(), 1, 'el nombre del botón no es fijo');
      await c9.close();
    }
  });

  await paso('una palabra de dos sentidos sola no trae «lo más parecido»: «red de pesca» no es la red wifi', async () => {
    const c10 = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const t = await c10.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    await t.keyboard.press('/');
    await t.keyboard.type('red de pesca para el bote', { delay: 30 });
    await t.waitForSelector('.buscador .sin-resultados', { timeout: 4000 });
    const cerca = await t.$$eval('.buscador .sin-resultados__cerca', (xs) => xs.map((x) => x.textContent));
    await c10.close();
    assert.equal(cerca.length, 0, `ofreció: ${cerca.join(' | ')}`);
  });

  await paso('Pregúntanos no muestra códigos internos en la lista', async () => {
    await p.goto(`${BASE}cotizar/?servicio=R02`, { waitUntil: 'networkidle' });
    const texto = await p.$eval('#cot-elegidos', (r) => r.innerText);
    assert.match(texto, /Pedir/);
    assert.doesNotMatch(texto, CODIGO);
  });

  await paso('en modo oscuro el botón ámbar se lee al pasar el ratón (≥ 4.5:1)', async () => {
    const o = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
    const q = await o.newPage();
    await q.goto(BASE, { waitUntil: 'networkidle' });
    // pasado el héroe, que es donde «Pregúntanos» es el botón ámbar (sobre el héroe va con contorno claro)
    await q.evaluate(() => scrollTo(0, 1400));
    await q.waitForTimeout(400);
    await q.hover('.cabecera__cta');
    await q.waitForTimeout(400);
    const [fg, bg] = await q.$eval('.cabecera__cta', (x) => [getComputedStyle(x).color, getComputedStyle(x).backgroundColor]);
    const r = contraste(fg, bg);
    assert.ok(r >= 4.5, `contraste ${r.toFixed(2)} (${fg} sobre ${bg})`);
    await o.close();
  });

  await paso('la demo del 360 usa la cabecera del sitio y no tiene anclas muertas', async () => {
    await p.goto(`${BASE}laboratorio/recorrido-360/`, { waitUntil: 'networkidle' });
    const malos = await p.$$eval('a[href*="#laboratorio"], a[href*="#cotizar"]', (xs) => xs.length);
    assert.equal(malos, 0);
    assert.ok(await p.$('a[href="../../cotizar/?servicio=B01"]'), 'falta preguntar por el recorrido');
  });
} finally {
  await b.close();
}
console.log(fallos ? `${fallos} pasos fallaron` : 'todo bien');
process.exit(fallos ? 1 : 0);
