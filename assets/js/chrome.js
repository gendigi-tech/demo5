/* ============================================================
   HHP PAPER — shared site chrome (header + footer + nav + common JS)
   Used on every page. Inject points: [data-chrome="header"] / [data-chrome="footer"].
   Active page: <body data-page="san-pham"> etc.
   ============================================================ */
(function(){
  "use strict";
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
  const HOME = "index.html";

  /* ---------- nav model ---------- */
  const NAV = [
    {key:'gioi-thieu', vi:'Giới thiệu', en:'About', href:'gioi-thieu.html', sub:[
      {vi:'Về HHPPaper', en:'About HHPPaper', href:'gioi-thieu.html#ve-hhp'},
      {vi:'Về HHP GLOBAL', en:'About HHP GLOBAL', href:'ve-hhp-global.html'},
      {vi:'Câu chuyện thương hiệu', en:'Brand story', href:'cau-chuyen-thuong-hieu.html'}]},
    {key:'san-pham', vi:'Sản phẩm', en:'Products', href:'san-pham.html', sub:[
      {vi:'Giấy Medium', en:'Medium', href:'chi-tiet-medium.html'},
      {vi:'Giấy Testliner', en:'Testliner', href:'chi-tiet-testliner.html'},
      {vi:'Giấy Kraftliner', en:'Kraftliner', href:'chi-tiet-kraftliner.html'}]},
    {key:'nang-luc', vi:'Năng lực sản xuất', en:'Capability', href:'nang-luc.html', sub:[
      {vi:'Hệ thống nhà máy', en:'Our factories', href:'nang-luc.html#nha-may'},
      {vi:'Nhà máy Hải Phòng', en:'Hải Phòng factory', href:'nha-may-hai-phong.html'},
      {vi:'Nhà máy Phú Yên', en:'Phú Yên factory', href:'nha-may-phu-yen.html'}]},
    {key:'tin-tuc', vi:'Tin tức', en:'News', href:'tin-tuc.html'},
    {key:'tuyen-dung', vi:'Tuyển dụng', en:'Careers', href:'tuyen-dung.html', sub:[
      {vi:'Tuyển dụng Hải Phòng', en:'Careers · Hải Phòng', href:'tuyen-dung-hai-phong.html'},
      {vi:'Tuyển dụng Phú Yên', en:'Careers · Phú Yên', href:'tuyen-dung-phu-yen.html'}]},
    {key:'lien-he', vi:'Liên hệ', en:'Contact', href:'lien-he.html'},
  ];

  /* ---------- SVG defs (emblem + icons) ---------- */
  const SVG_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <symbol id="hhp-mark" viewBox="0 0 120 120">
      <g fill="var(--mark-fill,#0167B1)"><rect x="35" y="12" width="22" height="96" rx="11"/><rect x="63" y="12" width="22" height="96" rx="11"/><rect x="12" y="35" width="96" height="22" rx="11"/><rect x="12" y="63" width="96" height="22" rx="11"/></g>
      <g fill="var(--mark-accent,#00A1DD)"><path d="M57 57 v-7 a7 7 0 0 1 7 7 z"/><path d="M63 63 v7 a7 7 0 0 1 -7 -7 z"/></g>
    </symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    <symbol id="i-recycle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.8a2 2 0 0 1-1.7-3l1.6-2.7M9.4 5.5l1.1-1.9a2 2 0 0 1 3.4 0l1.6 2.7M20.5 13l1.4 2.4a2 2 0 0 1-1.7 3H17M8 8l-3 .8L4.2 6M16 16l3-.8.8 2.8M14.5 5.7l-2.5 1.5"/></symbol>
    <symbol id="i-factory" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M4 21V9l6 4V9l6 4V6l4-2v17M8 21v-4M14 21v-4"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></symbol>
    <symbol id="i-co2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5M14 9.5h2.2a1.3 1.3 0 0 1 0 2.6h-1.4a1.3 1.3 0 0 0 0 2.6H17"/></symbol>
    <symbol id="i-water" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/></symbol>
    <symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></symbol>
    <symbol id="i-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h11v11H2zM13 8h4l3 3v5h-7M5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z"/></symbol>
    <symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></symbol>
    <symbol id="i-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></symbol>
    <symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M7 14l3-4 3 3 5-6"/></symbol>
    <symbol id="i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></symbol>
    <symbol id="i-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></symbol>
    <symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
    <symbol id="i-fb" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V5.5h-3c-2 0-3.5 1.6-3.5 3.6V11H8v3.5h2.5V22H14v-7.5h2.6l.4-3.5H14V9.4c0-.3.2-.4.5-.4z"/></symbol>
    <symbol id="i-in" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3zM5 9.5h3V19H5zM10 9.5h2.9v1.3c.4-.7 1.4-1.5 3-1.5 2.6 0 3.6 1.7 3.6 4.3V19h-3v-4.5c0-1.2-.4-2-1.5-2s-1.7.8-1.7 2V19h-3z"/></symbol>
    <symbol id="i-yt" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.3 12 31 31 0 0 0 22 8.2zM10 15V9l5.2 3z"/></symbol>
  </defs></svg>`;

  /* ---------- templates ---------- */
  function navHTML(active){
    return NAV.map(it=>{
      const sub = (it.sub||[]).map(s=>`<a href="${s.href}" data-en="${s.en}">${s.vi}</a>`).join('');
      return `<div class="nav-item${it.key===active?' active':''}">
        <a class="nav-top" href="${it.href}" data-en="${it.en}">${it.vi}</a>
        ${sub?`<div class="dropdown">${sub}</div>`:''}
      </div>`;
    }).join('');
  }
  function headerHTML(active){
    return `<header class="header" id="header">
      <div class="wrap header__inner" style="padding-bottom:0">
        <a href="${HOME}" class="brand" aria-label="HHPPaper">
          <img class="brand-logo brand-logo--color" src="assets/logo-hhp-color.png" alt="HHPPaper" style="width:150px;height:auto">
          <img class="brand-logo brand-logo--white" src="assets/logo-hhp-white-h.png" alt="" aria-hidden="true" style="width:150px;height:auto">
        </a>
        <nav class="nav" id="nav">${navHTML(active)}</nav>
        <div class="header-actions" style="gap:14px;display:flex;align-items:center">
          <button class="btn-icon header-search" id="headerSearch" aria-label="Search" title="Tìm kiếm" style="width:36px;height:36px;display:grid;place-items:center;background:transparent;border:1px solid var(--line);border-radius:999px;color:var(--text);cursor:pointer;transition:.2s">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <div class="lang lang--flag" role="group" aria-label="Language" style="position:relative">
            <button class="lang-current" id="langCurrent" aria-haspopup="listbox" aria-expanded="false" style="display:flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer;font-family:inherit;color:var(--text)"><span class="lang-flag" style="font-size:1.15rem;line-height:1">🇻🇳</span><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
            <ul class="lang-list" id="langList" role="listbox" hidden style="position:absolute;right:0;top:calc(100% + 8px);background:#fff;border:1px solid var(--line);border-radius:12px;padding:6px;margin:0;list-style:none;box-shadow:0 12px 32px -8px rgba(0,0,0,.18);min-width:64px;z-index:50">
              <li><button data-lang="vi" data-flag="🇻🇳" role="option" aria-selected="true"  style="width:100%;display:flex;align-items:center;justify-content:center;gap:0;background:transparent;border:0;padding:8px;font-size:1.25rem;line-height:1;cursor:pointer;border-radius:8px">🇻🇳</button></li>
              <li><button data-lang="en" data-flag="🇺🇸" role="option" aria-selected="false" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0;background:transparent;border:0;padding:8px;font-size:1.25rem;line-height:1;cursor:pointer;border-radius:8px">🇺🇸</button></li>
              <li><button data-lang="zh" data-flag="🇨🇳" role="option" aria-selected="false" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0;background:transparent;border:0;padding:8px;font-size:1.25rem;line-height:1;cursor:pointer;border-radius:8px">🇨🇳</button></li>
              <li><button data-lang="ko" data-flag="🇰🇷" role="option" aria-selected="false" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0;background:transparent;border:0;padding:8px;font-size:1.25rem;line-height:1;cursor:pointer;border-radius:8px">🇰🇷</button></li>
              <li><button data-lang="ja" data-flag="🇯🇵" role="option" aria-selected="false" style="width:100%;display:flex;align-items:center;justify-content:center;gap:0;background:transparent;border:0;padding:8px;font-size:1.25rem;line-height:1;cursor:pointer;border-radius:8px">🇯🇵</button></li>
            </ul>
          </div>
          <a href="lien-he.html" class="btn btn--accent" data-en="Get profile">Nhận hồ sơ</a>
          <button class="menu-toggle" id="menuToggle" aria-label="Menu"><span></span></button>
        </div>
      </div>
    </header>`;
  }
  function footerHTML(){
    return `<footer class="footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <div class="brand"><img class="brand-logo" src="assets/logo-hhp-color.png" alt="HHPPaper" style="width:180px;height:auto;display:block;margin-bottom:16px"></div>
            <p class="footer-about" data-en="Sustainable packaging paper manufacturer — a member of HHP GLOBAL, pioneering green production for a Green, Happy, Prosperous world.">Nhà sản xuất giấy bao bì bền vững — thành viên HHP GLOBAL, tiên phong sản xuất xanh vì một thế giới Xanh, Hạnh phúc, Thịnh vượng.</p>
          </div>
          <div><h5 data-en="Company">Công ty</h5><div class="footer-links">
            <a href="gioi-thieu.html" data-en="About">Giới thiệu</a>
            <a href="nang-luc.html" data-en="Capability">Năng lực sản xuất</a>
            <a href="gioi-thieu.html#esg" data-en="ESG · Green">ESG · Xanh</a>
            <a href="nha-dau-tu.html" data-en="Investors">Nhà đầu tư</a>
            <a href="tuyen-dung.html" data-en="Careers">Tuyển dụng</a>
          </div></div>
          <div><h5 data-en="Products">Sản phẩm</h5><div class="footer-links">
            <a href="chi-tiet-medium.html">Medium</a><a href="chi-tiet-testliner.html">Testliner</a>
            <a href="chi-tiet-kraftliner.html">Kraftliner</a>
          </div></div>
          <div><h5 data-en="Contact">Liên hệ</h5><div class="footer-contact">
            <span class="ln"><svg><use href="#i-pin"/></svg><span data-en="Hải Phòng factory: Lot CN2, Tiên Lãng Industrial Cluster, Hải Phòng">NM Hải Phòng: Lô CN2, Cụm CN thị trấn Tiên Lãng, xã Tiên Lãng, TP. Hải Phòng</span></span>
            <span class="ln"><svg><use href="#i-pin"/></svg><span data-en="Phú Yên factory: Lot E8, Đông Bắc Sông Cầu Industrial Park">NM Phú Yên: Lô E8, Khu Công nghiệp Đông Bắc Sông Cầu</span></span>
            <span class="ln"><svg><use href="#i-mail"/></svg><span>info@hhppaper.com</span></span>
            <span class="ln"><svg><use href="#i-phone"/></svg><span>02253.246.789</span></span>
          </div></div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 HHPPaper — CTCP HHP GLOBAL (HSX: HHP). <span data-en="All rights reserved.">Bảo lưu mọi quyền.</span></span>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"><svg><use href="#i-fb"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg><use href="#i-in"/></svg></a>
            <a href="#" aria-label="YouTube"><svg><use href="#i-yt"/></svg></a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- inject ---------- */
  function inject(){
    if(!document.getElementById('hhp-mark')){
      const d=document.createElement('div'); d.innerHTML=SVG_DEFS;
      document.body.insertBefore(d.firstElementChild, document.body.firstChild);
    }
    const active = document.body.getAttribute('data-page') || '';
    const hSlot = $('[data-chrome="header"]');
    if(hSlot) hSlot.outerHTML = headerHTML(active);
    const fSlot = $('[data-chrome="footer"]');
    if(fSlot) fSlot.outerHTML = footerHTML();
  }

  /* ---------- behaviors ---------- */
  const motionOn = ()=> getComputedStyle(document.documentElement).getPropertyValue('--motion').trim() !== '0';

  function wireHeader(){
    const header=$('#header'); if(!header) return;
    const onScroll=()=> header.classList.toggle('scrolled', window.scrollY>24);
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
    const mt=$('#menuToggle');
    if(mt) mt.addEventListener('click', ()=> header.classList.toggle('menu-open'));
    $$('#nav .dropdown a, #nav .nav-top').forEach(a=>{a.addEventListener('click', e=>{ if(a.classList.contains('nav-top') && a.parentElement.querySelector('.dropdown') && window.matchMedia('(max-width:760px)').matches) return; header.classList.remove('menu-open'); });});
    // Mobile: tap nav-top with dropdown → toggle open (don't navigate immediately)
    $$('#nav .nav-item').forEach(it=>{
      const hasDD = it.querySelector('.dropdown');
      if(!hasDD) return;
      const top = it.querySelector('.nav-top');
      top.addEventListener('click', ev=>{
        if(window.matchMedia('(max-width:760px)').matches){
          ev.preventDefault();
          $$('#nav .nav-item.open').forEach(x=> x!==it && x.classList.remove('open'));
          it.classList.toggle('open');
        }
      });
    });
  }

  /* i18n: VI inline, EN in data-en. Preserves child elements (icons). */
  function initI18n(){
    $$('[data-en]').forEach(el=>{ if(!el.hasAttribute('data-vi')) el.setAttribute('data-vi', el.children.length ? (Array.from(el.childNodes).find(n=>n.nodeType===3)?.nodeValue||'').trim() : el.textContent); });
    $$('[data-en-ph]').forEach(el=>{ if(!el.hasAttribute('data-vi-ph')) el.setAttribute('data-vi-ph', el.getAttribute('placeholder')||''); });
  }
  function setLang(lang){
    document.documentElement.lang = lang;
    $$('[data-en]').forEach(el=>{
      const v = lang==='en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
      if(v==null) return;
      if(el.children.length===0){ el.textContent = v; }
      else { let tn=Array.from(el.childNodes).find(n=>n.nodeType===3); if(!tn){ tn=document.createTextNode(''); el.insertBefore(tn, el.firstChild);} tn.nodeValue = v + ' '; }
    });
    $$('[data-en-ph]').forEach(el=> el.setAttribute('placeholder', lang==='en'?el.getAttribute('data-en-ph'):el.getAttribute('data-vi-ph')));
    $$('[data-flag-en]').forEach(el=> el.setAttribute('data-flag', lang==='en'?el.getAttribute('data-flag-en'):el.getAttribute('data-flag')));
    $$('.lang button').forEach(b=> b.setAttribute('aria-pressed', String(b.dataset.lang===lang)));
    if(window.__ecoRender) window.__ecoRender();
    try{ localStorage.setItem('hhp-lang', lang); }catch(e){}
  }
  function wireLang(){
    initI18n();
    /* Flag dropdown */
    const trigger = document.getElementById('langCurrent');
    const list = document.getElementById('langList');
    if(trigger && list){
      const flagSpan = trigger.querySelector('.lang-flag');
      trigger.addEventListener('click', e=>{
        e.stopPropagation();
        const open = list.hasAttribute('hidden');
        if(open){ list.removeAttribute('hidden'); trigger.setAttribute('aria-expanded','true'); }
        else    { list.setAttribute('hidden',''); trigger.setAttribute('aria-expanded','false'); }
      });
      document.addEventListener('click', e=>{
        if(!list.contains(e.target) && e.target!==trigger){ list.setAttribute('hidden',''); trigger.setAttribute('aria-expanded','false'); }
      });
      list.querySelectorAll('button[data-lang]').forEach(b=> b.addEventListener('click', ()=>{
        const code = b.dataset.lang;
        flagSpan.textContent = b.dataset.flag;
        list.querySelectorAll('button').forEach(x=> x.setAttribute('aria-selected', String(x===b)));
        list.setAttribute('hidden',''); trigger.setAttribute('aria-expanded','false');
        if(code==='vi'||code==='en') setLang(code);
      }));
    }
    $$('.lang button[data-lang]').forEach(b=> b.addEventListener('click', ()=> { if(b.dataset.lang==='vi'||b.dataset.lang==='en') setLang(b.dataset.lang); }));
    let saved='vi'; try{ saved=localStorage.getItem('hhp-lang')||'vi'; }catch(e){}
    if(saved==='en') setLang('en');
  }

  /* counters */
  function fmt(n,f){ return f==='grp'? Math.round(n).toLocaleString('vi-VN') : String(Math.round(n)); }
  function runCounter(el){
    if(el.dataset.done) return; el.dataset.done='1';
    const target=parseFloat(el.dataset.count), f=el.dataset.format;
    if(!motionOn()){ el.textContent=fmt(target,f); return; }
    const dur=1400,t0=performance.now();
    (function tick(now){ const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3); el.textContent=fmt(target*e,f); if(p<1) requestAnimationFrame(tick); })(t0);
  }

  /* reveal on scroll + counters */
  function wireReveal(){
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in');
        $$('[data-count]',en.target).forEach(runCounter); if(en.target.matches('[data-count]')) runCounter(en.target);
        io.unobserve(en.target); } });
    },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
    $$('.reveal, [data-count]').forEach(el=> io.observe(el));
    function inView(){ const vh=window.innerHeight||800;
      $$('.reveal:not(.in), [data-count]:not(.in)').forEach(el=>{ const r=el.getBoundingClientRect();
        if(r.top<vh*0.96 && r.bottom>0){ el.classList.add('in'); $$('[data-count]',el).forEach(runCounter); if(el.matches('[data-count]')) runCounter(el); } }); }
    window.addEventListener('load', ()=>{ inView(); setTimeout(inView,300); });
    setTimeout(inView,600);
  }

  function boot(){
    inject();
    wireHeader();
    wireLang();
    wireReveal();
    window.__hhpSetLang = setLang;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
