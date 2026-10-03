import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firmaDeCaja, parecido, mezclarFirmas, LARGO_FIRMA } from '../js/nucleo/apariencia.mjs';
import { crearSeguidor } from '../js/nucleo/seguimiento.mjs';

/** Imagen RGBA de prueba: cada caja pinta un color plano. */
function imagen(ancho, alto, rectangulos) {
  const data = new Uint8ClampedArray(ancho * alto * 4);
  for (let i = 0; i < data.length; i += 4) data.set([128, 128, 128, 255], i);
  for (const { x, y, w, h, color } of rectangulos) {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) data.set([...color, 255], (yy * ancho + xx) * 4);
  }
  return { data, width: ancho, height: alto };
}

const ROJO = [220, 30, 30];
const AZUL = [30, 40, 210];

test('la firma es un histograma de 64 colores que suma 1', () => {
  const img = imagen(100, 100, [{ x: 10, y: 10, w: 40, h: 80, color: ROJO }]);
  const f = firmaDeCaja(img, { x: 10, y: 10, w: 40, h: 80 });
  assert.equal(f.length, LARGO_FIRMA);
  assert.ok(Math.abs(f.reduce((s, v) => s + v, 0) - 1) < 1e-5);
});

test('mira el centro de la caja (la ropa), no los bordes', () => {
  // persona roja con un borde azul de fondo en el 15 % de cada lado: la firma debe ser casi toda roja
  const img = imagen(100, 100, [
    { x: 0, y: 0, w: 100, h: 100, color: AZUL },
    { x: 26, y: 15, w: 48, h: 70, color: ROJO },
  ]);
  const caja = { x: 20, y: 5, w: 60, h: 90 };
  const roja = firmaDeCaja(imagen(100, 100, [{ x: 0, y: 0, w: 100, h: 100, color: ROJO }]), caja);
  assert.ok(parecido(firmaDeCaja(img, caja), roja) > 0.95);
});

test('misma ropa se parece casi 1; ropa de otro color, casi 0', () => {
  const img = imagen(200, 100, [
    { x: 0, y: 0, w: 100, h: 100, color: ROJO },
    { x: 100, y: 0, w: 100, h: 100, color: AZUL },
  ]);
  const a = firmaDeCaja(img, { x: 10, y: 10, w: 30, h: 80 });
  const b = firmaDeCaja(img, { x: 50, y: 10, w: 30, h: 80 });
  const c = firmaDeCaja(img, { x: 120, y: 10, w: 30, h: 80 });
  assert.ok(parecido(a, b) > 0.99);
  assert.ok(parecido(a, c) < 0.01);
});

test('cajas fuera de la imagen o vacías no dan firma; firmas faltantes no se comparan', () => {
  const img = imagen(50, 50, []);
  assert.equal(firmaDeCaja(img, { x: 60, y: 60, w: 10, h: 10 }), null);
  assert.equal(firmaDeCaja(img, { x: 10, y: 10, w: 0, h: 10 }), null);
  assert.equal(parecido(null, new Float32Array(64)), null);
});

test('mezclar firmas va de a poco hacia la nueva', () => {
  const a = new Float32Array(64);
  const b = new Float32Array(64);
  a[0] = 1;
  b[1] = 1;
  const m = mezclarFirmas(a, b, 0.3);
  assert.ok(Math.abs(m[0] - 0.7) < 1e-6 && Math.abs(m[1] - 0.3) < 1e-6);
  assert.deepEqual(Array.from(mezclarFirmas(null, b)), Array.from(b));
  assert.equal(mezclarFirmas(a, null), a);
});

test('con firma, dos personas que se cruzan a la misma altura no se cambian el número', () => {
  // Una de rojo va a la derecha y una de azul a la izquierda; se superponen al cruzarse. A 5 cuadros por segundo.
  const firmaRoja = new Float32Array(64);
  firmaRoja[48] = 1;
  const firmaAzul = new Float32Array(64);
  firmaAzul[3] = 1;
  /** Recorrido de cada número; si un número cambia de persona, su recorrido da la vuelta. */
  const seguir = (conFirma) => {
    const s = crearSeguidor();
    const recorridos = new Map();
    for (let i = 0; i <= 24; i++) {
      const roja = { x: 100 + i * 20, y: 100, w: 60, h: 160, ...(conFirma ? { firma: firmaRoja } : {}) };
      const azul = { x: 580 - i * 20, y: 104, w: 60, h: 160, ...(conFirma ? { firma: firmaAzul } : {}) };
      const r = s.actualizar(i % 2 ? [roja, azul] : [azul, roja], i * 200);
      for (const p of r.pistas.filter((q) => q.confirmada && q.vistaAhora)) {
        if (!recorridos.has(p.numero)) recorridos.set(p.numero, []);
        recorridos.get(p.numero).push(p.caja.x);
      }
    }
    const daLaVuelta = [...recorridos.values()].some((xs) => {
      const pasos = xs.slice(1).map((x, i) => Math.sign(Math.round(x - xs[i])));
      return pasos.includes(1) && pasos.includes(-1);
    });
    return { numeros: recorridos.size, daLaVuelta };
  };
  assert.deepEqual(seguir(true), { numeros: 2, daLaVuelta: false });
});

test('entre dos candidatas igual de cerca, gana la de colores parecidos (y sin firma, no hay cómo saberlo)', () => {
  const roja = new Float32Array(64);
  roja[48] = 1;
  const azul = new Float32Array(64);
  azul[3] = 1;
  const numeroDeLaRoja = (conFirma) => {
    const s = crearSeguidor();
    const f = (firma) => (conFirma ? { firma } : {});
    s.actualizar([{ x: 100, y: 100, w: 60, h: 160, ...f(roja) }], 0);
    s.actualizar([{ x: 100, y: 100, w: 60, h: 160, ...f(roja) }], 100);
    // la persona de rojo, parada; aparecen dos cajas a la misma distancia, la azul primero en la lista
    const r = s.actualizar(
      [
        { x: 88, y: 100, w: 60, h: 160, ...f(azul) },
        { x: 112, y: 100, w: 60, h: 160, ...f(roja) },
      ],
      200,
    );
    return r.pistas.find((p) => p.numero === 1).caja.x;
  };
  assert.ok(numeroDeLaRoja(true) > 100, 'con firma, el número 1 sigue a la de rojo (x 112)');
  assert.ok(numeroDeLaRoja(false) < 100, 'sin firma, el empate lo gana la primera de la lista (la azul)');
});

test('una caja de colores muy distintos no hereda el número aunque esté encima', () => {
  const roja = new Float32Array(64);
  roja[48] = 1;
  const azul = new Float32Array(64);
  azul[3] = 1;
  const s = crearSeguidor();
  s.actualizar([{ x: 100, y: 100, w: 60, h: 160, firma: roja }], 0);
  s.actualizar([{ x: 102, y: 100, w: 60, h: 160, firma: roja }], 100);
  const r = s.actualizar([{ x: 104, y: 100, w: 60, h: 160, firma: azul }], 200);
  const pista1 = r.pistas.find((p) => p.numero === 1);
  assert.equal(pista1.vistaAhora, false, 'la de rojo queda perdida, no se convierte en la azul');
});
