# alphateklab

Sitio de **alphateklab**, soluciones tecnológicas para negocios en Panamá: software a medida, páginas web, apps,
automatizaciones, y la instalación en el local de pantallas, cámaras con IA, sensores, y QR y NFC por mesa.

En vivo: https://jojomunoz.github.io/alphateklab/

## Qué hay

| Ruta | Qué es |
|---|---|
| `index.html` | Portada: índice de servicios, catálogo con filtros, laboratorio de demos, preguntas y cotizador |
| `servicios/<slug>/` | Una página por servicio, para mandar el enlace de uno solo |
| `laboratorio/recorrido-3d/` | Demo: recorrido 3D de un apartamento de ejemplo, como videojuego |
| `laboratorio/recorrido-360/` | Demo: recorrido 360 con fotos esféricas (CC0, Poly Haven) |
| `laboratorio/camara/` | Demo: contador de personas con la cámara del equipo, procesado en el navegador |
| `laboratorio/sensores/` | Demo: tablero de sensores de un restaurante de ejemplo, con datos simulados |
| `privacidad/` | Qué datos trata el sitio (ninguno) y las demos |

Las demos de restaurante y de citas viven en sus propios repos:
[alphateklab-mesa](https://jojomunoz.github.io/alphateklab-mesa/) y
[alphateklab-reservas](https://jojomunoz.github.io/alphateklab-reservas/).

## Cómo se cambia

El catálogo vive en `datos/catalogo.mjs`. Las páginas se generan de ahí:

```sh
node herramientas/generar.mjs        # escribe index.html, servicios/, privacidad/, 404.html, sitemap.xml, robots.txt
node --test pruebas/*.test.mjs       # reglas del catálogo y lógica de la portada
python3 -m http.server 4900 -d ..    # y abrir http://localhost:4900/alphateklab/
node pruebas/navegador/portada.mjs http://localhost:4900/alphateklab/
```

El generador se niega a escribir si el catálogo tiene un precio que no decidieron los socios, una demo que no
existe, un código repetido o una muletilla de las que la guía de la casa prohíbe. Los únicos precios publicados son
el menú QR ($10 al mes) y las fotos profesionales como extra del recorrido 3D (+$300); el resto dice «A cotizar».

Sin paso de build en el navegador: HTML, CSS y módulos ES. La fuente (Archivo) va autoalojada en `assets/fuentes/`.
