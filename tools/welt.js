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
function own(id){return OK.own(S,id);}

/* Ausbaukatalog */
var CAT=OK.CAT,CAT_SK=OK.CAT_SK,CAT_P=OK.CAT_P,CAT_RS=OK.CAT_RS,CAT_RC=OK.CAT_RC,BURG_P=OK.BURG_P,BURG_RC=OK.BURG_RC;
function upLvl(r){return OK.upLvl(S,r);}
function upNext(r){return OK.upNext(S,r);}
function upHave(n){return OK.upHave(S,n);}
function upOk(r){return OK.upOk(S,r);}
function upBuy(r){var n=OK.upBuy(S,r);if(!n)return;save();render();toast(n.n+' gebaut: -'+n.p+' Gold');}
function vBuild(r){var n=upNext(r),i=upLvl(r),max=r==='burg'?7:8,h='<div class="card"><div class="row">'+UI('hammer')+'<div class="grow"><div class="t">'+(r==='burg'?'Burg: '+CAT.burg[i]:'Ausbau '+i+' von 8')+'</div>';
 if(!n)return h+'<div class="s">Vollständig ausgebaut.</div></div></div>'+bar(1,1)+'</div>';
 var have=upHave(n),skOk=have>=n.req,gOk=S.gold>=n.p,dmg=r==='burg'&&S.wall.dmg>0;
 h+='<div class="s">Als Nächstes: <b>'+n.n+'</b>. Braucht '+(n.sk?SK[n.sk]:'Charakterstufe')+' '+n.req+' <span class="'+(skOk?'ok':'warn')+'">(du: '+have+')</span>, kostet '+n.p+' Gold <span class="'+(gOk?'ok':'warn')+'">(du: '+S.gold+')</span>.'+(dmg?' <span class="warn">Erst die Mauer reparieren.</span>':'')+(n.bq>1?' Braucht Burgstufe '+n.bq+' <span class="'+(S.wall.lvl>=n.bq?'ok':'warn')+'">(du: '+S.wall.lvl+')</span>.':'')+'</div></div></div>'+
  bar(r==='burg'?i:i,max)+'<button class="b pri" data-act="build:'+r+'" '+(upOk(r)?'':'disabled')+'>Bauen für '+n.p+' Gold</button>';
 var nx=r==='burg'?CAT.burg.slice(i+2,i+4):CAT[r].slice(i+1,i+3);if(nx.length)h+='<div class="s">Danach: '+nx.join(', ')+'</div>';
 return h+'</div>';}

/* Beute */
var ITEMS=OK.ITEMS;
var RAR=OK.RAR,RARC=['#cfc8b0','#7fb8ff','#d79bff'],SLOTN={waffe:'Waffe',ruestung:'Rüstung',talisman:'Talisman',trophae:'Trophäe',moebel:'Einrichtung'},
 ROOMN={halle:'Innenraum',garten:'Burggarten',thron:'Thronsaal',turm:'Zauberturm',hof:'Innenhof'};
function itemIcon(id){var it=ITEMS[id];return it.img||('i_'+id);}
function eqBonus(k){return OK.eqBonus(S,k);}
function bonusText(b){var o=[],k,N={def:'Verteidigung',gold:'Gold aus allem',gold_run:'Gold aus Ausdauertraining',gold_gym:'Gold aus Kampftraining',gold_piano:'Gold aus Klang-Magie',gold_home:'Gold aus Burgpflege',gold_water:'Gold aus dem Garten',gold_read:'Gold aus Schriften'};
 for(k in b)o.push(k==='def'?'+'+b[k]+' '+N[k]:'+'+Math.round(b[k]*100)+' % '+N[k]);return o.join(', ')||'Schmuck für '+'den Raum';}
function lootRoll(src){return OK.lootRoll(S,src,now());}
var lootText=OK.lootText;
function heroTier(){return OK.heroTier(S);}

/* Held: läuft in allen Räumen */
/* Held und Bewohner in Seitenansicht. Blatt je Figur: Zeile je Zustand (kräftig, müde, geschwächt; Bewohner nur eine),
   Spalten: Ruhe Süd, Ruhe Ost, dann Laufen Ost (HN Bilder). Westen wird gespiegelt. Zellen HC2 x HC2, Füsse auf FOOT. */
