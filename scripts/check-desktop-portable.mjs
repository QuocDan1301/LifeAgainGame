import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const executable = path.resolve('output/windows-release/LifeAgain-Windows-x64.exe');
const profile = fs.mkdtempSync(path.resolve('.tmp/life-again-desktop-test-portable-'));
const portFile = path.join(profile, 'DevToolsActivePort');
const launcher = spawn(executable, ['--user-data-dir=' + profile, '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1'], { windowsHide: true, stdio: 'ignore' });
let launchError;
launcher.on('error', error => { launchError = error; });
const deadline = Date.now() + 90000;
while (!fs.existsSync(portFile) && Date.now() < deadline && !launchError) await new Promise(resolve => setTimeout(resolve, 250));
if (launchError) throw launchError;
assert.ok(fs.existsSync(portFile), 'portable EXE must extract and open Electron');
const port = Number(fs.readFileSync(portFile, 'utf8').split('\n')[0]);
assert.ok(port > 0);
const browser = await chromium.connectOverCDP('http://127.0.0.1:' + port);
const out = path.resolve('output/desktop-check');
fs.mkdirSync(out, { recursive: true });
try {
  const context = browser.contexts()[0];
  await context.route(/^https?:/, route => route.abort());
  const page = context.pages()[0] ?? await context.waitForEvent('page');
  await page.waitForLoadState('load');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).opacity === '0');
  await page.reload();
  await page.locator('#new-life-button').waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).opacity === '0');
  assert.equal(page.url(), 'lifeagain://game.lifeagain/choi');
  assert.ok(await page.evaluate(async () => (await document.fonts.load('16px "Sriracha"')).length));
  await page.screenshot({ path: path.join(out, 'portable-exe.png') });
  await page.close();
  fs.writeFileSync(path.join(out, 'portable-results.json'), JSON.stringify({ portableExe: true, selfExtraction: true, offlineGameEntry: true, bundledFonts: true }, null, 2));
  console.log('PASS portable EXE: actual distributable extracts and opens the game offline with bundled fonts.');
} finally {
  for (const context of browser.contexts()) for (const page of context.pages()) await page.close().catch(() => {});
  await browser.close();
}
