import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { crearSimulador, DURACION_CORTE, MUESTRA, PASO } from '../js/nucleo/simulador.mjs';

const H = 3600;

function correr(sim, hasta, acciones = []) {
  const pendientes = [...acciones];
  while (sim.t < hasta) {
    while (pendientes.length && pendientes[0].t <= sim.t) {
      const a = pendientes.shift();
      sim.ponerFalla(a.falla, a.activa);
    }
    sim.paso();
  }
  return sim;
}

const serie = (sim, clave, desde = 0, hasta = Infinity) => sim.muestras.filter((m) => m.t >= desde && m.t <= hasta).map((m) => m[clave]);

test('la misma semilla da exactamente los mismos datos', () => {
  const a = correr(crearSimulador({ semilla: 7 }), 30 * H);
  const b = correr(crearSimulador({ semilla: 7 }), 30 * H);
  assert.deepEqual(a.muestras, b.muestras);
  assert.deepEqual(a.intervalos, b.intervalos);
});

test('otra semilla da otros datos', () => {
  const a = correr(crearSimulador({ semilla: 7 }), 12 * H);
  const b = correr(crearSimulador({ semilla: 8 }), 12 * H);
  assert.notDeepEqual(serie(a, 'nevera'), serie(b, 'nevera'));
});

test('reporta una muestra por minuto', () => {
  const s = correr(crearSimulador(), 2 * H);
  assert.equal(s.muestras.length, (2 * H) / MUESTRA);
  assert.ok(s.muestras.every((m, i) => m.t === (i + 1) * MUESTRA));
});

test('sin fallas, la nevera se queda en su rango casi todo el día', () => {
  const s = correr(crearSimulador(), 48 * H);
  const dia1 = serie(s, 'nevera', 24 * H, 48 * H);
  const dentro = dia1.filter((v) => v >= 0 && v <= 5).length;
  assert.ok(dentro / dia1.length > 0.97, `dentro ${dentro} de ${dia1.length}`);
  assert.ok(Math.max(...dia1) < 8);
  const congelador = serie(s, 'congelador', 24 * H, 48 * H);
  assert.ok(Math.max(...congelador) < -15 && Math.min(...congelador) > -21);
});

test('el consumo sigue el horario del restaurante: casi nada de madrugada, pico al mediodía', () => {
  const s = correr(crearSimulador(), 48 * H);
  const energia = (h0, h1) => s.muestras.filter((m) => m.t > h0 * H && m.t <= h1 * H).reduce((x, m) => x + m.eAire + m.eCocina + m.eRefri, 0);
  const madrugada = energia(24 + 3, 24 + 4);
  const mediodia = energia(24 + 13, 24 + 14);
  assert.ok(mediodia > 5 * madrugada, `mediodía ${mediodia.toFixed(2)} vs madrugada ${madrugada.toFixed(2)}`);
  const antesDeAbrir = s.muestras.filter((m) => m.t > (24 + 6) * H && m.t <= (24 + 10) * H);
  assert.ok(antesDeAbrir.every((m) => m.aire === 0), 'el aire acondicionado no se prende antes de las 10:30');
});

test('la puerta abierta hace subir la nevera y al cerrarla vuelve a su rango', () => {
  const t0 = 24 * H + 15 * H;
  const s = correr(crearSimulador(), t0 + 90 * 60, [
    { t: t0, falla: 'puerta', activa: true },
    { t: t0 + 40 * 60, falla: 'puerta', activa: false },
  ]);
  const antes = serie(s, 'nevera', t0 - 30 * 60, t0);
  const abierta = serie(s, 'nevera', t0 + 10 * 60, t0 + 40 * 60);
  const despues = serie(s, 'nevera', t0 + 85 * 60, t0 + 90 * 60);
  assert.ok(Math.max(...antes) <= 5.5);
  assert.ok(Math.min(...abierta) > 7, `con la puerta abierta mínimo ${Math.min(...abierta)}`);
  assert.ok(Math.max(...despues) <= 5, `después de cerrarla ${Math.max(...despues)}`);
  const ultimo = s.intervalos.puertaNevera.find((iv) => iv.inicio === t0);
  assert.equal(ultimo.fin, t0 + 40 * 60, 'el intervalo de la puerta va de la falla al cierre');
});

test('el corte de corriente deja el consumo en cero 2 h y apaga la bomba', () => {
  const t0 = 24 * H + 12 * H;
  const s = correr(crearSimulador(), t0 + DURACION_CORTE + 30 * 60, [{ t: t0, falla: 'corte', activa: true }]);
  const durante = s.muestras.filter((m) => m.t > t0 && m.t <= t0 + DURACION_CORTE);
  assert.ok(durante.every((m) => m.aire + m.cocina + m.refri === 0));
  assert.ok(durante.every((m) => m.bomba === 0));
  const despues = s.muestras.filter((m) => m.t > t0 + DURACION_CORTE + 60);
  assert.ok(despues.every((m) => m.aire + m.cocina + m.refri > 0));
  assert.equal(s.fallas().corte, null, 'el corte terminó solo');
});

