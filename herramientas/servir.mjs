// Servidor local para ver los tres repositorios como en GitHub Pages, sin Python ni dependencias:
// sirve la carpeta que contiene alphateklab, alphateklab-mesa y alphateklab-reservas en http://localhost:4900/.
// Uso (desde cualquier lado): node alphateklab/herramientas/servir.mjs [puerto]
// Responde rangos de bytes: Safari no reproduce un video si el servidor no los acepta.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PUERTO = Number(process.argv[2] || process.env.PUERTO || 4900);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.tflite': 'application/octet-stream',
};

createServer((pet, res) => {
  let ruta = decodeURIComponent(new URL(pet.url, 'http://x').pathname);
  let archivo = normalize(join(RAIZ, ruta));
  if (!archivo.startsWith(RAIZ)) return res.writeHead(403).end();
  let info;
  try {
    info = statSync(archivo);
    if (info.isDirectory()) {
      if (!ruta.endsWith('/')) return res.writeHead(301, { Location: `${ruta}/` }).end();
      archivo = join(archivo, 'index.html');
      info = statSync(archivo);
    }
  } catch {
    return res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No existe');
  }
  const cabeza = { 'Content-Type': TIPOS[extname(archivo).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const rango = /^bytes=(\d*)-(\d*)$/.exec(pet.headers.range || '');
  if (rango) {
    const inicio = rango[1] ? Number(rango[1]) : Math.max(0, info.size - Number(rango[2]));
    const fin = rango[1] && rango[2] ? Math.min(Number(rango[2]), info.size - 1) : info.size - 1;
    if (inicio > fin || inicio >= info.size) return res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
    res.writeHead(206, { ...cabeza, 'Content-Range': `bytes ${inicio}-${fin}/${info.size}`, 'Content-Length': fin - inicio + 1 });
    if (pet.method === 'HEAD') return res.end();
    return createReadStream(archivo, { start: inicio, end: fin }).pipe(res);
  }
  res.writeHead(200, { ...cabeza, 'Content-Length': info.size });
  if (pet.method === 'HEAD') return res.end();
  createReadStream(archivo).pipe(res);
}).listen(PUERTO, () => console.log(`Sirviendo ${RAIZ} en http://localhost:${PUERTO}/alphateklab/`));
