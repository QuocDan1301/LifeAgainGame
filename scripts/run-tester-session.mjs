import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'game.test') return route.abort();
    const file = path.resolve('.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    const types = { '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: types[path.extname(file)] ?? 'application/octet-stream' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  const first = await context.newPage();
  await first.goto('https://game.test/index.html');
  await first.evaluate(async () => {
    const { createInitialState } = await import('/js/core/state.js');
    const { achievements } = await import('/js/achievements/achievements-data.js');
    const s = createInitialState();
    Object.assign(s.player, { age: 18, money: 10000000, health: 80, happiness: 80, intelligence: 80, appearance: 80, studyBlock: 'A00' });
    s.logs = [{ age: 18, content: 'Isolated tester save' }];
    localStorage.setItem('lifeAgainSave', JSON.stringify(s));
    localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.map(a => [a.id, true]))));
    localStorage.setItem('lifeAgainAchievementQueue', '[]');
  });
  await first.reload();
  await first.locator('#continue-button').click();
  await first.locator('#game-screen').waitFor({ state: 'visible' });
  await first.locator('#app-loader').waitFor({ state: 'hidden' });
  const second = await context.newPage();
  await second.goto('https://game.test/index.html');
  await second.locator('#continue-button').click();
  await second.waitForFunction(() => document.getElementById('lobby-message').textContent.includes('tab khác'));
  results.push('PASS two real browser tabs: concurrent play is blocked.');
  await first.evaluate(async () => {
    window.restoreStorageWrite = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'lifeAgainSave') throw new DOMException('Full', 'QuotaExceededError');
      return window.restoreStorageWrite.call(this, key, value);
    };
    const { state } = await import('/js/core/state.js');
    const { saveGame } = await import('/js/core/save-store.js');
    state.player.money = 12345678;
    try { saveGame(state); } catch (error) { window.expectedSaveError = error.message; }
  });
  await first.locator('#save-error-dialog').waitFor({ state: 'visible' });
  await first.evaluate(() => { Storage.prototype.setItem = window.restoreStorageWrite; });
  await first.locator('#save-error-dialog button').click();
  await first.waitForFunction(() => !document.getElementById('save-error-dialog'));
  assert.equal(await first.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.money), 12345678);
  results.push('PASS full storage: visible error, retry, exact money saved.');
  await first.locator('#continue-button').click();
  await first.locator('#game-screen').waitFor({ state: 'visible' });
  await first.locator('#app-loader').waitFor({ state: 'hidden' });
  await first.locator('#activities').click();
  await first.locator('#activity-games').click();
  for (let index = 0; index < 8; index++) {
    await first.keyboard.press('Tab');
    const focus = await first.evaluate(() => ({ dialog: document.activeElement.closest('dialog')?.id, tag: document.activeElement.tagName }));
    if (focus.dialog) assert.equal(focus.dialog, 'games-notice-dialog');
    else assert.equal(focus.tag, 'BODY', 'Tab may reach browser chrome, but never background game controls');
  }
  await first.keyboard.press('Escape');
  assert.equal(await first.locator('#activities-dialog').evaluate(el => el.open), true);
  results.push('PASS keyboard: notice traps focus and Escape returns to activities.');
  await first.close();
  await second.locator('#continue-button').click();
  await second.locator('#game-screen').waitFor({ state: 'visible' });
  assert.equal(await second.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.money), 12345678);
  results.push('PASS closing active tab releases the lock; remaining tab resumes latest save.');
  await context.close();
} catch (error) {
  results.push('FAIL ' + error.stack);
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.mkdirSync('output/tester-audit', { recursive: true });
  fs.writeFileSync('output/tester-audit/session.json', JSON.stringify(results, null, 2));
  results.forEach(line => console.log(line));
}
