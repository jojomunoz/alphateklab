// Las 40 frases de las 5 personas de la revisión «encontrar» (3-oct-2026), dichas como las diría el cliente.
// Mide si el buscador trae primero el servicio correcto; el umbral sube a medida que mejora, nunca baja.
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
  'fonda: Yappy en la mesa': { ok1: ['R02'], ok3: ['R02', 'R03', 'sol-restaurantes'], qs: ['yappy en la mesa', 'cobrar con yappy en la mesa', 'que me paguen con yappy en la mesa', 'pagar desde la mesa', 'que el cliente pague en la mesa con yappy', 'pago con qr en la mesa', 'cobrar en las mesas', 'que los clientes paguen sin esperar la cuenta'] },
  'clínica: pacientes que no llegan': { ok1: ['S01'], ok3: ['S01', 'sol-clinicas'], qs: ['pacientes que no llegan', 'pacientes que no vienen', 'los pacientes faltan a las citas', 'recordatorio de citas', 'confirmar citas por whatsapp', 'pacientes que me dejan plantado', 'citas perdidas', 'ausentismo de pacientes'] },
  'ferretería: robo': { ok1: ['C05'], ok3: ['C05', 'T11', 'C04', 'sol-tiendas'], qs: ['me roban', 'creo que me roban', 'empleados que roban', 'me falta mercancia', 'robos en la ferreteria', 'camaras para robos', 'faltantes en caja', 'la caja no cuadra'] },
  'corredor: extranjeros': { ok1: ['B01', 'demo-recorrido-360'], ok3: ['B01', 'demo-recorrido-360', 'B05', 'sol-bienes-raices'], qs: ['mostrar apartamentos a extranjeros', 'tour virtual', 'recorrido virtual de apartamentos', 'mostrar propiedades a clientes de afuera', 'video 360 de apartamentos', 'que vean el apartamento sin venir', 'fotos 360', 'recorrido 3d'] },
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
      if (!ids.length) cero++;
    }
  }
  return { t1, t3, cero, n, fallas };
}

test('las 40 frases de las personas: primero correcto, entre los 3 primeros y ninguna sin resultados', () => {
  const { t1, t3, cero, n, fallas } = medir();
  console.log(`primero correcto ${t1}/${n}; entre los 3 primeros ${t3}/${n}; sin resultados ${cero}`);
  if (fallas.length) console.log('  ' + fallas.join('\n  '));
  assert.ok(t1 / n >= Number(process.env.UMBRAL_1 ?? 0.95), `primero correcto ${t1}/${n}`);
  assert.ok(t3 / n >= 0.95, `entre los 3 primeros ${t3}/${n}`);
  assert.equal(cero, 0);
});
