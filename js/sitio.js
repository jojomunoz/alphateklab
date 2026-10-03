// Comportamiento común a todas las páginas: menú, buscador, «Pregúntanos» y la lista de la cotización.
import { prepararIndice, buscar, mensajePregunta, resaltar } from './buscador.mjs';
import { enlaceWhatsApp } from './nucleo.mjs';
import { leerCotizacion, guardarCotizacion, alternarEnCotizacion, agregarVarios } from './cotizacion.mjs';

const RAIZ = document.documentElement.dataset.raiz || './';
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── menú con paneles ──
const grupos = [...document.querySelectorAll('.menu__grupo')];
// Espera de abrir o cerrar al pasar el ratón, por grupo. Un clic o Escape la cancelan: si no, un clic seguido de
// Escape en menos de 120 ms dejaba que la espera volviera a abrir el panel.
const esperas = new WeakMap();
const cancelarEspera = (g) => clearTimeout(esperas.get(g));
function cerrarMenus(excepto) {
  for (const g of grupos) {
    const b = g.querySelector('.menu__boton');
    if (b === excepto) continue;
    cancelarEspera(g);
    const panel = g.querySelector('.mega');
    // si en su lugar se abre otro panel, este se va sin salida para que los dos no se crucen
    panel.classList.toggle('mega--sin-salida', Boolean(excepto));
    b.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    g.dataset.abierto = '';
  }
}
for (const g of grupos) {
  const b = g.querySelector('.menu__boton');
  const panel = g.querySelector('.mega');
  b.addEventListener('click', () => {
    cancelarEspera(g);
    const abierto = b.getAttribute('aria-expanded') === 'true';
    // Abierto por pasar el ratón: el clic lo deja fijo (lo que la persona quería era abrirlo), no lo cierra.
    if (abierto && g.dataset.abierto === 'hover') {
      g.dataset.abierto = 'clic';
      return;
    }
    const habiaOtro = grupos.some((x) => x !== g && x.querySelector('.menu__boton').getAttribute('aria-expanded') === 'true');
    cerrarMenus(b);
    b.setAttribute('aria-expanded', String(!abierto));
    panel.classList.toggle('mega--directo', habiaOtro); // de un panel a otro, sin repetir la entrada
    panel.classList.remove('mega--sin-salida');
    panel.hidden = abierto;
    g.dataset.abierto = abierto ? '' : 'clic';
  });
  // con mouse, se abre al pasar por encima (con una pequeña espera para no abrirlo al cruzar)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    g.addEventListener('mouseenter', () => {
      cancelarEspera(g);
      esperas.set(g, setTimeout(() => {
        if (b.getAttribute('aria-expanded') === 'true') return;
        panel.classList.toggle('mega--directo', grupos.some((x) => x !== g && x.querySelector('.menu__boton').getAttribute('aria-expanded') === 'true'));
        cerrarMenus(b);
        b.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        g.dataset.abierto = 'hover';
      }, 120));
    });
    g.addEventListener('mouseleave', () => {
      cancelarEspera(g);
      esperas.set(g, setTimeout(() => {
        if (g.dataset.abierto === 'clic') return; // fijado con clic: se cierra con Escape, con clic fuera o al salir con Tab
        b.setAttribute('aria-expanded', 'false');
        panel.classList.remove('mega--sin-salida');
        panel.hidden = true;
        g.dataset.abierto = '';
      }, 180));
    });
  }
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu__grupo')) cerrarMenus();
});
for (const g of grupos) {
  g.addEventListener('focusout', (e) => {
    if (!g.contains(e.relatedTarget)) {
      g.querySelector('.menu__boton').setAttribute('aria-expanded', 'false');
      g.querySelector('.mega').classList.remove('mega--sin-salida');
      g.querySelector('.mega').hidden = true;
    }
  });
  g.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && g.querySelector('.menu__boton').getAttribute('aria-expanded') === 'true') {
      e.stopPropagation();
      cancelarEspera(g);
      cerrarMenus();
      g.querySelector('.menu__boton').focus();
    }
  });
}

