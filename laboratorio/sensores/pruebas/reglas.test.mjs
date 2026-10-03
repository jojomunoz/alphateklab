import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { bandaDe, crearEvaluador, errorDeCampo, incumple, nuevoIdRegla, REGLAS_POR_DEFECTO, validarRegla } from '../js/nucleo/reglas.mjs';

const nevera = { id: 'r1', sensor: 'nevera', tipo: 'rango', min: 0, max: 5, minutos: 15, activa: true };
const base = { cuarto: 3, congelador: -18, vibracion: 1, tanque: 70, humedad: 60, puertaNevera: 0, puertaCuarto: 0, bomba: 0, aire: 3, cocina: 2, refri: 1 };
const muestra = (minuto, valores) => ({ ...base, t: minuto * 60, nevera: 3, ...valores });

// Pasa una serie de valores de la nevera, uno por minuto.
function pasar(ev, valores, reglas = [nevera], desde = 0) {
  const eventos = [];
  valores.forEach((v, i) => eventos.push(...ev.evaluar(muestra(desde + i, { nevera: v }), reglas)));
  return eventos;
}

test('un pico de un minuto no avisa', () => {
  const ev = crearEvaluador();
  const eventos = pasar(ev, [3, 3, 9, 3, 3, 3]);
  assert.equal(eventos.length, 0);
  assert.equal(ev.alertas.length, 0);
});

test('avisa justo cuando se cumple la duración, con la hora en que empezó', () => {
  const ev = crearEvaluador();
  const valores = [3, 3, ...Array(16).fill(6)]; // fuera desde el minuto 2
  const eventos = pasar(ev, valores);
  assert.equal(eventos.length, 1);
  const a = eventos[0].alerta;
  assert.equal(eventos[0].tipo, 'abre');
  assert.equal(a.inicio, 2 * 60);
  assert.equal(a.aviso, 17 * 60, '15 min después de salir del rango');
  assert.equal(a.lado, 'alto');
});

test('si vuelve al rango antes de cumplir la duración, el conteo se reinicia', () => {
  const ev = crearEvaluador();
  const eventos = pasar(ev, [...Array(14).fill(6), 4, ...Array(14).fill(6)]);
  assert.equal(eventos.length, 0);
});

test('el aviso se cierra tras 5 min seguidos dentro del rango, con la hora en que volvió', () => {
  const ev = crearEvaluador();
  const fuera = Array(20).fill(7);
  const eventos = pasar(ev, [...fuera, 4, 4, 4, 4, 4, 4]);
  assert.deepEqual(eventos.map((e) => e.tipo), ['abre', 'cierra']);
  const a = eventos[1].alerta;
  assert.equal(a.fin, 20 * 60, 'fin = primer minuto de vuelta en el rango');
  assert.equal(a.cerradaEn, 25 * 60);
  assert.equal(a.motivo, 'volvio');
});

test('si se vuelve a salir durante el cierre, sigue el mismo aviso y no llega otro', () => {
  const ev = crearEvaluador();
  const eventos = pasar(ev, [...Array(16).fill(7), 4, 4, 7, 7, 4, 4, 4, 4, 4, 4]);
  assert.deepEqual(eventos.map((e) => e.tipo), ['abre', 'cierra']);
  assert.equal(ev.alertas.length, 1);
});

test('guarda el extremo según el lado por el que se salió', () => {
  const ev = crearEvaluador();
  pasar(ev, [...Array(16).fill(6), 9.5, 8, 7]);
  assert.equal(ev.alertas[0].extremo, 9.5);
  const ev2 = crearEvaluador();
  pasar(ev2, [...Array(16).fill(-1), -2.5, -1]);
  assert.equal(ev2.alertas[0].lado, 'bajo');
  assert.equal(ev2.alertas[0].extremo, -2.5);
});

test('reglas de estado (puerta) y de corriente', () => {
  const puerta = { id: 'r4', sensor: 'puertaNevera', tipo: 'estado', minutos: 3, activa: true };
  const corriente = { id: 'r7', sensor: 'corriente', tipo: 'corriente', minutos: 5, activa: true };
  assert.equal(incumple(puerta, muestra(0, { puertaNevera: 1 })), true);
  assert.equal(incumple(puerta, muestra(0, { puertaNevera: 0 })), false);
  assert.equal(incumple(corriente, muestra(0, { aire: 0, cocina: 0, refri: 0 })), true);
  assert.equal(incumple(corriente, muestra(0, {})), false);
  const ev = crearEvaluador();
  const eventos = [];
  for (let i = 0; i < 6; i++) eventos.push(...ev.evaluar(muestra(i, { aire: 0, cocina: 0, refri: 0 }), [corriente]));
  assert.equal(eventos.length, 1);
  assert.equal(eventos[0].alerta.aviso - eventos[0].alerta.inicio, 300);
});

