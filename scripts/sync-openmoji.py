"""Install the complete, pinned official OpenMoji SVG library locally."""
import base64
import hashlib
import io
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
import tarfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'js/img/events/openmoji'
VERSION='17.0.0'

def fetch(url):
    request=urllib.request.Request(url,headers={'User-Agent':'HoiSinhGame OpenMoji library'})
    with urllib.request.urlopen(request,timeout=90) as response:return response.read()

DEST.mkdir(parents=True,exist_ok=True)
package=json.loads(fetch(f'https://registry.npmjs.org/openmoji/{VERSION}'))
data=fetch(package['dist']['tarball'])
assert 'sha512-'+base64.b64encode(hashlib.sha512(data).digest()).decode()==package['dist']['integrity'],'Package integrity mismatch'
print(f'Downloaded verified official OpenMoji {VERSION} package ({len(data)} bytes).',flush=True)
installed={style:dict(url=package['dist']['tarball'],sha256=hashlib.sha256(data).hexdigest(),codes=[]) for style in ('color','black')}
with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
    for entry in archive.getmembers():
        match=re.fullmatch(r'package/(color|black)/svg/([A-F0-9-]+)\.svg',entry.name)
        if not match:continue
        style,code=match.groups()
        content=archive.extractfile(entry).read()
        assert ET.fromstring(content).tag.endswith('svg'),entry.name
        folder=DEST/style/'svg';folder.mkdir(parents=True,exist_ok=True)
        (folder/f'{code}.svg').write_bytes(content)
        installed[style]['codes'].append(code)
    metadata=json.load(archive.extractfile('package/data/openmoji.json'))
    license_data=archive.extractfile('package/LICENSE.txt').read()
for style,info in installed.items():
    info['codes'].sort();info['count']=len(info['codes']);assert info['count']>4000
assert installed['color']['codes']==installed['black']['codes'],'Mismatched complete libraries'
(DEST/'openmoji.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(DEST/'LICENSE.txt').write_bytes(license_data)
manifest={'version':VERSION,'source':f'https://github.com/hfg-gmuend/openmoji/releases/tag/{VERSION}','license':'CC BY-SA 4.0','styles':installed}
(DEST/'library-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
# Preserve the catalog path used by existing tools, with the full current data.
(ROOT/'js/img/events/openmoji-catalog.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
entries={code:{'annotation':next((row['annotation'] for row in metadata if row['hexcode']==code),code)} for code in installed['color']['codes']}
(ROOT/'js/openmoji-catalog.js').write_text('// Official complete OpenMoji '+VERSION+' SVG library.\nexport const openMojiVersion = '+json.dumps(VERSION)+';\nexport const openMojiCatalog = '+json.dumps(entries,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f"Installed OpenMoji {VERSION}: {len(entries)} icons, both color and black SVG, metadata and license.",flush=True)
