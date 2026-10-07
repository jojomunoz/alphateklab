// La portada de Citas Médicas en un navegador de verdad: nada se sale por la derecha del teléfono a la computadora,
// sin errores en la consola ni recursos rotos, el menú del teléfono, los paquetes de mensajes, la calculadora, lo que
// viaja al formulario de la prueba y el mensaje que arma, las animaciones (y quietas con «reducir movimiento»), el
// modo oscuro y el sistema de títulos.
// Uso: node pruebas/navegador/citas.mjs <url>   (local: node herramientas/servir.mjs y http://localhost:4900/alphateklab/)
//      MOTOR=webkit para el motor de Safari.
import assert from 'node:assert/strict';
import pw from '../../herramientas/navegador.mjs';
import { PRECIOS } from '../../datos/producto.mjs';

const BASE = (process.argv[2] || 'http://localhost:4900/alphateklab/').replace(/\/?$/, '/');
const motor = pw[process.env.MOTOR || 'chromium'];
const b = await motor.launch();
let fallos = 0;
async function paso(nombre, fn) {
  try {
    await fn();
    console.log(`ok   ${nombre}`);
  } catch (e) {
    fallos++;
    console.log(`MAL  ${nombre}\n     ${String(e.message).split('\n').slice(0, 4).join('\n     ')}`);
  }
}
// Quieta por defecto (sin desplazamiento suave ni animaciones atadas al scroll, que mueven lo que se va a tocar);
// la prueba de las animaciones pide movimiento.
const abrir = async (opciones = {}, ruta = '') => {
  const c = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce', ...opciones });
  const p = await c.newPage();
  await p.goto(BASE + ruta, { waitUntil: 'load' });
  return { c, p };
};
// baja por toda la página para que carguen las imágenes perezosas
const recorrer = (p) => p.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
    scrollTo({ top: y, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 50));
  }
  scrollTo({ top: 0, behavior: 'instant' });
});

