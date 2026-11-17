/* Welt aus PixelLab-Grafiken: Räume, Burg, Karte, Held. Quelle für den Block in index.html (zwischen den Markierungen WELT-START und WELT-ENDE). */
var TH_WANG={'0000':[64,32],'0001':[96,32],'0010':[64,64],'0011':[32,64],'0100':[64,0],'0101':[96,64],'0110':[0,32],'0111':[96,96],'1000':[32,32],'1001':[64,96],'1010':[32,0],'1011':[0,64],'1100':[96,0],'1101':[0,0],'1110':[32,96],'1111':[0,96]};
var HC=92,W={img:{},bad:{},st:{},tone:{},hero:null,hroom:'',ty:0,oy:0,fy:0};
function wImg(n){var im=W.img[n];if(!im){im=new Image();im.onload=function(){rc.sig='';};im.onerror=function(){W.bad[n]=1;};im.src=(n.indexOf('held_')===0?'assets/held/'+n.slice(5):'assets/raum/'+n)+'.png?v=3';W.img[n]=im;}return im;}
function wReady(l){for(var i=0;i<l.length;i++){var im=wImg(l[i]);if(W.bad[l[i]]||!im.complete||!im.naturalWidth)return false;}return true;}
function hudB(){var b=0;try{var a=document.getElementById('app').getBoundingClientRect(),k=document.getElementById('hud').children,i,r;for(i=0;i<k.length;i++){r=k[i].getBoundingClientRect();if(r.height)b=Math.max(b,r.bottom-a.top);}if(a.width)b=b*360/a.width;}catch(e){}return Math.round(b);}
function visB(H){var v=H*0.6;try{var sh=document.getElementById('sheet'),a=document.getElementById('app');if(a.offsetHeight)v=H-Math.min(0.6,sh.offsetHeight/a.offsetHeight)*H;}catch(e){}return v;}
function vibe(){var l=S.wall.lvl;return l<=3?0:l<=6?1:2;}

/* Bausteine */
function wWall(x,FY,n,tint){var w=wImg(n),wh=w.height,k,top=FY-wh;for(k=top;k>-wh;k-=wh)x.drawImage(w,0,0,360,wh-8,0,k-wh+8,360,wh-8);
 if(top>0){var g=x.createLinearGradient(0,0,0,top);g.addColorStop(0,'rgba(23,17,12,.92)');g.addColorStop(1,'rgba(23,17,12,.3)');x.fillStyle=g;x.fillRect(0,0,360,top);}
 x.drawImage(w,0,top);if(tint){x.fillStyle=tint;x.fillRect(0,0,360,FY);}}
function wSky(x,FY,n){var b=wImg(n),g=x.createLinearGradient(0,0,0,Math.max(1,FY-100));g.addColorStop(0,'#3f72a2');g.addColorStop(1,'#86b6d4');x.fillStyle=g;x.fillRect(0,0,360,FY);
 var R=pen(x);cloud(R,70,Math.max(30,FY-150),0.8);cloud(R,250,Math.max(20,FY-175),0.6);x.drawImage(b,0,FY-b.height+6);}
function wFloor(x,n,FY,H,fn,inv){var im=wImg(n),X0=-28,i,j,rows=Math.ceil((H-FY)/32)+1,b=function(v){return v?(inv?'0':'1'):(inv?'1':'0');};
 for(j=0;j<rows;j++)for(i=0;i<13;i++){var s=TH_WANG[b(fn(i,j))+b(fn(i+1,j))+b(fn(i,j+1))+b(fn(i+1,j+1))];x.drawImage(im,s[0],s[1],32,32,X0+i*32,FY+j*32,32,32);}}
function wShade(x,FY,H,a){var vg=x.createRadialGradient(180,FY+20,40,180,FY+60,300);vg.addColorStop(0,'rgba(255,200,120,.08)');vg.addColorStop(0.45,'rgba(20,12,6,0)');vg.addColorStop(1,'rgba(20,12,6,'+a+')');x.fillStyle=vg;x.fillRect(0,FY,360,H-FY);
 x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,FY,360,3);}
var WO=null;
function wPut(x,n,cx,by,fl){var im=typeof n==='string'?wImg(n):n;if(fl){x.save();x.translate(cx,0);x.scale(-1,1);x.drawImage(im,-Math.round(im.width/2),by-im.height);x.restore();}else x.drawImage(im,Math.round(cx-im.width/2),by-im.height);
 if(WO&&by>W.fy+8)WO.push([im,cx,by,fl]);}
function wTone(n,key,f){var id=n+'|'+key;if(W.tone[id])return W.tone[id];var im=wImg(n),cv=mk(im.width,im.height),x=cv.getContext('2d');x.drawImage(im,0,0);
 try{var d=x.getImageData(0,0,cv.width,cv.height),p=d.data,i,o;for(i=0;i<p.length;i+=4){if(!p[i+3])continue;o=f(p[i],p[i+1],p[i+2]);p[i]=o[0];p[i+1]=o[1];p[i+2]=o[2];}x.putImageData(d,0,0);}catch(e){}
 W.tone[id]=cv;return cv;}
