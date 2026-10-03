import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cruz,
  distanciaFirmada,
  normalDerecha,
  alargarSegmento,
  segmentosSeCortan,
  cruceDeSegmento,
  puntoEnPoligono,
  areaPoligono,
  iou,
  puntoDeApoyo,
  centro,
} from '../js/nucleo/geometria.mjs';

// Línea vertical de abajo (a) hacia arriba (b), como la de ejemplo: su derecha en pantalla es x mayor.
const A = { x: 100, y: 200 };
const B = { x: 100, y: 0 };

test('con y hacia abajo, el lado positivo de a→b es la derecha en pantalla', () => {
  assert.ok(cruz(A, B, { x: 150, y: 100 }) > 0, 'x mayor queda a la derecha de una línea que sube');
  assert.ok(cruz(A, B, { x: 50, y: 100 }) < 0);
  assert.equal(cruz(A, B, { x: 100, y: 50 }), 0);
  // línea que va a la derecha: su derecha en pantalla es abajo (y mayor)
  assert.ok(cruz({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 5 }) > 0);
});

test('la distancia con signo está en las mismas unidades que los puntos', () => {
  assert.equal(distanciaFirmada({ x: 130, y: 77 }, A, B), 30);
  assert.equal(distanciaFirmada({ x: 90, y: 77 }, A, B), -10);
  assert.equal(distanciaFirmada({ x: 5, y: 5 }, A, A), 0, 'una línea de largo cero no rompe nada');
});

test('la normal apunta al lado positivo y mide 1', () => {
  const n = normalDerecha(A, B);
  assert.deepEqual(n, { x: 1, y: 0 });
  const m = normalDerecha({ x: 0, y: 0 }, { x: 3, y: 4 });
  assert.ok(Math.abs(Math.hypot(m.x, m.y) - 1) < 1e-12);
  assert.ok(cruz({ x: 0, y: 0 }, { x: 3, y: 4 }, m) > 0);
});

test('alargar un segmento mueve cada punta hacia afuera', () => {
  const [a, b] = alargarSegmento(A, B, 10);
  assert.deepEqual(a, { x: 100, y: 210 });
  assert.deepEqual(b, { x: 100, y: -10 });
});

test('cruce con sentido: +1 de izquierda a derecha, −1 al revés', () => {
  assert.equal(cruceDeSegmento({ x: 60, y: 100 }, { x: 140, y: 100 }, A, B), 1);
  assert.equal(cruceDeSegmento({ x: 140, y: 100 }, { x: 60, y: 100 }, A, B), -1);
});

test('no hay cruce si el recorrido no atraviesa el segmento o se queda de un lado', () => {
  assert.equal(cruceDeSegmento({ x: 60, y: 300 }, { x: 140, y: 300 }, A, B), 0, 'pasa por debajo de la punta a');
  assert.equal(cruceDeSegmento({ x: 60, y: 100 }, { x: 80, y: 120 }, A, B), 0, 'se queda a la izquierda');
  assert.equal(cruceDeSegmento({ x: 60, y: 100 }, { x: 100, y: 100 }, A, B), 0, 'llega justo a la línea, no la pasa');
});

test('segmentos que se cortan, que se tocan en una punta y que son paralelos', () => {
  assert.equal(segmentosSeCortan({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 }), true);
  assert.equal(segmentosSeCortan({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }), true);
  assert.equal(segmentosSeCortan({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 1 }, { x: 10, y: 1 }), false);
  assert.equal(segmentosSeCortan({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 9, y: 0 }), false, 'colineales separados');
  assert.equal(segmentosSeCortan({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 5, y: 0 }, { x: 9, y: 0 }), true, 'colineales solapados');
});

test('punto en polígono, también en uno cóncavo', () => {
  const cuadrado = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  assert.equal(puntoEnPoligono({ x: 5, y: 5 }, cuadrado), true);
  assert.equal(puntoEnPoligono({ x: 15, y: 5 }, cuadrado), false);
  assert.equal(puntoEnPoligono({ x: -1, y: -1 }, cuadrado), false);
  // una «U»: el hueco del medio queda fuera
  const u = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 7 },
    { x: 7, y: 7 },
    { x: 7, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  assert.equal(puntoEnPoligono({ x: 5, y: 3 }, u), false, 'en el hueco de la U');
  assert.equal(puntoEnPoligono({ x: 1, y: 3 }, u), true, 'en un brazo de la U');
  assert.equal(puntoEnPoligono({ x: 5, y: 9 }, u), true, 'en la base de la U');
  assert.equal(puntoEnPoligono({ x: 1, y: 1 }, [{ x: 0, y: 0 }, { x: 2, y: 2 }]), false, 'menos de 3 vértices no es zona');
});

test('área de un polígono, sin importar el sentido de los vértices', () => {
  const cuadrado = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ];
  assert.equal(areaPoligono(cuadrado), 12);
  assert.equal(areaPoligono([...cuadrado].reverse()), 12);
  assert.equal(areaPoligono([{ x: 0, y: 0 }, { x: 1, y: 1 }]), 0);
});

test('IoU de cajas iguales, separadas y a medias', () => {
  const c = { x: 0, y: 0, w: 10, h: 10 };
  assert.equal(iou(c, c), 1);
  assert.equal(iou(c, { x: 20, y: 0, w: 10, h: 10 }), 0);
  assert.equal(iou(c, { x: 5, y: 0, w: 10, h: 10 }), 50 / 150);
  assert.equal(iou({ x: 0, y: 0, w: 0, h: 0 }, { x: 0, y: 0, w: 0, h: 0 }), 0, 'cajas vacías no dividen entre cero');
});

test('el punto de apoyo es el centro del borde de abajo', () => {
  assert.deepEqual(puntoDeApoyo({ x: 10, y: 20, w: 30, h: 100 }), { x: 25, y: 120 });
  assert.deepEqual(centro({ x: 10, y: 20, w: 30, h: 100 }), { x: 25, y: 70 });
});
