(()=>{
'use strict';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const suffix=[
 ['gesund','Gesundheit'],['frei','Freiheit'],['krank','Krankheit'],['schön','Schönheit'],['sicher','Sicherheit'],['wahr','Wahrheit'],['dunkel','Dunkelheit'],['möglich','Möglichkeit'],['fröhlich','Fröhlichkeit'],['ewig','Ewigkeit'],['flüssig','Flüssigkeit'],['sauber','Sauberkeit'],['tätig','Tätigkeit'],['prüfen','Prüfung'],['rechnen','Rechnung'],['zeichnen','Zeichnung'],['öffnen','Öffnung'],['ordnen','Ordnung'],['heizen','Heizung'],['kleiden','Kleidung'],['wohnen','Wohnung'],['führen','Führung'],['betonen','Betonung'],['erzählen','Erzählung'],['entfernen','Entfernung']
];
const plurals=[
 ['das Hemd','Hemden'],['das Lied','Lieder'],['das Rad','Räder'],['das Bild','Bilder'],['der Wald','Wälder'],['der Mond','Monde'],['der Arzt','Ärzte'],['das Geld','Gelder'],['das Feld','Felder'],['die Welt','Welten'],['der Held','Helden'],['der Hund','Hunde'],['das Kind','Kinder'],['das Fest','Feste'],['der Wind','Winde'],
 ['das Paket','Pakete'],['die Geburt','Geburten'],['das Fahrrad','Fahrräder'],['die Eltern','Eltern'],['die Freundin','Freundinnen'],['der Abend','Abende'],['der Brand','Brände'],['die Wurst','Würste'],['das Pferd','Pferde'],['der Grund','Gründe'],['die Hand','Hände'],['die Faust','Fäuste'],['das Kleid','Kleider'],['das Land','Länder'],['der Mund','Münder'],
 ['der Krug','Krüge'],['der Berg','Berge'],['die Burg','Burgen'],['der Krieg','Kriege'],['der Weg','Wege'],['der Zug','Züge'],['der Erfolg','Erfolge'],['die Bank','Bänke'],['die Fabrik','Fabriken'],['der Zweig','Zweige'],['der Tag','Tage'],['der Schrank','Schränke'],['der Vortrag','Vorträge'],['das Geschenk','Geschenke'],['der Ausflug','Ausflüge'],['der Mittag','Mittage'],['der Samstag','Samstage'],['der Dienst','Dienste'],['das Spielzeug','Spielzeuge'],['das Flugzeug','Flugzeuge'],['der Katalog','Kataloge'],['das Getränk','Getränke'],['der Umzug','Umzüge'],
 ['der Urlaub','Urlaube'],['der Korb','Körbe'],['das Grab','Gräber']
];
function task(){
 if(Math.random()<.48){const x=pick(suffix);return {q:`Bilde das Nomen und schreibe es richtig: „${x[0]}“ → die ______`,ans:x[1],ex:`Richtig: die ${x[1]}. Nomen mit -heit, -keit und -ung werden großgeschrieben.`};}
 const x=pick(plurals);return {q:`Bilde die Mehrzahl und schreibe sie richtig: ${x[0]} → die ______`,ans:x[1],ex:`Richtig: die ${x[1]}. Achte auf Wortstamm, Umlaut und Endung.`};
}
function norm(s){return String(s||'').trim().replace(/\s+/g,' ');}
function install(){
 const menu=document.getElementById('spellingMenu')||document.getElementById('rechtschreibungMenu');
 if(!menu)return;
 if(document.getElementById('lhExtraSpellingBtn'))return;
 const btn=document.createElement('button');btn.id='lhExtraSpellingBtn';btn.className='mode';btn.type='button';btn.textContent='✍️ Nomen richtig schreiben';
 const holder=menu.querySelector('.modes')||menu.querySelector('.card')||menu;holder.appendChild(btn);
 btn.onclick=()=>openTask();
}
function ensureScreen(){
 let s=document.getElementById('lhExtraSpelling');if(s)return s;
 s=document.createElement('section');s.id='lhExtraSpelling';s.className='screen';s.innerHTML=`<div class="hero"><h1>✍️ Nomen richtig schreiben</h1><p>Schreibe die Lösung selbst. Achte auf Großschreibung, Umlaut und Endung.</p></div><div class="card"><div id="lhSpQ" class="q textq"></div><input id="lhSpA" class="answerInput" autocomplete="off" autocapitalize="sentences" placeholder="Wort schreiben"><div id="lhSpF" class="feedback"></div><button id="lhSpCheck" class="btn">Prüfen</button><button id="lhSpNext" class="v82nextbtn" style="display:none;width:100%">Nächste Aufgabe →</button><button id="lhSpBack" class="btn ghost">← Zurück</button></div>`;
 (document.querySelector('.app')||document.body).appendChild(s);
 document.getElementById('lhSpCheck').onclick=check;document.getElementById('lhSpNext').onclick=openTask;document.getElementById('lhSpBack').onclick=()=>{if(typeof window.show==='function')window.show('germanMenu');};return s;
}
let current=null;
function openTask(){ensureScreen();current=task();if(typeof window.show==='function')window.show('lhExtraSpelling');document.getElementById('lhSpQ').textContent=current.q;const a=document.getElementById('lhSpA');a.value='';a.disabled=false;document.getElementById('lhSpF').textContent='';document.getElementById('lhSpF').className='feedback';document.getElementById('lhSpCheck').style.display='block';document.getElementById('lhSpNext').style.display='none';a.focus();}
function check(){const a=document.getElementById('lhSpA'),f=document.getElementById('lhSpF');if(!norm(a.value)){f.textContent='Bitte schreibe zuerst das Wort.';f.className='feedback bad';return;}const ok=norm(a.value)===current.ans;if(ok){f.textContent='✅ Richtig! '+current.ex;f.className='feedback ok';a.disabled=true;document.getElementById('lhSpCheck').style.display='none';document.getElementById('lhSpNext').style.display='block';try{window.celebrateCorrect&&window.celebrateCorrect();}catch(e){}setTimeout(()=>{if(document.getElementById('lhExtraSpelling')?.classList.contains('active'))openTask();},2000);}else{f.textContent='Noch nicht ganz. Prüfe die Schreibweise noch einmal.';f.className='feedback bad';}}
window.LHExtraGermanSpelling={open:openTask};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();