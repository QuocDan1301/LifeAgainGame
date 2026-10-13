"""Real-browser smoke checks with isolated storage and localhost serving."""
import functools
import http.server
import json
import sys
import tempfile
import threading
from pathlib import Path

sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'HoiSinhMediaTools'))
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
results = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        first = context.new_page()
        first.goto(base + '/index.html', wait_until='domcontentloaded')
        first.evaluate("""async () => {
          const {createInitialState}=await import('/js/core/state.js');
          const s=createInitialState();
          Object.assign(s.player,{age:18,money:10000000,health:80,happiness:80,intelligence:80,appearance:80,studyBlock:'A00'});
          s.logs=[{age:18,content:'Runtime smoke test'}];
          localStorage.setItem('lifeAgainSave',JSON.stringify(s));
          const {achievements}=await import('/js/achievements/achievements-data.js');
          localStorage.setItem('lifeAgainAchievements',JSON.stringify(Object.fromEntries(achievements.map(a=>[a.id,true]))));
          localStorage.setItem('lifeAgainAchievementQueue','[]');
        }""")
        first.reload(wait_until='domcontentloaded')
        first.locator('#continue-button').click()
        first.locator('#game-screen').wait_for(state='visible', timeout=20000)
        second = context.new_page()
        second.goto(base + '/index.html', wait_until='domcontentloaded')
        second.locator('#continue-button').click()
        second.wait_for_function("document.getElementById('lobby-message').textContent.includes('tab khác')")
        assert second.locator('#lobby-screen').is_visible()
        results.append('PASS real tabs: a second playing session is blocked')

        first.evaluate("""async () => {
          window.originalStorageWrite=Storage.prototype.setItem;
          Storage.prototype.setItem=function(key,value){if(key==='lifeAgainSave')throw new DOMException('Full','QuotaExceededError');return window.originalStorageWrite.call(this,key,value);};
          const {state}=await import('/js/core/state.js');
          const {saveGame}=await import('/js/core/save-store.js');
          state.player.money=12345678;
          try{saveGame(state);}catch(e){}
        }""")
        first.locator('#save-error-dialog').wait_for(state='visible')
        first.evaluate("() => { Storage.prototype.setItem=window.originalStorageWrite; }")
        first.locator('#save-error-dialog button').click()
        first.wait_for_function("!document.getElementById('save-error-dialog')")
        assert first.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave')).player.money") == 12345678
        results.append('PASS quota error: visible pause, retry and preserved money after reload')
        first.close()
        second.locator('#continue-button').click()
        second.locator('#game-screen').wait_for(state='visible', timeout=20000)
        results.append('PASS lock released: remaining tab can enter after the first closes')
        second.locator('#app-loader').wait_for(state='hidden')
        second.screenshot(path=str(ROOT / 'output' / 'runtime-mobile.png'), full_page=True)
        assert second.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        results.append('PASS 390px viewport: no horizontal page overflow')
        context.close()
        browser.close()
finally:
    server.shutdown()
    (ROOT / 'output' / 'runtime-browser-results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    for row in results:
        print(row, flush=True)
