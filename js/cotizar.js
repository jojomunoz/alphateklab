// Página «Pregúntanos o cotiza»: arma el mensaje con lo que la persona escribió y los servicios elegidos.
import { armarMensaje, enlaceWhatsApp, elegidosValidos } from './nucleo.mjs';
import { leerCotizacion, guardarCotizacion } from './cotizacion.mjs';

const datos = JSON.parse(document.getElementById('datos-cotizar').textContent);
const SERVICIOS = datos.servicios;
const porId = new Map(SERVICIOS.map((s) => [s.id, s]));

const campos = {
  notas: document.getElementById('cot-notas'),
  negocio: document.getElementById('cot-negocio'),
  tipo: document.getElementById('cot-tipo'),
  lugar: document.getElementById('cot-lugar'),
};
const ul = document.getElementById('cot-elegidos');
const cuenta = document.getElementById('cot-cuenta');
const vacio = document.getElementById('cot-vacio');
const mensaje = document.getElementById('cot-mensaje');
const btnWa = document.getElementById('cot-whatsapp');
const aviso = document.getElementById('cot-aviso');
const selAgregar = document.getElementById('cot-agregar');

// Lo que llega en la URL: ?servicio=ID, ?q=texto del buscador, ?negocio=tipo de negocio
const params = new URLSearchParams(location.search);
let estado = leerCotizacion();
let elegidos = elegidosValidos(estado.elegidos, SERVICIOS);
const pedido = params.get('servicio');
if (pedido && porId.has(pedido) && !elegidos.includes(pedido)) elegidos.push(pedido);
if (pedido && porId.has(pedido)) {
  const cab = document.getElementById('cot-pregunta-por');
  if (cab) {
    cab.hidden = false;
    cab.querySelector('strong').textContent = porId.get(pedido).nombre;
  }
}
// Los datos del negocio se recuerdan; lo que la persona necesita, no: «¿Qué necesitas?» se llena solo con la frase que
// trae esta visita (?q=). Antes se reponía lo guardado y se le pegaba la frase nueva, y el mensaje podía pedir un sistema
// de gimnasio junto a un servicio de restaurante (revisión del 3-oct). Lo de otra visita se ofrece aparte.
for (const [k, el] of Object.entries(campos)) if (k !== 'notas' && typeof estado[k] === 'string') el.value = estado[k];
const q = (params.get('q') || '').trim();
campos.notas.value = q;
const anterior = typeof estado.notas === 'string' ? estado.notas.trim() : '';
const antes = document.getElementById('cot-antes');
if (antes && anterior && anterior !== q) {
  antes.hidden = false;
  antes.querySelector('span').textContent = anterior.length > 120 ? `${anterior.slice(0, 117)}…` : anterior;
  antes.addEventListener('click', (e) => {
    const b = e.target.closest('[data-antes]');
    if (!b) return;
    if (b.dataset.antes === 'usar') campos.notas.value = [campos.notas.value, anterior].filter(Boolean).join('\n');
    antes.hidden = true;
    actualizar();
    campos.notas.focus();
  });
}
const negocioUrl = params.get('negocio');
if (negocioUrl && [...campos.tipo.options].some((o) => o.text === negocioUrl)) campos.tipo.value = negocioUrl;
// los datos del negocio van plegados; si ya había algo escrito, se ven
const detalles = document.getElementById('cot-detalles');
if (detalles && [campos.negocio, campos.tipo, campos.lugar].some((el) => el.value)) detalles.open = true;
// en el teléfono, la barra fija de «Mandar» se esconde mientras se escribe (el teclado la montaba sobre el campo)
const form = document.getElementById('cotizador');
form.addEventListener('focusin', (e) => { if (e.target.matches('input, textarea, select')) document.body.classList.add('escribiendo'); });
form.addEventListener('focusout', (e) => { if (!e.relatedTarget?.matches?.('input, textarea, select')) document.body.classList.remove('escribiendo'); });

function guardar() {
  guardarCotizacion({ elegidos, ...Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value])) });
}

function pintar() {
  ul.replaceChildren(
    ...elegidos.map((id) => {
      const s = porId.get(id);
      const li = document.createElement('li');
      const txt = document.createElement('span');
      txt.textContent = s.nombre;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quitar';
      b.textContent = 'Quitar';
      b.setAttribute('aria-label', `Quitar ${s.nombre}`);
      b.addEventListener('click', () => {
        elegidos = elegidos.filter((x) => x !== id);
        actualizar();
        (ul.querySelector('.quitar') || selAgregar).focus();
      });
      li.append(txt, b);
      return li;
    }),
  );
  cuenta.textContent = `(${elegidos.length})`;
  vacio.hidden = elegidos.length > 0;
  const texto = armarMensaje({
    elegidos,
    servicios: SERVICIOS,
    negocio: campos.negocio.value,
    tipo: campos.tipo.value,
    lugar: campos.lugar.value,
    notas: campos.notas.value,
  });
  mensaje.textContent = texto;
  btnWa.href = enlaceWhatsApp(texto, document.documentElement.dataset.whatsapp || null);
}

function actualizar() {
  pintar();
  guardar();
}

selAgregar.addEventListener('change', () => {
  const id = selAgregar.value;
  if (id && !elegidos.includes(id)) elegidos.push(id);
  selAgregar.value = '';
  actualizar();
  aviso.textContent = id ? `${porId.get(id).nombre}: agregado.` : '';
});
for (const el of Object.values(campos)) el.addEventListener('input', actualizar);

const btnCopiar = document.getElementById('cot-copiar');
const textoCopiar = btnCopiar.innerHTML;
btnCopiar.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(mensaje.textContent);
    aviso.textContent = 'Mensaje copiado. Pégalo en WhatsApp o en un correo.';
    btnCopiar.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-check"></use></svg>Copiado';
    setTimeout(() => (btnCopiar.innerHTML = textoCopiar), 1500);
  } catch {
    const r = document.createRange();
    r.selectNodeContents(mensaje);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
    aviso.textContent = 'No se pudo copiar solo: el mensaje quedó seleccionado, cópialo con Ctrl+C o manteniéndolo presionado.';
  }
});
let deshacer = null;
document.getElementById('cot-vaciar').addEventListener('click', () => {
  const antes = { elegidos: [...elegidos], campos: Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value])) };
  elegidos = [];
  for (const el of Object.values(campos)) el.value = '';
  actualizar();
  aviso.replaceChildren('Se vació la lista. ');
  const b = Object.assign(document.createElement('button'), { type: 'button', className: 'enlace-boton', textContent: 'Deshacer' });
  b.addEventListener('click', () => {
    elegidos = antes.elegidos;
    for (const [k, v] of Object.entries(antes.campos)) campos[k].value = v;
    actualizar();
    aviso.textContent = 'Lista recuperada.';
  });
  aviso.append(b);
  clearTimeout(deshacer);
  deshacer = setTimeout(() => { if (aviso.contains(b)) aviso.textContent = ''; }, 8000);
});
window.addEventListener('storage', () => {
  estado = leerCotizacion();
  elegidos = elegidosValidos(estado.elegidos, SERVICIOS);
  pintar();
});

actualizar();
