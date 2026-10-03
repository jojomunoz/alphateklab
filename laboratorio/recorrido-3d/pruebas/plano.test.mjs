import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  paredesDesdeAmbientes, piezasDePared, tramosDeColision, ubicarAbertura, validarPlano, construirModelo, ambienteEn,
  GROSOR, FORMATO, VERSION_PLANO,
} from '../js/nucleo/plano.mjs';
import { planoEjemplo } from '../herramientas/escribir-plano-ejemplo.mjs';
import { moverConColision, puntoEnPoligono } from '../js/nucleo/geometria.mjs';

const cerca = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
const plano = JSON.parse(readFileSync(new URL('../plano.json', import.meta.url), 'utf8'));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

test('plano.json está al día con el script que lo escribe', () => {
  assert.deepEqual(plano, JSON.parse(JSON.stringify(planoEjemplo())));
});

test('el apartamento de ejemplo mide 95.04 m² y tiene lo que dice la especificación', () => {
  const m = construirModelo(plano);
  cerca(m.areaTotal, 95.04);
  const tipos = m.ambientes.map((a) => a.tipo);
  assert.equal(tipos.filter((t) => t === 'recamara').length, 3);
  assert.equal(tipos.filter((t) => t === 'bano').length, 2);
  for (const t of ['sala', 'cocina', 'lavanderia', 'balcon']) assert.ok(tipos.includes(t), `falta ${t}`);
  const porId = Object.fromEntries(m.ambientes.map((a) => [a.id, a.area]));
  cerca(porId['recamara-principal'], 12.92);
  cerca(porId['sala-comedor'], 27.56);
  cerca(porId.pasillo, 7.52);
});

test('los ambientes del ejemplo no se enciman y cubren 11 × 8 m más el balcón', () => {
  const m = construirModelo(plano);
  // Muestreo en una rejilla de 5 cm: cada punto interior cae en exactamente un ambiente.
  for (let x = 0.025; x < 11; x += 0.1) {
    for (let y = 0.025; y < 8; y += 0.1) {
      const n = m.ambientes.filter((a) => puntoEnPoligono({ x, y }, a.poligono)).length;
      assert.equal(n, 1, `(${x.toFixed(3)}, ${y.toFixed(3)}) está en ${n} ambientes`);
    }
  }
});

test('paredes desde ambientes: compartida = interior, suelta = exterior, borde suelto de balcón = baranda', () => {
  const paredes = paredesDesdeAmbientes([
    { id: 'a', nombre: 'A', tipo: 'sala', poligono: rect(0, 0, 4, 3) },
    { id: 'b', nombre: 'B', tipo: 'recamara', poligono: rect(4, 0, 7, 3) },
    { id: 'c', nombre: 'C', tipo: 'balcon', poligono: rect(0, 3, 2, 4) },
  ]);
  const buscar = (a, b) => paredes.find((p) => p.a.join() === a.join() && p.b.join() === b.join());
  assert.equal(buscar([4, 0], [4, 3])?.tipo, 'interior');
  assert.equal(buscar([4, 0], [4, 3])?.grosor, GROSOR.interior);
  assert.equal(buscar([0, 0], [7, 0])?.tipo, 'exterior'); // tramos contiguos del mismo tipo se unen
  assert.equal(buscar([0, 3], [7, 3])?.tipo, 'exterior'); // sala-balcón y sala sola: ambas exterior
  assert.equal(buscar([0, 4], [2, 4])?.tipo, 'baranda');
  assert.equal(buscar([2, 3], [2, 4])?.tipo, 'baranda');
  // Ninguna pared duplicada sobre la misma línea.
  const claves = paredes.map((p) => `${p.a}|${p.b}`);
  assert.equal(new Set(claves).size, claves.length);
});

test('entre dos balcones pegados no se levanta baranda ni pared', () => {
  const paredes = paredesDesdeAmbientes([
    { id: 'a', nombre: 'A', tipo: 'balcon', poligono: rect(0, 0, 2, 1.5) },
    { id: 'b', nombre: 'B', tipo: 'balcon', poligono: rect(2, 0, 4, 1.5) },
  ]);
  assert.ok(!paredes.some((p) => p.a[0] === 2 && p.b[0] === 2), 'hay una pared sobre el borde compartido x = 2');
  assert.equal(paredes.find((p) => p.a[1] === 0 && p.b[1] === 0)?.tipo, 'baranda');
});

