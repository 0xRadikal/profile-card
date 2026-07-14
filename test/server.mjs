// Minimal static file server that serves the repository root under the
// `/profile-card/` base path, mirroring the GitHub Pages deployment layout.
// Used by the smoke tests so absolute `/profile-card/...` URLs resolve exactly
// as they will in production.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)); // repo root
const BASE = '/profile-card';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webmanifest': 'application/manifest+json',
};

export function startServer(port = 0) {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath.startsWith(BASE)) urlPath = urlPath.slice(BASE.length);
      if (urlPath === '' || urlPath === '/') urlPath = '/index.html';
      // Prevent path traversal.
      const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      let filePath = join(ROOT, safe);
      try {
        const s = await stat(filePath);
        if (s.isDirectory()) filePath = join(filePath, 'index.html');
      } catch {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const body = await readFile(filePath);
      res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream');
      res.statusCode = 200;
      res.end(body);
    } catch (err) {
      res.statusCode = 500;
      res.end('Server error: ' + err.message);
    }
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port, base: BASE });
    });
  });
}
