import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTORES, TIPOS, SERVICIOS } from '../datos/catalogo.mjs';
import { PALABRAS } from '../datos/busqueda.mjs';
import { SOLUCIONES } from '../datos/soluciones.mjs';
import { DEMOS } from '../datos/demos.mjs';
import { construirIndice } from '../js/indice.mjs';
import { prepararIndice, buscar, normalizar, fichas, parecido, mensajePregunta } from '../js/buscador.mjs';

const indice = prepararIndice(construirIndice({ SERVICIOS, PALABRAS, SECTORES, TIPOS, SOLUCIONES, DEMOS }));
const primeros = (q, n = 3) => buscar(indice, q).slice(0, n).map((r) => r.id);

test('normaliza tildes, mayúsculas y signos', () => {
  assert.equal(normalizar('¿Cámara de Seguridad?'), 'camara de seguridad');
  assert.deepEqual(fichas('Quiero que los clientes pidan desde la mesa'), ['clientes', 'pidan', 'mesa']);
});

test('parecido acepta plurales y familias de palabras, no coincidencias cortas', () => {
  assert.equal(parecido('camaras', 'camara'), 0.8);
  assert.equal(parecido('contar', 'contador'), 0.8);
  assert.equal(parecido('pedir', 'pedidos'), 0.8);
  assert.equal(parecido('mesa', 'mesero'), 0);
  assert.equal(parecido('web', 'web'), 1);
});

test('cada servicio tiene sus palabras de búsqueda', () => {
  for (const s of SERVICIOS) assert.ok(PALABRAS[s.id]?.length > 10, s.id);
  assert.deepEqual(Object.keys(PALABRAS).filter((id) => !SERVICIOS.some((s) => s.id === id)), []);
});

// Lo que escribiría alguien que llega por curiosidad, y lo que debería ver primero.
const CASOS = [
  ['que los clientes pidan desde la mesa', 'R02'],
  ['menú QR', 'R01'],
  ['llamar al mesero', 'R02'],
  ['pantalla para la cocina', 'R05'],
  ['kiosco táctil para pedidos', 'R06'],
  ['contar cuántas personas entran a mi tienda', 'C01'],
  ['recordar las citas a mis pacientes', 'S01'],
  ['doble reserva airbnb', 'H02'],
  ['recorrido virtual de un apartamento', 'B01'],
  ['inventario', 'C04|T14'],
  ['página web', 'T01'],
  ['una app para mi negocio', 'T03'],
  ['chatbot de whatsapp', 'T05|B04'],
  ['factura electrónica', 'T07'],
  ['cámaras de seguridad', 'T11|C05'],
  ['sensor de temperatura para la nevera', 'R10'],
  ['gps para mis camiones', 'I02'],
  ['lavado de autos', 'V01'],
  ['cobrar mensualidades del colegio', 'E01'],
  ['pos', 'R11'],
  ['delivery sin comisión', 'R07'],
  ['backup de las computadoras', 'T18'],
  ['leer facturas con inteligencia artificial', 'T21'],
  ['dron', 'B06|I10'],
  ['excel', 'T02'],
];

for (const [consulta, esperado] of CASOS) {
  test(`«${consulta}» encuentra ${esperado} entre los 3 primeros`, () => {
    const ids = primeros(consulta);
    assert.ok(ids.some((id) => new RegExp(`^(${esperado})$`).test(id)), `${consulta} → ${ids.join(', ')}`);
  });
}

test('lo que no ofrecemos no devuelve nada y se puede preguntar', () => {
  assert.deepEqual(buscar(indice, 'construir un cohete a la luna'), []);
  assert.deepEqual(buscar(indice, 'zapatos de cuero'), []);
  assert.equal(mensajePregunta('  imprimir camisetas  ', { negocio: 'Taller X' }), 'Hola, alphateklab. ¿Pueden hacer esto?\n\nimprimir camisetas\n\nMi negocio: Taller X');
});

test('una búsqueda vacía o de puras palabras vacías no devuelve nada', () => {
  assert.deepEqual(buscar(indice, ''), []);
  assert.deepEqual(buscar(indice, 'quiero un sistema para mi negocio'), []);
});

test('buscar un tipo de negocio sugiere su página de soluciones', () => {
  assert.ok(buscar(indice, 'restaurante').some((r) => r.id === 'sol-restaurantes'));
  assert.ok(buscar(indice, 'clínica').some((r) => r.id === 'sol-clinicas'));
});
