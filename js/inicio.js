// Portada: filtros del catálogo y cotizador. El contenido ya viene en el HTML; esto solo lo filtra y arma el mensaje.
import { coincide, filtroDesdeParams, paramsDesdeFiltro, armarMensaje, enlaceWhatsApp, alternar, elegidosValidos } from './nucleo.mjs';

const datos = JSON.parse(document.getElementById('datos-catalogo').textContent);
const SERVICIOS = datos.servicios;
const porId = new Map(SERVICIOS.map((s) => [s.id, s]));
const CLAVE = 'atk-cotizacion-v1';

const leer = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || 'null') || {};
  } catch {
    return {};
  }
};
const guardar = (estado) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* sin almacenamiento: la cotización vive solo en esta visita */
  }
};

// ── filtros ──
const form = document.getElementById('filtros');
const cuenta = document.getElementById('filtros-cuenta');
const vacio = document.getElementById('catalogo-vacio');
const fichas = [...document.querySelectorAll('.ficha')];
const grupos = [...document.querySelectorAll('.grupo')];

function filtroActual() {
  const fd = new FormData(form);
  return { sector: fd.get('sector') || '', tipo: fd.get('tipo') || '', demo: fd.get('demo') === '1', instala: fd.get('instala') === '1' };
}

function aplicarFiltro(f, { actualizarUrl = true } = {}) {
  let visibles = 0;
  for (const el of fichas) {
    const s = porId.get(el.querySelector('[data-cotizar]').dataset.cotizar);
    const ok = coincide(s, f);
    el.hidden = !ok;
    if (ok) visibles++;
  }
  for (const g of grupos) g.hidden = !g.querySelector('.ficha:not([hidden])');
  cuenta.textContent = `Mostrando ${visibles} de ${SERVICIOS.length}`;
  vacio.hidden = visibles > 0;
  if (actualizarUrl) {
    const p = paramsDesdeFiltro(f);
    const servicio = new URLSearchParams(location.search).get('servicio');
    if (servicio) p.set('servicio', servicio);
    const q = p.toString();
    history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}${location.hash}`);
  }
}

function ponerFiltroEnForm(f) {
  for (const r of form.querySelectorAll('input[name="sector"]')) r.checked = r.value === f.sector;
  form.elements.tipo.value = f.tipo;
  form.elements.demo.checked = f.demo;
  form.elements.instala.checked = f.instala;
}

form.addEventListener('change', () => aplicarFiltro(filtroActual()));
form.addEventListener('submit', (e) => e.preventDefault());
document.getElementById('limpiar-filtros').addEventListener('click', () => {
  const f = { sector: '', tipo: '', demo: false, instala: false };
  ponerFiltroEnForm(f);
  aplicarFiltro(f);
});

// Si alguien salta a un servicio oculto por el filtro (desde el tablero), se quitan los filtros para que lo vea.
function mostrarDestino() {
  const id = decodeURIComponent(location.hash.slice(1));
  const destino = id ? document.getElementById(id) : null;
  if (destino?.classList.contains('ficha') && destino.hidden) {
    const f = { sector: '', tipo: '', demo: false, instala: false };
    ponerFiltroEnForm(f);
    aplicarFiltro(f);
    destino.scrollIntoView();
  }
}
window.addEventListener('hashchange', mostrarDestino);

const inicial = filtroDesdeParams(new URLSearchParams(location.search));
ponerFiltroEnForm(inicial);
aplicarFiltro(inicial, { actualizarUrl: false });
mostrarDestino();

// ── cotizador ──
const estado = leer();
let elegidos = elegidosValidos(estado.elegidos, SERVICIOS);
const pedido = new URLSearchParams(location.search).get('servicio');
if (pedido && porId.has(pedido) && !elegidos.includes(pedido)) elegidos.push(pedido);

const campos = {
  negocio: document.getElementById('cot-negocio'),
  tipo: document.getElementById('cot-tipo'),
  lugar: document.getElementById('cot-lugar'),
  notas: document.getElementById('cot-notas'),
};
for (const [k, el] of Object.entries(campos)) if (typeof estado[k] === 'string') el.value = estado[k];

const ul = document.getElementById('cot-elegidos');
const cuentaCot = document.getElementById('cot-cuenta');
const vacioCot = document.getElementById('cot-vacio');
const mensaje = document.getElementById('cot-mensaje');
const btnWa = document.getElementById('cot-whatsapp');
const aviso = document.getElementById('cot-aviso');
const selAgregar = document.getElementById('cot-agregar');

if (!datos.contacto?.whatsapp) btnWa.textContent = 'Mandar por WhatsApp';

function pintar() {
  ul.replaceChildren(
    ...elegidos.map((id) => {
      const s = porId.get(id);
      const li = document.createElement('li');
      const txt = document.createElement('span');
      txt.textContent = `${s.id} · ${s.nombre}`;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quitar';
      b.textContent = 'Quitar';
      b.setAttribute('aria-label', `Quitar ${s.nombre} de la cotización`);
      b.addEventListener('click', () => {
        elegidos = alternar(elegidos, id);
        actualizar();
        (ul.querySelector('.quitar') || selAgregar).focus();
      });
      li.append(txt, b);
      return li;
    }),
  );
  cuentaCot.textContent = `(${elegidos.length})`;
  vacioCot.hidden = elegidos.length > 0;
  for (const b of document.querySelectorAll('[data-cotizar]')) {
    const en = elegidos.includes(b.dataset.cotizar);
    b.setAttribute('aria-pressed', String(en));
    b.textContent = en ? 'En la cotización' : 'Agregar a la cotización';
  }
  const texto = armarMensaje({ elegidos, servicios: SERVICIOS, ...Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value])) });
  mensaje.textContent = texto;
  btnWa.href = enlaceWhatsApp(texto, datos.contacto?.whatsapp);
}

function actualizar() {
  pintar();
  guardar({ elegidos, ...Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value])) });
}

document.addEventListener('click', (e) => {
  const varios = e.target.closest('[data-cotizar-varios]');
  if (varios) {
    const ids = varios.dataset.cotizarVarios.split(' ').filter((id) => porId.has(id));
    const nuevos = ids.filter((id) => !elegidos.includes(id));
    elegidos = [...elegidos, ...nuevos];
    actualizar();
    aviso.textContent = nuevos.length ? `Se agregaron ${nuevos.length} servicios a la cotización.` : 'Esos servicios ya estaban en la cotización.';
    document.getElementById('cotizar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.getElementById('cot-negocio').focus({ preventScroll: true });
    return;
  }
  const b = e.target.closest('[data-cotizar]');
  if (!b) return;
  const id = b.dataset.cotizar;
  elegidos = alternar(elegidos, id);
  actualizar();
  aviso.textContent = elegidos.includes(id) ? `${porId.get(id).nombre}: agregado a la cotización.` : `${porId.get(id).nombre}: quitado de la cotización.`;
});
selAgregar.addEventListener('change', () => {
  const id = selAgregar.value;
  if (id && !elegidos.includes(id)) elegidos.push(id);
  selAgregar.value = '';
  actualizar();
});
for (const el of Object.values(campos)) el.addEventListener('input', actualizar);

document.getElementById('cot-copiar').addEventListener('click', async () => {
  const texto = mensaje.textContent;
  try {
    await navigator.clipboard.writeText(texto);
    aviso.textContent = 'Mensaje copiado. Pégalo en WhatsApp o en un correo.';
  } catch {
    const r = document.createRange();
    r.selectNodeContents(mensaje);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    aviso.textContent = 'No se pudo copiar solo: el mensaje quedó seleccionado, cópialo con Ctrl+C o manteniéndolo presionado.';
  }
});

const vaciar = document.createElement('button');
vaciar.type = 'button';
vaciar.className = 'boton boton--linea';
vaciar.textContent = 'Vaciar la lista';
vaciar.addEventListener('click', () => {
  elegidos = [];
  for (const el of Object.values(campos)) el.value = '';
  actualizar();
  aviso.textContent = 'Cotización vaciada.';
});
document.querySelector('.cotizador__acciones').append(vaciar);

pintar();
