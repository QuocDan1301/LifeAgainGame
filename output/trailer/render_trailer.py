"""Render the Vietnamese Life Again feature trailer from project-owned assets.

Usage: bundled-python output/trailer/render_trailer.py [--preview-only]
No game files, saves, or settings are changed.
"""
from pathlib import Path
from functools import lru_cache
import json
import math
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
W, H, FPS = 1920, 1080, 24
S = 1.5
NAVY = '#0b1826'
INK = '#f7f2df'
MUTED = '#aebdca'
GOLD = '#f6d46a'
CYAN = '#76dbe9'
FONTDIR = Path('C:/Windows/Fonts')


def scene(seconds, chapter, title, body, tags, kind, art=None, icons=None, accent=GOLD, subtitle='', sources=None):
    return dict(seconds=seconds, chapter=chapter, title=title, body=body,
                tags=tags, kind=kind, art=art, icons=icons or [], accent=accent,
                subtitle=subtitle, sources=sources or [])


SCENES = [
    scene(7, 'MỘT CHUYẾN XE. MỘT CUỘC ĐỜI.', 'Nếu được sống\nthêm một lần…',
          'Bạn sẽ viết lại câu chuyện của mình thế nào?', [], 'intro',
          subtitle='Life Again — game mô phỏng cuộc đời bằng tiếng Việt.', sources=['gioi-thieu.html']),
    scene(8, '01 / KHỞI ĐẦU', 'Cuộc đời mới.\nDo bạn lựa chọn.',
          'Tạo nhân vật, chọn giới tính, đặt tên và quê quán.\nHoặc để một khởi đầu ngẫu nhiên đưa bạn đi.',
          ['Tạo tùy chỉnh', 'Khởi đầu ngẫu nhiên', 'Bến xe cuộc đời'], 'portraits',
          subtitle='Tạo nhân vật theo ý bạn, hoặc bắt đầu với một cuộc đời ngẫu nhiên.',
          sources=['index.html#create-character-title', 'js/core/character-data.js']),
    scene(9, '02 / MỖI NĂM MỘT CÂU CHUYỆN', 'Một lựa chọn.\nMột ngã rẽ.',
          'Bấm + Tuổi để bước sang năm mới.\nĐón sự kiện, chọn cách ứng xử, viết tiếp nhật ký.',
          ['Sự kiện theo tuổi', 'Lựa chọn & hệ quả', 'Nhật ký cuộc đời'], 'dual',
          art=['img/site/game.jpg', 'img/site/event.jpg'], accent=CYAN,
          subtitle='Mỗi lần bấm cộng tuổi là một năm trôi qua, với sự kiện và những ngã rẽ mới.',
          sources=['gioi-thieu.html', 'js/events/events.js', 'js/events/life-stories.js']),
    scene(8, '03 / CÂN BẰNG CUỘC SỐNG', 'Giàu có thôi,\nđã đủ hạnh phúc?',
          'Sức khỏe. Trí tuệ. Hạnh phúc. Ngoại hình.\nBốn chỉ số cùng thay đổi theo cách bạn sống.',
          ['Chăm sóc bản thân', 'Đánh đổi mỗi năm'], 'stats', icons=['1F4AA','1F9E0','2764','2728'],
          subtitle='Cân bằng sức khỏe, trí tuệ, hạnh phúc và ngoại hình trong từng lựa chọn.',
          sources=['js/stats/self-development.js', 'index.html#player-name']),
    scene(9, '04 / HỌC VẤN', 'Ước mơ lớn\ntừ những trang sách.',
          'Đi học, thi chuyển cấp, chọn khối học.\nHọc tiếp, du học và mở lối đến nghề nghiệp.',
          ['Thi cử', 'Chọn khối', 'Du học'], 'icons', icons=['1F393','1F4DA','2708'], accent=CYAN,
          subtitle='Đi học, thi chuyển cấp, chọn khối và du học để mở thêm cơ hội cho tương lai.',
          sources=['js/education/education.js', 'js/education/study-blocks.js', 'js/education/study-abroad.js']),
    scene(9, '05 / NGHỀ NGHIỆP', 'Bắt đầu nhỏ.\nVươn xa hơn.',
          'Xin việc, làm thêm, tích lũy kinh nghiệm.\nĐón cột mốc nghề nghiệp, thăng tiến và tăng lương.',
          ['Xin việc', 'Làm thêm', 'Bậc nghề & lương', 'Học bằng lái'], 'icons', icons=['1F4BC','1F4B0','1F697'],
          subtitle='Xin việc, làm thêm, học bằng lái và phát triển sự nghiệp qua những cột mốc riêng.',
          sources=['js/career/job-applications.js','js/career/side-jobs.js','js/career/career-milestones.js','js/career/licenses.js']),
    scene(9, '06 / TÀI SẢN & KINH DOANH', 'Từ đồng lương\nđến cơ ngơi.',
          'Mua vật dụng, phương tiện và bất động sản.\nKinh doanh, cho thuê nhà, tính toán chi tiêu và nợ vay.',
          ['Nhà đất', 'Xe cộ', 'Cửa hàng', 'Tài chính'], 'icons', icons=['1F3E0','1F697','1F3EA'],
          subtitle='Mua nhà, mua xe, kinh doanh và quản lý tài sản. Mỗi khoản thu chi đều có ý nghĩa.',
          sources=['js/leisure/shop.js','js/core/life-profile.js']),
    scene(9, '07 / TÌNH YÊU', 'Gặp một người.\nĐổi cả cuộc đời.',
          'Làm quen, hẹn hò, trò chuyện và tặng quà.\nTiến tới hôn nhân, hoặc đối diện những lần chia tay.',
          ['Làm quen', 'Hẹn hò', 'Kết hôn', 'Biến cố tình cảm'], 'romance', icons=['1F48D','2764','1F381'], accent='#f4b5b8',
          subtitle='Làm quen, hẹn hò, tặng quà và kết hôn. Tình cảm cũng có những lựa chọn khó khăn.',
          sources=['js/relationships/relationships.js','js/relationships/dating-drama.js','js/relationships/matchmaking.js']),
    scene(9, '08 / GIA ĐÌNH', 'Nhà là nơi\ncó người chờ.',
          'Gắn kết với cha mẹ, bạn bè và bạn đời.\nSinh con hoặc nhận con nuôi, cùng chăm lo gia đình.',
          ['Chuyện nhà', 'Gắn kết', 'Nuôi dạy con', 'Ngân sách gia đình'], 'phone',
          art='output/family-conversation-mobile.png', accent='#f4b5b8',
          subtitle='Trò chuyện với người thân, xây dựng gia đình, đón con và cùng gánh vác cuộc sống.',
          sources=['js/relationships/family.js','js/relationships/family-conversations.js','js/relationships/family-budget.js']),
    scene(9, '09 / CHĂM SÓC BẢN THÂN', 'Sống tốt hơn,\ntừng chút một.',
          'Tập gym, yoga, học ngoại ngữ, chơi cờ, vẽ và thiền.\nĂn uống, đến bệnh viện, làm đẹp và chăm sóc da.',
          ['Phát triển bản thân', 'Bệnh viện', 'Ăn uống', 'Làm đẹp'], 'icons', icons=['1F3CB','1F3E5','1F372','1F484'], accent=CYAN,
          subtitle='Rèn luyện, học hỏi, ăn uống, chữa bệnh và làm đẹp để chăm sóc cả thể chất lẫn tinh thần.',
          sources=['js/stats/self-development.js','js/stats/hospital.js','js/stats/food.js','js/stats/beauty.js']),
    scene(9, '10 / NHỮNG NIỀM VUI NHỎ', 'Đi xa.\nVà có bạn đồng hành.',
          'Du lịch trong nước và quốc tế, lưu dấu những chuyến đi.\nNuôi thú cưng, chăm vật nuôi và tận hưởng đời thường.',
          ['Đà Nẵng · Hội An', 'Tokyo · Paris', 'Thú cưng & vật nuôi'], 'icons', icons=['2708','1F431','1F3E0'],
          subtitle='Khám phá những điểm đến trong và ngoài nước, nuôi thú cưng và tạo thêm kỷ niệm.',
          sources=['js/leisure/travel.js','js/leisure/shop.js']),
    scene(10, '11 / VƯỜN NHÀ', 'Gieo một hạt.\nGặt một mùa vui.',
          'Trồng cây theo mùa, tưới nước, bón phân và bắt sâu.\nThu hoạch, mua bán nông sản, vào bếp và nấu ăn.',
          ['Khu vườn', 'Chợ', 'Kho thực phẩm', 'Nhà bếp'], 'phone',
          art='output/tester-audit/layout-390x844-act-garden.png', accent='#9ed4a6',
          subtitle='Chăm vườn qua từng mùa, thu hoạch nông sản, đi chợ và nấu những món ăn từ thành quả của mình.',
          sources=['js/leisure/garden-data.js','js/leisure/garden.js']),
    scene(10, '12 / THÁM TỬ TƯ', 'Mọi manh mối\nđều có tiếng nói.',
          'Nhận vụ án, khám xét hiện trường và hỏi nhân chứng.\nGhi sổ tay, xâu chuỗi chứng cứ, suy luận và phá án.',
          ['Hồ sơ vụ án', 'Sổ tay', 'Nhân chứng', 'Suy luận'], 'phone',
          art='output/detective-notebook-mobile.png', accent=CYAN,
          subtitle='Trở thành thám tử tư: thu thập manh mối, hỏi nhân chứng và tìm lời giải cho từng vụ án.',
          sources=['js/leisure/detective.js','js/leisure/detective-reasoning.js']),
    scene(8, '13 / ĐẤU GIÁ CỔ VẬT', 'Nhìn dấu vết.\nTrả đúng giá.',
          'Quan sát hiện vật, cân nhắc giá trị và ra giá.\nMang về cổ vật cho bộ sưu tập của riêng mình.',
          ['Thẩm định', 'Trả giá', 'Sưu tập cổ vật'], 'phone',
          art='output/auction-mobile.png',
          subtitle='Bước vào phiên đấu giá, quan sát dấu vết và quyết định món cổ vật nào xứng đáng để sở hữu.',
          sources=['js/leisure/auction.js','js/leisure/auction-core.js']),
    scene(10, '14 / GAME CENTER', 'Một vé vào cửa.\nThêm bao niềm vui.',
          'Kéo bò, gắp thú, bóng rổ và đập chuột.\nTích xu, nhận vé, đổi quà và hoàn thiện album thú bông.',
          ['Kéo bò', 'Gắp thú', 'Bóng rổ', 'Đập chuột'], 'phone',
          art='output/game-center-mobile.png', accent='#b9b0fa',
          subtitle='Chơi bốn trò ở Game Center, tích vé đổi quà và sưu tập thú bông để giữ lại hoặc tặng người thân.',
          sources=['js/leisure/game-center-data.js','js/leisure/game-center-progress.js','js/leisure/arcade-games.js']),
    scene(10, '15 / TRÒ CHƠI TRONG GAME', 'Thử tài.\nThử cả vận may.',
          'Tiến lên miền Nam, xì dách, sấp ngửa, đoán xúc xắc.\nMở hộp bí ẩn, leo tháp tài lộc và biết lúc nên dừng.',
          ['Tiến lên', 'Xì dách', 'Hộp bí ẩn', 'Leo tháp'], 'landscape',
          art='output/tien-len-desktop.png', accent='#b9b0fa',
          subtitle='Khám phá Tiến lên, xì dách, sấp ngửa, xúc xắc, hộp bí ẩn và leo tháp. Các trò chơi dùng tài sản trong game.',
          sources=['js/leisure/games.js','js/leisure/tien-len.js']),
    scene(7, '16 / MỘT CHÚT TÒ MÒ', 'Hôm nay,\nvận may gọi tên ai?',
          'Xem tarot, mua vé số và chờ kết quả.\nNhững bất ngờ nhỏ giữa hành trình dài.',
          ['Tarot', 'Vé số', 'Tiền & phần thưởng trong game'], 'icons', icons=['1F52E','1F39F','1F3B2'], accent='#b9b0fa',
          subtitle='Xem tarot, mua vé số và đón thêm những bất ngờ trong thế giới của Life Again.',
          sources=['js/leisure/tarot.js','js/leisure/lottery.js']),
    scene(8, '17 / CÁI GIÁ CỦA LỰA CHỌN', 'Có những ngã rẽ\nkhó quay đầu.',
          'Cám dỗ nghề nghiệp, sai lầm và hành vi phạm pháp.\nTiền bạc, danh tiếng và tự do đều có thể đổi thay.',
          ['Cám dỗ', 'Biến cố', 'Hệ quả lâu dài'], 'icons', icons=['1F4BC','1F512','1F4DC'], accent='#efab81',
          subtitle='Đối diện cám dỗ, biến cố và hệ quả của những sai lầm. Mỗi lựa chọn đều để lại dấu vết.',
          sources=['js/career/work-temptation.js','js/events/crime.js','js/events/crime-consequences.js']),
    scene(8, '18 / ĐIỀU CÒN Ở LẠI', 'Không chỉ là\nnhững con số.',
          'Giữ kỷ vật, quà tặng, thú bông và cổ vật.\nNhìn lại các mốc tình cảm và những trang kỷ niệm.',
          ['Kỷ vật', 'Kỷ niệm', 'Bộ sưu tập'], 'icons', icons=['1F381','1F9F8','1F48D'], accent='#f4b5b8',
          subtitle='Lưu giữ kỷ vật, quà tặng, cổ vật và những kỷ niệm làm nên một cuộc đời riêng biệt.',
          sources=['index.html#life-keepsakes-title','index.html#life-memories-title','js/core/life-profile.js']),
    scene(9, '19 / MỖI ĐỜI MỘT DẤU ẤN', 'Khép một đời.\nMở thêm khám phá.',
          'Mở khóa thành tựu, danh hiệu và dấu ấn.\nSổ các cuộc đời lưu lại hành trình đã qua.',
          ['Thành tựu', 'Danh hiệu', 'Sổ các cuộc đời'], 'phone',
          art='output/life-archive-390-event.png',
          subtitle='Nhìn lại cuộc đời trong trang tổng kết, khám phá thành tựu và mang những dấu ấn vào sổ các cuộc đời.',
          sources=['js/achievements/achievements-data.js','js/core/life-archive.js','js/ui/life-archive.js']),
    scene(11, '20 / MANG CÂU CHUYỆN THEO BẠN', 'Chơi ở đâu.\nTiếp tục ở đó.',
          'Miễn phí, không cần tài khoản. Lưu tiến trình trên máy.\nCài như ứng dụng; chơi offline sau lần tải đầu.',
          ['Điện thoại & máy tính', 'Mã chuyển thiết bị', 'Tệp sao lưu'], 'icons', icons=['1F4F1','1F4BE','1F512'], accent=CYAN,
          subtitle='Chơi miễn phí trên điện thoại và máy tính. Cài ứng dụng, chơi offline sau lần tải đầu; chuyển máy bằng mã khi có mạng hoặc dùng tệp sao lưu.',
          sources=['gioi-thieu.html#offline','gioi-thieu.html#chuyen-may','js/core/save-store.js','js/core/transfer.js']),
    scene(8, 'LIFE AGAIN', 'Cuộc đời tiếp theo…\nbạn sẽ sống thế nào?',
          'Bắt đầu một cuộc đời mới.', ['MIỄN PHÍ', 'TIẾNG VIỆT', 'CHƠI TRÊN TRÌNH DUYỆT'], 'outro',
          subtitle='Life Again. Sống thêm một đời nữa, từng năm một.', sources=['gioi-thieu.html']),
]


