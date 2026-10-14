(() => {
  "use strict";
  const getWaNumber = () => (localStorage.getItem("mamlaka_admin_whatsapp_v1") || "201272776928").replace(/\D/g, "");
  const STORAGE = {cart:"mamlaka_cart_v1", fav:"mamlaka_favorites_v1", lang:"mamlaka_language_v1", custom:"mamlaka_custom_products_v1", requests:"mamlaka_requests_v1"};
  const sizes = {"3":50,"5":75,"10":100,"22":130,"30":150,"50":200,"100":450};
  const demoProducts = [
    {id:"demo-yara-candy",nameAr:"يارا كاندي",nameEn:"Yara Candy",brand:"غير محدد",productType:"ready",gender:"نسائي",family:"حلو",descriptionAr:"اسم مقترح في الكتالوج الأولي. التفاصيل والسعر يحتاجان إلى تأكيد المتجر.",price:null,available:true,needsReview:true},
    {id:"demo-one-man-show",nameAr:"ون مان شو",nameEn:"One Man Show",brand:"غير محدد",productType:"ready",gender:"رجالي",family:"خشبي",descriptionAr:"عطر مدرج كاسم للبحث؛ بيانات الشركة والنوتات غير مؤكدة.",price:null,available:true,needsReview:true},
    {id:"demo-midnight",nameAr:"ميدنايت",nameEn:"Midnight",brand:"غير محدد",productType:"ready",gender:"للجنسين",family:"شرقي",descriptionAr:"اسم يحتاج إلى تحديد الإصدار والشركة قبل اعتماد بياناته.",price:null,available:true,needsReview:true},
    {id:"demo-megamare",nameAr:"ميجاماري",nameEn:"Megamare",brand:"غير محدد",productType:"ready",gender:"للجنسين",family:"منعش",descriptionAr:"يرجى مراجعة الإصدار والمعلومات قبل اعتمادها.",price:null,available:true,needsReview:true},
    {id:"demo-moon-sparkle",nameAr:"مون سباركل",nameEn:"Moon Sparkle",brand:"غير محدد",productType:"ready",gender:"نسائي",family:"زهري",descriptionAr:"اسم ضمن القائمة الأولية، وتحتاج تفاصيله إلى مراجعة.",price:null,available:true,needsReview:true},
    {id:"demo-maddawi",nameAr:"مضاوي",nameEn:"Maddawi",brand:"غير محدد",productType:"ready",gender:"للجنسين",family:"شرقي",descriptionAr:"بيانات العطر التفصيلية غير مؤكدة بعد.",price:null,available:true,needsReview:true},
    {id:"demo-lacoste-white",nameAr:"لاكوست وايت",nameEn:"Lacoste White",brand:"Lacoste",productType:"ready",gender:"رجالي",family:"منعش",descriptionAr:"راجع الإصدار والتوفر والسعر لدى المتجر.",price:null,available:true,needsReview:true},
    {id:"demo-kayali-marshmallow",nameAr:"كيالي مارشميلو",nameEn:"Kayali Marshmallow",brand:"Kayali",productType:"ready",gender:"نسائي",family:"حلو",descriptionAr:"اسم يحتاج إلى مراجعة الإصدار وبيانات المنتج.",price:null,available:true,needsReview:true}
  ];
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const safeRead = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const readArray = key => { const value = safeRead(key, []); return Array.isArray(value) ? value : []; };
  let products = [...demoProducts, ...readArray(STORAGE.custom)];
  let cart = readArray(STORAGE.cart);
  let favorites = readArray(STORAGE.fav);
  let toastTimer;
  const formatMoney = n => n == null || !Number.isFinite(Number(n)) ? "السعر غير محدد" : `${Number(n).toLocaleString("ar-EG")} ج.م`;
  const priceFor = p => p.price != null ? Number(p.price) : (p.prices && p.prices["10"] != null ? Number(p.prices["10"]) : null);
  const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}]+/gu," ").trim();
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { notify("تعذر الحفظ في هذا المتصفح. صدّر نسخة احتياطية إن أمكن."); return false; } }
  function notify(msg) { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),3000); }
  function findProduct(id) { return products.find(p=>p.id===id); }
  function currentPrice(p,size) { if(p.prices && p.prices[String(size)] != null) return Number(p.prices[String(size)]); if(p.price != null) return Number(p.price); return sizes[String(size)] ?? null; }
  function imageMarkup(p) { if(p.image && /^(https?:|assets\/|data:image\/)/i.test(p.image)) return `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.nameAr||p.nameEn)}" loading="lazy" onerror="this.remove()">`; return `<div class="placeholder-bottle" role="img" aria-label="صورة افتراضية لعبوة عطر"></div>`; }
  function productCard(p) {
    const price=priceFor(p), fav=favorites.includes(p.id);
    return `<article class="product-card" data-id="${escapeHTML(p.id)}"><div class="product-visual">${imageMarkup(p)}<span class="product-badge">${p.needsReview?"يحتاج مراجعة":(p.productType==="oil"?"زيت عطري":"عطر جاهز")}</span><button class="favorite-btn ${fav?"is-fav":""}" data-action="favorite" data-id="${escapeHTML(p.id)}" aria-label="إضافة للمفضلة">${fav?"♥":"♡"}</button></div><div class="product-info"><h3>${escapeHTML(p.nameAr||p.nameEn||"منتج جديد")}</h3><div class="product-en" dir="ltr">${escapeHTML(p.nameEn||"")}</div><div class="product-meta">${escapeHTML(p.brand||"الشركة غير محددة")} · ${escapeHTML(p.gender||"")}</div><p class="product-desc">${escapeHTML(p.descriptionAr||"تفاصيل المنتج قيد الاستكمال.")}</p><div class="product-bottom"><span class="product-price">${formatMoney(price)}</span><span class="muted">${escapeHTML(p.family||"")}</span></div><div class="product-actions"><button class="small-btn" data-action="details" data-id="${escapeHTML(p.id)}">التفاصيل</button><button class="small-btn primary" data-action="add" data-id="${escapeHTML(p.id)}" ${price==null?"disabled title='السعر يحتاج إلى تأكيد'":""}>أضف للسلة</button></div></div></article>`;
  }
  function renderProducts() {
    const q=norm($("#productSearch").value), gender=$("#genderFilter").value, family=$("#familyFilter").value;
    const list=products.filter(p=>p.productType!=="oil" && p.productType!=="bakhoor" && (!gender||p.gender===gender) && (!family||p.family===family) && (!q||norm([p.nameAr,p.nameEn,p.brand,p.family,p.descriptionAr].join(" ")).includes(q)));
    $("#readyProducts").innerHTML=list.map(productCard).join("");
    $("#noProducts").classList.toggle("hidden",list.length>0);
    $("#resultsMessage").textContent=`${list.length} منتج في الكتالوج المعروض · الأسماء التي تحمل «يحتاج مراجعة» غير معتمدة للبيع حتى مراجعتها.`;
    updateCounts();
  }
  function updateCounts(){ $("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0); $("#favCount").textContent=favorites.length; }
  function toggleFavorite(id){ favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save(STORAGE.fav,favorites);renderProducts();notify(favorites.includes(id)?"أُضيف إلى المفضلة":"أُزيل من المفضلة"); }
  function addToCart(id,size="10",priceOverride=null,custom=null){
    const p=findProduct(id);
    if(!custom && (!p || !p.available || currentPrice(p,size)==null)){notify("السعر أو التوفر غير مؤكد. تواصل مع المتجر قبل الطلب.");return;}
    const price=priceOverride!=null?Number(priceOverride):currentPrice(p,size);
    if(!Number.isFinite(price)||price<0){notify("السعر غير صالح.");return;}
    const key=`${id}:${size}:${custom?.label||""}`;
    const old=cart.find(x=>x.key===key);
    if(old)old.qty+=1;else cart.push({key,id,size:String(size),qty:1,price,nameAr:custom?.nameAr||p?.nameAr||"تركيبة خاصة",nameEn:custom?.nameEn||p?.nameEn||"",custom:custom||null});
    save(STORAGE.cart,cart);updateCounts();notify("تمت الإضافة إلى السلة");if($("#cartDrawer").classList.contains("open"))renderCart();
  }
  function renderCart(){
    const el=$("#cartItems");
    if(!cart.length){el.innerHTML='<div class="empty-state">السلة فارغة حاليًا.</div>';$("#cartTotal").textContent=formatMoney(0);return;}
    el.innerHTML=cart.map(item=>`<div class="cart-line"><div><h4>${escapeHTML(item.nameAr)}</h4><small>${escapeHTML(item.nameEn||"")} · ${escapeHTML(item.size)} مل · ${formatMoney(item.price)} للقطعة</small><small>الكمية: ${item.qty} — الإجمالي: ${formatMoney(item.price*item.qty)}</small></div><div class="cart-line-actions"><button class="qty-btn" data-cart="minus" data-key="${escapeHTML(item.key)}" aria-label="تقليل الكمية">−</button><button class="qty-btn" data-cart="plus" data-key="${escapeHTML(item.key)}" aria-label="زيادة الكمية">+</button><button class="remove-btn" data-cart="remove" data-key="${escapeHTML(item.key)}">حذف</button></div></div>`).join("");
    $("#cartTotal").textContent=formatMoney(cart.reduce((n,x)=>n+x.price*x.qty,0));
  }
  function openDrawer(){ $("#drawerBackdrop").classList.remove("hidden");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("locked");renderCart(); }
  function closeDrawer(){ $("#drawerBackdrop").classList.add("hidden");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("locked"); }
  function openDetails(id){
    const p=findProduct(id);if(!p)return;
    const price=priceFor(p);
    $("#modalContent").innerHTML=`<div class="modal-product"><div class="modal-product-image">${imageMarkup(p)}</div><div><p class="eyebrow">MAMLKAT AL-OTOR</p><h2 id="modalTitle">${escapeHTML(p.nameAr||"منتج")}</h2><div class="product-en">${escapeHTML(p.nameEn||"")}</div><p>${escapeHTML(p.descriptionAr||"لا يوجد وصف موثق بعد.")}</p><p><b>الشركة:</b> ${escapeHTML(p.brand||"غير محددة")}</p><p><b>النوع:</b> ${escapeHTML(p.productType==="oil"?"زيت عطري":"عطر جاهز")} · <b>الجنس:</b> ${escapeHTML(p.gender||"غير محدد")}</p><p><b>العائلة:</b> ${escapeHTML(p.family||"غير محددة")}</p><p><b>النوتات:</b> ${escapeHTML([p.topNotes,p.heartNotes,p.baseNotes].filter(Boolean).join(" / ")||"غير متاحة حاليًا")}</p><div class="modal-price">${formatMoney(price)}</div>${p.needsReview?'<p class="muted">هذا الاسم يحتاج إلى مراجعة البيانات والسعر قبل اعتماد البيع.</p>':""}<label for="modalSize">الحجم</label><select id="modalSize">${Object.keys(sizes).map(s=>`<option value="${s}" ${s==="10"?"selected":""}>${s} مل — ${formatMoney(currentPrice(p,s))}</option>`).join("")}</select><div class="modal-actions"><button class="btn btn-gold" id="modalAdd" ${price==null?"disabled":""}>أضف للسلة</button><button class="btn btn-outline" id="speakDetails">استمع للوصف</button></div></div></div>`;
    $("#modalBackdrop").classList.remove("hidden");
    $("#modalAdd").addEventListener("click",()=>{const s=$("#modalSize").value;addToCart(id,s);});
    $("#modalSize").addEventListener("change",e=>{$(".modal-price").textContent=formatMoney(currentPrice(p,e.target.value));$("#modalAdd").disabled=currentPrice(p,e.target.value)==null;});
    $("#speakDetails").addEventListener("click",()=>{if(!("speechSynthesis" in window)){notify("الشرح الصوتي غير مدعوم في هذا المتصفح.");return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${p.nameAr||""}. ${p.descriptionAr||""}`);u.lang="ar-EG";speechSynthesis.speak(u);});
  }
  function closeModal(){ $("#modalBackdrop").classList.add("hidden");if("speechSynthesis" in window)speechSynthesis.cancel(); }
  function checkout(){
    if(!cart.length){notify("أضف منتجًا إلى السلة أولًا.");return;}
    const lines=cart.map((x,i)=>`${i+1}) ${x.nameAr}${x.nameEn?" ("+x.nameEn+")":""} - ${x.size} مل × ${x.qty} = ${formatMoney(x.price*x.qty)}`);
    const total=cart.reduce((n,x)=>n+x.price*x.qty,0);
    const msg=`مرحبًا، أريد مراجعة طلب من مملكة العطور:\n${lines.join("\n")}\nالإجمالي المرجعي: ${formatMoney(total)}\nيرجى تأكيد التوفر والسعر النهائي.`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
  }
  function blendPrice(){const s=$("#blendSize").value;$("#blendPrice").textContent=formatMoney(sizes[s]);}
  function submitAdvisor(query){
    const q=norm(query);if(!q)return;
    const terms=[["خشبي",["خشبي","عود","خشب"]],["زهري",["زهري","ورد","زهور","فل"]],["شرقي",["شرقي","عنبر","بهارات"]],["حلو",["حلو","فانيلا","سكر","كراميل"]],["منعش",["منعش","صيف","حمضي","ليمون"]],["مسكي",["مسكي","مسك","نظيف"]]];
    const matched=terms.find(([family,words])=>words.some(w=>q.includes(norm(w))));
    let list=products.filter(p=>p.productType!=="oil"&&(!matched||p.family===matched[0]));
    const gender=q.includes("رجالي")?"رجالي":q.includes("نسائي")?"نسائي":null;
    if(gender)list=list.filter(p=>p.gender===gender||p.gender==="للجنسين");
    const replies=$("#advisorReplies");
    if(!list.length){replies.innerHTML='<div class="assistant-message">لم أجد تطابقًا مناسبًا في الكتالوج الحالي. جرّب عائلة أخرى أو تواصل مع المتجر.</div>';return;}
    replies.innerHTML=`<div class="assistant-message">بناءً على الكلمات التي أدخلتها، هذه أسماء قريبة من تفضيلك في الكتالوج. بعض البيانات والأسعار ما زالت تحتاج إلى مراجعة:</div>`+list.slice(0,3).map(p=>`<div class="suggestion"><div><h4>${escapeHTML(p.nameAr)} <span class="product-en">${escapeHTML(p.nameEn||"")}</span></h4><p>${escapeHTML(p.family||"عائلة غير محددة")} · ${formatMoney(priceFor(p))}</p></div><button class="small-btn" data-action="details" data-id="${escapeHTML(p.id)}">التفاصيل</button></div>`).join("");
  }
  function requestMissing(name){
    const req=safeRead(STORAGE.requests,[]);req.push({name,createdAt:new Date().toISOString()});save(STORAGE.requests,req);
    const msg=`مرحبًا، أريد الاستفسار عن عطر غير موجود في الكتالوج: ${name}`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
  }
  const translations = {
    ar:{ready:"العطور الجاهزة",oils:"الزيوت والتركيب",bakhoor:"العود والبخور",gift:"الهدايا",advisor:"مستشار العطور",visit:"تواصل معنا",home:"الرئيسية"},
    en:{ready:"Ready Perfumes",oils:"Oils & Blending",bakhoor:"Oud & Bakhoor",gift:"Gifts",advisor:"Scent Advisor",visit:"Contact",home:"Home"}
  };
  function setLanguage(lang){
    language=lang;save(STORAGE.lang,lang);document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.body.classList.toggle("en",lang==="en");$("#languageToggle").textContent=lang==="ar"?"EN":"عربي";
    $$(".main-nav a").forEach(a=>{const k=a.dataset.nav;if(translations[lang][k])a.textContent=translations[lang][k];});
    notify(lang==="en"?"Navigation labels switched. Some product content remains in Arabic.":"تم تغيير لغة القوائم. بعض محتوى المنتجات ما زال بالعربية.");
  }
  document.addEventListener("click",e=>{
    const action=e.target.closest("[data-action]");if(action){const {action:act,id}=action.dataset;if(act==="favorite")toggleFavorite(id);if(act==="add")addToCart(id);if(act==="details")openDetails(id);}
    const ca=e.target.closest("[data-cart]");if(ca){const item=cart.find(x=>x.key===ca.dataset.key);if(!item)return;if(ca.dataset.cart==="plus")item.qty++;if(ca.dataset.cart==="minus")item.qty--;if(ca.dataset.cart==="remove"||item.qty<=0)cart=cart.filter(x=>x.key!==item.key);save(STORAGE.cart,cart);renderCart();updateCounts();}
  });
  $("#productSearch").addEventListener("input",renderProducts);$("#genderFilter").addEventListener("change",renderProducts);$("#familyFilter").addEventListener("change",renderProducts);
  $("#searchFocus").addEventListener("click",()=>{$("#productSearch").focus();document.querySelector("#ready").scrollIntoView({behavior:"smooth"});});
  $("#favoritesShortcut").addEventListener("click",()=>{const fav=products.filter(p=>favorites.includes(p.id));if(!fav.length){notify("قائمة المفضلة فارغة.");return;}$("#productSearch").value="";$("#genderFilter").value="";$("#familyFilter").value="";$("#readyProducts").innerHTML=fav.map(productCard).join("");$("#resultsMessage").textContent=`${fav.length} منتج في المفضلة`;$("#noProducts").classList.add("hidden");document.querySelector("#ready").scrollIntoView({behavior:"smooth"});});
  $("#cartShortcut").addEventListener("click",openDrawer);$("#closeDrawer").addEventListener("click",closeDrawer);$("#drawerBackdrop").addEventListener("click",closeDrawer);
  $("#closeModal").addEventListener("click",closeModal);$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
  $("#checkoutBtn").addEventListener("click",checkout);$("#clearCart").addEventListener("click",()=>{cart=[];save(STORAGE.cart,cart);renderCart();updateCounts();notify("تم إفراغ السلة.");});
  $("#blendSize").addEventListener("change",blendPrice);$("#addBlend").addEventListener("click",()=>{const size=$("#blendSize").value, family=$("#blendScent").value,bottle=$("#blendBottle").value;const label=`تركيبة-${family}-${size}-${bottle}`;addToCart("custom-"+Date.now(),size,sizes[size],{nameAr:`تركيبة عطر ${family}`,nameEn:"Custom Blend",label,description:`${family}، ${size} مل، ${bottle}`});const last=cart[cart.length-1];if(last&&last.custom)last.nameAr=`تركيبة ${family} (${bottle})`;save(STORAGE.cart,cart);updateCounts();});
  $("#advisorForm").addEventListener("submit",e=>{e.preventDefault();submitAdvisor($("#advisorInput").value);});
  $("#contactWhatsapp").href=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات مملكة العطور.")}`;
  $("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
  $$("#mainNav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}));
  $("#languageToggle").addEventListener("click",()=>setLanguage(language==="ar"?"en":"ar"));
  $("#voiceSearch").addEventListener("click",()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){notify("البحث الصوتي غير مدعوم هنا. استخدم مربع البحث الكتابي.");return;}
    const rec=new SpeechRecognition();rec.lang=language==="ar"?"ar-EG":"en-US";rec.interimResults=false;rec.maxAlternatives=1;
    $("#voiceSearch").textContent="…";rec.onresult=e=>{$("#productSearch").value=e.results[0][0].transcript;renderProducts();};rec.onerror=()=>notify("تعذر بدء البحث الصوتي. تحقق من إذن الميكروفون.");rec.onend=()=>$("#voiceSearch").textContent="🎙";try{rec.start();}catch{notify("تعذر بدء البحث الصوتي.");$("#voiceSearch").textContent="🎙";}
  });
  $("#enterBtn").addEventListener("click",()=>{save("mamlaka_intro_seen_v1",true);$("#intro").classList.add("dismissed");});
  $("#skipIntro").addEventListener("click",()=>{$("#intro").classList.add("dismissed");save("mamlaka_intro_seen_v1",true);});
  // Always show the royal entrance on a fresh page load; the visitor can enter or skip explicitly.
  // This avoids silently bypassing the entrance because an old localStorage flag remained set.
  $("#year").textContent=new Date().getFullYear();
  document.addEventListener("mamlaka:products-updated",()=>{products=[...demoProducts,...safeRead(STORAGE.custom,[])];renderProducts();renderCart();updateCounts();});
  setLanguage(language);renderProducts();renderCart();updateCounts();blendPrice();
  // If search misses, offer a direct request without pretending the catalog contains the item.
  $("#productSearch").addEventListener("keydown",e=>{if(e.key==="Enter" && !products.some(p=>norm([p.nameAr,p.nameEn,p.brand].join(" ")).includes(norm(e.target.value)))){if(e.target.value.trim() && confirm(`لم نعثر على «${e.target.value.trim()}». هل تريد الاستفسار عنه عبر واتساب؟`))requestMissing(e.target.value.trim());}});
})();