// menú del teléfono
const hamburguesa = document.querySelector('[data-hamburguesa]');
const menuMovil = document.getElementById('menu-movil');
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburguesa?.getAttribute('aria-expanded') === 'true') {
    hamburguesa.click();
    hamburguesa.focus();
  }
});
hamburguesa?.addEventListener('click', () => {
  const abrir = hamburguesa.getAttribute('aria-expanded') !== 'true';
  hamburguesa.setAttribute('aria-expanded', String(abrir));
  hamburguesa.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
  menuMovil.hidden = !abrir;
  document.body.classList.toggle('menu-abierto', abrir);
  // con el menú abierto, la página de atrás no recibe el foco del teclado ni los toques
  for (const el of document.querySelectorAll('main, footer')) el.inert = abrir;
});
// un enlace del menú (también los que van a una sección de la misma página) lo cierra
menuMovil?.addEventListener('click', (e) => {
  if (e.target.closest('a') && hamburguesa.getAttribute('aria-expanded') === 'true') hamburguesa.click();
});

// ── buscador ──
let indice = null;
async function cargarIndice() {
  if (indice) return indice;
  const r = await fetch(`${RAIZ}assets/indice.json`);
  if (!r.ok) throw new Error(`índice ${r.status}`);
  indice = prepararIndice(await r.json());
  return indice;
}

const ETIQUETA = { servicio: 'Servicio', solucion: 'Para tu negocio', demo: 'Demo', guia: 'Guía' };
const SUGERENCIAS = ['pedir desde la mesa', 'contar clientes', 'recordar citas', 'página web', 'inventario', 'cámaras de seguridad', 'recorrido 3D', 'chatbot de WhatsApp', 'factura electrónica', 'app para mi negocio'];
const url = (u) => (/^https?:/.test(u) ? u : RAIZ + u);
const contacto = () => document.documentElement.dataset.whatsapp || null;

// Pinta un texto con lo que coincide con la búsqueda dentro de <mark>, sin pasar por innerHTML.
function pintarResaltado(el, texto, consulta) {
  el.replaceChildren(...resaltar(texto, consulta).map(({ t, m }) => (m ? Object.assign(document.createElement('mark'), { textContent: t }) : document.createTextNode(t))));
}

function itemResultado(r, i, consulta = '') {
  const li = document.createElement('li');
  li.setAttribute('role', 'option');
  li.setAttribute('aria-selected', 'false');
  li.id = `res-${r.id}-${i}`;
  li.className = 'resultado';
  li.dataset.url = url(r.url);
  li.innerHTML = `<div class="resultado__fila"><svg class="ico" aria-hidden="true"><use href="#i-${r.icono}"></use></svg><span class="resultado__texto"><strong></strong><small></small></span><span class="resultado__tipo"></span></div>`;
  pintarResaltado(li.querySelector('strong'), r.titulo, consulta);
  pintarResaltado(li.querySelector('small'), r.resumen, consulta);
  li.querySelector('.resultado__tipo').textContent = r.tipo === 'servicio' ? (r.precio ? r.precio : r.etiqueta) : ETIQUETA[r.tipo];
  return li;
}

// Al final de toda lista, la salida para preguntar: lo que hay puede no ser lo que se busca.
function itemPreguntar(consulta, i) {
  const li = document.createElement('li');
  li.setAttribute('role', 'option');
  li.setAttribute('aria-selected', 'false');
  li.id = `res-preguntar-${i}`;
  li.className = 'resultado resultado--preguntar';
  li.dataset.url = `${RAIZ}cotizar/?q=${encodeURIComponent(consulta)}`;
  li.innerHTML = `<div class="resultado__fila"><svg class="ico" aria-hidden="true"><use href="#i-chat-circle-dots"></use></svg><span class="resultado__texto"><strong></strong><small>Te respondemos si lo podemos hacer.</small></span></div>`;
  li.querySelector('strong').textContent = `¿No es esto? Pregúntanos por «${consulta}»`;
  return li;
}

// Sin resultados con la frase entera: lo más parecido por cada palabra suelta, para que la persona vea qué hay cerca.
function parecidos(consulta) {
  if (!indice) return [];
  const vistos = new Set();
  const salida = [];
  for (const palabra of consulta.split(/\s+/).filter((x) => x.length > 3)) {
    for (const r of buscar(indice, palabra, { limite: 2 })) {
      if (r.tipo !== 'servicio' || vistos.has(r.id)) continue;
      vistos.add(r.id);
      salida.push(r);
    }
  }
  return salida.slice(0, 3);
}