try {
  await paso('nada se sale por la derecha, de 320 a 1440 px', async () => {
    const malos = [];
    for (const ancho of [320, 360, 375, 390, 414, 768, 1024, 1280, 1440]) {
      const { c, p } = await abrir({ viewport: { width: ancho, height: 800 } });
      const sobra = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (sobra > 0) malos.push(`${ancho} px: ${sobra} px de más`);
      await c.close();
    }
    assert.deepEqual(malos, []);
  });

  await paso('sin errores en la consola ni recursos rotos (portada, privacidad, /citasmed/)', async () => {
    const errores = [];
    for (const ruta of ['', 'privacidad/', 'citasmed/']) {
      const c = await b.newContext({ viewport: { width: 1280, height: 860 } });
      const p = await c.newPage();
      p.on('console', (m) => m.type() === 'error' && errores.push(`${ruta}: ${m.text()}`));
      p.on('pageerror', (e) => errores.push(`${ruta}: ${e.message}`));
      p.on('response', (r) => r.status() >= 400 && errores.push(`${ruta}: ${r.status()} ${r.url()}`));
      await p.goto(BASE + ruta, { waitUntil: 'networkidle' });
      if (ruta === 'citasmed/') {
        await p.waitForURL((u) => !u.pathname.includes('citasmed'), { timeout: 5000 });
      } else await recorrer(p);
      await p.waitForTimeout(300);
      const rotas = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
      for (const r of rotas) errores.push(`${ruta}: imagen rota ${r}`);
      await c.close();
    }
    assert.deepEqual(errores, []);
  });

  await paso('el menú del teléfono abre, lleva a la sección y se cierra', async () => {
    const { c, p } = await abrir({ viewport: { width: 390, height: 800 } });
    const boton = p.locator('[data-abrir-menu]');
    assert.ok(await boton.isVisible());
    await boton.click();
    assert.equal(await boton.getAttribute('aria-expanded'), 'true');
    await p.locator('#menu-movil a[href$="#precios"]').click();
    assert.ok(await p.locator('#menu-movil').isHidden());
    await p.waitForFunction(() => location.hash === '#precios');
    await p.waitForTimeout(300);
    const arriba = await p.evaluate(() => document.getElementById('precios').getBoundingClientRect().top);
    assert.ok(arriba < 200, `la sección de precios quedó en ${Math.round(arriba)} px`);
    await c.close();
  });

  await paso('los paquetes de mensajes cambian el precio de la agenda', async () => {
    const { c, p } = await abrir();
    const visible = () => p.locator('.plan--agenda .plan__cifra:visible strong').innerText();
    assert.equal(await visible(), `$${PRECIOS.agenda[0].precio}`);
    for (const a of PRECIOS.agenda.slice(1)) {
      await p.locator(`.plan--agenda label:has(input[value="${a.mensajes}"])`).click();
      assert.ok(await p.locator(`.plan--agenda input[value="${a.mensajes}"]`).isChecked());
      assert.equal(await visible(), `$${a.precio}`);
    }
    await c.close();
  });

  await paso('la calculadora suma lo que eliges', async () => {
    const { c, p } = await abrir();
    const total = () => p.locator('[data-total]').innerText();
    const [p0, p1] = PRECIOS.agenda;
    assert.ok(await p.locator('[data-calculadora]').isVisible());
    assert.equal(await total(), `$${p0.precio + 2 * PRECIOS.expediente}`);
    await p.selectOption('[name="calc-mensajes"]', String(p1.mensajes));
    assert.equal(await total(), `$${p1.precio + 2 * PRECIOS.expediente}`);
    // la tarjeta de la agenda sigue a la calculadora
    assert.ok(await p.locator(`.plan--agenda input[value="${p1.mensajes}"]`).isChecked());
    await p.click('[data-sumar="1"]');
    await p.click('[data-sumar="1"]');
    assert.equal(await total(), `$${p1.precio + 4 * PRECIOS.expediente}`);
    await p.uncheck('[name="calc-agenda"]');
    assert.equal(await total(), `$${4 * PRECIOS.expediente}`);
    await p.fill('[name="calc-profesionales"]', '0');
    await p.locator('[name="calc-profesionales"]').blur();
    assert.equal(await p.inputValue('[name="calc-profesionales"]'), '1', 'no baja de un profesional');
    await c.close();
  });

  await paso('el formulario de la prueba recibe el plan y arma el mensaje (si hay contacto)', async () => {
    const { c, p } = await abrir();
    if (!(await p.locator('[data-prueba]').count())) {
      console.log('     (sin contacto en datos/sitio.mjs: la portada no lleva formulario)');
      await c.close();
      return;
    }
    await p.evaluate(() => { window.__abierto = null; window.open = (u) => { window.__abierto = u; return {}; }; });
    await p.selectOption('[name="calc-mensajes"]', String(PRECIOS.agenda[1].mensajes));
    await p.click('[data-elegir="calculadora"]');
    assert.equal(await p.inputValue('[data-prueba] [name="medicos"]'), '2');
    assert.ok(await p.locator('[data-prueba] [name="interes"][value="los dos"]').isChecked());
    await p.fill('[data-prueba] [name="nombre"]', 'Dra. Prueba');
    await p.fill('[data-prueba] [name="clinica"]', 'Clínica de Prueba');
    const boton = p.locator('[data-prueba] button[value="whatsapp"]');
    if (await boton.count()) {
      await boton.click();
      const url = await p.evaluate(() => window.__abierto);
      assert.match(url, /^https:\/\/wa\.me\/\d+\?text=/);
      const texto = decodeURIComponent(url.split('text=')[1]);
      assert.ok(texto.includes('Clínica de Prueba') && texto.includes('Quiero probar: los dos') && texto.includes(`$${PRECIOS.agenda[1].precio}`), texto);
    }
    await c.close();
  });

  await paso('«Probar este plan» lleva al registro con lo elegido (si el registro está en línea)', async () => {
    const { c, p } = await abrir();
    const href = await p.getAttribute('[data-elegir="calculadora"]', 'href');
    if (!/^https?:/.test(href || '')) {
      console.log('     (sin registro en línea: va al formulario de la prueba)');
      await c.close();
      return;
    }
    let pedida = null;
    await p.route(/\/registro(\?|$)/, (r) => { pedida = r.request().url(); r.fulfill({ status: 200, contentType: 'text/html', body: 'registro' }); });
    await p.selectOption('[name="calc-mensajes"]', String(PRECIOS.agenda[2].mensajes));
    await p.click('[data-sumar="1"]');
    await p.click('[data-elegir="calculadora"]');
    await p.waitForURL(/\/registro\?/);
    const q = new URL(pedida).searchParams;
    assert.deepEqual([q.get('expediente'), q.get('profesionales'), q.get('agenda'), q.get('mensajes')], ['1', '3', '1', String(PRECIOS.agenda[2].mensajes)]);
    await c.close();
  });

  await paso('la conversación y el dictado se animan al verse, y quedan quietos con «reducir movimiento»', async () => {
    const { c, p } = await abrir({ reducedMotion: 'no-preference' });
    await p.locator('[data-chat]').scrollIntoViewIfNeeded();
    await p.waitForFunction(() => document.querySelector('[data-chat] .esperando, [data-chat] .chat__escribiendo'), null, { timeout: 4000 });
    // los dos dictados (el del héroe y el de su sección) se escriben solos al verse
    for (const i of [0, 1]) {
      await p.locator('[data-dictado]').nth(i).scrollIntoViewIfNeeded();
      await p.waitForFunction((i) => document.querySelectorAll('[data-dictado]')[i].querySelector('.escribiendo'), i, { timeout: 4000 });
    }
    await c.close();
    const q = await abrir({ reducedMotion: 'reduce' });
    await q.p.locator('[data-chat]').scrollIntoViewIfNeeded();
    await q.p.waitForTimeout(1500);
    assert.equal(await q.p.locator('[data-chat] [data-paso]:visible').count(), 3, 'la conversación entera');
    const textos = await q.p.locator('[data-dictado] [data-texto]').evaluateAll((els) => els.every((e) => e.textContent === e.dataset.texto));
    assert.ok(textos, 'el dictado completo');
    await q.c.close();
  });

  await paso('sale en claro aunque el equipo esté en oscuro; el botón pasa al oscuro con sus capturas y se recuerda', async () => {
    const { c, p } = await abrir({ colorScheme: 'dark' });
    assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'light');
    await recorrer(p);
    const claras = await p.evaluate(() => [...document.querySelectorAll('img[data-oscuro]')].map((i) => i.currentSrc));
    assert.ok(claras.length >= 4 && claras.every((s) => s && !s.includes('-oscuro')), claras.join('\n'));
    await p.click('[data-tema]');
    assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'dark');
    assert.equal(await p.getAttribute('[data-tema]', 'aria-pressed'), 'true');
    await recorrer(p);
    await p.waitForTimeout(300);
    const oscuras = await p.evaluate(() => [...document.querySelectorAll('img[data-oscuro]')].map((i) => i.currentSrc));
    assert.ok(oscuras.every((s) => s.includes('-oscuro')), oscuras.join('\n'));
    const fondo = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.equal(fondo, 'rgb(15, 18, 24)', 'el fondo oscuro');
    await p.reload();
    assert.equal(await p.evaluate(() => document.documentElement.dataset.theme), 'dark', 'se recuerda al volver');
    await c.close();
  });

  await paso('los títulos: Manrope 700 y el H1 más grande que cualquier H2', async () => {
    for (const ancho of [1440, 390]) {
      const { c, p } = await abrir({ viewport: { width: ancho, height: 900 } });
      const r = await p.evaluate(() => {
        const est = (e) => { const s = getComputedStyle(e); return { px: parseFloat(s.fontSize), w: s.fontWeight, f: s.fontFamily.split(',')[0].replace(/"/g, '').trim(), t: e.textContent.trim().slice(0, 30) }; };
        return { h1: [...document.querySelectorAll('h1')].map(est), h2: [...document.querySelectorAll('main h2')].map(est), h3: [...document.querySelectorAll('main h3')].map(est) };
      });
      for (const x of [...r.h1, ...r.h2, ...r.h3]) assert.ok(x.w === '700' && x.f === 'Manrope', `${ancho}: «${x.t}» ${x.f} ${x.w}`);
      const maxH2 = Math.max(...r.h2.map((x) => x.px));
      assert.ok(r.h1[0].px > maxH2, `${ancho}: H1 ${r.h1[0].px} px y H2 ${maxH2} px`);
      await c.close();
    }
  });
} finally {
  await b.close();
}
console.log(fallos ? `${fallos} pasos fallaron` : 'todo bien');
process.exit(fallos ? 1 : 0);
