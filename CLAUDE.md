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