test('apagar o quitar una regla cierra su aviso en ese momento', () => {
  const ev = crearEvaluador();
  pasar(ev, Array(20).fill(8));
  assert.equal(ev.activas().length, 1);
  const eventos = ev.evaluar(muestra(20, { nevera: 8 }), [{ ...nevera, activa: false }]);
  assert.equal(eventos.length, 1);
  assert.equal(eventos[0].alerta.motivo, 'regla');
  assert.equal(eventos[0].alerta.fin, 20 * 60);
  assert.equal(ev.activas().length, 0);
});

test('la situación de cada regla: normal, contando, activa y cerrando', () => {
  const ev = crearEvaluador();
  pasar(ev, [3]);
  assert.equal(ev.situacion(nevera, 60).estado, 'normal');
  pasar(ev, [6, 6, 6], [nevera], 1);
  const s = ev.situacion(nevera, 3 * 60);
  assert.equal(s.estado, 'contando');
  assert.equal(s.avisaEn, 60 + 15 * 60);
  pasar(ev, Array(15).fill(6), [nevera], 4);
  assert.equal(ev.situacion(nevera, 18 * 60).estado, 'activa');
  pasar(ev, [4], [nevera], 19);
  assert.equal(ev.situacion(nevera, 19 * 60).estado, 'cerrando');
  assert.equal(ev.situacion({ ...nevera, activa: false }, 0).estado, 'apagada');
});

test('validarRegla dice qué está mal', () => {
  assert.deepEqual(validarRegla(nevera), []);
  assert.equal(validarRegla({ ...nevera, min: 6 })[0].campo, 'min');
  assert.equal(validarRegla({ ...nevera, min: null, max: null })[0].campo, 'max');
  assert.equal(validarRegla({ ...nevera, minutos: 0 })[0].campo, 'minutos');
  assert.equal(validarRegla({ ...nevera, minutos: 2.5 })[0].campo, 'minutos');
  assert.equal(validarRegla({ ...nevera, minutos: 1441 })[0].campo, 'minutos');
  assert.equal(validarRegla({ ...nevera, sensor: 'nada' })[0].campo, 'sensor');
  assert.equal(validarRegla({ ...nevera, max: Number.NaN })[0].campo, 'max');
  assert.equal(validarRegla({ ...nevera, tipo: 'estado' })[0].campo, 'tipo');
  for (const r of REGLAS_POR_DEFECTO) assert.deepEqual(validarRegla(r), [], r.id);
});

test('ids nuevos sin azar y banda del rango', () => {
  assert.equal(nuevoIdRegla(REGLAS_POR_DEFECTO), 'r11');
  assert.equal(nuevoIdRegla([]), 'r1');
  assert.deepEqual(bandaDe('nevera', REGLAS_POR_DEFECTO), { min: 0, max: 5, minutos: 15, id: 'r1' });
  assert.deepEqual(bandaDe('congelador', REGLAS_POR_DEFECTO), { min: null, max: -15, minutos: 30, id: 'r3' });
  assert.equal(bandaDe('nevera', REGLAS_POR_DEFECTO.map((r) => ({ ...r, activa: false }))), null);
});

test('estado de un sensor en un momento: aviso, fuera de rango, en rango o sin regla', async () => {
  const { estadoEn } = await import('../js/nucleo/reglas.mjs');
  const alertas = [{ sensor: 'nevera', inicio: 100, aviso: 1000, fin: 2000 }];
  assert.equal(estadoEn('nevera', 500, 7, alertas, REGLAS_POR_DEFECTO).tipo, 'fuera');
  assert.equal(estadoEn('nevera', 1500, 7, alertas, REGLAS_POR_DEFECTO).tipo, 'aviso');
  assert.equal(estadoEn('nevera', 2500, 3, alertas, REGLAS_POR_DEFECTO).tipo, 'ok');
  assert.equal(estadoEn('nevera', 2500, 6, alertas, REGLAS_POR_DEFECTO).tipo, 'fuera');
  assert.equal(estadoEn('nevera', 2500, 6, alertas, []).tipo, 'neutro');
  assert.equal(estadoEn('corriente', 10, 0, [], REGLAS_POR_DEFECTO).tipo, 'fuera');
  assert.equal(estadoEn('corriente', 10, 3.2, [], REGLAS_POR_DEFECTO).tipo, 'ok');
  assert.equal(estadoEn('puertaNevera', 10, 0, [], REGLAS_POR_DEFECTO).texto, 'normal');
});

test('una regla nueva nunca reutiliza el id de una que ya existió', () => {
  const sinR11 = REGLAS_POR_DEFECTO;
  assert.equal(nuevoIdRegla(sinR11, ['r11']), 'r12', 'r11 se quitó, pero quedó en el registro');
  assert.equal(nuevoIdRegla(sinR11, ['r3', 'r40']), 'r41');
});

