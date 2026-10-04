// Lo que se hace en cada demo antes de fotografiarla (herramientas/capturas.mjs y herramientas/tarjetas-demos.mjs),
// para que se vea trabajando y no vacía.
export const PREPARAR = {
  // mesa: la carta de la mesa 7 con las fotos de los platos (lo que ve el comensal), no la portada con la placa
  mesa: async (p) => {
    const href = await p.getAttribute('#abrir-mesa-telefono', 'href');
    await p.goto(new URL(href, p.url()).href, { waitUntil: 'load' });
    await p.waitForSelector('img.plato__foto');
    await p.evaluate(async () => {
      const fotos = [...document.querySelectorAll('img.plato__foto')];
      for (const f of fotos) f.loading = 'eager';
      await Promise.all(fotos.map((f) => (f.complete ? null : new Promise((listo) => { f.onload = f.onerror = listo; }))));
    });
    await p.addStyleTag({ content: '.barra-demo { display: none !important; }' });
    await p.waitForTimeout(600);
  },
  // reservas: la agenda de recepción con el día lleno, no la portada de la demo (que es casi todo texto)
  reservas: async (p) => {
    await p.goto(new URL('citas.html', p.url()).href, { waitUntil: 'load' });
    await p.waitForTimeout(1500);
  },
  // el recorrido 3D por dentro (no la portada con el botón «Entrar»): la escena es lo que se captura
  'recorrido-3d': async (p) => {
    await p.click('#entrar');
    await p.waitForFunction(() => document.getElementById('visor')?.dataset.estado === 'listo', null, { timeout: 60000 });
    await p.waitForTimeout(2500);
    await p.evaluate(() => document.getElementById('visor').setAttribute('data-captura', ''));
  },
  sensores: async (p) => {
    await p.waitForSelector('[data-falla="puerta"]:not([disabled])', { timeout: 30000 });
    await p.click('[data-falla="puerta"]');
    await p.waitForTimeout(2500);
    await p.evaluate(() => document.getElementById('notificacion-cerrar')?.click());
    // a la vista: el estado con el aviso, las lecturas con la curva en rojo y el botón de la falla
    await p.evaluate(() => {
      const y = document.getElementById('registro-titulo').getBoundingClientRect().top + scrollY;
      window.scrollTo(0, Math.max(0, y - 330));
    });
    await p.waitForTimeout(400);
  },
  'recorrido-360': async (p) => {
    await p.click('#entrar');
    await p.waitForFunction(() => /Estás en/.test(document.getElementById('estado')?.textContent || ''), null, { timeout: 30000 });
    // póster limpio: sin los controles del visor ni el recuadro de información (la demo los tiene; la foto no los necesita)
    await p.addStyleTag({ content: '.pnlm-controls-container, .pnlm-panorama-info, .pnlm-load-box, .pnlm-hotspot-base.pnlm-info { display: none !important; }' });
    await p.waitForTimeout(800);
  },
};

// las demos de otros repos se abren en local con la misma ruta que tienen en GitHub Pages
export const local = (url, BASE) => url.replace('https://jojomunoz.github.io', BASE).replace(/^(?!http)/, `${BASE}/alphateklab/`);
