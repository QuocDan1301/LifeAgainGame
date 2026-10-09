"""Export the actual event factories, including careers and story chains."""
import functools
import http.server
import json
import sys
import tempfile
import threading
import urllib.parse
from pathlib import Path
sys.path.insert(0,str(Path(tempfile.gettempdir())/'HoiSinhMediaTools'))
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',headless=True)
        page=browser.new_page()
        page.goto(base+'/scripts/export-event-audit.html')
        page.wait_for_function("/^(\\[|FAIL)/.test(document.querySelector('#audit').textContent)",timeout=120000)
        output=page.locator('#audit').inner_text()
        assert not output.startswith('FAIL'),output
        records=json.loads(output)
        for record in records:
            for key in ('image','fallback'):
                if record.get(key): record[key]=urllib.parse.unquote(record[key].removeprefix(base+'/'))
        output_name=sys.argv[1] if len(sys.argv)>1 else 'full-media-audit.json'
        assert Path(output_name).name==output_name and output_name.endswith('.json'),output_name
        (ROOT/'js/img/events'/output_name).write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        assets=sorted({record[key] for record in records for key in ('image','fallback') if record.get(key)})
        (ROOT/'js/img/events/media-audit-assets.json').write_text(json.dumps(assets,indent=2)+'\n',encoding='utf-8')
        print(f'Exported {len(records)} slots and {len(assets)} paths.')
        browser.close()
finally: server.shutdown()
