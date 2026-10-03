// Imagen para compartir (1200×630, JPEG) de cada página de negocio, a partir de herramientas/og.html.
// Uso: node herramientas/og-soluciones.mjs http://localhost:4900/alphateklab/   (con el sitio servido en local)
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://localhost:4900/alphateklab/';
mkdirSync(join(RAIZ, 'assets/og'), { recursive: true });
const b = await chromium.launch();
try {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const so of SOLUCIONES) {
    await p.goto(`${base}herramientas/og.html`);
    await p.evaluate(({ titulo, foto }) => {
      document.querySelector('h1').textContent = titulo;
      document.querySelector('h1').style.fontSize = titulo.length > 40 ? '3rem' : '3.4rem';
      document.querySelector('p').textContent = 'alphateklab · software e instalación para negocios en Panamá';
      document.querySelector('.og__foto img').src = `../assets/fotos/${foto}.webp`;
    }, { titulo: so.titulo, foto: so.foto });
    await p.waitForLoadState('networkidle');
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: join(RAIZ, `assets/og/${so.slug}.jpg`), type: 'jpeg', quality: 82 });
    console.log('og', so.slug);
  }
} finally {
  await b.close();
}
