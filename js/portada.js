// Portada de alphateklab y página de Food: el tema y el menú del teléfono, igual que en la página de Med (js/citas.js),
// y el formulario de contacto. Todo es mejora: sin este script la página se lee entera y el formulario se manda igual.

// ── tema: sale en claro y el botón pasa al oscuro; se recuerda en este navegador (la misma clave que Med) ──
const raiz = document.documentElement;
const botonTema = document.querySelector('[data-tema]');
function ponerTema(oscuro, guardar = true) {
  raiz.dataset.theme = oscuro ? 'dark' : 'light';
  for (const img of document.querySelectorAll('img[data-oscuro]')) img.src = oscuro ? img.dataset.oscuro : img.dataset.claro;
  botonTema?.setAttribute('aria-pressed', String(oscuro));
  botonTema?.setAttribute('aria-label', oscuro ? 'Usar el tema claro' : 'Usar el tema oscuro');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#0f1218' : '#f6f7f9');
  if (guardar) {
    try {
      localStorage.setItem('atk-tema', oscuro ? 'oscuro' : 'claro');
    } catch {
      /* sin almacenamiento: solo esta vez */
    }
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

// ── formulario de contacto (Food): se manda a FormSubmit sin salir de la página y responde ahí mismo ──
for (const form of document.querySelectorAll('[data-formulario]')) {
  const estado = form.querySelector('[data-estado]');
  const boton = form.querySelector('button[type="submit"]');
  const textoBoton = boton.querySelector('span');
  let enviando = false;
  const decir = (texto, tipo) => {
    estado.dataset.tipo = tipo;
    estado.textContent = texto;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enviando) return;
    if (!form.dataset.ajax) {
      decir('Vista previa: este formulario todavía no tiene a dónde enviar.', 'error');
      return;
    }
    enviando = true;
    boton.setAttribute('aria-disabled', 'true');
    textoBoton.textContent = 'Enviando…';
    estado.textContent = '';
    const datos = Object.fromEntries(new FormData(form));
    try {
      const r = await fetch(form.dataset.ajax, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...datos, _replyto: datos.email }),
      });
      const respuesta = await r.json().catch(() => ({}));
      // FormSubmit responde {success: "true"} (a veces con el booleano); cualquier otra cosa es que no llegó.
      if (!r.ok || String(respuesta.success) !== 'true') throw new Error(respuesta.message || `HTTP ${r.status}`);
      form.reset();
      decir(form.dataset.gracias, 'ok');
    } catch {
      decir(form.dataset.error, 'error');
    } finally {
      enviando = false;
      boton.removeAttribute('aria-disabled');
      textoBoton.textContent = 'Enviar';
    }
  });
}
