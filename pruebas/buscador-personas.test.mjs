// Las frases de las personas de la revisión «encontrar» (3-oct-2026), dichas como las diría el cliente.
// Mide si el buscador trae primero el servicio correcto; el umbral sube a medida que mejora, nunca baja.
// Solo software (oct-2026): de las 5 personas quedan 3 (24 frases). El ferretero (cámaras contra robos) y el corredor
// (recorridos 360 y 3D) pedían equipos y visitas que ya no hacemos: sus 16 frases pasaron a
// pruebas/buscador-solo-software.test.mjs, que pide que no se contesten como si los hiciéramos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { PALABRAS, PALABRAS_NEGOCIO, EQUIVALENCIAS, VACIAS, AMBIGUAS } from '../datos/busqueda.mjs';
import { SITUACIONES } from '../datos/situaciones.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { GUIAS } from '../datos/guias.mjs';
import { FICHAS } from '../datos/fichas.mjs';
import { construirIndice } from '../js/indice.mjs';
import { prepararIndice, buscar } from '../js/buscador.mjs';

const indice = prepararIndice(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS, PALABRAS_NEGOCIO, GUIAS, FICHAS, SITUACIONES, EQUIVALENCIAS, VACIAS, AMBIGUAS }));

export const PERSONAS = {
  'fonda: Yappy en la mesa': { ok1: ['R02'], ok3: ['R02', 'sol-restaurantes'], qs: ['yappy en la mesa', 'cobrar con yappy en la mesa', 'que me paguen con yappy en la mesa', 'pagar desde la mesa', 'que el cliente pague en la mesa con yappy', 'pago con qr en la mesa', 'cobrar en las mesas', 'que los clientes paguen sin esperar la cuenta'] },
  'clínica: pacientes que no llegan': { ok1: ['S01'], ok3: ['S01', 'sol-clinicas'], qs: ['pacientes que no llegan', 'pacientes que no vienen', 'los pacientes faltan a las citas', 'recordatorio de citas', 'confirmar citas por whatsapp', 'pacientes que me dejan plantado', 'citas perdidas', 'ausentismo de pacientes'] },
  'gerente: app para vendedores': { ok1: ['T03', 'T02'], ok3: ['T03', 'T02', 'T15'], qs: ['app para mis vendedores', 'app interna para vendedores', 'aplicacion para vendedores', 'app para la fuerza de ventas', 'app para mi equipo de ventas', 'que mis vendedores tomen pedidos en la calle', 'sistema para vendedores', 'app para empleados'] },
};

export function medir() {
  let t1 = 0, t3 = 0, cero = 0, n = 0;
  const fallas = [];
  for (const [k, v] of Object.entries(PERSONAS)) {
    for (const q of v.qs) {
      const ids = buscar(indice, q, { limite: 8 }).map((x) => x.id);
      n++;
      if (v.ok1.includes(ids[0])) t1++;
      else fallas.push(`${k} · «${q}» → ${ids.slice(0, 3).join(', ') || '(nada)'}`);
      if (ids.slice(0, 3).some((id) => v.ok3.includes(id))) t3++;
      // sin resultados es que no vea nada: ni resultados ni «lo más parecido que hacemos» (como «a la vista» en
      // pruebas/control/medir.mjs y parecidos() en js/sitio.js)
      if (!ids.length && !buscar(indice, q, { limite: 3, minimo: 3 }).some((x) => x.tipo === 'servicio')) cero++;
    }
  }
  return { t1, t3, cero, n, fallas };
}

// El 3-oct eran 38 de 40 (95 %). Las dos que fallaban siguen igual y son de las personas que quedan («cobrar en las
// mesas» trae primero el mapa de mesas; «citas perdidas» traía las cámaras contra pérdidas y ahora da «lo más
// parecido»: el agente de citas), así que el piso queda en no más de esas dos fallas: 22 de 24.
test('las 24 frases de las personas: primero correcto, entre los 3 primeros y ninguna sin nada a la vista', () => {
  const { t1, t3, cero, n, fallas } = medir();
  console.log(`primero correcto ${t1}/${n}; entre los 3 primeros ${t3}/${n}; sin nada a la vista ${cero}`);
  if (fallas.length) console.log('  ' + fallas.join('\n  '));
  assert.ok(t1 / n >= Number(process.env.UMBRAL_1 ?? 22 / 24), `primero correcto ${t1}/${n}`);
  assert.ok(t3 / n >= 0.95, `entre los 3 primeros ${t3}/${n}`);
  assert.equal(cero, 0);
});
