import assert from 'node:assert/strict';

 
const target = process.argv[2] ?? process.env.RENDER_EXTERNAL_URL;
if (!target) throw new Error('Cần URL: npm run check:deployment -- https://ten-dich-vu.onrender.com');
const base = new URL(target);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('URL máy chủ không hợp lệ.');
async function read(route) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
  return response;
}
const status = await (await read('/health')).json();
assert.equal(status.ok, true);
const introduction = await (await read('/')).text();
assert.doesNotMatch(introduction, /data-app-launch|location\.replace/, 'home must stay on the download page');
assert.match(introduction, /data-open-game>Mở game</, 'a manual play link must always be available');
const intro = await (await read('/gioi-thieu')).text();
const download = intro.match(/id="windows-download" href="([^"]+)"/)?.[1];
assert.equal(download, 'https://github.com/QuocDan1301/LifeAgainGame/releases/download/windows-v1.0.0/LifeAgain-Windows-x64.exe');
const binary = await fetch(download, { method: 'HEAD', signal: AbortSignal.timeout(60000) });
assert.equal(binary.status, 200, 'Windows download must be publicly available');
assert.ok(Number(binary.headers.get('content-length')) > 100000000, 'Windows download must be the full EXE');
const game = await (await read('/choi')).text();
assert.match(game, /id="new-life-button"/);
assert.doesNotMatch(game, /data-installed-only/, 'browser-mode shortcuts must not be blocked');
const entry = await (await read('/js/entry.js')).text();
assert.doesNotMatch(entry, /installationPage/, 'play must not redirect back to installation');
assert.match((await read('/js/boot.js')).headers.get('content-type'), /javascript/);
assert.match(await (await read('/gioi-thieu')).text(), /id="cai-dat"/);
assert.match(await (await read('/sw.js')).text(), /life-again-/);
for (const route of ['/.env', '/server/game-server.mjs', '/api/account/status', '/api/account/google', '/api/account/progress', '/admin', '/admin.html', '/js/account/account-ui.js', '/.ranking-data/rankings.json']) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 404, `${route} phải bị chặn`);
}
console.log('PASS deployment: trang game; trang giới thiệu; service worker; health; không có tài khoản hoặc trang quản trị; tệp bí mật được bảo vệ');
