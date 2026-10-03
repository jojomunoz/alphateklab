import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION_ESQUEMA,
  FUENTES,
  configPorDefecto,
  sanearConfig,
  leerEstado,
  escribirEstado,
  estadoPorDefecto,
  conteoDeHoy,
  conteoVacio,
  fechaLocal,
  lineaValida,
  zonaValida,
  cerrarAvisosAbiertos,
} from '../js/nucleo/estado.mjs';

const HOY = '2026-10-03';

test('los datos de ejemplo de cada fuente son válidos', () => {
  for (const f of FUENTES) {
    const c = configPorDefecto(f);
    assert.ok(lineaValida(c.linea), `línea de ${f}`);
    assert.ok(zonaValida(c.zona), `zona de ${f}`);
    assert.deepEqual(sanearConfig(c, f), c, `${f} pasa el saneado sin cambios`);
  }
});

test('configPorDefecto devuelve una copia: cambiarla no cambia el ejemplo', () => {
  const c = configPorDefecto('muestra');
  c.linea.a.x = 0.01;
  assert.notEqual(configPorDefecto('muestra').linea.a.x, 0.01);
});

test('el saneado recorta los números a sus límites y redondea', () => {
  const c = sanearConfig({ ...configPorDefecto('camara'), aforoMax: 0, filaMax: 250, filaSegundos: 4.6 }, 'camara');
  assert.equal(c.aforoMax, 1);
  assert.equal(c.filaMax, 99);
  assert.equal(c.filaSegundos, 5);
  assert.equal(sanearConfig({ aforoMax: 'muchos' }, 'muestra').aforoMax, configPorDefecto('muestra').aforoMax);
});

test('una línea muy corta o fuera del cuadro vuelve a la de ejemplo', () => {
  const base = configPorDefecto('muestra');
  const corta = sanearConfig({ ...base, linea: { a: { x: 0.5, y: 0.5 }, b: { x: 0.51, y: 0.5 } } }, 'muestra');
  assert.deepEqual(corta.linea, base.linea);
  const fuera = sanearConfig({ ...base, linea: { a: { x: -0.2, y: 0.5 }, b: { x: 0.5, y: 0.5 } } }, 'muestra');
  assert.deepEqual(fuera.linea, base.linea);
});

test('una zona aplastada o con puntos inválidos vuelve a la de ejemplo; null (borrada) se respeta', () => {
  const base = configPorDefecto('muestra');
  const plana = [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.9, y: 0.1 }];
  assert.deepEqual(sanearConfig({ ...base, zona: plana }, 'muestra').zona, base.zona);
  assert.deepEqual(sanearConfig({ ...base, zona: [{ x: 'a' }, {}, {}] }, 'muestra').zona, base.zona);
  assert.equal(sanearConfig({ ...base, zona: null }, 'muestra').zona, null);
});

test('leer algo roto, vacío o de otra versión devuelve los datos de ejemplo, sin lanzar', () => {
  const ejemplo = estadoPorDefecto(HOY);
  assert.deepEqual(leerEstado(null, HOY), ejemplo);
  assert.deepEqual(leerEstado('', HOY), ejemplo);
  assert.deepEqual(leerEstado('{no es json', HOY), ejemplo);
  assert.deepEqual(leerEstado(JSON.stringify({ v: VERSION_ESQUEMA + 1, fuentes: {} }), HOY), ejemplo);
  assert.deepEqual(leerEstado('null', HOY), ejemplo);
});

test('guardar y volver a leer el mismo día conserva todo', () => {
  const e = estadoPorDefecto(HOY);
  e.preferencias.pixelado = 'todo';
  e.fuentes.camara.config.aforoMax = 12;
  e.fuentes.camara.conteo = { ...conteoVacio(HOY), entradas: 4, salidas: 1, maximo: 3, intervalos: { 1759500000000: [4, 1] } };
  e.fuentes.archivo.firma = 'tienda.mp4|123456';
  assert.deepEqual(leerEstado(escribirEstado(e), HOY), e);
});

test('el conteo de otro día no se arrastra: se empieza de cero', () => {
  const e = estadoPorDefecto('2026-10-02');
  e.fuentes.muestra.conteo.entradas = 40;
  const leido = leerEstado(escribirEstado(e), HOY);
  assert.equal(leido.fuentes.muestra.conteo.entradas, 0);
  assert.equal(leido.fuentes.muestra.conteo.fecha, HOY);
});

