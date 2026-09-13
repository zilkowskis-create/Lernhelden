(()=>{
'use strict';
let waA=0,waB=0,waCorrect=0,waIndex=0,waTotal=10,waDone=false,waCarries=[];
function el(id){return document.getElementById(id)}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const s=el(id);if(s)s.classList.add('active');}
function installWrittenAddition(){
 if(el('writtenAddition'))return;
 const math=el('math');if(math){const start=[...math.querySelectorAll('button')].find(b=>/Los geht|Start/i.test(b.textContent||''));const wrap=document.createElement('div');wrap.innerHTML='<div class="title">Schriftlich rechnen</div><div class="modes"><button class="mode" type="button" id="writtenAddBtn">➕ Schriftliche Addition</button></div>';if(start)start.parentNode.insertBefore(wrap,start);else math.appendChild(wrap);el('writtenAddBtn').onclick=openWrittenAddition;}
 const section=document.createElement('section');section.id='writtenAddition';section.className='screen';section.innerHTML=`
 <div class="hero"><h1>➕ Schriftliche Addition</h1><p>Trage den Übertrag direkt am Rechenstrich ein und berechne anschließend das Ergebnis.</p></div>
 <div class="card">
  <div class="row"><div><div class="label">Aufgabe</div><div id="waTask" style="font-size:1.5rem;font-weight:800"></div></div><div><div class="label">Fortschritt</div><div id="waProgress">1 / 10</div></div></div>
  <div id="waColumn" style="margin:28px auto;max-width:420px"></div>
  <div id="waFeedback" class="feedback"></div>
  <button id="waCheck" class="btn" type="button">Prüfen</button>
  <button id="waNext" class="btn" type="button" style="display:none;background:#1976d2;color:white">Nächste Aufgabe →</button>
  <button id="waBack" class="btn ghost" type="button">← Zurück zu Mathe</button>
 </div>`;
 const app=document.querySelector('.app')||document.body,german=el('germanMenu');if(german)app.insertBefore(section,german);else app.appendChild(section);
 el('waCheck').onclick=checkWrittenAddition;el('waNext').onclick=nextWrittenAddition;el('waBack').onclick=()=>{if(typeof window.show==='function')window.show('math');else showScreen('math');};
}
function openWrittenAddition(){waIndex=0;waCorrect=0;waDone=false;if(typeof window.show==='function')window.show('writtenAddition');else showScreen('writtenAddition');nextWrittenAddition();}
function nextWrittenAddition(){
 if(waIndex>=waTotal){finishWrittenAddition();return;}waDone=false;waIndex++;
 const ranges=[[10,99,10,99],[100,999,10,999],[100,9999,100,9999]],r=ranges[Math.floor(Math.random()*ranges.length)];waA=r[0]+Math.floor(Math.random()*(r[1]-r[0]+1));waB=r[2]+Math.floor(Math.random()*(r[3]-r[2]+1));
 if(Math.random()<.75){const a1=waA%10,b1=waB%10;if(a1+b1<10)waB+=Math.max(1,10-(a1+b1));}
 if(el('waTask'))el('waTask').textContent=waA+' + '+waB;if(el('waProgress'))el('waProgress').textContent=waIndex+' / '+waTotal;const fb=el('waFeedback');if(fb){fb.textContent='';fb.className='feedback';}if(el('waCheck'))el('waCheck').style.display='block';if(el('waNext'))el('waNext').style.display='none';renderWrittenAddition();
}
function renderWrittenAddition(){
 const box=el('waColumn');if(!box)return;
 const cols=Math.max(String(waA).length,String(waB).length)+1;
 const a=String(waA).padStart(cols,' '),b=String(waB).padStart(cols,' ');
 waCarries=new Array(cols).fill(0);let carry=0;
 for(let pos=0;pos<cols-1;pos++){
   const da=Math.floor(waA/10**pos)%10,db=Math.floor(waB/10**pos)%10;
   const nextCarry=Math.floor((da+db+carry)/10);
   waCarries[cols-pos-2]=nextCarry;carry=nextCarry;
 }
 const row=(text,plus)=>'<div style="display:grid;grid-template-columns:repeat('+cols+',48px);justify-content:center;gap:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:2rem;line-height:1.25">'+[...text].map((ch,i)=>'<div style="text-align:center;position:relative">'+(plus&&i===0?'<span style="position:absolute;left:-17px">+</span>':'')+(ch===' '?'&nbsp;':ch)+'</div>').join('')+'</div>';
 let carryRow='<div style="display:grid;grid-template-columns:repeat('+cols+',48px);justify-content:center;gap:4px;position:absolute;left:50%;transform:translateX(-50%);top:50%;width:max-content">';
 for(let i=0;i<cols;i++){
   if(i===cols-1){carryRow+='<div></div>';continue;}
   carryRow+='<input id="waCarry'+i+'" inputmode="numeric" pattern="[0-9]*" maxlength="1" placeholder="·" aria-label="Übertrag" style="width:32px;height:30px;margin:auto;text-align:center;font-size:1rem;border:1.5px solid #8a8a9a;border-radius:7px;background:#fff;transform:translateY(-50%)">';
 }
 carryRow+='</div>';
 box.innerHTML=row(a,false)+row(b,true)+'<div style="position:relative;height:22px;margin:4px auto 10px;max-width:'+(cols*52)+'px"><div style="position:absolute;left:0;right:0;top:50%;height:3px;background:currentColor"></div>'+carryRow+'</div><div style="font-size:.82rem;text-align:center;margin:-2px 0 8px;color:#666">Übertrag direkt am Strich eintragen</div><div style="text-align:center"><input id="waAnswer" inputmode="numeric" pattern="[0-9]*" class="answerInput" placeholder="Ergebnis" style="max-width:'+(cols*52)+'px;text-align:right;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:1.8rem"></div>';
 const ans=el('waAnswer');if(ans)ans.focus();
}
function checkWrittenAddition(){
 if(waDone)return;const ans=el('waAnswer'),fb=el('waFeedback');if(!ans||ans.value.trim()===''){if(fb){fb.textContent='Bitte trage das Ergebnis ein.';fb.className='feedback bad';}return;}
 let carryOK=true,firstWrong=-1;for(let i=0;i<waCarries.length-1;i++){const inp=el('waCarry'+i),raw=inp?inp.value.trim():'',userCarry=raw===''?0:Number(raw),expected=waCarries[i];const ok=userCarry===expected;if(!ok&&firstWrong<0)firstWrong=i;if(!ok)carryOK=false;if(inp)inp.style.outline=ok?'2px solid #2e7d32':'2px solid #d32f2f';}
 const correct=waA+waB,user=Number(ans.value),answerOK=user===correct;
 if(carryOK&&answerOK){waDone=true;waCorrect++;ans.disabled=true;if(fb){fb.textContent='✅ Richtig! Übertrag und Ergebnis stimmen.';fb.className='feedback ok';}try{if(typeof window.sayBravo==='function')window.sayBravo();}catch(e){}if(el('waCheck'))el('waCheck').style.display='none';if(el('waNext'))el('waNext').style.display='block';try{if(typeof window.recordAttempt==='function')window.recordAttempt('math','Schriftliche Addition',true);}catch(e){}}
 else if(fb){fb.textContent=!carryOK?'❌ Prüfe den roten Übertrag am Strich.':'❌ Der Übertrag stimmt. Prüfe noch einmal dein Ergebnis.';fb.className='feedback bad';}
}
function finishWrittenAddition(){if(el('waTask'))el('waTask').textContent='Geschafft! 🎉';if(el('waColumn'))el('waColumn').innerHTML='';if(el('waCheck'))el('waCheck').style.display='none';if(el('waNext'))el('waNext').style.display='none';const fb=el('waFeedback');if(fb){fb.textContent='Du hast '+waCorrect+' von '+waTotal+' Aufgaben richtig gelöst.';fb.className='feedback ok';}}
window.openWrittenAddition=openWrittenAddition;window.nextWrittenAddition=nextWrittenAddition;window.checkWrittenAddition=checkWrittenAddition;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installWrittenAddition);else installWrittenAddition();
})();