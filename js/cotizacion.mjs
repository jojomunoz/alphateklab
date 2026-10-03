// La cotización vive en el navegador de la persona (localStorage), compartida entre todas las páginas.
// Si el almacenamiento no está disponible, vive solo en esta visita.

const CLAVE = 'atk-cotizacion-v2';
let enMemoria = { elegidos: [], negocio: '', tipo: '', lugar: '', notas: '' };

export function leerCotizacion() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (d && Array.isArray(d.elegidos)) return { ...enMemoria, ...d, elegidos: d.elegidos.filter((x) => typeof x === 'string') };
  } catch {
    /* sin almacenamiento */
  }
  return { ...enMemoria };
}

export function guardarCotizacion(d) {
  enMemoria = { ...enMemoria, ...d };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(enMemoria));
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
}

export function alternarEnCotizacion(id) {
  const d = leerCotizacion();
  const elegidos = d.elegidos.includes(id) ? d.elegidos.filter((x) => x !== id) : [...d.elegidos, id];
  guardarCotizacion({ ...d, elegidos });
  return elegidos;
}

export function agregarVarios(ids) {
  const d = leerCotizacion();
  const nuevos = ids.filter((id) => id && !d.elegidos.includes(id));
  guardarCotizacion({ ...d, elegidos: [...d.elegidos, ...nuevos] });
  return nuevos.length;
}