function bloqueVacio(consulta) {
  const div = document.createElement('div');
  div.className = 'sin-resultados';
  const enlaceWa = enlaceWhatsApp(mensajePregunta(consulta), contacto());
  div.innerHTML = `<p class="sin-resultados__titulo">No encontramos «<span></span>» en la lista.</p><p>Puede que igual lo hagamos: la lista es lo que ya tenemos descrito, no todo lo que podemos hacer. Pregúntanos tal como lo escribiste.</p><p class="sin-resultados__acciones"><a class="boton boton--senal" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-whatsapp-logo"></use></svg>Preguntar por WhatsApp</a><a class="boton boton--linea">Escribir más detalles</a></p>`;
  div.querySelector('span').textContent = consulta;
  const [wa, mas] = div.querySelectorAll('a');
  wa.href = enlaceWa;
  mas.href = `${RAIZ}cotizar/?q=${encodeURIComponent(consulta)}`;
  const cerca = parecidos(consulta);
  if (cerca.length) {
    const p = Object.assign(document.createElement('p'), { className: 'sin-resultados__cerca' });
    p.append('Lo más parecido que hacemos: ');
    cerca.forEach((r, i) => {
      if (i) p.append(', ');
      p.append(Object.assign(document.createElement('a'), { href: url(r.url), textContent: r.titulo }));
    });
    p.append('.');
    div.append(p);
  }
  return div;
}

// Conecta un campo de búsqueda con su lista de resultados (sirve para el diálogo y para el de la portada).
// Sin opción marcada, Enter lleva a la lista completa (si hubo resultados) o a preguntar (si no).
function conectarBusqueda({ campo, lista, vacio, sugerencias, estado, alElegir }) {
  let activo = -1;
  let ultimo = '';
  let hubo = 0;
  let esperaVacio;
  const items = () => [...lista.querySelectorAll('[role="option"]')];
  function marcar(i) {
    const xs = items();
    activo = xs.length && i >= 0 ? i % xs.length : xs.length && i < -1 ? xs.length - 1 : -1;
    xs.forEach((x, j) => x.setAttribute('aria-selected', String(j === activo)));
    if (activo >= 0) {
      campo.setAttribute('aria-activedescendant', xs[activo].id);
      xs[activo].scrollIntoView({ block: 'nearest' });
    } else campo.removeAttribute('aria-activedescendant');
  }
  function ir(u) {
    alElegir?.();
    location.href = u;
  }
  lista.addEventListener('click', (e) => {
    const li = e.target.closest('[role="option"]');
    if (li) ir(li.dataset.url);
  });
  // El foco se queda en el campo al hacer clic en un resultado (si no, el desplegable se cierra antes del clic).
  lista.addEventListener('mousedown', (e) => e.preventDefault());
  // Con el ratón, la fila bajo el puntero es la elegida: un solo resaltado, el mismo que usan las flechas.
  lista.addEventListener('mousemove', (e) => {
    const li = e.target.closest('[role="option"]');
    if (!li) return;
    const i = items().indexOf(li);
    if (i !== activo) marcar(i);
  });
  async function actualizar() {
    const q = campo.value.trim();
    ultimo = q;
    if (!q) {
      lista.replaceChildren();
      hubo = 0;
      if (vacio) vacio.hidden = true;
      if (sugerencias) sugerencias.hidden = false;
      if (estado) estado.textContent = '';
      campo.setAttribute('aria-expanded', 'false');
      marcar(-1);
      return;
    }
    let idx;
    try {
      idx = await cargarIndice();
    } catch {
      if (vacio) {
        vacio.hidden = false;
        const bloque = bloqueVacio(q);
        bloque.querySelector('.sin-resultados__titulo').textContent = 'No se pudo cargar el buscador.';
        bloque.querySelector('.sin-resultados__titulo + p').textContent = 'Revisa tu conexión, usa la lista de servicios o pregúntanos tal como lo escribiste.';
        vacio.replaceChildren(bloque);
      }
      return;
    }
    if (q !== ultimo) return;
    // Mientras se escribe, la última palabra cuenta como comienzo de palabra («cam» encuentra cámaras).
    const res = buscar(idx, q, { limite: 8, prefijo: true });
    hubo = res.length;
    clearTimeout(esperaVacio);
    lista.replaceChildren(...res.map((r, i) => itemResultado(r, i, q)), ...(res.length ? [itemPreguntar(q, res.length)] : []));
    campo.setAttribute('aria-expanded', String(res.length > 0));
    marcar(-1);
    if (res.length) {
      if (sugerencias) sugerencias.hidden = true;
      if (vacio) { vacio.hidden = true; vacio.replaceChildren(); }
      if (estado) estado.textContent = `${res.length} ${res.length === 1 ? 'resultado' : 'resultados'}. Usa las flechas para elegir.`;
      return;
    }
    // Sin resultados: no se dice «No encontramos» a media palabra. Con menos de 3 letras siguen las sugerencias;
    // con 3 o más, el aviso sale tras 300 ms sin teclear.
    if (vacio) { vacio.hidden = true; vacio.replaceChildren(); }
    if (q.replace(/\s/g, '').length < 3) {
      if (sugerencias) sugerencias.hidden = false;
      return;
    }
    esperaVacio = setTimeout(() => {
      if (campo.value.trim() !== q) return;
      if (sugerencias) sugerencias.hidden = true;
      if (vacio) { vacio.hidden = false; vacio.replaceChildren(bloqueVacio(q)); }
      if (estado) estado.textContent = `Sin resultados para «${q}». Puedes preguntarnos.`;
    }, 300);
  }
  // Enter (o «Buscar») sin una opción elegida: la lista completa si hubo resultados, preguntar si no.
  async function enviar() {
    const q = campo.value.trim();
    if (!q) return;
    const li = items()[activo];
    if (li) return ir(li.dataset.url);
    if (q !== ultimo) await actualizar();
    ir(hubo ? `${RAIZ}servicios/?q=${encodeURIComponent(q)}` : `${RAIZ}cotizar/?q=${encodeURIComponent(q)}`);
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); marcar(activo + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); marcar(activo < 0 ? -2 : activo - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      enviar();
    }
  });
  return { actualizar, enviar };
}

