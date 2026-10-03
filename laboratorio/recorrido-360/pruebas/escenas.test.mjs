import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESCENAS, PRIMERA, validarRecorrido, configuracionPannellum } from '../escenas.mjs';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..');

test('el recorrido es válido y cada foto existe', () => {
  assert.deepEqual(validarRecorrido(), []);
  for (const e of Object.values(ESCENAS)) assert.ok(existsSync(join(DIR, e.foto)), e.foto);
});

test('la validación detecta un enlace roto y una escena aislada', () => {
  const rotas = structuredClone(ESCENAS);
  rotas.sala.puntos.push({ tipo: 'ir', a: 'terraza', yaw: 0, pitch: 0 });
  rotas.cocina = { nombre: 'Cocina', foto: 'x.jpg', autor: 'x', fuente: 'x', vista: { yaw: 0, pitch: 0 }, puntos: [] };
  const e = validarRecorrido(rotas, PRIMERA);
  assert.ok(e.some((x) => /terraza/.test(x)));
  assert.ok(e.some((x) => /cocina: no se puede llegar/.test(x)));
  assert.ok(e.some((x) => /cocina: no tiene salida/.test(x)));
});

test('la configuración de Pannellum trae una escena por foto y los saltos con texto en español', () => {
  const c = configuracionPannellum();
  assert.equal(c.default.firstScene, 'sala');
  assert.deepEqual(Object.keys(c.scenes), Object.keys(ESCENAS));
  const salto = c.scenes.sala.hotSpots.find((h) => h.type === 'scene' && h.sceneId === 'bano');
  assert.equal(salto.text, 'Ir a baño');
});