test('un borde compartido a medias se parte en tramos de tipo distinto', () => {
  const paredes = paredesDesdeAmbientes([
    { id: 'a', nombre: 'A', tipo: 'sala', poligono: rect(0, 0, 6, 3) },
    { id: 'b', nombre: 'B', tipo: 'bano', poligono: rect(2, 3, 4, 5) },
  ]);
  const y3 = paredes.filter((p) => p.a[1] === 3 && p.b[1] === 3).map((p) => [p.a[0], p.b[0], p.tipo]);
  assert.deepEqual(y3, [[0, 2, 'exterior'], [2, 4, 'interior'], [4, 6, 'exterior']]);
});

test('una pared en diagonal se rechaza con un mensaje claro', () => {
  assert.throws(
    () => paredesDesdeAmbientes([{ id: 'x', nombre: 'Triángulo', tipo: 'otro', poligono: [[0, 0], [3, 0], [0, 3]] }]),
    /diagonal/,
  );
});

test('piezas de pared con una puerta: dos tramos llenos y el dintel encima', () => {
  const piezas = piezasDePared(5, 2.6, [{ desde: 1, hasta: 1.8, antepecho: 0, dintel: 2.1 }]);
  assert.deepEqual(piezas, [
    { desde: 0, hasta: 1, y0: 0, y1: 2.6 },
    { desde: 1, hasta: 1.8, y0: 2.1, y1: 2.6 },
    { desde: 1.8, hasta: 5, y0: 0, y1: 2.6 },
  ]);
});

test('piezas de pared con una ventana: antepecho abajo y dintel arriba', () => {
  const piezas = piezasDePared(4, 2.6, [{ desde: 1, hasta: 2.6, antepecho: 0.9, dintel: 2.2 }]);
  assert.deepEqual(piezas, [
    { desde: 0, hasta: 1, y0: 0, y1: 2.6 },
    { desde: 1, hasta: 2.6, y0: 0, y1: 0.9 },
    { desde: 1, hasta: 2.6, y0: 2.2, y1: 2.6 },
    { desde: 2.6, hasta: 4, y0: 0, y1: 2.6 },
  ]);
});

test('un vano de todo el ancho deja solo el dintel', () => {
  assert.deepEqual(piezasDePared(1, 2.6, [{ desde: 0, hasta: 1, antepecho: 0, dintel: 2.2 }]), [{ desde: 0, hasta: 1, y0: 2.2, y1: 2.6 }]);
});

test('colisión: las puertas se cruzan, las ventanas y la entrada cerrada no, la corrediza a medias', () => {
  const tramos = tramosDeColision(10, [
    { tipo: 'puerta', desde: 1, hasta: 1.8 },
    { tipo: 'ventana', desde: 3, hasta: 4 },
    { tipo: 'puerta-cerrada', desde: 5, hasta: 5.9 },
    { tipo: 'corrediza', desde: 7, hasta: 9 },
  ]);
  assert.deepEqual(tramos, [[0, 1], [1.8, 7], [8, 10]]);
});

test('ubicar una abertura sobre su pared y rechazar la que no cabe', () => {
  const paredes = [{ a: [0, 0], b: [4, 0], grosor: 0.2 }];
  const u = ubicarAbertura({ x: 2, y: 0, ancho: 1 }, paredes);
  assert.deepEqual(u, { indice: 0, desde: 1.5, hasta: 2.5 });
  assert.equal(ubicarAbertura({ x: 3.8, y: 0, ancho: 1 }, paredes), null);
  assert.equal(ubicarAbertura({ x: 2, y: 0.5, ancho: 1 }, paredes), null);
});

