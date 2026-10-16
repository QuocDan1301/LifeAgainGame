import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd();
// Reuse the existing mobile audit's JS probes without installing Python packages.
const existing = fs.readFileSync('scripts/check-mobile-layout.py', 'utf8');
const seed = existing.match(/SEED = """([\s\S]*?)"""/)[1];
const audit = existing.match(/AUDIT = r"""([\s\S]*?)"""/)[1];
const screenshotsOnly = process.argv.includes('--screenshots');
const sizes = screenshotsOnly ? [[320, 568], [390, 844]] : [[360, 800], [390, 844], [1280, 900]];
const scenes = [
  ['main', []], ['menu', ['#menu-button']], ['achievements', ['#achievements']], ['fortune', ['#fortune-button']],
  ['assets', ['#assets']], ['budget', ['#assets', '#open-family-budget']], ['relationships', ['#relationships']],
  ['family-talk', ['#relationships', '#relationship-family-panel-tab', '[data-relative="mother"][data-action="call"]']],
  ['education', ['#education']], ['activities', ['#activities']], ['restart', ['#menu-button', '#restart-button']],
  ...['self-development', 'hospital', 'food', 'beauty', 'love', 'degrees', 'jobs', 'part-time', 'repair-lessons', 'shopping', 'pets', 'travel', 'game-center', 'tarot', 'lottery', 'detective', 'garden'].map(id => ['act-' + id, ['#activities', '#activity-' + id]]),
  ['games-notice', ['#activities', '#activity-games']], ['games', ['#activities', '#activity-games', '#confirm-games-notice']],
];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const rows = [];
fs.mkdirSync('output/tester-audit', { recursive: true });
const write = () => fs.writeFileSync('output/review-2026-10-16/' + (screenshotsOnly ? 'layout-screenshots.json' : 'layout.json'), JSON.stringify(rows, null, 2));
try {
  for (const [width, height] of sizes) {
    const size = `${width}x${height}`;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 800, hasTouch: width < 800, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'game.test') return route.abort();
      const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
      if (!file.startsWith(root + path.sep)) return route.abort();
      const types = { '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
      try { await route.fulfill({ body: fs.readFileSync(file), contentType: types[path.extname(file)] ?? 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: '' }); }
    });
    async function measure(scene) {
      await page.waitForTimeout(100);
      const scope = await page.evaluate(() => { const top = document.activeElement?.closest('dialog[open]') ?? [...document.querySelectorAll('dialog[open]')].at(-1); return top ? '#' + top.id : null; });
      const metrics = await page.evaluate('(' + audit + ')(' + JSON.stringify(scope) + ')');
      const accessibility = await page.evaluate(scope => {
        const root = scope ? document.querySelector(scope) : document.querySelector('#game-screen:not([hidden]), #lobby-screen:not([hidden])');
        const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
        const name = el => el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') ?? '').split(' ').map(id => document.getElementById(id)?.textContent ?? '').join(' ').trim() || [...(el.labels ?? [])].map(label => label.textContent).join(' ').trim() || el.textContent.trim() || el.getAttribute('title');
        const unlabeled = [...root.querySelectorAll('button, input:not([type=hidden]), select, textarea')].filter(el => visible(el) && !name(el)).map(el => el.tagName + '#' + el.id);
        const iconButtons = [...root.querySelectorAll('button')].filter(el => visible(el) && /^[✕×←→☰⚙]$/.test(el.textContent.trim()) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')).map(el => el.id || el.className);
        return { unlabeled, iconButtons };
      }, scope);
      const row = { size, scene, ...metrics, accessibility };
      rows.push(row);
      if (screenshotsOnly || metrics.docOverflowX > 1 || metrics.scopeOverflowX > 1 || metrics.overflowing.length || accessibility.unlabeled.length || metrics.closeInView === false) {
        await page.screenshot({ path: `output/review-2026-10-16/layout-${size}-${scene.replace(/[^a-z0-9-]/gi, '-')}.png` }).catch(() => {});
      }
      write();
      return scope;
    }
    await page.goto('https://game.test/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate('(' + seed + ')()');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#continue-button').waitFor({ state: 'visible' });
    await measure('lobby');
    await page.locator('#continue-button').click();
    await page.locator('#game-screen').waitFor({ state: 'visible' });
    await page.locator('#app-loader').waitFor({ state: 'hidden' });
    for (const [name, selectors] of scenes.filter(([name]) => !screenshotsOnly || ['main', 'act-garden', 'act-detective'].includes(name))) {
      try {
        await page.evaluate(() => {
          document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
          const menu = document.getElementById('menu-panel');
          if (menu && !menu.hidden) document.getElementById('menu-button').click();
        });
        for (const selector of selectors) await page.locator(selector).first().click({ timeout: 3000 });
        const scope = await measure(name);
        if (!scope) continue;
        const tabs = page.locator(scope).locator('[role=tab]');
        for (let index = 1; index < await tabs.count(); index++) {
          if (!await tabs.nth(index).isVisible()) continue;
          const label = await tabs.nth(index).getAttribute('id') ?? String(index);
          await tabs.nth(index).click();
          await measure(name + '-' + label);
        }
      } catch (error) { rows.push({ size, scene: name, skipped: error.message.split('\n')[0] }); write(); }
    }
    rows.push({ size, pageErrors: errors });
    write();
    console.log(`Checked ${size}: ${rows.filter(row => row.size === size && row.scene).length} scenes, ${errors.length} page errors.`);
    await context.close();
  }
} finally { await browser.close(); write(); }
console.log(`Layout audit saved: ${rows.filter(row => row.scene).length} scenes.`);

