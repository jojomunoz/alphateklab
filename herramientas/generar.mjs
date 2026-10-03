// Genera el sitio estático de alphateklab a partir de datos/.
// Uso: node herramientas/generar.mjs   (el resultado se versiona; ver CLAUDE.md y README.md)
//   PUBLICAR_PARCIAL=1 DEMOS_LISTAS=recorrido-360,mesa  → publica solo las demos ya verificadas.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { PAQUETES, ESCALONES } from '../datos/paquetes.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { PALABRAS, PALABRAS_NEGOCIO } from '../datos/busqueda.mjs';
import { FICHAS } from '../datos/fichas.mjs';
import { construirIndice } from '../js/indice.mjs';
import { ACTUALIZADO, CONTACTO, URL_BASE } from '../datos/sitio.mjs';
import { validarCatalogo, PALABRAS_PROHIBIDAS } from '../js/catalogo-reglas.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const existe = (ruta) => existsSync(join(RAIZ, ruta));

// Créditos de las fotos (los escribe quien elige las fotos). Si todavía no hay, el sitio sale sin fotos.
let CREDITOS_FOTOS = {};
if (existe('datos/creditos-fotos.mjs')) ({ CREDITOS_FOTOS } = await import(pathToFileURL(join(RAIZ, 'datos/creditos-fotos.mjs')).href));

