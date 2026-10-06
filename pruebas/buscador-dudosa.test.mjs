// «No lo tenemos descrito así» (esDudosa en js/buscador.mjs): a «sistema para mi gimnasio» el buscador contestaba
// con 7 servicios encabezados por barberías, como si fuera respuesta (revisión del 3-oct-2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { PALABRAS, PALABRAS_NEGOCIO, EQUIVALENCIAS, VACIAS, AMBIGUAS } from '../datos/busqueda.mjs';
import { SITUACIONES } from '../datos/situaciones.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { GUIAS } from '../datos/guias.mjs';
import { FICHAS } from '../datos/fichas.mjs';
import { construirIndice } from '../js/indice.mjs';
import { prepararIndice, buscar, esDudosa } from '../js/buscador.mjs';

const indice = prepararIndice(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS, PALABRAS_NEGOCIO, GUIAS, FICHAS, SITUACIONES, EQUIVALENCIAS, VACIAS, AMBIGUAS }));

test('dice «no lo tenemos descrito así» a un negocio que no tenemos descrito', () => {
  for (const f of ['sistema para mi gimnasio', 'sistema para mi farmacia', 'gimnasio']) assert.ok(esDudosa(indice, f), f);
});

test('no lo dice a lo que sí hacemos, ni a una palabra a medio escribir', () => {
  // solo software desde oct-2026: sin «cámara», «sensor» ni «kiosco», que ya no hacemos
  for (const f of ['whatsapp', 'yappy', 'agenda', 'respaldo', 'tienda en linea', 'coti', 'cam', 'menu qr', 'pedir y pagar desde la mesa', 'recordar citas', 'pagina web', 'inventario', 'factura electronica']) {
    assert.equal(esDudosa(indice, f), false, f);
  }
});

test('en la batería de frases reales no da ninguna falsa alarma (ninguna frase con el primer resultado correcto)', () => {
  const { frases } = JSON.parse(readFileSync(new URL('./control/bateria.json', import.meta.url), 'utf8'));
  const falsas = frases.filter((f) => !f.ninguno && esDudosa(indice, f.frase) && f.aceptables.includes(buscar(indice, f.frase, { limite: 8 })[0]?.id));
  assert.equal(falsas.length, 0);
});
