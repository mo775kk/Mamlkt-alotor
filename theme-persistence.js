/* MAMLKAT AL-OTOR — persistent theme and display settings */
(() => {
  "use strict";
  const THEME_KEY="mamlaka_theme_v1", MODE_KEY="mamlaka_theme", VISUAL_KEY="mamlaka_visual_tuning_v1";
  const read=key=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(_){return null}};
  const clamp=(value,min,max,fallback)=>{const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
  const validColor=value=>/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(String(value||""));
  const validImage=value=>{const v=String(value||"");return /^(https:\/\/|\.\.?\/|assets\/|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(v)?v:""};
  const vars={bg:"--bg",panel:"--panel",panel2:"--panel2",card:"--card",field:"--field",gold:"--gold",gold2:"--gold2",text:"--text",heading:"--heading",muted:"--muted",line:"--line",header:"--header-bg",footer:"--footer-bg",button:"--button-bg",buttonText:"--button-text"};
  function luminance(hex){const z=String(hex).replace("#","");const f=z.length===3?z.split("").map(c=>c+c).join(""):z;const c=[0,2,4].map(i=>parseInt(f.slice(i,i+2),16)/255).map(n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
  function applyTheme(){
    const root=document.documentElement;
    try{const mode=localStorage.getItem(MODE_KEY);if(mode==="light"||mode==="dark")root.setAttribute("data-theme",mode)}catch(_){}
    const theme=read(THEME_KEY);
    if(!theme||typeof theme!=="object")return;
    Object.entries(vars).forEach(([key,name])=>{if(validColor(theme[key]))root.style.setProperty(name,theme[key])});
    const image=validImage(theme.backgroundImage);
    if(image){root.style.setProperty("--page-image",'url("'+image.replace(/["\\\\]/g,"")+'")');const hero=document.querySelector(".hero-image");if(hero)hero.src=image}
    root.style.setProperty("--bg-overlay",String(clamp(theme.overlay,.05,.85,.18)));
    if(theme.visualStyle){const aliases={royal:"windows",editorial:"ios",soft:"android",glass:"ios",boutique:"classic",bold:"windows",minimal:"classic",botanical:"pixel"};const style=aliases[theme.visualStyle]||theme.visualStyle;if(["windows","android","ios","oneui","pixel","classic"].includes(style))root.dataset.visualStyle=style}
    if(validColor(theme.bg)){root.style.colorScheme=luminance(theme.bg)<.22?"dark":"light";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",theme.bg)}
  }
  function applyDisplay(){
    const root=document.documentElement,v=read(VISUAL_KEY)||{};
    const x={brightness:clamp(v.brightness,70,130,100),contrast:clamp(v.contrast,80,125,100),fontScale:clamp(v.fontScale,85,120,100),imageClarity:clamp(v.imageClarity,10,100,100),lineHeight:clamp(v.lineHeight,120,180,150),iconScale:clamp(v.iconScale,60,130,85),homeScale:clamp(v.homeScale,65,120,90),categoryScale:clamp(v.categoryScale,60,120,85),productScale:clamp(v.productScale,60,120,80),bottleScale:clamp(v.bottleScale,55,120,70)};
    root.style.fontSize=(16*x.fontScale/100)+"px";
    let style=document.getElementById("mamlaka-persistent-display-style");
    if(!style){style=document.createElement("style");style.id="mamlaka-persistent-display-style";document.head.appendChild(style)}
    style.textContent=`
      :root{--mamlaka-brightness:${x.brightness}%;--mamlaka-contrast:${x.contrast}%;--mamlaka-font-scale:${x.fontScale}%;--mamlaka-image-clarity:${x.imageClarity}%;--mamlaka-line-height:${x.lineHeight}%}
      html{line-height:var(--mamlaka-line-height,150%)}
      body{background-color:color-mix(in srgb,var(--bg,#f7f1f3) calc(var(--mamlaka-brightness,100%) - 30%),#fff 30%);filter:none}
      body :is(p,small,label,li,td,th){filter:contrast(var(--mamlaka-contrast,100%))}
      body::before{opacity:calc(var(--mamlaka-image-clarity,100%)/100)}
      .icon-btn,.favorite-btn,.home-index-icon,.category-icon-wrap,.royal-category-icon,.header-line-icon{--ui-icon-scale:${x.iconScale/100}}
      .icon-btn svg,.icon-btn .icon,.header-line-icon,.category-icon-wrap svg,.royal-category-icon{transform:scale(var(--ui-icon-scale,1));transform-origin:center}
      .home-index-card{--home-ui-scale:${x.homeScale/100};min-height:calc(68px * var(--home-ui-scale));padding:calc(10px * var(--home-ui-scale))!important;gap:calc(8px * var(--home-ui-scale))!important}
      .home-index-icon{font-size:calc(25px * var(--ui-icon-scale,1))!important}
      .hero{--home-ui-scale:${x.homeScale/100};min-height:calc(290px * var(--home-ui-scale))}
      .category-card{--category-ui-scale:${x.categoryScale/100};min-height:calc(124px * var(--category-ui-scale))!important;padding:calc(12px * var(--category-ui-scale))!important;gap:calc(8px * var(--category-ui-scale))!important}
      .category-icon-wrap{width:calc(42px * var(--ui-icon-scale,1));height:calc(42px * var(--ui-icon-scale,1));min-width:calc(42px * var(--ui-icon-scale,1))}
      .product-card{--product-ui-scale:${x.productScale/100}}
      .product-info{padding:calc(10px * var(--product-ui-scale))!important;gap:calc(5px * var(--product-ui-scale))!important}
      .product-visual{height:calc(100px * ${x.bottleScale/100})!important;min-height:calc(100px * ${x.bottleScale/100})!important}
      .product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{height:calc(82px * ${x.bottleScale/100})!important;max-height:calc(82px * ${x.bottleScale/100})!important}
      .product-actions{gap:calc(5px * var(--product-ui-scale))!important;margin-top:calc(4px * var(--product-ui-scale))!important}
    `;
  }
  function applyAll(){applyTheme();applyDisplay()}
  applyAll();
  window.addEventListener("storage",event=>{if([THEME_KEY,MODE_KEY,VISUAL_KEY].includes(event.key))applyAll()});
  document.addEventListener("DOMContentLoaded",applyAll,{once:true});
})();