// ── publicación por partes ──
const PARCIAL = process.env.PUBLICAR_PARCIAL === '1';
const LISTAS = new Set((process.env.DEMOS_LISTAS || '').split(',').filter(Boolean));
const claveDeDemo = (u) => {
  if (!u) return null;
  const base = u.replace(/#.*$/, '');
  const d = DEMOS.find((x) => base === x.url || (/^https?:/.test(x.url) && base.startsWith(x.url)) || base.replace(/\/?$/, '/') === x.url.replace(/\/?$/, '/'));
  return d ? d.clave : null;
};
const DEMOS_TODAS = DEMOS.map((d) => ({ ...d }));
if (PARCIAL) {
  const quitadas = [];
  for (const s of SERVICIOS) if (s.demo && !LISTAS.has(claveDeDemo(s.demo))) { quitadas.push(s.id); s.demo = null; }
  for (let i = DEMOS.length - 1; i >= 0; i--) if (!LISTAS.has(DEMOS[i].clave)) { quitadas.push(`demo ${DEMOS[i].clave}`); DEMOS.splice(i, 1); }
  if (quitadas.length) console.warn(`Publicación parcial: sin demo todavía en ${quitadas.join(', ')}`);
}

// ── validación: el generador no escribe nada si los datos tienen errores ──
let errores = validarCatalogo({ SECTORES, TIPOS, SERVICIOS, DEMOS }, existe);
const idsServicios = new Set(SERVICIOS.map((s) => s.id));
for (const pq of PAQUETES) {
  const vistos = new Set();
  for (const id of pq.niveles.flat()) {
    if (!idsServicios.has(id)) errores.push(`paquete ${pq.nombre}: el servicio ${id} no existe`);
    if (vistos.has(id)) errores.push(`paquete ${pq.nombre}: ${id} aparece dos veces`);
    vistos.add(id);
  }
}
for (const so of SOLUCIONES) {
  if (!SECTORES.some((s) => s.id === so.sector)) errores.push(`solución ${so.slug}: sector ${so.sector} no existe`);
  for (const p of so.problemas) for (const id of p.servicios) if (!idsServicios.has(id)) errores.push(`solución ${so.slug}: servicio ${id} no existe`);
}
for (const s of SERVICIOS) if (!PALABRAS[s.id]) errores.push(`${s.id}: sin palabras de búsqueda en datos/busqueda.mjs`);
for (const [id, f] of Object.entries(FICHAS)) {
  if (!idsServicios.has(id)) errores.push(`ficha ${id}: el servicio no existe`);
  const texto = [...f.como.flatMap((c) => [c.titulo, c.texto]), ...f.necesitas, ...f.no_incluye, ...f.preguntas.flatMap((q) => [q.p, q.r]), f.ejemplo].join('\n');
  for (const re of PALABRAS_PROHIBIDAS) if (re.test(texto)) errores.push(`ficha ${id}: texto con «${texto.match(re)[0]}»`);
  if (/\$\s?\d/.test(texto.replace(/\$10 al mes|\+?\$300|US\$0\.\d+/g, ''))) errores.push(`ficha ${id}: menciona un precio no decidido`);
  if (!/^Ejemplo:/.test(f.ejemplo)) errores.push(`ficha ${id}: el ejemplo debe empezar con «Ejemplo:»`);
}
if (process.env.PERMITIR_PENDIENTES === '1') {
  const pendientes = errores.filter((e) => /no existe en el repo|falta la captura/.test(e));
  if (pendientes.length) console.warn('Pendiente (no bloquea con PERMITIR_PENDIENTES=1):\n- ' + pendientes.join('\n- '));
  errores = errores.filter((e) => !pendientes.includes(e));
}
if (errores.length) {
  console.error('Los datos tienen errores; no se genera nada:\n- ' + errores.join('\n- '));
  process.exit(1);
}

// ── utilidades ──
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const jsonEnScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const porId = new Map(SERVICIOS.map((s) => [s.id, s]));
const sectorPorId = new Map(SECTORES.map((s) => [s.id, s]));
const tipoPorId = new Map(TIPOS.map((t) => [t.id, t]));
const solucionPorSector = new Map(SOLUCIONES.map((so) => [so.sector, so]));
const demoPorClave = new Map(DEMOS.map((d) => [d.clave, d]));
const precioTexto = (s) => (s.precio ? s.precio.texto : 'A cotizar');
const esExterna = (u) => /^https?:\/\//.test(u);
const enlace = (u, prefijo) => (esExterna(u) ? u : prefijo + u);
const contar = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const existeServicio = (u) => SERVICIOS.some((s) => u.endsWith(`servicios/${s.slug}/`));
const serviciosDeSector = (id) => SERVICIOS.filter((s) => s.sectores.includes(id));
const serviciosDeTipo = (id) => SERVICIOS.filter((s) => s.tipos.includes(id));
// Primera letra en minúscula salvo que la primera palabra sea una sigla (QR, NFC, IA, 3D, POS…).
const enMinuscula = (t) => (/^[A-ZÁÉÍÓÚÑ0-9-]{2,}\b/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
// Recorta una descripción a 160 caracteres sin partir palabras.
const recortar = (t, n = 160) => (t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '').replace(/[,;:.]$/, '') + '…');
const SPRITE = readFileSync(join(RAIZ, 'assets/iconos.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');

function icono(nombre, clase = 'ico') {
  return `<svg class="${clase}" aria-hidden="true" focusable="false"><use href="#i-${nombre}"></use></svg>`;
}

function foto(slot, prefijo, { clase = '', sizes = '(min-width: 1000px) 50vw, 100vw', alt, carga = 'lazy', prioridad = false } = {}) {
  if (!slot || !existe(`assets/fotos/${slot}.webp`)) return '';
  const c = CREDITOS_FOTOS[slot] || {};
  const texto = alt ?? c.alt ?? '';
  const hayChico = existe(`assets/fotos/${slot}-800.webp`);
  const srcset = hayChico ? `${prefijo}assets/fotos/${slot}-800.webp 800w, ${prefijo}assets/fotos/${slot}.webp 1600w` : `${prefijo}assets/fotos/${slot}.webp 1600w`;
  return `<img class="${clase}" src="${prefijo}assets/fotos/${slot}${hayChico ? '-800' : ''}.webp" srcset="${srcset}" sizes="${sizes}" alt="${esc(texto)}" width="1600" height="1000" loading="${carga}" decoding="async"${prioridad ? ' fetchpriority="high"' : ''} />`;
}

// ── piezas comunes ──
// Los dos primeros servicios distintos de los problemas de un negocio, para resumirlo en una línea.
function destacados(so, n = 2) {
  const ids = [...new Set(so.problemas.map((p) => p.servicios[0]).concat(so.problemas.flatMap((p) => p.servicios)))].slice(0, n);
  return ids.map((id, i) => (i === 0 ? porId.get(id).corto : enMinuscula(porId.get(id).corto)));
}
function cabecera(prefijo) {
  const soluciones = SOLUCIONES.map(
    (so) => `<li><a class="mega__item" href="${prefijo}soluciones/${so.slug}/">${icono(so.icono, 'ico ico--mega')}<span><strong>${esc(sectorPorId.get(so.sector).nombre)}</strong><small>${esc(destacados(so).join(', '))} y más</small></span></a></li>`,
  ).join('');
  const tipos = TIPOS.map(
    (t) => `<li><a class="mega__item" href="${prefijo}servicios/?tipo=${t.id}">${icono(t.icono, 'ico ico--mega')}<span><strong>${esc(t.nombre)}</strong><small>${esc(t.desc)}</small></span></a></li>`,
  ).join('');
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
<div hidden>${SPRITE}</div>
<header class="cabecera" data-cabecera>
  <div class="envoltura cabecera__fila">
    <a class="marca" href="${prefijo}"><picture><source srcset="${prefijo}assets/marca/logo-oscuro.svg" media="(prefers-color-scheme: dark)" /><img src="${prefijo}assets/marca/logo-claro.svg" alt="alphateklab, inicio" width="142" height="32" /></picture></a>
    <nav class="menu" aria-label="Principal" data-menu>
      <ul class="menu__lista">
        <li class="menu__grupo">
          <button class="menu__boton" type="button" aria-expanded="false" aria-controls="mega-soluciones">Soluciones ${icono('caret-down', 'ico ico--caret')}</button>
          <div class="mega" id="mega-soluciones" hidden>
            <div class="mega__cabeza"><p>Lo que hacemos según tu tipo de negocio</p><a href="${prefijo}diagnostico/">¿No sabes qué pedir? Responde 3 preguntas</a></div>
            <ul class="mega__lista">${soluciones}</ul>
          </div>
        </li>
        <li class="menu__grupo">
          <button class="menu__boton" type="button" aria-expanded="false" aria-controls="mega-servicios">Servicios ${icono('caret-down', 'ico ico--caret')}</button>
          <div class="mega" id="mega-servicios" hidden>
            <div class="mega__cabeza"><p>${SERVICIOS.length} servicios en ${TIPOS.length} tipos de solución</p><a href="${prefijo}servicios/">Ver todos los servicios</a></div>
            <ul class="mega__lista">${tipos}</ul>
          </div>
        </li>
        <li><a class="menu__enlace" href="${prefijo}laboratorio/">Demos</a></li>
        <li><a class="menu__enlace" href="${prefijo}#como-trabajamos">Cómo trabajamos</a></li>
      </ul>
    </nav>
    <div class="cabecera__acciones">
      <button class="buscar-boton" type="button" data-abrir-buscador aria-label="Buscar en el sitio">${icono('magnifying-glass')}<span class="buscar-boton__texto">Buscar</span><kbd>/</kbd></button>
      <a class="boton boton--senal cabecera__cta" href="${prefijo}cotizar/">Pregúntanos<span class="cabecera__cuenta" data-cuenta-cotizacion hidden></span></a>
      <button class="hamburguesa" type="button" aria-expanded="false" aria-controls="menu-movil" data-hamburguesa aria-label="Abrir el menú">${icono('list')}</button>
    </div>
  </div>
  <div class="menu-movil" id="menu-movil" hidden>
    <div class="envoltura menu-movil__cuerpo">
      <button class="buscar-campo-falso" type="button" data-abrir-buscador>${icono('magnifying-glass')} ¿Qué necesitas?</button>
      <details class="menu-movil__grupo" open><summary>Soluciones por negocio</summary><ul>${SOLUCIONES.map((so) => `<li><a href="${prefijo}soluciones/${so.slug}/">${icono(so.icono)}${esc(sectorPorId.get(so.sector).nombre)}</a></li>`).join('')}</ul></details>
      <details class="menu-movil__grupo"><summary>Servicios por tipo</summary><ul>${TIPOS.map((t) => `<li><a href="${prefijo}servicios/?tipo=${t.id}">${icono(t.icono)}${esc(t.nombre)}</a></li>`).join('')}<li><a href="${prefijo}servicios/">${icono('list')}Todos los servicios</a></li></ul></details>
      <ul class="menu-movil__enlaces"><li><a href="${prefijo}diagnostico/">¿Qué necesita mi negocio?</a></li><li><a href="${prefijo}laboratorio/">Demos</a></li><li><a href="${prefijo}#como-trabajamos">Cómo trabajamos</a></li><li><a href="${prefijo}cotizar/">Pregúntanos</a></li></ul>
    </div>
  </div>
</header>`;
}

function dialogoBuscador() {
  return `<dialog class="buscador" data-buscador aria-label="Buscar en alphateklab">
  <form class="buscador__barra" role="search" data-buscador-form>
    ${icono('magnifying-glass')}
    <label class="sr" for="buscador-campo">¿Qué necesitas?</label>
    <input id="buscador-campo" type="search" placeholder="¿Qué necesitas? Escríbelo con tus palabras" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="buscador-resultados" aria-autocomplete="list" />
    <button class="buscador__cerrar" type="button" data-cerrar-buscador aria-label="Cerrar el buscador"><span class="solo-teclado">Esc</span><span class="solo-tactil">Cerrar</span></button>
  </form>
  <div class="buscador__cuerpo">
    <ul class="buscador__resultados" id="buscador-resultados" role="listbox" aria-label="Resultados"></ul>
    <div class="buscador__vacio" data-buscador-vacio hidden></div>
    <div class="buscador__sugerencias" data-buscador-sugerencias></div>
    <p class="sr" role="status" data-buscador-estado></p>
  </div>
</dialog>`;
}

function pie(prefijo) {
  return `<footer class="pie">
  <div class="envoltura">
    <div class="pie__cabeza">
      <a class="marca marca--pie" href="${prefijo}"><img src="${prefijo}assets/marca/logo-oscuro.svg" alt="alphateklab" width="178" height="40" /></a>
      <p>Soluciones tecnológicas para negocios en Panamá. Software, webs, apps e inteligencia artificial, y la instalación de pantallas, cámaras, sensores y QR en tu local.</p>
      <a class="boton boton--senal" href="${prefijo}cotizar/">Pregúntanos lo que necesites</a>
    </div>
    <div class="pie__columnas">
      <div><h2>Soluciones</h2><ul>${SOLUCIONES.map((so) => `<li><a href="${prefijo}soluciones/${so.slug}/">${esc(sectorPorId.get(so.sector).nombre)}</a></li>`).join('')}</ul></div>
      <div><h2>Servicios</h2><ul>${TIPOS.map((t) => `<li><a href="${prefijo}servicios/?tipo=${t.id}">${esc(t.nombre)}</a></li>`).join('')}<li><a href="${prefijo}servicios/">Todos los servicios</a></li></ul></div>
      <div><h2>Demos</h2><ul>${DEMOS.map((d) => `<li><a href="${enlace(d.url, prefijo)}">${esc(d.nombre)}</a></li>`).join('')}<li><a href="${prefijo}laboratorio/">Todas las demos</a></li></ul></div>
      <div><h2>alphateklab</h2><ul><li><a href="${prefijo}diagnostico/">¿Qué necesita mi negocio?</a></li><li><a href="${prefijo}#como-trabajamos">Cómo trabajamos</a></li><li><a href="${prefijo}#preguntas">Preguntas frecuentes</a></li><li><a href="${prefijo}cotizar/">Pregúntanos</a></li><li><a href="${prefijo}privacidad/">Privacidad</a></li><li><a href="${prefijo}creditos/">Créditos de fotos e íconos</a></li></ul></div>
    </div>
    <p class="pie__nota">Las demos usan negocios de ejemplo: sus nombres, platos, pacientes y reservas son ficticios. Actualizado el ${esc(ACTUALIZADO.texto)}.</p>
  </div>
</footer>`;
}

function documento({ titulo, descripcion, prefijo, cuerpo, scripts = '', canonica, robots = '', clase = '', datos = null, imagen = 'assets/og.jpg' }) {
  return `<!doctype html>
<html lang="es-PA" data-raiz="${prefijo || './'}" data-whatsapp="${esc(CONTACTO.whatsapp || '')}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(recortar(descripcion))}" />
<link rel="canonical" href="${esc(canonica)}" />${robots ? `\n<meta name="robots" content="${robots}" />` : ''}
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(titulo)}" />
<meta property="og:description" content="${esc(recortar(descripcion, 200))}" />
<meta property="og:url" content="${esc(canonica)}" />
<meta property="og:locale" content="es_PA" />
<meta property="og:image" content="${URL_BASE}${imagen}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#202729" />
<link rel="icon" href="${prefijo}assets/marca/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="${prefijo}assets/marca/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="${prefijo}assets/marca/favicon-180.png" />
<link rel="preload" href="${prefijo}assets/fuentes/manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="${prefijo}assets/fuentes/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="${prefijo}assets/atk.css" />
<link rel="stylesheet" href="${prefijo}assets/sitio.css" />${datos ? `\n<script type="application/ld+json">${jsonEnScript(datos)}</script>` : ''}
</head>
<body class="${clase}">
${cabecera(prefijo)}
${cuerpo}
${pie(prefijo)}
${dialogoBuscador()}
<script type="module" src="${prefijo}js/sitio.js"></script>
${scripts}
</body>
</html>
`;
}

// Datos estructurados (schema.org). Sin teléfono, dirección ni reseñas mientras no existan.
const ORGANIZACION = { '@type': 'ProfessionalService', '@id': `${URL_BASE}#organizacion`, name: 'alphateklab', url: URL_BASE, logo: `${URL_BASE}assets/marca/favicon-180.png`, areaServed: { '@type': 'Country', name: 'Panamá' }, description: 'Software a medida, páginas, apps e inteligencia artificial, e instalación de pantallas, cámaras, sensores y QR en negocios de Panamá.' };
const migasLd = (partes) => ({ '@type': 'BreadcrumbList', itemListElement: [['Inicio', URL_BASE], ...partes].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(item ? { item } : {}) })) });
const ld = (...nodos) => ({ '@context': 'https://schema.org', '@graph': nodos });

