import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { crearMotor, periodosDeFallas, T_INICIO, T_LIMITE } from '../js/nucleo/motor.mjs';
import { REGLAS_POR_DEFECTO } from '../js/nucleo/reglas.mjs';

const MIN = 60;

test('arranca el día 1 a las 10:30 con la historia ya simulada', () => {
  const m = crearMotor();
  assert.equal(m.t, T_INICIO);
  assert.equal(m.muestras.length, T_INICIO / 60);
  assert.equal(m.alertas.length, 0, 'con la semilla de la demo, la historia no trae avisos');
});

test('falla → aviso: la puerta avisa a los 3 min y la temperatura después', () => {
  const m = crearMotor();
  m.avanzarHasta(T_INICIO + 2 * 3600);
  const t0 = m.t;
  m.ponerFalla('puerta', true);
  const r = m.avanzarHasta(t0 + 30 * MIN);
  const avisos = r.mensajes.filter((x) => x.tipo === 'aviso');
  assert.deepEqual(avisos.map((x) => x.sensor), ['puertaNevera', 'nevera']);
  const [puerta, nevera] = avisos;
  assert.ok(puerta.t - t0 <= 5 * MIN, `aviso de puerta a los ${(puerta.t - t0) / 60} min`);
  assert.ok(nevera.t - t0 >= 15 * MIN && nevera.t - t0 <= 25 * MIN, `aviso de temperatura a los ${(nevera.t - t0) / 60} min`);
  assert.match(sp(nevera.texto), /^\*Aviso en Restaurante de ejemplo\*\nNevera de la cocina: \d+\.\d °C\. Está por encima de 5 °C desde las \d\d:\d\d \(15 min\)\./);
  assert.equal(m.activas().length, 2);
});

test('reparar la falla cierra los avisos con su mensaje de resuelto', () => {
  const m = crearMotor();
  m.avanzarHasta(T_INICIO + 2 * 3600);
  m.ponerFalla('puerta', true);
  m.avanzarHasta(m.t + 30 * MIN);
  m.ponerFalla('puerta', false);
  const r = m.avanzarHasta(m.t + 120 * MIN);
  assert.deepEqual(r.mensajes.map((x) => x.tipo), ['resuelto', 'resuelto']);
  assert.equal(m.activas().length, 0);
  assert.ok(m.alertas.every((a) => a.fin !== null && a.fin > a.inicio));
});

test('con la semilla y el registro de acciones se repite exactamente lo mismo', () => {
  const a = crearMotor({ baseISO: '2026-10-03' });
  a.avanzarHasta(T_INICIO + 3600);
  a.ponerFalla('corte', true);
  a.avanzarHasta(a.t + 40 * MIN);
  a.cambiarReglas(REGLAS_POR_DEFECTO.map((r) => (r.id === 'r1' ? { ...r, max: 7 } : r)));
  a.avanzarHasta(a.t + 50 * MIN);
  a.ponerFalla('fuga', true);
  a.avanzarHasta(a.t + 33 * MIN);
  const guardado = a.exportar();
  const b = crearMotor({ semilla: guardado.semilla, acciones: guardado.acciones, hasta: guardado.t, baseISO: '2026-10-03' });
  assert.equal(b.t, a.t);
  assert.deepEqual(b.muestras, a.muestras);
  assert.deepEqual(b.alertas, a.alertas);
  assert.deepEqual(b.mensajes, a.mensajes);
  assert.deepEqual(b.fallas(), a.fallas());
  assert.deepEqual(b.reglas, a.reglas);
});

test('una acción guardada justo en el último momento se aplica al reponer', () => {
  const a = crearMotor();
  a.avanzarHasta(T_INICIO + 600);
  a.ponerFalla('fuga', true);
  const g = a.exportar();
  const b = crearMotor({ acciones: g.acciones, hasta: g.t });
  assert.equal(b.fallas().fuga, true);
});

