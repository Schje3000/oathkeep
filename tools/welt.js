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
 return i>=8?null:{i:i+1,n:CAT[r][i],p:CAT_P[i],req:CAT_SK[r]?CAT_RS[i]:CAT_RC[i],sk:CAT_SK[r]||null,bq:i+1>=6?7:i+1>=3?4:1};}
function upHave(n){return n.sk?lvl(S.xp[n.sk]):charLvl();}
function upOk(r){var n=upNext(r);return !!n&&upHave(n)>=n.req&&S.gold>=n.p&&(r!=='burg'||S.wall.dmg===0)&&(!n.bq||S.wall.lvl>=n.bq);}
function upBuy(r){var n=upNext(r);if(!upOk(r))return;S.gold-=n.p;if(r==='burg')S.wall.lvl++;else S.up[r]=(S.up[r]||0)+1;save();render();toast(n.n+' gebaut: -'+n.p+' Gold');}
function vBuild(r){var n=upNext(r),i=upLvl(r),max=r==='burg'?7:8,h='<div class="card"><div class="row">'+UI('hammer')+'<div class="grow"><div class="t">'+(r==='burg'?'Burg: '+CAT.burg[i]:'Ausbau '+i+' von 8')+'</div>';
 if(!n)return h+'<div class="s">Vollständig ausgebaut.</div></div></div>'+bar(1,1)+'</div>';
 var have=upHave(n),skOk=have>=n.req,gOk=S.gold>=n.p,dmg=r==='burg'&&S.wall.dmg>0;
 h+='<div class="s">Als Nächstes: <b>'+n.n+'</b>. Braucht '+(n.sk?SK[n.sk]:'Charakterstufe')+' '+n.req+' <span class="'+(skOk?'ok':'warn')+'">(du: '+have+')</span>, kostet '+n.p+' Gold <span class="'+(gOk?'ok':'warn')+'">(du: '+S.gold+')</span>.'+(dmg?' <span class="warn">Erst die Mauer reparieren.</span>':'')+(n.bq>1?' Braucht Burgstufe '+n.bq+' <span class="'+(S.wall.lvl>=n.bq?'ok':'warn')+'">(du: '+S.wall.lvl+')</span>.':'')+'</div></div></div>'+
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
 baerenfell:{n:'Bärenfell',sl:'moebel',r:0,b:{gold_home:0.05},img:'baerenfell',room:'halle'},exoten:{n:'Exotische Pflanze',sl:'moebel',r:0,b:{gold_water:0.05},img:'exoten',room:'garten'},
 schatztruhe:{n:'Schatztruhe',sl:'moebel',r:1,b:{gold:0.03},img:'schatztruhe',room:'thron'},ritterstatue:{n:'Ritterstatue',sl:'moebel',r:1,b:{def:2},img:'ritterstatue',room:'thron'},
 kristallleuchte:{n:'Kristallleuchte',sl:'moebel',r:1,b:{gold_piano:0.05},img:'kristallleuchte',room:'turm'},loewenstatue:{n:'Löwenstatue',sl:'moebel',r:2,b:{gold:0.05},img:'loewenstatue',room:'hof'}};
var RAR=['gewöhnlich','selten','episch'],RARC=['#cfc8b0','#7fb8ff','#d79bff'],SLOTN={waffe:'Waffe',ruestung:'Rüstung',talisman:'Talisman',trophae:'Trophäe',moebel:'Einrichtung'},
 ROOMN={halle:'Innenraum',garten:'Burggarten',thron:'Thronsaal',turm:'Zauberturm',hof:'Innenhof'};
