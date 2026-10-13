"""Validate everyday balance and saved result confirmation in the browser."""
import functools
import http.server
import sys
import tempfile
import threading
from pathlib import Path

sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'HoiSinhMediaTools'))
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = http.server.ThreadingHTTPServer(
    ('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        # Cố định may rủi ở mức giữa để kết quả đúng bằng điểm tác giả viết.
        page.add_init_script('Math.random = () => 0.5;')
        page.goto(base + '/index.html')
        cases = page.evaluate("""async () => {
          const {getAgeEvents}=await import('/js/events/events.js');
          const automatic = Array.from({length:10},(_,i)=>i+1).flatMap(age =>
            getAgeEvents(age).filter(e=>e.automaticResult).map(event=>({age,id:event.id,index:0,
              automatic:true,label:'Đồng ý',effects:event.choices[0].effects})));
          return automatic.concat([3,19,32,50,88].flatMap(age => {
            const event=getAgeEvents(age).find(e=>e.addedEveryday && e.choices.length===3)
              ?? getAgeEvents(age).find(e=>!e.automaticResult && e.choices?.length>=2);
            return event.choices.map((choice,index)=>({age,id:event.id,index,label:choice.label,effects:choice.effects}));
          }));
        }""")
        for case in cases:
            page.evaluate("""async ({age,id}) => {
              const {createInitialState}=await import('/js/core/state.js');
              const {getAgeEvents}=await import('/js/events/events.js');
              const {achievements}=await import('/js/achievements/achievements-data.js');
              const saved=createInitialState();
              Object.assign(saved.player,{age:age-1,health:60,intelligence:60,happiness:60,appearance:60,
                studyBlock:'A00',employmentStatus:'declined',datingActivitiesOnly:true,nextPromotionAge:null});
              saved.pendingEvent={...getAgeEvents(age).find(e=>e.id===id),stage:'choice',age};
              // Emulate a saved choice made before passive stories were introduced.
              delete saved.pendingEvent.automaticResult;
              localStorage.setItem('lifeAgainSave',JSON.stringify(saved));
              localStorage.setItem('lifeAgainAchievements',JSON.stringify(Object.fromEntries(achievements.map(a=>[a.id,true]))));
              localStorage.setItem('lifeAgainAchievementQueue','[]');
            }""", case)
            page.reload()
            page.locator('#continue-button').click()
            page.evaluate("() => import('/js/main.js')")
            page.locator('#event-dialog').wait_for(state='visible')
            if case.get('automatic'):
                assert page.locator('#event-choices button').count() == 0, 'Passive story showed a choice'
                assert page.locator('#event-confirm').inner_text() == 'Đồng ý'
            else:
                button = page.locator('#event-choices button').nth(case['index'])
                assert button.inner_text() == case['label'], 'Saved choice order changed'
                button.click()
            saved = page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave'))")
            assert saved['pendingEvent']['stage'] == 'result'
            if case.get('automatic'):
                assert 'Bạn chọn:' not in saved['pendingEvent']['logContent']
            assert saved['player']['age'] == case['age'] - 1
            for stat in ['health', 'intelligence', 'happiness', 'appearance']:
                assert saved['player'][stat] == 60, 'Preview applied stats early'
                assert saved['pendingEvent']['updates'].get(stat, 60) == 60 + case['effects'].get(stat, 0)
            page.reload()
            page.locator('#continue-button').click()
            page.evaluate("() => import('/js/main.js')")
            page.locator('#event-confirm').evaluate('button=>button.click()')
            settled = page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave'))")
            assert settled['player']['age'] == case['age'] and not settled['pendingEvent']
            for stat in ['health', 'intelligence', 'happiness', 'appearance']:
                reward = saved['pendingEvent'].get('schoolReward') or {}
                expected = reward.get('updates', {}).get(stat, 60 + case['effects'].get(stat, 0))
                assert settled['player'][stat] == expected, 'Result changed after reload'
            page.locator('#event-confirm').evaluate('button=>button.click()')
            assert page.evaluate("JSON.parse(localStorage.getItem('lifeAgainSave'))") == settled
        assert not errors, errors
        print(f'PASS: {len(cases)} mobile browser choices, including third actions; result previews, reloads and exactly-once confirmation.', flush=True)
        browser.close()
finally:
    server.shutdown()
