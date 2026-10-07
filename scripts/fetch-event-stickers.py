"""Download the finite event sticker list from the pinned OpenMoji 16.0.0 release."""
import concurrent.futures
import json
from pathlib import Path
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "js/img/events/stickers"
BASE = "https://unpkg.com/openmoji@16.0.0/"


def fetch(relative):
    request = urllib.request.Request(BASE + relative, headers={"User-Agent": "HoiSinhNewLifeGame-assets/1.0"})
    with urllib.request.urlopen(request, timeout=40) as response:
        return response.read()


def download(entry):
    code = entry["code"]
    target = DEST / f"{code}.svg"
    if target.exists():
        ET.fromstring(target.read_bytes())
        return
    data = fetch(f"color/svg/{code}.svg")
    root = ET.fromstring(data)
    if root.tag != "{http://www.w3.org/2000/svg}svg":
        raise ValueError(f"Not an SVG: {code}")
    target.write_bytes(data)


if __name__ == "__main__":
    entries = json.loads((DEST / "download-list.json").read_text(encoding="utf-8"))
    errors = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(download, entry): entry["code"] for entry in entries}
        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as error:
                errors.append(f"{futures[future]}: {error}")
    (DEST / "LICENSE.txt").write_bytes(fetch("LICENSE.txt"))
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Downloaded and validated {len(entries)} OpenMoji SVG stickers.")
