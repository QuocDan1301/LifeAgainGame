"""Master and validate the rendered trailer. Run after render_trailer.py."""
from pathlib import Path
import json
import re
import subprocess
import textwrap
import wave

import numpy as np
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent
FFMPEG = next((OUT/'tools/imageio_ffmpeg/binaries').glob('ffmpeg-*.exe'))


def run(args):
    return subprocess.run([str(FFMPEG),'-hide_banner',*args],capture_output=True,text=True,
                          encoding='utf-8',errors='replace',check=True)


def main():
    manifest=json.loads((OUT/'trailer-manifest.json').read_text(encoding='utf-8'))
    duration=manifest['duration_seconds']
    srt=OUT/'Life-Again-Trailer.vi.srt'
    cues=srt.read_text(encoding='utf-8-sig').strip().split('\n\n')
    wrapped=[]
    for cue in cues:
        parts=cue.splitlines()
        lines=textwrap.wrap(' '.join(parts[2:]),width=65,break_long_words=False,break_on_hyphens=False)
        wrapped.append('\n'.join(parts[:2]+lines))
    srt.write_text('\n\n'.join(wrapped)+'\n',encoding='utf-8-sig')
    final=OUT/'Life-Again-Trailer-1080p.mp4'
    run(['-y','-loglevel','error','-i',str(OUT/'video-silent.mp4'),
         '-i',str(OUT/'soundtrack.wav'),'-i',str(srt),
         '-map','0:v','-map','1:a','-map','2:s','-c:v','copy',
         '-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-b:a','192k',
         '-c:s','mov_text','-metadata:s:s:0','language=vie',
         '-metadata:s:a:0','language=zxx','-metadata','title=Life Again — Sống thêm một đời nữa',
         '-metadata','comment=Game: Life Again / QuocDan. Music arranged from game themes. Icons: OpenMoji CC BY-SA 4.0, https://openmoji.org/',
         '-movflags','+faststart','-t',str(duration),str(final)])
    # Decode both complete streams, so errors anywhere in the file fail the check.
    run(['-v','error','-xerror','-i',str(final),'-map','0:v:0','-map','0:a:0','-f','null','-'])
    probe=subprocess.run([str(FFMPEG),'-hide_banner','-i',str(final)],capture_output=True,
                         text=True,encoding='utf-8',errors='replace').stderr
    assert '1920x1080' in probe,probe
    assert 'h264' in probe and 'aac' in probe and 'mov_text' in probe,probe
    assert len(cues)==len(manifest['scenes'])
    samples=[2,28,72,99,108,137,170,190]
    sheet=Image.new('RGB',(1280,4*380),'#0b1826')
    for i,t in enumerate(samples):
        target=OUT/f'check-{t:03}.jpg'
        run(['-y','-loglevel','error','-ss',str(t),'-i',str(final),'-frames:v','1','-q:v','2',str(target)])
        im=Image.open(target).convert('RGB').resize((640,360),Image.Resampling.LANCZOS)
        sheet.paste(im,((i%2)*640,(i//2)*380))
        ImageDraw.Draw(sheet).text(((i%2)*640+10,(i//2)*380+362),f'{t//60:02}:{t%60:02}',fill='white')
    sheet.save(OUT/'video-quality-check.jpg',quality=94)
    root=OUT.parents[1]
    missing=[ref for s in manifest['scenes'] for ref in s['sources'] if not (root/ref.split('#')[0]).exists()]
    assert not missing,missing
    audio=wave.open(str(OUT/'soundtrack.wav'))
    pcm=np.frombuffer(audio.readframes(audio.getnframes()),dtype='<i2').reshape(-1,2)/32768
    blocks=[float(np.sqrt(np.mean(pcm[a:a+audio.getframerate()*5]**2)))
            for a in range(0,len(pcm),audio.getframerate()*5)]
    assert min(blocks)>0.001,'Unexpected silent music section'
    report={'passed':True,'full_decode':'video and audio passed','video':'H.264, 1920x1080, 24fps',
            'audio':'AAC stereo, normalized to -16 LUFS target','subtitle_cues':len(cues),
            'duration_seconds':duration,'size_bytes':final.stat().st_size,
            'missing_source_files':missing,'ffmpeg_stream_info':probe}
    (OUT/'quality-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='ffmpeg_stream_info'},ensure_ascii=False),flush=True)


if __name__=='__main__':main()
