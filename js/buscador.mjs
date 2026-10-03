// Buscador del sitio: encuentra servicios, tipos de negocio y demos a partir de lo que la persona escribe con sus
// palabras («que los clientes pidan desde la mesa», «contar gente», «app»). Sin dependencias; lo prueban
// pruebas/buscador.test.mjs. El índice lo genera herramientas/generar.mjs en assets/indice.json.

// Palabras que no sirven para buscar: la lista común del español (artículos, pronombres, preposiciones y las formas
// de estar, haber, ser y tener), lo que se dice al pedir algo («quisiera», «me gustaría») y el relleno de las frases
// largas («cada rato», «todo el día»). Sin tildes, porque se comparan después de normalizar.
const VACIAS = new Set(
  [
    'a al algo algun alguna como con cual cuando de del desde donde el ella en entre es esa ese eso esta este esto hacer hay la las le les lo los mas me mi mis muy necesito ni no nos o otra otro para pero poder por puede pueden que quien quiero se ser si sin sobre su sus tambien te tener tengo tiene tu tus un una uno unos unas y ya yo hola favor ustedes hacen tienen ofrecen servicio servicios negocio negocios empresa mio mia algo cosa cosas manera forma sistema creo pienso quisiera gustaria busco buscamos necesitamos queremos tenemos ayuda',
    // lista común del español
    'porque hasta durante todos todo toda todas contra otros otras ante ellos ellas esto mi antes algunos algunas unos tanto esos esas estos estas mucho muchos mucha muchas quienes nada poco pocos poca pocas cual cuales nosotros nosotras ti tuyo tuya tuyos tuyas suyo suya suyos suyas nuestro nuestra nuestros nuestras vuestro vuestra',
    'estar estoy estas estamos estan este esten estaba estaban estuve estuvo estado estaria',
    'haber he has ha hemos han haya hayan habia habian hubo habra habria',
    'soy eres somos son sea sean era eran fui fue fueron sera seria sido siendo',
    'tienes tenemos tenga tengan tenia tenian tuve tuvo tendre tendria tenido teniendo',
    // al pedir o preguntar
    'hago hacemos hacer haga hagan hice hizo puedo podemos podria podrian podrias pueda deberia saber sabe se pa pal q k ke x xq pq porq porfa porfavor gracias buenas buenos buen dia tardes noches saludos',
    'cuanto cuanta cuantos cuantas cuesta cuestan sale salen vale valen dar da doy dan dicen dice decir va van voy vamos ir',
    // relleno de frases largas
    'cada vez veces rato siempre nunca nadie alguien aqui alla ahi asi bien mal ahora todavia aun luego solo sola mismo misma tan demasiado bastante super full ningun ninguna ninguno',
  ]
    .join(' ')
    .split(' '),
);

export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim();
}

export function fichas(texto, otrasVacias) {
  return normalizar(texto)
    .split(' ')
    .filter((t) => t && !VACIAS.has(t) && !otrasVacias?.has(t) && (t.length > 1 || /\d/.test(t)));
}

// Cambia cómo se dice en Panamá o en el chat («pelaos», «juega vivo», «chofer») por la palabra del catálogo, sobre el
// texto ya normalizado y por palabras enteras; las expresiones largas primero.
function prepararEquivalencias(lista = []) {
  const mapa = new Map(lista.map(([dice, significa]) => [normalizar(dice), normalizar(significa)]).filter(([d, s]) => d && s && d !== s));
  if (!mapa.size) return null;
  const claves = [...mapa.keys()].sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return { mapa, re: new RegExp(`(?<=^| )(?:${claves.join('|')})(?= |$)`, 'g') };
}
function aplicarEquivalencias(texto, eq) {
  const t = normalizar(texto);
  return eq ? t.replace(eq.re, (m) => eq.mapa.get(m)) : t;
}

// Dos palabras «coinciden» si son iguales o si, después de la raíz común, lo que sobra en cada una es una terminación
// de la misma familia (pedir/pedidos, camara/camaras, contar/contador). «contabilidad» y «contar» comparten «conta»
// pero «bilidad» no es una terminación: no coinciden. Devuelve 1 si son iguales, 0,8 si son de la misma familia, 0 si no.
const TERMINACIONES = new Set(['', 's', 'es', 'a', 'o', 'as', 'os', 'r', 'ar', 'er', 'ir', 'ndo', 'ando', 'iendo', 'do', 'da', 'dos', 'das', 'ado', 'ada', 'ados', 'adas', 'ido', 'ida', 'idos', 'idas', 'or', 'ores', 'dor', 'dora', 'dores', 'doras', 'cion', 'ciones', 'mos', 'n', 'an', 'en', 'e', 'en', 'ra', 'ras', 'ria', 'rias', 'nte', 'ntes', 'miento', 'mientos']);
function familia(a, b) {
  const corta = Math.min(a.length, b.length);
  if (corta < 4) return 0;
  let i = 0;
  while (i < corta && a[i] === b[i]) i++;
  if (i < 4) return 0;
  return TERMINACIONES.has(a.slice(i)) && TERMINACIONES.has(b.slice(i)) ? 0.8 : 0;
}

