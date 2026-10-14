import fs from 'node:fs';
const read = file => JSON.parse(fs.readFileSync(`output/${file}`, 'utf8'));
const browser = new Map();
for (const file of ['mechanics-browser-baseline.json', 'mechanics-expanded-browser.json',
  'mechanics-fuzz-browser.json', 'mechanics-browser-rechecks.json', 'browser-check-results.json']) {
  for (const row of read(file)) browser.set(row.test, row);
}
const rows = [...browser.values()];
const passed = row => row.result.startsWith('PASS') && !row.pageErrors?.length;
const baseCases = read('mechanics-browser-baseline.json').map(row => browser.get(row.test));
const node = read('mechanics-node-results.json');
const stats = rows.filter(row => row.test.startsWith('check-life-fuzz.html') && row.result.startsWith('PASS'))
  .map(row => ({ test: row.test, errors: row.pageErrors,
    ...JSON.parse(row.result.slice(row.result.indexOf('{'))) }));
const sum = key => stats.reduce((total, row) => total + row[key], 0);
const findings = read('mechanics-edge-cases.json');
findings.push({ id: 'tarot-stale-animation', severity: 'medium', confirmed: true,
  description: 'Đóng/mở lại Tarot và hoàn tất trước khi hoạt ảnh lật kết thúc làm callback cũ đọc tarotReading.picked khi tarotReading đã bị xóa.',
  reproduction: 'scripts/check-tarot-animation.html',
  testResult: browser.get('check-tarot-animation.html')?.result });
const summary = {
  status: 'issues-confirmed',
  syntax: { files: 120, errors: 0 },
  node: { passed: node.filter(row => row.exitCode === 0).length, total: node.length,
    eventCatalog: { events: 680, chains: 67, coveredAges: 98, simulatedLives: 4000 },
    note: 'The life-story check initially hit the old 60-second runner limit; its unrestricted rerun passed.' },
  originalBrowserCases: { passed: baseCases.filter(passed).length, total: baseCases.length },
  additionalBrowserCases: rows.filter(row => !baseCases.some(base => base.test === row.test)),
  accountAndAdmin: { localHttp: 'PASS', accountUi: 'PASS', adminUi: 'PASS', mockedSupabaseStorage: 'PASS' },
  runtime: read('runtime-browser-results.json'),
  lifeFuzz: { lives: sum('lives'), years: sum('years'), reloads: sum('reloads'),
    deaths: sum('deaths'), maxAge: Math.max(...stats.map(row => row.maxAge)),
    lateJavaScriptErrors: stats.flatMap(row => row.errors ?? []), cohorts: stats },
  findings,
  unconfirmed: [{ id: 'late-fuzz-save-conflict',
    description: 'Một lỗi khóa lưu xuất hiện sau khi lượt fuzz báo hoàn tất. Harness thay nhiều đời trên cùng trang và khôi phục localStorage khi dọn dẹp; cần tách lỗi callback muộn khỏi hành vi game thật trước khi kết luận lỗi lưu.',
    realBrowserLockAndQuotaChecks: 'PASS' }],
  testMaintenance: [
    'Updated old 30% living-cost expectations to the approved 40% / 55% / 70% rates and current salary bands.',
    'Scoped shop selectors to the shop dialog so the budget button is not counted as a shop category.',
    'Raised time limits for the 4000-life event simulation and longer UI fuzz cohorts.',
  ],
  limitations: [
    'Regression passes do not establish that every possible combination is bug-free; the new diagnostics expose gaps in existing tests.',
    'Account checks use temporary local services and mock storage. No deployed server or real account database was tested.',
    'Source-reference coverage for all 79 achievements is not a proof of a full playthrough for each one.',
  ],
};
fs.writeFileSync('output/mechanics-audit-summary.json', JSON.stringify(summary, null, 2));
fs.writeFileSync('output/mechanics-browser-results.json', JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ ...summary, findings: findings.map(row => ({ id: row.id,
  severity: row.severity, confirmed: row.confirmed })), additionalBrowserCases: summary.additionalBrowserCases.map(row => ({
  test: row.test, passed: passed(row), pageErrors: row.pageErrors })), lifeFuzz: { ...summary.lifeFuzz, cohorts: undefined } }, null, 2));
