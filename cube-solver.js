(()=>{'use strict';
const C=['white','yellow','red','orange','blue','green'];let faces={},step=0,moves=[],captureStep=0,topColor=null;
function e(i){return document.getElementById(i)}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));e(id)?.classList.add('active')}
function install(){if(e('cubeSolver'))return;installCubeStyles();const home=e('home');if(home){const card=home.querySelector('.card');const b=document.createElement('button');b.className='btn alt';b.innerHTML='🧩 Zauberwürfel lösen';b.onclick=open;card?.appendChild(b)}
const s=document.createElement('section');s.id='cubeSolver';s.className='screen';s.innerHTML=`<div class="hero"><h1>🧩 Zauberwürfel</h1><p>Wir machen 6 Fotos. Immer nur eine Seite.</p></div><div class="card"><div id="cubeCapture"><div class="title">1. Würfel aufnehmen</div><p class="muted">Drehe immer den ganzen Würfel. Verdrehe keine einzelnen Reihen.</p><div id="cubeFaces"></div><button class="btn" id="cubeAnalyse">Farben prüfen</button></div><div id="cubeGuide" style="display:none"><div class="title">2. Schritt für Schritt</div><div id="cubeVisual"></div><div id="cubeText" class="q textq" style="text-align:center"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn ghost" id="cubePrev">← Zurück</button><button class="btn" id="cubeNext">Gemacht ✓</button></div><button class="btn alt" id="cubeWrong">↩️ Falsch gedreht</button></div><button class="btn ghost" id="cubeBack">← Zurück</button></div>`;(document.querySelector('.app')||document.body).appendChild(s);renderCapture();e('cubeAnalyse').onclick=analyse;e('cubeBack').onclick=()=>show('home');e('cubeNext').onclick=()=>{if(step<moves.length-1){step++;renderStep()}else finish()};e('cubePrev').onclick=()=>{if(step>0){step--;renderStep()}};e('cubeWrong').onclick=()=>{if(step>0)step--;renderStep()}}