test('si un id pasa a ser otra regla (otro sensor), no hereda el aviso ni manda un «Resuelto» ajeno', () => {
  const puerta = { id: 'r11', sensor: 'puertaNevera', tipo: 'estado', minutos: 1, activa: true };
  const tanque = { id: 'r11', sensor: 'tanque', tipo: 'rango', min: 25, max: null, minutos: 10, activa: true };
  const ev = crearEvaluador();
  for (let i = 0; i < 3; i++) ev.evaluar(muestra(i, { puertaNevera: 1 }), [puerta]);
  assert.equal(ev.activas().length, 1);
  const eventos = [];
  for (let i = 3; i < 12; i++) eventos.push(...ev.evaluar(muestra(i, { puertaNevera: 1, tanque: 70 }), [tanque]));
  assert.deepEqual(eventos.map((e) => [e.tipo, e.alerta.sensor, e.alerta.motivo]), [['cierra', 'puertaNevera', 'regla']]);
  assert.equal(eventos[0].alerta.fin, 3 * 60, 'se cierra cuando cambió la regla, no «cuando volvió»');
  assert.equal(ev.situacion(tanque, 11 * 60).estado, 'normal');
});

test('con el tramo exacto, el aviso de la puerta cuenta desde que se abrió y termina cuando se cerró', () => {
  const puerta = { id: 'r4', sensor: 'puertaNevera', tipo: 'estado', minutos: 3, activa: true };
  const ev = crearEvaluador();
  const tramo = { inicio: 10 * 60 + 20, fin: null }; // se abrió a los 10 min 20 s; la muestra de las 11 la ve
  const eventos = [];
  for (let i = 11; i <= 14; i++) eventos.push(...ev.evaluar(muestra(i, { puertaNevera: 1 }), [puerta], { puertaNevera: tramo }));
  assert.equal(eventos.length, 1);
  assert.equal(eventos[0].alerta.inicio, 10 * 60 + 20);
  assert.equal(eventos[0].alerta.aviso, 14 * 60, 'a los 3 min de abrirse, no a los 3 min de la primera muestra');
  tramo.fin = 20 * 60 + 30;
  for (let i = 21; i <= 26; i++) eventos.push(...ev.evaluar(muestra(i, { puertaNevera: 0 }), [puerta], { puertaNevera: tramo }));
  assert.equal(eventos.at(-1).tipo, 'cierra');
  assert.equal(eventos.at(-1).alerta.fin, 20 * 60 + 30);
  // un tramo viejo (de hace horas) no se usa: cuenta desde la muestra
  const ev2 = crearEvaluador();
  ev2.evaluar(muestra(100, { puertaNevera: 1 }), [puerta], { puertaNevera: { inicio: 0, fin: null } });
  assert.equal(ev2.situacion(puerta, 100 * 60).desde, 100 * 60);
});

test('límites fuera de lo que mide el sensor, iguales, o ninguno: error en los campos correctos', () => {
  const e1 = validarRegla({ ...nevera, max: 99999999999 });
  assert.equal(e1.length, 1);
  assert.equal(e1[0].campo, 'max');
  assert.match(sp(e1[0].texto), /entre −40 y 60 °C/);
  assert.equal(validarRegla({ ...nevera, min: -41 })[0].campo, 'min');
  assert.deepEqual(validarRegla({ ...nevera, sensor: 'tanque', min: 25, max: null }), []);
  assert.equal(validarRegla({ ...nevera, sensor: 'tanque', min: 25, max: 101 })[0].campo, 'max');
  const iguales = validarRegla({ ...nevera, min: 5, max: 5 });
  assert.equal(iguales.length, 1, 'mínimo igual al máximo no vale');
  assert.ok(errorDeCampo(iguales[0], 'min') && errorDeCampo(iguales[0], 'max'));
  const ninguno = validarRegla({ ...nevera, min: null, max: null });
  assert.ok(errorDeCampo(ninguno[0], 'min') && errorDeCampo(ninguno[0], 'max'), 'sin límites se marcan los dos campos');
  assert.match(validarRegla({ ...nevera, max: Number.NaN })[0].texto, /solo con números/);
});

test('apagar y volver a prender una regla empieza a contar de nuevo desde que se prende', () => {
  const puerta = { id: 'r4', sensor: 'puertaNevera', tipo: 'estado', minutos: 3, activa: true };
  const ev = crearEvaluador();
  for (let i = 0; i <= 4; i++) ev.evaluar(muestra(i, { puertaNevera: 1 }), [puerta]);
  assert.equal(ev.activas().length, 1);
  ev.evaluar(muestra(5, { puertaNevera: 1 }), [{ ...puerta, activa: false }]);
  assert.equal(ev.activas().length, 0);
  const eventos = [];
  for (let i = 10; i <= 12; i++) eventos.push(...ev.evaluar(muestra(i, { puertaNevera: 1 }), [puerta]));
  assert.equal(eventos.length, 0, 'al prenderla otra vez no avisa de inmediato');
  assert.equal(ev.situacion(puerta, 12 * 60).desde, 10 * 60);
  eventos.push(...ev.evaluar(muestra(13, { puertaNevera: 1 }), [puerta]));
  assert.equal(eventos.length, 1, 'avisa a los 3 min de prenderla');
});