function itemIcon(id){var it=ITEMS[id];return it.img||('i_'+id);}
function eqBonus(k){var s=0;['waffe','ruestung','talisman'].forEach(function(sl){var id=S.equip[sl];if(id&&ITEMS[id]&&ITEMS[id].b[k])s+=ITEMS[id].b[k];});
 S.inv.forEach(function(id){var it=ITEMS[id];if(it&&(it.sl==='trophae'||it.sl==='moebel'))s+=it.b[k]||0;});return s;}
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
function heroStep(room,FY,H){var B=W.rb||rBand(H),Z=WALK[room+(S.up[room]||0)]||[60,300,330,404],h=W.hero,y0=Math.max(B.hb+70,Z[2]),y1=Math.max(y0+8,Math.min(B.vb-6,Z[3])),f=fit();
 if(!h||W.hroom!==room+(S.up[room]||0)){W.hroom=room+(S.up[room]||0);h=W.hero={x:(Z[0]+Z[1])/2,y:Math.min(y1,y0+60),tx:180,ty:y0+60,dir:'s',walk:false,wait:10,fr:0};}
 h.y=Math.max(y0,Math.min(y1,h.y));h.x=Math.max(Z[0],Math.min(Z[1],h.x));if(S.rest){h.walk=false;h.dir='s';return h;}
 var sp=[2.2,1.3,0.8][f];
 if(h.walk){var dx=h.tx-h.x,dy=h.ty-h.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<=sp){h.x=h.tx;h.y=h.ty;h.walk=false;h.wait=[14,24,36][f]+Math.floor(Math.random()*[30,40,50][f]);if(Math.random()<0.4)h.dir='s';}
  else{h.x+=dx/d*sp;h.y+=dy/d*sp;h.dir=Math.abs(dx)>Math.abs(dy)*1.1?(dx>0?'e':'w'):(dy>0?'s':'n');h.fr++;}}
 else if(--h.wait<=0){var mx=[150,110,70][f];h.tx=Math.max(Z[0],Math.min(Z[1],h.x+(Math.random()*2-1)*mx));h.ty=y0+Math.random()*(y1-y0);
  if(Math.abs(h.tx-h.x)+Math.abs(h.ty-h.y)>12){h.walk=true;h.fr=0;}else h.wait=10;}
 return h;}
function heroPaint(c,h,f){var sh=heroSheet(),row=f*4,col,flip=false;
 if(h.walk){row+=h.dir==='s'?1:h.dir==='n'?2:3;flip=h.dir==='w';col=h.fr%8;}else col={s:0,e:2,n:4,w:6}[h.dir];
 var hx=Math.round(h.x),hy=Math.round(h.y);c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(hx,hy-1,15,4,0,0,7);c.fill();
 c.save();c.translate(hx,0);if(flip)c.scale(-1,1);c.drawImage(sh,col*HC,row*HC,HC,HC,-46,hy-77,HC,HC);c.restore();}

/* Laufzonen des Helden je Szene (x0, x1, y0, y1 der Füsse), freier Boden vor Möbeln und Leuten */
var WALK={};
/* Szenen: je Ausbaustufe ein Hochformatbild (360 x 512) ab Bildschirmoberkante. Oben Decke oder Himmel unter der Kopfleiste,
   unten Boden unter der Holzleiste. Wichtiges liegt im freien Band dazwischen. */
var SC_H=512;
function rBand(H){return{hb:hudB()+4,vb:Math.min(visB(H)-2,SC_H-4),ty:0};}
function scFill(x,im,H){x.drawImage(im,0,0);if(H>SC_H){var g=x.createLinearGradient(0,SC_H,0,H);g.addColorStop(0,'rgba(20,14,9,.85)');g.addColorStop(1,'#140e09');x.fillStyle=g;x.fillRect(0,SC_H,360,H-SC_H);}}
function rImg(r){return 'v_'+r+(S.up[r]||0);}
function rTone(r,key,f){return wTone(rImg(r),key,f);}
var DRY=[null,function(r,g,b){return g>r&&g>b?[r*0.85+38,g*0.85+18,b*0.6]:[r,g,b];},function(r,g,b){var l=(r+g+b)/3;return g>r&&g>b?[l*0.75+52,l*0.6+30,l*0.32]:[r*0.95,g*0.9,b*0.85];},function(r,g,b){var l=(r+g+b)/3;return g>r&&g>b?[l*0.5+26,l*0.45+18,l*0.4+12]:[r*0.8,g*0.78,b*0.78];}];
function rRoom(o){return{f:function(){return [rImg(o.r)];},sig:o.sig||function(){return '';},out:o.out,
 st:function(x,FY,H){var B=rBand(H),im=o.tone?o.tone():wImg(rImg(o.r));W.fy=230;scFill(x,im,H);W.rb=B;if(o.st)o.st(x,B,H);},
 dy:function(c,FY,H,t){if(o.dy)o.dy(c,W.rb||rBand(H),H,t);}};}
