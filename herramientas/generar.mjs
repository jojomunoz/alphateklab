// Genera index.html y servicios/<slug>/index.html a partir de datos/catalogo.mjs.
// Uso: node herramientas/generar.mjs   (el resultado se versiona; ver CLAUDE.md)

import { mkdirSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { PAQUETES, ESCALONES } from '../datos/paquetes.mjs';
import { ACTUALIZADO, CONTACTO, URL_BASE } from '../datos/sitio.mjs';
import { validarCatalogo } from '../js/catalogo-reglas.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const existe = (ruta) => existsSync(join(RAIZ, ruta));
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
// Mientras se construyen las demos: PERMITIR_PENDIENTES=1 deja pasar demos y capturas que todavía no existen.
if (process.env.PERMITIR_PENDIENTES === '1') {
  const pendientes = errores.filter((e) => /no existe en el repo|falta la captura/.test(e));
  if (pendientes.length) console.warn('Pendiente (no bloquea con PERMITIR_PENDIENTES=1):\n- ' + pendientes.join('\n- '));
  errores = errores.filter((e) => !pendientes.includes(e));
}
if (errores.length) {
  console.error('El catálogo tiene errores; no se genera nada:\n- ' + errores.join('\n- '));
  process.exit(1);
}

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// JSON dentro de <script>: escapar «<» para que un «</script>» en los datos no corte el bloque.
const jsonEnScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

const nombreSector = Object.fromEntries(SECTORES.map((s) => [s.id, s.nombre]));
const nombreTipo = Object.fromEntries(TIPOS.map((t) => [t.id, t.nombre]));
const precioTexto = (s) => (s.precio ? s.precio.texto : 'A cotizar');
const esExterna = (u) => /^https?:\/\//.test(u);
// rutas de demo relativas a la raíz del sitio → relativas a la página que las enlaza
const enlaceDemo = (u, prefijo) => (esExterna(u) ? u : prefijo + u);

const ICONO_VISITA = `<svg class="ico-instala" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15Zm0-6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const ICONO_INSTALA = `<svg class="ico-instala" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6 1v4M10 1v4M3.5 5h9v3.2a4.5 4.5 0 0 1-9 0V5Zm4.5 7.6V15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>`;

function cabecera(prefijo, actual) {
  const nav = [
    ['#servicios', 'Servicios'],
    ['#laboratorio', 'Laboratorio'],
    ['#como-trabajamos', 'Cómo trabajamos'],
    ['#cotizar', 'Cotizar'],
  ];
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
<header class="cabecera">
  <div class="envoltura cabecera__fila">
    <a class="marca" href="${prefijo}" aria-label="alphateklab, inicio">alphatek<span class="marca__lab">lab</span></a>
    <nav class="nav" aria-label="Principal">
      ${nav.map(([h, t]) => `<a href="${actual === 'inicio' ? h : prefijo + h}"${h === '#como-trabajamos' ? ' class="nav__opcional"' : ''}>${t}</a>`).join('\n      ')}
    </nav>
  </div>
</header>`;
}

function pie(prefijo) {
  return `<footer class="pie">
  <div class="envoltura pie__fila">
    <p><a class="marca" href="${prefijo}">alphatek<span class="marca__lab">lab</span></a><br />Soluciones tecnológicas para negocios en Panamá</p>
    <p class="pie__nota">Las demos usan negocios de ejemplo: sus nombres, platos, pacientes y reservas son ficticios.<br />Actualizado el ${esc(ACTUALIZADO.texto)}.<br /><a href="${prefijo}privacidad/">Privacidad</a></p>
  </div>
</footer>`;
}

