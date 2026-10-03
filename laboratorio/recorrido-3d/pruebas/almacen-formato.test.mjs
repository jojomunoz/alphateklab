import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearAlmacen } from '../js/nucleo/almacen.mjs';
import { metros, area, numero, medidas, redondear, cuenta, listaNombres, leerNumero } from '../js/nucleo/formato.mjs';
import { partirNombre, tamanoEtiqueta, svgPlano, etiquetaCompacta } from '../js/nucleo/svg-plano.mjs';
import { giroDePuerta } from '../js/nucleo/etiquetas.mjs';
import { construirModelo } from '../js/nucleo/plano.mjs';
import { planoEjemplo } from '../herramientas/escribir-plano-ejemplo.mjs';

function storageFalso() {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
    datos,
  };
}

test('almacén: guarda y lee con versión de esquema', () => {
  const s = storageFalso();
  const a = crearAlmacen(() => s, 'clave', 1);
  assert.equal(a.leer(), null);
  assert.equal(a.guardar({ hola: 1 }), true);
  assert.deepEqual(a.leer(), { hola: 1 });
  const otraVersion = crearAlmacen(() => s, 'clave', 2);
  assert.equal(otraVersion.leer(), null, 'un esquema distinto no se lee');
  a.borrar();
  assert.equal(a.leer(), null);
});

test('almacén: si localStorage lanza, sigue funcionando en memoria', () => {
  const roto = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceeded'); }, removeItem() { throw new Error('x'); } };
  const a = crearAlmacen(() => roto, 'clave', 1);
  assert.equal(a.guardar({ x: 1 }), false);
  assert.equal(a.leer(), null);
  assert.doesNotThrow(() => a.borrar());
  const sinAcceso = crearAlmacen(() => { throw new Error('denegado'); }, 'clave', 1);
  assert.equal(sinAcceso.guardar({ x: 2 }), false);
  assert.deepEqual(sinAcceso.leer(), { x: 2 }, 'sin localStorage queda en memoria');
});

test('almacén: JSON corrupto se ignora', () => {
  const s = storageFalso();
  s.setItem('clave', '{roto');
  assert.equal(crearAlmacen(() => s, 'clave', 1).leer(), null);
});

test('almacén: dice por qué no pudo leer lo guardado, y si el navegador deja guardar', () => {
  const s = storageFalso();
  const a = crearAlmacen(() => s, 'clave', 1);
  assert.deepEqual(a.leerDetalle(), { valor: null, motivo: null }, 'nada guardado no es un error');
  s.setItem('clave', '{roto');
  assert.match(a.leerDetalle().motivo, /dañados/);
  s.setItem('clave', JSON.stringify({ esquema: 7, valor: {} }));
  assert.match(a.leerDetalle().motivo, /otra versión del editor \(7\)/);
  assert.equal(a.disponible(), true);
  assert.equal(s.datos.has('clave:prueba'), false, 'la prueba no deja basura');
  const roto = { getItem() { return null; }, setItem() { throw new Error('QuotaExceeded'); }, removeItem() {} };
  assert.equal(crearAlmacen(() => roto, 'clave', 1).disponible(), false);
  assert.equal(crearAlmacen(() => { throw new Error('SecurityError'); }, 'clave', 1).disponible(), false);
});

test('formato de Panamá: punto decimal, 2 decimales', () => {
  assert.equal(metros(2.456), '2.46 m');
  assert.equal(metros(1.005), '1.01 m');
  assert.equal(area(95.04), '95.04 m²');
  assert.equal(numero(12345.678, 1), '12,345.7');
  assert.equal(medidas(3.8, 3.4), '3.80 × 3.40 m');
  assert.equal(redondear(0.125, 2), 0.13);
});

test('concordancia y listas: «1 ambiente», ««A», «B» y «C»»', () => {
  assert.equal(cuenta(1, 'ambiente'), '1 ambiente');
  assert.equal(cuenta(0, 'ambiente'), '0 ambientes');
  assert.equal(cuenta(5, 'ambiente'), '5 ambientes');
  assert.equal(listaNombres(['A']), '«A»');
  assert.equal(listaNombres(['A', 'B', 'C']), '«A», «B» y «C»');
  assert.equal(listaNombres(['Sala', 'Isla']), '«Sala» e «Isla»');
});

