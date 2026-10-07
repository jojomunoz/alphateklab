// Citas Médicas: lo que se mueve en la portada. Todo es mejora: sin este script la página se lee entera (la
// conversación y el dictado se ven terminados, los precios están en las tarjetas y el contacto va en enlaces).

const reducir = matchMedia('(prefers-reduced-motion: reduce)');

// ── tema: sale en claro (pedido de Edwin) y el botón pasa al oscuro; se recuerda en este navegador. El <head> ya lo
// puso antes de pintar; aquí van las capturas oscuras, el botón y el color de la barra del navegador. ──
const raiz = document.documentElement;
const botonTema = document.querySelector('[data-tema]');
function ponerTema(oscuro, guardar = true) {
  raiz.dataset.theme = oscuro ? 'dark' : 'light';
  for (const img of document.querySelectorAll('img[data-oscuro]')) img.srcset = oscuro ? img.dataset.oscuro : img.dataset.claro;
  botonTema?.setAttribute('aria-pressed', String(oscuro));
  botonTema?.setAttribute('aria-label', oscuro ? 'Usar el tema claro' : 'Usar el tema oscuro');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#0f1218' : '#f6f7f9');
  if (guardar) {
    try { localStorage.setItem('atk-tema', oscuro ? 'oscuro' : 'claro'); } catch { /* sin almacenamiento: solo esta vez */ }
  }
}
if (raiz.dataset.theme === 'dark') ponerTema(true, false);
botonTema?.addEventListener('click', () => ponerTema(raiz.dataset.theme !== 'dark'));

// ── cabecera: el filete al bajar y el menú del teléfono ──
const cab = document.querySelector('[data-cab]');
if (cab) {
  const alBajar = () => cab.classList.toggle('cab--sombra', scrollY > 8);
  addEventListener('scroll', alBajar, { passive: true });
  alBajar();
  const boton = cab.querySelector('[data-abrir-menu]');
  const menu = document.getElementById('menu-movil');
  if (boton && menu) {
    const poner = (abierto) => {
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
      menu.hidden = !abierto;
    };
    boton.addEventListener('click', () => poner(boton.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) poner(false);
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        poner(false);
        boton.focus();
      }
    });
    matchMedia('(min-width: 920px)').addEventListener('change', (m) => {
      if (m.matches) poner(false);
    });
  }
}

// ── animaciones que corren solo mientras se ven ──
function mientrasSeVe(el, correr, terminar) {
  let control = null;
  const parar = () => {
    control?.abort();
    control = null;
    terminar();
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !control) {
      control = new AbortController();
      correr(control.signal).catch(() => {});
    } else if (!e.isIntersecting && control) parar();
  }, { threshold: 0.3 }).observe(el);
  reducir.addEventListener('change', () => reducir.matches && parar());
}
const espera = (ms, senal) =>
  new Promise((ok, mal) => {
    if (senal.aborted) return mal(new DOMException('parado', 'AbortError'));
    const t = setTimeout(ok, ms);
    senal.addEventListener('abort', () => { clearTimeout(t); mal(new DOMException('parado', 'AbortError')); }, { once: true });
  });

// La conversación del recordatorio: llega el mensaje, la paciente contesta y la cita queda confirmada.
const chat = document.querySelector('[data-chat]');
if (chat && !reducir.matches) {
  const pasos = [...chat.querySelectorAll('[data-paso]')];
  const cuerpo = chat.querySelector('.chat__cuerpo');
  const escribiendo = (sale) => {
    const d = document.createElement('div');
    d.className = `chat__escribiendo${sale ? ' chat__escribiendo--sale' : ''}`;
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<span></span><span></span><span></span>';
    return d;
  };
  mientrasSeVe(
    chat,
    async (senal) => {
      for (;;) {
        for (const p of pasos) {
          p.classList.add('esperando');
          p.classList.remove('llega');
        }
        await espera(600, senal);
        for (const [i, p] of pasos.entries()) {
          if (i < 2) {
            const e = escribiendo(i === 1);
            cuerpo.insertBefore(e, p);
            try { await espera(i === 0 ? 1300 : 1000, senal); } finally { e.remove(); }
          }
          p.classList.remove('esperando');
          p.classList.add('llega');
          await espera(i === 0 ? 1700 : 900, senal);
        }
        await espera(5000, senal);
      }
    },
    () => pasos.forEach((p) => p.classList.remove('esperando', 'llega')),
  );
}