function wGlow(c,cx,cy,r,col){var g=c.createRadialGradient(cx,cy,1,cx,cy,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(cx-r,cy-r,r*2,r*2);}
function wModer(x,FY,H,m){if(!m)return;var R=pen(x),i,X,Y,mc;
 for(i=0;i<m*8;i++){X=10+rnd(i+500)*340;Y=FY-90+rnd(i+600)*86;mc=['#4d5a2c','#5a4a6a','#3b4424'][i%3];disc(R,X,Y,2+(i%3),mc);R(X-3,Y-1,1,1,'#6b7a3a');R(X,Y+3,1,4+(i%4),mc);}
 for(i=0;i<m*6;i++){X=14+rnd(i+700)*330;Y=FY+10+rnd(i+800)*(H-FY-20);mc=['#4d5a2c','#5a4a6a'][i%2];R(X-5,Y,11,2,mc);R(X-3,Y-1,7,1,mc);R(X-1,Y,4,1,'#6b7a3a');}
 x.save();x.translate(0,FY-104);cobweb(R,0,0,1);if(m>=2)cobweb(R,359,0,-1);x.restore();
 x.fillStyle='rgba(30,40,15,'+(m*0.05)+')';x.fillRect(0,0,360,H);}
function wTorch(c,cx,cy,t,q){wGlow(c,cx,cy,24+((t+q*3)%6<3?0:3),'rgba(255,190,90,.32)');}
function own(id){return S.inv.indexOf(id)>=0;}

/* Ausbaukatalog */
var CAT={
 burg:['Holzturm und Palisade','Wachturm und Hütten','Steinerner Bergfried','Erste Steinmauer','Steinburg mit Schmiede','Torhaus und Stadthäuser','Grosse Burg mit Markt','Königliche Festung'],
 thron:['Steinboden, Teppich und Thron','Banner','Fackeln','Säulen','Festtafel','Thronwachen','Wandteppiche und Hofdame','Goldener Thron und Barde'],
 halle:['Küchenschrank','Teppich','Wandbanner','Fackeln','Fässer und Vorräte','Rüstungsständer','Kronleuchter','Hauskatze'],
 turm:['Kerzenleuchter','Kristallkugel','Notenpult','Bücherregal','Sternkarte','Teleskop','Harfe','Zauberspiegel'],
 bib:['Erstes Regal','Zweites Regal','Globus','Drittes Regal','Leseteppich','Bibliotheksleiter','Viertes Regal','Eule'],
 garten:['Zweites Beet','Vogelscheuche','Drittes Beet','Gartenbank','Viertes Beet','Bienenkorb','Apfelbaum','Gartenteich'],
 hof:['Marktstand','Neue Familie','Schmiede','Neue Familie','Bäckerei','Neue Familie','Stall mit Pferd','Maibaum und Fest']};
var CAT_SK={halle:'hau',turm:'kla',bib:'wis',garten:'kra'},CAT_P=[30,55,85,125,170,225,290,360],CAT_RS=[2,3,4,5,6,7,8,9],CAT_RC=[2,3,5,7,9,11,13,15],
 BURG_P=[0,100,180,280,400,550,750,1000],BURG_RC=[1,2,4,6,8,10,12,14];
function upLvl(r){return r==='burg'?S.wall.lvl-1:(S.up[r]||0);}
function upNext(r){var i=upLvl(r);if(r==='burg')return i>=7?null:{i:i+1,n:CAT.burg[i+1],p:BURG_P[i+1],req:BURG_RC[i+1],sk:null};
 return i>=8?null:{i:i+1,n:CAT[r][i],p:CAT_P[i],req:CAT_SK[r]?CAT_RS[i]:CAT_RC[i],sk:CAT_SK[r]||null};}
function upHave(n){return n.sk?lvl(S.xp[n.sk]):charLvl();}
function upOk(r){var n=upNext(r);return !!n&&upHave(n)>=n.req&&S.gold>=n.p&&(r!=='burg'||S.wall.dmg===0);}
function upBuy(r){var n=upNext(r);if(!upOk(r))return;S.gold-=n.p;if(r==='burg')S.wall.lvl++;else S.up[r]=(S.up[r]||0)+1;save();render();toast(n.n+' gebaut: -'+n.p+' Gold');}
function vBuild(r){var n=upNext(r),i=upLvl(r),max=r==='burg'?7:8,h='<div class="card"><div class="row">'+UI('hammer')+'<div class="grow"><div class="t">'+(r==='burg'?'Burg: '+CAT.burg[i]:'Ausbau '+i+' von 8')+'</div>';
 if(!n)return h+'<div class="s">Vollständig ausgebaut.</div></div></div>'+bar(1,1)+'</div>';
 var have=upHave(n),skOk=have>=n.req,gOk=S.gold>=n.p,dmg=r==='burg'&&S.wall.dmg>0;
 h+='<div class="s">Als Nächstes: <b>'+n.n+'</b>. Braucht '+(n.sk?SK[n.sk]:'Charakterstufe')+' '+n.req+' <span class="'+(skOk?'ok':'warn')+'">(du: '+have+')</span>, kostet '+n.p+' Gold <span class="'+(gOk?'ok':'warn')+'">(du: '+S.gold+')</span>.'+(dmg?' <span class="warn">Erst die Mauer reparieren.</span>':'')+'</div></div></div>'+
  bar(r==='burg'?i:i,max)+'<button class="b pri" data-act="build:'+r+'" '+(upOk(r)?'':'disabled')+'>Bauen für '+n.p+' Gold</button>';
 var nx=r==='burg'?CAT.burg.slice(i+2,i+4):CAT[r].slice(i+1,i+3);if(nx.length)h+='<div class="s">Danach: '+nx.join(', ')+'</div>';
 return h+'</div>';}

/* Beute */
var ITEMS={
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
 baerenfell:{n:'Bärenfell',sl:'moebel',r:0,b:{},img:'baerenfell',room:'halle'},exoten:{n:'Exotische Pflanze',sl:'moebel',r:0,b:{},img:'exoten',room:'garten'},
 schatztruhe:{n:'Schatztruhe',sl:'moebel',r:1,b:{},img:'schatztruhe',room:'thron'},ritterstatue:{n:'Ritterstatue',sl:'moebel',r:1,b:{},img:'ritterstatue',room:'thron'},
 kristallleuchte:{n:'Kristallleuchte',sl:'moebel',r:1,b:{},img:'kristallleuchte',room:'turm'},loewenstatue:{n:'Löwenstatue',sl:'moebel',r:2,b:{},img:'loewenstatue',room:'hof'}};
var RAR=['gewöhnlich','selten','episch'],RARC=['#cfc8b0','#7fb8ff','#d79bff'],SLOTN={waffe:'Waffe',ruestung:'Rüstung',talisman:'Talisman',trophae:'Trophäe',moebel:'Einrichtung'},
 ROOMN={halle:'Innenraum',garten:'Burggarten',thron:'Thronsaal',turm:'Zauberturm',hof:'Innenhof'};
function itemIcon(id){var it=ITEMS[id];return it.img||('i_'+id);}
function eqBonus(k){var s=0;['waffe','ruestung','talisman'].forEach(function(sl){var id=S.equip[sl];if(id&&ITEMS[id]&&ITEMS[id].b[k])s+=ITEMS[id].b[k];});
 if(k==='def')S.inv.forEach(function(id){var it=ITEMS[id];if(it&&it.sl==='trophae')s+=it.b.def||0;});return s;}
function bonusText(b){var o=[],k,N={def:'Verteidigung',gold:'Gold aus allem',gold_run:'Gold aus Läufen',gold_gym:'Gold aus Kampftraining',gold_piano:'Gold aus Piano',gold_home:'Gold aus Haushalt',gold_water:'Gold aus Giessen',gold_read:'Gold aus Lesen'};
 for(k in b)o.push(k==='def'?'+'+b[k]+' '+N[k]:'+'+Math.round(b[k]*100)+' % '+N[k]);return o.join(', ')||'Schmuck für '+'den Raum';}
function lootRoll(src){var got=[],gold=0,pick=function(rar,slots){var c=Object.keys(ITEMS).filter(function(id){return ITEMS[id].r===rar&&!own(id)&&(!slots||slots.indexOf(ITEMS[id].sl)>=0);});
  if(!c.length){gold+=[20,50,120][rar];return;}var id=c[Math.floor(Math.random()*c.length)];S.inv.push(id);got.push(id);
  var sl=ITEMS[id].sl;if((sl==='waffe'||sl==='ruestung'||sl==='talisman')&&!S.equip[sl])S.equip[sl]=id;};
 var r=Math.random();
 if(src==='raid'){if(r<0.35)pick(r<0.0175?2:r<0.105?1:0);}
 else{pick(Math.random()<0.4?2:1,['waffe','ruestung','talisman','moebel']);pick(Math.random()<0.3?2:Math.random()<0.6?1:0,['trophae']);}
 S.gold+=gold;var e={t:Date.now(),src:src,items:got,gold:gold};S.loot.push(e);if(S.loot.length>20)S.loot=S.loot.slice(-20);
 return e;}
function lootText(e){return e.items.map(function(id){return ITEMS[id].n+' ('+RAR[ITEMS[id].r]+')';}).concat(e.gold?[e.gold+' Gold']:[]).join(', ');}
function heroTier(){var id=S.equip.ruestung;return id&&ITEMS[id]&&ITEMS[id].tier||'tunika';}

/* Held: läuft in allen Räumen */
function heroSheet(){var t=heroTier(),im=wImg('held_'+t);if(W.bad['held_'+t]||!im.naturalWidth)im=wImg('held_platte');return im;}
function heroStep(room,FY,H){var h=W.hero,y0=FY+50,y1=Math.max(y0+20,Math.min(visB(H)-6,FY+230)),f=fit();
 if(!h||W.hroom!==room){W.hroom=room;h=W.hero={x:180,y:Math.min(y1,y0+60),tx:180,ty:y0+60,dir:'s',walk:false,wait:10,fr:0};}
 h.y=Math.max(y0,Math.min(y1,h.y));if(S.rest){h.walk=false;h.dir='s';return h;}
 var sp=[2.2,1.3,0.8][f];
 if(h.walk){var dx=h.tx-h.x,dy=h.ty-h.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<=sp){h.x=h.tx;h.y=h.ty;h.walk=false;h.wait=[14,24,36][f]+Math.floor(Math.random()*[30,40,50][f]);if(Math.random()<0.4)h.dir='s';}
  else{h.x+=dx/d*sp;h.y+=dy/d*sp;h.dir=Math.abs(dx)>Math.abs(dy)*1.1?(dx>0?'e':'w'):(dy>0?'s':'n');h.fr++;}}
 else if(--h.wait<=0){var mx=[150,110,70][f];h.tx=Math.max(40,Math.min(320,h.x+(Math.random()*2-1)*mx));h.ty=y0+Math.random()*(y1-y0);
  if(Math.abs(h.tx-h.x)+Math.abs(h.ty-h.y)>12){h.walk=true;h.fr=0;}else h.wait=10;}
 return h;}
