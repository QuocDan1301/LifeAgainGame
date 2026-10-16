import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createGameServer } from '../server/game-server.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? 'C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const server = createGameServer({ root: fs.realpathSync('dist') });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const out = 'output/installation'; fs.mkdirSync(out, { recursive: true });
const rows = [];
try {
  for (const [width, height, ua] of [[390,844,'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36'],[360,800,'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'],[1280,900,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36']]) {
    const context = await browser.newContext({ viewport:{width,height}, userAgent:ua, serviceWorkers:'block' });
    const page = await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.goto(base+'/');
    await page.locator('.device-picker').waitFor({state:'visible'});
    assert.equal(await page.locator('#lobby-screen').count(),0);
    const expected=width===360?'tab-ios':width===390?'tab-android':'tab-desktop';
    assert.equal(await page.locator('#'+expected).getAttribute('aria-selected'),'true');
    await page.locator('.hero-actions a[href="#cai-dat"]').click();
    await page.screenshot({path:`${out}/intro-${width}.png`,fullPage:true});
    if (width !== 360) {
      await page.evaluate(() => {
        const event = new Event('beforeinstallprompt', { cancelable: true });
        event.prompt = async () => { window.installPromptCalls = (window.installPromptCalls ?? 0) + 1; };
        event.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(event);
      });
      await page.locator('#install-button').click();
      assert.equal(await page.evaluate(() => window.installPromptCalls), 1);
      await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
      assert.equal(await page.locator('#install-done').isVisible(), true);
    }
    await page.locator('#tab-ios').click();assert.equal(await page.locator('#panel-ios').isVisible(),true);
    await page.locator('#tab-ios').press('ArrowRight');assert.equal(await page.locator('#panel-desktop').isVisible(),true);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
    await page.goto(base+'/choi?nhan=ABC234');await page.waitForURL('**/gioi-thieu?nhan=ABC234#cai-dat');
    assert.equal(await page.locator('#transfer-pending').isVisible(),true);
    await page.evaluate(()=>localStorage.setItem('lifeAgainSave','test-save-kept'));await page.reload();
    const downloadPromise=page.waitForEvent('download');await page.locator('#download-browser-backup').click();const download=await downloadPromise;
    const contents=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(contents.data.lifeAgainSave,'test-save-kept');
    assert.equal(await page.evaluate(()=>localStorage.getItem('lifeAgainSave')),'test-save-kept');
    assert.deepEqual(errors,[]);rows.push({width,expected,overflow,errors,backup:true,redirect:true});
    await context.close();
  }
  for (const mode of ['standalone', 'minimal-ui', 'window-controls-overlay', 'ios']) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    await context.addInitScript(mode => {
      if (mode === 'ios') Object.defineProperty(navigator, 'standalone', { get: () => true });
      else {
        const nativeMedia = window.matchMedia.bind(window);
        window.matchMedia = query => {
          const result = nativeMedia(query);
          if (query === '(display-mode: ' + mode + ')') Object.defineProperty(result, 'matches', { value: true });
          return result;
        };
      }
    }, mode);
    const page = await context.newPage();
    // Even if the old site bundle is unavailable, the installed app must open the game.
    await page.route('**/site/site.js', route => route.abort());
    for (const entry of ['/', '/gioi-thieu', '/gioi-thieu.html']) {
      await page.goto(base + entry + '?from=installed');
      await page.waitForURL('**/choi?from=installed');
      await page.locator('#new-life-button').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#lobby-screen').isVisible(), true);
      await page.waitForFunction(() => getComputedStyle(document.getElementById('app-loader')).opacity === '0');
      await page.locator('#ticket-seller').click();
      await page.locator('#tickets-dialog').waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
    }
    await page.screenshot({ path: out + '/installed-launch-' + mode + '.png' });
    rows.push({ installedPwaEntry: true, mode, aliases: 3, worksWithoutSiteBundle: true });
    await context.close();
  }
  const offlineContext = await browser.newContext();
  await offlineContext.addInitScript(() => Object.defineProperty(navigator, 'standalone', { get: () => true }));
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(base + '/choi');
  await offlinePage.locator('#new-life-button').waitFor({ state: 'visible' });
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 60000 });
  await offlinePage.locator('#ticket-seller').click();
  await offlinePage.locator('#ticket-form button[type=submit]').click();
  await offlinePage.locator('#new-life-button').click();
  await offlinePage.locator('#random-character-button').click();
  await offlinePage.locator('#random-gender-male').click();
  await offlinePage.locator('#game-screen').waitFor({ state: 'visible' });
  const savedLife = await offlinePage.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.lifeId);
  await offlineContext.setOffline(true);
  await offlinePage.goto(base + '/choi');
  await offlinePage.locator('#continue-button').waitFor({ state: 'visible' });
  assert.equal(await offlinePage.evaluate(() => JSON.parse(localStorage.getItem('lifeAgainSave')).player.lifeId), savedLife);
  await offlinePage.goto(base + '/');
  await offlinePage.waitForURL('**/choi');
  await offlinePage.locator('#continue-button').waitFor({ state: 'visible' });
  rows.push({ nativeServiceWorkerOfflineEntry: true, savedLifeRetained: true });
  await offlineContext.close();
  console.log('PASS installation UI: three device layouts; platform tabs and keyboard; desktop/Android install prompt; browser entry gate; backup download preserves data; installed PWA root migration; real offline worker retains saved life.');
} finally {fs.writeFileSync(`${out}/results.json`,JSON.stringify(rows,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));}
