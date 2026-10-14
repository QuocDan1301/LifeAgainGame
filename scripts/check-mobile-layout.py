"""Điện thoại: mở bến xe, màn chơi, mọi popup, tab và màn chơi con ở nhiều cỡ màn hình (dọc và ngang),
rồi kiểm tra tràn ngang, nội dung bị cắt, nút ✕ ra ngoài màn hình, vùng chạm nhỏ, chữ dưới 12px,
lỗi JavaScript và nút tăng tuổi phải nằm trọn trong màn hình.
Chạy: python scripts/check-mobile-layout.py [320x568,390x844,...] [--shots]  (ảnh lưu ở output/mobile/)."""
import functools, http.server, json, sys, tempfile, threading
from pathlib import Path
sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'HoiSinhMediaTools'))
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'mobile'
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
SIZES = [tuple(map(int, s.split('x'))) for s in (ARGS[0] if ARGS else '320x568,375x667,390x844,414x896,667x375,740x360').split(',')]
SHOTS = '--shots' in sys.argv
sys.stdout.reconfigure(encoding='utf-8')

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

SEED = """async () => {
  const { createInitialState } = await import('/js/core/state.js');
  const s = createInitialState();
  Object.assign(s.player, { name: 'Nguyễn Thị Phương Thảo', gender: 'female', province: 'Thừa Thiên Huế', age: 35, lifeSeed: 12345,
    money: 1_250_000_000, health: 72, happiness: 64, intelligence: 81, appearance: 58, studyBlock: 'A00',
    careerPath: { id: 'programming', field: 'Công nghệ thông tin', school: { id: 'hcmut', name: 'Trường Đại học Bách khoa TP.HCM', type: 'university' } },
    careerLevel: 2, employmentStatus: 'employed', job: 'Kỹ sư phần mềm', employedSince: 23, lastSalaryAge: 35, nextPromotionAge: 38,
    marriedAtAge: 29, partner: { id: 'p1', name: 'Trần Minh Khôi', gender: 'male', ageAtMeeting: 27, metAtAge: 26, relationship: 82 },
    children: [{ id: 'c1', name: 'Minh Anh', gender: 'female', initialAge: 0, joinedAtAge: 30, relationship: 80, coParent: { id: 'p1', name: 'Trần Minh Khôi' }, lastCarePaidAtAge: 35 },
               { id: 'c2', name: 'Gia Bảo', gender: 'male', initialAge: 0, joinedAtAge: 33, relationship: 80, coParent: { id: 'p1', name: 'Trần Minh Khôi' }, lastCarePaidAtAge: 35 }],
    relatives: [
      { id: 'father', role: 'Bố', name: 'Nguyễn Văn Ba', ageAtPlayerBirth: 31, alive: true, bond: 70, condition: 'weak', trackedFrom: 0, interactions: {}, done: {}, promise: null },
      { id: 'mother', role: 'Mẹ', name: 'Lê Thị Tư', ageAtPlayerBirth: 29, alive: true, bond: 74, condition: 'healthy', trackedFrom: 0, interactions: {}, done: {}, promise: null }],
    friends: [{ id: 'f1', name: 'Phạm Quốc Bảo', since: 16, bond: 60 }],
    licenses: ['car'], sideJobs: [], purchases: [{ id: 'house', uid: 'h1', boughtAtAge: 33 }],
    relationshipHistory: [{ age: 26, type: 'dating', text: 'Bắt đầu hẹn hò với Trần Minh Khôi.' }, { age: 29, type: 'married', text: 'Kết hôn.' }, { age: 30, type: 'child-born', text: 'Chào đón con Minh Anh.' }],
  });
  const { createAdmirer } = await import('/js/relationships/relationships.js');
  s.player.partner = { ...createAdmirer(s.player, 26, () => 0.4), id: 'p1', name: 'Trần Minh Khôi', gender: 'male', ageAtMeeting: 27, metAtAge: 26, relationship: 82 };
  s.player.relationshipHistory[0].person = s.player.partner;
  s.logs = Array.from({ length: 36 }, (_, age) => ({ age, content: `🎈 Năm ${age} tuổi: một năm với nhiều chuyện để nhớ, từ trường lớp, bạn bè tới gia đình và những lần đầu tiên trong đời.`, summary: `Năm ${age} tuổi` }));
  localStorage.setItem('lifeAgainSave', JSON.stringify(s));
  const { achievements } = await import('/js/achievements/achievements-data.js');
  localStorage.setItem('lifeAgainAchievements', JSON.stringify(Object.fromEntries(achievements.slice(0, Math.floor(achievements.length / 2)).map(a => [a.id, { unlockedAt: 'x' }]))));
  localStorage.setItem('lifeAgainAchievementQueue', '[]');
}"""