function heroPaint(c,h,f){var sh=heroSheet(),row=f*4,col,flip=false;
 if(h.walk){row+=h.dir==='s'?1:h.dir==='n'?2:3;flip=h.dir==='w';col=h.fr%8;}else col={s:0,e:2,n:4,w:6}[h.dir];
 var hx=Math.round(h.x),hy=Math.round(h.y);c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(hx,hy-1,15,4,0,0,7);c.fill();
 c.save();c.translate(hx,0);if(flip)c.scale(-1,1);c.drawImage(sh,col*HC,row*HC,HC,HC,-46,hy-77,HC,HC);c.restore();}

/* Räume */
function base(x,FY,H,floor,fn,inv,tint){var v=vibe();wWall(x,FY,['holzwand','wand','prunkwand'][v],tint);wFloor(x,floor,FY,H,fn||function(){return false;},inv);wShade(x,FY,H,.5);}
function inFloor(){return ['holz','holz','marmor'][vibe()];}
var ROOMS2={
thron:{fy:150,f:function(){return ['lehm','stein','marmor','holzwand','wand','prunkwand','einfachthron','thron','goldthron','banner','wandteppich','fackel','saeule','tafel','wache','hoefling','barde','held_platte','held_'+heroTier()].concat(S.inv.filter(function(id){return ITEMS[id]&&ITEMS[id].img;}).map(itemIcon));},
 sig:function(){return S.up.thron+'|'+S.inv.join(',');},
 st:function(x,FY,H){var u=S.up.thron,v=vibe(),fl=u<1&&v===0?'lehm':v===2?'marmor':'stein',car=function(vx,vy){var px=-28+vx*32;return u>=1&&vy>=1&&px>=148&&px<=212;};
  wWall(x,FY,['holzwand','wand','prunkwand'][v]);wFloor(x,fl,FY,H,car,fl==='stein');wShade(x,FY,H,.55);
  var tr=S.inv.filter(function(id){return ITEMS[id]&&ITEMS[id].sl==='trophae';});
  [[132,FY-90],[228,FY-90],[84,FY-100],[276,FY-100]].forEach(function(q,i){var id=tr.filter(function(t){return t!=='pokal'&&t!=='kristallkrone'&&t!=='orkbanner'&&t!=='drachenschaedel';})[i];if(id)wPut(x,itemIcon(id),q[0],q[1]);});
  if(u>=2)(u>=7?['wandteppich','wandteppich']:['banner','banner']).forEach(function(n,i){wPut(x,n,i?276:84,FY+(u>=7?-12:4));});
  if(u>=3){wPut(x,'fackel',132,FY-36);wPut(x,'fackel',228,FY-36);}
  if(own('drachenschaedel')&&u>=1)wPut(x,'drachenschaedel',180,FY-64);
  if(u>=4){wPut(x,'saeule',26,FY+58);wPut(x,'saeule',334,FY+58);}
  wPut(x,u>=8?'goldthron':u>=1?'thron':'einfachthron',180,u>=1?FY+46:FY+30);
  if(own('pokal'))wPut(x,'pokal',96,FY+22);if(own('kristallkrone'))wPut(x,'kristallkrone',264,FY+22);if(own('orkbanner'))wPut(x,'orkbanner',62,FY+44);
  if(own('schatztruhe'))wPut(x,'schatztruhe',236,FY+60);if(own('ritterstatue'))wPut(x,'ritterstatue',300,FY+70);
  if(u>=6){wPut(x,'wache',114,FY+58);wPut(x,'wache',246,FY+58,true);}
  if(u>=7)wPut(x,'hoefling',44,FY+92);if(u>=8)wPut(x,'barde',316,FY+92,true);
  if(u>=5)wPut(x,'tafel',286,FY+170);},
 dy:function(c,FY,H,t){if(S.up.thron>=3){wTorch(c,132,FY-74,t,0);wTorch(c,228,FY-74,t,1);}}},
halle:{fy:100,f:function(){return [inFloor(),'holzwand','wand','prunkwand','kamin','tisch','fenster','schrank','teppich','banner','fackel','faesser','ruestung','kronleuchter','katze','baerenfell'];},
 sig:function(){return S.up.halle+'|'+moder()+'|'+own('baerenfell');},
 st:function(x,FY,H){var u=S.up.halle,v=vibe();base(x,FY,H,inFloor());
  if(v>=1)wPut(x,'fenster',120,FY-12);if(u>=3)wPut(x,'banner',180,FY+4);if(u>=4){wPut(x,'fackel',72,FY-36);wPut(x,'fackel',244,FY-36);}
  wPut(x,'kamin',304,FY+12);if(u>=1)wPut(x,'schrank',34,FY+18);if(u>=6)wPut(x,'ruestung',236,FY+22);
  if(own('baerenfell'))wPut(x,'baerenfell',84,FY+176);if(u>=2)wPut(x,'teppich',180,FY+128);
  if(u>=7)wPut(x,'kronleuchter',180,FY+36);wPut(x,'tisch',180,FY+112);if(u>=5)wPut(x,'faesser',326,FY+104);if(u>=8)wPut(x,'katze',128,FY+140);
  wModer(x,FY,H,moder());},
 dy:function(c,FY,H,t){var m=moder(),R=pen(c);wGlow(c,304,FY-22,24+(t%6<3?0:3),'rgba(255,170,70,.35)');
  if(S.up.halle>=4){wTorch(c,72,FY-74,t,0);wTorch(c,244,FY-74,t,1);}R(298+(t%5),FY-30-(t%8),1,1,'#E8C860');
  if(m>=3)creature(R,70+Math.round(Math.sin(t/12)*14),FY+150,t);}},
turm:{fy:100,f:function(){return [inFloor(),'holzwand','wand','prunkwand','fenster','klavier','kerzen','kristall','notenpult','regal','sternkarte','teleskop','harfe','spiegel','kristallleuchte'];},
 sig:function(){return S.up.turm+'|'+tower()+'|'+own('kristallleuchte');},
 st:function(x,FY,H){var u=S.up.turm,tw=tower(),v=vibe();base(x,FY,H,inFloor(),null,false,'rgba(40,20,70,.28)');
  if(v>=1)wPut(x,'fenster',180,FY-12);if(u>=5)wPut(x,'sternkarte',250,FY-30);if(u>=8)wPut(x,'spiegel',26,FY+24);if(u>=4)wPut(x,'regal',322,FY+24);if(u>=6)wPut(x,'teleskop',236,FY+34);
  if(u>=1)wPut(x,'kerzen',150,FY+52);
  if(u>=2)wPut(x,tw===2?'kristall':wTone('kristall','t'+tw,function(r,g,b){var l=(r+g+b)/3,f=tw?0.7:0.45;return[(r*0.4+l*0.6)*f,(g*0.4+l*0.6)*f,(b*0.4+l*0.6)*f+(tw?10:0)];}),276,FY+90);
  wPut(x,'klavier',96,FY+86);if(u>=3)wPut(x,'notenpult',178,FY+110);if(u>=7)wPut(x,'harfe',326,FY+132);if(own('kristallleuchte'))wPut(x,'kristallleuchte',220,FY+150);
  if(tw===0){var R=pen(x);x.save();x.translate(0,FY-104);cobweb(R,0,0,1);cobweb(R,359,0,-1);x.restore();}
  if(tw<2){x.fillStyle='rgba(8,6,22,'+(tw?0.25:0.5)+')';x.fillRect(0,0,360,H);}},
 dy:function(c,FY,H,t){var tw=tower(),R=pen(c),i,X,Y,kx=S.up.turm>=2?276:96,ky=S.up.turm>=2?FY+56:FY+40;
  if(tw===2){wGlow(c,kx,ky,30+(t%6<3?0:4),'rgba(159,232,255,.3)');
   for(i=0;i<8;i++){Y=FY+20-((t*1.3+i*21)%170);X=60+Math.sin(t/7+i*2)*34+i*9;if(Y>FY-150)note(R,X,Y,i%2?'#f4dd8a':'#9fe8ff');}
   if(S.up.turm>=1)wGlow(c,150,FY+4,16+(t%5<2?0:2),'rgba(255,200,110,.45)');}
  else if(tw===1)wGlow(c,kx,ky,22+(t%10<5?0:2),'rgba(159,232,255,.16)');}},
bib:{fy:100,f:function(){return [inFloor(),'holzwand','wand','prunkwand','fenster','regal','pult','globus','teppich','leiter','eule'];},
 sig:function(){return S.up.bib;},
 st:function(x,FY,H){var u=S.up.bib,v=vibe();base(x,FY,H,inFloor());if(v>=1)wPut(x,'fenster',300,FY-12);
  [[1,36],[2,98],[4,160],[7,222]].forEach(function(q){if(u>=q[0])wPut(x,'regal',q[1],FY+24);});
  if(u>=8&&u>=1)wPut(x,'eule',40,FY-84);if(u>=6)wPut(x,'leiter',130,FY+30);if(u>=3)wPut(x,'globus',300,FY+70);
  if(u>=5)wPut(x,'teppich',200,FY+150);wPut(x,'pult',250,FY+116);},
 dy:function(c,FY,H,t){var R=pen(c),i,a;wGlow(c,272,FY+68,14+(t%5<2?0:2),'rgba(255,200,110,.45)');
  if(vibe()>=1)for(i=0;i<12;i++){a=(t*0.4+i*17)%110;R(276+rnd(i)*50+Math.sin(t/9+i)*4,FY-60+a,1,1,'rgba(255,245,200,.7)');}}},
garten:{fy:110,out:1,f:function(){return ['garten','pflanze','baum','scheuche','gartenbank','bienen','obstbaum','teich','exoten','palisade','zinnen','prunkmauer'];},
 sig:function(){return S.up.garten+'|'+plant()+'|'+own('exoten');},
 st:function(x,FY,H){var u=S.up.garten,pl=plant(),nr=1+(u>=1)+(u>=3)+(u>=5),bed=function(vx,vy){if(vx===5||vx===6||vx>10||vx<1)return false;for(var r=0;r<nr;r++)if(vy===1+r*2)return true;return false;};
  wSky(x,FY,['palisade','zinnen','prunkmauer'][vibe()]);wFloor(x,'garten',FY,H,bed,true);
  var P=pl===0?wImg('pflanze'):wTone('pflanze','p'+pl,function(r,g,b){var l=(r+g+b)/3;return pl===1?[r*0.9+30,g*0.85+20,b*0.6]:pl===2?[l*0.7+50,l*0.55+28,l*0.3]:[l*0.45+20,l*0.42+14,l*0.4+10];});
  if(u>=7)wPut(x,'obstbaum',30,FY+34);if(u>=4)wPut(x,'gartenbank',236,FY+26);if(own('exoten'))wPut(x,'exoten',180,FY+28);
  for(var r=0;r<nr;r++)for(var vx=1;vx<=10;vx++)if(vx!==5&&vx!==6){if(pl===3&&rnd(vx+r*11)>0.6)continue;x.drawImage(P,-28+vx*32-16,FY+(1+r*2)*32+8-30+(pl>=2?2:0));}
  wPut(x,pl>=2?wTone('baum','b'+pl,function(r,g,b){var l=(r+g+b)/3;return g>r?[l*0.8+40,l*0.7+22,l*0.35]:[r,g,b];}):'baum',322,FY+40);
  if(u>=2)wPut(x,'scheuche',148,FY+86);if(u>=6)wPut(x,'bienen',350,FY+150);if(u>=8)wPut(x,'teich',300,FY+250);},
 dy:function(c,FY,H,t){var pl=plant(),R=pen(c),i,X,Y;
  if(pl===0)for(i=0;i<4;i++){X=40+i*80+Math.sin(t/7+i*2)*18;Y=FY+40+(i%2)*60+Math.cos(t/5+i)*8;var co=['#EDF0D8','#E8C860','#e86aa0','#9fd0ff'][i];R(X,Y,2,1,co);R(X+(t%4<2?-1:2),Y-1,1,2,co);}
  if(pl===3)for(i=0;i<14;i++)R(24+i*22+Math.sin(t/2+i*3)*6,FY+40+(i%4)*30+Math.cos(t/3+i)*6,1,1,'#16141c');
  if(pl===2)for(i=0;i<5;i++){Y=(t*0.8+i*40)%150;R(290+i*12+Math.sin(t/6+i)*6,FY-40+Y,2,1,'#b8862a');}
  if(S.up.garten>=6)for(i=0;i<3;i++)R(340+Math.sin(t/3+i*2)*12,FY+110+Math.cos(t/4+i)*8,1,1,'#E8C860');}},
hof:{fy:110,out:1,f:function(){return ['lehm','hof','brunnen','stand','schmiede','baecker','stall','maibaum','loewenstatue','magd','schmied','bauer','kind','haendlerin','moench','palisade','zinnen','prunkmauer'];},
 sig:function(){return S.up.hof+'|'+happy()+'|'+own('loewenstatue');},
 st:function(x,FY,H){var u=S.up.hof,v=vibe();wSky(x,FY,['palisade','zinnen','prunkmauer'][v]);wFloor(x,v?'hof':'lehm',FY,H,function(vx){return vx<=0||vx>=12;});
  if(u>=7)wPut(x,'stall',180,FY+30);if(own('loewenstatue'))wPut(x,'loewenstatue',330,FY+44);
  wPut(x,'brunnen',90,FY+92);if(u>=1)wPut(x,'stand',276,FY+84);if(u>=8)wPut(x,'maibaum',196,FY+140);if(u>=3)wPut(x,'schmiede',300,FY+196);if(u>=5)wPut(x,'baecker',64,FY+210);},
 dy:function(c,FY,H,t){var hp=happy(),u=S.up.hof,n=2+(u>=2)+(u>=4)+(u>=6)+(u>=8),i,P=[['magd',150,FY+72],['bauer',230,FY+120],['schmied',40,FY+150],['haendlerin',290,FY+130],['kind',180,FY+176],['moench',120,FY+206]];
  for(i=0;i<n;i++){var p=P[i],im=hp?wImg(p[0]):wTone(p[0],'sad',function(r,g,b){var l=(r+g+b)/3;return[r*0.6+l*0.3,g*0.6+l*0.3,b*0.6+l*0.35];}),
   dx=hp?Math.round(Math.sin(t/(14+i*3)+i)*10):0,fl=hp&&Math.cos(t/(14+i*3)+i)<0,by=p[2]+(hp&&t%8<4&&i%2?-1:0);
   c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(p[1]+dx,p[2]-1,12,3,0,0,7);c.fill();
   c.save();c.translate(p[1]+dx,0);if(fl)c.scale(-1,1);c.drawImage(im,-im.width/2,by-im.height);c.restore();
   if(!hp&&(t+i*5)%30<14){var R=pen(c);R(p[1]+dx-1,p[2]-66,2,6,'#f6ead0');R(p[1]+dx-1,p[2]-58,2,2,'#f6ead0');}}}}};

