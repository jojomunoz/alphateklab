// Imagen para compartir (1200×630, JPEG): la de la portada (assets/og.jpg) y una por página de negocio
// (assets/og/<negocio>.jpg), a partir de herramientas/og.html. A la derecha va algo real: la pantalla de la demo de ese
// negocio o, si no tiene, avisos de ejemplo de sus servicios. Antes eran fotos generadas, y la revisión del 3-oct vio
// que se delataban en lo primero que recibe quien abre un enlace por WhatsApp.
// Uso: node herramientas/og-soluciones.mjs http://localhost:4900/alphateklab/   (con el sitio servido en local)
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/jonathan/alphatend-do/sitio/node_modules/playwright/index.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://localhost:4900/alphateklab/';
mkdirSync(join(RAIZ, 'assets/og'), { recursive: true });

// el dibujo de cada ícono, sacado del sprite del sitio
const sprite = readFileSync(join(RAIZ, 'assets/iconos.svg'), 'utf8');
const icono = (n) => {
  const m = sprite.match(new RegExp(`<symbol id="i-${n}" viewBox="([^"]+)">([\\s\\S]*?)</symbol>`));
  return m ? `<svg viewBox="${m[1]}" aria-hidden="true">${m[2]}</svg>` : '';
};

const PANTALLA = {
  restaurantes: 'mesa-salon',
  tiendas: 'camara',
  clinicas: 'reservas-agenda',
  hospedaje: 'reservas-alojamiento',
  'bienes-raices': 'recorrido-3d',
  'industria-y-oficinas': 'sensores-tablero',
  'talleres-y-salones': 'reservas-barberia',
};
const AVISOS = {
  portada: [
    ['storefront', 'Tienda', '10:42 a. m.', '214 personas hoy, 18 % más que el sábado pasado.'],
    ['credit-card', 'Facturación', '10:38 a. m.', 'La factura 0001-0245 fue autorizada por la DGI.'],
    ['graduation-cap', 'Colegio', '10:31 a. m.', '12 familias ya pagaron la mensualidad con Yappy.'],
  ],
  escuelas: [
    ['graduation-cap', 'Mensualidades', '7:52 a. m.', '12 familias ya pagaron octubre con Yappy.'],
    ['calendar-check', 'Asistencia', '7:40 a. m.', '5 alumnos de 4.° B todavía no marcan entrada.'],
    ['chat-circle-dots', 'Avisos a padres', '7:15 a. m.', 'La circular del viernes llegó a 186 de 190 familias.'],
  ],
  'cualquier-negocio': [
    ['credit-card', 'Facturación', '10:38 a. m.', 'La factura 0001-0245 fue autorizada por la DGI.'],
    ['map-pin', 'Google Maps', '10:20 a. m.', 'Tienes 3 reseñas nuevas esta semana; una de 2 estrellas.'],
    ['shield-check', 'Respaldo', '6:00 a. m.', 'El respaldo de anoche terminó bien: 14 GB guardados.'],
  ],
};
const sinCorte = (t) => t.replace(/(\d) (a\. m\.|p\. m\.|%|GB)/g, '$1 $2').replace(/a\. m\./g, 'a. m.').replace(/B\/\. /g, 'B/. ');
const htmlAvisos = (lista) =>
  `<div class="avisos"><p class="avisos__cabeza">Avisos de ejemplo de lo que hacemos</p>${lista
    .map(([ic, quien, hora, texto]) => `<div class="aviso"><span class="aviso__icono">${icono(ic)}</span><span><span class="aviso__cabeza"><strong>${quien}</strong><span>${sinCorte(hora)}</span></span><span class="aviso__texto">${sinCorte(texto)}</span></span></div>`)
    .join('')}</div>`;

const b = await chromium.launch();
try {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const hacer = async (salida, { titulo, bajada, lado }) => {
    await p.goto(`${base}herramientas/og.html`);
    await p.evaluate(({ titulo, bajada, lado }) => {
      const h1 = document.querySelector('h1');
      h1.firstChild.textContent = titulo.replace(/\.$/, '');
      h1.style.fontSize = titulo.length > 52 ? '2.9rem' : titulo.length > 40 ? '3.1rem' : '3.4rem';
      document.querySelector('.og__texto p').textContent = bajada;
      document.querySelector('.og__lado').innerHTML = lado;
    }, { titulo, bajada, lado });
    await p.waitForLoadState('networkidle');
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: join(RAIZ, salida), type: 'jpeg', quality: 84 });
    console.log('og', salida);
  };
  await hacer('assets/og.jpg', {
    titulo: 'Hacemos la tecnología de tu negocio y la instalamos en tu local',
    bajada: 'Software, apps, inteligencia artificial y equipos instalados para negocios de Panamá.',
    lado: htmlAvisos(AVISOS.portada),
  });
  for (const so of SOLUCIONES) {
    const pantalla = PANTALLA[so.slug];
    await hacer(`assets/og/${so.slug}.jpg`, {
      titulo: so.h1 || so.titulo,
      bajada: `alphateklab · ${so.titulo}, en Panamá.`,
      lado: pantalla ? `<div class="pantalla"><img src="../assets/producto/${pantalla}.webp" alt="" /></div>` : htmlAvisos(AVISOS[so.slug] || AVISOS.portada),
    });
  }
} finally {
  await b.close();
}
