import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url()); if (url.hostname !== 'game.test') return route.abort();
    const file = path.resolve('.' + decodeURIComponent(url.pathname)); if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/scripts/check-game-center-progress.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('result').textContent));
  const result = await page.locator('#result').textContent(); assert.ok(result.startsWith('PASS'), result);
  fs.mkdirSync('output', { recursive: true });
  for (const [label, width, height] of [['small', 320, 740], ['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.gameCenterProgressTest.open());
    assert.ok(await page.locator('#game-center-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), label + ': hub overflow');
    await page.locator('#game-center-dialog').evaluate(el => { el.scrollTop = 0; });
    await page.locator('#game-center-dialog').screenshot({ path: `output/game-center-${label}.png` });
    await page.getByRole('button', { name: '📖 Album quà', exact: true }).click();
    assert.ok(await page.locator('.gc-album-grid').evaluate(el => el.scrollWidth <= el.clientWidth), label + ': album overflow');
    assert.ok(await page.locator('#game-center-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), label + ': dialog overflow');
    await page.locator('#game-center-dialog').evaluate(el => { el.scrollTop = 0; });
    if (label === 'mobile') await page.locator('#game-center-dialog').screenshot({ path: 'output/game-center-album.png' });
  }
  await page.evaluate(() => window.gameCenterProgressTest.open());
  await page.clock.install();
  await page.locator('[data-game=basketball]').click();
  await page.locator('.gc-start').click();
  await page.clock.runFor(31_000);
  await page.locator('.gc-result').waitFor();
  assert.equal(await page.evaluate(() => window.gameCenterProgressTest.state.player.arcade.progress.records.basketball.plays), 2, 'Actual timed game settlement advances personal record');
  assert.equal(await page.evaluate(() => window.gameCenterProgressTest.state.player.arcade.progress.annual.plays), 1, 'Actual timed game advances annual mission');
  assert.deepEqual(errors, []); console.log(result + '; 320/390/1280px layouts; no page errors');
} finally { await browser.close(); }
