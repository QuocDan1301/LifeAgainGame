import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
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
    if (url.pathname === '/detective-check') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/buttons.css">' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    try { await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8' }); }
    catch { await route.fulfill({ status: 404, body: '' }); }
  });
  async function load(saved = null) {
    await page.goto('https://game.test/detective-check');
    await page.evaluate(async snapshot => {
      const parsed = new DOMParser().parseFromString(await (await fetch('/index.html')).text(), 'text/html');
      parsed.querySelectorAll('script').forEach(el => el.remove());
      parsed.querySelectorAll('[src]').forEach(el => el.removeAttribute('src'));
      document.body.insertAdjacentHTML('beforeend', parsed.body.innerHTML);
      const { createInitialState } = await import('/js/core/state.js');
      const { createDetectiveCase } = await import('/js/leisure/detective-data.js');
      const { trackSavedGame } = await import('/js/core/save-store.js');
      const { initDetective } = await import('/js/leisure/detective.js');
      window.detectiveState = snapshot ?? createInitialState();
      if (!snapshot) {
        let seed = 12037;
        const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
        Object.assign(detectiveState.player, { age: 30, money: 10000000, intelligence: 85, isAlive: true });
        detectiveState.player.detective = { reputation: 12, solved: 0, failed: 0, streak: 0, board: null,
          current: { ...createDetectiveCase(2, random), hours: 4, sharp: true, extraHours: 0, revealed: [], crossed: [], result: null } };
      }
      trackSavedGame();
      initDetective(detectiveState, { renderMoney() {}, renderStats() {}, renderLogEntry() {}, checkAchievements() {} });
      document.getElementById('lobby-screen').hidden = true;
      document.getElementById('game-screen').hidden = false;
      document.getElementById('activity-detective').click();
    }, saved);
  }
  await load();
  assert.equal(await page.locator('.detective-tab').count(), 4);
  assert.match(await page.locator('#detective-panel').textContent(), /Việc cần làm/);
  await page.locator('#detective-tab-notes').click();
  assert.equal(await page.locator('.detective-note').count(), 0, 'no hidden evidence in notebook');
  await page.locator('#detective-tab-leads').click();
  for (const clueIndex of [2, 0, 4, 1, 3]) {
    await page.locator(`[data-lead="${clueIndex}"] .detective-investigate`).click();
    const confirm = page.getByRole('button', { name: 'Điều tra thêm', exact: true });
    if (await confirm.count()) await confirm.click();
    assert.match(await page.locator(`[data-lead="${clueIndex}"] .detective-clue-tag`).textContent(), new RegExp('#' + (clueIndex + 1) + '$'));
  }
  const hours = await page.evaluate(() => detectiveState.player.detective.current.extraHours);
  assert.equal(hours, 1);
  await page.locator('#detective-tab-notes').click();
  assert.equal(await page.locator('.detective-note').count(), 30);
  assert.equal(await page.locator('.detective-note[data-note="unknown"]').count(), 30, 'notebook never fills the answer itself');
  const first = page.locator('.detective-note').first();
  await first.click();
  assert.equal(await first.getAttribute('data-note'), 'fits');
  await first.click();
  assert.equal(await first.getAttribute('data-note'), 'conflict');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')));
  assert.equal(Object.values(saved.player.detective.current.evidenceNotes[0])[0], 'conflict');
  await load(saved);
  await page.locator('#detective-tab-notes').click();
  assert.equal(await page.locator('.detective-note[data-note="conflict"]').count(), 1, 'notes persist after reloading');
  fs.mkdirSync('output', { recursive: true });
  for (const [name, width, height] of [['small', 320, 568], ['mobile', 390, 844], ['desktop', 1280, 900]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.locator('#detective-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), name + ': dialog does not overflow');
    assert.ok(await page.locator('.detective-notebook-scroll').evaluate(el => el.clientWidth > 0 && el.scrollWidth >= el.clientWidth));
    await page.locator('#detective-dialog').evaluate(el => { el.scrollTop = 0; });
    await page.locator('#detective-dialog').screenshot({ path: `output/detective-notebook-${name}.png` });
  }
  const fixture = await page.evaluate(async () => {
    const { clearingClue } = await import('/js/leisure/detective-data.js');
    const file = detectiveState.player.detective.current;
    return { culprit: file.culprit, name: file.suspects[file.culprit].name,
      reasons: file.suspects.map((_, index) => ({ index, clue: clearingClue(file, index) })).filter(item => item.index !== file.culprit) };
  });
  // Clear the intentionally wrong mark, then use the same manual controls as a player.
  const wrongMark = page.locator('.detective-note[data-note="conflict"]');
  await wrongMark.click();
  for (const { index, clue } of fixture.reasons) {
    const note = page.locator(`.detective-note[data-person="${index}"][data-clue="${clue}"]`);
    await note.click();
    await note.click();
  }
  await page.getByRole('button', { name: 'Soạn kết luận về ' + fixture.name, exact: true }).click();
  assert.equal(await page.locator('.detective-reason-row').count(), 5);
  assert.ok((await page.locator('.detective-reason-evidence').allTextContents()).every(text => text.startsWith('Căn cứ bạn chọn #')));
  assert.equal(await page.evaluate(() => detectiveState.player.detective.current.extraHours), hours, 'notes and drafting do not spend investigation hours');
  await page.locator('.detective-submit').click();
  assert.equal(await page.locator('.detective-stamp.is-solved').count(), 1);
  assert.equal(await page.locator('.detective-deduction-steps > li').count(), 3);
  assert.match(await page.locator('.detective-deduction-left').last().textContent(), new RegExp('Còn 1 người: ' + fixture.name));
  assert.equal(await page.evaluate(() => detectiveState.player.detective.current.result.unproven), 0);
  const reward = await page.evaluate(() => detectiveState.player.detective.current.result.reward);
  assert.equal(reward, 9600000);
  await page.locator('#detective-dialog').screenshot({ path: 'output/detective-solution-desktop.png' });
  assert.deepEqual(errors, [], 'no browser runtime errors');
  console.log('PASS detective UI: four clear tabs, stable clue IDs, compound clues, extra-hour confirmation, manual notes, save/reload, mobile scrolling, prefilled reasons, shortest solution chain and exact reward.');
} finally { await browser.close(); }
