# alphateklab · sitio de la agencia

Sitio estático en GitHub Pages (https://jojomunoz.github.io/alphateklab/). Sin build en el navegador: HTML, CSS y
módulos ES. Las páginas del catálogo se generan con `node herramientas/generar.mjs` a partir de `datos/catalogo.mjs`
y el resultado se versiona (así el HTML trae el contenido sin esperar al JavaScript). Pruebas: `node --test pruebas/`
y las de cada demo en `laboratorio/<demo>/pruebas/`.

Reglas del proyecto: `~/alphateklab/BRIEF.md`. Guía de diseño: `~/Documents/NovahWEB/conocimiento/GUIA-DISENO-SIN-SLOP.md`.

## Dirección visual (decidida el 3-oct-2026)

- **El mundo:** la instalación. Hoja de especificaciones, etiqueta de cable, orden de trabajo. alphateklab hace software
  y además va al local a instalar; la estética viene de lo segundo.
- **Paleta** (tokens en `assets/atk.css`, con modo oscuro): papel frío `#f4f5f2`, grafito `#15171b`, grises de la misma
  familia, y una sola **señal amarilla** `#ffc72c` que se usa como RELLENO (etiquetas, botón principal, selección),
  nunca como texto sobre claro. Enlaces `#1d46c4`. Foco `#1f4fd8`.
- **Tipografía:** Archivo variable autoalojada (`assets/fuentes/`, latin + latin-ext). Títulos en ancho 125 y peso
  ~820; texto en ancho 100; etiquetas en ancho 85. Sin monoespaciada para cifras: `tabular-nums`.
- **La apuesta:** el índice completo del catálogo en la portada, como un tablero de etiquetas filtrable. Lo demás en
  calma: radios de 2-3 px, filetes en vez de cajas, sin sombras salvo lo que flota.
- **Movimiento:** solo responder y estado. Hover solo con puntero fino. Nada en `opacity:0` esperando al JS.
- **Contenido:** precios solo los decididos por los socios (menú QR $10/mes; fotos del recorrido 3D +$300); el resto
  «A cotizar». Nada de testimonios, logos de clientes ni cifras sin fuente. Las demos usan negocios ficticios rotulados.
