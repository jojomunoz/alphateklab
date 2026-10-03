import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  areaPoligono, areaConSigno, puntoEnPoligono, puntoMasCercano, distanciaPuntoSegmento, centroide,
  puntoEtiqueta, resolverColision, moverConColision, segmentosSeCruzan, perimetro, caja, distanciaAlBorde,
} from '../js/nucleo/geometria.mjs';

const cerca = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
const L = [[0, 3.4], [3.8, 3.4], [3.8, 4.4], [6.6, 4.4], [6.6, 8], [0, 8]]; // la sala-comedor en «L»

test('área de un rectángulo y de un triángulo', () => {
  cerca(areaPoligono([[0, 0], [3.8, 0], [3.8, 3.4], [0, 3.4]]), 12.92);
  cerca(areaPoligono([[0, 0], [4, 0], [0, 3]]), 6);
});

test('el área no depende del sentido de los vértices', () => {
  const horario = [[0, 0], [2, 0], [2, 1], [0, 1]];
  const antihorario = [...horario].reverse();
  cerca(areaPoligono(horario), 2);
  cerca(areaPoligono(antihorario), 2);
  assert.ok(Math.sign(areaConSigno(horario)) === -Math.sign(areaConSigno(antihorario)));
});

test('área de un polígono en L = suma de sus dos rectángulos', () => {
  cerca(areaPoligono(L), 3.8 * 1 + 6.6 * 3.6, 1e-9);
  cerca(areaPoligono(L), 27.56, 1e-9);
});

test('polígonos degenerados dan 0', () => {
  assert.equal(areaPoligono([]), 0);
  assert.equal(areaPoligono([[0, 0], [1, 1]]), 0);
  cerca(areaPoligono([[0, 0], [1, 1], [2, 2]]), 0);
});

test('perímetro y caja', () => {
  cerca(perimetro([[0, 0], [3, 0], [3, 4], [0, 4]]), 14);
  const k = caja(L);
  assert.deepEqual([k.x0, k.y0, k.x1, k.y1], [0, 3.4, 6.6, 8]);
});

test('punto en polígono, también en el hueco de la L', () => {
  assert.equal(puntoEnPoligono({ x: 1, y: 5 }, L), true);
  assert.equal(puntoEnPoligono({ x: 2, y: 3.9 }, L), true); // brazo de arriba de la L
  assert.equal(puntoEnPoligono({ x: 5, y: 3.9 }, L), false); // el hueco (es el pasillo)
  assert.equal(puntoEnPoligono({ x: 7, y: 5 }, L), false);
});

test('punto más cercano en un segmento se queda en sus extremos', () => {
  const c = puntoMasCercano({ x: 5, y: 1 }, { x: 0, y: 0 }, { x: 2, y: 0 });
  assert.deepEqual([c.x, c.y, c.t], [2, 0, 1]);
  cerca(distanciaPuntoSegmento({ x: 1, y: 3 }, [0, 0], [2, 0]), 3);
});

test('el centroide de la L puede caer fuera; el punto de etiqueta nunca', () => {
  const forma = [[0, 0], [4, 0], [4, 1], [1, 1], [1, 4], [0, 4]]; // L delgada
  const c = centroide(forma);
  assert.equal(puntoEnPoligono(c, forma), false);
  const e = puntoEtiqueta(forma);
  assert.equal(puntoEnPoligono(e, forma), true);
  // y queda en medio de un brazo de la L (1 m de ancho), no pegado a la esquina de adentro
  assert.ok(distanciaAlBorde(e, forma) >= 0.4, `quedó a ${distanciaAlBorde(e, forma).toFixed(2)} m de una pared`);
});

test('el punto de etiqueta de un rectángulo es su centro', () => {
  const e = puntoEtiqueta([[0, 0], [4, 0], [4, 2], [0, 2]]);
  cerca(e.x, 2, 0.051);
  cerca(e.y, 1, 0.051);
});

test('colisión círculo-segmento: empuja al radio + medio grosor', () => {
  const pared = [{ a: { x: 0, y: 0 }, b: { x: 4, y: 0 }, medio: 0.1 }];
  const p = resolverColision({ x: 2, y: 0.2 }, pared, 0.25);
  cerca(p.x, 2);
  cerca(p.y, 0.35, 1e-9);
  const lejos = resolverColision({ x: 2, y: 1 }, pared, 0.25);
  assert.deepEqual(lejos, { x: 2, y: 1 });
});

