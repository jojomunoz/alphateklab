import { test } from 'node:test';
import assert from 'node:assert/strict';

const sp = (t) => (typeof t === 'string' ? t.replace(/\u00a0/g, ' ') : t);
import { idRelevo, leerEventoNtfy, leerPaquete, MAX_TEXTO, normalizarSala, nuevaSala, paquete, salaValida, tema, urlEscuchar, urlPublicar } from '../js/nucleo/relevo.mjs';

test('sala de 10 caracteres sin letras que se confunden', () => {
  const s = nuevaSala();
  assert.ok(salaValida(s));
  assert.ok(!/[lo01]/.test(s));
  let i = 0;
  const fijo = () => [0, 0.5, 0.99][i++ % 3];
  assert.equal(nuevaSala(fijo), 'as9as9as9a');
});

test('tema y direcciones del relevo', () => {
  assert.equal(tema('abcde23456'), 'atk-sensores-abcde23456');
  assert.equal(urlPublicar('abcde23456'), 'https://ntfy.sh/atk-sensores-abcde23456');
  assert.equal(urlEscuchar('abcde23456'), 'https://ntfy.sh/atk-sensores-abcde23456/sse');
  assert.throws(() => tema('../otra'));
  assert.equal(normalizarSala(' ABCDE-23456 '), 'abcde23456');
});

test('un paquete propio ida y vuelta por el formato de ntfy', () => {
  const p = paquete({ tipo: 'aviso', id: '3-aviso', texto: '*Aviso*\nNevera', hora: '14:02' });
  const evento = JSON.stringify({ id: 'x', time: 1, event: 'message', topic: 't', message: p });
  assert.deepEqual(leerEventoNtfy(evento), { tipo: 'aviso', id: '3-aviso', texto: '*Aviso*\nNevera', hora: '14:02' });
});

test('lo que no tiene la forma esperada se descarta', () => {
  assert.equal(leerEventoNtfy('no json'), null);
  assert.equal(leerEventoNtfy(JSON.stringify({ event: 'keepalive' })), null);
  assert.equal(leerEventoNtfy(JSON.stringify({ event: 'message', message: 'hola' })), null);
  assert.equal(leerPaquete(JSON.stringify({ v: 1, tipo: 'borrar-todo', id: 'a', texto: 'x' })), null);
  assert.equal(leerPaquete(JSON.stringify({ v: 1, tipo: 'aviso', id: 'a', texto: 'x'.repeat(5000) })), null);
  assert.equal(leerPaquete(JSON.stringify({ v: 2, tipo: 'aviso', id: 'a', texto: 'x' })), null);
});

test('un texto más largo que el tope se descarta aunque el paquete entero sea corto', () => {
  assert.ok(leerPaquete(JSON.stringify({ v: 1, tipo: 'aviso', id: 'a', texto: 'x'.repeat(MAX_TEXTO) })));
  assert.equal(leerPaquete(JSON.stringify({ v: 1, tipo: 'aviso', id: 'a', texto: 'x'.repeat(MAX_TEXTO + 1) })), null);
});

test('después de restablecer, el aviso «1» lleva otro id y el teléfono no lo descarta como visto', () => {
  const vistos = new Set([idRelevo('aaaa1111', '1-aviso'), idRelevo('aaaa1111', '2-aviso')]);
  const nuevo = idRelevo('bbbb2222', '1-aviso');
  assert.ok(!vistos.has(nuevo));
  const p = leerPaquete(paquete({ tipo: 'aviso', id: idRelevo('bbbb2222', '12345-resuelto'), texto: 'x', hora: '' }));
  assert.equal(p.id, 'bbbb2222-12345-resuelto', 'el id entra entero en el paquete');
});
