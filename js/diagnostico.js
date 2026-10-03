// «¿Qué necesita tu negocio?»: tres pasos y una recomendación. La lógica vive en diagnostico-nucleo.mjs.
import { recomendar, mensajeDiagnostico, estadoDesdeParams, paramsDesdeEstado, YA_TENGO } from './diagnostico-nucleo.mjs';
import { prepararIndice, buscar } from './buscador.mjs';
import { enlaceWhatsApp } from './nucleo.mjs';
import { agregarVarios } from './cotizacion.mjs';

const datos = JSON.parse(document.getElementById('datos-diagnostico').textContent);
const SOL = new Map(datos.soluciones.map((s) => [s.slug, s]));
const SERV = datos.servicios;
const form = document.getElementById('diagnostico');
const pasos = [...form.querySelectorAll('[data-paso]')];
const indicadores = [...document.querySelectorAll('[data-paso-ind]')];
const cajaProblemas = form.querySelector('[data-problemas]');
const cajaTengo = form.querySelector('[data-tengo]');
const otro = document.getElementById('diag-otro');
const resultado = document.querySelector('[data-resultado]');
const RAIZ = document.documentElement.dataset.raiz || './';
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

const avance = document.querySelector('.pasos-diag');
let indice = null;
async function cargarIndice() {
  if (!indice) {
    const r = await fetch(`${RAIZ}assets/indice.json`);
    if (!r.ok) throw new Error(`índice ${r.status}`);
    indice = prepararIndice(await r.json());
  }
  return indice;
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ico = (n) => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"></use></svg>`;

cajaTengo.innerHTML = YA_TENGO.map((y) => `<label class="diag-chip"><input type="checkbox" name="tengo" value="${y.id}" /><span>${esc(y.texto)}</span></label>`).join('');

// Cada paso es una entrada del historial: el botón Atrás del navegador vuelve al paso anterior, no fuera del asistente.
function irA(n, { enfocar = true, historia = true } = {}) {
  if (historia && history.state?.paso !== n) history.pushState({ paso: n }, '', n === 1 ? location.pathname : `${location.pathname}?${paramsDesdeEstado({ negocio: leer().negocio })}`);
  pasos.forEach((p) => (p.hidden = Number(p.dataset.paso) !== n));
  indicadores.forEach((li) => {
    const i = Number(li.dataset.pasoInd);
    li.toggleAttribute('aria-current', i === n);
    if (i === n) li.setAttribute('aria-current', 'step');
    li.classList.toggle('hecho', i < n);
  });
  resultado.hidden = true;
  form.hidden = false;
  if (enfocar) {
    const leyenda = pasos[n - 1].querySelector('legend');
    leyenda.setAttribute('tabindex', '-1');
    leyenda.focus({ preventScroll: true });
    // el indicador 1-2-3 y la pregunta quedan a la vista, bajo la cabecera fija (scroll-padding-top en el html)
    (avance || form).scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
  }
}

function pintarProblemas(slug, marcados = []) {
  const so = SOL.get(slug);
  cajaProblemas.innerHTML = so.problemas
    .map(
      (p, i) => `<label class="diag-problema"><input type="checkbox" name="problema" value="${i}"${marcados.includes(i) ? ' checked' : ''} /><span class="diag-problema__caja"><span class="diag-problema__que">${esc(p.problema)}</span><span class="diag-problema__como">${esc(p.respuesta)}</span></span></label>`,
    )
    .join('');
}

function leer() {
  const fd = new FormData(form);
  return {
    negocio: fd.get('negocio') || '',
    problemas: fd.getAll('problema').map(Number),
    tengo: fd.getAll('tengo'),
    otro: otro.value.trim(),
  };
}

async function mostrarResultado({ guardar = true } = {}) {
  const e = leer();
  const so = SOL.get(e.negocio);
  const recs = recomendar(so, e.problemas, e.tengo);
  const servicios = recs.map((r) => ({ id: r.id, ...SERV[r.id], motivos: r.motivos.map((m) => `Porque marcaste «${m}»`) }));
  // Lo escrito en «¿Algo más?» también se busca en el catálogo: decir «no está en la lista» solo si de verdad no está.
  let porTexto = [];
  if (e.otro) {
    try {
      const ya = new Set(servicios.map((x) => x.id));
      // Una frase puede pedir varias cosas («cobrar mensualidades y control de acceso»): se busca entera y por partes.
      const idx = await cargarIndice();
      const partes = [e.otro, ...e.otro.split(/\s*(?:[,;.]|\by\b|\btambién\b|\bademás\b)\s*/i)].map((x) => x.trim()).filter((x) => x.length > 2);
      const vistos = new Set();
      for (const parte of partes) {
        for (const r of buscar(idx, parte, { limite: 3 })) {
          if (r.tipo !== 'servicio' || !SERV[r.id] || ya.has(r.id) || vistos.has(r.id)) continue;
          vistos.add(r.id);
          porTexto.push(r);
        }
      }
      porTexto = porTexto.slice(0, 4);
    } catch {
      porTexto = [];
    }
    for (const r of porTexto) servicios.push({ id: r.id, ...SERV[r.id], motivos: [`Por lo que escribiste: «${e.otro.length > 70 ? `${e.otro.slice(0, 70)}…` : e.otro}»`] });
  }
  const mensaje = mensajeDiagnostico({ negocio: so.nombre, problemas: e.problemas.map((i) => so.problemas[i].problema), servicios, otro: e.otro });
  const wa = enlaceWhatsApp(mensaje, document.documentElement.dataset.whatsapp || null);
  const principales = servicios.slice(0, 3);
  const resto = servicios.slice(3);
  const tarjeta = (s, grande) => `<li class="rec${grande ? ' rec--principal' : ''}">
      <div class="rec__cabeza"><span class="rec__icono">${ico(s.icono)}</span></div>
      <h3 class="rec__nombre"><a href="${s.url}">${esc(s.nombre)}</a></h3>
      <p class="rec__para">${esc(s.para)}</p>
      <p class="rec__porque">${s.motivos.map((m) => esc(m)).join('. ')}.</p>
      <p class="rec__pie"><span class="num">${esc(s.precio)}</span>${s.demo ? `<a class="rec__demo" href="${s.demo}">${ico('play-circle')}Probar la demo</a>` : ''}</p>
    </li>`;
  resultado.innerHTML = `
    <div class="diag-resultado__cabeza">
      <p class="diag-resultado__negocio">${ico(so.icono)}${esc(so.nombre)}</p>
      <h2 class="display diag-resultado__titulo">${servicios.length ? `Esto es lo que te recomendamos (${servicios.length})` : 'Cuéntanos más y te orientamos'}</h2>
      <p class="seccion__bajada">${
        servicios.length
          ? recs.length
            ? 'Ordenado por lo que más te resuelve. Empieza por los primeros; lo demás se suma después.'
            : 'Esto es lo que encontramos por lo que escribiste. Si no es lo que buscas, mándanos el mensaje y te decimos si lo hacemos.'
          : e.otro
            ? 'No encontramos eso en la lista, pero puede que lo hagamos. Mándanos el mensaje y te decimos.'
            : 'Ya tienes lo que te habríamos recomendado. Si buscas otra cosa, escríbela.'
      }</p>
    </div>
    ${principales.length ? `<ol class="recs recs--principales" role="list">${principales.map((s) => tarjeta(s, true)).join('')}</ol>` : ''}
    ${resto.length ? `<h3 class="diag-resultado__sub">También te sirve</h3><ol class="recs" role="list">${resto.map((s) => tarjeta(s, false)).join('')}</ol>` : ''}
    <div class="diag-resultado__accion">
      <div>
        <p class="diag-resultado__accion-titulo">¿Lo hablamos?</p>
        <p>Te queda un mensaje con tu negocio, ${e.problemas.length ? 'lo que marcaste' : 'lo que escribiste'}${servicios.length ? ' y esta recomendación' : ''}. Lo mandas tú; esta página no envía nada.</p>
      </div>
      <div class="diag-resultado__botones">
        <a class="boton boton--senal" href="${wa}" target="_blank" rel="noopener">${ico('whatsapp-logo')}Mandar por WhatsApp</a>
        ${servicios.length ? `<button class="boton boton--linea" type="button" data-agregar-todo>Agregar todo a mi lista</button>` : ''}
        <button class="boton boton--linea" type="button" data-reiniciar>Empezar de nuevo</button>
      </div>
      <p class="diag__aviso" data-aviso-final role="status"></p>
    </div>
    <p class="diag-resultado__mas"><a href="${RAIZ}soluciones/${so.slug}/">Ver todo lo que hacemos para ${esc(so.nombre.toLowerCase())}</a></p>`;
  resultado.querySelector('[data-agregar-todo]')?.addEventListener('click', (ev) => {
    const n = agregarVarios(servicios.map((s) => s.id));
    window.dispatchEvent(new StorageEvent('storage'));
    ev.currentTarget.textContent = n ? `Agregados (${n}). Ver mi lista` : 'Ya estaban. Ver mi lista';
    ev.currentTarget.onclick = () => (location.href = `${RAIZ}cotizar/`);
  });
  resultado.querySelector('[data-reiniciar]').addEventListener('click', () => {
    form.reset();
    irA(1);
  });
  form.hidden = true;
  resultado.hidden = false;
  indicadores.forEach((li) => {
    li.classList.add('hecho');
    li.removeAttribute('aria-current');
  });
  if (guardar) history.pushState({ resultado: true }, '', `${location.pathname}?${paramsDesdeEstado(e)}`);
  resultado.focus({ preventScroll: true });
  resultado.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
}

form.addEventListener('change', (ev) => {
  if (ev.target.name === 'negocio') {
    pintarProblemas(ev.target.value);
    irA(2);
  }
  if (ev.target.name === 'problema') form.querySelector('[data-aviso-2]').hidden = true;
});
form.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-atras]')) irA(Number(ev.target.closest('[data-paso]').dataset.paso) - 1);
  if (ev.target.closest('[data-siguiente]')) {
    const e = leer();
    if (!e.problemas.length && !e.otro) {
      form.querySelector('[data-aviso-2]').hidden = false;
      return;
    }
    irA(3);
  }
  if (ev.target.closest('[data-ver]')) mostrarResultado();
});
form.addEventListener('submit', (ev) => ev.preventDefault());

window.addEventListener('popstate', (ev) => {
  const st = ev.state;
  if (st?.resultado) mostrarResultado({ guardar: false });
  else if (st?.paso && (st.paso === 1 || leer().negocio)) irA(st.paso, { historia: false });
  else irA(1, { historia: false });
});

// Entrar con un resultado compartido (?n=…&p=…&t=…) o con el negocio ya elegido (?n=…)
const inicial = estadoDesdeParams(new URLSearchParams(location.search));
history.replaceState(inicial.problemas.length ? { resultado: true } : { paso: SOL.has(inicial.negocio) ? 2 : 1 }, '');
if (SOL.has(inicial.negocio)) {
  form.querySelector(`input[name="negocio"][value="${inicial.negocio}"]`).checked = true;
  pintarProblemas(inicial.negocio, inicial.problemas);
  for (const t of inicial.tengo) {
    const c = form.querySelector(`input[name="tengo"][value="${CSS.escape(t)}"]`);
    if (c) c.checked = true;
  }
  if (inicial.problemas.length) mostrarResultado({ guardar: false });
  else irA(2, { enfocar: false, historia: false });
}
