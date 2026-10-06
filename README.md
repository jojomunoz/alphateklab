# alphateklab

Sitio de **alphateklab**, software para negocios en Panamá: software a medida, páginas web y apps, asistentes de
WhatsApp con inteligencia artificial, automatizaciones, cobros y factura electrónica. Solo software: no vende ni instala
equipos (desde oct-2026).

Dominio: https://alphateklab.com/ (el sitio va en la raíz del dominio; antes estaba en https://jojomunoz.github.io/alphateklab/).

## Qué hay

| Ruta | Qué es |
|---|---|
| `index.html` | Portada: índice de servicios, catálogo con filtros, laboratorio de demos, preguntas y cotizador |
| `servicios/<slug>/` | Una página por servicio, para mandar el enlace de uno solo |
| `laboratorio/` | Índice de las demos (la de la mesa y la de citas y reservas) |
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
existe, un código repetido, un servicio que se instala o lista equipo, o una muletilla de las que la guía de la casa
prohíbe. El único precio publicado es el del menú QR ($10 al mes); el resto dice «A cotizar».

Sin paso de build en el navegador: HTML, CSS y módulos ES. La fuente (Archivo) va autoalojada en `assets/fuentes/`.
