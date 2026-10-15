/* MAMLKAT AL-OTOR — gentle royal interactions; no external libraries */
(() => {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===true;
  function installUtilities(){
    if(!$("#royalScrollProgress")){
      const progress=document.createElement("div");progress.id="royalScrollProgress";progress.setAttribute("aria-hidden","true");document.body.append(progress);
    }
    if(!$("#royalBackTop")){
      const top=document.createElement("button");top.id="royalBackTop";top.type="button";top.setAttribute("aria-label","العودة إلى أعلى الصفحة");top.title="العودة إلى أعلى الصفحة";
      top.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
      top.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduced?"auto":"smooth"}));document.body.append(top);
    }
    if(!$("#royalMotionStatus")){
      const status=document.createElement("span");status.id="royalMotionStatus";status.className="visually-hidden";status.setAttribute("aria-live","polite");document.body.append(status);
    }
  }
  function updateScroll(){
    const root=document.documentElement,range=root.scrollHeight-window.innerHeight,progress=range>0?Math.min(100,Math.max(0,window.scrollY/range*100)):0;
    const bar=$("#royalScrollProgress");if(bar)bar.style.width=progress+"%";
    const top=$("#royalBackTop");if(top)top.classList.toggle("is-visible",window.scrollY>480);
    const header=$(".site-header");if(header)header.classList.toggle("is-scrolled",window.scrollY>12);
  }
  function setupReveal(){
    const targets=$$(".section,.trust-strip,.split-feature,.hero,.site-footer,.product-card,.category-card");
    targets.forEach((el,i)=>{if(el.id==="home"||el.classList.contains("hero"))return;el.classList.add("royal-reveal");el.style.transitionDelay=(i%4)*45+"ms";});
    if(reduced||!("IntersectionObserver" in window)){targets.forEach(el=>el.classList.add("is-in-view"));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-in-view");observer.unobserve(entry.target);}
    }),{threshold:.08,rootMargin:"0px 0px -24px 0px"});
    targets.forEach(el=>observer.observe(el));
    const productRoot=$("#readyProducts");
    if(productRoot&&"MutationObserver" in window){
      new MutationObserver(()=>productRoot.querySelectorAll(".product-card:not(.royal-reveal)").forEach((el,i)=>{
        el.classList.add("royal-reveal");el.style.transitionDelay=(i%4)*35+"ms";observer.observe(el);
      })).observe(productRoot,{childList:true});
    }
  }
  function setupNav(){
    const nav=$("#mainNav"),toggle=$("#menuToggle");
    if(!nav||!toggle)return;
    const close=()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","فتح القائمة");};
    toggle.addEventListener("click",()=>{const open=nav.classList.contains("open");toggle.setAttribute("aria-label",open?"إغلاق القائمة":"فتح القائمة");});
    nav.addEventListener("click",e=>{if(e.target.closest("a"))close();});
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape")close();
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
        const input=$("#productSearch");if(input){e.preventDefault();input.focus();$("#ready")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}
      }
    });
    if("IntersectionObserver" in window&&!reduced){
      const links=$$("#mainNav a[data-nav]");
      const sections=links.map(a=>$(a.getAttribute("href"))).filter(Boolean);
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        links.forEach(a=>{const active=a.getAttribute("href")==="#"+entry.target.id;a.classList.toggle("active",active);if(active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
      }),{rootMargin:"-25% 0px -60% 0px",threshold:0});
      sections.forEach(s=>observer.observe(s));
    }
  }
  function setupButtonFeedback(){
    document.addEventListener("click",e=>{
      const target=e.target.closest(".btn,.icon-btn,.small-btn,.category-card,#royalBackTop");
      if(!target||reduced||target.disabled||target.tagName==="A"&&target.getAttribute("href")?.startsWith("#"))return;
      const rect=target.getBoundingClientRect(),diameter=Math.min(Math.max(rect.width,rect.height)*1.2,100);
      const ripple=document.createElement("span");ripple.className="royal-ripple";ripple.style.width=diameter+"px";ripple.style.height=diameter+"px";
      ripple.style.left=(e.clientX?e.clientX-rect.left-diameter/2:rect.width/2-diameter/2)+"px";
      ripple.style.top=(e.clientY?e.clientY-rect.top-diameter/2:rect.height/2-diameter/2)+"px";
      const prior=getComputedStyle(target).position;if(prior==="static")target.style.position="relative";target.style.overflow="hidden";target.append(ripple);setTimeout(()=>ripple.remove(),650);
    });
  }
  function setupImageFallbacks(){
    $$("img").forEach(img=>{
      if(img.dataset.royalFallback==="1")return;
      img.dataset.royalFallback="1";
      img.addEventListener("error",()=>{
        if(img.classList.contains("hero-image")){$(".hero")?.classList.add("hero-image-missing");return;}
        img.classList.add("royal-image-missing");
      },{once:true});
    });
  }
  function init(){
    installUtilities();setupReveal();setupNav();setupButtonFeedback();setupImageFallbacks();updateScroll();
    window.addEventListener("scroll",updateScroll,{passive:true});
    window.addEventListener("resize",updateScroll,{passive:true});
    document.addEventListener("mamlaka:products-updated",()=>{setupImageFallbacks();});
    document.addEventListener("mamlaka:supplier-catalog-updated",()=>{setupImageFallbacks();});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();