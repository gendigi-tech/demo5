/* ============================================================
   HHP PAPER — interactions
   ============================================================ */
(function(){
  "use strict";
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
  const motionOn = ()=> getComputedStyle(document.documentElement).getPropertyValue('--motion').trim() !== '0';

  /* header, nav, language toggle, reveal-on-scroll & counters are handled by chrome.js */

  // stage triggers (eco/cap/mindmap) for line drawing
  const stageIO = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); stageIO.unobserve(en.target);} });
  }, {threshold:.25});
  ['#ecoFlow','#capStage','#mindmap'].forEach(s=>{ const el=$(s); if(el) stageIO.observe(el); });

  /* ---------- hero parallax + tilt ---------- */
  const orbs = $$('.hero-orb');
  const bcenter = $('.hero-bcenter');
  window.addEventListener('scroll', ()=>{
    if(!motionOn()) return;
    const y = window.scrollY;
    orbs.forEach(o=>{ o.style.transform = `translateY(${y*parseFloat(o.dataset.speed)}px)`; });
    if(bcenter && y < window.innerHeight) bcenter.style.transform = `translate(-50%,calc(-50% + ${y*0.12}px)) rotate(${y*0.02}deg)`;
  }, {passive:true});

  const tilt = $('#heroTilt');
  if(tilt){
    const side = tilt.closest('.hero-side');
    side.addEventListener('pointermove', (e)=>{
      if(!motionOn()) return;
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      tilt.style.transform = `perspective(900px) rotateY(${px*7}deg) rotateX(${-py*7}deg) translateZ(0)`;
    });
    side.addEventListener('pointerleave', ()=>{ tilt.style.transform=''; });
  }

  /* ---------- ecosystem connected flow ---------- */
  function drawEcoFlow(){
    const flow=$('#ecoFlow'); const svg=$('#ecoTrack'); if(!flow||!svg) return;
    const fr=flow.getBoundingClientRect();
    const W=fr.width, H=fr.height;
    if(W<2||H<2){ svg.innerHTML=''; return; }
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const nodes=$$('.eco-node2',flow).map(n=>{ const r=n.getBoundingClientRect(); return {x:r.left+r.width/2-fr.left, y:r.top+r.height/2-fr.top}; });
    if(nodes.length<2){ svg.innerHTML=''; return; }
    let d='M'+nodes[0].x.toFixed(1)+','+nodes[0].y.toFixed(1);
    let len=0;
    for(let i=1;i<nodes.length;i++){ const a=nodes[i-1],b=nodes[i],mx=(a.x+b.x)/2;
      d+=` C${mx.toFixed(1)},${a.y.toFixed(1)} ${mx.toFixed(1)},${b.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
      len+=Math.hypot(b.x-a.x,b.y-a.y); }
    len=Math.round(len*1.3);
    svg.innerHTML=`<path class="base" d="${d}" style="--len:${len}"/><path class="flow" d="${d}"/>`;
  }

  /* ---------- mindmap flow line ---------- */
  function drawMindmap(){
    const mm=$('#mindmap'); const svg=$('#mmArrows'); if(!mm||!svg) return;
    const track=$('.mindmap-track',mm); const tr=track.getBoundingClientRect();
    const W=1000,H=120;
    const nodes=$$('.mm-node',track).map(n=>{ const r=n.getBoundingClientRect(); return {x:(r.left+r.width/2-tr.left)/tr.width*W, w:r.width/tr.width*W}; });
    if(nodes.length<2){ svg.innerHTML=''; return; }
    let d='M'+nodes[0].x+',60';
    for(let i=1;i<nodes.length;i++){ const a=nodes[i-1].x, b=nodes[i].x, m=(a+b)/2; d+=` C${m},60 ${m},60 ${b},60`; }
    svg.innerHTML = `<path d="${d}"/>`;
  }

  function redraw(){ drawEcoFlow(); drawMindmap(); }
  let rt; window.addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(redraw,150); });
  // initial + after fonts/layout settle
  redraw(); setTimeout(redraw,400); window.addEventListener('load', ()=> setTimeout(redraw,200));

  /* ============================================================
     STOCK WIDGET — simulated live (demo). API-ready.
     ============================================================ */
  (function stock(){
    const wrap=$('#stockWidget'); if(!wrap) return;
    const W=600,H=140, N=64;
    let base=28.4, price=base, open=base;
    const series=[];
    // seed a realistic-ish intraday path
    let p=base*0.985;
    for(let i=0;i<N;i++){ p += (Math.random()-0.46)*0.22; series.push(p); }
    open = series[0]; price = series[N-1];

    const line=$('#stLine'), area=$('#stArea'), cursor=$('#stCursor');
    const elP=$('#stPrice'), elChg=$('#stChg'), elO=$('#stOpen'), elH=$('#stHigh'), elL=$('#stLow'), elV=$('#stVol');
    let vol = 1.24; // million

    function fmt(n){ return n.toFixed(2); }
    function render(progress){
      const n = progress==null ? series.length : Math.max(2, Math.floor(series.length*progress));
      const data = series.slice(0,n);
      const min=Math.min(...series)*0.998, max=Math.max(...series)*1.002;
      const sx=i=> i/(series.length-1)*W;
      const sy=v=> H - (v-min)/(max-min)*H;
      let dl='M'+sx(0)+','+sy(data[0]);
      data.forEach((v,i)=>{ if(i) dl+=' L'+sx(i)+','+sy(v); });
      line.setAttribute('d',dl);
      area.setAttribute('d', dl+` L${sx(n-1)},${H} L0,${H} Z`);
      const last=data[n-1];
      cursor.setAttribute('cx', sx(n-1)); cursor.setAttribute('cy', sy(last));
      // stats
      price=last;
      const chg=price-open, pct=chg/open*100, up=chg>=0;
      elP.textContent=fmt(price);
      const cls = up?'up':'down';
      elChg.className='chg '+cls;
      elChg.querySelector('span').textContent = `${up?'+':''}${fmt(chg)} (${up?'+':''}${pct.toFixed(2)}%)`;
      elChg.querySelector('use').setAttribute('href', up?'#i-up':'#i-up');
      elChg.querySelector('svg').style.transform = up?'none':'rotate(180deg)';
      elO.textContent=fmt(open);
      elH.textContent=fmt(Math.max(...data));
      elL.textContent=fmt(Math.min(...data));
      elV.textContent=vol.toFixed(2)+'M';
      // recolor line/cursor by direction
      const col = up? '#46d98a':'#ff7a6b';
      line.style.stroke=col; cursor.style.fill=col;
      const grad=document.querySelector('#stockgrad stop'); if(grad) grad.setAttribute('stop-color',col);
    }

    // build-in animation when revealed
    let started=false;
    const sio=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting && !started){ started=true; sio.disconnect();
        if(!motionOn()){ render(); startLive(); return; }
        const t0=performance.now(), dur=1100;
        (function go(now){ const pr=Math.min(1,(now-t0)/dur); render(0.2+0.8*pr); if(pr<1) requestAnimationFrame(go); else startLive(); })(t0);
      }});
    },{threshold:.3});
    sio.observe(wrap);

    function startLive(){
      render();
      setInterval(()=>{
        const drift=(Math.random()-0.47)*0.14;
        series.push(series[series.length-1]+drift);
        series.shift();
        vol += Math.random()*0.03;
        render();
      }, 2200);
    }
  })();

  /* ============================================================
     LEAD FORM
     ============================================================ */
  (function form(){
    const f=$('#leadForm'); if(!f) return;
    const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validate(){
      let ok=true;
      const name=f.querySelector('[name=name]'), email=f.querySelector('[name=email]');
      [name,email].forEach(inp=> inp.closest('.field').classList.remove('invalid'));
      if(!name.value.trim()){ name.closest('.field').classList.add('invalid'); ok=false; }
      if(!emailRe.test(email.value.trim())){ email.closest('.field').classList.add('invalid'); ok=false; }
      return ok;
    }
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!validate()) return;
      $('#formBody').style.display='none';
      $('#formSuccess').classList.add('show');
    });
    f.querySelectorAll('input').forEach(inp=> inp.addEventListener('input', ()=> inp.closest('.field').classList.remove('invalid')));
  })();

  /* ============================================================
     HERO BACKGROUND VIDEO
     >>> Dán link video nền của bạn vào HERO_VIDEO_URL bên dưới <<<
     (định dạng .mp4/.webm, hoặc link trực tiếp tới file video)
     ============================================================ */
  const HERO_VIDEO_URL = "";   // <-- file .mp4/.webm (\u01b0u ti\u00ean n\u1ebfu c\u00f3)
  const HERO_YOUTUBE_ID = "BkMN1dW1mYQ";   // <-- ID video YouTube n\u1ec1n hero (\u0111\u1ec3 "" n\u1ebfu kh\u00f4ng d\u00f9ng)
  (function heroVideo(){
    const hero=$('#hero'); if(!hero) return;
    const media=$('.hero-media',hero);
    if(HERO_VIDEO_URL){
      const v=$('#heroVideo'); v.src=HERO_VIDEO_URL;
      hero.classList.add('has-video','has-mp4');
      const p=v.play&&v.play(); if(p&&p.catch) p.catch(()=>{});
    } else if(HERO_YOUTUBE_ID && media){
      const id=HERO_YOUTUBE_ID;
      const ifr=document.createElement('iframe');
      ifr.className='hero-yt';
      ifr.src=`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;
      ifr.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
      ifr.setAttribute('frameborder','0');
      ifr.setAttribute('title','HHPPaper');
      ifr.setAttribute('aria-hidden','true');
      ifr.setAttribute('tabindex','-1');
      media.appendChild(ifr);
      hero.classList.add('has-video');
    }
  })();

  /* ============================================================
     ECOSYSTEM — connected flow interaction + detail panel
     ============================================================ */
  (function ecosystem(){
    const flow=$('#ecoFlow'); const detail=$('#ecoDetail'); if(!flow||!detail) return;
    const DATA={
      green:{flagVi:'H\u1ec7 sinh th\u00e1i',flagEn:'Ecosystem',
        titleVi:'GO <b>GREEN</b>',titleEn:'GO <b>GREEN</b>',
        descVi:'Tri\u1ebft l\u00fd ph\u00e1t tri\u1ec3n b\u1ec1n v\u1eefng xuy\u00ean su\u1ed1t HHP Global \u2014 k\u1ebft n\u1ed1i t\u00e1i ch\u1ebf, n\u0103ng l\u01b0\u1ee3ng, b\u1ea5t \u0111\u1ed9ng s\u1ea3n v\u00e0 an c\u01b0 th\u00e0nh m\u1ed9t chu\u1ed7i gi\u00e1 tr\u1ecb tu\u1ea7n ho\u00e0n.',
        descEn:"HHP Global's sustainability philosophy \u2014 connecting recycling, energy, real estate and living into one circular value chain.",
        color:'var(--green-500)',icBg:'var(--green-050)',mark:'#1f8f4d',href:'#esg',ctaVi:'T\u00ecm hi\u1ec3u ESG',ctaEn:'Explore ESG'},
      paper:{flagVi:'Tr\u1ecdng t\u00e2m',flagEn:'Focus',
        titleVi:'HHP <b>Paper</b>',titleEn:'HHP <b>Paper</b>',
        descVi:'S\u1ea3n xu\u1ea5t gi\u1ea5y bao b\u00ec t\u1eeb gi\u1ea5y thu h\u1ed3i \u2014 m\u1eaft x\u00edch trung t\u00e2m c\u1ee7a h\u1ec7 sinh th\u00e1i, kh\u00e9p k\u00edn v\u00f2ng tu\u1ea7n ho\u00e0n t\u1eeb thu gom \u0111\u1ebfn th\u00e0nh ph\u1ea9m.',
        descEn:'Packaging paper made from recovered fibre \u2014 the core link of the ecosystem, closing the loop from collection to finished rolls.',
        color:'var(--accent)',icBg:'var(--accent-100)',mark:'#0167B1',href:'#products',ctaVi:'Xem s\u1ea3n ph\u1ea9m',ctaEn:'View products'},
      energy:{flagVi:'Tr\u1ee5 c\u1ed9t',flagEn:'Pillar',
        titleVi:'HHP <span style="color:var(--primary)">Energy</span>',titleEn:'HHP <span style="color:var(--primary)">Energy</span>',
        descVi:'N\u0103ng l\u01b0\u1ee3ng s\u1ea1ch & t\u00e1i t\u1ea1o \u2014 \u0111i\u1ec7n m\u1eb7t tr\u1eddi, sinh kh\u1ed1i c\u1ea5p n\u0103ng l\u01b0\u1ee3ng cho s\u1ea3n xu\u1ea5t xanh.',
        descEn:'Clean & renewable energy \u2014 solar and biomass powering green production.',
        color:'var(--primary)',icBg:'var(--blue-050)',mark:'#0167B1',href:'#esg',ctaVi:'T\u00ecm hi\u1ec3u th\u00eam',ctaEn:'Learn more'},
      land:{flagVi:'Tr\u1ee5 c\u1ed9t',flagEn:'Pillar',
        titleVi:'HHP <span style="color:var(--primary)">Land</span>',titleEn:'HHP <span style="color:var(--primary)">Land</span>',
        descVi:'B\u1ea5t \u0111\u1ed9ng s\u1ea3n c\u00f4ng nghi\u1ec7p \u2014 ph\u00e1t tri\u1ec3n h\u1ea1 t\u1ea7ng nh\u00e0 x\u01b0\u1edfng, kho b\u00e3i ph\u1ee5c v\u1ee5 chu\u1ed7i cung \u1ee9ng.',
        descEn:'Industrial real estate \u2014 developing factory and warehouse infrastructure for the supply chain.',
        color:'var(--primary)',icBg:'var(--blue-050)',mark:'#0167B1',href:'#contact',ctaVi:'Li\u00ean h\u1ec7',ctaEn:'Contact us'},
      homes:{flagVi:'Tr\u1ee5 c\u1ed9t',flagEn:'Pillar',
        titleVi:'HHP <span style="color:var(--primary)">Homes</span>',titleEn:'HHP <span style="color:var(--primary)">Homes</span>',
        descVi:'An c\u01b0 b\u1ec1n v\u1eefng \u2014 ki\u1ebfn t\u1ea1o kh\u00f4ng gian s\u1ed1ng xanh cho c\u1ed9ng \u0111\u1ed3ng.',
        descEn:'Sustainable living \u2014 creating green living spaces for the community.',
        color:'var(--primary)',icBg:'var(--blue-050)',mark:'#0167B1',href:'#contact',ctaVi:'Li\u00ean h\u1ec7',ctaEn:'Contact us'}
    };
    let active='paper';
    const flag=$('#ecoFlag'),title=$('#ecoTitle'),desc=$('#ecoDesc'),cta=$('#ecoCta'),
          dic=$('.d-ic',detail),dmark=$('.d-ic .mark',detail);
    function paint(){
      const d=DATA[active]; if(!d) return;
      const en=document.documentElement.lang==='en';
      flag.textContent = en?d.flagEn:d.flagVi; flag.style.color=d.color;
      title.innerHTML = en?d.titleEn:d.titleVi;
      desc.textContent = en?d.descEn:d.descVi;
      detail.style.borderLeftColor=d.color;
      if(dic) dic.style.background=d.icBg;
      if(dmark) dmark.style.setProperty('--mark-fill',d.mark);
      cta.setAttribute('href',d.href);
      cta.style.setProperty('--bg',d.color);
      let tn=Array.from(cta.childNodes).find(n=>n.nodeType===3);
      if(tn) tn.nodeValue=(en?d.ctaEn:d.ctaVi)+' ';
      cta.setAttribute('data-en',d.ctaEn); cta.setAttribute('data-vi',d.ctaVi);
    }
    function select(key){
      if(!DATA[key]) return; active=key;
      $$('.eco-node2',flow).forEach(x=>x.classList.toggle('active', x.dataset.key===key));
      detail.classList.add('swap');
      setTimeout(()=>{ paint(); detail.classList.remove('swap'); }, 160);
    }
    const canHover = window.matchMedia('(hover:hover)').matches;
    $$('.eco-node2',flow).forEach(n=>{
      n.addEventListener('click', ()=> select(n.dataset.key));
      if(canHover) n.addEventListener('mouseenter', ()=> select(n.dataset.key));
    });
    window.__ecoRender = paint;   // keep detail text in sync on language switch
    paint();
  })();

  /* ---- factory cards: tap to expand on touch ---- */
  (function facCards(){
    document.querySelectorAll('.cap-cards .fac').forEach(card=>{
      card.addEventListener('click', e=>{
        if(e.target.closest('.fac__link')) return; // let link navigate
        card.classList.toggle('open');
      });
    });
  })();

  /* ============================================================
     PROCESS SCROLL — sticky nav + expand on scroll
     ============================================================ */
  (function processNav(){
    const nav = document.querySelector('.process-nav');
    if(!nav) return;
    const items = Array.from(nav.querySelectorAll('.process-nav-item'));
    const steps = items.map(it => document.getElementById(it.dataset.target)).filter(Boolean);
    // click → scroll to step
    items.forEach((it, i) => it.addEventListener('click', ()=>{
      steps[i].scrollIntoView({behavior:'smooth', block:'center'});
    }));
    // click a collapsed card → expand it
    steps.forEach((s,i)=> s.addEventListener('click', ()=>{
      steps.forEach((x,j)=> x.classList.toggle('expanded', j===i));
      items.forEach((x,j)=> x.classList.toggle('on', j===i));
    }));
    // accordion on scroll: only the step in view is expanded, others collapse → compact
    const io = new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        const idx = steps.indexOf(en.target);
        if(idx === -1 || !en.isIntersecting) return;
        steps.forEach((s,i)=> s.classList.toggle('expanded', i===idx));
        items.forEach((x,i)=> x.classList.toggle('on', i===idx));
      });
    }, {threshold:0.55, rootMargin:'-30% 0px -30% 0px'});
    steps.forEach(s => io.observe(s));
    // safety: expand first step immediately if already in view
    setTimeout(()=>{ if(steps[0] && !steps.some(s=>s.classList.contains('expanded'))){ steps[0].classList.add('expanded'); items[0].classList.add('on'); } }, 400);
  })();

  /* ============================================================
     FACTORY SLIDER — glowing map + slide engine + counters
     ============================================================ */
  (function factorySlider(){
    const slides = $$('.fac-slide');
    const inds   = $$('.fac-ind');
    if(!slides.length) return;

    /* ---- Glowing Vietnam SVG map ---- */
    const VN_PATH = 'M155,16 C165,14 190,12 215,18 C240,24 262,38 268,60 C272,72 268,86 264,100 L260,120 L258,142 L260,164 L258,188 C255,198 252,210 248,222 L242,240 C240,254 244,268 250,280 L258,300 C262,316 266,330 262,344 C258,358 248,368 238,374 C225,380 210,380 196,376 C178,372 162,364 148,356 L130,345 L112,346 L100,354 C90,360 82,355 76,344 C70,332 68,316 70,302 L72,282 L74,260 L74,238 L76,218 L78,198 C80,186 78,174 76,162 L72,140 L70,118 L70,96 C70,82 72,70 78,60 C86,46 102,32 125,22 Z';
    const DOTS = [
      [224,78],[250,115],[256,148],[254,190],[250,228],[248,258],[256,288],
      [258,310],[248,340],[226,360],[196,372],[166,358],[136,344],[112,344],
      [88,340],[78,318],[72,292],[72,262],[74,232],[76,202],[74,172],
      [70,148],[70,118],[72,90],[82,62],[105,30],[138,18],[172,14]
    ];
    const PINS = {
      hp:  {x:242, y:96,  label:'Hải Phòng', sub:'100K tấn/năm', glow:'rgba(245,116,69,.7)'},
      py:  {x:256, y:298, label:'Phú Yên',   sub:'128K tấn/năm', glow:'rgba(245,116,69,.7)'},
    };

    function buildMap(container, activePins=[]){
      if(!container) return;
      const pinSVG = activePins.map(key=>{
        const p = PINS[key];
        return `
          <circle class="map-pin-ring" cx="${p.x}" cy="${p.y}" r="16" stroke="${p.glow}" style="animation-delay:${key==='py'?'.4s':'0s'}"/>
          <circle class="map-pin-outer" cx="${p.x}" cy="${p.y}" r="9"/>
          <circle class="map-pin-dot" cx="${p.x}" cy="${p.y}" r="4"/>
          <text class="map-label" x="${p.x<160?p.x-8:p.x+14}" y="${p.y-4}" text-anchor="${p.x<160?'end':'start'}">${p.label}</text>
          <text class="map-sublabel" x="${p.x<160?p.x-8:p.x+14}" y="${p.y+10}" text-anchor="${p.x<160?'end':'start'}">${p.sub}</text>`;
      }).join('');
      const dotSVG = DOTS.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3===0?2.5:1.5}" fill="rgba(0,161,221,.6)" opacity="${0.4+Math.random()*.5}"/>`).join('');
      container.innerHTML = `<svg viewBox="0 0 330 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-${container.id}" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="pglow-${container.id}" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <!-- bg fill -->
        <path d="${VN_PATH}" class="vn-bg"/>
        <!-- glow outline -->
        <path d="${VN_PATH}" fill="none" stroke="rgba(0,161,221,.85)" stroke-width="1.5" filter="url(#glow-${container.id})"/>
        <!-- crisp inner outline -->
        <path d="${VN_PATH}" fill="none" stroke="rgba(0,161,221,.55)" stroke-width=".8"/>
        <!-- network dots -->
        <g class="vn-dots">${dotSVG}</g>
        <!-- islands -->
        <circle cx="296" cy="196" r="3" fill="rgba(0,161,221,.5)"/>
        <circle cx="303" cy="200" r="2" fill="rgba(0,161,221,.4)"/>
        <text x="296" y="185" text-anchor="middle" class="map-sublabel" style="fill:rgba(255,255,255,.5)">HOÀNG SA</text>
        <circle cx="302" cy="368" r="3" fill="rgba(0,161,221,.4)"/>
        <text x="302" y="358" text-anchor="middle" class="map-sublabel" style="fill:rgba(255,255,255,.4)">TRƯỜNG SA</text>
        <!-- pins -->
        ${pinSVG}
      </svg>`;
    }

    // inject maps after DOM is settled
    setTimeout(()=>{ /* maps are now static SVGs in HTML */ }, 0);

    /* ---- counter re-trigger ---- */
    function fmt(n,v){ return v>=1000? Math.round(v).toLocaleString('vi-VN') : String(Math.round(v)); }
    function runSlideCounters(slide){
      $$('[data-count]', slide).forEach(el=>{
        delete el.dataset.done;
        const target=parseFloat(el.dataset.count), dur=1200, t0=performance.now();
        (function tick(now){
          const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
          el.textContent=fmt(null, target*e);
          if(p<1) requestAnimationFrame(tick);
          else el.textContent=fmt(null,target);
        })(t0);
      });
    }

    /* ---- entrance stagger ---- */
    function stagger(slide){
      const els = ['.fs-label','.fs-h','.fs-desc','.fs-counters','.fs-badge','.fs-cta','.fs-map'];
      els.forEach((s,i)=>{
        const el = $(s, slide); if(!el) return;
        el.style.opacity='0'; el.style.transform='translateY(22px)';
        const delay = i*90;
        setTimeout(()=>{
          el.style.transition=`opacity .5s ${delay}ms, transform .5s ${delay}ms`;
          el.style.opacity='1'; el.style.transform='none';
        }, 50);
      });
    }

    /* ---- slide engine ---- */
    let cur=0, timer=null;
    function goTo(i){
      slides[cur].classList.remove('active');
      inds[cur].classList.remove('active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('active');
      inds[cur].classList.add('active');
      stagger(slides[cur]);
      setTimeout(()=> runSlideCounters(slides[cur]), 80);
    }

    function startAuto(){ timer=setInterval(()=>goTo(cur+1), 5000); }
    function stopAuto(){ clearInterval(timer); }

    // wire indicators
    inds.forEach((btn,i)=> btn.addEventListener('click',()=>{ stopAuto(); goTo(i); startAuto(); }));

    // pause on hover
    const wrap = $('#capacity'); if(wrap){ wrap.addEventListener('mouseenter',stopAuto); wrap.addEventListener('mouseleave',startAuto); }

    // init first slide
    stagger(slides[0]);
    setTimeout(()=> runSlideCounters(slides[0]), 80);
    startAuto();

    // observe section entrance
    const sio=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ runSlideCounters(slides[cur]); sio.disconnect(); } }); },{threshold:.25});
    if(wrap) sio.observe(wrap);
  })();

  /* ============================================================
     TWEAKS BRIDGE (called by app-tweaks.jsx)
     ============================================================ */
  const ACCENTS = {
    orange: { a:'#F57445', a6:'#e35a2c', a1:'#ffe5d8' },
    blue:   { a:'#0167B1', a6:'#024a82', a1:'#d6eefb' }
  };
  function applyTweaks(v){
    if(!v) return;
    const root=document.documentElement;
    if(v.accent && ACCENTS[v.accent]){
      const c=ACCENTS[v.accent];
      root.style.setProperty('--accent', c.a);
      root.style.setProperty('--accent-600', c.a6);
      root.style.setProperty('--accent-100', c.a1);
    }
    if(v.motion){ root.setAttribute('data-motion', v.motion); }
    if(v.hero){ const h=$('#hero'); if(h) h.classList.toggle('bg-gradient', v.hero==='gradient'); setTimeout(redraw,60); }
  }
  window.__applyTweaks = applyTweaks;
  window.addEventListener('tweakchange', (e)=> applyTweaks(e.detail));
})();


/* -------- Simple tabs (data-tabs) -------- */
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-tabs] .tt-btn');
  if(!btn) return;
  var box = btn.closest('[data-tabs]');
  var key = btn.getAttribute('data-tab');
  box.querySelectorAll('.tt-btn').forEach(function(b){ b.classList.toggle('active', b===btn); });
  box.querySelectorAll('.tt-panel').forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel')===key); });
});