let abrirBuscador = null; // la usa el buscador de la portada en el teléfono
const dialogo = document.querySelector('[data-buscador]');
const campoDialogo = document.getElementById('buscador-campo');
const sugerenciasDialogo = dialogo?.querySelector('[data-buscador-sugerencias]');
if (dialogo) {
  sugerenciasDialogo.innerHTML = `<p class="buscador__ayuda">Escribe con tus palabras. Por ejemplo:</p><ul class="chips">${SUGERENCIAS.map((s) => `<li><button type="button" class="chip">${s}</button></li>`).join('')}</ul>`;
  dialogo.querySelector('[data-buscador-form]').addEventListener('submit', (e) => e.preventDefault());
  const busqueda = conectarBusqueda({ campo: campoDialogo, lista: document.getElementById('buscador-resultados'), vacio: dialogo.querySelector('[data-buscador-vacio]'), sugerencias: sugerenciasDialogo, estado: dialogo.querySelector('[data-buscador-estado]'), alElegir: () => cerrarDialogo() });
  sugerenciasDialogo.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    campoDialogo.value = b.textContent;
    busqueda.actualizar();
    campoDialogo.focus();
  });
  dialogo.addEventListener('close', () => document.documentElement.classList.remove('sin-desplazar'));
  let abridor = null; // lo que tenía el foco antes de abrir: al cerrar, el foco vuelve ahí
  function cerrarDialogo() {
    dialogo.close();
    document.documentElement.classList.remove('sin-desplazar');
    // Sin esto, el foco puede quedarse un cuadro en el campo ya oculto y una «/» rápida caería ahí.
    if (dialogo.contains(document.activeElement)) {
      if (abridor?.isConnected && abridor !== document.body) abridor.focus();
      else document.activeElement.blur();
    }
  }
  const abrir = (texto = '') => {
    cerrarMenus();
    if (!dialogo.open) {
      abridor = document.activeElement;
      dialogo.showModal();
      document.documentElement.classList.add('sin-desplazar');
    }
    campoDialogo.value = texto;
    busqueda.actualizar();
    campoDialogo.focus();
    cargarIndice().catch(() => {});
  };
  abrirBuscador = abrir;
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-abrir-buscador]')) {
      e.preventDefault();
      if (!menuMovil.hidden) hamburguesa.click();
      abrir();
    }
    if (e.target.closest('[data-cerrar-buscador]')) cerrarDialogo();
  });
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) cerrarDialogo(); // clic en el fondo
  });
  // En un campo de búsqueda, Escape solo borra el texto; aquí cierra el buscador a la primera.
  campoDialogo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cerrarDialogo();
    }
  });
  document.addEventListener('keydown', (e) => {
    const escribiendo = /input|textarea|select/i.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.key === '/' && !escribiendo) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      abrir();
    }
    if (e.key === 'Escape') cerrarMenus();
  });
}