test('validarPlano explica lo que falla', () => {
  assert.match(validarPlano({}).errores[0], /formato/);
  const base = { formato: FORMATO, version: VERSION_PLANO, ambientes: [{ id: 'a', nombre: 'A', tipo: 'sala', poligono: rect(0, 0, 3, 3) }] };
  assert.deepEqual(validarPlano(base).errores, []);
  const malaPuerta = { ...base, aberturas: [{ tipo: 'puerta', x: 10, y: 10, ancho: 0.8 }] };
  assert.match(validarPlano(malaPuerta).errores[0], /no cae sobre ninguna pared/);
  const encimadas = { ...base, aberturas: [{ tipo: 'puerta', x: 1, y: 0, ancho: 0.8 }, { tipo: 'ventana', x: 1.5, y: 0, ancho: 0.8 }] };
  assert.match(validarPlano(encimadas).errores[0], /se encima/);
  assert.match(validarPlano({ ...base, version: 9 }).errores[0], /versión 9/);
  const sinNombre = { ...base, ambientes: [{ id: 'a', nombre: ' ', tipo: 'sala', poligono: rect(0, 0, 3, 3) }] };
  assert.match(validarPlano(sinNombre).errores[0], /sin nombre/);
  const diminuto = { ...base, ambientes: [{ id: 'a', nombre: 'A', tipo: 'sala', poligono: rect(0, 0, 0.4, 0.4) }] };
  assert.match(validarPlano(diminuto).errores[0], /menos de 0.25 m²/);
  const repetidos = { ...base, ambientes: [base.ambientes[0], { ...base.ambientes[0], poligono: rect(3, 0, 6, 3) }] };
  assert.match(validarPlano(repetidos).errores[0], /id único/);
});

test('los mensajes de las aberturas llevan el artículo que les toca', () => {
  const base = { formato: FORMATO, version: VERSION_PLANO, ambientes: [{ id: 'a', nombre: 'A', tipo: 'sala', poligono: rect(0, 0, 3, 3) }] };
  assert.match(validarPlano({ ...base, aberturas: [{ tipo: 'vano', x: 1, y: 0, ancho: 0.2 }] }).errores[0], /^El vano sin puerta en \(1, 0\) mide menos de 0.30 m/);
  assert.match(validarPlano({ ...base, aberturas: [{ tipo: 'puerta', x: 9, y: 9, ancho: 0.8 }] }).errores[0], /^La puerta en \(9, 9\) no cae/);
});

