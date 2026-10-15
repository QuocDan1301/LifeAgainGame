// Isolated browser checks. Set PLAYWRIGHT_MODULE_PATH when using a bundled runtime.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root) || !types[path.extname(file)]) { res.writeHead(404).end(); return; }
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] }); res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const useFileRoutes = process.env.BALANCE_FILE_ROUTES === '1';
const base = useFileRoutes ? 'https://game.test' : `http://127.0.0.1:${server.address().port}`;
async function routeLocalFile(route) {
  const url = new URL(route.request().url());
  if (url.origin !== base) return route.abort();
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(root) || !types[path.extname(file)]) return route.fulfill({ status: 404, body: '' });
  try { return await route.fulfill({ body: await fs.readFile(file), contentType: types[path.extname(file)] }); }
  catch { return route.fulfill({ status: 404, body: '' }); }
}
const rows = [];
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const cases = process.argv.slice(2);
  for (const name of cases.length ? cases : ['check-crime.html', 'check-job-applications.html', 'check-career-salary.html', 'check-career-milestones.html', 'check-side-jobs.html', 'check-family.html', 'check-adult-life.html']) {
    const context = await browser.newContext();
    if (useFileRoutes) await context.route('**/*', routeLocalFile);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let result;
    try {
      await page.goto(`${base}/scripts/${name}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => [...document.querySelectorAll('pre')].some(p => /^(PASS|FAIL)/.test(p.textContent)), { timeout: 25000 });
      result = await page.locator('pre').first().textContent();
    } catch (error) { result = 'INCOMPLETE: ' + error.message; }
    rows.push({ test: name, result, pageErrors: errors });
    console.log(name + ': ' + result.split('\n')[0]);
    await context.close();
  }
  // Exercise the newly added controls through the actual game and save/reload.
  const page = await browser.newPage();
  if (useFileRoutes) await page.route('**/*', routeLocalFile);
  const { achievements } = await import('../js/achievements/achievements-data.js');
  await page.addInitScript(ids => {
    localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(ids.map(id => [id, { unlockedAt: '2026-01-01' }]))));
    localStorage.setItem('lifeAgainAchievementQueue', '[]');
  }, achievements.map(a => a.id));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const { state, createInitialState } = await import('/js/core/state.js');
    const { achievements } = await import('/js/achievements/achievements-data.js');
    localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.map(a => [a.id, { unlockedAt: '2026-01-01' }]))));
    localStorage.setItem('lifeAgainAchievementQueue', '[]');
    Object.assign(state, createInitialState());
    Object.assign(state.player, { name: 'Kiểm thử', age: 40, money: 500000000, health: 80, happiness: 80,
      intelligence: 70, appearance: 70, isAlive: true, studyBlock: 'A00', careerPath: { id: 'programming' },
      careerLevel: 2, employmentStatus: 'employed', employedSince: 22, job: 'Lập trình viên',
      children: [{ id: 'c', name: 'Con', initialAge: 0, joinedAtAge: 30 }],
      relatives: [{ id: 'mother', name: 'Mẹ', alive: true, ageAtPlayerBirth: 26, bond: 70, condition: 'healthy' }] });
    document.getElementById('game-screen').hidden = false;
    document.getElementById('lobby-screen').hidden = true;
    // This fixture jumps directly to adulthood; dismiss unrelated retroactive awards.
    await import('/js/main.js');
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  });
  await page.locator('#assets').click();
  await page.locator('#open-family-budget').click();
  await page.locator('#budget-living-mode').selectOption('comfortable');
  await page.getByLabel('Việc học của Con:').selectOption('supported');
  await page.getByLabel('Đại học của Con (19–22 tuổi):').selectOption('yes');
  await page.getByLabel('Hỗ trợ Mẹ:').selectOption('care');
  const values = await page.evaluate(async () => {
    const { state } = await import('/js/core/state.js');
    const { forecastNextYear } = await import('/js/relationships/family.js');
    return { mode: state.player.livingMode, budget: forecastNextYear(state.player).familyBudget, college: state.player.children[0].collegeSupport };
  });
  assert.deepEqual(values, { mode: 'comfortable', budget: 56000000, college: true });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#continue-button').click();
  await page.waitForSelector('#open-family-budget', { state: 'attached' });
  const restored = await page.evaluate(async () => {
    const { state } = await import('/js/core/state.js');
    return { mode: state.player.livingMode, education: state.player.children[0]?.educationPlan, support: state.player.relatives[0]?.supportPlan };
  });
  assert.deepEqual(restored, { mode: 'comfortable', education: 'supported', support: 'care' });
  rows.push({ test: 'family-budget-ui', result: 'PASS budget choices, forecast and reload', pageErrors: errors });
  console.log('family-budget-ui: PASS');
} catch (error) {
  rows.push({ test: 'runner', result: 'FAIL ' + error.stack, pageErrors: [] });
  console.error(error);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  await fs.mkdir(new URL('../output/', import.meta.url), { recursive: true });
  await fs.writeFile(new URL('../output/life-balance-browser-results.json', import.meta.url), JSON.stringify(rows, null, 2));
}
if (rows.some(row => !row.result.startsWith('PASS') || row.pageErrors.length)) process.exitCode = 1;
