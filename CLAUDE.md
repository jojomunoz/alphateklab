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
- Video de la portada: `node herramientas/video-producto.mjs http://localhost:4900` (~80 s). Graba la demo real de la mesa
  cuadro por cuadro con el tiempo bajo control (reloj falso de Playwright + animaciones pausadas y puestas en su tiempo),
  30 por segundo, y codifica AV1 (`.av1.mp4`, con su códec en `video-codecs.json`) y H.264 (`.mp4`), 4:2:0 de 8 bits, con
  el póster sacado del primer cuadro. Probado y descartado: la transmisión de pantalla de Chrome (CDP screencast) da
  ~15 cuadros por segundo y sin doble densidad; el webm VP9 de antes salía en 4:4:4 (Profile 1), que muchos
  decodificadores de teléfono no aceptan.
- Fotos con pantallas reales (3-oct): las fotos de GPT traen las pantallas en gris o apagadas y la placa en blanco;
  encima van las pantallas de las demos y QR que funcionan. `node herramientas/pantallas-equipo.mjs http://localhost:4900 <tmp>`
  captura los contenidos y `python3 herramientas/componer-equipo.py ~/alphateklab/originales <tmp> <salida> [nombres]`
  busca cada pantalla (región de luz pareja o rayos hasta el bisel), la deforma en perspectiva y la mezcla con la luz
  de la foto (deja `<nombre>-contorno.png` para revisar las esquinas). Los originales viven en `~/alphateklab/originales`
  (fuera del repo). Después de componer, comprobar que los QR se leen (jsQR sobre la imagen publicada).
- El héroe de la portada es esa foto compuesta (`assets/heroe/heroe-portada-{640,1200}.webp`) con pantallas de varios
  negocios a propósito: con solo la mesa, los dueños leían «hacen menús QR para restaurantes». Si faltan los archivos,
  vuelve la caja de avisos.
- Después de cada push, mirar que GitHub Pages haya publicado: `gh api repos/jojomunoz/<repo>/pages/builds --jq '.[0]'`
  (un despliegue de reservas falló una vez por un tiempo de espera de Jekyll; los tres repos llevan `.nojekyll`).
- Cerrojos, contra local y contra el sitio en vivo después de cada push:
  `PERMITIR_PENDIENTES=1 node --test pruebas/*.test.mjs pruebas/control/*.test.mjs`, `node pruebas/navegador/sitio.mjs <url>` y
  `node pruebas/navegador/interaccion.mjs <url>` (cada falla que encontró la revisión de clase mundial es un paso).
- Las dos de navegador también con el motor de Safari (iPhone). En esta Fedora el WebKit de Playwright pide ICU 74 y
  libjpeg8, que el sistema no trae; hay un lanzador que los pone, y el Playwright de la versión que coincide:
  `MOTOR=webkit WEBKIT_EXE=/home/jonathan/Documents/NovahWEB/proyectos/guia-anfibios/qa-2026-09-30/a11y/webkit-libs/run-webkit.sh PW=/home/jonathan/Documents/NovahWEB/proyectos/guia-anfibios-panama/node_modules/playwright-core/index.mjs node pruebas/navegador/sitio.mjs <url>`.
- El buscador se mide de verdad con `node pruebas/control/medir.mjs`: 87 frases que escribieron agentes en el papel de
  dueños de negocios sin ver cómo está afinado (70 con respuesta, 17 de cosas que no hacemos), partidas en dos mitades.
  La de «desarrollo» se puede mirar (`--fallas`); la de «control» solo da cifras: no se leen sus fallas una por una ni se
  agregan sus palabras a `datos/`. Los arreglos son reglas generales del motor o datos escritos sin ver la batería.
  Al 3-oct-2026, en control: primero correcto 18/33 (era 11), a la vista 26/33, «no lo tenemos» 6/7.
  `pruebas/control/control.test.mjs` es el piso (sube, no baja); corre con `node --test pruebas/*.test.mjs pruebas/control/*.test.mjs`.
  `pruebas/buscador-personas.test.mjs` (40 frases de la revisión, 95 %) queda como cerrojo, pero ya se afinó con ellas.
- Datos del buscador: `datos/busqueda.mjs` (palabras por servicio y por negocio, equivalencias de Panamá y del chat,
  relleno) y `datos/situaciones.mjs` (~1.400 frases de situación por servicio, escritas y verificadas por agentes sin ver
  la batería). El motor (`js/buscador.mjs`): palabras vacías del español, faltas comunes por sonido, rareza de cada palabra
  (IDF), cobertura sobre las palabras que el índice conoce, y un mínimo que crece con el largo de la frase; lo que queda
  debajo se muestra como «lo más parecido que hacemos».

## Probado y descartado

- **View Transitions entre documentos (`@view-transition { navigation: auto }`), 3-oct-2026:** en Chromium 149 sin
  interfaz, una navegación por script con transición seguida de otra navegación dejó la página nueva sin pintar
  (`requestAnimationFrame` no corre, las capturas no salen, los clics esperan para siempre). No se pudo descartar que le
  pase a una persona con el botón atrás, así que no se usa. La prueba de navegador lo detecta (4 pasos fallan).
