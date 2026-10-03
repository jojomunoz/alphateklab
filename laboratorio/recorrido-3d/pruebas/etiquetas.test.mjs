import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anchoTexto, colocarEtiqueta, espacioLibre, cajaDentro, giroDePuerta, margenesPorOclusion, variantesEtiqueta } from '../js/nucleo/etiquetas.mjs';
import { construirModelo } from '../js/nucleo/plano.mjs';
import { planoEjemplo } from '../herramientas/escribir-plano-ejemplo.mjs';

const rect = (x0, y0, x1, y1) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
const cerca = (a, b, eps) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
// Caja que ocupa el rótulo devuelto por colocarEtiqueta.
function cajaDe(e, opciones = {}) {
  const v = variantesEtiqueta('', opciones).length && variantesEtiqueta(e.lineas.join(' '), opciones).find((x) => x.lineas.join('|') === e.lineas.join('|') && x.girada === e.girada);
  const [w, h] = e.girada ? [v.alto * e.t, v.ancho * e.t] : [v.ancho * e.t, v.alto * e.t];
  return { x0: e.x - w / 2, x1: e.x + w / 2, y0: e.y - h / 2, y1: e.y + h / 2 };
}

test('el ancho de un texto sale de la tabla de Manrope negrita (medida en Chromium; sin el kerning, hasta un 2 % de más)', () => {
  // Anchos de la palabra entera medidos con canvas.measureText en Chromium, con la fuente del sitio.
  cerca(anchoTexto('principal'), 4.229, 4.229 * 0.02);
  cerca(anchoTexto('Lavandería'), 5.282, 5.282 * 0.02);
  assert.ok(anchoTexto('principal') >= 4.229 && anchoTexto('Lavandería') >= 5.282, 'por exceso, nunca por defecto');
  assert.ok(anchoTexto('★') >= 0.75, 'una letra desconocida se cuenta por exceso');
});

test('espacio libre hacia los cuatro lados, también en una «L»', () => {
  const l = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 4 }, { x: 0, y: 4 }];
  assert.deepEqual(espacioLibre({ x: 1, y: 3 }, l), { izq: 1, der: 5, arr: 3, aba: 1 });
  assert.deepEqual(espacioLibre({ x: 4, y: 3 }, l), { izq: 4, der: 2, arr: 1, aba: 1 });
});

test('una caja dentro de la «L» sí; una que corta la esquina, no', () => {
  const l = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 4 }, { x: 0, y: 4 }];
  assert.equal(cajaDentro({ x0: 0.5, x1: 5.5, y0: 2.5, y1: 3.5 }, l), true);
  assert.equal(cajaDentro({ x0: 1, x1: 3, y0: 1, y1: 3 }, l), false);
});

test('en un ambiente ancho el nombre va derecho; en uno angosto y largo, girado', () => {
  const ancho = colocarEtiqueta('Lavandería', { poligono: rect(0, 0, 4, 2), maxT: 0.5 });
  assert.equal(ancho.girada, false);
  const angosto = colocarEtiqueta('Lavandería', { poligono: rect(0, 0, 1.6, 4), maxT: 0.5, margen: 0.1 });
  assert.equal(angosto.girada, true);
  assert.ok(angosto.t > colocarEtiqueta('Lavandería', { poligono: rect(0, 0, 1.6, 4), maxT: 0.5, margen: 0.1, girar: false }).t * 1.3);
});

test('el rótulo no pisa el giro de una puerta ni se sale del ambiente con su margen', () => {
  const m = construirModelo(planoEjemplo());
  const giros = m.aberturas.map(giroDePuerta).filter(Boolean);
  assert.equal(giros.length, m.aberturas.filter((a) => a.hoja).length);
  for (const amb of m.ambientes) {
    const e = colocarEtiqueta(amb.nombre, { poligono: amb.poligono, obstaculos: giros, margen: 0.12, preferido: amb.etiqueta, maxT: 0.5 });
    const k = cajaDe(e);
    assert.ok(cajaDentro({ x0: k.x0 - 0.12, x1: k.x1 + 0.12, y0: k.y0 - 0.12, y1: k.y1 + 0.12 }, amb.poligono), `${amb.nombre} se sale`);
    for (const g of giros) {
      // Ningún punto de la caja dentro del cuarto de círculo de la puerta (muestreo cada 2 cm).
      for (let x = k.x0; x <= k.x1; x += 0.02) for (let y = k.y0; y <= k.y1; y += 0.02) {
        const dx = x - g.cx, dy = y - g.cy;
        const dentro = Math.hypot(dx, dy) < g.r - 1e-6 && dx * g.ux + dy * g.uy > 1e-6 && dx * g.nx + dy * g.ny > 1e-6;
        assert.ok(!dentro, `${amb.nombre} pisa el giro de la puerta de (${g.cx}, ${g.cy})`);
      }
    }
  }
});

test('lo que tapan las paredes desde la cámara de arriba: margen grande del lado de la cámara', () => {
  // Cámara al sur (y mayor) y a la izquierda del ambiente, a 18 m de alto: tapa la franja junto a la pared de abajo
  // y la de la izquierda; arriba y a la derecha solo queda el margen base.
  const m = margenesPorOclusion({ x: 10, y: 6 }, { x: 7, y: 10, alto: 18 }, { altoPared: 2.6, base: 0.16 });
  cerca(m.aba, 0.16 + (2.6 * 4) / 18, 1e-9);
  cerca(m.izq, 0.16 + (2.6 * 3) / 18, 1e-9);
  assert.equal(m.arr, 0.16);
  assert.equal(m.der, 0.16);
});

test('en 3D, «Lavandería» y «Baño principal» quedan lejos de las paredes que los tapaban en la vista de arriba', () => {
  const m = construirModelo(planoEjemplo());
  const giros = m.aberturas.map(giroDePuerta).filter(Boolean);
  const camara = { x: 7.13, y: 10.06, alto: 18.34 }; // la de la vista desde arriba (órbita inicial)
  for (const id of ['lavanderia', 'bano-principal']) {
    const amb = m.ambientes.find((a) => a.id === id);
    const centro = { x: (amb.caja.x0 + amb.caja.x1) / 2, y: (amb.caja.y0 + amb.caja.y1) / 2 };
    const margen = margenesPorOclusion(centro, camara, { altoPared: 2.6, base: 0.16 });
    const e = colocarEtiqueta(amb.nombre, { poligono: amb.poligono, obstaculos: giros, margen, preferido: amb.etiqueta, maxT: 0.26, extra: { ancho: 3.3, escala: 0.78 } });
    const k = cajaDe(e, { extra: { ancho: 3.3, escala: 0.78 } });
    assert.ok(k.x0 - amb.caja.x0 >= margen.izq - 1e-6 && amb.caja.x1 - k.x1 >= margen.der - 1e-6, `${id}: ${JSON.stringify(k)}`);
    assert.ok(e.t >= 0.17, `${id}: letra de ${e.t.toFixed(3)} m`);
  }
});