test('colisión con el extremo de una pared (esquina redondeada)', () => {
  const pared = [{ a: { x: 0, y: 0 }, b: { x: 1, y: 0 }, medio: 0.05 }];
  const p = resolverColision({ x: 1.1, y: 0.1 }, pared, 0.25);
  cerca(Math.hypot(p.x - 1, p.y), 0.3, 1e-9);
});

test('caminar contra una pared no la atraviesa y desliza a lo largo', () => {
  const pared = [{ a: { x: -5, y: 0 }, b: { x: 5, y: 0 }, medio: 0.06 }];
  // Desde abajo (y = 1) en diagonal hacia arriba-derecha, 3 m de golpe.
  const p = moverConColision({ x: 0, y: 1 }, { x: 2, y: -3 }, pared, 0.25);
  assert.ok(p.y >= 0.31 - 1e-9, `quedó en y=${p.y}`);
  assert.ok(p.x > 1.5, 'debería deslizarse a lo largo de la pared');
});

test('un salto grande no atraviesa una pared delgada', () => {
  const pared = [{ a: { x: -5, y: 0 }, b: { x: 5, y: 0 }, medio: 0.03 }];
  const p = moverConColision({ x: 0, y: 0.5 }, { x: 0, y: -10 }, pared, 0.25);
  assert.ok(p.y > 0, `atravesó: y=${p.y}`);
});

test('se pasa por el hueco de una puerta de 0.8 m', () => {
  // Pared en y = 0 con puerta entre x = 1 y x = 1.8.
  const pared = [
    { a: { x: -3, y: 0 }, b: { x: 1, y: 0 }, medio: 0.06 },
    { a: { x: 1.8, y: 0 }, b: { x: 5, y: 0 }, medio: 0.06 },
  ];
  const p = moverConColision({ x: 1.4, y: 1 }, { x: 0, y: -2 }, pared, 0.25);
  cerca(p.y, -1, 1e-9);
});

test('cruce de segmentos', () => {
  assert.equal(segmentosSeCruzan({ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }), true);
  assert.equal(segmentosSeCruzan({ x: 0, y: 1 }, { x: 0, y: 2 }, { x: -1, y: 0 }, { x: 1, y: 0 }), false);
  assert.equal(segmentosSeCruzan({ x: 2, y: -1 }, { x: 2, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }), false);
});

test('si un paso empieza ya dentro de la zona de una pared (p. ej. tras aparecer encima), no la cruza', () => {
  const pared = [{ a: { x: -5, y: 0 }, b: { x: 5, y: 0 }, medio: 0.06 }];
  // A 5 cm de la línea de la pared, empujando contra ella: el empuje tiene que sacarlo hacia su lado, no al otro.
  const p = moverConColision({ x: 0, y: 0.05 }, { x: 0, y: -0.1 }, pared, 0.25);
  assert.ok(p.y > 0, `terminó del otro lado: y=${p.y}`);
});

test('una medida necesita dos puntos distintos: un doble clic en el mismo lugar no cuenta', async () => {
  const { medidaValida, MEDIDA_MINIMA } = await import('../js/nucleo/geometria.mjs');
  const a = { x: 1, y: 0, z: 2 };
  assert.equal(medidaValida(a, { ...a }), false);
  assert.equal(medidaValida(a, { x: 1.01, y: 0, z: 2 }), false);
  assert.equal(medidaValida(a, { x: 1.05, y: 0, z: 2 }), true);
  assert.equal(MEDIDA_MINIMA, 0.02);
});

test('cruzar justo por la punta de una pared cuenta como cruce (no se cuela por la esquina)', () => {
  // El recorrido de (0, -1) a (0, 1) pasa exactamente por el extremo (0, 0) de la pared de (0, 0) a (1, 0).
  assert.equal(segmentosSeCruzan({ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }), true);
  assert.equal(segmentosSeCruzan({ x: 1, y: -1 }, { x: 1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }), true);
  assert.equal(segmentosSeCruzan({ x: 1.2, y: -1 }, { x: 1.2, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }), false);
});
