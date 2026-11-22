/* Click sounds: tiny synthesized pops (Web Audio, no audio files). A speaker button (bottom-left) mutes them; the choice is remembered. */
(function(){
var AC=window.AudioContext||window.webkitAudioContext,ctx=null,master=null,noiseBuf=null,on=true,btn=document.getElementById('snd');
try{on=localStorage.getItem('snd')!=='off'}catch(e){}
function ui(){if(!btn)return;btn.classList.toggle('off',!on);btn.setAttribute('aria-pressed',on?'true':'false');btn.setAttribute('aria-label',on?'Sound effects on':'Sound effects off')}ui();
function ensure(){if(!AC)return null;if(!ctx){try{ctx=new AC();master=ctx.createGain();master.gain.value=.55;var comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);
 var n=Math.floor(ctx.sampleRate*.03),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);noiseBuf=b}catch(e){ctx=null;return null}}
 if(ctx.state==='suspended'&&ctx.resume)ctx.resume();return ctx}
function tone(t,f,type,vol,dur,slide){var o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(60,f*slide),t+dur);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03)}
function tick(t,vol){var s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=2500;g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start(t)}
var P=[523.25,587.33,659.25,783.99,880,1046.5],lastI=-1;
function pick(){var i;do{i=Math.floor(Math.random()*P.length)}while(i===lastI);lastI=i;return P[i]}
function play(kind){if(!on&&kind!=='force')return;var c=ensure();if(!c)return;var t=c.currentTime+.005;
 if(kind==='boot'){[392,523.25,659.25,783.99].forEach(function(f,i){tone(t+i*.09,f,'sine',.13,.45)});tone(t,196,'triangle',.08,.7);return}
 if(kind==='link'){var f=pick();tone(t,f,'sine',.15,.16,.8);tone(t+.05,f*1.5,'sine',.1,.2);tick(t,.05);return}
 var f2=pick();tone(t,f2,'sine',.17,.13,.65);tone(t,f2*2,'triangle',.04,.07);tick(t,.045)}
window.__sfx=play;
var skipClick=false,hit='a,button,[role=button],.btn,.d,.cp,summary';
addEventListener('pointerdown',function(e){if(e.pointerType==='touch'||e.button>0)return;if(btn&&btn.contains(e.target))return;skipClick=true;play(e.target.closest&&e.target.closest(hit)?'link':'click')},true);
addEventListener('click',function(e){if(btn&&btn.contains(e.target))return;if(skipClick){skipClick=false;return}play(e.target.closest&&e.target.closest(hit)?'link':'click')},true);
addEventListener('keydown',function(){skipClick=false},true);
if(btn)btn.addEventListener('click',function(){on=!on;try{localStorage.setItem('snd',on?'on':'off')}catch(e){}ui();if(on)play('click');if(window.__say)window.__say(on?'Sound on':'Sound off')});
})();
