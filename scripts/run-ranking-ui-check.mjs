import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import { createRankingService } from '../server/ranking-server.mjs';
const require = createRequire(import.meta.url);
// Truyền thư mục Playwright qua biến môi trường khi kiểm tra trên một máy khác.
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const handler = createRankingService({ dataFile: null });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', error => console.log('PAGEERROR', error.message));
  await page.route('**/*', async route => {
    const request = route.request(); const url = new URL(request.url());
    if (url.hostname !== 'game.test') return route.abort();
    if (url.pathname.startsWith('/api/')) {
      const req = Readable.from(request.postData() ? [request.postData()] : []);
      req.url = url.pathname + url.search; req.method = request.method(); req.headers = { ...(await request.allHeaders()), host: url.host }; req.socket = { remoteAddress: '127.0.0.1', encrypted: true };
      let status, headers, body;
      await handler(req, { writeHead(code, values) { status = code; headers = values; }, end(value) { body = value; } });
      return route.fulfill({ status, headers, body });
    }
    const file = path.join(process.cwd(), decodeURIComponent(url.pathname));
    try { return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('https://game.test/scripts/check-ranking.html');
  await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('result').textContent), { timeout: 25000 });
  const result = await page.locator('#result').textContent(); console.log(result);
  if (!result.startsWith('PASS')) process.exitCode = 1;
  else { fs.mkdirSync('output', { recursive: true }); await page.locator('#ranking-dialog').screenshot({ path: 'output/ranking-mobile.png' }); }
} finally { await browser.close(); }
