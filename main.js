(function(){
  var d=document,root=d.documentElement;root.classList.add('js');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menü
  var burger=d.querySelector('.burger');
  if(burger){burger.addEventListener('click',function(){var o=root.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    d.querySelectorAll('.nav nav a').forEach(function(a){a.addEventListener('click',function(){root.classList.remove('open')})});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')root.classList.remove('open')});}
  var onScroll=function(){root.classList.toggle('scrolled',window.scrollY>30)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Einblenden beim Scrollen
  var rv=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){io.observe(el)});}
  else rv.forEach(function(el){el.classList.add('in')});

  // Vorher/Nachher
  d.querySelectorAll('.cmp').forEach(function(c){var i=c.querySelector('input');i.addEventListener('input',function(){c.style.setProperty('--p',i.value+'%')})});

  // Kassenbon / Preisrechner
  var eur=function(n){return n.toFixed(2).replace('.',',')};
  d.querySelectorAll('.cfg').forEach(function(cfg){
    var boxes=cfg.querySelectorAll('input[type=checkbox]'),lines=cfg.querySelector('[data-lines]'),sum=cfg.querySelector('[data-sum]'),go=cfg.querySelector('[data-go]');
    var pre=(new URLSearchParams(location.search).get('l')||'').split(',');
    boxes.forEach(function(b){if(pre.indexOf(b.value)>-1)b.checked=true});
    function upd(){var s=0,ids=[],h='';boxes.forEach(function(b){if(b.checked){s+=+b.dataset.price;ids.push(b.value);h+='<div class="ln"><span>'+b.dataset.name+'</span><span>'+eur(+b.dataset.price)+'</span></div>'}});
      if(lines)lines.innerHTML=h||'<div class="empty">Noch nichts ausgewählt.<br>Tipp links was an.</div>';
      if(sum)sum.textContent=eur(s)+' EUR';if(go)go.href='kontakt.html'+(ids.length?'?l='+ids.join(','):'');}
    boxes.forEach(function(b){b.addEventListener('change',upd)});upd();
  });

  // Anfrage per E-Mail
  var f=d.getElementById('anfrage');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();
    var v=function(id){return d.getElementById(id).value.trim()},svc=[],sum=0;
    f.querySelectorAll('input[type=checkbox]:checked').forEach(function(b){svc.push(b.dataset.name+' ('+b.dataset.price+' €)');sum+=+b.dataset.price});
    var body='Hallo DC Clean,\n\nich möchte einen Termin anfragen.\n\nName: '+v('a-name')+'\nFahrzeug: '+v('a-auto')+'\nLeistungen: '+(svc.length?svc.join(', ')+'\nSumme: '+sum+' €':'noch offen')+'\nWunschtermin: '+v('a-termin')+(v('a-code')?'\nRabattcode: '+v('a-code'):'')+(v('a-msg')?'\n\nNachricht: '+v('a-msg'):'')+'\n\nViele Grüße\n'+v('a-name');
    location.href='mailto:info@dc-clean.de?subject='+encodeURIComponent('Terminanfrage '+v('a-auto'))+'&body='+encodeURIComponent(body)});

  // Rabattcode in der Anfrage
  var codeIn=d.getElementById('a-code');
  if(codeIn){var pc=new URLSearchParams(location.search).get('code')||'';try{if(!pc&&localStorage.getItem('dc-code'))pc=localStorage.getItem('dc-code')}catch(e){}
    if(pc)codeIn.value=pc.replace(/[^A-Za-z0-9-]/g,'').toUpperCase().slice(0,20);}

  // Die dreckige Stelle: freiwischen zeigt den Rabattcode
  d.querySelectorAll('.scratch').forEach(function(box){
    var code=box.dataset.code,seen=false;try{seen=localStorage.getItem('dc-code')===code}catch(e){}
    if(seen||reduce){box.classList.add('won');return}
    var c=d.createElement('canvas');c.setAttribute('aria-hidden','true');box.appendChild(c);box.classList.add('dirty');
    var ctx=c.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),touched=false,done=false;
    var GX=18,GY=12,grid=new Uint8Array(GX*GY),cleared=0,last=null;
    var R=function(a,b){return a+Math.random()*(b-a)};
    function paint(){
      W=box.clientWidth;H=box.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgb(136,123,103)');g.addColorStop(.6,'rgb(106,94,77)');g.addColorStop(1,'rgb(66,54,41)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      var i,x,y,r,rg;
      for(i=0;i<16;i++){x=R(0,W);y=R(0,H);r=R(30,120);rg=ctx.createRadialGradient(x,y,0,x,y,r);
        rg.addColorStop(0,Math.random()<.5?'rgba(40,32,24,.3)':'rgba(196,184,160,.22)');rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.fillRect(x-r,y-r,2*r,2*r);}
      for(i=0;i<W*H/260;i++){ctx.fillStyle='rgba('+(R(30,90)|0)+','+(R(24,70)|0)+','+(R(16,50)|0)+','+R(.08,.4).toFixed(2)+')';ctx.beginPath();ctx.arc(R(0,W),R(0,H),R(.3,1.6),0,7);ctx.fill();}
      for(i=0;i<10;i++){x=R(0,W);y=R(0,H*.3);ctx.strokeStyle='rgba(205,195,175,'+R(.08,.2).toFixed(2)+')';ctx.lineWidth=R(1.5,5);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+R(-4,4),y+H*.2,x+R(-5,5),y+H*.45,x+R(-3,3),y+H*R(.5,.8));ctx.stroke();}
      for(i=0;i<26;i++){x=R(0,W);y=H-Math.pow(Math.random(),2.2)*H*.5;r=R(2,10);ctx.fillStyle='rgba(38,28,18,'+R(.4,.85).toFixed(2)+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
        for(var k=0;k<4;k++){ctx.beginPath();ctx.arc(x+R(-r*2.4,r*2.4),y+R(-r*2.4,r*2.4),R(.6,r*.35),0,7);ctx.fill();}}
      ctx.save();ctx.translate(W/2,H*.5);ctx.rotate(-.08);var fs=Math.min(W*.24,H*.36);
      ctx.font='400 '+fs+'px Marker, "Comic Sans MS", cursive';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.shadowColor='rgba(214,204,184,.55)';ctx.shadowBlur=fs*.05;ctx.shadowOffsetY=fs*.012;ctx.fillStyle='rgba(20,17,14,.9)';
      ctx.fillText('WASCH',0,-fs*.5);ctx.fillText('MICH!',0,fs*.5);ctx.restore();
    }
    function mark(x,y,r){var x0=Math.max(0,Math.floor((x-r)/W*GX)),x1=Math.min(GX-1,Math.floor((x+r)/W*GX)),y0=Math.max(0,Math.floor((y-r)/H*GY)),y1=Math.min(GY-1,Math.floor((y+r)/H*GY));
      for(var gy=y0;gy<=y1;gy++)for(var gx=x0;gx<=x1;gx++){var k=gy*GX+gx;if(!grid[k]){grid[k]=1;cleared++}}}
    function dab(x,y,r){var rg=ctx.createRadialGradient(x,y,r*.4,x,y,r);rg.addColorStop(0,'rgba(0,0,0,1)');rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();mark(x,y,r*.7)}
    function wipe(e){if(done)return;var b=c.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,r=Math.max(26,W*.085);touched=true;
      ctx.globalCompositeOperation='destination-out';
      if(last){var dx=x-last.x,dy=y-last.y,n=Math.max(1,Math.ceil(Math.sqrt(dx*dx+dy*dy)/(r/3)));for(var i=1;i<=n;i++)dab(last.x+dx*i/n,last.y+dy*i/n,r);}else dab(x,y,r);
      ctx.globalCompositeOperation='source-over';last={x:x,y:y};
      if(cleared/(GX*GY)>.55)finish();}
    function finish(){if(done)return;done=true;try{localStorage.setItem('dc-code',code)}catch(e){}
      c.style.opacity=0;box.classList.remove('dirty');box.classList.add('won','pop');setTimeout(function(){c.remove()},700);}
    c.addEventListener('pointermove',wipe);c.addEventListener('pointerdown',function(e){last=null;wipe(e)});
    c.addEventListener('pointerleave',function(){last=null});c.addEventListener('pointerup',function(){last=null});
    var rs;window.addEventListener('resize',function(){if(touched||done)return;clearTimeout(rs);rs=setTimeout(paint,150)});
    paint();if(d.fonts&&d.fonts.load)d.fonts.load('400 60px Marker').then(function(){if(!touched&&!done)paint()}).catch(function(){});
  });
})();
