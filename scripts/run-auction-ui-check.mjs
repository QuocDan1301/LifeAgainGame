import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'game.test') return route.abort();
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/scripts/check-auction.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('result').textContent));
  const result = await page.locator('#result').textContent();
  assert.ok(result.startsWith('PASS'), result);
  for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#games-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), `${name}: dialog overflow`);
    assert.ok(await page.locator('.auction-actions').evaluate(el => el.scrollWidth <= el.clientWidth), `${name}: action overflow`);
    fs.mkdirSync('output', { recursive: true });
    await page.locator('#games-dialog').screenshot({ path: `output/auction-${name}.png` });
  }
  assert.deepEqual(errors, []);
  console.log(result + '; mobile and desktop fit; no page errors');
} finally { await browser.close(); }
