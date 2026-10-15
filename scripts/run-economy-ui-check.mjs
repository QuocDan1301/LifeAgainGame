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
    if (url.pathname === '/economy-check') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/buttons.css"><link rel="stylesheet" href="/css/lobby.css"><link rel="stylesheet" href="/css/polish.css">' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/economy-check');
  await page.evaluate(async () => {
    const parsed = new DOMParser().parseFromString(await (await fetch('/index.html')).text(), 'text/html');
    parsed.querySelectorAll('script').forEach(node => node.remove());
    parsed.querySelectorAll('[src]').forEach(node => node.removeAttribute('src'));
    document.body.insertAdjacentHTML('beforeend', parsed.body.innerHTML);
    const { state, createInitialState } = await import('/js/core/state.js');
    const { achievements } = await import('/js/achievements/achievements-data.js');
    const { trackSavedGame } = await import('/js/core/save-store.js');
    Object.assign(state, createInitialState());
    Object.assign(state.player, { age: 30, money: 1000000, health: 80, happiness: 80, intelligence: 50, appearance: 80,
      relatives: [], illnessPlan: [], studyBlock: 'B', careerPath: { id: 'medicine', field: 'Y khoa' }, careerLevel: 1,
      employmentStatus: 'employed', employedSince: 22, lastSalaryAge: 30, job: 'Bác sĩ tập sự', nextPromotionAge: null });
    window.economyState = state;
    localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.map(item => [item.id, true]))));
    localStorage.setItem('lifeAgainAchievementQueue', '[]');
    trackSavedGame();
    document.getElementById('lobby-screen').hidden = true;
    document.getElementById('game-screen').hidden = false;
    Math.random = () => 0.99;
    await import('/js/main.js');
  });
  await page.locator('#assets').click();
  await page.locator('#open-family-budget').click();
  assert.match(await page.locator('#finance-check-body').textContent(), /Thuế thu nhập cá nhân:.*Bảo hiểm:.*Thuê nhà: 24 triệu/);
  assert.equal(await page.locator('#budget-living-mode option[value="frugal"]').count(), 0);
  assert.equal(await page.locator(".finance-tax-help tbody tr").count(), 6);
  await page.locator('.finance-tax-help summary').click();
  assert.match(await page.locator('.finance-tax-help').textContent(), /120 triệu\/năm/);
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#finance-check-dialog').evaluate(node => node.scrollWidth <= node.clientWidth), name + ': no horizontal overflow');
    await page.locator('#finance-check-dialog').screenshot({ path: `output/economy-budget-${name}.png`, animations: 'disabled' });
  }
  await page.locator('#close-finance-check').click();
  await page.evaluate(() => economyState.player.purchases.push({ id: 'starter-apartment', uid: 'test-home', boughtAtAge: 30 }));
  await page.locator('#assets').click();
  await page.locator('#open-family-budget').click();
  assert.match(await page.locator('#finance-check-body').textContent(), /Thuê nhà: 0/);
  await page.locator('#close-finance-check').click();
  await page.evaluate(async () => {
    const { completeLifeYear } = await import('/js/relationships/family.js');
    const { forecastNextYear } = await import('/js/relationships/family.js');
    const expected = forecastNextYear(economyState.player).after;
    const year = completeLifeYear(economyState.player, 31);
    if (economyState.player.money !== expected) throw new Error('Actual wallet differs from budget');
    if (!year.living.content.includes('Bảo hiểm') || !year.living.content.includes('Thuế thu nhập')) throw new Error('Missing tax ledger');
  });
  await page.evaluate(() => {
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    Object.assign(economyState.player, { money: 119999999, purchases: [], homeLoans: [] });
  });
  await page.locator('#activities').click();
  await page.locator('#activity-shopping').click();
  await page.locator('#shop-dialog .shop-group[data-group="realestate"]').click();
  const installmentCard = page.locator('#shop-list .shop-item').filter({ has: page.locator('h4', { hasText: 'Nhà trả góp' }) });
  assert.equal(await installmentCard.count(), 1);
  assert.equal(await page.locator('#shop-list').getByText('Căn hộ nhỏ trả góp', { exact: true }).count(), 0);
  assert.ok(await installmentCard.locator('.shop-buy').isDisabled());
  await page.evaluate(() => { economyState.player.money = 120000000; });
  await page.locator('#shop-list .shop-back').click();
  await page.locator('#shop-dialog .shop-group[data-group="realestate"]').click();
  assert.ok(await installmentCard.locator('.shop-buy').isEnabled());
  const apartmentCard = page.locator('#shop-list .shop-item').filter({ has: page.locator('h4', { hasText: 'Căn hộ đầu tiên' }) });
  assert.match(await apartmentCard.textContent(), /800 triệu/);
  assert.ok(await apartmentCard.locator('.shop-buy').isDisabled());
  assert.match(await installmentCard.textContent(), /Dự kiến năm tới sau trả góp/);
  assert.match(await installmentCard.textContent(), /20 năm.*Lãi đơn 3%/);
  for (const [name, width, height] of [['mobile', 320, 568], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#shop-dialog').evaluate(node => node.scrollWidth <= node.clientWidth), name + ': housing terms fit');
    await installmentCard.screenshot({ path: `output/housing-terms-${name}.png`, animations: 'disabled' });
  }
  await installmentCard.locator('.shop-buy').click();
  assert.match(await page.locator('#shop-confirm-text').textContent(), /120 triệu.*480 triệu[\s\S]*38,4 triệu/);
  assert.match(await page.locator('#shop-confirm-text').textContent(), /Dự kiến năm tới sau trả góp/);
  await page.locator('#shop-cancel').click();
  assert.equal(await page.evaluate(() => economyState.player.purchases.length), 0);
  await page.evaluate(() => {
    window.housingBeforeLowIncome = structuredClone(economyState.player);
    Object.assign(economyState.player, { careerPath: { id: 'casual' }, employmentStatus: 'unemployed',
      sideJobs: [], streetJobs: [{ id: 'lottery-seller', startedAtAge: 20 }] });
  });
  await page.locator('#shop-list .shop-back').click();
  await page.locator('#shop-dialog .shop-group[data-group="realestate"]').click();
  assert.match(await installmentCard.textContent(), /thiếu 2,4 triệu.*\/năm/);
  assert.match(await installmentCard.textContent(), /chi vượt thu/);
  await installmentCard.locator('.shop-buy').click();
  assert.match(await page.locator('#shop-confirm-text').textContent(), /chi vượt thu/);
  await page.locator('#shop-cancel').click();
  await page.evaluate(() => { Object.assign(economyState.player, window.housingBeforeLowIncome); });
  await page.locator('#shop-list .shop-back').click();
  await page.locator('#shop-dialog .shop-group[data-group="realestate"]').click();
  await installmentCard.locator('.shop-buy').click();
  await page.locator('#shop-confirm').click();
  assert.ok(await installmentCard.locator('.shop-buy').isDisabled());
  const bought = await page.evaluate(() => JSON.parse(JSON.stringify(economyState.player)));
  assert.equal(bought.money, 0);
  assert.equal(bought.purchases.length, 1);
  assert.equal(bought.homeLoans[0].annualPayment, 38400000);
  assert.equal(bought.homeLoans[0].outstanding, 768000000);
  assert.equal(bought.homeLoans[0].assetUid, bought.purchases[0].uid);
  await page.locator('#close-shop').click();
  await page.locator('#assets').click();
  assert.ok(await page.locator('#life-realestate .shop-sell').isDisabled());
  console.log('PASS housing shop UI: one 600m home, 120m deposit, confirmation/cancel, persisted loan, duplicate and sale guards, 800m apartment');
  assert.deepEqual(errors, []);
  console.log('PASS economy UI: real main module, tax/rent breakdown and rules, legacy frugal option removed, owning home removes rent, actual year matches budget, 320/390/1280px layouts.');
} finally {
  await browser.close();
}
