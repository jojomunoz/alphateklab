import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ajustar, rectDesdeArrastre, seEncima, validarAmbiente, cuadriculaVacia, cuadriculaEjemplo, agregarAmbiente,
  quitarAmbiente, cambiarAmbiente, bordeMasCercano, aberturaDesdeToque, validarAbertura, agregarAbertura,
  planoDesdeCuadricula, exportarJSON, importarJSON, ambientesSinPuerta, revisarCuadricula, cuadriculaDesdePlano,
  totales, sugerirNombre, aberturaCercana, ambienteDeInicio, avisoAlVerEn3D,
} from '../js/nucleo/cuadricula.mjs';
import { construirModelo, validarPlano, ambienteEn } from '../js/nucleo/plano.mjs';
import { moverConColision } from '../js/nucleo/geometria.mjs';
import { planoEjemplo } from '../herramientas/escribir-plano-ejemplo.mjs';

test('ajustar a la cuadrícula de 0.5 m', () => {
  assert.equal(ajustar(1.24), 1);
  assert.equal(ajustar(1.26), 1.5);
  assert.equal(ajustar(-0.2), -0);
});

test('rectángulo desde un arrastre: normalizado, ajustado y dentro de los límites', () => {
  const r = rectDesdeArrastre({ x: 4.1, y: 3.9 }, { x: 1.2, y: 0.8 }, { ancho: 12, largo: 10 });
  assert.deepEqual(r, { x: 1, y: 1, ancho: 3, largo: 3 });
  const fuera = rectDesdeArrastre({ x: 10, y: 9 }, { x: 15, y: 14 }, { ancho: 12, largo: 10 });
  assert.deepEqual(fuera, { x: 10, y: 9, ancho: 2, largo: 1 });
});

test('encimarse con área sí; tocarse por un borde no', () => {
  const a = { x: 0, y: 0, ancho: 3, largo: 3 };
  assert.equal(seEncima(a, { x: 3, y: 0, ancho: 2, largo: 2 }), false);
  assert.equal(seEncima(a, { x: 2.5, y: 2.5, ancho: 2, largo: 2 }), true);
});

test('validar un ambiente nuevo: tamaño mínimo, límites, cuadrícula y encimados', () => {
  const c = cuadriculaEjemplo();
  assert.match(validarAmbiente({ x: 0, y: 8, ancho: 0.5, largo: 1 }, c), /al menos 1 m/);
  assert.match(validarAmbiente({ x: 0, y: 8, ancho: 2, largo: 0.5 }, c), /al menos 1 m/, 'el mínimo vale también para el largo');
  assert.match(validarAmbiente({ x: 11, y: 8, ancho: 2, largo: 1 }, c), /se sale/);
  assert.match(validarAmbiente({ x: 0.3, y: 8, ancho: 2, largo: 1 }, c), /0.5 en 0.5/);
  assert.match(validarAmbiente({ x: 5, y: 3, ancho: 3, largo: 3 }, c), /Se encima con «Sala y cocina»/);
  assert.equal(validarAmbiente({ x: 0, y: 8, ancho: 2, largo: 2 }, c), null);
});

test('el plano con que arranca el editor se llama «de muestra», para no confundirlo con el apartamento de ejemplo', () => {
  assert.doesNotMatch(cuadriculaEjemplo().nombre, /ejemplo/i);
});

test('agregar, cambiar y quitar ambientes sin mutar la cuadrícula original', () => {
  const c0 = cuadriculaVacia();
  const r1 = agregarAmbiente(c0, { nombre: 'Sala', tipo: 'sala', x: 0, y: 0, ancho: 4, largo: 3 });
  assert.equal(r1.error, null);
  assert.equal(c0.ambientes.length, 0);
  const r2 = agregarAmbiente(r1.cuadricula, { nombre: '', tipo: 'recamara', x: 4, y: 0, ancho: 3, largo: 3 });
  assert.equal(r2.ambiente.nombre, 'Recámara');
  const r3 = agregarAmbiente(r2.cuadricula, { tipo: 'recamara', x: 0, y: 3, ancho: 3, largo: 3 });
  assert.equal(r3.ambiente.nombre, 'Recámara 2');
  const malo = cambiarAmbiente(r3.cuadricula, r3.ambiente.id, { y: 2 }); // se mete en la sala
  assert.match(malo.error, /Se encima/);
  const bien = cambiarAmbiente(r3.cuadricula, r3.ambiente.id, { nombre: 'Estudio' });
  assert.equal(bien.cuadricula.ambientes.find((a) => a.id === r3.ambiente.id).nombre, 'Estudio');
  const sin = quitarAmbiente(bien.cuadricula, r3.ambiente.id);
  assert.equal(sin.ambientes.length, 2);
});