test('subir el límite de la regla evita el aviso de temperatura', () => {
  const m = crearMotor();
  m.cambiarReglas(REGLAS_POR_DEFECTO.map((r) => (r.id === 'r1' ? { ...r, max: 30 } : r)));
  m.ponerFalla('puerta', true);
  const r = m.avanzarHasta(m.t + 40 * MIN);
  assert.ok(!r.mensajes.some((x) => x.sensor === 'nevera'));
  assert.ok(r.mensajes.some((x) => x.sensor === 'puertaNevera'));
});

test('la demo se detiene al final del día 7', () => {
  const m = crearMotor({ hasta: T_LIMITE + 3600 });
  assert.ok(m.t <= T_LIMITE);
  assert.equal(m.terminado, true);
});

test('tramos de las fallas: reparadas, en curso y el corte que termina solo', () => {
  const H = 3600;
  const registro = [
    { t: 10 * H, tipo: 'falla', falla: 'puerta', activa: true },
    { t: 10 * H + 600, tipo: 'reglas', reglas: [] },
    { t: 11 * H, tipo: 'falla', falla: 'puerta', activa: false },
    { t: 12 * H, tipo: 'falla', falla: 'corte', activa: true },
    { t: 15 * H, tipo: 'falla', falla: 'fuga', activa: true },
    { t: 16 * H, tipo: 'falla', falla: 'corte', activa: true },
    { t: 17 * H, tipo: 'falla', falla: 'corte', activa: false },
  ];
  assert.deepEqual(periodosDeFallas(registro, 18 * H), [
    { falla: 'puerta', inicio: 10 * H, fin: 11 * H },
    { falla: 'corte', inicio: 12 * H, fin: 14 * H },
    { falla: 'fuga', inicio: 15 * H, fin: null },
    { falla: 'corte', inicio: 16 * H, fin: 17 * H },
  ]);
  assert.deepEqual(periodosDeFallas([{ t: 0, tipo: 'falla', falla: 'corte', activa: true }], H), [{ falla: 'corte', inicio: 0, fin: null }]);
});

test('quitar una regla y agregar otra en el mismo minuto no manda el «Resuelto» de la quitada', async () => {
  const { nuevoIdRegla } = await import('../js/nucleo/reglas.mjs');
  const m = crearMotor();
  const puerta = { id: nuevoIdRegla(m.reglas, m.idsUsados()), sensor: 'puertaNevera', tipo: 'estado', minutos: 1, activa: true };
  m.cambiarReglas([...m.reglas, puerta]);
  m.ponerFalla('puerta', true);
  m.avanzarHasta(m.t + 3 * MIN);
  assert.ok(m.activas().some((a) => a.reglaId === puerta.id));
  const sinPuerta = m.reglas.filter((r) => r.id !== puerta.id);
  m.cambiarReglas(sinPuerta);
  const tanque = { id: nuevoIdRegla(m.reglas, m.idsUsados()), sensor: 'tanque', tipo: 'rango', min: 25, max: null, minutos: 10, activa: true };
  assert.notEqual(tanque.id, puerta.id, 'el id de la regla quitada no se reutiliza');
  m.cambiarReglas([...sinPuerta, tanque]);
  const r = m.avanzarHasta(m.t + 20 * MIN);
  const resueltos = r.mensajes.filter((x) => x.tipo === 'resuelto');
  assert.ok(resueltos.every((x) => !/se cerró/.test(x.texto)), 'nada dice que la puerta se cerró');
  assert.ok(resueltos.some((x) => /cerrado sin resolver/.test(x.texto)));
  assert.equal(m.fallas().puerta, true);
});

test('la puerta forzada avisa a los 3 min de abrirla y dice la hora en que se abrió', () => {
  const m = crearMotor();
  const t0 = m.t;
  m.ponerFalla('puerta', true);
  const r = m.avanzarHasta(t0 + 10 * MIN);
  const aviso = r.mensajes.find((x) => x.sensor === 'puertaNevera');
  assert.equal(aviso.t - t0, 3 * MIN);
  assert.match(sp(aviso.texto), /lleva 3 min abierta \(desde las 10:30\)/);
  m.ponerFalla('puerta', false);
  const t1 = m.t;
  const r2 = m.avanzarHasta(t1 + 10 * MIN);
  const resuelto = r2.mensajes.find((x) => x.sensor === 'puertaNevera' && x.tipo === 'resuelto');
  assert.equal(m.alertas.find((a) => a.sensor === 'puertaNevera').fin, t1, 'se cerró cuando se cerró la puerta');
  assert.ok(resuelto);
});

