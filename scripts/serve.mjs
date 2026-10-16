// Minimal zero-dependency static server for the built `dist/` folder.
// Useful for local preview (behind a tunnel/proxy) — no host blocking.
// Run: node scripts/serve.mjs   (PORT env var overrides the default 4321)
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4321);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = createServer((req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    let file = normalize(join(root, pathname));
    if (file !== root && !file.startsWith(root + '\\') && !file.startsWith(root + '/')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    let status = 200;
    if (!existsSync(file) || statSync(file).isDirectory()) {
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file)) {
        file = join(root, '404.html');
        status = 404;
      }
    }
    const ext = extname(file).toLowerCase();
    res.writeHead(status, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(readFileSync(file));
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving dist/ at http://127.0.0.1:${port}`);
});
