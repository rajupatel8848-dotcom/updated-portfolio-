(function(){const URL_='https://pycrafters-official.vercel.app/';
/* Education milestones. Each card has its own colour pair (c1 -> c2) and a text colour (x). */
const D=[
{k:'01',l:'School',t:'School Foundation',c1:'#FF9A2E',c2:'#FF5A0A',x:'#1A1208',d:'Spring Day Higher Secondary School, Jabalpur.',s:'Jabalpur · Foundation'},
{k:'02',l:'86%',t:'Class 10',c1:'#FFE066',c2:'#FFB300',x:'#2A1B00',d:'Academic result: 86%.',s:'Spring Day Higher Secondary School'},
{k:'03',l:'88.4%',t:'Class 12',c1:'#FF6B7A',c2:'#E01E37',x:'#fff',d:'Academic result: 88.4%.',s:'Spring Day Higher Secondary School'},
{k:'04',t:'Engineering Journey',c1:'#4BE08F',c2:'#0E9F55',x:'#04200F',img:'por',d:'Gyan Ganga Institute of Technology.',s:'B.Tech · Gyan Ganga Institute of Technology'},
{k:'05',l:'AIML',t:'B.Tech in AIML',c1:'#5AB0FF',c2:'#2563EB',x:'#fff',d:'Currently pursuing a Bachelor of Technology in Artificial Intelligence and Machine Learning.',s:'In progress'},
{k:'06',t:'Building Pycrafters',c1:'#B79CFF',c2:'#7C3AED',x:'#fff',img:'logo',d:'Started a company with my team while developing my technical skills and exploring real-world digital products.',s:'Company · Web · Automation',h:URL_}];
const n=D.length,w=document.getElementById('journey'),tk=document.getElementById('dtk'),inf=document.getElementById('inf'),dn=document.getElementById('dn'),dp=document.getElementById('dp'),rmq=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
const logo=document.querySelector('.lg'),por=document.getElementById('pimg');let idx=-1,pos=0,mx=0,my=0;
const PF=window.__perf||{lite:false,ultra:false,report(){}},dsEl=w.querySelector('.ds');let top0=0,span=0,fc=0;
function measure(){const r=w.getBoundingClientRect();top0=r.top+scrollY;span=r.height-(dsEl?dsEl.offsetHeight:innerHeight)}
function go(i){measure();scrollTo({top:top0+span*(.04+.92*i/(n-1))})}
function show(i){idx=i;const o=D[i],a=document.getElementById('iv');document.getElementById('ik').textContent='Milestone '+o.k;document.getElementById('it2').textContent=o.t;document.getElementById('id2').textContent=o.d;document.getElementById('is').textContent=o.s;
inf.style.setProperty('--ac',o.c1);
if(o.h){a.hidden=false;a.href=o.h;a.target='_blank';a.rel='noopener'}else{a.hidden=true;a.removeAttribute('href')}
dn.textContent='0'+(i+1)+' / 0'+n;inf.classList.remove('go');void inf.offsetWidth;inf.classList.add('go')}
const els=D.map((o,i)=>{const b=document.createElement('button');b.type='button';b.className='d';b.setAttribute('aria-label','Milestone '+o.k+': '+o.t);
b.style.setProperty('--c1',o.c1);b.style.setProperty('--c2',o.c2);b.style.setProperty('--tx',o.x);
const big=o.l||o.t.split(' ')[0];
b.innerHTML='<span class="cf"><span class="cb"><i></i><i></i><i></i><em>journey / '+o.k+'</em></span><span class="cm'+(o.img?' hi':'')+'"><b class="cn">'+o.k+'</b><span class="cl">'+big+'</span><span class="ct">'+o.t+'</span><span class="cs">'+o.s+'</span></span><span class="ci"></span><span class="cg"></span><span class="cd"></span></span>';
const ci=b.querySelector('.ci');if(o.img){ci.style.backgroundImage='url("'+(o.img=='logo'?logo.src:por.src)+'")';ci.classList.add('on')}
const e={b,dm:b.querySelector('.cd'),h:false};
b.onclick=()=>{if(rmq){show(i);return}if(i!==idx)go(i);else if(o.h)window.open(o.h,'_blank','noopener')};b.onfocus=()=>{if(!rmq&&i!==idx)go(i);else show(i)};
b.onpointerenter=()=>e.h=true;b.onpointerleave=()=>e.h=false;tk.appendChild(b);return e});
const I=.04,O=.04,SP=.32,smt=t=>t*t*(3-2*t),clp=(v,a,b)=>Math.min(b,Math.max(a,v));
let q=false,pIdle=0,pr=0,vis=false,last=0;
function prog(){return span>0?clp((scrollY-top0)/span,0,1):0}
measure();addEventListener('load',measure);addEventListener('orientationchange',measure);
if(window.ResizeObserver){let rq=0;new ResizeObserver(()=>{cancelAnimationFrame(rq);rq=requestAnimationFrame(measure)}).observe(document.documentElement)}
// pos = which card is in front. Outside the pinned part it drifts by itself in an endless loop; inside it follows the scroll exactly.
function upd(){q=false;if(rmq){if(idx<0)show(0);return}
const H=innerHeight,W=innerWidth,m=W<760,cw=Math.min(m?W*.74:W*.46,640),lim=Math.min(m?1.9:3.4,PF.ultra?1.4:(PF.lite?2.4:9)),p=pr,act=smt(clp(p/I,0,1))*(1-smt(clp((p-1+O)/O,0,1))),ps=clp((p-I)/(1-I-O),0,1)*(n-1);
pos=ps*act+(pIdle+(p>.5?n:0))*(1-act);const Hn=n/2+act*n/2;
dp.style.transform='scaleX('+(act>.5?ps/(n-1):(((pos%n)+n)%n)/n).toFixed(4)+')';
const ci=((Math.round(pos)%n)+n)%n;if(ci!==idx)show(ci);
els.forEach((e,i)=>{let d=i-pos;d-=2*Hn*Math.floor((d+Hn)/(2*Hn));const a=Math.abs(d),sg=d<0?-1:1,
 /* centre card is flat and in front; the others fan out and tilt toward it, like a stack of windows */
 gx=a<1?a*.8:.8+(a-1)*(m?.16:.2),x=sg*gx*cw,ry=-sg*(Math.min(a,1)*(m?48:56)+clp(a-1,0,1.5)*6),z=-Math.min(a,3.2)*170+(1-Math.min(a,1))*70,sc=1-Math.min(a,3)*.035,
 op=clp((lim-a)/.6,0,1);
if(op<.01){if(!e.x){e.b.style.visibility='hidden';e.x=1}return}if(e.x){e.b.style.visibility='';e.x=0}
e.b.style.transform='translate3d(calc(-50% + '+(x-mx*26*(1+a*.4)).toFixed(1)+'px),calc(-50% + '+(-my*16).toFixed(1)+'px),'+z.toFixed(1)+'px) rotateY('+(ry+mx*7).toFixed(2)+'deg) rotateX('+(-my*5).toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
e.b.style.opacity=op.toFixed(2);e.b.style.zIndex=50-Math.round(a*10);
e.dm.style.opacity=Math.min(.62,a*.3).toFixed(2)})}
function sch(){if(!vis&&!q){q=true;requestAnimationFrame(upd)}}addEventListener('resize',sch);
if(fine&&!rmq)addEventListener('pointermove',ev=>{mx=ev.clientX/innerWidth-.5;my=ev.clientY/innerHeight-.5;sch()});
function loop(t){if(!vis)return;if(PF.lite&&(pr<.0005||pr>.9995)&&(fc++&1)){requestAnimationFrame(loop);return}
const dtr=t-(last||t),dt=Math.min(.05,dtr/1000);last=t;if(dtr)PF.report(dtr);const tp=prog();pr+=(tp-pr)*(1-Math.exp(-dt*10));if(Math.abs(tp-pr)<1e-4)pr=tp;
const a0=smt(clp(pr/I,0,1))*(1-smt(clp((pr-1+O)/O,0,1))),hov=els.some(e=>e.h);if(a0<.17)pIdle+=SP*(hov?.2:1)*dt*(1-a0*6);if(a0===0)pIdle=((pIdle+n/2)%n+n)%n-n/2;
upd();requestAnimationFrame(loop)}
if(!rmq)new IntersectionObserver(en=>{vis=en[0].isIntersecting;last=0;if(vis){measure();pr=prog();requestAnimationFrame(loop)}},{rootMargin:'15% 0px'}).observe(w);
pr=prog();upd()})();
