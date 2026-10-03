// Prueba con datos reales: las detecciones de MediaPipe (EfficientDet-Lite0) sobre los 375 cuadros del video de
// muestra, guardadas en datos/muestra-detecciones.json, contra los cruces contados a mano en datos/muestra-verdad.json.
// Fija la precisión que la página dice tener y avisa si un cambio en el seguimiento o el conteo la empeora.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { crearEscena } from '../js/nucleo/escena.mjs';
import { configPorDefecto, conteoVacio } from '../js/nucleo/estado.mjs';
import { crearRelojDeVideo } from '../js/nucleo/reloj.mjs';

const leer = (n) => JSON.parse(readFileSync(new URL(`./datos/${n}`, import.meta.url), 'utf8'));
const datos = leer('muestra-detecciones.json');
const verdad = leer('muestra-verdad.json');
const VERDAD = [...verdad.salidas.map((t) => ({ t, tipo: 'salida' })), ...verdad.entradas.map((t) => ({ t, tipo: 'entrada' }))];

const firma = (b64) => (b64 ? Float32Array.from(Buffer.from(b64, 'base64'), (v) => v / 255) : undefined);
const cuadros = datos.cuadros.map((c) => c.map(([x, y, w, h, puntaje, f]) => ({ x, y, w, h, puntaje, firma: firma(f) })));
const MS_CUADRO = 1000 / datos.fps;

/** Reproduce el video analizando uno de cada `paso` cuadros, `vueltas` veces (como la demo, que lo repite). */
function reproducir({ paso = 1, desfase = 0, vueltas = 1, config = {} } = {}) {
  const e = crearEscena({ ancho: datos.ancho, alto: datos.alto, config: { ...configPorDefecto('muestra'), ...config }, conteo: conteoVacio('x') });
  const eventos = [];
  const cambios = [];
  for (let v = 0; v < vueltas; v++) {
    e.reiniciarPistas();
    for (let i = desfase; i < cuadros.length; i += paso) {
      const t = (v * cuadros.length + i) * MS_CUADRO;
      const r = e.procesar(cuadros[i], t);
      for (const ev of r.eventos) eventos.push({ t: t / 1000, tipo: ev.tipo });
      if (r.cambios.aforo) cambios.push({ t: t / 1000, que: 'aforo:' + r.cambios.aforo });
      if (r.cambios.fila) cambios.push({ t: t / 1000, que: 'fila:' + r.cambios.fila });
    }
  }
  return { e, eventos, cambios };
}

/** Empareja cada evento con un cruce real del mismo tipo a ±0,8 s (el más cercano y sin repetir). */
function comparar(eventos) {
  const libres = VERDAD.map((v) => ({ ...v, usado: false }));
  let acertados = 0;
  let deMas = 0;
  for (const ev of eventos) {
    let mejor = null;
    for (const v of libres) {
      if (v.usado || v.tipo !== ev.tipo || Math.abs(v.t - ev.t) > 0.8) continue;
      if (!mejor || Math.abs(v.t - ev.t) < Math.abs(mejor.t - ev.t)) mejor = v;
    }
    if (mejor) {
      mejor.usado = true;
      acertados++;
    } else deMas++;
  }
  return { acertados, deMas, perdidos: VERDAD.length - acertados };
}

test('la verdad contada a mano tiene 23 cruces: 9 entradas y 14 salidas', () => {
  assert.equal(VERDAD.length, 23);
  assert.equal(verdad.entradas.length, 9);
  assert.equal(cuadros.length, 375);
});

test('con 12,5 análisis por segundo de video (lo que busca la demo): 14 de 23 cruces y como mucho 1 inventado', () => {
  for (const desfase of [0, 1]) {
    const r = comparar(reproducir({ paso: 2, desfase }).eventos);
    assert.ok(r.acertados >= 14, `desfase ${desfase}: acertó ${r.acertados} de 23`);
    assert.ok(r.deMas <= 1, `desfase ${desfase}: inventó ${r.deMas}`);
  }
  assert.deepEqual(comparar(reproducir({ paso: 2 }).eventos), { acertados: 14, deMas: 0, perdidos: 9 });
});

test('con todos los cuadros (25 por segundo) no empeora: al menos 13 de 23 y como mucho 1 inventado', () => {
  const r = comparar(reproducir({ paso: 1 }).eventos);
  assert.ok(r.acertados >= 13, `acertó ${r.acertados}`);
  assert.ok(r.deMas <= 1, `inventó ${r.deMas}`);
});

test('con pocos análisis por segundo pierde más cruces (por eso el video se desacelera)', () => {
  const lento = comparar(reproducir({ paso: 5 }).eventos); // 5 por segundo
  const bien = comparar(reproducir({ paso: 2 }).eventos);
  assert.ok(lento.acertados < bien.acertados, `a 5/s acertó ${lento.acertados}, a 12,5/s ${bien.acertados}`);
});

test('en cada vuelta del video se abre y se cierra una vez el aviso de fila (zona de ejemplo)', () => {
  for (const paso of [2, 3]) {
    const { cambios } = reproducir({ paso, vueltas: 2 });
    const fila = cambios.filter((c) => c.que.startsWith('fila'));
    assert.deepEqual(
      fila.map((c) => c.que),
      ['fila:abre', 'fila:cierra', 'fila:abre', 'fila:cierra'],
      `paso ${paso}: ${JSON.stringify(fila)}`,
    );
  }
});

