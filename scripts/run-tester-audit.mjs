import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd();
const requested = process.argv.slice(2);
const isolateSpecials = process.env.TESTER_ISOLATE_SPECIALS === '1';
const cases = fs.readdirSync('scripts').filter(name => /^check-.*\.html$/.test(name) && (!requested.length || requested.includes(name))).sort();
const types = { '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
fs.mkdirSync('output/tester-audit', { recursive: true });
function write() { fs.writeFileSync('output/tester-audit/' + (isolateSpecials ? 'browser-isolated-specials.json' : requested.length ? 'browser-rechecks.json' : 'browser-checks.json'), JSON.stringify(results, null, 2)); }
let cursor = 0;
async function worker() {
  while (cursor < cases.length) {
    const test = cases[cursor++];
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const started = Date.now();
    page.on('pageerror', error => errors.push(error.stack ?? error.message));
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'game.test') return route.abort();
      const relative = url.pathname === '/' ? '/index.html' : url.pathname;
      let file;
      try { file = path.resolve(root, '.' + decodeURIComponent(relative)); } catch { return route.fulfill({ status: 400, body: '' }); }
      if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 403, body: '' });
      try {
        let body = fs.readFileSync(file);
        // Isolate legacy story fixtures from the newly added dating bill and affair opportunity.
        // Product files are served unchanged; only these three test HTML fixtures are adapted in memory.
        if (isolateSpecials && ['check-earth-auction.html', 'check-later-specials.html', 'check-save-life.html'].includes(path.basename(file))) {
          body = body.toString('utf8').replaceAll('birthday.click();',
            'state.player.affairLastEventAge=state.player.age+1; state.player.gender="female"; if(state.player.partner)state.player.partner.gender="male"; birthday.click();');
        }
        await route.fulfill({ body, contentType: types[path.extname(file)] ?? 'application/octet-stream' });
      }
      catch { await route.fulfill({ status: 404, body: '' }); }
    });
    let result;
    try {
      await page.goto('https://game.test/scripts/' + test, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => [...document.querySelectorAll('pre')].some(el => /^(PASS|FAIL)/.test(el.textContent)), null,
        { timeout: test.includes('fuzz') ? 180000 : 45000 });
      result = await page.locator('pre').first().textContent();
    } catch (error) {
      result = 'INCOMPLETE: ' + error.message.split('\n')[0];
    }
    const diagnostic = result.startsWith('PASS') ? null : await page.evaluate(async () => {
      const { state } = await import('/js/core/state.js');
      return { player: state.player, pendingEvent: state.pendingEvent, logs: state.logs.slice(-3),
        dialogs: [...document.querySelectorAll('dialog[open]')].map(el => ({ id: el.id, text: el.textContent.slice(0, 1600) })) };
    }).catch(() => null);
    const row = { test, result, pageErrors: errors, milliseconds: Date.now() - started, diagnostic };
    results.push(row);
    if (!result.startsWith('PASS') || errors.length) await page.screenshot({ path: 'output/tester-audit/' + test.replace('.html', '') + '.png', fullPage: true }).catch(() => {});
    write();
    console.log(`${result.startsWith('PASS') && !errors.length ? 'PASS' : 'FAIL'} ${test}: ${result.split('\n')[0].slice(0, 220)}${errors.length ? ' [JS errors: ' + errors.length + ']' : ''}`);
    await context.close();
  }
}
try { await Promise.all([worker(), worker()]); }
finally { await browser.close(); write(); }
const failed = results.filter(row => !row.result.startsWith('PASS') || row.pageErrors.length);
console.log(`${results.length - failed.length}/${results.length} browser harnesses passed.`);
process.exitCode = failed.length ? 1 : 0;
