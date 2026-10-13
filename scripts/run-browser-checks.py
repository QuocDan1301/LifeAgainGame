"""Run local HTML checks in isolated browsers with a hard worker timeout."""
import functools
import http.server
import json
import os
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# Windows consoles may otherwise fail while printing Vietnamese test results.
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def worker(url):
    sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'HoiSinhMediaTools'))
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe', headless=True)
        page = browser.new_page()
        errors = []
        page.on('console', lambda message: print(message.text, file=sys.stderr, flush=True) if message.text.startswith('CHECK_TRACE') else None)
        page.on('pageerror', lambda error: errors.append(str(error)))
        try:
            page.goto(url, wait_until='domcontentloaded', timeout=12000)
            page.wait_for_function("[...document.querySelectorAll('pre')].some(p => /^(PASS|FAIL)/.test(p.textContent))", timeout=20000)
            result = page.locator('pre').first.text_content()
        except Exception as error:
            result = 'INCOMPLETE: ' + str(error).splitlines()[0]
        print(json.dumps({'result': result, 'pageErrors': errors}, ensure_ascii=False), flush=True)
        browser.close()

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, *args):
        pass  # A closing isolated browser can abandon image requests.

def main(cases):
    server = Server(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    cases = cases or [f.name for f in sorted((ROOT / 'scripts').glob('check-*.html'))]
    results = []
    try:
        for case in cases:
            url = f'http://127.0.0.1:{server.server_port}/scripts/{case}'
            process = subprocess.Popen([sys.executable, '-u', __file__, '--worker', url],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8',
                env={**os.environ, 'PYTHONIOENCODING': 'utf-8'})
            try:
                output, errors = process.communicate(timeout=35)
                try:
                    row = json.loads(output.strip().splitlines()[-1])
                except (ValueError, IndexError):
                    row = {'result': 'INCOMPLETE: ' + errors[-1000:], 'pageErrors': []}
            except subprocess.TimeoutExpired:
                # This PID belongs to the worker we just launched, including its browser.
                subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], capture_output=True)
                _, trace = process.communicate()
                row = {'result': 'INCOMPLETE: hard worker timeout\n' + trace[-2000:], 'pageErrors': []}
            row['test'] = case
            results.append(row)
            print(f"{case}: {row['result'].splitlines()[0]}", flush=True)
            output_file = ROOT / 'output' / 'browser-check-results.json'
            output_file.parent.mkdir(exist_ok=True)
            output_file.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    finally:
        server.shutdown()
    return 0 if all(row['result'].startswith('PASS') and not row['pageErrors'] for row in results) else 1

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--worker':
        worker(sys.argv[2])
    else:
        raise SystemExit(main(sys.argv[1:]))
