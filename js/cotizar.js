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
for (const [k, el] of Object.entries(campos)) if (typeof estado[k] === 'string') el.value = estado[k];
if (params.get('q') && !campos.notas.value.includes(params.get('q'))) campos.notas.value = [campos.notas.value, params.get('q')].filter(Boolean).join('\n');
const negocioUrl = params.get('negocio');
if (negocioUrl && [...campos.tipo.options].some((o) => o.text === negocioUrl)) campos.tipo.value = negocioUrl;

function guardar() {
  guardarCotizacion({ elegidos, ...Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value])) });
}

function pintar() {
  ul.replaceChildren(
    ...elegidos.map((id) => {
      const s = porId.get(id);
      const li = document.createElement('li');
      const txt = document.createElement('span');
      txt.textContent = `${s.id} ${s.nombre}`;
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

document.getElementById('cot-copiar').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(mensaje.textContent);
    aviso.textContent = 'Mensaje copiado. Pégalo en WhatsApp o en un correo.';
  } catch {
    const r = document.createRange();
    r.selectNodeContents(mensaje);
    getSelection().removeAllRanges();
    getSelection().addRange(r);
    aviso.textContent = 'No se pudo copiar solo: el mensaje quedó seleccionado, cópialo con Ctrl+C o manteniéndolo presionado.';
  }
});
document.getElementById('cot-vaciar').addEventListener('click', () => {
  elegidos = [];
  for (const el of Object.values(campos)) el.value = '';
  actualizar();
  aviso.textContent = 'Todo vaciado.';
});
window.addEventListener('storage', () => {
  estado = leerCotizacion();
  elegidos = elegidosValidos(estado.elegidos, SERVICIOS);
  pintar();
});

actualizar();