@lru_cache(None)
def font(size, style='regular'):
    names = {'regular':'segoeui.ttf','bold':'segoeuib.ttf','serif':'segoeuii.ttf','light':'segoeuil.ttf'}
    return ImageFont.truetype(str(FONTDIR/names[style]), round(size*S))


def xy(v):
    return round(v*S)


def text(d, p, value, size=24, color=INK, style='regular', spacing=1.19):
    x, y = p
    for line in value.split('\n'):
        d.text((xy(x),xy(y)),line,font=font(size,style),fill=color,stroke_width=0)
        y += size*spacing


def rule(d, coords, fill, width=1):
    d.line(tuple(xy(v) for v in coords),fill=fill,width=xy(width))


def rr(d, box, radius, fill, outline=None, width=1):
    d.rounded_rectangle(tuple(xy(v) for v in box),radius=xy(radius),fill=fill,outline=outline,width=xy(width))


def paste_fit(canvas, path, box, radius=0):
    img=Image.open(ROOT/path).convert('RGBA')
    x,y,bw,bh=map(xy,box)
    img=ImageOps.contain(img,(bw,bh),Image.Resampling.LANCZOS)
    px=x+(bw-img.width)//2; py=y+(bh-img.height)//2
    if radius:
        mask=Image.new('L',img.size,0)
        ImageDraw.Draw(mask).rounded_rectangle((0,0,img.width-1,img.height-1),xy(radius),fill=255)
        canvas.paste(img,(px,py),mask)
    else:
        canvas.alpha_composite(img,(px,py))


