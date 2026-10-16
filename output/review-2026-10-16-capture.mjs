import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const root=process.cwd(), out='output/review-2026-10-16';
const seed=fs.readFileSync('scripts/check-mobile-layout.py','utf8').match(/SEED = """([\s\S]*?)"""/)[1];
try{for(const width of [360,390,1280]){
 const c=await browser.newContext({viewport:{width,height:width===1280?900:844},reducedMotion:'reduce'});
 await c.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname!=='review.test')return r.abort();const file=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))return r.abort();try{await r.fulfill({body:fs.readFileSync(file),contentType:({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]??'application/octet-stream'});}catch{await r.fulfill({status:404,body:''});}});
 const p=await c.newPage();await p.goto('https://review.test/');await p.evaluate('('+seed+')()');await p.reload();await p.locator('#continue-button').click();await p.locator('#app-loader').waitFor({state:'hidden'});
 await p.locator('#game-screen').waitFor({state:'visible'});await p.waitForFunction(()=>document.querySelector('#app-loader').classList.contains('is-hidden'));await p.waitForTimeout(350);await p.screenshot({path:`${out}/main-${width}.png`});
 await p.locator('#assets').click();await p.locator('#open-family-budget').click();await p.screenshot({path:`${out}/budget-${width}.png`});await p.keyboard.press('Escape');if(await p.locator('dialog[open]').count())await p.keyboard.press('Escape');
 await p.locator('#activities').click();await p.locator('#activity-garden').click();await p.screenshot({path:`${out}/garden-${width}.png`});
 await c.close();console.log('Captured '+width);
}}finally{await browser.close();}
