// Página de todos los servicios: búsqueda con tus palabras + filtros por negocio y tipo, todo en la URL.
import { prepararIndice, buscar, mensajePregunta } from './buscador.mjs';
import { coincide, filtroDesdeParams, paramsDesdeFiltro, enlaceWhatsApp } from './nucleo.mjs';

const RAIZ = document.documentElement.dataset.raiz || './';
const form = document.getElementById('filtros');
const cuenta = document.getElementById('filtros-cuenta');
const vacio = document.getElementById('catalogo-vacio');
const preguntar = document.getElementById('vacio-preguntar');
const tarjetas = [...document.querySelectorAll('.tarjeta-servicio')];
const grupos = [...document.querySelectorAll('.grupo')];
const total = tarjetas.length;
const datos = new Map(tarjetas.map((t) => [t.dataset.id, { sectores: t.dataset.sectores.split(' '), tipos: t.dataset.tipos.split(' '), demo: t.dataset.demo === '1', instala: t.dataset.instala === '1' }]));
let indice = null;
const h1 = document.querySelector('.catalogo__cabeza h1');
const h1Base = h1?.textContent || '';
// El título dice qué se está viendo: «Software a medida (36)», «Servicios para clínicas y consultorios (7)».
function titulo(f, visibles) {
  const tipo = f.tipo ? form.elements.tipo.selectedOptions[0]?.text : '';
  const sectorTxt = f.sector ? form.querySelector(`input[name="sector"][value="${CSS.escape(f.sector)}"]`)?.nextElementSibling?.textContent || '' : '';
  const sector = sectorTxt ? sectorTxt.charAt(0).toLowerCase() + sectorTxt.slice(1) : '';
  if (f.q) return `Resultados para «${f.q}»`;
  if (tipo && sector) return `${tipo} para ${sector} (${visibles})`;
  if (tipo) return `${tipo} (${visibles})`;
  if (sector) return `Servicios para ${sector} (${visibles})`;
  return h1Base;
}

async function cargarIndice() {
  if (!indice) indice = prepararIndice(await (await fetch(`${RAIZ}assets/indice.json`)).json());
  return indice;
}

function leerForm() {
  const fd = new FormData(form);
  return { q: (fd.get('q') || '').trim(), sector: fd.get('sector') || '', tipo: fd.get('tipo') || '', demo: fd.get('demo') === '1', instala: fd.get('instala') === '1' };
}

function ponerEnForm(f) {
  form.elements.q.value = f.q || '';
  for (const r of form.querySelectorAll('input[name="sector"]')) r.checked = r.value === (f.sector || '');
  form.elements.tipo.value = f.tipo || '';
  form.elements.demo.checked = Boolean(f.demo);
  form.elements.instala.checked = Boolean(f.instala);
}

async function aplicar({ url = true } = {}) {
  const f = leerForm();
  let orden = null;
  if (f.q) {
    try {
      const res = buscar(await cargarIndice(), f.q, { limite: 200, prefijo: escribiendo }).filter((r) => r.tipo === 'servicio');
      orden = new Map(res.map((r, i) => [r.id, i]));
    } catch {
      orden = new Map(); // sin índice no se puede buscar: se dice abajo
    }
  }
  let visibles = 0;
  for (const t of tarjetas) {
    const ok = coincide(datos.get(t.dataset.id), f) && (!orden || orden.has(t.dataset.id));
    t.hidden = !ok;
    t.style.order = orden && ok ? String(orden.get(t.dataset.id)) : '';
    if (ok) visibles++;
  }
  // con búsqueda, los grupos se aplanan para mostrar primero lo más parecido
  document.getElementById('catalogo').classList.toggle('catalogo--buscando', Boolean(f.q));
  form.classList.toggle('filtros--buscando', Boolean(f.q));
  for (const g of grupos) g.hidden = !g.querySelector('.tarjeta-servicio:not([hidden])');
  if (h1) h1.textContent = titulo(f, visibles);
  cuenta.textContent = f.q ? `${visibles} ${visibles === 1 ? 'resultado' : 'resultados'} para «${f.q}»` : `Mostrando ${visibles} de ${total}`;
  vacio.hidden = visibles > 0;
  if (!visibles) preguntar.href = enlaceWhatsApp(mensajePregunta(f.q || 'Busco un servicio que no encontré en la lista'), document.documentElement.dataset.whatsapp || null);
  if (url) {
    const p = paramsDesdeFiltro(f);
    if (f.q) p.set('q', f.q);
    const q = p.toString();
    history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}`);
  }
}

let espera;
let escribiendo = false; // mientras la persona escribe en el campo, «cam» ya trae las cámaras
form.addEventListener('input', (e) => {
  clearTimeout(espera);
  escribiendo = e.target.name === 'q';
  espera = setTimeout(() => aplicar(), escribiendo ? 160 : 0);
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  aplicar();
});
const mas = form.querySelector('[data-filtros-mas]');
mas.addEventListener('click', () => {
  const abrir = !form.classList.contains('filtros--abiertos');
  form.classList.toggle('filtros--abiertos', abrir);
  mas.setAttribute('aria-expanded', String(abrir));
});
document.getElementById('limpiar-filtros').addEventListener('click', () => {
  ponerEnForm({});
  aplicar();
  form.elements.q.focus();
});

const params = new URLSearchParams(location.search);
ponerEnForm({ ...filtroDesdeParams(params), q: params.get('q') || '' });
aplicar({ url: false });