var HC2=96,HN=6,FOOT=90;
function heroSheet(){var t=heroTier(),im=wImg('held_s_'+t);if(W.bad['held_s_'+t]||!im.naturalWidth)im=wImg('held_s_tunika');return im;}
function actorStep(a,X0,X1,sp,still){if(still){a.walk=false;return;}
 if(a.walk){var dx=a.tx-a.x;if(Math.abs(dx)<=sp){a.x=a.tx;a.walk=false;a.wait=a.w0+Math.floor(Math.random()*a.w1);a.face=Math.random()<0.5?'s':a.face;}else{a.x+=dx>0?sp:-sp;a.face=dx>0?'e':'w';a.fr++;}}
 else if(--a.wait<=0){a.tx=Math.max(X0,Math.min(X1,a.x+(Math.random()*2-1)*a.range));if(Math.abs(a.tx-a.x)>10){a.walk=true;a.fr=0;}else a.wait=8;}}
function actorPaint(c,im,a,row,T){var col,flip=false;if(a.walk){col=2+Math.floor(a.fr/a.slow)%HN;flip=a.face==='w';}else{col=a.face==='s'?0:1;flip=a.face==='w';}
 var X=Math.round(a.x),Y=T+a.lane;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(X,Y-1,14,3,0,0,7);c.fill();
 c.save();c.translate(X,0);if(flip)c.scale(-1,1);c.drawImage(im,col*HC2,row*HC2,HC2,HC2,-HC2/2,Y-FOOT,HC2,HC2);c.restore();}
function heroStep(room,T){var f=fit(),h=W.hero,key=room+(S.up[room]||0);
 if(!h||W.hroom!==key){W.hroom=key;h=W.hero={x:180,tx:180,face:'s',walk:false,wait:12,fr:0,lane:KIT[room]?KIT[room].lane[kMat(S.up[room]||0)]:3,range:[150,110,70][f],w0:[14,24,36][f],w1:[30,40,50][f],slow:[1,2,3][f]};}
 actorStep(h,28,332,[2.2,1.3,0.8][f],!!S.rest);return h;}
/* Bodenlinie je Szene (y der Füsse im Bild), gemessen mit tools/boden.py */
var FLOOR={"bib0":465,"bib1":455,"bib2":460,"bib3":445,"bib4":445,"bib5":388,"bib6":460,"bib7":408,"bib8":450,"garten0":448,"garten1":420,"garten2":455,"garten3":398,"garten4":415,"garten5":428,"garten6":482,"garten7":432,"garten8":478,"halle0":420,"halle1":435,"halle2":410,"halle3":452,"halle4":436,"halle5":455,"halle6":405,"halle7":400,"halle8":333,"hof0":390,"hof1":414,"hof2":452,"hof3":440,"hof4":448,"hof5":438,"hof6":397,"hof7":435,"hof8":440,"thron0":435,"thron1":435,"thron2":435,"thron3":405,"thron4":420,"thron5":405,"thron6":400,"thron7":420,"thron8":470,"turm0":425,"turm1":440,"turm2":405,"turm3":440,"turm4":438,"turm5":430,"turm6":470,"turm7":425,"turm8":425};
/* Szenen in Seitenansicht: je Ausbaustufe ein Hochformatbild (360 x 512), so verschoben, dass seine Bodenlinie
   knapp über der Holzleiste liegt. Oben fällt nur Decke oder Himmel weg. */
var SC_H=512;
function rImg(r){return 's_'+r+(S.up[r]||0);}
function rBand(H,r){var hb=hudB()+4,vb=visB(H)-2,ln=typeof KIT!=='undefined'&&KIT[r]?KIT[r].lane[kMat(S.up[r]||0)]:0,T=Math.round(Math.min(vb-22-ln-4,H-40-ln)),F=FLOOR[r+(S.up[r]||0)]||400;return{hb:hb,vb:vb,T:T,oy:T-F};}
function scPlace(x,im,B,H){var oy=B.oy;if(oy>0){x.drawImage(im,0,0,360,4,0,0,360,oy);}x.drawImage(im,0,oy);var b=oy+SC_H;
 if(b<H){var g=x.createLinearGradient(0,b,0,H);g.addColorStop(0,'rgba(20,14,9,.85)');g.addColorStop(1,'#140e09');x.fillStyle=g;x.fillRect(0,b,360,H-b);}}
