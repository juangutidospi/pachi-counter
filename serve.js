/**
 * Servidor estático mínimo para desarrollo (sin dependencias).
 * Sirve la carpeta del proyecto con los MIME correctos —imprescindible para
 * los módulos ES (`.js` → text/javascript)— y elige un puerto libre a partir
 * de 8080. Uso: `npm run serve` o `node serve.js [puerto]`.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));

/** Tipos MIME por extensión. */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/') path = '/index.html';
    const full = normalize(join(ROOT, path));
    if (!full.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }

    const info = await stat(full).catch(() => null);
    const file = info && info.isDirectory() ? join(full, 'index.html') : full;
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

/**
 * Arranca el servidor probando puertos consecutivos si están ocupados.
 * @param {number} port Puerto inicial.
 * @param {number} [tries] Intentos restantes.
 */
function listen(port, tries = 10) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && tries > 0) {
      console.log(`Puerto ${port} ocupado, probando ${port + 1}…`);
      listen(port + 1, tries - 1);
    } else {
      console.error('No se pudo arrancar el servidor:', err.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log(`\n  Pachi's counter en  →  http://localhost:${port}\n  (Ctrl+C para parar)\n`);
  });
}

listen(Number(process.argv[2]) || 8080);