// El dictado (el del héroe y el de su sección): las secciones de la nota se llenan palabra por palabra, como las va
// entendiendo el navegador.
for (const dictado of reducir.matches ? [] : document.querySelectorAll('[data-dictado]')) {
  const textos = [...dictado.querySelectorAll('[data-texto]')];
  mientrasSeVe(
    dictado,
    async (senal) => {
      for (;;) {
        for (const t of textos) t.textContent = '';
        await espera(500, senal);
        for (const t of textos) {
          const palabras = t.dataset.texto.split(' ');
          t.classList.add('escribiendo');
          try {
            for (let i = 1; i <= palabras.length; i++) {
              t.textContent = palabras.slice(0, i).join(' ');
              await espera(150 + Math.random() * 130, senal);
            }
          } finally {
            t.classList.remove('escribiendo');
          }
          await espera(450, senal);
        }
        await espera(4500, senal);
      }
    },
    () => textos.forEach((t) => { t.textContent = t.dataset.texto; t.classList.remove('escribiendo'); }),
  );
}

// ── precios: la calculadora y lo que se lleva al formulario de la prueba ──
const datosPrecios = (() => {
  try { return JSON.parse(document.getElementById('datos-precios')?.textContent || 'null'); } catch { return null; }
})();
const dinero = (n) => `$${n}`;
const form = document.querySelector('[data-prueba]');

function llevarAlFormulario({ interes, medicos, plan }) {
  if (!form) return;
  if (interes) {
    const r = form.querySelector(`[name="interes"][value="${interes}"]`);
    if (r) r.checked = true;
  }
  if (medicos) form.elements.medicos.value = String(medicos);
  form.elements.plan.value = plan || '';
}

