// «¿Qué necesita mi negocio?»: de las respuestas a una recomendación. Sin DOM; lo prueba pruebas/diagnostico.test.mjs.

// Lo que el negocio ya tiene, y los servicios que eso vuelve innecesarios.
export const YA_TENGO = [
  { id: 'web', texto: 'Página web', quita: ['T01'] },
  { id: 'caja', texto: 'Sistema de caja o punto de venta', quita: ['R11'] },
  { id: 'camaras', texto: 'Cámaras de seguridad', quita: ['T11'] },
  { id: 'wifi', texto: 'Wi-Fi que llega a todo el local', quita: ['T10'] },
  { id: 'factura', texto: 'Factura electrónica', quita: ['T07'] },
  { id: 'google', texto: 'Perfil en Google Maps', quita: ['T13'] },
];

// solucion: { sector, problemas: [{ problema, servicios: [ids] }] }; elegidos: índices de problemas; tengo: ids de YA_TENGO
export function recomendar(solucion, elegidos, tengo = []) {
  if (!solucion) return [];
  const quitar = new Set(YA_TENGO.filter((y) => tengo.includes(y.id)).flatMap((y) => y.quita));
  const indices = [...new Set(elegidos)].filter((i) => Number.isInteger(i) && i >= 0 && i < solucion.problemas.length).sort((a, b) => a - b);
  const porId = new Map();
  for (const i of indices) {
    const p = solucion.problemas[i];
    p.servicios.forEach((id, orden) => {
      if (quitar.has(id)) return;
      const r = porId.get(id) || { id, motivos: [], peso: 0, primero: Infinity };
      r.motivos.push(p.problema);
      r.peso += orden === 0 ? 2 : 1; // el primer servicio de cada problema es la respuesta principal
      r.primero = Math.min(r.primero, i * 10 + orden);
      porId.set(id, r);
    });
  }
  return [...porId.values()].sort((a, b) => b.peso - a.peso || a.primero - b.primero).map(({ id, motivos }) => ({ id, motivos }));
}

export function mensajeDiagnostico({ negocio, problemas = [], servicios = [], otro = '' }) {
  const lineas = ['Hola, alphateklab. Hice el diagnóstico en su página.'];
  if (negocio) lineas.push(/^cualquier negocio$/i.test(negocio) ? 'Mi negocio: otro tipo (lo explico abajo).' : `Mi negocio: ${negocio}.`);
  if (problemas.length) {
    lineas.push('', 'Lo que quiero resolver:');
    for (const p of problemas) lineas.push(`- ${p}`);
  }
  const extra = String(otro).trim().slice(0, 600);
  if (extra) lineas.push('', `Además: ${extra}`);
  if (servicios.length) {
    lineas.push('', 'Me recomendó:');
    for (const s of servicios) lineas.push(`- ${s.nombre} (ref. ${s.id})`);
  }
  return lineas.join('\n');
}

// Estado en la URL para poder compartir el resultado: ?n=restaurantes&p=0,2&t=web,caja
export function estadoDesdeParams(params) {
  const lista = (k) => (params.get(k) || '').split(',').map((x) => x.trim()).filter(Boolean);
  return { negocio: params.get('n') || '', problemas: lista('p').map(Number).filter(Number.isInteger), tengo: lista('t') };
}

export function paramsDesdeEstado({ negocio, problemas = [], tengo = [] }) {
  const p = new URLSearchParams();
  if (negocio) p.set('n', negocio);
  if (problemas.length) p.set('p', problemas.join(','));
  if (tengo.length) p.set('t', tengo.join(','));
  return p;
}
