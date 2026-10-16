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
const source = fs.readFileSync(new URL('../js/entry.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/, '').replace('import("./boot.js")', 'loadBoot()');
for (const [ua, installed, protocol, expected] of [
  ['Windows NT 10.0', false, 'https:', false], ['Windows NT 10.0', true, 'https:', false],
  ['Android', false, 'https:', false], ['Android', true, 'https:', true],
  ['iPhone', false, 'https:', false], ['iPhone', true, 'https:', true],
  ['Macintosh', true, 'https:', false], ['Windows NT 10.0', false, 'lifeagain:', true]
]) {
  let loads = 0, redirects = 0;
  vm.runInNewContext(source, {
    navigator: { userAgent: ua, maxTouchPoints: 0 },
    location: { protocol, replace: () => redirects++ },
    localStorage: { setItem() {} }, isInstalledApp: () => installed,
    installationPage: () => 'https://game.test/gioi-thieu#cai-dat',
    loadBoot: () => { loads++; return Promise.resolve(); }
  });
  assert.equal(loads, expected ? 1 : 0, ua + ' ' + protocol + ' installed=' + installed);
  assert.equal(redirects, expected ? 0 : 1);
}
assert.equal(installationPage(new URL('https://game.test/choi?nhan=ABC234')), 'https://game.test/caigame.html?nhan=ABC234#cai-dat');
const manifest = JSON.parse(fs.readFileSync(new URL('../manifest.json', import.meta.url)));
assert.equal(manifest.id, './', 'preserve the old implicit app identity');
assert.equal(manifest.start_url, './choi');
console.log('PASS installed entry: PC web blocked; mobile browser blocked; installed mobile and Windows EXE allowed; home stays on downloads.');