function scFill(x,im,H){scPlace(x,im,{oy:0},H);}
function rTone(r,key,f){return wTone(rImg(r),key,f);}
var DRY=[null,function(r,g,b){return g>r&&g>b?[r*0.85+38,g*0.85+18,b*0.6]:[r,g,b];},function(r,g,b){var l=(r+g+b)/3;return g>r&&g>b?[l*0.75+52,l*0.6+30,l*0.32]:[r*0.95,g*0.9,b*0.85];},function(r,g,b){var l=(r+g+b)/3;return g>r&&g>b?[l*0.5+26,l*0.45+18,l*0.4+12]:[r*0.8,g*0.78,b*0.78];}];
function rRoom(o){return{f:function(){return [rImg(o.r)];},sig:o.sig||function(){return '';},out:o.out,
 st:function(x,FY,H){var B=rBand(H,o.r),im=o.tone?o.tone():wImg(rImg(o.r));W.fy=B.T;scPlace(x,im,B,H);W.rb=B;if(o.st)o.st(x,B,H);},
 dy:function(c,FY,H,t){if(o.dy)o.dy(c,W.rb||rBand(H,o.r),H,t);},actors:o.actors};}
var ROOMS2={
thron:rRoom({r:'thron'}),
halle:rRoom({r:'halle',sig:function(){return moder();},st:function(x,B,H){wModer(x,B.T,Math.min(H,B.T+40),moder());},
 dy:function(c,B,H,t){if(moder()>=3)creature(pen(c),80+Math.round(Math.sin(t/12)*14),B.T-2,t);}}),
turm:rRoom({r:'turm',sig:function(){return tower();},st:function(x,B,H){var tw=tower();if(tw===0){var R=pen(x);x.save();x.translate(0,B.hb);cobweb(R,0,0,1);cobweb(R,359,0,-1);x.restore();}
  if(tw<2){x.fillStyle='rgba(8,6,22,'+(tw?0.28:0.55)+')';x.fillRect(0,0,360,H);}},
 dy:function(c,B,H,t){var tw=tower(),R=pen(c),i,X,Y;if(tw===2){for(i=0;i<9;i++){Y=B.T-30-((t*1.3+i*21)%200);X=40+Math.sin(t/7+i*2)*30+i*32;if(Y>B.hb)note(R,X,Y,i%2?'#f4dd8a':'#9fe8ff');}}
  else if(tw===1)for(i=0;i<3;i++){Y=B.T-40-((t+i*40)%160);note(R,90+i*80+Math.sin(t/9+i)*10,Y,'#7a8aa8');}}}),
bib:rRoom({r:'bib',dy:function(c,B,H,t){var R=pen(c),i,a;for(i=0;i<14;i++){a=(t*0.4+i*17)%140;R(30+rnd(i)*300+Math.sin(t/9+i)*4,B.T-170+a,1,1,'rgba(255,245,200,.6)');}}}),
garten:rRoom({r:'garten',out:1,sig:function(){return plant();},tone:function(){var pl=plant();return pl?rTone('garten','p'+pl,DRY[pl]):wImg(rImg('garten'));},
 dy:function(c,B,H,t){var pl=plant(),R=pen(c),i,X,Y;
  if(pl===0)for(i=0;i<4;i++){X=40+i*80+Math.sin(t/7+i*2)*18;Y=B.T-40-(i%2)*50+Math.cos(t/5+i)*8;var co=['#EDF0D8','#E8C860','#e86aa0','#9fd0ff'][i];R(X,Y,2,1,co);R(X+(t%4<2?-1:2),Y-1,1,2,co);}
  if(pl===3)for(i=0;i<14;i++)R(24+i*22+Math.sin(t/2+i*3)*6,B.T-20-(i%4)*25+Math.cos(t/3+i)*6,1,1,'#16141c');
  if(pl===2)for(i=0;i<6;i++){Y=(t*0.8+i*40)%200;R(30+i*55+Math.sin(t/6+i)*6,B.hb+Y,2,1,'#b8862a');}}}),
hof:rRoom({r:'hof',out:1,actors:function(){var u=S.up.hof||0;return ['magd','bauer','schmied','haendlerin','kind','moench'].slice(0,2+(u>=2)+(u>=4)+(u>=6)+(u>=8));}})};

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
 dy:function(c,FY,H,t){var R=pen(c),oy=W.oy,M=WMAP,now=OK.now(),nr=OK.raidDue(S),f=S.rest?0:Math.max(0,Math.min(1,1-(nr-now)/(7*DAY)))*0.92,p=pathPt(f,M.K,M.C),i;
  if(f>0.05){var X=p[0],Y=p[1]+oy;wGlow(c,X,Y,10+(t%10<5?0:2),'rgba(168,50,42,.45)');R(X-4,Y-2,3,4,'#a8322a');R(X,Y-3,3,5,'#7a2a1e');R(X+4,Y-2,3,4,'#a8322a');R(X+1,Y-9,1,7,'#2a1c12');R(X+2,Y-9,4,3,'#16141c');}
  S.bosses.slice(0,8).forEach(function(b,n){if(b.done)return;var P=M.P[n],dl=(OK.dateEnd(b.date)-now)/DAY,sp=dl<=7?4:12;if(t%sp<sp/2)wGlow(c,P[0],P[1]+oy,18,'rgba(232,200,96,.35)');});
  }};


