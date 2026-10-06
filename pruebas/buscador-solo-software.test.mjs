// Solo software (6-oct-2026): lo que se busca de equipos (cámaras, sensores, GPS, dron, cerraduras, kioscos, Wi-Fi,
// recorridos 360) no se contesta como si lo hiciéramos: el buscador no trae ningún servicio y la persona ve «no lo
// tenemos» (y «lo más parecido que hacemos» si algo se acerca). Las frases son mías, escritas con los nombres de los
// servicios que se quitaron, no de la batería de control; las de las dos personas de la revisión que pedían equipos
// están abajo en YA_NO (antes en pruebas/buscador-personas.test.mjs).
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
const servicios = (q, o) => buscar(indice, q, { limite: 8, ...o }).filter((r) => r.tipo === 'servicio').map((r) => r.id);

// Las frases de las dos personas de la revisión «encontrar» (3-oct-2026) que pedían equipos: el ferretero (cámaras contra
// robos) y el corredor (recorridos 360 y 3D). Venían de pruebas/buscador-personas.test.mjs.
const YA_NO = {
  'ferretería: robo': ['me roban', 'creo que me roban', 'empleados que roban', 'me falta mercancia', 'robos en la ferreteria', 'camaras para robos', 'faltantes en caja', 'la caja no cuadra'],
  'corredor: extranjeros': ['mostrar apartamentos a extranjeros', 'tour virtual', 'recorrido virtual de apartamentos', 'mostrar propiedades a clientes de afuera', 'video 360 de apartamentos', 'que vean el apartamento sin venir', 'fotos 360', 'recorrido 3d'],
};

// los códigos que se quitaron: ninguno puede volver a salir en el buscador
const QUITADOS = ['R03', 'R06', 'R09', 'R10', 'C01', 'C02', 'C03', 'C04', 'C05', 'C07', 'C09', 'H03', 'H05', 'H06', 'I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'I09', 'I10', 'E02', 'T10', 'T11', 'T19', 'B01', 'B02', 'B03', 'B06'];

test('el índice del buscador no tiene servicios, páginas, demos ni guías de equipos', () => {
  const ids = indice.map((e) => e.id);
  assert.deepEqual(ids.filter((id) => QUITADOS.includes(id)), []);
  assert.ok(!ids.includes('sol-industria-y-oficinas'));
  assert.deepEqual(ids.filter((id) => id.startsWith('demo-')).sort(), ['demo-mesa', 'demo-reservas']);
  assert.ok(!ids.includes('guia-camaras-y-ley-81'));
});

const EQUIPOS = [
  'cámaras de seguridad', 'cámara de seguridad para el local', 'cctv', 'camaras para robos',
  'sensor de temperatura para la nevera', 'gps para mis camiones', 'dron', 'tomas con dron del terreno',
  'kiosco táctil para pedidos', 'pantalla táctil de autopedido', 'cerradura con código para las cabañas',
  'reloj marcador para empleados', 'control de acceso con huella para empleados', 'lector de placas en el estacionamiento',
  'wifi para clientes', 'soporte técnico para la computadora', 'fotos 360', 'video 360 de apartamentos',
  'instalar paneles solares en el techo', 'básculas conectadas', 'etiquetas nfc para las mesas', 'mapa de calor de la tienda',
  'fotos profesionales del apartamento',
];
for (const q of EQUIPOS) {
  test(`«${q}» no trae ningún servicio: «no lo tenemos»`, () => {
    assert.deepEqual(servicios(q), []);
  });
}

test('lo que pedían el ferretero y el corredor no trae nada de equipos, y lo que se acerca es software', () => {
  for (const q of Object.values(YA_NO).flat()) {
    const ids = [...servicios(q), ...servicios(q, { minimo: 3 })];
    assert.deepEqual(ids.filter((id) => QUITADOS.includes(id)), [], q);
  }
  // la caja que no cuadra: el punto de venta con cierre por turno y por cajero
  assert.equal(servicios('la caja no cuadra')[0], 'R11');
  assert.equal(servicios('faltantes en caja')[0], 'R11');
  // el recorrido virtual: tu sitio de propiedades, con el recorrido que ya tengas
  assert.equal(servicios('recorrido virtual de apartamentos')[0], 'B05');
  assert.equal(servicios('mostrar propiedades a clientes de afuera')[0], 'B05');
});

test('«Bodegas, oficinas e industria» se juntó con «Cualquier negocio»: sus palabras llevan ahí', () => {
  assert.equal(buscar(indice, 'empresa de logistica')[0]?.id, 'sol-cualquier-negocio');
  assert.ok(buscar(indice, 'oficina').some((r) => r.id === 'sol-cualquier-negocio'));
});
