import json,sys,os
from PIL import Image, ImageDraw
d=sys.argv[1]; m=json.load(open(os.path.join(d,'manifest.json')))['manifest']
for canvas in sorted(set(x['canvas'] for x in m)):
    items=[x for x in m if x['canvas']==canvas]
    W=1800; pad=16; x=pad; y=pad; rowh=0; placed=[]
    for it in items:
        im=Image.open(os.path.join(d,it['file'])); im=im.resize((im.width//2, im.height//2))
        if x+im.width>W: x=pad; y+=rowh+pad+18; rowh=0
        placed.append((im,x,y,it['id'])); x+=im.width+pad; rowh=max(rowh,im.height)
    H=y+rowh+pad+18
    sheet=Image.new('RGB',(W,H),(240,238,233)); dr=ImageDraw.Draw(sheet)
    for im,x,y,label in placed:
        dr.text((x,y),label,fill=(60,50,40)); sheet.paste(im,(x,y+14))
    sheet.save(os.path.join(d,f'hoja-{canvas}.png')); print(canvas,W,H)