const faceNames=['Vorne','Rechts','Hinten','Links','Oben','Unten'];
// Color IDs are labels only; no standard opposite-color arrangement is assumed.
const palettes={
 classic:{names:{white:'Weiß',yellow:'Gelb',red:'Rot',orange:'Orange',blue:'Blau',green:'Grün'},ink:{white:'#ffffff',yellow:'#facc15',red:'#ef4444',orange:'#fb923c',blue:'#3b82f6',green:'#22c55e'},refs:{white:[235,235,225],yellow:[240,220,35],red:[200,45,40],orange:[235,120,30],blue:[35,105,190],green:[45,155,80]}},
 pastel:{names:{white:'Rosa',yellow:'Mint',red:'Pink',orange:'Hellblau',blue:'Dunkelblau',green:'Grün'},ink:{white:'#efbfb6',yellow:'#b2e8cd',red:'#f6658b',orange:'#70b6ee',blue:'#2b62b8',green:'#3c895f'},refs:{white:[239,191,182],yellow:[178,232,205],red:[246,101,139],orange:[112,182,238],blue:[43,98,184],green:[60,137,95]}}
};
let palette='pastel',colorNames=palettes.pastel.names,ink=palettes.pastel.ink;
function setPalette(value){
 if(!palettes[value]||value===palette)return;
 palette=value;colorNames=palettes[value].names;ink=palettes[value].ink;
 faces={};topColor=null;captureStep=0;renderCapture();
}
function palettePicker(){return `<div style="padding:12px;background:#f7f7fb;border-radius:16px"><b>Welche Farben hat dein Würfel?</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${[['pastel','Rosa · Mint · Blau'],['classic','Weiß · Gelb · Rot']].map(([id,label])=>`<button type="button" data-palette="${id}" aria-pressed="${palette===id}" style="padding:10px;border:${palette===id?'3px solid #6c63ff':'2px solid #ccc'};border-radius:12px;background:white;color:#25273d"><b>${id==='pastel'?'Pastell':'Klassisch'}${palette===id?' ✓':''}</b><span style="display:flex;gap:3px;margin:8px 0">${C.map(c=>`<span style="width:18px;height:18px;background:${palettes[id].ink[c]};border:1px solid #334155;border-radius:4px"></span>`).join('')}</span>${label}</button>`).join('')}</div>${Object.keys(faces).length?'<p style="margin:8px 0;font-size:14px">Andere Farben wählen startet die 6 Fotos neu.</p>':''}</div>`}
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
let guideAnimation=null;
const cubeFaceTransforms=['translateZ(66px)','rotateY(90deg) translateZ(66px)','rotateY(180deg) translateZ(66px)','rotateY(-90deg) translateZ(66px)','rotateX(90deg) translateZ(66px)','rotateX(-90deg) translateZ(66px)'];
function cubePose(i){return i<4?`rotateX(0deg) rotateY(${-90*i}deg)`:`rotateX(${i===4?-90:90}deg) rotateY(0deg)`}
function installCubeStyles(){
 const style=document.createElement('style');style.id='cubeNumberedStyles';style.textContent=`
 #cubeSolver .cube-turn-card{background:#f0efff;border-radius:20px;padding:14px;text-align:center;overflow:hidden}
 #cubeSolver .cube-stage{height:230px;perspective:650px;display:flex;align-items:center;justify-content:center}
 #cubeSolver .cube-camera{width:132px;height:132px;transform-style:preserve-3d;transform:rotateX(-16deg) rotateY(-22deg)}
 #cubeSolver .cube-body{position:relative;width:132px;height:132px;transform-style:preserve-3d}
 #cubeSolver .cube-face{position:absolute;inset:0;width:132px;height:132px;display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:4px;background:#25273d;border:2px solid #25273d;border-radius:6px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
 #cubeSolver .cube-face.target{border:4px solid #6c63ff;box-shadow:0 0 0 3px #fff}
 #cubeSolver .cube-sticker{border-radius:4px;min-width:0;min-height:0}
 #cubeSolver .cube-face-number{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fffffff0;border:2px solid #25273d;border-radius:12px;color:#25273d;min-width:66px;padding:3px 5px;font-size:40px;font-weight:950;line-height:1}
 #cubeSolver .cube-face-number small{display:block;font-size:12px;margin:3px 0;font-weight:800}
 #cubeSolver .cube-number-key{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}
 #cubeSolver .cube-number-key span{background:#ffffffba;border-radius:9px;padding:7px 2px;font-size:13px}
 #cubeSolver .cube-number-key .target{background:#6c63ff;color:#fff;font-weight:900}
 `;(document.head||document.body).appendChild(style);
}
function turnPicture(i){
 const start=i>0&&i<4?i:1;
 const startText=i===0?'Seite 1 zeigt zu dir. Seite 5 ist oben.':i<4?`Start: Seite ${start} zeigt zu dir. Seite 5 bleibt oben.`:'Zuerst zurück zur Starthaltung: Seite 1 zeigt zu dir, Seite 5 ist oben.';
 const action=i===0?'So hältst du deinen Würfel':i<4?`← Drehe den ganzen Würfel nach links, bis Seite ${i+1} zu dir zeigt.`:i===4?'↓ Kippe den ganzen Würfel zu dir. Seite 5 kommt nach vorne.':'↑ Kippe den ganzen Würfel von dir weg. Seite 6 kommt nach vorne.';
 const cube=cubeFaceTransforms.map((transform,j)=>{
   const center=faces[j]?.[4]||(j===4?topColor:null);
   const tiles=Array.from({length:9},(_,k)=>`<span class="cube-sticker" style="background:${ink[faces[j]?.[k]||(k===4?center:null)]||'#d8dbe8'}"></span>`).join('');
   return `<div class="cube-face ${i===j?'target':''}" data-cube-face="${j+1}" style="transform:${transform}">${tiles}<span class="cube-face-number">${j+1}<small>${faceNames[j]}</small></span></div>`;
 }).join('');
 return `<div class="cube-turn-card"><p style="font-size:17px;margin:4px 0">${startText}</p><p style="font-size:20px;font-weight:900;line-height:1.4">${action}</p><div class="cube-stage" role="img" aria-label="3D-Würfel mit festen Seitennummern. Ziel: Seite ${i+1}, ${faceNames[i]}, zeigt zur Kamera."><div class="cube-camera"><div id="cubeNumberedBody" class="cube-body" style="transform:${cubePose(i)}">${cube}</div></div></div><div id="cubeTurnStatus" role="status" style="font-size:19px;font-weight:900">📷 Jetzt Seite ${i+1} fotografieren</div>${i>0?'<button class="btn alt" id="cubeShowTurn" type="button">▶ Drehung zeigen</button>':''}<div class="cube-number-key">${faceNames.map((name,j)=>`<span class="${i===j?'target':''}"><b>${j+1}</b> ${name}</span>`).join('')}</div><p style="font-size:14px;margin-bottom:0">Die Nummern bleiben auf derselben Seite – auch beim Drehen. Grau = noch kein Foto.</p>${i>=4?reference():''}</div>`;
}
function bindTurnButton(i){if(e('cubeShowTurn'))e('cubeShowTurn').onclick=()=>animateCaptureTurn(i)}
function animateCaptureTurn(i){
 const cube=e('cubeNumberedBody'),status=e('cubeTurnStatus');if(!cube||i===0)return;
 if(guideAnimation)guideAnimation.cancel();
 const start=cubePose(i<4?i-1:0),end=cubePose(i);
 if(typeof cube.animate!=='function'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){cube.style.transform=end;status.textContent=`Seite ${i+1} zeigt jetzt zu dir. 📷`;return}
 status.textContent=i<4?`Seite ${i} vorne → Seite ${i+1} vorne`:`Seite 1 vorne → Seite ${i+1} vorne`;
 const animation=cube.animate([{transform:start,offset:0},{transform:start,offset:.2},{transform:end,offset:.85},{transform:end,offset:1}],{duration:2600,easing:'ease-in-out'});guideAnimation=animation;
 animation.finished.then(()=>{if(guideAnimation!==animation)return;guideAnimation=null;status.textContent=`📷 Jetzt Seite ${i+1} fotografieren`}).catch(()=>{});
}
function renderCapture(){ if(guideAnimation){guideAnimation.cancel();guideAnimation=null;}
 const i=captureStep,[title,note]=instructions(i);
 e('cubeFaces').innerHTML=`${i===0?palettePicker():''}<div role="status" style="text-align:center;font-weight:900;font-size:18px;margin:12px 0">Foto ${i+1} von 6 · ${faceNames[i]}</div><div class="bar"><div style="width:${Object.keys(faces).length/6*100}%"></div></div><h2 style="text-align:center">${title}</h2><p style="text-align:center;font-size:19px;line-height:1.5">${note}</p><div id="cubeTurnHelp">${turnPicture(i)}</div>${i===0?`<p style="font-size:18px">Welche Farbe hat das <b>mittlere Feld oben</b> auf deinem Würfel? Merke sie dir.</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${C.map(c=>`<button type="button" data-top="${c}" aria-pressed="${topColor===c}" style="padding:12px;border:${topColor===c?'4px solid #6c63ff':'2px solid #334155'};border-radius:12px;background:${ink[c]};color:#111;font-weight:800">${colorNames[c]}${topColor===c?' ✓':''}</button>`).join('')}</div>`:i<4?`<p style="text-align:center;font-size:18px">${colorNames[topColor]} bleibt oben.</p>`:''}<h3 style="text-align:center">📷 Diese Seite fotografieren</h3><div id="cubePicture${i}">${capturePicture(i)}</div><p style="text-align:center;font-size:17px">Halte die Seite gerade zur Kamera. Alle 9 Felder sollen groß im Foto sein.</p><label class="btn" style="display:block;text-align:center;cursor:pointer" for="cubeFile${i}">📷 ${faces[i]?'Foto neu machen':'Foto machen'}</label><input id="cubeFile${i}" type="file" accept="image/*" capture="environment" style="position:absolute;width:1px;height:1px;opacity:0"><div id="cubeGrid${i}" style="display:grid;grid-template-columns:repeat(3,52px);gap:4px;justify-content:center;margin:14px 0"></div><p id="cubeColorHelp" style="text-align:center;${faces[i]?'':'display:none'}">Stimmen die Farben? Tippe auf ein falsches Feld, bis die Farbe stimmt.</p><button class="btn" id="cubeCaptureNext" ${!faces[i]||(i===0&&!topColor)?'disabled':''}>${i===5?'✓ Alle Fotos fertig':'Stimmt! Nächste Seite →'}</button><button class="btn ghost" id="cubeCapturePrev" ${i===0?'disabled':''}>← Voriges Foto</button>`;
 e('cubeAnalyse').style.display='none';bindTurnButton(i);
 document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>setPalette(b.dataset.palette));
 document.querySelectorAll('[data-top]').forEach(b=>b.onclick=()=>{topColor=b.dataset.top;renderCapture()});
 e('cubeFile'+i).onchange=ev=>scan(ev.target.files[0],i);
 e('cubeCaptureNext').onclick=()=>{if(!faces[i]||(i===0&&!topColor))return;if(i<5){captureStep++;renderCapture()}else analyse()};
 e('cubeCapturePrev').onclick=()=>{if(captureStep>0){captureStep--;renderCapture()}};
 if(faces[i])drawGrid(i,faces[i]);
}
function scan(file,i){if(!file)return;const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const cv=document.createElement('canvas'),x=cv.getContext('2d');cv.width=300;cv.height=300;x.drawImage(im,0,0,300,300);let a=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++){const d=x.getImageData(75+c*75,75+r*75,1,1).data;a.push(nearest(d[0],d[1],d[2]))}faces[i]=a;drawGrid(i,a);URL.revokeObjectURL(u)};im.src=u}
function nearest(r,g,b){const refs=palettes[palette].refs;let best=C[0],v=Infinity;for(const [k,q] of Object.entries(refs)){const d=(r-q[0])**2+(g-q[1])**2+(b-q[2])**2;if(d<v){v=d;best=k}}return best}
function drawGrid(i,a){if(!e('cubePicture'+i))return;e('cubeTurnHelp').innerHTML=turnPicture(i);bindTurnButton(i);e('cubeColorHelp').style.display='block';e('cubeCaptureNext').disabled=i===0&&!topColor;e('cubePicture'+i).innerHTML=capturePicture(i);e('cubeGrid'+i).innerHTML=a.map((c,j)=>`<button type="button" data-j="${j}" aria-label="Feld ${j+1}: ${colorNames[c]}. Antippen zum Ändern." style="width:52px;height:52px;border:2px solid #333;border-radius:5px;background:${ink[c]}"></button>`).join('');[...e('cubeGrid'+i).children].forEach(b=>b.onclick=()=>{let j=+b.dataset.j,k=(C.indexOf(faces[i][j])+1)%C.length;faces[i][j]=C[k];b.style.background=ink[C[k]];b.setAttribute('aria-label',`Feld ${j+1}: ${colorNames[C[k]]}. Antippen zum Ändern.`);e('cubePicture'+i).innerHTML=capturePicture(i);e('cubeTurnHelp').innerHTML=turnPicture(i);bindTurnButton(i)})}
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
