(()=>{
  // shrink the title until its longest word fits the column
  const h=document.querySelector('.phero h1 .l');
  if(!h)return;
  const fit=()=>{
    h.style.fontSize='';
    let fs=parseFloat(getComputedStyle(h).fontSize),n=0;
    while(h.scrollWidth>h.clientWidth+1&&n++<40){fs*=.96;h.style.fontSize=fs+'px'}
  };
  fit();
  addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
})();
(()=>{
  // click a swatch to copy its hex
  const note=document.querySelector('.pal-note');
  document.querySelectorAll('.pal button').forEach(b=>b.addEventListener('click',()=>{
    const hex=b.dataset.hex;
    (navigator.clipboard?navigator.clipboard.writeText(hex):Promise.reject()).then(()=>{if(note)note.textContent='Copied '+hex},()=>{if(note)note.textContent=hex});
  }));

  // lightbox for the gallery
  const items=[...document.querySelectorAll('.pi')],lb=document.getElementById('lb');
  if(!items.length||!lb)return;
  const im=lb.querySelector('img'),cap=lb.querySelector('figcaption');let i=0;
  const show=n=>{i=(n+items.length)%items.length;const f=items[i];im.src=f.dataset.full||f.querySelector('img').src;im.alt=f.querySelector('img').alt;cap.textContent=f.dataset.cap||''};
  const open=n=>{show(n);lb.classList.add('open');document.body.style.overflow='hidden'};
  const close=()=>{lb.classList.remove('open');document.body.style.overflow=''};
  items.forEach((f,n)=>f.addEventListener('click',()=>open(n)));
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.pv').addEventListener('click',()=>show(i-1));
  lb.querySelector('.nx').addEventListener('click',()=>show(i+1));
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
})();
