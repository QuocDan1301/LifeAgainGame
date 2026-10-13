import http from 'node:http';
import { createSupabaseStorage } from './supabase-storage.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = token => createHash('sha256').update(token).digest('hex');
const publicUser = account => account ? { id: account.id, nickname: account.nickname, avatar: account.avatar } : null;
const AVATARS = ['🙂', '😊', '😎', '🦊', '🐼', '🐱', '🦁', '🐸'];
export function createAccountService({ dataFile = path.join(ROOT, '.ranking-data', 'rankings.json'), now = () => new Date(), storage = null, secureCookies = false, adminAccountIds = [] } = {}) {
  let db = dataFile && fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : { accounts: [], sessions: [] };
  const accountData = payload => ({ accounts: payload.accounts, sessions: payload.sessions, ...(payload.adminAudit ? { adminAudit: payload.adminAudit } : {}) });
  db = accountData(db);
  let committed = structuredClone(db);
  let revision = 0;
  const persist = async () => {
    if (storage) {
      try { revision = await storage.save(db, revision); committed = structuredClone(db); }
      catch (error) { db = structuredClone(committed); throw error; }
      return;
    }
    if (!dataFile) return;
    try {
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile + '.tmp', JSON.stringify(db));
      fs.renameSync(dataFile + '.tmp', dataFile);
      committed = structuredClone(db);
    } catch (error) { db = structuredClone(committed); throw error; }
  };
  const attempts = new Map();
  async function handler(req, res) {
    const reply = (status, data, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(JSON.stringify(data)); };
    try {
      if (storage) { const loaded = await storage.load(); db = accountData(loaded.payload); revision = loaded.revision; committed = structuredClone(db); }
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/account/')) return reply(404, { error: 'Không tìm thấy.' });
      if (!['GET', 'POST'].includes(req.method)) return reply(405, { error: 'Thao tác không được hỗ trợ.' });
      if (req.method === 'POST' && req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return reply(403, { error: 'Yêu cầu khác nguồn bị từ chối.' });
      if (req.method === 'POST' && !String(req.headers['content-type'] ?? '').startsWith('application/json')) return reply(415, { error: 'Dữ liệu cần có định dạng JSON.' });
      const token = /(?:^|;\s*)accountSession=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie ?? '')?.[1];
      const session = token && db.sessions.find(item => item.token === hash(token) && item.expires > now().getTime());
      const account = session && db.accounts.find(item => item.id === session.accountId && !item.disabled);
      const isAdmin = Boolean(account && adminAccountIds.includes(account.id));
      const route = url.pathname.slice('/api/account/'.length);
      if (req.method === 'GET' && route === 'status') return reply(200, { available: true, user: account ? { ...publicUser(account), admin: isAdmin } : null });
      if (route.startsWith('admin/')) {
        if (!account) return reply(401, { error: 'Hãy đăng nhập.' });
        if (!isAdmin) return reply(403, { error: 'Chỉ quản trị viên được truy cập.' });
        if (req.method === 'GET' && route === 'admin/accounts') {
          const search = (url.searchParams.get('q') ?? '').trim().toLowerCase();
          const page = Math.max(1, Math.min(100000, Number.parseInt(url.searchParams.get('page'), 10) || 1));
          const matches = db.accounts.filter(item => !search || item.username.includes(search) || item.nickname.toLowerCase().includes(search));
          const accounts = matches.slice((page - 1) * 50, page * 50).map(item => {
            return { ...publicUser(item), username: item.username, disabled: Boolean(item.disabled), admin: adminAccountIds.includes(item.id), createdAt: item.createdAt ?? null };
          });
          return reply(200, { accounts, total: matches.length, page, pages: Math.ceil(matches.length / 50), stats: { accounts: db.accounts.length, disabled: db.accounts.filter(item => item.disabled).length } });
        }

      }
      if (req.method !== 'POST') return reply(404, { error: 'Không tìm thấy.' });
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (Buffer.byteLength(raw) > 64_000) return reply(413, { error: 'Dữ liệu quá lớn.' });
      }
      let body;
      try { body = JSON.parse(raw || '{}'); } catch { return reply(400, { error: 'Dữ liệu JSON không hợp lệ.' }); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, { error: 'Dữ liệu không hợp lệ.' });
      if (route === 'admin/account-state') {
        if (route === 'admin/account-state') {
          const target = db.accounts.find(item => item.id === body.id);
          if (!target) return reply(404, { error: 'Không tìm thấy tài khoản.' });
          if (typeof body.disabled !== 'boolean') return reply(400, { error: 'Trạng thái không hợp lệ.' });
          if (adminAccountIds.includes(target.id)) return reply(400, { error: 'Không thể khóa tài khoản quản trị.' });
          target.disabled = body.disabled;
          if (body.disabled) db.sessions = db.sessions.filter(item => item.accountId !== target.id);
        }
        db.adminAudit = [...(db.adminAudit ?? []), { actorId: account.id, action: route, targetId: body.id, disabled: body.disabled, at: now().toISOString() }].slice(-1000);
        await persist();
        return reply(200, { ok: true });
      }
      if (route === 'register' || route === 'login') {
        const key = req.socket?.remoteAddress ?? 'local';
        const recent = (attempts.get(key) ?? []).filter(time => time > now().getTime() - 60_000);
        if (recent.length >= 20) return reply(429, { error: 'Thử lại sau một phút.' });
        attempts.set(key, [...recent, now().getTime()]);
        const username = String(body.username ?? '').toLowerCase();
        const password = body.password;
        if (!/^[a-z0-9_]{3,24}$/.test(username) || typeof password !== 'string' || password.length < 8 || password.length > 128) return reply(400, { error: 'Tên đăng nhập gồm 3–24 chữ thường, số hoặc dấu gạch dưới. Mật khẩu từ 8–128 ký tự.' });
        let user = db.accounts.find(item => item.username === username);
        if (route === 'register') {
          if (user) return reply(409, { error: 'Tên đăng nhập đã được sử dụng.' });
          const nickname = String(body.nickname ?? '').trim();
          if (!nickname || nickname.length > 30) return reply(400, { error: 'Biệt danh cần từ 1–30 ký tự.' });
          const salt = randomBytes(16).toString('hex');
          user = { id: randomUUID(), username, nickname, avatar: AVATARS.includes(body.avatar) ? body.avatar : '🙂', createdAt: now().toISOString(), salt, passwordHash: scryptSync(password, salt, 64).toString('hex') };
          db.accounts.push(user);
        } else {
          const derived = scryptSync(password, user?.salt ?? 'missing-account', 64);
          if (!user || !timingSafeEqual(derived, Buffer.from(user.passwordHash, 'hex'))) return reply(401, { error: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' });
        }
        if (user.disabled) return reply(403, { error: 'Tài khoản đã bị khóa. Hãy liên hệ quản trị viên.' });
        const newToken = randomBytes(32).toString('hex');
        db.sessions = db.sessions.filter(item => item.expires > now().getTime());
        db.sessions.push({ token: hash(newToken), accountId: user.id, expires: now().getTime() + 30 * 86400_000 });
        await persist();
        return reply(200, { user: publicUser(user) }, { 'Set-Cookie': `accountSession=${newToken}; HttpOnly; SameSite=Strict; Path=/api/account; Max-Age=2592000${secureCookies || req.socket?.encrypted ? '; Secure' : ''}` });
      }
      if (!account) return reply(401, { error: 'Hãy đăng nhập.' });
      if (route === 'logout') {
        db.sessions = db.sessions.filter(item => item !== session); await persist();
        return reply(200, { ok: true }, { 'Set-Cookie': 'accountSession=; HttpOnly; SameSite=Strict; Path=/api/account; Max-Age=0' });
      }
      return reply(404, { error: 'Không tìm thấy.' });
    } catch (error) { return reply(error.code === 'CONFLICT' ? 409 : 503, { error: 'Chưa lưu được dữ liệu tài khoản. Hãy thử lại.' }); }
  }
  let queue = Promise.resolve();
  return (req, res) => {
    const task = queue.then(() => handler(req, res));
    queue = task.catch(() => {});
    return task;
  };
}