function documento({ titulo, descripcion, prefijo, cuerpo, scripts = '', canonica, robots = '' }) {
  return `<!doctype html>
<html lang="es-PA">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}" />
<link rel="canonical" href="${esc(canonica)}" />${robots ? `\n<meta name="robots" content="${robots}" />` : ''}
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(titulo)}" />
<meta property="og:description" content="${esc(descripcion)}" />
<meta property="og:url" content="${esc(canonica)}" />
<meta property="og:locale" content="es_PA" />
<meta property="og:image" content="${URL_BASE}assets/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="alphateklab: software, pantallas, cámaras y sensores para negocios en Panamá" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#f4f5f2" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#111316" media="(prefers-color-scheme: dark)" />
<link rel="icon" href="${prefijo}assets/favicon.svg" type="image/svg+xml" />
<link rel="preload" href="${prefijo}assets/fuentes/archivo-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="${prefijo}assets/atk.css" />
<link rel="stylesheet" href="${prefijo}assets/sitio.css" />
</head>
<body>
${cuerpo}
${scripts}
</body>
</html>
`;
}

function etiquetaServicio(s, prefijo, destino) {
  const conDemo = Boolean(s.demo);
  const clase = conDemo ? 'etiqueta' : 'etiqueta etiqueta--hueca';
  const extra = [conDemo ? 'con demo' : '', s.instala ? 'se instala en el local' : ''].filter(Boolean).join(', ');
  return `<a class="${clase} tablero__item" href="${destino(s)}" data-sectores="${s.sectores.join(' ')}"${extra ? ` aria-label="${esc(`${s.id} ${s.corto} (${extra})`)}"` : ''}><span class="tablero__codigo">${s.id}</span> ${esc(s.corto)}${s.instala ? ICONO_INSTALA : ''}</a>`;
}

function fichaServicio(s) {
  const demo = s.demo
    ? `<a class="boton boton--linea" href="${enlaceDemo(s.demo, '')}">Probar la demo<span class="sr"> de ${esc(s.nombre)}</span></a>`
    : '';
  const equipo = s.equipo.length
    ? `<div><h4>${s.instala ? 'Equipo que se instala' : 'Equipo'}</h4><ul>${s.equipo.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>`
    : `<div><h4>Equipo</h4><p class="ficha__nada">No necesita equipo en el local.</p></div>`;
  return `<article class="ficha" id="${s.slug}" data-sectores="${s.sectores.join(' ')}" data-tipos="${s.tipos.join(' ')}" data-demo="${s.demo ? 1 : 0}" data-instala="${s.instala ? 1 : 0}">
  <div class="ficha__cabeza">
    <span class="${s.demo ? 'etiqueta' : 'etiqueta etiqueta--hueca'}">${s.id}</span>
    <h3 class="ficha__nombre"><a href="servicios/${s.slug}/">${esc(s.nombre)}</a></h3>
    <p class="ficha__precio num">${esc(precioTexto(s))}${s.precio?.nota ? `<span class="ficha__nota">${esc(s.precio.nota)}</span>` : ''}</p>
  </div>
  <p class="ficha__para">${esc(s.para)}</p>
  <p class="ficha__meta"><span>${s.tipos.map((t) => esc(nombreTipo[t])).join(', ')}</span>${s.instala ? `<span class="ficha__instala">${ICONO_INSTALA}Lo instalamos en tu local</span>` : ''}${s.visita ? `<span class="ficha__instala">${ICONO_VISITA}Vamos a tu propiedad</span>` : ''}</p>
  <details class="ficha__detalle">
    <summary>Qué incluye</summary>
    <div class="ficha__columnas">
      <div><h4>Incluye</h4><ul>${s.incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      ${equipo}
    </div>
    ${s.aparte ? `<p class="ficha__aparte"><strong>Aparte:</strong> ${esc(s.aparte)}</p>` : ''}
  </details>
  <div class="ficha__acciones">
    <button class="boton boton--linea" type="button" data-cotizar="${s.id}" aria-pressed="false">Agregar a la cotización</button>
    ${demo}
  </div>
</article>`;
}

