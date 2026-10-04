# Colaborar en alphateklab

Para quien trabaja en estos repositorios además de Jonathan, sea una persona o un agente. Lo técnico de cada
repositorio está en su `CLAUDE.md` y su `README.md`. Aquí va cómo entran los cambios sin pisarse.

## Los tres repositorios

| Repositorio | Publicado en | Qué es |
|---|---|---|
| `jojomunoz/alphateklab` | https://jojomunoz.github.io/alphateklab/ | El sitio: catálogo de 79 servicios, 9 páginas por negocio, buscador, diagnóstico, «Pregúntanos» y el laboratorio (recorrido 3D, recorrido 360, contador con cámara y tablero de sensores) |
| `jojomunoz/alphateklab-mesa` | https://jojomunoz.github.io/alphateklab-mesa/ | Demo de pedir y pagar desde la mesa: carta QR, salón, cocina, kiosco y administración |
| `jojomunoz/alphateklab-reservas` | https://jojomunoz.github.io/alphateklab-reservas/ | Demo de citas con recordatorios y de reservas de cabañas por canal |

Los tres son públicos. `main` es producción: GitHub Pages publica cada push en uno o dos minutos.

## Preparar la máquina

```sh
mkdir alphateklab-trabajo && cd alphateklab-trabajo
git clone https://github.com/jojomunoz/alphateklab.git
git clone https://github.com/jojomunoz/alphateklab-mesa.git
git clone https://github.com/jojomunoz/alphateklab-reservas.git
for r in alphateklab alphateklab-mesa alphateklab-reservas; do (cd $r && npm install); done
(cd alphateklab && npx playwright install chromium)    # y «webkit» para probar como en un iPhone
python3 -m http.server 4900                               # desde alphateklab-trabajo: sirve los tres
```

Los tres van en la misma carpeta, porque el sitio enlaza las demos por ruta. Hace falta Node 22. Algunas herramientas
de imagen piden además ImageMagick 7 (`magick`), ffmpeg y Python 3 con Pillow y numpy.

## Cómo entra un cambio

1. **Nada directo a `main`** salvo que Jonathan lo autorice. Se trabaja en una rama (o en un fork) y se abre un pull
   request contra `main`.
2. **Antes de abrir el pull request**, en el sitio:
   - `node herramientas/generar.mjs`. Las páginas se generan desde `datos/` y el resultado se versiona. Los HTML no se
     editan a mano.
   - `node --test pruebas/*.test.mjs pruebas/control/*.test.mjs`
   - `node pruebas/navegador/sitio.mjs http://localhost:4900/alphateklab/` y
     `node pruebas/navegador/interaccion.mjs http://localhost:4900/alphateklab/`
   - Mirarlo en el navegador a 1440 px y a 390 px, en claro y en oscuro.

   En las demos: `node --test pruebas/` y su recorrido (`herramientas/recorrido.mjs`; ver el README de cada una).
3. **Cada arreglo deja su prueba**, y se comprueba que la prueba falla contra lo publicado antes del arreglo. Si no
   falla, no está probando nada.
4. **En la descripción del pull request** van:
   - qué cambió y por qué;
   - cómo se comprobó, con las cifras;
   - lo que no se hizo o quedó a medias.
5. **Una cosa por pull request**, chico. Antes de empezar, `git pull` y avisar qué parte se toma, para no tocar a la vez
   los mismos archivos que otra persona. Los más compartidos son `herramientas/generar.mjs` y `assets/sitio.css`.
6. **Verificar contra el artefacto** (el código, la página en el navegador, el sitio publicado) y no contra la memoria
   ni contra una nota.

## Lo que no se hace

- Los repositorios son públicos. Nunca entran credenciales, chats exportados, datos de clientes reales ni números de
  teléfono reales.
- Las demos usan negocios y personas ficticios, rotulados como de ejemplo.
- Solo hay precios donde los decidieron los socios: el menú QR, a $10 al mes, y las fotos del recorrido 3D, +$300.
  `js/catalogo-reglas.mjs` los fija y una prueba lo vigila. El resto va «a cotizar». Tampoco van testimonios, logos de
  clientes ni cifras sin fuente.
- Redacción:
  - tuteo panameño;
  - el hecho primero;
  - sin «¡», sin marketing y sin muletillas (la lista de palabras prohibidas está en `js/catalogo-reglas.mjs`);
  - verbos fijos: «Preguntar» y «Agregar a mi lista».
- Imágenes:
  - capturas reales de las demos o fotos generadas rotuladas «Imagen ilustrativa»;
  - nunca una pantalla o un QR inventados: se componen encima los reales (ver `CLAUDE.md`).
