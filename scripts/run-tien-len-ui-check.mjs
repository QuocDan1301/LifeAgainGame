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
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/scripts/check-tien-len-ui.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('result').textContent));
  const result = await page.locator('#result').textContent(); assert.ok(result.startsWith('PASS'), result);
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['small', 320, 740], ['mobile', 390, 844], ['tablet', 768, 1024], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    for (const selector of ['#games-dialog', '.tl-shell', '.tl-hand', '.tl-actions']) assert.ok(await page.locator(selector).evaluate(el => el.scrollWidth <= el.clientWidth), `${name}: ${selector} overflows`);
    assert.ok(await page.locator('.tl-hand .tl-card').first().evaluate(el => el.getBoundingClientRect().height >= 44), `${name}: card touch target too short`);
    await page.locator('#games-dialog').evaluate(el => { el.scrollTop = 0; });
    await page.locator('#games-dialog').screenshot({ path: `output/tien-len-${name}.png` });
  }
  await page.evaluate(() => { window.tienLenTest.state.player.tienLen = null; window.tienLenTest.ui.open(); window.tienLenTest.ui.stop(); });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.locator('.tl-lobby').evaluate(el => el.scrollWidth <= el.clientWidth), 'Lobby fits mobile');
  await page.locator('#games-dialog').screenshot({ path: 'output/tien-len-lobby.png' });
  assert.deepEqual(errors, []); console.log(result + '; 320/390/768/1280px layouts; no page errors');
} finally { await browser.close(); }
