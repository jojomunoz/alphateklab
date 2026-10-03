// Buscador del sitio: encuentra servicios, tipos de negocio y demos a partir de lo que la persona escribe con sus
// palabras («que los clientes pidan desde la mesa», «contar gente», «app»). Sin dependencias; lo prueban
// pruebas/buscador.test.mjs. El índice lo genera herramientas/generar.mjs en assets/indice.json.

const VACIAS = new Set(
  'a al algo algun alguna como con cual cuando de del desde donde el ella en entre es esa ese eso esta este esto hacer hay la las le les lo los mas me mi mis muy necesito ni no nos o otra otro para pero poder por puede pueden que quien quiero se ser si sin sobre su sus tambien te tener tengo tiene tu tus un una uno unos unas y ya yo hola favor ustedes hacen tienen ofrecen servicio servicios negocio negocios empresa mio mia algo cosa cosas manera forma sistema creo pienso quisiera gustaria busco buscamos necesitamos queremos tenemos ayuda'.split(' '),
);

export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim();
}

export function fichas(texto) {
  return normalizar(texto)
    .split(' ')
    .filter((t) => t && !VACIAS.has(t) && (t.length > 1 || /\d/.test(t)));
}

// Dos palabras «coinciden» si son iguales o si, después de la raíz común, lo que sobra en cada una es una terminación
// de la misma familia (pedir/pedidos, camara/camaras, contar/contador). «contabilidad» y «contar» comparten «conta»
// pero «bilidad» no es una terminación: no coinciden. Devuelve 1 si son iguales, 0,8 si son de la misma familia, 0 si no.
const TERMINACIONES = new Set(['', 's', 'es', 'a', 'o', 'as', 'os', 'r', 'ar', 'er', 'ir', 'ndo', 'ando', 'iendo', 'do', 'da', 'dos', 'das', 'ado', 'ada', 'ados', 'adas', 'ido', 'ida', 'idos', 'idas', 'or', 'ores', 'dor', 'dora', 'dores', 'doras', 'cion', 'ciones', 'mos', 'n', 'an', 'en', 'e', 'en', 'ra', 'ras', 'ria', 'rias', 'nte', 'ntes', 'miento', 'mientos']);
export function parecido(a, b) {
  if (a === b) return 1;
  const corta = Math.min(a.length, b.length);
  if (corta < 4) return 0;
  let i = 0;
  while (i < corta && a[i] === b[i]) i++;
  if (i < 4) return 0;
  return TERMINACIONES.has(a.slice(i)) && TERMINACIONES.has(b.slice(i)) ? 0.8 : 0;
}

const PESOS = { nombre: 6, corto: 6, palabras: 4, problemas: 3, tipos: 2.5, sectores: 2.5, para: 2, incluye: 1.2 };

// entrada: { id, tipo:'servicio'|'solucion'|'demo', titulo, url, campos:{ nombre, corto, palabras, para, incluye, tipos, sectores } }
export function prepararIndice(entradas) {
  return entradas.map((e) => ({
    ...e,
    _fichas: Object.fromEntries(Object.entries(e.campos).map(([campo, texto]) => [campo, [...new Set(fichas(texto))]])),
  }));
}

function puntuar(entrada, consulta) {
  let total = 0;
  let encontradas = 0;
  let fuertes = 0;
  for (const q of consulta) {
    let mejor = 0;
    let campoMejor = '';
    for (const [campo, lista] of Object.entries(entrada._fichas)) {
      const peso = PESOS[campo] ?? 1;
      for (const t of lista) {
        const p = parecido(q, t) * peso;
        if (p > mejor) {
          mejor = p;
          campoMejor = campo;
        }
      }
    }
    if (mejor > 0) {
      encontradas++;
      total += mejor;
      if (['nombre', 'corto', 'palabras', 'problemas'].includes(campoMejor)) fuertes++;
    }
  }
  if (!encontradas) return 0;
  const cobertura = encontradas / consulta.length;
  // con varias palabras, premia que estén todas; una sola coincidencia débil en el texto largo no basta
  if (consulta.length > 1 && cobertura < 0.5 && fuertes === 0) return 0;
  // con tres palabras o más, si la mitad no aparece en ningún lado, el resultado es casualidad
  if (consulta.length >= 3 && cobertura < 0.5) return 0;
  return total * (0.5 + cobertura) + (cobertura === 1 ? 2 : 0);
}

export function buscar(indice, texto, { limite = 8 } = {}) {
  const consulta = [...new Set(fichas(texto))];
  if (!consulta.length) return [];
  return indice
    .map((e) => ({ e, puntos: puntuar(e, consulta) * (e.tipo === 'servicio' ? 1 : 0.9) }))
    .filter((x) => x.puntos >= 3)
    .sort((a, b) => b.puntos - a.puntos || a.e.titulo.localeCompare(b.e.titulo))
    .slice(0, limite)
    .map((x) => ({ ...x.e, _fichas: undefined, puntos: Math.round(x.puntos * 10) / 10 }));
}

// Parte un texto en trozos y marca los que coinciden con lo que se buscó (misma palabra o misma familia), para
// resaltarlos en los resultados. Devuelve [{ t: 'texto', m: true|false }] y nunca HTML: quien pinta usa textContent.
export function resaltar(texto, consulta) {
  const qs = [...new Set(fichas(consulta))];
  const trozos = String(texto ?? '').split(/([\p{L}\p{N}]+)/u).filter((t) => t !== '');
  if (!qs.length) return [{ t: String(texto ?? ''), m: false }];
  const salida = [];
  for (const t of trozos) {
    const n = normalizar(t);
    const m = /[\p{L}\p{N}]/u.test(t) && !VACIAS.has(n) && qs.some((q) => parecido(q, n) > 0);
    const ultimo = salida[salida.length - 1];
    if (ultimo && ultimo.m === m) ultimo.t += t;
    else salida.push({ t, m });
  }
  return salida;
}

// Mensaje para preguntar por algo que no está en la lista.
export function mensajePregunta(consulta, { negocio = '', lugar = '' } = {}) {
  const lineas = ['Hola, alphateklab. ¿Pueden hacer esto?', '', String(consulta).trim().slice(0, 600)];
  const quien = [negocio, lugar].map((x) => String(x).trim()).filter(Boolean).join(', ');
  if (quien) lineas.push('', `Mi negocio: ${quien}`);
  return lineas.join('\n');
}
