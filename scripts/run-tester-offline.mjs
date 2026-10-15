import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve('dist');
const originalWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const version = originalWorker.match(/["']([a-f0-9]{12})["']/)?.[1];
assert.ok(version, 'build contains a service worker version');
let revision = 1;
const types = { '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    let body = fs.readFileSync(file);
    if (url.pathname === '/sw.js' && revision > 1) body = originalWorker.replaceAll(version, revision === 2 ? 'aabbccddeeff' : 'aabbccddee33');
    if (url.pathname === '/js/boot.js') body = body.toString('utf8') + '\nglobalThis.TESTER_BUILD_REVISION=' + revision + ';';
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://localhost:${server.address().port}`;
const results = [];
const trace = [];
let browser;
let page;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND, MAP cdnjs.cloudflare.com ~NOTFOUND'] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  // Exercise native service-worker networking without request interception.
  // External font hosts are disabled by the launch-time resolver rules above.
  await context.addInitScript(() => {
    const note = (type, details) => console.debug('TESTER_SW ' + JSON.stringify({ type, details, ready: document.readyState }));
    const nativeRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    navigator.serviceWorker.register = (...args) => nativeRegister(...args).then(reg => {
      note('register-resolved', { url: args[0], scope: reg.scope, active: reg.active?.scriptURL, waiting: reg.waiting?.state, lobbyHidden: document.getElementById('lobby-screen')?.hidden,
        dialogs: [...document.querySelectorAll('dialog[open]')].map(el => el.id) });
      return reg;
    }, error => { note('register-rejected', error.message); throw error; });
    const post = ServiceWorker.prototype.postMessage;
    ServiceWorker.prototype.postMessage = function(...args) { note('message', args[0]); return post.apply(this, args); };
    window.addEventListener('load', () => note('load', {}));
  });
  page = await context.newPage();
  async function waitForWorker(predicate, timeout = 30000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await page.evaluate(predicate)) return;
      await page.waitForTimeout(100);
    }
    throw new Error('Timed out waiting for the service-worker lifecycle');
  }
  page.on('console', message => { if (message.text().startsWith('TESTER_SW ')) trace.push(message.text()); });
  await page.goto(base + '/');
  await page.evaluate(async () => {
    const { createInitialState } = await import('/js/core/state.js');
    const { achievements } = await import('/js/achievements/achievements-data.js');
    localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.map(item => [item.id, true]))));
    localStorage.setItem('lifeAgainAchievementQueue', '[]');
    const s = createInitialState();
    Object.assign(s.player, { age: 18, money: 12345678, health: 80, happiness: 80, intelligence: 80, appearance: 80, studyBlock: 'A00' });
    s.logs = [{ age: 18, content: 'Offline audit fixture' }];
    localStorage.setItem('lifeAgainSave', JSON.stringify(s));
  });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 60000 });
  await page.reload();
  await page.locator('#continue-button').waitFor({ state: 'visible' });
  await context.setOffline(true);
  await page.reload();
  await page.locator('#continue-button').click();
  await page.locator('#game-screen').waitFor({ state: 'visible', timeout: 30000 });
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.money), 12345678);
  results.push('PASS actual service worker: cached game opens offline and preserves the save.');
  await context.setOffline(false);
  revision = 2;
  await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
  await waitForWorker(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting), 60000);
  assert.equal(await page.evaluate(() => TESTER_BUILD_REVISION), 1, 'active game does not unexpectedly reload');
  results.push('PASS new version waits while the player is in the game.');
  await page.reload();
  const updateButton = page.locator('#lobby-screen [data-game-update]');
  await updateButton.waitFor({ state: 'visible' });
  assert.equal(await updateButton.textContent(), '↻ Cập nhật bản mới');
  await page.setViewportSize({ width: 320, height: 568 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: 'output/tester-audit/update-available-small.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(async () => {
    localStorage.setItem('tester-preserve', 'tickets-and-achievements');
    await (await caches.open('another-app-cache')).put('/sentinel', new Response('keep'));
  });
  await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), updateButton.click()]);
  await page.waitForFunction(() => globalThis.TESTER_BUILD_REVISION === 2, null, { timeout: 30000 });
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.money), 12345678);
  assert.equal(await page.evaluate(() => localStorage.getItem('tester-preserve')), 'tickets-and-achievements');
  assert.equal(await page.evaluate(async () => (await caches.keys()).includes('another-app-cache')), true);
  results.push('PASS update button loads the new release, preserves saved progress/storage, and keeps other app caches.');
  // The boot marker is set before window.load and the activation lifecycle finish.
  // Wait for both before issuing another navigation, which would race the app reload.
  await page.waitForLoadState('load');
  await waitForWorker(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration?.active?.state === 'activated' && navigator.serviceWorker.controller === registration.active && !registration.waiting && !registration.installing;
  });
  await page.locator('#game-update-toast').waitFor({ state: 'visible' });
  assert.match(await page.locator('#game-update-toast').textContent(), /Đã cập nhật/);
  assert.equal(await updateButton.isVisible(), false);
  await page.screenshot({ path: 'output/tester-audit/update-success-mobile.png' });
  await page.locator('#game-update-toast').waitFor({ state: 'hidden', timeout: 5000 });
  results.push('PASS update controls are hidden when current; success message appears after activation and disappears automatically.');
  results.push(JSON.stringify(await page.evaluate(async () => {
    const rows = [];
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      rows.push({ key, size: (await cache.keys()).length, shell: Boolean(await cache.match(location.origin + '/')) });
    }
    const reg = await navigator.serviceWorker.getRegistration();
    return { beforeOffline: rows, revision: localStorage.getItem('lifeAgainWorkerRevision'), activeURL: reg?.active?.scriptURL, controllerURL: navigator.serviceWorker.controller?.scriptURL };
  })));
  await context.setOffline(true);
  await page.reload();
  await page.waitForFunction(() => globalThis.TESTER_BUILD_REVISION === 2, null, { timeout: 30000 });
  results.push('PASS the new version also opens offline after updating.');
  await context.setOffline(false);
  await page.locator('#continue-button').click();
  await page.locator('#game-screen').waitFor({ state: 'visible' });
  const liveMoney = await page.evaluate(async () => {
    const { state } = await import('/js/core/state.js');
    state.player.money += 37;
    return state.player.money;
  });
  await page.locator('#menu-button').click();
  const menuUpdate = page.locator('#menu-panel [data-game-update]');
  assert.equal(await menuUpdate.isVisible(), false, 'settings has no update row when current');
  revision = 3;
  await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
  await waitForWorker(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
  await menuUpdate.waitFor({ state: 'visible' });
  assert.equal(await menuUpdate.isEnabled(), true);
  await page.screenshot({ path: 'output/tester-audit/update-menu-mobile.png' });
  await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), menuUpdate.click()]);
  await page.locator('#continue-button').waitFor({ state: 'visible' });
  await page.waitForFunction(expected => JSON.parse(localStorage.getItem('lifeAgainSave')).player.money === expected, liveMoney);
  results.push('PASS settings update saves the live game before reloading, including progress not yet written to storage.');
  await context.close();
} catch (error) {
  results.push('FAIL ' + error.stack);
  const diagnostic = await page?.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const keys = await caches.keys();
    const cached = [];
    for (const key of keys) {
      const cache = await caches.open(key);
      const boot = await cache.match(new URL('/js/boot.js', location.href).href);
      if (boot) cached.push({ key, marker: (await boot.text()).slice(-100) });
    }
    return { marker: globalThis.TESTER_BUILD_REVISION, active: registration?.active?.state,
      waiting: registration?.waiting?.state, installing: registration?.installing?.state,
      controlled: Boolean(navigator.serviceWorker.controller), offline: document.documentElement.hasAttribute('data-offline'),
      lobbyHidden: document.getElementById('lobby-screen')?.hidden,
      dialogs: [...document.querySelectorAll('dialog[open]')].map(el => ({ id: el.id, text: el.textContent.slice(0, 1000) })),
      keys, cached };
  }).catch(() => null);
  results.push(JSON.stringify({ diagnostic, trace }));
  async function bounded(promise) {
    let timer;
    try {
      return await Promise.race([promise, new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Worker diagnostic timed out after 5 seconds')), 5000);
      })]);
    } finally { clearTimeout(timer); }
  }
  const workers = browser.contexts()[0].serviceWorkers();
  const workerDiagnostics = [];
  for (const worker of workers) {
    try {
      const workerVersion = await bounded(worker.evaluate('VERSION'));
      workerDiagnostics.push({ version: workerVersion });
      if (workerVersion === 'aabbccddeeff') {
        await bounded(worker.evaluate(() => self.skipWaiting()));
      }
    } catch (workerError) { workerDiagnostics.push({ error: workerError.message }); }
  }
  try { await page.waitForFunction(() => globalThis.TESTER_BUILD_REVISION === 2, null, { timeout: 10000 }); workerDiagnostics.push({ directActivationWorked: true }); }
  catch { workerDiagnostics.push({ directActivationWorked: false }); }
  results.push(JSON.stringify({ workerDiagnostics }));
  process.exitCode = 1;
}
finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
  fs.mkdirSync('output/tester-audit', { recursive: true });
  fs.writeFileSync('output/tester-audit/offline.json', JSON.stringify(results, null, 2));
  results.forEach(line => console.log(line));
}
