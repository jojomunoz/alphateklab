import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearIntervalos } from '../js/nucleo/intervalos.mjs';

const M = 60_000;
const T0 = Date.UTC(2026, 9, 3, 14, 5, 0); // un minuto exacto

test('cada evento cae en el minuto que le toca, con el borde exacto', () => {
  const iv = crearIntervalos();
  iv.registrar('entrada', T0 + M - 1); // 14:05:59.999
  iv.registrar('entrada', T0 + M); // 14:06:00.000
  iv.registrar('salida', T0 + M + 30_000);
  assert.deepEqual(iv.todos(), [
    { inicio: T0, entradas: 1, salidas: 0 },
    { inicio: T0 + M, entradas: 1, salidas: 1 },
  ]);
});

test('los últimos n minutos salen en orden, con ceros y el minuto en curso marcado', () => {
  const iv = crearIntervalos();
  iv.registrar('entrada', T0);
  iv.registrar('entrada', T0 + 3 * M + 5);
  const u = iv.ultimos(5, T0 + 3 * M + 20_000);
  assert.deepEqual(
    u.map((c) => [c.inicio - T0, c.entradas, c.enCurso]),
    [
      [-M, 0, false],
      [0, 1, false],
      [M, 0, false],
      [2 * M, 0, false],
      [3 * M, 1, true],
    ],
  );
});

test('tipos desconocidos no cuentan', () => {
  const iv = crearIntervalos();
  iv.registrar('pasó', T0);
  assert.deepEqual(iv.todos(), []);
});

test('solo guarda las últimas horas que se le piden', () => {
  const iv = crearIntervalos({ horasGuardadas: 1 }); // 60 minutos
  for (let i = 0; i < 90; i++) iv.registrar('entrada', T0 + i * M);
  const todos = iv.todos();
  assert.equal(todos.length, 60);
  assert.equal(todos[0].inicio, T0 + 30 * M);
});

test('guardar y cargar conserva los minutos; lo roto se descarta', () => {
  const iv = crearIntervalos();
  iv.registrar('entrada', T0);
  iv.registrar('salida', T0 + M);
  const otro = crearIntervalos();
  otro.cargar(JSON.parse(JSON.stringify(iv.serializar())));
  assert.deepEqual(otro.todos(), iv.todos());
  otro.cargar({ abc: [1, 1], [String(T0 + 7)]: [1, 0], [String(T0)]: 'x', [String(T0 + M)]: [-3, 2] });
  assert.deepEqual(otro.todos(), [{ inicio: T0 + M, entradas: 0, salidas: 2 }]);
  otro.cargar(null);
  assert.deepEqual(otro.todos(), []);
});
