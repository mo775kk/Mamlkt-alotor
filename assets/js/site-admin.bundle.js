
/* ===== MODULE 1: royal-gold-gate.js ===== */
;
/* Royal gate sound — starts only after the visitor presses the entrance button. */
(function(){
 "use strict";
 var wired=false;
 function playGateSound(){
  try{
   var Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
   var ctx=new Ctx();
   var start=function(){
    var now=ctx.currentTime;
    function tone(freq,at,dur,type,gain){
     var osc=ctx.createOscillator(),amp=ctx.createGain();
     osc.type=type||"sine";osc.frequency.setValueAtTime(freq,at);
     amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(gain||.045,at+.035);
     amp.gain.exponentialRampToValueAtTime(.0001,at+dur);
     osc.connect(amp);amp.connect(ctx.destination);osc.start(at);osc.stop(at+dur+.03);
    }
    // A low metallic hinge sweep followed by a short, bright royal chime.
    tone(118,now,.95,"sawtooth",.025);
    tone(174,now+.08,.85,"triangle",.025);
    tone(392,now+.32,.75,"sine",.045);
    tone(587.33,now+.48,.9,"sine",.035);
    tone(783.99,now+.64,.72,"sine",.022);
    window.setTimeout(function(){ctx.close().catch(function(){});},1800);
   };
   if(ctx.state==="suspended")ctx.resume().then(start).catch(function(){});else start();
  }catch(e){/* Sound is an enhancement; entrance animation still works. */}
 }
 function bind(){
  if(wired)return;var btn=document.getElementById("enterBtn");if(!btn)return;
  wired=true;btn.addEventListener("click",function(){playGateSound();},{capture:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();

;

/* ===== MODULE 2: reference-library.js ===== */
;
(() => {
  "use strict";
  const KEY = "mamlaka_reference_sites_v1";
  const sites = [["طيف الإمارات — الموقع العربي الإماراتي","عربي وخليجي","https://ae.taifalemarat.com/ar"],["العربية للعود","عربي وخليجي","https://eg.arabianoud.com/ar"],["أفنان مصر","عربي وخليجي","https://egypt.afnan.com/ar"],["طيف الإمارات","عربي وخليجي","https://sa.taifalemarat.com/"],["الخليج للعطور — النسخة العربية","عربي وخليجي","https://www.alkhaleejscents.com/ar"],["الخليج للعطور","عربي وخليجي","https://www.alkhaleejscents.com/"],["Local Perfumes","عربي وخليجي","https://www.localperfumes.com/"],["Swiss Arabian","عربي وخليجي","https://uae.swissarabian.com/"],["Zimaya","عربي وخليجي","https://uae.zimayaperfumes.com/ar"],["Elmeira","عربي وخليجي","https://elmeira.ae/"],["Sasan Perfumes","عربي وخليجي","https://www.sasanperfumes.com/en"],["Afnan UAE","عربي وخليجي","https://uae.afnan.com/"],["Byredo","فخامة عالمية","https://www.byredo.com/"],["Diptyque","فخامة عالمية","https://www.diptyqueparis.com/"],["Le Labo","فخامة عالمية","https://www.lelabofragrances.com/"],["Maison Francis Kurkdjian","فخامة عالمية","https://www.franciskurkdjian.com/"],["Jo Malone London","فخامة عالمية","https://www.jomalone.com/"],["Creed","فخامة عالمية","https://www.creedfragrance.com/"],["Penhaligon’s","فخامة عالمية","https://www.penhaligons.com/"],["Guerlain","فخامة عالمية","https://www.guerlain.com/"],["Dior","فخامة عالمية","https://www.dior.com/"],["Chanel","فخامة عالمية","https://www.chanel.com/"],["Tom Ford Beauty","فخامة عالمية","https://www.tomfordbeauty.com/"],["YSL Beauty","فخامة عالمية","https://www.yslbeautyus.com/"],["Prada","فخامة عالمية","https://www.prada.com/"],["Armani Beauty","فخامة عالمية","https://www.giorgioarmanibeauty-usa.com/"],["Valentino Beauty","فخامة عالمية","https://www.valentino-beauty.com/"],["Burberry","فخامة عالمية","https://www.burberry.com/"],["Hermès","فخامة عالمية","https://www.hermes.com/"],["Lancôme USA","فخامة عالمية","https://www.lancome-usa.com/"],["Viktor&Rolf","فخامة عالمية","https://www.viktor-rolf.com/"],["Mugler","فخامة عالمية","https://www.mugler.com/"],["Lancôme","فخامة عالمية","https://www.lancome.com/"],["Acqua di Parma","فخامة عالمية","https://www.acquadiparma.com/"],["Molton Brown","فخامة عالمية","https://www.moltonbrown.com/"],["Lush","متاجر ومنصات","https://www.lush.com/"],["Bath & Body Works","متاجر ومنصات","https://www.bathandbodyworks.com/"],["Victoria’s Secret","متاجر ومنصات","https://www.victoriassecret.com/"],["The Body Shop","متاجر ومنصات","https://www.thebodyshop.com/"],["Rituals","متاجر ومنصات","https://www.rituals.com/"],["FragranceX","متاجر ومنصات","https://www.fragrancex.com/"],["FragranceNet","متاجر ومنصات","https://www.fragrancenet.com/"],["Notino","متاجر ومنصات","https://www.notino.com/"],["Sephora","متاجر ومنصات","https://www.sephora.com/"],["Ulta Beauty","متاجر ومنصات","https://www.ulta.com/"],["Harrods","متاجر ومنصات","https://www.harrods.com/"],["Selfridges","متاجر ومنصات","https://www.selfridges.com/"],["Liberty London","متاجر ومنصات","https://www.libertylondon.com/"],["D.S. & Durga","متاجر ومنصات","https://dsanddurga.com/"],["Ffern","متاجر ومنصات","https://ffern.co/"],["Abbott NYC","متاجر ومنصات","https://abbottnyc.com/"],["Zarla — أفكار تصميم العطور","مراجع تصميم","https://www.zarla.com/inspiration/perfume"]];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const readFav = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { return []; } };
  const saveFav = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {} };
  function mount(target) {
    if (document.getElementById("referenceLibrary")) return;
    const style = document.createElement("style");
    style.textContent = `
      #referenceLibrary{padding:clamp(22px,4vw,48px) clamp(14px,3vw,32px);margin:26px auto;max-width:1240px;background:linear-gradient(135deg,#fffdf7,#f8f0e7);border:1px solid #d7bd83;border-radius:22px;color:#29251f}
      #referenceLibrary *{box-sizing:border-box} #referenceLibrary .ref-head{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
      #referenceLibrary h2{font-size:clamp(24px,4vw,36px);margin:0;color:#73521b} #referenceLibrary p{line-height:1.8;margin:8px 0 18px}
      #referenceLibrary .ref-tools{display:grid;grid-template-columns:minmax(0,1fr) minmax(145px,220px) auto;gap:10px;margin:18px 0}
      #referenceLibrary input,#referenceLibrary select{width:100%;min-width:0;padding:13px 14px;border:1px solid #c8b78f;border-radius:12px;background:#fff;color:#26221c;font:inherit;font-size:16px}
      #referenceLibrary .ref-btn{border:1px solid #98752c;background:#fff8e8;color:#66480e;border-radius:12px;padding:12px 15px;font:inherit;font-weight:700;cursor:pointer}
      #referenceLibrary .ref-count{font-size:14px;color:#675d4b;margin:8px 0 14px}
      #referenceLibrary .ref-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      #referenceLibrary .ref-card{min-width:0;padding:16px;border:1px solid #e0d3b6;background:#fff;border-radius:15px;display:flex;flex-direction:column;gap:9px;box-shadow:0 3px 12px #4935120b}
      #referenceLibrary .ref-card h3{font-size:18px;line-height:1.5;margin:0;color:#29251f;overflow-wrap:anywhere}
      #referenceLibrary .ref-tag{font-size:13px;color:#7d632c} #referenceLibrary .ref-actions{display:flex;gap:8px;align-items:center;margin-top:auto;flex-wrap:wrap}
      #referenceLibrary .ref-open{color:#fff;background:#78591e;border-radius:10px;padding:9px 12px;text-decoration:none;font-weight:700}
      #referenceLibrary .ref-star{padding:8px 11px;border:1px solid #d8c69e;background:#fffaf0;border-radius:10px;color:#684d17;font:inherit;cursor:pointer}
      #referenceLibrary .ref-url{font-size:12px;color:#766f62;overflow-wrap:anywhere;direction:ltr;text-align:left}
      @media(max-width:800px){#referenceLibrary .ref-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#referenceLibrary .ref-tools{grid-template-columns:1fr 1fr}#referenceLibrary .ref-tools input{grid-column:1/-1}}
      @media(max-width:480px){#referenceLibrary{border-radius:15px}#referenceLibrary .ref-grid{grid-template-columns:1fr}#referenceLibrary .ref-tools{grid-template-columns:1fr}#referenceLibrary .ref-tools input{grid-column:auto}}
    `;
    document.head.appendChild(style);
    const section = document.createElement("section");
    section.id = "referenceLibrary"; section.className = "reference-library-section";
    section.innerHTML = `
      <div class="ref-head"><div><h2>مكتبة المواقع المرجعية</h2><p>احفظ مواقع الإلهام، وابحث بالاسم أو نوع التصميم، وافتح أي موقع في تبويب جديد. المفضلة محفوظة على هذا الجهاز.</p></div>
      <button class="ref-btn" id="refOnlyFav" type="button" aria-pressed="false">★ المفضلة فقط</button></div>
      <div class="ref-tools"><input id="refSearch" type="search" placeholder="ابحث عن موقع أو علامة عطرية..." aria-label="البحث في المواقع المرجعية"><select id="refCategory" aria-label="تصنيف المواقع"><option value="">كل التصنيفات</option><option>عربي وخليجي</option><option>فخامة عالمية</option><option>متاجر ومنصات</option><option>مراجع تصميم</option></select><button class="ref-btn" id="refClear" type="button">مسح البحث</button></div>
      <div id="refCount" class="ref-count" aria-live="polite"></div><div id="refGrid" class="ref-grid"></div>`;
    if (target) target.appendChild(section);
    // The reference library is mounted only inside the owner settings panel.
    const search = section.querySelector("#refSearch"), category = section.querySelector("#refCategory"), grid = section.querySelector("#refGrid"), count = section.querySelector("#refCount"), favOnly = section.querySelector("#refOnlyFav");
    let onlyFav = false;
    function render() {
      const q = search.value.trim().toLocaleLowerCase();
      const favs = readFav();
      const list = sites.map((s,i)=>({s,i})).filter(({s,i}) => (!onlyFav || favs.includes(i)) && (!category.value || s[1]===category.value) && (!q || (s[0]+" "+s[1]+" "+s[2]).toLocaleLowerCase().includes(q)));
      count.textContent = "عرض " + list.length + " من " + sites.length + " موقعًا";
      grid.innerHTML = list.map(({s,i}) => '<article class="ref-card"><span class="ref-tag">'+esc(s[1])+' · '+String(i+1).padStart(2,"0")+'</span><h3>'+esc(s[0])+'</h3><div class="ref-url">'+esc(s[2])+'</div><div class="ref-actions"><a class="ref-open" href="'+esc(s[2])+'" target="_blank" rel="noopener noreferrer">فتح الموقع ↗</a><button type="button" class="ref-star" data-fav="'+i+'" aria-pressed="'+favs.includes(i)+'">'+(favs.includes(i)?"★ محفوظ بالمفضلة":"☆ أضف للمفضلة")+'</button></div></article>').join("") || '<p>لا توجد نتائج مطابقة. جرّب كلمة بحث أخرى.</p>';
    }
    search.addEventListener("input",render); category.addEventListener("change",render);
    favOnly.addEventListener("click",()=>{onlyFav=!onlyFav;favOnly.setAttribute("aria-pressed",String(onlyFav));favOnly.textContent=onlyFav?"عرض كل المواقع":"★ المفضلة فقط";render();});
    const clearSearchButton = section.querySelector("#refClear");
    if (clearSearchButton) clearSearchButton.addEventListener("click",()=>{search.value="";category.value="";onlyFav=false;favOnly.setAttribute("aria-pressed","false");favOnly.textContent="★ المفضلة فقط";render();search.focus();});
    grid.addEventListener("click",e=>{const b=e.target.closest("[data-fav]");if(!b)return;const i=Number(b.dataset.fav),favs=readFav();saveFav(favs.includes(i)?favs.filter(n=>n!==i):[...favs,i]);render();});
    render();
  }
  window.MamlakaReferenceLibrary = {
    mountInto(target) {
      if (!target) return;
      let section = document.getElementById("referenceLibrary");
      if (!section) { mount(target); section = document.getElementById("referenceLibrary"); }
      else if (section.parentNode !== target) target.appendChild(section);
    }
  };
})();
;

/* ===== MODULE 3: settings.js ===== */
;
(() => {
  "use strict";
  const WA_KEY="mamlaka_admin_whatsapp_v1", THEME_KEY="mamlaka_theme_v1", PIN_KEY="mamlaka_admin_pin_v1";
  const $=s=>document.querySelector(s);
  // Recovery guard: keep close/back and settings persistence working even if a later admin initializer throws.
  function forceCloseAdmin(){
    const layer=document.getElementById("adminLayer");
    if(layer){layer.classList.add("hidden");layer.setAttribute("aria-hidden","true");}
    document.body.classList.remove("admin-open","modal-open");
    document.documentElement.classList.remove("admin-open","modal-open");
  }
  function emergencySaveSettings(){
    const layer=document.getElementById("adminLayer");
    if(!layer)return false;
    const get=id=>layer.querySelector("#"+id);
    const fields={cfgBg:"bg",cfgPanel:"panel",cfgPanel2:"panel2",cfgCard:"card",cfgField:"field",cfgGold:"gold",cfgGold2:"gold2",cfgText:"text",cfgHeading:"heading",cfgMuted:"muted",cfgLine:"line",cfgHeader:"header",cfgFooter:"footer",cfgButton:"button",cfgButtonText:"buttonText",cfgIndexBg:"indexBg",cfgIndexCard:"indexCard",cfgIndexIcon:"indexIcon",cfgIndexBorder:"indexBorder"};
    try{
      const preset=get("cfgPreset"),style=get("cfgVisualStyle"),mobile=get("cfgMobileDesign"),web=get("cfgWebDesign"),bg=get("cfgBackgroundImage"),overlay=get("cfgOverlay");
      let theme={...themePresets.design03,...JSON.parse(localStorage.getItem("mamlaka_theme_v1")||"{}")};
      if(preset&&preset.value!=="custom"&&themePresets[preset.value])theme={...theme,...themePresets[preset.value]};
      Object.entries(fields).forEach(([id,key])=>{const el=get(id);if(el&&/^#[0-9a-f]{6}$/i.test(el.value))theme[key]=el.value;});
      if(style)theme.visualStyle=style.value;
      if(mobile)theme.mobileDesign=mobile.value;
      if(web)theme.webDesign=web.value;
      if(bg)theme.backgroundImage=bg.value.trim()||"none";
      if(overlay&&Number.isFinite(+overlay.value))theme.overlay=Math.max(0,Math.min(.65,+overlay.value/100));
      localStorage.setItem("mamlaka_theme_v1",JSON.stringify(theme));
      const visualValues={brightness:"cfgBrightness",contrast:"cfgContrast",fontScale:"cfgFontScale",imageClarity:"cfgImageClarity",lineHeight:"cfgLineHeight",iconScale:"cfgIconScale",homeScale:"cfgHomeScale",categoryScale:"cfgCategoryScale",productScale:"cfgProductScale",bottleScale:"cfgBottleScale"};
      const visualDefaults={brightness:100,contrast:100,fontScale:100,imageClarity:100,lineHeight:150,iconScale:85,homeScale:90,categoryScale:85,productScale:80,bottleScale:70};
      const visual={};Object.entries(visualValues).forEach(([key,id])=>{const el=get(id);const n=Number(el?.value??visualDefaults[key]);visual[key]=Number.isFinite(n)?n:visualDefaults[key];});
      const visualRaw=JSON.stringify(visual);localStorage.setItem("mamlaka_visual_tuning_v1",visualRaw);if(localStorage.getItem("mamlaka_visual_tuning_v1")!==visualRaw)throw new Error("تعذر التحقق من حفظ إعدادات الوضوح");
      /* Keep mamlaka_theme reserved for the light/dark mode string. */
      const name=get("cfgName"),wa=get("cfgWhatsapp");
      if(name)localStorage.setItem("mamlaka_store_name_v1",name.value.trim()||"مملكة العطور");
      if(wa)localStorage.setItem("mamlaka_admin_whatsapp_v1",wa.value.replace(/\D/g,"")||"201272776928");
      const css=document.getElementById("mamlaka-emergency-theme")||document.head.appendChild(Object.assign(document.createElement("style"),{id:"mamlaka-emergency-theme"}));
      const cssVars={bg:theme.bg,panel:theme.panel,panel2:theme.panel2,card:theme.card,field:theme.field,gold:theme.gold,gold2:theme.gold2,text:theme.text,heading:theme.heading,muted:theme.muted,line:theme.line,"header-bg":theme.header,"footer-bg":theme.footer,"button-bg":theme.button,"button-text":theme.buttonText,"index-bg":theme.indexBg,"index-card":theme.indexCard,"index-icon":theme.indexIcon,"index-border":theme.indexBorder};css.textContent=":root{"+Object.entries(cssVars).map(([k,v])=>"--"+k+":"+v).join(";")+"}";Object.entries(cssVars).forEach(([k,v])=>document.documentElement.style.setProperty("--"+k,v));
      const status=get("settingsSaveStatus");if(status){status.dataset.state="saved";status.textContent="✓ تم حفظ الإعدادات والتحقق منها على هذا الجهاز";}
      return true;
    }catch(err){console.error("Emergency settings save failed",err);const status=get("settingsSaveStatus");if(status){status.dataset.state="error";status.textContent="تعذر الحفظ: "+(err.message||"خطأ في التخزين");}return false;}
  }
  document.addEventListener("click",event=>{
    const closeButton=event.target.closest("#adminClose,[data-admin-close],#settingsBack,#settingsExit");
    if(closeButton){event.preventDefault();forceCloseAdmin();return;}
    if(event.target.id==="adminLayer"){forceCloseAdmin();return;}
    const saveButton=event.target.closest("#saveSite,#saveAllSettings,#settingsSave");
    if(saveButton){event.preventDefault();emergencySaveSettings();}
  },true);
  document.addEventListener("keydown",event=>{const layer=document.getElementById("adminLayer");if(event.key==="Escape"&&layer&&!layer.classList.contains("hidden"))forceCloseAdmin();});
  // Bind the admin entry points immediately, before the rest of startup can fail.
  // Delegation also survives if the header shortcut is created later by setup().
  document.addEventListener("click",event=>{
    const trigger=event.target.closest("#homeSettingsShortcut,#settingsShortcut,#menuAdminShortcut");
    if(!trigger)return;
    event.preventDefault();
    try{
      open();
      loadCfg();
    }catch(error){
      console.error("Mamlakat admin panel failed to open:",error);
      const layer=document.getElementById("adminLayer");
      if(layer){layer.classList.remove("hidden");}
      window.alert("تعذر فتح لوحة الإدارة بسبب خطأ أثناء التهيئة. أعد تحميل الصفحة، وإذا استمرت المشكلة افتح وحدة التحكم لمعرفة الخطأ.");
    }
  });
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>{const raw=JSON.stringify(v);try{localStorage.setItem(k,raw);if(localStorage.getItem(k)!==raw)throw new Error("تعذر التحقق من الحفظ");return true}catch(error){console.error("Mamlaka storage write failed:",k,error);throw new Error("مساحة التخزين ممتلئة أو غير متاحة. صدّر نسخة JSON واحذف ملفات/بيانات غير لازمة ثم أعد المحاولة.");}};
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const setPlain=(key,value)=>{const v=String(value??"");localStorage.setItem(key,v);if(localStorage.getItem(key)!==v)throw new Error("تعذر تأكيد حفظ الإعداد: "+key);return true;};
  const products=()=>{try{return JSON.parse(localStorage.getItem("mamlaka_custom_products_v1"))||[]}catch{return[]}};
  const BACKUP_KEYS=["mamlaka_custom_products_v1","mamlaka_supplier_catalog_v1","mamlaka_supplier_oils_v1","mamlaka_catalog_taxonomy_config_v1","mamlaka_theme_v1","mamlaka_theme","mamlaka_visual_tuning_v1","mamlaka_admin_whatsapp_v1","mamlaka_store_name_v1","mamlaka_cart_v1","mamlaka_favorites_v1","mamlaka_requests_v1","mamlaka_inventory_accounting_v1","mamlaka_section_backgrounds_v1","mamlaka_file_library_v1","mamlaka_ai_endpoint_v1"];
  const storageSnapshot=()=>{const out={};BACKUP_KEYS.forEach(k=>{const raw=localStorage.getItem(k);if(raw!==null){try{out[k]=JSON.parse(raw)}catch{out[k]=raw}}});return out;};
  let baseReadyProducts=[];
  async function loadBaseReadyProducts(){try{const response=await fetch("data/products.json",{cache:"no-cache"});if(!response.ok)return;const data=await response.json();const rows=Array.isArray(data)?data:data?.products;if(!Array.isArray(rows))return;baseReadyProducts=rows.map((p,i)=>({...p,id:String(p.id||p.sku||("catalog-product-"+i)),nameAr:p.nameAr||p.name_ar||p.arName||p.name||"",nameEn:p.nameEn||p.name_en||p.enName||"",brand:p.brand||p.company||p.manufacturer||"",productType:p.productType||p.product_type||"ready",image:p.image||p.imageUrl||p.image_url||"",price:p.price??null,prices:p.prices&&typeof p.prices==="object"?p.prices:{},available:p.available===true&&p.needsReview===false}));renderAdminProducts();}catch{}};
  const adminReadyProducts=()=>{const merged=new Map(baseReadyProducts.map(p=>[String(p.id),p]));products().forEach(p=>merged.set(String(p.id),{...(merged.get(String(p.id))||{}),...p}));return [...merged.values()];};
  const saveProducts=p=>{const key="mamlaka_custom_products_v1",raw=JSON.stringify(p);try{localStorage.setItem(key,raw);if(localStorage.getItem(key)!==raw)throw new Error("لم يتم تأكيد حفظ المنتجات");return true;}catch(error){console.error("Mamlaka product/image save failed",error);throw new Error("تعذر حفظ المنتج أو صورته: مساحة التخزين المحلية ممتلئة أو غير متاحة. استخدم صورة أصغر أو رابط صورة مباشرًا، ثم صدّر نسخة JSON احتياطية.");}};
  const themePresets={
    design01:{label:"1 — خزفي هادئ",bg:"#F3F6F7",panel:"#FFFFFF",panel2:"#E4EAED",card:"#FFFFFF",field:"#FFFFFF",gold:"#526872",gold2:"#82969E",text:"#303B40",heading:"#243238",muted:"#627077",line:"#CDD7DA",header:"#FAFCFC",footer:"#E3E9EB",button:"#405760",buttonText:"#FFFFFF",indexBg:"#F3F6F7",indexCard:"#FFFFFF",indexIcon:"#526872",indexBorder:"#82969E",backgroundImage:"none",overlay:0.08,visualStyle:"ios"},
    design02:{label:"2 — عاجي وفحمي",bg:"#F5F3EF",panel:"#FFFFFF",panel2:"#E8E5DF",card:"#FFFFFF",field:"#FFFFFF",gold:"#4D5052",gold2:"#85898B",text:"#343638",heading:"#25282A",muted:"#626669",line:"#D0D0CB",header:"#FAF9F6",footer:"#E5E3DD",button:"#414547",buttonText:"#FFFFFF",indexBg:"#F5F3EF",indexCard:"#FFFFFF",indexIcon:"#4D5052",indexBorder:"#85898B",backgroundImage:"none",overlay:0.08,visualStyle:"classic"},
    design03:{label:"3 — رخام رمادي",bg:"#F0F2F4",panel:"#FFFFFF",panel2:"#E2E6EA",card:"#FFFFFF",field:"#FFFFFF",gold:"#586B7A",gold2:"#9AAAB6",text:"#303B44",heading:"#263541",muted:"#606D76",line:"#CCD3D9",header:"#F8F9FA",footer:"#E1E5E9",button:"#465B6B",buttonText:"#FFFFFF",indexBg:"#F0F2F4",indexCard:"#FFFFFF",indexIcon:"#586B7A",indexBorder:"#9AAAB6",backgroundImage:"none",overlay:0.08,visualStyle:"classic"},
    design04:{label:"4 — كريمي وإسبريسو",bg:"#F8F3EA",panel:"#FFFEFB",panel2:"#EEE5D9",card:"#FFFEFB",field:"#FFFFFF",gold:"#684D3D",gold2:"#A98C78",text:"#40352E",heading:"#3C2C23",muted:"#6D5B50",line:"#DCCFC2",header:"#FCF8F2",footer:"#EAE0D4",button:"#684D3D",buttonText:"#FFFFFF",indexBg:"#F8F3EA",indexCard:"#FFFEFB",indexIcon:"#684D3D",indexBorder:"#A98C78",backgroundImage:"none",overlay:0.08,visualStyle:"ios"},
    design05:{label:"5 — لاتيه وموكا",bg:"#F3ECE3",panel:"#FFFCF8",panel2:"#E7D9CA",card:"#FFFCF8",field:"#FFFFFF",gold:"#76533D",gold2:"#B48E72",text:"#45352B",heading:"#4A3022",muted:"#705C4E",line:"#D9C7B6",header:"#F9F2E9",footer:"#E5D5C5",button:"#76533D",buttonText:"#FFFFFF",indexBg:"#F3ECE3",indexCard:"#FFFCF8",indexIcon:"#76533D",indexBorder:"#B48E72",backgroundImage:"none",overlay:0.08,visualStyle:"android"},
    design06:{label:"6 — لؤلؤي وفضي",bg:"#F6F7F7",panel:"#FFFFFF",panel2:"#E8EBEC",card:"#FFFFFF",field:"#FFFFFF",gold:"#64727A",gold2:"#AAB5BA",text:"#303A3F",heading:"#263238",muted:"#626E73",line:"#D0D7DA",header:"#FBFCFC",footer:"#E5E9EA",button:"#56666F",buttonText:"#FFFFFF",indexBg:"#F6F7F7",indexCard:"#FFFFFF",indexIcon:"#64727A",indexBorder:"#AAB5BA",backgroundImage:"none",overlay:0.08,visualStyle:"classic"},
    design07:{label:"7 — رمل وحجر",bg:"#F3EEE6",panel:"#FFFCF7",panel2:"#E8DCCF",card:"#FFFCF7",field:"#FFFFFF",gold:"#715543",gold2:"#B19782",text:"#40342B",heading:"#38291F",muted:"#6C5A4D",line:"#D8C9B9",header:"#FAF5EE",footer:"#E6D9CB",button:"#624735",buttonText:"#FFFFFF",indexBg:"#F3EEE6",indexCard:"#FFFCF7",indexIcon:"#715543",indexBorder:"#B19782",backgroundImage:"none",overlay:0.08,visualStyle:"android"},
    design08:{label:"8 — أزرق ضبابي",bg:"#EDF3F7",panel:"#FFFFFF",panel2:"#DDE8F0",card:"#FFFFFF",field:"#FFFFFF",gold:"#426C8A",gold2:"#8CB0C8",text:"#293B49",heading:"#203D52",muted:"#596F7F",line:"#C8D8E3",header:"#F7FAFC",footer:"#DDE8F0",button:"#426C8A",buttonText:"#FFFFFF",indexBg:"#EDF3F7",indexCard:"#FFFFFF",indexIcon:"#426C8A",indexBorder:"#8CB0C8",backgroundImage:"none",overlay:0.08,visualStyle:"ios"},
    design09:{label:"9 — كتان وفحمي",bg:"#F1F0EB",panel:"#FCFBF8",panel2:"#E4E2DB",card:"#FCFBF8",field:"#FFFFFF",gold:"#555A59",gold2:"#929794",text:"#343937",heading:"#252B29",muted:"#636B67",line:"#D0D2CB",header:"#FAF9F5",footer:"#E3E2DA",button:"#454B48",buttonText:"#FFFFFF",indexBg:"#F1F0EB",indexCard:"#FCFBF8",indexIcon:"#555A59",indexBorder:"#929794",backgroundImage:"none",overlay:0.08,visualStyle:"classic"},
    design10:{label:"10 — بورسلين نظيف",bg:"#F7F7F4",panel:"#FFFFFF",panel2:"#EBECE7",card:"#FFFFFF",field:"#FFFFFF",gold:"#56615C",gold2:"#929D96",text:"#343B37",heading:"#242D28",muted:"#626C66",line:"#D5DAD5",header:"#FFFFFF",footer:"#E7EAE5",button:"#46524C",buttonText:"#FFFFFF",indexBg:"#F7F7F4",indexCard:"#FFFFFF",indexIcon:"#56615C",indexBorder:"#929D96",backgroundImage:"none",overlay:0.08,visualStyle:"ios"}
  };
  const colorRgb=value=>{let h=String(value||"#000000").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");if(!/^[0-9a-f]{6}$/i.test(h))h="000000";return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
  const colorLum=value=>{const c=colorRgb(value).map(n=>{n/=255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
  function isGoldTone(value){const rgb=colorRgb(value).map(n=>n/255),max=Math.max(...rgb),min=Math.min(...rgb),d=max-min;if(d<.14||max===0)return false;let h=0;if(max===rgb[0])h=60*(((rgb[1]-rgb[2])/d)%6);else if(max===rgb[1])h=60*((rgb[2]-rgb[0])/d+2);else h=60*((rgb[0]-rgb[1])/d+4);if(h<0)h+=360;return h>=32&&h<=65&&(d/(1-Math.abs(2*((max+min)/2)-1)))>.24;}
  const mixColor=(a,b,ratio=0.5)=>"#"+colorRgb(a).map((n,i)=>Math.round(n*(1-ratio)+colorRgb(b)[i]*ratio).toString(16).padStart(2,"0")).join("");
  function isPinkTone(value){
    const h=String(value||"").replace("#","");
    if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(h))return false;
    const full=h.length===3?h.split("").map(x=>x+x).join(""):h;
    const rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255),max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min;
    if(delta<0.12||max===0)return false;
    let hue=0;
    if(max===rgb[0])hue=60*(((rgb[1]-rgb[2])/delta)%6);
    else if(max===rgb[1])hue=60*((rgb[2]-rgb[0])/delta+2);
    else hue=60*((rgb[0]-rgb[1])/delta+4);
    if(hue<0)hue+=360;
    const light=(max+min)/2,sat=delta/(1-Math.abs(2*light-1));
    return sat>0.16 && light>0.16 && (hue>=325 || hue<=8);
  }
  function completeTheme(input={}){
    /* Normalize every saved or preset theme before it reaches the UI.
       The previous version referenced undeclared variables (v, dark, raw),
       which threw during script startup and prevented the entire admin panel
       from registering its buttons. */
    const raw = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const base = themePresets.design02 || themePresets.design01 || {};
    const v = {...base, ...raw};
    const dark = colorLum(v.bg || base.bg || "#FAF6ED") < 0.22;
    const defaults = {
      bg: base.bg || "#FAF6ED",
      panel: base.panel || "#FFFFFF",
      gold: base.gold || "#A97A25",
      gold2: base.gold2 || "#D9B765",
      text: base.text || "#403124",
      panel2: mixColor(v.bg, v.panel, dark ? 0.32 : 0.62),
      card: v.panel,
      field: v.panel,
      muted: mixColor(v.text, v.bg, dark ? 0.38 : 0.34),
      line: mixColor(v.bg, v.text, dark ? 0.28 : 0.14),
      heading: v.text,
      header: mixColor(v.bg, v.gold, dark ? 0.16 : 0.10),
      footer: mixColor(v.bg, v.text, dark ? 0.06 : 0.08),
      button: v.gold,
      buttonText: colorLum(v.gold) > 0.48 ? "#20251f" : "#ffffff",
      indexBg: v.bg,
      indexCard: v.panel,
      indexIcon: v.gold,
      indexBorder: v.gold2
    };
    const colorKeys = ["bg","panel","panel2","card","field","gold","gold2","text","heading","muted","line","header","footer","button","buttonText","indexBg","indexCard","indexIcon","indexBorder"];
    colorKeys.forEach(key => {
      const value = String(v[key] || "");
      const accentKey = key==="gold"||key==="gold2"||key==="button"||key==="indexIcon"||key==="indexBorder";
      const legacyGold = accentKey && isGoldTone(value);
      if (!/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value) || isPinkTone(value) || legacyGold) {
        v[key] = legacyGold ? (base[key] || "#4D5052") : (defaults[key] || base[key] || "#FFFFFF");
      }
    });
    if (!v.backgroundImage) v.backgroundImage = "none";
    if (!Number.isFinite(Number(v.overlay))) v.overlay = 0.08;
    return v;
  }
  /* The design selector intentionally contains only the ten new concepts.
     Legacy palettes remain internal for compatibility with saved settings, but are not offered to customers/admins. */
  const addThemeOptions=()=>{
    const select=document.querySelector("#cfgPreset");
    if(!select)return;
    const choices=[
      ["design01","1 — أزرق خزفي"],
      ["design02","2 — عاجي وفحمي"],
      ["design03","3 — رخام رمادي"],
      ["design04","4 — كريمي وإسبريسو"],
      ["design05","5 — لاتيه وموكا"],
      ["design06","6 — لؤلؤي وفضي"],
      ["design07","7 — رمل وموكا"],
      ["design08","8 — أزرق ضبابي"],
      ["design09","9 — كتان وفحمي"],
      ["design10","10 — ملكي ليلي وأبيض"]
    ];
    const custom=Array.from(select.options).find(option=>option.value==="custom");
    select.replaceChildren();
    choices.forEach(([key,label])=>{
      const option=document.createElement("option");
      option.value=key;option.textContent=label;select.appendChild(option);
    });
    const customOption=custom||document.createElement("option");
    customOption.value="custom";customOption.textContent="ألوان مخصصة";
    select.appendChild(customOption);
  };
  addThemeOptions();

  Object.keys(themePresets).forEach(key=>{themePresets[key]=completeTheme(themePresets[key])});
  const baseTheme=themePresets.design03
  function applyTheme(t){
    const x=completeTheme(t);x.backgroundImage="none";const root=document.documentElement,style=root.style; const visualStyle=({windows:"windows",android:"android",ios:"ios",oneui:"oneui",pixel:"pixel",classic:"classic",royal:"windows",editorial:"ios",soft:"android",glass:"ios",boutique:"classic",bold:"windows",minimal:"classic",botanical:"pixel"})[x.visualStyle]||"classic"; root.dataset.visualStyle=visualStyle;root.dataset.mobileDesign=/^mobile-\d{2}$/.test(x.mobileDesign||"")?x.mobileDesign:"mobile-02";root.dataset.webDesign=/^web-\d{2}$/.test(x.webDesign||"")?x.webDesign:"web-02";
    style.setProperty("--bg",x.bg);style.setProperty("--panel",x.panel);style.setProperty("--panel2",x.panel2);style.setProperty("--card",x.card);style.setProperty("--field",x.field);style.setProperty("--gold",x.gold);style.setProperty("--gold2",x.gold2);style.setProperty("--text",x.text);style.setProperty("--heading",x.heading);style.setProperty("--muted",x.muted);style.setProperty("--line",x.line);style.setProperty("--header-bg",x.header);style.setProperty("--footer-bg",x.footer);style.setProperty("--button-bg",x.button);style.setProperty("--button-text",x.buttonText);style.setProperty("--index-bg",x.indexBg||x.bg);style.setProperty("--index-card",x.indexCard||x.card);style.setProperty("--index-icon",x.indexIcon||x.gold);style.setProperty("--index-border",x.indexBorder||x.gold2);
    style.setProperty("--page-image",x.backgroundImage&&x.backgroundImage!=="none"?"url("+JSON.stringify(x.backgroundImage)+")":"none");
    style.setProperty("--bg-overlay",String(Math.max(0.05,Math.min(0.85,Number(x.overlay??0.28)))));
    const visual=read("mamlaka_visual_tuning_v1",{brightness:100,contrast:100,fontScale:100,imageClarity:100,lineHeight:150,iconScale:85,homeScale:90,categoryScale:85,productScale:80,bottleScale:70});root.style.fontSize=(16*Math.max(85,Math.min(120,Number(visual.fontScale)||100))/100)+"px";
    const tuneStyle=document.getElementById("mamlaka-visual-tuning-style")||document.createElement("style");tuneStyle.id="mamlaka-visual-tuning-style";
    tuneStyle.textContent=`:root{--mamlaka-brightness:${Math.max(70,Math.min(130,Number(visual.brightness)||100))}%;--mamlaka-contrast:${Math.max(80,Math.min(125,Number(visual.contrast)||100))}%;--mamlaka-font-scale:${Math.max(85,Math.min(120,Number(visual.fontScale)||100))}%;--mamlaka-image-clarity:${Math.max(10,Math.min(100,Number(visual.imageClarity)||100))}%;--mamlaka-line-height:${Math.max(120,Math.min(180,Number(visual.lineHeight)||150))}%}html{line-height:var(--mamlaka-line-height,150%)}body{background-color:color-mix(in srgb,var(--bg,#f7f3ec) calc(var(--mamlaka-brightness,100%) - 30%),#fff 30%);filter:none}body :is(p,small,label,li,td,th,input,select,textarea,button){text-shadow:none}body :is(p,small,label,li,td,th){filter:contrast(var(--mamlaka-contrast,100%))}body::before{opacity:calc(var(--mamlaka-image-clarity,100%)/100)}
.icon-btn,.favorite-btn,.home-index-icon,.category-icon-wrap,.royal-category-icon,.header-line-icon{--ui-icon-scale:${Math.max(60,Math.min(130,Number(visual.iconScale)||85))/100};}
.icon-btn svg,.icon-btn .icon,.header-line-icon,.category-icon-wrap svg,.royal-category-icon{transform:scale(var(--ui-icon-scale,1));transform-origin:center;}
.home-index-card{--home-ui-scale:${Math.max(65,Math.min(120,Number(visual.homeScale)||90))/100};min-height:calc(68px * var(--home-ui-scale));padding:calc(10px * var(--home-ui-scale))!important;gap:calc(8px * var(--home-ui-scale))!important;}
.home-index-icon{font-size:calc(25px * var(--ui-icon-scale,1))!important;}
.hero{--home-ui-scale:${Math.max(65,Math.min(120,Number(visual.homeScale)||90))/100};min-height:calc(290px * var(--home-ui-scale));}
.category-card{--category-ui-scale:${Math.max(60,Math.min(120,Number(visual.categoryScale)||85))/100};min-height:calc(124px * var(--category-ui-scale))!important;padding:calc(12px * var(--category-ui-scale))!important;gap:calc(8px * var(--category-ui-scale))!important;}
.category-icon-wrap{width:calc(42px * var(--ui-icon-scale,1));height:calc(42px * var(--ui-icon-scale,1));min-width:calc(42px * var(--ui-icon-scale,1));}
.product-card{--product-ui-scale:${Math.max(60,Math.min(120,Number(visual.productScale)||80))/100};}
.product-info{padding:calc(10px * var(--product-ui-scale))!important;gap:calc(5px * var(--product-ui-scale))!important;}
.product-visual{height:calc(100px * ${Math.max(55,Math.min(120,Number(visual.bottleScale)||70))/100})!important;min-height:calc(100px * ${Math.max(55,Math.min(120,Number(visual.bottleScale)||70))/100})!important;}
.product-visual img,.product-visual .product-photo,.product-visual .placeholder-bottle{height:calc(82px * ${Math.max(55,Math.min(120,Number(visual.bottleScale)||70))/100})!important;max-height:calc(82px * ${Math.max(55,Math.min(120,Number(visual.bottleScale)||70))/100})!important;}
.product-actions{gap:calc(5px * var(--product-ui-scale))!important;margin-top:calc(4px * var(--product-ui-scale))!important;}`;
    if(!tuneStyle.isConnected)document.head.appendChild(tuneStyle);
    const hex=v=>{const z=String(v||"#ffffff").replace("#","");return z.length===3?z.split("").map(q=>q+q).join(""):z.slice(0,6)};
    const rgb=v=>{const z=hex(v);return [parseInt(z.slice(0,2),16)||0,parseInt(z.slice(2,4),16)||0,parseInt(z.slice(4,6),16)||0]};
    const lum=v=>{const c=rgb(v).map(n=>{n/=255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
    const heroImage=document.querySelector(".hero-image");if(heroImage&&x.backgroundImage&&x.backgroundImage!=="none")heroImage.src=x.backgroundImage;
    const dark=lum(x.bg)<.22,muted=x.muted,line=x.line;
    let runtimeThemeStyle=document.getElementById("mamlaka-runtime-theme");
    if(!runtimeThemeStyle){runtimeThemeStyle=document.createElement("style");runtimeThemeStyle.id="mamlaka-runtime-theme";document.head.appendChild(runtimeThemeStyle);}
    runtimeThemeStyle.textContent=`
      :root{color-scheme:${dark?"dark":"light"};--bg:${x.bg};--panel:${x.panel};--panel2:${x.panel2};--card:${x.card};--field:${x.field};--gold:${x.gold};--gold2:${x.gold2};--text:${x.text};--heading:${x.heading};--muted:${x.muted};--line:${x.line};--header-bg:${x.header};--footer-bg:${x.footer};--button-bg:${x.button};--button-text:${x.buttonText};--index-bg:${x.indexBg||"#0A0A0A"};--index-card:${x.indexCard||"#15120B"};--index-icon:${x.indexIcon||"#D4AF37"};--index-border:${x.indexBorder||"#F1D77A"};--page-image:none;--bg-overlay:${Math.max(.05,Math.min(.85,Number(x.overlay??.16)))}}
      body{background-color:var(--bg)!important;background-image:none!important;color:var(--text)!important}
      .site-header{background:color-mix(in srgb,var(--header-bg) 94%,transparent)!important;border-color:var(--line)!important;color:var(--text)!important}
      .brand strong,.section-heading h2,.contact-card h2,.gift-copy h2,.feature-copy h2,.product-info h3,.cart-line h4,.drawer-head h2,.product-modal h2,.admin-panel h2,.admin-panel h3{color:var(--heading)!important}
      .brand small,.eyebrow,.brand-crown,.hero h1 span,.feature-copy h2 span,.line-icon,.hero-pagination i.active,.hero-next,.product-en,.product-price,.product-badge,.favorite-btn,.icon-btn{color:var(--gold)!important}
      .main-nav a,.main-nav a.active{color:var(--text)!important}
      .hero,.split-feature,.trust-strip,.contact-card,.gift-art,.advisor-box,.advisor-symbol,.blend-panel,.blend-summary,.feature-banner,.category-card,.product-card,.product-visual,.product-info,.drawer,.product-modal,.toast,.admin-panel,.admin-card,.admin-section,.admin-page,.settings-panel{background-color:var(--panel)!important;color:var(--text)!important;border-color:var(--line)!important}
      .hero-shade{background:linear-gradient(90deg,color-mix(in srgb,var(--bg) 96%,transparent),color-mix(in srgb,var(--bg) 76%,transparent) 42%,transparent 100%)!important}
      .trust-strip,.site-footer{background:var(--footer-bg)!important;color:var(--text)!important;border-color:var(--line)!important}
      .category-card,.product-card,.blend-panel,.advisor-box,.contact-card,.gift-art,.feature-banner,.feature-copy,.gift-copy{background:var(--panel2)!important;color:var(--text)!important}
      .category-card h3,.product-info h3,.section-heading h2,.contact-card h2,.gift-copy h2,.feature-copy h2,.suggestion h4{color:var(--heading)!important}
      .category-card p,.product-desc,.section-heading>p,.product-meta,.muted,small,.hero-copy>p:not(.eyebrow),.feature-copy>p:not(.eyebrow),.gift-copy>p:not(.eyebrow){color:var(--muted)!important}
      .search-box,.toolbar select,.blend-step select,.blend-summary,.advisor-form input,.modal-product select,.product-modal input,.product-modal textarea,.admin-panel input,.admin-panel select,.admin-panel textarea{background:var(--field)!important;color:var(--text)!important;border-color:var(--line)!important}
      input,select,textarea{accent-color:var(--gold)!important}
      .btn-gold,.small-btn.primary{background:var(--button-bg)!important;color:var(--button-text)!important;border-color:var(--button-bg)!important}
      .btn-outline,.small-btn,.icon-btn,.favorite-btn,.qty-btn,.text-btn{border-color:var(--line)!important;color:var(--gold)!important}
      .drawer-bottom,.drawer-head,.cart-line,.product-bottom,.section,.section-heading,.product-modal,.modal-product,.suggestion{border-color:var(--line)!important}
      .drawer-backdrop,.modal-backdrop{background:color-mix(in srgb,var(--text) 50%,transparent)!important}
      .site-footer>p,.site-footer>small,.intro-content h1,.crown-mark{color:var(--gold2)!important}
      .intro{background:var(--bg)!important}.intro:before,.intro:after{border-color:var(--line)!important}.intro-subtitle{color:var(--muted)!important}
      .category-card:before{border-color:color-mix(in srgb,var(--gold) 20%,transparent)!important}
      .product-visual{background:radial-gradient(ellipse at 50% 55%,color-mix(in srgb,var(--gold) 18%,transparent),transparent 58%)!important}
      .placeholder-bottle{border-color:var(--gold)!important}
      .product-badge{background:var(--panel)!important;border-color:var(--line)!important}
      .toast{background:var(--panel)!important;color:var(--text)!important}
      `;

    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",x.bg||baseTheme.bg);
    document.documentElement.style.colorScheme=dark?"dark":"light";write(THEME_KEY,x);
  }
  function settingsStatus(message,ok=true){const box=$("#settingsSaveStatus");if(box){box.dataset.state=ok?"saved":"error";box.textContent=(ok?"✓ ":"⚠ ")+String(message);box.setAttribute("role","status");}}
  function toast(s){const t=$("#toast");if(t){t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}else alert(s)}
  function setup(){
    if(!document.getElementById("settingsSaveStatusStyle")){const st=document.createElement("style");st.id="settingsSaveStatusStyle";st.textContent="#settingsSaveStatus{position:sticky;top:0;z-index:8;margin:8px 0;padding:10px 12px;border:1px solid var(--line,#8d7338);border-radius:10px;background:var(--panel,#171512);color:var(--text,#f5ead0);font-weight:700;font-size:14px;box-shadow:0 3px 12px #0000000a}#settingsSaveStatus[data-state=error]{border-color:#c75b5b;background:var(--panel,#171512);color:#ffbcbc}#settingsSaveStatus[data-state=saved]{border-color:var(--gold,#d4af37);background:var(--panel,#171512);color:var(--text,#f5ead0)}";document.head.appendChild(st);}

    if(!document.getElementById("storedDataStyle")){const st=document.createElement("style");st.id="storedDataStyle";st.textContent=".stored-data-tools{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;margin:12px 0}.stored-data-tools input{min-width:0;padding:10px;border:1px solid var(--finish-border,#dfc99a);border-radius:10px}.stored-data-list{display:grid;gap:10px}.stored-data-entry{min-width:0;border:1px solid var(--finish-border,#dfc99a);border-radius:12px;background:var(--panel,#fff);padding:12px}.stored-data-entry summary{cursor:pointer;font-weight:800;color:var(--heading,#38271f);overflow-wrap:anywhere}.stored-data-entry small{display:block;color:var(--muted,#6c5d53);margin-top:4px}.stored-data-entry pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:360px;overflow:auto;direction:ltr;text-align:left;font:12px/1.6 ui-monospace,monospace;background:var(--panel2,#f8f2e7);padding:10px;border-radius:8px;color:var(--text,#38271f)}.home-index-settings-card{font:inherit;text-align:inherit;width:100%;cursor:pointer;color:inherit}@media(max-width:640px){.stored-data-tools{grid-template-columns:1fr}.stored-data-tools button{width:100%}}";document.head.appendChild(st);}
    if(!$("#settingsShortcut")){const b=document.createElement("button");b.id="settingsShortcut";b.className="icon-btn";b.type="button";b.title="إعدادات المالك";b.setAttribute("aria-label","إعدادات المالك");b.textContent="⚙";$(".header-actions")?.append(b);}
    if(!$("#adminLayer")){const el=document.createElement("div");el.id="adminLayer";el.className="admin-layer hidden";el.innerHTML=`
      <section class="admin-panel" role="dialog" aria-modal="true" aria-labelledby="adminTitle">
        <header class="admin-head"><div><p class="eyebrow">OWNER CONTROL CENTER</p><h2 id="adminTitle">إدارة مملكة العطور</h2><small>تحكم محلي في المتصفح الحالي</small></div><button type="button" class="icon-btn" id="adminClose" aria-label="إغلاق">×</button></header>
        <div id="adminLogin" class="admin-login"><h3>دخول المالك</h3><p id="pinHint">أدخل رمز الإدارة. عند أول استخدام، أنشئ رمزًا خاصًا بك.</p><form id="pinForm"><input id="adminPin" type="password" inputmode="numeric" minlength="4" placeholder="رمز الإدارة (4 أرقام أو أكثر)" required><button class="btn btn-gold" type="submit">دخول الإعدادات</button></form><small>تنبيه: رمز الواجهة حماية بسيطة على هذا الجهاز وليس نظام مصادقة آمنًا؛ لا تحفظ أسرارًا أو مفاتيح API هنا.</small></div>
        <div id="adminContent" class="hidden">
          <section class="admin-page" data-page="oil-prices"><h3>أسعار الزيوت والتركيب للعميل</h3><p class="admin-note">لوحة الأسعار التي كانت تظهر في صفحة الزيوت؛ يمكنك مراجعة الأسعار وإدارتها من الإعدادات.</p>
      <div class="oil-retail-guide-wrap">
        <div class="blend-price-guide" aria-label="قائمة أسعار الزيوت والتركيب"><h3>أسعار الزيوت والتركيب للعميل</h3><p>سعر الجرام حسب الفئة، بالإضافة إلى أسعار أحجام التركيب. الأسعار قابلة للتعديل من الإدارة؛ أقل طلب للتركيب يبدأ من 50 ج.م.</p><div class="gram-price-grid" id="customerGramPriceGuide"><div><span>الزيوت الفرنسية</span><strong>10 ج.م / جرام</strong></div><div><span>الزيوت الشرقية</span><strong>15 ج.م / جرام</strong></div><div><span>الشرقي الممتاز</span><strong>20 ج.م / جرام</strong></div></div><div class="blend-price-grid" id="blendPriceGuide"><div><span>3 مل · زيت فقط</span><strong>50 ج.م</strong></div><div><span>5 مل · زيت فقط</span><strong>75 ج.م</strong></div><div><span>10 مل · زيت فقط</span><strong>100 ج.م</strong></div><div><span>22 مل</span><strong>130 ج.م</strong></div><div><span>30 مل · زيت فقط / رش</span><strong>100 ج.م</strong></div><div><span>50 مل · زيت فقط / رش</span><strong>150 ج.م</strong></div><div><span>100 مل · زيت فقط / رش</span><strong>300 ج.م</strong></div></div></div>
      </div>
 
          </section>
          <nav class="admin-tabs"><button data-tab="site" class="active">الموقع والهوية</button><button data-tab="oil-prices">أسعار الزيوت</button><button data-tab="products">المنتجات</button><button data-tab="references">مكتبة المراجع</button><button data-tab="data">البيانات والنسخ</button><button data-tab="stored">البيانات المحفوظة</button><button data-tab="requests">طلبات العملاء والبحث</button><button data-tab="ai">خدمة AI</button></nav><div id="settingsSaveStatus" class="settings-save-status" data-state="saved" role="status">✓ جاهز للحفظ — ستظهر هنا نتيجة كل تغيير</div>
          <section class="admin-page hidden" data-page="requests"><h3>طلبات العملاء وكلمات البحث</h3><p class="admin-note">تُسجَّل كلمات البحث تلقائيًا بعد توقف الكتابة، مع عدّ مرات تكرارها وتمييز الطلبات غير الموجودة في الكتالوج. راجع القائمة قبل إضافة منتج جديد؛ لا تُنشأ منتجات أو أسعار تلقائيًا.</p><div class="request-tools"><input id="customerRequestFilter" type="search" placeholder="ابحث في كلمات البحث والطلبات"><button type="button" class="btn btn-outline" id="exportCustomerRequests">تصدير قائمة الطلبات JSON</button><button type="button" class="btn btn-outline" id="clearReviewedRequests">حذف العناصر التي تمت مراجعتها</button></div><p id="customerRequestsSummary" class="admin-note" role="status"></p><div id="customerRequestsList" class="customer-requests-list"></div></section><section class="admin-page" data-page="site"><h3>الهوية والتواصل والشكل النهائي</h3><p class="admin-note">غيّر الألوان والتصميم معًا: شكل البطاقات، توزيع المنتجات، شكل الصور والأيقونات، وتفاصيل الواجهة. اختر النمط ثم جرّبه على الهاتف أو الكمبيوتر واحفظه.</p><div class="admin-grid"><label>نمط شكل الموقع <select id="cfgVisualStyle"><option value="classic">تحريري أنيق</option><option value="windows">Windows — مربعات واضحة</option><option value="android">Android — بطاقات ناعمة</option><option value="ios">iOS — تصميم هادئ</option><option value="oneui">One UI — مساحات مريحة</option><option value="pixel">Pixel — بسيط ومتوازن</option></select></label><label>قالب الألوان <select id="cfgPreset"><option value="design01">1 — أزرق خزفي</option><option value="design02">2 — عاجي وفحمي</option><option value="design03">3 — رخام رمادي</option><option value="design04">4 — كريمي وإسبريسو</option><option value="design05">5 — لاتيه وموكا</option><option value="design06">6 — لؤلؤي وفضي</option><option value="design07">7 — رمل وموكا</option><option value="design08">8 — أزرق ضبابي</option><option value="design09">9 — كتان وفحمي</option><option value="design10">10 — ملكي ليلي وأبيض</option><option value="custom">ألوان مخصصة</option></select></label><label>تصميم الجوال<select id="cfgMobileDesign"><option value="mobile-01">01 — بطاقات مربعة</option><option value="mobile-02" selected>02 — بطاقات متوازنة</option><option value="mobile-03">03 — بطاقات مستديرة</option><option value="mobile-04">04 — عرض مدمج</option><option value="mobile-05">05 — شبكة منتجين</option><option value="mobile-06">06 — قائمة منتج واحد</option><option value="mobile-07">07 — أيقونات دائرية</option><option value="mobile-08">08 — تصميم بلا ظلال</option><option value="mobile-09">09 — صور كبيرة</option><option value="mobile-10">10 — حدود بارزة</option></select></label><label>تصميم الشاشات<select id="cfgWebDesign"><option value="web-01">01 — شبكة 4 أعمدة</option><option value="web-02" selected>02 — بطاقات متوازنة</option><option value="web-03">03 — شبكة 3 أعمدة</option><option value="web-04">04 — شبكة 5 أعمدة</option><option value="web-05">05 — مربعات بسيطة</option><option value="web-06">06 — صور منتجات كبيرة</option><option value="web-07">07 — فهرس 3 أعمدة</option><option value="web-08">08 — فهرس 4 أعمدة</option><option value="web-09">09 — حدود قوية</option><option value="web-10">10 — بطاقات واسعة</option></select></label><label>اسم المتجر<input id="cfgName" value="مملكة العطور"></label><label>رقم واتساب الدولي<input id="cfgWhatsapp" inputmode="tel" placeholder="201272776928"></label><div class="wide theme-palette-heading"><h4>ألوان فهرس الأقسام والأيقونات</h4><p>هذه الألوان مخصصة للفهرس فقط؛ تُطبّق على البطاقات والأيقونات وتُحفظ ضمن إعدادات الهوية.</p></div><label>خلفية الفهرس<input id="cfgIndexBg" type="color" value="#F0F2F4"></label><label>خلفية بطاقات الفهرس<input id="cfgIndexCard" type="color" value="#FFFFFF"></label><label>لون خلفية الأيقونات<input id="cfgIndexIcon" type="color" value="#586B7A"></label><label>لون إطار الفهرس<input id="cfgIndexBorder" type="color" value="#9AAAB6"></label><div class="wide theme-palette-heading"><h4>لوحة التحكم الكاملة بألوان الموقع</h4><p>كل لون هنا يغيّر الجزء المقابل في المتجر والبطاقات والقوائم والنوافذ والجداول ولوحة الإدارة. اختر أحد التصاميم العشرة ثم عدّل ألوانه يدويًا إذا رغبت.</p></div><label>خلفية الموقع<input id="cfgBg" type="color" value="#F0F2F4"></label><label>خلفية اللوحات الرئيسية<input id="cfgPanel" type="color" value="#ffffff"></label><label>خلفية الأقسام الثانوية والجداول<input id="cfgPanel2" type="color" value="#E2E6EA"></label><label>خلفية بطاقات المنتجات والأقسام<input id="cfgCard" type="color" value="#ffffff"></label><label>خلفية حقول الإدخال والبحث<input id="cfgField" type="color" value="#ffffff"></label><label>لون التمييز الأساسي<input id="cfgGold" type="color" value="#586B7A"></label><label>لون التمييز الثانوي<input id="cfgGold2" type="color" value="#9AAAB6"></label><label>لون النص الأساسي<input id="cfgText" type="color" value="#303B44"></label><label>لون العناوين الرئيسية<input id="cfgHeading" type="color" value="#303B44"></label><label>لون النصوص الثانوية والوصف<input id="cfgMuted" type="color" value="#606D76"></label><label>لون الحدود والفواصل<input id="cfgLine" type="color" value="#CCD3D9"></label><label>لون رأس الموقع والقائمة<input id="cfgHeader" type="color" value="#F8F9FA"></label><label>لون تذييل الموقع<input id="cfgFooter" type="color" value="#E1E5E9"></label><label>خلفية الأزرار الرئيسية<input id="cfgButton" type="color" value="#465B6B"></label><label>لون الكتابة داخل الأزرار<input id="cfgButtonText" type="color" value="#ffffff"></label><input id="cfgBackgroundImage" type="hidden" value="none"><input id="cfgOverlay" type="hidden" value="0"><div class="wide visual-control-heading"><h4>مركز التحكم في الإضاءة والوضوح والخط</h4><p>تُطبّق هذه القيم على واجهة الموقع بالكامل من مكان واحد، وتُحفظ على هذا الجهاز مع الإعدادات.</p></div><label>إضاءة الواجهة <input id="cfgBrightness" type="range" min="70" max="130" value="100"><small id="cfgBrightnessValue">100%</small></label><label>وضوح وتباين النص <input id="cfgContrast" type="range" min="80" max="125" value="100"><small id="cfgContrastValue">100%</small></label><label>حجم الخط العام <input id="cfgFontScale" type="range" min="85" max="120" value="100"><small id="cfgFontScaleValue">100%</small></label><label>وضوح صورة الخلفية <input id="cfgImageClarity" type="range" min="10" max="100" value="100"><small id="cfgImageClarityValue">100%</small></label><label>ارتفاع السطور والمسافات <input id="cfgLineHeight" type="range" min="120" max="180" value="150"><small id="cfgLineHeightValue">150%</small></label><div class="wide visual-control-heading"><h4>التحكم في أحجام الواجهة والبطاقات</h4><p>حرّك المؤشرات لتكبير أو تصغير الأيقونات والرئيسية ومربعات الأقسام وبطاقات العطور وصور الزجاجات، ثم اضغط تطبيق وحفظ.</p></div><label>حجم الأيقونات العامة <input id="cfgIconScale" type="range" min="60" max="130" value="85"><small id="cfgIconScaleValue">85%</small></label><label>حجم عناصر الرئيسية <input id="cfgHomeScale" type="range" min="65" max="120" value="90"><small id="cfgHomeScaleValue">90%</small></label><label>حجم مربعات الأقسام <input id="cfgCategoryScale" type="range" min="60" max="120" value="85"><small id="cfgCategoryScaleValue">85%</small></label><label>حجم بطاقة العطر ومساحتها <input id="cfgProductScale" type="range" min="60" max="120" value="80"><small id="cfgProductScaleValue">80%</small></label><label>حجم صور زجاجات العطور <input id="cfgBottleScale" type="range" min="55" max="120" value="70"><small id="cfgBottleScaleValue">70%</small></label><div class="wide admin-actions"><button type="button" class="btn btn-gold" id="saveVisualControls">تطبيق وحفظ الإضاءة والخط والصورة</button><button type="button" class="btn btn-outline" id="resetVisualControls">إعادة ضبط العرض فقط</button></div></div><div class="wide" id="liveSettingsPreview" style="border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:12px;padding:12px;margin:12px 0"><h4 style="color:var(--heading);margin:0 0 8px">معاينة مباشرة — تغيّر مع الإعدادات</h4><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-items:stretch"><article class="product-card" style="min-width:0"><div class="product-visual"><div class="placeholder-bottle" aria-hidden="true"></div></div><div class="product-info"><h3 style="color:var(--heading)">عطر تجريبي</h3><p class="product-meta" style="margin:0;color:var(--muted)">بطاقة مصغّرة لمعاينة الخط والألوان</p><div class="product-price" style="color:var(--gold2)">150 ج.م</div><div class="product-actions"><span class="small-btn" style="display:inline-flex;align-items:center;justify-content:center;border-color:var(--line);color:var(--text)">التفاصيل</span><span class="small-btn primary" style="display:inline-flex;align-items:center;justify-content:center;background:var(--button-bg);color:var(--button-text);border-color:var(--button-bg)">اختيار</span></div></div></article><div class="category-card" style="min-height:0!important;justify-content:center;background:var(--panel2)!important;color:var(--text)!important"><span style="color:var(--gold2)">✦ معاينة القسم</span><h3 style="color:var(--heading)">الرئيسية والأقسام</h3><p style="color:var(--muted)">الخلفية والحدود والأيقونات والخط تتحدث فورًا</p><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px"><i style="display:block;width:18px;height:18px;border-radius:50%;background:var(--bg);border:1px solid var(--line)"></i><i style="display:block;width:18px;height:18px;border-radius:50%;background:var(--panel2);border:1px solid var(--line)"></i><i style="display:block;width:18px;height:18px;border-radius:50%;background:var(--gold);border:1px solid var(--line)"></i><i style="display:block;width:18px;height:18px;border-radius:50%;background:var(--gold2);border:1px solid var(--line)"></i></div></div></div><small style="display:block;margin-top:8px;color:var(--muted)">هذه معاينة داخل الإعدادات. تُطبّق الألوان والأحجام على الموقع فورًا، ويُحفظ التغيير على هذا الجهاز.</small></div><div class="price-settings"><h4>أسعار البيع القطاعي للزيوت والتركيب (جنيه مصري)</h4><p class="admin-note">الحد الأدنى لسعر التركيب 50 جنيهًا. هذه الأسعار لأحجام الزيوت والتركيب وتنعكس على كتالوج العميل والسلة والطلب. حدّد سعر كل عطر جاهز أو عود وبخور أو هدية من تبويب إضافة منتج أو تعديل منتج.</p><div class="admin-grid"><label>سعر 3 مل<input id="blendPrice3" type="number" min="50" step="1"></label><label>سعر 5 مل<input id="blendPrice5" type="number" min="50" step="1"></label><label>سعر 10 مل<input id="blendPrice10" type="number" min="50" step="1"></label><label>سعر 22 مل<input id="blendPrice22" type="number" min="50" step="1"></label><label>30 مل — زيت فقط / رش<input id="blendPrice30" type="number" min="50" step="1"></label><label>50 مل — زيت فقط / رش<input id="blendPrice50" type="number" min="50" step="1"></label><label>100 مل — زيت فقط / رش<input id="blendPrice100" type="number" min="50" step="1"></label></div><button type="button" class="btn btn-gold" id="saveBlendPrices">حفظ أسعار التركيب</button></div><div class="admin-actions"><button class="btn btn-gold" id="saveSite">حفظ الإعدادات</button><button class="btn btn-outline" id="resetTheme">استعادة الألوان الأصلية</button></div><p class="admin-note">تُحفظ الإعدادات محليًا افتراضيًا؛ عند تسجيل دخول الإدارة إلى الحفظ السحابي، تُزامَن الإعدادات والمنتجات القابلة للمزامنة مع قاعدة البيانات. تغيير رقم واتساب محليًا وحده لا يغيّر إعدادات الزوار الآخرين.</p></section>
          <section class="admin-page hidden" data-page="products"><h3>إضافة منتج أو تعديل منتج</h3><form id="productForm"><input id="pId" type="hidden"><div class="admin-grid"><label>الاسم بالعربية<input id="pAr" required></label><label>الاسم بالإنجليزية<input id="pEn"></label><label>الشركة / المورد<input id="pBrand"></label><label>القسم<select id="pType"><option value="ready">عطر جاهز</option><option value="oil">زيت عطري / تركيب</option><option value="bakhoor">عود وبخور</option><option value="gift">هدايا</option></select></label><label>الفئة<input id="pGender" placeholder="رجالي / نسائي / للجنسين"></label><label>العائلة العطرية<select id="pFamily"><option value="">غير محددة</option><option>خشبي</option><option>زهري</option><option>شرقي</option><option>حلو</option><option>منعش</option><option>مسكي</option><option>حمضي ومنعش</option><option>زهري ووردي</option><option>مسكي ونظيف</option><option>حلو وفانيليا</option><option>عنبر وشرقي</option><option>عود وخشبي</option><option>جلدي وتبغي</option><option>عطري وأخضر</option><option>بودري</option><option>فاكهي</option><option>بحري</option><option>غير محدد — يحتاج تقييم</option></select></label><label>طبيعة الرائحة<input id="pNature" placeholder="منعش، دافئ، ناعم، مدخن..."></label><label>النوتات العليا (افصل بفاصلة)<input id="pTopNotes" placeholder="برغموت، ليمون..."></label><label>النوتات الوسطى (افصل بفاصلة)<input id="pHeartNotes" placeholder="ورد، ياسمين..."></label><label>النوتات القاعدية (افصل بفاصلة)<input id="pBaseNotes" placeholder="مسك، عنبر، خشب..."></label><label class="wide">ملاحظات التركيب الكيميائي / المستندات<textarea id="pChemistry" rows="2" placeholder="لا تكتب صيغة مفترضة؛ سجّل فقط ما أكده المورد أو بيانات SDS/IFRA."></textarea></label><label>السعر الأساسي بالجنيه<input id="pPrice" type="number" min="50" step="0.01" placeholder="50 جنيهًا كحد أدنى؛ اتركه فارغًا إذا غير مؤكد"></label><div class="wide admin-note">أسعار أحجام العطر الجاهز (اختياري؛ إذا تُركت فارغة يُستخدم السعر الأساسي المعتمد).</div><label>سعر الجاهز 30 مل<input id="pPrice30" type="number" min="50" step="1" placeholder="سعر هذا الحجم"></label><label>سعر الجاهز 50 مل<input id="pPrice50" type="number" min="50" step="1" placeholder="سعر هذا الحجم"></label><label>سعر الجاهز 100 مل<input id="pPrice100" type="number" min="50" step="1" placeholder="سعر هذا الحجم"></label><label>رابط صورة المنتج أو مسارها<input id="pImage" type="text" placeholder="https://... أو assets/... أو صورة مرفوعة"></label><label>رفع صورة العطر من الهاتف أو الكمبيوتر<input id="pImageUpload" type="file" accept="image/*"></label><div id="pImagePreview" class="image-preview wide">معاينة صورة العطر تظهر هنا</div><label class="wide">رابط مصدر تفاصيل العطر (موقع رسمي أو قاعدة بيانات موثوقة)<input id="pSourceUrl" type="url" placeholder="https://..."></label><label class="wide">وصف المنتج<textarea id="pDesc" rows="3"></textarea></label></div><label class="wide admin-review-approval"><input id="pApprove" type="checkbox"><span>اعتماد المنتج للعرض والطلب العام. يتطلب الاسم العربي والإنجليزي، الشركة/المورد، الفئة، العائلة العطرية، السعر، الصورة، ومصدرًا موثوقًا للعطور الجاهزة.</span></label><div class="admin-actions"><button class="btn btn-gold" type="submit">حفظ المنتج</button><button class="btn btn-outline" id="cancelEdit" type="button">تفريغ الحقول</button></div></form><h3>إدارة العطور الجاهزة والزيوت العطرية والتركيب</h3><p class="admin-note">يشمل الكتالوج أسماء الزيوت من قائمة المورد كاملة. ابحث بالاسم العربي أو الإنجليزي أو كود المورد، ثم افتح التعديل لإضافة صورة أو تغيير الاسم والتفاصيل. أسعار الزيت والبخاخ تأتي من جدول الأسعار العام.</p><label class="wide">بحث في جميع المنتجات<input id="adminProductSearch" type="search" placeholder="ابحث عن اسم العطر أو كود المورد"></label><div id="adminProducts" class="admin-product-list"></div></section>
          <section class="admin-page hidden" data-page="references"><h3>مكتبة المواقع المرجعية — دليل الاستخدام</h3><p class="admin-note">استخدم المراجع لمقارنة تصميم المتاجر والعطور. المكتبة للإلهام والمراجعة ولا تغيّر المنتجات تلقائيًا.</p><div class="reference-steps"><article><b>الخطوة ١ — البحث</b><p>اكتب اسم العلامة أو الموقع أو كلمة مثل تغليف أو عطور خليجية في مربع البحث.</p></article><article><b>الخطوة ٢ — تصفية النتائج</b><p>اختر التصنيف: عربي وخليجي، فخامة عالمية، متاجر ومنصات، أو مراجع تصميم.</p></article><article><b>الخطوة ٣ — فتح المرجع</b><p>اضغط فتح الموقع لعرضه في تبويب جديد، ثم قارن الخطوط والبطاقات والصور والأسعار.</p></article><article><b>الخطوة ٤ — حفظ المفضلة</b><p>اضغط أضف للمفضلة لتسهيل الرجوع للمواقع المهمة. المفضلة محفوظة في هذا المتصفح فقط.</p></article><article><b>الخطوة ٥ — تطبيق الملاحظات</b><p>ارجع إلى الموقع والهوية لتعديل الألوان والخلفية، أو المنتجات لإدارة الأسماء والصور والأسعار.</p></article></div><div class="admin-actions"><button type="button" class="btn btn-gold" id="openReferenceLibrary">عرض المكتبة داخل الإعدادات</button></div><p class="admin-note">لن تتغير بيانات المنتجات عند فتح المراجع. احفظ المفضلة على هذا الجهاز فقط.</p><div id="adminReferenceLibraryHost" class="admin-reference-host"><p class="admin-note">اضغط عرض المكتبة لإظهار البحث والتصنيفات والمفضلة هنا.</p></div></section>
          <section class="admin-page hidden" data-page="data"><h3>النسخ الاحتياطي والاستيراد</h3><p>صدّر نسخة من المنتجات والإعدادات المحلية، واحتفظ بها خارج المتصفح.</p><div class="admin-actions"><button class="btn btn-gold" id="exportData">تصدير نسخة JSON</button><label class="btn btn-outline file-label">استيراد JSON<input id="importData" type="file" accept=".json,application/json"></label><button class="btn btn-outline" id="exportRequests">تصدير طلبات العطور غير الموجودة</button></div><div class="admin-note" id="recentJsonFilePanel" aria-live="polite">لا يوجد ملف JSON حديث مسجل حتى الآن.</div><p class="admin-note">يعرض السجل آخر ملف تم استيراده أو تصديره من هذا المتصفح. حذف ملف من سجل الموقع لا يحذف النسخة الأصلية من الهاتف.</p><p class="admin-note">السلة والمفضلة تبقيان محليتين على هذا الجهاز. المنتجات والإعدادات المحددة يمكن مزامنتها سحابيًا بعد إعداد Supabase وتسجيل دخول حساب الإدارة المعتمد.</p><hr><h3>تغيير رمز الإدارة</h3><form id="changePinForm" class="admin-grid"><label>الرمز الحالي<input id="oldPin" type="password" required></label><label>الرمز الجديد (4 أحرف/أرقام على الأقل)<input id="newPin" type="password" minlength="4" required></label><button class="btn btn-gold" type="submit">تحديث الرمز</button></form></section>
          <section class="admin-page hidden" data-page="stored"><h3>كل البيانات المحفوظة في هذا المتصفح</h3><p class="admin-note">تعرض هذه الصفحة القيم المخزنة محليًا على هذا الجهاز، مثل إعدادات الهوية والأسعار والمنتجات والكتالوج والمخزون والسلة والمفضلة والطلبات والخلفيات. تُخفى القيم الحساسة مثل رمز الإدارة ومفاتيح الوصول.</p><div class="stored-data-tools"><input id="storedDataSearch" type="search" placeholder="ابحث باسم الإعداد أو محتوى البيانات…"><button type="button" class="btn btn-gold" id="refreshStoredData">تحديث البيانات</button><button type="button" class="btn btn-outline" id="exportStoredData">تصدير كل البيانات JSON</button></div><p id="storedDataSummary" class="admin-note" aria-live="polite"></p><div id="storedDataList" class="stored-data-list"></div></section>
          <section class="admin-page hidden" data-page="ai"><h3>مستشار مملكة العطور الذكي</h3><p class="admin-note">أدخل رابط Cloudflare Worker المنشور، وليس مفتاح API. هذا الحقل يحفظ الرابط في متصفح المالك فقط؛ لتفعيل الخدمة لكل الزوار يجب تثبيت الرابط العام في ملف ai-service.js بعد نشر الخادم.</p><label class="wide">رابط خدمة AI (HTTPS ينتهي بـ /api/ask)<input id="cfgAiEndpoint" type="url" placeholder="https://اسم-الخدمة.workers.dev/api/ask" autocomplete="url"></label><div class="admin-actions"><button type="button" class="btn btn-gold" id="saveAiEndpoint">حفظ رابط الخدمة</button><button type="button" class="btn btn-outline" id="clearAiEndpoint">مسح الرابط</button><button type="button" class="btn btn-outline" id="testAiEndpoint">اختبار الاتصال</button></div><p id="aiEndpointStatus" class="admin-note" aria-live="polite">الخدمة غير مهيأة في هذا المتصفح حتى الآن.</p><p class="admin-note">لا تضع مفتاح OpenAI هنا. المفتاح يجب أن يبقى سرًا داخل إعدادات الخادم. ملفات الموقع وحدها لا تشغّل خدمة AI دون نشر Worker وضبط المفتاح.</p><div class="admin-note ai-deploy-guide"><strong>إعداد النشر خطوة بخطوة</strong><p>أولًا افتح <a href="https://github.com/mo775kk/Mamlkt-alotor/settings/secrets/actions" target="_blank" rel="noopener noreferrer">إعداد أسرار GitHub للمستودع</a> وأضف الأسرار الثلاثة التالية بالقيم الصحيحة. اضغط «نسخ الاسم» لتجنب أخطاء كتابة أسماء الأسرار.</p><ul class="ai-secret-list"><li><code>CLOUDFLARE_API_TOKEN</code><button type="button" class="small-btn" data-copy-secret="CLOUDFLARE_API_TOKEN">نسخ الاسم</button></li><li><code>CLOUDFLARE_ACCOUNT_ID</code><button type="button" class="small-btn" data-copy-secret="CLOUDFLARE_ACCOUNT_ID">نسخ الاسم</button></li><li><code>OPENAI_API_KEY</code><button type="button" class="small-btn" data-copy-secret="OPENAI_API_KEY">نسخ الاسم</button></li></ul><p><strong>مهم:</strong> هذه أسماء حقول وليست كلمات سر جاهزة. أدخل قيمة حقيقية من حسابك؛ لا تضع مفتاح OpenAI في خانة رابط الموقع ولا تشاركه في المحادثة.</p><p>بعد حفظ الأسرار، افتح <a href="https://github.com/mo775kk/Mamlkt-alotor/actions/workflows/deploy-ai-worker.yml" target="_blank" rel="noopener noreferrer">سير عمل نشر خدمة AI</a> واضغط Run workflow. بعد نجاحه، انسخ عنوان Worker من Cloudflare وأضف إليه <code>/api/ask</code>. لا يوجد رابط فعلي يمكن وضعه قبل نجاح النشر؛ لا تستخدم رابطًا تخمينيًا.</p></div></section>
        </div>
      </section>`;
      el.addEventListener("click",async event=>{const button=event.target.closest("[data-copy-secret]");if(!button)return;const value=button.getAttribute("data-copy-secret")||"";try{if(!navigator.clipboard?.writeText)throw Error("clipboard unavailable");await navigator.clipboard.writeText(value);toast("تم نسخ اسم السر: "+value);}catch{toast("انسخ اسم السر يدويًا: "+value);}});
      document.body.append(el);
    }
  }
  function open(){setup();const layer=$("#adminLayer"),login=$("#adminLogin"),content=$("#adminContent"),pin=$("#adminPin"),hint=$("#pinHint");if(!layer)return;layer.classList.remove("hidden");if(login)login.classList.remove("hidden");if(content)content.classList.add("hidden");if(pin){pin.value="";pin.focus();}if(hint)hint.textContent=localStorage.getItem(PIN_KEY)?"أدخل رمز الإدارة.":"أول استخدام: اختر رمزًا جديدًا من 4 أرقام أو أكثر وسيتم حفظه على هذا الجهاز.";}
  let referenceOriginalParent=null,referenceOriginalNext=null;
  function restoreReferenceLibrary(){const section=$("#referenceLibrary");if(!section)return;section.classList.remove("in-settings");if(!referenceOriginalParent)return;referenceOriginalParent.insertBefore(section,referenceOriginalNext&&referenceOriginalNext.parentNode===referenceOriginalParent?referenceOriginalNext:null);referenceOriginalParent=null;referenceOriginalNext=null;}
  function showReferenceLibrary(){const host=$("#adminReferenceLibraryHost");if(!host)return;if(!window.MamlakaReferenceLibrary){host.innerHTML='<p class="admin-note">تعذر تحميل المكتبة. أعد تحميل الصفحة ثم حاول مجددًا.</p>';return;}let section=$("#referenceLibrary");if(!section){window.MamlakaReferenceLibrary.mountInto(host);section=$("#referenceLibrary");}if(!section)return;if(section.parentNode!==host&&!referenceOriginalParent){referenceOriginalParent=section.parentNode;referenceOriginalNext=section.nextSibling;}section.classList.add("in-settings");if(section.parentNode!==host)host.appendChild(section);}
  function close(){restoreReferenceLibrary();const layer=$("#adminLayer");if(layer)layer.classList.add("hidden")}
  function tab(name){document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));document.querySelectorAll("[data-page]").forEach(p=>p.classList.toggle("hidden",p.dataset.page!==name));if(name==="products")renderAdminProducts();if(name==="stored")renderStoredData();if(name==="requests")renderCustomerRequests();}
  function renderCustomerRequests(){
    const host=$("#customerRequestsList");if(!host)return;
    const query=String($("#customerRequestFilter")?.value||"").trim().toLowerCase();
    const rows=read("mamlaka_requests_v1",[]);
    const filtered=rows.map((row,index)=>({...row,_index:index})).sort((a,b)=>String(b.lastSearchedAt||b.createdAt||"").localeCompare(String(a.lastSearchedAt||a.createdAt||""))).filter(row=>!query||String(row.name||"").toLowerCase().includes(query)||String(row.source||"").toLowerCase().includes(query));
    const newCount=rows.filter(x=>x.status!=="reviewed").length,missingCount=rows.filter(x=>x.matched===false||x.source==="طلب عميل"||x.source==="بحث غير مطابق").length;
    const summary=$("#customerRequestsSummary");if(summary)summary.textContent="إجمالي الكلمات والطلبات: "+rows.length+" · تحتاج مراجعة: "+missingCount+" · غير مراجعة: "+newCount;
    if(!filtered.length){host.innerHTML='<p class="admin-note">لا توجد كلمات أو طلبات مطابقة حتى الآن. ستظهر عمليات البحث هنا تلقائيًا.</p>';return;}
    host.innerHTML=filtered.map(row=>'<article class="customer-request-card"><div class="customer-request-main"><strong>'+esc(row.name||"طلب بدون اسم")+'</strong><p>'+esc(row.source||"بحث الكتالوج")+' · تكرار البحث: '+Math.max(1,Number(row.count)||1)+' · '+esc(row.lastSearchedAt||row.createdAt||"")+'</p><div class="request-status-tags"><span>'+((row.matched===false||row.source==="طلب عميل"||row.source==="بحث غير مطابق")?"يحتاج مراجعة":"ظهر ضمن نتائج الكتالوج")+'</span><span>'+((row.status==="reviewed")?"تمت المراجعة":"قيد المراجعة")+'</span></div></div><div class="customer-request-actions"><button type="button" class="btn btn-outline" data-request-action="add" data-request-index="'+row._index+'">إضافة للكتالوج</button><button type="button" class="btn btn-outline" data-request-action="review" data-request-index="'+row._index+'">تمت المراجعة</button><button type="button" class="btn btn-outline" data-request-action="delete" data-request-index="'+row._index+'">حذف</button></div></article>').join("");
  }
  document.addEventListener("click",event=>{const b=event.target.closest("[data-request-action]");if(!b)return;const i=Number(b.dataset.requestIndex),action=b.dataset.requestAction,rows=read("mamlaka_requests_v1",[]);if(!Number.isInteger(i)||i<0||i>=rows.length)return;if(action==="delete"){rows.splice(i,1);write("mamlaka_requests_v1",rows);renderCustomerRequests();settingsStatus("تم حذف العنصر المحدد.");return;}if(action==="review"){rows[i].status="reviewed";rows[i].reviewedAt=new Date().toISOString();write("mamlaka_requests_v1",rows);renderCustomerRequests();settingsStatus("تم تسجيل مراجعة الطلب.");return;}if(action==="add"){tab("products");const field=$("#pAr");if(field){field.value=String(rows[i].name||"");field.focus();}settingsStatus("أُدخلت كلمة البحث في نموذج المنتج. أكمل البيانات والصورة والسعر المعتمد ثم احفظ.");}});
  document.addEventListener("input",event=>{if(event.target?.id==="customerRequestFilter")renderCustomerRequests();});
  document.addEventListener("click",event=>{if(event.target.closest("#exportCustomerRequests")){const rows=read("mamlaka_requests_v1",[]),blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),requests:rows},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="mamlakat-customer-search-requests.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);settingsStatus("تم تجهيز ملف JSON لطلبات البحث.");}if(event.target.closest("#clearReviewedRequests")){const rows=read("mamlaka_requests_v1",[]),kept=rows.filter(x=>x.status!=="reviewed");write("mamlaka_requests_v1",kept);renderCustomerRequests();settingsStatus("تم حذف العناصر التي تمت مراجعتها.");}});
  document.addEventListener("mamlaka:requests-updated",renderCustomerRequests);
  function refreshChoiceMarks(){["cfgPreset","cfgVisualStyle"].forEach(id=>{const el=$("#"+id);if(!el)return;Array.from(el.options).forEach(o=>{o.textContent=o.textContent.replace(/\s*✓\s*$/,"")});const chosen=el.options[el.selectedIndex];if(chosen&&!/✓\s*$/.test(chosen.textContent))chosen.textContent=chosen.textContent+" ✓";el.dataset.savedChoice=el.value;});}
  document.addEventListener("change",e=>{if(e.target&&["cfgPreset","cfgVisualStyle"].includes(e.target.id))refreshChoiceMarks();});
  // FIX: the settings panel referenced these helpers without defining them.
  // That ReferenceError stopped the rest of the save-button handlers from binding.
  const THEME_COLOR_FIELDS={
    cfgBg:"bg",cfgPanel:"panel",cfgPanel2:"panel2",cfgCard:"card",cfgField:"field",
    cfgGold:"gold",cfgGold2:"gold2",cfgText:"text",cfgHeading:"heading",cfgMuted:"muted",
    cfgLine:"line",cfgHeader:"header",cfgFooter:"footer",cfgButton:"button",cfgButtonText:"buttonText",cfgIndexBg:"indexBg",cfgIndexCard:"indexCard",cfgIndexIcon:"indexIcon",cfgIndexBorder:"indexBorder"
  };
  function setThemeControls(theme){
    const t=completeTheme(theme);
    Object.entries(THEME_COLOR_FIELDS).forEach(([id,key])=>{
      const input=$("#"+id);
      if(input)input.value=/^#[0-9a-f]{6}$/i.test(String(t[key]||""))?t[key]:"#ffffff";
    });
    const overlay=$("#cfgOverlay");
    if(overlay)overlay.value=Math.round(Math.max(.08,Math.min(.65,Number(t.overlay??.18)))*100);
    const image=$("#cfgBackgroundImage");
    if(image)image.value=String(t.backgroundImage||baseTheme.backgroundImage||"");
    const style=$("#cfgVisualStyle");
    if(style)style.value=t.visualStyle||"windows";
  }
  function themeFromControls(){
    const current=completeTheme(read(THEME_KEY,baseTheme));
    const next={...current};
    Object.entries(THEME_COLOR_FIELDS).forEach(([id,key])=>{
      const input=$("#"+id);
      if(input&&/^#[0-9a-f]{6}$/i.test(input.value))next[key]=input.value;
    });
    const overlay=$("#cfgOverlay");
    if(overlay&&Number.isFinite(Number(overlay.value)))next.overlay=Math.max(.08,Math.min(.65,Number(overlay.value)/100));
    const image=$("#cfgBackgroundImage");
    if(image)next.backgroundImage=image.value.trim()||"none";
    const style=$("#cfgVisualStyle");
    if(style)next.visualStyle=style.value||"windows";
    return completeTheme(next);
  }
  function loadCfg(){renderRecentJson();if($("#cfgAiEndpoint"))$("#cfgAiEndpoint").value=window.MamlakaAI?.getEndpoint?.()||"";const stored=read(THEME_KEY,null);const legacyGreen=!!stored&&stored.bg==="#F5F5EF"&&stored.gold==="#376B59"&&stored.button==="#376B59";const t=completeTheme(legacyGreen?themePresets.design04:(stored||baseTheme));if(legacyGreen)write(THEME_KEY,t);const keys=["bg","panel","panel2","card","field","gold","gold2","text","heading","muted","line","header","footer","button","buttonText","indexBg","indexCard","indexIcon","indexBorder"];const preset=Object.keys(themePresets).find(k=>keys.every(key=>themePresets[k][key]===t[key]))||"custom";if($("#cfgPreset"))$("#cfgPreset").value=preset;if($("#cfgVisualStyle"))$("#cfgVisualStyle").value=({royal:"windows",editorial:"ios",soft:"android",glass:"ios",boutique:"classic",bold:"windows",minimal:"classic",botanical:"pixel"})[t.visualStyle]||t.visualStyle||"windows";if($("#cfgMobileDesign"))$("#cfgMobileDesign").value=t.mobileDesign||"mobile-02";if($("#cfgWebDesign"))$("#cfgWebDesign").value=t.webDesign||"web-02";setThemeControls(t);if($("#cfgWhatsapp"))$("#cfgWhatsapp").value=localStorage.getItem(WA_KEY)||"201272776928";if($("#cfgName"))$("#cfgName").value=localStorage.getItem("mamlaka_store_name_v1")||"مملكة العطور";const brand=document.querySelector(".brand strong");if(brand)brand.textContent=$("#cfgName").value;const pc=read("mamlaka_catalog_taxonomy_config_v1",{}),dp={"3":50,"5":75,"10":100,"22":130,"30":100,"50":150,"100":300};(pc.retailBlendPrices||[]).forEach(x=>{const m=String(x.size||"").match(/[0-9]+/);if(m&&Number.isFinite(Number(x.price))&&Number(x.price)>=50)dp[m[0]]=Number(x.price)});if(dp["30"]===150&&dp["50"]===200&&dp["100"]===450){dp["30"]=100;dp["50"]=150;dp["100"]=300}Object.entries(dp).forEach(([n,v])=>{if($("#blendPrice"+n))$("#blendPrice"+n).value=v});refreshChoiceMarks();}
  function renderStoredData(){const box=$("#storedDataList"),summary=$("#storedDataSummary");if(!box)return;const q=($("#storedDataSearch")?.value||"").trim().toLocaleLowerCase("ar");const rows=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key)continue;const raw=localStorage.getItem(key)||"";let value=raw,parsed=false;try{value=JSON.parse(raw);parsed=true}catch{}const sensitive=/(pin|password|secret|token|api.?key|credential)/i.test(key);let shown=sensitive?"[مخفي لأمان الحساب]":JSON.stringify(value,null,2);if(shown==null)shown=String(value);if(q&&!(key+" "+(sensitive?"":shown)).toLocaleLowerCase("ar").includes(q))continue;rows.push({key,raw,parsed,sensitive,shown});}rows.sort((a,b)=>a.key.localeCompare(b.key));summary.textContent="عدد مفاتيح التخزين: "+localStorage.length+" · المعروض: "+rows.length+(q?" · نتائج البحث":"");box.innerHTML=rows.length?rows.map((r,i)=>'<details class="stored-data-entry" '+(i<2?'open':'')+'><summary>'+esc(r.key)+'</summary><small>الحجم التقريبي: '+r.raw.length.toLocaleString("ar-EG")+' حرف'+(r.parsed?' · JSON قابل للقراءة':' · نص محفوظ')+(r.sensitive?' · قيمة حساسة مخفية':'')+'</small><pre>'+esc(r.shown)+'</pre></details>').join(''):'<p class="admin-note">لا توجد بيانات مطابقة لهذا البحث.</p>';}
  function renderAdminProducts(){const target=$("#adminProducts");if(!target)return;const q=($("#adminProductSearch")?.value||"").trim().toLocaleLowerCase("ar"),all=adminReadyProducts(),p=all.filter(x=>!q||[x.nameAr,x.nameEn,x.brand,x.supplier,x.sku,x.id,x.supplierLine].join(" ").toLocaleLowerCase("ar").includes(q));target.innerHTML=p.length?`<p class="admin-note">النتائج: ${p.length} من ${all.length} منتج. ${window.MamlakaCloud?.ready ? 'تعديلات المنتجات تُزامَن سحابيًا؛ الصور المرفوعة بعد تسجيل الدخول تُحفظ في مخزن الصور.' : 'التعديلات تحفظ محليًا على هذا الجهاز؛ سجّل دخول الحفظ السحابي لمزامنة البيانات ورفع الصور للعملاء.'}</p>`+p.map(x=>`<article class="admin-product"><div><strong>${esc(x.nameAr||x.nameEn||"منتج بلا اسم")}</strong><small dir="ltr">${esc(x.nameEn||"")}</small><small>${esc(x.brand||"شركة غير محددة")} · كود: ${esc(x.sku||x.id||"—")} · ${x.productType==="oil"?"زيت/تركيب · 3/5/10/22/30/50/100 مل: 50/75/100/130/100/150/300 ج.م":x.price==null?"أدخل سعر البيع لاعتماده":esc(x.price)+" ج.م"} · ${x.needsReview ? "قيد مراجعة المالك" : x.available ? "معتمد للعرض" : "غير متاح"}</small></div><div><button type="button" class="small-btn" data-edit-product="${esc(x.id)}">تعديل الاسم/الصورة/السعر</button>${products().some(y=>String(y.id)===String(x.id))?` <button type="button" class="small-btn danger" data-delete-product="${esc(x.id)}">حذف النسخة المحلية</button>`:""}</div></article>`).join(""):'<p class="admin-note">لا توجد نتائج مطابقة. جرّب البحث بالاسم العربي أو الإنجليزي أو كود المورد.</p>';}
  document.addEventListener("mamlaka:cloud-ready",()=>{try{renderAdminProducts();}catch(error){console.warn("Cloud product status refresh failed",error);}});
function clearProductForm(){const form=$("#productForm"),idField=$("#pId"),box=$("#pImagePreview");if(form)form.reset();if(idField)idField.value="";if(box)box.textContent="معاينة صورة العطر تظهر هنا";}
  function refreshStore(){try{document.dispatchEvent(new Event("mamlaka:products-updated"));}catch{}toast(window.MamlakaCloud?.ready?"تم حفظ المنتج محليًا وإرساله للمزامنة السحابية.":"تم حفظ المنتج على هذا الجهاز فقط؛ سجّل دخول الحفظ السحابي لمزامنته.");}
  function download(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  document.addEventListener("DOMContentLoaded",()=>{
    setup();loadBaseReadyProducts();const storedStoreName=localStorage.getItem("mamlaka_store_name_v1");if(storedStoreName){const brand=document.querySelector(".brand strong");if(brand)brand.textContent=storedStoreName;}const savedTheme=read(THEME_KEY,null);const savedBg=String(savedTheme?.bg||"").toLowerCase();const savedHeader=String(savedTheme?.header||"").toLowerCase();const savedFooter=String(savedTheme?.footer||"").toLowerCase();const legacyDark=savedTheme&&(["#090807","#08080a","#000000","#171717","#0a0a0a","#222222"].includes(savedBg));const legacyDarkChrome=savedTheme&&(["#24131f","#000000","#08080a","#0a0a0a","#171717","#090807"].includes(savedHeader)||["#24131f","#000000","#08080a","#0a0a0a","#171717","#090807"].includes(savedFooter));const oldAccentValues=["#4d9de0","#a8d8ff","#b8e1ff","#35516a","#244d70","#d4af37","#f1d77a","#c9a227","#e0c56a","#b88a2b","#d8b35b","#a97a25","#d9b765","#9f742c","#cda95a","#b08332","#e0bf77","#a87c3d","#d6b57c","#a98235","#d8bd7c","#a8752a","#d8af62","#a77a28","#e0c17a","#9d792f","#ccb06b","#b58a32","#e2c274"];const legacyOldPalette=savedTheme&&Object.keys(savedTheme).some(k=>["gold","gold2","heading","line","button","indexIcon","indexBorder"].includes(k)&&oldAccentValues.includes(String(savedTheme[k]||"").toLowerCase()));const migrationKey="mamlaka_theme_gold_background_migration_v6";if(localStorage.getItem(migrationKey)!=="done"){if(!savedTheme||legacyDark||legacyDarkChrome||legacyOldPalette)write(THEME_KEY,baseTheme);localStorage.setItem(migrationKey,"done");applyTheme(!savedTheme||legacyDark||legacyDarkChrome||legacyOldPalette?baseTheme:savedTheme);}else{applyTheme(!savedTheme||legacyDark||legacyOldPalette?baseTheme:savedTheme);}// Admin entry buttons are handled by the early delegated click listener above.$("#adminClose")?.addEventListener("click",close);document.addEventListener("keydown",e=>{const layer=$("#adminLayer");if(e.key==="Escape"&&layer&&!layer.classList.contains("hidden"))close()});$("#adminLayer")?.addEventListener("click",e=>{if(e.target===$("#adminLayer"))close()});
    $("#pinForm")?.addEventListener("submit",e=>{e.preventDefault();const pinInput=$("#adminPin");if(!pinInput){toast("حقل رمز الإدارة غير موجود.");return;}const pin=pinInput.value,existing=localStorage.getItem(PIN_KEY);if(!existing){localStorage.setItem(PIN_KEY,pin);toast("تم إنشاء رمز الإدارة لهذا المتصفح.");}else if(pin!==existing){toast("رمز الإدارة غير صحيح.");return;}const login=$("#adminLogin"),content=$("#adminContent");if(login)login.classList.add("hidden");if(content)content.classList.remove("hidden");loadCfg();tab("site");});
    document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>tab(b.dataset.tab)));$("#openReferenceLibrary")?.addEventListener("click",showReferenceLibrary);$("#openReferenceLibraryPage")?.addEventListener("click",()=>{tab("references");showReferenceLibrary();});
    $("#cfgPreset")?.addEventListener("change",()=>{try{if($("#cfgPreset").value==="custom"){settingsStatus("وضع الألوان المخصصة — عدّل لونًا ليُطبّق ويُحفظ فورًا.");return;}const p=themePresets[$("#cfgPreset").value]||baseTheme;setThemeControls(p);const next={...p,indexBg:p.indexBg||p.bg,indexCard:p.indexCard||p.card,indexIcon:p.indexIcon||p.gold,indexBorder:p.indexBorder||p.gold2,visualStyle:$("#cfgVisualStyle")?.value||p.visualStyle||"classic"};applyTheme(next);settingsStatus("تم تطبيق القالب وحفظه والتحقق منه ✓");}catch(err){settingsStatus(err.message||"فشل حفظ القالب",false);toast(err.message||"فشل حفظ القالب");}}); $("#cfgVisualStyle")?.addEventListener("change",()=>{try{const current=read(THEME_KEY,baseTheme);current.visualStyle=$("#cfgVisualStyle").value;applyTheme(current);settingsStatus("تم تطبيق نمط التصميم وحفظه والتحقق منه ✓");}catch(err){settingsStatus(err.message||"فشل حفظ نمط التصميم",false);toast(err.message||"فشل الحفظ");}});[ ["#cfgMobileDesign","mobileDesign"],["#cfgWebDesign","webDesign"] ].forEach(([selector,key])=>$(selector)?.addEventListener("change",()=>{try{const current=read(THEME_KEY,baseTheme);current[key]=$(selector).value;applyTheme(current);settingsStatus("تم تطبيق تصميم الجهاز وحفظه ✓");}catch(err){settingsStatus(err.message||"تعذر حفظ التصميم",false);}}));Object.keys(THEME_COLOR_FIELDS).forEach(id=>$("#"+id)?.addEventListener("input",()=>{try{if($("#cfgPreset"))$("#cfgPreset").value="custom";applyTheme(themeFromControls());const saved=read(THEME_KEY,{});if(saved[THEME_COLOR_FIELDS[id]]!==$("#"+id).value)throw new Error("لم يتم تأكيد حفظ اللون");settingsStatus("تم تطبيق اللون وحفظه تلقائيًا ✓");}catch(err){settingsStatus(err.message||"تعذر حفظ اللون",false);toast(err.message||"تعذر حفظ اللون");}}));$("#cfgOverlay")?.addEventListener("input",()=>{try{applyTheme(themeFromControls());settingsStatus("تم تطبيق مستوى التعتيم وحفظه ✓");}catch(err){settingsStatus(err.message||"فشل حفظ التعتيم",false);}});$("#cfgBackgroundImage")?.addEventListener("change",()=>{const value=$("#cfgBackgroundImage").value.trim();if(!value)return;if(!(value.startsWith("https://")||value.startsWith("assets/")||value.startsWith("./")||value.startsWith("data:image/"))){settingsStatus("رابط الخلفية غير صالح؛ استخدم رابط صورة مباشرًا يبدأ بـ HTTPS.",false);return;}try{const ok=saveSiteSettings(false);if(!ok)throw new Error("تعذر تأكيد حفظ الخلفية");settingsStatus("تم حفظ رابط الخلفية والتحقق منه ✓");}catch(err){settingsStatus(err.message||"فشل حفظ الخلفية",false);}});
    function saveSiteSettings(showToast=true){try{const t=themeFromControls();t.backgroundImage="none";applyTheme(t);setPlain(WA_KEY,$("#cfgWhatsapp").value.replace(/\\D/g,"")||"201272776928");setPlain("mamlaka_store_name_v1",$("#cfgName").value.trim()||"مملكة العطور");const n=localStorage.getItem(WA_KEY)||"201272776928",name=$("#cfgName").value.trim()||"مملكة العطور";const link=document.querySelector("#contactWhatsapp");if(link)link.href="https://wa.me/"+n+"?text="+encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات مملكة العطور.");const verified=JSON.parse(localStorage.getItem(THEME_KEY)||"null");if(!verified||verified.backgroundImage!=="none"||localStorage.getItem(WA_KEY)!==n||localStorage.getItem("mamlaka_store_name_v1")!==name)throw new Error("لم يتم تأكيد حفظ كل الإعدادات.");settingsStatus("تم حفظ الألوان والتصميم والهوية والتحقق منها ✓");if(showToast)toast("✓ تم حفظ الإعدادات على هذا الجهاز.");return true;}catch(err){settingsStatus(err.message||"فشل الحفظ",false);if(showToast)toast(err.message||"فشل حفظ الإعدادات.");return false;}}
    const visualDefaults={brightness:100,contrast:100,fontScale:100,imageClarity:100,lineHeight:150,iconScale:85,homeScale:90,categoryScale:85,productScale:80,bottleScale:70};
    function visualValues(){return {brightness:Number($("#cfgBrightness")?.value||100),contrast:Number($("#cfgContrast")?.value||100),fontScale:Number($("#cfgFontScale")?.value||100),imageClarity:Number($("#cfgImageClarity")?.value||100),lineHeight:Number($("#cfgLineHeight")?.value||150),iconScale:Number($("#cfgIconScale")?.value||85),homeScale:Number($("#cfgHomeScale")?.value||90),categoryScale:Number($("#cfgCategoryScale")?.value||85),productScale:Number($("#cfgProductScale")?.value||80),bottleScale:Number($("#cfgBottleScale")?.value||70)}}
    function paintVisualValues(){const v=visualValues();for(const [id,value] of [["cfgBrightnessValue",v.brightness+"%"],["cfgContrastValue",v.contrast+"%"],["cfgFontScaleValue",v.fontScale+"%"],["cfgImageClarityValue",v.imageClarity+"%"],["cfgLineHeightValue",v.lineHeight+"%"],["cfgIconScaleValue",v.iconScale+"%"],["cfgHomeScaleValue",v.homeScale+"%"],["cfgCategoryScaleValue",v.categoryScale+"%"],["cfgProductScaleValue",v.productScale+"%"],["cfgBottleScaleValue",v.bottleScale+"%"]]){const el=$("#"+id);if(el)el.textContent=value;}const s=document.getElementById("mamlaka-visual-tuning-style");if(s)s.remove();try{const raw=JSON.stringify(v);localStorage.setItem("mamlaka_visual_tuning_v1",raw);if(localStorage.getItem("mamlaka_visual_tuning_v1")!==raw)throw new Error("لم يتم تأكيد حفظ إعدادات العرض");settingsStatus("تم حفظ تغييرات العرض تلقائيًا ✓");}catch(e){settingsStatus("تعذر حفظ إعدادات العرض؛ مساحة التخزين غير متاحة",false);}applyTheme(read(THEME_KEY,baseTheme));}
    function loadVisualValues(){const v={...visualDefaults,...read("mamlaka_visual_tuning_v1",{})};for(const [id,key] of [["cfgBrightness","brightness"],["cfgContrast","contrast"],["cfgFontScale","fontScale"],["cfgImageClarity","imageClarity"],["cfgLineHeight","lineHeight"],["cfgIconScale","iconScale"],["cfgHomeScale","homeScale"],["cfgCategoryScale","categoryScale"],["cfgProductScale","productScale"],["cfgBottleScale","bottleScale"]])if($("#"+id))$("#"+id).value=v[key];paintVisualValues();}
    ["#cfgBrightness","#cfgContrast","#cfgFontScale","#cfgImageClarity","#cfgLineHeight","#cfgIconScale","#cfgHomeScale","#cfgCategoryScale","#cfgProductScale","#cfgBottleScale"].forEach(sel=>$(sel)?.addEventListener("input",paintVisualValues));
    $("#saveVisualControls")?.addEventListener("click",()=>{try{const v=visualValues(),raw=JSON.stringify(v);localStorage.setItem("mamlaka_visual_tuning_v1",raw);if(localStorage.getItem("mamlaka_visual_tuning_v1")!==raw)throw new Error("لم يتم تأكيد الحفظ");paintVisualValues();settingsStatus("تم تطبيق وحفظ الإضاءة والتباين وحجم الخط والخلفية ✓");toast("✓ تم تطبيق وحفظ إعدادات العرض على هذا الجهاز.");}catch(e){settingsStatus("تعذر حفظ إعدادات العرض",false);}});
    $("#resetVisualControls")?.addEventListener("click",()=>{for(const [id,key] of [["cfgBrightness","brightness"],["cfgContrast","contrast"],["cfgFontScale","fontScale"],["cfgImageClarity","imageClarity"],["cfgLineHeight","lineHeight"],["cfgIconScale","iconScale"],["cfgHomeScale","homeScale"],["cfgCategoryScale","categoryScale"],["cfgProductScale","productScale"],["cfgBottleScale","bottleScale"]])if($("#"+id))$("#"+id).value=visualDefaults[key];paintVisualValues();settingsStatus("تمت إعادة ضبط إعدادات العرض ✓");});
    loadVisualValues();
    $("#saveSite")?.addEventListener("click",()=>saveSiteSettings(true));["#cfgName","#cfgWhatsapp"].forEach(selector=>$(selector)?.addEventListener("input",()=>{try{const name=$("#cfgName").value.trim()||"مملكة العطور",number=$("#cfgWhatsapp").value.replace(/\D/g,"")||"201272776928";setPlain(WA_KEY,number);setPlain("mamlaka_store_name_v1",name);const brand=document.querySelector(".brand strong");if(brand)brand.textContent=name;const link=document.querySelector("#contactWhatsapp");if(link)link.href="https://wa.me/"+number+"?text="+encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات مملكة العطور.");settingsStatus("تم حفظ الاسم وبيانات التواصل فورًا ✓");}catch(err){settingsStatus(err.message||"تعذر حفظ بيانات التواصل",false);}}));
    $("#saveAiEndpoint")?.addEventListener("click",()=>{try{const endpoint=$("#cfgAiEndpoint").value.trim();if(!window.MamlakaAI)throw Error("ملف ai-service.js غير محمّل؛ حدّث الصفحة.");window.MamlakaAI.saveEndpoint(endpoint);if((window.MamlakaAI.getEndpoint?.()||"")!==endpoint)throw Error("لم يتم تأكيد حفظ رابط AI");$("#aiEndpointStatus").textContent=endpoint?"✓ تم حفظ الرابط والتحقق منه في هذا المتصفح. اختبر الاتصال قبل الاستخدام.":"✓ تم مسح رابط الخدمة.";settingsStatus("تم حفظ إعداد خدمة AI والتحقق منه ✓");toast(endpoint?"✓ تم حفظ رابط AI.":"✓ تم مسح رابط AI.");}catch(error){$("#aiEndpointStatus").textContent=error.message;settingsStatus(error.message,false);toast(error.message);}});
    $("#cfgAiEndpoint")?.addEventListener("change",()=>$("#saveAiEndpoint")?.click());
    $("#clearAiEndpoint")?.addEventListener("click",()=>{try{window.MamlakaAI?.saveEndpoint("");$("#cfgAiEndpoint").value="";$("#aiEndpointStatus").textContent="تم مسح الرابط المحلي؛ سيعود المستشار إلى الاقتراحات المحلية.";toast("تم مسح رابط AI.");}catch(error){toast(error.message);}});
    $("#testAiEndpoint")?.addEventListener("click",async()=>{const button=$("#testAiEndpoint"),endpoint=$("#cfgAiEndpoint").value.trim();if(button.disabled)return;button.disabled=true;const oldLabel=button.textContent;button.textContent="جارٍ الاختبار…";$("#aiEndpointStatus").textContent="يتم التحقق من رابط الخدمة وحالة الخادم؛ قد يستغرق ذلك بضع ثوانٍ.";try{if(!window.MamlakaAI)throw Error("ملف ai-service.js غير محمّل؛ حدّث الصفحة.");if(!endpoint)throw Error("أدخل رابط خدمة AI أولًا.");window.MamlakaAI.saveEndpoint(endpoint);const health=endpoint.replace(/\/api\/ask\/?$/i,"/health");const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);let response,data;try{response=await fetch(health,{cache:"no-store",signal:controller.signal});data=await response.json().catch(()=>null);}finally{clearTimeout(timeout);}if(!response.ok||data?.ok!==true)throw Error("رابط الخدمة لا يعيد استجابة صحة صالحة. تأكد من عنوان Worker ومسار /api/ask.");if(data.configured!==true)throw Error("الخادم منشور، لكن مفتاح OPENAI_API_KEY غير مضبوط أو غير مقروء في إعدادات Worker.");$("#aiEndpointStatus").textContent="نجح فحص الخادم ومفتاح الخدمة. هذا لا يختبر إجابة نموذج AI نفسها؛ جرّب المستشار من واجهة العميل.";toast("نجح فحص خادم AI.");}catch(error){const message=error?.name==="AbortError"?"انتهت مهلة الاتصال بعد 10 ثوانٍ. تحقق من الرابط ونشر Worker.":error.message||"خطأ غير معروف";$("#aiEndpointStatus").textContent="تعذر تأكيد الخدمة: "+message;toast("لم ينجح فحص خدمة AI.");}finally{button.disabled=false;button.textContent=oldLabel;}});
    function saveBlendPrices(showToast=true){const c=read("mamlaka_catalog_taxonomy_config_v1",{}),v=["3","5","10","22","30","50","100"].map(n=>({size:n+" مل",price:Number($("#blendPrice"+n).value)}));if(v.some(x=>!Number.isFinite(x.price)||x.price<50)){settingsStatus("لا يمكن أن يقل أي سعر عن 50 جنيهًا.",false);if(showToast)toast("لا يمكن أن يقل أي سعر عن 50 جنيهًا.");return false;}try{c.retailBlendPrices=v;write("mamlaka_catalog_taxonomy_config_v1",c);const check=read("mamlaka_catalog_taxonomy_config_v1",{});if(JSON.stringify(check.retailBlendPrices)!==JSON.stringify(v))throw new Error("لم يتم تأكيد حفظ الأسعار");document.dispatchEvent(new Event("mamlaka:products-updated"));settingsStatus("تم تطبيق أسعار التركيب وحفظها والتحقق منها ✓");if(showToast)toast("✓ تم حفظ أسعار التركيب والتحقق منها.");return true;}catch(err){settingsStatus(err.message||"فشل حفظ الأسعار",false);if(showToast)toast(err.message||"فشل حفظ الأسعار");return false;}}
    $("#saveBlendPrices")?.addEventListener("click",()=>saveBlendPrices(true));["3","5","10","22","30","50","100"].forEach(n=>$("#blendPrice"+n)?.addEventListener("change",()=>saveBlendPrices(false)));
    $("#resetTheme")?.addEventListener("click",()=>{applyTheme({...baseTheme,visualStyle:"classic"});loadCfg();toast("تمت استعادة تصميم استوديو العطور.")});
    $("#productForm")?.addEventListener("submit",e=>{e.preventDefault();const list=products(),id=$("#pId").value||"custom-"+Date.now(),nameAr=$("#pAr").value.trim(),nameEn=$("#pEn").value.trim();if(adminReadyProducts().some(p=>String(p.id)!==String(id)&&((nameAr&&p.nameAr?.trim().toLowerCase()===nameAr.toLowerCase())||(nameEn&&p.nameEn?.trim().toLowerCase()===nameEn.toLowerCase())))){toast("يوجد منتج بالاسم نفسه؛ راجع القائمة لتجنب التكرار.");return;}const raw=$("#pPrice").value,existing={...(baseReadyProducts.find(p=>String(p.id)===String(id))||{}),...(list.find(p=>String(p.id)===String(id))||{})},productPrices={...(existing.prices||{})};["30","50","100"].forEach(n=>{const field=$("#pPrice"+n);if(field){if(field.value==="")delete productPrices[n];else productPrices[n]=Math.max(50,Number(field.value));}});const approve=$("#pApprove")?.checked===true,brandValue=$("#pBrand").value.trim(),genderValue=$("#pGender").value.trim(),familyValue=$("#pFamily").value.trim(),imageValue=$("#pImage").value.trim(),sourceValue=$("#pSourceUrl").value.trim();const hasPrice=(raw!==""&&Number.isFinite(Number(raw))&&Number(raw)>=50)||Object.values(productPrices).some(v=>Number.isFinite(Number(v))&&Number(v)>=50)||(Number(existing.price)>=50)||$("#pType").value==="oil";if(approve){const missing=[];if(!nameAr)missing.push("الاسم العربي");if(!nameEn)missing.push("الاسم الإنجليزي");if(!brandValue||brandValue==="غير محدد")missing.push("الشركة/المورد");if(!genderValue)missing.push("الفئة");if(!familyValue||familyValue==="غير محدد")missing.push("العائلة العطرية");if(!hasPrice)missing.push("السعر المعتمد");if(!imageValue)missing.push("الصورة");if($("#pType").value==="ready"&&!sourceValue)missing.push("مصدر موثوق");if(missing.length){toast("لا يمكن اعتماد المنتج قبل استكمال: "+missing.join("، "));return;}}const item={...existing,prices:productPrices,id,nameAr,nameEn,brand:brandValue,productType:$("#pType").value,gender:genderValue||"للجنسين",family:familyValue,scentNature:$("#pNature").value.trim(),topNotes:$("#pTopNotes").value.split(",").map(x=>x.trim()).filter(Boolean),heartNotes:$("#pHeartNotes").value.split(",").map(x=>x.trim()).filter(Boolean),baseNotes:$("#pBaseNotes").value.split(",").map(x=>x.trim()).filter(Boolean),chemicalCompositionNote:$("#pChemistry").value.trim(),price:raw===""?(existing.price??null):Math.max(50,Number(raw)),image:imageValue,sourceUrl:sourceValue,descriptionAr:$("#pDesc").value.trim(),available:approve,needsReview:!approve};const i=list.findIndex(p=>String(p.id)===String(id));if(i>=0)list[i]=item;else list.push(item);try{saveProducts(list);}catch(err){toast(err.message||"تعذر حفظ المنتج والصورة.");return;}const verified=products().find(p=>String(p.id)===String(id));if(!verified||verified.image!==item.image){toast("لم يتم تأكيد حفظ صورة المنتج. جرّب صورة أصغر أو رابط صورة مباشرًا.");return;}clearProductForm();renderAdminProducts();refreshStore();});
    $("#pImage")?.addEventListener("input",()=>showProductImage($("#pImage").value));
    $("#pImageUpload")?.addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;if(!/^image\/(jpeg|png|webp|avif)$/.test(file.type)){toast("اختر JPG أو PNG أو WEBP أو AVIF.");e.target.value="";return;}try{let imageUrl;if(window.MamlakaCloud?.ready){imageUrl=await window.MamlakaCloud.uploadImage(file,"products");}else{if(file.size>5242880)throw new Error("الصورة أكبر من 5 ميجابايت. اضغطها أو سجّل دخول الحفظ السحابي أولًا.");imageUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,900/Math.max(img.width,img.height));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext("2d");if(!ctx)return reject(new Error("تعذر تجهيز الصورة"));ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL("image/jpeg",0.72));};img.src=reader.result;};reader.readAsDataURL(file);});}$("#pImage").value=imageUrl;showProductImage(imageUrl);toast(window.MamlakaCloud?.ready?"✓ تم رفع صورة المنتج سحابيًا. اضغط حفظ المنتج لتثبيت بياناته.":"تم تجهيز الصورة محليًا؛ سجّل دخول الحفظ السحابي لرفعها للعملاء.");}catch(err){toast(err.message||"تعذر حفظ الصورة. جرّب JPG أو PNG أصغر.");}finally{e.target.value="";}});
    function showProductImage(src){const box=$("#pImagePreview");if(!box)return;const safe=String(src||"").trim();if(/^(https:\/\/|assets\/|\.\/|data:image\/)/i.test(safe)){box.innerHTML='<img alt="معاينة صورة العطر" src="'+safe.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'">';}else box.textContent="معاينة صورة العطر تظهر هنا";}
    $("#cancelEdit")?.addEventListener("click",clearProductForm);$("#adminProductSearch")?.addEventListener("input",renderAdminProducts);
    $("#adminProducts")?.addEventListener("click",e=>{const edit=e.target.closest("[data-edit-product]");const del=e.target.closest("[data-delete-product]");let list=products();if(edit){const p=adminReadyProducts().find(x=>String(x.id)===String(edit.dataset.editProduct));if(!p)return;$("#pId").value=p.id;if($("#pApprove"))$("#pApprove").checked=p.available===true&&p.needsReview!==true;$("#pAr").value=p.nameAr||"";$("#pEn").value=p.nameEn||"";$("#pBrand").value=p.brand||"";$("#pType").value=p.productType||"ready";$("#pGender").value=p.gender||"";$("#pFamily").value=p.family||"";$("#pNature").value=p.scentNature||"";$("#pTopNotes").value=(p.topNotes||[]).join(", ");$("#pHeartNotes").value=(p.heartNotes||[]).join(", ");$("#pBaseNotes").value=(p.baseNotes||[]).join(", ");$("#pChemistry").value=p.chemicalCompositionNote||"";$("#pPrice").value=p.price??"";$("#pPrice30").value=p.prices?.["30"]??"";$("#pPrice50").value=p.prices?.["50"]??"";$("#pPrice100").value=p.prices?.["100"]??"";$("#pImage").value=p.image||p.imageUrl||p.image_url||"";showProductImage(p.image||p.imageUrl||p.image_url||"");$("#pSourceUrl").value=p.sourceUrl||"";$("#pDesc").value=p.descriptionAr||"";$("#pAr").focus();}if(del&&confirm("هل تريد حذف هذه النسخة المحلية؟ سيعود العطر إلى بيانات الكتالوج الأصلية إن كان موجودًا فيه.")){saveProducts(list.filter(p=>String(p.id)!==String(del.dataset.deleteProduct)));renderAdminProducts();refreshStore();}});
    function recordRecentJson(name,action,details={}){const meta={name,action,at:new Date().toISOString(),...details};try{localStorage.setItem("mamlaka_recent_json_file_v1",JSON.stringify(meta))}catch{};renderRecentJson();document.dispatchEvent(new CustomEvent("mamlaka:json-file-updated",{detail:meta}))}function renderRecentJson(){const box=$("#recentJsonFilePanel");if(!box)return;try{const m=JSON.parse(localStorage.getItem("mamlaka_recent_json_file_v1")||"null");box.textContent=m?"أحدث ملف JSON: "+String(m.name||"ملف JSON")+" · "+(m.action==="import"?"تم الاستيراد":"تم التصدير")+" · "+new Date(m.at).toLocaleString("ar-EG")+(m.products!=null?" · عدد المنتجات: "+m.products:""):"لا يوجد ملف JSON حديث مسجل حتى الآن."}catch{box.textContent="تعذر قراءة سجل الملفات."}}document.addEventListener("mamlaka:json-file-updated",renderRecentJson);$("#exportData")?.addEventListener("click",()=>{const name="mamlakat-al-otor-full-backup.json";download(name,{version:2,exportedAt:new Date().toISOString(),products:products(),supplierCatalog:read("mamlaka_supplier_catalog_v1",null),taxonomyConfig:read("mamlaka_catalog_taxonomy_config_v1",{}),theme:read(THEME_KEY,baseTheme),whatsapp:localStorage.getItem(WA_KEY)||"201272776928",storeName:localStorage.getItem("mamlaka_store_name_v1")||"مملكة العطور",inventoryAccounting:read("mamlaka_inventory_accounting_v1",{items:[],sales:[],expenses:[],movements:[]}),localStorage:storageSnapshot()});recordRecentJson(name,"export",{products:products().length})});
    $("#importData")?.addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());const local=data.localStorage&&typeof data.localStorage==="object"?data.localStorage:{};if(!Array.isArray(data.products)&&!Array.isArray(local.mamlaka_custom_products_v1))throw Error("ملف غير صحيح: لا توجد قائمة products أو نسخة localStorage متوافقة");if(!Array.isArray(data.products))data.products=local.mamlaka_custom_products_v1;if(data.supplierCatalog===undefined)data.supplierCatalog=local.mamlaka_supplier_catalog_v1;if(data.taxonomyConfig===undefined)data.taxonomyConfig=local.mamlaka_catalog_taxonomy_config_v1;if(data.theme===undefined)data.theme=local.mamlaka_theme_v1;if(data.whatsapp===undefined)data.whatsapp=local.mamlaka_admin_whatsapp_v1;if(data.storeName===undefined)data.storeName=local.mamlaka_store_name_v1;if(data.inventoryAccounting===undefined)data.inventoryAccounting=local.mamlaka_inventory_accounting_v1;if(!confirm("سيتم استبدال قائمة المنتجات المضافة محليًا. سيتم تنزيل نسخة احتياطية من بيانات المتصفح أولًا. هل تتابع؟"))return;download("mamlakat-pre-import-backup.json",{version:2,exportedAt:new Date().toISOString(),products:products(),supplierCatalog:read("mamlaka_supplier_catalog_v1",null),taxonomyConfig:read("mamlaka_catalog_taxonomy_config_v1",{}),theme:read(THEME_KEY,baseTheme),whatsapp:localStorage.getItem(WA_KEY)||"201272776928",storeName:localStorage.getItem("mamlaka_store_name_v1")||"مملكة العطور",inventoryAccounting:read("mamlaka_inventory_accounting_v1",{items:[],sales:[],expenses:[],movements:[]}),localStorage:storageSnapshot()});saveProducts(data.products);if(data.supplierCatalog&&Array.isArray(data.supplierCatalog.products))localStorage.setItem("mamlaka_supplier_catalog_v1",JSON.stringify(data.supplierCatalog));if(data.taxonomyConfig)localStorage.setItem("mamlaka_catalog_taxonomy_config_v1",JSON.stringify(data.taxonomyConfig));if(data.theme)applyTheme(data.theme);if(data.whatsapp)localStorage.setItem(WA_KEY,String(data.whatsapp));if(data.storeName)localStorage.setItem("mamlaka_store_name_v1",String(data.storeName));if(data.inventoryAccounting&&Array.isArray(data.inventoryAccounting.items)&&Array.isArray(data.inventoryAccounting.sales)&&Array.isArray(data.inventoryAccounting.expenses))localStorage.setItem("mamlaka_inventory_accounting_v1",JSON.stringify(data.inventoryAccounting));const restorableKeys=BACKUP_KEYS.filter(k=>!["mamlaka_custom_products_v1","mamlaka_supplier_catalog_v1","mamlaka_catalog_taxonomy_config_v1","mamlaka_theme_v1","mamlaka_admin_whatsapp_v1","mamlaka_store_name_v1","mamlaka_inventory_accounting_v1"].includes(k));restorableKeys.forEach(k=>{if(Object.prototype.hasOwnProperty.call(local,k)){const value=local[k];if(value===null)localStorage.removeItem(k);else localStorage.setItem(k,typeof value==="string"?value:JSON.stringify(value));}});loadCfg();renderAdminProducts();document.dispatchEvent(new Event("mamlaka:supplier-catalog-updated"));document.dispatchEvent(new Event("mamlaka:products-updated"));recordRecentJson(f.name,"import",{products:Array.isArray(data.products)?data.products.length:0});toast("تم استيراد النسخة الكاملة بما فيها كتالوج الموردين والتصنيف.");}catch(err){toast(err.message||"تعذر قراءة الملف.")}finally{e.target.value="";}});
    $("#storedDataSearch")?.addEventListener("input",renderStoredData);$("#refreshStoredData")?.addEventListener("click",renderStoredData);$("#exportStoredData")?.addEventListener("click",()=>{const all={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k)continue;const raw=localStorage.getItem(k);try{all[k]=JSON.parse(raw)}catch{all[k]=raw}}download("mamlakat-al-otor-all-local-data.json",{exportedAt:new Date().toISOString(),storage:"localStorage on this browser only",data:all});});
    $("#exportRequests")?.addEventListener("click",()=>download("mamlakat-al-otor-missing-requests.json",read("mamlaka_requests_v1",[])));
    $("#changePinForm")?.addEventListener("submit",e=>{e.preventDefault();if($("#oldPin").value!==localStorage.getItem(PIN_KEY)){toast("الرمز الحالي غير صحيح.");return;}localStorage.setItem(PIN_KEY,$("#newPin").value);e.target.reset();toast("تم تحديث رمز الإدارة.");});
    window.addEventListener("storage",e=>{if(e.key===THEME_KEY)applyTheme(read(THEME_KEY,baseTheme));});
  });
})();
;

