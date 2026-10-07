/* ============================================================
   HHP PAPER — slideshow.js
   Wires prev/next buttons and dot indicators for every
   .slideshow with data-sl="KEY" buttons.
   ============================================================ */
(function(){
  "use strict";
  function initSlideshow(slId, dotsId){
    const sl = document.getElementById(slId);
    const dotsEl = document.getElementById(dotsId);
    if(!sl) return;

    const items = Array.from(sl.querySelectorAll('.slide-item'));
    if(!items.length) return;

    // build dots
    if(dotsEl){
      items.forEach((_, i)=>{
        const d = document.createElement('span');
        d.className = 'sdot' + (i===0?' on':'');
        d.addEventListener('click', ()=> scrollTo(i));
        dotsEl.appendChild(d);
      });
    }

    function getActive(){
      const mid = sl.scrollLeft + sl.clientWidth/2;
      let best=0, bestDist=Infinity;
      items.forEach((el,i)=>{ const dist = Math.abs(el.offsetLeft + el.offsetWidth/2 - mid); if(dist<bestDist){ bestDist=dist; best=i; } });
      return best;
    }
    function updateDots(){
      if(!dotsEl) return;
      const a = getActive();
      Array.from(dotsEl.children).forEach((d,i)=> d.classList.toggle('on', i===a));
    }
    function scrollTo(i){
      items[i].scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'});
    }

    sl.addEventListener('scroll', updateDots, {passive:true});

    // wire buttons
    document.querySelectorAll('[data-sl="'+slId.replace('sl-','')+'"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const cur = getActive();
        const next = Math.max(0, Math.min(items.length-1, cur + (parseInt(btn.dataset.dir)||1)));
        scrollTo(next);
      });
    });
  }

  // auto-discover all slideshows in the page
  document.querySelectorAll('.slideshow[id]').forEach(sl=>{
    const id = sl.id; // e.g. sl-hp-ext
    const key = id.replace('sl-',''); // hp-ext
    const dotsId = 'dots-' + key;
    initSlideshow(id, dotsId);
  });
})();
