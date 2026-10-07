// Capturas para alphateklab.com (Citas Médicas): un día de un consultorio inventado («Dermatología Ríos», dos médicos),
// en un servidor temporal del piloto. Salen, en claro y en oscuro: la agenda del día, el expediente de una cita,
// Mensajes, Personal y accesos, y el registro por QR en el teléfono. Todo con datos inventados.
// Uso: node herramientas/capturas-citas.mjs <carpeta-de-salida>
//      (PILOTO=<carpeta> para usar otra copia del código del piloto; por defecto ~/alphateklab/piloto-citas)
// Después: node herramientas/imagenes-citas.mjs <carpeta-de-salida> las pasa a WebP en assets/producto/.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';

const PILOTO = process.env.PILOTO || join(homedir(), 'alphateklab/piloto-citas');
const SALIDA = process.argv[2];
mkdirSync(SALIDA, { recursive: true });
const { chromium } = await import('./navegador.mjs');
const { msDeFecha } = await import(join(PILOTO, 'web/js/nucleo/tiempo.mjs'));
const { rutaPocketbase } = await import(join(PILOTO, 'herramientas/pocketbase.mjs'));

const DIA = '2026-10-07'; // miércoles
const RELOJ = msDeFecha(DIA, 10 * 60 + 32); // 10:32 a. m. en Panamá: la línea de «ahora» no cruza el texto de una cita
const CLAVE = 'capturas-clave-123';
const DATOS = mkdtempSync(join(tmpdir(), 'medicitas-'));
const HOOKS = join(DATOS, 'hooks');
// En este servidor de capturas no va la regla que pone la hora del servidor a lo del expediente (el reloj de la página
// está fijo en la mañana y el servidor no); lo demás, igual que el piloto.
cpSync(join(PILOTO, 'pb_hooks'), HOOKS, { recursive: true });
rmSync(join(HOOKS, 'expediente.pb.js'));

const puerto = await new Promise((ok) => { const s = createServer(); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => ok(port)); }); });
const BASE = `http://127.0.0.1:${puerto}/`;
execFileSync(process.execPath, [join(PILOTO, 'herramientas/preparar.mjs'), '--datos', join(DATOS, 'pb'), '--clave-admin', 'capturas-admin-123', '--clave-secretaria', CLAVE, '--clave-equipo', CLAVE, '--sin-credenciales'], { stdio: 'ignore' });
const servidor = spawn(rutaPocketbase(PILOTO), ['serve', `--dir=${join(DATOS, 'pb')}`, `--publicDir=${join(PILOTO, 'web')}`, `--migrationsDir=${join(PILOTO, 'pb_migrations')}`, `--hooksDir=${HOOKS}`, '--hooksWatch=false', '--automigrate=false', '--indexFallback=false', `--origins=http://127.0.0.1:${puerto}`, `--http=127.0.0.1:${puerto}`], { stdio: 'ignore' });
for (let i = 0; i < 75; i++) { try { if ((await fetch(`${BASE}api/health`)).ok) break; } catch { /* aún no */ } await new Promise((r) => setTimeout(r, 200)); }

