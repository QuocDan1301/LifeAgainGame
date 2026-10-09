"""Validate the full official SVG library, motion and all event references."""
import json
import xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'js/img/events/openmoji'
manifest=json.loads((DEST/'library-manifest.json').read_text(encoding='utf-8'))
animations=json.loads((DEST/'animation-manifest.json').read_text(encoding='utf-8'))['assets']
codes=manifest['styles']['color']['codes']
assert len(codes)==4495 and len(animations)==len(codes)
assert manifest['styles']['black']['codes']==codes
for style in ('color','black'):
    for code in codes:
        root=ET.parse(DEST/style/'svg'/f'{code}.svg').getroot()
        assert root.tag.endswith('svg'),code
        assert not any(node.tag.endswith(('}animate','}animateTransform')) for node in root.iter()),'Original SVG modified: '+code
for code in codes:
    root=ET.parse(DEST/animations[code]['path']).getroot()
    assert any(node.tag.endswith(('}animate','}animateTransform')) for node in root.iter()),'No SVG motion: '+code
rows=json.loads((ROOT/'js/img/events/full-media-audit.json').read_text(encoding='utf-8'))
for row in rows:
    assert row['kind']=='animated-openmoji' and row['plan']['reviewed'],row['title']
    for field in ('image','fallback'):
        file=(ROOT/row[field]).resolve()
        assert file.is_relative_to(DEST) and file.is_file(),row[field]
assert not (ROOT/'js/img/events/emoji').exists(),'Old illustration directory remains'
assert not list((ROOT/'js/img/events').rglob('*.gif')),'Old GIFs remain'
print(f'PASS: {len(codes)} animated OpenMoji, {2*len(codes)} original SVGs, {len(rows)} event slots and no old illustration assets.')
