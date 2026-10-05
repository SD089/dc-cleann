(function(){
  var d=document,root=d.documentElement;root.classList.add('js');
  // Menü
  var burger=d.querySelector('.burger');
  if(burger){burger.addEventListener('click',function(){var o=root.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    d.querySelectorAll('.nav nav a').forEach(function(a){a.addEventListener('click',function(){root.classList.remove('open')})});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')root.classList.remove('open')});}
  // Einblenden beim Scrollen
  var rv=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){io.observe(el)});}
  else rv.forEach(function(el){el.classList.add('in')});
  // Leuchten folgt der Maus
  d.querySelectorAll('.tile').forEach(function(t){t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px')})});
  // Vorher/Nachher
  d.querySelectorAll('.cmp').forEach(function(c){var i=c.querySelector('input');i.addEventListener('input',function(){c.style.setProperty('--p',i.value+'%')})});
  // Preisrechner
  var eur=function(n){return n.toLocaleString('de-DE')+' €'};
  d.querySelectorAll('.cfg').forEach(function(cfg){
    var boxes=cfg.querySelectorAll('input[type=checkbox]'),out=cfg.querySelector('output'),go=cfg.querySelector('[data-go]');
    var pre=(new URLSearchParams(location.search).get('l')||'').split(',');
    boxes.forEach(function(b){if(pre.indexOf(b.value)>-1)b.checked=true});
    function upd(){var s=0,ids=[];boxes.forEach(function(b){if(b.checked){s+=+b.dataset.price;ids.push(b.value)}});
      if(out)out.textContent=eur(s);if(go)go.href='kontakt.html'+(ids.length?'?l='+ids.join(','):'');}
    boxes.forEach(function(b){b.addEventListener('change',upd)});upd();
  });
  // Anfrage per E-Mail
  var f=d.getElementById('anfrage');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();
    var v=function(id){return d.getElementById(id).value.trim()},svc=[],sum=0;
    f.querySelectorAll('input[type=checkbox]:checked').forEach(function(b){svc.push(b.dataset.name+' ('+b.dataset.price+' €)');sum+=+b.dataset.price});
    var body='Hallo DC Clean,\n\nich möchte einen Termin anfragen.\n\nName: '+v('a-name')+'\nFahrzeug: '+v('a-auto')+'\nLeistungen: '+(svc.length?svc.join(', ')+'\nSumme: '+sum+' €':'noch offen')+'\nWunschtermin: '+v('a-termin')+(v('a-msg')?'\n\nNachricht: '+v('a-msg'):'')+'\n\nViele Grüße\n'+v('a-name');
    location.href='mailto:info@dc-clean.de?subject='+encodeURIComponent('Terminanfrage '+v('a-auto'))+'&body='+encodeURIComponent(body)});
})();