function seccionServicios() {
  const porSector = SECTORES.map((sec) => ({ sec, lista: SERVICIOS.filter((s) => s.sectores[0] === sec.id) })).filter((g) => g.lista.length);
  return `<section class="servicios envoltura" id="servicios" aria-labelledby="servicios-titulo">
  <div class="seccion__cabeza">
    <h2 id="servicios-titulo" class="display seccion__titulo">Servicios</h2>
    <p class="seccion__bajada">${SERVICIOS.length} servicios, ordenados por el tipo de negocio para el que los pensamos primero. Muchos sirven para más de uno: el filtro los encuentra en todos.</p>
  </div>
  <form class="filtros" id="filtros" aria-label="Filtrar servicios">
    <fieldset class="filtros__grupo">
      <legend>Tu negocio</legend>
      <div class="filtros__opciones">
        <label class="opcion"><input type="radio" name="sector" value="" checked /> <span>Todos</span></label>
        ${SECTORES.map((s) => `<label class="opcion"><input type="radio" name="sector" value="${s.id}" /> <span>${esc(s.nombre)}</span></label>`).join('\n        ')}
      </div>
    </fieldset>
    <div class="filtros__fila">
      <label class="campo">
        <span>Tipo de solución</span>
        <select name="tipo" id="filtro-tipo">
          <option value="">Todas</option>
          ${TIPOS.map((t) => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('\n          ')}
        </select>
      </label>
      <label class="casilla"><input type="checkbox" name="demo" value="1" /> <span>Solo con demo para probar</span></label>
      <label class="casilla"><input type="checkbox" name="instala" value="1" /> <span>Solo lo que se instala en el local</span></label>
    </div>
    <p class="filtros__cuenta num" id="filtros-cuenta" aria-live="polite">Mostrando ${SERVICIOS.length} de ${SERVICIOS.length}</p>
  </form>
  <div class="catalogo" id="catalogo">
${porSector
  .map(
    (g) => `    <section class="grupo" data-grupo="${g.sec.id}" aria-labelledby="grupo-${g.sec.id}">
      <h3 class="grupo__titulo" id="grupo-${g.sec.id}">${esc(g.sec.nombre)}</h3>
      ${g.lista.map(fichaServicio).join('\n      ')}
    </section>`,
  )
  .join('\n')}
    <p class="catalogo__vacio" id="catalogo-vacio" hidden>Ningún servicio cumple esos filtros. <button class="enlace-boton" type="button" id="limpiar-filtros">Quitar los filtros</button></p>
  </div>
</section>`;
}

function seccionEmpezar() {
  const porId = new Map(SERVICIOS.map((s) => [s.id, s]));
  return `<section class="empezar envoltura" id="por-donde-empezar" aria-labelledby="empezar-titulo">
  <div class="seccion__cabeza">
    <h2 id="empezar-titulo" class="display seccion__titulo">Por dónde empezar</h2>
    <p class="seccion__bajada">No hace falta todo de una vez. Empieza por lo que te resuelve el problema de hoy y suma lo demás cuando lo necesites; cada escalón incluye el anterior.</p>
  </div>
  <div class="escalones">
    ${PAQUETES.map(
      (pq) => `<section class="escalera" aria-labelledby="esc-${pq.sector}">
      <h3 class="escalera__nombre" id="esc-${pq.sector}">${esc(pq.nombre)}</h3>
      <ol class="escalera__niveles">
        ${pq.niveles
          .map((ids, i) => {
            const acumulado = pq.niveles.slice(0, i + 1).flat();
            return `<li class="nivel">
          <p class="nivel__nombre">${ESCALONES[i]}</p>
          <ul class="nivel__servicios">${ids.map((id) => `<li><a href="#${porId.get(id).slug}"><span class="nivel__codigo">${id}</span> ${esc(porId.get(id).corto)}</a></li>`).join('')}</ul>
          <button class="enlace-boton nivel__cotizar" type="button" data-cotizar-varios="${acumulado.join(' ')}">Cotizar este escalón (${acumulado.length})</button>
        </li>`;
          })
          .join('\n        ')}
      </ol>
    </section>`,
    ).join('\n    ')}
  </div>
</section>`;
}