function migas(prefijo, partes) {
  return `<nav class="migas" aria-label="Ruta"><a href="${prefijo}">Inicio</a>${partes.map(([t, u]) => ` <span aria-hidden="true">/</span> ${u ? `<a href="${u}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}`).join('')}</nav>`;
}

function insignias(s) {
  const b = [];
  if (s.demo) b.push(`<span class="insignia insignia--demo">${icono('play-circle')}Demo</span>`);
  if (s.instala) b.push(`<span class="insignia">${icono('wrench')}Se instala</span>`);
  if (s.visita) b.push(`<span class="insignia">${icono('map-pin')}Vamos a tu propiedad</span>`);
  return b.join('');
}

function tarjetaServicio(s, prefijo) {
  return `<article class="tarjeta-servicio" id="${s.slug}" data-id="${s.id}" data-sectores="${s.sectores.join(' ')}" data-tipos="${s.tipos.join(' ')}" data-demo="${s.demo ? 1 : 0}" data-instala="${s.instala ? 1 : 0}">
  <h3 class="tarjeta-servicio__nombre"><a href="${prefijo}servicios/${s.slug}/">${esc(s.nombre)}</a></h3>
  <p class="tarjeta-servicio__para">${esc(s.para)}</p>
  <div class="tarjeta-servicio__insignias">${insignias(s)}</div>
  <div class="tarjeta-servicio__pie"><span class="tarjeta-servicio__precio num">${esc(precioTexto(s))}</span><button class="boton-chico" type="button" data-cotizar="${s.id}" aria-pressed="false" aria-label="Agregar ${esc(s.nombre)} a mi lista">Agregar</button></div>
</article>`;
}

function bandaPreguntanos(prefijo, { titulo = '¿No encontraste lo que buscas?', texto = 'La lista es lo que ya tenemos descrito, no todo lo que podemos hacer. Cuéntanos qué necesitas y te decimos si lo podemos hacer.' } = {}) {
  return `<section class="banda-pregunta" aria-labelledby="banda-titulo">
  <div class="envoltura banda-pregunta__fila">
    <div class="banda-pregunta__texto">
      <h2 id="banda-titulo" class="display banda-pregunta__titulo">${esc(titulo)}</h2>
      <p>${esc(texto)}</p>
    </div>
    <form class="banda-pregunta__form" data-pregunta-rapida>
      <label class="sr" for="pregunta-rapida">Qué necesitas</label>
      <textarea id="pregunta-rapida" rows="3" maxlength="600" placeholder="Ej.: quiero que mis vendedores vean el inventario desde el teléfono" required></textarea>
      <button class="boton boton--senal" type="submit">${icono('whatsapp-logo')}Preguntar por WhatsApp</button>
    </form>
  </div>
</section>`;
}

function marcoDispositivo(tipo, contenido) {
  return `<div class="dispositivo dispositivo--${tipo}"><div class="dispositivo__pantalla">${contenido}</div></div>`;
}

function capturaDemo(d, prefijo, alt) {
  return d && d.imagen && existe(d.imagen) ? `<img src="${prefijo}${d.imagen}" alt="${esc(alt ?? `Captura de la demo: ${d.nombre}`)}" width="640" height="400" loading="lazy" decoding="async" />` : '';
}

function tarjetaDemo(d, prefijo, { nivel = 'h3', grande = false } = {}) {
  return `<li class="demo${grande ? ' demo--grande' : ''}"><a class="demo__enlace" href="${enlace(d.url, prefijo)}">
    <div class="demo__captura">${capturaDemo(d, prefijo, '') || `<span class="demo__sincaptura">${icono('play-circle', 'ico ico--grande')}</span>`}</div>
    <div class="demo__texto"><${nivel} class="demo__nombre">${esc(d.nombre)}</${nivel}><p>${esc(d.que)}</p><span class="demo__probar">${icono('play-circle')}Probar la demo</span></div>
  </a></li>`;
}

function demoPendiente(d) {
  return `<li class="demo demo--pendiente"><div class="demo__enlace">
    <div class="demo__captura"><span class="demo__sincaptura">${icono('wrench', 'ico ico--grande')}</span></div>
    <div class="demo__texto"><h3 class="demo__nombre">${esc(d.nombre)}</h3><p>${esc(d.que)}</p><span class="demo__estado">En construcción: aparece aquí cuando pase su revisión</span></div>
  </div></li>`;
}

const ETAPA_DESC = [
  'Lo que resuelve el problema más común, con poco equipo.',
  'Cuando lo primero ya funciona y quieres ahorrar más tiempo.',
  'El resto del local conectado: control, registro y datos.',
];
function escalera(pq, prefijo) {
  return `<ol class="etapas" aria-label="Etapas sugeridas para ${esc(pq.nombre.toLowerCase())}">
    ${pq.niveles
      .map(
        (ids, i) => `<li class="etapa">
      <div class="etapa__cabeza"><p class="etapa__nombre"><span class="etapa__num num">${i + 1}</span>${ESCALONES[i]}</p><p class="etapa__desc">${ETAPA_DESC[i]}</p></div>
      <ul class="etapa__servicios">${ids.map((id) => `<li><a href="${prefijo}servicios/${porId.get(id).slug}/">${esc(porId.get(id).nombre)}</a></li>`).join('')}</ul>
      <button class="boton-chico etapa__agregar" type="button" data-cotizar-varios="${ids.join(' ')}">${ids.length === 1 ? 'Agregar a mi lista' : `Agregar estos ${ids.length} a mi lista`}</button>
    </li>`,
      )
      .join('')}
  </ol>`;
}

const PREGUNTAS = [
  ['¿Hacen solo software o también instalan equipos?', 'Las dos cosas. Hacemos páginas web, apps, sistemas a medida, automatizaciones e inteligencia artificial, y además vamos a tu local a instalar lo físico: placas QR y NFC, pantallas, cámaras, sensores, cerraduras y redes.'],
  ['¿Y si lo que necesito no está en la lista?', 'Pregúntanos. La lista es lo que ya tenemos descrito, no todo lo que podemos hacer. Escríbelo con tus palabras en el buscador o en «Pregúntanos» y te decimos si lo podemos hacer.'],
  ['¿Tengo que comprar equipo?', 'Solo si el servicio lo necesita. En la propuesta te detallamos qué equipo y cuánto cuesta, y lo compramos después de que la apruebas. Si ya tienes algo que sirve (cámaras, una tableta, un televisor), lo usamos.'],
  ['¿De quién son el dominio, la página y los QR?', 'Tuyos. El dominio se registra a nombre de tu negocio y los QR impresos apuntan a una dirección de ese dominio, así que siguen funcionando aunque un día cambies de proveedor.'],
  ['¿Cuánto cuesta?', 'Depende del servicio y de tu negocio; la cifra va cerrada en la propuesta. Lo que ya tiene precio lo ves en cada servicio, como el menú QR a $10 al mes.'],
  ['¿Las demos son de verdad?', 'Funcionan en tu navegador con negocios inventados para mostrarlas, y cada una dice qué parte es simulada (un pago, un sensor). Para tu negocio se hace con tus datos, en tu dominio y con el equipo real.'],
  ['¿Y los datos de mis clientes?', 'Lo que hacemos cumple la Ley 81 de 2019 de protección de datos personales: pide el consentimiento cuando guarda datos de personas y no los comparte con terceros.'],
];

// ── portada ──
function paginaInicio() {
  const prefijo = '';
  const chips = [
    ['Pedidos con QR', 'pedir desde la mesa con qr'],
    ['Contar clientes', 'contar personas que entran'],
    ['Recordar citas', 'recordar citas a pacientes'],
    ['Página web', 'página web'],
    ['Inventario', 'inventario'],
    ['Recorrido 3D', 'recorrido 3d de una propiedad'],
    ['Cámaras', 'cámaras de seguridad'],
    ['Chatbot', 'chatbot de whatsapp'],
  ];
  const fotosHeroe = ['sector-restaurantes', 'sector-comercio', 'sector-salud', 'sector-hospedaje'].filter((s) => existe(`assets/fotos/${s}.webp`));
  const heroe = `<section class="heroe" aria-labelledby="heroe-titulo">
  <div class="envoltura heroe__fila">
    <div class="heroe__texto">
      <h1 id="heroe-titulo" class="display heroe__titulo">Hacemos la tecnología de tu negocio y la instalamos en tu local.</h1>
      <p class="heroe__bajada">Software a medida, páginas y apps, inteligencia artificial, cámaras, sensores, pantallas y recorridos 3D para negocios en Panamá.</p>
      <form class="heroe__buscar" role="search" data-buscar-en-linea action="${prefijo}servicios/">
        ${icono('magnifying-glass')}
        <label class="sr" for="heroe-campo">¿Qué necesitas?</label>
        <input id="heroe-campo" name="q" type="search" placeholder="¿Qué necesitas? Ej.: un menú QR" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="heroe-resultados" aria-autocomplete="list" />
        <button class="boton boton--senal" type="submit">Buscar</button>
        <div class="heroe__resultados" id="heroe-resultados" hidden></div>
      </form>
      <p class="heroe__prueba">Prueba con: ${chips.map(([t, q]) => `<button type="button" class="chip-texto" data-buscar="${esc(q)}">${esc(t)}</button>`).join(', ')}.</p>
      <p class="heroe__diagnostico"><a class="boton boton--linea" href="${prefijo}diagnostico/">${icono('question')}¿No sabes qué pedir? Responde 3 preguntas</a></p>
    </div>
    <div class="heroe__visual" aria-hidden="true">
      ${
        existe('assets/fotos/marca-heroe.webp')
          ? `<div class="heroe__imagen">${foto('marca-heroe', prefijo, { sizes: '(min-width: 1040px) 48vw, 100vw', alt: '', carga: 'eager', prioridad: true })}</div>`
          : `<div class="mosaico">${fotosHeroe.map((s, i) => `<div class="mosaico__foto mosaico__foto--${i + 1}">${foto(s, prefijo, { sizes: '(min-width: 1000px) 25vw, 50vw', alt: '', carga: 'eager', prioridad: i === 0 })}</div>`).join('')}</div>`
      }
    </div>
  </div>
