"""Check all animated OpenMoji and real saved-dialog/gameplay flows."""
import functools
import http.server
import sys
import tempfile
import threading
from pathlib import Path
sys.path.insert(0,str(Path(tempfile.gettempdir())/'HoiSinhMediaTools'))
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
class AssetServer(http.server.ThreadingHTTPServer):
    request_queue_size=128
server=AssetServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
output=ROOT/'.media-review';output.mkdir(exist_ok=True)
try:
  with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True)
    page=browser.new_page(viewport={'width':580,'height':780})
    errors=[];missing=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('response',lambda response:missing.append(response.url) if response.status>=400 and '/openmoji/' in response.url else None)
    for test,selector in [('check-event-media.html','#result')]+([('check-everyday-expansion.html','#expansion-result')] if '--expansion' in sys.argv else []):
      page.goto(base+'/scripts/'+test)
      page.wait_for_function(f"/^(PASS|FAIL)/.test(document.querySelector('{selector}').textContent)",timeout=120000)
      report=page.locator(selector).inner_text();print(report,flush=True);assert report.startswith('PASS'),report
    page.goto(base+'/index.html')
    loaded="document.querySelector('#event-dialog').open && document.querySelector('#event-image').complete && document.querySelector('#event-image').naturalWidth>0 && !document.querySelector('#event-image').hidden"
    def seed_hike():
      page.evaluate("""async()=>{
        const {createInitialState}=await import('/js/state.js');const {getAgeEvents}=await import('/js/events.js');
        const saved=createInitialState();saved.player.age=12;saved.player.health=80;
        saved.pendingEvent={...getAgeEvents(13).find(event=>event.id==='teen-13-2'),stage:'choice',age:13,image:'/removed-image.svg',imageOptions:[]};
        localStorage.setItem('lifeAgainSave',JSON.stringify(saved));
      }""")
      page.reload();page.locator('#continue-button').click();page.wait_for_function(loaded)
    seed_hike()
    assert '/openmoji/animated/svg/1F6B6.svg' in page.locator('#event-image').get_attribute('src')
    before=page.locator('#event-image').screenshot();page.wait_for_timeout(370)
    assert before!=page.locator('#event-image').screenshot(),'OpenMoji visibly animates'
    page.locator('#event-dialog').screenshot(path=str(output/'openmoji-hike.png'))
    page.locator('#event-choices button').first.click();page.wait_for_function(loaded)
    assert '/animated/svg/1F4F8.svg' in page.locator('#event-image').get_attribute('src')
    source=page.locator('#event-image').get_attribute('src')
    page.reload();page.locator('#continue-button').click();page.wait_for_function(loaded)
    assert page.locator('#event-image').get_attribute('src')==source,'Reviewed result survives reload'
    page.locator('#event-dialog').screenshot(path=str(output/'openmoji-photo.png'))
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_function("document.querySelector('#event-image').src.includes('/color/svg/') && document.querySelector('#event-image').complete")
    page.locator('#event-image').evaluate('image=>image.decode()')
    still=page.locator('#event-image').screenshot();page.wait_for_timeout(370)
    assert still==page.locator('#event-image').screenshot(),'Original OpenMoji is static in reduced-motion mode'
    page.emulate_media(reduced_motion='no-preference')
    seed_hike();page.locator('#event-choices button').nth(1).click();page.wait_for_function(loaded)
    assert '/animated/svg/1F62E-200D-1F4A8.svg' in page.locator('#event-image').get_attribute('src')
    page.evaluate("""async()=>{
      const {createInitialState}=await import('/js/state.js');const {createLostChildSpecialStep}=await import('/js/special-event-10.js');
      const saved=createInitialState();saved.player.age=9;saved.player.health=80;
      saved.pendingEvent={...createLostChildSpecialStep(1),stage:'choice',age:10};localStorage.setItem('lifeAgainSave',JSON.stringify(saved));
    }""")
    page.reload();page.locator('#continue-button').click();page.wait_for_function(loaded)
    page.locator('#event-choices button').first.click();page.wait_for_function(loaded)
    assert page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave')).pendingEvent.mediaTransition")
    assert page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave')).player.age")==9
    page.locator('#event-confirm').click();page.wait_for_function(loaded)
    assert page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave')).pendingEvent.specialStep")==2
    page.goto(base+'/scripts/check-event-media.html')
    page.wait_for_function("/^(PASS|FAIL)/.test(document.querySelector('#result').textContent)",timeout=120000)
    decoded=page.evaluate("""async()=>{
      const {openMojiCatalog}=await import('/js/openmoji-catalog.js');
      const audit=await(await fetch('/js/img/events/full-media-audit.json')).json();
      const paths=[...new Set([...Object.keys(openMojiCatalog).map(code=>'/js/img/events/openmoji/animated/svg/'+code+'.svg'),...audit.map(row=>'/'+row.fallback)])];
      const failures=[];
      for(let start=0;start<paths.length;start+=8)await Promise.all(paths.slice(start,start+8).map(path=>new Promise(resolve=>{
        const image=new Image();image.onload=()=>{if(!image.naturalWidth)failures.push(path);resolve()};image.onerror=()=>{failures.push(path);resolve()};image.src=path;
      })));
      return {count:paths.length,failures};
    }""")
    assert not decoded['failures'],decoded
    page.set_viewport_size({'width':1100,'height':850})
    page.evaluate("""async()=>{
      document.body.innerHTML='<div id="sheet"></div>';document.body.style='background:#fff8e1;font:16px Arial;margin:0';
      const sheet=document.querySelector('#sheet');sheet.style='display:grid;grid-template-columns:repeat(4,245px);gap:16px;padding:24px';
      for(const [code,name] of [['1F6B6','Đi bộ'],['1F4F8','Chụp ảnh'],['1F62E-200D-1F4A8','Nghỉ mệt'],['1F476','Em bé'],['1F4D6','Đọc sách'],['1F4DD','Ghi chép'],['1F9F9','Lau dọn'],['1F4F1','Điện thoại'],['1FAB4','Cây cảnh'],['1F6E0','Sửa đồ'],['2764','Tình cảm'],['1F415','Chó']]){
        const card=document.createElement('div');card.innerHTML=`<img width="210" height="210" src="/js/img/events/openmoji/animated/svg/${code}.svg"><p style="margin:0;text-align:center">${name}</p>`;sheet.append(card);
      }
      await Promise.all([...document.images].map(image=>image.decode()));
    }""")
    page.locator('#sheet').screenshot(path=str(output/'openmoji-preview.png'))
    assert not errors,errors;assert not missing,missing
    print(f'PASS: all 4495 animated icons decode ({decoded["count"]} assets including used original posters); visible SVG motion, static reduced motion, old saves, reload and intermediate results.',flush=True)
    browser.close()
finally:server.shutdown()
