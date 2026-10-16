import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'game.test') return route.abort();
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try {
      const contentType = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml' }[path.extname(file)] ?? 'application/octet-stream';
      await route.fulfill({ body: fs.readFileSync(file), contentType });
    } catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/scripts/check-shop.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('shop-check-result').textContent), null, { timeout: 30000 });
  const result = await page.locator('#shop-check-result').textContent();
  assert.ok(result.startsWith('PASS'), result);
  console.log(result);
  for (const file of ['style', 'lobby', 'buttons', 'polish']) await page.addStyleTag({ url: `/css/${file}.css` });
  await page.evaluate(async () => {
    document.getElementById('shop-check-result').remove();
    document.getElementById('app-loader')?.remove();
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    const { state } = await import('/js/core/state.js');
    state.player.money = 100_000_000;
    document.getElementById('activities').click();
    document.getElementById('activity-pets').click();
    document.querySelector('.shop-group[data-group="poultry"]').click();
  });
  assert.match(await page.locator('.shop-item').first().textContent(), /90%.*5 điểm %.*50%/s);
  assert.match(await page.locator('.shop-item').first().textContent(), /khoảng 4 năm/);
  fs.mkdirSync('output', { recursive: true });
  for (const [width, height] of [[320, 568], [390, 844], [1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#shop-dialog').evaluate(node => node.scrollWidth <= node.clientWidth), `${width}: shop fits`);
    await page.locator('#shop-dialog').screenshot({ path: `output/shop-pet-balance-${width}.png`, animations: 'disabled' });
  }
  assert.deepEqual(errors, []);
  console.log('PASS pet economy previews and 320/390/1280px shop layouts.');
} finally { await browser.close(); }
