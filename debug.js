/* Debug-Panel, nur mit ?debug=1 geladen (siehe init in index.html).
   Arbeitet auf dem Debug-Spielstand (Schlüssel oathkeep_debug), nie auf dem echten. */
(function(){
'use strict';
var open=false,box=document.createElement('div');
box.id='debug';box.setAttribute('data-testid','debug-panel');
var css=document.createElement('style');
css.textContent='#debug{position:fixed;left:8px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:99;font-family:var(--px);color:#f6ead0}'+
 '#debug .dt{min-width:44px;min-height:44px;padding:0 10px;border-radius:10px;border:2px solid #c0392b;background:#2a0f0a;color:#ffb3a6;font:inherit;font-size:20px}'+
 '#debug .dp{width:min(300px,calc(100vw - 16px));margin-bottom:8px;padding:10px;border-radius:12px;background:rgba(20,10,6,.96);border:2px solid #c0392b;box-shadow:0 6px 20px rgba(0,0,0,.5)}'+
 '#debug .dh{font-size:22px;line-height:1;margin:2px 0 6px}#debug .ds{font-family:system-ui,sans-serif;font-size:13px;color:#d8c9a8;margin-bottom:8px}'+
 '#debug .dg{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}#debug .dg.three{grid-template-columns:1fr 1fr 1fr}'+
 '#debug button.db{min-height:44px;border-radius:8px;border:2px solid #6e4526;background:#4d2f1a;color:#f6ead0;font:inherit;font-size:18px;line-height:1}'+
 '#debug button.db.warn{border-color:#c0392b;background:#5a1d14}';
document.head.appendChild(css);

var NAMES={leer:'Leer',normal:'Normal',vernachlaessigt:'2 Wochen vernachlässigt',maximal:'Maximal'};
function fmt(t){var d=new Date(t),z=function(n){return ('0'+n).slice(-2);};return z(d.getDate())+'.'+z(d.getMonth()+1)+'.'+d.getFullYear()+' '+z(d.getHours())+':'+z(d.getMinutes());}
function days(ms){return Math.round(ms/OK.DAY*10)/10;}
function storeOffset(){try{localStorage.setItem('oathkeep_debug_offset',String(OK.clock.offset));}catch(e){}}
function shift(ms){OK.clock.offset+=ms;storeOffset();raids();save();render();paint();}
function setState(o){S=o;ui.room='mauer';ui.tab='burg';ui.confirm='';save();render();paint();}

function paint(){
 var h='<button class="dt" data-dbg="toggle" data-testid="debug-toggle" aria-expanded="'+open+'">'+(open?'Debug schliessen':'Debug')+'</button>';
 if(open){h='<div class="dp"><div class="dh">Debug</div>'+
  '<div class="ds" data-testid="debug-time">Spielzeit: '+fmt(OK.now())+(OK.clock.offset?' (+'+days(OK.clock.offset)+' Tage)':'')+'<br>Nächster Ansturm: '+(S.rest?'pausiert (Rast)':fmt(OK.nextRaid(S.lastRaid)))+'</div>'+
  '<div class="dh">Zeit vorspulen</div><div class="dg three">'+
   '<button class="db" data-dbg="day" data-testid="debug-time-day">+1 Tag</button>'+
   '<button class="db" data-dbg="week" data-testid="debug-time-week">+1 Woche</button>'+
   '<button class="db" data-dbg="raid" data-testid="debug-time-raid">Ansturm</button></div>'+
  '<div class="dh">Spielstand</div><div class="dg">'+OK.PRESETS.map(function(n){return '<button class="db" data-dbg="preset:'+n+'" data-testid="debug-preset-'+n+'">'+NAMES[n]+'</button>';}).join('')+'</div>'+
  '<div class="dg"><button class="db warn" data-dbg="reset" data-testid="debug-reset">Zurücksetzen</button><button class="db" data-dbg="clock" data-testid="debug-time-reset">Echte Zeit</button></div>'+
  '<div class="ds">Eigener Debug-Spielstand. Der echte Spielstand bleibt unberührt.</div></div>'+h;}
 box.innerHTML=h;}

box.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('[data-dbg]'):null;if(!b)return;var a=b.getAttribute('data-dbg');
 if(a==='toggle'){open=!open;paint();return;}
 if(a==='day'){shift(OK.DAY);return;}
 if(a==='week'){shift(7*OK.DAY);return;}
 if(a==='raid'){if(S.rest){toast('Rast aktiv: kein Ansturm');return;}shift(OK.nextRaid(S.lastRaid)-OK.now()+60000);return;}
 if(a.indexOf('preset:')===0){setState(OK.preset(a.slice(7),OK.now()));toast('Spielstand: '+NAMES[a.slice(7)]);return;}
 if(a==='reset'){OK.clock.offset=0;storeOffset();setState(OK.fresh(OK.now()));toast('Debug-Spielstand zurückgesetzt');return;}
 if(a==='clock'){OK.clock.offset=0;storeOffset();setState(S);return;}
});
document.body.appendChild(box);paint();
setInterval(function(){if(open)paint();},30000);
window.oathkeepDebug={preset:function(n){setState(OK.preset(n,OK.now()));},shift:shift};
})();
