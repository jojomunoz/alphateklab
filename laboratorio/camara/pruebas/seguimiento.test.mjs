import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearSeguidor } from '../js/nucleo/seguimiento.mjs';

const caja = (x, y, w = 40, h = 120) => ({ x, y, w, h, puntaje: 0.8 });
const confirmadas = (r) => r.pistas.filter((p) => p.confirmada);

test('una persona que camina conserva su número de cuadro en cuadro', () => {
  const s = crearSeguidor();
  const numeros = new Set();
  for (let i = 0; i < 20; i++) {
    const r = s.actualizar([caja(50 + i * 12, 100)], i * 100);
    for (const p of confirmadas(r)) numeros.add(p.numero);
  }
  assert.deepEqual([...numeros], [1]);
});

test('una pista cuenta solo desde su segunda detección, y los números van en orden', () => {
  const s = crearSeguidor();
  let r = s.actualizar([caja(10, 10)], 0);
  assert.equal(confirmadas(r).length, 0);
  r = s.actualizar([caja(12, 10)], 100);
  assert.equal(confirmadas(r)[0].numero, 1);
  assert.equal(confirmadas(r)[0].recienConfirmada, true);
  r = s.actualizar([caja(14, 10), caja(400, 10)], 200);
  r = s.actualizar([caja(16, 10), caja(402, 10)], 300);
  assert.deepEqual(confirmadas(r).map((p) => p.numero).sort(), [1, 2]);
});

test('una detección suelta de un solo cuadro nunca se vuelve pista', () => {
  const s = crearSeguidor();
  s.actualizar([caja(300, 300)], 0);
  const r = s.actualizar([], 100);
  assert.equal(r.pistas.length, 0);
});

test('si el detector la pierde un cuadro, la persona sigue con el mismo número', () => {
  const s = crearSeguidor();
  s.actualizar([caja(100, 100)], 0);
  s.actualizar([caja(110, 100)], 100);
  let r = s.actualizar([], 200);
  assert.equal(r.pistas.length, 1, 'sigue viva sin detección');
  assert.equal(r.pistas[0].vistaAhora, false);
  r = s.actualizar([caja(130, 100)], 300);
  assert.equal(confirmadas(r)[0].numero, 1);
});

test('tras más de 0,9 s sin verla, la pista se cierra', () => {
  const s = crearSeguidor();
  s.actualizar([caja(100, 100)], 0);
  s.actualizar([caja(110, 100)], 100);
  let r = s.actualizar([], 900);
  assert.equal(r.pistas.length, 1);
  r = s.actualizar([], 1001);
  assert.equal(r.pistas.length, 0);
  assert.equal(r.eliminadas.length, 1);
});

test('dos personas que se cruzan a distinta altura no se cambian el número', () => {
  const s = crearSeguidor();
  const vistos = { izq: new Set(), der: new Set() };
  for (let i = 0; i <= 20; i++) {
    const izq = caja(40 + i * 20, 100); // va a la derecha
    const der = caja(440 - i * 20, 160); // va a la izquierda, un poco más abajo
    const r = s.actualizar([der, izq], i * 100);
    for (const p of confirmadas(r)) {
      if (Math.abs(p.caja.y - 100) < 20) vistos.izq.add(p.numero);
      else vistos.der.add(p.numero);
    }
  }
  assert.equal(vistos.izq.size, 1);
  assert.equal(vistos.der.size, 1);
  assert.notDeepEqual([...vistos.izq], [...vistos.der]);
});

test('con pocos cuadros por segundo y gente rápida (sin superposición), empareja por cercanía', () => {
  const s = crearSeguidor();
  const numeros = new Set();
  for (let i = 0; i < 8; i++) {
    // se mueve 50 px por cuadro con cajas de 40 de ancho: IoU = 0 entre cuadros seguidos
    const r = s.actualizar([caja(50 + i * 50, 100)], i * 250);
    for (const p of confirmadas(r)) numeros.add(p.numero);
  }
  assert.deepEqual([...numeros], [1]);
});

test('una caja lejana y de otro tamaño es otra persona', () => {
  const s = crearSeguidor();
  s.actualizar([caja(50, 100)], 0);
  s.actualizar([caja(55, 100)], 100);
  const r = s.actualizar([caja(600, 300, 15, 40)], 200);
  assert.equal(r.pistas.length, 2);
});

test('la caja se suaviza: un salto brusco de una sola detección se amortigua', () => {
  const s = crearSeguidor();
  s.actualizar([caja(100, 100)], 0);
  s.actualizar([caja(100, 100)], 100);
  const r = s.actualizar([caja(100, 110)], 200);
  assert.ok(r.pistas[0].caja.y > 100 && r.pistas[0].caja.y < 110);
});

test('reiniciar borra las pistas pero no reutiliza números', () => {
  const s = crearSeguidor();
  s.actualizar([caja(10, 10)], 0);
  s.actualizar([caja(10, 10)], 100);
  s.reiniciar();
  assert.equal(s.pistas.length, 0);
  s.actualizar([caja(10, 10)], 200);
  const r = s.actualizar([caja(10, 10)], 300);
  assert.equal(confirmadas(r)[0].numero, 2);
});
