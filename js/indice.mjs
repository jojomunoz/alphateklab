// Arma las entradas del buscador a partir de los datos del sitio. Lo usan el generador (assets/indice.json) y las pruebas.

export function construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES = [], DEMOS = [] }) {
  const nombreSector = Object.fromEntries(SECTORES.map((s) => [s.id, s.nombre]));
  const nombreTipo = Object.fromEntries(TIPOS.map((t) => [t.id, t.nombre]));
  const iconoTipo = Object.fromEntries(TIPOS.map((t) => [t.id, t.icono]));
  const servicios = SERVICIOS.map((s) => ({
    id: s.id,
    tipo: 'servicio',
    titulo: s.nombre,
    url: `servicios/${s.slug}/`,
    resumen: s.para,
    icono: iconoTipo[s.tipos[0]] || 'sparkle',
    etiqueta: nombreTipo[s.tipos[0]],
    precio: s.precio ? s.precio.texto : null,
    demo: Boolean(s.demo),
    campos: {
      nombre: s.nombre,
      corto: s.corto,
      palabras: PALABRAS[s.id] || '',
      para: s.para,
      incluye: [...s.incluye, ...s.equipo].join(' '),
      tipos: s.tipos.map((t) => nombreTipo[t]).join(' '),
      sectores: s.sectores.map((x) => nombreSector[x]).join(' '),
    },
  }));
  const soluciones = SOLUCIONES.map((so) => ({
    id: `sol-${so.slug}`,
    tipo: 'solucion',
    titulo: so.titulo,
    url: `soluciones/${so.slug}/`,
    resumen: so.bajada,
    icono: so.icono,
    etiqueta: 'Soluciones por negocio',
    campos: {
      nombre: so.titulo,
      corto: nombreSector[so.sector],
      palabras: '',
      para: so.bajada,
      incluye: so.problemas.map((p) => p.problema).join(' '),
    },
  }));
  const demos = DEMOS.map((d) => ({
    id: `demo-${d.clave}`,
    tipo: 'demo',
    titulo: `Demo: ${d.nombre}`,
    url: d.url,
    resumen: d.que,
    icono: 'play-circle',
    etiqueta: 'Demo en vivo',
    campos: { nombre: d.nombre, corto: 'demo prueba ejemplo', palabras: '', para: d.que, incluye: '' },
  }));
  return [...servicios, ...soluciones, ...demos];
}
