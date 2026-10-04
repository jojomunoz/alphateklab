// Cada script del sitio se carga como módulo; un error de sintaxis (por ejemplo, declarar dos veces la misma constante,
// como pasó el 3-oct con cabeceraEl en sitio.js) apaga la página entera: menú, buscador y lista. Las pruebas de unidad
// no importan sitio.js ni los demás scripts de página, así que aquí se revisa la sintaxis de todos con node --check,
// sobre una copia .mjs para que Node los lea como módulos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const JS = new URL('../js/', import.meta.url).pathname;
const archivos = readdirSync(JS).filter((f) => /\.(m?js)$/.test(f));

test('hay scripts que revisar', () => assert.ok(archivos.length >= 5, `solo ${archivos.length}`));

for (const f of archivos) {
  test(`js/${f} es un módulo sin errores de sintaxis`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'atk-sintaxis-'));
    try {
      const copia = join(dir, f.replace(/\.js$/, '.mjs'));
      copyFileSync(join(JS, f), copia);
      execFileSync(process.execPath, ['--check', copia], { stdio: 'pipe' });
    } catch (e) {
      assert.fail(String(e.stderr || e.message).split('\n').slice(0, 4).join('\n'));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
