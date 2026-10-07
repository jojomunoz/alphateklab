// Genera alphateklab.com desde el 7-oct-2026: la portada de Citas Médicas (lo único que vende alphateklab por ahora),
// la privacidad, el 404, /citasmed/ (lleva a la portada), el sitemap y robots.txt. Todo el contenido sale de
// datos/producto.mjs y datos/sitio.mjs; no se editan a mano los HTML generados.
// Uso: node herramientas/generar-citas.mjs
//
// El sitio de la agencia (catálogo, soluciones, guías y demos) quedó en la rama sitio-agencia; ver CLAUDE.md.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as P from '../datos/producto.mjs';
import { ACTUALIZADO, CONTACTO as CONTACTO_DATOS, URL_BASE } from '../datos/sitio.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
// Para ver el formulario de la prueba en local antes de tener el contacto: WHATSAPP=507… CORREO=… node …
const CONTACTO = { whatsapp: process.env.WHATSAPP || CONTACTO_DATOS.whatsapp, correo: process.env.CORREO || CONTACTO_DATOS.correo };
const existe = (ruta) => existsSync(join(RAIZ, ruta));

// «9:00 a. m.», «98 %» y «$25» no se parten al final de una línea.
const sinCorte = (t) => String(t).replace(/(\d) (a\. m\.|p\. m\.|%|°C|mmHg|lpm)/g, '$1 $2').replace(/a\. m\./g, 'a. m.').replace(/p\. m\./g, 'p. m.');
export const esc = (s) => sinCorte(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const jsonEnScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const dolares = (n) => `$${n}`;
const resaltar = (t) => esc(t).replace(/\[([^\]]+)\]/, '<span class="resalte">$1</span>');
const sinMarcas = (t) => t.replace(/[[\]]/g, '');

// ── íconos: del sprite de assets/iconos.svg (Phosphor), solo los que usa cada página ──
const SPRITE = readFileSync(join(RAIZ, 'assets/iconos.svg'), 'utf8');
const SIMBOLOS = new Map([...SPRITE.matchAll(/<symbol id="i-([\w-]+)"[\s\S]*?<\/symbol>/g)].map((m) => [m[1], m[0]]));
let usados = new Set();
function icono(nombre, clase = 'ico') {
  if (!SIMBOLOS.has(nombre)) throw new Error(`Falta el ícono «${nombre}» en assets/iconos.svg`);
  usados.add(nombre);
  return `<svg class="${clase}" aria-hidden="true" focusable="false"><use href="#i-${nombre}"></use></svg>`;
}
const sprite = () => `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${[...usados].map((n) => SIMBOLOS.get(n)).join('')}</svg>`;

// El símbolo de alphateklab en línea: toma el color del texto y el módulo el de la acción, en claro y en oscuro.
const SIMBOLO = '<svg class="simbolo" viewBox="0 0 128 128" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M64 20a44 44 0 1 0 0 88a44 44 0 1 0 0-88Zm0 21a23 23 0 1 1 0 46a23 23 0 1 1 0-46Z"/><path fill="currentColor" d="M87 20h21v63H87z"/><rect class="simbolo__modulo" x="87" y="87" width="21" height="21" rx="3"/></svg>';

// Versión por contenido de la hoja de estilos y del script: GitHub Pages guarda 10 minutos sin preguntar.
const huella = (ruta) => createHash('sha1').update(readFileSync(join(RAIZ, ruta))).digest('hex').slice(0, 10);
const conVersion = (prefijo, ruta) => `${prefijo}${ruta}?v=${huella(ruta)}`;

