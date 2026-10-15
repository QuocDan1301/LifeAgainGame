import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'game.test') return route.abort();
    if (url.pathname === '/notice-check') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/buttons.css">' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/notice-check');
  await page.evaluate(async () => {
    const parsed = new DOMParser().parseFromString(await (await fetch('/index.html')).text(), 'text/html');
    parsed.querySelectorAll('script').forEach(el => el.remove());
    parsed.querySelectorAll('[src]').forEach(el => el.removeAttribute('src'));
    document.body.insertAdjacentHTML('beforeend', parsed.body.innerHTML);
    const { createInitialState } = await import('/js/core/state.js');
    const { initGames } = await import('/js/leisure/games.js');
    window.noticeState = createInitialState();
    Object.assign(noticeState.player, { age: 25, money: 10000000, isAlive: true });
    initGames(noticeState, { renderMoney() {}, renderLogEntry() {} });
  });
  const open = () => page.evaluate(() => document.getElementById('activity-games').click());
  await open();
  assert.equal(await page.locator('#games-notice-dialog').evaluate(el => el.open), true);
  assert.equal(await page.locator('#games-dialog').evaluate(el => el.open), false);
  assert.equal(await page.evaluate(() => noticeState.player.money), 10000000);
  assert.match(await page.locator('#games-notice-content').textContent(), /không quảng bá hay khuyến khích cờ bạc/);
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#games-notice-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), name + ': no horizontal overflow');
    await page.locator('#confirm-games-notice').scrollIntoViewIfNeeded();
    await page.locator('#games-notice-dialog').screenshot({ path: `output/games-notice-${name}.png` });
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#games-notice-dialog').evaluate(el => el.open), false);
  assert.equal(await page.locator('#games-dialog').evaluate(el => el.open), false);
  assert.equal(await page.locator('#activities-dialog').evaluate(el => el.open), true);
  await open();
  await page.locator('#close-games-notice').click();
  assert.equal(await page.locator('#activities-dialog').evaluate(el => el.open), true);
  await open();
  await page.locator('#confirm-games-notice').click();
  assert.equal(await page.locator('#games-dialog').evaluate(el => el.open), true);
  assert.equal(await page.locator('#games-notice-dialog').evaluate(el => el.open), false);
  assert.ok(await page.locator('.game-pick').count() > 0);
  await page.locator('#close-games').click();
  await open();
  assert.equal(await page.locator('#games-notice-dialog').evaluate(el => el.open), true, 'notice returns on the next visit');
  await page.locator('#close-games-notice').click();
  await page.evaluate(() => { noticeState.player.isAlive = false; document.getElementById('activity-games').click(); });
  assert.equal(await page.locator('#games-notice-dialog').evaluate(el => el.open), false, 'dead characters cannot open games');
  console.log('PASS games notice: confirmation required each entry, close/Escape, no money changes, dead-character guard, 320/390/1280px layouts.');
  await page.goto('https://game.test/scripts/check-games.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('games-check-result').textContent), { timeout: 120000 });
  const result = await page.locator('#games-check-result').textContent();
  assert.ok(result.startsWith('PASS'), result);
  console.log(result);
} finally { await browser.close(); }