def tag_rows(d, tags, y, accent):
    x=76
    for tag in tags:
        tw=d.textlength(tag,font=font(15,'bold'))/S
        if x+tw+30>713:
            x=76; y+=42
        rr(d,(x,y,x+tw+25,y+31),15,'#182b3b', '#344451')
        text(d,(x+12,y+3),tag,15,accent,'bold')
        x+=tw+37


@lru_cache(None)
def background(accent):
    # A restrained spotlight behind the in-game artwork, with warm paper-like grain.
    yy,xx=np.mgrid[0:H,0:W]
    base=np.zeros((H,W,3),np.float32); base[:]=[11,24,38]
    glow=np.exp(-(((xx-W*.80)/(W*.32))**2+((yy-H*.48)/(H*.6))**2)*1.8)
    tint=np.array([int(accent[i:i+2],16) for i in (1,3,5)],np.float32)
    base += glow[:,:,None]*tint[None,None,:]*.12
    rng=np.random.default_rng(17)
    base += rng.normal(0,.65,(H,W,1))
    return Image.fromarray(np.uint8(np.clip(base,0,255)),'RGB').convert('RGBA')


def phone_visual(s):
    img=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(img)
    rr(d,(817,92,1154,647),31,'#050b12','#536779',1.5)
    paste_fit(img,s['art'],(828,105,315,528),15)
    rr(d,(934,100,1036,110),5,'#050b12')
    rule(d,(942,639,1028,639),'#667785',3)
    return img