test('un nombre de ambiente se corta a 40 letras', () => {
  const c = cuadriculaEjemplo();
  const largo = 'Recámara con vista al mar y al parque de la ciudad vieja';
  const r = cambiarAmbiente(c, 'a2', { nombre: largo });
  assert.equal(r.cuadricula.ambientes.find((a) => a.id === 'a2').nombre, largo.slice(0, 40));
});

test('sugerir nombre numera los repetidos', () => {
  const c = { ...cuadriculaVacia(), ambientes: [{ nombre: 'Baño' }, { nombre: 'Baño 2' }] };
  assert.equal(sugerirNombre(c, 'bano'), 'Baño 3');
});

test('borde más cercano y puerta propuesta al tocar', () => {
  const c = cuadriculaEjemplo();
  const b = bordeMasCercano({ x: 7.1, y: 3 }, c);
  assert.equal(b.orientacion, 'v');
  assert.equal(b.fijo, 7);
  const ab = aberturaDesdeToque({ x: 7.1, y: 2.1 }, c, 'puerta');
  assert.deepEqual(ab, { tipo: 'puerta', orientacion: 'v', x: 7, y: 2 });
  assert.equal(bordeMasCercano({ x: 4, y: 3 }, c), null); // en medio de la sala, lejos de todo borde
});

test('en un borde más corto que la puerta, el toque da un error que dice cuánto mide', () => {
  // Un ambiente de 0.5 m no pasa la validación, pero puede venir de datos viejos: el editor no se rompe.
  const c = { ...cuadriculaVacia(), ambientes: [{ id: 'a', nombre: 'Ducto', tipo: 'otro', x: 0, y: 0, ancho: 0.5, largo: 3 }] };
  assert.match(aberturaDesdeToque({ x: 0.25, y: 0.02 }, c, 'puerta').error, /Ese borde mide 0.5 m: no cabe una puerta de 0.8 m/);
});

test('la puerta propuesta se mete dentro del borde si se toca cerca de una esquina', () => {
  const c = cuadriculaEjemplo();
  const ab = aberturaDesdeToque({ x: 7.05, y: 1.05 }, c, 'puerta');
  assert.ok(ab.y - 0.4 >= 1 - 1e-9, `la puerta empieza antes de la esquina: ${ab.y}`);
});

test('validar aberturas: sobre un borde, entera en una pared, ventanas hacia afuera o al balcón, sin encimarse', () => {
  const c = cuadriculaEjemplo();
  assert.match(validarAbertura({ tipo: 'puerta', orientacion: 'h', x: 4, y: 3 }, c), /borde de un ambiente/);
  // y = 5.5 entre x = 3.6 y 4.4: la sala y el borde del balcón (que acaba en x = 4) se mezclan.
  assert.match(validarAbertura({ tipo: 'puerta', orientacion: 'h', x: 4, y: 5.5 }, c), /a caballo/);
  // Ventana entre la recámara y el baño (dos interiores): ahí va una puerta, y el mensaje lo dice.
  assert.match(validarAbertura({ tipo: 'ventana', orientacion: 'h', x: 9.5, y: 5.5 }, c), /Entre dos ambientes interiores va una puerta/);
  // Ventana de la sala hacia el balcón: sí (el 3D trata esa pared como exterior).
  assert.equal(validarAbertura({ tipo: 'ventana', orientacion: 'h', x: 3.5, y: 5.5 }, c), null);
  // En la baranda suelta del balcón, no.
  assert.match(validarAbertura({ tipo: 'ventana', orientacion: 'h', x: 2.5, y: 7 }, c), /baranda/);
  assert.match(validarAbertura({ tipo: 'puerta', orientacion: 'v', x: 7, y: 3 }, c), /Se encima con otra puerta/);
  assert.equal(validarAbertura({ tipo: 'ventana', orientacion: 'v', x: 10.5, y: 3 }, c), null);
});

