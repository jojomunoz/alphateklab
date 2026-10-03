import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { debeAdoptar, estadoInicial, esPartida, hoyISO, leer, MAX_ACCIONES, nuevaPartida, quedaEspacio, reglasValidas, serializar, VERSION } from '../js/nucleo/estado.mjs';
import { T_INICIO } from '../js/nucleo/motor.mjs';
import { REGLAS_POR_DEFECTO } from '../js/nucleo/reglas.mjs';

const bueno = () => ({
  semilla: 20261003,
  acciones: [
    { t: T_INICIO + 600, tipo: 'falla', falla: 'puerta', activa: true },
    { t: T_INICIO + 1200, tipo: 'reglas', reglas: REGLAS_POR_DEFECTO },
  ],
  t: T_INICIO + 3600,
  velocidad: 600,
  ventana: 24,
  baseISO: '2026-10-03',
  sala: 'abcde23456',
  partida: 'k3x9q2m7',
});

test('lo guardado se vuelve a leer igual', () => {
  assert.deepEqual(leer(serializar(bueno())), bueno());
});

test('lo roto o de otra versión se ignora', () => {
  assert.equal(leer('no es json'), null);
  assert.equal(leer('null'), null);
  assert.equal(leer(JSON.stringify({ ...JSON.parse(serializar(bueno())), v: VERSION + 1 })), null);
  const conAccionMala = bueno();
  conAccionMala.acciones.push({ t: T_INICIO, tipo: 'falla', falla: 'meteorito', activa: true });
  assert.equal(leer(serializar(conAccionMala)), null);
  const conReglaMala = bueno();
  conReglaMala.acciones[1].reglas = [{ ...REGLAS_POR_DEFECTO[0], min: 9 }];
  assert.equal(leer(serializar(conReglaMala)), null);
  const accionDelFuturo = bueno();
  accionDelFuturo.acciones[0].t = accionDelFuturo.t + 600;
  assert.equal(leer(serializar(accionDelFuturo)), null);
  assert.equal(leer(serializar({ ...bueno(), t: 15 })), null);
  assert.equal(leer(serializar({ ...bueno(), baseISO: '3 de octubre' })), null);
});

test('preferencias raras vuelven a su valor por defecto', () => {
  const d = leer(serializar({ ...bueno(), velocidad: 7, ventana: 99, sala: '<script>' }));
  assert.equal(d.velocidad, 60);
  assert.equal(d.ventana, 6);
  assert.equal(d.sala, null);
});

test('reglas con ids repetidos no valen', () => {
  assert.equal(reglasValidas(REGLAS_POR_DEFECTO), true);
  assert.equal(reglasValidas([REGLAS_POR_DEFECTO[0], REGLAS_POR_DEFECTO[0]]), false);
});

test('estado inicial y fecha de hoy', () => {
  const e = estadoInicial('2026-10-03');
  assert.equal(e.t, T_INICIO);
  assert.equal(hoyISO(new Date(2026, 0, 5)), '2026-01-05');
});

test('una acción con un momento que no cae en un paso de la simulación no vale', () => {
  const malo = bueno();
  malo.acciones[0].t = T_INICIO + 605;
  assert.equal(leer(serializar(malo)), null);
});

test('el tope de acciones: 600 se leen, 601 no; y quedaEspacio avisa antes de pasarse', () => {
  const muchas = (n) => ({ ...bueno(), acciones: Array.from({ length: n }, (_, i) => ({ t: T_INICIO + 10 * (i % 300), tipo: 'falla', falla: 'fuga', activa: i % 2 === 0 })) });
  assert.equal(MAX_ACCIONES, 600);
  assert.ok(leer(serializar(muchas(600))));
  assert.equal(leer(serializar(muchas(601))), null);
  assert.equal(quedaEspacio(muchas(599).acciones), true);
  assert.equal(quedaEspacio(muchas(600).acciones), false);
});

test('la partida: se guarda, se valida y cambia en cada partida nueva', () => {
  assert.equal(leer(serializar(bueno())).partida, 'k3x9q2m7');
  assert.equal(leer(serializar({ ...bueno(), partida: '<x>' })).partida, null);
  assert.ok(esPartida(nuevaPartida()));
  assert.notEqual(nuevaPartida(), nuevaPartida());
  assert.equal(estadoInicial('2026-10-03', 'aaaa1111').partida, 'aaaa1111');
});

test('dos pestañas: se adopta lo guardado si es otra partida o trae más acciones, nunca lo que trae menos', () => {
  const propio = leer(serializar(bueno()));
  const conMas = leer(serializar({ ...bueno(), acciones: [...bueno().acciones, { t: T_INICIO + 1800, tipo: 'falla', falla: 'fuga', activa: true }] }));
  const conMenos = leer(serializar({ ...bueno(), acciones: bueno().acciones.slice(0, 1) }));
  const otraPartida = leer(serializar({ ...bueno(), acciones: [], partida: 'zzzz9999' }));
  assert.equal(debeAdoptar(propio, conMas), true);
  assert.equal(debeAdoptar(propio, conMenos), false);
  assert.equal(debeAdoptar(propio, leer(serializar(bueno()))), false, 'lo mismo no se adopta (no hay ida y vuelta)');
  assert.equal(debeAdoptar(propio, otraPartida), true);
  assert.equal(debeAdoptar(propio, null), false);
  const sinPartida = leer(serializar({ ...bueno(), partida: null, t: T_INICIO + 600 }));
  assert.equal(debeAdoptar(propio, sinPartida), false, 'lo guardado sin partida (versión anterior) no hace retroceder el reloj');
});
