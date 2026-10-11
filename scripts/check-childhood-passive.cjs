// Run with Node, optionally passing the installed Playwright package directory.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const target = file.endsWith(path.sep) ? path.join(file, 'index.html') : file;
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    const type = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml' }[path.extname(target)];
    res.setHeader('Content-Type', type || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => { Math.random = () => 0.5; });
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    const cases = await page.evaluate(async () => {
      const { getAgeEvents } = await import('/js/events.js');
      return Array.from({ length: 10 }, (_, i) => i + 1).flatMap(age =>
        getAgeEvents(age).filter(e => e.automaticResult).map(e => ({ age, id: e.id, effects: e.choices[0].effects })));
    });
    assert.equal(cases.length, 20);
    for (const item of cases) {
      await page.evaluate(async ({ age, id }) => {
        const { createInitialState } = await import('/js/state.js');
        const { getAgeEvents } = await import('/js/events.js');
        const { achievements } = await import('/js/achievements-data.js');
        const saved = createInitialState();
        Object.assign(saved.player, { age: age - 1, health: 60, intelligence: 60, happiness: 60, appearance: 60, relatives: [] });
        saved.pendingEvent = { ...getAgeEvents(age).find(e => e.id === id), stage: 'choice', age };
        delete saved.pendingEvent.automaticResult; // Older saved popup must upgrade too.
        localStorage.setItem('lifeAgainSave', JSON.stringify(saved));
        localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.map(a => [a.id, true]))));
        localStorage.setItem('lifeAgainAchievementQueue', '[]');
      }, item);
      await page.reload();
      await page.locator('#continue-button').click();
      await page.locator('#event-dialog').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#event-choices button').count(), 0, item.id);
      assert.equal(await page.locator('#event-confirm').innerText(), 'Đồng ý');
      const preview = await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')));
      assert.equal(preview.pendingEvent.stage, 'result');
      assert(!preview.pendingEvent.logContent.includes('Bạn chọn:'));
      assert.equal(preview.player.age, item.age - 1);
      for (const stat of ['health', 'intelligence', 'happiness', 'appearance']) {
        assert.equal(preview.player[stat], 60);
        assert.equal(preview.pendingEvent.updates[stat] ?? 60, 60 + (item.effects[stat] ?? 0), JSON.stringify({item,stat,pending:preview.pendingEvent}));
      }
      await page.reload();
      await page.locator('#continue-button').click();
      await page.evaluate(() => import('/js/main.js'));
      assert.deepEqual(errors, []);
      const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')));
      assert.deepEqual(restored.pendingEvent.updates, preview.pendingEvent.updates);
      await page.locator('#event-confirm').evaluate(button => button.click());
      const settled = await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')));
      assert.equal(settled.player.age, item.age, JSON.stringify({id:item.id,pending:settled.pendingEvent}));
      assert(!settled.pendingEvent);
      for (const stat of ['health', 'intelligence', 'happiness', 'appearance']) {
        const expected = preview.pendingEvent.schoolReward?.updates?.[stat] ?? 60 + (item.effects[stat] ?? 0);
        assert.equal(settled.player[stat], expected, item.id);
      }
      await page.locator('#event-confirm').evaluate(button => button.click());
      assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave'))), settled);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: 20 passive mobile popups; old saves, no choice screen, displayed effects, reloads and exactly-once confirmation.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
