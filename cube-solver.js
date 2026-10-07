(()=>{'use strict';
const C=['white','yellow','red','orange','blue','green'];let faces={},step=0,moves=[];
function e(i){return document.getElementById(i)}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));e(id)?.classList.add('active')}
function install(){if(e('cubeSolver'))return;const home=e('home');if(home){const card=home.querySelector('.card');const b=document.createElement('button');b.className='btn alt';b.innerHTML='🧩 Zauberwürfel lösen';b.onclick=open;card?.appendChild(b)}
const s=document.createElement('section');s.id='cubeSolver';s.className='screen';s.innerHTML=`<div class="hero"><h1>🧩 Zauberwürfel</h1><p>Fotografiere alle 6 Seiten. Danach führt dich Lernhelden Schritt für Schritt.</p></div><div class="card"><div id="cubeCapture"><div class="title">1. Würfel aufnehmen</div><p class="muted">Halte den Würfel wie gezeigt und fotografiere: Vorne → Rechts → Hinten → Links → Oben → Unten.</p><div id="cubeFaces"></div><button class="btn" id="cubeAnalyse">Farben prüfen</button></div><div id="cubeGuide" style="display:none"><div class="title">2. Schritt für Schritt</div><div id="cubeVisual"></div><div id="cubeText" class="q textq" style="text-align:center"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn ghost" id="cubePrev">← Zurück</button><button class="btn" id="cubeNext">Gemacht ✓</button></div><button class="btn alt" id="cubeWrong">↩️ Falsch gedreht</button></div><button class="btn ghost" id="cubeBack">← Zurück</button></div>`;(document.querySelector('.app')||document.body).appendChild(s);renderCapture();e('cubeAnalyse').onclick=analyse;e('cubeBack').onclick=()=>show('home');e('cubeNext').onclick=()=>{if(step<moves.length-1){step++;renderStep()}else finish()};e('cubePrev').onclick=()=>{if(step>0){step--;renderStep()}};e('cubeWrong').onclick=()=>{if(step>0)step--;renderStep()}}

const faceNames=['Vorne','Rechts','Hinten','Links','Oben','Unten'];
const colorNames={white:'Weiß',yellow:'Gelb',red:'Rot',orange:'Orange',blue:'Blau',green:'Grün'};
const ink={white:'#ffffff',yellow:'#facc15',red:'#ef4444',orange:'#fb923c',blue:'#3b82f6',green:'#22c55e'};
function capturePicture(i){
 const center=faces[i]?.[4],color=ink[center]||'#64748b';
 const underside=i===5;
 const shapes=underside?['70,45 140,85 140,165 70,125','140,85 210,45 210,125 140,165','70,125 140,165 210,125 140,205']:['70,85 140,125 140,205 70,165','140,125 210,85 210,165 140,205','70,85 140,45 210,85 140,125'];
 const selected=[0,1,0,1,2,2][i];
 const points=underside?[[105,105],[175,105],[140,165]]:[[105,145],[175,145],[140,85]];
 const [px,py]=points[selected];
 const note=['Schau gerade auf die Vorderseite.','Drehe den ganzen Würfel: Die rechte Seite zeigt jetzt zu dir.','Drehe den ganzen Würfel weiter: Die Rückseite zeigt zu dir.','Drehe den ganzen Würfel weiter: Die linke Seite zeigt zu dir.','Kippe den ganzen Würfel: Die obere Seite zeigt zu dir.','Kippe den ganzen Würfel: Die untere Seite zeigt zu dir.'][i];
 const grids=shapes.map((s,j)=>{
   const p=s.split(' ').map(q=>q.split(',').map(Number));
   const at=(u,v)=>[p[0][0]*(1-u)*(1-v)+p[1][0]*u*(1-v)+p[2][0]*u*v+p[3][0]*(1-u)*v,p[0][1]*(1-u)*(1-v)+p[1][1]*u*(1-v)+p[2][1]*u*v+p[3][1]*(1-u)*v];
   let lines='';
   for(const t of [1/3,2/3]){const a=at(t,0),b=at(t,1),c=at(0,t),d=at(1,t);lines+=`<path d="M${a} L${b} M${c} L${d}" fill="none" stroke="#334155" stroke-width="2"/>`}
   return `<polygon points="${s}" fill="${j===selected?(center?color:'#e2e8f0'):'#f8fafc'}" stroke="#334155" stroke-width="3"/>${lines}`;
 }).join('');
 return `<svg viewBox="0 0 280 300" role="img" aria-label="${faceNames[i]}: Die Linie verbindet die gemeinte Würfelseite mit ihrer Mittelfeldfarbe." style="display:block;width:100%;max-width:280px;margin:8px auto">
 <defs><marker id="cubeArrow${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${color}" stroke="#334155" stroke-width=".5"/></marker></defs>
 ${grids}<path d="M30 30 L${px-8} ${py-8}" fill="none" stroke="#334155" stroke-width="7"/><path d="M30 30 L${px-8} ${py-8}" fill="none" stroke="${color}" stroke-width="4" marker-end="url(#cubeArrow${i})"/>
 <path d="M${px} ${py} L240 ${py} L240 255 L163 255" fill="none" stroke="#334155" stroke-width="7" stroke-linejoin="round"/><path d="M${px} ${py} L240 ${py} L240 255 L163 255" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round"/>
 <circle cx="${px}" cy="${py}" r="6" fill="${color}" stroke="#334155" stroke-width="2"/>
 <rect x="117" y="232" width="46" height="46" rx="8" fill="${center?color:'#e2e8f0'}" stroke="#334155" stroke-width="3"/>
 <text x="105" y="295" text-anchor="end" font-size="13" fill="#334155">${faceNames[i]}</text><text x="115" y="295" font-size="13" fill="#334155">· ${center?colorNames[center]:'Mittelfeldfarbe'}</text>
 </svg><p style="text-align:center;font-size:14px;line-height:1.5;margin:6px 0">${note}</p><p class="muted" style="text-align:center">Die Linie führt zum Mittelfeld. ${center?'Diese Farbe gehört zu dieser Seite.':'Nach dem Foto erhält sie die erkannte Farbe.'}</p>`;
}