// ── imágenes: cada captura en claro y en oscuro, en dos tamaños ──
function imagen(prefijo, nombre, { alt = '', ancho, alto, chico, sizes, prioridad = false, perezosa = !prioridad }) {
  const base = `assets/producto/${nombre}`;
  for (const s of ['', '-oscuro']) for (const t of [`${s}`, `${s}-${chico}`]) if (!existe(`${base}${t}.webp`)) throw new Error(`Falta ${base}${t}.webp (herramientas/capturas-citas.mjs y imagenes-citas.mjs)`);
  const juego = (s) => `${prefijo}${base}${s}-${chico}.webp ${chico}w, ${prefijo}${base}${s}.webp ${ancho}w`;
  return `<picture><source media="(prefers-color-scheme: dark)" srcset="${juego('-oscuro')}" sizes="${sizes}" /><img src="${prefijo}${base}.webp" srcset="${juego('')}" sizes="${sizes}" alt="${esc(alt)}" width="${ancho}" height="${alto}"${prioridad ? ' fetchpriority="high"' : ''}${perezosa ? ' loading="lazy"' : ''} decoding="async" /></picture>`;
}
const portatil = (prefijo, nombre, alt, opciones = {}) => `<div class="portatil"><div class="portatil__pantalla">${imagen(prefijo, nombre, { alt, ancho: 1600, alto: 1000, chico: 800, sizes: '(min-width: 1040px) 600px, 92vw', ...opciones })}</div></div>`;
const telefono = (prefijo, nombre, alt, opciones = {}) => `<div class="telefono"><div class="telefono__pantalla">${imagen(prefijo, nombre, { alt, ancho: 780, alto: 1688, chico: 390, sizes: '(min-width: 1040px) 260px, 60vw', ...opciones })}</div></div>`;

// ── piezas comunes ──
const ENLACES = [
  ['agenda', 'Agenda'],
  ['expediente', 'Expediente'],
  ['precios', 'Precios'],
  ['preguntas', 'Preguntas'],
];
const hayContacto = Boolean(CONTACTO.whatsapp || CONTACTO.correo);
const destinoPrueba = (prefijo) => `${prefijo}#prueba`;

function cabecera(prefijo) {
  const lista = ENLACES.map(([id, t]) => `<li><a href="${prefijo}#${id}">${t}</a></li>`).join('');
  return `<header class="cab" data-cab>
  <div class="envoltura cab__fila">
    <a class="cab__marca" href="${prefijo || './'}" aria-label="Citas Médicas, de alphateklab: inicio">${SIMBOLO}<span class="cab__nombre">${esc(P.PRODUCTO)}<small>por alphateklab</small></span></a>
    <nav class="cab__menu" aria-label="Principal"><ul>${lista}</ul></nav>
    <div class="cab__acciones">
      <a class="boton boton--senal cab__cta" href="${destinoPrueba(prefijo)}">Probar gratis</a>
      <button class="cab__abrir" type="button" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir el menú" data-abrir-menu>${icono('list', 'ico ico--abrir')}${icono('x', 'ico ico--cerrar')}</button>
    </div>
  </div>
  <nav class="cab__movil" id="menu-movil" aria-label="Menú" hidden>
    <ul class="envoltura">${lista}<li><a class="boton boton--senal" href="${destinoPrueba(prefijo)}">Probar ${P.PRUEBA_DIAS} días gratis</a></li></ul>
  </nav>
</header>`;
}

function pie(prefijo) {
  const contacto = [
    CONTACTO.whatsapp ? `<li><a href="https://wa.me/${CONTACTO.whatsapp}">WhatsApp</a></li>` : '',
    CONTACTO.correo ? `<li><a href="mailto:${esc(CONTACTO.correo)}">${esc(CONTACTO.correo)}</a></li>` : '',
  ].join('');
  return `<footer class="pie">
  <div class="envoltura pie__fila">
    <div class="pie__marca">${SIMBOLO}<p><strong>${esc(P.PRODUCTO)}</strong> es un producto de alphateklab, en Panamá.</p></div>
    <nav aria-label="Al pie"><ul class="pie__enlaces"><li><a href="${prefijo}#precios">Precios</a></li><li><a href="${prefijo}#preguntas">Preguntas</a></li><li><a href="${prefijo || './'}privacidad/">Privacidad</a></li>${contacto}</ul></nav>
  </div>
  <p class="envoltura pie__nota">Las pantallas muestran un consultorio de ejemplo con pacientes inventados. Precios en dólares, al mes. Actualizado el ${esc(ACTUALIZADO.texto)}.</p>
</footer>`;
}

