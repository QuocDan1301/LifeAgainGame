import assert from 'node:assert/strict';

// Chỉ đọc: không tạo tài khoản hoặc điểm thử trong cơ sở dữ liệu thật.
const target = process.argv[2] ?? process.env.RENDER_EXTERNAL_URL;
if (!target) throw new Error('Cần URL: npm run check:deployment -- https://ten-dich-vu.onrender.com');
const base = new URL(target);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw new Error('URL máy chủ không hợp lệ.');
async function read(route) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
  return response;
}
const status = await (await read('/api/account/status')).json();
assert.equal(status.available, true);
assert.equal(status.user, null);
assert.match(await (await read('/')).text(), /<html/i);
assert.match((await read('/js/account/account-ui.js')).headers.get('content-type'), /javascript/);
for (const route of ['/.env', '/server/account-server.mjs', '/supabase/account-schema.sql', '/api/ranking/board', '/.ranking-data/rankings.json']) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 404, `${route} phải được bảo vệ`);
}
console.log('PASS deployment: trang game; API; đăng nhập; tệp bí mật được bảo vệ');
