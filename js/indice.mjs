// Arma las entradas del buscador a partir de los datos del sitio. Lo usan el generador (assets/indice.json) y las pruebas.
// Devuelve { equivalencias, vacias, entradas }: las dos primeras son cómo se escribe en Panamá o en el chat y lo que
// eso significa en el catálogo, y el relleno que no sirve para buscar; viajan en el índice porque el buscador corre en
// el navegador.

export function construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES = [], DEMOS = [], PALABRAS_NEGOCIO = {}, GUIAS = [], FICHAS = {}, SITUACIONES = {}, EQUIVALENCIAS = [], VACIAS = [] }) {
  // Cada servicio hereda los problemas (dichos como los dice el cliente) de las páginas de negocio que lo enlazan.
  const problemasDe = {};
  for (const so of SOLUCIONES) for (const p of so.problemas) for (const id of p.servicios) (problemasDe[id] ||= []).push(p.problema);
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
      problemas: (problemasDe[s.id] || []).join(' '),
      // cómo cuenta el problema un dueño de negocio de Panamá (datos/situaciones.mjs)
      situaciones: (SITUACIONES[s.id] || []).join(' '),
      // el texto de la ficha (cómo funciona, el caso y las preguntas), con poco peso: ayuda a encontrar, no decide
      ficha: FICHAS[s.id] ? [...FICHAS[s.id].como.flatMap((c) => [c.titulo, c.texto]), FICHAS[s.id].ejemplo, ...FICHAS[s.id].preguntas.map((q) => q.p)].join(' ') : '',
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
      palabras: PALABRAS_NEGOCIO[so.slug] || '',
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
  const guias = GUIAS.map((g) => ({
    id: `guia-${g.slug}`,
    tipo: 'guia',
    titulo: g.titulo,
    url: `guias/${g.slug}/`,
    resumen: g.bajada,
    icono: 'book-open-text',
    etiqueta: 'Guía',
    campos: { nombre: g.titulo, corto: 'guia', palabras: '', para: g.bajada, incluye: g.secciones.map((x) => x.titulo).join(' ') },
  }));
  return { equivalencias: EQUIVALENCIAS, vacias: VACIAS, entradas: [...servicios, ...soluciones, ...demos, ...guias] };
}
