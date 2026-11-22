(function(){
var hero=document.getElementById('hero'),D=window.__heroPts,cv=document.getElementById('hd-cv');
if(!hero||!D||!cv||!cv.getContext)return;
var ctx=cv.getContext('2d'),pin=hero.querySelector('.hd-pin');if(!ctx||!pin)return;
var PF=window.__perf||{lite:false,ultra:false,report:function(){}},RM=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
// ---- the portrait: 14,000 dot positions (0..65535 across the portrait box) + brightness, decoded once
var bin=atob(D.d),raw=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)raw[i]=bin.charCodeAt(i);
var N0=D.n,PX=new Uint16Array(raw.buffer,0,N0),PY=new Uint16Array(raw.buffer,2*N0,N0),PL=raw.subarray(4*N0,5*N0),ASP=D.aspect;
var NMAX=N0+1300;
// ---- every dot gets its own drift, delay and swirl (seeded, so it looks the same on every visit)
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var R=rng(20260131),bx=new Float32Array(NMAX),by=new Float32Array(NMAX),ax=new Float32Array(NMAX),ay=new Float32Array(NMAX),fx=new Float32Array(NMAX),fy=new Float32Array(NMAX),p1=new Float32Array(NMAX),p2=new Float32Array(NMAX),dl=new Float32Array(NMAX),sw=new Float32Array(NMAX),sz=new Float32Array(NMAX),bk=new Uint8Array(NMAX),tx=new Float32Array(NMAX),ty=new Float32Array(NMAX);
for(var k=0;k<NMAX;k++){bx[k]=R();by[k]=R();ax[k]=18+R()*90;ay[k]=18+R()*90;fx[k]=.05+R()*.22;fy[k]=.05+R()*.22;p1[k]=R()*6.283;p2[k]=R()*6.283;dl[k]=R();sw[k]=(R()-.5)*2;sz[k]=.7+R()*1.1;
 if(k<N0){var l=PL[k]/255;bk[k]=l<.34?0:l<.58?1:l<.8?2:3}else{bk[k]=R()<.55?0:R()<.6?1:R()<.7?2:3;sz[k]=1+R()*1.7}}
// ---- state
var W=0,H=0,dpr=1,NP=0,NA=0,N=0,groups=[],iw=0,ih=0,top0=0,top0s=0,span=0,tp=RM?1:0,cp=tp,live=false,raf=0,last=0,fc=0,T0=performance.now(),mx=-9999,my=-9999,smx=-9999,smy=-9999,pAct=0,appliedUltra=false,cls={start:null,on:null};
function counts(){var np=PF.ultra?2750:PF.lite?4800:12800,na=PF.ultra?250:PF.lite?400:1200;NP=Math.min(np,N0);NA=na;N=NP+NA}
function layout(){
 counts();W=pin.clientWidth;H=pin.clientHeight;dpr=Math.min(devicePixelRatio||1,PF.ultra?1:PF.lite?1.25:2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 var wide=W>=900||W>H*1.25,cx;
 if(wide){ih=Math.min(H*.84,W*.5/ASP);iw=ih*ASP;cx=W*.955-iw/2;top0=(H-ih)/2-H*.005}
 else{ih=Math.min(H*.56,W*1.0/ASP);iw=ih*ASP;cx=W/2;top0=Math.max(64,H*.085)}
 for(var k=0;k<NP;k++){tx[k]=cx+(PX[k]/65535-.5)*iw;ty[k]=top0+(PY[k]/65535)*ih}
 // group dots by brightness so each group is drawn with a single fill colour
 var g0=[[],[],[],[]];for(var j=0;j<N;j++){var kk=j<NP?j:N0+(j-NP);g0[bk[kk]].push(kk)}
 groups=g0.map(function(a){return Int32Array.from(a)})}
function measure(){var r=hero.getBoundingClientRect();top0s=r.top+scrollY;span=r.height-pin.offsetHeight}
function prog(){return RM?1:(span>0?Math.min(1,Math.max(0,(scrollY-top0s)/span)):0)}
function setCls(){var a=cp<.12,b=cp>.72;if(a!==cls.start){cls.start=a;hero.classList.toggle('hd-start',a)}if(b!==cls.on){cls.on=b;hero.classList.toggle('hd-on',b)}}
var ALPHA=['rgba(255,255,255,.34)','rgba(255,255,255,.58)','rgba(255,255,255,.82)','#fff'];
function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
function draw(now){
 var T=(now-T0)/1000,t=Math.min(1,Math.max(0,(cp-.05)/.62)),form=1.05+Math.min(.6,iw/1100);
 // pointer (desktop): dots near the cursor are nudged away and drift back
 var useP=fine&&!RM&&pAct>0;if(useP){smx+=(mx-smx)*.2;smy+=(my-smy)*.2}
 ctx.clearRect(0,0,W,H);
 for(var g=0;g<4;g++){var idx=groups[g];ctx.fillStyle=ALPHA[g];var bs=.82+.12*g;
  for(var n=0;n<idx.length;n++){var k=idx[n],x,y,s,port=k<N0;
   var fxp=bx[k]*W+ax[k]*Math.sin(T*fx[k]+p1[k]),fyp=by[k]*H+ay[k]*Math.cos(T*fy[k]+p2[k]);
   if(port&&t>0){var u=(t-dl[k]*.38)/.62;u=u<0?0:u>1?1:u;var e=ease(u);
    if(e>0){var ddx=tx[k]-fxp,ddy=ty[k]-fyp,len=Math.sqrt(ddx*ddx+ddy*ddy)+.001,so=Math.sin(3.14159*e)*sw[k]*len*.22;
     x=fxp+ddx*e-ddy/len*so;y=fyp+ddy*e+ddx/len*so;
     if(e>.98){x+=Math.sin(T*1.7+p1[k])*.6;y+=Math.cos(T*1.5+p2[k])*.6}
     s=sz[k]*(1-e)+form*bs*e}
    else{x=fxp;y=fyp;s=sz[k]}}
   else{x=fxp;y=fyp;s=sz[k];if(!port)s*=.75+.45*Math.sin(T*1.3+p1[k]*3)}
   if(useP){var dx=x-smx,dy=y-smy,d2=dx*dx+dy*dy;if(d2<14400){var d=Math.sqrt(d2)+.01,f=1-d/120;f=f*f*40;x+=dx/d*f;y+=dy/d*f}}
   ctx.fillRect(x-s*.5,y-s*.5,s,s)}}
 setCls()}
function frame(now){raf=0;if(!live)return;
 var steady=cp<.0005||cp>.9995;
 if(PF.lite&&steady&&Math.abs(tp-cp)<.0005&&(fc++&1)){raf=requestAnimationFrame(frame);return}
 var dtr=last?now-last:16;last=now;PF.report(dtr);
 if(PF.ultra&&!appliedUltra){appliedUltra=true;layout()}
 cp+=(tp-cp)*(1-Math.exp(-Math.min(.05,dtr/1000)*7));if(Math.abs(tp-cp)<.0004)cp=tp;
 if(pAct>0)pAct-=dtr/1000;
 draw(now);raf=requestAnimationFrame(frame)}
function start(){if(!raf&&live)raf=requestAnimationFrame(frame)}
function init(){hero.classList.add('hd-js');layout();measure();tp=prog();cp=RM?1:tp;draw(performance.now());
 if(RM)return;
 addEventListener('scroll',function(){tp=prog()},{passive:true});
 var rs=function(){layout();measure();tp=prog();draw(performance.now())};addEventListener('resize',rs);addEventListener('orientationchange',rs);addEventListener('load',function(){measure();tp=prog()});
 if(window.ResizeObserver){var q=0;new ResizeObserver(function(){cancelAnimationFrame(q);q=requestAnimationFrame(function(){measure();tp=prog()})}).observe(document.documentElement)}
 if(fine){pin.addEventListener('pointermove',function(e){var r=pin.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(pAct<=0){smx=mx;smy=my}pAct=2.5});pin.addEventListener('pointerleave',function(){pAct=0})}
 new IntersectionObserver(function(es){live=es[0].isIntersecting;if(live){measure();tp=prog();last=0;start()}},{rootMargin:'10% 0px'}).observe(hero);
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&live){last=0;start()}})}
init();
})();
