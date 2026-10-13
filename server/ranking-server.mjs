import http from 'node:http';
import { createSupabaseStorage } from './supabase-storage.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { calculateLifeScore, buildLeaderboard, seasonId } from '../js/ranking/scoring.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = token => createHash('sha256').update(token).digest('hex');
const publicUser = account => account ? { id: account.id, nickname: account.nickname, avatar: account.avatar } : null;
const AVATARS = ['🙂', '😊', '😎', '🦊', '🐼', '🐱', '🦁', '🐸'];
export function createRankingService({ dataFile = path.join(ROOT, '.ranking-data', 'rankings.json'), now = () => new Date(), storage = null, secureCookies = false } = {}) {
  let db = dataFile && fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : { accounts: [], sessions: [], starts: [], runs: [] };
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
      if (storage) { const loaded = await storage.load(); db = loaded.payload; revision = loaded.revision; committed = structuredClone(db); }
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/ranking/')) return reply(404, { error: 'Không tìm thấy.' });
      if (!['GET', 'POST'].includes(req.method)) return reply(405, { error: 'Thao tác không được hỗ trợ.' });
      if (req.method === 'POST' && req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return reply(403, { error: 'Yêu cầu khác nguồn bị từ chối.' });
      if (req.method === 'POST' && !String(req.headers['content-type'] ?? '').startsWith('application/json')) return reply(415, { error: 'Dữ liệu cần có định dạng JSON.' });
      const token = /(?:^|;\s*)rankingSession=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie ?? '')?.[1];
      const session = token && db.sessions.find(item => item.token === hash(token) && item.expires > now().getTime());
      const account = session && db.accounts.find(item => item.id === session.accountId);
      const route = url.pathname.slice('/api/ranking/'.length);
      if (req.method === 'GET' && route === 'status') return reply(200, { available: true, user: publicUser(account), season: seasonId(now()), beta: true });
      if (req.method === 'GET' && route === 'board') {
        const scope = url.searchParams.get('scope') ?? seasonId(now());
        if (scope !== 'all' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(scope)) return reply(400, { error: 'Mùa không hợp lệ.' });
        const board = buildLeaderboard(db.accounts, db.runs, scope);
        return reply(200, { entries: board.slice(0, 100), mine: board.find(item => item.id === account?.id) ?? null, scope });
      }
      if (req.method === 'GET' && route === 'history') {
        if (!account) return reply(401, { error: 'Hãy đăng nhập.' });
        return reply(200, { runs: db.runs.filter(run => run.accountId === account.id).map(({ snapshot, ...run }) => run) });
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
          user = { id: randomUUID(), username, nickname, avatar: AVATARS.includes(body.avatar) ? body.avatar : '🙂', salt, passwordHash: scryptSync(password, salt, 64).toString('hex') };
          db.accounts.push(user);
        } else {
          const derived = scryptSync(password, user?.salt ?? 'missing-account', 64);
          if (!user || !timingSafeEqual(derived, Buffer.from(user.passwordHash, 'hex'))) return reply(401, { error: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' });
        }
        const newToken = randomBytes(32).toString('hex');
        db.sessions = db.sessions.filter(item => item.expires > now().getTime());
        db.sessions.push({ token: hash(newToken), accountId: user.id, expires: now().getTime() + 30 * 86400_000 });
        await persist();
        return reply(200, { user: publicUser(user) }, { 'Set-Cookie': `rankingSession=${newToken}; HttpOnly; SameSite=Strict; Path=/api/ranking; Max-Age=2592000${secureCookies || req.socket?.encrypted ? '; Secure' : ''}` });
      }
      if (!account) return reply(401, { error: 'Hãy đăng nhập.' });
      if (route === 'logout') {
        db.sessions = db.sessions.filter(item => item !== session); await persist();
        return reply(200, { ok: true }, { 'Set-Cookie': 'rankingSession=; HttpOnly; SameSite=Strict; Path=/api/ranking; Max-Age=0' });
      }
      if (route === 'start') {
        if (typeof body.localId !== 'string' || !/^[a-f0-9-]{36}$/.test(body.localId)) return reply(400, { error: 'Mã cuộc đời không hợp lệ.' });
        let start = db.starts.find(item => item.localId === body.localId);
        if (start && start.accountId !== account.id) return reply(409, { error: 'Cuộc đời thuộc người chơi khác.' });
        if (!start) { start = { id: randomUUID(), localId: body.localId, accountId: account.id, startedAt: now().toISOString() }; db.starts.push(start); await persist(); }
        return reply(200, { id: start.id, accountId: account.id });
      }
      if (route === 'finish') {
        const start = db.starts.find(item => item.id === body.id && item.accountId === account.id);
        if (!start) return reply(403, { error: 'Cuộc đời chưa được đăng ký cho tài khoản này.' });
        const existing = db.runs.find(item => item.id === start.id);
        if (existing) return reply(200, { run: existing, duplicate: true });
        const snapshot = body.snapshot;
        if (!snapshot || !Array.isArray(snapshot.achievements) || snapshot.achievements.length > 500 ||
            !Array.isArray(snapshot.assets) || snapshot.assets.length > 500 || !Array.isArray(snapshot.debts) || snapshot.debts.length > 100 ||
            !Array.isArray(snapshot.workYears) || snapshot.workYears.length > 106 || !Array.isArray(snapshot.relationshipYears) || snapshot.relationshipYears.length > 106 ||
            !Number.isFinite(snapshot.money) || Math.abs(snapshot.money) > 1e15) return reply(400, { error: 'Dữ liệu tổng kết không hợp lệ.' });
        let score;
        try { score = calculateLifeScore(snapshot); } catch (error) { return reply(400, { error: error.message }); }
        if (!score.eligible) return reply(400, { error: 'Cần có dữ liệu hạnh phúc từ tuổi 0 đến hết cuộc đời để tham gia xếp hạng.' });
        const run = { id: start.id, accountId: account.id, season: seasonId(now()), completedAt: now().toISOString(),
          name: String(snapshot.name ?? '').slice(0, 40), age: snapshot.age, path: String(snapshot.path ?? '').slice(0, 60), score };
        db.runs.push(run); await persist();
        return reply(200, { run });
      }
      return reply(404, { error: 'Không tìm thấy.' });
    } catch (error) { return reply(error.code === 'CONFLICT' ? 409 : 503, { error: 'Chưa lưu được dữ liệu xếp hạng. Hãy thử lại.' }); }
  }
  let queue = Promise.resolve();
  return (req, res) => {
    const task = queue.then(() => handler(req, res));
    queue = task.catch(() => {});
    return task;
  };
}

