import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearEscena, medidasDeLinea } from '../js/nucleo/escena.mjs';
import { configPorDefecto, conteoVacio } from '../js/nucleo/estado.mjs';

// Escenas sintéticas sobre un cuadro de 960 × 540, con la configuración de ejemplo del video de muestra:
// línea vertical en x = 480 (de y 518 a y 162), entrar = cruzar de izquierda a derecha.
const W = 960;
const H = 540;
const T0 = new Date(2026, 9, 3, 14, 5, 0).getTime();
const persona = (cx, pieY = 450, w = 60, h = 200) => ({ x: cx - w / 2, y: pieY - h, w, h, puntaje: 0.8 });

function escena(cambios = {}) {
  return crearEscena({ ancho: W, alto: H, config: { ...configPorDefecto('muestra'), ...cambios }, conteo: conteoVacio('2026-10-03') });
}

/** Reproduce cuadros: cada cuadro es la lista de personas (centros x) visibles; 10 cuadros por segundo. */
function reproducir(e, cuadros, { desde = T0, paso = 100 } = {}) {
  const eventos = [];
  const cambios = [];
  let ultimo;
  cuadros.forEach((dets, i) => {
    ultimo = e.procesar(dets, desde + i * paso);
    eventos.push(...ultimo.eventos.map((ev) => ev.tipo));
    if (ultimo.cambios.aforo) cambios.push('aforo:' + ultimo.cambios.aforo);
    if (ultimo.cambios.fila) cambios.push('fila:' + ultimo.cambios.fila);
  });
  return { eventos, cambios, ultimo };
}

const caminar = (desde, hasta, pasos, pieY) =>
  Array.from({ length: pasos }, (_, i) => [persona(desde + ((hasta - desde) * i) / (pasos - 1), pieY)]);

test('la banda de histéresis y el margen crecen con el tamaño del cuadro', () => {
  const m = medidasDeLinea(960, 540);
  assert.ok(m.banda > 20 && m.banda < 23);
  assert.ok(medidasDeLinea(1920, 1080).banda > m.banda);
  assert.equal(medidasDeLinea(10, 10).banda, 4, 'nunca menos de 4 px');
});

test('una persona cruza la línea hacia la derecha: una entrada, en su minuto', () => {
  const e = escena();
  const { eventos, ultimo } = reproducir(e, caminar(250, 720, 25));
  assert.deepEqual(eventos, ['entrada']);
  assert.equal(ultimo.cifras.entradas, 1);
  assert.equal(ultimo.cifras.dentro, 1);
  assert.deepEqual(e.intervalos.todos(), [{ inicio: T0, entradas: 1, salidas: 0 }]);
});

test('dos personas en sentidos contrarios: una entrada y una salida', () => {
  const e = escena();
  const cuadros = Array.from({ length: 25 }, (_, i) => [persona(250 + i * 20, 450), persona(730 - i * 20, 380)]);
  const { eventos, ultimo } = reproducir(e, cuadros);
  assert.deepEqual(eventos.sort(), ['entrada', 'salida']);
  assert.equal(ultimo.cifras.dentro, 0, 'la salida de alguien que no vimos entrar deja el aforo en cero');
});

test('alguien parado sobre la línea durante 10 s no suma nada', () => {
  const e = escena();
  const cuadros = Array.from({ length: 100 }, (_, i) => [persona(480 + (i % 2 ? 9 : -9), 450)]);
  assert.deepEqual(reproducir(e, cuadros).eventos, []);
});

test('quien pasa por debajo de la punta de la línea (fuera del segmento) no cuenta', () => {
  const e = escena({ linea: { a: { x: 0.5, y: 0.6 }, b: { x: 0.5, y: 0.1 } } }); // el segmento termina en y = 324 + margen
  assert.deepEqual(reproducir(e, caminar(250, 720, 25, 520)).eventos, []);
});

test('si el video vuelve a empezar, nadie «cruza» por saltar de un lado al otro', () => {
  const e = escena();
  reproducir(e, caminar(503, 506, 10)); // termina justo a la derecha de la banda
  e.reiniciarPistas(); // el video vuelve al principio
  const { eventos } = reproducir(e, caminar(456, 450, 10), { desde: T0 + 1000 }); // y alguien aparece cerca, a la izquierda
  assert.deepEqual(eventos, []);
});