/* Bühnenbaukasten (Seitenansicht): Hintergrund je Material ohne Möbel, Objekte an festen Plätzen.
   Material nach Ausbaustufe: 0 bis 2 Holz, 3 bis 5 Stein, 6 bis 8 Prunk. Massstab 1 m = 45 px, Held 82 px.
   bgF: y der Bodenkante im Hintergrundbild je Material. Bodenobjekte stehen auf der Bodenlinie T,
   der Held läuft lane Pixel davor. Wandobjekte: y = Abstand ihrer Unterkante über T. */
function kMat(s){return s<=2?0:s<=5?1:2;}
var KIT={halle:{bgF:[402,406,404],lane:[24,32,20],top:[118,98,128],items:[
 {n:'teppich',s:2,x:164,k:'rug',w:124},
 {n:'pfannen0',m:0,s:0,x:164,k:'wand',y:84},{n:'kraeuter0',m:0,s:0,x:104,k:'wand',y:96},
 {n:'fenster1',m:1,s:0,x:44,k:'wand',y:122},{n:'pfannen1',m:1,s:0,x:164,k:'wand',y:66},
 {n:'bild2',m:2,s:0,x:72,k:'wand',y:126},{n:'teller2',m:2,s:0,x:164,k:'wand',y:68},
 {n:'banner',v:2,s:3,x:164,k:'wand',y:118},
 {n:'fackel',v:2,s:4,x:100,k:'wand',y:96},{n:'fackel',v:2,s:4,x:226,k:'wand',y:96},
 {n:'leuchter',s:7,x:164,k:'decke',y:196},
 {n:'schrank',v:3,s:1,x:36,k:'boden'},
 {n:'ruestung',s:6,x:90,k:'boden'},
 {n:'kamin',v:3,s:0,x:276,k:'boden',fire:1},
 {n:'faesser',s:5,x:324,k:'boden'},
 {n:'tisch',v:3,s:0,x:164,k:'boden',dy:3},
 {n:'katze',s:8,x:258,k:'boden',dy:2}],fire:[276,30]}};
