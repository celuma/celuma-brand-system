import sys
from PIL import Image, ImageDraw
d=sys.argv[1]; out=sys.argv[2]
fmts=['square','portrait','story','link','wide']; conts=['corto','medio','largo']
cells=[[Image.open(f'{d}/digital__pub-a-prueba-{c}-{f}.png') for f in fmts] for c in conts]
cells=[[i.resize((i.width//2,i.height//2)) for i in r] for r in cells]
colw=[max(r[j].width for r in cells) for j in range(5)]; rowh=[max(i.height for i in r) for r in cells]
W=sum(colw)+12*6+60; H=sum(rowh)+12*4+20
s=Image.new('RGB',(W,H),(225,223,218)); dr=ImageDraw.Draw(s); y=20
for ri,r in enumerate(cells):
    dr.text((6,y+10),conts[ri],fill=(40,40,40)); x=60
    for j,i in enumerate(r): s.paste(i,(x,y)); x+=colw[j]+12
    y+=rowh[ri]+12
s.save(out); print(s.size)
