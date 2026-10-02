const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const touchMedia={matches:false};
const assert = require('node:assert/strict');
const elements = new Map();
const events = {};
const context = new Proxy({}, { get: (obj,key) => key.startsWith('create') ? () => ({addColorStop(){}}) : () => {} });
function element(id) {
  if (!elements.has(id)) elements.set(id, {textContent:'',innerHTML:'',style:{},hidden:false,disabled:false,setAttribute(){},focus(){},addEventListener(name,fn){events[id+':'+name]=fn},getContext(){return context},getBoundingClientRect(){return {left:0,top:0,width:960,height:540}}});
  return elements.get(id);
}
let frame;
const sandbox = {document:{body:{classList:{toggle(){}}},getElementById:element,addEventListener(name,fn){events[name]=fn}},window:{addEventListener(){},matchMedia:q=>q.includes('pointer: coarse')?touchMedia:{matches:false}},localStorage:{getItem(){throw Error('blocked storage')},setItem(){}},HTMLButtonElement:class {},HTMLAnchorElement:class {},requestAnimationFrame(fn){frame=fn},fetch(){return Promise.reject(Error('offline'))},console,Math,URLSearchParams,location:{search:process.argv.includes('--modern')?'?edition=modern':''},navigator:{getGamepads:()=>[]}};
const source=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8').replace('hud();requestAnimationFrame(frame);','globalThis.test={setResults:value=>{results=value},setSensitivity,start,shoot,pause,spawn,finishRound,get:()=>({state,round,score,shots,wave,results,ducks,dogTime,dogHits,aim,sensitivity}),aimAt:d=>{aim={x:d.x+32,y:d.y+20,visible:true}},setTimer:n=>{timer=n}};hud();requestAnimationFrame(frame);');
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../modern.js'),'utf8'),sandbox);
vm.runInNewContext(source,sandbox);
const t=sandbox.test;
let now=0;
function tick(seconds){for(let i=0;i<Math.ceil(seconds/.02);i++){now+=20;frame(now)}}
assert.equal(t.get().state,'title');
t.start();t.get().ducks[0].x=200;t.get().ducks[1].x=600;assert.equal(t.get().ducks.length,2);assert.equal(t.get().shots,3);
t.aimAt(t.get().ducks[0]);t.shoot();assert.equal(t.get().score,100);assert.equal(t.get().results.length,1);assert.equal(t.get().shots,2);
t.shoot();assert.equal(t.get().score,100,'Cannot score twice on same duck');
t.pause();const before=JSON.stringify(t.get());tick(2);assert.equal(JSON.stringify(t.get()),before,'Paused state frozen');t.shoot();assert.equal(t.get().shots,1);t.pause();
t.aimAt(t.get().ducks[1]);t.shoot();assert.equal(t.get().shots,0);assert.equal(t.get().score,200);t.shoot();assert.equal(t.get().shots,0);tick(3.4);assert.equal(t.get().wave,2);
for(let wave=2;wave<=5;wave++){for(const d of t.get().ducks){t.aimAt(d);t.shoot()}tick(3.4)}
assert.equal(t.get().state,'roundover');assert.equal(t.get().results.length,10);element('start').onclick();assert.equal(t.get().round,2);assert.equal(t.get().wave,1);assert.equal(t.get().results.length,0);
t.start();for(let wave=1;wave<=5;wave++){t.setTimer(0);tick(6)}assert.equal(t.get().state,'gameover');assert.equal(t.get().results.length,10);assert.equal(t.get().score,0);
t.start();assert.equal(t.get().round,1);assert.equal(t.get().results.length,0);assert.equal(t.get().score,0);
console.log('PASS: start, scoring, duplicate-hit prevention, ammo limit, pause freeze, five-wave progression, next round, escape/game over, restart, offline/storage fallback.');
for(const d of t.get().ducks){t.aimAt(d);t.shoot()}
assert.equal(t.get().dogHits,2);assert.equal(t.get().dogTime,3.2);
t.start();t.setTimer(0);tick(2);assert.equal(t.get().dogHits,0);assert.ok(t.get().dogTime>0);
t.start();
const pad={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:17},()=>({pressed:false}))};
sandbox.navigator.getGamepads=()=>[pad];tick(.02);const oldAim=t.get().aim.x;pad.axes[0]=.1;tick(.1);assert.equal(t.get().aim.x,oldAim,'Stick drift ignored');pad.axes[0]=.7;tick(.1);assert.ok(t.get().aim.x>oldAim);pad.axes[0]=0;
pad.buttons[7].pressed=true;tick(.1);assert.equal(t.get().shots,2,'One trigger press fires one shot');tick(.1);assert.equal(t.get().shots,2,'Held trigger does not spend more ammo');pad.buttons[7].pressed=false;tick(.02);
pad.buttons[9].pressed=true;tick(.02);assert.equal(t.get().state,'paused');pad.buttons[9].pressed=false;tick(.02);pad.buttons[0].pressed=true;tick(.02);assert.equal(t.get().state,'playing');pad.buttons[0].pressed=false;tick(.02);
sandbox.navigator.getGamepads=()=>[];tick(.02);assert.equal(t.get().state,'paused','Disconnect pauses game');
console.log('PASS: dog retrieval/laugh states, controller deadzone, aiming, single-shot trigger, Menu pause, A resume, disconnect pause.');
t.start();sandbox.navigator.getGamepads=()=>[pad];tick(.02);pad.axes=[1,0];let startX=t.get().aim.x;tick(.2);assert.ok(Math.abs(t.get().aim.x-startX-28.8)<.001,'Default speed is 144 px/sec, 66% slower');
pad.buttons[6].pressed=true;startX=t.get().aim.x;tick(.2);assert.ok(Math.abs(t.get().aim.x-startX-12.96)<.001,'LT precision reduces speed to 45%');pad.buttons[6].pressed=false;
pad.axes=[1,1];let pos={...t.get().aim};tick(.2);assert.ok(Math.abs(Math.hypot(t.get().aim.x-pos.x,t.get().aim.y-pos.y)-28.8)<.001,'Diagonal speed normalized');
pad.buttons[4].pressed=true;tick(.02);assert.equal(t.get().sensitivity,30);tick(.1);assert.equal(t.get().sensitivity,30,'LB is edge triggered');pad.buttons[4].pressed=false;tick(.02);pad.buttons[5].pressed=true;tick(.02);assert.equal(t.get().sensitivity,40);
t.setSensitivity(200);assert.equal(t.get().sensitivity,100);t.setSensitivity(-1);assert.equal(t.get().sensitivity,20);
console.log('PASS: slow default, precision trigger, diagonal speed limit, LB/RB sensitivity, settings bounds.');
// Rotation preserves the full world, and touch coordinates follow the new canvas.
sandbox.navigator.getGamepads=()=>[];tick(.02);
element('game').getBoundingClientRect=()=>({left:0,top:0,width:390,height:600});
t.start();tick(.02);
assert.equal(element('game').height,Math.round(960*600/390));
const duck=t.get().ducks[0];
events['game:pointerdown']({preventDefault(){},clientX:(duck.x+32)*390/960,clientY:(duck.y+20)*600/element('game').height});
assert.equal(t.get().score,100,'Portrait tap hits the rendered duck');
element('game').getBoundingClientRect=()=>({left:0,top:0,width:844,height:260});
tick(.02);
assert.equal(element('game').height,Math.round(960*260/844));
assert.ok(t.get().ducks.every(d=>d.x>=0&&d.x<960),'Rotation retains all ducks horizontally');
console.log('PASS: portrait world sizing, touch hit mapping, landscape resize.');
element('game').getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});tick(.02);t.start();
for(let level=1;level<=7;level++){
 const count=level<3?2:level<6?3:4;
 assert.equal(t.get().round,level);
 for(let w=1;w<=5;w++){
  assert.equal(t.get().ducks.length,count);assert.equal(t.get().shots,count+1);
  t.get().ducks.forEach((d,i)=>{d.x=90+i*180;d.y=180});
  for(const d of t.get().ducks){t.aimAt(d);t.shoot()}
  assert.equal(t.get().shots,1);assert.equal(t.get().dogHits,count);tick(3.4);
 }
 assert.equal(t.get().state,'roundover');assert.equal(t.get().results.length,count*5);
 assert.equal(element('advance-target').textContent,count*3+' / '+count*5);
 const hits=count*3; t.setResults(Array.from({length:count*5},(_,i)=>i<hits-1));t.finishRound();assert.equal(t.get().state,'gameover','Below 60% fails');
 t.setResults(Array.from({length:count*5},(_,i)=>i<hits));t.finishRound();assert.equal(t.get().state,'roundover','Exactly 60% passes');
 if(level<7)element('start').onclick();
}
console.log('PASS: seven rounds, 2/3/4-duck waves, spare ammo, dog counts, dynamic totals, exact pass/fail thresholds.');

