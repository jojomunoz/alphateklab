// Comportamiento común a todas las páginas: menú, buscador, «Pregúntanos» y la lista de la cotización.
import { prepararIndice, buscar, mensajePregunta } from './buscador.mjs';
import { enlaceWhatsApp } from './nucleo.mjs';
import { leerCotizacion, guardarCotizacion, alternarEnCotizacion, agregarVarios } from './cotizacion.mjs';

const RAIZ = document.documentElement.dataset.raiz || './';
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── menú con paneles ──
const grupos = [...document.querySelectorAll('.menu__grupo')];
function cerrarMenus(excepto) {
  for (const g of grupos) {
    const b = g.querySelector('.menu__boton');
    if (b === excepto) continue;
    b.setAttribute('aria-expanded', 'false');
    g.querySelector('.mega').hidden = true;
  }
}
for (const g of grupos) {
  const b = g.querySelector('.menu__boton');
  const panel = g.querySelector('.mega');
  b.addEventListener('click', () => {
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    cerrarMenus(b);
    b.setAttribute('aria-expanded', String(abrir));
    panel.hidden = !abrir;
  });
  // con mouse, se abre al pasar por encima (con una pequeña espera para no abrirlo al cruzar)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let t;
    g.addEventListener('mouseenter', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        cerrarMenus(b);
        b.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }, 120);
    });
    g.addEventListener('mouseleave', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        b.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }, 180);
    });
  }
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu__grupo')) cerrarMenus();
});

// menú del teléfono
const hamburguesa = document.querySelector('[data-hamburguesa]');
const menuMovil = document.getElementById('menu-movil');
hamburguesa?.addEventListener('click', () => {
  const abrir = hamburguesa.getAttribute('aria-expanded') !== 'true';
  hamburguesa.setAttribute('aria-expanded', String(abrir));
  hamburguesa.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
  menuMovil.hidden = !abrir;
  document.body.classList.toggle('menu-abierto', abrir);
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

const ETIQUETA = { servicio: 'Servicio', solucion: 'Para tu negocio', demo: 'Demo' };
const SUGERENCIAS = ['pedir desde la mesa', 'contar clientes', 'recordar citas', 'página web', 'inventario', 'cámaras de seguridad', 'recorrido 3D', 'chatbot de WhatsApp', 'factura electrónica', 'app para mi negocio'];
const url = (u) => (/^https?:/.test(u) ? u : RAIZ + u);
const contacto = () => document.documentElement.dataset.whatsapp || null;

function itemResultado(r, i) {
  const li = document.createElement('li');
  li.setAttribute('role', 'option');
  li.id = `res-${r.id}-${i}`;
  li.className = 'resultado';
  li.innerHTML = `<a href="${url(r.url)}"><svg class="ico" aria-hidden="true"><use href="#i-${r.icono}"></use></svg><span class="resultado__texto"><strong></strong><small></small></span><span class="resultado__tipo"></span></a>`;
  li.querySelector('strong').textContent = r.titulo;
  li.querySelector('small').textContent = r.resumen;
  li.querySelector('.resultado__tipo').textContent = r.tipo === 'servicio' ? (r.precio ? r.precio : r.etiqueta) : ETIQUETA[r.tipo];
  return li;
}

function bloqueVacio(consulta) {
  const div = document.createElement('div');
  div.className = 'sin-resultados';
  const enlaceWa = enlaceWhatsApp(mensajePregunta(consulta), contacto());
  div.innerHTML = `<p class="sin-resultados__titulo">No encontramos «<span></span>» en la lista.</p><p>Igual puede que lo hagamos: si se resuelve con tecnología, probablemente sí. Pregúntanos tal como lo escribiste.</p><p class="sin-resultados__acciones"><a class="boton boton--senal" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-whatsapp-logo"></use></svg>Preguntar por WhatsApp</a><a class="boton boton--linea">Escribir más detalles</a></p>`;
  div.querySelector('span').textContent = consulta;
  const [wa, mas] = div.querySelectorAll('a');
  wa.href = enlaceWa;
  mas.href = `${RAIZ}cotizar/?q=${encodeURIComponent(consulta)}`;
  return div;
}

// Conecta un campo de búsqueda con su lista de resultados (sirve para el diálogo y para el de la portada).
function conectarBusqueda({ campo, lista, vacio, sugerencias, alElegir }) {
  let activo = -1;
  let ultimo = '';
  const items = () => [...lista.querySelectorAll('[role="option"]')];
  function marcar(i) {
    const xs = items();
    activo = xs.length ? (i + xs.length) % xs.length : -1;
    xs.forEach((x, j) => x.setAttribute('aria-selected', String(j === activo)));
    if (activo >= 0) {
      campo.setAttribute('aria-activedescendant', xs[activo].id);
      xs[activo].scrollIntoView({ block: 'nearest' });
    } else campo.removeAttribute('aria-activedescendant');
  }
  async function actualizar() {
    const q = campo.value.trim();
    ultimo = q;
    if (!q) {
      lista.replaceChildren();
      if (vacio) vacio.hidden = true;
      if (sugerencias) sugerencias.hidden = false;
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
        vacio.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'No se pudo cargar el buscador. Revisa tu conexión o usa la lista de servicios.' }));
      }
      return;
    }
    if (q !== ultimo) return;
    const res = buscar(idx, q, { limite: 8 });
    lista.replaceChildren(...res.map(itemResultado));
    if (sugerencias) sugerencias.hidden = true;
    if (vacio) {
      vacio.hidden = res.length > 0;
      vacio.replaceChildren(...(res.length ? [] : [bloqueVacio(q)]));
    }
    campo.setAttribute('aria-expanded', String(res.length > 0));
    marcar(res.length ? 0 : -1);
  }
  campo.addEventListener('input', actualizar);
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); marcar(activo + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); marcar(activo - 1); }
    else if (e.key === 'Enter') {
      const a = items()[activo]?.querySelector('a');
      if (a) { e.preventDefault(); alElegir?.(); location.href = a.href; }
    }
  });
  return { actualizar };
}

