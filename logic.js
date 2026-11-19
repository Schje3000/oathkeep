/* Oathkeep: Spielregeln als reine Funktionen.
   Jede Funktion bekommt den Spielstand (S) und die Zeit (now, Millisekunden) als Parameter.
   Keine Darstellung, kein DOM, kein localStorage. Zufall über rng (Standard Math.random).
   Im Browser als globales Objekt OK, in Node (Tests) über require('./logic.js').
   Datumsgrenzen (Tag, Woche, Sonntag 20 Uhr) gelten in der Zeitzone des Geräts. */
(function(root){
'use strict';
var OK={};
var DAY=OK.DAY=86400000;

/* ---------- Uhr: einzige Stelle, an der die echte Zeit abgefragt wird ---------- */
OK.clock={offset:0,fixed:null};
OK.now=function(){return OK.clock.fixed!==null?OK.clock.fixed:Date.now()+OK.clock.offset;};

/* ---------- Spieldaten ---------- */
var SK=OK.SK={aus:'Ausdauer',sta:'Stärke',kla:'Klang-Magie',hau:'Hauswacht',kra:'Kräuterkunde',wis:'Wissen'};
var CHORES=OK.CHORES=[{k:'kueche',n:'Burgküche schrubben',d:7},{k:'bad',n:'Waschraum scheuern',d:7},{k:'saugen',n:'Halle fegen',d:7},{k:'staub',n:'Gemächer entstauben',d:7},{k:'bett',n:'Lager frisch beziehen',d:21}];
var KIND=OK.KIND={run:{s:'aus',n:'Ausdauertraining',area:'run'},gym:{s:'sta',n:'Kampftraining',area:'gym'},piano:{s:'kla',n:'Klang-Magie',area:'piano'},water:{s:'kra',n:'Garten bewässern'},waesche:{s:'hau',n:'Gewänder waschen'},read:{s:'wis',n:'Schriften studieren'},book:{s:'wis',n:'Buch vollendet',area:'read'}};
CHORES.forEach(function(c){KIND[c.k]={s:'hau',n:c.n,area:'home'};});
OK.AREA={run:{n:'Ausdauertraining',u:'km'},gym:{n:'Kampftraining',u:'Einheiten'},piano:{n:'Klang-Magie',u:'Minuten'},home:{n:'Burgpflege',u:'Aufgaben'},read:{n:'Schriften',u:'Bücher'}};

var CAT=OK.CAT={
 burg:['Holzturm und Palisade','Wachturm und Hütten','Steinerner Bergfried','Erste Steinmauer','Steinburg mit Schmiede','Torhaus und Stadthäuser','Grosse Burg mit Markt','Königliche Festung'],
 thron:['Steinboden, Teppich und Thron','Banner','Fackeln','Säulen','Festtafel','Thronwachen','Wandteppiche und Hofdame','Goldener Thron und Barde'],
 halle:['Küchenschrank','Teppich','Wandbanner','Fackeln','Fässer und Vorräte','Rüstungsständer','Kronleuchter','Hauskatze'],
 turm:['Schwebende Kerzen','Klangkristall','Runenpult','Zauberbücher','Sternkarte','Astrolabium','Resonanzharfe','Zauberspiegel'],
 bib:['Erstes Regal','Zweites Regal','Globus','Drittes Regal','Leseteppich','Bibliotheksleiter','Viertes Regal','Eule'],
 garten:['Zweites Beet','Vogelscheuche','Drittes Beet','Gartenbank','Viertes Beet','Bienenkorb','Apfelbaum','Gartenbrunnen'],
 hof:['Marktstand','Neue Familie','Schmiede','Neue Familie','Bäckerei','Neue Familie','Stall mit Pferd','Maibaum und Fest']};
var CAT_SK=OK.CAT_SK={halle:'hau',turm:'kla',bib:'wis',garten:'kra'},CAT_P=OK.CAT_P=[30,55,85,125,170,225,290,360],CAT_RS=OK.CAT_RS=[2,3,4,5,6,7,8,9],CAT_RC=OK.CAT_RC=[2,3,5,7,9,11,13,15],
 BURG_P=OK.BURG_P=[0,100,180,280,400,550,750,1000],BURG_RC=OK.BURG_RC=[1,2,4,6,8,10,12,14];

var ITEMS=OK.ITEMS={
 kurzschwert:{n:'Kurzschwert',sl:'waffe',r:0,b:{def:2}},langschwert:{n:'Langschwert',sl:'waffe',r:0,b:{def:4}},streitaxt:{n:'Streitaxt',sl:'waffe',r:1,b:{def:6}},
 kriegshammer:{n:'Kriegshammer',sl:'waffe',r:1,b:{def:6,gold_gym:0.1}},runenklinge:{n:'Runenklinge',sl:'waffe',r:2,b:{def:9,gold_run:0.1}},drachentoeter:{n:'Drachentöter',sl:'waffe',r:2,b:{def:13}},
 leder:{n:'Lederrüstung',sl:'ruestung',r:0,b:{def:3},tier:'leder'},kette:{n:'Kettenhemd',sl:'ruestung',r:1,b:{def:6},tier:'kette'},
 platte:{n:'Plattenrüstung',sl:'ruestung',r:1,b:{def:10},tier:'platte'},gold:{n:'Goldrüstung',sl:'ruestung',r:2,b:{def:15,gold:0.05},tier:'gold'},
 klee:{n:'Kleeblatt',sl:'talisman',r:0,b:{gold:0.03}},laeufer:{n:'Läuferamulett',sl:'talisman',r:1,b:{gold_run:0.15}},noten:{n:'Notenbrosche',sl:'talisman',r:1,b:{gold_piano:0.15}},
 besen:{n:'Besenring',sl:'talisman',r:1,b:{gold_home:0.15}},kraeuter:{n:'Kräuteramulett',sl:'talisman',r:1,b:{gold_water:0.2}},lese:{n:'Leserune',sl:'talisman',r:1,b:{gold_read:0.15}},
 drachenauge:{n:'Drachenauge',sl:'talisman',r:2,b:{gold:0.1}},
 wolfsfell:{n:'Wolfsfell',sl:'trophae',r:0,b:{def:1},img:'wolfsfell'},hirschgeweih:{n:'Hirschgeweih',sl:'trophae',r:0,b:{def:1},img:'hirschgeweih'},
 orkbanner:{n:'Orkbanner',sl:'trophae',r:1,b:{def:2},img:'orkbanner'},pokal:{n:'Goldpokal',sl:'trophae',r:1,b:{def:2},img:'pokal'},
 drachenschild:{n:'Drachenschild',sl:'trophae',r:1,b:{def:2},img:'trophae'},drachenschaedel:{n:'Drachenschädel',sl:'trophae',r:2,b:{def:3},img:'drachenschaedel'},
 kristallkrone:{n:'Kristallkrone',sl:'trophae',r:2,b:{def:3},img:'kristallkrone'},
 baerenfell:{n:'Bärenfell',sl:'moebel',r:0,b:{gold_home:0.05},img:'baerenfell',room:'halle'},exoten:{n:'Exotische Pflanze',sl:'moebel',r:0,b:{gold_water:0.05},img:'exoten',room:'garten'},
 schatztruhe:{n:'Schatztruhe',sl:'moebel',r:1,b:{gold:0.03},img:'schatztruhe',room:'thron'},ritterstatue:{n:'Ritterstatue',sl:'moebel',r:1,b:{def:2},img:'ritterstatue',room:'thron'},
 kristallleuchte:{n:'Kristallleuchte',sl:'moebel',r:1,b:{gold_piano:0.05},img:'kristallleuchte',room:'turm'},
 drachenei:{n:'Drachenei',sl:'moebel',r:2,b:{def:2},img:'drachenei'},goldbrunnen:{n:'Goldener Brunnen',sl:'moebel',r:2,b:{gold:0.04},img:'goldbrunnen'},
 einhornstatue:{n:'Einhornstatue',sl:'moebel',r:1,b:{gold_read:0.05},img:'einhornstatue'},kristallbaum:{n:'Kristallbaum',sl:'moebel',r:1,b:{gold_piano:0.05},img:'kristallbaum'},loewenstatue:{n:'Löwenstatue',sl:'moebel',r:2,b:{gold:0.05},img:'loewenstatue',room:'hof'}};
var RAR=OK.RAR=['gewöhnlich','selten','episch'];

/* ---------- Einrichtung und Händler ----------
   DEKO: k = boden, wand oder decke; o = I (innen), A (aussen), B (beides); p = Preis beim Händler, 0 = nur als Beute.
   Gekaufte Stücke liegen in S.deko, Beute-Möbel in S.inv (ITEMS mit sl 'moebel'). Aufgestellt in S.place[raum] = [{id,x,y}]. */
var DEKO=OK.DEKO={standuhr:{n:'Standuhr',k:'boden',o:'I',p:120},vogelkaefig:{n:'Vogelkäfig',k:'boden',o:'I',p:90},kandelaber:{n:'Kandelaber',k:'boden',o:'I',p:50},kessel:{n:'Hexenkessel',k:'boden',o:'I',p:70},spinnrad:{n:'Spinnrad',k:'boden',o:'I',p:80},schaukelpferd:{n:'Schaukelpferd',k:'boden',o:'I',p:60},sessel:{n:'Lehnsessel',k:'boden',o:'I',p:70},holztruhe:{n:'Holztruhe',k:'boden',o:'B',p:40},topfpflanze:{n:'Topfpflanze',k:'boden',o:'B',p:30},katzenkorb:{n:'Katzenkorb',k:'boden',o:'I',p:60},alchemie:{n:'Alchemietisch',k:'boden',o:'I',p:140},sanduhr:{n:'Sanduhr',k:'boden',o:'I',p:45},buecher:{n:'Bücherstapel',k:'boden',o:'I',p:25},weinregal:{n:'Weinregal',k:'boden',o:'I',p:75},wanduhr:{n:'Kuckucksuhr',k:'wand',o:'I',p:70},spiegel:{n:'Wandspiegel',k:'wand',o:'I',p:40},landschaft:{n:'Landschaftsbild',k:'wand',o:'I',p:60},wandleuchter:{n:'Wandleuchter',k:'wand',o:'I',p:35},tapisserie:{n:'Einhorn-Teppich',k:'wand',o:'I',p:90},traenkebrett:{n:'Tränkebrett',k:'wand',o:'I',p:55},kranz:{n:'Blumenkranz',k:'wand',o:'B',p:30},kerzenkrone:{n:'Kerzenkrone',k:'decke',o:'I',p:100},haengelaterne:{n:'Hängelaterne',k:'decke',o:'B',p:45},blumenampel:{n:'Blumenampel',k:'decke',o:'B',p:35},vogeltraenke:{n:'Vogeltränke',k:'boden',o:'A',p:60},blumenkuebel:{n:'Blumenkübel',k:'boden',o:'A',p:40},wichtel:{n:'Gartenwichtel',k:'boden',o:'A',p:30},windrad:{n:'Windrad',k:'boden',o:'A',p:55},laternenpfahl:{n:'Laternenpfahl',k:'boden',o:'A',p:80},heuballen:{n:'Heuballen',k:'boden',o:'A',p:25},sonnenuhr:{n:'Sonnenuhr',k:'boden',o:'A',p:70},kuerbisse:{n:'Kürbisse',k:'boden',o:'A',p:30},huhn:{n:'Huhn',k:'boden',o:'A',p:40},feuerkorb:{n:'Feuerkorb',k:'boden',o:'A',p:60},wegweiser:{n:'Wegweiser',k:'boden',o:'A',p:35},efeu:{n:'Efeuranke',k:'wand',o:'A',p:30},vogelhaus:{n:'Vogelhaus',k:'wand',o:'A',p:35},fahne:{n:'Wappenfahne',k:'wand',o:'A',p:70},drachenei:{n:'Drachenei',k:'boden',o:'I',p:0},goldbrunnen:{n:'Goldener Brunnen',k:'boden',o:'A',p:0},einhornstatue:{n:'Einhornstatue',k:'boden',o:'B',p:0},kristallbaum:{n:'Kristallbaum',k:'boden',o:'B',p:0},baerenfell:{n:'Bärenfell',k:'wand',o:'I',p:0},exoten:{n:'Exotische Pflanze',k:'boden',o:'B',p:0},schatztruhe:{n:'Schatztruhe',k:'boden',o:'B',p:0},ritterstatue:{n:'Ritterstatue',k:'boden',o:'B',p:0},kristallleuchte:{n:'Kristallleuchte',k:'boden',o:'I',p:0},loewenstatue:{n:'Löwenstatue',k:'boden',o:'A',p:0}};
OK.ROOMOUT={garten:1,hof:1};
OK.dekoOwned=function(S){return S.deko.concat(S.inv.filter(function(id){return ITEMS[id]&&ITEMS[id].sl==='moebel'&&DEKO[id];}));};
OK.dekoFits=function(id,room){var d=DEKO[id];if(!d)return false;return d.o==='B'||(d.o==='A')===!!OK.ROOMOUT[room];};
OK.dekoWhere=function(S,id){for(var r in S.place){var L=S.place[r]||[];for(var i=0;i<L.length;i++)if(L[i].id===id)return r;}return '';};
OK.dekoStore=function(S,id){for(var r in S.place)S.place[r]=(S.place[r]||[]).filter(function(q){return q.id!==id;});};
OK.dekoPlace=function(S,room,id,x,y){if(OK.dekoOwned(S).indexOf(id)<0||!OK.dekoFits(id,room))return false;OK.dekoStore(S,id);
 (S.place[room]=S.place[room]||[]).push({id:id,x:Math.round(x),y:Math.round(y||0)});return true;};
OK.dekoMove=function(S,room,id,x,y){var L=S.place[room]||[];for(var i=0;i<L.length;i++)if(L[i].id===id){L[i].x=Math.round(x);if(y!==undefined)L[i].y=Math.round(y);return true;}return false;};
/* Wochenangebot: 6 Stücke aus dem Händlersortiment, die du noch nicht hast, neu gemischt jeden Montag. */
OK.shopOpen=function(S){return (S.up.hof||0)>=1;};
OK.shopWeek=function(now){return Math.floor((weekStart(now)+3*DAY)/(7*DAY));};
OK.shopOffer=function(S,now){var pool=Object.keys(DEKO).filter(function(id){return DEKO[id].p>0&&S.deko.indexOf(id)<0;}),w=OK.shopWeek(now),seed=w*9301+49297;
 var rnd=function(){seed=(seed*9301+49297)%233280;return seed/233280;};
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t;}return pool.slice(0,6);};
OK.buyDeko=function(S,id,now){var d=DEKO[id];if(!d||!OK.shopOpen(S)||OK.shopOffer(S,now).indexOf(id)<0||S.gold<d.p)return false;S.gold-=d.p;S.deko.push(id);return true;};

/* ---------- Ausrüster (Cosmetics) ----------
   t = cape (Umhangfarbe), metall (Metallton der Rüstung), pet (Begleiter), outfit (eigene Heldenfassung). Rein optisch, keine Boni. */
var COS=OK.COS={
 cape_blau:{n:'Blauer Umhang',t:'cape',p:80},cape_gruen:{n:'Grüner Umhang',t:'cape',p:80},cape_schwarz:{n:'Schwarzer Umhang',t:'cape',p:100},
 cape_violett:{n:'Violetter Umhang',t:'cape',p:120},cape_gold:{n:'Goldener Umhang',t:'cape',p:180},
 metall_bronze:{n:'Bronzeton',t:'metall',p:120},metall_schwarz:{n:'Schwarzstahl',t:'metall',p:150},metall_blau:{n:'Blaustahl',t:'metall',p:150},metall_rot:{n:'Rotgold',t:'metall',p:200},
 pet_hund:{n:'Hund',t:'pet',p:200},pet_katze:{n:'Katze',t:'pet',p:200},pet_fuchs:{n:'Fuchs',t:'pet',p:250},pet_rabe:{n:'Rabe',t:'pet',p:250},
 outfit_waldlaeufer:{n:'Waldläufer',t:'outfit',p:400},outfit_magier:{n:'Magier',t:'outfit',p:500}};
OK.cosOpen=function(S){return (S.up.hof||0)>=3;};
OK.buyCos=function(S,id){var c=COS[id];if(!c||!OK.cosOpen(S)||S.cos.own.indexOf(id)>=0||S.gold<c.p)return false;S.gold-=c.p;S.cos.own.push(id);S.cos[c.t]=id;return true;};
OK.setCos=function(S,t,id){if(id&&(S.cos.own.indexOf(id)<0||!COS[id]||COS[id].t!==t))return false;S.cos[t]=id||'';return true;};

/* ---------- Spielstand ---------- */
function fresh(now){var n=now;return{v:1,updatedAt:0,created:n,name:'Held',
 look:{skin:'#e0b08a',hair:'#5b3a22',armor:'#8e9aa0',cape:'none',plume:'none'},
 xp:{aus:0,sta:0,kla:0,hau:0,kra:0,wis:0},books:[],stones:5,gold:25,potions:0,buff:false,buffUntil:0,raidN:0,lvlSeen:1,wall:{lvl:1,dmg:0},up:{thron:0,halle:0,turm:0,bib:0,garten:0,hof:0},inv:[],equip:{waffe:'',ruestung:'',talisman:''},loot:[],layout:{},deko:[],place:{},cos:{own:[],cape:'',metall:'',pet:'',outfit:''},
 last:{run:n,gym:n,piano:0,water:n,kueche:n,bad:n,saugen:n,staub:n,bett:n,waesche:0,read:0,book:0},
 log:[],runGoal:50,rest:0,lastRaid:n,raidDue:0,raids:[],
 bosses:[{id:'gp',name:'Der Aarewyrm',goal:'GP von Bern',area:'run',date:'2027-05-15',target:300,dmg:0,done:false,won:false}]};}
OK.fresh=fresh;
OK.migrate=function(o,now){var d=fresh(now);if(!o||typeof o!=='object')return d;
 if(o.gold===undefined){o.gold=Math.round((o.stones||0)*5);o.raidN=(o.raids||[]).length;if(o.buff){o.buffUntil=now+DAY;o.buff=false;}o.lvlSeen=charLvlOf(o.xp||{});}
 if(!o.up&&o.xp){var ol=function(k){return Math.floor(Math.sqrt((o.xp[k]||0)/30))+1;};o.up={thron:4,halle:Math.min(3,ol('hau')-1),turm:Math.min(3,ol('kla')-1),bib:Math.min(3,Math.floor((o.books||[]).length/3)),garten:Math.min(3,ol('kra')-1),hof:0};}
 for(var k in d){if(o[k]===undefined)o[k]=d[k];}
 /* Beschädigte Felder reparieren statt abstürzen: falscher Typ wird zum Standardwert, Zahlen als Text werden Zahlen. */
 var fix=function(v,def){if(Array.isArray(def))return Array.isArray(v)?v:def;
  if(def!==null&&typeof def==='object'){if(!v||typeof v!=='object'||Array.isArray(v))return def;for(var j in def)v[j]=fix(v[j],def[j]);return v;}
  if(typeof def==='number'){var x=typeof v==='number'?v:parseFloat(v);return isFinite(x)?x:def;}
  if(typeof def==='string')return typeof v==='string'?v:def;
  if(typeof def==='boolean')return typeof v==='boolean'?v:!!v;return v;};
 for(k in d)if(k!=='bosses')o[k]=fix(o[k],d[k]);
 if(!Array.isArray(o.bosses))o.bosses=d.bosses;
 o.bosses=o.bosses.filter(function(b){return b&&typeof b==='object';});o.bosses.forEach(function(b){b.dmg=fix(b.dmg,0);b.target=fix(b.target,1);});
 o.log=o.log.filter(function(e){return e&&typeof e==='object'&&isFinite(e.t)&&KIND[e.k];});o.log.forEach(function(e){e.a=fix(e.a,1);e.x=fix(e.x,0);e.g=fix(e.g,0);});
 return o;};
/* Kürzt Verlauf und Ansturm-Liste vor dem Speichern. */
OK.trim=function(S){if(S.log.length>400)S.log=S.log.slice(-400);if(S.raids.length>12)S.raids=S.raids.slice(-12);};

/* ---------- Zeit ---------- */
function eff(S,now){return S.rest||now;}
function since(S,ts,now){return ts?(eff(S,now)-ts)/DAY:999;}
function dkey(t){var d=new Date(t);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function weekStart(t){var d=new Date(t);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime();}
/* Nächster Sonntag 20 Uhr strikt nach after. */
function nextRaid(after){var d=new Date(after);d.setHours(20,0,0,0);d.setDate(d.getDate()+((7-d.getDay())%7));if(d.getTime()<=after)d.setDate(d.getDate()+7);return d.getTime();}
/* Ansturm eine Kalenderwoche vor t (gleiche Uhrzeit, richtig über Sommer- und Winterzeit). */
function prevWeek(t){var d=new Date(t);d.setDate(d.getDate()-7);return d.getTime();}
/* Ende des Tages eines Datums JJJJ-MM-TT (Zeitlimit einer Eroberung). */
function dateEnd(s){return new Date(s+'T23:59:59').getTime();}
OK.eff=eff;OK.since=since;OK.dkey=dkey;OK.weekStart=weekStart;OK.nextRaid=nextRaid;OK.prevWeek=prevWeek;OK.dateEnd=dateEnd;

/* ---------- Stufen ---------- */
function lvl(x){return Math.floor(Math.sqrt(x/30))+1;}
function lvlProg(x){var l=lvl(x),a=30*(l-1)*(l-1),b=30*l*l;return{l:l,cur:x-a,need:b-a};}
function totalXp(xp){var s=0;for(var k in SK)s+=xp[k]||0;return s;}
function charLvlOf(xp){return Math.floor(Math.sqrt(totalXp(xp)/150))+1;}
function charProg(xp){var l=charLvlOf(xp),a=150*(l-1)*(l-1),b=150*l*l;return{l:l,cur:totalXp(xp)-a,need:b-a};}
OK.lvl=lvl;OK.lvlProg=lvlProg;OK.totalXp=totalXp;OK.charLvlOf=charLvlOf;OK.charProg=charProg;

/* ---------- Zustände ---------- */
OK.moder=function(S,now){var m=0;CHORES.forEach(function(c){if(since(S,S.last[c.k],now)>c.d)m++;});return m;};
OK.plant=function(S,now){var d=since(S,S.last.water,now);return d<3.5?0:d<6?1:d<9?2:3;};
OK.fit=function(S,now){var d=Math.min(since(S,S.last.run,now),since(S,S.last.gym,now));return d<4?0:d<7?1:2;};
OK.tower=function(S,now){var d=since(S,S.last.piano,now);return d<1.5?2:d<3.5?1:0;};
OK.happy=function(S,now){return OK.moder(S,now)===0&&OK.plant(S,now)===0&&S.wall.dmg===0;};
/* Tage bis zur Fälligkeit einer Putzaufgabe (negativ = überfällig). */
OK.choreDue=function(S,c,now){return c.d-since(S,S.last[c.k],now);};

/* ---------- Auswertungen ---------- */
OK.inWeek=function(S,k,now){var w=weekStart(now);return S.log.filter(function(e){return e.t>=w&&(k.indexOf(e.k)>=0);});};
/* Tage dieser Woche mit mindestens 15 Minuten Klang-Magie. */
OK.pianoDays=function(S,now){var o={},n=0,k;OK.inWeek(S,['piano'],now).forEach(function(e){k=dkey(e.t);o[k]=(o[k]||0)+e.a;});for(k in o)if(o[k]>=15)n++;return n;};
OK.monthKm=function(S,now){var d=new Date(now);return S.log.reduce(function(s,e){var x=new Date(e.t);return s+(e.k==='run'&&x.getMonth()===d.getMonth()&&x.getFullYear()===d.getFullYear()?e.a:0);},0);};
OK.todayXp=function(S,s,now){var k=dkey(now);return S.log.reduce(function(a,e){return a+(e.s===s&&dkey(e.t)===k?e.x:0);},0);};
/* Ruhm von heute aus bestimmten Routinen (Leselimit ohne Buch vollendet). */
OK.todayXpOf=function(S,kinds,now){var k=dkey(now);return S.log.reduce(function(a,e){return a+(kinds.indexOf(e.k)>=0&&dkey(e.t)===k?e.x:0);},0);};
/* Wurde die Routine heute schon eingetragen? */
OK.doneToday=function(S,k,now){var d=dkey(now);return S.log.some(function(e){return e.k===k&&dkey(e.t)===d;});};

/* ---------- Gold, Ausrüstung, Tränke ---------- */
function own(S,id){return S.inv.indexOf(id)>=0;}
function eqBonus(S,k){var s=0;['waffe','ruestung','talisman'].forEach(function(sl){var id=S.equip[sl];if(id&&ITEMS[id]&&ITEMS[id].b[k])s+=ITEMS[id].b[k];});
 S.inv.forEach(function(id){var it=ITEMS[id];if(it&&(it.sl==='trophae'||it.sl==='moebel'))s+=it.b[k]||0;});return s;}
OK.own=own;OK.eqBonus=eqBonus;
OK.buffOn=function(S,now){return S.buffUntil>now;};
/* Goldbereich einer Routine für Boni (Putzaufgaben und Wäsche zählen als Burgpflege, Buch als Schriften). */
OK.goldCat=function(k){return {run:'run',gym:'gym',piano:'piano',water:'water',read:'read',book:'read'}[k]||'home';};
OK.goldMul=function(S,k,now){return (OK.buffOn(S,now)?1.5:1)*(1+eqBonus(S,'gold_'+OK.goldCat(k))+eqBonus(S,'gold'));};
OK.potPrice=function(S){return Math.max(15,40-3*(lvl(S.xp.kra)-1));};
OK.buyPotion=function(S){var pp=OK.potPrice(S);if(S.gold>=pp&&S.potions<9){S.gold-=pp;S.potions++;return pp;}return 0;};
OK.drinkPotion=function(S,now){if(S.potions>0&&!OK.buffOn(S,now)){S.potions--;S.buffUntil=now+DAY;return true;}return false;};
OK.equip=function(S,sl,id){if(own(S,id)&&ITEMS[id]&&ITEMS[id].sl===sl){S.equip[sl]=id;return true;}return false;};
OK.heroTier=function(S){var id=S.equip.ruestung;return id&&ITEMS[id]&&ITEMS[id].tier||'tunika';};

/* ---------- Einträge ---------- */
/* Trägt eine Routine ein. Ergebnis {ok, err, k, x (Ruhm), g (Gold), before, after (Fertigkeitsstufe)}.
   err: 'rest' (Rast aktiv), 'km', 'min' (ungültige Menge), 'today' (heute schon eingetragen).
   Kampftraining, Bewässern und jede Putzaufgabe zählen einmal pro Tag. */
OK.ONCE=['gym','water'].concat(CHORES.map(function(c){return c.k;}));
OK.logEntry=function(S,k,a,now,title){
 if(S.rest)return{ok:false,err:'rest'};
 var K=KIND[k];if(!K)return{ok:false,err:'kind'};
 a=typeof a==='number'?a:parseFloat(a);
 if(OK.ONCE.indexOf(k)>=0&&OK.doneToday(S,k,now))return{ok:false,err:'today'};
 var td=OK.todayXp(S,K.s,now),x=0;
 if(k==='run'){if(!(a>0)||a>100)return{ok:false,err:'km'};x=Math.min(Math.round(a*12),Math.max(0,200-td));}
 else if(k==='gym'){a=1;x=td>=50?0:50;}
 else if(k==='piano'){if(!(a>0)||a>600)return{ok:false,err:'min'};x=Math.min(Math.round(a*2),Math.max(0,80-td));}
 else if(k==='water'){a=1;x=td>=25?0:25;}
 else if(k==='waesche'){a=1;x=Math.min(15,Math.max(0,150-td));}
 else if(k==='read'){if(!(a>0)||a>600)return{ok:false,err:'min'};x=Math.min(Math.round(a),Math.max(0,60-OK.todayXpOf(S,['read'],now)));}
 else if(k==='book'){a=1;x=80;}
 else{a=1;x=Math.min(30,Math.max(0,150-td));}
 var g=Math.round(x/5*OK.goldMul(S,k,now)),before=lvl(S.xp[K.s]),hits=[];
 S.xp[K.s]+=x;S.gold+=g;
 if(K.area)S.bosses.forEach(function(b){if(!b.done&&b.area===K.area&&dkey(now)<=b.date){b.dmg+=a;hits.push(b.id);}});
 S.log.push({t:now,k:k,a:a,s:K.s,x:x,g:g,st:0,pl:S.last[k],b:hits,bf:0,po:0});S.last[k]=now;
 if(k==='book')S.books.push({t:now,n:String(title||'').slice(0,60)});
 return{ok:true,k:k,x:x,g:g,before:before,after:lvl(S.xp[K.s])};};
/* Nimmt den Eintrag mit Zeitstempel t zurück. */
OK.undoEntry=function(S,t){var i,e=null;for(i=S.log.length-1;i>=0;i--){if(S.log[i].t===t){e=S.log[i];break;}}if(!e)return false;
 S.log.splice(i,1);S.xp[e.s]=Math.max(0,S.xp[e.s]-e.x);S.gold=Math.max(0,S.gold-(e.g!==undefined?e.g:(e.st||0)*5));if(e.po)S.potions=Math.max(0,S.potions-1);
 /* War es der neueste Eintrag dieser Routine, gilt wieder der vorherige (auch wenn eine Rast S.last verschoben hat). */
 var newest=!S.log.some(function(o){return o.k===e.k&&o.t>e.t;});
 if(newest){var lt=0;S.log.forEach(function(o){if(o.k===e.k&&o.t>lt)lt=o.t;});S.last[e.k]=lt||e.pl||0;}
 if(e.k==='book'){for(i=S.books.length-1;i>=0;i--){if(S.books[i].t===e.t){S.books.splice(i,1);break;}}}
 (e.b||[]).forEach(function(id){S.bosses.forEach(function(b){if(b.id===id)b.dmg=Math.max(0,b.dmg-e.a);});});
 return true;};
/* Nimmt den letzten Eintrag zurück, nur wenn er von heute ist. */
OK.undoLast=function(S,now){var e=S.log[S.log.length-1];if(!e||dkey(e.t)!==dkey(now))return false;return OK.undoEntry(S,e.t);};

/* ---------- Rast ---------- */
/* Beginnt oder beendet die Rast. Beim Beenden werden alle Zeitpunkte um die Rastdauer verschoben. Ergebnis: true = Rast läuft jetzt. */
/* Der Ansturm ist eingefroren: Die Restzeit bis zum nächsten Ansturm bleibt erhalten (raidDue). Sonntage während der Rast entfallen. */
OK.toggleRest=function(S,now){if(!S.rest){S.rest=now;return true;}var dur=now-S.rest,due=OK.raidDue(S);for(var k in S.last){if(S.last[k])S.last[k]+=dur;}
 S.raidDue=due+dur;while(nextRaid(S.lastRaid)<=now)S.lastRaid=nextRaid(S.lastRaid);S.rest=0;return false;};
/* Zeitpunkt des nächsten Ansturms: Sonntag 20 Uhr, nach einer Rast der verschobene Termin. */
OK.raidDue=function(S){return S.raidDue>S.lastRaid?S.raidDue:nextRaid(S.lastRaid);};

/* ---------- Mauer und Ausbau ---------- */
OK.repairWall=function(S){if(S.wall.dmg>0&&S.gold>=15){S.gold-=15;S.wall.dmg--;return true;}return false;};
OK.upLvl=function(S,r){return r==='burg'?S.wall.lvl-1:(S.up[r]||0);};
OK.upNext=function(S,r){var i=OK.upLvl(S,r);if(r==='burg')return i>=7?null:{i:i+1,n:CAT.burg[i+1],p:BURG_P[i+1],req:BURG_RC[i+1],sk:null};
 return i>=8?null:{i:i+1,n:CAT[r][i],p:CAT_P[i],req:CAT_SK[r]?CAT_RS[i]:CAT_RC[i],sk:CAT_SK[r]||null,bq:i+1>=6?7:i+1>=3?4:1};};
OK.upHave=function(S,n){return n.sk?lvl(S.xp[n.sk]):charLvlOf(S.xp);};
/* Raumausbauten 3 bis 5 (Stein) brauchen Burgstufe 4, 6 bis 8 (Prunk) Burgstufe 7 (bq). */
OK.upOk=function(S,r){var n=OK.upNext(S,r);return !!n&&OK.upHave(S,n)>=n.req&&S.gold>=n.p&&(r!=='burg'||S.wall.dmg===0)&&(!n.bq||S.wall.lvl>=n.bq);};
/* Kauft den nächsten Ausbau. Ergebnis: der gekaufte Ausbau oder null. */
OK.upBuy=function(S,r){var n=OK.upNext(S,r);if(!OK.upOk(S,r))return null;S.gold-=n.p;if(r==='burg')S.wall.lvl++;else S.up[r]=(S.up[r]||0)+1;return n;};

/* ---------- Beute ---------- */
OK.lootRoll=function(S,src,now,rng){rng=rng||Math.random;var got=[],gold=0,pick=function(rar,slots){var c=Object.keys(ITEMS).filter(function(id){return ITEMS[id].r===rar&&!own(S,id)&&(!slots||slots.indexOf(ITEMS[id].sl)>=0);});
  if(!c.length){gold+=[20,50,120][rar];return;}var id=c[Math.floor(rng()*c.length)];S.inv.push(id);got.push(id);
  var sl=ITEMS[id].sl;if((sl==='waffe'||sl==='ruestung'||sl==='talisman')&&!S.equip[sl])S.equip[sl]=id;};
 var r=rng();
 if(src==='raid'){if(r<0.35)pick(r<0.0175?2:r<0.105?1:0);}
 /* Eroberung: ein Ausrüstungs- oder Möbelstück (selten oder episch) und eine Trophäe. */
 else{pick(rng()<0.4?2:1,['waffe','ruestung','talisman','moebel']);pick(rng()<0.3?2:rng()<0.6?1:0,['trophae']);}
 S.gold+=gold;var e={t:now,src:src,items:got,gold:gold};S.loot.push(e);if(S.loot.length>20)S.loot=S.loot.slice(-20);
 return e;};
OK.lootText=function(e){return e.items.map(function(id){return ITEMS[id].n+' ('+RAR[ITEMS[id].r]+')';}).concat(e.gold?[e.gold+' Gold']:[]).join(', ');};

/* ---------- Ansturm der Horde ---------- */
OK.raidAtk=function(S){return Math.min(150,40+2*S.raidN);};
/* Bereitschaft für den nächsten Ansturm. */
/* Zählt die Einträge mit Ruhm in der Woche vor dem Ansturm nr. */
OK.raidEntries=function(S,nr){var p=prevWeek(nr);return S.log.filter(function(e){return e.t>p&&e.t<=nr&&e.x>0;}).length;};
OK.defNow=function(S,now){var nr=OK.raidDue(S),n=OK.raidEntries(S,nr),m=OK.moder(S,now),eq=eqBonus(S,'def');
 return{nr:nr,n:n,m:m,eq:eq,def:S.wall.lvl*10+n*4-m*5-S.wall.dmg*5+eq,atk:OK.raidAtk(S)};};
/* Rechnet alle fälligen Anstürme bis now nach (höchstens 8). Ergebnis {n, last}: Anzahl und letzter Ansturm. */
OK.resolveRaids=function(S,now,rng){var res={n:0,last:null};if(S.rest)return res;var nr=OK.raidDue(S);
 while(nr<=now&&res.n<8){var c=OK.raidEntries(S,nr);S.raidDue=0;
  var def=S.wall.lvl*10+c*4-OK.moder(S,now)*5-S.wall.dmg*5+eqBonus(S,'def'),atk=OK.raidAtk(S),win=def>=atk,r={t:nr,win:win,def:def,atk:atk};S.raidN++;
  if(win){S.gold+=20;r.loot=OK.lootRoll(S,'raid',now,rng);}else{S.wall.dmg=Math.min(5,S.wall.dmg+1);}
  S.raids.push({t:nr,win:win,def:def,atk:atk});S.lastRaid=nr;nr=nextRaid(nr);res.n++;res.last=r;}
 if(nr<=now)S.lastRaid=now;
 return res;};

/* ---------- Eroberungen ---------- */
OK.addBoss=function(S,b,now){if(!b.name||!b.date||!(b.target>0))return null;var o={id:'b'+now,name:b.name,goal:b.goal||'',area:b.area,date:b.date,target:b.target,dmg:0,done:false,won:false,start:now};S.bosses.push(o);return o;};
/* Abschliessen ist ab dem Tag des Zeitlimits erlaubt. */
OK.bossReady=function(b,now){return dkey(now)>=b.date;};
/* Titel Eroberer: mindestens eine Eroberung gewonnen. */
OK.bossWon=function(S){return S.bosses.some(function(b){return b.done&&b.won;});};
/* Schliesst eine Eroberung ab. Ergebnis {won, loot} oder null. */
OK.finishBoss=function(S,id,now,rng){var res=null;S.bosses.forEach(function(b){if(b.id===id&&!b.done&&OK.bossReady(b,now)){b.done=true;b.won=b.dmg>=b.target;res={won:b.won,boss:b,loot:null};if(b.won){S.gold+=150;res.loot=OK.lootRoll(S,'boss',now,rng);}}});return res;};

/* ---------- Spielstand-Vorlagen (Debug-Panel und Tests) ---------- */
/* Fester Zufall, damit Vorlagen immer gleich aussehen. */
OK.seededRng=function(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};};
/* Spielt days Tage typischen Alltag nach, beginnend bei start. */
function simulate(S,start,days,rng){var d,t,day;
 for(d=0;d<days;d++){t=start+d*DAY;day=new Date(t).getDay();
  OK.resolveRaids(S,t+8*3600000,rng);
  if(day===1||day===4)OK.logEntry(S,'run',6,t+7*3600000);
  if(day===2||day===6)OK.logEntry(S,'gym',1,t+18*3600000);
  if(day!==0&&day!==3)OK.logEntry(S,'piano',20,t+19*3600000);
  if(d%3===0)OK.logEntry(S,'water',1,t+9*3600000);
  CHORES.forEach(function(c,i){if((d+i)%(c.d-1)===0)OK.logEntry(S,c.k,1,t+10*3600000+i*60000);});
  OK.logEntry(S,'read',20,t+21*3600000);
  if(d%10===9)OK.logEntry(S,'book',1,t+21*3600000+60000,'Buch '+(d+1));}}
function dayStart(t){var d=new Date(t);d.setHours(0,0,0,0);return d.getTime();}
OK.PRESETS=['leer','normal','vernachlaessigt','maximal'];
OK.preset=function(name,now){var rng=OK.seededRng(7),S,st;
 if(name==='leer')return fresh(now);
 if(name==='normal'||name==='vernachlaessigt'){
  var end=name==='normal'?now:now-14*DAY;st=dayStart(end)-28*DAY;S=fresh(st);
  simulate(S,st,name==='normal'?28:29,rng);
  S.wall.lvl=3;S.up={thron:2,halle:2,turm:2,bib:1,garten:2,hof:2};
  if(name==='normal'){OK.logEntry(S,'water',1,now-3600000);OK.resolveRaids(S,now,rng);}
  else OK.resolveRaids(S,now,rng);
  S.lvlSeen=charLvlOf(S.xp);return S;}
 if(name==='maximal'){S=fresh(now-365*DAY);
  S.xp={aus:12000,sta:9000,kla:8000,hau:9000,kra:6000,wis:7000};
  S.wall={lvl:8,dmg:0};S.up={thron:8,halle:8,turm:8,bib:8,garten:8,hof:8};
  S.inv=Object.keys(ITEMS);S.equip={waffe:'drachentoeter',ruestung:'gold',talisman:'drachenauge'};
  S.gold=5000;S.potions=9;S.raidN=52;S.lastRaid=nextRaid(now-7*DAY);if(S.lastRaid>now)S.lastRaid-=7*DAY;
  for(var i=0;i<24;i++)S.books.push({t:now-(24-i)*10*DAY,n:'Buch '+(i+1)});
  S.bosses[0].dmg=320;S.bosses[0].done=true;S.bosses[0].won=true;
  S.bosses.push({id:'b2',name:'Die Nebelfeste',goal:'Zürich Marathon',area:'run',date:'2027-04-18',target:200,dmg:120,done:false,won:false,start:now-60*DAY});
  for(var k in S.last)S.last[k]=now-3600000;
  S.log=[{t:now-3600000,k:'run',a:8,s:'aus',x:96,g:19,st:0,pl:now-2*DAY,b:[],bf:0,po:0}];
  S.lvlSeen=charLvlOf(S.xp);return S;}
 return fresh(now);};

if(typeof module!=='undefined'&&module.exports)module.exports=OK;else root.OK=OK;
})(this);
