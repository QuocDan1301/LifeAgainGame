import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { getEventTags, eventCategories } from '../js/events/event-category.js';
import { createPromotionEvent, createMilestonePromotionEvent } from '../js/career/career-jobs.js';

const ids = event => getEventTags(event).map(tag => tag.id);
for (const category of Object.keys(eventCategories)) {
  assert.equal(ids({ category })[0], category);
}
for (const id of ['football', 'esports', 'medicine', 'programming', 'business', 'teaching', 'general']) {
  const player = { age: 30, careerPath: { id, field: id }, careerLevel: 2, intelligence: 70, health: 80 };
  for (const roll of [0, 0.99]) {
    assert.deepEqual(ids(createPromotionEvent(player, () => roll, 31)), ['career', 'promotion']);
  }
  for (let step = 1; step <= 4; step++) {
    const event = createMilestonePromotionEvent(player, step, 31, () => 0.5);
    if (event) assert.deepEqual(ids(event), ['career', 'promotion']);
  }
}
for (const kind of ['job-warning', 'job-review', 'layoff-notice', 'contract-notice', 'work-temptation', 'work-investigation', 'risk-offer']) {
  assert.ok(ids({ kind }).includes('danger'), kind);
}
assert.ok(ids({ category: 'special', choices: [{ death: true }, {}] }).includes('danger'));
assert.ok(ids({ category: 'family', danger: true }).includes('danger'));
assert.ok(ids({ category: 'finance', choices: [{ playerUpdates: { prison: { years: 2 } } }] }).includes('danger'));
assert.ok(!ids({ category: 'everyday', choices: [{ effects: { happiness: -1 } }] }).includes('danger'));
assert.deepEqual(ids({ stage: 'result', category: 'career', eventTagKind: 'career-promotion' }), ['career', 'promotion']);
assert.ok(ids({ stage: 'result', category: 'special', danger: true }).includes('danger'));
assert.deepEqual(ids({ category: 'love', kind: 'marriage-proposal' }), ['love', 'proposal']);
assert.deepEqual(ids({ category: 'education', kind: 'exam-prep' }), ['education', 'exam-prep']);
const frozen = Object.freeze({ kind: 'career-promotion' });
getEventTags(frozen);

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage();
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'game.test') return route.abort();
    if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/polish.css"><p id="event-category" class="event-category"></p>' });
    const file = path.resolve('.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(process.cwd() + path.sep)) return route.abort();
    await route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : 'text/css' });
  });
  await page.goto('https://game.test/');
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 700 });
    await page.evaluate(async () => {
      const { renderEventTags } = await import('/js/events/event-category.js');
      const container = document.getElementById('event-category');
      renderEventTags(container, { kind: 'layoff-notice' });
    });
    assert.match(await page.locator('#event-category').textContent(), /Nghề nghiệp.*Cắt giảm nhân sự.*Nguy hiểm/);
    assert.ok(await page.locator('#event-category').evaluate(node => node.scrollWidth <= node.clientWidth), `${width}: wrap tags`);
    await page.evaluate(async () => {
      const { renderEventTags } = await import('/js/events/event-category.js');
      renderEventTags(document.getElementById('event-category'), { kind: 'career-promotion' });
    });
    assert.equal(await page.locator('[data-tag="danger"]').count(), 0, 'old warning is removed');
    assert.match(await page.locator('[data-tag="promotion"]').textContent(), /Nâng bậc/);
  }
} finally { await browser.close(); }
console.log('PASS event tags: all categories, career promotions, danger, saved results and responsive rendering.');