</section>`;

  const situaciones = [
    ['storefront', 'Voy a abrir un negocio', 'Lo que conviene tener desde el primer día.', `${prefijo}diagnostico/`],
    ['arrows-clockwise', 'Mi sistema no me sirve', 'Cambiar el Excel, el papel o el programa que se quedó corto.', `${prefijo}servicios/software-a-medida/`],
    ['code', 'Quiero algo hecho a la medida', 'Una web, una app o un sistema que haga lo que tu negocio hace.', `${prefijo}servicios/?tipo=software`],
    ['lifebuoy', 'Que me mantengan lo que tengo', 'Computadoras, red, respaldos y soporte cuando algo falla.', `${prefijo}servicios/soporte-tecnico/`],
  ].filter(([, , , u]) => !u.includes('/servicios/') || u.includes('?') || existeServicio(u));
  const entradas = `<section class="situaciones envoltura" aria-labelledby="sit-titulo">
  <h2 id="sit-titulo" class="situaciones__titulo">¿En qué punto estás?</h2>
  <ul class="situaciones__lista" role="list">${situaciones.map(([i, t, d, u]) => `<li><a class="situacion" href="${u}">${icono(i)}<span><strong>${t}</strong><small>${d}</small></span></a></li>`).join('')}</ul>
</section>`;

  const instalamos = [
    ['qr-code', 'QR y NFC en cada mesa'],
    ['monitor', 'Pantallas táctiles y de cocina'],
    ['security-camera', 'Cámaras con IA'],
    ['thermometer-simple', 'Sensores de temperatura y energía'],
    ['shield-check', 'Cerraduras y control de acceso'],
    ['broadcast', 'Redes y Wi-Fi'],
    ['cube-focus', 'Escaneo 3D y 360'],
  ];
  const tira = `<section class="tira" aria-labelledby="tira-titulo">
  <div class="envoltura tira__fila"><p class="tira__titulo" id="tira-titulo">${icono('wrench')}Además de programarlo, lo instalamos:</p><ul>${instalamos.map(([i, t]) => `<li>${icono(i)}${t}</li>`).join('')}</ul></div>
</section>`;

  const negocios = `<section class="seccion envoltura" id="soluciones" aria-labelledby="sol-titulo">
  <div class="seccion__cabeza">
    <h2 id="sol-titulo" class="display seccion__titulo">¿Qué tipo de negocio tienes?</h2>
    <p class="seccion__bajada">Elige el tuyo: verás los problemas que resolvemos en ese tipo de negocio y con qué.</p>
  </div>
  <ul class="negocios" role="list">
    ${SOLUCIONES.map(
      (so) => `<li><a class="negocio" href="${prefijo}soluciones/${so.slug}/">
      <div class="negocio__foto">${foto(so.foto, prefijo, { sizes: '(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw', alt: '' }) || `<div class="negocio__sinfoto">${icono(so.icono, 'ico ico--grande')}</div>`}</div>
      <div class="negocio__texto">
        <h3 class="negocio__nombre">${icono(so.icono)}${esc(sectorPorId.get(so.sector).nombre)}</h3>
        <ul class="negocio__lista">${so.problemas.slice(0, 2).map((p) => `<li>${esc(p.problema)}</li>`).join('')}</ul>
        <span class="negocio__mas">${contar(serviciosDeSector(so.sector).length, 'servicio', 'servicios')}</span>
      </div>
    </a></li>`,
    ).join('\n    ')}
  </ul>
</section>`;

  const proximas = DEMOS_TODAS.filter((d) => !DEMOS.some((x) => x.clave === d.clave));
  const demos = DEMOS.length
    ? `<section class="seccion seccion--oscura" id="demos" aria-labelledby="demos-titulo">
  <div class="envoltura">
    <div class="seccion__cabeza">
      <h2 id="demos-titulo" class="display seccion__titulo">Míralo funcionando</h2>
      <p class="seccion__bajada">Demos que funcionan en tu navegador, con negocios de ejemplo. Varias están hechas para abrirse en el teléfono.</p>
    </div>
    <ul class="demos" role="list">
      ${DEMOS.map((d, i) => tarjetaDemo(d, prefijo, { grande: i === 0 && DEMOS.length > 2 })).join('\n      ')}
    </ul>
    ${proximas.length ? `<p class="demos__proximas">${icono('wrench')}<span><strong>En preparación:</strong> ${proximas.map((d) => esc(d.nombre)).join(', ')}.</span></p>` : ''}
    <p class="seccion__pie"><a class="boton boton--claro" href="${prefijo}laboratorio/">Ver todas las demos</a></p>
  </div>
</section>`
    : '';

  const capacidades = `<section class="seccion envoltura" id="servicios" aria-labelledby="cap-titulo">
  <div class="seccion__cabeza">
    <h2 id="cap-titulo" class="display seccion__titulo">Lo que hacemos</h2>
    <p class="seccion__bajada">${SERVICIOS.length} servicios en ${TIPOS.length} tipos de solución. Elige uno para ver todo lo que incluye.</p>
  </div>
  <ul class="indice" role="list">
    ${TIPOS.map(
      (t) => `<li><a class="indice__fila" href="${prefijo}servicios/?tipo=${t.id}">
      <span class="indice__icono">${icono(t.icono)}</span>
      <span class="indice__texto"><span class="indice__nombre">${esc(t.nombre)}</span><span class="indice__desc">${esc(t.desc)}</span></span>
      <span class="indice__cuenta num">${serviciosDeTipo(t.id).length}</span>
    </a></li>`,
    ).join('\n    ')}
  </ul>
  <p class="seccion__pie"><a class="boton boton--linea" href="${prefijo}servicios/">${icono('list')}Ver los ${SERVICIOS.length} servicios</a></p>
</section>`;

  const fotoInst = foto('instalacion', prefijo, {});
  const instalacion = `<section class="seccion envoltura dividida${fotoInst ? '' : ' dividida--sinfoto'}" aria-labelledby="inst-titulo">
  ${fotoInst ? `<div class="dividida__foto">${fotoInst}</div>` : ''}
  <div class="dividida__texto">
    <h2 id="inst-titulo" class="display seccion__titulo">Lo instalamos en tu local</h2>
    <p class="seccion__bajada">Además de programar, vamos al local: ponemos las placas QR en las mesas, la pantalla en la cocina, la cámara sobre la puerta y el sensor en la nevera, y le enseñamos a tu equipo a usarlo.</p>
    <ul class="lista-check">
      <li>${icono('check')}Compramos el equipo después de que apruebas la propuesta, no antes.</li>
      <li>${icono('check')}Si ya tienes equipo que sirve (cámaras, una tableta, un televisor), lo usamos.</li>
      <li>${icono('check')}El dominio y los QR quedan a nombre de tu negocio.</li>
    </ul>
  </div>
</section>`;

  const pasos = [
    ['Nos cuentas', 'Por WhatsApp o en una visita al local: qué te quita tiempo, qué se anota a mano, qué se cae.'],
    ['Propuesta', 'Te mandamos por escrito qué haríamos, el equipo que hace falta, cuánto cuesta y en cuánto tiempo queda.'],
    ['Lo hacemos', 'Programamos, configuramos y, si hay equipo, lo compramos e instalamos en tu local.'],
    ['Lo usas', 'Le enseñamos a tu equipo y quedamos de soporte según lo acordado en la propuesta.'],
  ];
  const como = `<section class="seccion envoltura" id="como-trabajamos" aria-labelledby="como-titulo">
  <div class="seccion__cabeza"><h2 id="como-titulo" class="display seccion__titulo">Cómo trabajamos</h2></div>
  <ol class="pasos">${pasos.map(([t, p]) => `<li class="paso"><h3 class="paso__titulo">${t}</h3><p>${p}</p></li>`).join('')}</ol>