test('una ventana hacia el balcón toma el antepecho del ambiente de adentro y en 3D da afuera', () => {
  const base = cuadriculaEjemplo();
  const c = agregarAbertura(base, { tipo: 'ventana', orientacion: 'h', x: 3.5, y: 5.5 }).cuadricula;
  const plano = planoDesdeCuadricula(c);
  assert.equal(plano.aberturas.find((a) => a.x === 3.5 && a.y === 5.5).antepecho, 0.9); // la sala, no el balcón
  const m = construirModelo(plano);
  const v = m.aberturas.find((a) => a.centro.x === 3.5 && a.centro.y === 5.5);
  assert.equal(v.daAfuera, true);
  assert.equal(v.ambienteDentro, 'a1');
  // Con el balcón primero en la lista y un baño detrás, la ventana sigue siendo alta (la del baño, 1.60 m).
  let b = cuadriculaVacia();
  b = agregarAmbiente(b, { nombre: 'Balcón', tipo: 'balcon', x: 0, y: 3, ancho: 3, largo: 1.5 }).cuadricula;
  b = agregarAmbiente(b, { nombre: 'Baño', tipo: 'bano', x: 0, y: 0, ancho: 3, largo: 3 }).cuadricula;
  b = agregarAbertura(b, { tipo: 'ventana', orientacion: 'h', x: 1.5, y: 3 }).cuadricula;
  assert.equal(planoDesdeCuadricula(b).aberturas[0].antepecho, 1.6);
});

test('agregar una abertura válida y rechazar una inválida', () => {
  const c = cuadriculaEjemplo();
  const ok = agregarAbertura(c, { tipo: 'ventana', orientacion: 'v', x: 10.5, y: 3 });
  assert.equal(ok.error, null);
  assert.equal(ok.cuadricula.aberturas.length, c.aberturas.length + 1);
  const mal = agregarAbertura(c, { tipo: 'puerta', orientacion: 'h', x: 4, y: 3 });
  assert.ok(mal.error);
  assert.equal(mal.cuadricula, c);
});

test('quitar un ambiente quita las puertas que se quedaron sin pared', () => {
  const c = cuadriculaEjemplo();
  const sinBalcon = quitarAmbiente(c, 'a4');
  // La puerta sala-balcón queda en el borde de la sala: sigue siendo válida (pasa a dar afuera).
  assert.ok(sinBalcon.aberturas.some((a) => a.id === 'p3'));
  const sinBano = quitarAmbiente(c, 'a3');
  assert.ok(!sinBano.aberturas.some((a) => a.id === 'v3'), 'la ventana del baño debía irse con él');
});

test('abertura cercana para borrarla tocándola', () => {
  const c = cuadriculaEjemplo();
  assert.equal(aberturaCercana({ x: 7.05, y: 3.6 }, c)?.id, 'p1');
  assert.equal(aberturaCercana({ x: 4, y: 3 }, c), null);
});

test('ambientes sin puerta', () => {
  const c = cuadriculaEjemplo();
  assert.deepEqual(ambientesSinPuerta(c), []);
  const sinPuertaBano = { ...c, aberturas: c.aberturas.filter((a) => a.id !== 'p2') };
  assert.deepEqual(ambientesSinPuerta(sinPuertaBano).map((a) => a.nombre), ['Baño']);
  // Una puerta que da afuera no comunica con otro ambiente: la recámara con solo una puerta a la calle sigue sin puerta.
  const r = agregarAbertura({ ...c, aberturas: c.aberturas.filter((a) => a.id !== 'p1' && a.id !== 'p2') }, { tipo: 'puerta', orientacion: 'h', x: 7.5, y: 1 });
  assert.equal(r.error, null);
  assert.ok(ambientesSinPuerta(r.cuadricula).some((a) => a.id === 'a2'), 'la recámara solo tiene una puerta hacia afuera');
});