function documento({ titulo, descripcion, prefijo, cuerpo, canonica, robots = '', datos = null, imagenOg = 'assets/og-citas.jpg' }) {
  usados = new Set(['list', 'x']);
  const cab = cabecera(prefijo);
  const pieHtml = pie(prefijo);
  const html = typeof cuerpo === 'function' ? cuerpo() : cuerpo;
  return `<!doctype html>
<html lang="es-PA">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}" />
<link rel="canonical" href="${esc(canonica)}" />${robots ? `\n<meta name="robots" content="${robots}" />` : ''}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="alphateklab" />
<meta property="og:title" content="${esc(titulo)}" />
<meta property="og:description" content="${esc(descripcion)}" />
<meta property="og:url" content="${esc(canonica)}" />
<meta property="og:locale" content="es_PA" />
<meta property="og:image" content="${URL_BASE}${imagenOg}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#f6f7f9" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0f1218" media="(prefers-color-scheme: dark)" />
<link rel="icon" href="${prefijo}assets/marca/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="${prefijo}assets/marca/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="${prefijo}assets/marca/favicon-180.png" />
<link rel="preload" href="${prefijo}assets/fuentes/manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="${prefijo}assets/fuentes/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="${conVersion(prefijo, 'assets/atk.css')}" />
<link rel="stylesheet" href="${conVersion(prefijo, 'assets/citas.css')}" />${datos ? `\n<script type="application/ld+json">${jsonEnScript(datos)}</script>` : ''}
</head>
<body class="citas">
<a class="saltar" href="#contenido">Saltar al contenido</a>
${sprite()}
${cab}
${html}
${pieHtml}
<script type="module" src="${conVersion(prefijo, 'js/citas.js')}"></script>
</body>
</html>
`;
}

// ── la portada ──
function heroe() {
  const h = P.HEROE;
  return `<section class="heroe" aria-labelledby="heroe-titulo">
  <div class="heroe__fondo" aria-hidden="true"></div>
  <div class="envoltura heroe__fila">
    <div class="heroe__texto">
      <p class="antetitulo">${icono('stethoscope')}${esc(h.antetitulo)}</p>
      <h1 id="heroe-titulo" class="heroe__titulo">${resaltar(h.titulo)}</h1>
      <p class="heroe__bajada">${esc(h.bajada)}</p>
      <div class="heroe__acciones">
        <a class="boton boton--senal boton--grande" href="#prueba">Probar ${P.PRUEBA_DIAS} días gratis${icono('arrow-right')}</a>
        <a class="boton boton--linea boton--grande" href="#precios">Ver precios</a>
      </div>
      <ul class="heroe__puntos" role="list">${h.puntos.map((p) => `<li>${icono('check')}${esc(p)}</li>`).join('')}</ul>
    </div>
    <figure class="heroe__visual">
      <div class="heroe__dispositivos">
        ${portatil('', 'citas-agenda', 'La agenda del día en un consultorio de ejemplo, con las citas de dos médicos.', { prioridad: true })}
        ${telefono('', 'citas-registro', 'Una paciente de ejemplo llena sus datos en su teléfono.', { perezosa: false })}
        <ul class="avisos" role="list" aria-hidden="true">${h.avisos.map((a, i) => `<li class="aviso aviso--${i + 1}"><span class="aviso__icono">${icono(a.icono)}</span><span><strong>${esc(a.titulo)}</strong><small>${esc(a.texto)}</small></span></li>`).join('')}</ul>
      </div>
      <figcaption>Pantallas reales del sistema, con un consultorio de ejemplo y pacientes inventados.</figcaption>
    </figure>
  </div>
</section>`;
}

const confianza = () => `<section class="confianza" aria-label="Lo esencial">
  <ul class="envoltura confianza__lista" role="list">${P.CONFIANZA.map((c) => `<li>${icono(c.icono)}${esc(c.texto)}</li>`).join('')}</ul>
</section>`;

function precioDeParte(id) {
  return id === 'agenda' ? `<span class="parte__desde">desde</span> <strong class="num">${dolares(P.PRECIOS.agenda[0].precio)}</strong>` : `<strong class="num">${dolares(P.PRECIOS.expediente)}</strong>`;
}

