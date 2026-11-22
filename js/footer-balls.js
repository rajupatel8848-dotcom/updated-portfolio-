/* Footer: coloured balls fall, pile up and get pushed around by the cursor (tiny circle physics, no libraries). */
(function(){
var cv=document.getElementById('fo-balls');if(!cv||!cv.getContext)return;
var host=cv.parentNode,foot=document.querySelector('footer'),g=cv.getContext('2d'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
var W=0,Hh=0,dpr=1,R=30,balls=[],raf=0,vis=false,last=0,spawned=false,mx=-999,my=-999,mvx=0,mvy=0,inside=false,pmx=0,pmy=0,pt=0;
var COL=[{f:'#FF4A1C',s:'#16161D',a:'#16161D'},{f:'#16161D',s:'#FF4A1C',a:'#FF4A1C'},{f:'#FFFFFF',s:'#16161D',a:'#16161D'}];
function size(){var r=cv.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;Hh=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);R=Math.max(22,Math.min(38,W*.03));balls.forEach(function(b){b.r=R;if(b.x>W-R)b.x=W-R;if(b.y>Hh-R)b.y=Hh-R})}
function spawn(){spawned=true;var N=W<700?16:26;for(var i=0;i<N;i++)balls.push({x:R+Math.random()*(W-2*R),y:-R-i*(RM?3:R*1.3)-Math.random()*60,vx:(Math.random()-.5)*160,vy:0,r:R,t:i%3===0?0:(i%3===1?1:2),a:Math.random()*6.28,w:(Math.random()-.5)*3});
 if(RM){for(var k=0;k<900;k++)step(1/120);draw()}}
var GR=2000,E=.38;
function step(dt){
 var i,j,b,c,dx,dy,d,nx,ny,ov,vn,jj;
 for(i=0;i<balls.length;i++){b=balls[i];b.vy+=GR*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.a+=b.w*dt;b.w*=.995;
  if(b.x<b.r){b.x=b.r;b.vx=-b.vx*E}else if(b.x>W-b.r){b.x=W-b.r;b.vx=-b.vx*E}
  if(b.y>Hh-b.r){b.y=Hh-b.r;if(b.vy>60)b.vy=-b.vy*E;else b.vy=0;b.vx*=.985;b.w+=b.vx/b.r*.02}
  if(inside){dx=b.x-mx;dy=b.y-my;d=Math.sqrt(dx*dx+dy*dy);var cr=b.r+34;
   if(d<cr&&d>.01){nx=dx/d;ny=dy/d;b.x=mx+nx*cr;b.y=my+ny*cr;var sp=Math.min(2600,Math.hypot(mvx,mvy)),vn2=b.vx*nx+b.vy*ny;if(vn2<0){b.vx-=vn2*nx*1.4;b.vy-=vn2*ny*1.4}b.vx+=nx*sp*.55+mvx*.35;b.vy+=ny*sp*.55+mvy*.35;b.w+=(nx*mvy-ny*mvx)/b.r*.006}}}
 for(var it=0;it<3;it++)for(i=0;i<balls.length;i++){b=balls[i];for(j=i+1;j<balls.length;j++){c=balls[j];dx=c.x-b.x;dy=c.y-b.y;d=Math.sqrt(dx*dx+dy*dy);var m=b.r+c.r;
  if(d<m&&d>.001){nx=dx/d;ny=dy/d;ov=(m-d)/2;b.x-=nx*ov;b.y-=ny*ov;c.x+=nx*ov;c.y+=ny*ov;vn=(c.vx-b.vx)*nx+(c.vy-b.vy)*ny;
   if(vn<0){jj=-(1+E)*vn/2;b.vx-=jj*nx;b.vy-=jj*ny;c.vx+=jj*nx;c.vy+=jj*ny;var tv=(c.vx-b.vx)*-ny+(c.vy-b.vy)*nx;b.w+=tv/b.r*.01;c.w+=tv/c.r*.01}}}
  if(b.y>Hh-b.r)b.y=Hh-b.r}}
function star(r,col){g.strokeStyle=col;g.lineWidth=r*.15;g.lineCap='round';g.beginPath();for(var k=0;k<8;k++){var an=k*Math.PI/4,c=Math.cos(an),s=Math.sin(an);g.moveTo(c*r*.16,s*r*.16);g.lineTo(c*r*.62,s*r*.62)}g.stroke()}
function draw(){g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,Hh);
 for(var i=0;i<balls.length;i++){var b=balls[i],c=COL[b.t];if(b.y<-b.r*2)continue;g.save();g.translate(b.x,b.y);g.rotate(b.a);
  g.beginPath();g.arc(0,0,b.r-1.5,0,6.2832);g.fillStyle=c.f;g.fill();g.lineWidth=3;g.strokeStyle=c.s;g.stroke();star(b.r,c.a);g.restore()}}
function frame(t){raf=0;if(!vis)return;var dt=Math.min(.033,(t-last)/1000||.016);last=t;
 step(dt/2);step(dt/2);draw();mvx*=.72;mvy*=.72;raf=requestAnimationFrame(frame)}
function go(){if(!raf&&vis&&!RM){last=performance.now();raf=requestAnimationFrame(frame)}}
size();addEventListener('resize',function(){size();if(RM&&spawned){balls.length=0;spawn()}});
new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis){if(!spawned){size();spawn()}go()}},{threshold:.15}).observe(host);
if(fine&&foot){foot.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,t=performance.now(),dt=Math.max(8,t-pt)/1000;
 if(pt){mvx=Math.max(-2600,Math.min(2600,(x-pmx)/dt));mvy=Math.max(-2600,Math.min(2600,(y-pmy)/dt))}pmx=x;pmy=y;pt=t;mx=x;my=y;inside=true});
 foot.addEventListener('pointerleave',function(){inside=false;mx=my=-999})}
/* tap / click a ball pile: kick the nearby balls */
if(foot)foot.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;balls.forEach(function(b){var dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);if(d<170){var k=(1-d/170);b.vx+=dx/(d||1)*900*k;b.vy-=520*k+Math.abs(dy/(d||1))*300*k;b.w+=(Math.random()-.5)*8*k}})});
})();