/* Aussenansicht und Karte */
function wExtend(x,im,ty,H){var w=im.width,h=im.height,cv=mk(w,h),cx=cv.getContext('2d'),d,avg,i,X,Y,R=pen(x),top,bot,pl=-1,pr=-1,pc,o;cx.drawImage(im,0,0);
 try{d=cx.getImageData(0,0,w,h).data;}catch(e){d=null;}
 avg=function(y0,y1,skip){var r=0,g=0,b=0,n=0,yy,xx;for(yy=y0;yy<y1;yy++)for(xx=0;xx<w;xx+=3){if(skip&&xx>=skip[0]&&xx<=skip[1])continue;o=(yy*w+xx)*4;r+=d[o];g+=d[o+1];b+=d[o+2];n++;}return 'rgb('+Math.round(r/n)+','+Math.round(g/n)+','+Math.round(b/n)+')';};
 if(d){o=((h-1)*w+180)*4;pc=[d[o],d[o+1],d[o+2]];for(X=100;X<260;X++){o=((h-1)*w+X)*4;if(Math.abs(d[o]-pc[0])+Math.abs(d[o+1]-pc[1])+Math.abs(d[o+2]-pc[2])<70){if(pl<0)pl=X;pr=X;}}}
 top=d?avg(0,6):'#6a9a48';bot=d?avg(h-6,h,pl>=0?[pl-4,pr+4]:null):'#5a8c38';
 x.fillStyle=top;x.fillRect(0,0,w,ty+2);x.fillStyle=bot;x.fillRect(0,ty+h-2,w,H-ty-h+2);
 for(i=0;i<500;i++){X=rnd(i+3100)*w;Y=rnd(i+3200)*H;if(Y>ty&&Y<ty+h)continue;R(X,Y,1,2,i%3?'rgba(0,0,0,.12)':'rgba(255,255,220,.18)');}
 if(pl>=0){x.fillStyle='rgb('+pc.join(',')+')';for(Y=ty+h-2;Y<H;Y++){var e=(Y-ty-h)*0.08;x.fillRect(pl-e,Y,pr-pl+1+e*2,1);}
  for(i=0;i<60;i++){Y=ty+h+rnd(i+3300)*(H-ty-h);X=pl+rnd(i+3400)*(pr-pl);R(X,Y,2,1,'rgba(0,0,0,.12)');}}
 return function(){var t=wImg('baum');if(ty>8)for(i=0;i<9;i++)x.drawImage(t,-30+i*46+(i%2)*10,ty+18-t.height+(i%3)*6);};}