test('una medida escrita a mano acepta la coma decimal y no toma un campo vacío como 0', () => {
  assert.equal(leerNumero('2,5'), 2.5);
  assert.equal(leerNumero('2.5'), 2.5);
  assert.equal(leerNumero(' 3 '), 3);
  assert.equal(leerNumero('.5'), 0.5);
  for (const malo of ['', '   ', 'abc', '2,5,1', '1e9', '2 m', null, undefined]) assert.ok(Number.isNaN(leerNumero(malo)), `«${malo}» debía dar NaN`);
});

test('nombres largos se parten en dos líneas por el espacio del medio', () => {
  assert.deepEqual(partirNombre('Baño principal', 8), ['Baño', 'principal']);
  assert.deepEqual(partirNombre('Cocina', 3), ['Cocina']);
});

test('la etiqueta de un baño angosto usa dos líneas y letra más chica', () => {
  const m = construirModelo(planoEjemplo());
  const bano = m.ambientes.find((a) => a.id === 'bano-principal');
  const sala = m.ambientes.find((a) => a.id === 'sala-comedor');
  const b = tamanoEtiqueta(bano), s = tamanoEtiqueta(sala);
  assert.equal(b.lineas.length, 2);
  assert.ok(b.t < s.t);
});

test('el SVG del plano trae un piso por ambiente, sus áreas y las cotas generales', () => {
  const m = construirModelo(planoEjemplo());
  const svg = svgPlano(m, { titulo: 'Plano', idTitulo: 'x' });
  assert.equal((svg.match(/class="pl-piso /g) || []).length, m.ambientes.length);
  assert.ok(svg.includes('27.56 m²'));
  assert.ok(svg.includes('11.00 m') && svg.includes('8.00 m'));
  assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'));
  assert.equal((svg.match(/class="pl-puerta/g) || []).length, m.aberturas.filter((a) => a.tipo.startsWith('puerta')).length);
});

test('las ventanas altas (sobre el corte a 1.20 m) se dibujan en discontinua, sin cortar el muro', () => {
  const m = construirModelo(planoEjemplo());
  const svg = svgPlano(m);
  const altas = m.aberturas.filter((a) => a.tipo === 'ventana' && a.antepecho > 1.2).length;
  assert.equal(altas, 2, 'las dos ventanas de baño del ejemplo');
  assert.equal((svg.match(/class="pl-ventana-alta"/g) || []).length, altas);
  assert.equal((svg.match(/class="pl-ventana"/g) || []).length, m.aberturas.filter((a) => a.tipo === 'ventana').length - altas);
});

test('rótulos compactos (teléfono): letra de 0.36 m o más en cada ambiente del ejemplo, dentro y sin pisar puertas', () => {
  const m = construirModelo(planoEjemplo());
  const svg = svgPlano(m, { compactas: true });
  assert.match(svg, /class="pl-etiquetas pl-etiquetas--normales"/);
  assert.match(svg, /class="pl-etiquetas pl-etiquetas--compactas"/);
  const giros = m.aberturas.map(giroDePuerta).filter(Boolean);
  for (const amb of m.ambientes) {
    const e = etiquetaCompacta(amb, giros);
    // El plano mide unos 358 px en un teléfono de 390: 0.36 m de letra son 10 px (antes había rótulos de 6 px).
    assert.ok(e.t >= 0.36, `${amb.nombre}: letra de ${e.t.toFixed(3)} m`);
  }
  assert.doesNotMatch(svgPlano(m), /pl-etiquetas--compactas/, 'sin pedirlos no se agregan');
});

test('svgPlano con soloContenido devuelve los grupos sin la etiqueta <svg>', () => {
  const m = construirModelo(planoEjemplo());
  const s = svgPlano(m, { titulo: 'x', idTitulo: 'y', soloContenido: true });
  assert.ok(s.startsWith('<g class="pl-pisos">'), s.slice(0, 40));
  assert.ok(!s.includes('<svg') && !s.includes('</svg>') && !s.includes('<title'));
});
