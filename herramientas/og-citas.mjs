// La imagen que sale al compartir alphateklab.com (WhatsApp, correo, redes): 1200 × 630, con el nombre, la promesa y
// la agenda real en una computadora. Sale de los datos y de las capturas, así que se rehace igual cada vez.
// Uso: node herramientas/og-citas.mjs   → assets/og-citas.jpg
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from './navegador.mjs';
import { PRODUCTO, PRUEBA_DIAS, DESDE } from '../datos/producto.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const b64 = (r) => readFileSync(join(RAIZ, r)).toString('base64');
const fuente = (r) => `url(data:font/woff2;base64,${b64(r)}) format("woff2")`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; font-weight: 400 800; src: ${fuente('assets/fuentes/manrope-latin.woff2')}; }
@font-face { font-family: Inter; font-weight: 400 800; src: ${fuente('assets/fuentes/inter-latin.woff2')}; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Inter, sans-serif; color: #eef1f6;
  background: radial-gradient(60% 80% at 95% 0%, rgb(79 70 229 / .55), transparent 60%), radial-gradient(55% 70% at 0% 100%, rgb(15 118 110 / .5), transparent 60%), #151a30; }
.fila { display: grid; grid-template-columns: 560px 1fr; gap: 24px; align-items: center; height: 100%; padding: 0 0 0 64px; }
.marca { display: flex; align-items: center; gap: 14px; font-family: Manrope; font-weight: 700; font-size: 30px; }
.marca small { display: block; font-family: Inter; font-weight: 500; font-size: 16px; color: #aab2c4; margin-top: 2px; }
.marca svg { width: 54px; height: 54px; }
h1 { font-family: Manrope; font-weight: 700; font-size: 54px; line-height: 1.06; letter-spacing: -0.03em; margin: 34px 0 22px; }
h1 span { background: linear-gradient(100deg, #a5abff, #5fd3c4); -webkit-background-clip: text; color: transparent; }
.datos { display: flex; gap: 12px; flex-wrap: wrap; }
.datos b { padding: 10px 16px; border-radius: 999px; background: rgb(255 255 255 / .1); font-size: 19px; font-weight: 650; }
.portatil { width: 760px; background: #0d1016; border-radius: 18px 18px 8px 8px; padding: 12px 12px 0; box-shadow: 0 40px 80px -30px rgb(0 0 0 / .8); }
.portatil div { aspect-ratio: 16 / 10; overflow: hidden; border-radius: 8px 8px 0 0; }
.portatil img { width: 100%; display: block; }
</style></head><body><div class="fila"><div>
<div class="marca"><svg viewBox="0 0 128 128"><path fill="#eef1f6" fill-rule="evenodd" d="M64 20a44 44 0 1 0 0 88a44 44 0 1 0 0-88Zm0 21a23 23 0 1 1 0 46a23 23 0 1 1 0-46Z"/><path fill="#eef1f6" d="M87 20h21v63H87z"/><rect x="87" y="87" width="21" height="21" rx="3" fill="#8b93f8"/></svg><span>${PRODUCTO}<small>por alphateklab</small></span></div>
<h1>Agenda con <span>recordatorios por WhatsApp</span> y expediente clínico</h1>
<div class="datos"><b>${PRUEBA_DIAS} días gratis</b><b>Desde $${DESDE} al mes</b><b>Hecho en Panamá</b></div>
</div><div class="portatil"><div><img src="data:image/webp;base64,${b64('assets/producto/citas-agenda.webp')}"></div></div></div></body></html>`;

const nav = await chromium.launch();
try {
  const p = await nav.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(RAIZ, 'assets/og-citas.jpg'), type: 'jpeg', quality: 86 });
} finally {
  await nav.close();
}
console.log('assets/og-citas.jpg');