AUDIT = r"""(rootSel) => {
  const vw = innerWidth, vh = innerHeight;
  const scope = rootSel ? document.querySelector(rootSel) : document.body;
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const path = el => { const parts = []; for (let n = el; n && n !== document.body && parts.length < 3; n = n.parentElement) parts.unshift(name(n)); return parts.join(' > '); };
  const visible = el => { const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const scroller = el => { for (let p = el.parentElement; p && p !== scope; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && p !== document.body) return p; } return null; };
  const r = scope.getBoundingClientRect();
  // Popup có nút ✕ đặt ngoài khung: lớp .dialog-scroll mới là phần cuộn.
  const inner = scope.querySelector(':scope > .dialog-scroll') ?? scope;
  const out = { scope: rootSel || 'page', docOverflowX: Math.round(document.documentElement.scrollWidth - vw),
    box: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
    scopeOverflowX: Math.round(inner.scrollWidth - inner.clientWidth) };
  const corner = scope.querySelector(':scope > .dialog-corner-close');
  if (corner) { const b = corner.getBoundingClientRect(); out.closeInView = b.left >= 0 && b.right <= vw && b.top >= 0 && b.bottom <= vh; out.closeBox = [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }
  const cs = getComputedStyle(inner);
  out.vertical = { scrollH: inner.scrollHeight, clientH: inner.clientHeight, overflowY: cs.overflowY, beyondViewport: r.bottom > vh + 1 || r.top < -1 };
  const L = Math.max(0, r.left) - 1, R = Math.min(vw, r.right) + 1;
  const all = [...scope.querySelectorAll('*')].filter(el => visible(el) && !el.closest('.dialog-corner-close'));
  const offenders = all.filter(el => { const b = el.getBoundingClientRect(); if (!(b.right > R || b.left < L)) return false; const sc = scroller(el); if (sc) { const sb = sc.getBoundingClientRect(); if (sb.right <= R && sb.left >= L) return false; } return true; });
  const outer = offenders.filter(el => !offenders.includes(el.parentElement));
  out.overflowing = outer.slice(0, 8).map(el => { const b = el.getBoundingClientRect(); return `${path(el)} [${Math.round(b.left)}..${Math.round(b.right)}] "${(el.innerText || el.value || '').trim().slice(0, 40).replace(/\s+/g, ' ')}"`; });
  // Clipped text: element content wider than box with overflow hidden and no ellipsis.
  out.clipped = all.filter(el => { const s = getComputedStyle(el); return /(hidden|clip)/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 2 && s.textOverflow !== 'ellipsis' && el.clientWidth > 0 && el.children.length < 6 && el.innerText?.trim(); })
    .slice(0, 6).map(el => `${path(el)} (${el.scrollWidth}>${el.clientWidth}) "${el.innerText.trim().slice(0, 40).replace(/\s+/g, ' ')}"`);
  const targets = all.filter(el => el.matches('button, a[href], select, input:not([type=hidden]), summary, [role=button], [role=tab]'));
  const inView = el => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < vh * 3; };
  out.smallTargets = targets.filter(el => { const b = el.getBoundingClientRect(); return (b.width < 40 || b.height < 36) && !el.closest('.tarot-grid, .tien-len-hand, .tl-hand, .game-door'); })
    .slice(0, 12).map(el => { const b = el.getBoundingClientRect(); return `${path(el)} ${Math.round(b.width)}x${Math.round(b.height)}${el.disabled ? ' (disabled)' : ''} "${(el.innerText || el.getAttribute('aria-label') || el.value || '').trim().slice(0, 30).replace(/\s+/g, ' ')}"`; });
  out.smallTargetCount = targets.filter(el => { const b = el.getBoundingClientRect(); return b.width < 40 || b.height < 36; }).length;
  out.targetCount = targets.length;
  const texts = all.filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  const small = texts.filter(el => parseFloat(getComputedStyle(el).fontSize) < 12);
  out.smallText = small.slice(0, 6).map(el => `${path(el)} ${getComputedStyle(el).fontSize} "${el.innerText.trim().slice(0, 30).replace(/\s+/g, ' ')}"`);
  out.smallTextCount = small.length;
  out.minFont = texts.length ? Math.min(...texts.map(el => parseFloat(getComputedStyle(el).fontSize))) : null;
  const age = document.querySelector('#age-up');
  if (age && !rootSel) { const b = age.getBoundingClientRect(); out.ageUpInView = b.top >= 0 && b.left >= 0 && b.bottom <= vh && b.right <= vw; }
  return out;
}"""