test('modelo del ejemplo: cada puerta abre un hueco en la colisión y cada ventana no', () => {
  const m = construirModelo(plano);
  const libre = (p) => !m.colision.some((s) => {
    const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
    const t = Math.max(0, Math.min(1, ((p.x - s.a.x) * dx + (p.y - s.a.y) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(p.x - (s.a.x + dx * t), p.y - (s.a.y + dy * t)) < s.medio + 1e-6;
  });
  for (const ab of m.aberturas) {
    const centro = ab.tipo === 'corrediza' ? { x: ab.a.x + (ab.b.x - ab.a.x) * 0.25, y: ab.a.y + (ab.b.y - ab.a.y) * 0.25 } : ab.centro;
    const pasa = ab.tipo === 'puerta' || ab.tipo === 'vano' || ab.tipo === 'corrediza';
    assert.equal(libre(centro), pasa, `${ab.tipo} en (${ab.centro.x}, ${ab.centro.y})`);
  }
});

test('modelo del ejemplo: se puede caminar de la sala a la cocina y no salir por la entrada cerrada', () => {
  const m = construirModelo(plano);
  // De la sala (3, 6) a la cocina (8, 6.2) cruzando el vano de 1.8 m en x = 6.6.
  let p = { x: 3, y: 6.2 };
  for (let i = 0; i < 50; i++) p = moverConColision(p, { x: 0.1, y: 0 }, m.colision, 0.25);
  assert.equal(ambienteEn(p, m.ambientes)?.id, 'cocina');
  // Contra la puerta de entrada (x = 0, y ≈ 4.05): no sale del apartamento.
  let q = { x: 1, y: 4.05 };
  for (let i = 0; i < 50; i++) q = moverConColision(q, { x: -0.1, y: 0 }, m.colision, 0.25);
  assert.ok(q.x > 0.3, `salió por la entrada: x=${q.x}`);
});

test('el inicio del ejemplo está dentro de la sala-comedor', () => {
  const m = construirModelo(plano);
  assert.equal(ambienteEn(m.inicio, m.ambientes)?.id, 'sala-comedor');
});

test('ambienteEn mantiene el anterior mientras sigue dentro', () => {
  const m = construirModelo(plano);
  assert.equal(ambienteEn({ x: 2, y: 2 }, m.ambientes)?.id, 'recamara-principal');
  assert.equal(ambienteEn({ x: 20, y: 20 }, m.ambientes), null);
  // Donde dos polígonos se tocan o se enciman, manda el anterior (no salta de uno a otro con cada paso).
  const a = { id: 'a', poligono: rect(0, 0, 4, 3).map(([x, y]) => ({ x, y })) };
  const b = { id: 'b', poligono: rect(3, 0, 7, 3).map(([x, y]) => ({ x, y })) };
  const p = { x: 3.5, y: 1.5 };
  assert.equal(ambienteEn(p, [a, b])?.id, 'a');
  assert.equal(ambienteEn(p, [a, b], 'b')?.id, 'b');
  assert.equal(ambienteEn(p, [a, b], 'a')?.id, 'a');
  assert.equal(ambienteEn({ x: 6, y: 1.5 }, [a, b], 'a')?.id, 'b', 'fuera del anterior, el que lo contiene');
});

test('el minimapa elige el ambiente tocado, o el más cercano si el dedo cae en una pared', async () => {
  const { ambienteCercano } = await import('../js/nucleo/plano.mjs');
  const m = construirModelo(plano);
  assert.equal(ambienteCercano({ x: 10.2, y: 6.8 }, m.ambientes, 0.3)?.id, 'lavanderia');
  assert.equal(ambienteCercano({ x: 12, y: 6.8 }, m.ambientes, 0.3), null, 'a 1 m de todo: nada');
  assert.equal(ambienteCercano({ x: 11.2, y: 6.8 }, m.ambientes, 0.3)?.id, 'lavanderia', 'a 20 cm, afuera: el más cercano');
});

test('las piezas de los extremos se alargan medio grosor para cerrar las esquinas', () => {
  const m = construirModelo(plano);
  const norte = m.paredes.find((p) => p.a.x === 0 && p.a.y === 0 && p.b.x === 11 && p.b.y === 0);
  const primera = norte.piezas[0];
  cerca(primera.a.x, -0.1);
  const ultima = norte.piezas.at(-1);
  cerca(ultima.b.x, 11.1);
});

test('el nombre de cada ambiente queda dentro de su polígono', () => {
  const m = construirModelo(plano);
  for (const a of m.ambientes) assert.ok(puntoEnPoligono(a.etiqueta, a.poligono), a.nombre);
});

test('se cruza caminando cada puerta, vano y corrediza del ejemplo, en los dos sentidos, con las hojas abiertas', () => {
  const m = construirModelo(plano);
  assert.ok(m.colision.some((s) => s.hoja), 'las hojas abiertas deben chocar');
  for (const ab of m.aberturas.filter((x) => ['puerta', 'vano', 'corrediza'].includes(x.tipo))) {
    // Centro del paso libre: la corrediza solo abre su primera mitad.
    const t = ab.tipo === 'corrediza' ? 0.25 : 0.5;
    const c = { x: ab.a.x + (ab.b.x - ab.a.x) * t, y: ab.a.y + (ab.b.y - ab.a.y) * t };
    const n = { x: -ab.dir.y, y: ab.dir.x };
    for (const s of [1, -1]) {
      const desde = { x: c.x + n.x * 0.7 * s, y: c.y + n.y * 0.7 * s };
      const hasta = { x: c.x - n.x * 0.7 * s, y: c.y - n.y * 0.7 * s };
      const a0 = ambienteEn(desde, m.ambientes)?.id, a1 = ambienteEn(hasta, m.ambientes)?.id;
      let p = desde;
      for (let i = 0; i < 28; i++) p = moverConColision(p, { x: -n.x * 0.05 * s, y: -n.y * 0.05 * s }, m.colision, 0.25);
      assert.equal(ambienteEn(p, m.ambientes)?.id, a1, `${ab.tipo} en (${ab.centro.x}, ${ab.centro.y}) de ${a0} a ${a1}: quedó en (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`);
    }
  }
});

test('la hoja abierta de una puerta es la misma línea que dibuja el plano y queda dentro del ambiente al que abre', () => {
  const m = construirModelo(plano);
  for (const ab of m.aberturas.filter((x) => x.tipo === 'puerta')) {
    const medio = { x: (ab.hoja.a.x + ab.hoja.b.x) / 2, y: (ab.hoja.a.y + ab.hoja.b.y) / 2 };
    assert.equal(ambienteEn(medio, m.ambientes)?.id, ab.ambienteDentro, `puerta en (${ab.centro.x}, ${ab.centro.y})`);
  }
});
