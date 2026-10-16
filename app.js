(() => {
  "use strict";
  const getWaNumber = () => (localStorage.getItem("mamlaka_admin_whatsapp_v1") || "201272776928").replace(/\D/g, "");
  const STORAGE = {cart:"mamlaka_cart_v1", fav:"mamlaka_favorites_v1", lang:"mamlaka_language_v1", custom:"mamlaka_custom_products_v1", requests:"mamlaka_requests_v1"};
  const sizes = (() => {
    const fallback = {"3":50,"5":75,"10":100,"22":130,"30":150,"50":200,"100":450};
    try {
      const cfg = JSON.parse(localStorage.getItem("mamlaka_catalog_taxonomy_config_v1") || "null");
      if (Array.isArray(cfg?.retailBlendPrices) && cfg.retailBlendPrices.length) {
        const editable = {};
        cfg.retailBlendPrices.forEach(item => {
          const size = String(item.size || "").match(/[0-9]+/)?.[0];
          if (size && Number.isFinite(Number(item.price)) && Number(item.price) >= 50) editable[size] = Number(item.price);
        });
        if (editable["30"] === 100 && editable["50"] === 150 && editable["100"] === 300) {
          editable["30"] = 150; editable["50"] = 200; editable["100"] = 450;
        }
        if (editable["22"] == null) editable["22"] = 130;
        const normalized = Object.fromEntries(Object.entries(fallback).map(([size, price]) => [size, editable[size] ?? price]));
        try { localStorage.setItem("mamlaka_catalog_taxonomy_config_v1", JSON.stringify({...cfg, retailBlendPrices:Object.entries(normalized).map(([size,price])=>({size:size+" مل",price}))})); } catch {}
        return normalized;
      }
    } catch {}
    return fallback;
  })();
  const demoProducts = [
    {id:"demo-yara-candy",nameAr:"يارا كاندي",nameEn:"Yara Candy",brand:"Lattafa",productType:"ready",gender:"نسائي",family:"فاكهي حلو / غورماند",scentNature:"حلو وفاكهي بطابع حلوى الفراولة، مع لمسة حمضية وزهرية وقاعدة كريمية دافئة.",topNotes:["اليوسفي الأخضر","الكشمش الأسود"],heartNotes:["حلوى الفراولة الفوارة","الغاردينيا"],baseNotes:["خشب الصندل","شراب الفانيليا","المسك","العنبر"],descriptionAr:"يفتتح بانتعاش اليوسفي الأخضر والكشمش الأسود، ثم تظهر حلاوة حلوى الفراولة مع الغاردينيا، وتستقر الرائحة على الفانيليا وخشب الصندل والمسك والعنبر.",sourceUrl:"https://lattafa.com/product/yara-candy/",notesStatus:"verified-brand-source",notesConfidence:"مرتفع — مصدر الشركة",price:null,available:true,needsReview:true},
    {id:"demo-one-man-show",nameAr:"ون مان شو",nameEn:"One Man Show",brand:"Jacques Bogart",productType:"ready",gender:"رجالي",family:"شيبر خشبي عطري",scentNature:"كلاسيكي أخضر وعطري وتوابلي، يتطور إلى أخشاب وجلد وطحلب ودفء عنبري.",topNotes:["الريحان","البرغموت","الأرتميسيا","الكراوية","الغالبانوم","خشب الورد البرازيلي"],heartNotes:["إبر الصنوبر","القرنفل","الباتشولي","جوزة الطيب","التوابل","الفيتيفر","إبرة الراعي","اللادن","الورد","الياسمين"],baseNotes:["طحلب السنديان","الجلد","خشب الأرز","الستيراکس","خشب الصندل","الكاستوريوم","العنبر","حبوب التونكا","جوز الهند","الفانيليا"],descriptionAr:"عطر رجالي كلاسيكي بطابع شيبر أخضر وتوابلي؛ يبدأ بالأعشاب والحمضيات، ثم قلب غني بالتوابل والأزهار والأخشاب، وقاعدة جلدية خشبية وعنبرية.",sourceUrl:"https://www.fragrantica.com/perfume/Jacques-Bogart/One-Man-Show-7795.html",notesStatus:"verified-fragrance-directory",notesConfidence:"جيد — دليل عطري متخصص؛ يفضّل مطابقة الإصدار والعبوة",price:null,available:true,needsReview:true},
    {id:"demo-midnight",nameAr:"ميدنايت",nameEn:"Midnight",brand:"غير محدد",productType:"ready",gender:"غير محدد",family:"غير محدد",descriptionAr:"اسم عام يطابق عطورًا متعددة. لم تُضف نوتات حتى يتم تحديد الشركة والإصدار لتجنب معلومات خاطئة.",topNotes:[],heartNotes:[],baseNotes:[],notesStatus:"needs-identification",notesConfidence:"غير متاح — يلزم اسم الشركة أو صورة العبوة",price:null,available:true,needsReview:true},
    {id:"demo-megamare",nameAr:"ميجاماري",nameEn:"Megamare",brand:"Orto Parisi",productType:"ready",gender:"للجنسين",family:"مائي بحري / خشبي",scentNature:"بحري كثيف ومالح ومعدني؛ ليس مجرد انتعاش مائي خفيف، مع قاعدة مسكية خشبية قوية.",topNotes:["البرغموت","الليمون"],heartNotes:["الأعشاب البحرية","كالون (أكورد مائي)","هيديون"],baseNotes:["المسك","أمبروكسان","خشب الأرز"],descriptionAr:"يفتتح بالبرغموت والليمون، ثم ينتقل إلى أكورد بحري مالح مع الأعشاب البحرية، ويستقر على الأمبروكسان والمسك وخشب الأرز. النوتات المعلنة لا تعني كشف الصيغة الكيميائية الكاملة.",sourceUrl:"https://ortoparisi.com/products/megamare",notesStatus:"cross-checked-fragrance-sources",notesConfidence:"جيد — تفاصيل النوتات منشورة في أدلة عطرية متخصصة؛ صفحة الشركة تؤكد المنتج والإصدار",price:null,available:true,needsReview:true},
    {id:"demo-moon-sparkle",nameAr:"مون سباركل",nameEn:"Moon Sparkle",brand:"Escada",productType:"ready",gender:"نسائي",family:"فاكهي زهري",scentNature:"فاكهي مرح يبدأ بالفراولة والكشمش والحمضيات، ثم زهور ناعمة وقاعدة فاكهية مسكية خشبية.",topNotes:["الفراولة","الكشمش الأسود","نوتات حمضية","فواكه حمراء"],heartNotes:["البازلاء العطرية","الفريزيا","الياسمين","الورد"],baseNotes:["التوت","المسك","خشب الصندل","العنبر"],descriptionAr:"تركيبة فاكهية زهرية؛ تتقدم الفواكه الحمراء والحمضيات في الافتتاحية، ثم زهور ناعمة، مع قاعدة من التوت والمسك والصندل والعنبر. قد يكون هذا الإصدار محدودًا أو متوقفًا.",sourceUrl:"https://basenotes.com/fragrances/escada-moon-sparkle-by-escada.26128653",notesStatus:"verified-fragrance-directory",notesConfidence:"جيد — قاعدة عطرية متخصصة؛ المنتج مدرج كإصدار 2007 محدود/متوقف",price:null,available:true,needsReview:true},
    {id:"demo-maddawi",nameAr:"مضاوي",nameEn:"Madawi",brand:"Arabian Oud",productType:"ready",gender:"نسائي",family:"فاكهي زهري خشبي",scentNature:"فاكهي استوائي وزهري أبيض، مع قاعدة ترابية مسكية دافئة.",topNotes:["الأناناس"],heartNotes:["زهر البرتقال"],baseNotes:["الباتشولي","المسك"],descriptionAr:"وفق صفحة الشركة: أناناس في الافتتاحية، وزهر البرتقال في القلب، وباتشولي ومسك في القاعدة. لا تُضاف نوتات أخرى إلا إذا أكدها مصدر الإصدار نفسه.",sourceUrl:"https://eg.arabianoud.com/en/p204046007-madawi-90-ml",notesStatus:"verified-brand-source",notesConfidence:"مرتفع — صفحة Arabian Oud الرسمية",price:null,available:true,needsReview:true},
    {id:"demo-lacoste-white",nameAr:"لاكوست وايت",nameEn:"Lacoste White",brand:"Lacoste",productType:"ready",gender:"رجالي",family:"غير محدد حتى تأكيد الإصدار",descriptionAr:"اسم تجاري مختصر قد يشير إلى L.12.12 Blanc EDT أو EDP أو Eau Fraîche، ولكل إصدار نوتات مختلفة. اختر الإصدار المطابق للعبوة قبل اعتماد النوتات.",topNotes:[],heartNotes:[],baseNotes:[],sourceUrl:"https://www.lacoste.com.eg/en/fragrance/mens-l.12.12-blanc-eau-de-parfum-100ml/99350066867.html",notesStatus:"needs-variant-confirmation",notesConfidence:"غير محسوم — توجد إصدارات متعددة بنوتات مختلفة",price:null,available:true,needsReview:true},
    {id:"demo-kayali-marshmallow",nameAr:"كيالي يوم بوجي مارشميلو 81",nameEn:"Yum Boujee Marshmallow | 81",brand:"KAYALI",productType:"ready",gender:"نسائي",family:"غورماند زهري فاكهي",scentNature:"حلو وغني بطابع مارشميلو وردي وفراولة وجوز هند، مع قاعدة فانيليا مخفوقة وسكر التوت ومسك وردي.",topNotes:["تفاح بينك ليدي","زهر النكتارين","الفريزيا","الليمون الإيطالي"],heartNotes:["مارشميلو وردي","الفراولة","رقائق جوز الهند","زهر البرتقال"],baseNotes:["فانيليا مخفوقة","سكر التوت","المسك الوردي","أمبروكس","أكورد KAYALI المميز"],descriptionAr:"تمت مطابقة الاسم مع Yum Boujee Marshmallow | 81 على موقع KAYALI الرسمي. افتتاحية فاكهية زهرية، قلب مارشميلو وفراولة وجوز هند، وقاعدة فانيليا وسكر التوت ومسك وردي.",sourceUrl:"https://kayali.com/products/yum-boujee-marshmallow-81",notesStatus:"verified-brand-source",notesConfidence:"مرتفع — مصدر الشركة الرسمي؛ تأكد من أن العبوة هي إصدار 81",price:null,available:true,needsReview:true},
    {id:"researched-silver-scent-midnight",nameAr:"سيلفر سنت ميدنايت",nameEn:"Silver Scent Midnight",brand:"Jacques Bogart",productType:"ready",gender:"رجالي",family:"فوجير عطري خشبي",scentNature:"حمضي عشبي مع هيل وتوابل وزهر البرتقال، ثم قاعدة خشبية حلوة من التونكا والأرز والغاياك.",topNotes:["الجريب فروت","المريمية","الهيل"],heartNotes:["الشيح (أرتميسيا)","جوزة الطيب","زهر البرتقال"],baseNotes:["حبوب التونكا","خشب الغاياك","خشب الأرز"],descriptionAr:"هذه بيانات Silver Scent Midnight تحديدًا، وليست لأي عطر آخر يحمل اسم Midnight فقط. يلزم مطابقة اسم الشركة والعبوة قبل اعتماد المنتج في المخزون.",sourceUrl:"https://www.fragrantica.com/perfume/Jacques-Bogart/Silver-Scent-Midnight-46938.html",notesStatus:"verified-fragrance-directory",notesConfidence:"جيد — دليل عطري متخصص؛ لا تخلطه مع أسماء Midnight الأخرى",price:null,available:true,needsReview:true}
  ];
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const safeRead = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const readArray = key => { const value = safeRead(key, []); return Array.isArray(value) ? value : []; };
  // Normalize persisted cart data before it reaches totals or HTML.
  const normalizeCart = value => (Array.isArray(value) ? value : []).filter(item =>
    item && typeof item === "object" && typeof item.key === "string" &&
    Number.isFinite(Number(item.price)) && Number(item.price) >= 0 &&
    Number.isFinite(Number(item.qty)) && Number(item.qty) >= 1
  ).map(item => ({
    key: String(item.key).slice(0, 300),
    id: String(item.id ?? "").slice(0, 200),
    size: String(item.size ?? "10").slice(0, 20),
    qty: Math.min(99, Math.max(1, Math.floor(Number(item.qty)))),
    price: Number(item.price),
    nameAr: String(item.nameAr ?? "منتج").slice(0, 250),
    nameEn: String(item.nameEn ?? "").slice(0, 250),
    custom: item.custom && typeof item.custom === "object" ? {
      label: String(item.custom.label ?? "").slice(0, 100),
      description: String(item.custom.description ?? "").slice(0, 500)
    } : null
  }));
  function displayFamily(raw, name) {
    const v=String(raw||"").toLowerCase();
    if(/citrus|fresh|حمض|منعش/.test(v))return "حمضي ومنعش";
    if(/floral|rose|زهري|ورد/.test(v))return "زهري ووردي";
    if(/musk|clean|مسك|نظيف/.test(v))return "مسكي ونظيف";
    if(/sweet|vanilla|gourmand|حلو|فانيليا/.test(v))return "حلو وفانيليا";
    if(/amber|oriental|عنبر|شرقي/.test(v))return "عنبر وشرقي";
    if(/oud|woody|wood|خشب|عود/.test(v))return "عود وخشبي";
    if(/leather|tobacco|جلد|تبغ/.test(v))return "جلدي وتبغي";
    if(/aromatic|green|عطري|أخضر/.test(v))return "عطري وأخضر";
    if(/fruity|fruit|فاكهي/.test(v))return "فاكهي";
    if(/marine|aquatic|sea|بحري/.test(v))return "بحري";
    if(/powder|بودري/.test(v))return "بودري";
    const n=String(name||"").toLowerCase();
    if(/lemon|bergamot|citrus|lime|grapefruit|ليمون|برغموت/.test(n))return "حمضي ومنعش";
    if(/rose|jasmine|lily|floral|peony|tuberose|ورد|ياسمين/.test(n))return "زهري ووردي";
    if(/musk|musc|white musk|مسك/.test(n))return "مسكي ونظيف";
    if(/vanilla|candy|sugar|caramel|marshmallow|فانيليا|حلوى/.test(n))return "حلو وفانيليا";
    if(/amber|oud|agarwood|incense|bakhoor|عود|عنبر|بخور/.test(n))return /oud|agarwood|عود/.test(n)?"عود وخشبي":"عنبر وشرقي";
    if(/wood|sandal|cedar|vetiver|patchouli|خشب|صندل/.test(n))return "خشبي";
    if(/aqua|marine|ocean|sea|megamare|بحري/.test(n))return "بحري";
    if(/leather|tobacco|جلدي|تبغ/.test(n))return "جلدي وتبغي";
    if(/fruit|berry|apple|pear|peach|فاكهة|تفاح/.test(n))return "فاكهي";
    return "غير محدد — يحتاج تقييم";
  }
  function inferredNature(family,name){
    const f=displayFamily(family,name);
    return ({"حمضي ومنعش":"حمضي، منعش وحيوي","زهري ووردي":"زهري وناعم أو وردي","مسكي ونظيف":"مسكي ونظيف وقريب من رائحة الجلد","حلو وفانيليا":"حلو ودافئ مع طابع سكري","عنبر وشرقي":"دافئ، شرقي أو متبل","عود وخشبي":"خشبي وراتنجي","خشبي":"خشبي وأنيق","جلدي وتبغي":"جلدي ومدخن","عطري وأخضر":"أخضر وعشبي","فاكهي":"فاكهي ومشرق","بحري":"مائي وبحري","بودري":"ناعم وبودري"})[f]||"الطابع يحتاج إلى مراجعة العينة";
  }
  const supplierProducts = () => {
    const catalog = safeRead("mamlaka_supplier_catalog_v1", null);
    if (!Array.isArray(catalog?.products)) return [];
    return catalog.products.map(p => ({
      id: "supplier-" + String(p.sku || p.supplierSku || p.name_en || Math.random()).replace(/[^a-zA-Z0-9_-]/g,"-"),
      supplierSku: p.sku || p.supplierSku || "",
      supplierCategory: p.category || "",
      nameAr: p.name_ar || p.name_en || "اسم يحتاج مراجعة",
      nameEn: p.name_en || "",
      brand: (p.supplierName || "AQUA D’OR Parfums") + " · " + (p.line || p.supplierLine || ""),
      productType: "oil",
      gender: p.genderLabel || ({MEN:"رجالي",WOMEN:"نسائي",UNISEX:"للجنسين",ORIENTAL:"شرقي",KIDS:"أطفال",DIFFUSER:"فواحات"}[p.category] || "غير محدد"),
      family: displayFamily(p.scentFamily || p.family || p.chemicalProfileId || "", p.name_ar || p.name_en || ""),
      scentNature: p.scentNature || inferredNature(p.scentFamily || p.family || "", p.name_ar || p.name_en || ""),
      topNotes: Array.isArray(p.topNotes) ? p.topNotes : (Array.isArray(p.notes_top) ? p.notes_top : []),
      heartNotes: Array.isArray(p.heartNotes) ? p.heartNotes : (Array.isArray(p.notes_heart) ? p.notes_heart : []),
      baseNotes: Array.isArray(p.baseNotes) ? p.baseNotes : (Array.isArray(p.notes_base) ? p.notes_base : []),
      sourceUrl: /^https:\/\//i.test(String(p.sourceUrl || p.source_url || "")) ? (p.sourceUrl || p.source_url) : "",
      notesStatus: p.notesStatus || p.notes_status || "needs-research",
      notesConfidence: p.notesConfidence || p.notes_confidence || "",
      descriptionAr: "زيت عطري مركز مناسب للتجربة والتركيب. " + (p.scentNature || inferredNature(p.scentFamily || p.family || "", p.name_ar || p.name_en || "") || "الطابع العطري يحتاج إلى مراجعة عينة المورد."),
      price: null, prices: {}, available: false, needsReview: true, supplierCatalogItem: true
    }));
  };
  let publicCatalogProducts = [];
  let language = safeRead(STORAGE.lang, "ar") === "en" ? "en" : "ar";
  const combineProducts = () => {
    const merged = new Map();
    [...demoProducts, ...publicCatalogProducts, ...readArray(STORAGE.custom), ...supplierProducts()].forEach(product => {
      const id = String(product?.id || "").trim();
      if (!id) return;
      merged.set(id, { ...(merged.get(id) || {}), ...product });
    });
    return [...merged.values()];
  };
  let products = combineProducts();
  async function loadPublicCatalog() {
    if (typeof fetch !== "function") return;
    try {
      const response = await fetch("data/products.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      const records = Array.isArray(payload) ? payload : payload?.products;
      if (!Array.isArray(records)) throw new Error("ملف الكتالوج لا يحتوي قائمة منتجات");
      publicCatalogProducts = records.filter(p => p && typeof p === "object").map((p, index) => ({
        ...p,
        id: String(p.id || p.sku || ("catalog-product-" + index)),
        nameAr: p.nameAr || p.name_ar || p.arName || p.name || "",
        nameEn: p.nameEn || p.name_en || p.enName || "",
        brand: p.brand || p.company || p.manufacturer || "",
        supplier: p.supplier || p.supplierName || "",
        productType: p.productType || p.product_type || "ready",
        gender: p.gender || p.categoryLabel || "",
        family: p.family || p.scentFamily || p.scent_family || "",
        topNotes: Array.isArray(p.topNotes) ? p.topNotes : Array.isArray(p.notes_top) ? p.notes_top : [],
        heartNotes: Array.isArray(p.heartNotes) ? p.heartNotes : Array.isArray(p.notes_heart) ? p.notes_heart : [],
        baseNotes: Array.isArray(p.baseNotes) ? p.baseNotes : Array.isArray(p.notes_base) ? p.notes_base : [],
        sourceUrl: p.sourceUrl || p.source_url || "",
        notesStatus: p.notesStatus || p.notes_status || "needs-review",
        notesConfidence: p.notesConfidence || p.notes_confidence || "",
        needsReview: p.needsReview !== false,
        price: p.price ?? null,
        prices: p.prices && typeof p.prices === "object" ? p.prices : {},
        available: p.available === true && (p.needsReview === false),
        publicCatalogItem: true
      }));
      products = combineProducts();
      renderProducts();
      renderSupplierOils();
      renderCart();
      updateCounts();
      populateBlendOils();
      document.dispatchEvent(new CustomEvent("mamlaka:public-catalog-loaded", { detail: { count: publicCatalogProducts.length } }));
    } catch (error) {
      console.warn("تعذر تحميل كتالوج data/products.json؛ يستمر المتجر بالكتالوج المحلي.", error);
    }
  }
  let cart = normalizeCart(readArray(STORAGE.cart));
  let favorites = readArray(STORAGE.fav);
  let toastTimer;
  const formatMoney = n => n == null || !Number.isFinite(Number(n)) ? "تواصل لتأكيد السعر" : `${Number(n).toLocaleString("ar-EG")} ج.م`;
  const priceFor = p => { const n=p?.price != null ? Number(p.price) : (p?.prices && p.prices["10"] != null ? Number(p.prices["10"]) : null); return Number.isFinite(n) && n>0 ? Math.max(50,n) : null; };
  const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}]+/gu," ").trim();
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { notify("تعذر الحفظ في هذا المتصفح. صدّر نسخة احتياطية إن أمكن."); return false; } }
  function notify(msg) { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),3000); }
  function findProduct(id) { return products.find(p=>p.id===id); }
  function retailSizePrice(size){const key=String(size);try{const cfg=JSON.parse(localStorage.getItem("mamlaka_catalog_taxonomy_config_v1")||"null");const item=Array.isArray(cfg?.retailBlendPrices)?cfg.retailBlendPrices.find(x=>String(x.size||"").match(/[0-9]+/)?.[0]===key):null;if(item&&Number.isFinite(Number(item.price))&&Number(item.price)>=50)return Number(item.price);}catch{}return sizes[key]??null;}
  function currentPrice(p,size) { if(!p || p.supplierCatalogItem || p.supplierSku) return null; if(p.productType === "blend" || p.productType === "oil" || p.customBlend === true) return retailSizePrice(size); const specific=p.prices && p.prices[String(size)] != null ? Number(p.prices[String(size)]) : null; if(Number.isFinite(specific) && specific>0) return Math.max(50,specific); const base=p.price != null ? Number(p.price) : null; if(Number.isFinite(base) && base>0) return Math.max(50,base); return null; }
  function imageMarkup(p){
    if(p.image&&/^(https?:|assets\/|data:image\/)/i.test(p.image))return '<img class="product-photo" src="'+escapeHTML(p.image)+'" alt="صورة '+escapeHTML(p.nameAr||p.nameEn||"العطر")+'" loading="lazy" onerror="this.remove()">';
    const family=displayFamily(p.family||"",p.nameAr||p.nameEn||"");
    const key=String((p.nameEn||"")+" "+(p.nameAr||"")+" "+(p.family||"")).toLowerCase();
    const palettes={"حمضي ومنعش":["#d8b85d","#fff1b5"],"زهري ووردي":["#b96d8c","#f7ccdc"],"مسكي ونظيف":["#a9c9c0","#edf7f1"],"حلو وفانيليا":["#c79a68","#f8e3bd"],"عنبر وشرقي":["#a86e3e","#f0c078"],"عود وخشبي":["#75513e","#d5a878"],"خشبي":["#607b68","#c9ddc2"],"بحري":["#4f8ca7","#c5e9f4"],"فاكهي":["#bd7953","#ffd1ac"]};
    const colors=palettes[family]||["#a88a67","#f3dfb4"];
    let shape="classic";
    if(/oil|زيت|تركيب|blend|مسك رول|دهن/.test(key)||p.productType==="oil"||p.productType==="blend")shape="oil";
    else if(/oud|عود|oriental|شرقي|amber|عنبر|bakhoor|بخور/.test(key))shape="oriental";
    else if(/femme|women|نسائي|rose|ورد|floral|زهري|princess|candy|يارا|yara/.test(key))shape="elegant";
    else if(/sport|aqua|marine|blue|بحري|fresh|منعش/.test(key))shape="sport";
    else if(/intense|noir|black|dark|أسود|ليذر|leather|midnight|ميدنايت/.test(key))shape="square";
    else if(/unisex|للجنسين|minimal|clean|مسك/.test(key))shape="modern";
    const uid=("b"+String(p.id||p.nameEn||p.nameAr||"perfume").replace(/[^a-z0-9]/gi,"").slice(0,24));
    const cap=shape==="oil"?'<rect x="79" y="27" width="22" height="12" rx="3" fill="url(#'+uid+'cap)"/><rect x="82" y="38" width="16" height="9" rx="2" fill="#b98c3b"/>':shape==="oriental"?'<path d="M72 17h36l-3 23H75Z" fill="url(#'+uid+'cap)"/><rect x="77" y="39" width="26" height="12" rx="2" fill="#b98c3b"/>':shape==="elegant"?'<path d="M81 15h18v10l5 5v14H76V30l5-5Z" fill="url(#'+uid+'cap)"/>':shape==="sport"?'<rect x="74" y="18" width="32" height="23" rx="5" fill="url(#'+uid+'cap)"/><rect x="82" y="39" width="16" height="10" rx="2" fill="#b98c3b"/>':shape==="square"?'<rect x="73" y="18" width="34" height="24" rx="2" fill="url(#'+uid+'cap)"/><rect x="80" y="40" width="20" height="10" rx="2" fill="#b98c3b"/>':'<rect x="77" y="19" width="26" height="24" rx="4" fill="url(#'+uid+'cap)"/><rect x="82" y="41" width="16" height="11" rx="3" fill="#b98c3b"/>';
    const bottle=shape==="oil"?'<path d="M78 48h24l5 9v69q0 8-8 8H81q-8 0-8-8V57Z"':shape==="oriental"?'<path d="M65 51q0-7 8-7h34q8 0 8 7l7 16v61q0 11-11 11H69q-11 0-11-11V67Z"':shape==="elegant"?'<path d="M77 45h26l8 16 9 16v48q0 12-12 12H72q-12 0-12-12V77l9-16Z"':shape==="sport"?'<path d="M67 49h46l7 10v66q0 11-11 11H65q-11 0-11-11V59Z"':shape==="square"?'<path d="M62 53q0-7 7-7h42q7 0 7 7v73q0 10-10 10H72q-10 0-10-10Z"':shape==="modern"?'<path d="M69 49q0-5 7-5h28q7 0 7 5l9 16v61q0 11-11 11H71q-11 0-11-11V65Z"':'<path d="M66 53q0-7 8-7h32q8 0 8 7l7 20v53q0 11-11 11H70q-11 0-11-11V73Z"';
    const labelName=String(p.nameAr||p.nameEn||"عطر ملكي").slice(0,14);
    return '<div class="placeholder-bottle bottle-'+shape+'" data-family="'+escapeHTML(family)+'" role="img" aria-label="رسم أصلي توضيحي لعبوة عطر '+escapeHTML(labelName)+' بطابع '+escapeHTML(family)+'، وليس صورة العبوة التجارية الأصلية"><svg viewBox="0 0 180 180" aria-hidden="true"><defs><linearGradient id="'+uid+'glass" x1="0" x2="1" y1="0" y2="1"><stop stop-color="'+colors[1]+'"/><stop offset=".5" stop-color="'+colors[0]+'"/><stop offset="1" stop-color="#fff" stop-opacity=".68"/></linearGradient><linearGradient id="'+uid+'cap" x1="0" x2="1"><stop stop-color="#fff0b2"/><stop offset=".48" stop-color="#d4af37"/><stop offset="1" stop-color="#8b6225"/></linearGradient><linearGradient id="'+uid+'shine" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><ellipse cx="90" cy="153" rx="48" ry="7" fill="#100a10" opacity=".35"/>'+cap+bottle+' fill="url(#'+uid+'glass)" stroke="#fff8e8" stroke-opacity=".8" stroke-width="1.7"/><path d="M68 61h7v61q0 5 4 7h-5q-7 0-7-8Z" fill="url(#'+uid+'shine)"/><path d="M113 67v51q0 8-7 9" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2"/><rect x="65" y="88" width="50" height="31" rx="'+(shape==="square"?1:4)+'" fill="#fff8eb" fill-opacity=".92" stroke="#d4af37" stroke-width="1"/><text x="90" y="99" text-anchor="middle" font-size="5.8" fill="#66502a" font-family="Georgia,serif" letter-spacing=".8">MAMLKAT</text><text x="90" y="108" text-anchor="middle" font-size="5" fill="#8b6225" font-family="Arial,sans-serif">AL-OTOR</text><path d="M75 112h30" stroke="#d4af37" stroke-width=".6"/><text x="90" y="116" text-anchor="middle" font-size="4.5" fill="#66502a">'+escapeHTML(labelName)+'</text><path d="M78 128q12 5 24 0" stroke="#fff" stroke-opacity=".55" fill="none"/></svg><span class="bottle-art-note">رسم توضيحي أصلي</span></div>';
  }
  function productCard(p) {
    const fav=favorites.includes(p.id), sizeList=Object.keys(sizes), defaultSize=sizeList.find(s=>currentPrice(p,s)!=null)||sizeList[0], price=currentPrice(p,defaultSize) ?? priceFor(p), selected=cart.some(item=>item.id===p.id&&String(item.size)===String(defaultSize)), canBuy=Boolean(p.available)&&currentPrice(p,defaultSize)!=null&&!p.supplierCatalogItem;
    const addLabel=p.supplierCatalogItem?"للاختيار والتركيب":!p.available?"التوفر قيد التأكيد":currentPrice(p,defaultSize)==null?"السعر قيد التأكيد":selected?"✓ تم الاختيار":"أضف للسلة";
    const addTitle=p.supplierCatalogItem?"هذا الزيت مخصص للاختيار ضمن طلب تركيب":!p.available?"يلزم تأكيد التوفر قبل البيع":currentPrice(p,defaultSize)==null?"يلزم تحديد سعر معتمد قبل البيع":"";
    const cardPrice=s=>currentPrice(p,s), money=s=>cardPrice(s)==null?"السعر يحتاج تأكيد":formatMoney(cardPrice(s));
    return `<article class="product-card product-card-${escapeHTML(p.productType||"ready")}" data-product-type="${escapeHTML(p.productType||"ready")}" data-id="${escapeHTML(p.id)}"><div class="product-visual">${imageMarkup(p)}<span class="product-badge">${p.needsReview?"يحتاج مراجعة":({"oil":"زيت للتركيب","bakhoor":"عود وبخور","gift":"هدية","blend":"تركيب خاص","ready":"عطر جاهز"}[p.productType]||"عطر جاهز") }</span><button class="favorite-btn ${fav?"is-fav":""}" data-action="favorite" data-id="${escapeHTML(p.id)}" aria-label="إضافة للمفضلة">${fav?"♥":"♡"}</button></div><div class="product-info"><h3>${escapeHTML(p.nameAr||p.nameEn||"منتج جديد")}</h3><div class="product-en" dir="ltr">${escapeHTML(p.nameEn||"")}</div><div class="product-meta">${escapeHTML(p.supplierCatalogItem?(p.gender||"زيت عطري مركز"):(p.brand||"الشركة غير محددة"))} · ${escapeHTML(p.gender||"")}</div><p class="product-desc">${escapeHTML(p.scentNature||p.descriptionAr||"الطابع العطري قيد المراجعة.")}</p><div class="card-buy-panel"><label for="card-size-${escapeHTML(p.id)}">الحجم والسعر</label><select id="card-size-${escapeHTML(p.id)}" class="card-size-select" data-card-size="${escapeHTML(p.id)}" aria-label="اختر حجم ${escapeHTML(p.nameAr||p.nameEn||"العطر")}">${sizeList.map(s=>`<option value="${escapeHTML(s)}" ${s===defaultSize?"selected":""}>${escapeHTML(s)} مل${p.productType==="oil"?(["3","5","10"].includes(s)?" · زيت فقط":" · بخاخ"):""} — ${escapeHTML(money(s))}</option>`).join("")}</select><div class="card-price-line"><span>سعر الحجم المختار</span><strong data-card-price="${escapeHTML(p.id)}">${escapeHTML(money(defaultSize))}</strong></div></div><div class="product-bottom"><span class="product-price">${p.supplierCatalogItem?"للاختيار والتركيب":(price==null?"السعر قيد التأكيد":formatMoney(price))}</span><span class="muted">${escapeHTML(p.family||"غير محدد")}</span></div><div class="product-actions"><button class="small-btn" data-action="details" data-id="${escapeHTML(p.id)}">التفاصيل</button><button class="small-btn primary ${selected?"is-selected":""}" data-action="add" data-id="${escapeHTML(p.id)}" ${canBuy?"":"disabled"} aria-pressed="${String(selected)}" title="${escapeHTML(addTitle)}">${addLabel}</button></div></div></article>`;
  }
  function renderProducts() {
    const q=norm($("#productSearch").value), gender=$("#genderFilter").value, family=$("#familyFilter").value;
    const list=products.filter(p=>p.productType!=="oil" && p.productType!=="bakhoor" && (!gender||p.gender===gender) && (!family||p.family===family) && (!q||norm([p.nameAr,p.nameEn,p.brand,p.family,p.descriptionAr].join(" ")).includes(q)));
    $("#readyProducts").innerHTML=list.map(productCard).join("");
    $("#noProducts").classList.toggle("hidden",list.length>0);
    $("#resultsMessage").textContent=`${list.length} منتج في الكتالوج المعروض · الأسماء التي تحمل «يحتاج مراجعة» غير معتمدة للبيع حتى مراجعتها.`;
    updateCounts();
  }
  let supplierVisibleLimit=24;
  function populateBlendOils(){
    const sel=$("#blendOil");if(!sel)return;const current=sel.value;
    const oils=products.filter(p=>p.supplierCatalogItem||p.productType==="oil");
    sel.innerHTML='<option value="">اختر زيتًا من كتالوج الموردين</option>'+oils.map(p=>'<option value="'+escapeHTML(p.id)+'">'+escapeHTML(p.nameAr)+' — '+escapeHTML(p.nameEn)+'</option>').join('');
    if(oils.some(p=>p.id===current))sel.value=current;
  }
  function renderSupplierOils(){
    const grid=$("#supplierOilProducts");if(!grid)return;
    const all=products.filter(p=>p.supplierCatalogItem || p.productType==="oil");
    const q=norm($("#supplierOilSearch")?.value||""),cat=$("#supplierOilCategory")?.value||"",family=$("#supplierOilFamily")?.value||"";
    const categoryMap={MEN:"رجالي",WOMEN:"نسائي",UNISEX:"للجنسين",ORIENTAL:"شرقي",KIDS:"أطفال",DIFFUSER:"فواحات"};
    const filtered=all.filter(p=>(!cat||!p.supplierCatalogItem||p.supplierCategory===cat)&&(!family||p.family===family)&&(!q||norm([p.nameAr,p.nameEn,p.supplierSku,p.family,p.gender,p.brand].join(" ")).includes(q)));
    const visible=filtered.slice(0,supplierVisibleLimit);
    grid.innerHTML=visible.map(productCard).join("");
    $("#supplierOilSummary").textContent=all.length?("إجمالي "+all.length+" نوع زيت من الموردين · المعروض "+visible.length+" من "+filtered.length+" · الأسعار الداخلية غير معروضة هنا."): "استورد ملف كتالوج الموردين من لوحة الإدارة لعرض الأنواع كاملة.";
    $("#noSupplierOilProducts").classList.toggle("hidden",filtered.length>0);
    $("#supplierOilMore").classList.toggle("hidden",visible.length>=filtered.length);
  }
  $("#supplierOilSearch")?.addEventListener("input",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  $("#supplierOilCategory")?.addEventListener("change",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  function syncProductCardSelectionStates(){document.querySelectorAll(".product-card").forEach(card=>{const select=card.querySelector("[data-card-size]");if(!select)return;const id=select.dataset.cardSize,p=findProduct(id),size=String(select.value),price=currentPrice(p,size),chosen=cart.some(item=>item.id===id&&String(item.size)===size),button=card.querySelector('[data-action="add"]');if(!button)return;button.classList.toggle("is-selected",chosen);button.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":!p?.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":chosen?"✓ تم الاختيار":"أضف للسلة";button.disabled=Boolean(p?.supplierCatalogItem)||!p?.available||price==null;button.setAttribute("aria-pressed",String(chosen));});}
  document.addEventListener("change",e=>{const select=e.target.closest("[data-card-size]");if(!select)return;const card=select.closest(".product-card");if(!card)return;const id=select.dataset.cardSize,p=findProduct(id),size=String(select.value),price=currentPrice(p,size),priceLine=card.querySelector("[data-card-price]"),basePrice=card.querySelector(".product-price"),button=card.querySelector('[data-action="add"]');if(priceLine)priceLine.textContent=price==null?"السعر يحتاج تأكيد":formatMoney(price);if(basePrice)basePrice.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":price==null?"السعر قيد التأكيد":formatMoney(price);if(!button)return;const chosen=cart.some(item=>item.id===id&&String(item.size)===size);button.classList.toggle("is-selected",chosen);button.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":!p?.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":chosen?"✓ تم الاختيار":"أضف للسلة";button.disabled=Boolean(p?.supplierCatalogItem)||!p?.available||price==null;button.setAttribute("aria-pressed",String(chosen));});
  $("#supplierOilFamily")?.addEventListener("change",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  $("#supplierOilMore")?.addEventListener("click",()=>{supplierVisibleLimit+=24;renderSupplierOils()});
  document.querySelectorAll("[data-scent-family]").forEach(card=>card.addEventListener("click",()=>{const fam=card.dataset.scentFamily;$("#supplierOilFamily").value=fam;supplierVisibleLimit=24;renderSupplierOils()}));
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
    el.innerHTML=cart.map(item=>`<div class="cart-line"><div><h4>${escapeHTML(item.nameAr)}</h4><small>${escapeHTML(item.nameEn||"")} · ${escapeHTML(item.size)} مل · ${formatMoney(item.price)} للقطعة</small>${item.custom?.description?`<small>${escapeHTML(item.custom.description)}</small>`:""}<small>الكمية: ${escapeHTML(item.qty)} — الإجمالي: ${formatMoney(item.price*item.qty)}</small></div><div class="cart-line-actions"><button class="qty-btn" data-cart="minus" data-key="${escapeHTML(item.key)}" aria-label="تقليل الكمية">−</button><button class="qty-btn" data-cart="plus" data-key="${escapeHTML(item.key)}" aria-label="زيادة الكمية">+</button><button class="remove-btn" data-cart="remove" data-key="${escapeHTML(item.key)}">حذف</button></div></div>`).join("");
    $("#cartTotal").textContent=formatMoney(cart.reduce((n,x)=>n+x.price*x.qty,0));
  }
  function openDrawer(){ $("#drawerBackdrop").classList.remove("hidden");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("locked");renderCart(); }
  function closeDrawer(){ $("#drawerBackdrop").classList.add("hidden");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("locked"); }
  function openDetails(id){
    const p=findProduct(id);if(!p)return;
    const sizeKeys=Object.keys(sizes),priced=sizeKeys.filter(s=>currentPrice(p,s)!=null);
    const defaultSize=priced.includes("10")?"10":(priced[0]||"10");
    const money=v=>v==null?"تواصل لتأكيد السعر":formatMoney(v);
    const notes=v=>Array.isArray(v)?(v.length?v.join("، "):"غير موثقة"):(v||"غير موثقة");
    $("#modalContent").innerHTML=`<div class="modal-product"><div class="modal-product-image">${imageMarkup(p)}</div><div class="modal-product-copy" dir="rtl"><p class="eyebrow">MAMLKAT AL-OTOR · تفاصيل العطر</p><h2 id="modalTitle">${escapeHTML(p.nameAr||"منتج")}</h2><div class="product-en" dir="ltr">${escapeHTML(p.nameEn||"")}</div><p class="modal-description">${escapeHTML(p.descriptionAr||"لا يوجد وصف موثق بعد.")}</p><div class="modal-facts"><p><b>النوع</b><span>${escapeHTML(p.productType==="oil"?"زيت عطري للتركيب":p.productType==="bakhoor"?"عود أو بخور":"عطر جاهز")}</span></p><p><b>الفئة</b><span>${escapeHTML(p.gender||"غير محدد")}</span></p><p><b>الطابع</b><span>${escapeHTML(p.scentNature||"يحتاج إلى تقييم العينة")}</span></p><p><b>العائلة العطرية</b><span>${escapeHTML(p.family||"غير محددة")}</span></p></div><details class="fragrance-note-pyramid"><summary>تفاصيل النوتات العطرية</summary><p><b>المقدمة:</b> ${escapeHTML(notes(p.topNotes))}</p><p><b>القلب:</b> ${escapeHTML(notes(p.heartNotes))}</p><p><b>القاعدة:</b> ${escapeHTML(notes(p.baseNotes))}</p></details>${p.sourceUrl&&/^https:\/\//i.test(p.sourceUrl)?`<p class="modal-source"><b>مصدر التفاصيل:</b> <a href="${escapeHTML(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">فتح المصدر والتحقق</a></p>`:""}${p.needsReview?'<p class="modal-review-note">بعض تفاصيل النوع أو الإصدار تحتاج إلى مراجعة. اسأل المتجر عن التوفر قبل إتمام الطلب.</p>':""}${p.supplierCatalogItem?'<div class="purchase-panel blend-minimum-price"><strong>زيت مخصص للتركيب</strong><p>أقل سعر لطلب الزيوت والتركيب يبدأ من <b>50 ج.م</b> حسب الحجم المختار. اختر الزيت من قسم الزيوت ثم حدّد الحجم لإرسال طلبك.</p><p class="purchase-hint">سعر شراء الزيوت للتركيب يبدأ من 50 جنيهًا؛ السعر النهائي يتحدد وفق الحجم والاختيار.</p></div>':`<div class="purchase-panel"><label for="modalSize">اختر حجم العبوة</label><select id="modalSize" aria-label="اختر حجم العطر">${sizeKeys.map(s=>`<option value="${escapeHTML(s)}" ${s===defaultSize?"selected":""}>${escapeHTML(s)} مل · ${escapeHTML(money(currentPrice(p,s)))}</option>`).join("")}</select><div class="modal-price-row"><span>سعر الحجم المختار</span><strong class="modal-price" aria-live="polite">${money(currentPrice(p,defaultSize))}</strong></div><p class="purchase-hint" id="purchaseHint">${p.available?"اختر الحجم المناسب ثم أضف المنتج إلى السلة.":"الطلب ينتظر تأكيد السعر والتوفر من المتجر."}</p></div>`}<div class="modal-actions"><button class="btn btn-gold" id="modalAdd" ${p.supplierCatalogItem||!p.available||currentPrice(p,defaultSize)==null?"disabled":""}>${p.supplierCatalogItem?"زيت للتركيب فقط":!p.available?"التوفر قيد التأكيد":currentPrice(p,defaultSize)==null?"السعر قيد التأكيد":"أضف للسلة"}</button><button class="btn btn-outline" id="speakDetails">استمع للوصف</button></div></div></div>`;
    const modal=$("#modalBackdrop");modal.classList.remove("hidden");modal.setAttribute("aria-hidden","false");
    const add=$("#modalAdd"),select=$("#modalSize");
    add.onclick=()=>{if(!select){notify("هذا زيت مخصص للتركيب؛ اختره من قسم الزيوت.");return;}if(!p.available){notify("التوفر غير معتمد بعد؛ تواصل مع المتجر للتأكيد.");return;}if(currentPrice(p,select.value)==null){notify("سعر هذا الحجم غير محدد حاليًا.");return;}addToCart(id,select.value);};
    if(select)select.onchange=()=>{const price=currentPrice(p,select.value);const el=$("#modalContent .modal-price");if(el)el.textContent=money(price);add.disabled=!p.available||price==null;add.textContent=!p.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":"أضف للسلة";const hint=$("#purchaseHint");if(hint)hint.textContent=price==null?"لا يوجد سعر معتمد لهذا الحجم؛ اختر حجمًا آخر أو تواصل مع المتجر.":p.available?"السعر المعروض للحجم المحدد.":"السعر ظاهر لكن التوفر يحتاج إلى تأكيد.";};
    $("#speakDetails").onclick=()=>{if(!("speechSynthesis"in window)){notify("الشرح الصوتي غير مدعوم في هذا المتصفح.");return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${p.nameAr||""}. ${p.descriptionAr||""}`);u.lang="ar-EG";speechSynthesis.speak(u);};
    $("#closeModal").focus({preventScroll:true});
  }
  function closeModal(){
    $("#modalBackdrop").classList.add("hidden");
    $("#modalBackdrop").setAttribute("aria-hidden","true");
    if("speechSynthesis" in window)speechSynthesis.cancel();
  }
  function checkout(){
    if(!cart.length){notify("أضف منتجًا إلى السلة أولًا.");return;}
    const name=$("#checkoutName")?.value.trim()||"";
    const phone=$("#checkoutPhone")?.value.trim()||"";
    const area=$("#checkoutArea")?.value.trim()||"";
    const notes=$("#checkoutNotes")?.value.trim()||"";
    if(name.length<2){notify("اكتب اسم العميل لإكمال الطلب.");$("#checkoutName")?.focus();return;}
    const phoneDigits=phone.replace(/\D/g,"");
    if(phoneDigits.length<7){notify("اكتب رقم هاتف صحيحًا للتواصل.");$("#checkoutPhone")?.focus();return;}
    const lines=cart.map((x,i)=>(i+1)+") "+x.nameAr+(x.nameEn?" ("+x.nameEn+")":"")+(x.custom?.description?" — "+x.custom.description:"")+" - "+x.size+" مل × "+x.qty+" = "+formatMoney(x.price*x.qty));
    const total=cart.reduce((n,x)=>n+x.price*x.qty,0);
    const msg="مرحبًا، أريد مراجعة طلب من مملكة العطور:\nاسم العميل: "+name+"\nهاتف العميل: "+phone+(area?"\nالعنوان / المنطقة: "+area:"")+(notes?"\nملاحظات: "+notes:"")+"\n\nتفاصيل الطلب:\n"+lines.join("\n")+"\nالإجمالي المرجعي: "+formatMoney(total)+"\nيرجى تأكيد التوفر والسعر النهائي وتكلفة التوصيل.";
    window.open("https://wa.me/"+getWaNumber()+"?text="+encodeURIComponent(msg),"_blank","noopener");
  }
  function blendPrice(){const s=$("#blendSize").value;$("#blendPrice").textContent=formatMoney(retailSizePrice(s));}
  async function submitAdvisor(query){
    const q=norm(query);if(!q)return;
    const replies=$("#advisorReplies");
    let remoteWarning="";
    if(window.MamlakaAI?.isConfigured()){
      replies.innerHTML='<div class="assistant-message">مستشار المملكة يراجع طلبك والمنتجات المسجلة…</div>';
      try{
        const remote=await window.MamlakaAI.ask(query,products.slice(0,80));
        if(remote){
          const byId=new Map(products.map(p=>[String(p.id),p]));
          const chosen=remote.recommendedProductIds.map(id=>byId.get(String(id))).filter(Boolean).slice(0,3);
          replies.innerHTML='<div class="assistant-message"><strong>مستشار مملكة العطور الذكي 👑</strong><br>'+escapeHTML(remote.answer)+'</div>'+chosen.map(p=>{const price=priceFor(p);return '<div class="suggestion"><div><h4>'+escapeHTML(p.nameAr||p.nameEn||"عطر مسجل")+' <span class="product-en">'+escapeHTML(p.nameEn||"")+'</span></h4><p>'+escapeHTML(p.family||"عائلة غير محددة")+' · '+(price==null?"السعر يحتاج إلى تأكيد":formatMoney(price))+(p.needsReview?" · بيانات تحتاج مراجعة":"")+'</p><small>'+escapeHTML((p.scentNature||p.descriptionAr||"الطابع العطري يحتاج إلى مراجعة").slice(0,150))+'</small></div><button class="small-btn" data-action="details" data-id="'+escapeHTML(p.id)+'">التفاصيل</button></div>';}).join("");
          return;
        }
      }catch(error){remoteWarning='<div class="assistant-message">تعذر الاتصال بالمستشار الذكي الآن؛ أعرض لك اقتراحات محلية بدلًا من ذلك. '+escapeHTML(error.message||"")+'</div>';}
    }
    const terms=[
      {label:"خشبي",words:["خشبي","عود","خشب","woody","oud"]},
      {label:"زهري",words:["زهري","ورد","زهور","فل","rose","floral"]},
      {label:"شرقي",words:["شرقي","عنبر","بهارات","بخور","oriental","amber"]},
      {label:"حلو",words:["حلو","فانيلا","فانيليا","سكر","كراميل","gourmand","sweet","vanilla"]},
      {label:"منعش",words:["منعش","صيف","حمضي","ليمون","بحري","fresh","citrus","marine"]},
      {label:"مسكي",words:["مسكي","مسك","نظيف","musk","clean"]},
      {label:"فاكهي",words:["فاكهي","فاكهة","فواكه","فراولة","أناناس","fruit","fruity"]},
      {label:"جلدي",words:["جلدي","جلد","تبغ","دخاني","leather","tobacco"]}
    ];
    const matched=terms.find(t=>t.words.some(w=>q.includes(norm(w))));
    const gender=q.includes("رجالي")||q.includes("للرجال")||q.includes("men")?"رجالي":q.includes("نسائي")||q.includes("للنساء")||q.includes("women")?"نسائي":null;
    const digitText=q.replace(/[٠-٩]/g,d=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const budgetMatch=digitText.match(/(?:ميزاني(?:ة|تي)|تحت|أقل من|اقل من|حد أقصى|بحدود|جنيه|ج\.م|budget)\s*(\d{2,5})/i);
    const budget=budgetMatch?Number(budgetMatch[1]):null;
    const daily=/دوام|شغل|عمل|يومي|جامعة|مكتب|نهار|day|office|daily/.test(q);
    const occasion=/سهرة|فرح|زفاف|مناسبة|مساء|حفلة|evening|wedding|event/.test(q);
    const candidates=products.filter(p=>p.productType!=="oil"&&p.productType!=="bakhoor");
    const scored=candidates.map(p=>{
      const hay=norm([p.family,p.scentNature,p.descriptionAr,p.nameAr,p.nameEn,p.gender].join(" "));
      let score=0;
      if(matched){const hits=matched.words.filter(w=>hay.includes(norm(w)));score+=hits.length?Math.min(8,hits.length*2):0;if(hay.includes(norm(matched.label)))score+=2;}
      if(gender){if(p.gender===gender)score+=4;else if(p.gender==="للجنسين")score+=2;else score-=5;}
      const requestedWords=q.split(/\s+/).filter(w=>w.length>2&&!/^\d+$/.test(w));
      score+=requestedWords.filter(w=>hay.includes(w)).length;
      if(daily&&/منعش|حمضي|مسكي|نظيف|fresh|citrus|clean|musk/i.test(hay))score+=2;
      if(occasion&&/شرقي|خشبي|عنبر|حلو|زهري|woody|amber|oriental|sweet|floral/i.test(hay))score+=2;
      const price=priceFor(p);
      if(budget!==null&&Number.isFinite(price)){if(price<=budget)score+=3;else score-=2;}
      return {p,score,price};
    }).filter(x=>(!matched||x.score>0)&&(!gender||x.score>0)).sort((a,b)=>b.score-a.score);
    const list=scored.slice(0,3);
    const replies=$("#advisorReplies");
    if(!list.length){replies.innerHTML=remoteWarning+'<div class="assistant-message">لم أجد تطابقًا موثوقًا في الكتالوج الحالي. جرّب اختيار طابع آخر، أو اكتب اسم عطر محدد لنبحث عنه معك.</div><button type="button" class="small-btn" data-advisor-request>اطلب البحث عن عطر</button>';return;}
    const context=[matched?("الطابع: "+matched.label):"",gender?("الفئة: "+gender):"",budget!==null?("الميزانية المذكورة: "+budget+" ج.م"):"",daily?"الاستخدام: يومي":occasion?"الاستخدام: مناسبة":""] .filter(Boolean).join(" · ");
    replies.innerHTML=remoteWarning+`<div class="assistant-message"><strong>ترشيحات مبدئية من الكتالوج</strong><br>${escapeHTML(context||"رتّبت النتائج حسب قربها من وصفك.")}<br>التوصيات إرشادية وتعتمد على بيانات المنتج المسجلة؛ جرّب العطر وتأكد من السعر والتوفر مع المتجر قبل الشراء.</div>`+list.map(({p,price})=>`<div class="suggestion"><div><h4>${escapeHTML(p.nameAr||p.nameEn||"عطر مسجل")} <span class="product-en">${escapeHTML(p.nameEn||"")}</span></h4><p>${escapeHTML(p.family||"عائلة غير محددة")} · ${price==null?"السعر يحتاج إلى تأكيد":formatMoney(price)}${p.needsReview?" · بيانات تحتاج مراجعة":""}</p><small>${escapeHTML((p.scentNature||p.descriptionAr||"الطابع العطري يحتاج إلى مراجعة").slice(0,150))}</small></div><button class="small-btn" data-action="details" data-id="${escapeHTML(p.id)}">التفاصيل</button></div>`).join("");
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
  document.addEventListener("change",e=>{const select=e.target.closest("[data-card-size]");if(!select)return;const id=select.dataset.cardSize,size=select.value,p=findProduct(id);if(!p)return;const price=currentPrice(p,size),priceNode=document.querySelector(`[data-card-price="${CSS.escape(id)}"]`),cardNode=select.closest(".product-card"),add=cardNode?.querySelector('[data-action="add"]');if(priceNode)priceNode.textContent=price==null?"السعر يحتاج تأكيد":formatMoney(price);if(add){add.disabled=!p.available||price==null||Boolean(p.supplierCatalogItem);add.title=price==null?"لا يوجد سعر معتمد لهذا الحجم":!p.available?"يلزم تأكيد التوفر قبل البيع":"";add.textContent=p.supplierCatalogItem?"للاختيار والتركيب":!p.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":"أضف للسلة";}});
  document.addEventListener("click",e=>{
    const action=e.target.closest("[data-action]");if(action){const {action:act,id}=action.dataset;if(act==="favorite")toggleFavorite(id);if(act==="add"){const card=e.target.closest(".product-card"),size=card?.querySelector("[data-card-size]")?.value||"10";addToCart(id,size);const chosen=cart.some(item=>item.id===id&&String(item.size)===String(size));const button=card?.querySelector('[data-action="add"]');if(button){button.classList.toggle("is-selected",chosen);button.textContent=chosen?"✓ تم الاختيار":(findProduct(id)?.supplierCatalogItem?"للاختيار والتركيب":"أضف للسلة");button.setAttribute("aria-pressed",String(chosen));}}if(act==="details")openDetails(id);}
    const ca=e.target.closest("[data-cart]");if(ca){const item=cart.find(x=>x.key===ca.dataset.key);if(!item)return;if(ca.dataset.cart==="plus")item.qty=Math.min(99,Number(item.qty)+1);if(ca.dataset.cart==="minus")item.qty=Number(item.qty)-1;if(ca.dataset.cart==="remove"||item.qty<=0)cart=cart.filter(x=>x.key!==item.key);save(STORAGE.cart,cart);renderCart();updateCounts();syncProductCardSelectionStates();}
  });
  $("#productSearch").addEventListener("input",renderProducts);$("#genderFilter").addEventListener("change",renderProducts);$("#familyFilter").addEventListener("change",renderProducts);
  $("#requestMissingBtn").addEventListener("click",()=>{const name=$("#productSearch").value.trim();if(!name){notify("اكتب اسم العطر الذي تبحث عنه أولًا.");$("#productSearch").focus();return;}requestMissing(name);notify("تم تسجيل طلب البحث وفتح واتساب لإرساله.");});
  $("#searchFocus").addEventListener("click",()=>{$("#productSearch").focus();document.querySelector("#ready").scrollIntoView({behavior:"smooth"});});
  $("#favoritesShortcut").addEventListener("click",()=>{const fav=products.filter(p=>favorites.includes(p.id));if(!fav.length){notify("قائمة المفضلة فارغة.");return;}$("#productSearch").value="";$("#genderFilter").value="";$("#familyFilter").value="";$("#readyProducts").innerHTML=fav.map(productCard).join("");$("#resultsMessage").textContent=`${fav.length} منتج في المفضلة`;$("#noProducts").classList.add("hidden");document.querySelector("#ready").scrollIntoView({behavior:"smooth"});});
  $("#cartShortcut").addEventListener("click",openDrawer);$("#closeDrawer").addEventListener("click",closeDrawer);$("#drawerBackdrop").addEventListener("click",closeDrawer);
  $("#closeModal").addEventListener("click",closeModal);$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
  $("#checkoutBtn").addEventListener("click",checkout);$("#clearCart").addEventListener("click",()=>{cart=[];save(STORAGE.cart,cart);renderCart();updateCounts();syncProductCardSelectionStates();notify("تم إفراغ السلة.");});
  $("#blendSize").addEventListener("change",blendPrice);
  $("#addBlend").addEventListener("click",()=>{
    const size=$("#blendSize").value,family=$("#blendScent").value,bottle=$("#blendBottle").value;
    const oilId=$("#blendOil")?.value||"",oil=findProduct(oilId),oilName=oil?(oil.nameAr||oil.nameEn):"زيت يختاره المتجر";
    const label=`تركيبة-${family}-${size}-${bottle}-${oil?.supplierSku||"اختيار-المتجر"}`;
    addToCart("custom-"+Date.now(),size,retailSizePrice(size),{nameAr:`تركيبة ${family}`,nameEn:"Custom Blend",label,description:`الزيت الأساسي: ${oilName}، العائلة: ${family}، ${size} مل، ${bottle}`});
    const last=cart[cart.length-1];if(last&&last.custom)last.nameAr=`تركيبة ${family} — ${oilName} (${bottle})`;
    save(STORAGE.cart,cart);updateCounts();
  });
  $("#advisorForm").addEventListener("submit",e=>{e.preventDefault();submitAdvisor($("#advisorInput").value);});
  document.querySelectorAll("[data-advisor-prompt]").forEach(button=>button.addEventListener("click",()=>{const prompt=button.dataset.advisorPrompt||"";$("#advisorInput").value=prompt;submitAdvisor(prompt);}));
  $("#advisorReplies")?.addEventListener("click",e=>{if(e.target.closest("[data-advisor-request]"))requestMissing($("#advisorInput").value.trim()||"اقتراح عطر مناسب");});
  $("#contactWhatsapp").href=`https://wa.me/${getWaNumber()}?text=${encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات مملكة العطور.")}`;
  $("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
  $("#mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}));
  document.addEventListener("keydown",e=>{
    if(e.key!=="Escape")return;
    if(!$("#modalBackdrop").classList.contains("hidden"))closeModal();
    if($("#cartDrawer").classList.contains("open"))closeDrawer();
    if($("#mainNav").classList.contains("open")){$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").focus({preventScroll:true});}
  });
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
  function syncAllProducts(){products=combineProducts();renderProducts();renderSupplierOils();renderCart();updateCounts();populateBlendOils();}
  document.addEventListener("mamlaka:products-updated",syncAllProducts);
  document.addEventListener("mamlaka:supplier-catalog-updated",syncAllProducts);
  setLanguage(language);renderProducts();renderSupplierOils();populateBlendOils();renderCart();updateCounts();blendPrice();loadPublicCatalog();
  // If search misses, offer a direct request without pretending the catalog contains the item.
  $("#productSearch").addEventListener("keydown",e=>{if(e.key==="Enter" && !products.some(p=>norm([p.nameAr,p.nameEn,p.brand].join(" ")).includes(norm(e.target.value)))){if(e.target.value.trim() && confirm(`لم نعثر على «${e.target.value.trim()}». هل تريد الاستفسار عنه عبر واتساب؟`))requestMissing(e.target.value.trim());}});
})();