const nav = await chromium.launch();
const contexto = async (viewport, colorScheme = 'light') => {
  const c = await nav.newContext({ viewport, deviceScaleFactor: 2, locale: 'es-PA', timezoneId: 'America/Panama', colorScheme });
  await c.clock.setFixedTime(RELOJ);
  await c.route(/\/publico\.json$/, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ nombre: 'Dermatología Ríos', red: '', paleta: 'morado' }) }));
  return c;
};
const esperarGuardado = (p) => p.evaluate(async () => {
  const m = await import('/js/app/servidor.mjs');
  for (let i = 0; i < 100 && m.hayPendientes(); i++) await new Promise((r) => setTimeout(r, 200));
});
const ESCRITORIO = { width: 1280, height: 800 };
async function entrar(esquema) {
  const ctx = await contexto(ESCRITORIO, esquema);
  const p = await ctx.newPage();
  await p.goto(`${BASE}entrar.html`);
  await p.fill('#usuario', 'dra.rios');
  await p.fill('#clave', CLAVE);
  await p.click('form button[type=submit]');
  await p.waitForURL(/citas\.html/);
  await p.waitForFunction(() => document.querySelector('#pie')?.textContent.includes('Todo guardado'), null, { timeout: 15000 });
  return p;
}
try {
  const p = await entrar('light');
  // Paleta morada del consultorio (combina con el índigo del sitio).
  await p.evaluate(async () => { const s = await import('/js/app/servidor.mjs'); await s.actualizarConfig((c) => ({ ...c, paleta: 'morado' })); });

  const { enSala } = await p.evaluate(async ({ DIA }) => {
    const { transaccion } = await import('/js/app/almacen.mjs');
    const { NEGOCIOS_CITAS } = await import('/js/nucleo/negocios.mjs');
    const ops = await import('/js/nucleo/operaciones.mjs');
    const exp = await import('/js/nucleo/expediente.mjs');
    const { msDeFecha, sumarDias } = await import('/js/nucleo/tiempo.mjs');
    const { sesion, listarPersonal } = await import('/js/app/servidor.mjs');
    const yo = sesion();
    // Los signos los toma enfermería, como en un consultorio de verdad.
    const enf = (await listarPersonal().catch(() => [])).find((x) => x.usuario === 'enfermera');
    const enfermeria = enf ? { id: enf.id, nombre: enf.nombre } : yo;
    const h = (dia, hhmm) => { const [a, b] = hhmm.split(':').map(Number); return msDeFecha(dia, a * 60 + b); };
    const PACIENTES = [
      ['María Fernanda', 'Quintero Ábrego', 'Penicilina', 'Hipertensión'],
      ['José Luis', 'Batista Rodríguez', '', ''],
      ['Ana Sofía', 'Pinzón Herrera', 'Ibuprofeno', ''],
      ['Carlos', 'Méndez Castillo', '', 'Diabetes'],
      ['Yaritza', 'Castillo Morán', '', ''],
      ['Roberto', 'Samaniego Díaz', 'Sulfas', ''],
      ['Daniela', 'Vergara Núñez', '', ''],
      ['Luis Alberto', 'Arosemena Pérez', '', 'Asma'],
      ['Gabriela', 'Montenegro Ruiz', '', ''],
      ['Ricardo', 'De León Vega', '', ''],
      ['Mariela', 'Sánchez Torres', '', ''],
      ['Eduardo', 'Chen Moreno', '', ''],
      ['Lourdes', 'Guerra Saavedra', '', ''],
      ['Iván', 'Herrera Lombardo', '', ''],
    ];
    const r = transaccion((estado) => {
      const st = estado.negocios.consultorio;
      const neg = NEGOCIOS_CITAS.consultorio;
      const ahora = estado.reloj.ahora;
      const ids = PACIENTES.map(([nombres, apellidos, alergias, enfermedades], i) => {
        const r = ops.registrarPaciente(st, neg, {
          nombres, apellidos, tipoDocumento: 'cedula', documento: `8-${900 + i}-${1000 + i * 37}`, telefono: `6000-${String(1100 + i).padStart(4, '0')}`,
          consentimiento: true, alergias, enfermedades, nacimiento: `19${70 + (i * 3) % 28}-0${1 + (i % 9)}-1${i % 9}`,
        }, ahora);
        if (!r.ok) throw new Error(`paciente ${i}: ${JSON.stringify(r.errores)}`);
        return r.paciente.id;
      });
      const regla = { ...st.regla };
      const cita = (i, prof, sala, servicio, hhmm, dia = DIA) => {
        const r = ops.crearCita(st, neg, { pacienteId: ids[i], servicioId: servicio, profesionalId: prof, salaId: sala, inicio: h(dia, hhmm), regla }, ahora, { permitirPasado: true });
        if (!r.ok) throw new Error(`cita ${i} ${hhmm}: ${JSON.stringify(r.errores)}`);
        return r.cita;
      };
      // Dra. Ríos (consultorio 1)
      const r1 = cita(0, 'rios', 'c1', 'control', '08:00');
      const r2 = cita(1, 'rios', 'c1', 'primera', '08:30');
      const r3 = cita(2, 'rios', 'c1', 'control', '09:15');
      const r4 = cita(3, 'rios', 'c1', 'primera', '10:00');
      const r5 = cita(4, 'rios', 'c1', 'control', '10:45');
      const r6 = cita(5, 'rios', 'c1', 'crio', '11:15');
      const r7 = cita(6, 'rios', 'c1', 'control', '13:00');
      const r8 = cita(7, 'rios', 'c1', 'primera', '14:00');
      const r9 = cita(8, 'rios', 'c1', 'control', '15:30');
      // Dr. Herrera (consultorio 2)
      const h1 = cita(9, 'herrera', 'c2', 'primera', '08:15');
      const h2 = cita(10, 'herrera', 'c2', 'limpieza', '09:00');
      const h3 = cita(11, 'herrera', 'c2', 'control', '10:15');
      const h4 = cita(12, 'herrera', 'c2', 'biopsia', '11:00');
      const h5 = cita(13, 'herrera', 'c2', 'primera', '14:30');
      for (const c of [r1, r2, r3, h1, h2]) { ops.cambiarEstado(st, neg, c.id, 'confirmada', ahora - 86400000); ops.cambiarEstado(st, neg, c.id, 'atendida', ahora); }
      for (const c of [r5, r6, r8, h4]) ops.cambiarEstado(st, neg, c.id, 'confirmada', ahora - 3600000);
      ops.cambiarEstado(st, neg, r4.id, 'confirmada', ahora - 7200000);
      ops.marcarEnSala(st, r4.id, h(DIA, '09:52'));
      ops.cambiarEstado(st, neg, h3.id, 'confirmada', ahora - 7200000);
      ops.marcarEnSala(st, h3.id, h(DIA, '10:08'));
      // Mañana: citas que ya tienen su recordatorio listo para mandar.
      const manana = sumarDias(DIA, 1);
      cita(4, 'rios', 'c1', 'control', '09:00', manana);
      cita(9, 'herrera', 'c2', 'control', '10:30', manana);
      cita(12, 'rios', 'c1', 'primera', '11:00', manana);
      // El expediente de quien está en la sala con la Dra. Ríos.
      const sg = exp.anotarSignos(st, r4.id, { sistolica: '118', diastolica: '76', pulso: '72', temperatura: '36,6', saturacion: '98', peso: '78', talla: '176' }, enfermeria, h(DIA, '09:58'));
      if (!sg.ok) throw new Error(`signos: ${JSON.stringify(sg.errores)}`);
      const notas = [
        ['motivo', 'Motivo de consulta', 'Lesiones rojas con descamación en codos y rodillas desde hace dos meses.'],
        ['refiere', 'Lo que refiere el paciente', 'Picazón leve que aumenta en la noche. Probó una crema hidratante sin mejoría.'],
        ['examen', 'Examen físico', 'Placas eritematosas bien delimitadas con escama plateada en ambos codos y la rodilla derecha.'],
        ['diagnostico', 'Diagnóstico', 'Psoriasis en placas, leve.'],
      ];
      notas.forEach(([s, t, texto], i) => { const n = exp.agregarNota(st, r4.id, s, texto, yo, h(DIA, `10:0${2 + i}`), { titulo: t }); if (!n.ok) throw new Error(`nota ${s}`); });
      return { ok: true, enSala: r4.id };
    }, 'capturas');
    return r;
  }, { DIA });
  // Que salgan los recordatorios que ya tocaban (el reloj de la página está fijo: se le da un empujón).
  await p.evaluate(async () => { const a = await import('/js/app/almacen.mjs'); a.adelantarReloj?.(); });
  await esperarGuardado(p);
  for (const [esquema, sufijo] of [['light', ''], ['dark', '-oscuro']]) {
    const q = esquema === 'light' ? p : await entrar(esquema);
    await q.goto(`${BASE}citas.html#agenda`);
    await q.waitForSelector('.agenda__cabeza');
    await q.waitForTimeout(800);
    await q.screenshot({ path: join(SALIDA, `agenda${sufijo}.png`) });
    // El expediente de la cita en sala, con los signos arriba (lo de antes, los antecedentes, queda subido).
    await q.click(`.bloque[data-cita="${enSala}"]`);
    await q.locator('dialog.dialogo').last().locator('[data-accion="expediente"]').click();
    const ex = q.locator('dialog.expediente');
    await ex.locator('[data-tomas] .entrada').first().waitFor();
    await ex.evaluate((dlg) => {
      const titulo = [...dlg.querySelectorAll('h2, h3, h4, legend, strong, span')].find((e) => e.textContent.trim() === 'Signos');
      let s = titulo;
      while (s && s !== document.body && !(s.scrollHeight > s.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(s).overflowY))) s = s.parentElement;
      // la cabecera del diálogo queda pegada arriba (sticky) y taparía el título: se deja su alto de aire
      const pegada = s && [...s.querySelectorAll('*')].find((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().top <= s.getBoundingClientRect().top + 4);
      const tapa = pegada ? pegada.getBoundingClientRect().bottom - s.getBoundingClientRect().top : 0;
      if (s && titulo) s.scrollTop += titulo.getBoundingClientRect().top - s.getBoundingClientRect().top - tapa - 20;
    });
    await q.waitForTimeout(400);
    await q.screenshot({ path: join(SALIDA, `expediente${sufijo}.png`) });
    for (let i = 0; i < 4 && await q.locator('dialog[open]').count(); i++) { await q.keyboard.press('Escape'); await q.waitForTimeout(150); }
    // Mensajes.
    await q.goto(`${BASE}bandeja.html`);
    await q.waitForTimeout(1200);
    await q.screenshot({ path: join(SALIDA, `mensajes${sufijo}.png`) });
    // Personal y accesos.
    await q.goto(`${BASE}citas.html#pacientes`);
    await q.waitForSelector('.lista-personas');
    await q.click('#btn-config');
    const cf = q.locator('dialog.dialogo').last();
    await cf.locator('[role=tab]', { hasText: 'Personal y accesos' }).click();
    await cf.locator('[data-persona]').nth(3).waitFor({ timeout: 8000 });
    await q.waitForTimeout(400);
    await q.screenshot({ path: join(SALIDA, `accesos${sufijo}.png`) });
    for (let i = 0; i < 4 && await q.locator('dialog[open]').count(); i++) { await q.keyboard.press('Escape'); await q.waitForTimeout(150); }
    // Registro por QR en el teléfono del paciente (el QR lo abre la recepción).
    await q.goto(`${BASE}citas.html#pacientes`);
    await q.waitForSelector('.lista-personas');
    await q.click('[data-registro-qr]');
    const dq = q.locator('dialog.dialogo').last();
    await dq.locator('.qr-grande svg').waitFor();
    const urlQR = (await dq.locator('.qr-url').textContent()).trim();
    const tel = await (await contexto({ width: 390, height: 844 }, esquema)).newPage();
    await tel.goto(urlQR);
    await tel.waitForSelector('main form');
    await tel.fill('[name=nombres]', 'Valeria');
    await tel.fill('[name=apellidos]', 'Moreno Aguilar');
    await tel.fill('[name=documento]', '8-917-2045');
    await tel.fill('[name=telefono]', '6000-1290');
    await tel.locator('[name=telefono]').blur();
    await tel.evaluate(() => window.scrollTo(0, 0));
    await tel.waitForTimeout(400);
    await tel.screenshot({ path: join(SALIDA, `registro${sufijo}.png`) });
  }
  console.log('listo');
} finally {
  await nav.close();
  servidor.kill('SIGTERM');
  rmSync(DATOS, { recursive: true, force: true });
}