test('sin reiniciar las pistas, ese mismo salto sí contaría de más (por eso existe reiniciarPistas)', () => {
  const e = escena();
  reproducir(e, caminar(503, 506, 10));
  const { eventos } = reproducir(e, caminar(456, 450, 10), { desde: T0 + 1000 });
  assert.deepEqual(eventos, ['salida']);
});

test('el aforo avisa al llenarse y al liberarse', () => {
  const e = escena({ aforoMax: 2 });
  const ida = (pieY) => caminar(250, 720, 25, pieY);
  let r = reproducir(e, ida(450));
  assert.deepEqual(r.cambios, []);
  r = reproducir(e, ida(440), { desde: T0 + 10_000 });
  assert.deepEqual(r.cambios, ['aforo:lleno']);
  assert.equal(r.ultimo.cifras.lleno, true);
  r = reproducir(e, caminar(720, 250, 25, 430), { desde: T0 + 20_000 });
  assert.deepEqual(r.cambios, ['aforo:libre']);
  assert.equal(r.ultimo.cifras.maximo, 2, 'el máximo del día queda en 2');
});

test('la zona de fila avisa cuando hay más de N personas por S segundos', () => {
  // zona de ejemplo: x 0.62–0.99, y 0.45–0.72 → x 595–950, y 243–389. Más de 2 personas por 2 s.
  const e = escena();
  const parados = [persona(640, 370), persona(740, 380), persona(860, 360)];
  const cuadros = Array.from({ length: 40 }, () => parados.map((p) => ({ ...p })));
  const { cambios, ultimo } = reproducir(e, cuadros);
  assert.deepEqual(cambios, ['fila:abre']);
  assert.equal(ultimo.cifras.enFila, 3);
  assert.equal(ultimo.cifras.avisosFila, 1);
  // se van: tras 3 s sin exceso, se cierra
  const vacios = Array.from({ length: 50 }, () => []);
  assert.deepEqual(reproducir(e, vacios, { desde: T0 + 4000 }).cambios, ['fila:cierra']);
});

test('una detección suelta de un solo cuadro dentro de la zona no cuenta en la fila', () => {
  const e = escena();
  const dos = () => [persona(640, 370), persona(740, 380)];
  reproducir(e, Array.from({ length: 5 }, dos));
  // en un cuadro, el modelo ve una tercera «persona» (un reflejo, una sombra) que no vuelve a aparecer
  const r = e.procesar([...dos(), persona(860, 360)], T0 + 600);
  assert.equal(r.cifras.enFila, 2);
});

test('una escena de otro tamaño no borra el mapa de calor guardado', () => {
  // un video vertical de 360 × 640 guarda un calor de 48 × 85; antes de abrir el video, la página crea una escena
  // provisional de 960 × 540 (48 × 27) que no lo puede cargar
  const vertical = crearEscena({ ancho: 360, alto: 640, config: configPorDefecto('muestra'), conteo: conteoVacio('2026-10-03') });
  for (let i = 0; i < 20; i++) vertical.procesar([persona(180, 400, 60, 200)], T0 + i * 100);
  const guardado = JSON.parse(JSON.stringify(vertical.exportarConteo()));
  assert.equal(guardado.calor.filas, 85);
  const provisional = crearEscena({ ancho: W, alto: H, config: configPorDefecto('muestra'), conteo: guardado });
  const reexportado = JSON.parse(JSON.stringify(provisional.exportarConteo()));
  assert.deepEqual(reexportado.calor, guardado.calor, 'lo que no pudo cargar lo devuelve igual');
  const otraVez = crearEscena({ ancho: 360, alto: 640, config: configPorDefecto('muestra'), conteo: reexportado });
  assert.ok(Math.abs(otraVez.calor.total - vertical.calor.total) < 0.5, `al volver al video vertical: ${otraVez.calor.total}`);
  // reiniciar el conteo sí lo borra
  provisional.reiniciarConteo();
  assert.equal(provisional.exportarConteo().calor.filas, 27);
  assert.equal(provisional.exportarConteo().calor.valores.every((v) => v === 0), true);
});