test('al ver en 3D se empieza en el ambiente más grande que tenga puerta, y el aviso dice dónde no se puede entrar', () => {
  let c = cuadriculaVacia();
  c = agregarAmbiente(c, { nombre: 'Grande', tipo: 'recamara', x: 0, y: 0, ancho: 5, largo: 5 }).cuadricula; // sin puertas
  c = agregarAmbiente(c, { nombre: 'Sala', tipo: 'sala', x: 5, y: 0, ancho: 4, largo: 4 }).cuadricula;
  c = agregarAmbiente(c, { nombre: 'Baño', tipo: 'bano', x: 5, y: 4, ancho: 2, largo: 2 }).cuadricula;
  c = agregarAbertura(c, { tipo: 'puerta', orientacion: 'h', x: 6, y: 4 }).cuadricula; // sala-baño
  assert.equal(ambienteDeInicio(c).nombre, 'Sala', 'en «Grande» no se podría salir');
  assert.equal(planoDesdeCuadricula(c).inicio.x, 7);
  assert.equal(avisoAlVerEn3D(c), 'No se puede entrar a «Grande»: no tiene puerta hacia otro ambiente.');
  assert.equal(avisoAlVerEn3D(cuadriculaEjemplo()), '');
  // Tres recámaras pegadas y sin puertas: se empieza encerrado en una, y el aviso concuerda en plural.
  let t = cuadriculaVacia();
  for (const x of [0, 3, 6]) t = agregarAmbiente(t, { tipo: 'recamara', x, y: 0, ancho: 3, largo: 3 }).cuadricula;
  const aviso = avisoAlVerEn3D(t);
  assert.match(aviso, /^Vas a empezar en «Recámara», que no tiene puerta hacia otro ambiente/);
  assert.match(aviso, /Tampoco se puede entrar a «Recámara 2» y «Recámara 3»\./);
  // Con una puerta entre las dos primeras, solo la tercera queda aislada, en singular.
  const conPuerta = agregarAbertura(t, { tipo: 'puerta', orientacion: 'v', x: 3, y: 1.5 }).cuadricula;
  assert.equal(avisoAlVerEn3D(conPuerta), 'No se puede entrar a «Recámara 3»: no tiene puerta hacia otro ambiente.');
  // Y dos aisladas, en plural.
  const cuatro = agregarAmbiente(conPuerta, { tipo: 'bano', x: 9, y: 0, ancho: 2, largo: 3 }).cuadricula;
  assert.equal(avisoAlVerEn3D(cuatro), 'No se puede entrar a «Recámara 3» y «Baño»: no tienen puerta hacia otro ambiente.');
});

test('de la cuadrícula al plano: válido, con paredes interiores donde se tocan y puerta de entrada cerrada', () => {
  const c = cuadriculaEjemplo();
  const plano = planoDesdeCuadricula(c);
  assert.deepEqual(validarPlano(plano).errores, []);
  const m = construirModelo(plano);
  const interior = m.paredes.find((p) => p.tipo === 'interior' && p.a.x === 7 && p.b.x === 7);
  assert.ok(interior, 'falta la pared interior entre sala y recámara');
  assert.equal(plano.aberturas.find((a) => a.x === 1 && a.y === 2).tipo, 'puerta-cerrada');
  assert.equal(plano.aberturas.find((a) => a.x === 7 && a.y === 3.5).tipo, 'puerta');
  assert.equal(plano.aberturas.find((a) => a.x === 10.5).antepecho, 1.6); // ventana de baño, alta
  // Se puede ir caminando de la sala a la recámara por la puerta en x = 7.
  let p = { x: 5, y: 3.5 };
  for (let i = 0; i < 40; i++) p = moverConColision(p, { x: 0.1, y: 0 }, m.colision, 0.25);
  assert.equal(ambienteEn(p, m.ambientes)?.nombre, 'Recámara');
  const t = totales(c);
  assert.deepEqual(t, { ambientes: 4, interior: 49.75, exterior: 4.5, total: 54.25 });
});

test('exportar e importar devuelve la misma cuadrícula', () => {
  const c = cuadriculaEjemplo();
  const texto = exportarJSON(c);
  const r = importarJSON(texto);
  assert.equal(r.error, undefined);
  assert.deepEqual(r.cuadricula, c);
  // y el JSON exportado también es un plano válido para el 3D
  assert.deepEqual(validarPlano(JSON.parse(texto)).errores, []);
});

test('importar un archivo con ids repetidos les da un id nuevo: quitar uno no se lleva al otro', () => {
  const dup = { cuadricula: { version: 1, nombre: 'dup', ancho: 12, largo: 10,
    ambientes: [{ id: 'x', nombre: 'A', tipo: 'sala', x: 0, y: 0, ancho: 3, largo: 3 }, { id: 'x', nombre: 'B', tipo: 'recamara', x: 3, y: 0, ancho: 3, largo: 3 }, { nombre: 'C', tipo: 'bano', x: 6, y: 0, ancho: 2, largo: 2 }],
    aberturas: [{ id: 'p', tipo: 'puerta', orientacion: 'v', x: 3, y: 1.5 }, { id: 'p', tipo: 'ventana', orientacion: 'h', x: 1.5, y: 0 }] } };
  const r = importarJSON(JSON.stringify(dup));
  assert.equal(r.error, undefined);
  const ids = r.cuadricula.ambientes.map((a) => a.id);
  assert.equal(new Set(ids).size, 3, `ids repetidos: ${ids}`);
  assert.equal(ids[0], 'x', 'el primero conserva su id');
  assert.equal(new Set(r.cuadricula.aberturas.map((a) => a.id)).size, 2);
  const sinB = quitarAmbiente(r.cuadricula, ids[1]);
  assert.deepEqual(sinB.ambientes.map((a) => a.nombre), ['A', 'C']);
  const tipoB = cambiarAmbiente(r.cuadricula, ids[1], { tipo: 'bano' }).cuadricula;
  assert.deepEqual(tipoB.ambientes.map((a) => [a.nombre, a.tipo]), [['A', 'sala'], ['B', 'bano'], ['C', 'bano']]);
});

