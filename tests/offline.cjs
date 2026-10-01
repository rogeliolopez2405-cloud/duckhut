const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const path=require('path');
const handlers={},stored=new Map(),deleted=[];let online=true,pending=[],response;
const cache={async addAll(files){for(const file of files){const p=path.join(__dirname,'..',file==='./'?'index.html':file.split('?')[0]);assert.ok(fs.existsSync(p),p);stored.set(file,new Response(fs.readFileSync(p)))}},async put(req,res){stored.set(req.url,res)}};
const sandbox={URL,Response,self:{location:{origin:'https://example.com'},registration:{scope:'https://example.com/duckhut/'},addEventListener(n,f){handlers[n]=f}},caches:{async open(){return cache},async keys(){return ['duckhut-v1','duckhut-v2-1','other-app']},async delete(k){deleted.push(k)},async match(req){return stored.get(typeof req==='string'?req:req.url)}},async fetch(){if(!online)throw Error('offline');return new Response('fresh network')}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8'),sandbox);
(async()=>{
handlers.install({waitUntil:p=>pending.push(p)});await Promise.all(pending);pending=[];
handlers.activate({waitUntil:p=>pending.push(p)});await Promise.all(pending);assert.deepEqual(deleted,['duckhut-v1','duckhut-v2-1']);pending=[];
online=false;handlers.fetch({request:{url:'https://example.com/duckhut/?edition=modern',method:'GET',mode:'navigate'},respondWith:p=>response=p,waitUntil:p=>pending.push(p)});assert.match(await(await response).text(),/Duckhut/);
online=true;handlers.fetch({request:{url:'https://example.com/duckhut/game.js',method:'GET'},respondWith:p=>response=p,waitUntil:p=>pending.push(p)});assert.equal(await(await response).text(),'fresh network');await Promise.all(pending);
online=false;handlers.fetch({request:{url:'https://example.com/duckhut/game.js',method:'GET'},respondWith:p=>response=p,waitUntil:p=>pending.push(p)});assert.equal(await(await response).text(),'fresh network');
console.log('PASS: all offline shell assets exist; cache cleanup scoped to Duckhut; V2 navigation fallback; fresh network and cached asset fallback.');
})().catch(e=>{console.error(e);process.exit(1)});