var WMAP={C:[150,318],K:[300,232],P:[[196,384],[74,252],[262,352],[104,420],[272,150],[56,120],[200,200],[150,90]]};
ROOMS2.mauer={f:function(){return ['stufe'+(S.wall.lvl-1),'geroell','baum'];},sig:function(){return S.wall.lvl+'|'+S.wall.dmg;},
 st:function(x,FY,H){var b=[hudB(),visB(H)],im=wImg('stufe'+(S.wall.lvl-1)),ty=Math.max(b[0]-60,Math.round((b[0]+b[1])/2-im.height/2-10)),d=S.wall.dmg,i,R=pen(x);
  var tr=wExtend(x,im,ty,H);x.drawImage(im,0,ty);tr();W.ty=ty;
  var gx=[64,296,118,244,28];for(i=0;i<d;i++){wPut(x,'geroell',gx[i],ty+196);var cx=gx[i],cy=ty+130;R(cx,cy,1,8,'#2a2622');R(cx+1,cy+7,1,6,'#2a2622');R(cx-1,cy+12,1,7,'#2a2622');R(cx+2,cy+3,3,1,'#2a2622');}
  if(d){x.fillStyle='rgba(20,16,12,'+(d*0.05)+')';x.fillRect(0,0,360,H);}},
 dy:function(c,FY,H,t){var R=pen(c),ty=W.ty,i,X,Y;
  for(i=0;i<3;i++){X=((t*0.9+i*130)%420)-30;Y=ty+20+i*14+Math.sin(t/4+i)*4;R(X,Y,3,1,'#16261A');R(X+(t%4<2?-2:3),Y-1,2,1,'#16261A');}
  if(S.wall.dmg===0){c.save();c.globalAlpha=0.06+0.02*Math.sin(t/20);c.fillStyle='#fff3c0';for(i=0;i<3;i++){c.beginPath();c.moveTo(30+i*110,0);c.lineTo(70+i*110,0);c.lineTo(150+i*110,H*0.7);c.lineTo(100+i*110,H*0.7);c.fill();}c.restore();}
  for(i=0;i<S.wall.dmg;i++){X=[64,296,118,244,28][i];var a=(t*0.8+i*13)%40;c.fillStyle='rgba(90,90,90,'+(0.35-a/120)+')';c.beginPath();c.arc(X+Math.sin(t/5+i)*3,ty+180-a,3+a/10,0,7);c.fill();}}};
