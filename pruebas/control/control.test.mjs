// Piso del buscador con la batería de control (ver bateria.json): solo cifras totales, nunca las frases una por una.
// El piso sube cuando el buscador mejora y nunca baja. Medido el 3-oct-2026.
//
// 6-oct-2026, solo software: bajaron los pisos que contaban servicios de equipos que ya no existen. Comparado frase por
// frase contra el catálogo anterior, sin leer las de control (solo sus cifras):
// - control, primero correcto 18 → 11: 7 de las 18 tenían de primera respuesta correcta un servicio de equipos quitado
//   (11 de sus 33 frases solo aceptan equipos); las otras 11 siguen bien.
// - control, a la vista 26 → 19: 8 se veían solo por un servicio de equipos; una frase más se ve ahora.
// - control, «no lo tenemos» 6 → 5: una frase que quedaba a 0,1 del mínimo (5,9 de 6) pasa a 6,4 porque, con 32
//   servicios menos, las palabras que comparte con lo que queda pesan más (su rareza sube). Pasa igual quitando solo los
//   32 servicios de los datos anteriores, sin ningún otro cambio; no se afinó nada contra la mitad de control.
// - desarrollo, primero correcto 25 → 17 y a la vista 32 → 21: 10 y 11 frases contaban equipos; las demás siguen bien
//   y dos frases más salen bien. «No lo tenemos» sube de 6 a 8 (ya no contesta con el recorrido 3D ni con sensores).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medir } from './medir.mjs';

test('mitad de control: no retrocede', () => {
  const m = medir('control');
  assert.ok(m.t1 >= 11, `primero correcto ${m.t1}/${m.con}`);
  assert.ok(m.aLaVista >= 19, `a la vista ${m.aLaVista}/${m.con}`);
  assert.ok(m.ningunoVacio >= 5, `«no lo tenemos» ${m.ningunoVacio}/${m.ninguno}`);
});

test('mitad de desarrollo: no retrocede', () => {
  const m = medir('desarrollo');
  assert.ok(m.t1 >= 17, `primero correcto ${m.t1}/${m.con}`);
  assert.ok(m.aLaVista >= 21, `a la vista ${m.aLaVista}/${m.con}`);
  assert.ok(m.ningunoVacio >= 8, `«no lo tenemos» ${m.ningunoVacio}/${m.ninguno}`);
});
