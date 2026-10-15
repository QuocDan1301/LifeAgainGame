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
    if (url.pathname === '/family-check') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/buttons.css">' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  async function load(saved = null) {
    await page.goto('https://game.test/family-check');
    await page.evaluate(async savedState => {
      const parsed = new DOMParser().parseFromString(await (await fetch('/index.html')).text(), 'text/html');
      parsed.querySelectorAll('script').forEach(el => el.remove());
      parsed.querySelectorAll('[src]').forEach(el => el.removeAttribute('src'));
      document.body.insertAdjacentHTML('beforeend', parsed.body.innerHTML);
      const { createInitialState } = await import('/js/core/state.js');
      const { initRelationships } = await import('/js/relationships/relationships.js');
      const { ensureRelatives } = await import('/js/relationships/family-members.js');
      window.familyState = savedState ?? createInitialState();
      if (!savedState) Object.assign(familyState.player, { age: 30, money: 10000000, employmentStatus: 'employed', job: 'Lập trình viên', isAlive: true });
      ensureRelatives(familyState.player, () => 0.5);
      initRelationships(familyState, () => localStorage.setItem('family-test-save', JSON.stringify(familyState)));
      document.getElementById('lobby-screen').hidden = true;
      document.getElementById('game-screen').hidden = false;
    }, saved);
    await page.locator('#relationships').click();
    await page.locator('#relationship-family-panel-tab').click();
  }
  const action = (relative, type) => page.locator(`[data-relative="${relative}"][data-action="${type}"]`);
  const snapshot = () => page.evaluate(() => JSON.stringify(familyState));
  await load();
  const child = JSON.parse(await snapshot());
  child.player.age = 5;
  await load(child);
  assert.equal(await page.locator('[data-relative][data-action]').count(), 0, 'family actions hidden before six');
  assert.match(await page.locator('#relationship-family-panel').textContent(), /Từ 6 tuổi/);
  child.player.age = 6;
  await load(child);
  assert.equal(await action('mother', 'call').isEnabled(), true, 'conversation unlocks at six');
  assert.equal(await action('mother', 'visit').isEnabled(), true, 'family time unlocks at six');
  await action('mother', 'call').click();
  assert.equal(await page.locator('[data-family-choice]').count(), 3);
  await page.keyboard.press('Escape');
  // A stale enabled control must also respect the current age in the action handler.
  await page.evaluate(() => { familyState.player.age = 5; });
  const locked = await snapshot();
  await action('mother', 'call').dispatchEvent('click');
  assert.equal(await page.locator('#family-conversation-dialog').evaluate(el => el.open), false);
  assert.equal(await snapshot(), locked, 'blocked action changes no state');
  await load();
  const original = await snapshot();
  await action('mother', 'call').click();
  assert.equal(await page.locator('[data-family-choice]').count(), 3);
  assert.equal(await snapshot(), original, 'preview does not consume money, stats or annual actions');
  await page.keyboard.press('Escape');
  assert.equal(await snapshot(), original, 'cancellation is free');
  await action('mother', 'call').click();
  await page.locator('[data-family-choice="pressure"]').click();
  assert.match(await page.locator('#family-conversation-body').textContent(), /Mệt thì cứ nói là mệt/);
  const committed = await page.evaluate(() => JSON.parse(localStorage.getItem('family-test-save')));
  assert.equal(committed.player.relatives[1].conversationMemories.length, 1);
  assert.equal(committed.player.relatives[0].conversationMemories, undefined);
  assert.equal(committed.player.money, 10000000);
  assert.equal(committed.logs.length, 1);
  assert.equal(committed.player.relatives[1].done.call, 30);
  await page.locator('#close-family-conversation').click();
  assert.equal(await action('mother', 'call').isDisabled(), true);
  assert.equal(await page.locator('.family-shared-memories').count(), 1);
  await load(committed);
  await action('mother', 'visit').click();
  assert.match(await page.locator('#family-conversation-body').textContent(), /Lần trước con bảo/);
  assert.match(await page.locator('.family-conversation-recall').textContent(), /áp lực công việc/);
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#family-conversation-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), name + ': no horizontal overflow');
    await page.locator('#family-conversation-dialog').evaluate(el => { el.scrollTop = 0; });
    await page.locator('#family-conversation-dialog').screenshot({ path: `output/family-conversation-${name}.png` });
  }
  await page.locator('[data-family-choice="boundary"]').click();
  const visited = await page.evaluate(() => JSON.parse(localStorage.getItem('family-test-save')));
  assert.equal(visited.player.money, 8000000, 'visit charged exactly once on answering');
  assert.equal(visited.player.relatives[1].conversationMemories.length, 2);
  await page.locator('#close-family-conversation').click();
  await action('father', 'visit').click();
  const beforeStale = await snapshot();
  await page.evaluate(() => { familyState.player.age++; });
  const stale = await snapshot();
  await page.locator('[data-family-choice]').first().click();
  assert.equal(await snapshot(), stale, 'a draft from an earlier year cannot charge money or commit');
  assert.notEqual(beforeStale, stale);
  await page.locator('#close-relationships').click();
  await page.evaluate(() => { familyState.player.relatives[1].alive = false; });
  await page.locator('#relationships').click();
  await page.locator('#relationship-family-panel-tab').click();
  assert.match(await page.locator('.family-member.is-passed').textContent(), /áp lực công việc/, 'memories survive a parent passing away');
  const poor = structuredClone(committed);
  poor.player.money = -1;
  delete poor.player.relatives[0].conversationMemories;
  await load(poor);
  const beforeRude = await page.evaluate(() => ({ bond: familyState.player.relatives[0].bond, happiness: familyState.player.happiness }));
  await action('father', 'call').click();
  await page.locator('[data-family-choice="snap"]').click();
  assert.equal(await page.evaluate(() => familyState.player.relatives[0].bond), beforeRude.bond - 4, 'a hurtful response reduces bond');
  assert.equal(await page.evaluate(() => familyState.player.happiness), Math.max(0, beforeRude.happiness - 1));
  await page.locator('#close-family-conversation').click();
  for (const [gender, lover, charged] of [['male', 'female', true], ['male', 'male', true], ['female', 'female', true], ['female', 'male', false]]) {
    await page.locator('#close-relationships').click();
    const expected = await page.evaluate(async ({ gender, lover }) => {
      const { createAdmirer } = await import('/js/relationships/relationships.js');
      const { getDatingExpenses } = await import('/js/relationships/dating-expenses.js');
      const { formatMoney } = await import('/js/core/money-format.js');
      familyState.player.gender = gender;
      familyState.player.partner = { ...createAdmirer(familyState.player, 25, () => 0.4), gender: lover };
      familyState.player.otherPartners = [];
      familyState.player.marriedAtAge = null;
      familyState.player.relationshipStartedAtAge = 25;
      return getDatingExpenses(familyState.player, familyState.player.age + 1).map(charge => formatMoney(charge.amount));
    }, { gender, lover });
    await page.locator('#relationships').click();
    const text = await page.locator('#relationship-current').textContent();
    assert.equal(text.includes('Hẹn hò năm tới:'), charged, gender + '/' + lover + ': correct cost notice');
    for (const amount of expected) assert.ok(text.includes(amount), 'notice matches the forecast amount');
  }
  console.log('PASS dating expense UI: correct charges and notices for all four gender pairings.');
  console.log('PASS family dialogue UI: previews, Escape, choice outcomes, once per year, exact visit cost, persisted separate memories, contextual follow-up after reload, stale drafts, memorials, 320/390/1280px layouts.');
  for (const file of ['check-life-events.html', 'check-milestone-priority.html', 'check-family.html']) {
    await page.goto('https://game.test/scripts/' + file);
    // Existing harnesses name their result elements differently.
    await page.waitForFunction(() => [...document.querySelectorAll('pre')].some(el => /^(PASS|FAIL)/.test(el.textContent)), null, { timeout: 120000 });
    const result = await page.locator('pre').first().textContent();
    assert.ok(result.startsWith('PASS'), file + ': ' + result);
    console.log(result);
  }
} finally { await browser.close(); }
