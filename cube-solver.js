(()=>{'use strict';
const C=['white','yellow','red','orange','blue','green'];let faces={},step=0,moves=[],captureStep=0,topColor=null;
function e(i){return document.getElementById(i)}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));e(id)?.classList.add('active')}
function install(){if(e('cubeSolver'))return;const home=e('home');if(home){const card=home.querySelector('.card');const b=document.createElement('button');b.className='btn alt';b.innerHTML='🧩 Zauberwürfel lösen';b.onclick=open;card?.appendChild(b)}
const s=document.createElement('section');s.id='cubeSolver';s.className='screen';s.innerHTML=`<div class="hero"><h1>🧩 Zauberwürfel</h1><p>Wir machen 6 Fotos. Immer nur eine Seite.</p></div><div class="card"><div id="cubeCapture"><div class="title">1. Würfel aufnehmen</div><p class="muted">Drehe immer den ganzen Würfel. Verdrehe keine einzelnen Reihen.</p><div id="cubeFaces"></div><button class="btn" id="cubeAnalyse">Farben prüfen</button></div><div id="cubeGuide" style="display:none"><div class="title">2. Schritt für Schritt</div><div id="cubeVisual"></div><div id="cubeText" class="q textq" style="text-align:center"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn ghost" id="cubePrev">← Zurück</button><button class="btn" id="cubeNext">Gemacht ✓</button></div><button class="btn alt" id="cubeWrong">↩️ Falsch gedreht</button></div><button class="btn ghost" id="cubeBack">← Zurück</button></div>`;(document.querySelector('.app')||document.body).appendChild(s);renderCapture();e('cubeAnalyse').onclick=analyse;e('cubeBack').onclick=()=>show('home');e('cubeNext').onclick=()=>{if(step<moves.length-1){step++;renderStep()}else finish()};e('cubePrev').onclick=()=>{if(step>0){step--;renderStep()}};e('cubeWrong').onclick=()=>{if(step>0)step--;renderStep()}}

const faceNames=['Vorne','Rechts','Hinten','Links','Oben','Unten'];
const colorNames={white:'Weiß',yellow:'Gelb',red:'Rot',orange:'Orange',blue:'Blau',green:'Grün'};
const ink={white:'#ffffff',yellow:'#facc15',red:'#ef4444',orange:'#fb923c',blue:'#3b82f6',green:'#22c55e'};
function capturePicture(i){
 const center=faces[i]?.[4],color=ink[center]||'#6c63ff';
 const tiles=Array.from({length:9},(_,j)=>`<rect x="${50+j%3*60}" y="${40+Math.floor(j/3)*60}" width="58" height="58" rx="5" fill="${ink[faces[i]?.[j]]||'#e2e8f0'}" stroke="#334155" stroke-width="2"/>`).join('');
 return `<svg viewBox="0 0 280 310" role="img" aria-label="Fotografiere diese Seite gerade von vorne. Der Pfeil zeigt auf das mittlere Feld." style="display:block;width:100%;max-width:280px;margin:auto"><defs><marker id="cubeArrow${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#334155"/></marker></defs>${tiles}<path d="M15 12 L114 109" stroke="#334155" stroke-width="5" marker-end="url(#cubeArrow${i})" fill="none"/><path d="M140 130 L252 130 L252 264 L163 264" fill="none" stroke="#334155" stroke-width="8" stroke-linejoin="round"/><path d="M140 130 L252 130 L252 264 L163 264" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round"/><rect x="117" y="242" width="46" height="44" rx="8" fill="${center?color:'#e2e8f0'}" stroke="#334155" stroke-width="3"/><text x="140" y="306" text-anchor="middle" font-size="16" fill="#334155">${center?colorNames[center]+' in der Mitte':'Das mittlere Feld'}</text></svg>`;
}

