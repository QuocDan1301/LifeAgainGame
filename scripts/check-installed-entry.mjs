import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { isInstalledApp, installationPage } from '../js/core/app-mode.js';

const options = { navigator: {}, matchMedia: () => ({ matches: false }) };
assert.equal(isInstalledApp(options), false);
assert.equal(isInstalledApp({ ...options, navigator: { standalone: true } }), true);
assert.equal(isInstalledApp({ ...options, matchMedia: () => ({ matches: true }) }), true);
const html = fs.readFileSync(new URL('../gioi-thieu.html', import.meta.url), 'utf8');
assert.doesNotMatch(html, /data-app-launch|location\.replace/, 'download page must never redirect automatically');
const site = fs.readFileSync(new URL('../site/site.js', import.meta.url), 'utf8');
assert.doesNotMatch(site, /if \(standalone.*location\.replace/, 'installed mode must keep the download page');
const source = fs.readFileSync(new URL('../js/entry.js', import.meta.url), 'utf8').replace('import("./boot.js")', 'loadBoot()');
for (const storageBlocked of [false, true]) {
  let loads = 0;
  const context = vm.createContext({
    localStorage: { setItem(key, value) {
      if (storageBlocked) throw new Error('Storage disabled');
      assert.equal(key, 'lifeAgain:launchGame');
      assert.equal(value, 'true');
    } },
    loadBoot: () => { loads++; return Promise.resolve(); }
  });
  vm.runInContext(source, context);
  assert.equal(loads, 1, 'shortcuts must boot even in browser mode or with storage blocked');
}
assert.equal(installationPage(new URL('https://game.test/choi?nhan=ABC234')), 'https://game.test/gioi-thieu?nhan=ABC234#cai-dat');
const manifest = JSON.parse(fs.readFileSync(new URL('../manifest.json', import.meta.url)));
assert.equal(manifest.id, './', 'preserve the old implicit app identity');
assert.equal(manifest.start_url, './choi');
console.log('PASS installed entry: browser shortcuts boot; home stays on downloads; explicit instructions accessible; iOS and standalone entry; stable PWA identity.');
