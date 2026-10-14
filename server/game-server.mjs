import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRateLimiter, createTransferStore, isTransferPackage, MAX_TRANSFER_BYTES, normalizeTransferCode, TRANSFER_TTL_MS } from './transfer-store.mjs';

const SOURCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_ROOT = path.join(SOURCE_ROOT, 'dist');

// Trên Render (hoặc khi chạy với --dist) chỉ phục vụ bản đã nén trong dist/, không bao giờ phục vụ code gốc.
function defaultRoot() {
  if (!process.env.RENDER && !process.argv.includes('--dist')) return SOURCE_ROOT;
  if (!fs.existsSync(path.join(DIST_ROOT, 'index.html'))) throw new Error('Chưa có dist/: chạy npm run build trước.');
  return DIST_ROOT;
}

const PAGES = { '/': '/index.html', '/gioi-thieu': '/gioi-thieu.html' };
const STATIC_PATH = /^\/(?:index\.html|gioi-thieu\.html|manifest\.json|sw\.js|(?:js|css|img|site|music|audio|fonts|sounds|assets)\/)/;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.woff2': 'font/woff2' };

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { reject(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function clientIp(req) {
  // Render đứng sau proxy: IP thật nằm đầu X-Forwarded-For.
  if (process.env.RENDER) return String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  return req.socket.remoteAddress ?? 'unknown';
}

// Chuyển thiết bị: máy cũ gửi gói dữ liệu, nhận mã 6 ký tự; máy mới nhập mã để lấy về (một lần, trong 10 phút).
function createTransferApi() {
  const store = createTransferStore();
  const canCreate = createRateLimiter(10, 10 * 60 * 1000);
  const canClaim = createRateLimiter(30, 10 * 60 * 1000);
  return async (req, res, pathname) => {
    if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST' }); return res.end(); }
    const ip = clientIp(req);
    try {
      if (pathname === '/api/transfer') {
        if (!canCreate(ip)) return sendJson(res, 429, { error: 'Bạn tạo mã quá nhiều lần. Hãy thử lại sau 10 phút.' });
        const payload = JSON.parse(await readBody(req, MAX_TRANSFER_BYTES));
        if (!isTransferPackage(payload)) return sendJson(res, 400, { error: 'Dữ liệu gửi lên không hợp lệ.' });
        const code = store.put(Buffer.from(JSON.stringify(payload)));
        if (!code) return sendJson(res, 503, { error: 'Máy chủ đang bận. Hãy thử lại sau ít phút hoặc dùng tệp sao lưu.' });
        return sendJson(res, 201, { code, expiresIn: TRANSFER_TTL_MS / 1000 });
      }
      if (!canClaim(ip)) return sendJson(res, 429, { error: 'Bạn nhập mã quá nhiều lần. Hãy thử lại sau 10 phút.' });
      const code = normalizeTransferCode(JSON.parse(await readBody(req, 1024)).code);
      const body = code && store.take(code);
      if (!body) return sendJson(res, 404, { error: 'Mã không đúng hoặc đã hết hạn. Hãy tạo mã mới trên máy cũ.' });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return res.end(body);
    } catch (error) {
      if (error.status === 413) return sendJson(res, 413, { error: 'Dữ liệu quá lớn để gửi bằng mã. Hãy dùng tệp sao lưu.' });
      return sendJson(res, 400, { error: 'Yêu cầu không hợp lệ.' });
    }
  };
}

// Phục vụ game và trang giới thiệu; không có tài khoản hay cơ sở dữ liệu.
export function createGameServer({ root = defaultRoot() } = {}) {
  const transferApi = createTransferApi();
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/transfer' || url.pathname === '/api/transfer/claim') return void transferApi(req, res, url.pathname);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : '{"ok":true}');
    }
    let relative;
    try { relative = decodeURIComponent(PAGES[url.pathname] ?? url.pathname); }
    catch { res.writeHead(400); return res.end(); }
    if (relative.split(/[\\/]/).some(part => part.startsWith('.')) || !STATIC_PATH.test(relative)) {
      res.writeHead(404); return res.end();
    }
    const file = path.resolve(root, '.' + relative);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    try {
      const data = fs.readFileSync(file);
      const ext = path.extname(file);
      const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' };
      // Trang và service worker luôn hỏi lại máy chủ để bản cập nhật tới ngay.
      if (ext === '.html' || relative === '/sw.js') headers['Cache-Control'] = 'no-cache';
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404); res.end(); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 8080);
  const server = createGameServer();
  server.requestTimeout = 15000;
  server.listen(port, process.env.RENDER ? '0.0.0.0' : '127.0.0.1', () => console.log(`Life Again đang chạy tại cổng ${port} · Tiến trình lưu trên trình duyệt`));
}
