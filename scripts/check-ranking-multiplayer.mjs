import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import { createRankingService } from '../server/ranking-server.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'life-ranking-test-'));
const dataFile = path.join(directory, 'rankings.json');
let handler = createRankingService({ dataFile });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const contexts = [];
  for (const [user, name, age, happiness, rows] of [['player_a', 'Người chơi A', 80, 60, 1], ['player_b', 'Người chơi B', 100, 90, 2]]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    contexts.push(context);
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (url.hostname !== 'game.test') return route.abort();
      if (url.pathname.startsWith('/api/')) {
        const req = Readable.from(request.postData() ? [request.postData()] : []);
        req.url = url.pathname + url.search; req.method = request.method(); req.headers = { ...(await request.allHeaders()), host: url.host }; req.socket = { remoteAddress: '127.0.0.1', encrypted: true };
        let status, headers, body;
        await handler(req, { writeHead(code, values) { status = code; headers = values; }, end(value) { body = value; } });
        if (status >= 400) console.log('API', req.url, status, body);
        return route.fulfill({ status, headers, body });
      }
      const file = path.join(process.cwd(), decodeURIComponent(url.pathname));
      try { return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' }); }
      catch { return route.fulfill({ status: 404, body: '' }); }
    });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('https://game.test/scripts/check-ranking.html?' + new URLSearchParams({ user, name, age, happiness, rows }));
    await page.waitForFunction(() => /^(PASS|FAIL)/.test(document.getElementById('result').textContent), { timeout: 25000 });
    const result = await page.locator('#result').textContent();
    assert.ok(result.startsWith('PASS'), result); assert.deepEqual(errors, []);
    console.log(`PASS ${name}: đăng ký qua giao diện, đăng ký cuộc đời, tổng kết tăng tốc, đồng bộ, không cộng trùng`);
  }
  const first = contexts[0].pages()[0]; const second = contexts[1].pages()[0];
  const getBoard = page => page.evaluate(async () => (await fetch('/api/ranking/board')).json());
  const before = await getBoard(first);
  assert.equal(before.entries.length, 2);
  assert.equal(before.entries[0].nickname, 'Người chơi B');
  assert.equal(before.entries[1].nickname, 'Người chơi A');
  assert.ok(before.entries[0].score > before.entries[1].score);
  assert.equal(before.mine.rank, 2);
  assert.equal((await getBoard(second)).mine.rank, 1);
  // Nạp lại dịch vụ từ dữ liệu đã ghi: mô phỏng khởi động lại máy chủ.
  handler = createRankingService({ dataFile });
  assert.deepEqual(await getBoard(first), before);
  const record = await first.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainRankingHistory'))[0]);
  await first.goto('https://game.test/index.html');
  const replay = await first.evaluate(async record => (await fetch('/api/ranking/finish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: record.serverRunId, snapshot: record.snapshot }) })).json(), record);
  assert.equal(replay.duplicate, true);
  await first.reload();
  assert.deepEqual(await getBoard(first), before);
  const denied = await second.evaluate(async record => (await fetch('/api/ranking/finish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: record.serverRunId, snapshot: record.snapshot }) })).status, record);
  assert.equal(denied, 403);
  const secret = await first.evaluate(async () => (await fetch('/api/ranking/status')).json());
  assert.equal(secret.user.nickname, 'Người chơi A');
  assert.equal(secret.user.passwordHash, undefined);
  console.log(`PASS bảng chung: B ${before.entries[0].score} điểm (#1), A ${before.entries[1].score} điểm (#2)`);
  console.log('PASS tải lại trang, gửi lại kết quả và khởi động lại dịch vụ đều giữ nguyên điểm; hai tài khoản không nhận điểm của nhau');
} finally {
  await browser.close();
  // Chỉ dọn thư mục tạm riêng vừa được tạo cho bài kiểm tra này.
  const target = path.resolve(directory);
  assert.ok(target.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(target).startsWith('life-ranking-test-'));
  fs.rmSync(target, { recursive: true, force: true });
}