/* Eigene Anordnung: S.layout[raum][schlüssel] = {x, y}. Schlüssel = Name plus laufende Nummer (fackel_1). */
function kKey(K,i){var n=K.items[i].n,c=0;for(var j=0;j<i;j++)if(K.items[j].n===n)c++;return n+'_'+c;}
function kPos(r,i){var it=KIT[r].items[i],L=(S.layout&&S.layout[r]||{})[kKey(KIT[r],i)];return{x:L&&isFinite(L.x)?L.x:it.x,y:L&&isFinite(L.y)?L.y:it.y};}

function kName(r,it,m){return 'k_'+(it.src||r)+'_'+it.n+(it.v===3?m:it.v===2?Math.max(1,m):'');}
function kOn(it,s,m){return s>=it.s&&(it.e===undefined||s<=it.e)&&(it.m===undefined||it.m===m);}
function kList(r){var s=S.up[r]||0,m=kMat(s),l=['k_'+r+'_bg'+m];KIT[r].items.forEach(function(it){if(kOn(it,s,m)&&it.k!=='rug')l.push(kName(r,it,m));});return l;}
/* Läufer flach auf dem Boden, zwischen Wandfuss und Laufweg, leicht trapezförmig wie der Boden */
var RUG=[['#8a6a44','#c9ad7c','#5e4428','#e3cf9f'],['#8e2a22','#b8372c','#5a1712','#e2b955'],['#7a1420','#a01d2c','#4a0a12','#f0cf6a']];
function kRug(x,cx,w,T,lane,m){var c=RUG[m],h=Math.max(8,lane-10),y0=T-1,i,y,l,r;
 for(i=0;i<h;i++){y=y0+i;var ins=Math.round((h-1-i)*0.35);l=Math.round(cx-w/2)+ins;r=Math.round(cx+w/2)-ins;
  x.fillStyle=(i===0||i===h-1)?c[2]:(i===1||i===h-2)?c[3]:(m===0&&i%3===0)?c[0]:c[1];x.fillRect(l,y,r-l,1);
  x.fillStyle=c[2];x.fillRect(l,y,1,1);x.fillRect(r-1,y,1,1);if(i>1&&i<h-2){x.fillStyle=c[3];x.fillRect(l+2,y,1,1);x.fillRect(r-3,y,1,1);}
  if(i%2===0){x.fillStyle=c[3];x.fillRect(l-2,y,2,1);x.fillRect(r,y,2,1);}}
 x.fillStyle='rgba(0,0,0,.18)';x.fillRect(Math.round(cx-w/2),y0+h,w,1);}
function kDragStart(px,py){var r=ui.room,K=KIT[r];if(!K||!W.krect)return false;
 for(var j=W.krect.length-1;j>=0;j--){var q=W.krect[j];if(px>=q.x-4&&px<=q.x+q.w+4&&py>=q.y-4&&py<=q.y+q.h+4){var P=kPos(r,q.i);W.kdrag={key:q.key,i:q.i,k:q.k,dx:px-P.x,dy:py-(W.rb.T-(P.y||0)),w:q.w,h:q.h};return true;}}
 return false;}
function kDragMove(px,py){var d=W.kdrag,r=ui.room,K=KIT[r];if(!d||!K)return;var m=kMat(S.up[r]||0),it=K.items[d.i],B=W.rb,nx=Math.round(px-d.dx),ny;
 nx=Math.max(Math.ceil(d.w/2)+1,Math.min(359-Math.ceil(d.w/2),nx));
 S.layout=S.layout||{};var L=S.layout[r]=S.layout[r]||{},v={x:nx};
 if(d.k==='wand'||d.k==='decke'){ny=Math.round(B.T-(py-d.dy));var wall=K.bgF[m]-K.top[m];ny=Math.max(36,Math.min(wall-d.h-4,ny));v.y=ny;}
 L[d.key]=v;W.st[r]=null;}
function kDragEnd(){if(W.kdrag){W.kdrag=null;save();}}
function kBind(){var cv=document.getElementById('cv');if(!cv||cv.kBound)return;cv.kBound=1;
 var pt=function(e){var b=cv.getBoundingClientRect();return[(e.clientX-b.left)*360/b.width,(e.clientY-b.top)*cv.height/b.height];};
 cv.addEventListener('pointerdown',function(e){if(!ui.edit)return;var p=pt(e);if(kDragStart(p[0],p[1])){e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(x){}draw();}});
 cv.addEventListener('pointermove',function(e){if(!ui.edit||!W.kdrag)return;e.preventDefault();var p=pt(e);kDragMove(p[0],p[1]);draw();});
 ['pointerup','pointercancel'].forEach(function(n){cv.addEventListener(n,function(){if(W.kdrag){kDragEnd();draw();}});});}
