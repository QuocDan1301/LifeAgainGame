import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createGameServer } from '../server/game-server.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const server = createGameServer({ root: fs.realpathSync('dist') });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const output = 'output/windows-download-inspect';
fs.mkdirSync(output, { recursive: true });
const results = [];
try {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, serviceWorkers: 'block',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/caigame.html#cai-dat', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const button = page.locator('#windows-download');
    assert.equal(await button.isVisible(), true);
    assert.equal(await button.getAttribute('href'), 'https://github.com/QuocDan1301/LifeAgainGame/releases/latest/download/LifeAgain-Windows-x64.exe');
    const bounds = await button.boundingBox();
    const steps = await page.locator('#panel-desktop .steps').boundingBox();
    assert.ok(steps.y - (bounds.y + bounds.height) >= 20, 'download button and instructions need breathing room');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('#cai-dat').screenshot({ path: `${output}/download-${width}.png` });
    assert.deepEqual(errors, []);
    results.push({ width, visible: true, noOverflow: true, instructionsGap: steps.y - (bounds.y + bounds.height), errors });
    await page.close();
  }
  fs.writeFileSync(`${output}/download-results.json`, JSON.stringify(results, null, 2));
  console.log('PASS Windows download UI: visible real release link at 390/768/1440px; instructions spaced; no overflow or script errors.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
