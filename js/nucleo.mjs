// Lógica pura de la portada (filtros y cotizador). Sin DOM: la prueban pruebas/*.test.mjs.

export function coincide(servicio, filtro) {
  if (filtro.sector && !servicio.sectores.includes(filtro.sector)) return false;
  if (filtro.tipo && !servicio.tipos.includes(filtro.tipo)) return false;
  if (filtro.demo && !servicio.demo) return false;
  if (filtro.instala && !servicio.instala) return false;
  return true;
}

export function filtroDesdeParams(params) {
  return {
    sector: params.get('sector') || '',
    tipo: params.get('tipo') || '',
    demo: params.get('demo') === '1',
    instala: params.get('instala') === '1',
  };
}

export function paramsDesdeFiltro(f) {
  const p = new URLSearchParams();
  if (f.sector) p.set('sector', f.sector);
  if (f.tipo) p.set('tipo', f.tipo);
  if (f.demo) p.set('demo', '1');
  if (f.instala) p.set('instala', '1');
  return p;
}

const limpiar = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function armarMensaje({ elegidos, servicios, negocio, tipo, lugar, notas }) {
  const porId = new Map(servicios.map((s) => [s.id, s]));
  const lista = elegidos.map((id) => porId.get(id)).filter(Boolean);
  const n = limpiar(negocio, 80);
  const t = limpiar(tipo, 60);
  const l = limpiar(lugar, 60);
  const notasLimpias = String(notas ?? '').trim().slice(0, 600);

  const lineas = ['Hola, alphateklab. Quiero una cotización.'];
  const quien = [n, t && `(${t})`].filter(Boolean).join(' ');
  if (quien || l) lineas.push(`Negocio: ${[quien, l].filter(Boolean).join(', ')}`);
  if (lista.length) {
    lineas.push('', 'Servicios:');
    for (const s of lista) lineas.push(`- ${s.id} ${s.nombre}${s.precio && s.precio !== 'A cotizar' ? ` (${s.precio})` : ''}`);
  } else {
    lineas.push('', 'Todavía no elegí servicios: quiero que me orienten.');
  }
  if (notasLimpias) lineas.push('', `Lo que necesito resolver: ${notasLimpias}`);
  return lineas.join('\n');
}

// wa.me: número con código de país, sin «+», espacios ni guiones. Sin número abre WhatsApp para elegir el chat.
export function enlaceWhatsApp(texto, numero) {
  const limpio = String(numero ?? '').replace(/\D/g, '');
  const base = limpio ? `https://wa.me/${limpio}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(texto)}`;
}

export function alternar(lista, id) {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
}

export function elegidosValidos(lista, servicios) {
  const ids = new Set(servicios.map((s) => s.id));
  return [...new Set((Array.isArray(lista) ? lista : []).filter((x) => typeof x === 'string' && ids.has(x)))];
}