/* ===== MODULE 4: mamlaka-full-editor.js ===== */
;
/* Owner control extensions: autosave, reference text editing and reference library. Visual settings are centralized in settings.js. */
(()=>{'use strict';
const REFKEY='mamlaka_custom_reference_sites_v1',DRAFT='mamlaka_admin_draft_v1';
const $=(s,r=document)=>r.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function saveState(msg='تم الحفظ تلقائيًا على هذا الجهاز'){const box=$('#mamlakaSaveState');if(box)box.textContent='✓ '+msg+' · '+new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});}
function refRows(){const built=[['الخليج للعطور — الموقع العربي','عربي وخليجي','https://www.alkhaleejscents.com/ar'],['طيف الإمارات — الموقع العربي','عربي وخليجي','https://ae.taifalemarat.com/ar']];return [...built,...read(REFKEY,[])];}
function ensureEditor(){
 const layer=$('#adminLayer'),content=$('#adminContent');if(!layer||!content||$('#mamlakaFullEditor'))return;
 const nav=$('.admin-tabs',content);if(nav&&!nav.querySelector('[data-tab="full"]')){const b=document.createElement('button');b.type='button';b.dataset.tab='full';b.textContent='إدارة كاملة والمراجع';nav.append(b)}
 const page=document.createElement('section');page.className='admin-page hidden';page.dataset.page='full';page.id='mamlakaFullEditor';
 page.innerHTML=`
 <h3>مركز التحكم الكامل بالموقع</h3><p class="admin-note">كل تغيير هنا يُحفظ تلقائيًا في هذا المتصفح، ويمكنك الضغط على «حفظ كل التعديلات» للتأكيد. تعديلات المتصفح لا تُنشر تلقائيًا إلى أجهزة العملاء.</p>
 <div class="mamlaka-save-state" id="mamlakaSaveState" role="status">جاهز للتعديل — الحفظ تلقائي</div>
 <div class="mamlaka-editor-card"><h4>📝 تعديل نصوص أقسام الموقع</h4><p class="admin-note">اختر عنوانًا أو وصفًا من الصفحة واكتب النص الجديد. يُحفظ تلقائيًا، ويمكنك استعادة النص الأصلي لكل عنصر.</p><div class="mamlaka-editor-grid"><label>العنصر المراد تعديله<select id="fullTextTarget"></select></label><label class="wide">النص الجديد<textarea id="fullTextValue" rows="3" placeholder="اكتب النص الذي تريد عرضه"></textarea></label></div><div class="mamlaka-editor-actions"><button class="btn btn-gold" type="button" id="fullTextSave">حفظ النص</button><button class="btn btn-outline" type="button" id="fullTextReset">استعادة النص الأصلي</button></div></div>
 <div class="mamlaka-editor-card"><h4>🔗 قائمة المواقع المرجعية</h4><p class="admin-note">ابحث عن مواقع الإلهام وافتحها. يمكنك إضافة رابط جديد أو حذف روابطك المضافة. الروابط الأساسية للمراجع محفوظة ولا تُحذف.</p><div class="mamlaka-editor-grid"><label>اسم الموقع<input id="fullRefName" placeholder="اسم الموقع"></label><label>التصنيف<input id="fullRefCategory" value="عربي وخليجي" placeholder="التصنيف"></label><label class="wide">رابط الموقع<input id="fullRefUrl" type="url" placeholder="https://example.com"></label><label class="wide">بحث في المواقع المرجعية<input id="fullRefSearch" type="search" placeholder="ابحث بالاسم أو الرابط"></label></div><div class="mamlaka-editor-actions"><button class="btn btn-gold" type="button" id="fullRefAdd">إضافة موقع مرجعي</button></div><div id="fullRefList"></div><div id="referenceLibraryHost"></div></div>
 <div class="mamlaka-editor-card"><h4>🗂️ أدوات إدارة وتراجع</h4><div class="mamlaka-editor-actions"><button type="button" class="btn btn-outline" id="fullExport">تصدير إعدادات الواجهة والنصوص والمراجع</button><label class="btn btn-outline file-label">استيراد إعدادات الواجهة<input type="file" id="fullImport" accept=".json,application/json"></label><button type="button" class="btn btn-outline" id="fullClearDraft">مسح المسودة المؤقتة</button></div><p class="admin-note">استخدم النسخة الاحتياطية قبل التعديلات الكبيرة. إعادة الضبط تغيّر المظهر المخصص فقط ولا تحذف المنتجات أو الطلبات أو بيانات المخزون.</p></div>`;
 content.append(page);
 nav?.addEventListener('click',e=>{const b=e.target.closest('[data-tab="full"]');if(b){e.preventDefault();nav.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));content.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('hidden',x!==page));renderRefs();populateTextTargets();window.MamlakaReferenceLibrary?.mountInto?.($('#referenceLibraryHost'));}});
 function populateTextTargets(){const sel=$('#fullTextTarget',page),old=sel.value,els=[...document.querySelectorAll('main h1,main h2,main h3,main p')].filter(el=>el.textContent.trim().length>3&&!el.closest('#adminLayer')&&!el.closest('#referenceLibrary'));const list=els.slice(0,180).map((el,i)=>({el,i,label:el.textContent.trim().replace(/\s+/g,' ').slice(0,75)}));window.__mamlakaTextTargets=list;sel.innerHTML=list.map(x=>'<option value="'+x.i+'">'+esc(x.label)+'</option>').join('');if(old)sel.value=old;loadTextValue();}
 function loadTextValue(){const item=window.__mamlakaTextTargets?.[Number($('#fullTextTarget',page).value)];if(item)$('#fullTextValue',page).value=read('mamlaka_site_text_overrides_v1',{})[item.label]||item.el.textContent.trim();}
 function saveText(){const item=window.__mamlakaTextTargets?.[Number($('#fullTextTarget',page).value)];if(!item)return;const value=$('#fullTextValue',page).value.trim();if(!value)return;const overrides=read('mamlaka_site_text_overrides_v1',{});overrides[item.label]=value;write('mamlaka_site_text_overrides_v1',overrides);item.el.textContent=value;saveState('تم حفظ نص القسم');}
 $('#fullTextTarget',page).addEventListener('change',loadTextValue);$('#fullTextSave',page).addEventListener('click',saveText);
 $('#fullTextReset',page).addEventListener('click',()=>{const item=window.__mamlakaTextTargets?.[Number($('#fullTextTarget',page).value)];if(!item)return;const overrides=read('mamlaka_site_text_overrides_v1',{});delete overrides[item.label];write('mamlaka_site_text_overrides_v1',overrides);location.reload();});
 function renderRefs(){const q=($('#fullRefSearch',page).value||'').toLowerCase();$('#fullRefList',page).innerHTML=refRows().filter(x=>x.join(' ').toLowerCase().includes(q)).map((x,i)=>'<div class="mamlaka-ref-row"><div><strong>'+esc(x[0])+'</strong><br><a href="'+esc(x[2])+'" target="_blank" rel="noopener">'+esc(x[2])+'</a><small> · '+esc(x[1])+'</small></div>'+(i>=2?'<button type="button" class="btn btn-outline" data-del-ref="'+(i-2)+'">حذف</button>':'<span>مرجع أساسي</span>')+'</div>').join('');}
 $('#fullRefSearch',page).addEventListener('input',renderRefs);$('#fullRefAdd',page).addEventListener('click',()=>{const name=$('#fullRefName',page).value.trim(),cat=$('#fullRefCategory',page).value.trim()||'مراجع تصميم',url=$('#fullRefUrl',page).value.trim();if(!name||!/^https:\/\//i.test(url)){alert('اكتب اسم الموقع ورابط HTTPS صحيحًا.');return}const list=read(REFKEY,[]);list.push([name,cat,url]);write(REFKEY,list);$('#fullRefName',page).value='';$('#fullRefUrl',page).value='';renderRefs();saveState('تمت إضافة الموقع المرجعي');});
 $('#fullRefList',page).addEventListener('click',e=>{const b=e.target.closest('[data-del-ref]');if(!b)return;const list=read(REFKEY,[]);list.splice(Number(b.dataset.delRef),1);write(REFKEY,list);renderRefs();saveState('تم حذف الموقع المرجعي المضاف');});
 $('#fullExport',page).addEventListener('click',()=>download('mamlakat-al-otor-ui-backup.json',{texts:read('mamlaka_site_text_overrides_v1',{}),references:read(REFKEY,[])}));
 $('#fullImport',page).addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.texts)write('mamlaka_site_text_overrides_v1',d.texts);if(d.references)write(REFKEY,d.references);saveState('تم استيراد الإعدادات');location.reload()}catch{alert('ملف الإعدادات غير صالح.')}finally{e.target.value=''}});
 $('#fullClearDraft',page).addEventListener('click',()=>{localStorage.removeItem(DRAFT);saveState('تم مسح المسودة المؤقتة');});
 function download(name,obj){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200)}
 renderRefs();populateTextTargets();
}
function autosaveLegacy(){
 const layer=$('#adminLayer');if(!layer||layer.dataset.fullAutosave)return;layer.dataset.fullAutosave='1';
 layer.addEventListener('input',e=>{const el=e.target;if(!el.matches('input,textarea,select')||el.closest('#mamlakaFullEditor'))return;const id=el.id;if(!id)return;const drafts=read(DRAFT,{});drafts[id]=el.type==='file'?'':el.value;write(DRAFT,drafts);saveState('مسودة الإعداد محفوظة تلقائيًا');});
 layer.addEventListener('change',e=>{const el=e.target;if(!el.matches('input,textarea,select')||el.closest('#mamlakaFullEditor'))return;if(['cfgBg','cfgPanel','cfgPanel2','cfgCard','cfgField','cfgGold','cfgGold2','cfgText','cfgHeading','cfgMuted','cfgLine','cfgHeader','cfgFooter','cfgButton','cfgButtonText','cfgOverlay','cfgVisualStyle','cfgPreset'].includes(el.id)){const save=$('#saveSite');if(save){save.click();saveState('تم تطبيق وحفظ إعدادات الموقع');}}});
}
function observe(){const mo=new MutationObserver(()=>{if($('#adminLayer')){ensureEditor();autosaveLegacy()}});mo.observe(document.documentElement,{childList:true,subtree:true});if($('#adminLayer')){ensureEditor();autosaveLegacy()}}
document.addEventListener('DOMContentLoaded',observe);if(document.readyState!=='loading')observe();
})();