test('cifras().filaLleva dice cuántos segundos de escena lleva abierto el aviso de fila', () => {
  const e = escena();
  const parados = () => [persona(640, 370), persona(740, 380), persona(860, 360)];
  reproducir(e, Array.from({ length: 30 }, parados)); // 3 s: se abre hacia los 2,1 s
  const c = e.cifras();
  assert.equal(c.filaActiva, true);
  assert.ok(c.filaLleva > 0.5 && c.filaLleva < 1, `lleva ${c.filaLleva}`);
  assert.equal(escena().cifras().filaLleva, null, 'sin aviso abierto: null');
});

test('dos personas en la zona (no más de 2) no disparan el aviso', () => {
  const e = escena();
  const cuadros = Array.from({ length: 60 }, () => [persona(640, 370), persona(740, 380)]);
  assert.deepEqual(reproducir(e, cuadros).cambios, []);
});

test('el mapa de calor suma el tiempo donde la gente se queda', () => {
  const e = escena();
  const cuadros = Array.from({ length: 31 }, () => [persona(240, 270)]); // 3 s parado en x 0.25, y 0.5
  reproducir(e, cuadros);
  assert.ok(Math.abs(e.calor.total - 3) < 1e-6, `suma ${e.calor.total}`);
  const col = Math.floor(0.25 * e.calor.columnas);
  const fila = Math.floor(0.5 * e.calor.filas);
  assert.equal(e.calor.normalizado(col, fila), 1);
});

test('un hueco largo entre cuadros no infla el mapa de calor (se cuentan como mucho 0,5 s)', () => {
  const e = escena();
  e.procesar([persona(240, 270)], T0);
  e.procesar([persona(240, 270)], T0 + 100);
  e.procesar([persona(240, 270)], T0 + 700); // la pista sigue viva; pasaron 600 ms
  assert.ok(Math.abs(e.calor.total - 0.6) < 1e-6, `suma ${e.calor.total}`);
});

test('corregir a mano: + suma dentro, − nunca baja de cero', () => {
  const e = escena({ aforoMax: 3 });
  let r = e.ajustarDentro(+2);
  assert.equal(r.cifras.dentro, 2);
  r = e.ajustarDentro(+1);
  assert.equal(r.cambios.aforo, 'lleno');
  for (let i = 0; i < 6; i++) r = e.ajustarDentro(-1);
  assert.equal(r.cifras.dentro, 0);
  r = e.ajustarDentro(+1);
  assert.equal(r.cifras.dentro, 1, 'después de bajar a cero, un + vuelve a sumar de inmediato');
});

test('cambiar el sentido de la línea convierte las entradas siguientes en salidas', () => {
  const e = escena();
  reproducir(e, caminar(250, 720, 25));
  e.configurar({ ...e.config, sentido: -1 });
  const { eventos } = reproducir(e, caminar(250, 720, 25, 430), { desde: T0 + 10_000 });
  assert.deepEqual(eventos, ['salida']);
});

test('reiniciar el conteo deja todo en cero y sigue contando', () => {
  const e = escena();
  reproducir(e, caminar(250, 720, 25));
  const cifras = e.reiniciarConteo();
  assert.equal(cifras.entradas, 0);
  assert.equal(e.calor.total, 0);
  assert.deepEqual(e.intervalos.todos(), []);
  const { eventos } = reproducir(e, caminar(250, 720, 25, 420), { desde: T0 + 10_000 });
  assert.deepEqual(eventos, ['entrada']);
});

test('exportar y volver a crear la escena conserva el conteo del día', () => {
  const e = escena();
  reproducir(e, caminar(250, 720, 25));
  const guardado = JSON.parse(JSON.stringify(e.exportarConteo()));
  const f = crearEscena({ ancho: W, alto: H, config: configPorDefecto('muestra'), conteo: guardado });
  assert.equal(f.cifras().entradas, 1);
  assert.equal(f.cifras().maximo, 1);
  assert.deepEqual(f.intervalos.todos(), e.intervalos.todos());
  assert.ok(Math.abs(f.calor.total - e.calor.total) < 0.5);
});

test('sin zona de fila (borrada), no hay cuenta de fila ni aviso', () => {
  const e = escena({ zona: null });
  const cuadros = Array.from({ length: 40 }, () => [persona(640, 370), persona(740, 380), persona(860, 360)]);
  const { cambios, ultimo } = reproducir(e, cuadros);
  assert.deepEqual(cambios, []);
  assert.equal(ultimo.cifras.enFila, null);
});