const partes = () => `<section class="seccion envoltura" id="productos" aria-labelledby="productos-titulo">
  <div class="seccion__cabeza seccion__cabeza--centro">
    <p class="antetitulo">${icono('sparkle')}Dos partes: contratas lo que usas</p>
    <h2 id="productos-titulo" class="seccion__titulo">Agenda y expediente, juntos o por separado</h2>
    <p class="seccion__bajada">La agenda es para la recepción; el expediente, para el médico. Úsalos juntos o cada uno por su lado.</p>
  </div>
  <div class="partes">
    ${P.PARTES.map(
      (p) => `<article class="parte parte--${p.id} revelar">
      <div class="parte__cabeza"><span class="parte__icono">${icono(p.icono)}</span><p class="parte__para">${esc(p.para)}</p></div>
      <h3 class="parte__nombre">${esc(p.nombre)}</h3>
      <p class="parte__resumen">${esc(p.resumen)}</p>
      <p class="parte__precio">${precioDeParte(p.id)} <span class="parte__unidad">${esc(p.unidad)}</span></p>
      <ul class="lista-check" role="list">${p.incluye.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>
      <a class="parte__enlace" href="#${p.id}">Ver cómo funciona${icono('arrow-right')}</a>
    </article>`,
    ).join('\n    ')}
  </div>
  <p class="partes__juntas">${icono('sparkle')}<span><strong>Las dos juntas:</strong> la recepción agenda y el médico abre el expediente desde la cita.</span></p>
</section>`;

function chat() {
  const c = P.CHAT;
  return `<div class="chat" data-chat role="img" aria-label="${esc(`Ejemplo: le llega el recordatorio por WhatsApp a una paciente y responde «${c.respuesta}»; la cita queda confirmada.`)}">
  <div class="chat__cabeza"><span class="chat__avatar">DR</span><span><strong>${esc(c.consultorio)}</strong><small>${icono('whatsapp-logo')}WhatsApp</small></span></div>
  <div class="chat__cuerpo">
    <p class="chat__dia">Hoy</p>
    <p class="chat__burbuja chat__burbuja--entra" data-paso>${esc(c.mensaje)}<span class="chat__hora">9:00 a. m.</span></p>
    <p class="chat__burbuja chat__burbuja--sale" data-paso>${esc(c.respuesta)}<span class="chat__hora">9:04 a. m. ✓✓</span></p>
    <p class="chat__estado" data-paso>${icono('check-circle')}${esc(c.estado)}</p>
  </div>
</div>`;
}

function dictado() {
  return `<div class="dictado" data-dictado role="img" aria-label="Ejemplo: la nota del médico se llena por secciones mientras dicta.">
  <div class="dictado__cabeza"><strong>Nota del médico</strong><span class="dictado__mic">${icono('microphone')}<span>Dictando…</span></span></div>
  ${P.DICTADO.map((d) => `<div class="dictado__seccion"><p class="dictado__titulo">${esc(d.seccion)}</p><p class="dictado__texto" data-texto="${esc(d.texto)}">${esc(d.texto)}</p></div>`).join('\n  ')}
</div>`;
}

function hoja() {
  const h = P.HOJA;
  return `<div class="hoja-visual">
  <div class="folder" aria-hidden="true"></div>
  <article class="hoja" aria-label="Ejemplo de la hoja impresa">
    <header class="hoja__cabeza"><span class="hoja__logo" aria-hidden="true">DR</span><span><strong>${esc(h.consultorio)}</strong><small>Expediente clínico</small></span></header>
    <dl class="hoja__datos">
      <div><dt>Paciente</dt><dd>${esc(h.paciente)}</dd></div>
      <div><dt>Cédula</dt><dd>${esc(h.documento)}</dd></div>
      <div><dt>Edad</dt><dd>${esc(h.edad)}</dd></div>
      <div><dt>Consulta</dt><dd>${esc(h.fecha)}</dd></div>
      <div><dt>Médico</dt><dd>${esc(h.medico)}</dd></div>
    </dl>
    <p class="hoja__antecedentes"><strong>Antecedentes</strong> ${esc(h.antecedentes)}</p>
    <p class="hoja__signos"><strong>Signos</strong> ${esc(h.signos)}</p>
    ${h.notas.map(([t, x]) => `<div class="hoja__nota"><p class="hoja__titulo">${esc(t)}</p><p>${esc(x)}</p></div>`).join('')}
    <footer class="hoja__firma"><span>Firma y sello del médico</span></footer>
  </article>
</div>`;
}

function visual(v) {
  if (v.tipo === 'portatil') return portatil('', v.imagen, v.alt);
  if (v.tipo === 'telefono') return `<div class="telefono-solo">${telefono('', v.imagen, v.alt)}</div>`;
  if (v.tipo === 'chat') return chat();
  if (v.tipo === 'dictado') return dictado();
  if (v.tipo === 'hoja') return hoja();
  throw new Error(`Visual desconocido: ${v.tipo}`);
}

function seccionParte(id) {
  const s = P.FILAS[id];
  const parte = P.PARTES.find((p) => p.id === id);
  const precio = id === 'agenda' ? `desde ${dolares(P.PRECIOS.agenda[0].precio)} ${parte.unidad}` : `${dolares(P.PRECIOS.expediente)} ${parte.unidad}`;
  return `<section class="seccion producto producto--${id}" id="${id}" aria-labelledby="${id}-titulo">
  <div class="envoltura">
    <div class="seccion__cabeza">
      <p class="antetitulo">${icono(parte.icono)}${esc(parte.nombre)} · ${esc(precio)}</p>
      <h2 id="${id}-titulo" class="seccion__titulo">${esc(s.titulo)}</h2>
      <p class="seccion__bajada">${esc(s.bajada)}</p>
    </div>
    ${s.filas
      .map(
        (f, i) => `<div class="fila${i % 2 ? ' fila--invertida' : ''}"${f.id ? ` id="${f.id}"` : ''}>
      <div class="fila__texto revelar">
        <h3 class="fila__titulo">${esc(f.titulo)}</h3>
        <p>${esc(f.texto)}</p>
        ${f.puntos ? `<ul class="lista-check" role="list">${f.puntos.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>` : ''}
        ${f.pasos ? `<ol class="pasitos">${f.pasos.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
      </div>
      <div class="fila__visual revelar">${visual(f.visual)}</div>
    </div>`,
      )
      .join('\n    ')}
  </div>
</section>`;
}

const accesos = () => {
  const a = P.ACCESOS;
  return `<section class="seccion envoltura" id="accesos" aria-labelledby="accesos-titulo">
  <div class="fila fila--accesos">
    <div class="fila__texto">
      <p class="antetitulo">${icono('lock-key')}Privacidad</p>
      <h2 id="accesos-titulo" class="seccion__titulo">${esc(a.titulo)}</h2>
      <p class="seccion__bajada">${esc(a.bajada)}</p>
    </div>
    <div class="fila__visual revelar">${portatil('', a.imagen, a.alt)}</div>
  </div>
  <ul class="garantias" role="list">${a.puntos.map((p) => `<li class="revelar"><span class="garantias__icono">${icono(p.icono)}</span><div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div></li>`).join('')}</ul>
</section>`;
};

function precios() {
  const ag = P.PRECIOS.agenda;
  const agenda = P.PARTES.find((p) => p.id === 'agenda');
  const exp = P.PARTES.find((p) => p.id === 'expediente');
  return `<section class="seccion precios" id="precios" aria-labelledby="precios-titulo">
  <div class="envoltura">
    <div class="seccion__cabeza seccion__cabeza--centro">
      <p class="antetitulo">${icono('currency-circle-dollar')}Precios</p>
      <h2 id="precios-titulo" class="seccion__titulo">Precios claros, mes a mes</h2>
      <p class="seccion__bajada">Contrata solo lo que usas. Los primeros ${P.PRUEBA_DIAS} días son gratis y no hay plan anual.</p>
    </div>
    <style>@supports selector(:has(*)) { .plan--agenda .plan__cifra:first-child { display: none; } ${ag.map((t) => `.plan--agenda:has(input[value="${t.mensajes}"]:checked) .plan__cifra[data-mensajes="${t.mensajes}"] { display: inline; }`).join(' ')} }</style>
    <div class="planes">
      <article class="plan plan--agenda revelar" data-plan="agenda">
        <div class="plan__cabeza"><span class="plan__icono">${icono('calendar-check')}</span><h3>${esc(agenda.nombre)}</h3></div>
        <p class="plan__para">Para toda la clínica, con todos sus médicos.</p>
        <fieldset class="plan__mensajes">
          <legend>Mensajes de WhatsApp al mes</legend>
          <div class="segmentos">${ag.map((t, i) => `<label><input type="radio" name="plan-mensajes" value="${t.mensajes}"${i === 0 ? ' checked' : ''} /><span>${t.mensajes}</span></label>`).join('')}</div>
        </fieldset>
        <p class="plan__precio">${ag.map((t) => `<span class="plan__cifra" data-mensajes="${t.mensajes}"><strong class="num">${dolares(t.precio)}</strong><span class="sr"> con ${t.mensajes} mensajes</span></span>`).join('')}<span class="plan__unidad">${esc(agenda.unidad)}</span></p>
        <ul class="lista-check" role="list">${agenda.incluye.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>
        <a class="boton boton--linea plan__boton" href="#prueba" data-elegir="agenda">Probar la agenda</a>
      </article>
      <article class="plan plan--expediente revelar" data-plan="expediente">
        <div class="plan__cabeza"><span class="plan__icono">${icono('stethoscope')}</span><h3>${esc(exp.nombre)}</h3></div>
        <p class="plan__para">Por cada médico que hace expedientes. La recepción, enfermería y administración no pagan.</p>
        <p class="plan__precio"><span class="plan__cifra plan__cifra--fija"><strong class="num">${dolares(P.PRECIOS.expediente)}</strong></span><span class="plan__unidad">${esc(exp.unidad)}</span></p>
        <ul class="lista-check" role="list">${exp.incluye.map((x) => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>
        <a class="boton boton--linea plan__boton" href="#prueba" data-elegir="expediente">Probar el expediente</a>
      </article>
    </div>
    <div class="calculadora revelar" data-calculadora hidden>
      <h3 class="calculadora__titulo">${icono('currency-circle-dollar')}¿Cuánto pagaría tu clínica?</h3>
      <div class="calculadora__fila">
        <label class="interruptor"><input type="checkbox" name="calc-agenda" checked /><span>Agenda de citas</span></label>
        <label class="calculadora__dato"><span class="sr">Mensajes de WhatsApp al mes</span><select name="calc-mensajes">${ag.map((t) => `<option value="${t.mensajes}">${t.mensajes} mensajes al mes</option>`).join('')}</select></label>
        <output class="calculadora__sub num" data-sub="agenda"></output>
      </div>
      <div class="calculadora__fila">
        <label class="interruptor"><input type="checkbox" name="calc-expediente" checked /><span>Expediente clínico</span></label>
        <div class="contador calculadora__dato"><button type="button" data-sumar="-1" aria-label="Un profesional menos">−</button><label><span class="sr">Profesionales</span><input type="number" name="calc-profesionales" min="1" max="50" value="2" inputmode="numeric" /></label><span class="contador__unidad">profesionales</span><button type="button" data-sumar="1" aria-label="Un profesional más">+</button></div>
        <output class="calculadora__sub num" data-sub="expediente"></output>
      </div>
      <div class="calculadora__total"><span>Total al mes</span><output class="num" data-total aria-live="polite"></output></div>
      <a class="boton boton--senal calculadora__boton" href="#prueba" data-elegir="calculadora">Probar este plan ${P.PRUEBA_DIAS} días gratis${icono('arrow-right')}</a>
    </div>
    <script type="application/json" id="datos-precios">${jsonEnScript({ agenda: ag, expediente: P.PRECIOS.expediente })}</script>
  </div>
</section>`;
}

const pasos = () => `<section class="seccion envoltura" id="empezar" aria-labelledby="empezar-titulo">
  <div class="seccion__cabeza seccion__cabeza--centro">
    <p class="antetitulo">${icono('hand-tap')}Cómo empiezas</p>
    <h2 id="empezar-titulo" class="seccion__titulo">Listo para usar en tu consultorio</h2>
  </div>
  <ol class="pasos">${P.PASOS.map((p) => `<li class="paso revelar"><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`).join('')}</ol>
</section>`;

const preguntas = () => `<section class="seccion envoltura" id="preguntas" aria-labelledby="preguntas-titulo">
  <div class="seccion__cabeza seccion__cabeza--centro">
    <p class="antetitulo">${icono('question')}Preguntas frecuentes</p>
    <h2 id="preguntas-titulo" class="seccion__titulo">Lo que nos preguntan los médicos</h2>
  </div>
  <div class="preguntas">${P.PREGUNTAS.map(([q, a]) => `<details class="pregunta"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>`;

function prueba() {
  const directo = [
    CONTACTO.whatsapp ? `<a class="prueba__directo" href="https://wa.me/${CONTACTO.whatsapp}">${icono('whatsapp-logo')}WhatsApp: +${CONTACTO.whatsapp.replace(/^507(\d{4})(\d{4})$/, '507 $1-$2')}</a>` : '',
    CONTACTO.correo ? `<a class="prueba__directo" href="mailto:${esc(CONTACTO.correo)}">${icono('envelope-simple')}${esc(CONTACTO.correo)}</a>` : '',
  ].join('');
  const botones = [
    CONTACTO.whatsapp ? `<button class="boton boton--senal" type="submit" value="whatsapp">${icono('whatsapp-logo')}Pedir por WhatsApp</button>` : '',
    CONTACTO.correo ? `<button class="boton ${CONTACTO.whatsapp ? 'boton--linea' : 'boton--senal'}" type="submit" value="correo">${icono('envelope-simple')}Pedir por correo</button>` : '',
  ].join('');
  return `<section class="prueba" id="prueba" aria-labelledby="prueba-titulo">
  <div class="envoltura prueba__fila">
    <div class="prueba__texto">
      <p class="antetitulo antetitulo--oscuro">${icono('sparkle')}${P.PRUEBA_DIAS} días gratis</p>
      <h2 id="prueba-titulo" class="seccion__titulo">Pruébalo en tu consultorio</h2>
      <p class="seccion__bajada">Te lo dejamos listo con tus médicos y tus pacientes. Sin tarjeta y sin plan anual.</p>
      <ul class="lista-check lista-check--clara" role="list"><li>${icono('check')}Pasamos tus pacientes desde tu Excel</li><li>${icono('check')}Creamos el usuario de cada persona</li><li>${icono('check')}Te mostramos cómo se usa</li></ul>
      ${directo ? `<p class="prueba__contacto">${directo}</p>` : ''}
    </div>
    ${
      hayContacto
        ? `<form class="prueba__form" data-prueba data-dias="${P.PRUEBA_DIAS}" data-whatsapp="${esc(CONTACTO.whatsapp || '')}" data-correo="${esc(CONTACTO.correo || '')}">
      <h3 class="prueba__form-titulo">Pide tu prueba</h3>
      <label class="campo"><span>Tu nombre</span><input name="nombre" autocomplete="name" required maxlength="80" /></label>
      <label class="campo"><span>Clínica o consultorio</span><input name="clinica" autocomplete="organization" required maxlength="100" /></label>
      <label class="campo campo--corto"><span>¿Cuántos médicos?</span><input name="medicos" type="number" min="1" max="50" value="1" inputmode="numeric" /></label>
      <fieldset class="campo">
        <legend>¿Qué quieres probar?</legend>
        <div class="opciones">
          <label><input type="radio" name="interes" value="los dos" checked /><span>Los dos</span></label>
          <label><input type="radio" name="interes" value="la agenda" /><span>La agenda</span></label>
          <label><input type="radio" name="interes" value="el expediente" /><span>El expediente</span></label>
        </div>
      </fieldset>
      <label class="campo"><span>Algo más <small>(opcional)</small></span><textarea name="nota" rows="2" maxlength="400"></textarea></label>
      <input type="hidden" name="plan" value="" />
      <div class="prueba__botones">${botones}</div>
      <p class="prueba__aviso">El mensaje se arma aquí y sale solo cuando tú lo mandas.</p>
    </form>`
        : ''
    }
  </div>
</section>`;
}

function datosEstructurados() {
  const org = { '@type': 'Organization', '@id': `${URL_BASE}#organizacion`, name: 'alphateklab', url: URL_BASE, logo: `${URL_BASE}assets/marca/favicon-180.png`, areaServed: { '@type': 'Country', name: 'Panamá' } };
  const mensual = (precio, unidad) => ({ '@type': 'UnitPriceSpecification', price: precio, priceCurrency: 'USD', unitText: unidad, billingDuration: 'P1M' });
  const app = {
    '@type': 'SoftwareApplication',
    name: P.PRODUCTO,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'es-PA',
    url: URL_BASE,
    description: sinMarcas(P.HEROE.bajada),
    provider: { '@id': `${URL_BASE}#organizacion` },
    offers: [
      ...P.PRECIOS.agenda.map((t) => ({ '@type': 'Offer', name: `Agenda de citas, ${t.mensajes} mensajes de WhatsApp al mes`, price: t.precio, priceCurrency: 'USD', priceSpecification: mensual(t.precio, 'clínica') })),
      { '@type': 'Offer', name: 'Expediente clínico', price: P.PRECIOS.expediente, priceCurrency: 'USD', priceSpecification: mensual(P.PRECIOS.expediente, 'profesional') },
    ],
  };
  const faq = { '@type': 'FAQPage', mainEntity: P.PREGUNTAS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return { '@context': 'https://schema.org', '@graph': [org, app, faq] };
}

function paginaInicio() {
  return documento({
    titulo: `${P.PRODUCTO}: agenda y expediente clínico para consultorios en Panamá · alphateklab`,
    descripcion: `Agenda con recordatorios por WhatsApp para que el paciente confirme, y el expediente de cada consulta con dictado e impresión para el folder. Desde ${dolares(P.DESDE)} al mes. Prueba ${P.PRUEBA_DIAS} días gratis.`,
    prefijo: '',
    canonica: URL_BASE,
    datos: datosEstructurados(),
    cuerpo: () => `<main id="contenido">
${heroe()}
${confianza()}
${partes()}
${seccionParte('agenda')}
${seccionParte('expediente')}
${accesos()}
${precios()}
${pasos()}
${preguntas()}
${prueba()}
</main>`,
  });
}

function paginaPrivacidad() {
  const prefijo = '../';
  return documento({
    titulo: 'Privacidad · Citas Médicas de alphateklab',
    descripcion: 'Qué datos trata este sitio y cuáles no.',
    prefijo,
    canonica: `${URL_BASE}privacidad/`,
    cuerpo: () => `<main id="contenido" class="envoltura texto-largo">
  <p class="antetitulo">${icono('shield-check')}Privacidad</p>
  <h1 class="texto-largo__titulo">Privacidad</h1>
  <p class="texto-largo__fecha">Vigente desde el ${esc(ACTUALIZADO.texto)}. Se rige por la Ley 81 de 2019 de protección de datos personales de Panamá y su reglamento, el Decreto Ejecutivo 285 de 2021.</p>
  <h2>Este sitio</h2>
  <p>No usa cookies, ni analítica, ni píxeles de redes sociales, ni formularios que envíen datos a un servidor.</p>
  <p>El formulario para pedir la prueba arma el mensaje en tu navegador. Solo sale de tu equipo si tú lo mandas por WhatsApp o por correo, y desde ahí rigen las políticas de esos servicios. Las fuentes y las imágenes se sirven desde este mismo sitio.</p>
  <h2>El sistema Citas Médicas</h2>
  <p>Los datos de los pacientes que un consultorio guarda en el sistema son de ese consultorio. Antes de guardarlos, el paciente acepta su uso según la Ley 81 de 2019, en la recepción o desde su teléfono, y queda la fecha y la forma en que lo aceptó.</p>
  <p>Las pantallas de este sitio muestran un consultorio de ejemplo con pacientes inventados.</p>
  <p><a href="${prefijo}">Volver al inicio</a></p>
</main>`,
  });
}

function pagina404() {
  const prefijo = '/';
  return documento({
    titulo: 'Esta página no existe · Citas Médicas de alphateklab',
    descripcion: 'La página que buscas no existe.',
    prefijo,
    canonica: `${URL_BASE}404.html`,
    robots: 'noindex',
    cuerpo: () => `<main id="contenido" class="envoltura texto-largo texto-largo--centro">
  <p class="antetitulo">${icono('question')}Error 404</p>
  <h1 class="texto-largo__titulo">Esta página no existe</h1>
  <p>alphateklab ahora se dedica a ${esc(P.PRODUCTO)}: la agenda con recordatorios por WhatsApp y el expediente clínico para consultorios.</p>
  <p><a class="boton boton--senal" href="${prefijo}">Ver ${esc(P.PRODUCTO)}</a></p>
</main>`,
  });
}

// /citasmed/: la dirección que se pensó primero para el producto; ahora el producto es todo el sitio.
const paginaCitasmed = () => `<!doctype html>
<html lang="es-PA">
<head>
<meta charset="utf-8" />
<title>${esc(P.PRODUCTO)} · alphateklab</title>
<link rel="canonical" href="${URL_BASE}" />
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=../" />
</head>
<body>
<p><a href="../">${esc(P.PRODUCTO)}</a></p>
</body>
</html>
`;

const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', 'privacidad/'].map((u) => `  <url><loc>${URL_BASE}${u}</loc><lastmod>${ACTUALIZADO.iso}</lastmod></url>`).join('\n')}
</urlset>
`;

// SALIDA=<carpeta> escribe en otra parte (la prueba lo usa para ver que lo publicado está al día).
const SALIDA = process.env.SALIDA || RAIZ;
const escribir = (ruta, contenido) => {
  mkdirSync(dirname(join(SALIDA, ruta)), { recursive: true });
  writeFileSync(join(SALIDA, ruta), contenido);
};

escribir('index.html', paginaInicio());
escribir('privacidad/index.html', paginaPrivacidad());
escribir('404.html', pagina404());
escribir('citasmed/index.html', paginaCitasmed());
escribir('sitemap.xml', sitemap());
escribir('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${URL_BASE}sitemap.xml\n`);
console.log(`Generado: portada de ${P.PRODUCTO}, privacidad, 404, /citasmed/, sitemap y robots.txt.${hayContacto ? '' : ' Sin contacto en datos/sitio.mjs: la portada sale sin el formulario de la prueba.'}`);