test('un conteo con números raros se limpia', () => {
  const c = conteoDeHoy({ fecha: HOY, entradas: -4, salidas: '3', ajuste: 2.7, maximo: null, intervalos: 'x' }, HOY);
  assert.equal(c.entradas, 0);
  assert.equal(c.salidas, 3);
  assert.equal(c.ajuste, 2);
  assert.equal(c.maximo, 0);
  assert.deepEqual(c.intervalos, {});
});

test('la bitácora de avisos se limpia y se recorta a los últimos 50', () => {
  const muchos = Array.from({ length: 70 }, (_, i) => ({ tipo: i % 2 ? 'aforo' : 'fila', inicio: i, fin: i + 1, detalle: 'x', maximo: 3 }));
  const c = conteoDeHoy({ fecha: HOY, bitacora: [...muchos, { tipo: 'otro', inicio: 1 }, { tipo: 'fila', inicio: 'ayer' }] }, HOY);
  assert.equal(c.bitacora.length, 50);
  assert.equal(c.bitacora[49].inicio, 69);
  const abierto = conteoDeHoy({ fecha: HOY, bitacora: [{ tipo: 'aforo', inicio: 5, fin: null, detalle: 'Aforo completo' }] }, HOY);
  assert.deepEqual(abierto.bitacora, [{ tipo: 'aforo', inicio: 5, fin: null, detalle: 'Aforo completo', maximo: 0, inicial: 0 }]);
  const conInicial = conteoDeHoy({ fecha: HOY, bitacora: [{ tipo: 'fila', inicio: 5, fin: 9, detalle: 'x', maximo: 6, inicial: '4' }] }, HOY);
  assert.equal(conInicial.bitacora[0].inicial, 4);
});

test('las preferencias desconocidas o de otro tipo se ignoran; el pixelado arranca en «personas»', () => {
  const texto = JSON.stringify({ v: VERSION_ESQUEMA, preferencias: { pixelado: 'un poco', verCalor: false, extra: 1 } });
  assert.deepEqual(leerEstado(texto, HOY).preferencias, { pixelado: 'personas', verCalor: false, verCajas: true });
  const todo = JSON.stringify({ v: VERSION_ESQUEMA, preferencias: { pixelado: 'todo' } });
  assert.equal(leerEstado(todo, HOY).preferencias.pixelado, 'todo');
  assert.equal(leerEstado(null, HOY).preferencias.pixelado, 'personas', 'por defecto, pixelado de personas');
});

test('la fecha local tiene la forma AAAA-MM-DD', () => {
  assert.match(fechaLocal(Date.now()), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(fechaLocal(new Date(2026, 0, 5, 23, 59).getTime()), '2026-01-05');
});

test('cerrar los avisos abiertos al apagar: solo los del tipo pedido, a esa hora y nunca antes de su inicio', () => {
  const lista = [
    { tipo: 'fila', inicio: 100, fin: 200, detalle: 'a', maximo: 3, inicial: 3 },
    { tipo: 'fila', inicio: 300, fin: null, detalle: 'b', maximo: 3, inicial: 3 },
    { tipo: 'aforo', inicio: 400, fin: null, detalle: 'c', maximo: 4, inicial: 4 },
  ];
  const cerrada = cerrarAvisosAbiertos(lista, { fila: true }, 500);
  assert.deepEqual(cerrada.map((a) => a.fin), [200, 500, null]);
  assert.equal(lista[1].fin, null, 'no toca la lista de entrada');
  assert.deepEqual(cerrarAvisosAbiertos(lista, { fila: true, aforo: true }, 350).map((a) => a.fin), [200, 350, 400]);
  assert.deepEqual(cerrarAvisosAbiertos(lista, { fila: true }, null).map((a) => a.fin), [200, 300, null], 'sin hora: en su inicio');
});

test('el conteo guardado recuerda hasta cuándo se guardó', () => {
  assert.equal(conteoDeHoy({ fecha: HOY, hasta: 1234 }, HOY).hasta, 1234);
  assert.equal(conteoDeHoy({ fecha: HOY, hasta: 'ayer' }, HOY).hasta, null);
  assert.equal(conteoVacio(HOY).hasta, null);
});
