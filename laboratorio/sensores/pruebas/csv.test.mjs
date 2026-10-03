import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { aCSV, BOM, celda, FILAS_CABECERA, NOTA_SIMULADO, nombreArchivo, registroTemperaturas } from '../js/nucleo/csv.mjs';
import { crearMotor, T_INICIO } from '../js/nucleo/motor.mjs';

test('celdas: números tal cual, comillas y saltos escapados', () => {
  assert.equal(celda(-18.2), '-18.2');
  assert.equal(celda(3), '3');
  assert.equal(celda(Number.NaN), '');
  assert.equal(celda(null), '');
  assert.equal(celda('Nevera, cocina'), '"Nevera, cocina"');
  assert.equal(celda('dijo "hola"'), '"dijo ""hola"""');
  assert.equal(celda('dos\nlíneas'), '"dos\nlíneas"');
});

test('el texto que parece fórmula no se ejecuta en la hoja de cálculo', () => {
  assert.equal(celda('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(celda('+1'), "'+1");
  assert.equal(celda('-5'), "'-5");
  assert.equal(celda('@SUM(A1)'), "'@SUM(A1)");
});

test('el archivo lleva BOM y termina cada fila en CRLF', () => {
  const t = aCSV([['a', 1], ['b', 2]]);
  assert.ok(t.startsWith(BOM));
  assert.equal(t.slice(1), 'a,1\r\nb,2\r\n');
  assert.ok(!aCSV([['a']], { bom: false }).startsWith(BOM));
});

test('el registro de temperaturas: columnas, intervalo y equipos fuera de rango', () => {
  const m = crearMotor();
  m.ponerFalla('puerta', true);
  m.avanzarHasta(m.t + 45 * 60);
  const desde = m.t - 3600;
  const filas = registroTemperaturas(m.muestras, m.alertas, { desde, hasta: m.t, cada: 900, baseISO: '2026-10-03' });
  assert.deepEqual(filas[0], [NOTA_SIMULADO]);
  assert.match(filas[0][0], /simulados/);
  assert.deepEqual(filas[1], ['Fecha', 'Hora', 'Nevera de la cocina (°C)', 'Cuarto frío (°C)', 'Congelador (°C)', 'Puerta de la nevera', 'Puerta del cuarto frío', 'Fuera de rango']);
  assert.equal(filas.length, FILAS_CABECERA + 5, 'una fila cada 15 min en una hora, con los dos extremos');
  const ultima = filas.at(-1);
  assert.equal(ultima[0], '2026-10-03');
  assert.equal(ultima[1], '11:15');
  assert.equal(ultima[5], 'abierta');
  assert.equal(ultima[7], 'Nevera de la cocina; Puerta de la nevera');
  const minuto = registroTemperaturas(m.muestras, m.alertas, { desde: T_INICIO, hasta: T_INICIO + 600, cada: 60, baseISO: '2026-10-03' });
  assert.equal(minuto.length, FILAS_CABECERA + 11);
  assert.equal(typeof minuto[FILAS_CABECERA][2], 'number');
});

test('nombre del archivo con la fecha', () => {
  assert.equal(nombreArchivo(86400 + 10, 86400 + 50, '2026-10-03'), 'temperaturas-restaurante-de-ejemplo-2026-10-03.csv');
  assert.equal(nombreArchivo(10, 86400 + 50, '2026-10-03'), 'temperaturas-restaurante-de-ejemplo-2026-10-02-a-2026-10-03.csv');
});

test('un aviso ya cerrado sigue marcado como fuera de rango en las filas de su tramo, y no después', () => {
  const m = crearMotor();
  m.ponerFalla('puerta', true);
  m.avanzarHasta(m.t + 30 * 60);
  m.ponerFalla('puerta', false);
  m.avanzarHasta(m.t + 60 * 60);
  const nevera = m.alertas.find((a) => a.sensor === 'nevera');
  assert.ok(nevera && nevera.fin !== null, 'el aviso de la nevera está cerrado');
  const filas = registroTemperaturas(m.muestras, m.alertas, { desde: T_INICIO, hasta: m.t, cada: 60, baseISO: '2026-10-03' }).slice(FILAS_CABECERA);
  const hora = (t) => `${String(Math.floor((t % 86400) / 3600)).padStart(2, '0')}:${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}`;
  const fila = (t) => filas.find((f) => f[1] === hora(t));
  assert.match(fila(nevera.inicio)[7], /Nevera de la cocina/);
  assert.match(fila(nevera.fin - 60)[7], /Nevera de la cocina/);
  assert.doesNotMatch(fila(nevera.fin + 60)[7], /Nevera de la cocina/);
});
