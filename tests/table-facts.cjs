const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
// Compile every inline script so the change cannot silently break app startup.
let scripts=0;for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(match[1].trim()){new vm.Script(match[1]);scripts++}
const rotation=html.slice(html.indexOf('function createFactRotation('),html.indexOf('const tableFactRotation='));
const values=new Map(),context={localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)}};
vm.createContext(context);vm.runInContext(rotation+';globalThis.create=createFactRotation',context);
const pool=Array.from({length:10},(_,i)=>({id:'mul_7_'+(i+1),a:7,b:i+1}));
const deck=context.create({random:()=>0,weight:task=>task.b===1?1e9:1,storageKey:'test'});
let previous=null;
for(let round=0;round<10;round++){
 const seen=[];for(let i=0;i<10;i++){const item=deck.next(pool,'child1');assert.notEqual(item.id,previous);seen.push(item.b);previous=item.id}
 assert.deepEqual(seen.sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);
}
// Continuing a short session, switching children, or reloading must not discard coverage.
const persistent=context.create({random:()=>0,storageKey:'resume'}),first=[];
for(let i=0;i<4;i++)first.push(persistent.next(pool,'a').id);
for(let i=0;i<4;i++)persistent.next(pool,'b');
const reloaded=context.create({random:()=>0,storageKey:'resume'});
for(let i=0;i<6;i++)first.push(reloaded.next(pool,'a').id);
assert.equal(new Set(first).size,10);
// Test the actual task generators, including the secondary multiplication menu.
const setup=html.slice(html.indexOf('function createFactRotation('),html.indexOf('\nfunction makeTextTask()'));
const makeTask=html.slice(html.indexOf('function makeTask(){'),html.indexOf('function startGame(){'));
const basicMath=html.slice(html.indexOf('function basicMath(){'),html.indexOf('function g4('));
const app={localStorage:context.localStorage};vm.createContext(app);
vm.runInContext(`let op='*',selectedTables=[7],currentKid='kid1',topic='times';function factWeight(){return 1}function inp(t,q,a,e){return{t,q,a:String(a),e}}\n${setup}\n${makeTask}\n${basicMath}\nglobalThis.test={makeTask,basicMath,set(rows,operation,kid='kid1'){selectedTables=rows;op=operation;currentKid=kid},topic(value){topic=value}}`,app);
for(let row=1;row<=10;row++){
 app.test.set([row],'*');const tasks=Array.from({length:10},()=>app.test.makeTask());assert.equal(new Set(tasks.map(t=>t.id)).size,10);assert.deepEqual(tasks.map(t=>t.b).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);assert(tasks.every(t=>t.a===row&&t.ans===row*t.b));
}
for(const operation of ['*','/']){
 app.test.set([2,4,9],operation);let last=null;
 for(let round=0;round<4;round++){const tasks=Array.from({length:30},()=>app.test.makeTask());assert.equal(new Set(tasks.map(t=>t.id)).size,30);for(const t of tasks){assert.notEqual(t.id,last);last=t.id;assert([2,4,9].includes(t.table));assert.equal(t.ans,operation==='*'?t.a*t.b:t.a/t.b)}}
}
for(const topic of ['times','divide']){
 app.test.topic(topic);const tasks=Array.from({length:100},()=>app.test.basicMath());assert.equal(new Set(tasks.map(t=>t.q)).size,100);assert(tasks.some(t=>/^1 [·:] 1 =/.test(t.q)));let previous=tasks.at(-1).q;for(let i=0;i<200;i++){const t=app.test.basicMath();assert.notEqual(t.q,previous);previous=t.q}
}
console.log(`PASS: ${scripts} inline scripts compile; every row covers 1–10; selected rows and division stay correct; no immediate repeats across rounds; high mistake weighting cannot starve other facts; sessions, profiles and reloads preserve coverage; secondary menu covers all 100 facts.`);
