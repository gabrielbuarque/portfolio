// Local preview of dist/ (mirrors nginx: /path/ -> /path/index.html, 404.html fallback).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const ROOT = path.resolve('dist'), PORT = Number(process.env.PORT || 8765);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }).end(); return; }
    f = path.join(f, 'index.html');
  }
  const ok = fs.existsSync(f);
  const file = ok ? f : path.join(ROOT, '404.html'), type = TYPES[path.extname(file)] || 'application/octet-stream';
  const gz = /gzip/.test(req.headers['accept-encoding'] || '') && /text|json|xml|svg|javascript|manifest/.test(type);
  res.writeHead(ok ? 200 : 404, { 'Content-Type': type, ...(gz ? { 'Content-Encoding': 'gzip' } : {}) });
  const stream = fs.createReadStream(file); gz ? stream.pipe(zlib.createGzip()).pipe(res) : stream.pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
