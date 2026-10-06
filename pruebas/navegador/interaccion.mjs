// Fallas de interacción que encontró la revisión de clase mundial (3-oct-2026), cada una como paso que debe pasar.
// Uso: servir ~/alphateklab/repos y: node pruebas/navegador/interaccion.mjs http://localhost:4900/alphateklab/
// PW apunta a otro Playwright si hace falta (el WebKit instalado en esta máquina es el de la versión de guia-anfibios-panama).
const { chromium, webkit } = await import('../../herramientas/navegador.mjs');
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

  await paso('mientras se escribe «fact» no sale «No encontramos»: salen resultados', async () => {
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    await p.keyboard.type('fact');
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
    await p.keyboard.type('whatsapp');
    await p.waitForSelector('#buscador-resultados [role=option]');
    const filas = await p.$$('#buscador-resultados [role=option]');
    await filas[1].hover();
    const sel = await p.$$eval('#buscador-resultados [aria-selected="true"]', (xs) => xs.length);
    assert.equal(sel, 1);
    assert.equal(await filas[1].getAttribute('aria-selected'), 'true');
    await p.keyboard.press('Escape');
  });

  await paso('a lo que no tenemos descrito («sistema para mi gimnasio») el buscador lo dice primero y ofrece preguntar', async () => {
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    await p.keyboard.type('sistema para mi gimnasio');
    await p.waitForSelector('#buscador-resultados [role=option]');
    await p.waitForTimeout(300);
    const filas = await p.$$eval('#buscador-resultados [role=option]', (xs) => xs.map((x) => ({ clase: x.className, texto: x.textContent.trim() })));
    assert.match(filas[0].clase, /resultado--dudosa/, `la primera fila es «${filas[0].texto.slice(0, 60)}»`);
    assert.match(filas[0].texto, /No lo tenemos descrito así/);
    assert.ok(filas.length <= 4, `${filas.length} filas: con una frase dudosa van 3 parecidos como mucho`);
    await p.keyboard.press('Enter'); // sin elegir nada, Enter lleva a preguntar y no a la lista
    await p.waitForURL(/cotizar\/\?q=/);
    assert.equal(await p.inputValue('#cot-notas'), 'sistema para mi gimnasio');
    await p.goto(BASE, { waitUntil: 'load' });
  });

  await paso('«Pregúntanos» lleva solo la frase de esta visita; la de antes se ofrece aparte', async () => {
    // de la búsqueda anterior quedó guardado «sistema para mi gimnasio»; ahora otra frase, una ficha y su botón
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    await p.keyboard.type('pedir y pagar desde la mesa');
    await p.waitForSelector('#buscador-resultados .resultado:not(.resultado--preguntar)');
    await p.click('#buscador-resultados .resultado:not(.resultado--preguntar)');
    await p.waitForURL(/servicios\/.+\?q=/);
    await p.click('a[data-lleva-q]');
    await p.waitForURL(/cotizar\/\?servicio=.+&q=/);
    assert.equal(await p.inputValue('#cot-notas'), 'pedir y pagar desde la mesa');
    assert.ok(await p.isVisible('#cot-antes'), 'no ofrece lo que se escribió antes');
    assert.match(await p.textContent('#cot-antes'), /gimnasio/);
    assert.doesNotMatch(await p.inputValue('#cot-notas'), /gimnasio/, 'mezcló la frase de antes');
    await p.goto(BASE, { waitUntil: 'load' });
  });

  await paso('en un teléfono, «Pregúntanos» va arriba en el buscador, a la vista sobre el teclado', async () => {
    const c8 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const t = await c8.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    await t.tap('.buscar-boton');
    await t.fill('#buscador-campo', 'menu qr');
    await t.waitForSelector('#buscador-resultados [role=option]');
    await t.waitForTimeout(250);
    const filas = await t.$$eval('#buscador-resultados [role=option]', (xs) => xs.map((x) => x.className));
    await c8.close();
    assert.match(filas[0], /resultado--preguntar/, 'la primera fila no es la de preguntar');
    assert.ok(filas.length <= 5, `${filas.length} filas: en el teléfono van 4 resultados como mucho`);
  });

  await paso('al filtrar por tipo, el catálogo empieza por ese tipo, sin encabezados de otros, y la cifra es la de la portada', async () => {
    await p.goto(BASE, { waitUntil: 'load' });
    // las cifras de la portada: el número al final de cada enlace del índice de «47 servicios» (4 tipos desde oct-2026)
    const cifras = await p.$$eval('a[href*="servicios/?tipo="]', (as) => Object.fromEntries(as.map((a) => [new URL(a.href).searchParams.get('tipo'), (a.textContent.match(/(\d+)\s*$/) || [])[1]]).filter(([, n]) => n)));
    assert.ok(Object.keys(cifras).length >= 4, `cifras de la portada: ${JSON.stringify(cifras)}`);
    for (const [tipo, n] of Object.entries(cifras)) {
      await p.goto(`${BASE}servicios/?tipo=${tipo}`, { waitUntil: 'load' });
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const vis = [...document.querySelectorAll('.tarjeta-servicio')].filter((t) => !t.hidden && t.offsetParent).sort((a, b) => (+a.style.order || 0) - (+b.style.order || 0));
        const titulos = [...document.querySelectorAll('.grupo__titulo')].filter((h) => h.offsetParent).length;
        return { h1: document.querySelector('h1').textContent, primero: vis[0]?.dataset.tipos.split(' ')[0], visibles: vis.length, titulos };
      });
      assert.equal(r.primero, tipo, `?tipo=${tipo}: el primer servicio es de tipo ${r.primero}`);
      assert.equal(r.titulos, 0, `?tipo=${tipo}: se ven ${r.titulos} encabezados de grupo`);
      assert.equal(String(r.visibles), n, `?tipo=${tipo}: la portada dice ${n} y se ven ${r.visibles}`);
      assert.match(r.h1, new RegExp(`\\(${n}\\)`), `?tipo=${tipo}: el título dice «${r.h1}»`);
    }
    await p.goto(BASE, { waitUntil: 'load' });
  });

  await paso('el desplegable de la portada no queda recortado: la fila «Pregúntanos» se ve a 1440×900 y a 1280×720', async () => {
    for (const [w, h] of [[1440, 900], [1280, 720]]) {
      const c2 = await b.newContext({ viewport: { width: w, height: h } });
      const q = await c2.newPage();
      await q.goto(BASE, { waitUntil: 'networkidle' });
      await q.click('#heroe-campo');
      await q.keyboard.type('whatsapp');
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
    await p.fill('#diag-otro', 'cobrar mensualidades y mandar avisos a los padres');
    await p.click('[data-paso="2"] [data-siguiente]');
    await p.click('[data-paso="3"] [data-ver]');
    await p.waitForSelector('[data-resultado]:not([hidden])');
    const texto = await p.$eval('[data-resultado]', (r) => r.innerText);
    assert.doesNotMatch(texto, /no está en la lista/);
    assert.match(texto, /mensualidades/i);
    assert.match(texto, /avisos a padres/i);
  });

  await paso('en el catálogo, escribir «fact» ya muestra la factura electrónica (no «0 resultados»)', async () => {
    await p.goto(`${BASE}servicios/`, { waitUntil: 'networkidle' });
    await p.click('#filtro-q');
    await p.keyboard.type('fact');
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

  await paso('servicios/?q=fact desde la dirección trae la factura electrónica; con 2 letras no se dice «No encontramos»', async () => {
    await p.goto(`${BASE}servicios/?q=fact`, { waitUntil: 'networkidle' });
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
    // el video está en «Pruébalo ahora» (el héroe de restaurantes es la cocina): corre cuando se ve
    await q.locator('[data-producto-video]').scrollIntoViewIfNeeded();
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
    await r.locator('[data-producto-video]').scrollIntoViewIfNeeded();
    await r.waitForTimeout(1200);
    assert.equal(await r.$$eval('[data-video-producto]', (vs) => vs.every((v) => v.paused)), true, 'con reducir movimiento corren');
    await c3.close();
  });

  await paso('en el teléfono el video de restaurantes avanza (la sincronía no lo devuelve a 0)', async () => {
    const c4 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const t = await c4.newPage();
    await t.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'load' });
    await t.locator('[data-producto-video]').scrollIntoViewIfNeeded();
    await t.waitForTimeout(3500);
    const tel = await t.$eval('.dispositivo--telefono [data-video-producto]', (v) => ({ t: v.currentTime, pausado: v.paused, visible: v.offsetParent !== null }));
    await c4.close();
    assert.equal(tel.visible, true, 'el video del teléfono no se ve');
    assert.equal(tel.pausado, false, 'el video del teléfono está pausado');
    assert.ok(tel.t > 1.5, `el video del teléfono va en ${tel.t.toFixed(2)} s tras 3,5 s`);
  });

  await paso('la portada: avisos de distintos negocios, sin equipos; entra uno nuevo arriba, la pausa lo detiene y el buscador no se mueve', async () => {
    // solo software (oct-2026): la foto de la placa, el teléfono y la tableta se fue y vuelve la caja de avisos (la
    // prueba de antes de 1b15188, con el buscador dentro de los 664 px que deja ver Safari)
    const c5 = await b.newContext({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true });
    const t = await c5.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    assert.equal(await t.$('.heroe-vitrina'), null, 'sigue la foto con el equipo');
    const arriba = () => t.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent);
    const visibles = await t.$$eval('.avisos-heroe__lista > li:not([hidden])', (ls) => ls.map((l) => l.querySelector('strong').textContent));
    assert.equal(visibles.length, 3, `en el teléfono se ven ${visibles.length} avisos`);
    assert.equal(new Set(visibles).size, 3, 'los avisos visibles son de negocios distintos');
    assert.notEqual(visibles[0], 'Restaurante', 'la portada no abre con el restaurante');
    const todos = await t.$$eval('.aviso-heroe__texto', (xs) => xs.map((x) => x.textContent).join(' '));
    assert.doesNotMatch(todos, /nevera|personas hoy|camión|sensor|cámara/i, 'quedó un aviso de equipos');
    const y0 = await t.$eval('.heroe__buscar', (e) => e.getBoundingClientRect().bottom);
    assert.ok(y0 <= 664, `el buscador no entra en la primera pantalla (termina en ${Math.round(y0)})`);
    const primero = await arriba();
    await t.waitForTimeout(5600);
    assert.notEqual(await arriba(), primero, 'no entró un aviso nuevo en 5,6 s');
    assert.equal(Math.round(await t.$eval('.heroe__buscar', (e) => e.getBoundingClientRect().bottom)), Math.round(y0), 'el buscador se movió al entrar un aviso');
    for (const href of await t.$$eval('.aviso-heroe', (as) => as.map((a) => a.href))) {
      if (!href.startsWith(new URL(BASE).origin)) continue; // las demos de la mesa y de reservas viven en sus repositorios
      const r = await t.request.get(href);
      assert.ok(r.ok(), `aviso con enlace roto: ${href}`);
    }
    await t.click('[data-pausa-avisos]');
    const quieto = await arriba();
    await t.waitForTimeout(5600);
    assert.equal(await arriba(), quieto, 'con pausa siguió cambiando');
    await c5.close();
    // en la computadora, la caja va a la derecha de la bajada y bajo el titular, sin pisarlos
    const c6 = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const r = await c6.newPage();
    await r.goto(BASE, { waitUntil: 'load' });
    const [titulo, bajada, caja] = await r.evaluate(() => ['.heroe__titulo', '.heroe__bajada', '.avisos-heroe__marco'].map((x) => document.querySelector(x).getBoundingClientRect().toJSON()));
    assert.ok(caja.top >= titulo.bottom - 1, `la caja (y=${Math.round(caja.top)}) se monta sobre el titular (llega a ${Math.round(titulo.bottom)})`);
    assert.ok(caja.left >= bajada.right - 1, `la caja (x=${Math.round(caja.left)}) se monta sobre la bajada (llega a ${Math.round(bajada.right)})`);
    const fijo = await r.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent);
    await r.waitForTimeout(5600);
    assert.equal(await r.$eval('.avisos-heroe__lista > li:not([hidden]) strong', (e) => e.textContent), fijo, 'con reducir movimiento rota');
    await c6.close();
  });

  await paso('cada página de negocio abre con su escena, la pantalla de su demo o lo que resuelve (nunca equipo instalado)', async () => {
    // solo software (oct-2026): quedan las escenas de nuestro software en la tableta o el televisor del negocio; las del
    // equipo que ya no hacemos (cerradura, cámara 360, cámara del minisúper, lector del colegio) se fueron
    const abre = {
      restaurantes: '.heroe__escena img', clinicas: '.heroe__escena img', 'talleres-y-salones': '.heroe__escena img',
      hospedaje: '.heroe__dispositivos img',
      tiendas: '.heroe__problemas', 'bienes-raices': '.heroe__problemas', escuelas: '.heroe__problemas', 'cualquier-negocio': '.heroe__problemas',
    };
    const sin = [];
    for (const [slug, sel] of Object.entries(abre)) {
      await p.goto(`${BASE}soluciones/${slug}/`, { waitUntil: 'load' });
      if (!(await p.$(`.heroe--negocio ${sel}`))) sin.push(slug);
    }
    assert.equal(sin.length, 0, `no abren como se espera: ${sin.join(', ')}`);
    const r = await p.goto(`${BASE}soluciones/industria-y-oficinas/`);
    assert.equal(r.status(), 404, 'la página de bodegas y oficinas sigue publicada');
    // y el video de la mesa sigue en la página, en «Pruébalo ahora»
    await p.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'load' });
    assert.ok(await p.$('.seccion--oscura [data-producto-video]'), 'el video de la mesa no está en «Pruébalo ahora»');
  });

  await paso('las dos tarjetas de demos usan la misma receta (la pantalla clave en una ventana sobre el petróleo)', async () => {
    // solo software (oct-2026): quedan la mesa y las reservas; se fueron el recorrido 3D, el 360, la cámara y los sensores
    for (const ruta of ['', 'laboratorio/']) {
      await p.goto(BASE + ruta, { waitUntil: 'load' });
      const srcs = await p.$$eval('.demos .demo__captura img', (xs) => xs.map((x) => x.getAttribute('src')));
      assert.equal(srcs.length, 2, `/${ruta}: ${srcs.length} tarjetas`);
      const otras = srcs.filter((s) => !/assets\/demos\/tarjeta-[a-z0-9-]+\.webp$/.test(s));
      assert.equal(otras.length, 0, `/${ruta}: fuera de la receta: ${otras.join(', ')}`);
    }
  });

  await paso('el buscador con teclado: pie con las teclas, Enter en la fila elegida (sin mover la fila) e ícono propio del servicio', async () => {
    const c17 = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const t = await c17.newPage();
    await t.goto(`${BASE}servicios/`, { waitUntil: 'load' });
    await t.keyboard.press('/');
    await t.keyboard.type('menu qr para mi restaurante', { delay: 30 });
    await t.waitForSelector('.buscador .resultado[role="option"]');
    await t.waitForTimeout(500);
    const ancho = () => t.$eval('.buscador .resultado:not(.resultado--preguntar) .resultado__texto', (x) => x.getBoundingClientRect().width);
    const antes = await ancho();
    await t.keyboard.press('ArrowDown');
    await t.waitForTimeout(150);
    assert.equal(await t.isVisible('.buscador__pie'), true, 'falta el pie con las teclas');
    assert.equal(await t.$eval('.buscador .resultado[aria-selected="true"] .resultado__enter', (x) => getComputedStyle(x).visibility), 'visible', 'la fila elegida no lleva Enter');
    assert.equal(Math.round(await ancho()), Math.round(antes), 'la fila cambió de ancho al elegirla');
    // el agente de citas con el ícono de calendario, no con el de código de su tipo
    await t.fill('#buscador-campo', 'recordar citas a los pacientes');
    await t.waitForTimeout(600);
    const iconos = await t.$$eval('.buscador .resultado use', (xs) => xs.map((x) => x.getAttribute('href')));
    await c17.close();
    assert.ok(iconos.includes('#i-calendar-check'), `íconos: ${iconos.join(', ')}`);
    // en una pantalla táctil no hay pie de teclas
    const c18 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const u = await c18.newPage();
    await u.goto(`${BASE}servicios/`, { waitUntil: 'load' });
    await u.click('[data-abrir-buscador]:visible');
    await u.waitForTimeout(300);
    const pieTactil = await u.isVisible('.buscador__pie');
    await c18.close();
    assert.equal(pieTactil, false, 'el pie de teclas sale en la pantalla táctil');
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
    // a la vista = opacidad casi plena (los dos logos están en la misma celda y se funden)
    const logos = () => t.$$eval('.cabecera .marca img', (is) => is.filter((i) => Number(getComputedStyle(i.closest('picture') || i).opacity) > 0.9).length);
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

  await paso('«Pregúntanos» en el teléfono: «Mandar por WhatsApp» a la vista sin bajar, y se aparta al escribir', async () => {
    const c11 = await b.newContext({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true });
    const t = await c11.newPage();
    await t.goto(`${BASE}cotizar/?q=camaras`, { waitUntil: 'load' });
    const caja = await t.$eval('#cot-whatsapp', (e) => e.getBoundingClientRect().toJSON());
    assert.ok(caja.top >= 0 && caja.bottom <= 664, `el botón está en y=${Math.round(caja.top)}`);
    await t.focus('#cot-notas');
    await t.waitForTimeout(100);
    assert.equal(await t.isVisible('#cot-whatsapp'), false, 'la barra tapa el campo mientras se escribe');
    await c11.close();
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

  await paso('las demos de equipos ya no están publicadas (solo software)', async () => {
    for (const demo of ['recorrido-3d', 'recorrido-360', 'camara', 'sensores']) {
      const r = await p.goto(`${BASE}laboratorio/${demo}/`);
      assert.equal(r.status(), 404, `laboratorio/${demo}/ sigue publicada`);
    }
  });

  // detalles de oficio (brecha 21 de la medición de las 17:10)
  await paso('«Copiar» no cambia de ancho al pasar a «Copiado», y su nombre dice lo que muestra', async () => {
    const webkitSinPortapapeles = process.env.MOTOR === 'webkit';
    const c12 = await b.newContext({ viewport: { width: 1280, height: 800 }, permissions: webkitSinPortapapeles ? [] : ['clipboard-read', 'clipboard-write'] });
    const t = await c12.newPage();
    await t.goto(`${BASE}cotizar/?q=camaras`, { waitUntil: 'load' });
    const ancho = () => t.$eval('#cot-copiar', (e) => e.getBoundingClientRect().width);
    const antes = await ancho();
    await t.$eval('#cot-copiar', (e) => e.classList.add('hecho'));
    const hecho = await ancho();
    await t.$eval('#cot-copiar', (e) => e.classList.remove('hecho'));
    assert.equal(Math.round(hecho), Math.round(antes), `pasa de ${antes.toFixed(1)} a ${hecho.toFixed(1)} px`);
    if (!webkitSinPortapapeles) {
      await t.click('#cot-copiar');
      await t.waitForTimeout(150);
      assert.equal(await t.getByRole('button', { name: 'Copiado', exact: true }).count(), 1, 'después de copiar el botón no se llama «Copiado»');
      assert.equal(Math.round(await ancho()), Math.round(antes));
    }
    await c12.close();
  });

  await paso('con el menú del teléfono abierto, Tab y Mayús+Tab dan la vuelta dentro de la cabecera', async () => {
    const c13 = await b.newContext({ viewport: { width: 390, height: 844 } });
    const t = await c13.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    await t.click('[data-hamburguesa]');
    await t.waitForTimeout(250);
    const fuera = [];
    for (let i = 0; i < 40; i++) {
      // 30 hacia adelante (más de una vuelta) y 10 hacia atrás, para pasar por los dos bordes
      await t.keyboard.press(i >= 30 ? 'Shift+Tab' : 'Tab');
      if (!(await t.evaluate(() => Boolean(document.activeElement?.closest('[data-cabecera]'))))) fuera.push(i + 1);
    }
    await c13.close();
    assert.equal(fuera.length, 0, `el foco salió de la cabecera en las teclas ${fuera.join(', ')} de 40`);
  });

  await paso('el foco de «Buscar» en la portada se ve dentro de la caja: anillo grafito, no ámbar sobre ámbar', async () => {
    const c14 = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const t = await c14.newPage();
    await t.goto(BASE, { waitUntil: 'load' });
    await t.focus('#heroe-campo');
    await t.keyboard.press('Tab');
    const [clase, sombra] = await t.evaluate(() => [document.activeElement.className, getComputedStyle(document.activeElement).boxShadow]);
    await c14.close();
    assert.match(clase, /boton--senal/, 'Tab desde el campo no llegó a «Buscar»');
    assert.match(sombra, /rgb\(32, 39, 41\)/, `sin anillo grafito: ${sombra}`);
  });

  await paso('en el teléfono, los servicios de cada etapa y «Pruébala» miden 44 px de toque', async () => {
    const c15 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const t = await c15.newPage();
    await t.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'load' });
    const etapas = await t.$$eval('.etapa__servicios a', (xs) => xs.map((x) => x.getBoundingClientRect().height));
    const pruebala = await t.$$eval('.heroe__pie-video a, .heroe__producto figcaption a', (xs) => xs.map((x) => x.getBoundingClientRect().height));
    await c15.close();
    assert.ok(etapas.length >= 6, `solo ${etapas.length} enlaces de etapas`);
    const bajos = [...etapas, ...pruebala].filter((h) => h < 44);
    assert.equal(bajos.length, 0, `${bajos.length} de ${etapas.length + pruebala.length} bajo 44 px: ${bajos.map((h) => h.toFixed(0)).join(', ')}`);
  });

  // sistema de títulos (brecha 7): un estilo por papel, todo en Manrope 700, y el H1 siempre por encima de los H2
  await paso('los títulos siguen un sistema: Manrope 700, un solo tamaño de H2 por página de documento y el H1 por encima', async () => {
    const problemas = [];
    for (const ancho of [1440, 390]) {
      const c16 = await b.newContext({ viewport: { width: ancho, height: 900 } });
      const t = await c16.newPage();
      for (const ruta of ['', 'soluciones/restaurantes/', 'servicios/menu-qr/', 'servicios/', 'guias/factura-electronica/', 'cotizar/', 'diagnostico/']) {
        await t.goto(BASE + ruta, { waitUntil: 'load' });
        const r = await t.evaluate(() => {
          const vis = (e) => e.getClientRects().length && !e.closest('dialog, [hidden], .mega, .menu-movil, .pie, .sr, .banda-pregunta');
          const est = (e) => { const s = getComputedStyle(e); return { px: Math.round(parseFloat(s.fontSize)), w: s.fontWeight, f: s.fontFamily.split(',')[0].replace(/"/g, ''), txt: e.textContent.trim().slice(0, 30) }; };
          return { h1: [...document.querySelectorAll('h1')].filter(vis).map(est), h2: [...document.querySelectorAll('main h2')].filter(vis).map(est), h3: [...document.querySelectorAll('main h3')].filter(vis).map(est) };
        });
        const todos = [...r.h1, ...r.h2, ...r.h3];
        for (const x of todos) if (x.w !== '700' || x.f !== 'Manrope') problemas.push(`${ancho} /${ruta} «${x.txt}» ${x.f} ${x.w}`);
        const maxH2 = Math.max(0, ...r.h2.map((x) => x.px));
        for (const h of r.h1) if (h.px <= maxH2) problemas.push(`${ancho} /${ruta} H1 de ${h.px} px no supera al H2 de ${maxH2}`);
        // en las páginas de documento (fichas y guías) todos los H2 van del mismo tamaño
        if (/servicios\/menu-qr|guias\//.test(ruta)) {
          const tam = [...new Set(r.h2.map((x) => x.px))];
          if (tam.length > 1) problemas.push(`${ancho} /${ruta} H2 de ${tam.join(', ')} px`);
        }
      }
      await c16.close();
    }
    assert.equal(problemas.length, 0, problemas.slice(0, 6).join(' · '));
  });
} finally {
  await b.close();
}
console.log(fallos ? `${fallos} pasos fallaron` : 'todo bien');
process.exit(fallos ? 1 : 0);
