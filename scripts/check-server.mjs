import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGameServer } from '../server/game-server.mjs';

const server = createGameServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  assert.deepEqual(await (await fetch(base + '/health')).json(), { ok: true });
  const html = await (await fetch(base + '/')).text();
  assert.match(html, /<html/i);
  assert.match(html, /id="hero-title"/, "the website root is the introduction page");
  for (const route of ["/caigame.html", "/chuyenmay.html"]) {
    assert.equal((await fetch(base + route)).status, 200, route);
  }
  const gamePage = await (await fetch(base + "/choi")).text();
  assert.match(gamePage, /id="lobby-screen"/);
  assert.match(gamePage, /js\/entry\.js/);
  assert.doesNotMatch(html, /account\.css|account-dialog/);
  const boot = await (await fetch(base + '/js/boot.js')).text();
  assert.doesNotMatch(boot, /initAccountUI|account-ui/);
  for (const route of ['/admin', '/admin.html', '/api/account/status', '/api/account/google', '/api/account/progress', '/js/account/account-ui.js', '/css/account.css', '/.env', '/server/game-server.mjs', '/.ranking-data/rankings.json', '/css/%2e%2e/server/game-server.mjs']) {
    assert.equal((await fetch(base + route)).status, 404, route);
  }
  for (const route of ['/api/account/login', '/api/account/register', '/api/account/logout']) {
    assert.equal((await fetch(base + route, { method: 'POST' })).status, 405, route);
  }
  assert.equal((await fetch(base + '/css/style.css', { method: 'HEAD' })).status, 200);
  for (const route of ['/', '/js/boot.js', '/js/core/offline.js', '/css/style.css', '/manifest.json']) {
    assert.equal((await fetch(base + route)).headers.get('cache-control'), 'no-cache', route + ' must revalidate after deployment');
  }
  assert.equal((await fetch(base + '/css/%ZZ')).status, 400);
   
  const intro = await fetch(base + '/gioi-thieu');
  assert.equal(intro.status, 200);
  assert.match(await intro.text(), /id="hero-title"/);
  const post = (route, body) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const pack = { app: 'life-again', v: 1, data: { lifeAgainSave: '{"player":{"name":"An","age":3}}', lifeAgainTickets: '{"tickets":2}' } };
  const created = await post('/api/transfer', pack);
  assert.equal(created.status, 201);
  const { code, expiresIn } = await created.json();
  assert.match(code, /^[A-Z2-9]{6}$/);
  assert.equal(expiresIn, 600);
  const claimed = await post('/api/transfer/claim', { code: code.toLowerCase().replace(/(...)/, '$1-') });
  assert.equal(claimed.status, 200);
  assert.deepEqual((await claimed.json()).data, pack.data);
  assert.equal((await post('/api/transfer/claim', { code })).status, 404, 'mã chỉ dùng một lần');
  assert.equal((await post('/api/transfer/claim', { code: 'ABC' })).status, 404);
  assert.equal((await post('/api/transfer', { app: 'life-again', v: 1, data: { evil: 'x' } })).status, 400, 'khóa lạ bị từ chối');
  assert.equal((await post('/api/transfer', { app: 'other', v: 1, data: pack.data })).status, 400);
  assert.equal((await fetch(base + '/api/transfer')).status, 405);
   
  const preflight = await fetch(base + '/api/transfer', { method: 'OPTIONS', headers: { Origin: 'https://quocdan1301.github.io', 'Access-Control-Request-Method': 'POST' } });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://quocdan1301.github.io');
  const foreign = await fetch(base + '/api/transfer', { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body: JSON.stringify(pack) });
  assert.equal(foreign.headers.get('access-control-allow-origin'), null);
  const huge = await fetch(base + '/api/transfer', { method: 'POST', body: 'x'.repeat(4 * 1024 * 1024 + 10) }).catch(() => null);
  assert.ok(!huge || huge.status === 413, 'gói quá lớn bị chặn');  console.log('PASS server: game assets and health; intro page; transfer codes (one-time, validated, CORS for old home); login/admin removed; private files blocked.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
 
const dist = new URL('../dist/', import.meta.url);
if (fs.existsSync(new URL('index.html', dist))) {
  const distServer = createGameServer({ root: fs.realpathSync(dist) });
  await new Promise(resolve => distServer.listen(0, '127.0.0.1', resolve));
  const distBase = `http://127.0.0.1:${distServer.address().port}`;
  try {
    const boot = await (await fetch(distBase + '/js/boot.js')).text();
    assert.match(boot, /Mọi quyền được bảo lưu/);
    assert.doesNotMatch(boot, /\/\/ |Bến xe chỉ tải/);
    assert.doesNotMatch(await (await fetch(distBase + '/')).text(), /<!--/);
    assert.equal((await fetch(distBase + '/js/img/events/openmoji-catalog.json')).status, 404);
    const sw = await (await fetch(distBase + '/sw.js')).text();
    assert.match(sw, /"\.\/js\/main\.js"/);
    assert.match(sw, /"\.\/gioi-thieu\.html"/);
    assert.doesNotMatch(sw, /__PRECACHE__|openmoji\/color/);
    console.log('PASS dist: JS đã nén, có bản quyền, không lộ chú thích; service worker tải sẵn game.');
  } finally {
    await new Promise(resolve => distServer.close(resolve));
  }
}
