import assert from 'node:assert/strict';
import { createGameServer } from '../server/game-server.mjs';

const server = createGameServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  assert.deepEqual(await (await fetch(base + '/health')).json(), { ok: true });
  const html = await (await fetch(base + '/')).text();
  assert.match(html, /<html/i);
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
  assert.equal((await fetch(base + '/css/%ZZ')).status, 400);
  console.log('PASS server: game assets and health; login/admin removed; private files blocked.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