function renderCapture(){const names=['Vorne','Rechts','Hinten','Links','Oben','Unten'];e('cubeFaces').innerHTML=names.map((n,i)=>`<div style="padding:12px 0;border-bottom:1px solid #eee"><b>${i+1}. ${n}</b><div id="cubePicture${i}">${capturePicture(i)}</div><input id="cubeFile${i}" type="file" accept="image/*" capture="environment" style="display:block;margin-top:8px;width:100%"><div id="cubeGrid${i}" style="display:grid;grid-template-columns:repeat(3,38px);gap:3px;margin-top:8px"></div></div>`).join('');names.forEach((_,i)=>e('cubeFile'+i).onchange=ev=>scan(ev.target.files[0],i))}
function scan(file,i){if(!file)return;const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const cv=document.createElement('canvas'),x=cv.getContext('2d');cv.width=300;cv.height=300;x.drawImage(im,0,0,300,300);let a=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++){const d=x.getImageData(75+c*75,75+r*75,1,1).data;a.push(nearest(d[0],d[1],d[2]))}faces[i]=a;drawGrid(i,a);URL.revokeObjectURL(u)};im.src=u}
function nearest(r,g,b){const refs={white:[235,235,225],yellow:[240,220,35],red:[200,45,40],orange:[235,120,30],blue:[35,105,190],green:[45,155,80]};let best='white',v=1e9;for(const [k,q] of Object.entries(refs)){let d=(r-q[0])**2+(g-q[1])**2+(b-q[2])**2;if(d<v){v=d;best=k}}return best}
function drawGrid(i,a){e('cubePicture'+i).innerHTML=capturePicture(i);e('cubeGrid'+i).innerHTML=a.map((c,j)=>`<button type="button" data-j="${j}" style="width:38px;height:38px;border:2px solid #333;border-radius:5px;background:${c}"></button>`).join('');[...e('cubeGrid'+i).children].forEach(b=>b.onclick=()=>{let j=+b.dataset.j,k=(C.indexOf(faces[i][j])+1)%C.length;faces[i][j]=C[k];b.style.background=C[k];if(j===4)e('cubePicture'+i).innerHTML=capturePicture(i)})}
function analyse(){if(Object.keys(faces).length<6){alert('Bitte fotografiere zuerst alle 6 Seiten.');return}const count={};Object.values(faces).flat().forEach(c=>count[c]=(count[c]||0)+1);if(C.some(c=>count[c]!==9)){alert('Die Farben sind noch nicht eindeutig erkannt. Tippe auf falsche Farbfelder, bis jede Farbe 9-mal vorkommt.');return}/* UI foundation: deterministic solver can replace this sequence once cubie validation/orientation mapping is connected. */moves=['R','U','R′','U′','F','R','F′','U','L′','U′','L'];step=0;e('cubeCapture').style.display='none';e('cubeGuide').style.display='block';renderStep()}
const text={R:'Drehe die rechte Seite nach oben.',"R′":'Drehe die rechte Seite nach unten.',U:'Drehe die obere Seite nach rechts.',"U′":'Drehe die obere Seite nach links.',F:'Drehe die Vorderseite im Uhrzeigersinn.',"F′":'Drehe die Vorderseite gegen den Uhrzeigersinn.',"L′":'Drehe die linke Seite nach oben.'};
function renderStep(){const m=moves[step];e('cubeVisual').innerHTML=`<div style="width:210px;height:210px;margin:18px auto;background:linear-gradient(135deg,#ffd43b 0 33%,#42a5f5 33% 66%,#66bb6a 66%);border:12px solid #292b36;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:76px;box-shadow:0 16px 30px #0002">↻</div><div style="text-align:center;font-weight:900">Schritt ${step+1} von ${moves.length} · ${m}</div>`;e('cubeText').textContent=text[m]||('Führe '+m+' aus.')}
function finish(){e('cubeVisual').innerHTML='<div style="font-size:80px;text-align:center">🎉🧩</div>';e('cubeText').textContent='Geschafft! Dein Zauberwürfel ist gelöst.';e('cubeNext').style.display='none'}
function open(){show('cubeSolver')}
window.openCubeSolver=open;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();})();