test('importar archivos malos da un error que dice qué hacer', () => {
  assert.match(importarJSON('{no es json').error, /no se pudo leer/);
  assert.match(importarJSON('{"hola":1}').error, /no es una copia de un plano de este editor/);
  assert.match(importarJSON(JSON.stringify({ cuadricula: { version: 7 } })).error, /versión 7/);
  const encimados = { version: 1, ancho: 12, largo: 10, ambientes: [{ nombre: 'A', tipo: 'sala', x: 0, y: 0, ancho: 3, largo: 3 }, { nombre: 'B', tipo: 'sala', x: 1, y: 1, ancho: 3, largo: 3 }], aberturas: [] };
  assert.match(importarJSON(JSON.stringify({ cuadricula: encimados })).error, /Se encima/);
});

test('un plano sin rectángulos de 0.5 m no se abre en el editor, y lo dice', () => {
  const r = cuadriculaDesdePlano(planoEjemplo());
  assert.match(r.error, /^«Recámara principal» no es un rectángulo sobre la cuadrícula de 0.5 m/);
});

test('un plano exportado sin la cuadrícula se vuelve a abrir en el editor', () => {
  const c = cuadriculaEjemplo();
  const plano = planoDesdeCuadricula(c);
  const r = importarJSON(JSON.stringify(plano));
  assert.equal(r.error, undefined);
  assert.equal(r.cuadricula.ambientes.length, 4);
  assert.equal(r.cuadricula.aberturas.length, c.aberturas.length);
});

test('revisarCuadricula rechaza datos que no son una cuadrícula', () => {
  assert.ok(revisarCuadricula(null).error);
  assert.match(revisarCuadricula({ version: 1, ancho: 100, largo: 10 }).error, /entre 2 y 40/);
});

test('puerta o ventana dicha con palabras: lado y distancia a la esquina', async () => {
  const { aberturaEnLado } = await import('../js/nucleo/cuadricula.mjs');
  const c = cuadriculaEjemplo();
  const rec = c.ambientes.find((a) => a.id === 'a2'); // x 7, y 1, 3.5 × 4.5
  assert.deepEqual(aberturaEnLado(rec, 'arriba', 2, 'ventana'), { tipo: 'ventana', orientacion: 'h', x: 9, y: 1 });
  assert.deepEqual(aberturaEnLado(rec, 'derecha', 1.5, 'puerta'), { tipo: 'puerta', orientacion: 'v', x: 10.5, y: 2.5 });
  assert.deepEqual(aberturaEnLado(rec, 'abajo', 1, 'puerta'), { tipo: 'puerta', orientacion: 'h', x: 8, y: 5.5 });
  assert.match(aberturaEnLado(rec, 'arriba', 0.2, 'puerta').error, /entre 0.4 y 3.1 m/);
  assert.match(aberturaEnLado(null, 'arriba', 1, 'puerta').error, /Elige un ambiente/);
  assert.match(aberturaEnLado(rec, 'arriba', NaN, 'puerta').error, /cuántos metros/);
  // y el resultado pasa la validación cuando la pared lo permite
  assert.equal(validarAbertura(aberturaEnLado(rec, 'derecha', 1.5, 'ventana'), c), null);
});

test('al entrar a un plano dibujado se mira hacia la puerta más cercana del ambiente más grande', async () => {
  const { rumboInicial } = await import('../js/nucleo/cuadricula.mjs');
  const c = cuadriculaEjemplo();
  const sala = c.ambientes.find((a) => a.id === 'a1'); // centro (4, 3.25); puerta más cercana: balcón (2.5, 5.5)
  const r = rumboInicial(c, sala);
  assert.ok(r > 180 && r < 270, `rumbo ${r}: debía mirar abajo a la izquierda, hacia el balcón`);
  assert.equal(planoDesdeCuadricula(c).inicio.rumbo, r);
  const sinPuertas = { ...c, aberturas: [] };
  assert.equal(rumboInicial(sinPuertas, sala), 90); // 6 × 4.5: a lo largo
});