function kRoom(r,o){o=o||{};return{f:function(){return kList(r);},sig:o.sig||function(){return '';},actors:o.actors,tone:o.tone,
 st:function(x,FY,H){var K=KIT[r],s=S.up[r]||0,m=kMat(s),B=rBand(H,r),bg=wImg('k_'+r+'_bg'+m);B.oy=B.T-K.bgF[m];W.rb=B;W.fy=B.T;scPlace(x,bg,B,H);
  W.krect=[];K.items.forEach(function(it,i){if(!kOn(it,s,m))return;var P=kPos(r,i),key=kKey(K,i);
   if(it.k==='rug'){kRug(x,P.x,it.w,B.T,K.lane[m],m);W.krect.push({key:key,i:i,k:'rug',x:P.x-it.w/2,y:B.T-2,w:it.w,h:Math.max(8,K.lane[m]-10)+2});return;}
   var nm=kName(r,it,m),im=wImg(nm),w=im.width,h=im.height,X=Math.round(P.x-w/2),Y,wt=B.oy+K.top[m];
   if(o.tone){var tn=o.tone(it,nm);if(tn)im=tn;}
   if(it.k==='boden')Y=B.T-h+(it.dy||0);else Y=B.T-P.y-h;
   if(it.span){var cap=Math.round(h*0.22),band=8,yy;W.krect.push({key:key,i:i,k:it.k,x:X,y:wt,w:w,h:B.T-wt});
    x.drawImage(im,0,cap,w,h-cap,X,Y+cap,w,h-cap);for(yy=Y+cap-band;yy>wt+cap-band;yy-=band)x.drawImage(im,0,cap,w,band,X,yy,w,band);
    x.drawImage(im,0,0,w,cap+1,X,wt,w,cap+1);return;}
   W.krect.push({key:key,i:i,k:it.k,x:X,y:Y,w:w,h:h});
   if(it.k==='decke'){var cy=wt,cx=Math.round(P.x);x.fillStyle='#2a2018';x.fillRect(cx,cy,1,Y-cy+4);x.fillStyle='rgba(255,230,160,.18)';x.fillRect(cx+1,cy,1,Y-cy+4);}
   if(it.up){var yy;for(yy=Y-12;yy>wt-12;yy-=12)x.drawImage(im,0,0,w,12,X,yy,w,12);}
   x.drawImage(im,X,Y);});
  if(o.st)o.st(x,B,H);},
 dy:function(c,FY,H,t){var B=W.rb||rBand(H,r),K=KIT[r],s=S.up[r]||0;
  K.items.forEach(function(it,i){if(!kOn(it,s,kMat(s)))return;var P=kPos(r,i);
   if(it.fire)wGlow(c,P.x,B.T-K.fire[1],30+(t%6<3?0:4),'rgba(255,170,70,.30)');
   if(it.n==='fackel')wGlow(c,P.x,B.T-P.y-30,22+((t+i)%6<3?0:3),'rgba(255,190,90,.28)');});
  if(ui.edit&&W.krect){c.save();W.krect.forEach(function(q){var sel=W.kdrag&&W.kdrag.key===q.key;c.setLineDash(sel?[]:[3,2]);c.lineWidth=1;c.strokeStyle=sel?'#f0cf6a':(q.k==='boden'||q.k==='rug'?'rgba(155,224,106,.85)':'rgba(240,207,106,.7)');c.strokeRect(Math.round(q.x)+0.5,Math.round(q.y)+0.5,Math.round(q.w)-1,Math.round(q.h)-1);});
   c.setLineDash([2,3]);c.strokeStyle='rgba(155,224,106,.6)';c.beginPath();c.moveTo(0,B.T+0.5);c.lineTo(360,B.T+0.5);c.stroke();c.restore();}
  if(o.dy)o.dy(c,B,H,t);}};}
