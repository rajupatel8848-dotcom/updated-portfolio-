/* Intro: scrolling flies the camera through a desk scene into the monitor, the screen types a greeting,
   then it pixel-dissolves into the portfolio. Driven by wheel / touch / keys (the page itself stays locked until it ends). */
(function(){
var H=document.documentElement,root=document.getElementById('ld');if(!root)return;
if(!H.classList.contains('ld')){root.remove();return}
function bail(){H.classList.remove('ld');if(root.parentNode)root.remove()}
try{
var $=function(i){return document.getElementById(i)},svg=$('ld-svg'),cam=$('ld-cam'),ppl=$('ld-ppl'),term=$('ld-term'),tbg=term.querySelector('.ld-tbg'),px=$('ld-px'),tx=$('ld-tx'),hint=$('ld-hint'),bar=$('ld-bar'),skip=$('ld-skip'),clk=$('ld-clk'),brand=$('ld-brand');
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))},sm=function(t){return t*t*(3-2*t)};
var now=new Date();if(clk)clk.textContent=('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2);
/* terminal text: [text, class] */
var SEG=[['ADITYA-OS v2.0  \u00a9 '+now.getFullYear()+'\n\n',''],['> boot portfolio.exe ........ ok\n> load skills ............. ok\n> load projects ........... ok\n\n',''],['Code that works.\nDesign that feels right.\n','b'],['We build both.','hl']];
var TOTAL=SEG.reduce(function(a,s){return a+s[0].length},0);
function typed(n){var out='',left=n;for(var i=0;i<SEG.length&&left>0;i++){var t=SEG[i][0].slice(0,left);left-=t.length;t=t.replace(/&/g,'&amp;').replace(/</g,'&lt;');out+=SEG[i][1]?'<span class="'+SEG[i][1]+'">'+t+'</span>':t}return out+'<i class="ld-caret"></i>'}
var vw,vh,S=8;function size(){vw=innerWidth;vh=innerHeight;var k=Math.max(vw/1600,vh/900);S=1.06*Math.max(vw/(220*k),vh/(154*k))}size();addEventListener('resize',size);
var T=0,C=-1,done=false,last=performance.now(),raf=0,lastN=-1;
function add(d){if(!done)T=clamp(T+d,0,1)}
function onWheel(e){e.preventDefault();var dy=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*vh:e.deltaY;add(dy*.00085)}
var ty=0;function onTS(e){ty=e.touches[0].clientY}function onTM(e){e.preventDefault();var y=e.touches[0].clientY;add((ty-y)/(vh*1.6));ty=y}
function onKey(e){var k=e.key;if(k==='ArrowDown'){e.preventDefault();add(.07)}else if(k==='PageDown'||k===' '||k==='Spacebar'){e.preventDefault();add(.2)}else if(k==='ArrowUp'){e.preventDefault();add(-.07)}else if(k==='PageUp'){e.preventDefault();add(-.2)}else if(k==='End'){e.preventDefault();T=1}else if(k==='Home'){e.preventDefault();T=0}else if(k==='Escape'){leave()}}
addEventListener('wheel',onWheel,{passive:false});addEventListener('touchstart',onTS,{passive:true});addEventListener('touchmove',onTM,{passive:false});addEventListener('keydown',onKey);
function unbind(){removeEventListener('wheel',onWheel);removeEventListener('touchstart',onTS);removeEventListener('touchmove',onTM);removeEventListener('keydown',onKey)}
function render(p){
 var z=sm(clamp(p/.84,0,1)),s=Math.pow(S,z),pan=sm(clamp(p/.72,0,1)),ty_=450-15*pan;
 cam.setAttribute('transform','translate(800 450) scale('+s.toFixed(4)+') translate(-800 '+(-ty_).toFixed(2)+')');
 ppl.style.opacity=(1-clamp((p-.14)/.3,0,1)).toFixed(3);
 var o=clamp((p-.8)/.09,0,1);tbg.style.opacity=o;tx.style.opacity=o;term.style.visibility=o>0?'visible':'hidden';svg.style.visibility=o>=1?'hidden':'visible';
 var n=Math.round(clamp((p-.87)/.115,0,1)*TOTAL);if(n!==lastN){lastN=n;tx.innerHTML=typed(n)}
 bar.style.transform='scaleX('+p.toFixed(4)+')';hint.style.opacity=(1-clamp(p/.05,0,1)).toFixed(2);brand.style.opacity=(1-clamp((p-.3)/.2,0,1)).toFixed(2)}
function frame(t){raf=requestAnimationFrame(frame);var dt=Math.min(.05,(t-last)/1000);last=t;
 C=C<0?0:C+(T-C)*(1-Math.exp(-dt*6.5));if(Math.abs(T-C)<.0004)C=T;render(C);
 if(!done&&C>=.995&&T>=1&&lastN>=TOTAL){done=true;setTimeout(dissolve,520)}}
/* pixel dissolve: blocks of the terminal colour vanish from the bottom up, revealing the page */
function dissolve(){unbind();var cols=Math.ceil(vw/26),rows=Math.ceil(vh/26);px.width=cols;px.height=rows;var g=px.getContext('2d'),v=[];
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)v.push(Math.random()*.5+(1-r/rows)*.5);
 function paint(t){g.clearRect(0,0,cols,rows);g.fillStyle='#08130D';var i=0;for(var r=0;r<rows;r++)for(var c=0;c<cols;c++,i++)if(v[i]>t)g.fillRect(c,r,1,1)}
 paint(-1);px.style.display='block';tbg.style.display='none';svg.style.display='none';root.classList.add('ld-fade');
 if(window.__sfx)window.__sfx('boot');
 setTimeout(function(){H.classList.remove('ld');scrollTo(0,0);var t0=performance.now();(function f(n){var k=clamp((n-t0)/1150,0,1);paint(sm(k)*1.02);if(k<1)requestAnimationFrame(f);else{cancelAnimationFrame(raf);root.remove()}})(t0)},380)}
/* skip: quick fade instead */
function leave(){if(done)return;done=true;unbind();H.classList.remove('ld');scrollTo(0,0);root.classList.add('ld-skip');setTimeout(function(){cancelAnimationFrame(raf);root.remove()},600)}
skip.addEventListener('click',leave);
render(0);raf=requestAnimationFrame(frame);root.setAttribute('tabindex','-1');
}catch(err){try{console.error(err)}catch(_){}bail()}
})();
