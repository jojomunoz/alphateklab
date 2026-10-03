import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { anchoBin, binsEnergia, dominioY, enVentana, filasTabla, indiceCercano, indiceDesde, intervaloEn, intervalosEnVentana, segundosActivo, ticksBonitos, ticksTiempo } from '../js/nucleo/escalas.mjs';
import { crearMotor, T_INICIO } from '../js/nucleo/motor.mjs';

test('ticks redondos que cubren el rango', () => {
  assert.deepEqual(ticksBonitos(2.3, 4.9, 4), [2, 3, 4, 5]);
  assert.deepEqual(ticksBonitos(-19.6, -15, 4), [-20, -18, -16, -14]);
  assert.deepEqual(ticksBonitos(0, 100, 3), [0, 50, 100]);
  assert.deepEqual(ticksBonitos(5, 5, 3), [4, 5, 6]);
});

test('el dominio incluye la banda y no amplifica el ruido', () => {
  const d = dominioY([3.1, 3.2, 3.3], { banda: { min: 0, max: 5 } });
  assert.ok(d.lo <= 0 && d.hi >= 5);
  const sinBanda = dominioY([3.1, 3.2], { rangoMin: 2 });
  assert.ok(sinBanda.hi - sinBanda.lo >= 2);
  const pct = dominioY([20, 80], { piso: 0, techo: 100 });
  assert.ok(pct.lo >= 0 && pct.hi <= 100);
  assert.deepEqual(dominioY([], {}).ticks.length > 0, true);
});

test('búsquedas en las muestras ordenadas', () => {
  const muestras = [60, 120, 180, 240].map((t) => ({ t }));
  assert.equal(indiceDesde(muestras, 0), 0);
  assert.equal(indiceDesde(muestras, 121), 2);
  assert.equal(indiceDesde(muestras, 999), 4);
  assert.equal(indiceCercano(muestras, 149), 1);
  assert.equal(indiceCercano(muestras, 151), 2);
  assert.equal(indiceCercano(muestras, 10000), 3);
  assert.equal(indiceCercano([], 5), -1);
  assert.deepEqual(enVentana(muestras, 100, 200).map((m) => m.t), [120, 180]);
});

test('las barras de consumo suman la misma energía que las muestras', () => {
  const m = crearMotor();
  const desde = T_INICIO - 6 * 3600;
  const bins = binsEnergia(m.muestras, desde, T_INICIO, anchoBin(6));
  assert.equal(bins.length, 24);
  const enBins = bins.reduce((s, b) => s + b.total, 0);
  const directa = enVentana(m.muestras, desde + 1, T_INICIO).reduce((s, x) => s + x.eAire + x.eCocina + x.eRefri, 0);
  assert.ok(Math.abs(enBins - directa) < 1e-9);
  assert.ok(bins.every((b) => b.minutos === 15));
});

test('tiempo activo e intervalos dentro de una ventana', () => {
  const ivs = [{ inicio: 100, fin: 200 }, { inicio: 300, fin: null }];
  assert.equal(segundosActivo(ivs, 150, 350), 50 + 50);
  assert.equal(segundosActivo(ivs, 0, 1000, 400), 100 + 100);
  assert.deepEqual(intervalosEnVentana(ivs, 150, 350).map((x) => [x.inicio, x.fin, x.abierto]), [[150, 200, false], [300, 350, true]]);
  assert.equal(intervaloEn(ivs, 150), ivs[0]);
  assert.equal(intervaloEn(ivs, 250), null);
  assert.equal(intervaloEn(ivs, 5000), ivs[1]);
  assert.equal(intervaloEn(ivs, 50), null);
});

test('marcas de tiempo según el ancho disponible', () => {
  const angosto = ticksTiempo(0, 6 * 3600, 330);
  const ancho = ticksTiempo(0, 6 * 3600, 1100);
  assert.ok(angosto.paso > ancho.paso);
  assert.ok(angosto.ticks.every((t) => t % angosto.paso === 0));
});

test('la tabla equivalente resume cada intervalo', () => {
  const m = crearMotor();
  const filas = filasTabla(m.muestras, m.intervalos, T_INICIO - 2 * 3600, T_INICIO, 900);
  assert.equal(filas.length, 8);
  for (const f of filas) {
    const trozo = enVentana(m.muestras, f.inicio + 1, f.fin);
    assert.equal(f.neveraMax, Math.max(...trozo.map((x) => x.nevera)));
    assert.ok(f.puertaCuartoS >= 0 && f.puertaCuartoS <= 900);
  }
});

test('la tabla va cada 10 min en 2 h, cada 15 en 6 h y cada hora en 24 h', async () => {
  const { pasoTabla } = await import('../js/nucleo/escalas.mjs');
  assert.deepEqual([pasoTabla(2), pasoTabla(6), pasoTabla(24)], [600, 900, 3600]);
});
