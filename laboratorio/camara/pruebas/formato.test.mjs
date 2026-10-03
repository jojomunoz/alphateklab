import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numero, megas, horaCorta, duracion, maximoRedondo, textoSentido, textoReglaFila, personas, horasDeAviso, textoAforo, textoResumen } from '../js/nucleo/formato.mjs';

test('números con el formato de Panamá: punto decimal y coma de miles', () => {
  assert.equal(numero(1234.5, 1), '1,234.5');
  assert.equal(megas(7_254_339), '7.3 MB');
  assert.equal(megas(0), '0.0 MB');
});

test('hora corta y duraciones', () => {
  assert.equal(horaCorta(new Date(2026, 9, 3, 9, 5).getTime()), '09:05');
  assert.equal(duracion(0), '0 s');
  assert.equal(duracion(59.6), '1 min');
  assert.equal(duracion(125), '2 min 5 s');
  assert.equal(duracion(3600), '1 h');
  assert.equal(duracion(3780), '1 h 3 min');
});

test('el eje del gráfico redondea hacia arriba y nunca baja de 4', () => {
  assert.equal(maximoRedondo(0), 4);
  assert.equal(maximoRedondo(4), 4);
  assert.equal(maximoRedondo(5), 5);
  assert.equal(maximoRedondo(6), 10);
  assert.equal(maximoRedondo(26), 30);
  assert.equal(maximoRedondo(1200), 1500);
});

test('el sentido de entrada dicho con palabras coincide con la flecha', () => {
  const sube = { a: { x: 0.5, y: 0.9 }, b: { x: 0.5, y: 0.1 } };
  assert.equal(textoSentido(sube, 1), 'hacia la derecha');
  assert.equal(textoSentido(sube, -1), 'hacia la izquierda');
  const horizontal = { a: { x: 0.1, y: 0.5 }, b: { x: 0.9, y: 0.5 } };
  assert.equal(textoSentido(horizontal, 1), 'hacia abajo');
  assert.equal(textoSentido(horizontal, -1), 'hacia arriba');
});

test('la proporción del video cuenta: una línea casi diagonal en un video ancho', () => {
  // en coordenadas normalizadas parece de 45°, pero en un video 16:9 es más vertical que horizontal en pantalla
  const l = { a: { x: 0.4, y: 0.9 }, b: { x: 0.6, y: 0.1 } };
  assert.equal(textoSentido(l, 1, 16 / 9), 'hacia la derecha');
});

test('una diagonal cambia de palabra según la proporción del video', () => {
  // de abajo a la izquierda a arriba a la derecha: en un cuadro cuadrado es más alta que ancha («hacia la derecha»);
  // en 16:9 mide 8 de ancho por 5,4 de alto en pantalla, así que se cruza de arriba a abajo
  const l = { a: { x: 0.25, y: 0.8 }, b: { x: 0.75, y: 0.2 } };
  assert.equal(textoSentido(l, 1, 1), 'hacia la derecha');
  assert.equal(textoSentido(l, 1, 16 / 9), 'hacia abajo');
  assert.equal(textoSentido(l, -1, 16 / 9), 'hacia arriba');
});

test('la regla de la fila se dice como la piensa un encargado', () => {
  assert.equal(textoReglaFila(2, 10), 'Avisa cuando hay 3 o más personas en la zona durante 10 segundos seguidos.');
  assert.equal(textoReglaFila(0, 1), 'Avisa cuando hay al menos 1 persona en la zona durante 1 segundo seguido.');
  assert.equal(personas(1), '1 persona');
  assert.equal(personas(0), '0 personas');
});

test('textoDeAviso: «llegó a» solo si la fila creció después de abrir el aviso, y «(sigue)» mientras está abierto', async () => {
  const { textoDeAviso } = await import('../js/nucleo/formato.mjs');
  const base = { tipo: 'fila', inicio: 1, detalle: 'Abrir otra caja: 4 personas en la fila' };
  assert.equal(textoDeAviso({ ...base, fin: 2, maximo: 4, inicial: 4 }), 'Abrir otra caja: 4 personas en la fila');
  assert.equal(textoDeAviso({ ...base, fin: 2, maximo: 6, inicial: 4 }), 'Abrir otra caja: 4 personas en la fila; llegó a 6');
  assert.equal(textoDeAviso({ ...base, fin: null, maximo: 6, inicial: 4 }), 'Abrir otra caja: 4 personas en la fila (sigue)');
  assert.equal(textoDeAviso({ tipo: 'aforo', inicio: 1, fin: null, detalle: 'Aforo completo: 4 de 4 personas', maximo: 5, inicial: 4 }), 'Aforo completo: 4 de 4 personas (sigue)');
});

test('la hora de un aviso: una sola si sigue abierto o si cabe en el mismo minuto', () => {
  const h = (hh, mm, ss = 0) => new Date(2026, 9, 3, hh, mm, ss).getTime();
  assert.equal(horasDeAviso(h(14, 5), null), '14:05');
  assert.equal(horasDeAviso(h(14, 5, 2), h(14, 5, 40)), '14:05');
  assert.equal(horasDeAviso(h(14, 5), h(14, 9)), '14:05–14:09');
});

test('el aforo se dice sin plural forzado', () => {
  assert.equal(textoAforo(5, 1), '5 dentro; el máximo es 1');
  assert.equal(textoAforo(1, 1), '1 dentro; el máximo es 1');
});

test('el resumen de la demo apagada: vacío si no pasó nada, plurales bien puestos', () => {
  const con = 'con el video de muestra';
  assert.equal(textoResumen({ entradas: 0, salidas: 0, dentro: 0 }, 0, con), '');
  assert.equal(
    textoResumen({ entradas: 3, salidas: 1, dentro: 2 }, 1, con),
    'Hoy con el video de muestra van 3 entradas, 1 salida y 1 aviso; 2 personas dentro. Al encender la demo, el conteo sigue desde ahí.',
  );
  assert.equal(textoResumen({ entradas: 1, salidas: 1, dentro: 0 }, 0, con), 'Hoy con el video de muestra van 1 entrada y 1 salida. Al encender la demo, el conteo sigue desde ahí.');
});
