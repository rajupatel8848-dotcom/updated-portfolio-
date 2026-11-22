"""Regenerates the landing-page dot portrait from a photo.
Usage (from the project folder):  python3 tools/make_hero_dots.py path/to/photo.jpg
Needs: python3, numpy, opencv-python, pillow.   Writes js/hero-data.js, assets/images/hero-portrait.webp, tools/dots-preview.png
Tip: a front-facing head-and-shoulders photo on a plain background works best. The crop box (x0,x1,y0,y1) and the
face/torso hints below are tuned for the current portrait (640x930) - adjust them for a different photo.
"""
import numpy as np, cv2, base64, os
from PIL import Image
import sys
src=sys.argv[1] if len(sys.argv)>1 else 'assets/images/portrait.jpg'
im=cv2.imread(src);H,W=im.shape[:2]
# ---- 1. person mask (head, neck, shoulders) via grabCut
mask=np.full((H,W),cv2.GC_BGD,np.uint8);mask[10:H-10,20:W-20]=cv2.GC_PR_BGD
gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
mask[(gray<75)&(np.arange(H)[:,None]<520)&(np.arange(W)[None,:]>120)&(np.arange(W)[None,:]<500)]=cv2.GC_FGD
core=np.zeros((H,W),np.uint8);cv2.ellipse(core,(315,300),(105,200),0,0,360,1,-1);mask[core>0]=cv2.GC_FGD
cv2.rectangle(core,(230,430),(410,H),1,-1);mask[core>0]=cv2.GC_FGD
b,g,r=[im[...,i].astype(int) for i in range(3)];mask[(b>r+18)&(np.arange(H)[:,None]>470)]=cv2.GC_FGD
bgd=np.zeros((1,65));fgd=np.zeros((1,65));cv2.grabCut(im,mask,None,bgd,fgd,6,cv2.GC_INIT_WITH_MASK)
fg=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype(np.uint8)
n,lab,st,_=cv2.connectedComponentsWithStats(fg,connectivity=8);fg=(lab==(np.argmax(st[1:,cv2.CC_STAT_AREA])+1)).astype(np.uint8)
inv=1-fg;n,lab,st,_=cv2.connectedComponentsWithStats(inv,connectivity=4)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]<3000: fg[lab==i]=1
# ---- 2. brightness map + weighted dot sampling
rng=np.random.default_rng(7)
x0,x1,y0,y1=18,622,8,728
g2=cv2.createCLAHE(clipLimit=3.2,tileGridSize=(8,8)).apply(gray);gf=g2.astype(np.float32)/255.
gf=np.clip(gf+(gf-cv2.GaussianBlur(gf,(0,0),9))*1.9,0,1)
L=np.clip(gf,0,1)**0.9;m=cv2.GaussianBlur(fg.astype(np.float32),(0,0),1.1);L=L*m
yy=np.arange(H)[:,None].astype(np.float32);fade=1-0.78*np.clip((yy-520)/(y1-520),0,1)**1.3
w=((0.05+L)**2.3)*m*fade
edge=cv2.morphologyEx(fg,cv2.MORPH_GRADIENT,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))).astype(np.float32);edge=cv2.GaussianBlur(edge,(0,0),0.8)
w=w+edge*0.35*fade;w[:y0]=0;w[y1:]=0;w[:,:x0]=0;w[:,x1:]=0
p=(w/w.sum()).ravel();N=14000
idx=rng.choice(p.size,size=N,replace=False,p=p);ys,xs=np.divmod(idx,W);xs=xs+rng.random(N)-.5;ys=ys+rng.random(N)-.5
yi=np.clip(ys.astype(int),0,H-1);xi=np.clip(xs.astype(int),0,W-1)
lum=np.clip(L[yi,xi]*1.1+0.15*edge[yi,xi],0,1)
order=rng.permutation(N);xs,ys,lum=xs[order],ys[order],lum[order]
cw,ch=x1-x0,y1-y0;nx=np.clip((xs-x0)/cw,0,1);ny=np.clip((ys-y0)/ch,0,1)
raw=(nx*65535).round().astype('<u2').tobytes()+(ny*65535).round().astype('<u2').tobytes()+(lum*255).round().astype('u1').tobytes()
open('js/hero-data.js','w').write('window.__heroPts={n:%d,aspect:%.4f,d:"%s"};\n'%(N,cw/ch,base64.b64encode(raw).decode()))
# ---- 3. no-JavaScript fallback portrait (black & white cut-out)
out=(cv2.createCLAHE(clipLimit=3.0,tileGridSize=(8,8)).apply(gray)*cv2.GaussianBlur(fg.astype(np.float32),(0,0),1.2)).astype(np.uint8)[8:728,18:622]
Image.fromarray(out).save('assets/images/hero-portrait.webp',quality=82)
# preview
S=.95;pw,ph=int(cw*S),int(ch*S);cv=np.zeros((ph,pw),np.float32)
for a,b_,l in zip(nx[:14000],ny[:14000],lum):
    cx,cy=int(a*(pw-1)),int(b_*(ph-1));cv[cy:cy+2,cx:cx+2]=np.maximum(cv[cy:cy+2,cx:cx+2],0.45+0.55*l)
cv2.imwrite('tools/dots-preview.png',(cv*255).astype(np.uint8))
print('hero-data.js',os.path.getsize('js/hero-data.js')//1024,'KB; fallback',os.path.getsize('assets/images/hero-portrait.webp')//1024,'KB; aspect',round(cw/ch,4))
