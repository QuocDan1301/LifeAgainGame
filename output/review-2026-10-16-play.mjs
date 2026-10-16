import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(), out='output/review-2026-10-16';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const modes=process.argv.length>2?process.argv.slice(2):['newcomer','serious','explorer','optimizer','stress'];
const resultFile=process.env.REVIEW_RESULT??(process.argv.length>2?'lives-followup.json':'lives.json');
async function run(mode,index){
 const context=await browser.newContext({viewport:{width:index===0?1280:390,height:index===0?900:844},reducedMotion:'reduce'});
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='review.test')return route.abort(); const file=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))return route.abort();try{await route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]??'application/octet-stream'});}catch{await route.fulfill({status:404,body:''});}});
 const page=await context.newPage();page.setDefaultTimeout(4000);
 const r={mode,events:[],actions:[],errors:[],reloads:0};results.push(r);
 page.on('pageerror',e=>r.errors.push(e.message));
 const snap=()=>page.evaluate(async()=>{const {state}=await import('/js/core/state.js');return {player:JSON.parse(JSON.stringify(state.player)),pending:state.pendingEvent?{title:state.pendingEvent.title,stage:state.pendingEvent.stage,age:state.pendingEvent.age}:null,dialogs:[...document.querySelectorAll('dialog[open]')].map(x=>x.id),saved:JSON.parse(localStorage.getItem('lifeAgainSave')??'null'),logs:state.logs.slice(-2)};});
 const click=async sel=>{await page.locator(sel).click();r.actions.push(sel);};
 try{
  await page.goto('https://review.test/');await page.locator('#app-loader').waitFor({state:'hidden'});
  await click('#new-life-button');r.zeroTicketMessage=await page.locator('#lobby-message').innerText();
  await click('#ticket-seller');await page.locator('#ticket-quantity').fill('2');await click('#ticket-form button[type=submit]');
  await click('#new-life-button');await click('#custom-character-button');await page.locator('#new-character-name').fill('Kiểm Thử');await page.locator('#new-character-province').fill('Huế');if(index%2)await page.locator('input[name=character-gender][value=female]').check();await click('#create-character-form button[type=submit]');await page.locator('#game-screen').waitFor({state:'visible'});r.initial=(await snap()).player;
  await page.locator('#app-loader').waitFor({state:'hidden'});await page.screenshot({path:`${out}/${mode}-start.png`});
  let steps=0, lastActionAge=-1;
  while(steps++<380){
   let s=await snap();r.last=s;
   if(s.player.isAlive===false){r.deathAge=s.player.age;r.deathCause=s.player.deathCause;await page.screenshot({path:`${out}/${mode}-death.png`});break;}
   const ds=s.dialogs;
   if(ds.includes('event-dialog')){
    if(s.pending?.stage==='choice'){
     const choices=page.locator('#event-choices button:visible:not([disabled])');const labels=await choices.allTextContents();let n=0;
     if(mode==='explorer'||mode==='stress')n=labels.length-1;
     if(mode==='serious'||mode==='optimizer'){
      const good=/học|chăm|tiết kiệm|đi khám|nghỉ ngơi|đồng ý|chấp nhận|giúp|luyện|chuẩn bị|an toàn|từ chối|trung thực|gia đình/i;
      const bad=/bỏ học|không học|không chăm|không giúp|không chuẩn|trốn|đánh|cá cược|liều|bỏ qua|hút|uống rượu/i;
      const i=labels.findIndex(x=>good.test(x)&&!bad.test(x));if(i>=0)n=i;
      if(process.env.REVIEW_CAREFUL==='1'){
       if(s.pending.title.includes('Chọn hướng đi')){const career=labels.findIndex(x=>/Công nghệ thông tin/.test(x));if(career>=0)n=career;}
       if(/\(\d\/\d\)/.test(s.pending.title)){const k=labels.findIndex(x=>/thử|tiếp|bắt đầu|luyện|kiểm tra|ghi|sửa/i.test(x)&&!bad.test(x));if(k>=0)n=k;}
      }
     }
     r.events.push({age:s.pending.age,title:s.pending.title,choices:labels,selected:labels[n]});
     await page.waitForTimeout(370);await choices.nth(n).click();
    }else{
     r.events.push({age:s.pending?.age,result:await page.locator('#event-content').innerText()});await page.waitForTimeout(370);await click('#event-confirm');
     if(mode==='stress'&&await page.locator('#event-confirm').isVisible())await page.locator('#event-confirm').click({timeout:600}).catch(()=>{});
    }
   }else if(ds.includes('study-block-dialog')){await page.locator('#study-block-dialog button:visible:not([disabled])').first().click();}
   else if(ds.length){
    const id=ds.at(-1);const dialog=page.locator('#'+id);
    const close=dialog.locator('button:visible:not([disabled])');
    const names=await close.allTextContents();r.actions.push({dialog:id,buttons:names});
    if(!names.length){r.blocker='No enabled button in '+id;break;}
    const c=names.findIndex(x=>/đóng|đã hiểu|tiếp tục|để sau|vẫn|xác nhận|sang năm/i.test(x));await close.nth(c>=0?c:names.length-1).click();
   }else{
    if(process.env.REVIEW_CAREFUL==='1' && s.player.age>=16 && (s.player.illnesses??[]).length && !r.actions.some(x=>x?.healedAge===s.player.age)){
     await click('#activities');await click('#activity-hospital');const treatment=page.locator('.hospital-illness .shop-buy:not([disabled])');
     if(await treatment.count()){await treatment.first().click();await click('#shop-confirm');r.actions.push({healedAge:s.player.age});}
     else r.actions.push({healedAge:s.player.age,unaffordable:true});
     await page.keyboard.press('Escape');continue;
    }
    if(s.player.age>=16 && s.player.age%7===0 && lastActionAge!==s.player.age){
     lastActionAge=s.player.age;
     if(mode==='explorer'||mode==='optimizer'||mode==='serious'){
      await click('#activities');const id=mode==='explorer'?'#activity-tarot':mode==='optimizer'?'#activity-part-time':'#activity-self-development';
      if(await page.locator(id).isVisible()&&await page.locator(id).isEnabled())await click(id);r.actions.push({age:s.player.age,explored:id});
      if(process.env.REVIEW_CAREFUL==='1' && mode==='serious' && await page.locator('#self-development-dialog[open]').count()){
       await page.locator('#self-development-body [data-stat=health]').click();const free=page.locator('.dev-recover:not([disabled])');if(await free.count())await free.first().click();
      }
      if(process.env.REVIEW_CAREFUL==='1' && mode==='optimizer' && await page.locator('#side-job-dialog[open]').count()){
       const job=page.locator('#side-job-body .shop-buy:not([disabled])');if(await job.count()){await job.first().click();if(await page.locator('#shop-confirm-dialog[open]').count())await click('#shop-confirm');}
      }
      r.actions.push({text:await page.locator('dialog[open]').last().innerText()});
      await page.keyboard.press('Escape');if(await page.locator('dialog[open]').count())await page.keyboard.press('Escape');
     }
     if(s.player.age>=14){const before=JSON.stringify(s.player);await page.reload();await page.locator('#continue-button').click();await page.locator('#game-screen').waitFor({state:'visible'});const after=await snap();r.reloads++;r.actions.push({age:s.player.age,reloadPreserved:before===JSON.stringify(after.player),pending:after.pending});continue;}
    }
    await click('#age-up');
    if(mode==='stress'&&!(await page.locator('dialog[open]').count()))await page.locator('#age-up').dblclick();
   }
  }
  r.steps=steps;r.last=await snap();
  if(r.deathAge!==undefined){
   r.ageDisabledAfterDeath=await page.locator('#age-up').isDisabled();
   await click('#return-after-death');await click('#open-life-archive');r.archive=await page.locator('#life-archive-dialog').innerText();await page.keyboard.press('Escape');
   await click('#new-life-button');await click('#random-character-button');await click('#random-gender-male');await page.locator('#game-screen').waitFor({state:'visible'});r.replay=await snap();
  }
 }catch(e){r.failure=e.stack;await page.screenshot({path:`${out}/${mode}-failure.png`}).catch(()=>{});r.last=await snap().catch(()=>null);}
 fs.writeFileSync(`${out}/${resultFile}`,JSON.stringify(results,null,2));console.log(JSON.stringify({mode,age:r.last?.player.age,deathAge:r.deathAge,steps:r.steps,events:r.events.length,replay:!!r.replay,failure:r.failure?.split('\n')[0],blocker:r.blocker}));await context.close();
}
try{for(let i=0;i<modes.length;i++)await run(modes[i],i);}finally{await browser.close();fs.writeFileSync(`${out}/${resultFile}`,JSON.stringify(results,null,2));}
