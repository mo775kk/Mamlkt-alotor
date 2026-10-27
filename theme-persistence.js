/* MAMLKAT AL-OTOR — persistent theme and display settings */
(() => {
  "use strict";
  const THEME_KEY="mamlaka_theme_v1", MODE_KEY="mamlaka_theme", VISUAL_KEY="mamlaka_visual_tuning_v1";
  const read=key=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(_){return null}};
  const clamp=(value,min,max,fallback)=>{const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
  const validColor=value=>/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(String(value||""));
  const validImage=value=>{const v=String(value||"");return /^(https:\/\/|\.\.?\/|assets\/|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(v)?v:""};
  const vars={bg:"--bg",panel:"--panel",panel2:"--panel2",card:"--card",field:"--field",gold:"--gold",gold2:"--gold2",text:"--text",heading:"--heading",muted:"--muted",line:"--line",header:"--header-bg",footer:"--footer-bg",button:"--button-bg",buttonText:"--button-text",indexBg:"--index-bg",indexCard:"--index-card",indexIcon:"--index-icon",indexBorder:"--index-border"};
  const safeColors={bg:"#F5F3EF",panel:"#FFFFFF",panel2:"#E8E5DF",card:"#FFFFFF",field:"#FFFFFF",gold:"#4D5052",gold2:"#85898B",text:"#343638",heading:"#25282A",muted:"#626669",line:"#5D4B1B",header:"#FAF9F6",footer:"#E5E3DD",button:"#414547",buttonText:"#FFFFFF",indexBg:"#F5F3EF",indexCard:"#FFFFFF",indexIcon:"#4D5052",indexBorder:"#85898B"};
  function isPinkTone(value){const h=String(value||"").replace("#","");if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h))return false;const full=h.length===3?h.split("").map(x=>x+x).join(""):h,rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255),max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min;if(delta<.12||max===0)return false;let hue=0;if(max===rgb[0])hue=60*(((rgb[1]-rgb[2])/delta)%6);else if(max===rgb[1])hue=60*((rgb[2]-rgb[0])/delta+2);else hue=60*((rgb[0]-rgb[1])/delta+4);if(hue<0)hue+=360;const light=(max+min)/2,sat=delta/(1-Math.abs(2*light-1));return sat>.16&&light>.16&&(hue>=325||hue<=8);}
  function isGoldTone(value){const h=String(value||"").replace("#","");if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h))return false;const full=h.length===3?h.split("").map(x=>x+x).join(""):h,rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255),max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min;if(delta<.14||max===0)return false;let hue=0;if(max===rgb[0])hue=60*(((rgb[1]-rgb[2])/delta)%6);else if(max===rgb[1])hue=60*((rgb[2]-rgb[0])/delta+2);else hue=60*((rgb[0]-rgb[1])/delta+4);if(hue<0)hue+=360;const light=(max+min)/2,sat=delta/(1-Math.abs(2*light-1));return sat>.24&&light>.16&&hue>=32&&hue<=65;}

  function luminance(hex){const z=String(hex).replace("#","");const f=z.length===3?z.split("").map(c=>c+c).join(""):z;const c=[0,2,4].map(i=>parseInt(f.slice(i,i+2),16)/255).map(n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
  function applyTheme(){
    const root=document.documentElement;
    try{const mode=localStorage.getItem(MODE_KEY);if(mode==="light"||mode==="dark")root.setAttribute("data-theme",mode)}catch(_){}
    const theme=read(THEME_KEY);
    if(!theme||typeof theme!=="object")return;
    /* Migrate old saved image backgrounds away; the storefront now uses a unified solid-color canvas. */
    if(theme.backgroundImage && theme.backgroundImage!=="none"){
      theme.backgroundImage="none";
      try{localStorage.setItem(THEME_KEY,JSON.stringify(theme));}catch(_){}
    }
    Object.entries(vars).forEach(([key,name])=>{if(validColor(theme[key]))root.style.setProperty(name,(isPinkTone(theme[key])?(safeColors[key]||"#0A0A0A"):theme[key]))});
    root.style.setProperty("--page-image","none");
    root.style.setProperty("--bg-overlay",String(clamp(theme.overlay,.05,.85,.18)));
    if(theme.visualStyle){const aliases={royal:"windows",editorial:"ios",soft:"android",glass:"ios",boutique:"classic",bold:"windows",minimal:"classic",botanical:"pixel"};const style=aliases[theme.visualStyle]||theme.visualStyle;if(["windows","android","ios","oneui","pixel","classic"].includes(style))root.dataset.visualStyle=style}
    const mobileDesign=/^mobile-(0[1-9]|10)$/.test(String(theme.mobileDesign||""))?theme.mobileDesign:"mobile-02";
    const webDesign=/^web-(0[1-9]|10)$/.test(String(theme.webDesign||""))?theme.webDesign:"web-02";
    root.dataset.mobileDesign=mobileDesign;root.dataset.webDesign=webDesign;
    if(validColor(theme.bg)){root.style.colorScheme=luminance(theme.bg)<.22?"dark":"light";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",validColor(theme.header)?theme.header:theme.bg)}
  }
  function applyDisplay(){
    const root=document.documentElement,v=read(VISUAL_KEY)||{};
    const x={brightness:clamp(v.brightness,70,130,100),contrast:clamp(v.contrast,80,125,100),fontScale:clamp(v.fontScale,85,120,100),imageClarity:clamp(v.imageClarity,10,100,100),lineHeight:clamp(v.lineHeight,120,180,150),iconScale:clamp(v.iconScale,60,130,100),homeScale:clamp(v.homeScale,65,120,100),categoryScale:clamp(v.categoryScale,60,120,100),productScale:clamp(v.productScale,60,120,100),bottleScale:clamp(v.bottleScale,55,120,100)};
    root.style.fontSize=(16*x.fontScale/100)+"px";
    let style=document.getElementById("mamlaka-persistent-display-style");
    if(!style){style=document.createElement("style");style.id="mamlaka-persistent-display-style";document.head.appendChild(style)}
    style.textContent=`
      :root{--mamlaka-brightness:${x.brightness}%;--mamlaka-contrast:${x.contrast}%;--mamlaka-font-scale:${x.fontScale}%;--mamlaka-image-clarity:${x.imageClarity}%;--mamlaka-line-height:${x.lineHeight}%}
      html{line-height:var(--mamlaka-line-height,150%)}
      body{background-color:color-mix(in srgb,var(--bg,#0a0a0a) calc(var(--mamlaka-brightness,100%) - 10%),#000 10%);filter:none}
      body :is(p,small,label,li,td,th){filter:contrast(var(--mamlaka-contrast,100%))}
      body::before{opacity:calc(var(--mamlaka-image-clarity,100%)/100)}
      .icon-btn,.favorite-btn,.home-index-icon,.category-icon-wrap,.royal-category-icon,.header-line-icon{--ui-icon-scale:${x.iconScale/100}}
      .icon-btn svg,.icon-btn .icon,.header-line-icon,.category-icon-wrap svg,.royal-category-icon{transform:scale(var(--ui-icon-scale,1));transform-origin:center}
      .home-index-card{--home-ui-scale:${x.homeScale/100};min-height:calc(68px * var(--home-ui-scale));padding:calc(10px * var(--home-ui-scale))!important;gap:calc(8px * var(--home-ui-scale))!important}
      .home-index-icon{font-size:calc(25px * var(--ui-icon-scale,1))!important}
      .hero{--home-ui-scale:${x.homeScale/100};min-height:clamp(420px,calc(56vw * var(--home-ui-scale)),680px)}
      .category-card{--category-ui-scale:${x.categoryScale/100};min-height:calc(124px * var(--category-ui-scale))!important;padding:calc(12px * var(--category-ui-scale))!important;gap:calc(8px * var(--category-ui-scale))!important}
      .category-icon-wrap{width:calc(42px * var(--ui-icon-scale,1));height:calc(42px * var(--ui-icon-scale,1));min-width:calc(42px * var(--ui-icon-scale,1))}
      .product-card{--product-ui-scale:${x.productScale/100}}
      .product-info{padding:calc(10px * var(--product-ui-scale))!important;gap:calc(5px * var(--product-ui-scale))!important}
      .product-visual{height:auto!important;min-height:0!important;aspect-ratio:1/1;overflow:hidden}
      .product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{width:100%;height:100%!important;max-height:none!important;object-fit:contain;transform:scale(${x.bottleScale/100});transform-origin:center}
      .product-actions{gap:calc(8px * var(--product-ui-scale))!important;margin-top:calc(8px * var(--product-ui-scale))!important}
      @media(max-width:680px){
        .hero{min-height:clamp(300px,75vw,410px)}
        .home-index-card{min-height:64px!important;padding:9px!important;gap:8px!important}
        .category-card{min-height:138px!important;padding:12px!important}
        .product-visual{height:auto!important;min-height:0!important;aspect-ratio:1/1}
        .product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{width:100%;height:100%!important;max-height:none!important;object-fit:contain}
      }
      /* The 10 mobile and desktop layout choices now affect real grid/card behavior. */
      :root[data-web-design="web-01"] .product-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      :root[data-web-design="web-02"] .product-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      :root[data-web-design="web-03"] .product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      :root[data-web-design="web-04"] .product-grid{grid-template-columns:repeat(5,minmax(0,1fr))}
      :root[data-web-design="web-05"] .product-card{border-radius:4px!important;box-shadow:none!important}
      :root[data-web-design="web-06"] .product-visual{aspect-ratio:4/3}
      :root[data-web-design="web-07"] .home-index-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      :root[data-web-design="web-08"] .home-index-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
      :root[data-web-design="web-09"] .product-card,:root[data-web-design="web-09"] .category-card{border-width:2px!important}
      :root[data-web-design="web-10"] .product-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
      @media(max-width:720px){
        :root[data-mobile-design="mobile-01"] .product-card{border-radius:2px!important}
        :root[data-mobile-design="mobile-02"] .product-card{border-radius:12px!important}
        :root[data-mobile-design="mobile-03"] .product-card,:root[data-mobile-design="mobile-03"] .category-card{border-radius:22px!important}
        :root[data-mobile-design="mobile-04"] .product-grid{gap:6px!important}
        :root[data-mobile-design="mobile-04"] .product-card .product-info,:root[data-mobile-design="mobile-04"] .product-card .product-body{padding:7px!important}
        :root[data-mobile-design="mobile-05"] .product-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        :root[data-mobile-design="mobile-06"] .product-grid,:root[data-mobile-design="mobile-06"] .home-showcase-grid{grid-template-columns:minmax(0,1fr)!important}
        :root[data-mobile-design="mobile-07"] .category-icon-wrap,:root[data-mobile-design="mobile-07"] .home-index-icon{border-radius:50%!important}
        :root[data-mobile-design="mobile-08"] .product-card,:root[data-mobile-design="mobile-08"] .category-card,:root[data-mobile-design="mobile-08"] .home-index-card{box-shadow:none!important}
        :root[data-mobile-design="mobile-09"] .product-visual{aspect-ratio:1/1!important}
        :root[data-mobile-design="mobile-09"] .product-card .product-info,:root[data-mobile-design="mobile-09"] .product-card .product-body{padding:12px!important}
        :root[data-mobile-design="mobile-10"] .product-card,:root[data-mobile-design="mobile-10"] .category-card{border-width:2px!important}
      }
    `;
  }
  function applyAll(){applyTheme();applyDisplay()}
  applyAll();
  window.addEventListener("storage",event=>{if([THEME_KEY,MODE_KEY,VISUAL_KEY].includes(event.key))applyAll()});
  document.addEventListener("DOMContentLoaded",applyAll,{once:true});
})();