// búsqueda en la portada, con resultados debajo del campo
const formHeroe = document.querySelector('[data-buscar-en-linea]');
if (formHeroe) {
  const campo = formHeroe.querySelector('input');
  if (matchMedia('(max-width: 480px)').matches) campo.placeholder = 'Ej.: menú QR, cámaras…';
  const caja = document.getElementById('heroe-resultados');
  const lista = Object.assign(document.createElement('ul'), { className: 'buscador__resultados', role: 'listbox', id: 'heroe-lista' });
  lista.setAttribute('role', 'listbox');
  const vacio = document.createElement('div');
  caja.append(lista, vacio);
  const estadoHeroe = Object.assign(document.createElement('p'), { className: 'sr' });
  estadoHeroe.setAttribute('role', 'status');
  formHeroe.append(estadoHeroe);
  const b = conectarBusqueda({ campo, lista, vacio, estado: estadoHeroe });
  campo.setAttribute('aria-controls', 'heroe-lista');
  // el desplegable cabe en lo que queda de pantalla bajo el campo: así la fila «Pregúntanos» (fija abajo) se ve siempre
  const mostrar = () => {
    caja.hidden = !campo.value.trim();
    if (!caja.hidden) caja.style.maxHeight = `${Math.max(180, Math.min(416, innerHeight - formHeroe.getBoundingClientRect().bottom - 24))}px`;
  };
  campo.addEventListener('input', mostrar);
  // En el teléfono, el desplegable bajo el campo quedaba debajo del teclado: se abre el diálogo de la lupa, que pone
  // el campo arriba y los resultados entre el campo y el teclado (revisión del 3-oct).
  const enTelefono = matchMedia('(max-width: 640px) and (pointer: coarse)');
  campo.addEventListener('focus', () => {
    if (enTelefono.matches && abrirBuscador) {
      campo.blur();
      abrirBuscador(campo.value);
      return;
    }
    cargarIndice().catch(() => {});
    mostrar();
  });
  document.addEventListener('click', (e) => { if (!formHeroe.contains(e.target)) caja.hidden = true; });
  formHeroe.addEventListener('focusout', (e) => { if (!formHeroe.contains(e.relatedTarget)) caja.hidden = true; });
  formHeroe.addEventListener('submit', (e) => {
    e.preventDefault();
    b.enviar();
  });
  campo.addEventListener('keydown', (e) => { if (e.key === 'Escape') caja.hidden = true; });
  for (const chip of document.querySelectorAll('[data-buscar]')) {
    chip.addEventListener('click', async () => {
      campo.value = chip.dataset.buscar;
      await b.actualizar();
      mostrar();
      campo.focus();
    });
  }
}

if ('requestIdleCallback' in window) requestIdleCallback(() => cargarIndice().catch(() => {}), { timeout: 4000 });
else setTimeout(() => cargarIndice().catch(() => {}), 2000);

