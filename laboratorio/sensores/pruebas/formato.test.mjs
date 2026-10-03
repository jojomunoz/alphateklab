import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { fmtDesde, fmtDuracion, fmtFecha, fmtFechaISO, fmtHora, fmtLimite, fmtMomento, fmtNumero, fmtValor } from '../js/nucleo/formato.mjs';

const D = 86400;

test('números con punto decimal y signo menos tipográfico', () => {
  assert.equal(sp(fmtNumero(3.44, 1)), '3.4');
  assert.equal(sp(fmtNumero(-18.25, 1)), '−18.3');
  assert.equal(sp(fmtNumero(-0.04, 1)), '0.0');
  assert.equal(sp(fmtNumero(2500, 0)), '2,500');
  assert.equal(sp(fmtNumero(Number.NaN)), '—');
});

test('valores con su unidad y límites sin decimales de sobra', () => {
  assert.equal(sp(fmtValor('nevera', 3.4)), '3.4 °C');
  assert.equal(sp(fmtValor('tanque', 62)), '62 %');
  assert.equal(sp(fmtValor('puertaNevera', 1)), 'abierta');
  assert.equal(sp(fmtValor('bomba', 0)), 'apagada');
  assert.equal(sp(fmtLimite('nevera', 5)), '5 °C');
  assert.equal(sp(fmtLimite('vibracion', 4.5)), '4.5 mm/s');
  assert.equal(sp(fmtLimite('congelador', -15)), '−15 °C');
});

test('la cifra y su unidad no se separan al cortar la línea', () => {
  assert.equal(fmtValor('nevera', 3.4), '3.4\u00a0°C');
  assert.equal(fmtDuracion(98 * 60), '1\u00a0h 38\u00a0min');
});

test('horas y fechas desde el tiempo de la simulación', () => {
  assert.equal(fmtHora(D + 10.5 * 3600), '10:30');
  assert.equal(fmtHora(59), '00:00');
  assert.equal(fmtFecha(D + 100, '2026-10-03'), 'sáb 3 oct');
  assert.equal(fmtFecha(100, '2026-10-03'), 'vie 2 oct', 'el día 0 es la víspera');
  assert.equal(fmtFechaISO(29 * D, '2026-10-03'), '2026-10-31');
  assert.equal(fmtFechaISO(30 * D, '2026-10-03'), '2026-11-01');
});

test('momentos relativos al día de referencia', () => {
  const ref = D + 15 * 3600;
  assert.equal(sp(fmtMomento(D + 14 * 3600, ref, '2026-10-03')), '14:00');
  assert.equal(sp(fmtMomento(23 * 3600, ref, '2026-10-03')), 'ayer 23:00');
  assert.equal(sp(fmtDesde(23 * 3600, ref, '2026-10-03')), 'ayer a las 23:00');
  assert.equal(sp(fmtDesde(D + 3600 * 9, 3 * D, '2026-10-03')), 'el sáb 3 oct a las 09:00');
});

test('duraciones legibles', () => {
  assert.equal(sp(fmtDuracion(45)), '45 s');
  assert.equal(sp(fmtDuracion(240)), '4 min');
  assert.equal(sp(fmtDuracion(98 * 60)), '1 h 38 min');
  assert.equal(sp(fmtDuracion(7200)), '2 h');
  assert.equal(sp(fmtDuracion(-5)), '0 s');
});

test('las duraciones se redondean al minuto más cercano, no se truncan', () => {
  assert.equal(sp(fmtDuracion(150)), '3 min');
  assert.equal(sp(fmtDuracion(149)), '2 min');
});
