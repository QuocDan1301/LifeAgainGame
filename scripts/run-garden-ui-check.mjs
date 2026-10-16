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
  const plot = index => page.locator(`[data-plot="${index}"]`);
  // Start in the middle: skip planted plots, wrap around and stop when full.
  await plot(2).locator('.garden-plot-select').click();
  await page.getByRole('button', { name: /Rau muống ×/ }).click();
  assert.equal(await plot(3).locator('.garden-plot-select').getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('.garden-detail').last().textContent(), /Luống 4: đất trống/);
  assert.ok(await page.locator('.garden-seed-pick').count() > 0);
  await page.getByRole('button', { name: /Hành lá ×/ }).click();
  assert.equal(await plot(0).locator('.garden-plot-select').getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: /Rau muống ×/ }).click();
  assert.equal(await plot(1).locator('.garden-plot-select').getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: /Hành lá ×/ }).click();
  assert.equal(await page.locator('.garden-seed-pick').count(), 0);
  assert.equal(await page.locator('.garden-plot.is-selected').count(), 0);
  assert.equal(await page.evaluate(() => gardenState.player.garden.care), 0, 'planting uses no care');
  assert.equal(await page.locator('.garden-plot-water').count(), 4);
  assert.equal(await page.locator('.garden-water, .garden-water-one, .garden-harvest').count(), 0, 'no separate care buttons');
  // Water and pest controls coexist and only affect their own plot.
  await page.evaluate(() => gardenState.player.garden.plots[0].pest = true);
  await page.locator('#garden-tab-garden').click();
  assert.equal(await plot(0).locator('.garden-plot-water, .garden-plot-pest').count(), 2);
  for (const [name, width, height] of [['mobile', 390, 844], ['small', 320, 568], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#garden-dialog').evaluate(node => node.scrollWidth <= node.clientWidth), name + ': inline tools do not overflow');
    const bounds = await plot(0).evaluate(tile => {
      const rect = tile.getBoundingClientRect();
      const tools = [...tile.querySelectorAll('.garden-plot-tool')].map(node => node.getBoundingClientRect());
      return tools.every(tool => tool.width >= 44 && tool.height >= 44 && tool.left >= rect.left && tool.right <= rect.right)
        && tools[0].right <= tools[1].left;
    });
    assert.ok(bounds, name + ': separate touch targets fit on the crop');
    await page.locator('.garden-plots').evaluate(node => node.scrollIntoView({ block: 'center' }));
    await page.locator('#garden-dialog').screenshot({ path: `output/garden-inline-${name}.png`, animations: 'disabled' });
  }
  await plot(0).locator('.garden-plot-water').click();
  assert.equal(await plot(0).locator('.garden-plot-water').count(), 0);
  assert.equal(await plot(0).locator('.garden-plot-pest').count(), 1);
  assert.equal(await page.evaluate(() => gardenState.player.garden.plots[1].watered), false);
  await plot(0).locator('.garden-plot-pest').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => gardenState.player.garden.plots[0].pest), false);
  assert.equal(await page.evaluate(() => gardenState.player.garden.care), 2);
  await page.evaluate(async () => {
    const { careMax } = await import('/js/leisure/garden-data.js');
    const g = gardenState.player.garden;
    g.care = careMax(g);
    g.plots[1].pest = true;
  });
  await page.locator('#garden-tab-garden').click();
  assert.equal(await plot(1).locator('.garden-plot-water').isDisabled(), true);
  assert.equal(await plot(1).locator('.garden-plot-pest').isDisabled(), true);
  // Keep the season check deterministic even though weather/pests are random.
  await page.evaluate(() => {
    const g = gardenState.player.garden;
    g.care = 0;
    g.plots.forEach(p => { p.watered = true; p.pest = false; });
    Math.random = () => 0.3;
  });
  await page.locator('#garden-tab-garden').click();
  await page.locator('.garden-advance').click();
  await page.getByRole('button', { name: '⏭️ Sang mùa', exact: true }).click();
  assert.equal(await plot(0).locator('.garden-plot-harvest').count(), 1);
  assert.equal(await plot(0).locator('.garden-plot-water, .garden-plot-pest').count(), 0);
  const beforeHarvest = await page.evaluate(() => gardenState.player.garden.care);
  await plot(0).locator('.garden-plot-harvest').click();
  assert.equal(await page.evaluate(() => gardenState.player.garden.plots[0]), null);
  assert.ok(await page.evaluate(() => gardenState.player.garden.goods['rau-muong']) > 0);
  assert.equal(await page.evaluate(() => gardenState.player.garden.care), beforeHarvest);
  // Harvest the remaining ready crops, then proceed to the kitchen.
  for (const index of [1, 2, 3]) await plot(index).locator('.garden-plot-harvest').click();
  assert.match(await next.textContent(), /Vào bếp nấu ăn/);
  await next.click();
  assert.equal(await page.locator('#garden-tab-kitchen').getAttribute('aria-selected'), 'true');
  await page.locator('#garden-tab-market').click();
  await page.getByRole('button', { name: '🪱 Phân bón', exact: true }).click();
  assert.equal(await page.locator('.garden-item').count(), 1);
  assert.equal(await page.locator('.garden-item[data-item="phan"]').count(), 1);
  await page.getByRole('button', { name: '🌱 Hạt giống', exact: true }).click();
  assert.equal(await page.locator('.garden-item[data-item="dau-tay"]').count(), 0, 'out-of-season seeds hidden');
  await page.evaluate(async () => {
    const g = gardenState.player.garden;
    g.weather = 'drought';
    const { careMax } = await import('/js/leisure/garden-data.js');
    g.care = careMax(g);
    g.plots[0] = { crop: 'rau-muong', growth: 0, watered: false, pest: false, fert: 0, penalty: 0, withered: false };
  });
  await page.locator('#garden-tab-garden').click();
  assert.match(await page.locator('.garden-next-step').textContent(), /Cứu cây|héo/);
  assert.match(await next.textContent(), /thêm công chăm|cảnh báo/);
  // Running out of seeds still selects the next empty plot and offers the market.
  await page.evaluate(() => {
    const g = gardenState.player.garden;
    g.plots = g.plots.map(() => null);
    g.season = 0; g.weather = 'fair'; g.care = 0;
    g.seeds = { 'rau-muong': 1 };
  });
  await page.locator('#garden-tab-garden').click();
  await plot(3).locator('.garden-plot-select').click();
  await page.getByRole('button', { name: /Rau muống ×/ }).click();
  assert.equal(await plot(0).locator('.garden-plot-select').getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('.garden-detail').last().textContent(), /chưa có hạt giống hợp mùa/);
  assert.equal(await page.locator('.garden-detail').last().getByRole('button', { name: /Đến chợ mua hạt/ }).isVisible(), true);
  // Rain-watered and withered plants never offer an unnecessary watering control.
  await page.evaluate(() => {
    const g = gardenState.player.garden;
    g.weather = 'rain'; g.seeds = { 'rau-muong': 1 };
  });
  await page.locator('#garden-tab-garden').click();
  await page.getByRole('button', { name: /Rau muống ×/ }).click();
  assert.equal(await page.evaluate(() => gardenState.player.garden.plots[0].watered), true);
  assert.equal(await plot(0).locator('.garden-plot-water').count(), 0);
  await page.evaluate(() => gardenState.player.garden.plots[0].withered = true);
  await page.locator('#garden-tab-garden').click();
  assert.equal(await plot(0).locator('.garden-plot-tool').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS garden UI: automatic empty-plot selection, inline water/pest/harvest, keyboard access, care limits, seed exhaustion, rain/withered crops, kitchen/shop and 320/390/1280px touch layouts.');
} finally {
  await browser.close();
}
