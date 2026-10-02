'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const modern of [false,true])for(const reduced of [false,true]){
 let calls=[];
 const ctx=new Proxy({}, {get:(o,k)=>k.startsWith('create')?()=>({addColorStop(){}}):(...args)=>{assert.ok(args.every(v=>typeof v!=='number'||Number.isFinite(v)),'finite canvas coordinates');calls.push([k,...args]);},set:(o,k,v)=>{calls.push(['set',k,v]);return true;}});
 const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,{style:{},textContent:'',setAttribute(){},addEventListener(){},getContext:()=>ctx});return elements.get(id)};
 const sandbox={document:{getElementById:el,body:{classList:{toggle(){}}},addEventListener(){}},window:{matchMedia:q=>({matches:q.includes('prefers-reduced-motion')&&reduced}),addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},URLSearchParams,location:{search:modern?'?edition=modern':''},requestAnimationFrame(){},fetch:()=>Promise.reject(Error('offline'))};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../modern.js'),'utf8'),sandbox);
 let source=fs.readFileSync(path.join(__dirname,'../game.js'),'utf8').replace('hud();requestAnimationFrame(frame);',`globalThis.renderDog=(s,h,t,remaining)=>{state=s;dogHits=h;elapsed=t;dogTime=remaining;drawDog()};hud();requestAnimationFrame(frame);`);
 vm.runInNewContext(source,sandbox);
 const draw=(state,hits,time=1,remaining=2)=>{calls=[];sandbox.renderDog(state,hits,time,remaining);return JSON.stringify(calls)};
 assert.equal(draw('playing',0,1,0),'[]','Dog stays hidden during active flight');
 for(const [state,hits] of [['title',0],['between',0],['between',1],['between',2],['between',4]]){
  const first=draw(state,hits,1),next=draw(state,hits,4.9);assert.notEqual(first,'[]');
  if(reduced)assert.equal(first,next,'Reduced motion freezes companion movement');else assert.notEqual(first,next,'Companion animates');
 }
 assert.notEqual(draw('between',0),draw('between',1),'Chuckle and fetch differ');
 assert.notEqual(draw('between',1),draw('between',2),'One and two catches differ');
 assert.equal(draw('between',2),draw('between',4),'Larger flocks preserve two-paw artwork');
 assert.notEqual(draw('between',2,1,3.15),draw('between',2,1,2),'Arrival animates');
 assert.notEqual(draw('between',2,1,.1),draw('between',2,1,2),'Departure animates');
}
console.log('PASS: both companion renderers; idle/fetch/chuckle, one/two/larger flocks, arrival/departure, animation, reduced motion, hidden during flight, finite canvas coordinates.');
