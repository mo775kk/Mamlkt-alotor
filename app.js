(() => {
  "use strict";
  const getWaNumber = () => (localStorage.getItem("mamlaka_admin_whatsapp_v1") || "201272776928").replace(/\D/g, "");
  const STORAGE = {cart:"mamlaka_cart_v1", fav:"mamlaka_favorites_v1", lang:"mamlaka_language_v1", custom:"mamlaka_custom_products_v1", requests:"mamlaka_requests_v1"};
  const sizes = (() => {
    const fallback = {"3":50,"5":75,"10":100,"22":130,"30":100,"50":150,"100":300};
    try {
      const cfg = JSON.parse(localStorage.getItem("mamlaka_catalog_taxonomy_config_v1") || "null");
      if (Array.isArray(cfg?.retailBlendPrices) && cfg.retailBlendPrices.length) {
        const editable = {};
        cfg.retailBlendPrices.forEach(item => {
          const size = String(item.size || "").match(/[0-9]+/)?.[0];
          if (size && Number.isFinite(Number(item.price)) && Number(item.price) >= 50) editable[size] = Number(item.price);
        });
        if (editable["30"] === 150 && editable["50"] === 200 && editable["100"] === 450) {
          editable["30"] = 100; editable["50"] = 150; editable["100"] = 300;
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
  // Bind only when an optional page element exists; a missing control must not abort the storefront.
  const bind = (selector, eventName, handler, options) => { const el = $(selector); if (el) el.addEventListener(eventName, handler, options); };
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
      description: String(item.custom.description ?? "").slice(0, 500),
      unit: String(item.custom.unit ?? "").slice(0, 20),
      grams: Math.max(0, Number(item.custom.grams) || 0),
      rate: Math.max(0, Number(item.custom.rate) || 0)
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
  // Brand-sourced reference fragrance notes. These describe the named fragrance only;
  // they never confirm a supplier oil's actual formula, stock, price, or availability.
  const referenceFragranceNotes = {
    khamrah: {topNotes:["البرغموت","القرفة","جوزة الطيب"],heartNotes:["أكورد التمر","زنبق الوادي","البرالين","التيوبيروز"],baseNotes:["التونكا المحمصة","بنزوين لاوس","المر","أكيغالاوود","الفانيليا","خشب العنبر"],sourceUrl:"https://lattafa.com/ar/product/%D8%AE%D9%85%D8%B1%D8%A9/"},
    khamrahqahwa: {topNotes:["الزنجبيل","القرفة","الهيل"],heartNotes:["البرالين","الفواكه المسكّرة","الزهور البيضاء"],baseNotes:["قهوة أرابيكا","حبوب التونكا","المسك","البنزوين","الفانيليا"],sourceUrl:"https://lattafa.com/product/khamrah-qahwa/"},
    asad: {topNotes:["الفلفل الأسود","الأناناس","التبغ"],heartNotes:["القهوة","السوسن","الباتشولي"],baseNotes:["العنبر","الفانيليا","الأخشاب الجافة","البنزوين","اللادن"],sourceUrl:"https://lattafa.com/product/asad/"},
    asadzanzibar: {topNotes:["الفلفل الأسود","خزامى البحر"],heartNotes:["ماء جوز الهند المالح","السوسن"],baseNotes:["الفانيليا","البخور"],sourceUrl:"https://lattafa.com/product/asad-zanzibar/"},
    asadbourbon: {topNotes:["الفلفل الوردي","الخزامى","البرقوق ميرابيل"],heartNotes:["الكاكاو","الدافانا","جوزة الطيب"],baseNotes:["الفيتيفر","فانيليا بوربون","العنبر"],sourceUrl:"https://lattafa.com/product/asad-bourbon/"}
  };
  const fragranceKey = value => String(value || "").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
  function applyReferenceFragranceNotes(product) {
    const key = fragranceKey(product?.nameEn || product?.name_en || product?.nameAr || product?.name_ar);
    const reference = referenceFragranceNotes[key];
    if (!reference) return product;
    const hasPyramid = [product.topNotes, product.heartNotes, product.baseNotes].some(notes => Array.isArray(notes) && notes.length);
    if (hasPyramid) return product;
    product.topNotes = reference.topNotes.slice();
    product.heartNotes = reference.heartNotes.slice();
    product.baseNotes = reference.baseNotes.slice();
    product.sourceUrl = reference.sourceUrl;
    product.notesStatus = "reference-fragrance-notes";
    product.notesConfidence = "نوتات مرجعية من موقع العلامة الرسمي؛ لا تثبت تركيبة زيت المورد";
    product.notesDisclaimer = "هذه نوتات العطر الأصلي المرجعي من موقع العلامة. لا تؤكد تركيبة زيت المورد أو تطابق الزيت مع العطر الأصلي.";
    return product;
  }
  let publicCatalogProducts = [];
  let language = safeRead(STORAGE.lang, "ar") === "en" ? "en" : "ar";
  const combineProducts = () => {
    const merged = new Map();
    [...demoProducts, ...publicCatalogProducts, ...readArray(STORAGE.custom), ...supplierProducts()].forEach(product => {
      const id = String(product?.id || "").trim();
      if (!id) return;
      // Public catalog and legacy local cache may contain the same supplier SKU under different IDs.
      const sku = product?.supplierCatalogItem ? norm(product.supplierSku || product.sku || "") : "";
      const key = sku ? "supplier-sku:" + sku : "product-id:" + id;
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, product);
        return;
      }
      // Prefer the richer public record with standardized names, references and disclaimers.
      const primary = product.publicCatalogItem ? product : existing.publicCatalogItem ? existing : product;
      const secondary = primary === product ? existing : product;
      merged.set(key, { ...secondary, ...primary, id: primary.id || existing.id || id });
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
      publicCatalogProducts.forEach(applyReferenceFragranceNotes);
      try {
        const oilResponse = await fetch("oil-catalog-public.json", { cache: "no-cache" });
        if (oilResponse.ok) {
          const oilPayload = await oilResponse.json();
          const oilRecords = Array.isArray(oilPayload?.products) ? oilPayload.products : [];
          const oilProducts = oilRecords.filter(p => p && typeof p === "object").map(p => ({
            ...p,
            id: String(p.id || ("supplier-oil-" + p.sku)),
            productType: "oil",
            supplierCatalogItem: true,
            publicCatalogItem: true,
            available: false,
            needsReview: true,
            price: null,
            prices: {},
            topNotes: Array.isArray(p.topNotes) ? p.topNotes : [],
            heartNotes: Array.isArray(p.heartNotes) ? p.heartNotes : [],
            baseNotes: Array.isArray(p.baseNotes) ? p.baseNotes : [],
            scentNature: p.scentNature || "تفاصيل الرائحة تحتاج إلى مصدر موثق.",
            scentNotesProfile: p.scentNotesProfile || "غير محددة في مستند المورد."
          }));
          oilProducts.forEach(applyReferenceFragranceNotes);
          const ids = new Set(publicCatalogProducts.map(p => p.id));
          publicCatalogProducts.push(...oilProducts.filter(p => !ids.has(p.id)));
          document.documentElement.dataset.publicOilCatalog = String(oilProducts.length);
        }
      } catch (oilError) {
        console.warn("تعذر تحميل كتالوج الزيوت العام.", oilError);
      }
      products = combineProducts();
      renderProducts();
      renderHomeShowcase();
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
  // Lightweight bilingual intent expansion for catalog discovery; no external API or secret key required.
  const catalogIntentGroups = [
    ["دافئ","دافي","warm","warming","winter","شتاء","للشتاء","عنبر","amber","شرقي","oriental","spicy","توابل","متبل"],
    ["منعش","انتعاش","fresh","citrus","حمضي","صيف","summer","ليمون","برغموت"],
    ["حلو","حلاوه","sweet","vanilla","فانيليا","gourmand","سكر","كراميل"],
    ["خشبي","خشب","woody","wood","عود","oud","صندل","sandalwood","cedar","ارز"],
    ["زهري","زهور","floral","flower","ورد","rose","ياسمين","jasmine"],
    ["مسك","مسكي","musk","musky","نظيف","clean","ناعم"],
    ["بحري","مائي","marine","aquatic","ocean","sea","بحر"],
    ["جلدي","جلد","leather","تبغ","tobacco","مدخن","smoky"],
    ["رجالي","رجاليه","men","mens","male","للرجال"],
    ["نسائي","نسائيه","women","womens","female","للسيدات"],
    ["للجنسين","يونيسكس","unisex"]
  ].map(group=>group.map(norm));
  const catalogStopWords = new Set(["لل","في","من","على","عن","مع","الى","الي","the","for","and","with","a","an","عطر","عطور","perfume","perfumes"]);
  function matchesCatalogQuery(product, rawQuery) {
    const query=norm(rawQuery);
    if(!query)return true;
    const haystack=norm([
      product.nameAr,product.nameEn,product.brand,product.referenceHouse,product.referenceHouseAr,
      product.referenceSearchName,...(product.referenceSearchAliases||[]),product.family,
      product.scentNature,product.descriptionAr,product.gender,
      ...(product.topNotes||[]),...(product.heartNotes||[]),...(product.baseNotes||[])
    ].join(" "));
    if(haystack.includes(query))return true;
    const tokens=query.split(" ").filter(t=>t.length>1&&!catalogStopWords.has(t));
    if(!tokens.length)return haystack.includes(query);
    // Each meaningful query token must match either directly or through a known scent-intent synonym.
    return tokens.every(token=>{
      const group=catalogIntentGroups.find(items=>items.some(item=>item===token||item.startsWith(token)||token.startsWith(item)));
      return (group||[token]).some(term=>haystack.includes(term));
    });
  }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { notify("تعذر الحفظ في هذا المتصفح. صدّر نسخة احتياطية إن أمكن."); return false; } }
  function notify(msg) { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),3000); }
  function findProduct(id) { return products.find(p=>p.id===id); }
  function retailSizePrice(size){const key=String(size);try{const cfg=JSON.parse(localStorage.getItem("mamlaka_catalog_taxonomy_config_v1")||"null");const item=Array.isArray(cfg?.retailBlendPrices)?cfg.retailBlendPrices.find(x=>String(x.size||"").match(/[0-9]+/)?.[0]===key):null;if(item&&Number.isFinite(Number(item.price))&&Number(item.price)>=50)return Number(item.price);}catch{}return sizes[key]??null;}
  function currentPrice(p,size) { if(!p || p.supplierCatalogItem || p.supplierSku) return null; if(p.productType === "blend" || p.productType === "oil" || p.customBlend === true) return retailSizePrice(size); const specific=p.prices && p.prices[String(size)] != null ? Number(p.prices[String(size)]) : null; if(Number.isFinite(specific) && specific>0) return Math.max(50,specific); const base=p.price != null ? Number(p.price) : null; if(Number.isFinite(base) && base>0) return Math.max(50,base); return null; }
  function imageMarkup(p){
    if(p.image&&(/^(https?:)/i.test(p.image)||p.image.startsWith("assets/")||p.image.startsWith("data:image/")))return '<img class="product-photo" src="'+escapeHTML(p.image)+'" alt="'+(p.referenceImage?"صورة مرجعية لعبوة العطر الأصلي: ":"الصورة المسجلة لمنتج ")+escapeHTML(p.nameAr||p.nameEn||"العطر")+'" loading="lazy" decoding="async">';
    // Category photography is illustrative only; exact registered product photos always take precedence.
    const type=String(p.productType||"ready").toLowerCase();
    const photoSets={
      ready:["photo-1594035910387-fea47794261f","photo-1541643600914-78b084683601","photo-1592945403244-b3fbafd7f539","photo-1590736969955-71cc94901144"],
      oil:["photo-1608571423902-eed4a5ad8108","photo-1616949755610-8c9bbc08f138","photo-1608528577891-eb055944f2e3"],
      bakhoor:["photo-1615634260167-c8cdede054de","photo-1602874801007-bd458bb1b8b6","photo-1608571423902-eed4a5ad8108"],
      gift:["photo-1549465220-1a8b9238cd48","photo-1513201099705-a9746e1e201f","photo-1602143407151-7111542de6e8"]
    };
    const photoType=(type==="oil"||type==="blend"||p.supplierCatalogItem===true)?"oil":(type==="bakhoor"||type==="oud")?"bakhoor":type==="gift"?"gift":"ready";
    const photoKey=String(p.id||p.nameEn||p.nameAr||"product");
    let photoHash=0;for(let i=0;i<photoKey.length;i++)photoHash=(photoHash*31+photoKey.charCodeAt(i))>>>0;
    const categoryPhoto="https://images.unsplash.com/"+photoSets[photoType][photoHash%photoSets[photoType].length]+"?auto=format&fit=crop&w=900&q=82";
    if(["ready","oil","blend","bakhoor","oud","gift"].includes(type)||p.supplierCatalogItem===true){
      const categoryLabel=type==="oil"||type==="blend"?"الزيوت والتركيب":type==="bakhoor"||type==="oud"?"العود والبخور":type==="gift"?"الهدايا":"العطور الجاهزة";
      return '<div class="product-photo-stage"><img class="product-photo" src="'+categoryPhoto+'" alt="صورة واقعية إلهامية لفئة '+categoryLabel+'؛ لا تمثل بالضرورة العبوة التجارية لهذا المنتج" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="product-image-note">صورة توضيحية للفئة</span></div>';
    }
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
    const liquid=shape==="oil"?'<path d="M75 111Q90 108 105 111V124Q105 131 98 131H82Q75 131 75 124Z" fill="'+colors[0]+'" fill-opacity=".28"/>':shape==="oriental"?'<path d="M60 111Q90 106 120 111V124Q120 132 110 132H70Q60 132 60 124Z" fill="'+colors[0]+'" fill-opacity=".3"/>':'<path d="M60 111Q90 105 120 111V124Q120 133 109 133H71Q60 133 60 124Z" fill="'+colors[0]+'" fill-opacity=".25"/>';
    return '<div class="placeholder-bottle bottle-'+shape+'" data-family="'+escapeHTML(family)+'" role="img" aria-label="رسم أصلي توضيحي لعبوة عطر '+escapeHTML(labelName)+' بطابع '+escapeHTML(family)+'، وليس صورة العبوة التجارية الأصلية"><svg viewBox="0 0 180 180" aria-hidden="true"><defs><linearGradient id="'+uid+'glass" x1="0" x2="1" y1="0" y2="1"><stop stop-color="'+colors[1]+'"/><stop offset=".5" stop-color="'+colors[0]+'"/><stop offset="1" stop-color="#fff" stop-opacity=".68"/></linearGradient><linearGradient id="'+uid+'cap" x1="0" x2="1"><stop stop-color="#fff0b2"/><stop offset=".48" stop-color="#d4af37"/><stop offset="1" stop-color="#8b6225"/></linearGradient><linearGradient id="'+uid+'shine" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><ellipse cx="90" cy="153" rx="48" ry="7" fill="#100a10" opacity=".35"/>'+cap+bottle+' fill="url(#'+uid+'glass)" stroke="#fff8e8" stroke-opacity=".8" stroke-width="1.7"/>'+liquid+'<path d="M68 61h7v61q0 5 4 7h-5q-7 0-7-8Z" fill="url(#'+uid+'shine)"/><path d="M113 67v51q0 8-7 9" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2"/><rect x="65" y="88" width="50" height="31" rx="'+(shape==="square"?1:4)+'" fill="#fff8eb" fill-opacity=".92" stroke="#d4af37" stroke-width="1"/><text x="90" y="99" text-anchor="middle" font-size="5.8" fill="#66502a" font-family="Georgia,serif" letter-spacing=".8">MAMLKAT</text><text x="90" y="108" text-anchor="middle" font-size="5" fill="#8b6225" font-family="Arial,sans-serif">AL-OTOR</text><path d="M75 112h30" stroke="#d4af37" stroke-width=".6"/><text x="90" y="116" text-anchor="middle" font-size="4.5" fill="#66502a">'+escapeHTML(labelName)+'</text><path d="M78 128q12 5 24 0" stroke="#fff" stroke-opacity=".55" fill="none"/></svg><span class="bottle-art-note">رسم توضيحي أصلي</span></div>';
  }
  function supplierRetailRate(p){
    // لا نفترض أن الزيت فرنسي أو شرقي من الاسم أو من فئة الرجال/النساء.
    // نعرض سعر الجرام فقط إذا كان مسجلًا صراحة أو كانت الفئة الشرقية محددة بوضوح.
    let pricing={french:10,oriental:15,orientalPremium:20};
    try{const saved=JSON.parse(localStorage.getItem("mamlaka_catalog_taxonomy_config_v1")||"null");if(saved?.gramPricing)pricing={...pricing,...saved.gramPricing};}catch{}
    const positive=v=>Number.isFinite(Number(v))&&Number(v)>0?Number(v):null;
    const explicit=positive(p?.retailPricePerGram ?? p?.pricePerGram ?? p?.gramPrice);
    if(explicit!==null)return explicit;
    const tier=String(p?.retailPriceTier||p?.retailTier||"").toLowerCase();
    if(tier==="premium"||tier==="excellent"||tier==="ممتاز")return positive(pricing.orientalPremium);
    if(tier==="french"||tier==="فرنسي")return positive(pricing.french);
    if(tier==="oriental"||tier==="شرقي"||String(p?.supplierCategory||"").toUpperCase()==="ORIENTAL")return positive(pricing.oriental);
    return null;
  }
  function productCard(p) {
    const isSupplierOil = p.supplierCatalogItem === true;
    const fav = favorites.includes(p.id);
    const sizeList = Object.keys(sizes);
    const defaultSize = sizeList.find(s => currentPrice(p,s) != null) || sizeList[0];
    const price = currentPrice(p, defaultSize) ?? priceFor(p);
    const selected = cart.some(item => item.id === p.id && String(item.size) === String(defaultSize));
    const canBuy = Boolean(p.available) && currentPrice(p, defaultSize) != null && !isSupplierOil;
    const addLabel = isSupplierOil ? "اختيار للتركيب" : !p.available ? "التوفر قيد التأكيد" : currentPrice(p,defaultSize)==null ? "السعر قيد التأكيد" : selected ? "✓ تم الاختيار" : "أضف للسلة";
    const addTitle = isSupplierOil ? "اختيار هذا الزيت داخل طلب تركيب العطر" : !p.available ? "يلزم تأكيد التوفر قبل البيع" : currentPrice(p,defaultSize)==null ? "يلزم تحديد سعر معتمد قبل البيع" : "";
    const money = s => currentPrice(p,s)==null ? "السعر يحتاج تأكيد" : formatMoney(currentPrice(p,s));
    const category = ({"MEN":"رجالي","WOMEN":"نسائي","UNISEX":"للجنسين","ORIENTAL":"شرقي","KIDS":"أطفال","DIFFUSER":"فواحات"})[p.supplierCategory] || p.supplierCategory || p.gender || "";
    const shortMeta = isSupplierOil ? ((category || "زيت للتركيب")+(p.supplierSku?" · كود "+p.supplierSku:"")) : (p.brand && p.brand!=="غير محدد" ? p.brand : (p.gender || "عطر"));
    const oilFamilyLabel = isSupplierOil ? displayFamily(p.family||p.scentFamily||"",p.nameAr||p.nameEn||"") : (p.family||"");
    const priceControl = isSupplierOil
      ? '<div class="product-bottom compact-product-bottom"><span class="product-price">السعر حسب الكمية</span><span class="muted">'+escapeHTML(oilFamilyLabel)+'</span></div>'
      : '<div class="compact-size-row"><select id="card-size-'+escapeHTML(p.id)+'" class="card-size-select" data-card-size="'+escapeHTML(p.id)+'" aria-label="اختر حجم '+escapeHTML(p.nameAr||p.nameEn||"العطر")+'">'+sizeList.map(s=>'<option value="'+escapeHTML(s)+'" '+(s===defaultSize?"selected":"")+'>'+escapeHTML(s)+' مل · '+escapeHTML(money(s))+'</option>').join('')+'</select><strong class="compact-selected-price" data-card-price="'+escapeHTML(p.id)+'">'+escapeHTML(money(defaultSize))+'</strong></div>';
    return '<article class="product-card product-card-'+escapeHTML(p.productType||"ready")+(isSupplierOil?' product-card-supplier-oil':'')+'" data-product-type="'+escapeHTML(p.productType||"ready")+'" data-id="'+escapeHTML(p.id)+'">'+
      '<div class="product-visual">'+imageMarkup(p)+'<span class="product-badge">'+(isSupplierOil?'زيت للتركيب':p.needsReview?'يحتاج مراجعة':({"oil":"زيت","bakhoor":"عود وبخور","gift":"هدية","blend":"تركيب خاص","ready":"عطر جاهز"}[p.productType]||"عطر جاهز"))+'</span>'+(isSupplierOil&&!p.image?'<span class="product-image-note">رسم توضيحي</span>':p.referenceImage?'<span class="product-image-note">صورة مرجعية للعطر الأصلي</span>':"")+'<button class="favorite-btn '+(fav?"is-fav":"")+'" data-action="favorite" data-id="'+escapeHTML(p.id)+'" aria-label="إضافة للمفضلة">'+(fav?"♥":"♡")+'</button></div>'+
      '<div class="product-info compact-product-info"><h3>'+escapeHTML(p.nameAr||p.nameEn||"منتج جديد")+'</h3>'+
      (p.nameEn?'<div class="product-en" dir="ltr">'+escapeHTML(p.nameEn)+'</div>':"")+
      '<div class="product-meta compact-product-meta">'+escapeHTML(shortMeta)+'</div>'+
      priceControl+
      '<div class="product-actions"><button type="button" class="small-btn details-btn" data-action="details" data-id="'+escapeHTML(p.id)+'" aria-label="عرض تفاصيل '+escapeHTML(p.nameAr||p.nameEn||"العطر")+'" title="عرض تفاصيل العطر">ⓘ التفاصيل</button><button type="button" class="small-btn primary '+(selected?"is-selected":"")+'" data-action="add" data-id="'+escapeHTML(p.id)+'" '+(canBuy||isSupplierOil?"":"disabled")+' aria-pressed="'+String(selected)+'" title="'+escapeHTML(addTitle)+'">'+addLabel+'</button></div></div></article>';
  }
  function homeShowcaseCard(p,kind){
    const id=escapeHTML(p.id),name=escapeHTML(p.nameAr||p.nameEn||"منتج مسجل"),english=escapeHTML(p.nameEn||"");
    const isOil=kind==="oil";
    const family=escapeHTML(isOil?displayFamily(p.family||p.scentFamily||"",p.nameAr||p.nameEn||""):(p.family||"العائلة العطرية قيد التحديد"));
    const descRaw=String(p.scentNature||p.descriptionAr||"تفاصيل الرائحة قيد المراجعة.");
    const desc=escapeHTML(descRaw.length>150?descRaw.slice(0,147)+"…":descRaw);
    const meta=isOil?((p.gender&&p.gender!=="غير محدد"?escapeHTML(p.gender)+" · ":"")+"زيت للتركيب"+(p.supplierSku?" · "+escapeHTML(p.supplierSku):"")):((p.brand&&p.brand!=="غير محدد"?escapeHTML(p.brand):"الشركة تحتاج تأكيد")+(p.gender?" · "+escapeHTML(p.gender):""));
    const price=isOil?"اختر كمية الجرام وسعرها من تفاصيل المنتج":"السعر والتوفر يؤكدان قبل الطلب";
    return '<article class="home-showcase-card home-showcase-'+kind+'" data-id="'+id+'"><div class="home-showcase-visual">'+imageMarkup(p)+'<span class="home-showcase-badge">'+(p.needsReview?"بيانات تحتاج تأكيد":(isOil?"زيت للتركيب":"عطر جاهز"))+'</span>'+(isOil&&!p.image?'<span class="product-image-note">رسم توضيحي</span>':"")+'</div><div class="home-showcase-card-body"><div class="home-showcase-meta">'+meta+'</div><h4>'+name+'</h4>'+(english?'<div class="home-showcase-english" dir="ltr">'+english+'</div>':"")+'<p class="home-showcase-description">'+desc+'</p><div class="home-showcase-family"><span>الطابع</span><strong>'+family+'</strong></div><div class="home-showcase-price">'+price+'</div><div class="home-showcase-actions"><button class="small-btn" type="button" data-action="details" data-id="'+id+'">تفاصيل المنتج</button>'+(isOil?'<button class="small-btn primary" type="button" data-home-blend-id="'+id+'">اختيار للتركيب</button>':'<a class="small-btn primary" href="#ready">تصفح العطور</a>')+'</div></div></article>';
  }
  function renderHomeShowcase(){
    const readyRoot=$("#homeReadyProducts"),oilRoot=$("#homeOilProducts");
    if(!readyRoot||!oilRoot)return;
    const readyAll=products.filter(p=>p.productType==="ready");
    const oilAll=products.filter(p=>p.supplierCatalogItem===true);
    const ready=readyAll.filter(p=>p.available!==false).slice(0,4);
    const usefulOils=oilAll.filter(p=>p.family&&p.family!=="غير محدد"&&p.scentNature&&!/تفاصيل الرائحة تحتاج|الطابع العطري يحتاج/.test(String(p.scentNature)));
    const seen=new Set(usefulOils.map(p=>p.id));
    const oils=[...usefulOils,...oilAll.filter(p=>!seen.has(p.id))].slice(0,6);
    readyRoot.innerHTML=ready.length?ready.map(p=>homeShowcaseCard(p,"ready")).join(""):'<p class="home-showcase-empty">لا توجد عطور جاهزة معتمدة للعرض حاليًا. يمكن استعراض الأسماء المسجلة من الكتالوج الكامل.</p>';
    oilRoot.innerHTML=oils.length?oils.map(p=>homeShowcaseCard(p,"oil")).join(""):'<p class="home-showcase-empty">لا توجد بيانات زيوت محمّلة حاليًا.</p>';
    // اعرض صورًا من بطاقات المنتجات الفعلية داخل الفهرس، مع توضيح الصور الإلهامية غير المؤكدة.
    const indexRepresentatives = [
      ['#oil-catalog', oils[0] || oilAll[0] || {id:'index-oil-preview',nameAr:'الزيوت العطرية',productType:'oil'}, 'oil'],
      ['#ready', ready[0] || readyAll[0] || {id:'index-ready-preview',nameAr:'العطور الجاهزة',productType:'ready'}, 'ready'],
      ['#blend', oils[1] || oilAll[0] || {id:'index-blend-preview',nameAr:'تركيب العطور',productType:'oil'}, 'oil'],
      ['#scent-classification', ready[1] || ready[0] || readyAll[0] || {id:'index-family-preview',nameAr:'العائلات العطرية',productType:'ready'}, 'ready'],
      ['#bakhoor', products.find(p => ['bakhoor','oud'].includes(String(p.productType||'').toLowerCase())) || {id:'index-bakhoor-preview',nameAr:'العود والبخور',productType:'bakhoor'}, 'bakhoor'],
      ['#gift', products.find(p => p.productType === 'gift') || {id:'index-gift-preview',nameAr:'الهدايا والتغليف',productType:'gift'}, 'gift'],
      ['#advisor', ready[2] || ready[0] || readyAll[0] || {id:'index-advisor-preview',nameAr:'مستشار العطور',productType:'ready'}, 'ready'],
      ['#howToChoose', ready[0] || readyAll[0] || {id:'index-guide-preview',nameAr:'دليل التسوق',productType:'ready'}, 'ready'],
      ['#homeCatalog', ready[0] || readyAll[0] || {id:'index-catalog-preview',nameAr:'مختارات العطور',productType:'ready'}, 'ready']
    ];
    indexRepresentatives.forEach(([href, product, kind]) => {
      const card = document.querySelector('.home-index-card[href="'+href+'"]');
      if (!card || !product) return;
      let preview = card.querySelector('.home-index-image');
      if (!preview) {
        preview = document.createElement('span');
        preview.className = 'home-index-image';
        preview.setAttribute('aria-hidden','true');
        const copy = card.querySelector('.home-index-copy');
        if (copy) card.insertBefore(preview, copy);
      }
      const oldIcon = card.querySelector('.home-index-icon');
      if (oldIcon) oldIcon.hidden = true;
      preview.innerHTML = imageMarkup({...product, productType: kind});
      const image = preview.querySelector('img');
      if (image) { image.alt = ''; image.loading = 'lazy'; image.decoding = 'async'; }
      if (!product.image && !preview.querySelector('.home-index-image-label')) {
        const label = document.createElement('span');
        label.className = 'home-index-image-label';
        label.textContent = 'صورة إلهامية';
        preview.appendChild(label);
      }
    });
    const readyCount=$("#homeReadyCount"),oilCount=$("#homeOilCount");
    if(readyCount)readyCount.textContent=readyAll.length.toLocaleString("ar-EG")+" عطر";
    if(oilCount)oilCount.textContent=oilAll.length.toLocaleString("ar-EG")+" زيت";
  }
  function renderProducts() {
    const searchInput=$("#productSearch"), genderInput=$("#genderFilter"), familyInput=$("#familyFilter");
    const q=norm(searchInput?.value||""), gender=genderInput?.value||"", family=familyInput?.value||"";
    const list=products.filter(p=>p.productType!=="oil" && p.productType!=="bakhoor" && (!gender||p.gender===gender) && (!family||p.family===family||displayFamily(p.family,p.nameAr||p.nameEn)===family) && (!q||matchesCatalogQuery(p,q)));
    const readyProducts=$("#readyProducts"), noProducts=$("#noProducts"), resultsMessage=$("#resultsMessage");
    if(readyProducts)readyProducts.innerHTML=list.map(productCard).join("");
    if(noProducts)noProducts.classList.toggle("hidden",list.length>0);
    if(resultsMessage)resultsMessage.textContent=`${list.length} منتج في الكتالوج المعروض · الأسماء التي تحمل «يحتاج مراجعة» غير معتمدة للبيع حتى مراجعتها.`;
    updateCounts();
    renderHomeShowcase();
  }
  let supplierVisibleLimit=24;
  function populateBlendOils(){
    const sel=$("#blendOil");if(!sel)return;const current=sel.value;
    const oils=products.filter(p=>p.supplierCatalogItem===true);
    sel.innerHTML='<option value="">اختر زيتًا من كتالوج الموردين</option>'+oils.map(p=>'<option value="'+escapeHTML(p.id)+'">'+escapeHTML(p.nameAr)+' — '+escapeHTML(p.nameEn)+'</option>').join('');
    if(oils.some(p=>p.id===current))sel.value=current;
  }
  function renderSupplierOils(){
    const grid=$("#supplierOilProducts");if(!grid)return;
    const all=products.filter(p=>p.supplierCatalogItem===true);
    const q=norm($("#supplierOilSearch")?.value||""),cat=$("#supplierOilCategory")?.value||"",family=$("#supplierOilFamily")?.value||"";
    const categoryMap={MEN:"رجالي",WOMEN:"نسائي",UNISEX:"للجنسين",ORIENTAL:"شرقي",KIDS:"أطفال",DIFFUSER:"فواحات"};
    const filtered=all.filter(p=>{const actualCategory=p.supplierCategory||({"رجالي":"MEN","نسائي":"WOMEN","للجنسين":"UNISEX","شرقي":"ORIENTAL","أطفال":"KIDS","فواحات":"DIFFUSER"}[p.gender]||"");const familyValue=p.family||p.scentFamily||p.chemicalProfileId||"غير محدد";return (!cat||actualCategory===cat)&&(!family||familyValue===family||displayFamily(familyValue,p.nameAr||p.nameEn)===family)&&(!q||matchesCatalogQuery({...p,descriptionAr:p.scentNature,topNotes:p.topNotes,heartNotes:p.heartNotes,baseNotes:p.baseNotes},q)||norm([p.supplierSku,p.supplierCategory,p.scentNotesProfile].join(" ")).includes(q));});
    const visible=filtered.slice(0,supplierVisibleLimit);
    grid.innerHTML=visible.map(productCard).join("");
    const counts={MEN:0,WOMEN:0,UNISEX:0,ORIENTAL:0,KIDS:0,DIFFUSER:0};all.forEach(p=>{const k=p.supplierCategory||({"رجالي":"MEN","نسائي":"WOMEN","للجنسين":"UNISEX","شرقي":"ORIENTAL","أطفال":"KIDS","فواحات":"DIFFUSER"}[p.gender]||"");if(counts[k]!==undefined)counts[k]++;});
    const classified=all.reduce((n,p)=>n+(displayFamily(p.family||p.scentFamily||"",p.nameAr||p.nameEn||"")!=="غير محدد"?1:0),0);
    const summary=$("#supplierOilSummary"), emptyState=$("#noSupplierOilProducts"), moreButton=$("#supplierOilMore");
    if(summary)summary.textContent=all.length?("كتالوج الموردين: "+all.length+" صنفًا فريدًا حسب كود المورد · التصنيف حسب الاسم: "+classified+" · النتائج "+filtered.length+" · المعروض "+visible.length+" · رجالي "+counts.MEN+" · نسائي "+counts.WOMEN+" · للجنسين "+counts.UNISEX+" · شرقي "+counts.ORIENTAL+" · الأطفال "+counts.KIDS+" · الفواحات "+counts.DIFFUSER+". الأسعار القطاعي: 10 ج/جرام للفئات العامة، 15 ج/جرام للشرقي، و20 ج/جرام للشرقي الممتاز المحدد من الإدارة. التصنيف بالاسم إرشادي ويحتاج مراجعة العينة."): "لم يتم تحميل ملف كتالوج الزيوت العام.";
    if(emptyState)emptyState.classList.toggle("hidden",filtered.length>0);
    if(moreButton)moreButton.classList.toggle("hidden",visible.length>=filtered.length);
  }
  $("#supplierOilSearch")?.addEventListener("input",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  $("#supplierOilCategory")?.addEventListener("change",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  function syncProductCardSelectionStates(){document.querySelectorAll(".product-card").forEach(card=>{const select=card.querySelector("[data-card-size]");if(!select)return;const id=select.dataset.cardSize,p=findProduct(id),size=String(select.value),price=currentPrice(p,size),chosen=cart.some(item=>item.id===id&&String(item.size)===size),button=card.querySelector('[data-action="add"]');if(!button)return;button.classList.toggle("is-selected",chosen);button.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":!p?.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":chosen?"✓ تم الاختيار":"أضف للسلة";button.disabled=!p?.supplierCatalogItem&&(!p?.available||price==null);button.setAttribute("aria-pressed",String(chosen));});}
  document.addEventListener("change",e=>{const select=e.target.closest("[data-card-size]");if(!select)return;const card=select.closest(".product-card");if(!card)return;const id=select.dataset.cardSize,p=findProduct(id),size=String(select.value),price=currentPrice(p,size),priceLine=card.querySelector("[data-card-price]"),basePrice=card.querySelector(".product-price"),button=card.querySelector('[data-action="add"]');if(priceLine)priceLine.textContent=price==null?"السعر يحتاج تأكيد":formatMoney(price);if(basePrice)basePrice.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":price==null?"السعر قيد التأكيد":formatMoney(price);if(!button)return;const chosen=cart.some(item=>item.id===id&&String(item.size)===size);button.classList.toggle("is-selected",chosen);button.textContent=p?.supplierCatalogItem?"للاختيار والتركيب":!p?.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":chosen?"✓ تم الاختيار":"أضف للسلة";button.disabled=!p?.supplierCatalogItem&&(!p?.available||price==null);button.setAttribute("aria-pressed",String(chosen));});
  $("#supplierOilFamily")?.addEventListener("change",()=>{supplierVisibleLimit=24;renderSupplierOils()});
  $("#supplierOilMore")?.addEventListener("click",()=>{supplierVisibleLimit+=24;renderSupplierOils()});
  document.querySelectorAll("[data-scent-family]").forEach(card=>card.addEventListener("click",()=>{const fam=card.dataset.scentFamily, familyFilter=$("#supplierOilFamily");if(!familyFilter)return;familyFilter.value=fam;supplierVisibleLimit=24;renderSupplierOils()}));
  function updateCounts(){ const count=cart.reduce((n,x)=>n+x.qty,0); ["#cartCount","#cartCountIndex"].forEach(selector=>{const node=$(selector);if(node)node.textContent=count;}); const favCount=$("#favCount"); if(favCount)favCount.textContent=favorites.length; }
  function toggleFavorite(id){ favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save(STORAGE.fav,favorites);renderProducts();notify(favorites.includes(id)?"أُضيف إلى المفضلة":"أُزيل من المفضلة"); }
  function addToCart(id,size="10",priceOverride=null,custom=null){
    const p=findProduct(id);
    if(!custom && (!p || !p.available || currentPrice(p,size)==null)){notify("السعر أو التوفر غير مؤكد. تواصل مع المتجر قبل الطلب.");return;}
    const price=priceOverride!=null?Number(priceOverride):currentPrice(p,size);
    if(!Number.isFinite(price)||price<0){notify("السعر غير صالح.");return;}
    const key=`${id}:${size}:${custom?.label||""}`;
    const old=cart.find(x=>x.key===key);
    if(old)old.qty+=1;else cart.push({key,id,size:String(size),qty:1,price,nameAr:custom?.nameAr||p?.nameAr||"تركيبة خاصة",nameEn:custom?.nameEn||p?.nameEn||"",custom:custom||null});
    save(STORAGE.cart,cart);updateCounts();notify("تمت الإضافة إلى السلة");if($("#cartDrawer")?.classList.contains("open"))renderCart();
  }
  function renderCart(){
    const el=$("#cartItems");
    if(!el)return;
    if(!cart.length){
      el.innerHTML='<div class="cart-empty-state"><span aria-hidden="true">🛍</span><h3>السلة فارغة حاليًا</h3><p>اختر عطرًا أو زيتًا من الأقسام، وسيظهر هنا مع الحجم والسعر والكمية.</p><button type="button" class="btn btn-gold" id="cartEmptyBrowse">استعراض العطور</button></div>';
      const total=$("#cartTotal");if(total)total.textContent=formatMoney(0);
      return;
    }
    el.innerHTML=cart.map(item=>{
      const product=findProduct(item.id);
      const type=product?.supplierCatalogItem?"زيت للتركيب":product?.productType==="bakhoor"?"عود وبخور":product?.productType==="gift"?"هدية":product?.productType==="oil"?"زيت عطري":"عطر جاهز";
      const quantity=Math.max(1,Number(item.qty)||1);
      const unitPrice=Number(item.price)||0;
      const lineTotal=unitPrice*quantity;
      return '<article class="cart-line"><div class="cart-line-main"><div class="cart-line-title"><span class="cart-item-type">'+escapeHTML(type)+'</span><h3>'+escapeHTML(item.nameAr||item.nameEn||"منتج مسجل")+'</h3>'+(item.nameEn?'<p class="cart-item-en" dir="ltr">'+escapeHTML(item.nameEn)+'</p>':'')+'</div><dl class="cart-item-facts"><div><dt>'+((item.custom?.unit==="gram")?"الكمية":"الحجم")+'</dt><dd>'+escapeHTML(item.custom?.unit==="gram"?(item.size||"غير محدد")+" جرام":(item.size||"غير محدد")+" مل")+'</dd></div><div><dt>'+((item.custom?.unit==="gram")?"إجمالي الكمية المختارة":"سعر القطعة")+'</dt><dd>'+formatMoney(unitPrice)+'</dd></div><div><dt>الكمية</dt><dd>'+quantity+'</dd></div><div class="cart-item-subtotal"><dt>إجمالي هذا المنتج</dt><dd>'+formatMoney(lineTotal)+'</dd></div></dl>'+(item.custom?.description?'<p class="cart-item-custom"><strong>تفاصيل الاختيار:</strong> '+escapeHTML(item.custom.description)+'</p>':'')+'</div><div class="cart-line-actions"><button type="button" class="qty-btn" data-cart="minus" data-key="'+escapeHTML(item.key)+'" aria-label="تقليل الكمية">−</button><span class="cart-qty-value" aria-label="الكمية">'+quantity+'</span><button type="button" class="qty-btn" data-cart="plus" data-key="'+escapeHTML(item.key)+'" aria-label="زيادة الكمية">+</button><button type="button" class="remove-btn" data-cart="remove" data-key="'+escapeHTML(item.key)+'">حذف المنتج</button></div></article>';
    }).join("");
    const total=$("#cartTotal");if(total)total.textContent=formatMoney(cart.reduce((n,x)=>n+(Number(x.price)||0)*(Number(x.qty)||1),0));
  }
  function openDrawer(){ const drawer=$("#cartDrawer"),backdrop=$("#drawerBackdrop");if(!drawer){notify("السلة غير متاحة في هذه الصفحة.");return;}if(backdrop)backdrop.classList.remove("hidden");drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.classList.add("locked");renderCart(); }
  function closeDrawer(){ const drawer=$("#cartDrawer"),backdrop=$("#drawerBackdrop");if(backdrop)backdrop.classList.add("hidden");if(drawer){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");}document.body.classList.remove("locked"); }
  function openDetails(id){
    const p=findProduct(id);if(!p)return;
    const sizeKeys=Object.keys(sizes),priced=sizeKeys.filter(s=>currentPrice(p,s)!=null);
    const defaultSize=priced.includes("10")?"10":(priced[0]||"10");
    const money=v=>v==null?"تواصل لتأكيد السعر":formatMoney(v);
    const notes=v=>Array.isArray(v)?(v.length?v.join("، "):"لم تُوثق بعد"):(v||"لم تُوثق بعد");
    const isOil=p.productType==="oil"||p.supplierCatalogItem;const gramRate=p.supplierCatalogItem?supplierRetailRate(p):null;
    const noteDisclaimer=p.notesDisclaimer||(isOil?"نوتات العطر المرجعي للاستدلال فقط؛ لا تؤكد التركيبة الفعلية لزيت المورد.":"النوتات المنشورة وصف عطري إرشادي وليست كشفًا للصيغة الكيميائية الكاملة.");
     const productDescription=String(p.scentNature||p.descriptionAr||"").trim();
     const referenceQuery=encodeURIComponent([p.nameEn||p.nameAr,p.brand].filter(Boolean).join(" "));
     const allowedResearchUrl=url=>typeof url==="string"&&/^https:\/\/(?:www\.)?(?:lattafa\.com|fragrantica\.com|basenotes\.com|ortoparisi\.com|parfumo\.com|fragranote\.com|lattafaindia\.com|kayali\.com|us\.kayali\.com|arabianoud\.com|eg\.arabianoud\.com|lacoste\.com|guylaroche\.com|mugler\.com|carolinaherrera\.com|davidoff\.com|aramis\.com|ralphlaurenfragrances\.com|chanel\.com)\//i.test(url); const sourceList=[...(Array.isArray(p.notesResearchSources)?p.notesResearchSources:[]),p.sourceUrl].filter((url,index,all)=>allowedResearchUrl(url)&&all.indexOf(url)===index); const savedResearchSources=sourceList.map(url=>{const host=url.match(/^https:\/\/([^/]+)/i)?.[1]||"مصدر";return `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(host)}</a>`;}).join("");
    const referenceLinks=`<div class="modal-source-search"><b>مصادر التحقق من النوتات وصورة العطر</b><div class="modal-source-links"><a href="https://www.google.com/search?q=${referenceQuery}+site%3Afragrantica.com" target="_blank" rel="noopener noreferrer">Fragrantica</a><a href="https://www.google.com/search?q=${referenceQuery}+site%3Abasenotes.com" target="_blank" rel="noopener noreferrer">Basenotes</a><a href="https://www.google.com/search?q=${referenceQuery}+site%3Aparfumo.com" target="_blank" rel="noopener noreferrer">Parfumo</a><a href="https://www.google.com/search?q=${referenceQuery}+official+fragrance+notes" target="_blank" rel="noopener noreferrer">الموقع الرسمي</a><a href="https://www.google.com/search?tbm=isch&q=${referenceQuery}+perfume+bottle" target="_blank" rel="noopener noreferrer">بحث صور العبوة</a>${savedResearchSources}</div><small>اعتمد النوتات فقط بعد مطابقة الاسم والشركة والإصدار. نتائج الصور للمعاينة والتحقق وليست صورًا معتمدة تلقائيًا للمتجر؛ قد تختلف النوتات بين الإصدارات، ولا تثبت نوتات العطر المرجعي تركيبة زيت المورد.</small></div>`;
    const hasNotes=[p.topNotes,p.heartNotes,p.baseNotes].some(v=>Array.isArray(v)&&v.length);
    const modalContent=$("#modalContent"), modal=$("#modalBackdrop");
    if(!modalContent||!modal){notify("تفاصيل المنتج غير متاحة في هذه الصفحة.");return;}
    modalContent.innerHTML=`<div class="modal-product"><div class="modal-product-image">${imageMarkup(p)}</div><div class="modal-product-copy" dir="rtl"><p class="eyebrow">MAMLKAT AL-OTOR · تفاصيل العطر</p><h2 id="modalTitle">${escapeHTML(p.nameAr||"منتج")}</h2><div class="product-en" dir="ltr">${escapeHTML(p.nameEn||"")}</div><p class="modal-description">${escapeHTML(productDescription||"لا يتوفر وصف عطري موثق لهذا المنتج حتى الآن.")}</p>${p.imageDisclaimer?'<p class="note-disclaimer">'+escapeHTML(p.imageDisclaimer)+'</p>':""}<div class="modal-facts"><p><b>النوع</b><span>${escapeHTML(p.productType==="oil"?"زيت عطري للتركيب":p.productType==="bakhoor"?"عود أو بخور":"عطر جاهز")}</span></p><p><b>الفئة</b><span>${escapeHTML(p.gender||"غير محدد")}</span></p><p><b>الطابع</b><span>${escapeHTML(p.scentNature||"يحتاج إلى تقييم العينة")}</span></p><p><b>العائلة العطرية</b><span>${escapeHTML(isOil?displayFamily(p.family||p.scentFamily||"",p.nameAr||p.nameEn||""):p.family||"غير محددة")}</span></p>${p.referenceHouse?`<p><b>العلامة / دار العطر المرجعي</b><span>${escapeHTML(p.referenceHouse)}</span></p>`:""}${p.supplierCatalogItem?`<p><b>كود المورد</b><span dir="ltr">${escapeHTML(p.supplierSku||p.sku||"غير محدد")}</span></p><p><b>خط المورد</b><span>${escapeHTML(p.supplierLine||"غير محدد")}</span></p><p><b>سعر الجرام</b><span>${formatMoney(supplierRetailRate(p))}</span></p>`:""}</div><details class="fragrance-note-pyramid"><summary>تفاصيل النوتات العطرية</summary><p><b>المقدمة:</b> ${escapeHTML(notes(p.topNotes))}</p><p><b>القلب:</b> ${escapeHTML(notes(p.heartNotes))}</p><p><b>القاعدة:</b> ${escapeHTML(notes(p.baseNotes))}</p><p class="note-disclaimer">${escapeHTML(noteDisclaimer)}</p>${p.notesConfidence?`<p class="note-confidence"><b>حالة التوثيق:</b> ${escapeHTML(p.notesConfidence)}</p>`:""}${!hasNotes?'<p class="modal-review-note">لم نعثر على نوتات موثوقة لهذا الاسم والإصدار حتى الآن؛ لن نضيف معلومات تخمينية. حدّد الشركة والإصدار أو أرسل صورة العبوة لاستكمال التحقق.</p>':""}</details>${p.sourceUrl&&/^https:\/\//i.test(p.sourceUrl)?`<p class="modal-source"><b>مصدر النوتات:</b> <a href="${escapeHTML(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">فتح المصدر المرجعي</a></p>`:""}${referenceLinks}${p.needsReview?'<p class="modal-review-note">بعض تفاصيل النوع أو الإصدار تحتاج إلى مراجعة. اسأل المتجر عن التوفر قبل إتمام الطلب.</p>':""}${p.supplierCatalogItem?`<div class="purchase-panel blend-minimum-price"><strong>اختيار كمية الزيت</strong><p class="purchase-hint">${p.referenceImage?"الصورة مرجع لعبوة العطر الأصلي وليست صورة مؤكدة لزيت المورد. ":"لا توجد صورة موثقة لزيت المورد؛ أي رسم ظاهر توضيحي. "}${hasNotes?"النوتات تخص العطر الأصلي المرجعي ولا تثبت تطابق الزيت.":"لم تتوفر نوتات موثقة لهذا الاسم والإصدار؛ لن نضيف نوتات تخمينية."}</p><label for="modalGrams">الكمية بالجرام</label><input id="modalGrams" type="number" min="1" max="1000" step="1" value="5" inputmode="numeric" aria-label="اختر كمية الزيت بالجرام"><div class="modal-price-row"><span>سعر الجرام</span><strong id="modalGramRate" aria-live="polite">${gramRate==null?"السعر يحتاج مراجعة":formatMoney(gramRate)}</strong></div><div class="modal-price-row"><span>الإجمالي للكمية</span><strong class="modal-price" id="modalGramTotal" aria-live="polite">${gramRate==null?"تواصل لتأكيد السعر":formatMoney(gramRate*5)}</strong></div><p class="purchase-hint" id="purchaseHint">${gramRate==null?"سعر الجرام غير محدد لهذا النوع؛ لن نحسب سعرًا تخمينيًا.":"عدّل كمية الجرام لمشاهدة الإجمالي، ثم أضف الكمية إلى السلة."}</p></div>`:`<div class="purchase-panel"><label for="modalSize">اختر حجم العبوة</label><select id="modalSize" aria-label="اختر حجم العطر">${sizeKeys.map(s=>`<option value="${escapeHTML(s)}" ${s===defaultSize?"selected":""}>${escapeHTML(s)} مل · ${escapeHTML(money(currentPrice(p,s)))}</option>`).join("")}</select><div class="modal-price-row"><span>سعر الحجم المختار</span><strong class="modal-price" aria-live="polite">${money(currentPrice(p,defaultSize))}</strong></div><p class="purchase-hint" id="purchaseHint">${p.available?"اختر الحجم المناسب ثم أضف المنتج إلى السلة.":"الطلب ينتظر تأكيد السعر والتوفر من المتجر."}</p></div>`}<div class="modal-actions"><button class="btn btn-gold" id="modalAdd" ${!p.supplierCatalogItem&&(!p.available||currentPrice(p,defaultSize)==null)?"disabled":""}>${p.supplierCatalogItem?"اختيار الزيت للتركيب":!p.available?"التوفر قيد التأكيد":currentPrice(p,defaultSize)==null?"السعر قيد التأكيد":"أضف للسلة"}</button><button class="btn btn-outline" id="speakDetails">استمع للوصف</button></div><div class="product-page-end"><span>نهاية تفاصيل المنتج</span><button type="button" id="modalEndBack">← رجوع للمنتجات</button></div></div></div>`;
    modal.classList.remove("hidden");modal.setAttribute("aria-hidden","false");const modalEndBack=$("#modalEndBack");if(modalEndBack)modalEndBack.onclick=closeModal;
    const add=$("#modalAdd"),select=$("#modalSize"),gramsInput=$("#modalGrams");
    if(!add){notify("زر إضافة المنتج غير متاح.");return;}
    add.onclick=()=>{if(p.supplierCatalogItem){const gramsInput=$("#modalGrams"),grams=Number(gramsInput?.value),rate=supplierRetailRate(p);if(rate==null){notify("سعر الجرام غير محدد لهذا الزيت. لن نضيف سعرًا تخمينيًا؛ تواصل مع المتجر أو راجع تصنيف السعر في الإدارة.");return;}if(!Number.isInteger(grams)||grams<1||grams>1000){notify("اختر كمية صحيحة من 1 إلى 1000 جرام.");gramsInput?.focus();return;}const total=rate*grams;addToCart(id,String(grams)+" جرام",total,{label:"شراء زيت بالجرام",unit:"gram",grams,rate,description:formatMoney(rate)+" للجرام × "+grams+" جرام = "+formatMoney(total)});closeModal();return;}if(!select){notify("اختر الحجم من تفاصيل المنتج.");return;}if(!p.available){notify("التوفر غير معتمد بعد؛ تواصل مع المتجر للتأكيد.");return;}if(currentPrice(p,select.value)==null){notify("سعر هذا الحجم غير محدد حاليًا.");return;}addToCart(id,select.value);};
    if(gramsInput){const updateGramTotal=()=>{const grams=Number(gramsInput.value),total=Number.isInteger(grams)&&grams>=1&&grams<=1000&&gramRate!=null?grams*gramRate:null,el=$("#modalGramTotal");if(el)el.textContent=total==null?"تواصل لتأكيد السعر":money(total);if(add)add.disabled=gramRate==null||!Number.isInteger(grams)||grams<1||grams>1000;};gramsInput.addEventListener("input",updateGramTotal);updateGramTotal();}if(select)select.onchange=()=>{const price=currentPrice(p,select.value);const el=$("#modalContent .modal-price");if(el)el.textContent=money(price);add.disabled=!p.available||price==null;add.textContent=!p.available?"التوفر قيد التأكيد":price==null?"السعر قيد التأكيد":"أضف للسلة";const hint=$("#purchaseHint");if(hint)hint.textContent=price==null?"لا يوجد سعر معتمد لهذا الحجم؛ اختر حجمًا آخر أو تواصل مع المتجر.":p.available?"السعر المعروض للحجم المحدد.":"السعر ظاهر لكن التوفر يحتاج إلى تأكيد.";};
    const speakButton=$("#speakDetails");if(speakButton)speakButton.onclick=()=>{if(!("speechSynthesis"in window)){notify("الشرح الصوتي غير مدعوم في هذا المتصفح.");return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${p.nameAr||""}. ${productDescription}`);u.lang="ar-EG";speechSynthesis.speak(u);};
    const closeButton=$("#closeModal");if(closeButton)closeButton.focus({preventScroll:true});
  }
  function closeModal(){
    const modal=$("#modalBackdrop");if(modal){modal.classList.add("hidden");modal.setAttribute("aria-hidden","true");}
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
      const hay=norm([p.family,p.scentNature,p.descriptionAr,p.nameAr,p.nameEn,p.gender,p.referenceHouse,p.referenceHouseAr,p.referenceSearchName,...(p.referenceSearchAliases||[])].join(" "));
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

    if(!list.length){replies.innerHTML=remoteWarning+'<div class="assistant-message">لم أجد تطابقًا موثوقًا في الكتالوج الحالي. جرّب اختيار طابع آخر، أو اكتب اسم عطر محدد لنبحث عنه معك.</div><button type="button" class="small-btn" data-advisor-request>اطلب البحث عن عطر</button>';return;}
    const context=[matched?("الطابع: "+matched.label):"",gender?("الفئة: "+gender):"",budget!==null?("الميزانية المذكورة: "+budget+" ج.م"):"",daily?"الاستخدام: يومي":occasion?"الاستخدام: مناسبة":""] .filter(Boolean).join(" · ");
    replies.innerHTML=remoteWarning+`<div class="assistant-message"><strong>ترشيحات مبدئية من الكتالوج</strong><br>${escapeHTML(context||"رتّبت النتائج حسب قربها من وصفك.")}<br>التوصيات إرشادية وتعتمد على بيانات المنتج المسجلة؛ جرّب العطر وتأكد من السعر والتوفر مع المتجر قبل الشراء.</div>`+list.map(({p,price})=>`<div class="suggestion"><div><h4>${escapeHTML(p.nameAr||p.nameEn||"عطر مسجل")} <span class="product-en">${escapeHTML(p.nameEn||"")}</span></h4><p>${escapeHTML(p.family||"عائلة غير محددة")} · ${price==null?"السعر يحتاج إلى تأكيد":formatMoney(price)}${p.needsReview?" · بيانات تحتاج مراجعة":""}</p><small>${escapeHTML((p.scentNature||p.descriptionAr||"الطابع العطري يحتاج إلى مراجعة").slice(0,150))}</small></div><button class="small-btn" data-action="details" data-id="${escapeHTML(p.id)}">التفاصيل</button></div>`).join("");
  }
  function recordSearchTerm(name, source="بحث الكتالوج"){
    const term=String(name||"").trim().replace(/\s+/g," ").slice(0,140);
    if(term.length<2)return;
    const key=norm(term);
    const matched=products.some(p=>norm([p.nameAr,p.nameEn,p.brand,p.referenceHouse,p.referenceHouseAr,p.referenceSearchName,...(p.referenceSearchAliases||[])].join(" ")).includes(key));
    const req=safeRead(STORAGE.requests,[]);
    const old=req.find(x=>norm(x.name)===key);
    const now=new Date().toISOString();
    if(old){old.count=Math.max(1,Number(old.count)||1)+1;old.lastSearchedAt=now;old.matched=matched;if(source==="طلب عميل"){old.source=source;old.status="new";}}
    else req.unshift({name:term,source,count:1,matched,status:source==="طلب عميل"?"new":"search",createdAt:now,lastSearchedAt:now});
    save(STORAGE.requests,req.slice(0,300));
    document.dispatchEvent(new CustomEvent("mamlaka:requests-updated"));
  }
  function requestMissing(name){
    const term=String(name||"").trim().replace(/\s+/g," ").slice(0,140);
    if(!term)return;
    recordSearchTerm(term,"طلب عميل");
    const msg=`مرحبًا، أريد الاستفسار عن عطر أو نوع غير موجود في الكتالوج: ${term}`;
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
  }
  const translations = {
    ar:{ready:"العطور الجاهزة",oils:"الزيوت والتركيب",bakhoor:"العود والبخور",gift:"الهدايا",advisor:"مستشار العطور",visit:"تواصل معنا",home:"الرئيسية"},
    en:{ready:"Ready Perfumes",oils:"Oils & Blending",bakhoor:"Oud & Bakhoor",gift:"Gifts",advisor:"Scent Advisor",visit:"Contact",home:"Home"}
  };
  function setLanguage(lang){
    language=lang;save(STORAGE.lang,lang);document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.body.classList.toggle("en",lang==="en");const languageToggle=$("#languageToggle");if(languageToggle)languageToggle.textContent=lang==="ar"?"EN":"عربي";
    $$(".main-nav a").forEach(a=>{const k=a.dataset.nav;if(translations[lang][k])a.textContent=translations[lang][k];});
    notify(lang==="en"?"Navigation labels switched. Some product content remains in Arabic.":"تم تغيير لغة القوائم. بعض محتوى المنتجات ما زال بالعربية.");
  }
  document.addEventListener("click",e=>{
    const cartBrowse=e.target.closest("#cartEmptyBrowse");
    if(cartBrowse){closeDrawer();location.hash="#ready";return;}
    const homeBlend=e.target.closest("[data-home-blend-id]");if(homeBlend){const select=$("#blendOil");if(select){select.value=homeBlend.dataset.homeBlendId;if(select.value!==homeBlend.dataset.homeBlendId){notify("افتح كتالوج الزيوت لاختيار هذا النوع أو ابحث عنه بالاسم.");return;}location.hash="#blend";blendPrice();notify("تم اختيار الزيت. أكمل الحجم والعبوة ثم راجع الطلب.");}return;}
    const clickedProductImage=e.target.closest(".product-photo,.placeholder-bottle,.product-photo-stage,.product-visual img,.home-showcase-visual img");
    if(clickedProductImage && !e.target.closest("button,a,select,[data-action]")){
      const imageCard=clickedProductImage.closest(".product-card,.home-showcase-card");
      const imageId=imageCard?.dataset.id;
      if(imageId){openDetails(imageId);return;}
    }
    const action=e.target.closest("[data-action]");if(action){const {action:act,id}=action.dataset;if(act==="favorite")toggleFavorite(id);if(act==="add"&&findProduct(id)?.supplierCatalogItem){const oil=findProduct(id),sel=$("#blendOil");if(sel){sel.value=id;location.hash="#blend";notify("تم اختيار "+(oil.nameAr||oil.nameEn)+" للتركيب؛ أكمل اختيار الحجم والطلب.");}else{notify("تم تحديد الزيت؛ افتح قسم تركيب عطرك لإكمال الطلب.");location.hash="#blend";}}else if(act==="add"){const card=e.target.closest(".product-card"),size=card?.querySelector("[data-card-size]")?.value||"10";addToCart(id,size);const chosen=cart.some(item=>item.id===id&&String(item.size)===String(size));const button=card?.querySelector('[data-action="add"]');if(button){button.classList.toggle("is-selected",chosen);button.textContent=chosen?"✓ تم الاختيار":(findProduct(id)?.supplierCatalogItem?"للاختيار والتركيب":"أضف للسلة");button.setAttribute("aria-pressed",String(chosen));}}if(act==="details")openDetails(id);}
    const ca=e.target.closest("[data-cart]");if(ca){const item=cart.find(x=>x.key===ca.dataset.key);if(!item)return;if(ca.dataset.cart==="plus")item.qty=Math.min(99,Number(item.qty)+1);if(ca.dataset.cart==="minus")item.qty=Number(item.qty)-1;if(ca.dataset.cart==="remove"||item.qty<=0)cart=cart.filter(x=>x.key!==item.key);save(STORAGE.cart,cart);renderCart();updateCounts();syncProductCardSelectionStates();}
  });
  let searchLogTimer=null;
  bind("#productSearch","input",()=>{renderProducts();if(searchLogTimer)window.clearTimeout(searchLogTimer);searchLogTimer=window.setTimeout(()=>{const term=$("#productSearch")?.value||"";if(term.trim().length>=2)recordSearchTerm(term,"بحث الكتالوج");},700);});
  bind("#genderFilter", "change",renderProducts);bind("#familyFilter", "change",renderProducts);
  bind("#requestMissingBtn", "click",()=>{const name=$("#productSearch").value.trim();if(!name){notify("اكتب اسم العطر الذي تبحث عنه أولًا.");$("#productSearch").focus();return;}requestMissing(name);notify("تم تسجيل طلب البحث وفتح واتساب لإرساله.");});
  bind("#searchFocus", "click",()=>{location.hash="#ready";window.setTimeout(()=>$("#productSearch")?.focus(),100);});
  bind("#favoritesShortcut", "click",()=>{const fav=products.filter(p=>favorites.includes(p.id));if(!fav.length){notify("قائمة المفضلة فارغة.");return;}$("#productSearch").value="";$("#genderFilter").value="";$("#familyFilter").value="";$("#readyProducts").innerHTML=fav.map(productCard).join("");$("#resultsMessage").textContent=`${fav.length} منتج في المفضلة`;$("#noProducts").classList.add("hidden");location.hash="#ready";});
  bind("#cartShortcut", "click",openDrawer);bind("#cartShortcutIndex", "click",openDrawer);bind("#closeDrawer", "click",closeDrawer);bind("#cartEndBack", "click",closeDrawer);bind("#drawerBackdrop", "click",closeDrawer);
  bind("#closeModal", "click",closeModal);bind("#modalBackdrop", "click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
  bind("#checkoutBtn", "click",checkout);bind("#clearCart", "click",()=>{cart=[];save(STORAGE.cart,cart);renderCart();updateCounts();syncProductCardSelectionStates();notify("تم إفراغ السلة.");});
  bind("#blendSize", "change",blendPrice);
  bind("#addBlend", "click",()=>{
    const size=$("#blendSize").value,family=$("#blendScent").value,bottle=$("#blendBottle").value;
    const oilId=$("#blendOil")?.value||"",oil=findProduct(oilId),oilName=oil?(oil.nameAr||oil.nameEn):"زيت يختاره المتجر";
    const label=`تركيبة-${family}-${size}-${bottle}-${oil?.supplierSku||"اختيار-المتجر"}`;
    addToCart("custom-"+Date.now(),size,retailSizePrice(size),{nameAr:`تركيبة ${family}`,nameEn:"Custom Blend",label,description:`الزيت الأساسي: ${oilName}، العائلة: ${family}، ${size} مل، ${bottle}`});
    const last=cart[cart.length-1];if(last&&last.custom)last.nameAr=`تركيبة ${family} — ${oilName} (${bottle})`;
    save(STORAGE.cart,cart);updateCounts();
  });
  bind("#advisorForm", "submit",e=>{e.preventDefault();submitAdvisor($("#advisorInput").value);});
  document.querySelectorAll("[data-advisor-prompt]").forEach(button=>button.addEventListener("click",()=>{const prompt=button.dataset.advisorPrompt||"",input=$("#advisorInput");if(!input)return;input.value=prompt;submitAdvisor(prompt);}));
  const advisorReplies=$("#advisorReplies");if(advisorReplies)advisorReplies.addEventListener("click",e=>{if(e.target.closest("[data-advisor-request]"))requestMissing($("#advisorInput")?.value.trim()||"اقتراح عطر مناسب");});
  const contactWhatsapp=$("#contactWhatsapp");if(contactWhatsapp)contactWhatsapp.href=`https://wa.me/${getWaNumber()}?text=${encodeURIComponent("مرحبًا، أريد الاستفسار عن منتجات مملكة العطور.")}`;
  // Keep product cards usable when a remote or uploaded product image fails to load.
  document.addEventListener("error", event => {
    const img = event.target;
    if (!img || img.tagName !== "IMG" || !img.classList.contains("product-photo") || img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    const fallback = document.createElement("div");
    fallback.className = "image-load-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", "صورة المنتج غير متاحة حالياً");
    fallback.textContent = "الصورة غير متاحة حالياً";
    img.replaceWith(fallback);
  }, true);
  // Clear, consistent visual feedback for every customer interaction.
  document.addEventListener("click",event=>{
    const target=event.target.closest("a,button,[role='button'],summary");
    if(!target||target.disabled)return;
    document.querySelectorAll(".is-clicked").forEach(node=>node.classList.remove("is-clicked"));
    target.classList.add("is-clicked");
    window.setTimeout(()=>target.classList.remove("is-clicked"),1800);
    if(target.matches("#mainNav a,[data-nav]")){
      document.querySelectorAll("#mainNav a[aria-current='page']").forEach(node=>node.removeAttribute("aria-current"));
      target.setAttribute("aria-current","page");
    }
  },true);
  const mainNav=$("#mainNav"), menuToggle=$("#menuToggle"), headerActions=document.querySelector(".header-actions"), headerActionsHome=headerActions?.parentElement;
  const compactMenu=()=>{if(!mainNav||!headerActions||!headerActionsHome)return;const mobile=window.matchMedia("(max-width: 850px)").matches;if(mobile){if(headerActions.parentElement!==mainNav)mainNav.appendChild(headerActions);}else if(headerActions.parentElement!==headerActionsHome){headerActionsHome.appendChild(headerActions);mainNav.classList.remove("open");if(menuToggle)menuToggle.setAttribute("aria-expanded","false");}};
  compactMenu();window.addEventListener("resize",compactMenu,{passive:true});
  bind("#menuToggle","click",()=>{if(!mainNav||!menuToggle)return;const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"إغلاق القائمة":"فتح القائمة");});
  if(mainNav){mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{mainNav.classList.remove("open");if(menuToggle)menuToggle.setAttribute("aria-expanded","false");}));mainNav.addEventListener("click",event=>{if(event.target.closest(".header-actions button")){mainNav.classList.remove("open");if(menuToggle)menuToggle.setAttribute("aria-expanded","false");}});}
  document.addEventListener("keydown",e=>{
    if(e.key!=="Escape")return;
    if(!$("#modalBackdrop").classList.contains("hidden"))closeModal();
    if($("#cartDrawer").classList.contains("open"))closeDrawer();
    const mainNav=$("#mainNav"),menuToggle=$("#menuToggle");if(mainNav?.classList.contains("open")){mainNav.classList.remove("open");if(menuToggle){menuToggle.setAttribute("aria-expanded","false");menuToggle.focus({preventScroll:true});}}
  });
  bind("#languageToggle", "click",()=>setLanguage(language==="ar"?"en":"ar"));
  bind("#voiceSearch", "click",()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){notify("البحث الصوتي غير مدعوم هنا. استخدم مربع البحث الكتابي.");return;}
    const rec=new SpeechRecognition();rec.lang=language==="ar"?"ar-EG":"en-US";rec.interimResults=false;rec.maxAlternatives=1;
    const voiceButton=$("#voiceSearch");if(!voiceButton)return;voiceButton.textContent="…";rec.onresult=e=>{const search=$("#productSearch");if(search){search.value=e.results[0][0].transcript;renderProducts();}};rec.onerror=()=>notify("تعذر بدء البحث الصوتي. تحقق من إذن الميكروفون.");rec.onend=()=>{if(voiceButton.isConnected)voiceButton.textContent="🎙";};try{rec.start();}catch{notify("تعذر بدء البحث الصوتي.");voiceButton.textContent="🎙";}
  });
  bind("#enterBtn", "click",()=>{save("mamlaka_intro_seen_v1",true);const intro=$("#intro");if(intro)intro.classList.add("dismissed");});
  bind("#skipIntro", "click",()=>{const intro=$("#intro");if(intro)intro.classList.add("dismissed");save("mamlaka_intro_seen_v1",true);});
  // Always show the royal entrance on a fresh page load; the visitor can enter or skip explicitly.
  // This avoids silently bypassing the entrance because an old localStorage flag remained set.
  const yearNode=$("#year");if(yearNode)yearNode.textContent=new Date().getFullYear();
  function syncAllProducts(){products=combineProducts();renderProducts();renderSupplierOils();renderCart();updateCounts();populateBlendOils();}
  document.addEventListener("mamlaka:products-updated",syncAllProducts);
  document.addEventListener("mamlaka:supplier-catalog-updated",syncAllProducts);
  setLanguage(language);renderProducts();renderSupplierOils();populateBlendOils();renderCart();updateCounts();blendPrice();loadPublicCatalog();
  // If search misses, offer a direct request without pretending the catalog contains the item.
  bind("#productSearch", "keydown",e=>{if(e.key==="Enter" && !products.some(p=>norm([p.nameAr,p.nameEn,p.brand,p.referenceHouse,p.referenceHouseAr,p.referenceSearchName,...(p.referenceSearchAliases||[])].join(" ")).includes(norm(e.target.value)))){if(e.target.value.trim()){recordSearchTerm(e.target.value.trim(),"بحث غير مطابق");if(confirm(`لم نعثر على «${e.target.value.trim()}». تم تسجيل كلمة البحث في الإعدادات. هل تريد إرسال طلب للمتجر عبر واتساب؟`))requestMissing(e.target.value.trim());}}});
})();