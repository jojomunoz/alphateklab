import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { condicion, describirRegla, queRevisar, textoAviso, textoResuelto, trozosWhatsApp } from '../js/nucleo/mensajes.mjs';
import { REGLAS_POR_DEFECTO } from '../js/nucleo/reglas.mjs';

const D = 86400;
const regla = (id) => REGLAS_POR_DEFECTO.find((r) => r.id === id);

test('cada regla por defecto se describe en una frase', () => {
  assert.deepEqual(REGLAS_POR_DEFECTO.map((r) => sp(describirRegla(r))), [
    'Nevera de la cocina fuera de 0 a 5 °C por más de 15 min',
    'Cuarto frío fuera de 0 a 5 °C por más de 20 min',
    'Congelador por encima de −15 °C por más de 30 min',
    'Puerta de la nevera abierta por más de 3 min',
    'Puerta del cuarto frío abierta por más de 5 min',
    'Vibración de la compresora de la nevera por encima de 4.5 mm/s por más de 10 min',
    'Local sin corriente por más de 5 min',
    'Tanque de agua por debajo de 25 % por más de 10 min',
    'Bomba del tanque encendida por más de 60 min',
    'Humedad de la bodega por encima de 70 % por más de 60 min',
  ]);
  assert.equal(sp(condicion({ ...regla('r1'), min: 1.5 })), 'fuera de 1.5 a 5 °C');
});

test('el texto exacto del aviso y del resuelto', () => {
  const alerta = {
    id: 1, reglaId: 'r1', sensor: 'nevera', regla: regla('r1'), inicio: D + 14 * 3600 + 120, aviso: D + 14 * 3600 + 17 * 60,
    fin: D + 15 * 3600 + 40 * 60, cerradaEn: D + 15 * 3600 + 45 * 60, motivo: 'volvio', valorAviso: 7.8, extremo: 12.34, lado: 'alto',
  };
  assert.equal(
    sp(textoAviso(alerta, '2026-10-03')),
    '*Aviso en Restaurante de ejemplo*\nNevera de la cocina: 7.8 °C. Está por encima de 5 °C desde las 14:02 (15 min).\nQué revisar: que la puerta cierre bien y que la compresora encienda.',
  );
  assert.equal(
    sp(textoResuelto(alerta, '2026-10-03')),
    '*Resuelto en Restaurante de ejemplo*\nNevera de la cocina volvió al rango a las 15:40. Estuvo fuera 1 h 38 min y llegó a 12.3 °C.',
  );
});

test('avisos de puerta, corriente y tanque', () => {
  const puerta = { sensor: 'puertaCuarto', regla: regla('r5'), inicio: 23 * 3600 + 55 * 60, aviso: D + 60, lado: null };
  assert.equal(
    sp(textoAviso(puerta, '2026-10-03')),
    '*Aviso en Restaurante de ejemplo*\nPuerta del cuarto frío: lleva 6 min abierta (desde ayer a las 23:55).\nCiérrala o revisa que no quedó trabada.',
  );
  const corte = { sensor: 'corriente', regla: regla('r7'), inicio: D + 12 * 3600, aviso: D + 12 * 3600 + 300, fin: D + 14 * 3600, motivo: 'volvio' };
  assert.match(sp(textoAviso(corte, '2026-10-03')), /El local está sin corriente desde las 12:00\./);
  assert.match(sp(textoResuelto(corte, '2026-10-03')), /Volvió la corriente a las 14:00\. El local estuvo 2 h sin corriente\./);
  const tanque = { sensor: 'tanque', regla: regla('r8'), inicio: D, aviso: D + 600, valorAviso: 22, lado: 'bajo' };
  assert.match(sp(textoAviso(tanque, '2026-10-03')), /Tanque de agua: 22 % \(unos 550 litros\)\. Está por debajo de 25 %/);
});

test('la negrita de WhatsApp se separa en trozos sin HTML', () => {
  assert.deepEqual(trozosWhatsApp('*Aviso · X* y <b>texto</b>'), [
    { texto: 'Aviso · X', negrita: true },
    { texto: ' y <b>texto</b>', negrita: false },
  ]);
  assert.deepEqual(trozosWhatsApp('sin negrita'), [{ texto: 'sin negrita', negrita: false }]);
});

test('apagar la regla no se anuncia como «Resuelto»', () => {
  const a = { sensor: 'puertaNevera', regla: regla('r4'), inicio: D + 10.5 * 3600, aviso: D + 10.5 * 3600 + 180, fin: D + 10.6 * 3600, motivo: 'regla' };
  const t = sp(textoResuelto(a, '2026-10-03'));
  assert.ok(t.startsWith('*Aviso cerrado sin resolver en Restaurante de ejemplo*\n'), t);
  assert.doesNotMatch(t, /Resuelto/);
  assert.match(t, /no quiere decir que se resolvió/);
});

test('la bomba «se apagó» y la puerta «se cerró»', () => {
  const bomba = { sensor: 'bomba', regla: regla('r9'), inicio: D, aviso: D + 3600, fin: D + 2 * 3600, motivo: 'volvio' };
  assert.match(sp(textoResuelto(bomba, '2026-10-03')), /^\*Resuelto en Restaurante de ejemplo\*\nBomba del tanque se apagó a las 02:00\. Estuvo encendida 2 h\.$/);
  const puerta = { ...bomba, sensor: 'puertaNevera', regla: regla('r4') };
  assert.match(sp(textoResuelto(puerta, '2026-10-03')), /Puerta de la nevera se cerró a las 02:00\. Estuvo abierta 2 h\./);
});

test('qué revisar no contradice la causa: corte de luz y compresora que vibra', () => {
  const nevera = { sensor: 'nevera', lado: 'alto' };
  assert.match(queRevisar(nevera), /que la compresora encienda/);
  assert.match(queRevisar(nevera, { sinCorriente: true }), /corte de luz/);
  assert.doesNotMatch(queRevisar(nevera, { sinCorriente: true }), /compresora encienda/);
  assert.match(queRevisar({ sensor: 'cuarto', lado: 'alto' }, { sinCorriente: true }), /corte de luz/);
  assert.match(queRevisar(nevera, { vibracionAlta: true }), /vibra de más.*técnico/);
  assert.match(queRevisar({ sensor: 'nevera', lado: 'bajo' }, { sinCorriente: true }), /termostato/, 'muy fría no es por el corte');
  assert.doesNotMatch(queRevisar({ sensor: 'vibracion', lado: 'alto' }), /antes de que/);
  assert.match(queRevisar({ sensor: 'congelador', lado: 'alto' }), /no tenga hielo acumulado/);
});