var ROOMS2={
thron:rRoom({r:'thron'}),
halle:rRoom({r:'halle',sig:function(){return moder();},st:function(x,B,H){wModer(x,230,Math.min(H,410),moder());},
 dy:function(c,B,H,t){if(moder()>=3)creature(pen(c),80+Math.round(Math.sin(t/12)*14),330,t);}}),
turm:rRoom({r:'turm',sig:function(){return tower();},st:function(x,B,H){var tw=tower();if(tw===0){var R=pen(x);x.save();x.translate(0,B.hb);cobweb(R,0,0,1);cobweb(R,359,0,-1);x.restore();}
  if(tw<2){x.fillStyle='rgba(8,6,22,'+(tw?0.28:0.55)+')';x.fillRect(0,0,360,H);}},
 dy:function(c,B,H,t){var tw=tower(),R=pen(c),i,X,Y;if(tw===2){for(i=0;i<9;i++){Y=B.vb-20-((t*1.3+i*21)%220);X=40+Math.sin(t/7+i*2)*30+i*32;if(Y>B.hb)note(R,X,Y,i%2?'#f4dd8a':'#9fe8ff');}}
  else if(tw===1)for(i=0;i<3;i++){Y=B.vb-30-((t+i*40)%180);note(R,90+i*80+Math.sin(t/9+i)*10,Y,'#7a8aa8');}}}),
bib:rRoom({r:'bib',dy:function(c,B,H,t){var R=pen(c),i,a;for(i=0;i<14;i++){a=(t*0.4+i*17)%140;R(30+rnd(i)*300+Math.sin(t/9+i)*4,B.hb+20+a,1,1,'rgba(255,245,200,.6)');}}}),
garten:rRoom({r:'garten',out:1,sig:function(){return plant();},tone:function(){var pl=plant();return pl?rTone('garten','p'+pl,DRY[pl]):wImg(rImg('garten'));},
 dy:function(c,B,H,t){var pl=plant(),R=pen(c),i,X,Y;
  if(pl===0)for(i=0;i<4;i++){X=40+i*80+Math.sin(t/7+i*2)*18;Y=230+(i%2)*60+Math.cos(t/5+i)*8;var co=['#EDF0D8','#E8C860','#e86aa0','#9fd0ff'][i];R(X,Y,2,1,co);R(X+(t%4<2?-1:2),Y-1,1,2,co);}
  if(pl===3)for(i=0;i<14;i++)R(24+i*22+Math.sin(t/2+i*3)*6,200+(i%4)*40+Math.cos(t/3+i)*6,1,1,'#16141c');
  if(pl===2)for(i=0;i<6;i++){Y=(t*0.8+i*40)%200;R(30+i*55+Math.sin(t/6+i)*6,B.hb+Y,2,1,'#b8862a');}}}),
hof:rRoom({r:'hof',out:1,sig:function(){return happy();},tone:function(){return happy()?wImg(rImg('hof')):rTone('hof','sad',function(r,g,b){var l=(r+g+b)/3;return[r*0.55+l*0.35,g*0.55+l*0.35,b*0.55+l*0.4];});}})};

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
var WMAP={C:[195,292],K:[282,146],P:[[190,206],[250,336],[88,286],[158,174],[242,252],[150,392],[262,372],[64,214]]};
ROOMS2.mauer={f:function(){return ['v_burg'+(S.wall.lvl-1),'geroell'];},sig:function(){return S.wall.lvl+'|'+S.wall.dmg;},
 st:function(x,FY,H){var im=wImg('v_burg'+(S.wall.lvl-1)),d=S.wall.dmg,i,R=pen(x);scFill(x,im,H);W.ty=0;
  var gx=[70,290,124,240,34];for(i=0;i<d;i++){wPut(x,'geroell',gx[i],300);var cx=gx[i],cy=236;R(cx,cy,1,8,'#2a2622');R(cx+1,cy+7,1,6,'#2a2622');R(cx-1,cy+12,1,7,'#2a2622');R(cx+2,cy+3,3,1,'#2a2622');}
  if(d){x.fillStyle='rgba(20,16,12,'+(d*0.05)+')';x.fillRect(0,0,360,H);}},
 dy:function(c,FY,H,t){var R=pen(c),i,X,Y;
  for(i=0;i<3;i++){X=((t*0.9+i*130)%420)-30;Y=130+i*14+Math.sin(t/4+i)*4;R(X,Y,3,1,'#16261A');R(X+(t%4<2?-2:3),Y-1,2,1,'#16261A');}
  if(S.wall.dmg===0){c.save();c.globalAlpha=0.06+0.02*Math.sin(t/20);c.fillStyle='#fff3c0';for(i=0;i<3;i++){c.beginPath();c.moveTo(30+i*110,0);c.lineTo(70+i*110,0);c.lineTo(150+i*110,H*0.55);c.lineTo(100+i*110,H*0.55);c.fill();}c.restore();}
  for(i=0;i<S.wall.dmg;i++){X=[70,290,124,240,34][i];var a=(t*0.8+i*13)%40;c.fillStyle='rgba(90,90,90,'+(0.35-a/120)+')';c.beginPath();c.arc(X+Math.sin(t/5+i)*3,280-a,3+a/10,0,7);c.fill();}}};