const calc = document.querySelector('[data-calculadora]');
if (calc && datosPrecios) {
  calc.hidden = false;
  const campo = (n) => calc.querySelector(`[name="${n}"]`);
  const [agendaSi, mensajes, expedienteSi, profesionales] = ['calc-agenda', 'calc-mensajes', 'calc-expediente', 'calc-profesionales'].map(campo);
  const radios = [...document.querySelectorAll('[name="plan-mensajes"]')];

  const leer = () => {
    const n = Math.min(50, Math.max(1, Math.round(Number(profesionales.value) || 1)));
    const paquete = datosPrecios.agenda.find((t) => String(t.mensajes) === mensajes.value) || datosPrecios.agenda[0];
    return { n, paquete, agenda: agendaSi.checked, expediente: expedienteSi.checked };
  };
  const resumen = ({ n, paquete, agenda, expediente }) => {
    const partes = [];
    if (agenda) partes.push(`Agenda con ${paquete.mensajes} mensajes (${dinero(paquete.precio)})`);
    if (expediente) partes.push(`Expediente para ${n} ${n === 1 ? 'profesional' : 'profesionales'} (${dinero(n * datosPrecios.expediente)})`);
    const total = (agenda ? paquete.precio : 0) + (expediente ? n * datosPrecios.expediente : 0);
    return partes.length ? `${partes.join(' + ')} = ${dinero(total)} al mes` : '';
  };
  const calcular = () => {
    const v = leer();
    const a = v.agenda ? v.paquete.precio : 0;
    const x = v.expediente ? v.n * datosPrecios.expediente : 0;
    calc.querySelector('[data-sub="agenda"]').textContent = v.agenda ? dinero(a) : '—';
    calc.querySelector('[data-sub="expediente"]').textContent = v.expediente ? dinero(x) : '—';
    calc.querySelector('[data-total]').textContent = dinero(a + x);
    agendaSi.closest('.calculadora__fila').classList.toggle('apagada', !v.agenda);
    expedienteSi.closest('.calculadora__fila').classList.toggle('apagada', !v.expediente);
    mensajes.disabled = !v.agenda;
    for (const el of calc.querySelectorAll('.contador button, .contador input')) el.disabled = !v.expediente;
    return v;
  };
  calc.addEventListener('input', calcular);
  calc.addEventListener('change', (e) => {
    if (e.target === profesionales) profesionales.value = String(leer().n);
    if (e.target === mensajes) for (const r of radios) r.checked = r.value === mensajes.value;
    calcular();
  });
  calc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sumar]');
    if (!b) return;
    profesionales.value = String(Math.min(50, Math.max(1, leer().n + Number(b.dataset.sumar))));
    calcular();
  });
  // Los paquetes de mensajes de la tarjeta de la agenda y los de la calculadora van juntos.
  for (const r of radios) {
    r.addEventListener('change', () => {
      mensajes.value = r.value;
      calcular();
    });
  }
  calcular();

  // «Probar…»: lo elegido viaja al registro (con el registro en línea) o al formulario de la prueba.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-elegir]');
    if (!b) return;
    const v = leer();
    if (/^https?:/.test(b.getAttribute('href') || '')) {
      const elegido = radios.find((r) => r.checked)?.value || v.paquete.mensajes;
      const params = b.dataset.elegir === 'calculadora'
        ? { expediente: v.expediente ? 1 : 0, profesionales: v.n, agenda: v.agenda ? 1 : 0, mensajes: v.paquete.mensajes }
        : b.dataset.elegir === 'agenda' ? { expediente: 0, agenda: 1, mensajes: elegido } : { expediente: 1, profesionales: 1, agenda: 0 };
      const u = new URL(b.href);
      u.search = new URLSearchParams(params).toString();
      b.href = u.toString();
      return;
    }
    if (b.dataset.elegir === 'calculadora') {
      const interes = v.agenda && v.expediente ? 'los dos' : v.agenda ? 'la agenda' : v.expediente ? 'el expediente' : null;
      llevarAlFormulario({ interes, medicos: v.n, plan: resumen(v) });
    } else if (b.dataset.elegir === 'agenda') {
      llevarAlFormulario({ interes: 'la agenda', plan: resumen({ ...v, agenda: true, expediente: false }) });
    } else if (b.dataset.elegir === 'expediente') {
      llevarAlFormulario({ interes: 'el expediente', plan: '' });
    }
  });
}

// ── el formulario de la prueba: arma el mensaje y lo abre en WhatsApp o en el correo ──
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const via = e.submitter?.value || (form.dataset.whatsapp ? 'whatsapp' : 'correo');
    const texto = [
      `Hola, quiero probar Citas Médicas ${form.dataset.dias} días gratis.`,
      `Nombre: ${d.get('nombre')}`,
      `Clínica o consultorio: ${d.get('clinica')}`,
      `Médicos: ${d.get('medicos')}`,
      `Quiero probar: ${d.get('interes')}`,
      d.get('plan') ? `Plan que calculé: ${d.get('plan')}` : '',
      String(d.get('nota') || '').trim() ? `Algo más: ${String(d.get('nota')).trim()}` : '',
    ].filter(Boolean).join('\n');
    if (via === 'whatsapp' && form.dataset.whatsapp) {
      const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(texto)}`;
      // con «noopener» window.open devuelve null aunque abra: se corta el vínculo a mano
      const w = window.open(url, '_blank');
      if (w) w.opener = null;
      else location.href = url;
    } else if (form.dataset.correo) {
      location.href = `mailto:${form.dataset.correo}?subject=${encodeURIComponent('Prueba de Citas Médicas')}&body=${encodeURIComponent(texto)}`;
    }
  });
}