export function createGameServer(options = {}) {
  const service = createRankingService(options);
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return service(req, res);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
    let relative;
    try { relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname); }
    catch { res.writeHead(400); return res.end(); }
    if (relative.split(/[\\/]/).some(part => part.startsWith('.')) || !/^\/(?:index\.html|manifest\.json|(?:js|css|img|music|audio|fonts|sounds|assets)\/)/.test(relative)) { res.writeHead(404); return res.end(); }
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
  const cloud = process.env.RANKING_STORAGE === 'supabase';
  if (process.env.RENDER && !cloud) throw new Error('Render cần RANKING_STORAGE=supabase để không mất dữ liệu.');
  const options = cloud ? { dataFile: null, storage: createSupabaseStorage({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SECRET_KEY }), secureCookies: process.env.COOKIE_SECURE === 'true' } : {};
  // Không nhận người chơi trước khi xác nhận schema và khóa Supabase hoạt động.
  if (cloud) await options.storage.load();
  const host = process.env.RENDER || cloud ? '0.0.0.0' : '127.0.0.1';
  const server = createGameServer(options);
  server.requestTimeout = 15000;
  server.listen(port, host, () => console.log(`Life Again đang chạy tại cổng ${port} · Dữ liệu ${cloud ? 'Supabase' : 'cục bộ'}`));
}
