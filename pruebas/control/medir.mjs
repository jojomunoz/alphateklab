// Mide el buscador con la batería de control (pruebas/control/bateria.json): 87 frases que escribieron agentes en el
// papel de dueños de negocios, sin ver cómo está afinado. De la mitad «control» solo se imprimen las cifras; las fallas
// una por una solo de la mitad «desarrollo» (ver la regla dentro del JSON). Uso: node pruebas/control/medir.mjs
import { readFileSync } from 'node:fs';
import { SECTORES, TIPOS, SERVICIOS } from '../../datos/catalogo.mjs';
import { PALABRAS, PALABRAS_NEGOCIO, EQUIVALENCIAS, VACIAS } from '../../datos/busqueda.mjs';
import { SITUACIONES } from '../../datos/situaciones.mjs';
import { SOLUCIONES } from '../../datos/soluciones.mjs';
import { DEMOS } from '../../datos/demos.mjs';
import { GUIAS } from '../../datos/guias.mjs';
import { FICHAS } from '../../datos/fichas.mjs';
import { construirIndice } from '../../js/indice.mjs';
import { prepararIndice, buscar } from '../../js/buscador.mjs';

const indice = prepararIndice(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS, PALABRAS_NEGOCIO, GUIAS, FICHAS, SITUACIONES, EQUIVALENCIAS, VACIAS }));
const { frases } = JSON.parse(readFileSync(new URL('./bateria.json', import.meta.url), 'utf8'));

export function medir(mitad) {
  const m = { con: 0, t1: 0, t3: 0, primerServicio: 0, sinNada: 0, aLaVista: 0, ninguno: 0, ningunoVacio: 0, fallas: [] };
  for (const f of frases.filter((x) => !mitad || x.mitad === mitad)) {
    const res = buscar(indice, f.frase, { limite: 8 });
    const ids = res.map((x) => x.id);
    if (f.ninguno) {
      m.ninguno++;
      if (!ids.length) m.ningunoVacio++;
      else m.fallas.push(`[ninguno] «${f.frase}» → ${ids.slice(0, 3).join(', ')}`);
      continue;
    }
    m.con++;
    const ok1 = f.aceptables.includes(ids[0]);
    if (ok1) m.t1++;
    if (ids.slice(0, 3).some((id) => f.aceptables.includes(id))) m.t3++;
    if (f.aceptables.includes(res.find((x) => x.tipo === 'servicio')?.id)) m.primerServicio++;
    if (!ids.length) m.sinNada++;
    // lo que la persona ve: los resultados o, si no hay, «lo más parecido que hacemos» (como parecidos() en js/sitio.js)
    const vista = ids.length ? ids.slice(0, 3) : buscar(indice, f.frase, { limite: 3, minimo: 3 }).filter((x) => x.tipo === 'servicio').map((x) => x.id);
    if (vista.some((id) => f.aceptables.includes(id))) m.aLaVista++;
    if (!ok1) m.fallas.push(`«${f.frase}» → ${ids.slice(0, 3).join(', ') || '(nada)'}  [vale: ${f.aceptables.join(', ')}]`);
  }
  return m;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const mitad of ['desarrollo', 'control']) {
    const m = medir(mitad);
    const pc = (a, b) => `${a}/${b} (${Math.round((100 * a) / b)} %)`;
    console.log(`${mitad}: primero correcto ${pc(m.t1, m.con)} · entre los 3 primeros ${pc(m.t3, m.con)} · a la vista (resultados o «lo más parecido») ${pc(m.aLaVista, m.con)} · sin resultados ${m.sinNada} · «no lo tenemos» bien dicho ${pc(m.ningunoVacio, m.ninguno)}`);
    if (mitad === 'desarrollo' && process.argv.includes('--fallas')) console.log('  ' + m.fallas.join('\n  '));
  }
}
