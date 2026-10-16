import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { GAME_URL, localFile, externalUrl } from '../desktop/runtime.mjs';

const root = path.resolve('desktop/app/game');
assert.equal(localFile(root, GAME_URL), path.join(root, 'index.html'));
for (const url of ['file:///etc/passwd', 'lifeagain://evil/choi', 'lifeagain://game.lifeagain/%2e%2e%5csecret',
  'lifeagain://game.lifeagain/.env', 'lifeagain://game.lifeagain/%00', 'lifeagain://game.lifeagain/%ZZ']) {
  assert.equal(localFile(root, url), null, url);
}
assert.equal(externalUrl('https://example.com/'), 'https://example.com/');
for (const url of ['file:///C:/Windows/notepad.exe', 'javascript:alert(1)', 'http://example.com/', 'https://user:pass@example.com/']) assert.equal(externalUrl(url), null);

const require = createRequire(import.meta.url);
const { _electron: electron } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const executablePath = process.env.DESKTOP_EXE ?? JSON.parse(fs.readFileSync('output/windows-release/build-info.json', 'utf8')).unpackedExecutable;
assert.ok(fs.existsSync(executablePath), 'Build the Windows app first: npm run desktop:build');
const out = path.resolve('output/desktop-check');
fs.mkdirSync(out, { recursive: true });
const profile = fs.mkdtempSync(path.resolve('.tmp/life-again-desktop-test-'));
const errors = [];
let lifeId;
for (let run = 0; run < 2; run++) {
  const electronApp = await electron.launch({ executablePath, args: ['--user-data-dir=' + profile], timeout: 60000 });
  try {
    // Block all network requests before opening/creating the life: local game still works.
    await electronApp.evaluate(({ session }) => session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      callback({ cancel: /^https?:/.test(details.url) });
    }));
    const page = await electronApp.firstWindow();
    page.on('pageerror', error => errors.push(error.message));
    await page.locator('#new-life-button').waitFor({ state: 'visible', timeout: 60000 });
    await page.waitForLoadState('load');
    await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).opacity === '0');
    await page.reload({ waitUntil: 'load' });
    await page.locator('#new-life-button').waitFor({ state: 'visible', timeout: 60000 });
    await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).opacity === '0');
    assert.equal(page.url(), GAME_URL);
    assert.equal(await page.locator('#install-link').isVisible(), false);
    assert.equal(await page.evaluate(() => typeof window.require), 'undefined');
    assert.equal(await page.evaluate(() => typeof window.process), 'undefined');
    assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-offline')), false);
    if (run === 0) {
      await page.locator('#ticket-seller').click();
      await page.locator('#ticket-form button[type=submit]').click();
      await page.locator('#new-life-button').click();
      await page.locator('#random-character-button').click();
      await page.locator('#random-gender-male').click();
      await page.locator('#game-screen').waitFor({ state: 'visible' });
      lifeId = await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.lifeId);
      assert.ok(lifeId);
      await page.screenshot({ path: path.join(out, 'windows-game.png') });
    } else {
      await page.locator('#continue-button').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.lifeId), lifeId);
      await page.locator('#continue-button').click();
      await page.locator('#game-screen').waitFor({ state: 'visible' });
      await page.screenshot({ path: path.join(out, 'windows-resume.png') });
    }
    const resources = await page.evaluate(async () => {
      const results = await Promise.all(['/js/boot.js', '/css/style.css', '/img/Icon/android-icon-192x192.png'].map(async url => (await fetch(url)).ok));
      return results;
    });
    assert.deepEqual(resources, [true, true, true]);
    const fonts = await page.evaluate(async () => {
      const loaded = await document.fonts.load('16px "Sriracha"');
      return loaded.length;
    });
    assert.ok(fonts > 0, 'the Windows font must be bundled and load offline');
  } finally { await electronApp.close(); }
}
assert.deepEqual(errors, []);
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ packagedExecutable: true, offlinePlay: true,
  saveAfterRestart: true, rendererIsolated: true, localAssets: true, errors }, null, 2));
console.log('PASS Windows EXE: opens the game; creates a life offline; resumes after closing; packaged JS/CSS/images load; no Node in renderer; path traversal blocked.');