test('la fuga vacía el tanque aunque la bomba trabaje sin parar', () => {
  const t0 = 24 * H + 12 * H;
  const s = correr(crearSimulador(), t0 + 75 * 60, [{ t: t0, falla: 'fuga', activa: true }]);
  const final = s.muestras.at(-1);
  assert.ok(final.tanque < 25, `tanque ${final.tanque}`);
  assert.equal(final.bomba, 1);
});

test('la compresora dañada vibra, trabaja sin parar y deja subir la nevera', () => {
  const t0 = 24 * H + 12 * H;
  const s = correr(crearSimulador(), t0 + 90 * 60, [{ t: t0, falla: 'compresora', activa: true }]);
  const vib = serie(s, 'vibracion', t0 + 60, t0 + 90 * 60);
  assert.ok(vib.every((v) => v > 4.5), 'vibración alta mientras está dañada');
  assert.ok(s.muestras.at(-1).nevera > 6);
  // el frío se pierde de a poco: a los 10 min (cuando avisa la vibración) la nevera sigue en su rango
  const aLos10 = s.muestras.find((m) => m.t === t0 + 10 * 60);
  assert.ok(aLos10.nevera <= 5, `nevera a los 10 min: ${aLos10.nevera}`);
});

test('devolver la corriente antes de las 2 h corta el corte en ese momento', () => {
  const t0 = 24 * H + 12 * H;
  const s = correr(crearSimulador(), t0 + 30 * 60, [
    { t: t0, falla: 'corte', activa: true },
    { t: t0 + 20 * 60, falla: 'corte', activa: false },
  ]);
  assert.equal(s.fallas().corte, null);
  const m = s.muestras.at(-1);
  assert.ok(m.aire + m.cocina + m.refri > 0.05, 'hay consumo otra vez');
  const durante = s.muestras.find((x) => x.t === t0 + 10 * 60);
  assert.ok(durante.aire + durante.cocina + durante.refri < 0.05, 'sin consumo durante el corte');
});

test('la puerta del cuarto frío se abre con las entregas de la mañana', () => {
  const s = correr(crearSimulador(), 2 * 24 * H);
  const deEntregas = s.intervalos.puertaCuarto.filter((iv) => {
    const h = (iv.inicio % (24 * H)) / H;
    return h >= 7 && h < 9;
  });
  assert.ok(deEntregas.length >= 3, `aperturas en horario de entregas: ${deEntregas.length}`);
  assert.ok(s.muestras.some((m) => m.puertaCuarto === 1), 'alguna lectura la ve abierta');
});

test('los aguaceros de la tarde suben la humedad de la bodega por encima de lo normal', () => {
  const s = correr(crearSimulador(), 3 * 24 * H);
  const maximo = Math.max(...s.muestras.map((m) => m.humedad));
  assert.ok(maximo >= 70, `humedad máxima en 3 días: ${maximo}`);
});

test('una falla en un equipo no cambia los datos de los demás', () => {
  const t0 = 24 * H + 12 * H;
  const normal = correr(crearSimulador(), t0 + 3 * H);
  const conFuga = correr(crearSimulador(), t0 + 3 * H, [{ t: t0, falla: 'fuga', activa: true }]);
  for (const clave of ['nevera', 'cuarto', 'congelador', 'humedad', 'vibracion']) {
    assert.deepEqual(serie(conFuga, clave), serie(normal, clave), clave);
  }
  assert.notDeepEqual(serie(conFuga, 'tanque'), serie(normal, 'tanque'));
});

test('los intervalos de las puertas van en orden, no se solapan y tienen duraciones creíbles', () => {
  const s = correr(crearSimulador(), 48 * H);
  for (const id of ['puertaNevera', 'puertaCuarto', 'bomba']) {
    const lista = s.intervalos[id];
    assert.ok(lista.length > 0, id);
    for (let i = 0; i < lista.length; i++) {
      const iv = lista[i];
      if (iv.fin !== null) assert.ok(iv.fin > iv.inicio, `${id} ${i}`);
      if (i > 0) assert.ok(iv.inicio >= lista[i - 1].fin, `${id} ${i} se solapa`);
    }
  }
  const nevera = s.intervalos.puertaNevera.filter((iv) => iv.fin !== null).map((iv) => iv.fin - iv.inicio);
  assert.ok(Math.min(...nevera) >= 8 && Math.max(...nevera) <= 30);
  assert.ok(s.t % PASO === 0);
});

test('una falla desconocida es un error, no se ignora', () => {
  assert.throws(() => crearSimulador().ponerFalla('meteorito', true));
});
