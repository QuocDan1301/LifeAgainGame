import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { isInstalledApp, installationPage } from '../js/core/app-mode.js';

const options = { navigator: {}, matchMedia: () => ({ matches: false }) };
assert.equal(isInstalledApp(options), false);
assert.equal(isInstalledApp({ ...options, navigator: { standalone: true } }), true);
assert.equal(isInstalledApp({ ...options, matchMedia: () => ({ matches: true }) }), true);

const source = fs.readFileSync(new URL('../js/entry.js', import.meta.url), 'utf8').replace(/^import .*;\r?\n/, '').replace('import("./boot.js")', 'loadBoot()');
for (const installed of [false, true]) {
  const redirects = []; let loads = 0;
  const context = vm.createContext({ document: { documentElement: { hasAttribute: () => true } },
    isInstalledApp: () => installed, installationPage: () => 'https://game.test/gioi-thieu#cai-dat',
    location: { replace: url => redirects.push(url) }, loadBoot: () => { loads++; return Promise.resolve(); } });
  vm.runInContext(source, context);
  assert.equal(loads, installed ? 1 : 0, 'ordinary browser must not initialize the game');
  assert.equal(redirects.length, installed ? 0 : 1);
}
assert.equal(installationPage(new URL('https://game.test/choi?nhan=ABC234')), 'https://game.test/gioi-thieu?nhan=ABC234#cai-dat');
const manifest = JSON.parse(fs.readFileSync(new URL('../manifest.json', import.meta.url)));
assert.equal(manifest.id, './', 'preserve the old implicit app identity');
assert.equal(manifest.start_url, './choi');
console.log('PASS installed entry: browser redirect without boot; iOS and standalone entry; transfer query retained; stable PWA identity.');