def icon_visual(s):
    img=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(img); accent=s['accent']
    d.ellipse((xy(793),xy(155),xy(1201),xy(563)),outline='#2a4150',width=xy(1))
    d.ellipse((xy(833),xy(195),xy(1161),xy(523)),outline='#243949',width=xy(1))
    n=len(s['icons'])
    for i,icon in enumerate(s['icons']):
        if n==4:
            px=835+(i%2)*190; py=192+(i//2)*190; size=150
        else:
            px,py,size=[(900,145,200),(798,365,170),(1050,365,170)][i]
        rr(d,(px-5,py-5,px+size+5,py+size+5),27,'#172b3b','#3a5362')
        path=f'output/trailer/icons/{icon}.png'
        if (ROOT/path).exists():
            paste_fit(img,path,(px+15,py+15,size-30,size-30))
    text(d,(844,600),'MỖI LỰA CHỌN ĐỀU CÓ Ý NGHĨA',13,accent,'bold')
    return img


def portraits_visual(s):
    img=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(img)
    items=[('0-3','Chào đời'),('15-17','Trưởng thành'),('31-50','Xây tổ ấm'),('71-100','Nhìn lại')]
    rule(d,(812,369,1190,369),'#48616c',2)
    for i,(age,label) in enumerate(items):
        x=798+(i%2)*213; y=140+(i//2)*240
        d.ellipse((xy(x),xy(y),xy(x+180),xy(y+180)),fill='#213847',outline='#49616a',width=xy(1))
        paste_fit(img,f'img/{"Nam" if i%2==0 else "Nu"}/{"nam" if i%2==0 else "nu"}_{age}.webp',(x+7,y+7,166,166))
        tw=d.textlength(label,font=font(18,'bold'))/S
        text(d,(x+90-tw/2,y+185),label,18,INK,'bold')
    return img


def stats_visual(s):
    img=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(img)
    values=[('Sức khỏe',86,'1F4AA','#9ed4a6'),('Trí tuệ',78,'1F9E0',CYAN),('Hạnh phúc',92,'2764','#f4b5b8'),('Ngoại hình',74,'2728',GOLD)]
    for i,(name,value,icon,color) in enumerate(values):
        y=175+i*99
        paste_fit(img,f'output/trailer/icons/{icon}.png',(801,y,54,54))
        text(d,(875,y-1),name,23,INK,'bold')
        rr(d,(875,y+39,1180,y+51),6,'#28404d')
        rr(d,(875,y+39,875+305*value/100,y+51),6,color)
    text(d,(875,602),'MINH HỌA CÁC CHỈ SỐ',13,MUTED,'bold')
    return img


def make_layers(s,index):
    bg=background(s['accent']).copy(); d=ImageDraw.Draw(bg)
    text(d,(76,36),'LIFE AGAIN',16,INK,'bold')
    text(d,(1012,39),'TRAILER GIỚI THIỆU',12,MUTED,'bold')
    rule(d,(76,78,1204,78),'#30424e')
    text(d,(76,658),'SỐNG THÊM MỘT ĐỜI NỮA, TỪNG NĂM MỘT.',12,MUTED)
    text(d,(1130,658),f'{index+1:02d} / {len(SCENES):02d}',12,MUTED)
    copy=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(copy)
    if s['kind'] in ('intro','outro'):
        paste_fit(bg,'img/logo.webp',(814,172,370,290))
        text(d,(76,153),s['chapter'],14,s['accent'],'bold')
        size=49 if s['kind']=='outro' else 54
        text(d,(72,212),s['title'],size,INK,'serif',1.3)
        text(d,(76,405),s['body'],23,MUTED)
        if s['kind']=='outro':
            rr(d,(76,475,432,532),28,GOLD)
            text(d,(109,485),'BẮT ĐẦU CUỘC ĐỜI MỚI',19,NAVY,'bold')
            text(d,(76,564),'MIỄN PHÍ  /  TIẾNG VIỆT  /  ĐIỆN THOẠI & MÁY TÍNH',13,MUTED,'bold')
        else:
            text(d,(76,491),'MỘT GAME. NHIỀU CÁCH SỐNG.',16,GOLD,'bold')
        visual=Image.new('RGBA',(W,H))
    else:
        text(d,(76,133),s['chapter'],14,s['accent'],'bold')
        title_size=48
        maxwidth=650
        while max(d.textlength(line,font=font(title_size,'bold'))/S for line in s['title'].split('\n'))>maxwidth:
            title_size-=1
        text(d,(72,183),s['title'],title_size,INK,'bold',1.24)
        # Body copy stays in the left column, safely away from the visual.
        body_size=21
        while max(d.textlength(line,font=font(body_size))/S for line in s['body'].split('\n'))>665:
            body_size-=1
        text(d,(76,349),s['body'],body_size,MUTED,spacing=1.6)
        tag_rows(d,s['tags'],471,s['accent'])
        rule(d,(76,582,132,582),s['accent'],3)
        text(d,(146,570),'HÌNH ẢNH TRONG GAME' if s['art'] else 'KHÁM PHÁ TÍNH NĂNG',12,MUTED,'bold')
        if s['kind']=='phone':
            visual=phone_visual(s)
        elif s['kind']=='dual':
            visual=Image.new('RGBA',(W,H)); vd=ImageDraw.Draw(visual)
            for j,p in enumerate(s['art']):
                x=786+j*214; y=145-j*18
                rr(vd,(x-7,y-9,x+199,y+436),21,'#050b12','#506472')
                paste_fit(visual,p,(x,y,192,426),12)
        elif s['kind']=='landscape':
            visual=Image.new('RGBA',(W,H)); vd=ImageDraw.Draw(visual)
            rr(vd,(772,177,1227,572),20,'#101e2b','#506472')
            paste_fit(visual,s['art'],(785,192,429,365),8)
            text(vd,(865,600),'TIỀN VÀ TÀI SẢN TRONG GAME',12,MUTED,'bold')
        elif s['kind']=='portraits':
            visual=portraits_visual(s)
        elif s['kind']=='stats':
            visual=stats_visual(s)
        else:
            visual=icon_visual(s)
    return bg,copy,visual


def composite_frame(layers, s, t, index, elapsed):
    bg,copy,visual=layers
    frame=bg.copy()
    # Moving dust, staggered entrances, floating artwork and a chapter progress line.
    d=ImageDraw.Draw(frame)
    for k in range(13):
        x=740+(k*79+int(t*(3+k%3)))%490
        y=108+(k*97+int(math.sin(t*.45+k)*12))%510
        r=1 if k%3 else 2
        d.ellipse((xy(x),xy(y),xy(x+r),xy(y+r)),fill='#53717a')
    intro=min(1,max(0,t/.8)); ease=1-(1-intro)**3
    if ease<1:
        cp=copy.copy(); cp.putalpha(cp.getchannel('A').point(lambda x:int(x*ease)))
        frame.alpha_composite(cp,(0,xy(20*(1-ease))))
    else:
        frame.alpha_composite(copy)
    ve=min(1,max(0,(t-.18)/.85)); ve=1-(1-ve)**3
    if ve<1:
        art=visual.copy(); art.putalpha(art.getchannel('A').point(lambda x:int(x*ve)))
    else:
        art=visual
    frame.alpha_composite(art,(xy(30*(1-ve)),xy(math.sin(t*.7+index)*3)))
    d=ImageDraw.Draw(frame)
    total=sum(x['seconds'] for x in SCENES)
    rule(d,(76,633,1204,633),'#2c404c',1)
    rule(d,(76,633,76+1128*(elapsed+t)/total,633),s['accent'],2)
    # A brief fade between chapters keeps every title readable for most of its shot.
    fade=min(1,t/.22,(s['seconds']-t)/.28)
    if fade<1:
        frame=Image.blend(Image.new('RGBA',(W,H),NAVY),frame,max(0,fade))
    return frame.convert('RGB')


def timecode(seconds):
    ms=round(seconds*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'


def write_metadata():
    elapsed=0; cues=[]
    for i,s in enumerate(SCENES):
        s['start']=elapsed; s['end']=elapsed+s['seconds']
        cues.append(f'{i+1}\n{timecode(elapsed+.25)} --> {timecode(elapsed+s["seconds"]-.25)}\n{s["subtitle"]}\n')
        elapsed+=s['seconds']
    (OUT/'Life-Again-Trailer.vi.srt').write_text('\n'.join(cues),encoding='utf-8-sig')
    manifest={'title':'Life Again — Sống thêm một đời nữa','language':'vi','duration_seconds':elapsed,
              'width':W,'height':H,'fps':FPS,'audio':'Instrumental arrangement of game music; no spoken narration',
              'visuals':'Existing game screenshots, character sprites, project OpenMoji assets and animated typography',
              'scenes':SCENES,'notes':['No unverified multiplayer, account, or ranking claims.',
                       'Offline play requires an initial online load; transfer codes require connectivity.',
                       'Mini-games use in-game currency and assets.'],
              'credits':{'game':'Life Again / QuocDan','icons':'OpenMoji, CC BY-SA 4.0; see project js/img/events/openmoji/NOTICE.md',
                         'music':'Arrangement based on js/ui/music-themes.js'}}
    (OUT/'trailer-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    return elapsed


def synth_music(duration):
    rate=44100; mix=np.zeros((int(duration*rate),2),np.float32)
    themes=json.loads((OUT/'music-themes.json').read_text(encoding='utf-8'))
    rng=np.random.default_rng(79)

    def add(start,seconds,note,amp=.1,voice='bell',pan=0):
        if note is None: return
        length=min(int(seconds*rate),len(mix)-int(start*rate))
        if length<=0:return
        t=np.arange(length,dtype=np.float32)/rate
        hz=440*2**((note-69)/12)
        attack=np.minimum(t/.018,1)
        if voice=='pad':
            sig=(np.sin(2*np.pi*hz*t)+.24*np.sin(2*np.pi*hz*2.002*t))
            env=np.minimum(t/.2,1)*np.minimum((seconds-t)/.4,1)*.55
        elif voice=='bass':
            sig=np.sin(2*np.pi*hz*t)+.15*np.sin(2*np.pi*hz*2*t)
            env=attack*np.exp(-t*3.5)
        else:
            sig=np.sin(2*np.pi*hz*t)+.3*np.sin(2*np.pi*hz*2*t)*np.exp(-t*4)+.1*np.sin(2*np.pi*hz*3*t)*np.exp(-t*6)
            env=attack*np.exp(-t*3.3)*np.minimum((seconds-t)/.04,1)
        sig=np.asarray(sig*env*amp,dtype=np.float32)
        a=int(start*rate); mix[a:a+length,0]+=sig*(1-pan*.4); mix[a:a+length,1]+=sig*(1+pan*.4)

    # Musical sections follow the narrative, adapting motifs already heard in the game.
    sections=[(0,97,'home',84),(97,124,'tower',92),(124,142,'auction',100),
              (142,169,'arcade',112),(169,duration,'home',84)]
    # Extend the final home motif naturally if scene durations change.
    for start,end,key,bpm in sections:
        end=min(end,duration)
        if end<=start:continue
        theme=themes[key]; step=60/bpm/2; barlen=step*8
        pos=start; barno=0
        while pos<end:
            b=theme['bars'][barno%len(theme['bars'])]
            chord=b.get('chord',[]); bass=b.get('bass'); melody=b.get('melody',[])
            # The theme data names the melody as `notes` in some project revisions.
            if not melody: melody=b.get('lead',b.get('notes',[]))
            for note in chord: add(pos,min(barlen+.3,end-pos),note,.035,'pad')
            if isinstance(bass,(int,float)):
                for beat in range(4):add(pos+beat*step*2,min(step*1.7,end-pos-beat*step*2),bass,.12,'bass')
            elif isinstance(bass,list):
                for k,note in enumerate(bass):
                    if pos+k*step<end:add(pos+k*step,min(step*1.5,end-pos-k*step),note,.095,'bass')
            for k,note in enumerate(melody):
                if pos+k*step<end:add(pos+k*step,min(step*2.8,end-pos-k*step),note,.085,'bell',math.sin(k)*.6)
            if key!='home':
                for k in range(8):
                    a=int((pos+k*step)*rate); length=min(int(.07*rate),len(mix)-a,int((end-pos-k*step)*rate))
                    if length>0:
                        tt=np.arange(length)/rate
                        hit=rng.normal(0,.01,length)*np.exp(-tt*70)
                        if k%4==0: hit+=.08*np.sin(2*np.pi*(65*tt-40*tt*tt))*np.exp(-tt*35)
                        mix[a:a+length]+=hit[:,None]
            pos+=barlen;barno+=1
    # Chapter accents and a gentle opening/closing envelope.
    elapsed=0
    for i,s in enumerate(SCENES):
        if i>0:
            add(elapsed,.55,84,.025,'bell',-.5)
        elapsed+=s['seconds']
    peak=float(np.max(np.abs(mix)))
    mix*=.72/max(peak,.72)
    fadein=min(int(rate*2),len(mix)); fadeout=min(int(rate*4),len(mix))
    mix[:fadein]*=np.linspace(0,1,fadein)[:,None]
    mix[-fadeout:]*=np.linspace(1,0,fadeout)[:,None]
    with wave.open(str(OUT/'soundtrack.wav'),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate)
        f.writeframes(np.asarray(np.clip(mix,-1,1)*32767,dtype='<i2').tobytes())


def main():
    total=write_metadata()
    layers=[make_layers(s,i) for i,s in enumerate(SCENES)]
    sheet=Image.new('RGB',(1600,math.ceil(len(SCENES)/4)*245),'#101b25')
    elapsed=0
    for i,(s,ls) in enumerate(zip(SCENES,layers)):
        preview=composite_frame(ls,s,2,i,elapsed)
        preview.save(OUT/f'scene-{i+1:02}.jpg',quality=91)
        thumb=preview.resize((400,225),Image.Resampling.LANCZOS)
        sheet.paste(thumb,((i%4)*400,(i//4)*245))
        ImageDraw.Draw(sheet).text(((i%4)*400+10,(i//4)*245+227),f'{i+1:02}   {elapsed//60:02}:{elapsed%60:02}   {s["seconds"]}s',fill='white')
        elapsed+=s['seconds']
    sheet.save(OUT/'storyboard.jpg',quality=94)
    composite_frame(layers[0],SCENES[0],2,0,0).save(OUT/'Life-Again-Trailer-cover.jpg',quality=95)
    print(f'Prepared {len(SCENES)} scenes / {total} seconds',flush=True)
    if '--preview-only' in sys.argv:return
    synth_music(total)
    ffmpeg=next((OUT/'tools/imageio_ffmpeg/binaries').glob('ffmpeg-*.exe'))
    silent=OUT/'video-silent.mp4'
    cmd=[str(ffmpeg),'-y','-hide_banner','-loglevel','error','-f','rawvideo','-vcodec','rawvideo',
         '-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','-',
         '-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-threads','4',str(silent)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    elapsed=0
    try:
        for i,(s,ls) in enumerate(zip(SCENES,layers)):
            print(f'Rendering {i+1:02}/{len(SCENES)}: {s["chapter"]}',flush=True)
            for n in range(s['seconds']*FPS):
                frame=composite_frame(ls,s,n/FPS,i,elapsed)
                proc.stdin.write(frame.tobytes())
            elapsed+=s['seconds']
        proc.stdin.close()
        if proc.wait()!=0:raise RuntimeError('Video encoding failed')
    except BaseException:
        proc.kill();raise
    # Embed a selectable Vietnamese subtitle track as well as providing the editable SRT.
    dest=OUT/'Life-Again-Trailer-1080p.mp4'
    subprocess.run([str(ffmpeg),'-y','-hide_banner','-loglevel','error','-i',str(silent),
                    '-i',str(OUT/'soundtrack.wav'),'-i',str(OUT/'Life-Again-Trailer.vi.srt'),
                    '-map','0:v','-map','1:a','-map','2:s','-c:v','copy','-c:a','aac','-b:a','192k',
                    '-c:s','mov_text','-metadata:s:s:0','language=vie','-metadata:s:a:0','language=zxx',
                    '-metadata','title=Life Again — Sống thêm một đời nữa',
                    '-metadata','comment=Game footage and animated feature introduction. Music arranged from project themes. OpenMoji CC BY-SA 4.0.',
                    '-movflags','+faststart','-t',str(total),str(dest)],check=True)
    print(f'Complete: {dest} ({dest.stat().st_size/1024/1024:.1f} MiB)',flush=True)


if __name__=='__main__':main()
