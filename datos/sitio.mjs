// Datos generales del sitio.
export const ACTUALIZADO = { iso: '2026-10-06', texto: '6 de octubre de 2026' };

// Contacto: mientras whatsapp sea null, el cotizador abre WhatsApp para que la persona elija a quién mandarlo
// (sirve para que Edwin arme la cotización con un cliente y se la mande). Número en formato wa.me: 507XXXXXXXX.
export const CONTACTO = { whatsapp: null, correo: null };

// El sitio vive en la raíz de su dominio (oct-2026; antes en https://jojomunoz.github.io/alphateklab/). Las demos de
// la mesa y de reservas siguen en sus repositorios de GitHub Pages (datos/demos.mjs).
export const URL_BASE = 'https://alphateklab.com/';
