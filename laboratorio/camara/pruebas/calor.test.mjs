import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMapaDeCalor, colorDeCalor } from '../js/nucleo/calor.mjs';

const cerca = (a, b) => Math.abs(a - b) < 1e-6;

test('el tiempo de una observación en el centro se reparte entero entre 9 celdas', () => {
  const m = crearMapaDeCalor(10, 10);
  assert.equal(m.sumar(0.55, 0.55, 2), true);
  assert.ok(cerca(m.total, 2));
  assert.ok(cerca(m.valor(5, 5), (2 * 4) / 16), 'la celda del punto recibe 4/16');
  assert.ok(cerca(m.valor(4, 5), (2 * 2) / 16), 'las vecinas de lado reciben 2/16');
  assert.ok(cerca(m.valor(4, 4), (2 * 1) / 16), 'las de esquina reciben 1/16');
  assert.equal(m.valor(2, 2), 0);
});

test('en el borde, lo que cae fuera de la cuadrícula se pierde', () => {
  const m = crearMapaDeCalor(10, 10);
  m.sumar(0, 0, 16);
  assert.ok(cerca(m.total, 4 + 2 + 2 + 1), 'solo 9 de 16 partes caen dentro');
  m.sumar(1, 1, 16); // x = 1 cae en la última columna, no fuera
  assert.ok(m.valor(9, 9) > 0);
});

test('lo que cae fuera del cuadro o con tiempo cero se ignora', () => {
  const m = crearMapaDeCalor(10, 10);
  assert.equal(m.sumar(-0.1, 0.5, 1), false);
  assert.equal(m.sumar(0.5, 1.2, 1), false);
  assert.equal(m.sumar(0.5, 0.5, 0), false);
  assert.equal(m.sumar(Number.NaN, 0.5, 1), false);
  assert.equal(m.total, 0);
});

test('la escala va de 0 a 1 contra la celda con más tiempo', () => {
  const m = crearMapaDeCalor(10, 10);
  m.sumar(0.25, 0.25, 1);
  m.sumar(0.75, 0.75, 3);
  assert.ok(cerca(m.normalizado(7, 7), 1));
  assert.ok(cerca(m.normalizado(2, 2), 1 / 3));
  assert.equal(m.normalizado(0, 9), 0);
});

test('guardar y cargar devuelve el mismo mapa (con un decimal)', () => {
  const m = crearMapaDeCalor(8, 5);
  m.sumar(0.3, 0.4, 5);
  m.sumar(0.8, 0.6, 1.25);
  const guardado = JSON.parse(JSON.stringify(m.serializar()));
  const n = crearMapaDeCalor(8, 5);
  assert.equal(n.cargar(guardado), true);
  for (let f = 0; f < 5; f++) for (let c = 0; c < 8; c++) assert.ok(Math.abs(n.valor(c, f) - m.valor(c, f)) <= 0.05);
});

test('un mapa guardado con otra cuadrícula o con datos rotos no se carga', () => {
  const m = crearMapaDeCalor(8, 5);
  assert.equal(m.cargar({ columnas: 9, filas: 5, valores: new Array(45).fill(1) }), false);
  assert.equal(m.cargar({ columnas: 8, filas: 5, valores: [1, 2] }), false);
  assert.equal(m.cargar(null), false);
  assert.equal(m.cargar({ columnas: 8, filas: 5, valores: new Array(40).fill('x') }), true, 'valores no numéricos quedan en cero');
  assert.equal(m.maximo, 0);
});

test('el color: transparente sin visitas y cada vez más opaco con más tiempo', () => {
  assert.deepEqual(colorDeCalor(0), [0, 0, 0, 0]);
  let alfaPrevio = -1;
  for (let v = 0.05; v <= 1.0001; v += 0.05) {
    const [, , , a] = colorDeCalor(v);
    assert.ok(a > alfaPrevio, `alfa crece en ${v.toFixed(2)}`);
    alfaPrevio = a;
  }
  assert.deepEqual(colorDeCalor(2), colorDeCalor(1), 'fuera de escala se recorta a 1');
});
