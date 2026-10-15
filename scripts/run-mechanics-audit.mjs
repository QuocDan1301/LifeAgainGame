import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const skipped = new Set(['check-deployment.mjs', 'check-server.mjs']);
const cases = fs.readdirSync('scripts').filter(name => /^check-.*\.mjs$/.test(name) && !skipped.has(name)).sort();
cases.push('audit-achievement-sources.mjs');
const results = [];
for (const name of cases) {
  const run = spawnSync(process.execPath, [`scripts/${name}`], { encoding: 'utf8', timeout: 600000 });
  const row = { test: name, exitCode: run.status, error: run.error?.message,
    stdout: run.stdout ?? '', stderr: run.stderr ?? '' };
  results.push(row);
  console.log(`${run.status === 0 ? 'PASS' : 'FAIL'} ${name}`);
}
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync(process.env.MECHANICS_REPORT ?? 'output/mechanics-node-results.json', JSON.stringify(results, null, 2));
console.log(`${results.filter(row => row.exitCode === 0).length}/${results.length} checks passed; static server HTTP and live deployment checked separately.`);
process.exitCode = results.every(row => row.exitCode === 0) ? 0 : 1;
