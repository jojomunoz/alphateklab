import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearRelojDeVideo } from '../js/nucleo/reloj.mjs';

test('el reloj de video da el currentTime en ms mientras el video avanza', () => {
  const r = crearRelojDeVideo();
  assert.equal(r.leer(0), 0);
  assert.equal(r.leer(1.5), 1500);
  assert.equal(r.leer(1.5), 1500, 'en pausa, el tiempo no avanza');
});

test('cuando el video vuelve a empezar, el tiempo de escena sigue creciendo', () => {
  const r = crearRelojDeVideo({ pasoAlVolverMs: 40 });
  r.leer(14.96);
  assert.equal(r.leer(0), 15_000, 'un paso después del último cuadro');
  assert.equal(r.leer(1), 16_000);
  r.leer(14.96);
  assert.equal(r.leer(0.08), 30_000, 'también si el primer cuadro leído no es el 0');
});

test('reiniciar vuelve a cero; un valor raro se lee como 0', () => {
  const r = crearRelojDeVideo();
  r.leer(10);
  r.reiniciar();
  assert.equal(r.leer(2), 2000);
  const s = crearRelojDeVideo();
  assert.equal(s.leer(NaN), 0);
});
