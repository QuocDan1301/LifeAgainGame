"""Check archive death branches and responsive layout in isolated Chrome contexts."""
import functools
import http.server
import json
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
rows = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
        for width in [320, 390, 1280]:
            for mode in ['', 'oldage', 'annual']:
                context = browser.new_context(viewport={'width': width, 'height': 800})
                page = context.new_page()
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto(f'http://127.0.0.1:{server.server_port}/scripts/check-life-archive.html?mode={mode}', wait_until='domcontentloaded')
                page.wait_for_function("/^(PASS|FAIL)/.test(document.getElementById('result').textContent)", timeout=20000)
                result = page.locator('#result').text_content()
                rows.append({'width': width, 'mode': mode or 'event', 'result': result, 'errors': errors})
                print(f"{width}px {mode or 'event'}: {result.splitlines()[0]}", flush=True)
                if result.startswith('PASS'):
                    page.locator('#life-archive-dialog').screenshot(path=str(ROOT / 'output' / f'life-archive-{width}-{mode or "event"}.png'))
                context.close()
        browser.close()
finally:
    server.shutdown()
    (ROOT / 'output' / 'life-archive-ui-results.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
raise SystemExit(0 if all(row['result'].startswith('PASS') and not row['errors'] for row in rows) else 1)
