import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { isInstalledApp, installationPage } from '../js/core/app-mode.js';

const options = { navigator: {}, matchMedia: () => ({ matches: false }) };
assert.equal(isInstalledApp(options), false);
assert.equal(isInstalledApp({ ...options, navigator: { standalone: true } }), true);
assert.equal(isInstalledApp({ ...options, matchMedia: () => ({ matches: true }) }), true);
for (const mode of ['standalone', 'minimal-ui', 'window-controls-overlay']) {
  const media = query => ({ matches: query === '(display-mode: ' + mode + ')' });
  assert.equal(isInstalledApp({ ...options, matchMedia: media }), true);
  const html = fs.readFileSync(new URL('../gioi-thieu.html', import.meta.url), 'utf8');
  const launch = html.match(/<script data-app-launch>([\s\S]*?)<\/script>/)[1];
  for (const pathname of ['/', '/gioi-thieu', '/gioi-thieu.html']) {
    let redirected;
    const current = new URL('https://game.test' + pathname + '?from=installed');
    vm.runInNewContext(launch, { navigator: {}, window: { matchMedia: media }, URL,
      location: { href: current.href, search: current.search, replace: url => { redirected = url; } } });
    assert.equal(redirected, 'https://game.test/choi?from=installed', mode + ' launch at ' + pathname);
  }
}
{
  const html = fs.readFileSync(new URL('../gioi-thieu.html', import.meta.url), 'utf8');
  const launch = html.match(/<script data-app-launch>([\s\S]*?)<\/script>/)[1];
  let redirects = 0;
  vm.runInNewContext(launch, { navigator: {}, window: { matchMedia: options.matchMedia },
    location: { replace: () => { redirects++; } } });
  assert.equal(redirects, 0, 'ordinary browsers keep the public introduction');
}

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
