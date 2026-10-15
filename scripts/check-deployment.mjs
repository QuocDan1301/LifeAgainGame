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
assert.match(await (await read('/')).text(), /<html/i);
assert.match((await read('/js/boot.js')).headers.get('content-type'), /javascript/);
assert.match(await (await read('/gioi-thieu')).text(), /id="cai-dat"/);
assert.match(await (await read('/sw.js')).text(), /life-again-/);
for (const route of ['/.env', '/server/game-server.mjs', '/api/account/status', '/api/account/google', '/api/account/progress', '/admin', '/admin.html', '/js/account/account-ui.js', '/.ranking-data/rankings.json']) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 404, `${route} phải bị chặn`);
}
console.log('PASS deployment: trang game; trang giới thiệu; service worker; health; không có tài khoản hoặc trang quản trị; tệp bí mật được bảo vệ');
