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
    if (url.pathname === '/garden-check') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/buttons.css"><link rel="stylesheet" href="/css/lobby.css"><link rel="stylesheet" href="/css/polish.css">' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/garden-check');
  await page.evaluate(async () => {
    const parsed = new DOMParser().parseFromString(await (await fetch('/index.html')).text(), 'text/html');
    parsed.querySelectorAll('script').forEach(node => node.remove());
    parsed.querySelectorAll('[src]').forEach(node => node.removeAttribute('src'));
    document.body.insertAdjacentHTML('beforeend', parsed.body.innerHTML);
    const { createInitialState } = await import('/js/core/state.js');
    const { gardenOf } = await import('/js/leisure/garden-data.js');
    const { trackSavedGame } = await import('/js/core/save-store.js');
    const { initGarden } = await import('/js/leisure/garden.js');
    window.gardenState = createInitialState();
    Object.assign(gardenState.player, { age: 20, money: 1000000, health: 60, happiness: 60, intelligence: 60, appearance: 60 });
    gardenOf(gardenState.player, () => 0);
    trackSavedGame();
    initGarden(gardenState, { renderMoney() {}, renderStats() {}, renderLogEntry() {}, checkAchievements() {} });
    document.getElementById('lobby-screen').hidden = true;
    document.getElementById('game-screen').hidden = false;
    document.getElementById('activity-garden').click();
  });
  const next = page.locator('.garden-next-action');
  assert.match(await next.textContent(), /Gieo rau muống/);
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['mobile', 390, 844], ['small', 320, 568], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#garden-dialog').evaluate(node => node.scrollWidth <= node.clientWidth), name + ': no horizontal overflow');
    await page.locator('#garden-dialog').screenshot({ path: `output/garden-guided-${name}.png`, animations: 'disabled' });
  }
  await next.click();
  assert.match(await next.textContent(), /Tưới 1 luống/);
  await next.click();
  assert.equal(await page.evaluate(() => gardenState.player.garden.plots[0].watered), true);
  await page.locator('.garden-advance').click();
  await page.getByRole('button', { name: '⏭️ Sang mùa', exact: true }).click();
  assert.match(await next.textContent(), /Thu hoạch luống 1/);
  await next.click();
  assert.match(await next.textContent(), /Vào bếp nấu ăn/);
  await next.click();
  assert.equal(await page.locator('#garden-tab-kitchen').getAttribute('aria-selected'), 'true');
  await page.locator('#garden-tab-market').click();
  await page.getByRole('button', { name: '🪱 Phân bón', exact: true }).click();
  assert.equal(await page.locator('.garden-item').count(), 1);
  assert.equal(await page.locator('.garden-item[data-item="phan"]').count(), 1);
  await page.getByRole('button', { name: '🌱 Hạt giống', exact: true }).click();
  assert.equal(await page.locator('.garden-item[data-item="dau-tay"]').count(), 0, 'out-of-season seeds hidden');
  await page.evaluate(() => {
    const g = gardenState.player.garden;
    g.weather = 'drought'; g.care = 3;
    g.plots[0] = { crop: 'rau-muong', growth: 0, watered: false, pest: false, fert: 0, penalty: 0, withered: false };
  });
  await page.locator('#garden-tab-garden').click();
  assert.match(await page.locator('.garden-next-step').textContent(), /Cứu cây|héo/);
  assert.match(await next.textContent(), /thêm công chăm|cảnh báo/);
  assert.deepEqual(errors, []);
  console.log('PASS garden UI: first planting → watering → season → harvest → kitchen; seasonal shop, separate fertilizer, drought guidance and 320/390/1280px layouts.');
} finally {
  await browser.close();
}