test('durante el corte, los avisos de temperatura no piden revisar la compresora', () => {
  const m = crearMotor();
  m.ponerFalla('corte', true);
  const r = m.avanzarHasta(m.t + 110 * MIN);
  const frio = r.mensajes.filter((x) => x.tipo === 'aviso' && ['nevera', 'cuarto', 'congelador'].includes(x.sensor));
  assert.ok(frio.length >= 1);
  for (const x of frio) {
    assert.match(x.texto, /corte de luz/);
    assert.doesNotMatch(x.texto, /compresora encienda/);
  }
});

test('la compresora dañada: avisa la vibración antes que la temperatura, y el aviso de la nevera nombra la compresora', () => {
  const m = crearMotor();
  m.ponerFalla('compresora', true);
  const r = m.avanzarHasta(m.t + 90 * MIN);
  const avisos = r.mensajes.filter((x) => x.tipo === 'aviso');
  const vib = avisos.find((x) => x.sensor === 'vibracion');
  const nev = avisos.find((x) => x.sensor === 'nevera');
  assert.ok(vib && nev);
  assert.ok(vib.t < nev.t, 'la vibración avisa primero');
  const alertaNevera = m.alertas.find((a) => a.sensor === 'nevera');
  assert.ok(alertaNevera.inicio > vib.t, 'cuando sale el aviso de vibración, la nevera todavía está en rango');
  assert.match(nev.texto, /vibra de más/);
  assert.doesNotMatch(nev.texto, /compresora encienda/);
});

test('el corte que nadie repara termina solo a las 2 h, también en los tramos dibujados', () => {
  const H = 3600;
  assert.deepEqual(periodosDeFallas([{ t: 0, tipo: 'falla', falla: 'corte', activa: true }], 3 * H), [{ falla: 'corte', inicio: 0, fin: 2 * H }]);
});

test('el chat guarda los últimos 400 mensajes', () => {
  const m = crearMotor();
  for (let i = 0; i < 260; i++) {
    m.ponerFalla('puerta', true);
    m.avanzarHasta(m.t + 4 * MIN);
    m.ponerFalla('puerta', false);
    m.avanzarHasta(m.t + 6 * MIN);
  }
  assert.equal(m.mensajes.length, 400);
  assert.ok(m.mensajes.at(-1).t >= m.mensajes[0].t);
});

test('idsUsados recuerda una regla agregada y quitada aunque nunca haya avisado', () => {
  const m = crearMotor();
  const humedad = { id: 'r11', sensor: 'humedad', tipo: 'rango', min: null, max: 95, minutos: 60, activa: true };
  m.cambiarReglas([...m.reglas, humedad]);
  m.avanzarHasta(m.t + 5 * MIN);
  m.cambiarReglas(m.reglas.filter((r) => r.id !== 'r11'));
  assert.equal(m.alertas.length, 0);
  assert.ok(m.idsUsados().includes('r11'));
});

test('el aviso de corte dice la misma hora que la falla, y «volvió» a las 2 h justas', () => {
  const m = crearMotor();
  m.ponerFalla('corte', true);
  const r = m.avanzarHasta(m.t + 150 * MIN);
  const aviso = r.mensajes.find((x) => x.sensor === 'corriente' && x.tipo === 'aviso');
  const resuelto = r.mensajes.find((x) => x.sensor === 'corriente' && x.tipo === 'resuelto');
  assert.match(sp(aviso.texto), /sin corriente desde las 10:30\./);
  assert.equal(aviso.t, T_INICIO + 5 * MIN, 'a los 5 min de irse la luz');
  assert.match(sp(resuelto.texto), /Volvió la corriente a las 12:30\. El local estuvo 2 h sin corriente\./);
});
