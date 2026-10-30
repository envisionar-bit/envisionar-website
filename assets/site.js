(()=>{
  const $=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

  // shared chrome for every page: menu overlay, contact fab, reveals, count-up, pointer effects
  // menu overlay
  const menu=document.getElementById('menu'),btn=$('.menu-btn')[0];
  const setMenu=o=>{menu.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.textContent=o?'Close':'Menu';document.body.style.overflow=o?'hidden':''};
  btn.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  $('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  // contact fab
  const fab=document.getElementById('fab'),fb=$('.fab-btn')[0];
  fb.addEventListener('click',()=>{const o=!fab.classList.contains('open');fab.classList.toggle('open',o);fb.setAttribute('aria-expanded',o)});
  $('.fab-top')[0].addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
  addEventListener('scroll',()=>fab.classList.toggle('scrolled',scrollY>600),{passive:true});

  // reveal on scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $('.rv').forEach(el=>io.observe(el));

  // count-up
  $('[data-count]').forEach(el=>{
    const end=+el.dataset.count;
    new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();if(reduce)return;
      const t0=performance.now(),dur=1500,tick=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(end*(1-Math.pow(1-p,4)));if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)},{threshold:.5}).observe(el);
  });

  if(reduce||!fine)return;

  // hero tiles drift with the pointer
  const hero=document.getElementById('top'),stage=document.getElementById('stage');
  if(hero&&stage){
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();
      stage.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*2);stage.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*2)});
    hero.addEventListener('pointerleave',()=>{stage.style.setProperty('--px',0);stage.style.setProperty('--py',0)});
  }

  // "View" cursor over work + archive
  const cur=document.getElementById('cur');
  if(cur&&$('.w,.arch a,.pc').length){let cx=0,cy=0,tx=0,ty=0,live=false;
  const loop=()=>{cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)};loop();
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!live){cx=tx;cy=ty;live=true}},{passive:true});
  $('.w,.arch a,.pc').forEach(a=>{a.addEventListener('pointerenter',()=>cur.classList.add('on'));a.addEventListener('pointerleave',()=>cur.classList.remove('on'))});
  }

  // service rows: floating preview that trails the cursor
  const peek=document.getElementById('peek');
  if(peek){const pi=peek.querySelector('img');let px=0,py=0,qx=0,qy=0;
  const ploop=()=>{px+=(qx-px)*.14;py+=(qy-py)*.14;peek.style.translate=`${px+26}px ${py-70}px`;peek.style.rotate=((qx-px)*.04)+'deg';requestAnimationFrame(ploop)};ploop();
  $('[data-peek]').forEach(a=>{
    const im=new Image();im.src=a.dataset.peek;
    a.addEventListener('pointerenter',()=>{pi.src=a.dataset.peek;peek.classList.add('on')});
    a.addEventListener('pointerleave',()=>peek.classList.remove('on'));
    a.addEventListener('pointermove',e=>{qx=e.clientX;qy=e.clientY});
  });
  }
})();
