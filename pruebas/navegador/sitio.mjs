// Recorrido del sitio en un navegador real: menú, buscador (diálogo y portada), «no lo tenemos, pregúntanos»,
// catálogo con búsqueda y filtros, página de un negocio, cotización compartida entre páginas y teléfono.
// Uso: servir ~/alphateklab/repos y: node pruebas/navegador/sitio.mjs http://localhost:4900/alphateklab/
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
const errores = [];
const vigilar = (p) => {
  p.on('pageerror', (e) => errores.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  p.on('response', (r) => r.status() >= 400 && errores.push(`${r.status()} ${r.url()}`));
};

try {
  const c = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await c.newPage();
  vigilar(p);
  await p.goto(BASE, { waitUntil: 'networkidle' });

  await paso('el contenido está en el HTML aunque no haya JavaScript', async () => {
    const html = await (await fetch(BASE)).text();
    assert.match(html, /¿Qué tipo de negocio tienes\?/);
    assert.match(html, /Lo que hacemos/);
    assert.ok((html.match(/class="negocio"/g) || []).length >= 9);
  });

  await paso('el menú «Soluciones» abre con clic y lleva a cada negocio', async () => {
    await p.click('button[aria-controls="mega-soluciones"]');
    assert.equal(await p.isVisible('#mega-soluciones'), true);
    assert.ok((await p.$$('#mega-soluciones .mega__item')).length >= 9);
    await p.keyboard.press('Escape');
    await p.waitForSelector('#mega-soluciones', { state: 'hidden', timeout: 1000 }); // sale en 120 ms
  });

  await paso('«/» abre el buscador y entiende una frase con palabras propias', async () => {
    await p.mouse.click(5, 500);
    await p.keyboard.press('/');
    await p.keyboard.type('que los clientes pidan desde la mesa');
    await p.waitForSelector('#buscador-resultados [role=option]');
    const r = await p.$$eval('#buscador-resultados [role=option] strong', (xs) => xs.map((x) => x.textContent));
    assert.ok(r.slice(0, 3).some((t) => /pagar desde la mesa/.test(t)), r.join(' | '));
  });

  await paso('siempre queda la salida para preguntar, aunque haya resultados', async () => {
    await p.fill('#buscador-campo', 'app para mi gimnasio');
    await p.waitForSelector('#buscador-resultados .resultado--preguntar');
    const ultimo = await p.$eval('#buscador-resultados [role=option]:last-child', (li) => li.dataset.url);
    assert.match(decodeURIComponent(ultimo), /cotizar\/\?q=app para mi gimnasio/);
  });

  await paso('flecha abajo y Enter abre el primer resultado', async () => {
    await p.fill('#buscador-campo', 'recordar citas a pacientes');
    await p.waitForSelector('#buscador-resultados [role=option]');
    await p.keyboard.press('ArrowDown');
    await Promise.all([p.waitForNavigation(), p.keyboard.press('Enter')]);
    assert.match(p.url(), /servicios\/agente-de-citas\//);
    await p.goto(BASE, { waitUntil: 'networkidle' });
  });

  await paso('lo que no ofrecemos lleva a preguntar por WhatsApp con la frase escrita', async () => {
    await p.keyboard.press('/');
    await p.keyboard.type('imprimir camisetas');
    await p.waitForSelector('[data-buscador-vacio] .sin-resultados');
    const href = await p.getAttribute('[data-buscador-vacio] a.boton--senal', 'href');
    assert.match(decodeURIComponent(href), /¿Pueden hacer esto\?\n\nimprimir camisetas/);
    await Promise.all([p.waitForNavigation(), p.keyboard.press('Enter')]);
    assert.match(decodeURIComponent(p.url()), /cotizar\/\?q=imprimir camisetas/);
    await p.goto(BASE, { waitUntil: 'networkidle' });
  });

  await paso('la búsqueda de la portada muestra resultados debajo del campo', async () => {
    await p.click('#heroe-campo');
    await p.keyboard.type('contar clientes');
    await p.waitForSelector('#heroe-resultados [role=option]');
    assert.match(await p.textContent('#heroe-resultados [role=option] strong'), /Contador de personas/);
  });

  await paso('los resultados resaltan lo que coincide con la búsqueda', async () => {
    const marcas = await p.$$eval('#heroe-resultados [role=option] mark', (xs) => xs.map((x) => x.textContent.toLowerCase()));
    assert.ok(marcas.some((t) => /client|cont/.test(t)), marcas.join(' | '));
  });

  await paso('el catálogo filtra por búsqueda y por negocio, y lo guarda en la URL', async () => {
    await p.goto(`${BASE}servicios/?q=inventario`, { waitUntil: 'networkidle' });
    assert.match(await p.textContent('#filtros-cuenta'), /resultados? para «inventario»/);
    await p.fill('#filtro-q', '');
    await p.click('label.opcion:has-text("Clínicas y consultorios")');
    await p.waitForFunction(() => /sector=salud/.test(location.search));
    const n = Number((await p.textContent('#filtros-cuenta')).match(/Mostrando (\d+)/)[1]);
    assert.ok(n > 0 && n < 20, String(n));
    await p.fill('#filtro-q', 'dron');
    await p.waitForSelector('#catalogo-vacio:not([hidden])');
  });

  await paso('lo que el filtro oculta no se ve: tarjetas visibles = la cuenta', async () => {
    for (const q of ['tipo=vision', 'sector=salud', 'q=camaras']) {
      await p.goto(`${BASE}servicios/?${q}`, { waitUntil: 'networkidle' });
      const dice = Number((await p.textContent('#filtros-cuenta')).match(/(\d+)/)[1]);
      const visibles = await p.$$eval('.tarjeta-servicio', (xs) => xs.filter((x) => x.getBoundingClientRect().height > 0).length);
      assert.equal(visibles, dice, q);
      const ocultosVisibles = await p.$$eval('[hidden]', (xs) => xs.filter((x) => getComputedStyle(x).display !== 'none').length);
      assert.equal(ocultosVisibles, 0, `${q}: hay elementos [hidden] en pantalla`);
    }
  });

  await paso('el diagnóstico muestra un paso a la vez', async () => {
    await p.goto(`${BASE}diagnostico/`, { waitUntil: 'networkidle' });
    const pasos = await p.$$eval('.diag__paso', (xs) => xs.filter((x) => x.getBoundingClientRect().height > 0).length);
    assert.equal(pasos, 1);
  });

  await paso('agregar en un negocio aparece en la cabecera y en «Pregúntanos»', async () => {
    await p.goto(`${BASE}soluciones/restaurantes/`, { waitUntil: 'networkidle' });
    await p.click('.tarjeta-servicio [data-cotizar="R02"]');
    assert.equal(await p.textContent('[data-cuenta-cotizacion]'), '1');
    await p.goto(`${BASE}cotizar/`, { waitUntil: 'networkidle' });
    await p.fill('#cot-notas', 'algo para la cocina');
    const m = await p.textContent('#cot-mensaje');
    assert.match(m, /Lo que necesito: algo para la cocina/);
    assert.match(m, /Pedir, llamar al mesero y pagar desde la mesa/);
    await p.click('#cot-vaciar');
  });

  await paso('el teléfono: menú, sin scroll horizontal', async () => {
    const m = await b.newContext({ viewport: { width: 390, height: 844 } });
    const q = await m.newPage();
    vigilar(q);
    await q.goto(BASE, { waitUntil: 'networkidle' });
    const [sw, cw] = await q.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    assert.ok(sw <= cw, `scrollWidth ${sw} > clientWidth ${cw}`);
    await q.click('[data-hamburguesa]');
    assert.equal(await q.isVisible('#menu-movil'), true);
    await q.click('#menu-movil [data-abrir-buscador]');
    assert.equal(await q.isVisible('[data-buscador]'), true);
    await m.close();
  });

  await paso('las guías: índice, una guía con fuentes, y la ficha relacionada que la enlaza', async () => {
    await p.goto(`${BASE}guias/`, { waitUntil: 'networkidle' });
    assert.ok((await p.$$('.guia-fila')).length >= 4);
    await p.goto(`${BASE}servicios/factura-electronica/`, { waitUntil: 'networkidle' }).catch(() => {});
    const enlace = await p.$('a.guia-fila[href*="guias/factura-electronica/"]');
    assert.ok(enlace, 'la ficha de factura electrónica no enlaza su guía');
    await Promise.all([p.waitForNavigation(), enlace.click()]);
    assert.ok((await p.$$('.fuentes--guia li a[href^="https://"]')).length >= 5);
  });

  await paso('el catálogo con «Filtrar» abierto no se sale de la pantalla a 320 px', async () => {
    const c = await b.newContext({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });
    const q = await c.newPage();
    await q.goto(`${BASE}servicios/?q=camaras`, { waitUntil: 'load' });
    await q.waitForTimeout(1000);
    const filtrar = await q.$('button:has-text("Filtrar")');
    if (filtrar) await filtrar.click();
    await q.waitForTimeout(300);
    const [sw, cw] = await q.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    await c.close();
    assert.ok(sw <= cw, `la página mide ${sw} px en una pantalla de ${cw}`);
  });

  await paso('nada se sale por la derecha a 320, 360 y 375 px', async () => {
    for (const ancho of [320, 360, 375]) {
      const m = await b.newContext({ viewport: { width: ancho, height: 800 } });
      const q = await m.newPage();
      for (const ruta of ['', 'servicios/', 'soluciones/restaurantes/', 'servicios/menu-qr/', 'cotizar/', 'diagnostico/']) {
        await q.goto(BASE + ruta, { waitUntil: 'networkidle' });
        const [sw, cw] = await q.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
        assert.ok(sw <= cw, `${ancho}px /${ruta}: scrollWidth ${sw} > clientWidth ${cw}`);
      }
      await m.close();
    }
  });

  await paso('sin errores en consola ni recursos rotos', async () => {
    assert.deepEqual(errores, []);
  });
} finally {
  await b.close();
}
console.log(fallos ? `${fallos} pasos fallaron` : 'todo bien');
process.exit(fallos ? 1 : 0);
