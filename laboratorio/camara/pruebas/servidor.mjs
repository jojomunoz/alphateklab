// Servidor estático mínimo con soporte de Range (python -m http.server no lo tiene y Chromium no puede buscar en un video sin él).
// Uso: node servidor.mjs <carpeta> <puerto>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const raiz = path.resolve(process.argv[2] || '.'); const puerto = Number(process.argv[3] || 4790);
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
http.createServer((q, r) => {
  let f = path.join(raiz, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (!f.startsWith(raiz)) { r.writeHead(403); return r.end(); }
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch {}
  let st; try { st = fs.statSync(f); } catch { r.writeHead(404, { 'content-type': 'text/plain' }); return r.end('404'); }
  const tipo = tipos[path.extname(f)] || 'application/octet-stream';
  const rango = /bytes=(\d*)-(\d*)/.exec(q.headers.range || '');
  if (rango) {
    const ini = rango[1] ? Number(rango[1]) : st.size - Number(rango[2]); const fin = rango[1] && rango[2] ? Number(rango[2]) : st.size - 1;
    r.writeHead(206, { 'content-type': tipo, 'content-range': `bytes ${ini}-${fin}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': fin - ini + 1 });
    return fs.createReadStream(f, { start: ini, end: fin }).pipe(r);
  }
  r.writeHead(200, { 'content-type': tipo, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-cache' });
  if (q.method === 'HEAD') return r.end();
  fs.createReadStream(f).pipe(r);
}).listen(puerto, () => console.log('sirviendo', raiz, 'en', puerto));