function reference(){
 const front=faces[0]?.[4];
 return `<div style="display:flex;justify-content:center;gap:18px;margin:12px 0"><span>Erstes Foto: <b style="padding:4px;border:2px solid #334155;background:${ink[front]||'#e2e8f0'};color:#111">${colorNames[front]||'?'}</b></span><span>Oben: <b style="padding:4px;border:2px solid #334155;background:${ink[topColor]||'#e2e8f0'};color:#111">${colorNames[topColor]||'?'}</b></span></div>`;
}
function instructions(i){
 const front=colorNames[faces[0]?.[4]]||'deinem ersten Foto',top=colorNames[topColor]||'deine gemerkte Farbe';
 return [
  ['So geht’s los','Halte eine Seite gerade zu dir. Diese Seite ist unser erstes Foto.'],
  ['Die nächste Seite','Drehe den ganzen Würfel ein Viertel nach links. Die rechte Seite kommt zu dir.'],
  ['Noch einmal drehen','Drehe den ganzen Würfel noch ein Viertel nach links.'],
  ['Ein letztes Mal nach links','Drehe den ganzen Würfel noch ein Viertel nach links.'],
  ['Jetzt die obere Seite',`Halte zuerst wieder ${front} vorne und ${top} oben. Kippe dann den ganzen Würfel zu dir. Die obere Seite kommt nach vorne.`],
  ['Jetzt die untere Seite',`Halte zuerst wieder ${front} vorne und ${top} oben. Kippe dann den ganzen Würfel von dir weg. Die untere Seite kommt nach vorne.`]
 ][i];
}
function holdingPicture(i){
 const selected=i===0?0:i<4?1:2;
 const shapes=i===5?['35,45 100,70 100,145 35,120','100,70 165,45 165,120 100,145','35,120 100,145 165,120 100,170']:['35,70 100,95 100,170 35,145','100,95 165,70 165,145 100,170','35,70 100,45 165,70 100,95'];
 return `<svg viewBox="0 0 200 195" role="img" aria-label="Die markierte Seite kommt nach vorne zur Kamera." style="width:150px;max-width:45%">${shapes.map((p,j)=>`<polygon points="${p}" fill="${selected===j?'#a5a0ff':'#f8fafc'}" stroke="#334155" stroke-width="3"/>`).join('')}<text x="100" y="188" text-anchor="middle" font-size="15" fill="#334155">${i===0?'Gerade zu dir':i<4?'Diese Seite kommt zu dir':i===4?'Oben kommt zu dir':'Unten kommt zu dir'}</text></svg>`;
}
function turnPicture(i){
 const arrow=i===0?'':i<4?'←':i===4?'↷':'↶';
 return `<div style="text-align:center;background:#f0efff;border-radius:18px;padding:10px"><div style="font-size:18px;font-weight:900">${i===0?'So halten':i<4?'Ganzer Würfel nach links':i===4?'Ganzer Würfel zu dir kippen':'Ganzer Würfel von dir weg kippen'}</div><div style="display:flex;align-items:center;justify-content:center">${holdingPicture(i)}<span style="font-size:58px" aria-hidden="true">${arrow}</span><span style="font-size:45px" aria-hidden="true">📷</span></div>${i>=4?reference():''}</div>`;
}
function renderCapture(){
 const i=captureStep,[title,note]=instructions(i);
 e('cubeFaces').innerHTML=`<div role="status" style="text-align:center;font-weight:900;font-size:18px;margin:12px 0">Foto ${i+1} von 6 · ${faceNames[i]}</div><div class="bar"><div style="width:${Object.keys(faces).length/6*100}%"></div></div><h2 style="text-align:center">${title}</h2><p style="text-align:center;font-size:19px;line-height:1.5">${note}</p>${turnPicture(i)}${i===0?`<p style="font-size:18px">Welche Farbe hat das <b>mittlere Feld oben</b> auf deinem Würfel? Merke sie dir.</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${C.map(c=>`<button type="button" data-top="${c}" aria-pressed="${topColor===c}" style="padding:12px;border:${topColor===c?'4px solid #6c63ff':'2px solid #334155'};border-radius:12px;background:${ink[c]};color:#111;font-weight:800">${colorNames[c]}${topColor===c?' ✓':''}</button>`).join('')}</div>`:i<4?`<p style="text-align:center;font-size:18px">${colorNames[topColor]} bleibt oben.</p>`:''}<h3 style="text-align:center">📷 Diese Seite fotografieren</h3><div id="cubePicture${i}">${capturePicture(i)}</div><p style="text-align:center;font-size:17px">Halte die Seite gerade zur Kamera. Alle 9 Felder sollen groß im Foto sein.</p><label class="btn" style="display:block;text-align:center;cursor:pointer" for="cubeFile${i}">📷 ${faces[i]?'Foto neu machen':'Foto machen'}</label><input id="cubeFile${i}" type="file" accept="image/*" capture="environment" style="position:absolute;width:1px;height:1px;opacity:0"><div id="cubeGrid${i}" style="display:grid;grid-template-columns:repeat(3,52px);gap:4px;justify-content:center;margin:14px 0"></div><p id="cubeColorHelp" style="text-align:center;${faces[i]?'':'display:none'}">Stimmen die Farben? Tippe auf ein falsches Feld, bis die Farbe stimmt.</p><button class="btn" id="cubeCaptureNext" ${!faces[i]||(i===0&&!topColor)?'disabled':''}>${i===5?'✓ Alle Fotos fertig':'Stimmt! Nächste Seite →'}</button><button class="btn ghost" id="cubeCapturePrev" ${i===0?'disabled':''}>← Voriges Foto</button>`;
 e('cubeAnalyse').style.display='none';
 document.querySelectorAll('[data-top]').forEach(b=>b.onclick=()=>{topColor=b.dataset.top;renderCapture()});
 e('cubeFile'+i).onchange=ev=>scan(ev.target.files[0],i);
 e('cubeCaptureNext').onclick=()=>{if(!faces[i]||(i===0&&!topColor))return;if(i<5){captureStep++;renderCapture()}else analyse()};
 e('cubeCapturePrev').onclick=()=>{if(captureStep>0){captureStep--;renderCapture()}};
 if(faces[i])drawGrid(i,faces[i]);
}
function scan(file,i){if(!file)return;const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const cv=document.createElement('canvas'),x=cv.getContext('2d');cv.width=300;cv.height=300;x.drawImage(im,0,0,300,300);let a=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++){const d=x.getImageData(75+c*75,75+r*75,1,1).data;a.push(nearest(d[0],d[1],d[2]))}faces[i]=a;drawGrid(i,a);URL.revokeObjectURL(u)};im.src=u}
function nearest(r,g,b){const refs={white:[235,235,225],yellow:[240,220,35],red:[200,45,40],orange:[235,120,30],blue:[35,105,190],green:[45,155,80]};let best='white',v=1e9;for(const [k,q] of Object.entries(refs)){let d=(r-q[0])**2+(g-q[1])**2+(b-q[2])**2;if(d<v){v=d;best=k}}return best}
function drawGrid(i,a){if(!e('cubePicture'+i))return;e('cubeColorHelp').style.display='block';e('cubeCaptureNext').disabled=i===0&&!topColor;e('cubePicture'+i).innerHTML=capturePicture(i);e('cubeGrid'+i).innerHTML=a.map((c,j)=>`<button type="button" data-j="${j}" aria-label="Feld ${j+1}: ${colorNames[c]}. Antippen zum Ändern." style="width:52px;height:52px;border:2px solid #333;border-radius:5px;background:${c}"></button>`).join('');[...e('cubeGrid'+i).children].forEach(b=>b.onclick=()=>{let j=+b.dataset.j,k=(C.indexOf(faces[i][j])+1)%C.length;faces[i][j]=C[k];b.style.background=C[k];b.setAttribute('aria-label',`Feld ${j+1}: ${colorNames[C[k]]}. Antippen zum Ändern.`);if(j===4)e('cubePicture'+i).innerHTML=capturePicture(i)})}
function analyse(){
 const count={};Object.values(faces).flat().forEach(c=>count[c]=(count[c]||0)+1);
 const valid=Object.keys(faces).length===6&&C.every(c=>count[c]===9);
 e('cubeFaces').innerHTML=`<h2 style="text-align:center">${valid?'📷 Deine 6 Fotos sind fertig!':'🎨 Prüfe deine Farben'}</h2><p style="text-align:center">${valid?'Die Anzahl der Farben stimmt.':'Jede Farbe muss 9-mal vorkommen. Tippe auf ein Foto, um seine Farben zu prüfen.'}</p><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">${faceNames.map((n,i)=>`<button class="btn ghost" data-review="${i}">${i+1}. ${n}<span style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin:8px auto;width:90px">${(faces[i]||[]).map(c=>`<span style="height:28px;background:${ink[c]};border:1px solid #334155"></span>`).join('')}</span>Foto prüfen</button>`).join('')}</div><p style="background:#f0efff;border-radius:16px;padding:16px;font-size:18px">Die Anleitung zum Lösen ist noch in Arbeit. Bitte drehe jetzt keine Reihen.</p>`;
 document.querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>{captureStep=Number(b.dataset.review);renderCapture()});
}
const text={R:'Drehe die rechte Seite nach oben.',"R′":'Drehe die rechte Seite nach unten.',U:'Drehe die obere Seite nach rechts.',"U′":'Drehe die obere Seite nach links.',F:'Drehe die Vorderseite im Uhrzeigersinn.',"F′":'Drehe die Vorderseite gegen den Uhrzeigersinn.',"L′":'Drehe die linke Seite nach oben.'};
function renderStep(){const m=moves[step];e('cubeVisual').innerHTML=`<div style="width:210px;height:210px;margin:18px auto;background:linear-gradient(135deg,#ffd43b 0 33%,#42a5f5 33% 66%,#66bb6a 66%);border:12px solid #292b36;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:76px;box-shadow:0 16px 30px #0002">↻</div><div style="text-align:center;font-weight:900">Schritt ${step+1} von ${moves.length} · ${m}</div>`;e('cubeText').textContent=text[m]||('Führe '+m+' aus.')}
function finish(){e('cubeVisual').innerHTML='<div style="font-size:80px;text-align:center">🎉🧩</div>';e('cubeText').textContent='Geschafft! Dein Zauberwürfel ist gelöst.';e('cubeNext').style.display='none'}
function open(){show('cubeSolver')}
window.openCubeSolver=open;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();})();
