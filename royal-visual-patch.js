/* MAMLKAT AL-OTOR — semantic royal icons + product image fallback polish */
(() => {
  "use strict";
  if (window.__mamlakaRoyalVisualPatch20261021) return;
  window.__mamlakaRoyalVisualPatch20261021 = true;
  const art = {
    perfume: '<path d="M18 5h12v7l4 4v5l4 5v15H10V26l5-5v-5l3-4V5Z"/><path d="M18 9h12M14 27h20M17 33h14"/><path d="M21 20h6v5h-6z"/>',
    oil: '<path d="M19 5h10v7l5 5v21H14V17l5-5V5Z"/><path d="M19 9h10M17 22h14M18 28h12"/><path d="M24 17c-5 5-5 8 0 10 5-2 5-5 0-10Z"/>',
    floral: '<path d="M24 24c-9-1-12-8-5-12 4-2 6 3 5 12Z"/><path d="M24 24c1-9 8-12 12-5 2 4-3 6-12 5Z"/><path d="M24 24c9 1 12 8 5 12-4 2-6-3-5-12Z"/><path d="M24 24c-1 9-8 12-12 5-2-4 3-6 12-5Z"/><circle cx="24" cy="24" r="3"/><path d="M24 27v13m0-6-6-4m6 6 6-4"/>',
    citrus: '<circle cx="24" cy="24" r="14"/><path d="M24 10v28M10 24h28M14 14l20 20M34 14 14 34"/><path d="M24 10c0-5 4-7 8-6"/>',
    wood: '<path d="M24 5 9 14l5 4-5 5 6 4-3 7 12 7 12-7-3-7 6-4-5-5 5-4L24 5Z"/><path d="M24 11v28M17 17l7 5 7-5M17 29l7 4 7-4"/>',
    bakhoor: '<path d="M10 27h28l-4 13H14l-4-13Z"/><path d="M8 27h32M17 23h14"/><path d="M18 19c-4-4 3-5 0-12M24 19c-4-4 3-5 0-12M30 19c-4-4 3-5 0-12"/>',
    gift: '<path d="M6 20h36v22H6zM4 14h40v8H4zM24 14c-11 0-14-9-7-10 5-1 7 10 7 10Zm0 0c11 0 14-9 7-10-5-1-7 10-7 10Z"/><path d="M24 14v28"/>',
    crown: '<path d="m5 14 10 8 9-15 9 15 10-8-5 25H10L5 14Z"/><path d="M12 33h24"/>',
    advisor: '<path d="M24 5c-8 0-14 6-14 14 0 5 3 9 7 11v7h14v-7c4-2 7-6 7-11 0-8-6-14-14-14Z"/><path d="M18 18c1-4 9-5 10 0 0 3-4 4-4 7M24 30v1"/>',
    map: '<path d="m5 9 12-4 14 4 12-4v30l-12 4-14-4-12 4V9Z"/><path d="M17 5v30M31 9v30"/><circle cx="24" cy="18" r="4"/><path d="M24 22v6"/>'
  };
  function iconFor(text) {
    const t=(text||"").toLowerCase();
    if(/بخور|عود/.test(t)) return "bakhoor";
    if(/هد|تغليف|gift/.test(t)) return "gift";
    if(/زيت|تركيب|oil|blend/.test(t)) return "oil";
    if(/زهري|وردي|flower|floral/.test(t)) return "floral";
    if(/حمضي|منعش|citrus|fresh/.test(t)) return "citrus";
    if(/خشبي|خشب|عود|wood/.test(t)) return "wood";
    if(/مستشار|advisor|ذكاء/.test(t)) return "advisor";
    if(/زيارة|تواصل|موقع|location/.test(t)) return "map";
    if(/فهرس|رئيسية|توقيع|crown/.test(t)) return "crown";
    return "perfume";
  }
  function upgradeIcons(root=document) {
    root.querySelectorAll(".category-card .category-icon-wrap, .home-index-card .home-index-icon").forEach(el=>{
      if(el.dataset.royalIconDone==="1") return;
      const card=el.closest("a,button") || el.parentElement;
      const kind=iconFor(card ? card.innerText : el.innerText);
      if(el.classList.contains("home-index-icon")) {
        el.innerHTML='<svg class="royal-category-icon" viewBox="0 0 48 48" aria-hidden="true">'+(art[kind]||art.perfume)+'</svg>';
      } else {
        el.innerHTML='<svg class="royal-category-icon" viewBox="0 0 48 48" aria-hidden="true">'+(art[kind]||art.perfume)+'</svg>';
      }
      el.dataset.royalIconDone="1";
    });
  }
  function improveBrokenImages(root=document) {
    root.querySelectorAll(".product-visual img, .product-photo").forEach(img=>{
      if(img.dataset.fallbackBound==="1") return;
      img.dataset.fallbackBound="1";
      img.addEventListener("error",()=>{
        if(img.dataset.fallbackUsed==="1") return;
        img.dataset.fallbackUsed="1";
        const holder=img.closest(".product-visual") || img.parentElement;
        if(holder && !holder.querySelector(".placeholder-bottle")) {
          const bottle=document.createElement("div");
          bottle.className="placeholder-bottle generated-bottle";
          bottle.setAttribute("role","img");
          const card=img.closest(".product-card");
          bottle.setAttribute("aria-label","رسم توضيحي مؤقت لعبوة عطر "+((card&&card.innerText)||""));
          holder.appendChild(bottle);
        }
        img.hidden=true;
      },{once:true});
    });
  }
  function run(){upgradeIcons();improveBrokenImages();}
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run); else run();
  const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){upgradeIcons(n);improveBrokenImages(n)}})));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("mamlaka:products-updated",run);
})();