// Cómo suena: junta las faltas más comunes al escribir en español (s/z/c, b/v, y/ll, h muda, g/j, qu/c/k, ñ sin
// teclado y letras dobles), para que «cotisaciones» encuentre «cotizaciones» y «vascula» encuentre «báscula».
export function fonetica(t) {
  return t
    .replace(/(?<!c)h/g, '')
    .replace(/qu/g, 'k')
    .replace(/c(?=[aou])/g, 'k')
    .replace(/c(?=[ei])/g, 's')
    .replace(/z/g, 's')
    .replace(/g(?=[ei])/g, 'j')
    .replace(/v/g, 'b')
    .replace(/ll/g, 'y')
    .replace(/ñ/g, 'n')
    .replace(/(.)\1+/g, '$1');
}

// fa y fb son fonetica(a) y fonetica(b), ya calculadas cuando se compara contra todo el índice.
export function parecido(a, b, fa, fb) {
  if (a === b) return 1;
  const f = familia(a, b);
  if (f) return f;
  if (a.length < 4 || b.length < 4) return 0;
  fa ??= fonetica(a);
  fb ??= fonetica(b);
  if (fa === fb) return 0.9;
  return familia(fa, fb) * 0.9;
}

const PESOS = { nombre: 6, corto: 6, palabras: 4, problemas: 3, situaciones: 3, tipos: 2.5, sectores: 2.5, para: 2, incluye: 1.2, ficha: 0.8 };
const FUERTES = ['nombre', 'corto', 'palabras', 'problemas', 'situaciones'];

// entrada: { id, tipo:'servicio'|'solucion'|'demo', titulo, url, campos:{ nombre, corto, palabras, para, incluye, tipos, sectores } }
// datos: lo que escribe herramientas/generar.mjs en assets/indice.json ({ equivalencias, vacias, entradas }) o, como
// antes, la lista de entradas sola. Devuelve la lista con las equivalencias y el relleno colgados de ella.
export function prepararIndice(datos) {
  const { entradas, equivalencias = [], vacias = [], ambiguas = [] } = Array.isArray(datos) ? { entradas: datos } : datos;
  const lista = entradas.map((e) => ({
    ...e,
    _fichas: Object.fromEntries(Object.entries(e.campos).map(([campo, texto]) => [campo, [...new Set(fichas(texto))].map((t) => [t, fonetica(t)])])),
  }));
  // una equivalencia de una sola palabra no se aplica si el índice ya usa esa palabra: el catálogo dice «router» y
  // «stock», y cambiarlas por «enrutador» o «existencias» haría perder la coincidencia exacta
  const vocabulario = new Set(lista.flatMap((e) => Object.values(e._fichas).flatMap((l) => l.map(([t]) => t))));
  // y solo se aplica si pone al menos una palabra que el índice conoce: cambiar «mall» por «centro comercial» cuando
  // ninguna de las dos está en el índice deja dos palabras desconocidas donde había una, y la frase se vacía
  const util = ([dice, significa]) =>
    (normalizar(dice).includes(' ') || !vocabulario.has(normalizar(dice))) && fichas(significa).some((t) => vocabulario.has(t));
  lista.equivalencias = prepararEquivalencias(equivalencias.filter(util));
  lista.vacias = new Set(vacias.map(normalizar));
  lista.ambiguas = new Set(ambiguas.map(normalizar));
  return lista;
}

// Para cada palabra de la consulta, la mejor coincidencia dentro de una entrada: [puntos, campo].
function coincidencias(entrada, consulta, prefijo = '') {
  return consulta.map(([q, fq]) => {
    let mejor = 0;
    let campoMejor = '';
    for (const [campo, lista] of Object.entries(entrada._fichas)) {
      const peso = PESOS[campo] ?? 1;
      for (const [t, ft] of lista) {
        let p = parecido(q, t, fq, ft) * peso;
        // la palabra que se está escribiendo cuenta como comienzo de otra («cam» → cámaras), con menos peso
        if (!p && q === prefijo && t.length > q.length && t.startsWith(q)) p = 0.7 * peso;
        if (p > mejor) {
          mejor = p;
          campoMejor = campo;
        }
      }
    }
    return [mejor, campoMejor];
  });
}