const dialogo = document.querySelector('[data-buscador]');
const campoDialogo = document.getElementById('buscador-campo');
const sugerenciasDialogo = dialogo?.querySelector('[data-buscador-sugerencias]');
if (dialogo) {
  sugerenciasDialogo.innerHTML = `<p class="buscador__ayuda">Escribe con tus palabras. Por ejemplo:</p><ul class="chips">${SUGERENCIAS.map((s) => `<li><button type="button" class="chip">${s}</button></li>`).join('')}</ul>`;
  const busqueda = conectarBusqueda({ campo: campoDialogo, lista: document.getElementById('buscador-resultados'), vacio: dialogo.querySelector('[data-buscador-vacio]'), sugerencias: sugerenciasDialogo, alElegir: () => dialogo.close() });
  sugerenciasDialogo.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    campoDialogo.value = b.textContent;
    busqueda.actualizar();
    campoDialogo.focus();
  });
  const abrir = (texto = '') => {
    cerrarMenus();
    if (!dialogo.open) dialogo.showModal();
    campoDialogo.value = texto;
    busqueda.actualizar();
    campoDialogo.focus();
    cargarIndice().catch(() => {});
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-abrir-buscador]')) {
      e.preventDefault();
      if (!menuMovil.hidden) hamburguesa.click();
      abrir();
    }
    if (e.target.closest('[data-cerrar-buscador]')) dialogo.close();
  });
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) dialogo.close(); // clic en el fondo
  });
  // En un campo de búsqueda, Escape solo borra el texto; aquí cierra el buscador a la primera.
  campoDialogo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dialogo.close();
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
  const caja = document.getElementById('heroe-resultados');
  const lista = Object.assign(document.createElement('ul'), { className: 'buscador__resultados', role: 'listbox', id: 'heroe-lista' });
  lista.setAttribute('role', 'listbox');
  const vacio = document.createElement('div');
  caja.append(lista, vacio);
  const b = conectarBusqueda({ campo, lista, vacio });
  campo.setAttribute('aria-controls', 'heroe-lista');
  const mostrar = () => { caja.hidden = !campo.value.trim(); };
  campo.addEventListener('input', mostrar);
  campo.addEventListener('focus', () => { cargarIndice().catch(() => {}); mostrar(); });
  document.addEventListener('click', (e) => { if (!formHeroe.contains(e.target)) caja.hidden = true; });
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
    else b.textContent = en ? 'En la cotización' : 'Agregar a la cotización';
  }
  const cuenta = document.querySelector('[data-cuenta-cotizacion]');
  if (cuenta) {
    cuenta.hidden = elegidos.length === 0;
    cuenta.textContent = elegidos.length;
    cuenta.setAttribute('aria-label', `${elegidos.length} servicios en la cotización`);
  }
}
document.addEventListener('click', (e) => {
  const varios = e.target.closest('[data-cotizar-varios]');
  if (varios) {
    const n = agregarVarios(varios.dataset.cotizarVarios.split(' '));
    pintarCotizacion();
    varios.textContent = n ? `Agregado (${n} nuevos). Ver la cotización` : 'Ya estaban en la cotización. Ver la cotización';
    varios.onclick = () => (location.href = `${RAIZ}cotizar/`);
    return;
  }
  const b = e.target.closest('[data-cotizar]');
  if (!b) return;
  alternarEnCotizacion(b.dataset.cotizar);
  pintarCotizacion();
});
window.addEventListener('storage', pintarCotizacion);
pintarCotizacion();

export { guardarCotizacion, reducir };