ROOMS2.karte={f:function(){return ['karte4','mb0','mb1','mb2','mb3','m_lager','m_fahne','m_dorf'];},sig:function(){return S.wall.lvl+'|'+S.bosses.map(function(b){return b.done?(b.won?2:1):0;}).join('');},
 st:function(x,FY,H){var b=[hudB(),visB(H)],oy=Math.round((b[0]+b[1])/2-300),M=WMAP,R=pen(x),k,q;W.oy=oy;
  x.fillStyle='#2b1d12';x.fillRect(0,0,360,H);x.drawImage(wImg('karte4'),0,oy);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,oy-4,360,4);x.fillRect(0,oy+480,360,4);
  for(k=0;k<=24;k++){q=pathPt(k/24,M.K,M.C);if(k%2===0)R(q[0],q[1]+oy,2,2,'#8a2e22');}
  S.bosses.slice(0,8).forEach(function(bo,n){var P=M.P[n];if(bo.done&&!bo.won)return;for(k=1;k<16;k++){q=pathPt(k/16,M.C,P);if(k%2)R(q[0],q[1]+oy,2,1,'#5a3d22');}
   wPut(x,bo.done?'m_dorf':'m_fahne',P[0],P[1]+oy+14);});
  wPut(x,'m_lager',M.K[0],M.K[1]+oy+14);wPut(x,'mb'+Math.min(3,Math.floor((S.wall.lvl-1)/2)),M.C[0],M.C[1]+oy+14);},
 dy:function(c,FY,H,t){var R=pen(c),oy=W.oy,M=WMAP,now=Date.now(),nr=nextRaid(S.lastRaid),f=S.rest?0:Math.max(0,Math.min(1,1-(nr-now)/(7*DAY)))*0.92,p=pathPt(f,M.K,M.C),i;
  if(f>0.05){var X=p[0],Y=p[1]+oy;wGlow(c,X,Y,10+(t%10<5?0:2),'rgba(168,50,42,.45)');R(X-4,Y-2,3,4,'#a8322a');R(X,Y-3,3,5,'#7a2a1e');R(X+4,Y-2,3,4,'#a8322a');R(X+1,Y-9,1,7,'#2a1c12');R(X+2,Y-9,4,3,'#16141c');}
  S.bosses.slice(0,8).forEach(function(b,n){if(b.done)return;var P=M.P[n],dl=(new Date(b.date+'T23:59:59').getTime()-now)/DAY,sp=dl<=7?4:12;if(t%sp<sp/2)wGlow(c,P[0],P[1]+oy,18,'rgba(232,200,96,.35)');});
  for(i=0;i<5;i++){var wy=(i*97+t)%480;R(336+Math.sin(wy/23)*8+i*3,wy+oy,4,1,'#dcebe2');}}};

