// Las miniaturas de las demos con una sola receta (medición liviana del 3-oct: iban en seis estilos, dos eran páginas
// enteras con texto): la pantalla clave de cada demo, recortada a 16:10 y puesta en una ventana sobre el petróleo de la
// marca, siempre en el mismo lugar. Salen assets/demos/tarjeta-<clave>.webp (640×400) y tarjeta-<clave>-1280.webp.
// Las capturas sueltas de assets/demos/<clave>.webp (las que van dentro del portátil) siguen saliendo de capturas.mjs.
// Uso: servir ~/alphateklab/repos y: node herramientas/tarjetas-demos.mjs http://localhost:4900 [clave] [--probar]
import { chromium } from './navegador.mjs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMOS } from '../datos/demos.mjs';
import { PREPARAR, local } from './preparar-demos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4900').replace(/\/$/, '');
const args = process.argv.slice(3);
const probar = args.includes('--probar');
const solo = args.find((a) => !a.startsWith('--'));

// La zona clave de cada demo, en px del visor de 1280×800 (se lleva a 16:10 desde su esquina de arriba a la izquierda).
const ZONA = {
  // la carta (864 px de ancho, centrada) desde el nombre del restaurante
  mesa: () => { const r = document.querySelector('.carta').getBoundingClientRect(); return { x: r.left - 16, y: 12, w: r.width + 32 }; },
  reservas: () => { const r = (document.querySelector('.agenda, [data-agenda], main') ?? document.body).getBoundingClientRect(); return { x: Math.max(0, r.left), y: Math.max(0, r.top - 8), w: 1040 }; },
};
// las que ya son una captura real guardada en el repositorio (era la del contador con cámara, que se fue en oct-2026)
const ARCHIVO = {};

const tmp = mkdtempSync(join(tmpdir(), 'atk-tarjetas-'));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const lienzo = await (await b.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 })).newPage();
  for (const d of DEMOS) {
    if (solo && d.clave !== solo) continue;
    const png = join(tmp, `${d.clave}.png`);
    if (ARCHIVO[d.clave]) {
      execFileSync('magick', [join(RAIZ, ARCHIVO[d.clave]), '-gravity', 'center', '-crop', '864x540+0+0', '+repage', png]);
    } else {
      const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: 'light', locale: 'es-PA' });
      const p = await c.newPage();
      try {
        await p.goto(local(d.url, BASE), { waitUntil: 'load', timeout: 30000 });
        await p.waitForTimeout(1500);
        if (PREPARAR[d.clave]) await PREPARAR[d.clave](p);
        await p.addStyleTag({ content: '.barra-demo, .avisos-breves { display: none !important; }' });
        await p.waitForTimeout(500);
        const z = await p.evaluate(ZONA[d.clave]);
        let { x, y, w } = z;
        let h = w / 1.6;
        if (z.centrar) {
          // visores (3D, 360): el 16:10 más grande que cabe, centrado
          const r = z.centrar;
          w = Math.min(r.width, r.height * 1.6); h = w / 1.6;
          x = r.left + (r.width - w) / 2; y = r.top + (r.height - h) / 2;
        }
        if (probar) await p.screenshot({ path: join(RAIZ, '..', `probar-${d.clave}.png`) });
        await p.screenshot({ path: png, clip: { x, y, width: w, height: h } });
        console.log('zona', d.clave, [x, y, w, h].map(Math.round).join(' '));
      } finally {
        await c.close();
      }
    }
    // la receta: ventana clara con esquinas de 10 px y sombra, 32 px de aire a los lados y arriba, sobre el petróleo
    const datos = readFileSync(png).toString('base64');
    await lienzo.setContent(`<html><body style="margin:0;width:640px;height:400px;background:#0f2c29;overflow:hidden;position:relative">
      <img src="data:image/png;base64,${datos}" style="position:absolute;left:32px;top:32px;width:576px;height:360px;object-fit:cover;object-position:top left;border-radius:10px;box-shadow:0 18px 40px -12px rgb(0 0 0/.6),0 0 0 1px rgb(255 255 255/.08)">
    </body></html>`);
    await lienzo.waitForTimeout(150);
    const salida = join(tmp, `tarjeta-${d.clave}.png`);
    await lienzo.screenshot({ path: salida });
    execFileSync('magick', [salida, '-quality', '80', join(RAIZ, `assets/demos/tarjeta-${d.clave}-1280.webp`)]);
    execFileSync('magick', [salida, '-resize', '640x400', '-quality', '82', join(RAIZ, `assets/demos/tarjeta-${d.clave}.webp`)]);
    console.log('ok', d.clave);
  }
} finally {
  await b.close();
  rmSync(tmp, { recursive: true, force: true });
}
