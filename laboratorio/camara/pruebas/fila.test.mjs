import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearVigiaDeFila } from '../js/nucleo/fila.mjs';

// «Más de 3 personas por 10 s»; se cierra tras 3 s por debajo.
const vigia = () => crearVigiaDeFila({ maxPersonas: 3, segundos: 10, segundosCierre: 3 });
const s = (n) => n * 1000;

test('con 3 personas (no más de 3) nunca avisa', () => {
  const v = vigia();
  for (let t = 0; t <= 60; t++) assert.equal(v.actualizar(3, s(t)).activa, false);
});

test('con 4 personas avisa justo a los 10 s, ni antes ni después', () => {
  const v = vigia();
  assert.equal(v.actualizar(4, s(0)).cambio, null);
  assert.equal(v.actualizar(4, s(9.9)).activa, false);
  const r = v.actualizar(4, s(10));
  assert.equal(r.activa, true);
  assert.equal(r.cambio, 'abre');
  assert.equal(r.abiertaDesde, s(10));
  assert.equal(v.actualizar(5, s(11)).cambio, null, 'el aviso se abre una sola vez');
});

test('un pico corto no avisa: si la fila baja antes de los 10 s, el reloj vuelve a cero', () => {
  const v = vigia();
  v.actualizar(5, s(0));
  v.actualizar(5, s(8));
  v.actualizar(2, s(9));
  v.actualizar(5, s(10));
  assert.equal(v.actualizar(5, s(19)).activa, false);
  assert.equal(v.actualizar(5, s(20)).cambio, 'abre');
});

test('mientras se acerca al aviso dice cuántos segundos faltan; si la fila se deshace, deja de contar', () => {
  const v = vigia();
  v.actualizar(4, s(0));
  assert.equal(v.actualizar(4, s(4)).faltan, 6);
  assert.equal(v.actualizar(1, s(5)).faltan, 5, 'medio segundo abajo todavía no es que la fila se deshizo');
  assert.equal(v.actualizar(1, s(6)).faltan, null, 'un segundo abajo, sí');
});

test('perder a alguien un instante (un cuadro sin detectarlo) no reinicia la racha', () => {
  // así se ve el video de muestra: 3 en la zona, y cada tanto el detector ve 2 durante uno o dos cuadros
  const v = crearVigiaDeFila({ maxPersonas: 2, segundos: 2 });
  const lecturas = [3, 3, 3, 2, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  const cambios = lecturas.map((n, i) => v.actualizar(n, i * 100).cambio).filter(Boolean);
  assert.deepEqual(cambios, ['abre'], 'a los 2 s de racha, con bajadas de 100 y 200 ms en medio');
});

test('una bajada de un segundo o más sí reinicia la racha, aunque solo haya una lectura después', () => {
  const v = crearVigiaDeFila({ maxPersonas: 2, segundos: 2 });
  v.actualizar(3, s(0));
  v.actualizar(3, s(1.5));
  v.actualizar(2, s(1.6));
  assert.equal(v.actualizar(3, s(2.6)).cambio, null, 'la bajada duró 1 s: la racha empieza de nuevo en 2,6 s');
  assert.equal(v.actualizar(3, s(4.5)).cambio, null);
  assert.equal(v.actualizar(3, s(4.6)).cambio, 'abre');
});

test('con tolerancia 0 se comporta como antes: cualquier bajada reinicia la racha', () => {
  const v = crearVigiaDeFila({ maxPersonas: 2, segundos: 2, segundosTolerancia: 0 });
  const lecturas = [3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  assert.deepEqual(lecturas.map((n, i) => v.actualizar(n, i * 100).cambio).filter(Boolean), []);
});

test('el aviso se cierra tras 3 s seguidos sin exceso y no parpadea con un bajón corto', () => {
  const v = vigia();
  v.actualizar(4, s(0));
  v.actualizar(4, s(10));
  assert.equal(v.actualizar(2, s(11)).activa, true, 'un segundo abajo no lo cierra');
  assert.equal(v.actualizar(4, s(12)).activa, true, 'volvió a subir: sigue abierto');
  assert.equal(v.actualizar(2, s(13)).activa, true);
  assert.equal(v.actualizar(2, s(15.9)).activa, true);
  const r = v.actualizar(2, s(16));
  assert.equal(r.activa, false);
  assert.equal(r.cambio, 'cierra');
});

test('el historial guarda inicio, fin y la fila más larga de cada aviso', () => {
  const v = vigia();
  v.actualizar(4, s(0));
  v.actualizar(4, s(10));
  v.actualizar(7, s(12));
  v.actualizar(1, s(20));
  v.actualizar(1, s(23));
  assert.deepEqual(v.historial, [{ inicio: s(10), fin: s(23), maximo: 7 }]);
});

test('cambiar las reglas aplica desde la siguiente lectura', () => {
  const v = vigia();
  v.actualizar(2, s(0));
  v.configurar({ maxPersonas: 1, segundos: 2 });
  v.actualizar(2, s(1));
  assert.equal(v.actualizar(2, s(3)).cambio, 'abre');
});

test('«más de 0 personas» avisa con una sola persona', () => {
  const v = crearVigiaDeFila({ maxPersonas: 0, segundos: 3 });
  v.actualizar(1, s(0));
  assert.equal(v.actualizar(1, s(3)).activa, true);
});

test('reiniciar borra el aviso abierto y el historial', () => {
  const v = vigia();
  v.actualizar(4, s(0));
  v.actualizar(4, s(10));
  v.reiniciar();
  assert.equal(v.activa, false);
  assert.deepEqual(v.historial, []);
});