ROOMS2.karte={f:function(){return ['v_welt','mb0','mb1','mb2','mb3','m_lager','m_fahne','m_dorf'];},sig:function(){return S.wall.lvl+'|'+S.bosses.map(function(b){return b.done?(b.won?2:1):0;}).join('');},
 st:function(x,FY,H){var oy=0,M=WMAP,R=pen(x),k,q;W.oy=0;scFill(x,wImg('v_welt'),H);
  for(k=0;k<=24;k++){q=pathPt(k/24,M.K,M.C);if(k%2===0)R(q[0],q[1]+oy,2,2,'#8a2e22');}
  S.bosses.slice(0,8).forEach(function(bo,n){var P=M.P[n];if(bo.done&&!bo.won)return;for(k=1;k<16;k++){q=pathPt(k/16,M.C,P);if(k%2)R(q[0],q[1]+oy,2,1,'#5a3d22');}
   wPut(x,bo.done?'m_dorf':'m_fahne',P[0],P[1]+oy+14);});
  wPut(x,'m_lager',M.K[0],M.K[1]+oy+14);wPut(x,'mb'+Math.min(3,Math.floor((S.wall.lvl-1)/2)),M.C[0],M.C[1]+oy+14);},
 dy:function(c,FY,H,t){var R=pen(c),oy=W.oy,M=WMAP,now=Date.now(),nr=nextRaid(S.lastRaid),f=S.rest?0:Math.max(0,Math.min(1,1-(nr-now)/(7*DAY)))*0.92,p=pathPt(f,M.K,M.C),i;
  if(f>0.05){var X=p[0],Y=p[1]+oy;wGlow(c,X,Y,10+(t%10<5?0:2),'rgba(168,50,42,.45)');R(X-4,Y-2,3,4,'#a8322a');R(X,Y-3,3,5,'#7a2a1e');R(X+4,Y-2,3,4,'#a8322a');R(X+1,Y-9,1,7,'#2a1c12');R(X+2,Y-9,4,3,'#16141c');}
  S.bosses.slice(0,8).forEach(function(b,n){if(b.done)return;var P=M.P[n],dl=(new Date(b.date+'T23:59:59').getTime()-now)/DAY,sp=dl<=7?4:12;if(t%sp<sp/2)wGlow(c,P[0],P[1]+oy,18,'rgba(232,200,96,.35)');});
  }};

function wOk(room){var D=ROOMS2[room];return !!D&&wReady(D.f());}
function wDraw(c,room,H,T){var D=ROOMS2[room],B=rBand(H),FY=B.ty+90,sg=room+'|'+H+'|'+B.ty+'|'+B.vb+'|'+(S.up[room]||0)+'|'+D.sig(),st=W.st[room];
 if(!st||st.sig!==sg){var cv=mk(360,H),x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#17110c';x.fillRect(0,0,360,H);WO=[];D.st(x,FY,H);st=W.st[room]={cv:cv,sig:sg,obj:WO};WO=null;}
 c.imageSmoothingEnabled=false;c.drawImage(st.cv,0,0);D.dy(c,FY,H,tick);
 if(room!=='mauer'&&room!=='karte'){var h=heroStep(room,FY,H);heroPaint(c,h,S.rest?0:fit());
}}
/* Vorschau beim Helden */
function drawPv(){var cv=document.getElementById('pv');if(!cv||!cv.getContext)return;var c=cv.getContext('2d'),g=wImg('garten'),sh=heroSheet();c.imageSmoothingEnabled=false;
 if(!g.naturalWidth||!sh.naturalWidth)return;for(var i=0;i<5;i++)for(var j=0;j<4;j++)c.drawImage(g,0,96,32,32,i*32,j*32,32,32);
 var f=S.rest?0:fit(),col=[0,1,2,3,4,5,6,7][Math.floor(tick/12)%8];c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(72,104,16,4,0,0,7);c.fill();c.drawImage(sh,col*HC,f*4*HC,HC,HC,26,27,HC,HC);}
