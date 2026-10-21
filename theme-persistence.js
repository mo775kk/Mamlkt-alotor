/* MAMLKAT AL-OTOR — persistent theme and display settings */
(() => {
  "use strict";
  const THEME_KEY="mamlaka_theme_v1", MODE_KEY="mamlaka_theme", VISUAL_KEY="mamlaka_visual_tuning_v1";
  const read=key=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(_){return null}};
  const clamp=(value,min,max,fallback)=>{const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
  const validColor=value=>/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(String(value||""));
  const validImage=value=>{const v=String(value||"");return /^(https:\/\/|\.\.?\/|assets\/|data:image\/(?:png|jpeg|webp|gif);base64,)/i.test(v)?v:""};
  const vars={bg:"--bg",panel:"--panel",panel2:"--panel2",card:"--card",field:"--field",gold:"--gold",gold2:"--gold2",text:"--text",heading:"--heading",muted:"--muted",line:"--line",header:"--header-bg",footer:"--footer-bg",button:"--button-bg",buttonText:"--button-text"};
  const safeColors={bg:"#10151C",panel:"#151B23",panel2:"#1C2632",card:"#18212B",field:"#101820",gold:"#4D9DE0",gold2:"#A8D8FF",text:"#F3F7FC",heading:"#B8E1FF",muted:"#C7D3E0",line:"#35516A",header:"#111821",footer:"#0D1218",button:"#244D70",buttonText:"#FFFFFF"};
  function isPinkTone(value){const h=String(value||"").replace("#","");if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h))return false;const full=h.length===3?h.split("").map(x=>x+x).join(""):h,rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255),max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min;if(delta<.12||max===0)return false;let hue=0;if(max===rgb[0])hue=60*(((rgb[1]-rgb[2])/delta)%6);else if(max===rgb[1])hue=60*((rgb[2]-rgb[0])/delta+2);else hue=60*((rgb[0]-rgb[1])/delta+4);if(hue<0)hue+=360;const light=(max+min)/2,sat=delta/(1-Math.abs(2*light-1));return sat>.16&&light>.16&&(hue>=325||hue<=8);}

  function luminance(hex){const z=String(hex).replace("#","");const f=z.length===3?z.split("").map(c=>c+c).join(""):z;const c=[0,2,4].map(i=>parseInt(f.slice(i,i+2),16)/255).map(n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
  function applyTheme(){
    const root=document.documentElement;
    try{const mode=localStorage.getItem(MODE_KEY);if(mode==="light"||mode==="dark")root.setAttribute("data-theme",mode)}catch(_){}
    const theme=read(THEME_KEY);
    if(!theme||typeof theme!=="object")return;
    Object.entries(vars).forEach(([key,name])=>{if(validColor(theme[key]))root.style.setProperty(name,({gold:"#4D9DE0",gold2:"#A8D8FF",heading:"#B8E1FF",line:"#35516A",button:"#244D70"}[key]|| (isPinkTone(theme[key])?(safeColors[key]||"#4D9DE0"):theme[key])))});
    const image=validImage(theme.backgroundImage);
    if(image){root.style.setProperty("--page-image",'url("'+image.replace(/["\\\\]/g,"")+'")');const hero=document.querySelector(".hero-image");if(hero)hero.src=image}
    root.style.setProperty("--bg-overlay",String(clamp(theme.overlay,.05,.85,.18)));
    if(theme.visualStyle){const aliases={royal:"windows",editorial:"ios",soft:"android",glass:"ios",boutique:"classic",bold:"windows",minimal:"classic",botanical:"pixel"};const style=aliases[theme.visualStyle]||theme.visualStyle;if(["windows","android","ios","oneui","pixel","classic"].includes(style))root.dataset.visualStyle=style}
    if(validColor(theme.bg)){root.style.colorScheme=luminance(theme.bg)<.22?"dark":"light";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content","#151B23")}
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
      body{background-color:color-mix(in srgb,var(--bg,#f7f1f3) calc(var(--mamlaka-brightness,100%) - 30%),#fff 30%);filter:none}
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
      .product-visual{height:calc(100px * ${x.bottleScale/100})!important;min-height:calc(100px * ${x.bottleScale/100})!important}
      .product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{height:calc(82px * ${x.bottleScale/100})!important;max-height:calc(82px * ${x.bottleScale/100})!important}
      .product-actions{gap:calc(8px * var(--product-ui-scale))!important;margin-top:calc(8px * var(--product-ui-scale))!important}
      @media(max-width:680px){
        .hero{min-height:500px}
        .home-index-card{min-height:82px!important;padding:13px!important;gap:11px!important}
        .category-card{min-height:175px!important;padding:14px!important}
        .product-visual{height:150px!important;min-height:150px!important}
        .product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{height:120px!important;max-height:120px!important}
      }
    `;
  }
  function applyAll(){applyTheme();applyDisplay()}
  applyAll();
  window.addEventListener("storage",event=>{if([THEME_KEY,MODE_KEY,VISUAL_KEY].includes(event.key))applyAll()});
  document.addEventListener("DOMContentLoaded",applyAll,{once:true});
})();