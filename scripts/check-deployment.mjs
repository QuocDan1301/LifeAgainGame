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
const status = await (await read('/api/ranking/status')).json();
assert.equal(status.available, true);
assert.equal(status.user, null);
assert.match(status.season, /^\d{4}-(0[1-9]|1[0-2])$/);
for (const scope of [status.season, 'all']) {
  const board = await (await read(`/api/ranking/board?scope=${scope}`)).json();
  assert.ok(Array.isArray(board.entries));
  assert.equal(board.scope, scope);
  assert.equal(board.mine, null);
}
assert.match(await (await read('/')).text(), /<html/i);
assert.match((await read('/js/ranking/ranking-ui.js')).headers.get('content-type'), /javascript/);
for (const route of ['/.env', '/server/ranking-server.mjs', '/supabase/ranking-schema.sql', '/.ranking-data/rankings.json']) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), redirect: 'error' });
  assert.equal(response.status, 404, `${route} phải được bảo vệ`);
}
console.log('PASS deployment: trang game; API; hai bảng xếp hạng; tệp bí mật được bảo vệ');