// mientras el héroe de la portada está a la vista, un solo botón ámbar: «Pregúntanos» de la cabecera va con contorno
const heroePortada = document.querySelector('.heroe--portada');
const cabeceraEl = document.querySelector('[data-cabecera]');
if (heroePortada && cabeceraEl && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => cabeceraEl.classList.toggle('cabecera--sobre-heroe', e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(heroePortada);
}

// ── el producto en movimiento (portada): los dos videos van juntos, se pausan con un botón y fuera de la vista,
// y con «reducir movimiento» no arrancan (queda la imagen fija) ──
const figuraVideo = document.querySelector('[data-producto-video]');
if (figuraVideo) {
  const videos = [...figuraVideo.querySelectorAll('[data-video-producto]')];
  const boton = figuraVideo.querySelector('[data-pausa-video]');
  let pausadoPorPersona = reducir;
  const visibles = () => videos.filter((v) => v.offsetParent !== null);
  const reproducir = () => {
    if (pausadoPorPersona) return;
    const vs = visibles();
    vs.forEach((v) => { v.currentTime = 0; });
    vs.forEach((v) => v.play().catch(() => {}));
  };
  const pausar = () => videos.forEach((v) => v.pause());
  // que el salón no se desfase del teléfono
  videos[1]?.addEventListener('timeupdate', () => {
    const [a, b] = videos;
    if (b && b.offsetParent && Math.abs(a.currentTime - b.currentTime) > 0.25) b.currentTime = a.currentTime;
  });
  // nombre fijo («Pausar la demo») y el estado en aria-pressed: cambiar el texto y además marcar «presionado» hacía
  // que un lector de pantalla dijera «Reproducir, presionado»
  const pintarBoton = () => boton.setAttribute('aria-pressed', String(pausadoPorPersona));
  boton.addEventListener('click', () => {
    pausadoPorPersona = !pausadoPorPersona;
    if (pausadoPorPersona) pausar();
    else visibles().forEach((v) => v.play().catch(() => {}));
    pintarBoton();
  });
  pintarBoton();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? reproducir() : pausar()), { threshold: 0.25 }).observe(figuraVideo);
  } else reproducir();
}

// ── «Pregúntanos» rápido (banda al final de las páginas) ──
for (const form of document.querySelectorAll('[data-pregunta-rapida]')) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = form.querySelector('textarea').value.trim();
    if (!texto) {
      form.querySelector('textarea').focus();
      return;
    }
    window.open(enlaceWhatsApp(mensajePregunta(texto), contacto()), '_blank', 'noopener');
  });
}

// ── lista de la cotización (los botones «Agregar» de todas las páginas) ──
function pintarCotizacion() {
  const { elegidos } = leerCotizacion();
  for (const b of document.querySelectorAll('[data-cotizar]')) {
    const en = elegidos.includes(b.dataset.cotizar);
    b.setAttribute('aria-pressed', String(en));
    if (b.classList.contains('boton-chico')) b.textContent = en ? 'Agregado' : 'Agregar';
    else b.textContent = en ? 'En mi lista' : 'Agregar a mi lista';
  }
  const cuenta = document.querySelector('[data-cuenta-cotizacion]');
  if (cuenta) {
    cuenta.hidden = elegidos.length === 0;
    cuenta.textContent = elegidos.length;
    cuenta.setAttribute('aria-label', `${elegidos.length} servicios en tu lista`);
  }
}
document.addEventListener('click', (e) => {
  const varios = e.target.closest('[data-cotizar-varios]');
  if (varios) {
    const n = agregarVarios(varios.dataset.cotizarVarios.split(' '));
    pintarCotizacion();
    varios.textContent = n ? `Agregado${n > 1 ? `s (${n})` : ''}. Ver mi lista` : 'Ya estaban en tu lista. Ver mi lista';
    varios.onclick = () => (location.href = `${RAIZ}cotizar/`);
    return;
  }
  const b = e.target.closest('[data-cotizar]');
  if (!b) return;
  alternarEnCotizacion(b.dataset.cotizar);
  pintarCotizacion();
  // junto al botón grande de la ficha, una línea que dice dónde quedó y cuántos van
  {
    const { elegidos } = leerCotizacion();
    let nota = b.parentElement.querySelector('.nota-lista');
    if (!nota) {
      nota = Object.assign(document.createElement('span'), { className: 'nota-lista' });
      nota.setAttribute('role', 'status');
      b.after(nota);
    }
    nota.replaceChildren(elegidos.includes(b.dataset.cotizar) ? `En tu lista (${elegidos.length}) · ` : 'Quitado de tu lista · ', Object.assign(document.createElement('a'), { href: `${RAIZ}cotizar/`, textContent: 'Ver lista' }));
  }
});
window.addEventListener('storage', pintarCotizacion);
pintarCotizacion();

export { guardarCotizacion, reducir };
