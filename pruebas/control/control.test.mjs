// Piso del buscador con la batería de control (ver bateria.json): solo cifras totales, nunca las frases una por una.
// El piso sube cuando el buscador mejora y nunca baja. Medido el 3-oct-2026.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medir } from './medir.mjs';

test('mitad de control: no retrocede', () => {
  const m = medir('control');
  assert.ok(m.t1 >= 18, `primero correcto ${m.t1}/${m.con}`);
  assert.ok(m.aLaVista >= 26, `a la vista ${m.aLaVista}/${m.con}`);
  assert.ok(m.ningunoVacio >= 6, `«no lo tenemos» ${m.ningunoVacio}/${m.ninguno}`);
});

test('mitad de desarrollo: no retrocede', () => {
  const m = medir('desarrollo');
  assert.ok(m.t1 >= 25, `primero correcto ${m.t1}/${m.con}`);
  assert.ok(m.aLaVista >= 32, `a la vista ${m.aLaVista}/${m.con}`);
  assert.ok(m.ningunoVacio >= 6, `«no lo tenemos» ${m.ningunoVacio}/${m.ninguno}`);
});
