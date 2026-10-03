# alphateklab · sitio de la agencia

Sitio estático en GitHub Pages (https://jojomunoz.github.io/alphateklab/). Sin build en el navegador: HTML, CSS y
módulos ES. Las páginas del catálogo se generan con `node herramientas/generar.mjs` a partir de `datos/catalogo.mjs`
y el resultado se versiona (así el HTML trae el contenido sin esperar al JavaScript). Pruebas: `node --test pruebas/`
y las de cada demo en `laboratorio/<demo>/pruebas/`.

Reglas del proyecto: `~/alphateklab/BRIEF.md`. Guía de diseño: `~/Documents/NovahWEB/conocimiento/GUIA-DISENO-SIN-SLOP.md`.

## Dirección visual (marca entregada por Jonathan el 3-oct-2026; manda sobre cualquier versión anterior)

- **Marca:** logo «a» con módulo ámbar (`assets/marca/logo-claro.svg` en fondo claro, `logo-oscuro.svg` en oscuro, con
  `<picture>` y `prefers-color-scheme`).
- **Paleta** (tokens en `assets/atk.css`, con modo oscuro): ámbar `#F2B544` (`--senal`: botones y señales; encima va
  texto grafito, NUNCA blanco ni crema), verde petróleo `#176B64` (`--acento`/`--enlace`/`--foco`), grafito `#202729`,
  claro `#F7F5EF`, apoyo `#DCE9E5`. Bordes de controles con `--borde-control` (≥ 3:1).
- **Tipografía:** Manrope (títulos, 800) e Inter (texto), autoalojadas en `assets/fuentes/` (latin + latin-ext). Cifras con
  `tabular-nums`, sin monoespaciada.
- **Radios:** solo tres, con rol: `--r-control` 8 px (botones, campos, íconos), `--r-tarjeta` 12 px (tarjetas y paneles),
  `--r-chico` 6 px (insignias, casillas). Nada de 999 px salvo la cuenta redonda de la cabecera.
- **Composición:** filetes en vez de cajas donde se pueda (cómo trabajamos, ficha, etapas); una sola apuesta por pantalla.
- **Lo que ve el visitante no lleva códigos internos** (R01, C05…): siguen en `data-id` y en el mensaje de WhatsApp.
- **Verbos:** «Preguntar» (manda un mensaje) y «Agregar a mi lista» (arma la cotización). No inventar otros.
- **Movimiento:** solo responder y estado. Hover solo con puntero fino. Nada en `opacity:0` esperando al JS.
- **Contenido:** precios solo los decididos por los socios (menú QR $10/mes; fotos del recorrido 3D +$300); el resto
  «A cotizar». Nada de testimonios, logos de clientes ni cifras sin fuente. Las demos usan negocios ficticios rotulados.

## Cómo se trabaja (3-oct-2026)

- Generar: `node herramientas/generar.mjs` (las seis demos ya pasaron su verificación; el modo `PUBLICAR_PARCIAL` queda para
  una demo nueva que todavía no esté lista).
- Capturas: `node herramientas/capturas.mjs http://localhost:4900 <demo>` (cartel de cada demo) y
  `node herramientas/producto.mjs http://localhost:4900` (las pantallas reales que van en los héroes de la portada y de
  las páginas de negocio). Las imágenes del sitio son del producto, no escenas generadas.
- Cerrojos, contra local y contra el sitio en vivo después de cada push:
  `PERMITIR_PENDIENTES=1 node --test pruebas/*.test.mjs`, `node pruebas/navegador/sitio.mjs <url>` y
  `node pruebas/navegador/interaccion.mjs <url>` (cada falla que encontró la revisión de clase mundial es un paso).
- Las dos de navegador también con el motor de Safari (iPhone). En esta Fedora el WebKit de Playwright pide ICU 74 y
  libjpeg8, que el sistema no trae; hay un lanzador que los pone, y el Playwright de la versión que coincide:
  `MOTOR=webkit WEBKIT_EXE=/home/jonathan/Documents/NovahWEB/proyectos/guia-anfibios/qa-2026-09-30/a11y/webkit-libs/run-webkit.sh PW=/home/jonathan/Documents/NovahWEB/proyectos/guia-anfibios-panama/node_modules/playwright-core/index.mjs node pruebas/navegador/sitio.mjs <url>`.
- El buscador se mide con `pruebas/buscador-personas.test.mjs` (40 frases de personas; umbral 95 % al primer intento).
  Esas frases ya se usaron para afinarlo: para medir de verdad hace falta otra batería que nadie toque.

## Probado y descartado

- **View Transitions entre documentos (`@view-transition { navigation: auto }`), 3-oct-2026:** en Chromium 149 sin
  interfaz, una navegación por script con transición seguida de otra navegación dejó la página nueva sin pintar
  (`requestAnimationFrame` no corre, las capturas no salen, los clics esperan para siempre). No se pudo descartar que le
  pase a una persona con el botón atrás, así que no se usa. La prueba de navegador lo detecta (4 pasos fallan).
