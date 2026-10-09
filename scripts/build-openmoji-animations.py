"""Add SVG motion to official OpenMoji artwork without redrawing its shapes.

The original SVGs remain untouched and serve as reduced-motion/error posters.
Every color icon gets an animated version; eyes and flash use
the original paths when available. Other icons get motion suited to the object.
"""
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'js/img/events/openmoji'
library=json.loads((DEST/'library-manifest.json').read_text(encoding='utf-8'))
metadata=json.loads((DEST/'openmoji.json').read_text(encoding='utf-8'))
names={entry['hexcode']:entry['annotation'] for entry in metadata}
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
tag=lambda name:f'{{{NS}}}{name}'
output=DEST/'animated/svg'
output.mkdir(parents=True,exist_ok=True)

def animate(parent,attribute,values,duration='3s',**attrs):
    return ET.SubElement(parent,tag('animate'),{'attributeName':attribute,'values':values,'dur':duration,'repeatCount':'indefinite',**attrs})

def transform(parent,kind,values,duration='3s'):
    return ET.SubElement(parent,tag('animateTransform'),{'attributeName':'transform','type':kind,'values':values,'dur':duration,'repeatCount':'indefinite'})

def wrap(parent,element):
    index=list(parent).index(element)
    group=ET.Element(tag('g'));parent.remove(element);parent.insert(index,group);group.append(element)
    return group

def motion_for(code,name):
    name=name.lower()
    if 'walking' in name or 'running' in name:return 'walk'
    if 'camera with flash' in name:return 'flash'
    if any(word in name for word in ('telephone','mobile phone','alarm clock','bell')):return 'ring'
    if any(word in name for word in ('heart','kiss','hug','love')):return 'pulse'
    if any(word in name for word in ('gear','wheel','fan','disc')):return 'turn'
    if any(word in name for word in ('broom','wrench','hammer','screwdriver','needle','paintbrush','pencil','writing hand','crayon')):return 'work'
    if any(word in name for word in ('ball','badminton','dice','pawn','game','joystick')):return 'bounce'
    if any(word in name for word in ('tree','plant','flower','blossom','leaf','herb','wheat','seedling')):return 'sway'
    if any(word in name for word in ('face','baby','child','person','woman','man','cat','dog')):return 'blink'
    if 'candle' in name:return 'calm'
    if any(word in name for word in ('book','notebook','newspaper','memo','folder','clipboard','letter')):return 'read'
    return 'float'

catalog={}
for code in library['styles']['color']['codes']:
    source=DEST/'color/svg'/f'{code}.svg'
    root=ET.parse(source).getroot()
    assert root.attrib.get('viewBox')=='0 0 72 72',(code,root.attrib.get('viewBox'))
    root.set('viewBox','-5 -5 82 82')
    root.set('width','200');root.set('height','200')
    root.set('role','img')
    name=names.get(code,code)
    title=ET.Element(tag('title'));title.text=f'OpenMoji: {name}';root.insert(0,title)
    artwork=ET.Element(tag('g'))
    for element in list(root):
        if element is title or element.tag in (tag('defs'),tag('metadata')):continue
        root.remove(element);artwork.append(element)
    root.append(artwork)
    motion=motion_for(code,name)
    for parent in list(artwork.iter()):
        for element in list(parent):
            if motion=='flash' and (element.tag==tag('polygon') or element.get('fill')=='#f1b31c'):
                animate(element,'opacity','1;0;0;1;0;0;1','3.4s')
            if motion=='blink' and element.tag in (tag('circle'),tag('ellipse')):
                radius=float(element.get('r') or element.get('ry') or 100)
                cx=float(element.get('cx') or 0);cy=float(element.get('cy') or 0)
                if radius<=3.5 and 15<cx<57 and 17<cy<45:
                    anchor=wrap(parent,element);anchor.set('transform',f'translate({cx} {cy})')
                    eyelid=ET.Element(tag('g'));anchor.remove(element);anchor.append(eyelid)
                    offset=ET.SubElement(eyelid,tag('g'),{'transform':f'translate({-cx} {-cy})'});offset.append(element)
                    transform(eyelid,'scale','1 1;1 1;1 .12;1 1;1 1','4.2s')
    if motion=='walk':transform(artwork,'translate','-1 0;1 -1;-1 0;1 -1;-1 0','1.2s')
    elif motion=='ring':transform(artwork,'rotate','0 36 36;-5 36 36;5 36 36;0 36 36;0 36 36','2.8s')
    elif motion=='pulse':
        anchor=ET.Element(tag('g'),{'transform':'translate(36 36)'});root.remove(artwork);root.append(anchor)
        beat=ET.SubElement(anchor,tag('g'));beat.append(artwork);artwork.set('transform','translate(-36 -36)')
        transform(beat,'scale','1;1.07;1;1.04;1;1','2.4s')
    elif motion=='turn':transform(artwork,'rotate','-4 36 36;8 36 36;-4 36 36','3.4s')
    elif motion=='work':transform(artwork,'rotate','-7 36 54;7 36 54;-7 36 54','2s')
    elif motion=='bounce':transform(artwork,'translate','0 0;0 -3;0 0;0 0','2.1s')
    elif motion=='sway':transform(artwork,'rotate','-3 36 65;3 36 65;-3 36 65','3.8s')
    elif motion=='calm':animate(artwork,'opacity','1;.87;1','4s')
    elif motion=='read':transform(artwork,'rotate','-2 36 54;2 36 54;-2 36 54','4s')
    else:transform(artwork,'translate','0 0;0 -1.5;0 0','3.8s')
    (output/f'{code}.svg').write_bytes(ET.tostring(root,encoding='utf-8',xml_declaration=True))
    catalog[code]={'path':f'animated/svg/{code}.svg','poster':f'color/svg/{code}.svg','motion':motion,'annotation':name}
(DEST/'animation-manifest.json').write_text(json.dumps({'version':library['version'],'license':'CC BY-SA 4.0','assets':catalog},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Built {len(catalog)} animated OpenMoji SVGs from untouched official artwork.',flush=True)
