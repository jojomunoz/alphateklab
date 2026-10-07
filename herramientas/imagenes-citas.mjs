// Pasa las capturas PNG del piloto (herramientas/capturas-citas.mjs) a WebP en los tamaños que usa la portada, en claro
// y en oscuro: las de computadora a 1600 × 1000 y 800 × 500, y la del teléfono a 780 × 1688 y 390 × 844.
// Uso: node herramientas/imagenes-citas.mjs <carpeta-de-capturas>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from './navegador.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESDE = process.argv[2];
if (!DESDE) { console.error('Uso: node herramientas/imagenes-citas.mjs <carpeta-de-capturas>'); process.exit(2); }
const COMPU = [[1600, 1000], [800, 500]];
const PIEZAS = [
  ['agenda', 'citas-agenda', COMPU],
  ['expediente', 'citas-expediente', COMPU],
  ['nota', 'citas-nota', COMPU],
  ['accesos', 'citas-accesos', COMPU],
  ['registro', 'citas-registro', [[780, 1688], [390, 844]]],
];
mkdirSync(join(RAIZ, 'assets/producto'), { recursive: true });
const nav = await chromium.launch();
const p = await nav.newPage();
let n = 0;
try {
  for (const [origen, destino, tamanos] of PIEZAS) {
    for (const sufijo of ['', '-oscuro']) {
      const png = readFileSync(join(DESDE, `${origen}${sufijo}.png`)).toString('base64');
      for (const [i, [w, h]] of tamanos.entries()) {
        // Se achica a la mitad cuantas veces haga falta y el último paso va al tamaño justo: de un salto grande el
        // texto de la captura sale con dientes.
        const datos = await p.evaluate(async ({ png, w, h }) => {
          const img = new Image();
          img.src = `data:image/png;base64,${png}`;
          await img.decode();
          let fuente = img;
          let [aw, ah] = [img.width, img.height];
          while (aw / 2 >= w) {
            const c = document.createElement('canvas');
            [c.width, c.height] = [Math.round(aw / 2), Math.round(ah / 2)];
            const x = c.getContext('2d');
            x.imageSmoothingQuality = 'high';
            x.drawImage(fuente, 0, 0, c.width, c.height);
            [fuente, aw, ah] = [c, c.width, c.height];
          }
          const c = document.createElement('canvas');
          [c.width, c.height] = [w, h];
          const x = c.getContext('2d');
          x.imageSmoothingQuality = 'high';
          x.drawImage(fuente, 0, 0, w, h);
          return c.toDataURL('image/webp', 0.84).split(',')[1];
        }, { png, w, h });
        writeFileSync(join(RAIZ, 'assets/producto', `${destino}${sufijo}${i ? `-${w}` : ''}.webp`), Buffer.from(datos, 'base64'));
        n++;
      }
    }
  }
} finally {
  await nav.close();
}
console.log(`${n} imágenes en assets/producto/`);