export function createGameServer(options = {}) {
  const service = createAccountService(options);
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return service(req, res);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    let relative;
    try { relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname === '/admin' ? '/admin.html' : url.pathname); }
    catch { res.writeHead(400); return res.end(); }
    if (relative.split(/[\\/]/).some(part => part.startsWith('.')) || !/^\/(?:index\.html|admin\.html|manifest\.json|(?:js|css|img|music|audio|fonts|sounds|assets)\/)/.test(relative)) { res.writeHead(404); return res.end(); }
    const file = path.resolve(ROOT, '.' + relative);
    if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end(); }
    try {
      const data = fs.readFileSync(file);
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.woff2': 'font/woff2' };
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404); res.end(); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 8080);
  const cloud = (process.env.ACCOUNT_STORAGE ?? process.env.RANKING_STORAGE) === 'supabase';
  if (process.env.RENDER && !cloud) throw new Error('Render cần ACCOUNT_STORAGE=supabase để không mất dữ liệu.');
  const options = cloud ? { dataFile: null, storage: createSupabaseStorage({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SECRET_KEY }), secureCookies: process.env.COOKIE_SECURE === 'true' } : {};
  // Không nhận người chơi trước khi xác nhận schema và khóa Supabase hoạt động.
  if (cloud) await options.storage.load();
  options.adminAccountIds = (process.env.ADMIN_ACCOUNT_IDS ?? '').split(',').map(id => id.trim()).filter(Boolean);
  const host = process.env.RENDER || cloud ? '0.0.0.0' : '127.0.0.1';
  const server = createGameServer(options);
  server.requestTimeout = 15000;
  server.listen(port, host, () => console.log(`Life Again đang chạy tại cổng ${port} · Dữ liệu ${cloud ? 'Supabase' : 'cục bộ'}`));
}