function seccionLaboratorio() {
  return `<section class="laboratorio envoltura" id="laboratorio" aria-labelledby="lab-titulo">
  <div class="seccion__cabeza">
    <h2 id="lab-titulo" class="display seccion__titulo">Laboratorio</h2>
    <p class="seccion__bajada">Demos que funcionan en tu navegador, con negocios de ejemplo. Ábrelas en el teléfono: varias están hechas para usarse ahí.</p>
  </div>
  <ol class="demos" role="list">
    ${DEMOS.map(
      (d) => `<li class="demo">
      <a class="demo__imagen" href="${d.url}" tabindex="-1" aria-hidden="true">${d.imagen && existe(d.imagen) ? `<img src="${d.imagen}" alt="" width="640" height="400" loading="lazy" decoding="async" />` : `<span class="demo__sinimagen">${esc(d.nombre)}</span>`}</a>
      <div class="demo__texto">
        <p class="demo__servicios">${d.servicios.map((id) => `<span class="etiqueta etiqueta--hueca">${id}</span>`).join(' ')}</p>
        <h3 class="demo__nombre"><a href="${d.url}">${esc(d.nombre)}</a></h3>
        <p>${esc(d.que)}</p>
        <p class="demo__prueba"><strong>Prueba:</strong> ${esc(d.prueba)}</p>
      </div>
    </li>`,
    ).join('\n    ')}
  </ol>
</section>`;
}

function seccionComoTrabajamos() {
  const pasos = [
    ['Visita', 'Vamos a tu local y vemos cómo trabajan hoy: dónde se pierde tiempo, qué se anota a mano, qué se cae.'],
    ['Propuesta', 'Te mandamos por escrito qué haríamos, qué equipo hace falta, cuánto cuesta y en cuánto tiempo queda.'],
    ['Equipo', 'Compramos el equipo después de que apruebas la propuesta, no antes, y te lo detallamos en la factura.'],
    ['Instalación', 'Instalamos, configuramos y le enseñamos a tu equipo a usarlo en el mismo local.'],
  ];
  return `<section class="trabajo envoltura" id="como-trabajamos" aria-labelledby="trabajo-titulo">
  <div class="seccion__cabeza">
    <h2 id="trabajo-titulo" class="display seccion__titulo">Cómo trabajamos</h2>
  </div>
  <ol class="pasos">
    ${pasos.map(([t, p]) => `<li class="paso"><h3 class="paso__titulo">${t}</h3><p>${p}</p></li>`).join('\n    ')}
  </ol>
</section>`;
}

