import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import { Readable } from 'node:stream';
import path from 'node:path';
import { createAccountService, createGameServer } from '../server/account-server.mjs';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'life-account-test-'));
const dataFile = path.join(directory, 'accounts.json');
const server = createGameServer({ dataFile });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
async function call(route, body, cookie = '') {
  const response = await fetch(base + route, { headers: { 'Content-Type': 'application/json', cookie }, ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}) });
  return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0], value: await response.json() };
}
try {
  const credentials = { username: 'player', nickname: '<img src=x> An', password: 'test-password' };
  assert.equal((await call('/api/account/status')).value.user, null);
  assert.equal((await call('/api/account/register', { ...credentials, password: 'short' })).status, 400);
  const registered = await call('/api/account/register', credentials);
  assert.equal(registered.status, 200);
  assert.equal(registered.value.user.nickname, credentials.nickname);
  assert.ok(!JSON.stringify(registered.value).includes('passwordHash'));
  assert.equal((await call('/api/account/register', credentials)).status, 409);
  assert.equal((await call('/api/account/login', { ...credentials, password: 'wrong-pass' })).status, 401);
  assert.equal((await call('/api/account/status', null, registered.cookie)).value.user.id, registered.value.user.id);
  for (const route of ['board', 'history', 'start', 'finish', 'admin/runs', 'admin/run-state']) {
    assert.equal((await call('/api/ranking/' + route, {}, registered.cookie)).status, 404);
    assert.equal((await call('/api/account/' + route, {}, registered.cookie)).status, route.startsWith('admin/') ? 403 : 404);
  }
  assert.equal((await call('/api/account/logout', {}, registered.cookie)).status, 200);
  assert.equal((await call('/api/account/status', null, registered.cookie)).value.user, null);
  assert.equal((await call('/api/account/login', credentials)).status, 200);
  const saved = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  assert.equal(saved.accounts.length, 1);
  assert.equal(saved.runs, undefined);
  assert.equal(saved.starts, undefined);
  // Old local data retains credentials while score data is dropped on save.
  fs.writeFileSync(dataFile, JSON.stringify({ ...saved, starts: [{ id: 'old' }], runs: [{ id: 'old' }] }));
  const restarted = createAccountService({ dataFile });
  const req = Readable.from([JSON.stringify(credentials)]);
  Object.assign(req, { url: '/api/account/login', method: 'POST', headers: { 'content-type': 'application/json' }, socket: { remoteAddress: 'test' } });
  let status;
  await restarted(req, { writeHead(code) { status = code; }, end() {} });
  assert.equal(status, 200);
  const migrated = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  assert.equal(migrated.accounts[0].id, registered.value.user.id);
  assert.equal(migrated.runs, undefined);
  assert.equal(migrated.starts, undefined);
  for (const route of ['/js/account/account-ui.js', '/css/account.css', '/']) {
    assert.equal((await fetch(base + route)).status, 200);
  }
  for (const route of ['/js/ranking/scoring.js', '/js/ranking/ranking-ui.js', '/css/ranking.css', '/.env', '/server/account-server.mjs']) {
    assert.equal((await fetch(base + route)).status, 404);
  }
  console.log('PASS account: registration; validation; duplicate rejection; login; session; logout; persistence; removed APIs and assets');
} finally {
  await new Promise(resolve => server.close(resolve));
  if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);
  fs.rmdirSync(directory);
}
