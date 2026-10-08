"""Validate local assets referenced by the age 1-29 media audit."""
import json
from pathlib import Path
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
paths = json.loads((ROOT / "js/img/events/media-audit-assets.json").read_text(encoding="utf-8"))
for name in paths:
    target = (ROOT / name).resolve()
    assert target.is_relative_to(ROOT), f"Asset outside project: {name}"
    assert target.is_file(), f"Missing asset: {name}"
    data = target.read_bytes()
    if target.suffix == ".svg":
        assert ET.fromstring(data).tag == "{http://www.w3.org/2000/svg}svg", name
    elif target.suffix == ".gif":
        assert data[:6] in (b"GIF87a", b"GIF89a"), name
        width, height = struct.unpack("<HH", data[6:10])
        assert width > 0 and height > 0, name
print(f"Validated {len(paths)} referenced GIF/SVG assets.")