CLOSE_ALL = """() => { document.querySelectorAll('dialog[open]').forEach(d => d.close()); const m = document.getElementById('menu-panel'); if (m && !m.hidden) document.getElementById('menu-button').click(); }"""
TOP = """() => { const d = [...document.querySelectorAll('dialog[open]')].at(-1); return d ? '#' + d.id : null; }"""

def scenes():
    s = [('main', []), ('menu', ['#menu-button']), ('achievements', ['#achievements']), ('fortune', ['#fortune-button']),
         ('assets', ['#assets']), ('budget', ['#assets', '#open-family-budget']), ('relationships', ['#relationships']),
         ('education', ['#education']), ('activities', ['#activities']), ('restart', ['#menu-button', '#restart-button'])]
    for a in ['self-development', 'hospital', 'food', 'beauty', 'love', 'degrees', 'jobs', 'part-time', 'repair-lessons', 'shopping',
              'pets', 'travel', 'game-center', 'games', 'tarot', 'lottery']:
        s.append((f'act-{a}', ['#activities', f'#activity-{a}']))
    return s

def run_size(p, w, h, report):
    browser = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
    ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=3, is_mobile=True, has_touch=True, reduced_motion='reduce')
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)[:200]))
    page.goto(BASE + '/index.html', wait_until='domcontentloaded')
    page.evaluate(SEED)
    page.reload(wait_until='domcontentloaded')
    page.wait_for_timeout(1200)
    tag = f'{w}x{h}'
    def measure(scene, sel=None):
        page.wait_for_timeout(350)
        res = page.evaluate(AUDIT, sel)
        res['scene'] = scene
        report.setdefault(tag, []).append(res)
        if SHOTS:
            (OUT / tag).mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(OUT / tag / f'{scene}.png'))
    measure('lobby')
    page.locator('#open-life-archive').click(); page.wait_for_timeout(300)
    measure('lobby-archive', page.evaluate(TOP)); page.evaluate(CLOSE_ALL)
    page.locator('#new-life-button').click(); page.wait_for_timeout(500)
    measure('lobby-new', page.evaluate(TOP)); page.evaluate(CLOSE_ALL)
    page.reload(wait_until='domcontentloaded'); page.wait_for_timeout(800)
    page.locator('#continue-button').click()
    page.locator('#game-screen').wait_for(state='visible', timeout=20000)
    page.wait_for_timeout(1500)
    page.evaluate(CLOSE_ALL)
    for scene, clicks in scenes():
        page.evaluate(CLOSE_ALL)
        ok = True
        for c in clicks:
            loc = page.locator(c)
            if not loc.count() or not loc.first.is_visible():
                ok = False; break
            try: loc.first.click(timeout=3000)
            except Exception as e: ok = False; break
            page.wait_for_timeout(250)
        if not ok:
            report.setdefault(tag, []).append({'scene': scene, 'skipped': f'cannot click {c}'}); continue
        top = page.evaluate(TOP)
        measure(scene, top)
        if top:
            tabs = page.locator(f'{top} [role=tab]')
            for i in range(1, tabs.count()):
                t = tabs.nth(i)
                if not t.is_visible(): continue
                label = (t.inner_text() or f'tab{i}').strip().split('\n')[0][:20]
                try: t.click(timeout=2000)
                except Exception: continue
                measure(f'{scene}~{label}', page.evaluate(TOP))
    # Quét sâu: từng mục trong danh sách rồi nút bắt đầu (nếu có).
    drills = [('games', ['#activities', '#activity-games'], '#games-body .game-pick', ['.game-start', '.auction-start']),
              ('gc', ['#activities', '#activity-game-center'], '#game-center-body .gc-game', ['.gc-start']),
              ('tarot', ['#activities', '#activity-tarot'], '#tarot-body .tarot-topic, #tarot-body .tarot-collection-open', ['.tarot-confirm', '.tarot-back-card']),
              ('lottery', ['#activities', '#activity-lottery'], '#lottery-body [role=tab], #lottery-body .shop-group', []),
              ('selfdev', ['#activities', '#activity-self-development'], '#self-development-body .shop-group', [])]
    for name, opens, item_sel, then in drills:
        def reopen():
            page.evaluate(CLOSE_ALL)
            for c in opens:
                page.locator(c).first.click(timeout=3000); page.wait_for_timeout(250)
        try: reopen()
        except Exception: continue
        count = page.locator(item_sel).count()
        for i in range(count):
            try:
                reopen()
                item = page.locator(item_sel).nth(i)
                if not item.is_visible(): continue
                label = (item.inner_text() or '').strip().split('\n')[0][:18]
                item.click(timeout=3000)
                measure(f'{name}-{i}-{label}', page.evaluate(TOP))
                for t in then:
                    nxt = page.locator(f'{page.evaluate(TOP) or "body"} {t}')
                    if nxt.count() and nxt.first.is_visible() and nxt.first.is_enabled():
                        nxt.first.click(timeout=3000); page.wait_for_timeout(600)
                        measure(f'{name}-{i}-{label}-play', page.evaluate(TOP))
                        break
            except Exception as e:
                report.setdefault(tag, []).append({'scene': f'{name}-{i}', 'skipped': str(e).splitlines()[0][:120]})
    page.evaluate(CLOSE_ALL)
    try:
        page.locator('#age-up').click(timeout=3000); page.wait_for_timeout(800)
        measure('event', page.evaluate(TOP))
        btn = page.locator('#event-dialog .event-choice, #event-dialog button.choice, #event-dialog .choices button')
        if btn.count(): btn.first.click(timeout=3000); page.wait_for_timeout(600); measure('event-result', page.evaluate(TOP))
    except Exception as e:
        report.setdefault(tag, []).append({'scene': 'event', 'skipped': str(e).splitlines()[0][:120]})
    report.setdefault('_errors', {})[tag] = errors
    browser.close()

