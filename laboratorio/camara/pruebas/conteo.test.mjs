import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearContador, calcularAforo } from '../js/nucleo/conteo.mjs';

// Línea vertical en x = 100, de abajo hacia arriba. Con sentido +1, entrar es ir de izquierda a derecha.
const linea = () => crearContador({ a: { x: 100, y: 200 }, b: { x: 100, y: 0 }, sentido: 1, banda: 10, margen: 0 });

function recorrer(c, id, xs, y = 100) {
  return xs.map((x) => c.observar(id, { x, y })).filter(Boolean);
}

test('quien cruza de izquierda a derecha suma una entrada, una sola vez', () => {
  const c = linea();
  const eventos = recorrer(c, 1, [40, 60, 80, 95, 105, 120, 140, 160, 180]);
  assert.deepEqual(eventos, ['entrada']);
  assert.equal(c.entradas, 1);
  assert.equal(c.salidas, 0);
});

test('quien cruza de derecha a izquierda suma una salida', () => {
  const c = linea();
  assert.deepEqual(recorrer(c, 1, [160, 130, 112, 88, 60]), ['salida']);
  assert.equal(c.salidas, 1);
});

test('histéresis: quedarse parado sobre la línea, temblando dentro de la banda, no suma nada', () => {
  const c = linea();
  const temblor = [60, 92, 108, 91, 109, 95, 105, 93, 107, 99, 101, 92, 108];
  assert.deepEqual(recorrer(c, 1, temblor), []);
  assert.equal(c.entradas + c.salidas, 0);
});

test('histéresis: quien se para en la línea y después termina de cruzar suma una vez', () => {
  const c = linea();
  assert.deepEqual(recorrer(c, 1, [50, 70, 95, 104, 96, 103, 97, 105, 130, 150]), ['entrada']);
});

test('sin banda (histéresis apagada) el mismo temblor sí contaría de más', () => {
  // Esta prueba documenta por qué existe la banda: con banda 0 el temblor sobre la línea dispara cruces falsos.
  const c = crearContador({ a: { x: 100, y: 200 }, b: { x: 100, y: 0 }, sentido: 1, banda: 0 });
  const eventos = recorrer(c, 1, [60, 92, 108, 91, 109]);
  assert.ok(eventos.length >= 3);
});

test('entrar, salir y volver a entrar cuenta cada cruce real', () => {
  const c = linea();
  assert.deepEqual(recorrer(c, 1, [50, 150, 50, 150]), ['entrada', 'salida', 'entrada']);
});

test('rodear la línea por fuera de sus puntas no cuenta', () => {
  const c = linea();
  // pasa de x 50 a x 150 por debajo de la punta a (y = 200): la recta cambia de lado pero no el segmento
  const eventos = [
    c.observar(1, { x: 50, y: 260 }),
    c.observar(1, { x: 150, y: 260 }),
  ].filter(Boolean);
  assert.deepEqual(eventos, []);
});

test('una persona que aparece ya del otro lado no cuenta al aparecer', () => {
  const c = linea();
  assert.deepEqual(recorrer(c, 7, [150, 170, 190]), []);
});

test('sentido −1 invierte entradas y salidas', () => {
  const c = crearContador({ a: { x: 100, y: 200 }, b: { x: 100, y: 0 }, sentido: -1, banda: 10 });
  assert.deepEqual(recorrer(c, 1, [40, 160]), ['salida']);
  assert.deepEqual(recorrer(c, 2, [160, 40]), ['entrada']);
});

test('cada pista lleva su propio lado', () => {
  const c = linea();
  c.observar(1, { x: 40, y: 100 });
  c.observar(2, { x: 160, y: 100 });
  assert.equal(c.observar(1, { x: 160, y: 100 }), 'entrada');
  assert.equal(c.observar(2, { x: 40, y: 100 }), 'salida');
});

test('mover la línea olvida los lados y conserva los totales', () => {
  const c = linea();
  recorrer(c, 1, [40, 160]);
  c.observar(2, { x: 40, y: 100 });
  c.moverLinea({ a: { x: 300, y: 200 }, b: { x: 300, y: 0 } });
  assert.equal(c.entradas, 1);
  // La pista 2 estaba a la izquierda de la línea vieja (x 40). Su próxima posición (x 360) queda a la derecha de la
  // nueva: con su lado viejo contaría una entrada que empezó antes de que existiera la línea. Tiene que solo fijar el lado.
  assert.equal(c.observar(2, { x: 360, y: 100 }), null);
  assert.equal(c.entradas, 1);
});

test('olvidar una pista hace que su próxima posición solo fije el lado', () => {
  const c = linea();
  c.observar(1, { x: 40, y: 100 });
  c.olvidar(1);
  assert.equal(c.observar(1, { x: 160, y: 100 }), null);
});

test('el aforo es entradas − salidas + ajuste, sin bajar de cero', () => {
  assert.deepEqual(calcularAforo({ entradas: 5, salidas: 2, ajuste: 0, maximo: 10 }), {
    dentro: 3,
    maximo: 10,
    lleno: false,
    proporcion: 0.3,
  });
  assert.equal(calcularAforo({ entradas: 1, salidas: 4, maximo: 10 }).dentro, 0);
  assert.equal(calcularAforo({ entradas: 1, salidas: 4, ajuste: 5, maximo: 10 }).dentro, 2);
});

test('el aviso de aforo salta al llegar al máximo, no al pasarlo', () => {
  assert.equal(calcularAforo({ entradas: 9, maximo: 10 }).lleno, false);
  assert.equal(calcularAforo({ entradas: 10, maximo: 10 }).lleno, true);
  assert.equal(calcularAforo({ entradas: 12, maximo: 10 }).proporcion, 1);
  assert.equal(calcularAforo({ entradas: 0, maximo: 0 }).maximo, 1, 'un máximo inválido se vuelve 1');
});