test('en cada vuelta del video se llena el aforo de ejemplo (4 personas) y se vuelve a liberar', () => {
  for (const paso of [2, 3]) {
    const { cambios } = reproducir({ paso, vueltas: 2 });
    const aforo = cambios.filter((c) => c.que.startsWith('aforo')).map((c) => c.que);
    assert.deepEqual(aforo, ['aforo:lleno', 'aforo:libre', 'aforo:lleno', 'aforo:libre'], `paso ${paso}`);
  }
});

test('sin la firma de colores, el seguimiento no mejora (la firma no es decorativa)', () => {
  const sinFirma = cuadros.map((c) => c.map(({ firma: _, ...resto }) => resto));
  const e = crearEscena({ ancho: datos.ancho, alto: datos.alto, config: configPorDefecto('muestra'), conteo: conteoVacio('x') });
  const eventos = [];
  for (let i = 0; i < sinFirma.length; i += 2) for (const ev of e.procesar(sinFirma[i], i * MS_CUADRO).eventos) eventos.push({ t: (i * MS_CUADRO) / 1000, tipo: ev.tipo });
  const r = comparar(eventos);
  const conFirma = comparar(reproducir({ paso: 2 }).eventos);
  assert.ok(r.acertados <= conFirma.acertados, `sin firma ${r.acertados}, con firma ${conFirma.acertados}`);
});

/**
 * Como la página: el video va a `velocidad` (1, 0,5 o 0,25 si el equipo no alcanza), se analiza uno de cada `paso`
 * cuadros, la escena recibe el tiempo del video (reloj de video, que sigue creciendo al repetirse) y los minutos, la
 * hora de reloj. Con `relojEnEscena` se reproduce el error de antes: la escena medía en tiempo de reloj.
 */
function enLaPagina({ paso, velocidad, vueltas = 3, relojEnEscena = false }) {
  const e = crearEscena({ ancho: datos.ancho, alto: datos.alto, config: configPorDefecto('muestra'), conteo: conteoVacio('x') });
  const reloj = crearRelojDeVideo();
  const T0 = Date.UTC(2026, 9, 3, 14, 0, 0);
  const fila = [];
  const aforo = [];
  for (let v = 0; v < vueltas; v++) {
    e.reiniciarPistas(); // el video volvió a empezar
    for (let i = 0; i < cuadros.length; i += paso) {
      const tVideo = reloj.leer(i / datos.fps);
      const tReloj = T0 + tVideo / velocidad;
      const r = e.procesar(cuadros[i].filter((c) => c.puntaje >= 0.3), relojEnEscena ? tReloj : tVideo, tReloj);
      if (r.cambios.fila) fila.push(r.cambios.fila);
      if (r.cambios.aforo) aforo.push(r.cambios.aforo);
    }
  }
  return { e, fila, aforo };
}

test('a cualquier velocidad del video y con 12,5 a 25 análisis por segundo de video, cada vuelta abre y cierra una vez el aviso de fila', () => {
  for (const velocidad of [1, 0.5, 0.25]) {
    for (const paso of [1, 2]) {
      const { fila } = enLaPagina({ paso, velocidad });
      assert.deepEqual(fila, ['abre', 'cierra', 'abre', 'cierra', 'abre', 'cierra'], `video a ${velocidad}×, paso ${paso}`);
    }
  }
});

test('con 8 análisis por segundo de video (paso 3) también abre y cierra en cada vuelta', () => {
  assert.deepEqual(enLaPagina({ paso: 3, velocidad: 0.25 }).fila, ['abre', 'cierra', 'abre', 'cierra', 'abre', 'cierra']);
});

test('el mapa de calor suma segundos de video: no sale ×4 cuando el video va a 0,25×', () => {
  const normal = enLaPagina({ paso: 2, velocidad: 1, vueltas: 1 }).e.calor.total;
  const lento = enLaPagina({ paso: 2, velocidad: 0.25, vueltas: 1 }).e.calor.total;
  assert.ok(Math.abs(lento - normal) < 1e-6, `a 1×: ${normal.toFixed(1)} s; a 0,25×: ${lento.toFixed(1)} s`);
  // y así se veía el error de antes, con la escena en tiempo de reloj
  const antes = enLaPagina({ paso: 2, velocidad: 0.25, vueltas: 1, relojEnEscena: true }).e.calor.total;
  assert.ok(antes > 3 * normal, `en tiempo de reloj: ${antes.toFixed(1)} s`);
});

test('las entradas y salidas caen en el minuto del reloj, no en el del video', () => {
  const { e } = enLaPagina({ paso: 2, velocidad: 0.25, vueltas: 1 });
  // 15 s de video a 0,25× son 60 s de reloj: los cruces se reparten en el minuto 14:00 (y nada más allá de 14:01)
  const minutos = e.intervalos.todos().map((c) => (c.inicio - Date.UTC(2026, 9, 3, 14, 0, 0)) / 60_000);
  assert.ok(minutos.length >= 1 && minutos.every((m) => m === 0 || m === 1), JSON.stringify(minutos));
});
