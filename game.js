'use strict';
(() => {
  const $ = id => document.getElementById(id), canvas = $('game'), ctx = canvas.getContext('2d');
  const W=960,keys=new Set();let H=540;
  let state='title',previousState='playing',round=1,score=0,best=0,shots=3,wave=0,results=[],ducks=[],particles=[],timer=0,nextWave=0,last=0,elapsed=0,flash=0,toastTime=0,sound=false,audio;
  let aim={x:W/2,y:H/2,visible:false},dogTime=0,dogHits=0,lastLaugh=0,padIndex=null,padButtons=[],padActive=false;
  const modern=new URLSearchParams(location.search).get('edition')==='modern';
  document.body.classList.toggle('modern',modern);
  document.title=modern?'Duckhut V2 — Afterglow':'Duckhut — Classic';
  if(modern){$('overlay-title').textContent='AFTERGLOW';$('edition-label').textContent='V2 / AFTERGLOW';$('page-title').textContent='Meet you at the marsh.';$('edition-modern').setAttribute('aria-current','page')}else $('edition-classic').setAttribute('aria-current','page');
  let sensitivity=40;try{const saved=localStorage.getItem('duckhut-aim-speed');if(saved!==null&&Number.isFinite(Number(saved)))sensitivity=Math.max(20,Math.min(100,Number(saved)))}catch{}
  function setSensitivity(value){sensitivity=Math.max(20,Math.min(100,Number(value)||40));$('sensitivity').value=sensitivity;$('sensitivity-value').textContent=sensitivity+'%';try{localStorage.setItem('duckhut-aim-speed',String(sensitivity))}catch{}}
  setSensitivity(sensitivity);$('sensitivity').oninput=e=>setSensitivity(e.target.value);
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  try { best=Number(localStorage.getItem('duckhut-best'))||0; } catch {}
  $('best').textContent=String(best).padStart(6,'0');
  const palettes={duck:{g:'#215b47',G:'#39815b',w:'#f6eed2',b:'#382f39',o:'#eab650',d:'#213638',t:'#9e7352'},wing:{}};
  const bird=['.........gggg...','........gGGGgo..','........gGdwgooo','........ggggg...','...bb...www.....','..bwwbbtttttb...','.bwwwwwttttttb..','bbwwwwtttttttbb.','..bbbbtttttbbb..','.....bbbbbb.....','......o..o......'];
  const wingUp=['...bb...','..bwwb..','.bwwwb..','bwwwwb..','bwwwb...','.bbb....'];
  function sprite(rows,x,y,s,palette,flip=false){ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip){ctx.translate(rows[0].length*s,0);ctx.scale(-1,1)}for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const c=palette[rows[j][i]];if(c){ctx.fillStyle=c;ctx.fillRect(i*s,j*s,s,s)}}ctx.restore()}
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function backdrop(){
    if(modern&&window.DuckhutModern){window.DuckhutModern.background(ctx,elapsed,reducedMotion);return;}
    rect(0,0,W,H,'#8dc9c1');rect(0,290,W,110,'#9ac9af');
    for(const [x,y,s] of [[80,70,1],[670,85,1.4],[370,130,.6]]){const dx=(elapsed*3*s)%110;rect(x+dx,y,90*s,15*s,'#c4e4d4');rect(x+dx+20*s,y-12*s,47*s,15*s,'#c4e4d4')}
    rect(720,39,52,52,'#f7dea0');rect(712,47,68,36,'#f7dea0');
    for(let i=0;i<18;i++){const x=i*64;rect(x,330-Math.sin(i*1.7)*22,70,100,'#6a9d79');rect(x+20,320-Math.sin(i*1.7)*22,30,90,'#6a9d79')}
    rect(104,215,25,212,'#60583d');rect(94,275,10,34,'#60583d');rect(79,265,25,13,'#60583d');rect(125,238,30,14,'#60583d');rect(145,216,10,26,'#60583d');
    for(const [x,y,w,h] of [[15,155,170,74],[35,117,128,47],[60,88,72,40],[0,187,208,52]])rect(x,y,w,h,'#3d7857');
    rect(43,126,32,12,'#578c60');rect(17,170,57,12,'#578c60');rect(127,178,39,12,'#2f674c');
    rect(0,424,W,116,'#334e3d');rect(0,419,W,10,'#c1cc6d');rect(0,431,W,10,'#73914b');
    for(let i=0;i<100;i++){const x=(i*137)%W,y=409+(i%4)*7;rect(x,y,5,20,'#709a51');rect(x+5,y+8,7,4,'#709a51')}
    rect(0,480,W,60,'#283f34');for(let i=0;i<45;i++){rect((i*89)%W,449+(i*17)%80,4+(i%3)*4,3,'#4d6543')}
    // Original pixel marsh hut.
    rect(781,342,100,77,'#ac9964');rect(795,373,22,46,'#3b5140');rect(842,367,22,21,'#e8d087');rect(833,340,7,78,'#8e8155');
    for(let i=0;i<6;i++)rect(756+i*7,335-i*7,150-i*14,7,'#465e44');
    rect(774,334,116,8,'#314e3c');
  }
  function chirp(freq,duration=.08,type='square',vol=.025){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(40,freq/2),audio.currentTime+duration);g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
  function toast(text){$('toast').textContent=text;toastTime=2}
  function hud(){ $('score').textContent=String(score).padStart(6,'0');$('round').textContent=String(round).padStart(2,'0');$('ammo').textContent=Array.from({length:3},(_,i)=>i<shots?'●':'○').join(' ');$('hit-count').textContent=`${results.filter(Boolean).length} / 10`;$('hit-markers').innerHTML=Array.from({length:10},(_,i)=>`<i class="${i<results.length?(results[i]?'hit':'miss'):''}"></i>`).join('');$('hit-markers').setAttribute('aria-label',`${results.filter(Boolean).length} hits, ${results.filter(x=>!x).length} misses`);}
  function saveBest(){if(score>best){best=score;$('best').textContent=String(best).padStart(6,'0');try{localStorage.setItem('duckhut-best',String(best))}catch{}}}
  function spawn(){dogTime=0;wave++;shots=3;timer=Math.max(4.3,8-round*.25);nextWave=0;ducks=[0,1].map((_,i)=>({x:180+Math.random()*570,y:(310+i*25)*H/540,vx:(Math.random()>.5?1:-1)*(85+round*13),vy:-55-round*4,phase:Math.random()*6,alive:true,hit:false,done:false,fall:0}));state='playing';hud();toast(`ROUND ${round} · WAVE ${wave} / 5`)}
  function start(){aim={x:W/2,y:H/2,visible:padActive};round=1;score=0;wave=0;results=[];particles=[];keys.clear();$('overlay').hidden=true;$('pause').disabled=false;$('pause').innerHTML='Pause <kbd>P</kbd>';$('toast').textContent='';spawn();canvas.focus();}
  function finishRound(){saveBest();const passed=results.filter(Boolean).length>=6;state=passed?'roundover':'gameover';$('overlay').hidden=false;$('overlay-title').textContent=passed?'NICE SHOT!':'FLY AGAIN?';$('overlay-title').style.fontSize='clamp(26px, 5vw, 48px)';$('overlay-copy').textContent=passed?`${results.filter(Boolean).length} of 10 ducks. Round ${round+1} gets faster.`:`${score.toLocaleString()} points. Get 6 of 10 ducks to advance.`;$('start').textContent=passed?'NEXT ROUND ↗':'PLAY AGAIN ↗';$('overlay-hint').textContent=passed?'Take a breath. The marsh can wait.':'Every great run starts with another try.';$('pause').disabled=true;chirp(passed?880:180,.25,'triangle');}
  function settle(){if(ducks.every(d=>d.done)&&!nextWave){nextWave=3.2;dogTime=3.2;dogHits=ducks.filter(d=>d.hit).length;lastLaugh=0;state='between';toast(dogHits===2?'GOOD DOG! TWO DUCKS!':dogHits===1?'FETCHED ONE!':'HEH HEH HEH!');saveBest()}}
  function miss(d){if(d.done)return;d.done=true;d.alive=false;results.push(false);hud()}
  function shoot(){if(state!=='playing'||shots<=0)return;shots--;flash=reducedMotion?0:.06;chirp(120,.09,'sawtooth',.045);const hit=ducks.filter(d=>d.alive&&!d.done).reverse().find(d=>Math.abs(aim.x-(d.x+32))<40&&Math.abs(aim.y-(d.y+20))<32);if(hit){hit.alive=false;hit.hit=true;hit.done=true;score+=100*round;results.push(true);particles.push({x:hit.x+30,y:hit.y,t:1,text:`+${100*round}`});chirp(900,.12,'triangle');}hud();if(shots===0||ducks.every(d=>d.done)){for(const d of ducks)if(!d.done){d.vy=-180;d.escaping=true;}if(ducks.every(d=>d.done))settle();}}
  function pause(){if(state==='paused'){state=previousState;$('overlay').hidden=true;$('pause').innerHTML='Pause <kbd>P</kbd>';canvas.focus()}else if(state==='playing'||state==='between'){previousState=state;state='paused';keys.clear();$('overlay').hidden=false;$('overlay-title').textContent='ON A BREAK';$('overlay-title').style.fontSize='clamp(26px, 5vw, 44px)';$('overlay-copy').textContent='Your ducks will be right here.';$('start').textContent='RESUME ↗';$('overlay-hint').textContent='Press P or select Resume to return.';$('pause').innerHTML='Resume <kbd>P</kbd>';}}
  function frame(t){const dt=Math.min((t-last)/1000||0,.04);last=t;pollController(dt);$('wave-display').textContent=wave+'/5';$('time-display').textContent=state==='playing'?Math.max(0,timer).toFixed(1)+'s':state==='between'?'FETCH':state==='paused'?'PAUSED':'READY';if(state!=='paused'){elapsed+=dt;if(dogTime>0){dogTime=Math.max(0,dogTime-dt);if(dogHits===0&&dogTime<2.8&&dogTime>1&&elapsed-lastLaugh>.26){lastLaugh=elapsed;chirp(Math.sin(elapsed*10)>0?340:260,.1,'triangle',.04)}}flash=Math.max(0,flash-dt);if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').textContent=''}if(state==='playing'||state==='between'){if(keys.has('ArrowLeft'))aim.x-=400*dt;if(keys.has('ArrowRight'))aim.x+=400*dt;if(keys.has('ArrowUp'))aim.y-=400*dt;if(keys.has('ArrowDown'))aim.y+=400*dt;aim.x=Math.max(0,Math.min(W,aim.x));aim.y=Math.max(0,Math.min(H,aim.y));for(const d of ducks){if(d.hit){d.fall+=450*dt;d.y+=d.fall*dt;continue}if(d.done)continue;d.x+=d.vx*dt;d.y+=(d.escaping?-230:d.vy+Math.sin(elapsed*3+d.phase)*65)*dt*H/540;if(d.x<10){d.x=10;d.vx=Math.abs(d.vx)}if(d.x>W-75){d.x=W-75;d.vx=-Math.abs(d.vx)}if(d.y<35&&!d.escaping){d.y=35;d.vy=45}if(d.y>330*H/540&&!d.escaping){d.y=330*H/540;d.vy=-65}if(d.escaping&&d.y<-65)miss(d)}if(state==='playing'){timer-=dt;if(timer<=0||shots===0){if(!ducks.some(d=>d.escaping)&&ducks.some(d=>!d.done))toast('FLY AWAY!');for(const d of ducks)if(!d.done)d.escaping=true;}settle()}else{nextWave-=dt;if(nextWave<=0){if(wave>=5)finishRound();else spawn()}}}particles=particles.filter(p=>(p.t-=dt)>0);}
    // Match the world to the field: ducks keep their shape on tall phone screens.
    const bounds=canvas.getBoundingClientRect();
    const height=bounds.width>0?Math.max(1,Math.round(W*bounds.height/bounds.width)):H;
    if(height!==H){const ratio=height/H;for(const d of ducks)d.y*=ratio;for(const p of particles)p.y*=ratio;aim.y*=ratio;H=height;canvas.height=H;}
    ctx.save();ctx.scale(1,H/540);backdrop();ctx.restore();
    for(const d of ducks){if(d.done&&!d.hit)continue;if(d.y>H)continue;if(modern&&window.DuckhutModern){window.DuckhutModern.duck(ctx,d,elapsed,reducedMotion);continue;}sprite(bird,d.x,d.y,4,palettes.duck,d.vx<0);if(!d.hit&&Math.sin(elapsed*19+d.phase)>0)sprite(wingUp,d.x+16,d.y-17,4,palettes.duck,d.vx<0);}
    ctx.save();ctx.translate(0,(H-540)*(modern?489:426)/540);drawDog();ctx.restore();
    for(const p of particles){ctx.fillStyle='#fff4c9';ctx.strokeStyle='#234936';ctx.lineWidth=4;ctx.font='bold 22px monospace';ctx.strokeText(p.text,p.x,p.y-(1-p.t)*35);ctx.fillText(p.text,p.x,p.y-(1-p.t)*35)}
    if(aim.visible&&state==='playing'){ctx.strokeStyle='#fff9df';ctx.lineWidth=2;ctx.beginPath();ctx.arc(aim.x,aim.y,15,0,Math.PI*2);ctx.moveTo(aim.x-23,aim.y);ctx.lineTo(aim.x-8,aim.y);ctx.moveTo(aim.x+8,aim.y);ctx.lineTo(aim.x+23,aim.y);ctx.moveTo(aim.x,aim.y-23);ctx.lineTo(aim.x,aim.y-8);ctx.moveTo(aim.x,aim.y+8);ctx.lineTo(aim.x,aim.y+23);ctx.stroke()}
    if(flash>0)rect(0,0,W,H,'#ffffff33');requestAnimationFrame(frame);
  }
  function pointer(e){const r=canvas.getBoundingClientRect();aim={x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height,visible:true}}
  canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerdown',e=>{e.preventDefault();pointer(e);canvas.focus();shoot()});canvas.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{if(($('install-dialog')?.open||$('phone-dialog')?.open)||e.target?.matches?.('input,select,textarea'))return;if(e.code==='KeyP'&&!e.repeat){e.preventDefault();pause();return}if(e.code==='KeyF'&&!e.repeat){e.preventDefault();toggleTV();return}if(e.target instanceof HTMLButtonElement||e.target instanceof HTMLAnchorElement)return;if(e.code==='Enter'&&!e.repeat){e.preventDefault();if(['title','paused','roundover','gameover'].includes(state))$('start').onclick();else shoot();return;}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)){e.preventDefault();keys.add(e.code);aim.visible=true;if(e.code==='Space'&&!e.repeat)shoot()}});document.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>{keys.clear();if(state==='playing'||state==='between')pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='playing'||state==='between'))pause()});
  $('start').onclick=()=>{if(state==='paused')pause();else if(state==='roundover'){round++;wave=0;results=[];$('overlay').hidden=true;$('pause').disabled=false;spawn();canvas.focus()}else start()};$('pause').onclick=pause;$('restart').onclick=start;
  $('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(sound));if(sound)chirp(660,.12,'triangle')};
  // Original marsh retriever. Its expression and catch change after each wave.
  function drawDog(){
    const show=dogTime>0||state==='title';if(!show)return;
    if(modern&&window.DuckhutModern){window.DuckhutModern.dog(ctx,{time:elapsed,remaining:dogTime,hits:dogHits,idle:state==='title',reducedMotion});return;}
    const idle=state==='title',laugh=!idle&&dogHits===0;
    const rise=idle?1:Math.min(1,(3.2-dogTime)/.35,dogTime/.35);
    const x=idle?230:438,y=424-100*Math.max(0,rise)+(reducedMotion?0:Math.sin(elapsed*(laugh?22:7))*(laugh?4:2));
    const p={b:'#382f29',t:'#b98045',h:'#daaa64',c:'#fff0c7',n:'#182b29',r:'#cd745c'};
    const head=['..bb......bb..','.bttbhhhhbt tb.'.replaceAll(' ',''),'btttthhhhttttb','bttthhhhhhtttb','bttthnhhnh ttb'.replaceAll(' ',''),'.bbhhhhhhhhbb.','...hcccc cch...'.replaceAll(' ',''),'...hccnncch...','....ccnncc....',laugh?'....cnnnnc....':'....ccrrcc....','.....cccc.....'];
    ctx.save();ctx.beginPath();ctx.rect(0,0,W,426);ctx.clip();
    sprite(head,x,y,6,p);rect(x+24,y+61,36,53,p.t);rect(x+30,y+63,24,40,p.c);
    const wag=reducedMotion?0:Math.sin(elapsed*14)*9;rect(x+58,y+85+wag,23,8,p.t);rect(x+75,y+76+wag,8,12,p.h);
    if(laugh){rect(x+15,y+55,16,16,p.t);rect(x+54,y+55,16,16,p.t);}
    else if(!idle){rect(x-4,y+66,26,12,p.t);sprite(bird,x-40,y+65,3,palettes.duck,true);if(dogHits===2){rect(x+64,y+66,26,12,p.t);sprite(bird,x+77,y+65,3,palettes.duck);}}
    ctx.restore();
  }
  function pollController(dt){
    let pads=[];try{pads=Array.from(navigator.getGamepads?.()||[])}catch{}
    const pad=pads.find(p=>p&&p.connected&&p.mapping==='standard');
    if(!pad){if(padActive&&(state==='playing'||state==='between'))pause();padActive=false;padIndex=null;padButtons=[];$('controller').textContent=pads.some(Boolean)?'Controller layout unsupported · use keyboard or mouse':'Controller: press A to connect';return;}
    if(pad.index!==padIndex){padIndex=pad.index;padButtons=pad.buttons.map(b=>b.pressed);padActive=true;$('controller').textContent='Controller connected · A / RT shoot · LT precision · LB / RB sensitivity';return;}
    const held=i=>!!pad.buttons[i]?.pressed,edge=i=>held(i)&&!padButtons[i];
    if($('install-dialog')?.open){if(edge(1)){if($('phone-dialog')?.open)$('phone-dialog').close();else $('install-dialog').close()};padButtons=pad.buttons.map(b=>b.pressed);return;}
    if(document.hidden){padButtons=pad.buttons.map(b=>b.pressed);return;}
    const axis=n=>Math.abs(n||0)<.18?0:Math.sign(n)*Math.pow((Math.abs(n)-.18)/.82,1.6);
    if(edge(4))setSensitivity(sensitivity-10);if(edge(5))setSensitivity(sensitivity+10);
    const speed=360*(sensitivity/100)*(held(6)?.45:1);
    if(state==='playing'){
      let dx=Math.max(-1,Math.min(1,axis(pad.axes[0])+(held(15)?1:0)-(held(14)?1:0))),dy=Math.max(-1,Math.min(1,axis(pad.axes[1])+(held(13)?1:0)-(held(12)?1:0)));const magnitude=Math.hypot(dx,dy);if(magnitude>1){dx/=magnitude;dy/=magnitude;}
      aim.x=Math.max(0,Math.min(W,aim.x+dx*speed*dt));aim.y=Math.max(0,Math.min(H,aim.y+dy*speed*dt));aim.visible=true;
      if(edge(0)||edge(7))shoot();
    }else if(edge(0)&&['title','paused','roundover','gameover'].includes(state))$('start').onclick();
    if(edge(9))pause();
    padButtons=pad.buttons.map(b=>b.pressed);
  }
  async function toggleTV(){
    const main=document.querySelector('main');
    if(document.body.classList.contains('tv-mode')){document.body.classList.remove('tv-mode');if(document.fullscreenElement)try{await document.exitFullscreen()}catch{};}
    else{document.body.classList.add('tv-mode');try{await main.requestFullscreen?.()}catch{toast('TV layout ready · fullscreen unavailable in this browser')}}
    $('tv').textContent=document.body.classList.contains('tv-mode')?'Exit TV mode':'TV / Fullscreen';
    $('tv').setAttribute('aria-pressed',String(document.body.classList.contains('tv-mode')));
  }
  $('tv').onclick=toggleTV;
  document.addEventListener('duckhut-help',()=>{if(state==='playing'||state==='between')pause()});
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('tv-mode');$('tv').textContent='TV / Fullscreen';$('tv').setAttribute('aria-pressed','false')}});
  // Set the public repository once, for both contribution links and the README.
  fetch('repo.json').then(r=>r.ok?r.json():null).then(config=>{if(config&&/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(config.url))$('ideas').href=config.url+'/issues/new/choose'}).catch(()=>{});
  hud();requestAnimationFrame(frame);
})();
