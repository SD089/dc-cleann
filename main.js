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
    var body='Hallo DC Clean,\n\nich möchte einen Termin anfragen.\n\nName: '+v('a-name')+'\nFahrzeug: '+v('a-auto')+'\nLeistungen: '+(svc.length?svc.join(', ')+'\nSumme: '+sum+' €':'noch offen')+'\nWunschtermin: '+v('a-termin')+(v('a-msg')?'\n\nNachricht: '+v('a-msg'):'')+'\n\nViele Grüße\n'+v('a-name');
    location.href='mailto:info@dc-clean.de?subject='+encodeURIComponent('Terminanfrage '+v('a-auto'))+'&body='+encodeURIComponent(body)});

  // Die dreckige Scheibe: Besucher wischt den Start sauber
  var hero=d.querySelector('.hero[data-dirt]');
  if(hero&&!reduce){
    var seen=false;try{seen=sessionStorage.getItem('dc-sauber')==='1'}catch(e){}
    if(!seen)startDirt();
  }
  function startDirt(){
    var c=d.createElement('canvas');c.className='dirt';c.setAttribute('aria-hidden','true');hero.appendChild(c);
    var hint=d.createElement('div');hint.className='wipehint';hint.innerHTML='<b>&larr; wisch mich sauber &rarr;</b><button type="button" class="stk">Überspringen</button>';hero.appendChild(hint);
    var ctx=c.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),touched=false,done=false;
    var GX=30,GY=18,grid=new Uint8Array(GX*GY),cleared=0,last=null;
    var R=function(a,b){return a+Math.random()*(b-a)};
    function paint(){
      W=hero.clientWidth;H=hero.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(132,120,101,.985)');g.addColorStop(.6,'rgba(104,92,75,.99)');g.addColorStop(1,'rgba(62,51,39,1)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      var i,x,y,r,rg;
      for(i=0;i<46;i++){x=R(0,W);y=R(0,H);r=R(80,320);rg=ctx.createRadialGradient(x,y,0,x,y,r);var dk=Math.random()<.5;
        rg.addColorStop(0,dk?'rgba(40,32,24,.28)':'rgba(190,178,156,.2)');rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.fillRect(x-r,y-r,2*r,2*r);}
      for(i=0;i<W*H/700;i++){ctx.fillStyle='rgba('+(R(30,90)|0)+','+(R(24,70)|0)+','+(R(16,50)|0)+','+R(.05,.35).toFixed(2)+')';ctx.beginPath();ctx.arc(R(0,W),R(0,H),R(.4,2.4),0,7);ctx.fill();}
      for(i=0;i<34;i++){x=R(0,W);y=R(0,H*.5);ctx.strokeStyle='rgba(200,190,170,'+R(.05,.16).toFixed(2)+')';ctx.lineWidth=R(2,9);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+R(-8,8),y+R(40,120),x+R(-10,10),y+R(140,260),x+R(-6,6),y+R(260,460));ctx.stroke();}
      for(i=0;i<90;i++){x=R(0,W);y=H-Math.pow(Math.random(),2.2)*H*.45;r=R(4,26);ctx.fillStyle='rgba(38,28,18,'+R(.35,.8).toFixed(2)+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
        for(var k=0;k<5;k++){ctx.beginPath();ctx.arc(x+R(-r*2.4,r*2.4),y+R(-r*2.4,r*2.4),R(1,r*.35),0,7);ctx.fill();}}
      // mit dem Finger in den Staub geschrieben
      ctx.save();ctx.translate(W/2,H*.44);ctx.rotate(-.07);
      var fs=Math.min(W*.19,H*.3);ctx.font='400 '+fs+'px Marker, "Comic Sans MS", cursive';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.shadowColor='rgba(214,204,184,.55)';ctx.shadowBlur=fs*.05;ctx.shadowOffsetY=fs*.012;ctx.fillStyle='rgba(20,17,14,.9)';
      if(W<700){ctx.fillText('WASCH',0,-fs*.52);ctx.fillText('MICH!',0,fs*.52);}else ctx.fillText('WASCH MICH!',0,0);
      ctx.restore();
    }
    function mark(x,y,r){var x0=Math.max(0,Math.floor((x-r)/W*GX)),x1=Math.min(GX-1,Math.floor((x+r)/W*GX)),y0=Math.max(0,Math.floor((y-r)/H*GY)),y1=Math.min(GY-1,Math.floor((y+r)/H*GY));
      for(var gy=y0;gy<=y1;gy++)for(var gx=x0;gx<=x1;gx++){var k=gy*GX+gx;if(!grid[k]){grid[k]=1;cleared++}}}
    function dab(x,y,r){var rg=ctx.createRadialGradient(x,y,r*.35,x,y,r);rg.addColorStop(0,'rgba(0,0,0,1)');rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();mark(x,y,r*.7)}
    function wipe(e){if(done)return;var b=c.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,r=e.pointerType==='touch'?Math.max(52,W*.11):Math.max(64,W*.055);
      if(!touched){touched=true;hint.querySelector('b').style.visibility='hidden'}
      ctx.globalCompositeOperation='destination-out';
      if(last){var dx=x-last.x,dy=y-last.y,n=Math.max(1,Math.ceil(Math.sqrt(dx*dx+dy*dy)/(r/3)));for(var i=1;i<=n;i++)dab(last.x+dx*i/n,last.y+dy*i/n,r);}else dab(x,y,r);
      ctx.globalCompositeOperation='source-over';last={x:x,y:y};
      if(cleared/(GX*GY)>.5)finish(true);}
    function finish(fade){if(done)return;done=true;hint.classList.add('gone');try{sessionStorage.setItem('dc-sauber','1')}catch(e){}
      if(fade){c.classList.add('gone');setTimeout(function(){c.remove();hint.remove()},1000);return}
      var sq=d.createElement('div');sq.className='squeegee';hero.appendChild(sq);var t0=null,dur=900;
      (function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),x=e*(W+40);ctx.clearRect(0,0,x,H);sq.style.left=(x-8)+'px';
        if(p<1)requestAnimationFrame(step);else{sq.remove();c.remove();hint.remove()}})(performance.now());}
    c.addEventListener('pointermove',wipe);c.addEventListener('pointerdown',function(e){last=null;wipe(e)});
    c.addEventListener('pointerleave',function(){last=null});c.addEventListener('pointerup',function(){last=null});
    hint.querySelector('button').addEventListener('click',function(){finish(false)});
    window.addEventListener('scroll',function(){if(window.scrollY>hero.clientHeight*.35)finish(false)},{passive:true});
    var rs;window.addEventListener('resize',function(){if(touched||done)return;clearTimeout(rs);rs=setTimeout(paint,150)});
    paint();if(d.fonts&&d.fonts.load)d.fonts.load('400 80px Marker').then(function(){if(!touched&&!done)paint()}).catch(function(){});
  }
})();
