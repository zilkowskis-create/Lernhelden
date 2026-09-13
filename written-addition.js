(()=>{
'use strict';
let waA=0,waB=0,waCorrect=0,waIndex=0,waTotal=10,waDone=false,waCols=[];
function el(id){return document.getElementById(id)}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const s=el(id);if(s)s.classList.add('active');}
function installWrittenAddition(){
 if(el('writtenAddition'))return;
 const math=el('math');if(math){const start=[...math.querySelectorAll('button')].find(b=>/Los geht|Start/i.test(b.textContent||''));const wrap=document.createElement('div');wrap.innerHTML='<div class="title">Schriftlich rechnen</div><div class="modes"><button class="mode" type="button" id="writtenAddBtn">➕ Schriftliche Addition</button></div>';if(start)start.parentNode.insertBefore(wrap,start);else math.appendChild(wrap);el('writtenAddBtn').onclick=openWrittenAddition;}
 const section=document.createElement('section');section.id='writtenAddition';section.className='screen';section.innerHTML=`
 <div class="hero"><h1>➕ Schriftliche Addition</h1><p>Notiere den Rechenweg selbst – von rechts nach links. Trage Ergebnisziffer und Übertrag ein.</p></div>
 <div class="card">
  <div class="row"><div><div class="label">Aufgabe</div><div id="waTask" style="font-size:2rem;font-weight:800"></div></div><div><div class="label">Fortschritt</div><div id="waProgress">1 / 10</div></div></div>
  <div id="waColumn" style="margin:22px auto;max-width:360px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:2rem;line-height:1.45;text-align:right"></div>
  <div class="title">✍️ Rechenweg notieren</div><div id="waSteps"></div>
  <div class="title">Gesamtergebnis</div><input id="waAnswer" inputmode="numeric" pattern="[0-9]*" class="answerInput" placeholder="Ergebnis eingeben">
  <div id="waFeedback" class="feedback"></div>
  <button id="waCheck" class="btn" type="button">Rechenweg prüfen</button>
  <button id="waNext" class="btn" type="button" style="display:none;background:#1976d2;color:white">Nächste Aufgabe →</button>
  <button id="waBack" class="btn ghost" type="button">← Zurück zu Mathe</button>
 </div>`;
 const app=document.querySelector('.app')||document.body,german=el('germanMenu');if(german)app.insertBefore(section,german);else app.appendChild(section);
 el('waCheck').onclick=checkWrittenAddition;el('waNext').onclick=nextWrittenAddition;el('waBack').onclick=()=>{if(typeof window.show==='function')window.show('math');else showScreen('math');};
}
function openWrittenAddition(){waIndex=0;waCorrect=0;waDone=false;const ans=el('waAnswer');if(ans)ans.style.display='block';if(typeof window.show==='function')window.show('writtenAddition');else showScreen('writtenAddition');nextWrittenAddition();}
function nextWrittenAddition(){
 if(waIndex>=waTotal){finishWrittenAddition();return;}waDone=false;waIndex++;
 const ranges=[[10,99,10,99],[100,999,10,999],[100,9999,100,9999]],r=ranges[Math.floor(Math.random()*ranges.length)];waA=r[0]+Math.floor(Math.random()*(r[1]-r[0]+1));waB=r[2]+Math.floor(Math.random()*(r[3]-r[2]+1));
 if(Math.random()<.7){const a1=waA%10,b1=waB%10;if(a1+b1<10)waB+=Math.max(1,10-(a1+b1));}
 if(el('waTask'))el('waTask').textContent=waA+' + '+waB;if(el('waProgress'))el('waProgress').textContent=waIndex+' / '+waTotal;const ans=el('waAnswer');if(ans){ans.value='';ans.disabled=false;}const fb=el('waFeedback');if(fb){fb.textContent='';fb.className='feedback';}if(el('waCheck'))el('waCheck').style.display='block';if(el('waNext'))el('waNext').style.display='none';renderWrittenAddition();
}
function renderWrittenAddition(){
 const box=el('waColumn'),steps=el('waSteps');if(!box||!steps)return;const width=Math.max(String(waA).length,String(waB).length)+1,a=String(waA).padStart(width,' '),b=String(waB).padStart(width-1,' ');box.innerHTML='<div>'+a.replace(/ /g,'&nbsp;')+'</div><div>+&nbsp;'+b.replace(/ /g,'&nbsp;')+'</div><div style="border-top:3px solid currentColor;margin-top:4px;padding-top:4px">&nbsp;</div>';
 waCols=[];let carry=0,out='',cols=Math.max(String(waA).length,String(waB).length);for(let pos=0;pos<cols;pos++){const da=Math.floor(waA/10**pos)%10,db=Math.floor(waB/10**pos)%10,sum=da+db+carry,digit=sum%10,nextCarry=Math.floor(sum/10),place=['Einer','Zehner','Hunderter','Tausender'][pos]||('10^'+pos);waCols.push({da,db,carry,digit,nextCarry,place});out+=`<div class="card" style="padding:12px;margin:8px 0"><strong>${place}:</strong> ${da} + ${db}${carry?' + Übertrag':''} = <input id="waSum${pos}" inputmode="numeric" pattern="[0-9]*" style="width:64px;font-size:1.1rem;text-align:center" aria-label="${place} Ergebnisziffer"> &nbsp; Übertrag: <input id="waCarry${pos}" inputmode="numeric" pattern="[0-9]*" style="width:52px;font-size:1.1rem;text-align:center" placeholder="0" aria-label="${place} Übertrag"></div>`;carry=nextCarry;}steps.innerHTML=out;
}
function checkWrittenAddition(){
 if(waDone)return;const ans=el('waAnswer'),fb=el('waFeedback');if(!ans||ans.value.trim()===''){if(fb){fb.textContent='Bitte notiere den Rechenweg und das Gesamtergebnis.';fb.className='feedback bad';}return;}
 let pathOK=true,firstWrong='';waCols.forEach((c,pos)=>{const s=el('waSum'+pos),k=el('waCarry'+pos),sv=s&&s.value.trim(),kv=k&&k.value.trim();const okS=sv!==''&&Number(sv)===c.digit,okK=(kv===''?0:Number(kv))===c.nextCarry;if(!okS||!okK){pathOK=false;if(!firstWrong)firstWrong=c.place;}if(s)s.style.outline=okS?'2px solid #2e7d32':'2px solid #d32f2f';if(k)k.style.outline=okK?'2px solid #2e7d32':'2px solid #d32f2f';});
 const correct=waA+waB,user=Number(ans.value),answerOK=user===correct;if(pathOK&&answerOK){waDone=true;waCorrect++;ans.disabled=true;if(fb){fb.textContent='✅ Richtig! Rechenweg und Ergebnis stimmen.';fb.className='feedback ok';}try{if(typeof window.sayBravo==='function')window.sayBravo();}catch(e){}if(el('waCheck'))el('waCheck').style.display='none';if(el('waNext'))el('waNext').style.display='block';try{if(typeof window.recordAttempt==='function')window.recordAttempt('math','Schriftliche Addition',true);}catch(e){}}
 else{if(fb){fb.textContent=!pathOK?'❌ Prüfe deinen Rechenweg bei '+firstWrong+'. Die roten Felder stimmen noch nicht.':'❌ Der Rechenweg stimmt. Prüfe jetzt dein Gesamtergebnis.';fb.className='feedback bad';}}
}
function finishWrittenAddition(){if(el('waTask'))el('waTask').textContent='Geschafft! 🎉';if(el('waColumn'))el('waColumn').innerHTML='';if(el('waSteps'))el('waSteps').innerHTML='';if(el('waAnswer'))el('waAnswer').style.display='none';if(el('waCheck'))el('waCheck').style.display='none';if(el('waNext'))el('waNext').style.display='none';const fb=el('waFeedback');if(fb){fb.textContent='Du hast '+waCorrect+' von '+waTotal+' Aufgaben richtig gelöst.';fb.className='feedback ok';}}
window.openWrittenAddition=openWrittenAddition;window.nextWrittenAddition=nextWrittenAddition;window.checkWrittenAddition=checkWrittenAddition;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installWrittenAddition);else installWrittenAddition();
})();