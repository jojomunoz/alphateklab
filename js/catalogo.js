// Página de todos los servicios: búsqueda con tus palabras + filtros por negocio y tipo, todo en la URL.
import { buscar, esDudosa, mensajePregunta, cargarIndice as descargarIndice } from './buscador.mjs';
import { coincide, filtroDesdeParams, paramsDesdeFiltro, enlaceWhatsApp } from './nucleo.mjs';

const RAIZ = document.documentElement.dataset.raiz || './';
const form = document.getElementById('filtros');
const cuenta = document.getElementById('filtros-cuenta');
const vacio = document.getElementById('catalogo-vacio');
const preguntar = document.getElementById('vacio-preguntar');
const tarjetas = [...document.querySelectorAll('.tarjeta-servicio')];
const grupos = [...document.querySelectorAll('.grupo')];
const total = tarjetas.length;
const datos = new Map(tarjetas.map((t) => [t.dataset.id, { sectores: t.dataset.sectores.split(' '), tipos: t.dataset.tipos.split(' '), demo: t.dataset.demo === '1' }]));
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
  indice ??= await descargarIndice(`${RAIZ}assets/indice.json?v=${document.documentElement.dataset.indice || ''}`);
  return indice;
}

function leerForm() {
  const fd = new FormData(form);
  return { q: (fd.get('q') || '').trim(), sector: fd.get('sector') || '', tipo: fd.get('tipo') || '', demo: fd.get('demo') === '1' };
}

function ponerEnForm(f) {
  form.elements.q.value = f.q || '';
  for (const r of form.querySelectorAll('input[name="sector"]')) r.checked = r.value === (f.sector || '');
  form.elements.tipo.value = f.tipo || '';
  form.elements.demo.checked = Boolean(f.demo);
}

async function aplicar({ url = true } = {}) {
  const f = leerForm();
  if (f.q.replace(/\s/g, '').length < 3) f.q = ''; // con 1 o 2 letras todavía no se filtra
  let orden = null;
  let dudosa = false;
  if (f.q) {
    try {
      const idx = await cargarIndice();
      const res = buscar(idx, f.q, { limite: 200, prefijo: true, minimo: 3 }).filter((r) => r.tipo === 'servicio');
      // la misma regla que el buscador del sitio: muchos resultados flojos = no está descrito así; solo 3 parecidos
      dudosa = esDudosa(idx, f.q);
      orden = new Map((dudosa ? res.slice(0, 3) : res).map((r, i) => [r.id, i]));
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
  // con búsqueda o con un tipo elegido, los grupos se aplanan: con ?tipo=pagos los encabezados de otros tipos
  // («Software a medida», «Web y apps») quedaban antes que «Cobros y facturación» y la cifra no cuadraba con la portada
  const plano = Boolean(f.q || f.tipo);
  if (f.tipo && !f.q) {
    // primero los que son de ese tipo por su tipo principal, después los que también lo son
    for (const t of tarjetas) if (!t.hidden) t.style.order = datos.get(t.dataset.id)?.tipos?.[0] === f.tipo ? '0' : '1';
  }
  document.getElementById('catalogo').classList.toggle('catalogo--buscando', plano);
  form.classList.toggle('filtros--buscando', Boolean(f.q));
  for (const g of grupos) g.hidden = !g.querySelector('.tarjeta-servicio:not([hidden])');
  if (h1) h1.textContent = titulo(f, visibles);
  if (dudosa && visibles) {
    const a = Object.assign(document.createElement('a'), { href: `${RAIZ}cotizar/?q=${encodeURIComponent(f.q)}`, textContent: `pregúntanos por «${f.q}»` });
    cuenta.replaceChildren('No lo tenemos descrito así: ', a, `. Lo hacemos a la medida. Abajo, lo más parecido que ya tenemos (${visibles}).`);
  } else {
    cuenta.textContent = f.q ? `${visibles} ${visibles === 1 ? 'resultado' : 'resultados'} para «${f.q}»` : `Mostrando ${visibles} de ${total}`;
  }
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
let escribiendo = false; // mientras la persona escribe en el campo, «fact» ya trae la factura electrónica
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
