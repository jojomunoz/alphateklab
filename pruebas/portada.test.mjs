// La portada de alphateklab (la raíz del sitio) y la página de Food: lo publicado está al día con datos/portada.mjs y
// datos/food.mjs, la portada lleva a cada producto y Food se contacta por su formulario, que llega a FormSubmit (sin
// WhatsApp). Corre con: node --test pruebas/portada.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOOD } from '../datos/food.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (r) => readFileSync(join(RAIZ, r), 'utf8');
const PAGINAS = ['index.html', 'food/index.html'];

test('lo publicado está al día: generar otra vez da lo mismo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'portada-'));
  try {
    const env = { ...process.env, SALIDA: dir };
    delete env.FORM_DESTINO;
    execFileSync(process.execPath, [join(RAIZ, 'herramientas/generar-portada.mjs'), '--raiz'], { env, stdio: 'pipe' });
    for (const r of PAGINAS) assert.equal(readFileSync(join(dir, r), 'utf8'), leer(r), `${r}: corre node herramientas/generar-portada.mjs --raiz`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('la portada lleva a Med (med/), a Food (food/), a «Iniciar sesión» (entrar/), a alphatend y a «Probar gratis» de cada uno', () => {
  const html = leer('index.html');
  for (const href of ['med/', 'food/', 'food/#contacto', 'https://alphatend.com/']) assert.ok(html.includes(`href="${href}"`), href);
  // Arriba, nada de «Entrar a Med»: la portada es de todos los productos y cada uno entra desde su página (Edwin, 10-oct).
  assert.ok(!html.includes('Entrar a Med') && !/<header[\s\S]*?href="entrar\/"[\s\S]*?<\/header>/.test(html), 'sin «Entrar a Med» en la barra');
  // «Probar gratis»: Med al registro, Food a su formulario y alphatend a su alta (Edwin, 10-oct)
  for (const href of ['registro/', 'food/#contacto', 'https://alphatend.com/entrar?gratis=1']) assert.match(html, new RegExp(`href="${href.replace(/[?.]/g, '\\$&')}"[^>]*><span>Probar gratis</span>`), `Probar gratis → ${href}`);
  assert.doesNotMatch(html, /med\.alphateklab\.com|portada-nueva|noindex/, 'ni el subdominio, ni la vista previa, ni fuera de los buscadores');
});

test('Food se contacta por su formulario, que llega a FormSubmit; sin WhatsApp', () => {
  const html = leer('food/index.html');
  const form = html.match(/<form class="sm-form"[^>]*>/)?.[0];
  assert.ok(form, 'el formulario');
  assert.ok(FOOD.formulario.destino, 'el destino, en datos/food.mjs');
  const d = encodeURIComponent(FOOD.formulario.destino);
  assert.ok(form.includes(`action="https://formsubmit.co/${d}"`) && form.includes(`data-ajax="https://formsubmit.co/ajax/${d}"`), form);
  for (const campo of ['nombre', 'email', 'mensaje', '_honey', '_subject', '_next']) assert.match(html, new RegExp(`name="${campo}"`), campo);
  assert.ok(html.includes('value="https://alphateklab.com/food/#enviado"') && html.includes('id="enviado"'), 'sin JavaScript, FormSubmit vuelve a #enviado');
  for (const r of PAGINAS) assert.doesNotMatch(leer(r), /wa\.me|whatsapp-logo/i, `${r}: sin WhatsApp`);
  assert.match(leer('privacidad/index.html'), /formsubmit\.co/, 'la privacidad dice a dónde va el formulario');
});

test('Food arriba: «Iniciar sesión» lleva a entrar en Vuelve y «Probar gratis» deja elegir Sobremesa o Vuelve (sin Racha)', () => {
  const html = leer('food/index.html');
  const menu = (clase) => html.match(new RegExp(`<details class="elegir elegir--${clase}"[\\s\\S]*?</details>`))?.[0] ?? '';
  const destinos = (m) => [...m.matchAll(/class="elegir__opcion" href="([^"]+)"/g)].map((x) => x[1]);
  assert.deepEqual(destinos(menu('entrar')), ['https://vuelve.alphateklab.com/entrar'], 'Iniciar sesión: solo Vuelve (Sobremesa no tiene panel en línea)');
  assert.deepEqual(destinos(menu('probar')), ['#contacto', 'https://vuelve.alphateklab.com/registro'], 'Probar gratis: Sobremesa a su formulario y Vuelve a su registro');
  for (const r of PAGINAS) assert.doesNotMatch(leer(r), /racha/i, `${r}: la tarjeta de lealtad se llama Vuelve (Edwin, 10-oct)`);
});

test('un solo H1 por página y cada imagen con texto alternativo y medidas', () => {
  for (const r of PAGINAS) {
    const html = leer(r);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, r);
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img, /\salt="/, `${r}: ${img.slice(0, 80)}`);
      assert.match(img, /\swidth="\d+"/, `${r}: sin ancho`);
      assert.match(img, /\sheight="\d+"/, `${r}: sin alto`);
    }
  }
});