// Phone artwork and hitboxes grow together. Check real pointer coordinate mapping,
// boundary misses, edge visibility and orientation changes without debug code in the game.
touchMedia.matches=true;
sandbox.navigator.getGamepads=()=>[];
for(const [width,height] of [[302,325],[372,599],[412,687],[826,213]]){
 element('game').getBoundingClientRect=()=>({left:8,top:100,width,height});
 t.start();tick(.02);
 const scale=Math.max(1,44*960/(40*width));
 const tap=(dx,dy)=>{const d=t.get().ducks[0];events['game:pointerdown']({preventDefault(){},clientX:8+(d.x+32+dx)*width/960,clientY:100+(d.y+20+dy)*height/element('game').height})};
 for(const [dx,dy] of [[-31*scale,0],[40*scale,-5*scale],[0,-36*scale]]){
  t.start();tick(.02);t.get().ducks.forEach((d,i)=>{d.x=260+i*340;d.y=200});tap(dx,dy);assert.equal(t.get().score,100,'Scaled visible body/beak/wing must accept taps');
 }
 t.start();tick(.02);t.get().ducks.forEach((d,i)=>{d.x=260+i*340;d.y=200});tap(44*scale+8,0);assert.equal(t.get().score,0,'Outside scaled bounds misses');assert.equal(t.get().shots,2,'Miss spends one shot');
 const d=t.get().ducks[0];d.x=-100;d.y=-100;tick(.02);assert.ok(d.x+32-44*scale>=0,'Left silhouette stays visible');assert.ok(d.y+20-46*scale>=0,'Top wing stays visible');d.x=1000;tick(.02);assert.ok(d.x+32+44*scale<=960,'Right beak stays visible');
}
console.log('PASS: four phone sizes, scaled body/beak/wing taps, outside misses, ammo and edge containment.');
