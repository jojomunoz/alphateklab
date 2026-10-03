import { test } from 'node:test';
import assert from 'node:assert/strict';
import { campoCSV, aCSV, csvDeIntervalos, fechaHoraLocal, BOM } from '../js/nucleo/csv.mjs';

test('los campos con coma, comillas o salto de línea van entre comillas', () => {
  assert.equal(campoCSV('simple'), 'simple');
  assert.equal(campoCSV('a,b'), '"a,b"');
  assert.equal(campoCSV('dijo "hola"'), '"dijo ""hola"""');
  assert.equal(campoCSV('dos\nlíneas'), '"dos\nlíneas"');
  assert.equal(campoCSV(null), '');
  assert.equal(campoCSV(0), '0');
});

test('lo que parece una fórmula se neutraliza, los números negativos no', () => {
  assert.equal(campoCSV('=1+1'), "'=1+1");
  assert.equal(campoCSV('@SUMA(A1)'), "'@SUMA(A1)");
  assert.equal(campoCSV('-3'), '-3');
  assert.equal(campoCSV('-2.5'), '-2.5');
});

test('el archivo lleva BOM, encabezados y filas con CRLF', () => {
  const csv = aCSV(['a', 'b'], [[1, 'x,y']]);
  assert.ok(csv.startsWith(BOM));
  assert.equal(csv.slice(1), 'a,b\r\n1,"x,y"\r\n');
});

test('el CSV por minuto usa la hora local y una fila por minuto con algo', () => {
  const t = new Date(2026, 9, 3, 14, 5).getTime();
  assert.equal(fechaHoraLocal(t), '2026-10-03 14:05');
  const csv = csvDeIntervalos([{ inicio: t, entradas: 3, salidas: 1 }], { fuente: 'video de muestra' });
  assert.equal(csv.slice(1), 'minuto (hora local),entradas,salidas,fuente\r\n2026-10-03 14:05,3,1,video de muestra\r\n');
});