function seccionPreguntas() {
  const lista = [
    ['¿Tengo que comprar equipo?', 'Solo si el servicio lo necesita; cada ficha marca con el enchufe lo que se instala en el local. En la propuesta te detallamos qué equipo y cuánto cuesta, y lo compramos después de que la apruebas. Si ya tienes algo que sirve (cámaras, una tableta, un televisor), lo usamos.'],
    ['¿De quién son el dominio, la página y los QR?', 'Tuyos. El dominio se registra a nombre de tu negocio y los QR impresos apuntan a una dirección de ese dominio, así que siguen funcionando aunque un día cambies de proveedor.'],
    ['¿Cuánto tarda?', 'Depende del servicio y del local. La fecha de entrega va escrita en la propuesta, junto con el precio.'],
    ['¿Qué pasa si algo deja de funcionar?', 'En la propuesta queda escrito cómo es el soporte: por dónde nos escribes, en cuánto tiempo respondemos y cuándo hace falta ir al local.'],
    ['¿Y los datos de mis clientes?', 'Lo que hacemos cumple la Ley 81 de 2019 de protección de datos personales: pide el consentimiento cuando guarda datos de personas y no los comparte con terceros. Esta página no guarda nada tuyo.'],
    ['¿Las demos son de verdad?', 'Funcionan en tu navegador con negocios inventados para mostrarlas, y cada una dice qué parte es simulada (un pago, un sensor). Para tu negocio se hace con tus datos, en tu dominio y con el equipo real.'],
  ];
  return `<section class="preguntas envoltura" id="preguntas" aria-labelledby="preguntas-titulo">
  <div class="seccion__cabeza">
    <h2 id="preguntas-titulo" class="display seccion__titulo">Preguntas antes de escribirnos</h2>
  </div>
  <div class="preguntas__lista">
    ${lista.map(([q, a]) => `<details class="pregunta"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n    ')}
  </div>
</section>`;
}

function seccionCotizar() {
  return `<section class="cotizar envoltura" id="cotizar" aria-labelledby="cotizar-titulo">
  <div class="seccion__cabeza">
    <h2 id="cotizar-titulo" class="display seccion__titulo">Arma tu cotización</h2>
    <p class="seccion__bajada">Marca los servicios que te interesan, cuéntanos de tu negocio y te queda un mensaje listo para mandar por WhatsApp. Esta página no envía ni guarda nada por su cuenta.</p>
  </div>
  <form class="cotizador" id="cotizador" novalidate>
    <div class="cotizador__lista">
      <h3 class="cotizador__subtitulo">Servicios elegidos <span class="num" id="cot-cuenta">(0)</span></h3>
      <ul id="cot-elegidos" class="cotizador__elegidos"></ul>
      <p class="cotizador__vacio" id="cot-vacio">Todavía no elegiste ninguno. Usa «Agregar a la cotización» en cada servicio o búscalo aquí.</p>
      <label class="campo">
        <span>Agregar un servicio</span>
        <select id="cot-agregar">
          <option value="">Elige un servicio…</option>
          ${SECTORES.map(
            (sec) => `<optgroup label="${esc(sec.nombre)}">${SERVICIOS.filter((s) => s.sectores[0] === sec.id)
              .map((s) => `<option value="${s.id}">${s.id} ${esc(s.nombre)}</option>`)
              .join('')}</optgroup>`,
          ).join('\n          ')}
        </select>
      </label>
    </div>
    <div class="cotizador__datos">
      <label class="campo"><span>Nombre del negocio</span><input id="cot-negocio" name="negocio" autocomplete="organization" maxlength="80" /></label>
      <label class="campo"><span>Tipo de negocio</span>
        <select id="cot-tipo" name="tipo">
          <option value="">Elige uno…</option>
          ${SECTORES.filter((s) => s.id !== 'todos').map((s) => `<option>${esc(s.nombre)}</option>`).join('')}
          <option>Otro</option>
        </select>
      </label>
      <label class="campo"><span>Provincia o ciudad</span><input id="cot-lugar" name="lugar" autocomplete="address-level1" maxlength="60" placeholder="Panamá, Chiriquí, Veraguas…" /></label>
      <label class="campo"><span>Qué necesitas resolver (opcional)</span><textarea id="cot-notas" name="notas" rows="3" maxlength="600"></textarea></label>
    </div>
    <div class="cotizador__mensaje">
      <h3 class="cotizador__subtitulo">Tu mensaje</h3>
      <pre class="mensaje" id="cot-mensaje" aria-live="polite"></pre>
      <div class="cotizador__acciones">
        <a class="boton boton--senal" id="cot-whatsapp" href="#" target="_blank" rel="noopener">Abrir en WhatsApp</a>
        <button class="boton boton--linea" type="button" id="cot-copiar">Copiar el mensaje</button>
      </div>
      <p class="cotizador__aviso" id="cot-aviso" role="status"></p>
    </div>
  </form>
  <noscript><p class="aviso-demo">El cotizador necesita JavaScript. Puedes escribirnos igual con los códigos de los servicios que te interesan.</p></noscript>
</section>`;
}

function portada() {
  const conDemo = SERVICIOS.filter((s) => s.demo).length;
  const instalan = SERVICIOS.filter((s) => s.instala).length;
  return `<section class="portada envoltura" aria-labelledby="portada-titulo">
  <div class="portada__texto">
    <h1 id="portada-titulo" class="display portada__titulo">Software, pantallas, cámaras y sensores para negocios en Panamá</h1>
    <p class="portada__bajada">Hacemos páginas web, apps, software a medida y automatizaciones. Y vamos a tu local a instalar lo que haga falta: el QR de cada mesa, la pantalla de la cocina, la cámara que cuenta a los clientes, el sensor de la nevera.</p>
    <p class="portada__acciones"><a class="boton boton--senal" href="#cotizar">Armar una cotización</a> <a class="portada__enlace" href="#laboratorio">o prueba las demos</a></p>
  </div>
  <nav class="tablero" aria-labelledby="tablero-titulo">
    <div class="tablero__cabeza">
      <h2 id="tablero-titulo" class="tablero__titulo">Los ${SERVICIOS.length} servicios</h2>
      <ul class="tablero__leyenda" aria-label="Leyenda"><li><span class="etiqueta tablero__muestra" aria-hidden="true">R01</span> tiene demo para probar (${conDemo})</li><li>${ICONO_INSTALA} se instala en tu local (${instalan})</li></ul>
    </div>
    ${SECTORES.map((sec) => {
      const lista = SERVICIOS.filter((s) => s.sectores[0] === sec.id);
      if (!lista.length) return '';
      return `<div class="tablero__grupo"><h3 class="tablero__sector">${esc(sec.nombre)}</h3><p class="tablero__items">${lista.map((s) => etiquetaServicio(s, '', (x) => `#${x.slug}`)).join(' ')}</p></div>`;
    }).join('\n    ')}
  </nav>
</section>`;
}

function paginaInicio() {
  const datosCliente = {
    servicios: SERVICIOS.map((s) => ({ id: s.id, slug: s.slug, nombre: s.nombre, precio: precioTexto(s), sectores: s.sectores, tipos: s.tipos, demo: Boolean(s.demo), instala: s.instala })),
    contacto: CONTACTO,
  };
  return documento({
    titulo: 'alphateklab · software, pantallas, cámaras y sensores para negocios',
    descripcion: `alphateklab hace páginas web, apps y software a medida, y va al local a instalar pantallas, cámaras con IA, sensores y QR por mesa. ${SERVICIOS.length} servicios para restaurantes, comercios, clínicas, hospedaje, bienes raíces e industria en Panamá.`,
    prefijo: '',
    canonica: 'https://jojomunoz.github.io/alphateklab/',
    cuerpo: `${cabecera('', 'inicio')}
<main id="contenido">
${portada()}
${seccionEmpezar()}
${seccionServicios()}
${seccionLaboratorio()}
${seccionComoTrabajamos()}
${seccionPreguntas()}
${seccionCotizar()}
</main>
${pie('')}`,
    scripts: `<script id="datos-catalogo" type="application/json">${jsonEnScript(datosCliente)}</script>
<script type="module" src="js/inicio.js"></script>`,
  });
}

function paginaServicio(s) {
  const prefijo = '../../';
  const relacionados = SERVICIOS.filter((x) => x.id !== s.id && x.sectores.some((y) => s.sectores.includes(y)) && x.tipos.some((y) => s.tipos.includes(y))).slice(0, 6);
  const demo = s.demo
    ? `<p><a class="boton boton--senal" href="${enlaceDemo(s.demo, prefijo)}">Probar la demo</a></p>`
    : '';
  return documento({
    titulo: `${s.nombre} · alphateklab`,
    descripcion: s.para,
    prefijo,
    canonica: `https://jojomunoz.github.io/alphateklab/servicios/${s.slug}/`,
    cuerpo: `${cabecera(prefijo, 'servicio')}
<main id="contenido" class="envoltura servicio">
  <nav class="migas" aria-label="Ruta"><a href="${prefijo}">alphateklab</a> <span aria-hidden="true">/</span> <a href="${prefijo}#servicios">servicios</a> <span aria-hidden="true">/</span> <span>${s.id}</span></nav>
  <div class="servicio__cabeza">
    <span class="${s.demo ? 'etiqueta' : 'etiqueta etiqueta--hueca'}">${s.id}</span>
    <h1 class="display servicio__titulo">${esc(s.nombre)}</h1>
    <p class="servicio__para">${esc(s.para)}</p>
    <p class="servicio__meta">Para ${s.sectores.map((x) => esc(nombreSector[x].toLowerCase())).join(', ')}. ${s.tipos.map((t) => esc(nombreTipo[t])).join(', ')}.</p>
  </div>
  <div class="servicio__cuerpo">
    <div>
      <h2>Incluye</h2>
      <ul>${s.incluye.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
    <div>
      <h2>${s.equipo.length ? (s.instala ? 'Equipo que se instala' : 'Equipo') : 'Equipo'}</h2>
      ${s.equipo.length ? `<ul>${s.equipo.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p>No necesita equipo en el local.</p>'}
      ${s.instala ? `<p class="ficha__instala">${ICONO_INSTALA}Lo instalamos nosotros en tu local.</p>` : ''}
      ${s.visita ? `<p class="ficha__instala">${ICONO_VISITA}Vamos nosotros a la propiedad con el equipo.</p>` : ''}
    </div>
    <div class="servicio__precio">
      <h2>Precio</h2>
      <p class="num servicio__cifra">${esc(precioTexto(s))}</p>
      ${s.precio?.nota ? `<p>${esc(s.precio.nota)}</p>` : '<p>Depende del local y del alcance: lo cerramos en la propuesta, después de la visita.</p>'}
      ${s.aparte ? `<p class="servicio__aparte"><strong>Aparte:</strong> ${esc(s.aparte)}</p>` : ''}
    </div>
  </div>
  <div class="servicio__acciones">
    ${demo}
    <p><a class="boton ${s.demo ? 'boton--linea' : 'boton--senal'}" href="${prefijo}?servicio=${s.id}#cotizar">Cotizar este servicio</a></p>
  </div>
  ${relacionados.length ? `<section class="servicio__relacionados" aria-labelledby="rel-titulo"><h2 id="rel-titulo">También para tu negocio</h2><p class="tablero__items">${relacionados.map((x) => etiquetaServicio(x, prefijo, (y) => `${prefijo}servicios/${y.slug}/`)).join(' ')}</p></section>` : ''}
</main>
${pie(prefijo)}`,
  });
}

function paginaPrivacidad() {
  const prefijo = '../';
  const contacto = CONTACTO.whatsapp ? `<p>Para cualquier consulta sobre tus datos, o para ejercer tus derechos de acceso, rectificación, cancelación, oposición y portabilidad, escríbenos por <a href="https://wa.me/${CONTACTO.whatsapp}">WhatsApp</a>${CONTACTO.correo ? ` o a <a href="mailto:${CONTACTO.correo}">${esc(CONTACTO.correo)}</a>` : ''}.</p>` : '';
  return documento({
    titulo: 'Privacidad · alphateklab',
    descripcion: 'Qué datos trata el sitio de alphateklab y sus demos, y cuáles no.',
    prefijo,
    canonica: `${URL_BASE}privacidad/`,
    cuerpo: `${cabecera(prefijo, 'privacidad')}
<main id="contenido" class="envoltura texto-largo">
  <nav class="migas" aria-label="Ruta"><a href="${prefijo}">alphateklab</a> <span aria-hidden="true">/</span> <span>privacidad</span></nav>
  <h1 class="display">Privacidad</h1>
  <p class="texto-largo__fecha">Vigente desde el ${esc(ACTUALIZADO.texto)}. Se rige por la Ley 81 de 2019 de protección de datos personales de Panamá y su reglamento, el Decreto Ejecutivo 285 de 2021.</p>
  <h2>Este sitio</h2>
  <p>No usa cookies, ni analítica, ni píxeles de redes sociales, ni formularios que envíen datos a un servidor.</p>
  <p>El cotizador arma el mensaje dentro de tu navegador. Solo sale de tu equipo si tú lo mandas por WhatsApp, y desde ahí rige la política de WhatsApp. Los servicios que marcas se guardan en tu navegador (almacenamiento local) para que no se pierdan al recargar; el botón «Vaciar la lista» los borra.</p>
  <h2>Las demos</h2>
  <p>Usan negocios inventados y guardan sus datos de ejemplo en tu navegador. Las de restaurante y de citas pueden mandar mensajes entre dos dispositivos (tu teléfono y tu computadora) a través de un servidor público de pruebas, ntfy.sh; por eso piden que no escribas datos reales.</p>
  <p>La demo de la cámara procesa el video dentro de tu navegador: ningún cuadro sale de tu equipo. Lo que sí se descarga es el modelo de detección, desde los servidores de quien lo publica.</p>
  <p>Las librerías de las demos se descargan de cdn.jsdelivr.net, que recibe la petición como cualquier sitio que visitas.</p>
  ${contacto}
</main>
${pie(prefijo)}`,
  });
}

function pagina404() {
  return documento({
    titulo: 'Página no encontrada · alphateklab',
    descripcion: 'Esta dirección no existe en el sitio de alphateklab.',
    prefijo: '/alphateklab/',
    canonica: URL_BASE,
    robots: 'noindex',
    cuerpo: `${cabecera('/alphateklab/', '404')}
<main id="contenido" class="envoltura texto-largo">
  <h1 class="display">Esa página no existe</h1>
  <p>Puede que el enlace esté mal copiado o que el servicio haya cambiado de nombre. Desde aquí puedes ir a la <a href="/alphateklab/#servicios">lista de servicios</a> o al <a href="/alphateklab/#laboratorio">laboratorio de demos</a>.</p>
</main>
${pie('/alphateklab/')}`,
  });
}

function sitemap() {
  const urls = ['', 'privacidad/', ...SERVICIOS.map((s) => `servicios/${s.slug}/`), ...DEMOS.filter((d) => !/^https?:/.test(d.url) && existe(d.url.replace(/\/?$/, '/') + 'index.html')).map((d) => d.url.replace(/\/?$/, '/'))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${URL_BASE}${u}</loc><lastmod>${ACTUALIZADO.iso}</lastmod></url>`).join('\n')}
</urlset>
`;
}

// ── escribir ──
writeFileSync(join(RAIZ, 'index.html'), paginaInicio());
const dirServicios = join(RAIZ, 'servicios');
if (existsSync(dirServicios)) {
  const vigentes = new Set(SERVICIOS.map((s) => s.slug));
  for (const d of readdirSync(dirServicios)) if (!vigentes.has(d)) rmSync(join(dirServicios, d), { recursive: true });
}
for (const s of SERVICIOS) {
  const dir = join(dirServicios, s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), paginaServicio(s));
}
mkdirSync(join(RAIZ, 'privacidad'), { recursive: true });
writeFileSync(join(RAIZ, 'privacidad', 'index.html'), paginaPrivacidad());
writeFileSync(join(RAIZ, '404.html'), pagina404());
writeFileSync(join(RAIZ, 'sitemap.xml'), sitemap());
writeFileSync(join(RAIZ, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${URL_BASE}sitemap.xml\n`);
console.log(`index.html, ${SERVICIOS.length} páginas de servicio, privacidad, 404, sitemap y robots generados.`);