def issues(r):
    if r.get('skipped'):
        return [f"không mở được: {r['skipped']}"]
    found = []
    if r['docOverflowX'] > 0: found.append(f"trang tràn ngang {r['docOverflowX']}px")
    if r['scopeOverflowX'] > 0: found.append(f"popup tràn ngang {r['scopeOverflowX']}px")
    found += [f'ra ngoài khung: {x}' for x in r['overflowing']]
    found += [f'chữ bị cắt: {x}' for x in r['clipped']]
    if r['vertical']['scrollH'] > r['vertical']['clientH'] + 2 and r['scope'] != 'page' and r['vertical']['overflowY'] not in ('auto', 'scroll'):
        found.append('nội dung popup bị cắt theo chiều dọc')
    if r.get('closeInView') is False: found.append(f"nút ✕ ra ngoài màn hình {r.get('closeBox')}")
    found += [f'vùng chạm nhỏ: {x}' for x in r['smallTargets']]
    found += [f'chữ dưới 12px: {x}' for x in r['smallText']]
    if r['scene'] == 'main' and r.get('ageUpInView') is False: found.append('nút tăng tuổi không nằm trọn trong màn hình')
    return found

report = {}
try:
    with sync_playwright() as p:
        for w, h in SIZES:
            run_size(p, w, h, report)
finally:
    server.shutdown()
failures = []
for size, rows in report.items():
    if size == '_errors': continue
    for r in rows:
        for problem in issues(r): failures.append(f'{size} {r["scene"]}: {problem}')
for size, errors in report.get('_errors', {}).items():
    failures += [f'{size} lỗi JavaScript: {e}' for e in errors]
(ROOT / 'output').mkdir(exist_ok=True)
(ROOT / 'output' / 'mobile-layout-results.json').write_text(json.dumps({'sizes': [f'{w}x{h}' for w, h in SIZES], 'failures': failures, 'report': report}, ensure_ascii=False, indent=1), encoding='utf-8')
scenes = sum(len(v) for k, v in report.items() if k != '_errors')
for line in failures: print('FAIL', line)
print(f"{'PASS' if not failures else 'FAIL'}: {scenes} màn hình ở {len(SIZES)} cỡ ({', '.join(f'{w}x{h}' for w, h in SIZES)}); {len(failures)} vấn đề.")
sys.exit(1 if failures else 0)
