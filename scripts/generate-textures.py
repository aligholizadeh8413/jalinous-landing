"""Deterministic, project-owned PBR textures; no external licensed imagery.
Run with Python, Pillow and numpy. Color is sRGB; normal/roughness are linear data.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import random, math
ROOT=Path(__file__).resolve().parents[1]/'public/textures'
ROOT.mkdir(exist_ok=True)
rng=np.random.default_rng(742)
N=512

def noise(s):
    a=rng.random((s,s))*255
    return np.asarray(Image.fromarray(a.astype('uint8')).resize((N,N),Image.Resampling.BICUBIC),dtype=float)/255-.5

def save(name,base,height,rough=.85,strength=1.8):
    Image.fromarray(np.clip(base,0,255).astype('uint8')).save(ROOT/f'{name}.webp',quality=88)
    gx=(np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*strength
    gy=(np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*strength
    v=np.stack([-gx,gy,np.ones_like(gx)],axis=-1);v/=np.linalg.norm(v,axis=-1,keepdims=True)
    Image.fromarray(((v+1)*127.5).astype('uint8')).save(ROOT/f'{name}-normal.webp',quality=92)
    roughmap=np.clip(rough+noise(128)*.12,0,1)*255
    Image.fromarray(roughmap.astype('uint8')).save(ROOT/f'{name}-roughness.webp',quality=85)

fine=noise(256); wide=noise(12); veins=noise(64)
y,x=np.mgrid[:N,:N]
banding=np.sin(y*.17+wide*6+veins)*.8+np.sin(y*.43+wide*13)*.4
stone=wide*6+fine*7+banding+veins*2
save('limestone-v2',np.array([204,190,163])+stone[...,None],fine*.2+banding*.016,.88,1.4)
red=wide*12+fine*10+np.sin(x*.058+noise(24)*6)*2
save('cladding-v2',np.array([112,75,66])+red[...,None],fine*.09+wide*.03,.6,1.3)
# Pavers: measured block pattern at a physical 2.56m repeat, 0.32 x 0.16m units.
col=np.zeros((N,N,3));h=np.zeros((N,N));rnd=random.Random(91)
for row in range(16):
    offset=32*(row%2)
    for column in range(-1,9):
        start=column*64+offset;end=start+64
        l=max(0,start);r=min(N,end)
        if l>=r:continue
        c=np.array(rnd.choice([[144,130,114],[160,144,123],[167,142,121],[149,143,130],[178,155,130]]))+rnd.uniform(-6,6)
        yy=slice(row*32,(row+1)*32);xx=slice(l,r)
        col[yy,xx]=c;h[yy,xx]=.7+rnd.uniform(-.03,.03)
        for k in range(2):
            col[row*32+k,xx]=[95,92,80];h[row*32+k,xx]=.12
            if l==start:col[yy,l+k]=[95,92,80];h[yy,l+k]=.12
col+=fine[...,None]*11+wide[...,None]*8
h+=fine*.08
h=np.asarray(Image.fromarray((h*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.8)),dtype=float)/255
save('pavers-v2',col,h,.94,2.2)
# Long, fissured bark, not a uniformly colored cylinder.
fissure=np.sin(x*.22+noise(16)*9+noise(64)*2)
bark=noise(128)*15+wide*20+np.clip(fissure,-1,-.4)*24
save('pine-bark',np.array([110,94,75])+bark[...,None],fissure*.12+noise(128)*.22,.97,2)
# Brown roofing has irregular, staggered shingles. Physical repeat 1.6m square.
roof=np.zeros((N,N,3));rh=np.zeros((N,N))
for row in range(12):
    y0=int(row*N/12);y1=int((row+1)*N/12)
    for c in range(-1,9):
        x0=c*64+(row%2)*32;x1=x0+64;l=max(x0,0);r=min(x1,N)
        if l>=r:continue
        roof[y0:y1,l:r]=np.array([94,77,69])+rnd.uniform(-10,10)
        rh[y0:y1,l:r]=np.linspace(.25,.72,y1-y0)[:,None]
        roof[y0:y0+2,l:r]*=.6;rh[y0:y0+2,l:r]=.05
        roof[y0:y1,l:l+1]*=.65
save('roof-shingles',roof+fine[...,None]*13,rh+fine*.06,.91,1.8)
# Alpha-tested pine sprig atlas. Branchlets and hundreds of slender needles.
im=Image.new('RGBA',(512,512));d=ImageDraw.Draw(im);r=random.Random(77)
for branch in range(15):
    angle=branch*2.39996+r.uniform(-.2,.2);length=r.uniform(110,230)
    bx,by=256,280;ex,ey=bx+math.cos(angle)*length,by+math.sin(angle)*length
    d.line((bx,by,ex,ey),fill=(91,88,48,255),width=3)
    for k in range(8,42):
        t=k/42;px=bx+(ex-bx)*t;py=by+(ey-by)*t
        for side in [-1,1]:
            a=angle+side*r.uniform(.35,1.1);ln=r.uniform(18,48)*(1-t*.35)
            col=r.choice([(55,72,30,255),(74,90,41,255),(88,103,48,255),(103,110,57,255),(49,64,32,255)])
            d.line((px,py,px+math.cos(a)*ln,py+math.sin(a)*ln),fill=col,width=2)
im.save(ROOT/'pine-sprig.webp',lossless=True)
print('Generated',len(list(ROOT.glob('*v2*')))+len(list(ROOT.glob('pine*'))),'PBR/foliage assets')