function wOk(room){var D=ROOMS2[room];return !!D&&wReady(D.f());}
function wDraw(c,room,H,T){var D=ROOMS2[room],hb=hudB(),FY=Math.max(T+96,hb+(D.fy||100));if(D.fy&&!D.out&&room!=='thron')FY=Math.max(FY,Math.min(hb+190,Math.round(visB(H)-150)));
 if(D.out)FY=Math.max(FY,Math.min(hb+190,Math.round(visB(H)-150)));
 W.fy=FY;var sg=room+'|'+H+'|'+FY+'|'+vibe()+'|'+D.sig(),st=W.st[room];
 if(!st||st.sig!==sg){var cv=mk(360,H),x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#17110c';x.fillRect(0,0,360,H);WO=[];D.st(x,FY,H);st=W.st[room]={cv:cv,sig:sg,obj:WO};WO=null;}
 c.imageSmoothingEnabled=false;c.drawImage(st.cv,0,0);D.dy(c,FY,H,tick);
 if(room!=='mauer'&&room!=='karte'){var h=heroStep(room,FY,H);heroPaint(c,h,S.rest?0:fit());
  st.obj.forEach(function(o){if(o[2]>h.y){if(o[3]){c.save();c.translate(o[1],0);c.scale(-1,1);c.drawImage(o[0],-Math.round(o[0].width/2),o[2]-o[0].height);c.restore();}else c.drawImage(o[0],Math.round(o[1]-o[0].width/2),o[2]-o[0].height);}});}}
/* Vorschau beim Helden */
function drawPv(){var cv=document.getElementById('pv');if(!cv||!cv.getContext)return;var c=cv.getContext('2d'),g=wImg('garten'),sh=heroSheet();c.imageSmoothingEnabled=false;
 if(!g.naturalWidth||!sh.naturalWidth)return;for(var i=0;i<5;i++)for(var j=0;j<4;j++)c.drawImage(g,0,96,32,32,i*32,j*32,32,32);
 var f=S.rest?0:fit(),col=[0,1,2,3,4,5,6,7][Math.floor(tick/12)%8];c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(72,104,16,4,0,0,7);c.fill();c.drawImage(sh,col*HC,f*4*HC,HC,HC,26,27,HC,HC);}
