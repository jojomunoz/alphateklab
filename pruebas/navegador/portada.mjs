// Recorrido de la portada en un navegador real: filtros, salto desde el tablero, cotizador.
// Uso: servir ~/alphateklab/repos en un puerto y: node pruebas/navegador/portada.mjs http://localhost:4900/alphateklab/
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';

const URL_BASE = process.argv[2] || 'http://localhost:4900/alphateklab/';
const b = await chromium.launch();
let fallos = 0;
const paso = async (nombre, fn) => {
  try { await fn(); console.log('ok  ', nombre); } catch (e) { fallos++; console.log('FALLA', nombre, '\n     ', e.message.split('\n')[0]); }
};
try {
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  await p.goto(URL_BASE, { waitUntil: 'networkidle' });

  await paso('el contenido está en el HTML sin JavaScript', async () => {
    const html = await (await fetch(URL_BASE)).text();
    assert.match(html, /Menú QR a la medida/);
    assert.ok((html.match(/class="ficha"/g) || []).length >= 50);
  });

  await paso('filtrar por clínicas deja solo servicios de clínicas y lo dice', async () => {
    await p.click('label.opcion:has-text("Clínicas y consultorios")');
    const t = await p.textContent('#filtros-cuenta');
    const n = Number(t.match(/Mostrando (\d+)/)[1]);
    assert.ok(n > 0 && n < 20, t);
    const visibles = await p.$$eval('.ficha:not([hidden])', (els) => els.length);
    assert.equal(visibles, n);
    assert.match(p.url(), /sector=salud/);
  });

  await paso('un filtro sin resultados muestra el aviso y «Quitar los filtros» lo arregla', async () => {
    await p.selectOption('#filtro-tipo', 'tresd');
    assert.equal(await p.isVisible('#catalogo-vacio'), true);
    await p.click('#limpiar-filtros');
    assert.match(await p.textContent('#filtros-cuenta'), /Mostrando 54 de 54/);
  });

  await paso('saltar desde el tablero a un servicio oculto quita los filtros', async () => {
    await p.click('label.opcion:has-text("Bienes raíces")');
    await p.click('.tablero a[href="#menu-qr"]');
    await p.waitForTimeout(200);
    assert.equal(await p.isVisible('#menu-qr'), true);
  });

  await paso('agregar dos servicios arma el mensaje y el enlace de WhatsApp', async () => {
    await p.click('#menu-qr [data-cotizar]');
    await p.click('#contador-de-personas [data-cotizar]');
    assert.equal(await p.getAttribute('#menu-qr [data-cotizar]', 'aria-pressed'), 'true');
    await p.fill('#cot-negocio', 'Restaurante de prueba');
    await p.selectOption('#cot-tipo', { label: 'Restaurantes y cafés' });
    await p.fill('#cot-lugar', 'David');
    const m = await p.textContent('#cot-mensaje');
    assert.match(m, /Negocio: Restaurante de prueba \(Restaurantes y cafés\), David/);
    assert.match(m, /- R01 Menú QR a la medida \(\$10 al mes\)/);
    assert.match(m, /- C01 Contador de personas en la entrada/);
    const href = await p.getAttribute('#cot-whatsapp', 'href');
    assert.ok(href.startsWith('https://wa.me/'), href);
    assert.equal(decodeURIComponent(href.split('?text=')[1]), m);
    assert.match(await p.textContent('#cot-cuenta'), /\(2\)/);
  });

  await paso('la cotización sobrevive a recargar la página', async () => {
    await p.reload({ waitUntil: 'networkidle' });
    assert.match(await p.textContent('#cot-cuenta'), /\(2\)/);
    assert.equal(await p.inputValue('#cot-negocio'), 'Restaurante de prueba');
  });

  await paso('«Cotizar este servicio» desde una ficha agrega ese servicio', async () => {
    await p.goto(URL_BASE + 'servicios/recorrido-3d/', { waitUntil: 'networkidle' });
    await p.click('text=Cotizar este servicio');
    await p.waitForLoadState('networkidle');
    assert.match(await p.textContent('#cot-mensaje'), /B01 Recorrido 3D/);
  });

  await paso('vaciar la lista la deja en cero', async () => {
    await p.click('text=Vaciar la lista');
    assert.match(await p.textContent('#cot-cuenta'), /\(0\)/);
    assert.match(await p.textContent('#cot-mensaje'), /Todavía no elegí servicios/);
  });

  await paso('sin scroll horizontal y sin errores en consola', async () => {
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.deepEqual(errores, []);
  });
} finally {
  await b.close();
}
console.log(fallos ? `${fallos} pasos fallaron` : 'todo bien');
process.exit(fallos ? 1 : 0);