</section>`;

  const preguntas = `<section class="seccion envoltura" id="preguntas" aria-labelledby="preg-titulo">
  <div class="seccion__cabeza"><h2 id="preg-titulo" class="display seccion__titulo">Preguntas frecuentes</h2></div>
  <div class="preguntas">${PREGUNTAS.map(([q, a]) => `<details class="pregunta"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>`;

  return documento({
    titulo: 'alphateklab · tecnología para tu negocio, hecha e instalada',
    descripcion: `alphateklab hace software a medida, páginas, apps e inteligencia artificial, y va a tu local a instalar pantallas, cámaras con IA, sensores y QR por mesa. ${SERVICIOS.length} servicios para negocios en Panamá.`,
    prefijo,
    canonica: URL_BASE,
    clase: 'pagina-inicio',
    datos: ld(ORGANIZACION, { '@type': 'WebSite', url: URL_BASE, name: 'alphateklab', inLanguage: 'es-PA' }),
    cuerpo: `<main id="contenido">
${heroe}
${entradas}
${tira}
${negocios}
${demos}
${como}
${capacidades}
${instalacion}
${preguntas}
${bandaPreguntanos(prefijo)}
</main>`,
  });
}

// ── página de un tipo de negocio ──
function paginaSolucion(so) {
  const prefijo = '../../';
  const sector = sectorPorId.get(so.sector);
  const d = so.demo ? demoPorClave.get(so.demo) : null;
  const pq = PAQUETES.find((p) => p.sector === so.sector);
  const lista = serviciosDeSector(so.sector);
  const fotoHeroe = foto(so.foto, prefijo, { clase: 'heroe-sector__foto', sizes: '100vw', carga: 'eager', prioridad: true, alt: '' });
  const nombreCorto = so.singular;
  return documento({
    titulo: `${so.titulo} · alphateklab`,
    descripcion: so.bajada,
    prefijo,
    canonica: `${URL_BASE}soluciones/${so.slug}/`,
    imagen: existe(`assets/og/${so.slug}.jpg`) ? `assets/og/${so.slug}.jpg` : 'assets/og.jpg',
    datos: ld(migasLd([['Soluciones', `${URL_BASE}soluciones/`], [sector.nombre, null]])),
    cuerpo: `<main id="contenido">
<section class="heroe-sector${fotoHeroe ? '' : ' heroe-sector--sinfoto'}">
  ${fotoHeroe}
  <div class="envoltura heroe-sector__texto">
    ${migas(prefijo, [['Soluciones', `${prefijo}soluciones/`], [sector.nombre, null]])}
    <h1 class="display heroe-sector__titulo">${esc(so.titulo)}</h1>
    <p class="heroe-sector__bajada">${esc(so.bajada)}</p>
    <p class="heroe-sector__acciones">${d ? `<a class="boton boton--senal" href="${enlace(d.url, prefijo)}">${icono('play-circle')}Probar la demo</a>` : ''}<a class="boton ${d ? 'boton--claro' : 'boton--senal'}" href="${prefijo}diagnostico/?n=${so.slug}">Ver qué necesita mi ${esc(nombreCorto)}</a></p>
  </div>
</section>
<section class="seccion envoltura" aria-labelledby="resolvemos-titulo">
  <div class="seccion__cabeza"><h2 id="resolvemos-titulo" class="display seccion__titulo">Lo que te resolvemos</h2></div>
  <ul class="problemas" role="list">
    ${so.problemas
      .map(
        (p) => `<li class="problema">
      <p class="problema__que">${esc(p.problema)}</p>
      <p class="problema__respuesta">${esc(p.respuesta)}</p>
      <p class="problema__servicios">${p.servicios.map((id) => `<a class="chip chip--enlace" href="${prefijo}servicios/${porId.get(id).slug}/">${esc(porId.get(id).corto)}</a>`).join('')}</p>
    </li>`,
      )
      .join('\n    ')}
  </ul>
</section>
${
  d
    ? `<section class="seccion seccion--oscura" aria-labelledby="demo-titulo">
  <div class="envoltura dividida">
    <div class="dividida__foto">${marcoDispositivo('portatil', capturaDemo(d, prefijo) || `<span class="demo__sincaptura">${icono('play-circle', 'ico ico--grande')}</span>`)}</div>
    <div class="dividida__texto">
      <h2 id="demo-titulo" class="display seccion__titulo">Pruébalo ahora</h2>
      <p class="seccion__bajada"><strong>${esc(d.nombre)}.</strong> ${esc(d.que)}</p>
      <p><strong>Prueba:</strong> ${esc(d.prueba)}</p>
      <p><a class="boton boton--senal" href="${enlace(d.url, prefijo)}">${icono('play-circle')}Abrir la demo</a></p>
    </div>
  </div>
</section>`
    : ''
}
${
  pq
    ? `<section class="seccion envoltura" aria-labelledby="empezar-titulo">
  <div class="seccion__cabeza"><h2 id="empezar-titulo" class="display seccion__titulo">Por dónde empezar</h2><p class="seccion__bajada">No hace falta todo de una vez. Este es el orden que te sugerimos; cada etapa se puede hacer por separado.</p></div>
  ${escalera(pq, prefijo)}
</section>`
    : ''
}
<section class="seccion envoltura" aria-labelledby="todos-titulo">
  <div class="seccion__cabeza"><h2 id="todos-titulo" class="display seccion__titulo">Todos los servicios para tu ${esc(nombreCorto)}</h2><p class="seccion__bajada">${contar(lista.length, 'servicio', 'servicios')}. Agrega los que te interesen y pídenos la cotización de una vez.</p></div>
  <div class="rejilla-servicios">${lista.map((s) => tarjetaServicio(s, prefijo)).join('\n')}</div>
</section>
${bandaPreguntanos(prefijo, { titulo: `¿Tu ${nombreCorto} necesita otra cosa?` })}
</main>`,
  });
}

function paginaSoluciones() {
  const prefijo = '../';
  return documento({
    titulo: 'Soluciones por tipo de negocio · alphateklab',
    descripcion: 'Lo que alphateklab le resuelve a restaurantes, tiendas, clínicas, hospedaje, bienes raíces, industria, escuelas, talleres y cualquier negocio.',
    prefijo,
    canonica: `${URL_BASE}soluciones/`,
    cuerpo: `<main id="contenido" class="envoltura pagina-simple">
  ${migas(prefijo, [['Soluciones', null]])}
  <h1 class="display pagina-simple__titulo">Soluciones por tipo de negocio</h1>
  <ul class="negocios" role="list">
    ${SOLUCIONES.map(
      (so) => `<li><a class="negocio" href="${prefijo}soluciones/${so.slug}/">
      <div class="negocio__foto">${foto(so.foto, prefijo, { sizes: '(min-width: 1000px) 33vw, 100vw', alt: '' }) || `<div class="negocio__sinfoto">${icono(so.icono, 'ico ico--grande')}</div>`}</div>
      <div class="negocio__texto"><h2 class="negocio__nombre">${icono(so.icono)}${esc(sectorPorId.get(so.sector).nombre)}</h2><p>${esc(so.bajada)}</p><span class="negocio__mas">${contar(serviciosDeSector(so.sector).length, 'servicio', 'servicios')}</span></div>
    </a></li>`,
    ).join('\n    ')}
  </ul>
</main>
${bandaPreguntanos(prefijo)}`,
  });
}

// ── catálogo completo ──
function paginaServicios() {
  const prefijo = '../';
  const grupos = TIPOS.map((t) => ({ t, lista: SERVICIOS.filter((s) => s.tipos[0] === t.id) })).filter((g) => g.lista.length);
  return documento({
    titulo: `Los ${SERVICIOS.length} servicios · alphateklab`,
    descripcion: 'Todos los servicios de alphateklab: software a medida, web y apps, IA, cámaras, sensores, pantallas, 3D y cobros. Busca con tus palabras o filtra por tu negocio.',
    prefijo,
    canonica: `${URL_BASE}servicios/`,
    cuerpo: `<main id="contenido" class="envoltura pagina-catalogo">
  ${migas(prefijo, [['Servicios', null]])}
  <div class="catalogo__cabeza">
    <h1 class="display pagina-simple__titulo">Todos los servicios</h1>
    <p class="seccion__bajada">${SERVICIOS.length} servicios. Busca con tus palabras o filtra por tu tipo de negocio; si no está, pregúntanos.</p>
  </div>
  <form class="filtros" id="filtros" role="search" aria-label="Buscar y filtrar servicios">
    <div class="filtros__buscar">${icono('magnifying-glass')}<label class="sr" for="filtro-q">Buscar</label><input id="filtro-q" name="q" type="search" placeholder="Busca con tus palabras: inventario, cámara, pedir desde la mesa…" autocomplete="off" /></div>
    <fieldset class="filtros__grupo">
      <legend>Tu negocio</legend>
      <div class="filtros__opciones">
        <label class="opcion"><input type="radio" name="sector" value="" checked /><span>Todos</span></label>
        ${SECTORES.map((s) => `<label class="opcion"><input type="radio" name="sector" value="${s.id}" /><span>${esc(s.nombre)}</span></label>`).join('')}
      </div>
    </fieldset>
    <div class="filtros__fila">
      <label class="campo campo--en-linea"><span>Tipo</span><select name="tipo" id="filtro-tipo"><option value="">Todos los tipos</option>${TIPOS.map((t) => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('')}</select></label>
      <label class="casilla"><input type="checkbox" name="demo" value="1" /><span>Con demo</span></label>
      <label class="casilla"><input type="checkbox" name="instala" value="1" /><span>Se instala en el local</span></label>
      <button class="boton-chico filtros__mas" type="button" aria-expanded="false" aria-controls="filtros" data-filtros-mas>${icono('list')}Filtrar</button>
      <p class="filtros__cuenta num" id="filtros-cuenta" aria-live="polite">Mostrando ${SERVICIOS.length} de ${SERVICIOS.length}</p>
    </div>
  </form>
  <div class="catalogo" id="catalogo">
    ${grupos
      .map(
        (g) => `<section class="grupo" data-grupo="${g.t.id}" aria-labelledby="grupo-${g.t.id}">
      <div class="grupo__cabeza">
        ${foto(g.t.foto, prefijo, { clase: 'grupo__foto', sizes: '(min-width: 900px) 30vw, 100vw', alt: '' })}
        <div><h2 class="grupo__titulo" id="grupo-${g.t.id}">${icono(g.t.icono)}${esc(g.t.nombre)}</h2><p class="grupo__desc">${esc(g.t.desc)}</p></div>
      </div>
      <div class="rejilla-servicios">${g.lista.map((s) => tarjetaServicio(s, prefijo)).join('\n')}</div>
    </section>`,
      )
      .join('\n    ')}
    <div class="catalogo__vacio" id="catalogo-vacio" hidden>
      <h2>No encontramos eso en la lista</h2>
      <p>Igual puede que lo hagamos. Mándanos la pregunta tal como la escribiste:</p>
      <p class="catalogo__vacio-acciones"><a class="boton boton--senal" id="vacio-preguntar" href="${prefijo}cotizar/" target="_blank" rel="noopener">${icono('whatsapp-logo')}Preguntar por WhatsApp</a> <button class="enlace-boton" type="button" id="limpiar-filtros">Quitar los filtros</button></p>
    </div>
  </div>
</main>
${bandaPreguntanos(prefijo)}`,
    scripts: `<script type="module" src="${prefijo}js/catalogo.js"></script>`,
  });
}

// Fuentes de las cifras que citan las fichas: si el texto las menciona, la ficha las enlaza (comprobadas el 3-oct-2026).
const FUENTES_CITADAS = [
  [/Harvard e Ivey/, 'Harvard Business School e Ivey: recorridos virtuales y 75.000 ventas de casas', 'https://www.library.hbs.edu/working-knowledge/are-virtual-tours-still-worth-it-in-real-estate-evidence-from-75000-home-sales'],
  [/ACEEE/, 'ACEEE (2010): medición avanzada y programas de información al hogar', 'https://www.aceee.org/research-report/e105'],
  [/US\$0\.\d+|tarifa de octubre de 2026|cobra Meta|Meta cobra|Meta los cobra|Meta lo cobra/, 'Meta: precios de la plataforma de WhatsApp Business', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing'],
  [/1 % más ITBMS/, 'Yappy Comercial: comisión por cobro', 'https://www.yappy.com.pa/comercial/'],
];
function fuentesDe(s, f) {
  const texto = JSON.stringify(f) + ' ' + (s.aparte || '') + ' ' + JSON.stringify(s.precio || '');
  return FUENTES_CITADAS.filter(([re]) => re.test(texto));
}

function detalleFicha(s) {
  const f = FICHAS[s.id];
  if (!f) return '';
  const fuentes = fuentesDe(s, f);
  return `<section class="seccion envoltura ficha-detalle" aria-labelledby="como-titulo">
  <div class="ficha-detalle__como">
    <h2 id="como-titulo" class="display seccion__titulo seccion__titulo--chico">Cómo funciona</h2>
    <ol class="linea-tiempo">${f.como.map((c) => `<li><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p></li>`).join('')}</ol>
  </div>
  <div class="ficha-detalle__lado">
    <div class="ficha-detalle__bloque"><h2>Qué necesitas tener</h2><ul class="lista-check">${f.necesitas.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul></div>
    <div class="ficha-detalle__bloque ficha-detalle__bloque--no"><h2>Qué no incluye</h2><ul class="lista-no">${f.no_incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <p class="ficha-detalle__ejemplo">${esc(f.ejemplo.replace(/^Ejemplo:\s*/, 'Un caso imaginario: '))}</p>
  </div>
</section>
<section class="seccion seccion--junta envoltura" aria-labelledby="pf-titulo">
  <h2 id="pf-titulo" class="display seccion__titulo seccion__titulo--chico">Preguntas sobre este servicio</h2>
  <div class="preguntas">${f.preguntas.map((q) => `<details class="pregunta"><summary>${esc(q.p)}</summary><p>${esc(!s.demo && /\bdemo|laboratorio/i.test(q.r) ? 'Todavía no: la demo está en preparación. Mientras tanto te lo mostramos en una visita o por videollamada.' : q.r)}</p></details>`).join('')}</div>
  ${fuentes.length ? `<div class="fuentes"><h3>Fuentes de las cifras de esta página</h3><ul>${fuentes.map(([, nombre, url]) => `<li><a href="${url}" rel="noopener">${esc(nombre)}</a></li>`).join('')}</ul></div>` : ''}
</section>`;
}

// ── ficha de un servicio ──
function paginaServicio(s) {
  const prefijo = '../../';
  const t = tipoPorId.get(s.tipos[0]);
  const so = solucionPorSector.get(s.sectores[0]);
  const relacionados = SERVICIOS.filter((x) => x.id !== s.id && x.sectores.some((y) => s.sectores.includes(y)) && x.tipos.some((y) => s.tipos.includes(y))).slice(0, 3);
  const d = s.demo ? demoPorClave.get(claveDeDemo(s.demo)) : null;
  const opcionesFoto = { clase: 'ficha-heroe__foto', sizes: '(min-width: 1000px) 40vw, 100vw', alt: '' };
  const visual = d && capturaDemo(d, prefijo) ? marcoDispositivo('portatil', capturaDemo(d, prefijo)) : foto(so?.foto, prefijo, opcionesFoto) || foto(t.foto, prefijo, opcionesFoto);
  return documento({
    titulo: `${s.nombre} · alphateklab`,
    descripcion: s.para,
    prefijo,
    canonica: `${URL_BASE}servicios/${s.slug}/`,
    imagen: so && existe(`assets/og/${so.slug}.jpg`) ? `assets/og/${so.slug}.jpg` : 'assets/og.jpg',
    datos: ld(
      { '@type': 'Service', name: s.nombre, description: s.para, serviceType: t.nombre, url: `${URL_BASE}servicios/${s.slug}/`, provider: { '@id': `${URL_BASE}#organizacion` }, areaServed: { '@type': 'Country', name: 'Panamá' } },
      migasLd([['Servicios', `${URL_BASE}servicios/`], [t.nombre, `${URL_BASE}servicios/?tipo=${t.id}`], [s.corto, null]]),
    ),
    cuerpo: `<main id="contenido">
<section class="ficha-heroe">
  <div class="envoltura ficha-heroe__fila${visual ? '' : ' ficha-heroe__fila--sola'}">
    <div class="ficha-heroe__texto">
      ${migas(prefijo, [['Servicios', `${prefijo}servicios/`], [t.nombre, `${prefijo}servicios/?tipo=${t.id}`], [s.corto, null]])}
      <p class="ficha-heroe__tipo">${icono(t.icono)}${esc(t.nombre)}</p>
      <h1 class="display ficha-heroe__titulo">${esc(s.nombre)}</h1>
      <p class="ficha-heroe__para">${esc(s.para)}</p>
      <div class="tarjeta-servicio__insignias">${insignias(s)}</div>
      <p class="ficha-heroe__acciones">
        <a class="boton boton--senal" href="${prefijo}cotizar/?servicio=${s.id}">${icono('chat-circle-dots')}Preguntar por este servicio</a>
        ${s.demo ? `<a class="boton boton--linea" href="${enlace(s.demo, prefijo)}">${icono('play-circle')}Probar la demo</a>` : ''}
        <button class="boton boton--linea" type="button" data-cotizar="${s.id}" aria-pressed="false">Agregar a mi lista</button>
      </p>
      <p class="ficha-heroe__precio"><span class="num">${esc(precioTexto(s))}</span>${s.precio?.nota ? ` · ${esc(s.precio.nota)}` : ''}</p>
    </div>
    ${visual ? `<div class="ficha-heroe__visual">${visual}</div>` : ''}
  </div>
</section>
<section class="seccion seccion--junta envoltura ficha-cuerpo">
  <div class="ficha-cuerpo__col">
    <h2>Qué incluye</h2>
    <ul class="lista-check">${s.incluye.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>
  </div>
  <div class="ficha-cuerpo__col">
    <h2>${s.equipo.length && s.instala ? 'Equipo que se instala' : 'Equipo'}</h2>
    ${s.equipo.length ? `<ul class="lista-check">${s.equipo.map((x) => `<li>${icono(s.instala ? 'wrench' : 'check')}${esc(x)}</li>`).join('')}</ul>` : '<p>No necesita equipo en el local.</p>'}
  </div>
  <div class="ficha-cuerpo__col ficha-cuerpo__precio">
    <h2>Precio</h2>
    <p class="ficha-cuerpo__cifra num">${esc(precioTexto(s))}</p>
    <p>${s.precio?.nota ? esc(s.precio.nota) : 'Depende de tu negocio y del alcance: va cerrado en la propuesta.'}</p>
    ${s.aparte ? `<p class="ficha-cuerpo__aparte"><strong>Aparte:</strong> ${esc(s.aparte)}</p>` : ''}
  </div>
</section>
${detalleFicha(s)}
${
  relacionados.length
    ? `<section class="seccion envoltura" aria-labelledby="rel-titulo">
  <div class="seccion__cabeza"><h2 id="rel-titulo" class="display seccion__titulo seccion__titulo--chico">Va bien con</h2></div>
  <div class="rejilla-servicios">${relacionados.map((x) => tarjetaServicio(x, prefijo)).join('\n')}</div>
  ${so ? `<p class="seccion__pie"><a href="${prefijo}soluciones/${so.slug}/">Todo lo que hacemos para ${esc(sectorPorId.get(so.sector).nombre.toLowerCase())}</a></p>` : ''}
</section>`
    : ''
}
${bandaPreguntanos(prefijo, { titulo: '¿Lo necesitas un poco distinto?', texto: 'Casi todo lo hacemos a la medida. Cuéntanos cómo trabaja tu negocio y lo ajustamos.' })}
</main>`,
  });
}

// ── demos ──
function paginaLaboratorio() {
  const prefijo = '../';
  return documento({
    titulo: 'Demos · alphateklab',
    descripcion: 'Demos de alphateklab que funcionan en tu navegador: pedir y pagar desde la mesa, agente de citas, recorridos 3D y 360, contador de personas y sensores.',
    prefijo,
    canonica: `${URL_BASE}laboratorio/`,
    cuerpo: `<main id="contenido" class="envoltura pagina-simple">
  ${migas(prefijo, [['Demos', null]])}
  <h1 class="display pagina-simple__titulo">Demos</h1>
  <p class="seccion__bajada">Funcionan en tu navegador con negocios de ejemplo. Cada una dice qué parte es simulada.</p>
  <ul class="demos demos--claras" role="list">
    ${DEMOS.map((d) => tarjetaDemo(d, prefijo, { nivel: 'h2' })).join('\n    ')}
    ${DEMOS_TODAS.filter((d) => !DEMOS.some((x) => x.clave === d.clave)).map((d) => demoPendiente(d).replace(/<h3 class="demo__nombre">(.*?)<\/h3>/, '<h2 class="demo__nombre">$1</h2>')).join('\n    ')}
  </ul>
</main>
${bandaPreguntanos(prefijo)}`,
  });
}

// ── pregúntanos y cotización ──
function paginaCotizar() {
  const prefijo = '../';
  const datosCliente = { servicios: SERVICIOS.map((s) => ({ id: s.id, nombre: s.nombre, precio: precioTexto(s) })), contacto: CONTACTO };
  return documento({
    titulo: 'Pregúntanos o cotiza · alphateklab',
    descripcion: 'Cuéntanos qué necesita tu negocio o arma una cotización con los servicios que te interesan. Te queda un mensaje listo para WhatsApp.',
    prefijo,
    canonica: `${URL_BASE}cotizar/`,
    cuerpo: `<main id="contenido" class="envoltura pagina-simple">
  ${migas(prefijo, [['Pregúntanos o cotiza', null]])}
  <h1 class="display pagina-simple__titulo">Pregúntanos lo que necesites</h1>
  <p class="seccion__bajada">Escríbelo con tus palabras y, si quieres, suma servicios de la lista. Te queda un mensaje listo para mandar por WhatsApp. Nada sale de tu equipo hasta que lo mandas; lo que escribes queda guardado solo en este navegador hasta que pulses «Vaciar».</p>
  <form class="cotizador" id="cotizador" novalidate>
    <div class="cotizador__col">
      <label class="campo"><span>¿Qué necesitas?</span><textarea id="cot-notas" rows="5" maxlength="800" placeholder="Ej.: tengo un restaurante de 15 mesas y quiero que pidan desde la mesa y que la cocina lo vea en una pantalla"></textarea></label>
      <div class="cotizador__datos">
        <label class="campo"><span>Nombre del negocio</span><input id="cot-negocio" autocomplete="organization" maxlength="80" /></label>
        <label class="campo"><span>Tipo de negocio</span><select id="cot-tipo"><option value="">Elige uno…</option>${SECTORES.filter((s) => s.id !== 'todos').map((s) => `<option>${esc(s.nombre)}</option>`).join('')}<option>Otro</option></select></label>
        <label class="campo"><span>Provincia o ciudad</span><input id="cot-lugar" autocomplete="address-level1" maxlength="60" placeholder="Panamá, Chiriquí, Veraguas…" /></label>
      </div>
      <h2 class="cotizador__subtitulo">Servicios que te interesan <span class="num" id="cot-cuenta">(0)</span></h2>
      <ul id="cot-elegidos" class="cotizador__elegidos"></ul>
      <p class="cotizador__vacio" id="cot-vacio">Ninguno todavía. Puedes agregarlos desde cualquier servicio con «Agregar», o elegirlos aquí:</p>
      <label class="campo"><span>Agregar un servicio</span><select id="cot-agregar"><option value="">Elige un servicio…</option>${TIPOS.map((t) => `<optgroup label="${esc(t.nombre)}">${SERVICIOS.filter((s) => s.tipos[0] === t.id).map((s) => `<option value="${s.id}">${esc(s.nombre)}</option>`).join('')}</optgroup>`).join('')}</select></label>
    </div>
    <div class="cotizador__col cotizador__mensaje">
      <h2 class="cotizador__subtitulo">Tu mensaje</h2>
      <pre class="mensaje" id="cot-mensaje" aria-live="polite"></pre>
      <div class="cotizador__acciones">
        <a class="boton boton--senal" id="cot-whatsapp" href="#" target="_blank" rel="noopener">${icono('whatsapp-logo')}Mandar por WhatsApp</a>
        <button class="boton boton--linea" type="button" id="cot-copiar">${icono('copy')}Copiar</button>
        <button class="boton boton--linea" type="button" id="cot-vaciar">Vaciar</button>
      </div>
      <p class="cotizador__aviso" id="cot-aviso" role="status"></p>
    </div>
  </form>
  <noscript><p class="aviso-demo">Esta página necesita JavaScript para armar el mensaje.</p></noscript>
</main>`,
    scripts: `<script id="datos-cotizar" type="application/json">${jsonEnScript(datosCliente)}</script>
<script type="module" src="${prefijo}js/cotizar.js"></script>`,
  });
}

function paginaPrivacidad() {
  const prefijo = '../';
  return documento({
    titulo: 'Privacidad · alphateklab',
    descripcion: 'Qué datos trata el sitio de alphateklab y sus demos, y cuáles no.',
    prefijo,
    canonica: `${URL_BASE}privacidad/`,
    cuerpo: `<main id="contenido" class="envoltura texto-largo">
  ${migas(prefijo, [['Privacidad', null]])}
  <h1 class="display">Privacidad</h1>
  <p class="texto-largo__fecha">Vigente desde el ${esc(ACTUALIZADO.texto)}. Se rige por la Ley 81 de 2019 de protección de datos personales de Panamá y su reglamento, el Decreto Ejecutivo 285 de 2021.</p>
  <h2>Este sitio</h2>
  <p>No usa cookies, ni analítica, ni píxeles de redes sociales, ni formularios que envíen datos a un servidor.</p>
  <p>El buscador busca dentro de tu navegador. «Pregúntanos» y la cotización arman el mensaje en tu navegador, y solo sale de tu equipo si tú lo mandas por WhatsApp; desde ahí rige la política de WhatsApp. Los servicios que agregas a la cotización y lo que escribes se guardan en tu navegador para que no se pierdan al recargar; el botón «Vaciar» los borra.</p>
  <h2>Las demos</h2>
  <p>Usan negocios inventados y guardan sus datos de ejemplo en tu navegador. Las de restaurante y de citas pueden pasar mensajes entre dos dispositivos (tu teléfono y tu computadora) a través de un servidor público de pruebas, ntfy.sh; por eso piden que no escribas datos reales.</p>
  <p>La demo de la cámara procesa el video dentro de tu navegador: ningún cuadro sale de tu equipo. Lo que sí se descarga es el modelo de detección, desde los servidores de quien lo publica.</p>
  <p>Las fotos de las páginas se sirven desde este mismo sitio. Las librerías de las demos se descargan de cdn.jsdelivr.net, que recibe la petición como cualquier sitio que visitas.</p>
</main>`,
  });
}

function paginaCreditos() {
  const prefijo = '../';
  const filas = Object.entries(CREDITOS_FOTOS).filter(([slot]) => existe(`assets/fotos/${slot}.webp`));
  return documento({
    titulo: 'Créditos · alphateklab',
    descripcion: 'Autores y licencias de las fotos, los íconos y las librerías del sitio de alphateklab.',
    prefijo,
    canonica: `${URL_BASE}creditos/`,
    cuerpo: `<main id="contenido" class="envoltura texto-largo">
  ${migas(prefijo, [['Créditos', null]])}
  <h1 class="display">Créditos</h1>
  <h2>Fotos</h2>
  ${filas.length ? `<ul class="creditos">${filas.map(([slot, c]) => `<li><strong>${esc(c.titulo || slot)}</strong>, de ${esc(c.autor || 'autor sin nombre')}${c.fuente ? ` (<a href="${esc(c.fuente)}">fuente</a>)` : ''}. ${c.urlLicencia ? `<a href="${esc(c.urlLicencia)}">${esc(c.licencia)}</a>` : esc(c.licencia || '')}.</li>`).join('')}</ul>` : '<p>Este sitio todavía no usa fotos de terceros.</p>'}
  <h2>Íconos</h2>
  <p><a href="https://phosphoricons.com">Phosphor Icons</a> 2.1.1, licencia MIT.</p>
  <h2>Tipografía</h2>
  <p>Manrope, de Mikhail Sharanda, e Inter, de Rasmus Andersson, ambas con licencia SIL Open Font License 1.1.</p>
  <h2>Demos</h2>
  <p>Fotos 360 de <a href="https://polyhaven.com">Poly Haven</a> (CC0); visor 360 <a href="https://pannellum.org">Pannellum</a> (MIT); three.js (MIT); TensorFlow.js y MediaPipe (Apache 2.0). Cada demo detalla los suyos.</p>
</main>`,
  });
}

function pagina404() {
  const prefijo = '/alphateklab/';
  return documento({
    titulo: 'Página no encontrada · alphateklab',
    descripcion: 'Esta dirección no existe en el sitio de alphateklab.',
    prefijo,
    canonica: URL_BASE,
    robots: 'noindex',
    cuerpo: `<main id="contenido" class="envoltura texto-largo">
  <h1 class="display">Esa página no existe</h1>
  <p>Puede que el enlace esté mal copiado o que el servicio haya cambiado de nombre. Búscalo con tus palabras:</p>
  <p><button class="boton boton--senal" type="button" data-abrir-buscador>${icono('magnifying-glass')}Buscar en alphateklab</button></p>
  <p>O ve a la <a href="${prefijo}servicios/">lista de servicios</a> o a las <a href="${prefijo}laboratorio/">demos</a>.</p>
</main>`,
  });
}

function sitemap() {
  const urls = ['', 'diagnostico/', 'soluciones/', 'servicios/', 'laboratorio/', 'cotizar/', 'privacidad/', 'creditos/', ...SOLUCIONES.map((so) => `soluciones/${so.slug}/`), ...SERVICIOS.map((s) => `servicios/${s.slug}/`), ...DEMOS.filter((d) => !esExterna(d.url)).map((d) => d.url.replace(/\/?$/, '/'))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${URL_BASE}${u}</loc><lastmod>${ACTUALIZADO.iso}</lastmod></url>`).join('\n')}
</urlset>
`;
}

// ── «¿Qué necesita mi negocio?» ──
function paginaDiagnostico() {
  const prefijo = '../';
  const datos = {
    soluciones: SOLUCIONES.map((so) => ({
      slug: so.slug,
      nombre: sectorPorId.get(so.sector).nombre,
      icono: so.icono,
      foto: existe(`assets/fotos/${so.foto}-800.webp`) ? `${prefijo}assets/fotos/${so.foto}-800.webp` : null,
      problemas: so.problemas.map((p) => ({ problema: p.problema, respuesta: p.respuesta, servicios: p.servicios })),
    })),
    servicios: Object.fromEntries(SERVICIOS.map((s) => [s.id, { nombre: s.nombre, corto: s.corto, para: s.para, url: `${prefijo}servicios/${s.slug}/`, precio: precioTexto(s), demo: s.demo ? enlace(s.demo, prefijo) : null, icono: tipoPorId.get(s.tipos[0]).icono, instala: s.instala }])),
  };
  return documento({
    titulo: '¿Qué necesita tu negocio? · alphateklab',
    descripcion: 'Tres preguntas sobre tu negocio y te decimos qué servicios te sirven, por qué y por dónde empezar.',
    prefijo,
    canonica: `${URL_BASE}diagnostico/`,
    clase: 'pagina-diagnostico',
    cuerpo: `<main id="contenido" class="envoltura diagnostico">
  ${migas(prefijo, [['¿Qué necesita tu negocio?', null]])}
  <div class="diagnostico__cabeza">
    <h1 class="display pagina-simple__titulo">¿Qué necesita tu negocio?</h1>
    <p class="seccion__bajada">Tres preguntas. Al final te decimos qué te sirve, por qué, y te queda el mensaje listo para mandarnos.</p>
  </div>
  <ol class="pasos-diag" aria-label="Avance">
    <li data-paso-ind="1" aria-current="step"><span>1</span>Tu negocio</li>
    <li data-paso-ind="2"><span>2</span>Qué quieres resolver</li>
    <li data-paso-ind="3"><span>3</span>Qué ya tienes</li>
  </ol>
  <form id="diagnostico" class="diag" novalidate>
    <fieldset class="diag__paso" data-paso="1">
      <legend class="diag__pregunta">¿Qué tipo de negocio tienes?</legend>
      <div class="diag__negocios">
        ${datos.soluciones.map((so) => `<label class="diag-negocio"><input type="radio" name="negocio" value="${so.slug}" />${so.foto ? `<img src="${so.foto}" alt="" width="800" height="500" loading="lazy" decoding="async" />` : ''}<span class="diag-negocio__nombre">${icono(so.icono)}${esc(so.nombre)}</span></label>`).join('')}
      </div>
    </fieldset>
    <fieldset class="diag__paso" data-paso="2" hidden>
      <legend class="diag__pregunta">¿Qué te gustaría resolver? <small>Marca todo lo que aplique.</small></legend>
      <div class="diag__problemas" data-problemas></div>
      <label class="campo diag__otro"><span>¿Algo más que no esté en la lista?</span><textarea id="diag-otro" rows="2" maxlength="600" placeholder="Escríbelo con tus palabras"></textarea></label>
      <p class="diag__acciones"><button class="boton boton--linea" type="button" data-atras>Atrás</button><button class="boton boton--senal" type="button" data-siguiente>Siguiente</button></p>
      <p class="diag__aviso" data-aviso-2 role="alert" hidden>Marca al menos una cosa, o escribe lo que necesitas en «¿Algo más?».</p>
    </fieldset>
    <fieldset class="diag__paso" data-paso="3" hidden>
      <legend class="diag__pregunta">¿Qué ya tienes en tu negocio? <small>Para no recomendarte lo que ya funciona.</small></legend>
      <div class="diag__tengo" data-tengo></div>
      <p class="diag__acciones"><button class="boton boton--linea" type="button" data-atras>Atrás</button><button class="boton boton--senal" type="button" data-ver>Ver mi recomendación</button></p>
    </fieldset>
  </form>
  <section class="diag-resultado" data-resultado hidden aria-live="polite" tabindex="-1"></section>
  <noscript><p class="aviso-demo">El diagnóstico necesita JavaScript. Puedes ver <a href="${prefijo}soluciones/">las soluciones por tipo de negocio</a>.</p></noscript>
</main>`,
    scripts: `<script id="datos-diagnostico" type="application/json">${jsonEnScript(datos)}</script>
<script type="module" src="${prefijo}js/diagnostico.js"></script>`,
  });
}

// ── escribir ──
const escribir = (ruta, html) => {
  mkdirSync(dirname(join(RAIZ, ruta)), { recursive: true });
  writeFileSync(join(RAIZ, ruta), html);
};
const limpiarCarpeta = (dir, vigentes) => {
  const d = join(RAIZ, dir);
  if (!existsSync(d)) return;
  for (const x of readdirSync(d, { withFileTypes: true })) if (x.isDirectory() && !vigentes.has(x.name)) rmSync(join(d, x.name), { recursive: true });
};

escribir('index.html', paginaInicio());
limpiarCarpeta('soluciones', new Set(SOLUCIONES.map((so) => so.slug)));
escribir('soluciones/index.html', paginaSoluciones());
for (const so of SOLUCIONES) escribir(`soluciones/${so.slug}/index.html`, paginaSolucion(so));
limpiarCarpeta('servicios', new Set(SERVICIOS.map((s) => s.slug)));
escribir('servicios/index.html', paginaServicios());
for (const s of SERVICIOS) escribir(`servicios/${s.slug}/index.html`, paginaServicio(s));
escribir('laboratorio/index.html', paginaLaboratorio());
escribir('cotizar/index.html', paginaCotizar());
escribir('diagnostico/index.html', paginaDiagnostico());
escribir('privacidad/index.html', paginaPrivacidad());
escribir('creditos/index.html', paginaCreditos());
escribir('404.html', pagina404());
escribir('sitemap.xml', sitemap());
escribir('assets/indice.json', JSON.stringify(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS, PALABRAS_NEGOCIO })));
escribir('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${URL_BASE}sitemap.xml\n`);
console.log(`Generado: portada, ${SOLUCIONES.length} soluciones, ${SERVICIOS.length} servicios, catálogo, demos, cotizar, privacidad, créditos, 404, sitemap e índice de búsqueda.`);