ROOMS2.halle=kRoom('halle',{sig:function(){return moder();},st:function(x,B,H){wModer(x,B.T,Math.min(H,B.T+40),moder());},
 dy:function(c,B,H,t){if(moder()>=3)creature(pen(c),80+Math.round(Math.sin(t/12)*14),B.T+8,t);}});
/* BAUKASTEN-RAEUME */
function wOk(room){var D=ROOMS2[room];if(!D)return false;var f=D.f();if(D.actors)f=f.concat(D.actors().map(function(n){return 'bew_'+n;}));if(room!=='mauer'&&room!=='karte')f.push('held_s_tunika');return wReady(f);}
function wDraw(c,room,H,T){var D=ROOMS2[room],B=room==='mauer'||room==='karte'?{T:0,oy:0}:rBand(H,room),sg=room+'|'+H+'|'+B.oy+'|'+(S.up[room]||0)+'|'+D.sig()+'|'+JSON.stringify(S.layout&&S.layout[room]||{}),st=W.st[room];
 if(!st||st.sig!==sg){var cv=mk(360,H),x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#17110c';x.fillRect(0,0,360,H);WO=[];D.st(x,B.T,H);st=W.st[room]={cv:cv,sig:sg};WO=null;}
 c.imageSmoothingEnabled=false;c.drawImage(st.cv,0,0);D.dy(c,B.T,H,tick);
 if(room==='mauer'||room==='karte'||ui.edit)return;
 var list=[],h=heroStep(room,B.T),f=S.rest?0:fit();list.push({a:h,im:heroSheet(),row:f});
 if(D.actors){var hp=happy(),names=D.actors();W.npc=W.npc||{};names.forEach(function(n,i){var a=W.npc[n];
   var hx=36+Math.round(i*288/Math.max(1,names.length-1)),KL=KIT[room]?KIT[room].lane[kMat(S.up[room]||0)]:0;if(!a||a.n!==names.length||a.kl!==KL){a=W.npc[n]={kl:KL,x:hx,tx:hx,face:i%2?'e':'s',walk:false,wait:10+i*9,fr:0,lane:KL+(KL?[-6,3,-3,6,-5,4]:[-8,2,-3,6,-6,4])[i%6],range:40,w0:30,w1:80,slow:2,n:names.length,h:hx};}
   actorStep(a,Math.max(20,a.h-45),Math.min(340,a.h+45),0.7,!hp);var im=hp?wImg('bew_'+n):wTone('bew_'+n,'sad',function(r,g,b){var l=(r+g+b)/3;return[r*0.6+l*0.3,g*0.6+l*0.3,b*0.6+l*0.35];});
   list.push({a:a,im:im,row:0,sad:!hp});});}
 list.sort(function(p,q){return p.a.lane-q.a.lane;});
 list.forEach(function(e){actorPaint(c,e.im,e.a,e.row,B.T);if(e.sad&&(tick+e.a.lane*5)%30<14){var R=pen(c),X=Math.round(e.a.x);R(X-1,B.T+e.a.lane-FOOT+4,2,6,'#f6ead0');R(X-1,B.T+e.a.lane-FOOT+12,2,2,'#f6ead0');}});}
/* Vorschau beim Helden */
function drawPv(){var cv=document.getElementById('pv');if(!cv||!cv.getContext)return;var c=cv.getContext('2d'),g=wImg('garten'),sh=heroSheet();c.imageSmoothingEnabled=false;
 if(!g.naturalWidth||!sh.naturalWidth)return;for(var i=0;i<5;i++)for(var j=0;j<4;j++)c.drawImage(g,0,96,32,32,i*32,j*32,32,32);
 var f=S.rest?0:fit(),k=Math.floor(tick/2)%(HN*4),col=k<HN*2?2+k%HN:0;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(72,114,16,4,0,0,7);c.fill();c.drawImage(sh,col*HC2,f*HC2,HC2,HC2,24,114-FOOT,HC2,HC2);}