;

/* ===== MODULE 5: enhancements.js ===== */
;
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  let toastTimer = 0;
  function enhanceToast() {
    const toast = $("#toast");
    if (!toast || toast.dataset.enhanced === "1") return;
    toast.dataset.enhanced = "1";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast-dismiss";
    close.setAttribute("aria-label", "إخفاء الإشعار");
    close.textContent = "×";
    close.addEventListener("click", () => hideToast(toast));
    toast.append(close);
    const observer = new MutationObserver(() => {
      if (!toast.contains(close)) toast.append(close);
      const msg = [...toast.childNodes].filter(n => n !== close && !(n.nodeType === 1 && n.classList.contains("toast-dismiss"))).map(n => n.textContent || "").join("").trim();
      if (msg) {
        toast.classList.add("is-visible");
        toast.setAttribute("aria-label", msg);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => hideToast(toast), 5000);
      } else hideToast(toast);
    });
    observer.observe(toast, {childList:true,subtree:true,characterData:true});
  }
  function hideToast(toast) {
    clearTimeout(toastTimer);
    toast.classList.remove("is-visible");
    toast.setAttribute("aria-label", "الإشعارات");
    // Keep the existing toast element intact for the site's current notification code.
  }
  function closeOpenLayers() {
    const drawer = $("#cartDrawer");
    const backdrop = $("#drawerBackdrop");
    if (drawer && !drawer.classList.contains("hidden")) {
      $("#closeDrawer")?.click();
      return true;
    }
    const modalBackdrop = $("#modalBackdrop");
    if (modalBackdrop && !modalBackdrop.classList.contains("hidden")) {
      $("#closeModal")?.click();
      return true;
    }
    const admin = $(".admin-panel");
    if (admin) {
      const close = admin.querySelector(".admin-close, .admin-head button, [aria-label='إغلاق']");
      if (close) { close.click(); return true; }
    }
    return false;
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeOpenLayers();
  });
  document.addEventListener("DOMContentLoaded", enhanceToast);
  enhanceToast();

  document.addEventListener("DOMContentLoaded",()=>{if(document.getElementById("royalVoiceGuide"))return;const b=document.createElement("button");b.id="royalVoiceGuide";b.type="button";b.textContent="♛ اشرح لي صوتيًا";b.setAttribute("aria-label","شرح صوتي للخطوة الحالية");b.style.cssText="position:fixed;bottom:18px;left:16px;z-index:999;border:1px solid #b58a42;border-radius:999px;padding:11px 16px;background:#fffaf1;color:#493923;box-shadow:0 8px 26px #0002;font-weight:700;cursor:pointer";b.addEventListener("click",()=>{if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){alert("التحدث الصوتي غير مدعوم في هذا المتصفح.");return}const id=(location.hash||"#home").slice(1),s=document.getElementById(id)||document.querySelector("main section"),h=s?.querySelector("h1,h2,h3")?.textContent||"مرحبًا بك في مملكة العطور",p=s?.querySelector("p")?.textContent||"اختر القسم الذي تريد زيارته.";speechSynthesis.cancel();const u=new SpeechSynthesisUtterance("أهلًا بك في مملكة العطور. "+h+". "+p+" يمكنك التواصل معنا عبر واتساب للمساعدة.");u.lang="ar-EG";u.rate=.92;speechSynthesis.speak(u)});document.body.appendChild(b)});
})();
;

