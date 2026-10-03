// Junta las fichas redactadas (journal del workflow «alphateklab-fichas») en datos/fichas.mjs.
// Uso: node herramientas/juntar-fichas.mjs <journal.jsonl>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(RAIZ, 'datos/fichas.mjs');
const L = readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const etiqueta = {};
for (const o of L) if (o.type === 'started') etiqueta[o.key] = o.label;
let FICHAS = {};
if (existsSync(destino)) ({ FICHAS } = await import(pathToFileURL(destino).href + '?' + Date.now()));
let nuevas = 0;
for (const o of L) {
  if (o.type !== 'result' || !/^revisar:/.test(etiqueta[o.key] || '')) continue;
  const v = typeof o.result === 'string' ? JSON.parse(o.result) : o.result ?? o.value;
  for (const f of v?.fichas || []) {
    const { id, ...resto } = f;
    FICHAS[id] = resto;
    nuevas++;
  }
}
const cuerpo = Object.keys(FICHAS).sort().map((id) => `  ${id}: ${JSON.stringify(FICHAS[id], null, 2).replace(/\n/g, '\n  ')},`).join('\n');
writeFileSync(destino, `// Detalle de cada servicio (cómo funciona, qué necesitas, qué no incluye, preguntas, ejemplo).\n// Redactado por agentes con los datos del catálogo y revisado por otro agente; se junta con herramientas/juntar-fichas.mjs.\nexport const FICHAS = {\n${cuerpo}\n};\n`);
console.log(`fichas en total: ${Object.keys(FICHAS).length} (${nuevas} leídas ahora)`);