// conocidas[i]: si la palabra i aparece en alguna entrada del índice. La cobertura se cuenta solo sobre esas: una
// palabra que no está en ningún lado («salonera», un nombre propio) no ayuda a elegir y tampoco debe anular la frase.
// Una palabra que no está en ningún lado cuenta la mitad: a veces es relleno («salonera») y a veces es justo lo que no
// hacemos («chocolate» en «impresora 3d de chocolate»). Con 0 se respondía de más; con 1 se callaba de más (medido con
// la mitad de desarrollo de pruebas/control/bateria.json, 3-oct-2026).
const PESO_DESCONOCIDA = 0.5;
// lo que vale una palabra que aparece en todas las entradas, frente a 1 de una que aparece en una sola
const PESO_COMUN = 0.5;
// rareza[i]: cuánto distingue la palabra i, de 0 (aparece en todas las entradas) a 1 (en una sola). Una palabra
// común («equipo», «clientes») pesa menos que una que solo dice una cosa («imprimir», «yappy»): sin esto, «imprimir
// camisetas para mi equipo» salía como firma electrónica porque sus frases dicen «imprimir» y «equipo».
function puntuar(m, conocidas, rareza, ambigua = []) {
  let total = 0;
  let encontradas = 0;
  let fuertes = 0;
  let claras = 0;
  const n = conocidas.reduce((a, c) => a + (c ? 1 : PESO_DESCONOCIDA), 0);
  m.forEach(([mejor, campo], i) => {
    if (!mejor || !conocidas[i]) return;
    encontradas++;
    if (!ambigua[i]) claras++;
    total += mejor * (PESO_COMUN + (1 - PESO_COMUN) * rareza[i]);
    if (FUERTES.includes(campo)) fuertes++;
  });
  if (!encontradas) return 0;
  // una palabra de dos sentidos («pantalla», «red», «caja») sola no sostiene un resultado si la persona escribió más:
  // «pantalla rota del celular» no es «Turnos en pantalla», ni «red de pesca» es la red wifi
  if (m.length > 1 && !claras) return 0;
  // si parte de la frase no se reconoce, solo se responde cuando lo que sí coincide es central en la entrada (nombre,
  // palabras de búsqueda o problemas), no una mención de pasada en la descripción: «imprimir camisetas» no es soporte
  // técnico aunque su ficha diga «la impresora no imprime»
  if (fuertes === 0 && conocidas.some((c) => !c)) return 0;
  const cobertura = encontradas / n;
  // con varias palabras, premia que estén todas; una sola coincidencia débil en el texto largo no basta
  if (n > 1 && cobertura < 0.5 && fuertes === 0) return 0;
  // con tres palabras o más, si no aparece la mitad, el resultado es casualidad
  if (conocidas.length >= 3 && cobertura < 0.5) return 0;
  return total * (0.5 + cobertura) + (cobertura === 1 ? 2 : 0);
}

// Puntos mínimos para mostrar un resultado: 3 con una palabra y 1,5 más por cada palabra, hasta 6 desde tres. Con 3
// fijo, casi cualquier frase larga sobre algo que no hacemos («planta eléctrica pa cuando se va la luz») encontraba
// algo parecido; con 7 fijo se caían frases cortas buenas («citas perdidas»). Elegido con la mitad de desarrollo de
// pruebas/control/bateria.json y las pruebas del buscador (3-oct-2026). Lo que queda entre 3 y el mínimo se pide con
// { minimo: 3 } y se muestra como «lo más parecido que hacemos».
const MINIMO_FRASE = 6;
const MINIMO_PALABRA = 3;
const PASO_PALABRA = 1.5;

// prefijo: true mientras la persona escribe; la última palabra (de 3 letras o más) vale también como comienzo de palabra.
export function buscar(indice, texto, { limite = 8, prefijo = false, minimo } = {}) {
  const palabras = [...new Set(fichas(aplicarEquivalencias(texto, indice.equivalencias), indice.vacias))];
  if (!palabras.length) return [];
  const consulta = palabras.map((q) => [q, fonetica(q)]);
  const ultima = palabras[palabras.length - 1];
  const pre = prefijo && /[a-zñ]$/.test(normalizar(texto)) && ultima.length >= 3 ? ultima : '';
  minimo ??= Math.min(MINIMO_FRASE, MINIMO_PALABRA + PASO_PALABRA * (palabras.length - 1));
  const filas = indice.map((e) => ({ e, m: coincidencias(e, consulta, pre) }));
  const N = filas.length;
  const df = consulta.map((_, i) => filas.filter((f) => f.m[i][0] > 0).length);
  const conocidas = df.map((d) => d > 0);
  const rareza = df.map((d) => (d ? Math.log(N / d) / Math.log(N) : 0));
  const ambigua = palabras.map((q) => Boolean(indice.ambiguas?.has(q)));
  return filas
    .map(({ e, m }) => ({ e, puntos: puntuar(m, conocidas, rareza, ambigua) * (e.tipo === 'servicio' ? 1 : 0.9) }))
    .filter((x) => x.puntos >= minimo)
    .sort((a, b) => b.puntos - a.puntos || a.e.titulo.localeCompare(b.e.titulo))
    .slice(0, limite)
    .map((x) => ({ ...x.e, _fichas: undefined, puntos: Math.round(x.puntos * 10) / 10 }));
}

// Una sola descarga del índice por página aunque lo pidan a la vez el buscador, el catálogo y el diagnóstico (el
// catálogo lo bajaba 8 veces: cada llamada que llegaba antes de terminar la primera abría otra descarga). Si falla,
// se puede volver a intentar.
const descargas = new Map();
export function cargarIndice(url) {
  if (!descargas.has(url)) {
    const d = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`índice ${r.status}`);
        return r.json();
      })
      .then(prepararIndice)
      .catch((e) => {
        descargas.delete(url);
        throw e;
      });
    descargas.set(url, d);
  }
  return descargas.get(url);
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