/* ===== MODULE 6: supplier-catalog.js ===== */
;
/* MAMLKAT AL-OTOR: supplier catalog + fragrance taxonomy + chemistry disclosure */
(() => {
'use strict';
const KEY='mamlaka_supplier_catalog_v1', $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(v?.products)?v:null}catch{return null}};
const fmt=n=>n==null?'—':Number(n).toLocaleString('ar-EG',{maximumFractionDigits:2});
let families=[
{id:'حمضي ومنعش',en:'Citrus / Fresh',nature:'منعش وخفيف أو مائي أو حمضي',notes:'حمضيات أو فواكه منعشة؛ نوتات مائية/خضراء محتملة؛ مسك أو أخشاب في القاعدة.',chem:'Limonene وCitral جزيئات رائحة حمضية شائعة في الصناعة؛ لا يثبت وجودها في أي زيت بعينه.'},
{id:'زهري ووردي',en:'Floral / Rose',nature:'زهري من ناعم وبودري إلى غني ووردي',notes:'ورد أو زهور بيضاء بحسب الإصدار؛ بتلات زهرية؛ مسك أو أخشاب محتملة في القاعدة.',chem:'Phenethyl Alcohol وLinalool أمثلة لمواد ذات طابع زهري شائعة؛ ليست مكونات مؤكدة لهذا المنتج.'},
{id:'مسكي ونظيف',en:'Musk / Clean',nature:'ناعم ونظيف وقريب من رائحة الجلد',notes:'مسك؛ قطن نظيف؛ أخشاب ناعمة محتملة.',chem:'Galaxolide أو Habanolide أمثلة لمركبات مسكية تستخدم في بعض العطور؛ لا يعني ذلك وجودها في هذا الزيت.'},
{id:'حلو وفانيليا',en:'Gourmand / Sweet',nature:'حلو؛ قد يميل للفانيليا أو الكراميل أو القهوة أو الفاكهة',notes:'فانيليا أو حلوى؛ قهوة/فاكهة محتملة؛ عنبر أو مسك في القاعدة.',chem:'Vanillin وEthyl Maltol من مواد الرائحة الحلوة الشائعة؛ ليست صيغة مثبتة لهذا المنتج.'},
{id:'عنبر وشرقي',en:'Amber / Oriental',nature:'دافئ وغني وقد يكون راتنجيًا أو متبلًا أو بخوريًا',notes:'عنبر أو توابل محتملة؛ راتنجات/بخور؛ أخشاب أو مسك.',chem:'تختلف المواد العطرية حسب الصيغة؛ قائمة المورد لا تكشف المكونات الفعلية أو نسبها.'},
{id:'عود وخشبي',en:'Oud / Woody',nature:'خشبي دافئ؛ قد يكون جافًا أو راتنجيًا أو مدخنًا',notes:'أخشاب؛ عود/صندل حسب الإصدار؛ راتنجات أو توابل محتملة.',chem:'Iso E Super أو Cashmeran أمثلة لمواد خشبية مستخدمة في بعض التركيبات؛ ليست مكونات مؤكدة هنا.'},
{id:'جلدي وتبغي',en:'Leather / Tobacco',nature:'جلدي أو مدخن أو تبغي ودافئ',notes:'جلد أو تبغ كطابع عطري؛ توابل/أخشاب؛ عنبر أو فانيليا محتملة.',chem:'قد تستخدم مواد ذات طابع جلدي/دخاني؛ لا توجد صيغة خاصة بالمنتج في قائمة الأسعار.'},
{id:'عطري وأخضر',en:'Aromatic / Green',nature:'أخضر أو عشبي أو عطري ونظيف',notes:'أعشاب أو أوراق خضراء؛ لافندر/توابل محتملة؛ أخشاب أو مسك.',chem:'Linalool مثال لمادة عطرية مستخدمة على نطاق واسع؛ لا يثبت وجودها أو تركيزها في الزيت.'},
{id:'غير محدد',en:'Unclassified',nature:'يلزم تقييم العينة أو الرجوع إلى بيانات المورد',notes:'التصنيف غير مؤكد من الاسم وحده.',chem:'اطلب SDS وIFRA Certificate أو النشرة الفنية من المورد؛ لا يمكن استنتاج الصيغة من الاسم.'}
];
const baseFamilies=families.slice();
function mount(){
const content=$('#adminContent'),nav=$('.admin-tabs');
if(!content||!nav||!$('[data-page="data"]')||$('#supplierCatalogPage'))return;
let savedConfig={};
try{savedConfig=JSON.parse(localStorage.getItem('mamlaka_catalog_taxonomy_config_v1')||'{}')}catch{}
if(Array.isArray(savedConfig.families)&&savedConfig.families.length){
families=savedConfig.families.map(f=>{const old=baseFamilies.find(x=>x.id===f.id)||{};return {...old,id:f.id,en:f.labelEn||old.en||f.id,nature:f.nature||old.nature||'تحتاج إلى وصف',notes:f.notes||old.notes||'التفاصيل تحتاج إلى مراجعة',chem:old.chem||'لا توجد بيانات كيميائية خاصة بهذا المنتج؛ اطلب مستندات المورد.'}});
}
const tab=document.createElement('button');tab.type='button';tab.dataset.tab='supplier';tab.textContent='كتالوج الموردين';nav.append(tab);
const taxTab=document.createElement('button');taxTab.type='button';taxTab.dataset.tab='taxonomy';taxTab.textContent='تصنيف وتركيب';nav.append(taxTab);
const page=document.createElement('section');page.className='admin-page hidden';page.dataset.page='supplier';page.id='supplierCatalogPage';
page.innerHTML='<h3>كتالوج الموردين — Golden Line وNiche Line</h3><p class="admin-note">تكاليف المورد للزيوت المركزة وليست أسعار بيع التجزئة. استيراد الملف يحفظ البيانات في هذا المتصفح ولا يستبدل منتجات المتجر.</p><div class="admin-actions"><label class="btn btn-gold file-label">استيراد كتالوج JSON<input id="supplierJsonFile" type="file" accept=".json,application/json"></label><button class="btn btn-outline" id="supplierExport">تصدير نسخة الكتالوج</button><button class="btn btn-outline" id="supplierClear">حذف الكتالوج المحلي</button></div><div class="admin-grid"><label>بحث بالاسم أو الكود<input id="supplierSearch" type="search" placeholder="Sauvage أو R1010159"></label><label>قسم المورد<select id="supplierCategory"><option value="">كل الأقسام</option><option value="MEN">رجالي</option><option value="WOMEN">نسائي</option><option value="UNISEX">للجنسين</option><option value="ORIENTAL">شرقي</option><option value="KIDS">أطفال</option><option value="DIFFUSER">فواحات</option></select></label><label>خط المورد<select id="supplierLine"><option value="">الكل</option><option>Golden</option><option>Niche</option></select></label><label>العائلة العطرية<select id="supplierFamily"><option value="">كل العائلات</option>'+families.map(x=>'<option>'+esc(x.id)+'</option>').join('')+'</select></label><label>عرض الأسعار<select id="supplierVat"><option value="false">بدون ضريبة</option><option value="true">شامل ضريبة 14%</option></select></label></div><p id="supplierSummary" class="admin-note" aria-live="polite">لم يتم استيراد الكتالوج بعد.</p><div id="supplierResults" class="supplier-results"></div>';
content.append(page);
const categorySelect=$('#supplierCategory');
if(Array.isArray(savedConfig.categories))savedConfig.categories.forEach(x=>{if(![...categorySelect.options].some(o=>o.value===x.id)){const op=document.createElement('option');op.value=x.id;op.textContent=x.labelAr||x.id;categorySelect.append(op)}});
const taxPage=document.createElement('section');taxPage.className='admin-page hidden';taxPage.dataset.page='taxonomy';taxPage.id='fragranceTaxonomyPage';
taxPage.innerHTML='<h3>دليل تصنيف العطور والزيوت والتركيب</h3><p class="admin-note">التصنيف المقترح يساعد على تنظيم الكتالوج، لكنه لا يُعد تحليلًا مخبريًا أو تأكيدًا لنوتات كل إصدار. راجع العينة ومعلومات الشركة قبل اعتماد المنتج.</p><div class="taxonomy-grid">'+families.map(f=>'<article class="taxonomy-card"><strong>'+esc(f.id)+'</strong><small dir="ltr">'+esc(f.en)+'</small><p><b>طبيعة الرائحة:</b> '+esc(f.nature)+'</p><p><b>ملف النوتات العام:</b> '+esc(f.notes)+'</p><p><b>المعلومات الكيميائية:</b> '+esc(f.chem)+'</p></article>').join('')+'</div><h3>حقول التركيب التي ينبغي تسجيلها</h3><ul><li>اسم الزيت وكود المورد وخط المورد.</li><li>العائلة العطرية وطبيعة الرائحة والنوتات العليا والوسطى والقاعدية بعد التحقق.</li><li>حجم العبوة ووزن الزيت وكثافته إن وفرها المورد، وتكلفة الجرعة وهامش الربح.</li><li>نسبة التخفيف الموصى بها من المورد، واسم المذيب/القاعدة المعتمدة.</li><li>مستند SDS وIFRA، ومسببات الحساسية المعلنة، ورقم التشغيلة وتاريخها.</li></ul><p class="admin-note"><b>تنبيه كيميائي:</b> قائمة الأسعار لا تحتوي الصيغة الكيميائية الفعلية ولا نسب مكوناتها. الأمثلة الجزيئية في هذا الدليل معلومات عامة عن عائلات الرائحة فقط وليست قائمة مكونات للمنتج. لا نخترع تركيبة ولا نوصي بنسبة تخفيف ثابتة دون وثائق المورد.</p>';
content.append(taxPage);
const style=document.createElement('style');style.textContent='.supplier-results{display:grid;gap:10px;margin-top:12px}.supplier-row,.taxonomy-card{border:1px solid #8d732e66;border-radius:12px;padding:12px;background:#0d0c0a}.supplier-row header{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.supplier-row small,.taxonomy-card small{display:block;opacity:.8;margin-top:4px}.supplier-prices{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.supplier-prices span{border:1px solid #d4af3744;border-radius:8px;padding:5px 8px;font-size:12px}.taxonomy-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}.taxonomy-card p{font-size:13px;line-height:1.7;margin:7px 0}';document.head.append(style);
const render=()=>{
const d=read(),summary=$('#supplierSummary'),out=$('#supplierResults');
if(!d){summary.textContent='لم يتم استيراد الكتالوج. نزّل ملف كتالوج الموردين enriched JSON واستورده هنا.';out.innerHTML='';return}
const q=($('#supplierSearch').value||'').trim().toLowerCase(),cat=$('#supplierCategory').value,line=$('#supplierLine').value,fam=$('#supplierFamily').value,vat=$('#supplierVat').value==='true',all=d.products||[];
const list=all.filter(p=>(!cat||p.category===cat)&&(!line||p.line===line)&&(!fam||(p.scentFamily||p.chemicalProfileId)===fam)&&(!q||[p.sku,p.name_en,p.name_ar].some(v=>String(v||'').toLowerCase().includes(q))));
summary.textContent='إجمالي '+fmt(all.length)+' منتج · النتائج '+fmt(list.length)+' · '+(vat?'الأسعار شاملة':'الأسعار غير شاملة')+' ضريبة 14% · تاريخ القائمة '+(d.metadata?.source_date||'2026-06-16');
out.innerHTML=list.slice(0,100).map(p=>{const ws=[['1 كجم','price_1kg'],['500 جم','price_500g'],['250 جم','price_250g'],['125 جم','price_125g'],['50 جم','price_50g']];const famObj=families.find(x=>x.id===(p.scentFamily||p.chemicalProfileId))||families[families.length-1];return '<article class="supplier-row"><header><div><strong>'+esc(p.name_ar||p.name_en)+'</strong><small dir="ltr">'+esc(p.name_en)+' · '+esc(p.sku)+'</small><small>'+esc(p.category)+' · '+esc(p.line)+' · '+esc(famObj.id)+(p.name_ar?'':' · الاسم العربي يحتاج مراجعة')+'</small></div><strong>'+esc(p.currency||'EGP')+'</strong></header><p><b>طبيعة العطر:</b> '+esc(p.scentNature||famObj.nature)+'</p><p><b>النوتات/الطابع العام:</b> '+esc((p.scentNotesProfile||famObj.notes).toString())+'</p><div class="supplier-prices">'+ws.map(([w,k])=>'<span>'+w+': '+fmt(vat?p[k+'_vat']:p[k])+' ج.م</span>').join('')+'</div><p class="admin-note"><b>التركيب الكيميائي:</b> '+esc(p.chemicalCompositionStatus||'غير منشور من المورد؛ لا يمكن تأكيد الصيغة الفعلية')+'<br>'+esc(famObj.chem)+'<br><b>السلامة:</b> اطلب SDS وIFRA من المورد؛ الأمثلة أعلاه عامة وليست مكونات مؤكدة لهذا الزيت.</p></article>'}).join('')||'<p class="admin-note">لا توجد نتائج مطابقة.</p>';
if(list.length>100)out.insertAdjacentHTML('beforeend','<p class="admin-note">يُعرض أول 100 نتيجة فقط؛ استخدم البحث لتضييق القائمة.</p>');
};
$('#supplierJsonFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.products)||!d.metadata)throw Error('صيغة الملف غير صحيحة. استخدم ملف كتالوج الموردين JSON.');if(!confirm('استيراد '+d.products.length+' منتجًا إلى كتالوج الموردين المحلي؟ لن تُستبدل منتجات المتجر.'))return;localStorage.setItem(KEY,JSON.stringify(d));render();alert('تم حفظ كتالوج الموردين في هذا المتصفح.')}catch(err){alert(err.message||'تعذر قراءة الملف')}finally{e.target.value=''}});
['supplierSearch','supplierCategory','supplierLine','supplierFamily','supplierVat'].forEach(id=>$('#'+id).addEventListener(id==='supplierSearch'?'input':'change',render));
$('#supplierExport').addEventListener('click',()=>{const d=read();if(!d){alert('لا يوجد كتالوج لتصديره');return}const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json;charset=utf-8'}));a.download='mamlakat-al-otor-supplier-catalog-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('#supplierClear').addEventListener('click',()=>{if(confirm('حذف كتالوج الموردين من هذا المتصفح؟')){localStorage.removeItem(KEY);render();document.dispatchEvent(new CustomEvent('mamlaka:supplier-catalog-updated'))}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-tab="supplier"],[data-tab="taxonomy"]');if(!b)return;nav.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));content.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('hidden',x.dataset.page!==b.dataset.tab));if(b.dataset.tab==='supplier')render()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
;

/* ===== MODULE 7: catalog-editor.js ===== */
;
/* MAMLKAT AL-OTOR: editable supplier catalog, classifications and prices */
(() => {
'use strict';
const KEY='mamlaka_supplier_catalog_v1', TAXKEY='mamlaka_catalog_taxonomy_config_v1';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaultConfig={
 retailBlendPrices:[{size:'3 مل',price:50},{size:'5 مل',price:75},{size:'10 مل',price:100},{size:'22 مل',price:130},{size:'30 مل',price:100},{size:'50 مل',price:150},{size:'100 مل',price:300}],
 gramPricing:{french:10,oriental:15,orientalPremium:20},
 productTypes:[{id:'ready',labelAr:'عطر جاهز'},{id:'oil',labelAr:'زيت عطري مركز / تركيب'},{id:'bakhoor',labelAr:'عود وبخور'},{id:'gift',labelAr:'هدايا وتغليف'},{id:'diffuser',labelAr:'زيت فواحة'}],
 categories:[{id:'MEN',labelAr:'رجالي'},{id:'WOMEN',labelAr:'نسائي'},{id:'UNISEX',labelAr:'للجنسين'},{id:'ORIENTAL',labelAr:'شرقي'},{id:'KIDS',labelAr:'أطفال'},{id:'DIFFUSER',labelAr:'فواحات'}],
 families:[
 {id:'حمضي ومنعش',labelEn:'Citrus / Fresh',nature:'منعش وخفيف أو مائي أو حمضي',notes:'حمضيات أو فواكه منعشة؛ نوتات مائية/خضراء محتملة؛ مسك أو أخشاب في القاعدة.'},
 {id:'زهري ووردي',labelEn:'Floral / Rose',nature:'زهري من ناعم وبودري إلى غني ووردي',notes:'ورد أو زهور بيضاء بحسب الإصدار؛ مسك أو أخشاب محتملة في القاعدة.'},
 {id:'مسكي ونظيف',labelEn:'Musk / Clean',nature:'ناعم ونظيف وقريب من رائحة الجلد',notes:'مسك؛ قطن نظيف؛ أخشاب ناعمة محتملة.'},
 {id:'حلو وفانيليا',labelEn:'Gourmand / Sweet',nature:'حلو؛ قد يميل للفانيليا أو الكراميل أو القهوة أو الفاكهة',notes:'فانيليا أو حلوى؛ قهوة/فاكهة محتملة؛ عنبر أو مسك في القاعدة.'},
 {id:'عنبر وشرقي',labelEn:'Amber / Oriental',nature:'دافئ وغني وقد يكون راتنجيًا أو متبلًا أو بخوريًا',notes:'عنبر أو توابل محتملة؛ راتنجات/بخور؛ أخشاب أو مسك.'},
 {id:'عود وخشبي',labelEn:'Oud / Woody',nature:'خشبي دافئ؛ قد يكون جافًا أو راتنجيًا أو مدخنًا',notes:'أخشاب؛ عود/صندل حسب الإصدار؛ راتنجات أو توابل محتملة.'},
 {id:'جلدي وتبغي',labelEn:'Leather / Tobacco',nature:'جلدي أو مدخن أو تبغي ودافئ',notes:'جلد أو تبغ كطابع عطري؛ توابل/أخشاب؛ عنبر أو فانيليا محتملة.'},
 {id:'عطري وأخضر',labelEn:'Aromatic / Green',nature:'أخضر أو عشبي أو عطري ونظيف',notes:'أعشاب أو أوراق خضراء؛ لافندر/توابل محتملة؛ أخشاب أو مسك.'},
 {id:'بحري',labelEn:'Aquatic / Marine',nature:'مائي أو بحري ومنعش وقد يحمل لمسة ملحية',notes:'نوتات مائية أو بحرية؛ حمضيات أو أعشاب أو أخشاب محتملة.'},
 {id:'بودري',labelEn:'Powdery / Soft',nature:'ناعم ونظيف وقد يشبه البودرة أو المكياج الكلاسيكي',notes:'السوسن أو البنفسج أو المسك الناعم؛ لمسات زهرية أو خشبية محتملة.'},
 {id:'غير محدد',labelEn:'Unclassified',nature:'يلزم تقييم العينة أو الرجوع إلى بيانات المورد',notes:'التصنيف غير مؤكد من الاسم وحده.'}
 ]};
const loadConfig=()=>{try{const saved=JSON.parse(localStorage.getItem(TAXKEY)||'{}')||{};const c={...defaultConfig,...saved};const source=Array.isArray(saved.retailBlendPrices)&&saved.retailBlendPrices.length?saved.retailBlendPrices:defaultConfig.retailBlendPrices;const bySize={};source.forEach(x=>{const n=String(x.size||'').match(/[0-9]+/)?.[0];if(n&&Number.isFinite(Number(x.price))&&Number(x.price)>=50)bySize[n]=Number(x.price)});const reference={'3':50,'5':75,'10':100,'22':130,'30':100,'50':150,'100':300};c.retailBlendPrices=Object.entries(reference).map(([n,price])=>({size:n+' مل',price:bySize[n]??price}));return c}catch{return structuredClone(defaultConfig)}};
const saveConfig=c=>localStorage.setItem(TAXKEY,JSON.stringify(c));
const readCatalog=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return d&&Array.isArray(d.products)?d:null}catch{return null}};
const saveCatalog=d=>{d.taxonomyConfig=loadConfig();d.metadata=d.metadata||{};d.metadata.lastEditedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(d))};
const prices=[['1 كجم','price_1kg'],['500 جم','price_500g'],['250 جم','price_250g'],['125 جم','price_125g'],['50 جم','price_50g']];
const num=v=>v===''||v==null?null:Number(v);
function mount(){
 const nav=$('.admin-tabs'),content=$('#adminContent'); if(!nav||!content||$('#catalogEditorPage'))return;
 const tab=document.createElement('button');tab.type='button';tab.dataset.tab='catalog-editor';tab.textContent='إدارة الأنواع والأسعار';nav.append(tab);
 const page=document.createElement('section');page.className='admin-page hidden';page.dataset.page='catalog-editor';page.id='catalogEditorPage';
 page.innerHTML=`
 <h3>إدارة التصنيف والأنواع والأسعار</h3>
 <p class="admin-note">عدّل البيانات من النماذج ثم اضغط حفظ. تُحفظ التغييرات محليًا، وتُزامَن سحابيًا عند تفعيل Supabase وتسجيل دخول الإدارة. صدّر نسخة JSON احتياطية بعد التعديلات المهمة.</p>
 <div class="admin-actions"><button type="button" class="btn btn-gold" id="ceExport">تصدير الكتالوج بعد التعديل</button><button type="button" class="btn btn-outline" id="ceImportBtn">استيراد نسخة كتالوج</button><input id="ceImportFile" type="file" accept=".json,application/json" hidden><button type="button" class="btn btn-outline" id="ceDeleteImportedCatalog">حذف ملف JSON المستورد</button><button type="button" class="btn btn-outline" id="ceNewProduct">إضافة نوع زيت جديد</button></div><p class="admin-note" id="ceJsonFileStatus" aria-live="polite">لا يوجد سجل ملف JSON مستورد حتى الآن.</p>
 <div class="admin-grid"><label>ابحث بالاسم أو الكود<input id="ceSearch" placeholder="اكتب اسم العطر أو كود المورد"></label><label>اختيار المنتج للتعديل<select id="ceProduct"></select></label></div>
 <div id="ceStatus" class="admin-note" aria-live="polite"></div>
 <form id="ceProductForm" class="admin-form">
 <h4>بيانات النوع والأسعار</h4><div class="admin-grid">
 <label>الاسم الإنجليزي<input id="ceNameEn" required></label><label>الاسم العربي<input id="ceNameAr"></label><label>كود المورد / SKU<input id="ceSku" required></label>
 <label>القسم<select id="ceCategory"></select></label><label>خط المورد<select id="ceLine"><option value="Golden">Golden</option><option value="Niche">Niche</option><option value="Local">محلي</option><option value="Custom">مخصص</option></select></label><label>العائلة العطرية<select id="ceFamily"></select></label>
 <label>نوع المنتج<select id="ceType"></select></label><label>طبيعة الرائحة<input id="ceNature" placeholder="مثال: خشبي دافئ وناعم"></label><label>النوتات/الطابع العام<input id="ceNotes" placeholder="علوي، وسطى، قاعدية بعد التحقق"></label>
 </div><h4>أسعار المورد (جنيه مصري — قبل الضريبة)</h4><div class="admin-grid">${prices.map(([label,key])=>`<label>${label}<input type="number" min="0" step="0.01" id="ce_${key}" inputmode="decimal"></label>`).join('')}
 <label>نسبة الضريبة %<input id="ceVatRate" type="number" min="0" max="100" step="0.1" value="14"></label>
 </div><div class="admin-actions"><button class="btn btn-gold" type="submit">حفظ بيانات النوع والأسعار</button><button class="btn btn-outline" type="button" id="ceDeleteProduct">حذف النوع من الكتالوج</button></div></form>
 <hr><h3>إدارة قوائم التصنيف</h3><div class="admin-grid">
 <label>نوع القائمة<select id="ceListType"><option value="families">العائلات العطرية</option><option value="categories">الأقسام</option><option value="productTypes">أنواع المنتجات</option></select></label>
 <label>العنصر الحالي للتعديل<select id="ceListItem"></select></label><label>الاسم العربي / المعروض<input id="ceListLabel"></label><label>الاسم الإنجليزي أو المعرّف<input id="ceListEn"></label>
 <label>طبيعة الرائحة / الوصف<input id="ceListNature"></label><label>النوتات / التفاصيل<input id="ceListNotes"></label>
 </div><div class="admin-actions"><button class="btn btn-gold" id="ceSaveList" type="button">حفظ عنصر التصنيف</button><button class="btn btn-outline" id="ceAddList" type="button">عنصر تصنيف جديد</button><button class="btn btn-outline" id="ceDeleteList" type="button">حذف العنصر المحدد</button><button class="btn btn-outline" id="ceExportTax" type="button">تصدير ملف التصنيف JSON</button></div>
 <h3>سعر الجرام حسب فئة الزيت</h3><p class="admin-note">أسعار بيع إرشادية للعميل: الفرنسي 10 ج.م/جرام، الشرقي 15 ج.م/جرام، والشرقي الممتاز 20 ج.م/جرام. يمكن تعديلها هنا. هذه أسعار بيع للعميل وليست أسعار شراء المورد؛ ويجب اختيار فئة النوع الصحيحة قبل اعتماد السعر.</p><div class="admin-grid"><label>الفرنسي — جنيه/جرام<input id="ceGramFrench" type="number" min="1" step="0.5" value="10"></label><label>الشرقي — جنيه/جرام<input id="ceGramOriental" type="number" min="1" step="0.5" value="15"></label><label>الشرقي الممتاز — جنيه/جرام<input id="ceGramOrientalPremium" type="number" min="1" step="0.5" value="20"></label></div><div class="admin-actions"><button type="button" class="btn btn-gold" id="ceSaveGramPricing">حفظ أسعار الجرام</button><button type="button" class="btn btn-outline" id="ceResetGramPricing">استعادة 10 / 15 / 20 ج.م</button></div><div class="admin-note" id="ceGramReport" aria-live="polite"></div><h3>أسعار بيع الزيوت والتركيب حسب الحجم</h3><p class="admin-note">الأسعار بالجنيه المصري، وهي أسعار بيع للعميل وليست تكلفة شراء المورد. الحد الأدنى لكل حجم 50 جنيهًا؛ يمكنك تعديل كل سعر من الإدارة ثم حفظه. تنطبق هذه القائمة على طلبات الزيوت والتركيب فقط، ولا تُستخدم تلقائيًا لتسعير العطور الجاهزة أو البخور والهدايا.</p><div id="ceRetailPrices" class="admin-grid"></div><div class="admin-actions"><button class="btn btn-gold" id="ceSaveRetailPrices" type="button">حفظ أسعار الزيوت والتركيب</button><button class="btn btn-outline" id="ceResetRetailPrices" type="button">استعادة الأسعار المرجعية</button></div><div class="admin-note" id="cePriceReport" aria-live="polite"></div><h4>تفاصيل الأنواع والتصنيفات</h4><p class="admin-note">من نموذج بيانات النوع يمكنك إدارة الاسم العربي والإنجليزي، كود المورد، القسم، نوع المنتج، العائلة العطرية، طبيعة الرائحة والنوتات. لا تعتمد النوتات أو تفاصيل التركيب الكيميائي إلا عند وجود مصدر موثوق؛ المعلومات غير المؤكدة يجب أن تبقى قيد المراجعة.</p>`;
 content.append(page);
 const style=document.createElement('style');style.textContent='#catalogEditorPage .admin-form{margin-top:16px;border:1px solid #d4af3744;border-radius:12px;padding:14px}#catalogEditorPage h4{margin:14px 0 8px;color:#f1d77a}#catalogEditorPage .admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:12px 0}#catalogEditorPage label{display:flex;flex-direction:column;gap:5px;font-size:13px}#catalogEditorPage input,#catalogEditorPage select{width:100%;min-width:0;padding:10px;border:1px solid #d4af3755;border-radius:8px;background:#14120e;color:#f8f0d4}#catalogEditorPage .admin-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}#catalogEditorPage hr{border:0;border-top:1px solid #d4af3744;margin:24px 0}';document.head.append(style);
 let selectedIndex=-1;
 const config=()=>loadConfig();
 function fillSelects(){
 const c=config();
 const gp=c.gramPricing||defaultConfig.gramPricing; [['ceGramFrench','french'],['ceGramOriental','oriental'],['ceGramOrientalPremium','orientalPremium']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.value=Math.max(1,Number(gp[k])||defaultConfig.gramPricing[k])}); const gr=$('#ceGramReport');if(gr)gr.textContent='السعر الحالي: فرنسي '+gp.french+' ج.م/جرام · شرقي '+gp.oriental+' ج.م/جرام · شرقي ممتاز '+gp.orientalPremium+' ج.م/جرام.'; const rp=$('#ceRetailPrices'); if(rp) rp.innerHTML=(c.retailBlendPrices||[]).map((x,i)=>`<label>سعر ${esc(x.size)}<input type="number" min="50" step="1" data-retail-index="${i}" value="${Math.max(50,Number(x.price)||50)}"></label>`).join('');
 $('#ceCategory').innerHTML=c.categories.map(x=>`<option value="${esc(x.id)}">${esc(x.labelAr)} (${esc(x.id)})</option>`).join('');
 $('#ceFamily').innerHTML=c.families.map(x=>`<option value="${esc(x.id)}">${esc(x.id)}</option>`).join('');
 $('#ceType').innerHTML=c.productTypes.map(x=>`<option value="${esc(x.id)}">${esc(x.labelAr)}</option>`).join('');
 refreshListItems();
 }
 function catalog(){return readCatalog()}
 function refreshProducts(){
 const d=catalog(),q=($('#ceSearch').value||'').toLowerCase().trim(),sel=$('#ceProduct'),old=sel.value;
 if(!d){sel.innerHTML='<option value="">استورد كتالوج الموردين أولًا</option>';$('#ceStatus').textContent='لم يتم استيراد كتالوج الموردين بعد. استخدم زر الاستيراد أو افتح تبويب كتالوج الموردين.';return}
 const matches=d.products.map((p,i)=>({p,i})).filter(({p})=>!q||[p.name_ar,p.name_en,p.sku].some(v=>String(v||'').toLowerCase().includes(q)));
 sel.innerHTML=matches.map(({p,i})=>`<option value="${i}">${esc(p.name_ar||p.name_en)} — ${esc(p.sku||'بدون كود')}</option>`).join('')||'<option value="">لا توجد نتائج</option>';
 if([...sel.options].some(o=>o.value===old))sel.value=old;
 selectedIndex=Number(sel.value);$('#ceStatus').textContent=`عدد المنتجات في الكتالوج: ${d.products.length} · المطابق للبحث: ${matches.length}`;
 if(sel.value!=='')loadProduct(Number(sel.value));
 }
 function loadProduct(i){
 const d=catalog();if(!d||!d.products[i])return;selectedIndex=i;const p=d.products[i];
 $('#ceNameEn').value=p.name_en||'';$('#ceNameAr').value=p.name_ar||'';$('#ceSku').value=p.sku||'';
 $('#ceCategory').value=p.category||config().categories[0]?.id||'MEN';$('#ceLine').value=p.line||'Golden';
 $('#ceFamily').value=p.scentFamily||p.chemicalProfileId||config().families[config().families.length-1]?.id||'غير محدد';
 $('#ceType').value=p.productType||'oil';$('#ceNature').value=p.scentNature||'';$('#ceNotes').value=p.scentNotesProfile||'';
 $('#ceVatRate').value=Number(p.vat_rate??14);
 prices.forEach(([label,key])=>$('#ce_'+key).value=p[key]??'');
 }
 function refreshListItems(){
 const c=config(),type=$('#ceListType').value,arr=c[type]||[];
 $('#ceListItem').innerHTML=arr.map((x,i)=>`<option value="${i}">${esc(x.labelAr||x.id)}${x.id&&x.id!==(x.labelAr||'')?' — '+esc(x.id):''}</option>`).join('')||'<option value="">لا توجد عناصر</option>';
 loadListItem(Number($('#ceListItem').value));
 }
 function loadListItem(i){
 const c=config(),arr=c[$('#ceListType').value]||[],x=arr[i];if(!x){$('#ceListLabel').value='';$('#ceListEn').value='';$('#ceListNature').value='';$('#ceListNotes').value='';return}
 $('#ceListLabel').value=x.id||x.labelAr||'';$('#ceListEn').value=x.labelEn||x.labelAr||'';$('#ceListNature').value=x.nature||'';$('#ceListNotes').value=x.notes||'';
 }
 $('#ceProduct').addEventListener('change',()=>{if($('#ceProduct').value!=='')loadProduct(Number($('#ceProduct').value))});
 $('#ceSearch').addEventListener('input',refreshProducts);
 $('#ceProductForm').addEventListener('submit',e=>{
 e.preventDefault();const d=catalog();if(!d){alert('استورد كتالوج الموردين أولًا');return}
 const i=selectedIndex,p=i>=0&&d.products[i]?d.products[i]:{};
 const sku=$('#ceSku').value.trim();if(!sku){alert('أدخل كودًا أو معرفًا فريدًا للنوع');return}
 if(d.products.some((x,j)=>j!==i&&String(x.sku||'').toLowerCase()===sku.toLowerCase())){alert('هذا الكود موجود بالفعل؛ اختر كودًا مختلفًا.');return}
 Object.assign(p,{name_en:$('#ceNameEn').value.trim(),name_ar:$('#ceNameAr').value.trim(),sku,category:$('#ceCategory').value,line:$('#ceLine').value,scentFamily:$('#ceFamily').value,chemicalProfileId:$('#ceFamily').value,productType:$('#ceType').value,scentNature:$('#ceNature').value.trim(),scentNotesProfile:$('#ceNotes').value.trim(),currency:'EGP',vat_rate:num($('#ceVatRate').value)??14});
 prices.forEach(([label,key])=>{p[key]=num($('#ce_'+key).value);p[key+'_vat']=p[key]==null?null:Math.round(p[key]*(1+(p.vat_rate/100))*100)/100});
 if(i<0){if(d.products.some(x=>String(x.name_en||'').toLowerCase()===p.name_en.toLowerCase())){alert('اسم المنتج موجود بالفعل؛ عدّل المنتج الحالي بدل التكرار.');return}d.products.push(p);selectedIndex=d.products.length-1}else d.products[i]=p;
 saveCatalog(d);refreshProducts();$('#ceProduct').value=String(selectedIndex);loadProduct(selectedIndex);alert('تم حفظ بيانات النوع والأسعار في هذا المتصفح. صدّر نسخة احتياطية لحفظها خارج الجهاز.');
 });
 $('#ceNewProduct').addEventListener('click',()=>{selectedIndex=-1;$('#ceProduct').value='';$('#ceNameEn').value='';$('#ceNameAr').value='';$('#ceSku').value='';$('#ceNature').value='';$('#ceNotes').value='';prices.forEach(([l,k])=>$('#ce_'+k).value='');$('#ceStatus').textContent='إضافة نوع جديد: املأ الحقول ثم اضغط حفظ.'});
 $('#ceDeleteProduct').addEventListener('click',()=>{const d=catalog();if(!d||selectedIndex<0||!d.products[selectedIndex]){alert('اختر منتجًا لحذفه');return}if(!confirm('حذف هذا النوع من الكتالوج المحلي؟'))return;d.products.splice(selectedIndex,1);saveCatalog(d);selectedIndex=-1;refreshProducts();alert('تم الحذف من النسخة المحلية.');});
 $('#ceListType').addEventListener('change',refreshListItems);$('#ceListItem').addEventListener('change',()=>loadListItem(Number($('#ceListItem').value)));
 $('#ceAddList').addEventListener('click',()=>{$('#ceListItem').value='';$('#ceListLabel').value='';$('#ceListEn').value='';$('#ceListNature').value='';$('#ceListNotes').value='';$('#ceListLabel').focus()});
 $('#ceSaveList').addEventListener('click',()=>{
 const c=config(),type=$('#ceListType').value,arr=c[type]||[],i=Number($('#ceListItem').value),label=$('#ceListLabel').value.trim(),en=$('#ceListEn').value.trim();
 if(!label){alert('اكتب اسم العنصر أولًا');return}
 const item=type==='families'?{id:label,labelEn:en||label,nature:$('#ceListNature').value.trim(),notes:$('#ceListNotes').value.trim()}:{id:en||label,labelAr:label,labelEn:en||label};
 if(type==='families'){item.labelAr=label}
 if($('#ceListItem').value!==''&&arr[i])arr[i]=item;else arr.push(item);
 c[type]=arr;saveConfig(c);
 const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}
 fillSelects();$('#ceListType').value=type;refreshListItems();alert('تم حفظ عنصر التصنيف محليًا. سيتم تحديث قوائم الكتالوج.');location.reload();
 });
 $('#ceDeleteList').addEventListener('click',()=>{
 const c=config(),type=$('#ceListType').value,arr=c[type]||[],i=Number($('#ceListItem').value);if(!arr[i]){alert('اختر عنصرًا للحذف');return}
 if(!confirm('حذف عنصر التصنيف المحدد؟'))return;arr.splice(i,1);c[type]=arr;saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}fillSelects();location.reload();
 });
 function download(name,data){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200)}
 const JSON_META_KEY='mamlaka_recent_json_file_v1';function recordJsonFile(name,action,details={}){const meta={name,action,at:new Date().toISOString(),...details};try{localStorage.setItem(JSON_META_KEY,JSON.stringify(meta))}catch{};const status=$('#ceJsonFileStatus');if(status)status.textContent='آخر ملف: '+name+' · '+(action==='import'?'استيراد':'تصدير')+' · '+new Date(meta.at).toLocaleString('ar-EG');document.dispatchEvent(new CustomEvent('mamlaka:json-file-updated',{detail:meta}));}function renderJsonFileStatus(){try{const m=JSON.parse(localStorage.getItem(JSON_META_KEY)||'null');const status=$('#ceJsonFileStatus');if(status&&m)status.textContent='آخر ملف: '+String(m.name||'ملف JSON')+' · '+(m.action==='import'?'استيراد':'تصدير')+' · '+new Date(m.at).toLocaleString('ar-EG')}catch{}}$('#ceExport').addEventListener('click',()=>{const d=catalog();if(!d){alert('استورد الكتالوج أولًا');return}d.taxonomyConfig=config();const name='mamlakat-al-otor-catalog-updated.json';download(name,d);recordJsonFile(name,'export',{products:d.products.length})});
 function renderPriceReport(){const c=config(),items=c.retailBlendPrices||[],box=$('#cePriceReport');if(box)box.innerHTML='<strong>تقرير أسعار الزيوت والتركيب:</strong> '+items.map(x=>esc(x.size)+': <b>'+Math.max(50,Number(x.price)||50)+' ج.م</b>').join(' · ')+'<br>عدد الأحجام: '+items.length+' — أقل سعر مسموح: 50 ج.م.';} $('#ceSaveGramPricing').addEventListener('click',()=>{const c=config();c.gramPricing={french:Math.max(1,num($('#ceGramFrench').value)||10),oriental:Math.max(1,num($('#ceGramOriental').value)||15),orientalPremium:Math.max(1,num($('#ceGramOrientalPremium').value)||20)};saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}fillSelects();alert('تم حفظ أسعار الجرام للفرنسي والشرقي والشرقي الممتاز.');}); $('#ceResetGramPricing').addEventListener('click',()=>{const c=config();c.gramPricing={french:10,oriental:15,orientalPremium:20};saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}fillSelects();});
 $('#ceSaveRetailPrices').addEventListener('click',()=>{const c=config(),inputs=[...document.querySelectorAll('[data-retail-index]')];c.retailBlendPrices=(c.retailBlendPrices||[]).map((x,i)=>{const raw=num(inputs[i]?.value);return {...x,price:Math.max(50,raw||50)}});saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}renderPriceReport();alert('تم حفظ أسعار الزيوت والتركيب. تم تطبيق الحد الأدنى 50 جنيهًا لكل حجم.');location.reload();}); $('#ceResetRetailPrices').addEventListener('click',()=>{if(!confirm('استعادة الأسعار المرجعية للأحجام السبعة؟'))return;const c=config();c.retailBlendPrices=defaultConfig.retailBlendPrices.map(x=>({...x}));saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}location.reload();});
 $('#ceExportTax').addEventListener('click',()=>{const name='mamlakat-al-otor-taxonomy-updated.json';download(name,{schemaVersion:1,language:'ar',...config(),importantNotice:'التصنيف وصفي وليس تحليلًا مخبريًا. لا تعتبر أمثلة المواد الكيميائية مكونات مؤكدة لأي منتج.'});recordJsonFile(name,'export',{type:'taxonomy'})});
 $('#ceImportBtn').addEventListener('click',()=>$('#ceImportFile').click());
 $('#ceImportFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.products)||!d.metadata)throw Error('ملف الكتالوج غير صحيح');if(!confirm('استبدال الكتالوج المحلي بـ '+d.products.length+' منتجًا؟'))return;localStorage.setItem(KEY,JSON.stringify(d));if(d.taxonomyConfig){saveConfig({...defaultConfig,...d.taxonomyConfig})}recordJsonFile(f.name,'import',{products:d.products.length});refreshProducts();document.dispatchEvent(new CustomEvent('mamlaka:supplier-catalog-updated'));alert('تم استيراد الكتالوج. يظهر أحدث ملف الآن في إعدادات المالك.')}catch(err){alert(err.message||'تعذر الاستيراد')}finally{e.target.value=''}});$('#ceDeleteImportedCatalog').addEventListener('click',()=>{const d=catalog();if(!d){alert('لا توجد نسخة كتالوج مستوردة لحذفها.');return}if(!confirm('حذف كتالوج JSON المستورد من بيانات هذا المتصفح؟ سيزيل أنواع الموردين المستوردة من الموقع على هذا الجهاز، ولن يحذف ملف الهاتف الأصلي أو ملف GitHub. صدّر نسخة احتياطية أولًا إن احتجت إليها.'))return;localStorage.removeItem(KEY);localStorage.removeItem('mamlaka_recent_json_file_v1');refreshProducts();renderJsonFileStatus();document.dispatchEvent(new CustomEvent('mamlaka:supplier-catalog-updated'));document.dispatchEvent(new CustomEvent('mamlaka:json-file-updated',{detail:null}));alert('تم حذف نسخة الكتالوج المستوردة من هذا المتصفح.');});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-tab="catalog-editor"]');if(!b)return;nav.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));content.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('hidden',x.dataset.page==='catalog-editor'?false:true));fillSelects();refreshProducts()});
 fillSelects();refreshProducts();renderPriceReport();renderJsonFileStatus();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
;