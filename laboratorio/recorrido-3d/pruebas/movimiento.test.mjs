import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  adelante, derecha, rumboAYaw, yawARumbo, accionDeTecla, intencionDesdeAcciones, intencionDesdeJoystick,
  sumarIntenciones, paso, girarMirada, fovVertical, anguloFlechaMinimapa, VELOCIDAD, PITCH_MAX, diferenciaAngulo,
  suavizarMover, intencionQuieta,
} from '../js/nucleo/movimiento.mjs';

const cerca = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);

test('yaw 0 mira hacia arriba del plano; rumbo 90 mira a la derecha', () => {
  const f = adelante(0);
  cerca(f.x, 0); cerca(f.y, -1);
  const e = adelante(rumboAYaw(90));
  cerca(e.x, 1); cerca(e.y, 0);
  const r = derecha(0);
  cerca(r.x, 1); cerca(r.y, 0);
  cerca(yawARumbo(rumboAYaw(135)), 135);
});

test('teclas: WASD y flechas; las flechas laterales giran', () => {
  assert.equal(accionDeTecla('KeyW'), 'adelante');
  assert.equal(accionDeTecla('ArrowUp'), 'adelante');
  assert.equal(accionDeTecla('ArrowLeft'), 'girarIzquierda');
  assert.equal(accionDeTecla('KeyA'), 'izquierda');
  assert.equal(accionDeTecla('KeyZ'), null);
  const i = intencionDesdeAcciones(new Set(['adelante', 'derecha', 'girarIzquierda']));
  assert.deepEqual(i, { avance: 1, lateral: 1, giro: -1, correr: false });
  assert.ok(intencionQuieta(intencionDesdeAcciones(new Set(['adelante', 'atras']))));
});

test('joystick: arriba avanza, zona muerta en el centro, tope en el radio', () => {
  const i = intencionDesdeJoystick(0, -60, 60);
  cerca(i.avance, 1); cerca(i.lateral, 0);
  const quieto = intencionDesdeJoystick(3, 2, 60);
  assert.ok(intencionQuieta(quieto));
  const lejos = intencionDesdeJoystick(200, 0, 60);
  cerca(lejos.lateral, 1);
  // A medio radio no va a media velocidad: la zona muerta (12 %) se descuenta y el resto se reparte.
  cerca(intencionDesdeJoystick(0, -30, 60).avance, (0.5 - 0.12) / 0.88, 1e-9);
});

test('sumar intenciones limita a [-1, 1]', () => {
  const s = sumarIntenciones({ avance: 1, lateral: 0.5, giro: 0, correr: false }, { avance: 0.8, lateral: 0.7, giro: 0, correr: true });
  assert.deepEqual(s, { avance: 1, lateral: 1, giro: 0, correr: true });
});

test('un paso sin paredes avanza a la velocidad de una persona', () => {
  const e = paso({ x: 0, y: 0, yaw: 0, pitch: 0 }, { avance: 1, lateral: 0, giro: 0, correr: false }, 0.1, []);
  cerca(e.x, 0); cerca(e.y, -VELOCIDAD * 0.1, 1e-9);
});

test('avanzar en diagonal no es más rápido que derecho', () => {
  const e = paso({ x: 0, y: 0, yaw: 0, pitch: 0 }, { avance: 1, lateral: 1, giro: 0, correr: false }, 0.1, []);
  cerca(Math.hypot(e.x, e.y), VELOCIDAD * 0.1, 1e-9);
});

test('un dt enorme (pestaña que vuelve) se limita a 0.1 s', () => {
  const e = paso({ x: 0, y: 0, yaw: 0, pitch: 0 }, { avance: 1, lateral: 0, giro: 0, correr: false }, 5, []);
  cerca(Math.hypot(e.x, e.y), VELOCIDAD * 0.1, 1e-9);
});

test('girar a la derecha con la flecha baja el yaw', () => {
  const e = paso({ x: 0, y: 0, yaw: 0, pitch: 0 }, { avance: 0, lateral: 0, giro: 1, correr: false }, 0.1, []);
  assert.ok(e.yaw < 0);
});

test('caminar 3 s contra una pared se queda del lado de adentro', () => {
  const pared = [{ a: { x: -5, y: 0 }, b: { x: 5, y: 0 }, medio: 0.1 }];
  let e = { x: 0, y: 2, yaw: 0, pitch: 0 };
  for (let i = 0; i < 180; i++) e = paso(e, { avance: 1, lateral: 0, giro: 0, correr: true }, 1 / 60, pared);
  assert.ok(e.y >= 0.35 - 1e-9, `atravesó o se metió: y=${e.y}`);
});

test('mirar: arrastrar a la derecha gira a la derecha y la cabeza no pasa de ±80°', () => {
  const e = girarMirada({ x: 0, y: 0, yaw: 0, pitch: 0 }, 100, 0, 0.003);
  assert.ok(e.yaw < 0);
  const arriba = girarMirada({ x: 0, y: 0, yaw: 0, pitch: 0 }, 0, -100000, 0.003);
  cerca(arriba.pitch, PITCH_MAX);
});

test('fov vertical: en un teléfono vertical se abre para ver lo mismo de lado, con topes de 50° y 95°', () => {
  const ancho = fovVertical(16 / 10);
  const vertical = fovVertical(390 / 480);
  assert.ok(vertical > ancho);
  assert.ok(vertical <= 95 && ancho >= 50);
  assert.equal(fovVertical(0.4), 95, 'una pantalla muy angosta pediría 129°: se queda en 95°');
  assert.equal(fovVertical(4), 50, 'una muy ancha pediría 24°: se queda en 50°');
});

test('flecha del minimapa: yaw −90° se dibuja girada 90° (hacia la derecha)', () => {
  cerca(anguloFlechaMinimapa(rumboAYaw(90)), 90);
});

test('diferencia de ángulo por el camino corto y curva de movimiento', () => {
  cerca(diferenciaAngulo(0.1, 2 * Math.PI - 0.1), -0.2, 1e-9);
  cerca(suavizarMover(0), 0); cerca(suavizarMover(1), 1); cerca(suavizarMover(0.5), 0.5);
});
