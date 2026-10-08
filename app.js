
/* =========================================================
   مملكة العطور
   CROWN · MAISON DE PARFUM
   app.js
   ========================================================= */

"use strict";


/* =========================================================
   الإعدادات الأساسية
   ========================================================= */

const DEFAULT_SETTINGS = {
  whatsapp: "201272776928",

  address: "الإسكندرية – شارع خالد بن الوليد",

  brand: "مملكة العطور",

  tagline: "CROWN · MAISON DE PARFUM",

  heroTitle: "عطور تُخلّد لحظاتك",

  heroDesc:
    "اكشف توقيعك العطري من بين أكثر من 540 عطراً عالمياً — عطور تركيب فاخرة من أجود الزيوت الفرنسية والشرقية والخليجية.",

  currency: "ج.م",

  gold: "#c9a961",

  bg: "#0a0906",

  ink: "#f0e8d8",

  mixDiscount: 0.15
};


/* =========================================================
   تحميل الإعدادات
   ========================================================= */

function loadSettings() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem("crown_settings") || "null"
      );

    if (!saved) {
      return { ...DEFAULT_SETTINGS };
    }

    return {
      ...DEFAULT_SETTINGS,
      ...saved
    };

  } catch (error) {

    console.warn(
      "تعذر تحميل الإعدادات:",
      error
    );

    return {
      ...DEFAULT_SETTINGS
    };
  }
}


let SET = loadSettings();


/* =========================================================
   جداول المقاسات والأسعار
   ========================================================= */

const DEFAULT_SIZE_PRICE_TABLE = Object.freeze({
  3: 50,
  5: 75,
  10: 100,
  22: 130,
  30: 150,
  50: 200,
  100: 450
});


const PERFUME_SIZE_OPTIONS = Object.freeze([
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100
]);


const OIL_SIZE_OPTIONS = Object.freeze([
  3,
  5,
  7.5,
  10,
  12.5
]);


/* =========================================================
   مفاتيح الإدارة والحماية
   ========================================================= */

const ADMIN_SALT_KEY =
  "mamlaka_admin_salt_v1";

const ADMIN_HASH_KEY =
  "mamlaka_admin_hash_v1";

const ADMIN_SETUP_KEY =
  "mamlaka_admin_setup_v1";

const HISTORY_KEY =
  "mamlaka_change_history_v1";

const BACKUP_KEY =
  "mamlaka_auto_backups_v1";

const VOICE_KEY =
  "mamlaka_voice_enabled_v1";


/* =========================================================
   أدوات عامة
   ========================================================= */

function clone(value) {

  return JSON.parse(
    JSON.stringify(value)
  );

}


/* =========================================================
   توحيد بيانات المنتج
   ========================================================= */

function normalizeProductRecord(
  p,
  index = 0
) {

  const x = {
    ...p
  };

  x.id =
    x.id ||
    `catalog_${Date.now()}_${index}`;

  x.name =
    x.name ||
    x.nameEn ||
    x.nameAr ||
    "";

  x.nameEn =
    x.nameEn ||
    "";

  x.nameAr =
    x.nameAr ||
    x.name ||
    "";

  x.brand =
    x.brand ||
    x.brandAr ||
    "";

  x.brandAr =
    x.brandAr ||
    x.brand ||
    "";


  x.gender =
    ["M", "W", "U"].includes(x.gender)
      ? x.gender
      : "U";


  x.family =
    x.family ||
    "fresh";


  x.familyAr =
    x.familyAr ||
    (
      FAMILIES[x.family]?.ar ||
      ""
    );


  x.type =
    x.type ||
    "عطر";


  x.kind =
    x.kind ||
    (
      x.type === "زيت"
        ? "oil"
        : "perfume"
    );


  x.strength =
    x.strength ||
    "";


  x.manufactureDate =
    x.manufactureDate ||
    "";


  x.description =
    x.description ||
    "";


  x.stock =
    Number.isFinite(
      Number(x.stock)
    )
      ? Number(x.stock)
      : 0;


  x.needsReview =
    Boolean(
      x.needsReview
    );


  x.active =
    x.active !== false &&
    !x.needsReview;


  x.image =
    x.image ||
    "";


  x.releaseYear =
    x.releaseYear ||
    "";


  x.hall =
    x.hall ||
    "";


  x.manufacturer =
    x.manufacturer ||
    "";


  if (
    !Array.isArray(x.sizes)
  ) {

    x.sizes =
      (
        x.kind === "oil"
          ? OIL_SIZE_OPTIONS
          : PERFUME_SIZE_OPTIONS
      ).map(
        ml => ({
          ml,
          price:
            DEFAULT_SIZE_PRICE_TABLE[ml]
              ?? null
        })
      );

  }


  x.prices =
    x.sizes;


  return x;

}


/* =========================================================
   Hash محلي احتياطي
   ========================================================= */

function localHashText(text) {

  let h =
    2166136261;

  for (
    let i = 0;
    i < text.length;
    i++
  ) {

    h ^=
      text.charCodeAt(i);

    h =
      Math.imul(
        h,
        16777619
      );

  }

  return (
    h >>> 0
  )
    .toString(16)
    .padStart(8, "0");

}


/* =========================================================
   SHA-256
   ========================================================= */

async function sha256(text) {

  if (
    window.crypto?.subtle
  ) {

    const bytes =
      new TextEncoder()
        .encode(text);


    const digest =
      await crypto.subtle.digest(
        "SHA-256",
        bytes
      );


    return [
      ...new Uint8Array(
        digest
      )
    ]
      .map(
        b =>
          b
            .toString(16)
            .padStart(2, "0")
      )
      .join("");

  }


  return localHashText(
    text
  );

}


/* =========================================================
   النسخ الاحتياطي التلقائي
   ========================================================= */

function autoBackup(
  reason = "change"
) {

  try {

    const list =
      JSON.parse(
        localStorage.getItem(
          BACKUP_KEY
        ) || "[]"
      );


    list.unshift({

      at:
        new Date()
          .toISOString(),

      reason,

      products:
        clone(
          S.products
        ),

      settings:
        clone(
          SET
        ),

      orders:
        clone(
          getLocalOrdersSafe()
        )

    });


    localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify(
        list.slice(
          0,
          5
        )
      )
    );


  } catch (e) {

    console.warn(
      "تعذر إنشاء النسخة التلقائية",
      e
    );

  }

}


/* =========================================================
   قراءة الطلبات المحلية بأمان
   ========================================================= */

function getLocalOrdersSafe() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "crown_orders"
      ) || "[]"
    );

  } catch {

    return [];

  }

}


/* =========================================================
   سجل التغييرات
   ========================================================= */

function recordChange(
  action,
  before,
  after
) {

  try {

    const h =
      JSON.parse(
        localStorage.getItem(
          HISTORY_KEY
        ) || "[]"
      );


    h.unshift({

      id:
        `chg_${Date.now()}`,

      at:
        new Date()
          .toISOString(),

      action,

      before,

      after

    });


    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(
        h.slice(
          0,
          30
        )
      )
    );


  } catch (e) {}

}


/* =========================================================
   حالة التطبيق
   ========================================================= */

const STATE = {

  products: [],

  cart: [],

  wish: [],

  filter: "all",

  search: "",

  sort: "default",

  page: 0,

  perPage: 24,


  modal: {

    productId: null,

    sizeIndex: 1,

    packaging: "normal",

    bottleShape: "clear"

  },


  ai: {

    step: 0,

    answers: {

      gender: null,

      family: null,

      occasion: null,

      budget: null

    }

  }

};


/* =========================================================
   توافق رجعي
   بعض وظائف الإدارة القديمة تستخدم S
   ========================================================= */

const S =
  STATE;


/* =========================================================
   مخزن موحد
   جاهز لاحقاً للانتقال إلى API / Database
   ========================================================= */

const STORE = {

  key:
    "mamlaka_data_v2",

  version:
    2,

  state:
    STATE,

  meta: {

    updatedAt:
      null

  }

};


/* =========================================================
   أدوات DOM
   ========================================================= */

const $ =
  selector =>
    document.querySelector(
      selector
    );


const $$ =
  selector =>
    [
      ...document.querySelectorAll(
        selector
      )
    ];


/* =========================================================
   حماية HTML
   ========================================================= */

function esc(value) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   العملة
   ========================================================= */

function money(value) {

  const number =
    Number(
      value || 0
    );


  return (

    new Intl.NumberFormat(
      "ar-EG"
    ).format(
      number
    )

    + " "

    + SET.currency

  );

}


/* =========================================================
   عائلات العطور
   ========================================================= */

const FAMILIES = {

  fresh: {

    ar: "منعش",

    en: "Fresh"

  },


  floral: {

    ar: "زهري",

    en: "Floral"

  },


  woody: {

    ar: "خشبي",

    en: "Woody"

  },


  oriental: {

    ar: "شرقي",

    en: "Oriental"

  },


  sweet: {

    ar: "حلو",

    en: "Sweet"

  },


  gourmand: {

    ar: "حلويات",

    en: "Gourmand"

  },


  citrus: {

    ar: "حمضي",

    en: "Citrus"

  },


  musk: {

    ar: "مسك",

    en: "Musk"

  },


  oud: {

    ar: "عود",

    en: "Oud"

  },


  amber: {

    ar: "عنبر",

    en: "Amber"

  }

};


/* =========================================================
   أنواع المنتجات
   ========================================================= */

const PRODUCT_TYPES = {

  perfume: {

    ar: "عطر",

    en: "Perfume"

  },


  oil: {

    ar: "زيت عطري",

    en: "Perfume Oil"

  },


  mix: {

    ar: "تركيب",

    en: "Custom Mix"

  }

};


/* =========================================================
   ترجمة النوع
   ========================================================= */

function typeLabel(
  product
) {

  if (
    product?.kind === "oil"
  ) {

    return "زيت عطري";

  }


  if (
    product?.kind === "mix"
  ) {

    return "تركيب";

  }


  return "عطر";

}


/* =========================================================
   ترجمة الجنس
   ========================================================= */

function genderLabel(
  gender
) {

  switch (
    gender
  ) {

    case "M":

      return "رجالي";

    case "W":

      return "حريمي";

    default:

      return "يونيسكس";

  }

}


/* =========================================================
   فحص المقاس
   ========================================================= */

function sizeAllowed(
  product,
  ml
) {

  const allowed =
    product?.kind === "oil"

      ? OIL_SIZE_OPTIONS

      : PERFUME_SIZE_OPTIONS;


  return allowed.includes(
    Number(ml)
  );

}


/* =========================================================
   الحصول على سعر المقاس
   ========================================================= */

function getSizePrice(
  product,
  ml
) {

  const sizes =
    Array.isArray(
      product?.sizes
    )
      ? product.sizes
      : [];


  const item =
    sizes.find(
      x =>
        Number(x.ml) ===
        Number(ml)
    );


  if (
    item &&
    item.price !== null &&
    item.price !== undefined
  ) {

    return Number(
      item.price
    );

  }


  return (
    DEFAULT_SIZE_PRICE_TABLE[
      Number(ml)
    ] ?? 0
  );

}


/* =========================================================
   الحصول على المقاسات
   ========================================================= */

function getProductSizes(
  product
) {

  if (
    Array.isArray(
      product?.sizes
    ) &&
    product.sizes.length
  ) {

    return product.sizes;

  }


  const list =
    product?.kind === "oil"

      ? OIL_SIZE_OPTIONS

      : PERFUME_SIZE_OPTIONS;


  return list.map(
    ml => ({

      ml,

      price:
        DEFAULT_SIZE_PRICE_TABLE[
          ml
        ] ?? null

    })
  );

}


/* =========================================================
   اسم المنتج
   ========================================================= */

function productName(
  product
) {

  return (
    product?.name ||
    product?.nameAr ||
    product?.nameEn ||
    "عطر بدون اسم"
  );

}


/* =========================================================
   الاسم الإنجليزي
   ========================================================= */

function productNameEn(
  product
) {

  return (
    product?.nameEn ||
    product?.name ||
    ""
  );

}


/* =========================================================
   الشركة / المصنع
   ========================================================= */

function manufacturerName(
  product
) {

  return (
    product?.manufacturer ||
    product?.brand ||
    product?.brandAr ||
    ""
  );

}


/* =========================================================
   تحديد القاعة
   ========================================================= */

function calculateHall(
  product
) {

  if (
    product?.hall
  ) {

    return product.hall;

  }


  const year =
    Number(
      product?.releaseYear
    );


  if (
    year >=
    new Date().getFullYear() - 2
  ) {

    return "new";

  }


  if (
    year &&
    year <
      new Date().getFullYear() - 8
  ) {

    return "old";

  }


  return "featured";

}


/* =========================================================
   اسم القاعة
   ========================================================= */

function hallLabel(
  hall
) {

  switch (
    hall
  ) {

    case "new":

      return "جديد";

    case "old":

      return "قديم";

    case "featured":

      return "مميز";

    default:

      return "";

  }

}


/* =========================================================
   أيقونة القارورة
   ========================================================= */

function bottleIcon(
  product
) {

  const shape =
    product?.bottleShape ||
    "classic";


  const icons = {

    classic:
      "fa-solid fa-bottle-droplet",

    square:
      "fa-solid fa-cube",

    round:
      "fa-solid fa-circle",

    crown:
      "fa-solid fa-crown",

    luxury:
      "fa-solid fa-gem"

  };


  return (
    icons[shape] ||
    icons.classic
  );

}


/* =========================================================
   قوة العطر
   ========================================================= */

function strengthLabel(
  strength
) {

  switch (
    strength
  ) {

    case "strong":

      return "قوي";

    case "soft":

      return "هادئ";

    case "medium":

      return "متوسط";

    default:

      return "";

  }

}


/* =========================================================
   تطبيع نص البحث
   ========================================================= */

function normalizeText(
  value
) {

  return String(
    value ?? ""
  )

    .toLowerCase()

    .normalize(
      "NFD"
    )

    .replace(
      /[\u0300-\u036f]/g,
      ""
    )

    .replace(
      /[أإآ]/g,
      "ا"
    )

    .replace(
      /ة/g,
      "ه"
    )

    .trim();

}


/* =========================================================
   البحث داخل المنتج
   ========================================================= */

function productSearchText(
  product
) {

  return normalizeText(

    [

      product?.name,

      product?.nameAr,

      product?.nameEn,

      product?.brand,

      product?.brandAr,

      product?.manufacturer,

      product?.description,

      product?.family,

      product?.familyAr,

      product?.type,

      product?.gender,

      strengthLabel(
        product?.strength
      )

    ]

      .filter(Boolean)

      .join(" ")

  );

}


/* =========================================================
   التحقق من صلاحية المنتج للعرض
   ========================================================= */

function isPublicProduct(
  product
) {

  return Boolean(

    product &&

    product.active !== false &&

    !product.needsReview

  );

}


/* =========================================================
   الحصول على المنتجات العامة
   ========================================================= */

function publicProducts() {

  return STATE.products
    .filter(
      isPublicProduct
    );

}


/* =========================================================
   المنتجات التي تحتاج مراجعة
   ========================================================= */

function reviewProducts() {

  return STATE.products
    .filter(
      product =>
        product.needsReview
    );

}


/* =========================================================
   منع تكرار المنتجات
   ========================================================= */

function productDuplicateKey(
  product
) {

  return normalizeText(

    [

      product?.name,

      product?.nameAr,

      product?.nameEn,

      product?.brand,

      product?.manufacturer

    ]

      .filter(Boolean)

      .join("|")

  );

}


/* =========================================================
   فحص التكرار
   ========================================================= */

function hasDuplicateProduct(
  product,
  ignoreId = null
) {

  const key =
    productDuplicateKey(
      product
    );


  if (!key) {

    return false;

  }


  return STATE.products.some(
    existing =>

      existing.id !==
      ignoreId &&

      productDuplicateKey(
        existing
      ) === key

  );

}


/* =========================================================
   تحميل البيانات الأساسية
   ========================================================= */

function loadState() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          STORE.key
        ) || "null"
      );


    if (
      saved &&
      Array.isArray(
        saved.products
      )
    ) {

      STATE.products =
        saved.products.map(
          normalizeProductRecord
        );

    }


    if (
      saved &&
      Array.isArray(
        saved.cart
      )
    ) {

      STATE.cart =
        saved.cart;

    }


    if (
      saved &&
      Array.isArray(
        saved.wish
      )
    ) {

      STATE.wish =
        saved.wish;

    }


  } catch (error) {

    console.warn(
      "تعذر تحميل بيانات المتجر:",
      error
    );

  }


  try {

    const cart =
      JSON.parse(
        localStorage.getItem(
          "crownCart"
        ) || "null"
      );


    if (
      Array.isArray(cart) &&
      cart.length
    ) {

      STATE.cart =
        cart;

    }

  } catch {}


  try {

    const wish =
      JSON.parse(
        localStorage.getItem(
          "crownWish"
        ) || "null"
      );


    if (
      Array.isArray(wish)
    ) {

      STATE.wish =
        wish;

    }

  } catch {}


  STORE.meta.updatedAt =
    new Date().toISOString();

}


/* =========================================================
   حفظ الحالة
   ========================================================= */

function saveState() {

  try {

    STORE.meta.updatedAt =
      new Date().toISOString();


    localStorage.setItem(

      STORE.key,

      JSON.stringify({

        version:
          STORE.version,

        products:
          STATE.products,

        cart:
          STATE.cart,

        wish:
          STATE.wish,

        updatedAt:
          STORE.meta.updatedAt

      })

    );


    localStorage.setItem(

      "crownCart",

      JSON.stringify(
        STATE.cart
      )

    );


    localStorage.setItem(

      "crownWish",

      JSON.stringify(
        STATE.wish
      )

    );


  } catch (error) {

    console.warn(
      "تعذر حفظ الحالة:",
      error
    );

  }

}


/* =========================================================
   تحميل الكتالوج الخارجي
   ========================================================= */

async function loadCatalog() {

  try {

    const response =
      await fetch(
        "catalog.json",
        {
          cache:
            "no-store"
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    const incoming =
      Array.isArray(data)
        ? data
        : Array.isArray(data.products)
          ? data.products
          : [];


    const normalized =
      incoming.map(
        normalizeProductRecord
      );


    const existingKeys =
      new Set(
        STATE.products.map(
          productDuplicateKey
        )
      );


    let added = 0;


    normalized.forEach(
      product => {

        const key =
          productDuplicateKey(
            product
          );


        if (
          key &&
          !existingKeys.has(key)
        ) {

          STATE.products.push(
            product
          );

          existingKeys.add(
            key
          );

          added++;

        }

      }
    );


    if (
      added
    ) {

      saveState();

    }


    return {
      ok: true,
      added,
      total:
        normalized.length
    };


  } catch (error) {

    console.warn(
      "تعذر تحميل catalog.json:",
      error
    );


    return {
      ok: false,
      error
    };

  }

}


/* =========================================================
   تحميل التطبيق
   ========================================================= */

async function bootData() {

  loadState();


  if (
    !STATE.products.length
  ) {

    await loadCatalog();

  }


  STATE.products =
    STATE.products.map(
      normalizeProductRecord
    );


  saveState();

}


/* =========================================================
   بداية التطبيق
   ========================================================= */

async function initApp() {

  await bootData();

  applySettingsToPage();

  bindGlobalEvents();

  renderAll();

  updateCartUI();

  updateWishUI();

  updateAdminVisibility();

}


/* =========================================================
   تطبيق الإعدادات على الصفحة
   ========================================================= */

function applySettingsToPage() {

  document.documentElement
    .style
    .setProperty(
      "--gold",
      SET.gold
    );


  document.documentElement
    .style
    .setProperty(
      "--bg",
      SET.bg
    );


  document.documentElement
    .style
    .setProperty(
      "--ink",
      SET.ink
    );


  $$("[data-brand]")
    .forEach(
      element => {

        element.textContent =
          SET.brand;

      }
    );


  $$("[data-tagline]")
    .forEach(
      element => {

        element.textContent =
          SET.tagline;

      }
    );


  $$("[data-address]")
    .forEach(
      element => {

        element.textContent =
          SET.address;

      }
    );


  $$("[data-whatsapp]")
    .forEach(
      element => {

        element.textContent =
          "واتساب";

        element.href =
          `https://wa.me/${SET.whatsapp}`;

      }
    );

}


/* =========================================================
   ربط الأحداث العامة
   ========================================================= */

function bindGlobalEvents() {

  document.addEventListener(
    "click",
    handleDocumentClick
  );


  document.addEventListener(
    "input",
    handleDocumentInput
  );


  document.addEventListener(
    "change",
    handleDocumentChange
  );


  document.addEventListener(
    "keydown",
    handleDocumentKeydown
  );

}


/* =========================================================
   معالج الضغط العام
   ========================================================= */

function handleDocumentClick(
  event
) {

  const target =
    event.target.closest(
      "[data-action]"
    );


  if (!target) {

    return;

  }


  const action =
    target.dataset.action;


  switch (
    action
  ) {

    case "open-product":

      openProductModal(
        target.dataset.id
      );

      break;


    case "add-cart":

      addToCart(
        target.dataset.id
      );

      break;


    case "toggle-wish":

      toggleWish(
        target.dataset.id
      );

      break;


    case "close-modal":

      closeProductModal();

      break;


    case "cart-open":

      openCart();

      break;


    case "cart-close":

      closeCart();

      break;


    case "cart-clear":

      clearCart();

      break;


    case "checkout":

      checkoutWhatsApp();

      break;


    case "scroll-store":

      scrollToStore();

      break;


    case "filter":

      setFilter(
        target.dataset.value
      );

      break;


    case "hall":

      setHall(
        target.dataset.value
      );

      break;


    case "sort":

      setSort(
        target.dataset.value
      );

      break;


    case "page-next":

      changePage(
        1
      );

      break;


    case "page-prev":

      changePage(
        -1
      );

      break;


    case "advisor":

      advisorOpen();

      break;


    case "advisor-close":

      advisorClose();

      break;


    case "advisor-answer":

      advisorAnswer(
        target.dataset.value
      );

      break;


    case "voice-search":

      startVoiceSearch();

      break;


    case "admin-open":

      openAdmin();

      break;


    case "admin-close":

      closeAdmin();

      break;


    case "admin-login":

      adminLogin();

      break;


    case "admin-logout":

      adminLogout();

      break;


    case "admin-add":

      adminAddProduct();

      break;


    case "admin-save":

      adminSaveProduct();

      break;


    case "admin-delete":

      deleteProduct(
        target.dataset.id
      );

      break;


    case "admin-export":

      exportJSON();

      break;


    case "admin-import":

      importJSON();

      break;


    case "admin-backup":

      createManualBackup();

      break;


    case "admin-restore":

      restoreLastBackup();

      break;


    case "admin-history":

      renderChangeHistory();

      break;


    case "admin-settings":

      renderAdminSettings();

      break;


    case "admin-products":

      renderAdminProducts();

      break;


    case "admin-orders":

      renderAdminOrders();

      break;


    case "builder-add":

      builderAddToCart();

      break;


    case "builder-reset":

      resetBuilder();

      break;


    case "language":

      toggleLanguage();

      break;


    case "enter-kingdom":

      enterKingdom();

      break;

  }

}


/* =========================================================
   معالج الإدخال
   ========================================================= */

function handleDocumentInput(
  event
) {

  const target =
    event.target;


  if (
    target.matches(
      "[data-search]"
    )
  ) {

    STATE.search =
      target.value;

    STATE.page =
      0;

    renderProducts();

  }


  if (
    target.matches(
      "[data-builder]"
    )
  ) {

    updateBuilder();

  }

}


/* =========================================================
   معالج التغيير
   ========================================================= */

function handleDocumentChange(
  event
) {

  const target =
    event.target;


  if (
    target.matches(
      "[data-size]"
    )
  ) {

    const id =
      target.dataset.id;


    const size =
      Number(
        target.value
      );


    if (
      STATE.modal.productId ===
      id
    ) {

      STATE.modal.sizeIndex =
        Math.max(
          0,
          getProductSizes(
            STATE.products.find(
              p =>
                p.id === id
            )
          )
            .findIndex(
              x =>
                Number(x.ml) ===
                size
            )
        );

      renderProductModal();

    }

  }


  if (
    target.matches(
      "[data-sort-select]"
    )
  ) {

    setSort(
      target.value
    );

  }

}


/* =========================================================
   لوحة المفاتيح
   ========================================================= */

function handleDocumentKeydown(
  event
) {

  if (
    event.key ===
    "Escape"
  ) {

    closeProductModal();

    closeCart();

    advisorClose();

  }


  if (
    event.key ===
    "/" &&
    !["INPUT", "TEXTAREA"].includes(
      document.activeElement?.tagName
    )
  ) {

    event.preventDefault();

    const search =
      $(
        "[data-search]"
      );

    if (search) {

      search.focus();

    }

  }

}


/* =========================================================
   عرض كل أجزاء الموقع
   ========================================================= */

function renderAll() {

  renderProducts();

  renderCategories();

  renderHalls();

  renderBestSellers();

  renderOils();

  renderBuilder();

  renderAdminIfOpen();

}


/* =========================================================
   تصفية المنتجات
   ========================================================= */

function filteredProducts() {

  let products =
    publicProducts();


  const search =
    normalizeText(
      STATE.search
    );


  if (search) {

    products =
      products.filter(
        product =>
          productSearchText(
            product
          ).includes(
            search
          )
      );

  }


  if (
    STATE.filter !==
    "all"
  ) {

    products =
      products.filter(
        product => {

          if (
            ["M", "W", "U"].includes(
              STATE.filter
            )
          ) {

            return (
              product.gender ===
              STATE.filter
            );

          }


          if (
            product.family ===
            STATE.filter
          ) {

            return true;

          }


          if (
            product.kind ===
            STATE.filter
          ) {

            return true;

          }


          return false;

        }
      );

  }


  if (
    STATE.sort ===
    "price-low"
  ) {

    products.sort(
      (
        a,
        b
      ) =>
        getLowestPrice(a) -
        getLowestPrice(b)
    );

  }


  if (
    STATE.sort ===
    "price-high"
  ) {

    products.sort(
      (
        a,
        b
      ) =>
        getLowestPrice(b) -
        getLowestPrice(a)
    );

  }


  if (
    STATE.sort ===
    "name"
  ) {

    products.sort(
      (
        a,
        b
      ) =>
        productName(a)
          .localeCompare(
            productName(b),
            "ar"
          )
    );

  }


  return products;

}


/* =========================================================
   أقل سعر
   ========================================================= */

function getLowestPrice(
  product
) {

  const sizes =
    getProductSizes(
      product
    );


  const prices =
    sizes

      .map(
        x =>
          Number(
            x.price
          )
      )

      .filter(
        Number.isFinite
      );


  return prices.length
    ? Math.min(...prices)
    : 0;

}


/* =========================================================
   أعلى سعر
   ========================================================= */

function getHighestPrice(
  product
) {

  const sizes =
    getProductSizes(
      product
    );


  const prices =
    sizes

      .map(
        x =>
          Number(
            x.price
          )
      )

      .filter(
        Number.isFinite
      );


  return prices.length
    ? Math.max(...prices)
    : 0;

}


/* =========================================================
   تغيير الفلتر
   ========================================================= */

function setFilter(
  value
) {

  STATE.filter =
    value ||
    "all";

  STATE.page =
    0;

  renderProducts();

}


/* =========================================================
   تغيير القاعة
   ========================================================= */

function setHall(
  value
) {

  STATE.hall =
    value ||
    "all";

  STATE.page =
    0;

  renderProducts();

}


/* =========================================================
   تغيير الترتيب
   ========================================================= */

function setSort(
  value
) {

  STATE.sort =
    value ||
    "default";

  STATE.page =
    0;

  renderProducts();

}


/* =========================================================
   تغيير الصفحة
   ========================================================= */

function changePage(
  direction
) {

  const products =
    filteredProducts();


  const pages =
    Math.max(
      1,
      Math.ceil(
        products.length /
        STATE.perPage
      )
    );


  STATE.page =
    Math.min(
      Math.max(
        0,
        STATE.page +
        direction
      ),
      pages - 1
    );


  renderProducts();

}


/* =========================================================
   الانتقال للمتجر
   ========================================================= */

function scrollToStore() {

  const store =
    $(
      "#store"
    ) ||
    $(
      ".store-section"
    );


  if (store) {

    store.scrollIntoView({
      behavior:
        "smooth",
      block:
        "start"
    });

  }

}


/* =========================================================
   دخول المملكة
   ========================================================= */

function enterKingdom() {

  const screen =
    $(
      "#kingdomEntrance"
    ) ||
    $(
      ".kingdom-entrance"
    );


  if (!screen) {

    return;

  }


  screen.classList.add(
    "entered"
  );


  setTimeout(
    () => {

      screen.style.display =
        "none";

    },
    900
  );

}


/* =========================================================
   عرض المنتجات
   ========================================================= */

function renderProducts() {

  const container =
    $(
      "[data-products]"
    ) ||
    $(
      "#productsGrid"
    );


  if (!container) {

    return;

  }


  let products =
    filteredProducts();


  /* -----------------------------------------
     فلتر القاعة
     ----------------------------------------- */

  if (
    STATE.hall &&
    STATE.hall !==
      "all"
  ) {

    products =
      products.filter(
        product =>
          calculateHall(
            product
          ) ===
          STATE.hall
      );

  }


  const total =
    products.length;


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total /
        STATE.perPage
      )
    );


  if (
    STATE.page >=
    totalPages
  ) {

    STATE.page =
      totalPages - 1;

  }


  const start =
    STATE.page *
    STATE.perPage;


  const visible =
    products.slice(
      start,
      start +
        STATE.perPage
    );


  if (
    !visible.length
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <i class="fa-solid fa-wind"></i>

        <h3>
          لا توجد عطور مطابقة
        </h3>

        <p>
          جرّب تغيير البحث أو التصنيف.
        </p>

      </div>

    `;

  } else {

    container.innerHTML =
      visible
        .map(
          productCard
        )
        .join("");

  }


  renderPagination(
    totalPages
  );

  updateResultCount(
    total
  );

}


/* =========================================================
   تحديث عدد النتائج
   ========================================================= */

function updateResultCount(
  count
) {

  $$(
    "[data-result-count]"
  )
    .forEach(
      element => {

        element.textContent =
          count;

      }
    );

}


/* =========================================================
   بطاقة المنتج
   ========================================================= */

function productCard(
  product
) {

  const wished =
    STATE.wish.includes(
      product.id
    );


  const sizes =
    getProductSizes(
      product
    );


  const firstSize =
    sizes[0];


  const price =
    firstSize
      ? firstSize.price
      : getLowestPrice(
          product
        );


  const hall =
    calculateHall(
      product
    );


  const image =
    product.image;


  return `

    <article
      class="product-card royal-card"
      data-product-id="${esc(product.id)}"
    >

      <button
        class="wish-btn ${wished ? "active" : ""}"
        data-action="toggle-wish"
        data-id="${esc(product.id)}"
        aria-label="المفضلة"
      >

        <i class="${
          wished
            ? "fa-solid"
            : "fa-regular"
        } fa-heart"></i>

      </button>


      <button
        class="product-visual"
        data-action="open-product"
        data-id="${esc(product.id)}"
        type="button"
      >

        ${
          image

            ? `

              <img
                src="${esc(image)}"
                alt="${esc(productName(product))}"
                loading="lazy"
              >

            `

            : `

              <div class="bottle-placeholder">

                <i class="${bottleIcon(product)}"></i>

              </div>

            `
        }


        ${
          hall

            ? `

              <span class="hall-badge">
                ${esc(
                  hallLabel(hall)
                )}
              </span>

            `

            : ""
        }

      </button>


      <div class="product-info">

        <div class="product-meta">

          <span>
            ${esc(
              genderLabel(
                product.gender
              )
            )}
          </span>

          <span>
            ${esc(
              typeLabel(product)
            )}
          </span>

        </div>


        <h3 class="product-name">

          ${esc(
            productName(product)
          )}

        </h3>


        ${
          manufacturerName(product)

            ? `

              <div class="product-brand">

                ${esc(
                  manufacturerName(
                    product
                  )
                )}

              </div>

            `

            : ""
        }


        ${
          product.familyAr

            ? `

              <div class="product-family">

                ${esc(
                  product.familyAr
                )}

              </div>

            `

            : ""
        }


        ${
          strengthLabel(
            product.strength
          )

            ? `

              <span class="strength-tag">

                ${esc(
                  strengthLabel(
                    product.strength
                  )
                )}

              </span>

            `

            : ""
        }


        <div class="product-footer">

          <div class="product-price">

            يبدأ من

            <strong>
              ${money(price)}
            </strong>

          </div>


          <button
            class="add-cart-mini"
            type="button"
            data-action="add-cart"
            data-id="${esc(product.id)}"
          >

            <i class="fa-solid fa-plus"></i>

            أضف

          </button>

        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   الترقيم
   ========================================================= */

function renderPagination(
  totalPages
) {

  const container =
    $(
      "[data-pagination]"
    ) ||
    $(
      "#pagination"
    );


  if (!container) {

    return;

  }


  if (
    totalPages <= 1
  ) {

    container.innerHTML =
      "";

    return;

  }


  container.innerHTML = `

    <button
      type="button"
      data-action="page-prev"
      ${STATE.page === 0 ? "disabled" : ""}
    >

      <i class="fa-solid fa-chevron-right"></i>

    </button>


    <span>

      ${STATE.page + 1}
      /
      ${totalPages}

    </span>


    <button
      type="button"
      data-action="page-next"
      ${
        STATE.page >=
        totalPages - 1
          ? "disabled"
          : ""
      }
    >

      <i class="fa-solid fa-chevron-left"></i>

    </button>

  `;

}


/* =========================================================
   التصنيفات
   ========================================================= */

function renderCategories() {

  const container =
    $(
      "[data-categories]"
    );


  if (!container) {

    return;

  }


  const categories = [

    {
      value:
        "all",

      ar:
        "كل العطور",

      icon:
        "fa-solid fa-crown"

    },

    {
      value:
        "M",

      ar:
        "رجالي",

      icon:
        "fa-solid fa-user-tie"

    },

    {
      value:
        "W",

      ar:
        "حريمي",

      icon:
        "fa-solid fa-user"

    },

    {
      value:
        "U",

      ar:
        "يونيسكس",

      icon:
        "fa-solid fa-users"

    },

    {
      value:
        "oil",

      ar:
        "زيوت عطرية",

      icon:
        "fa-solid fa-droplet"

    },

    {
      value:
        "oud",

      ar:
        "عود",

      icon:
        "fa-solid fa-tree"

    },

    {
      value:
        "musk",

      ar:
        "مسك",

      icon:
        "fa-solid fa-feather"

    },

    {
      value:
        "oriental",

      ar:
        "شرقي",

      icon:
        "fa-solid fa-moon"

    }

  ];


  container.innerHTML =
    categories
      .map(
        category => `

          <button
            type="button"
            class="category-chip ${
              STATE.filter ===
              category.value
                ? "active"
                : ""
            }"
            data-action="filter"
            data-value="${esc(category.value)}"
          >

            <i class="${category.icon}"></i>

            <span>
              ${esc(category.ar)}
            </span>

          </button>

        `
      )
      .join("");

}


/* =========================================================
   القاعات
   ========================================================= */

function renderHalls() {

  const container =
    $(
      "[data-halls]"
    );


  if (!container) {

    return;

  }


  const halls = [

    {
      value:
        "featured",

      title:
        "قاعة المميز",

      icon:
        "fa-solid fa-crown"

    },

    {
      value:
        "new",

      title:
        "قاعة الجديد",

      icon:
        "fa-solid fa-sparkles"

    },

    {
      value:
        "old",

      title:
        "قاعة القديم",

      icon:
        "fa-solid fa-landmark"

    }

  ];


  container.innerHTML =
    halls
      .map(
        hall => `

          <button
            type="button"
            class="hall-card ${
              STATE.hall ===
              hall.value
                ? "active"
                : ""
            }"
            data-action="hall"
            data-value="${esc(hall.value)}"
          >

            <i class="${hall.icon}"></i>

            <strong>
              ${esc(hall.title)}
            </strong>

          </button>

        `
      )
      .join("");

}


/* =========================================================
   الأكثر طلباً
   ========================================================= */

function renderBestSellers() {

  const container =
    $(
      "[data-best-sellers]"
    );


  if (!container) {

    return;

  }


  const groups = [

    {
      gender:
        "M",

      title:
        "الأكثر طلباً · رجالي"

    },

    {
      gender:
        "W",

      title:
        "الأكثر طلباً · حريمي"

    },

    {
      gender:
        "U",

      title:
        "الأكثر طلباً · شرقي ويونيسكس"

    }

  ];


  container.innerHTML =
    groups
      .map(
        group => {

          const products =
            publicProducts()
              .filter(
                product => {

                  if (
                    group.gender ===
                    "U"
                  ) {

                    return (
                      product.gender ===
                        "U" ||
                      product.family ===
                        "oriental" ||
                      product.kind ===
                        "oil"
                    );

                  }


                  return (
                    product.gender ===
                    group.gender
                  );

                }
              )
              .slice(
                0,
                6
              );


          return `

            <section class="best-seller-group">

              <div class="section-title-mini">

                <span>
                  ${esc(group.title)}
                </span>

              </div>


              <div class="mini-products">

                ${
                  products.length

                    ? products
                        .map(
                          product =>
                            productCard(
                              product
                            )
                        )
                        .join("")

                    : `

                      <div class="empty-state compact">

                        لا توجد بيانات حالياً

                      </div>

                    `
                }

              </div>

            </section>

          `;

        }
      )
      .join("");

}


/* =========================================================
   الزيوت العطرية
   ========================================================= */

function renderOils() {

  const container =
    $(
      "[data-oils]"
    );


  if (!container) {

    return;

  }


  const oils =
    publicProducts()
      .filter(
        product =>
          product.kind ===
          "oil"
      )
      .slice(
        0,
        12
      );


  container.innerHTML =
    oils.length

      ? oils
          .map(
            product =>
              productCard(
                product
              )
          )
          .join("")

      : `

        <div class="empty-state">

          <i class="fa-solid fa-droplet"></i>

          <h3>
            قسم الزيوت العطرية
          </h3>

          <p>
            أضف الزيوت من لوحة الإدارة لتظهر هنا.
          </p>

        </div>

      `;

}


/* =========================================================
   نافذة تفاصيل المنتج
   ========================================================= */

function openProductModal(
  productId
) {

  const product =
    STATE.products.find(
      item =>
        item.id ===
        productId
    );


  if (!product) {

    return;

  }


  STATE.modal.productId =
    productId;


  STATE.modal.sizeIndex =
    0;


  const modal =
    $(
      "#productModal"
    ) ||
    $(
      "[data-product-modal]"
    );


  if (!modal) {

    return;

  }


  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  renderProductModal();

}


/* =========================================================
   رسم نافذة المنتج
   ========================================================= */

function renderProductModal() {

  const modal =
    $(
      "#productModal"
    ) ||
    $(
      "[data-product-modal]"
    );


  if (!modal) {

    return;

  }


  const product =
    STATE.products.find(
      item =>
        item.id ===
        STATE.modal.productId
    );


  if (!product) {

    return;

  }


  const sizes =
    getProductSizes(
      product
    );


  const selected =
    sizes[
      STATE.modal.sizeIndex
    ] ||
    sizes[0];


  const price =
    selected
      ? selected.price
      : 0;


  const wished =
    STATE.wish.includes(
      product.id
    );


  modal.innerHTML = `

    <div
      class="modal-backdrop"
      data-action="close-modal"
    ></div>


    <div
      class="product-modal-dialog"
      role="dialog"
      aria-modal="true"
    >

      <button
        type="button"
        class="modal-close"
        data-action="close-modal"
      >

        <i class="fa-solid fa-xmark"></i>

      </button>


      <div class="modal-product-media">

        ${
          product.image

            ? `

              <img
                src="${esc(product.image)}"
                alt="${esc(productName(product))}"
              >

            `

            : `

              <div class="bottle-placeholder large">

                <i class="${bottleIcon(product)}"></i>

              </div>

            `
        }

      </div>


      <div class="modal-product-content">

        <div class="product-meta">

          <span>
            ${esc(
              genderLabel(
                product.gender
              )
            )}
          </span>

          <span>
            ${esc(
              typeLabel(product)
            )}
          </span>

        </div>


        <h2>
          ${esc(
            productName(product)
          )}
        </h2>


        ${
          productNameEn(product)

            ? `

              <div class="name-en">

                ${esc(
                  productNameEn(
                    product
                  )
                )}

              </div>

            `

            : ""
        }


        ${
          manufacturerName(product)

            ? `

              <div class="manufacturer">

                الشركة / المصنع:

                <strong>
                  ${esc(
                    manufacturerName(
                      product
                    )
                  )}
                </strong>

              </div>

            `

            : ""
        }


        ${
          product.description

            ? `

              <p class="description">

                ${esc(
                  product.description
                )}

              </p>

            `

            : ""
        }


        <div class="modal-options">

          <label>
            اختر الحجم
          </label>


          <div class="size-options">

            ${sizes
              .map(
                (size, index) => `

                  <button
                    type="button"
                    class="size-option ${
                      index ===
                      STATE.modal.sizeIndex
                        ? "active"
                        : ""
                    }"
                    data-size="${esc(size.ml)}"
                    data-id="${esc(product.id)}"
                  >

                    ${esc(size.ml)}
                    مل

                  </button>

                `
              )
              .join("")}

          </div>


          <label>
            التغليف
          </label>


          <div class="package-options">

            <button
              type="button"
              class="${
                STATE.modal.packaging ===
                "normal"
                  ? "active"
                  : ""
              }"
              onclick="setPackaging('normal')"
            >

              عادي

            </button>


            <button
              type="button"
              class="${
                STATE.modal.packaging ===
                "gift"
                  ? "active"
                  : ""
              }"
              onclick="setPackaging('gift')"
            >

              هدية

            </button>


            <button
              type="button"
              class="${
                STATE.modal.packaging ===
                "luxury"
                  ? "active"
                  : ""
              }"
              onclick="setPackaging('luxury')"
            >

              ملكي فاخر

            </button>

          </div>

        </div>


        <div class="modal-price">

          <span>
            السعر
          </span>

          <strong>
            ${money(price)}
          </strong>

        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="primary-btn"
            data-action="add-cart"
            data-id="${esc(product.id)}"
          >

            <i class="fa-solid fa-cart-plus"></i>

            أضف إلى السلة

          </button>


          <button
            type="button"
            class="secondary-btn ${
              wished
                ? "active"
                : ""
            }"
            data-action="toggle-wish"
            data-id="${esc(product.id)}"
          >

            <i class="${
              wished
                ? "fa-solid"
                : "fa-regular"
            } fa-heart"></i>

            المفضلة

          </button>

        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   تغيير التغليف
   ========================================================= */

function setPackaging(
  value
) {

  STATE.modal.packaging =
    value;


  renderProductModal();

}


/* =========================================================
   إغلاق نافذة المنتج
   ========================================================= */

function closeProductModal() {

  const modal =
    $(
      "#productModal"
    ) ||
    $(
      "[data-product-modal]"
    );


  if (!modal) {

    return;

  }


  modal.classList.remove(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================================================
   إضافة إلى السلة
   ========================================================= */

function addToCart(
  productId,
  selectedSize = null
) {

  const product =
    STATE.products.find(
      item =>
        item.id ===
        productId
    );


  if (!product) {

    return;

  }


  const sizes =
    getProductSizes(
      product
    );


  let size =
    selectedSize;


  if (!size) {

    size =
      sizes[
        STATE.modal.productId ===
        productId
          ? STATE.modal.sizeIndex
          : 0
      ]?.ml;

  }


  size =
    Number(
      size ||
      sizes[0]?.ml ||
      0
    );


  const price =
    getSizePrice(
      product,
      size
    );


  const packaging =
    STATE.modal.productId ===
    productId

      ? STATE.modal.packaging

      : "normal";


  const key =
    `${productId}_${size}_${packaging}`;


  const existing =
    STATE.cart.find(
      item =>
        item.key ===
        key
    );


  if (existing) {

    existing.qty += 1;

  } else {

    STATE.cart.push({

      key,

      productId,

      name:
        productName(
          product
        ),

      size,

      price,

      packaging,

      qty: 1

    });

  }


  saveState();

  updateCartUI();

  closeProductModal();

  showToast(
    "تمت إضافة العطر إلى السلة"
  );

}


/* =========================================================
   حذف عنصر من السلة
   ========================================================= */

function removeFromCart(
  key
) {

  STATE.cart =
    STATE.cart.filter(
      item =>
        item.key !==
        key
    );


  saveState();

  updateCartUI();

  renderCart();

}


/* =========================================================
   تغيير كمية عنصر
   ========================================================= */

function changeCartQty(
  key,
  delta
) {

  const item =
    STATE.cart.find(
      cartItem =>
        cartItem.key ===
        key
    );


  if (!item) {

    return;

  }


  item.qty +=
    Number(delta);


  if (
    item.qty <= 0
  ) {

    removeFromCart(
      key
    );

    return;

  }


  saveState();

  updateCartUI();

  renderCart();

}


/* =========================================================
   إجمالي السلة
   ========================================================= */

function cartTotal() {

  return STATE.cart.reduce(
    (
      total,
      item
    ) =>

      total +
      (
        Number(
          item.price
        ) || 0
      ) *
      (
        Number(
          item.qty
        ) || 0
      ),

    0
  );

}


/* =========================================================
   عدد عناصر السلة
   ========================================================= */

function cartCount() {

  return STATE.cart.reduce(
    (
      total,
      item
    ) =>

      total +
      (
        Number(
          item.qty
        ) || 0
      ),

    0
  );

}


/* =========================================================
   تحديث واجهة السلة
   ========================================================= */

function updateCartUI() {

  $$(
    "[data-cart-count]"
  )
    .forEach(
      element => {

        element.textContent =
          cartCount();

      }
    );


  $$(
    "[data-cart-total]"
  )
    .forEach(
      element => {

        element.textContent =
          money(
            cartTotal()
          );

      }
    );

}


/* =========================================================
   عرض السلة
   ========================================================= */

function renderCart() {

  const container =
    $(
      "[data-cart-items]"
    );


  if (!container) {

    return;

  }


  if (
    !STATE.cart.length
  ) {

    container.innerHTML = `

      <div class="empty-cart">

        <i class="fa-solid fa-cart-shopping"></i>

        <p>
          السلة فارغة
        </p>

      </div>

    `;


    updateCartUI();

    return;

  }


  container.innerHTML =
    STATE.cart
      .map(
        item => `

          <div class="cart-item">

            <div class="cart-item-info">

              <strong>
                ${esc(item.name)}
              </strong>

              <span>
                ${esc(item.size)} مل
              </span>

              <span>
                ${esc(item.packaging)}
              </span>

            </div>


            <div class="cart-item-price">

              ${money(
                Number(item.price) *
                Number(item.qty)
              )}

            </div>


            <div class="cart-item-controls">

              <button
                type="button"
                onclick="changeCartQty('${esc(item.key)}',-1)"
              >

                −

              </button>


              <span>
                ${esc(item.qty)}
              </span>


              <button
                type="button"
                onclick="changeCartQty('${esc(item.key)}',1)"
              >

                +

              </button>


              <button
                type="button"
                class="remove"
                onclick="removeFromCart('${esc(item.key)}')"
              >

                <i class="fa-solid fa-trash"></i>

              </button>

            </div>

          </div>

        `
      )
      .join("");


  updateCartUI();

}


/* =========================================================
   فتح السلة
   ========================================================= */

function openCart() {

  const cart =
    $(
      "#cartDrawer"
    ) ||
    $(
      "[data-cart]"
    );


  if (!cart) {

    return;

  }


  renderCart();

  cart.classList.add(
    "open"
  );

}


/* =========================================================
   إغلاق السلة
   ========================================================= */

function closeCart() {

  const cart =
    $(
      "#cartDrawer"
    ) ||
    $(
      "[data-cart]"
    );


  if (!cart) {

    return;

  }


  cart.classList.remove(
    "open"
  );

}


/* =========================================================
   تفريغ السلة
   ========================================================= */

function clearCart() {

  if (
    !STATE.cart.length
  ) {

    return;

  }


  STATE.cart =
    [];


  saveState();

  updateCartUI();

  renderCart();

  showToast(
    "تم تفريغ السلة"
  );

}


/* =========================================================
   المفضلة
   ========================================================= */

function toggleWish(
  productId
) {

  const index =
    STATE.wish.indexOf(
      productId
    );


  if (
    index === -1
  ) {

    STATE.wish.push(
      productId
    );

    showToast(
      "تمت إضافة العطر إلى المفضلة"
    );

  } else {

    STATE.wish.splice(
      index,
      1
    );

    showToast(
      "تمت إزالة العطر من المفضلة"
    );

  }


  saveState();

  updateWishUI();

  renderProducts();

}


/* =========================================================
   تحديث المفضلة
   ========================================================= */

function updateWishUI() {

  $$(
    "[data-wish-count]"
  )
    .forEach(
      element => {

        element.textContent =
          STATE.wish.length;

      }
    );

}


/* =========================================================
   إرسال الطلب عبر واتساب
   ========================================================= */

function checkoutWhatsApp() {

  if (
    !STATE.cart.length
  ) {

    showToast(
      "السلة فارغة"
    );

    return;

  }


  const lines = [

    "👑 *طلب جديد من مملكة العطور*",

    "",

    `📍 ${SET.address}`,

    ""

  ];


  STATE.cart.forEach(
    (
      item,
      index
    ) => {

      lines.push(

        `${index + 1}. ${item.name}`,

        `الحجم: ${item.size} مل`,

        `التغليف: ${item.packaging}`,

        `الكمية: ${item.qty}`,

        `السعر: ${money(
          Number(item.price) *
          Number(item.qty)
        )}`,

        ""

      );

    }
  );


  lines.push(

    `💰 الإجمالي: ${money(
      cartTotal()
    )}`,

    "",

    "أرغب في تأكيد الطلب ومعرفة تكلفة التوصيل."

  );


  const url =
    `https://wa.me/${SET.whatsapp}?text=` +
    encodeURIComponent(
      lines.join("\n")
    );


  window.open(
    url,
    "_blank"
  );


  saveOrderLocally();

}


/* =========================================================
   حفظ الطلب محلياً
   ========================================================= */

function saveOrderLocally() {

  try {

    const orders =
      getLocalOrdersSafe();


    orders.unshift({

      id:
        `ord_${Date.now()}`,

      at:
        new Date()
          .toISOString(),

      items:
        clone(
          STATE.cart
        ),

      total:
        cartTotal(),

      status:
        "new"

    });


    localStorage.setItem(

      "crown_orders",

      JSON.stringify(
        orders.slice(
          0,
          100
        )
      )

    );


  } catch (e) {}

}


/* =========================================================
   زر واتساب عام
   ========================================================= */

function waUrl(
  text = ""
) {

  return (

    `https://wa.me/${SET.whatsapp}` +

    (

      text

        ? `?text=${encodeURIComponent(text)}`

        : ""

    )

  );

}


/* =========================================================
   رسالة Toast
   ========================================================= */

function showToast(
  message
) {

  let toast =
    $(
      "#toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.id =
      "toast";


    toast.className =
      "toast";


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2600
    );

}


/* =========================================================
   مستشار العطور
   ========================================================= */

function advisorOpen() {

  STATE.ai = {

    step: 0,

    answers: {

      gender: null,

      family: null,

      occasion: null,

      budget: null

    }

  };


  const modal =
    $(
      "#advisorModal"
    ) ||
    $(
      "[data-advisor]"
    );


  if (!modal) {

    return;

  }


  modal.classList.add(
    "open"
  );


  renderAdvisor();

}


/* =========================================================
   إغلاق المستشار
   ========================================================= */

function advisorClose() {

  const modal =
    $(
      "#advisorModal"
    ) ||
    $(
      "[data-advisor]"
    );


  if (!modal) {

    return;

  }


  modal.classList.remove(
    "open"
  );

}


/* =========================================================
   أسئلة مستشار العطور
   ========================================================= */

const ADVISOR_STEPS = [

  {

    key:
      "gender",

    title:
      "لمن العطر؟",

    options: [

      {
        value:
          "M",

        label:
          "رجالي"

      },

      {
        value:
          "W",

        label:
          "حريمي"

      },

      {
        value:
          "U",

        label:
          "يونيسكس"

      }

    ]

  },


  {

    key:
      "family",

    title:
      "أي طابع عطري تفضل؟",

    options: [

      {
        value:
          "fresh",

        label:
          "منعش"

      },

      {
        value:
          "floral",

        label:
          "زهري"

      },

      {
        value:
          "woody",

        label:
          "خشبي"

      },

      {
        value:
          "oriental",

        label:
          "شرقي"

      },

      {
        value:
          "sweet",

        label:
          "حلو"

      }

    ]

  },


  {

    key:
      "occasion",

    title:
      "متى ستستخدمه؟",

    options: [

      {
        value:
          "daily",

        label:
          "يومي"

      },

      {
        value:
          "work",

        label:
          "عمل"

      },

      {
        value:
          "evening",

        label:
          "سهرة"

      },

      {
        value:
          "special",

        label:
          "مناسبة خاصة"

      }

    ]

  },


  {

    key:
      "budget",

    title:
      "ما الميزانية التقريبية؟",

    options: [

      {
        value:
          "low",

        label:
          "اقتصادية"

      },

      {
        value:
          "medium",

        label:
          "متوسطة"

      },

      {
        value:
          "high",

        label:
          "فاخرة"

      }

    ]

  }

];


/* =========================================================
   رسم مستشار العطور
   ========================================================= */

function renderAdvisor() {

  const modal =
    $(
      "#advisorModal"
    ) ||
    $(
      "[data-advisor]"
    );


  if (!modal) {

    return;

  }


  const step =
    ADVISOR_STEPS[
      STATE.ai.step
    ];


  if (!step) {

    renderAdvisorResults();

    return;

  }


  modal.innerHTML = `

    <div class="modal-backdrop"
         onclick="advisorClose()">
    </div>


    <div class="advisor-dialog">

      <button
        type="button"
        class="modal-close"
        onclick="advisorClose()"
      >

        <i class="fa-solid fa-xmark"></i>

      </button>


      <div class="advisor-progress">

        ${STATE.ai.step + 1}

        /

        ${ADVISOR_STEPS.length}

      </div>


      <h2>

        ${esc(step.title)}

      </h2>


      <div class="advisor-options">

        ${step.options
          .map(
            option => `

              <button
                type="button"
                data-action="advisor-answer"
                data-value="${esc(option.value)}"
              >

                ${esc(option.label)}

              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;

}


/* =========================================================
   إجابة المستشار
   ========================================================= */

function advisorAnswer(
  value
) {

  const step =
    ADVISOR_STEPS[
      STATE.ai.step
    ];


  if (!step) {

    return;

  }


  STATE.ai.answers[
    step.key
  ] =
    value;


  STATE.ai.step +=
    1;


  renderAdvisor();

}


/* =========================================================
   نتائج المستشار
   ========================================================= */

function renderAdvisorResults() {

  const modal =
    $(
      "#advisorModal"
    ) ||
    $(
      "[data-advisor]"
    );


  if (!modal) {

    return;

  }


  const answers =
    STATE.ai.answers;


  let results =
    publicProducts();


  if (
    answers.gender
  ) {

    results =
      results.filter(
        product =>
          product.gender ===
          answers.gender
      );

  }


  if (
    answers.family
  ) {

    results =
      results.filter(
        product =>
          product.family ===
          answers.family
      );

  }


  if (
    answers.budget
  ) {

    const ranges = {

      low:
        [0, 150],

      medium:
        [100, 300],

      high:
        [250, Infinity]

    };


    const [
      min,
      max
    ] =
      ranges[
        answers.budget
      ];


    results =
      results.filter(
        product => {

          const price =
            getLowestPrice(
              product
            );

          return (
            price >= min &&
            price <= max
          );

        }
      );

  }


  results =
    results.slice(
      0,
      6
    );


  modal.innerHTML = `

    <div class="modal-backdrop"
         onclick="advisorClose()">
    </div>


    <div class="advisor-dialog advisor-results">

      <button
        type="button"
        class="modal-close"
        onclick="advisorClose()"
      >

        <i class="fa-solid fa-xmark"></i>

      </button>


      <div class="advisor-crown">

        <i class="fa-solid fa-crown"></i>

      </div>


      <h2>
        اختيارات المملكة لك
      </h2>


      <p>
        بناءً على اختياراتك، هذه أقرب الترشيحات.
      </p>


      <div class="advisor-result-grid">

        ${
          results.length

            ? results
                .map(
                  product =>
                    productCard(
                      product
                    )
                )
                .join("")

            : `

              <div class="empty-state">

                لم نجد تطابقاً كافياً.
                جرّب اختيارات أخرى.

              </div>

            `
        }

      </div>

    </div>

  `;

}


/* =========================================================
   البحث الصوتي
   ========================================================= */

function startVoiceSearch() {

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!Recognition) {

    showToast(
      "البحث الصوتي غير مدعوم في هذا المتصفح"
    );

    return;

  }


  const recognition =
    new Recognition();


  recognition.lang =
    "ar-EG";


  recognition.interimResults =
    false;


  recognition.maxAlternatives =
    1;


  showToast(
    "تحدث الآن باسم العطر"
  );


  recognition.onresult =
    event => {

      const transcript =
        event.results?.[0]?.[0]?.transcript ||
        "";


      STATE.search =
        transcript;


      STATE.page =
        0;


      $$(
        "[data-search]"
      )
        .forEach(
          input => {

            input.value =
              transcript;

          }
        );


      renderProducts();


      showToast(
        `بحث عن: ${transcript}`
      );

    };


  recognition.onerror =
    () => {

      showToast(
        "تعذر تشغيل البحث الصوتي"
      );

    };


  recognition.start();

}


/* =========================================================
   تبديل اللغة
   ========================================================= */

function toggleLanguage() {

  const html =
    document.documentElement;


  const current =
    html.getAttribute(
      "lang"
    ) ||
    "ar";


  const next =
    current ===
    "ar"
      ? "en"
      : "ar";


  html.setAttribute(
    "lang",
    next
  );


  html.setAttribute(
    "dir",
    next ===
      "ar"
      ? "rtl"
      : "ltr"
  );


  $$(
    "[data-lang-label]"
  )
    .forEach(
      element => {

        element.textContent =
          next ===
            "ar"
            ? "English"
            : "العربية";

      }
    );


  showToast(
    next === "ar"
      ? "العربية"
      : "English"
  );

}


/* =========================================================
   إعداد منشئ الباقات
   ========================================================= */

const BUILDER = {

  perfume:
    null,

  bottle:
    null,

  box:
    null,

  wrapping:
    null

};


/* =========================================================
   عرض منشئ الباقات
   ========================================================= */

function renderBuilder() {

  const container =
    $(
      "[data-builder]"
    );


  if (!container) {

    return;

  }


  const perfumes =
    publicProducts()
      .slice(
        0,
        50
      );


  container.innerHTML = `

    <div class="builder-field">

      <label>
        العطر
      </label>

      <select
        data-builder="perfume"
      >

        <option value="">
          اختر العطر
        </option>

        ${perfumes
          .map(
            product => `

              <option
                value="${esc(product.id)}"
              >

                ${esc(
                  productName(
                    product
                  )
                )}

              </option>

            `
          )
          .join("")}

      </select>

    </div>


    <div class="builder-field">

      <label>
        القارورة
      </label>

      <select
        data-builder="bottle"
      >

        <option value="">
          بدون قارورة إضافية
        </option>

        <option value="classic">
          قارورة كلاسيكية
        </option>

        <option value="luxury">
          قارورة ملكية
        </option>

        <option value="crystal">
          قارورة كريستال
        </option>

      </select>

    </div>


    <div class="builder-field">

      <label>
        العلبة
      </label>

      <select
        data-builder="box"
      >

        <option value="">
          بدون علبة
        </option>

        <option value="normal">
          علبة عادية
        </option>

        <option value="luxury">
          علبة فاخرة
        </option>

      </select>

    </div>


    <div class="builder-field">

      <label>
        التغليف
      </label>

      <select
        data-builder="wrapping"
      >

        <option value="">
          بدون تغليف
        </option>

        <option value="gift">
          تغليف هدية
        </option>

        <option value="royal">
          تغليف ملكي
        </option>

      </select>

    </div>


    <div
      class="builder-total"
      data-builder-total
    >

      0 ${esc(SET.currency)}

    </div>


    <button
      type="button"
      class="primary-btn"
      data-action="builder-add"
    >

      <i class="fa-solid fa-cart-plus"></i>

      إضافة الباقة للسلة

    </button>

  `;


  updateBuilder();

}


/* =========================================================
   تحديث منشئ الباقات
   ========================================================= */

function updateBuilder() {

  const perfumeSelect =
    $(
      '[data-builder="perfume"]'
    );


  if (!perfumeSelect) {

    return;

  }


  BUILDER.perfume =
    perfumeSelect.value ||
    null;


  const bottleSelect =
    $(
      '[data-builder="bottle"]'
    );


  const boxSelect =
    $(
      '[data-builder="box"]'
    );


  const wrappingSelect =
    $(
      '[data-builder="wrapping"]'
    );


  BUILDER.bottle =
    bottleSelect?.value ||
    null;


  BUILDER.box =
    boxSelect?.value ||
    null;


  BUILDER.wrapping =
    wrappingSelect?.value ||
    null;


  const product =
    STATE.products.find(
      item =>
        item.id ===
        BUILDER.perfume
    );


  let total =
    product
      ? getLowestPrice(
          product
        )
      : 0;


  const extras = {

    bottle: {

      classic:
        30,

      luxury:
        75,

      crystal:
        120

    },


    box: {

      normal:
        20,

      luxury:
        60

    },


    wrapping: {

      gift:
        15,

      royal:
        35

    }

  };


  total +=
    extras.bottle[
      BUILDER.bottle
    ] || 0;


  total +=
    extras.box[
      BUILDER.box
    ] || 0;


  total +=
    extras.wrapping[
      BUILDER.wrapping
    ] || 0;


  const totalElement =
    $(
      "[data-builder-total]"
    );


  if (totalElement) {

    totalElement.textContent =
      money(total);

  }

}


/* =========================================================
   إضافة الباقة للسلة
   ========================================================= */

function builderAddToCart() {

  const product =
    STATE.products.find(
      item =>
        item.id ===
        BUILDER.perfume
    );


  if (!product) {

    showToast(
      "اختر العطر أولاً"
    );

    return;

  }


  const price =
    getLowestPrice(
      product
    );


  const extras = {

    bottle: {

      classic:
        30,

      luxury:
        75,

      crystal:
        120

    },


    box: {

      normal:
        20,

      luxury:
        60

    },


    wrapping: {

      gift:
        15,

      royal:
        35

    }

  };


  const total =
    price +

    (
      extras.bottle[
        BUILDER.bottle
      ] || 0
    ) +

    (
      extras.box[
        BUILDER.box
      ] || 0
    ) +

    (
      extras.wrapping[
        BUILDER.wrapping
      ] || 0
    );


  STATE.cart.push({

    key:
      `bundle_${Date.now()}`,

    productId:
      product.id,

    name:
      `${productName(product)} — باقة المملكة`,

    size:
      getProductSizes(
        product
      )[0]?.ml || 0,

    price:
      total,

    packaging:
      "باقة مخصصة",

    qty:
      1

  });


  saveState();

  updateCartUI();

  showToast(
    "تمت إضافة باقة المملكة إلى السلة"
  );

}


/* =========================================================
   إعادة ضبط المنشئ
   ========================================================= */

function resetBuilder() {

  BUILDER.perfume =
    null;

  BUILDER.bottle =
    null;

  BUILDER.box =
    null;

  BUILDER.wrapping =
    null;


  renderBuilder();

}


/* =========================================================
   الدخول إلى لوحة الإدارة
   ========================================================= */

function openAdmin() {

  const admin =
    $(
      "#adminPanel"
    ) ||
    $(
      "[data-admin]"
    );


  if (!admin) {

    return;

  }


  admin.classList.add(
    "open"
  );


  renderAdmin();

}


/* =========================================================
   إغلاق لوحة الإدارة
   ========================================================= */

function closeAdmin() {

  const admin =
    $(
      "#adminPanel"
    ) ||
    $(
      "[data-admin]"
    );


  if (!admin) {

    return;

  }


  admin.classList.remove(
    "open"
  );

}


/* =========================================================
   حالة دخول الإدارة
   ========================================================= */

let ADMIN_AUTH =
  false;


/* =========================================================
   إظهار / إخفاء الإدارة
   ========================================================= */

function updateAdminVisibility() {

  const adminButtons =
    $$(
      "[data-admin-trigger]"
    );


  adminButtons.forEach(
    button => {

      button.style.display =
        "none";

    }
  );


  if (
    new URLSearchParams(
      location.search
    ).has("admin")
  ) {

    adminButtons.forEach(
      button => {

        button.style.display =
          "";

      }
    );

  }

}


/* =========================================================
   إنشاء رمز الإدارة لأول مرة
   ========================================================= */

async function setupAdminPassword(
  password
) {

  if (
    !password
  ) {

    return false;

  }


  const salt =
    crypto?.randomUUID
      ? crypto.randomUUID()
      : String(
          Math.random()
        );


  const hash =
    await sha256(
      salt +
      "::" +
      password
    );


  localStorage.setItem(
    ADMIN_SALT_KEY,
    salt
  );


  localStorage.setItem(
    ADMIN_HASH_KEY,
    hash
  );


  localStorage.setItem(
    ADMIN_SETUP_KEY,
    "1"
  );


  return true;

}


/* =========================================================
   التحقق من رمز الإدارة
   ========================================================= */

async function verifyAdminPassword(
  password
) {

  const salt =
    localStorage.getItem(
      ADMIN_SALT_KEY
    );


  const storedHash =
    localStorage.getItem(
      ADMIN_HASH_KEY
    );


  if (
    !salt ||
    !storedHash
  ) {

    return false;

  }


  const hash =
    await sha256(
      salt +
      "::" +
      password
    );


  return (
    hash ===
    storedHash
  );

}


/* =========================================================
   تسجيل الدخول
   ========================================================= */

async function adminLogin() {

  const passwordInput =
    $(
      "#adminPassword"
    ) ||
    $(
      "[data-admin-password]"
    );


  const password =
    passwordInput?.value ||
    "";


  if (!password) {

    showToast(
      "أدخل رمز الإدارة"
    );

    return;

  }


  const configured =
    localStorage.getItem(
      ADMIN_SETUP_KEY
    );


  if (!configured) {

    await setupAdminPassword(
      password
    );

    ADMIN_AUTH =
      true;

    showToast(
      "تم إنشاء رمز الإدارة لأول مرة"
    );

    renderAdmin();

    return;

  }


  const valid =
    await verifyAdminPassword(
      password
    );


  if (!valid) {

    showToast(
      "رمز الإدارة غير صحيح"
    );

    return;

  }


  ADMIN_AUTH =
    true;


  showToast(
    "تم تسجيل الدخول"
  );


  renderAdmin();

}


/* =========================================================
   تسجيل الخروج
   ========================================================= */

function adminLogout() {

  ADMIN_AUTH =
    false;

  renderAdmin();

  showToast(
    "تم تسجيل الخروج"
  );

}


/* =========================================================
   رسم لوحة الإدارة
   ========================================================= */

function renderAdmin() {

  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  if (!ADMIN_AUTH) {

    container.innerHTML = `

      <div class="admin-login-box">

        <i class="fa-solid fa-shield-halved"></i>

        <h2>
          لوحة المملكة
        </h2>

        <p>
          هذه المنطقة مخصصة لمالك المتجر.
        </p>


        <input
          id="adminPassword"
          type="password"
          placeholder="رمز الإدارة"
          autocomplete="current-password"
        >


        <button
          type="button"
          class="primary-btn"
          data-action="admin-login"
        >

          دخول الإدارة

        </button>

      </div>

    `;

    return;

  }


  renderAdminProducts();

}


/* =========================================================
   رسم منتجات الإدارة
   ========================================================= */

function renderAdminProducts() {

  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  if (!ADMIN_AUTH) {

    renderAdmin();

    return;

  }


  const review =
    reviewProducts();


  const products =
    STATE.products;


  container.innerHTML = `

    <div class="admin-toolbar">

      <div>

        <strong>
          لوحة إدارة مملكة العطور
        </strong>

        <span>
          ${products.length}
          منتج
        </span>

      </div>


      <div class="admin-actions">

        <button
          type="button"
          data-action="admin-add"
        >

          <i class="fa-solid fa-plus"></i>

          إضافة منتج

        </button>


        <button
          type="button"
          data-action="admin-export"
        >

          تصدير JSON

        </button>


        <button
          type="button"
          data-action="admin-import"
        >

          استيراد JSON

        </button>


        <button
          type="button"
          data-action="admin-backup"
        >

          نسخة احتياطية

        </button>


        <button
          type="button"
          data-action="admin-history"
        >

          سجل التغييرات

        </button>


        <button
          type="button"
          data-action="admin-logout"
        >

          خروج

        </button>

      </div>

    </div>


    ${
      review.length

        ? `

          <section class="admin-review">

            <h3>

              <i class="fa-solid fa-triangle-exclamation"></i>

              منتجات تحتاج مراجعة

            </h3>

            <p>
              هذه المنتجات لا تظهر للزوار حتى تكتمل بياناتها.
            </p>

            <div class="review-list">

              ${review
                .map(
                  product =>
                    adminProductRow(
                      product,
                      true
                    )
                )
                .join("")}

            </div>

          </section>

        `

        : ""
    }


    <section class="admin-products">

      <div class="admin-table">

        ${products
          .map(
            product =>
              adminProductRow(
                product
              )
          )
          .join("")}

      </div>

    </section>

  `;

}


/* =========================================================
   صف منتج الإدارة
   ========================================================= */

function adminProductRow(
  product,
  review = false
) {

  return `

    <div
      class="admin-product-row ${
        review
          ? "needs-review"
          : ""
      }"
    >

      <div class="admin-product-main">

        <strong>

          ${esc(
            productName(
              product
            )
          )}

        </strong>


        <span>

          ${esc(
            manufacturerName(
              product
            )
          )}

        </span>


        <small>

          ${esc(
            genderLabel(
              product.gender
            )
          )}

          ·

          ${esc(
            typeLabel(
              product
            )
          )}

          ·

          مخزون:
          ${esc(
            product.stock
          )}

        </small>

      </div>


      <div class="admin-product-status">

        ${
          product.needsReview

            ? `

              <span class="status-review">
                يحتاج مراجعة
              </span>

            `

            : product.active

              ? `

                <span class="status-active">
                  نشط
                </span>

              `

              : `

                <span class="status-off">
                  مخفي
                </span>

              `
        }

      </div>


      <div class="admin-product-actions">

        <button
          type="button"
          onclick="editProduct('${esc(product.id)}')"
        >

          تعديل

        </button>


        <button
          type="button"
          data-action="admin-delete"
          data-id="${esc(product.id)}"
        >

          حذف

        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   إضافة منتج
   ========================================================= */

function adminAddProduct() {

  if (!ADMIN_AUTH) {

    return;

  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="admin-editor">

      <h3>
        إضافة منتج جديد
      </h3>


      ${adminProductForm()}


      <div class="admin-editor-actions">

        <button
          type="button"
          class="primary-btn"
          data-action="admin-save"
        >

          حفظ المنتج

        </button>


        <button
          type="button"
          data-action="admin-products"
        >

          رجوع

        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   نموذج المنتج
   ========================================================= */

function adminProductForm(
  product = {}
) {

  const sizes =
    Array.isArray(
      product.sizes
    )
      ? product.sizes
      : [];


  return `

    <div
      class="admin-form"
      data-admin-editor
      data-product-id="${esc(
        product.id || ""
      )}"
    >

      <div class="form-grid">

        <label>

          اسم المنتج

          <input
            name="name"
            value="${esc(
              product.name || ""
            )}"
            required
          >

        </label>


        <label>

          الاسم الإنجليزي

          <input
            name="nameEn"
            value="${esc(
              product.nameEn || ""
            )}"
          >

        </label>


        <label>

          الشركة / المصنع

          <input
            name="manufacturer"
            value="${esc(
              product.manufacturer || ""
            )}"
          >

        </label>


        <label>

          العلامة التجارية

          <input
            name="brand"
            value="${esc(
              product.brand || ""
            )}"
          >

        </label>


        <label>

          النوع

          <select name="kind">

            <option
              value="perfume"
              ${
                product.kind ===
                "perfume"
                  ? "selected"
                  : ""
              }
            >
              عطر
            </option>


            <option
              value="oil"
              ${
                product.kind ===
                "oil"
                  ? "selected"
                  : ""
              }
            >
              زيت عطري
            </option>

          </select>

        </label>


        <label>

          التصنيف

          <select name="gender">

            <option
              value="M"
              ${
                product.gender ===
                "M"
                  ? "selected"
                  : ""
              }
            >
              رجالي
            </option>


            <option
              value="W"
              ${
                product.gender ===
                "W"
                  ? "selected"
                  : ""
              }
            >
              حريمي
            </option>


            <option
              value="U"
              ${
                product.gender ===
                "U"
                  ? "selected"
                  : ""
              }
            >
              يونيسكس
            </option>

          </select>

        </label>


        <label>

          العائلة

          <select name="family">

            ${Object.entries(
              FAMILIES
            )
              .map(
                ([
                  key,
                  family
                ]) => `

                  <option
                    value="${esc(key)}"
                    ${
                      (
                        product.family ===
                        key
                      )
                        ? "selected"
                        : ""
                    }
                  >

                    ${esc(
                      family.ar
                    )}

                  </option>

                `
              )
              .join("")}

          </select>

        </label>


        <label>

          القوة

          <select name="strength">

            <option value="">
              غير محدد
            </option>


            <option
              value="strong"
              ${
                product.strength ===
                "strong"
                  ? "selected"
                  : ""
              }
            >
              قوي
            </option>


            <option
              value="medium"
              ${
                product.strength ===
                "medium"
                  ? "selected"
                  : ""
              }
            >
              متوسط
            </option>


            <option
              value="soft"
              ${
                product.strength ===
                "soft"
                  ? "selected"
                  : ""
              }
            >
              هادئ
            </option>

          </select>

        </label>


        <label>

          تاريخ التصنيع

          <input
            type="date"
            name="manufactureDate"
            value="${esc(
              product.manufactureDate || ""
            )}"
          >

        </label>


        <label>

          سنة الإصدار

          <input
            type="number"
            name="releaseYear"
            min="1900"
            max="2100"
            value="${esc(
              product.releaseYear || ""
            )}"
          >

        </label>


        <label>

          المخزون

          <input
            type="number"
            name="stock"
            min="0"
            value="${esc(
              product.stock ?? 0
            )}"
          >

        </label>


        <label>

          الصورة

          <input
            name="image"
            value="${esc(
              product.image || ""
            )}"
            placeholder="رابط الصورة أو المسار المحلي"
          >

        </label>

      </div>


      <label class="full-field">

        الوصف

        <textarea
          name="description"
          rows="4"
        >${esc(
          product.description || ""
        )}</textarea>

      </label>


      <div class="price-editor">

        <h4>
          أسعار المقاسات
        </h4>


        <div class="price-grid">

          ${
            (
              product.kind ===
              "oil"

                ? OIL_SIZE_OPTIONS

                : PERFUME_SIZE_OPTIONS
            )
              .map(
                ml => {

                  const current =
                    sizes.find(
                      size =>
                        Number(
                          size.ml
                        ) ===
                        Number(ml)
                    )?.price;


                  const fallback =
                    DEFAULT_SIZE_PRICE_TABLE[
                      ml
                    ] ?? "";


                  return `

                    <label>

                      ${ml} مل

                      <input
                        type="number"
                        min="0"
                        step="1"
                        data-price-ml="${ml}"
                        value="${esc(
                          current ??
                          fallback
                        )}"
                      >

                    </label>

                  `;

                }
              )
              .join("")
          }

        </div>

      </div>


      <label class="checkbox-field">

        <input
          type="checkbox"
          name="active"
          ${
            product.active !==
            false
              ? "checked"
              : ""
          }
        >

        تفعيل المنتج للزوار

      </label>

    </div>

  `;

}


/* =========================================================
   حفظ المنتج
   ========================================================= */

function adminSaveProduct() {

  if (!ADMIN_AUTH) {

    return;

  }


  const form =
    $(
      "[data-admin-editor]"
    );


  if (!form) {

    return;

  }


  const data = {

    name:
      form.elements.name?.value
        .trim() || "",

    nameEn:
      form.elements.nameEn?.value
        .trim() || "",

    manufacturer:
      form.elements.manufacturer?.value
        .trim() || "",

    brand:
      form.elements.brand?.value
        .trim() || "",

    kind:
      form.elements.kind?.value ||
      "perfume",

    gender:
      form.elements.gender?.value ||
      "U",

    family:
      form.elements.family?.value ||
      "fresh",

    strength:
      form.elements.strength?.value ||
      "",

    manufactureDate:
      form.elements.manufactureDate?.value ||
      "",

    releaseYear:
      form.elements.releaseYear?.value ||
      "",

    stock:
      Number(
        form.elements.stock?.value ||
        0
      ),

    image:
      form.elements.image?.value
        .trim() || "",

    description:
      form.elements.description?.value
        .trim() || "",

    active:
      Boolean(
        form.elements.active?.checked
      )

  };


  if (!data.name) {

    showToast(
      "اسم المنتج مطلوب"
    );

    return;

  }


  const id =
    form.dataset.productId;


  if (
    hasDuplicateProduct(
      data,
      id || null
    )
  ) {

    showToast(
      "يوجد منتج بنفس الاسم والشركة بالفعل"
    );

    return;

  }


  const priceInputs =
    $$(
      "[data-price-ml]"
    );


  data.sizes =
    priceInputs.map(
      input => ({

        ml:
          Number(
            input.dataset.priceMl
          ),

        price:
          Number(
            input.value
          )

      })
    );


  data.prices =
    data.sizes;


  data.id =
    id ||
    `product_${Date.now()}`;


  data.nameAr =
    data.name;


  data.brandAr =
    data.brand;


  data.familyAr =
    FAMILIES[
      data.family
    ]?.ar || "";


  data.type =
    data.kind ===
    "oil"
      ? "زيت"
      : "عطر";


  data.needsReview =
    !data.nameEn ||
    !data.manufactureDate ||
    !data.description;


  data.active =
    data.active &&
    !data.needsReview;


  autoBackup(
    id
      ? "before-product-update"
      : "before-product-add"
  );


  const before =
    id
      ? clone(
          STATE.products.find(
            p =>
              p.id ===
              id
          )
        )
      : null;


  if (id) {

    const index =
      STATE.products.findIndex(
        p =>
          p.id ===
          id
      );


    if (
      index !==
      -1
    ) {

      STATE.products[
        index
      ] =
        normalizeProductRecord(
          data,
          index
        );

    }

  } else {

    STATE.products.push(
      normalizeProductRecord(
        data,
        STATE.products.length
      )
    );

  }


  const after =
    clone(
      STATE.products.find(
        p =>
          p.id ===
          data.id
      )
    );


  recordChange(
    id
      ? "تعديل منتج"
      : "إضافة منتج",
    before,
    after
  );


  saveState();

  renderAll();

  renderAdminProducts();

  showToast(
    data.needsReview
      ? "تم الحفظ، لكن المنتج يحتاج استكمال البيانات قبل تفعيله"
      : "تم حفظ المنتج"
  );

}


/* =========================================================
   تعديل المنتج
   ========================================================= */

function editProduct(
  productId
) {

  if (!ADMIN_AUTH) {

    return;

  }


  const product =
    STATE.products.find(
      item =>
        item.id ===
        productId
    );


  if (!product) {

    return;

  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="admin-editor">

      <h3>
        تعديل المنتج
      </h3>


      ${adminProductForm(
        product
      )}


      <div class="admin-editor-actions">

        <button
          type="button"
          class="primary-btn"
          data-action="admin-save"
        >

          حفظ التعديلات

        </button>


        <button
          type="button"
          data-action="admin-products"
        >

          رجوع

        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   حذف المنتج
   ========================================================= */

function deleteProduct(
  productId
) {

  if (!ADMIN_AUTH) {

    return;

  }


  const product =
    STATE.products.find(
      item =>
        item.id ===
        productId
    );


  if (!product) {

    return;

  }


  const confirmed =
    window.confirm(
      `هل تريد حذف "${productName(product)}"؟\nسيتم إنشاء نسخة احتياطية قبل الحذف.`
    );


  if (!confirmed) {

    return;

  }


  autoBackup(
    "before-product-delete"
  );


  const before =
    clone(
      product
    );


  STATE.products =
    STATE.products.filter(
      item =>
        item.id !==
        productId
    );


  recordChange(
    "حذف منتج",
    before,
    null
  );


  saveState();

  renderAll();

  renderAdminProducts();

  showToast(
    "تم حذف المنتج"
  );

}


/* =========================================================
   تصدير JSON
   ========================================================= */

function exportJSON() {

  if (!ADMIN_AUTH) {

    return;

  }


  const data = {

    version:
      STORE.version,

    exportedAt:
      new Date()
        .toISOString(),

    settings:
      SET,

    products:
      STATE.products,

    cart:
      STATE.cart,

    wish:
      STATE.wish

  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href =
    url;


  a.download =
    `mamlaka-backup-${Date.now()}.json`;


  document.body.appendChild(
    a
  );


  a.click();


  a.remove();


  URL.revokeObjectURL(
    url
  );


  showToast(
    "تم تصدير بيانات المملكة"
  );

}


/* =========================================================
   استيراد JSON
   ========================================================= */

function importJSON() {

  if (!ADMIN_AUTH) {

    return;

  }


  const input =
    document.createElement(
      "input"
    );


  input.type =
    "file";


  input.accept =
    ".json,application/json";


  input.onchange =
    async () => {

      const file =
        input.files?.[0];


      if (!file) {

        return;

      }


      try {

        const text =
          await file.text();


        const data =
          JSON.parse(
            text
          );


        const imported =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data.products
              )
              ? data.products
              : [];


        if (
          !imported.length
        ) {

          throw new Error(
            "لا توجد منتجات صالحة في الملف"
          );

        }


        autoBackup(
          "before-json-import"
        );


        const before =
          clone(
            STATE.products
          );


        const existingKeys =
          new Set(
            STATE.products.map(
              productDuplicateKey
            )
          );


        let added =
          0;


        let duplicates =
          0;


        imported.forEach(
          (
            raw,
            index
          ) => {

            const product =
              normalizeProductRecord(
                raw,
                index
              );


            const key =
              productDuplicateKey(
                product
              );


            if (
              !key ||
              existingKeys.has(
                key
              )
            ) {

              duplicates++;

              return;

            }


            STATE.products.push(
              product
            );


            existingKeys.add(
              key
            );


            added++;

          }
        );


        if (
          data.settings
        ) {

          SET = {

            ...SET,

            ...data.settings

          };


          localStorage.setItem(
            "crown_settings",
            JSON.stringify(
              SET
            )
          );

        }


        recordChange(
          "استيراد JSON",
          before,
          clone(
            STATE.products
          )
        );


        saveState();

        applySettingsToPage();

        renderAll();

        renderAdminProducts();


        showToast(
          `تم استيراد ${added} منتج وتجاهل ${duplicates} مكرر`
        );


      } catch (error) {

        console.error(
          error
        );


        showToast(
          "ملف JSON غير صالح أو غير متوافق"
        );

      }

    };


  input.click();

}


/* =========================================================
   إنشاء نسخة احتياطية يدوية
   ========================================================= */

function createManualBackup() {

  if (!ADMIN_AUTH) {

    return;

  }


  autoBackup(
    "manual"
  );


  showToast(
    "تم إنشاء نسخة احتياطية"
  );

}


/* =========================================================
   استعادة آخر نسخة احتياطية
   ========================================================= */

function restoreLastBackup() {

  if (!ADMIN_AUTH) {

    return;

  }


  try {

    const backups =
      JSON.parse(
        localStorage.getItem(
          BACKUP_KEY
        ) || "[]"
      );


    const latest =
      backups[0];


    if (!latest) {

      showToast(
        "لا توجد نسخة احتياطية"
      );

      return;

    }


    const confirmed =
      window.confirm(
        "هل تريد استعادة آخر نسخة احتياطية؟"
      );


    if (!confirmed) {

      return;

    }


    const before =
      clone(
        STATE.products
      );


    STATE.products =
      (
        latest.products ||
        []
      )
        .map(
          normalizeProductRecord
        );


    if (
      latest.settings
    ) {

      SET = {

        ...DEFAULT_SETTINGS,

        ...latest.settings

      };


      localStorage.setItem(
        "crown_settings",
        JSON.stringify(
          SET
        )
      );

    }


    recordChange(
      "استعادة نسخة احتياطية",
      before,
      clone(
        STATE.products
      )
    );


    saveState();

    applySettingsToPage();

    renderAll();

    renderAdminProducts();


    showToast(
      "تمت استعادة النسخة الاحتياطية"
    );


  } catch (error) {

    showToast(
      "تعذر استعادة النسخة"
    );

  }

}


/* =========================================================
   سجل التغييرات
   ========================================================= */

function renderChangeHistory() {

  if (!ADMIN_AUTH) {

    return;

  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  let history = [];


  try {

    history =
      JSON.parse(
        localStorage.getItem(
          HISTORY_KEY
        ) || "[]"
      );

  } catch {}


  container.innerHTML = `

    <div class="admin-history">

      <div class="admin-history-head">

        <h3>
          سجل التغييرات
        </h3>


        <button
          type="button"
          data-action="admin-products"
        >

          رجوع

        </button>

      </div>


      ${
        history.length

          ? history
              .map(
                item => `

                  <div class="history-row">

                    <strong>
                      ${esc(
                        item.action
                      )}
                    </strong>

                    <time>
                      ${esc(
                        item.at
                      )}
                    </time>

                  </div>

                `
              )
              .join("")

          : `

            <div class="empty-state">

              لا توجد تغييرات مسجلة.

            </div>

          `
      }

    </div>

  `;

}


/* =========================================================
   إعدادات الإدارة
   ========================================================= */

function renderAdminSettings() {

  if (!ADMIN_AUTH) {

    return;

  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="admin-settings">

      <h3>
        إعدادات المملكة
      </h3>


      <div class="form-grid">

        <label>

          اسم المتجر

          <input
            id="settingBrand"
            value="${esc(
              SET.brand
            )}"
          >

        </label>


        <label>

          رقم واتساب

          <input
            id="settingWhatsapp"
            value="${esc(
              SET.whatsapp
            )}"
          >

        </label>


        <label>

          العنوان

          <input
            id="settingAddress"
            value="${esc(
              SET.address
            )}"
          >

        </label>


        <label>

          العملة

          <input
            id="settingCurrency"
            value="${esc(
              SET.currency
            )}"
          >

        </label>

      </div>


      <div class="admin-editor-actions">

        <button
          type="button"
          class="primary-btn"
          onclick="saveAdminSettings()"
        >

          حفظ الإعدادات

        </button>


        <button
          type="button"
          data-action="admin-products"
        >

          رجوع

        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   حفظ إعدادات الإدارة
   ========================================================= */

function saveAdminSettings() {

  if (!ADMIN_AUTH) {

    return;

  }


  autoBackup(
    "before-settings-update"
  );


  const before =
    clone(
      SET
    );


  SET = {

    ...SET,

    brand:
      $(
        "#settingBrand"
      )?.value
        .trim() ||
      SET.brand,

    whatsapp:
      $(
        "#settingWhatsapp"
      )?.value
        .trim() ||
      SET.whatsapp,

    address:
      $(
        "#settingAddress"
      )?.value
        .trim() ||
      SET.address,

    currency:
      $(
        "#settingCurrency"
      )?.value
        .trim() ||
      SET.currency

  };


  localStorage.setItem(
    "crown_settings",
    JSON.stringify(
      SET
    )
  );


  recordChange(
    "تعديل الإعدادات",
    before,
    clone(
      SET
    )
  );


  applySettingsToPage();

  renderAll();

  renderAdminSettings();


  showToast(
    "تم حفظ الإعدادات"
  );

}


/* =========================================================
   أوامر الإدارة القديمة
   ========================================================= */

function renderAdminOrders() {

  if (!ADMIN_AUTH) {

    return;

  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {

    return;

  }


  const orders =
    getLocalOrdersSafe();


  container.innerHTML = `

    <div class="admin-orders">

      <div class="admin-history-head">

        <h3>
          الطلبات
        </h3>


        <button
          type="button"
          data-action="admin-products"
        >

          رجوع

        </button>

      </div>


      ${
        orders.length

          ? orders
              .map(
                order => `

                  <div class="order-row">

                    <div>

                      <strong>
                        ${esc(
                          order.id
                        )}
                      </strong>

                      <time>
                        ${esc(
                          order.at
                        )}
                      </time>

                    </div>


                    <strong>
                      ${money(
                        order.total
                      )}
                    </strong>

                  </div>

                `
              )
              .join("")

          : `

            <div class="empty-state">

              لا توجد طلبات محفوظة محلياً.

            </div>

          `
      }

    </div>

  `;

}


/* =========================================================
   عرض الإدارة إذا كانت مفتوحة
   ========================================================= */

function renderAdminIfOpen() {

  const admin =
    $(
      "#adminPanel"
    ) ||
    $(
      "[data-admin]"
    );


  if (
    admin?.classList.contains(
      "open"
    )
  ) {

    renderAdmin();

  }

}


/* =========================================================
   زر فتح الإدارة السري
   الضغط المطول
   ========================================================= */

function enableSecretAdminTrigger() {

  let timer =
    null;


  document.addEventListener(
    "pointerdown",
    event => {

      const target =
        event.target.closest(
          "[data-secret-admin]"
        );


      if (!target) {

        return;

      }


      timer =
        setTimeout(
          () => {

            openAdmin();

          },
          1800
        );

    }
  );


  document.addEventListener(
    "pointerup",
    () => {

      clearTimeout(
        timer
      );

    }
  );


  document.addEventListener(
    "pointercancel",
    () => {

      clearTimeout(
        timer
      );

    }
  );

}


/* =========================================================
   تشغيل الأحداث الخاصة
   ========================================================= */

enableSecretAdminTrigger();


/* =========================================================
   تشغيل التطبيق
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );

} else {

  initApp();

}


/* =========================================================
   نهاية الجزء الأول
   =========================================================/*
/* =========================================================
   مملكة العطور
   app.js — الجزء الثاني
   وظائف التشغيل المتقدمة
   ========================================================= */


/* =========================================================
   اختيار حجم المنتج من نافذة التفاصيل
   ========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const sizeButton =
      event.target.closest(
        "[data-size]"
      );

    if (!sizeButton) {
      return;
    }

    const productId =
      sizeButton.dataset.id;

    const size =
      Number(
        sizeButton.dataset.size
      );

    const product =
      STATE.products.find(
        p =>
          p.id === productId
      );

    if (!product) {
      return;
    }

    const sizes =
      getProductSizes(
        product
      );

    const index =
      sizes.findIndex(
        item =>
          Number(item.ml) ===
          size
      );

    if (index === -1) {
      return;
    }

    STATE.modal.productId =
      productId;

    STATE.modal.sizeIndex =
      index;

    renderProductModal();

  }
);


/* =========================================================
   فحص حالة المخزون
   ========================================================= */

function stockStatus(
  product
) {

  const stock =
    Number(
      product?.stock || 0
    );

  if (stock <= 0) {

    return {
      type: "out",
      label: "غير متوفر"
    };

  }

  if (stock <= 5) {

    return {
      type: "low",
      label: "متبقي قليل"
    };

  }

  return {
    type: "available",
    label: "متوفر"
  };

}


/* =========================================================
   تعديل بطاقة المنتج لإظهار حالة المخزون
   ========================================================= */

function productStockBadge(
  product
) {

  const status =
    stockStatus(
      product
    );

  if (
    status.type ===
    "available"
  ) {

    return `
      <span class="stock-badge available">
        <i class="fa-solid fa-circle-check"></i>
        متوفر
      </span>
    `;

  }

  if (
    status.type ===
    "low"
  ) {

    return `
      <span class="stock-badge low">
        <i class="fa-solid fa-triangle-exclamation"></i>
        متبقي قليل
      </span>
    `;

  }

  return `
    <span class="stock-badge out">
      <i class="fa-solid fa-circle-xmark"></i>
      غير متوفر
    </span>
  `;

}


/* =========================================================
   التحقق من إمكانية الشراء
   ========================================================= */

function canPurchase(
  product
) {

  if (!product) {
    return false;
  }

  /*
   لا نمنع الشراء للمنتجات التي لم يتم
   إدخال المخزون لها حتى لا تتعطل
   المنتجات القديمة.
  */

  if (
    product.stock ===
    undefined ||
    product.stock ===
    null
  ) {

    return true;

  }

  return (
    Number(
      product.stock
    ) > 0
  );

}


/* =========================================================
   نسخة محسنة من إضافة المنتج للسلة
   ========================================================= */

function addToCartSafe(
  productId,
  selectedSize = null
) {

  const product =
    STATE.products.find(
      p =>
        p.id === productId
    );

  if (!product) {

    showToast(
      "المنتج غير موجود"
    );

    return;

  }

  if (
    !canPurchase(
      product
    )
  ) {

    showToast(
      "هذا المنتج غير متوفر حالياً"
    );

    return;

  }

  const sizes =
    getProductSizes(
      product
    );

  let size =
    selectedSize;

  if (!size) {

    size =
      sizes[
        STATE.modal.productId ===
        productId
          ? STATE.modal.sizeIndex
          : 0
      ]?.ml;

  }

  size =
    Number(
      size ||
      sizes[0]?.ml ||
      0
    );

  const price =
    getSizePrice(
      product,
      size
    );

  const packaging =
    STATE.modal.productId ===
    productId
      ? STATE.modal.packaging
      : "normal";

  const key =
    `${productId}_${size}_${packaging}`;

  const existing =
    STATE.cart.find(
      item =>
        item.key === key
    );

  if (existing) {

    existing.qty += 1;

  } else {

    STATE.cart.push({

      key,

      productId,

      name:
        productName(
          product
        ),

      size,

      price,

      packaging,

      qty: 1

    });

  }

  saveState();

  updateCartUI();

  showToast(
    "تمت إضافة المنتج للسلة"
  );

}


/* =========================================================
   ربط addToCart القديم بالنسخة الآمنة
   ========================================================= */

window.addToCart =
  addToCartSafe;


/* =========================================================
   فتح نافذة السلة مع الحركة
   ========================================================= */

function openCartAnimated() {

  const cart =
    $(
      "#cartDrawer"
    ) ||
    $(
      "[data-cart]"
    );

  if (!cart) {
    return;
  }

  renderCart();

  requestAnimationFrame(
    () => {

      cart.classList.add(
        "open"
      );

    }
  );

}


/* =========================================================
   تحديث عدد المنتجات في السلة
   ========================================================= */

function refreshCartCounters() {

  const count =
    cartCount();

  const total =
    cartTotal();

  $$(
    "[data-cart-count]"
  )
    .forEach(
      element => {

        element.textContent =
          count;

      }
    );

  $$(
    "[data-cart-total]"
  )
    .forEach(
      element => {

        element.textContent =
          money(
            total
          );

      }
    );

}


/* =========================================================
   حساب إجمالي عنصر واحد
   ========================================================= */

function cartItemTotal(
  item
) {

  return (
    Number(
      item.price
    ) || 0
  ) *
  (
    Number(
      item.qty
    ) || 0
  );

}


/* =========================================================
   إجمالي عدد وحدات السلة
   ========================================================= */

function cartUnits() {

  return STATE.cart.reduce(
    (
      total,
      item
    ) => {

      return (
        total +
        (
          Number(
            item.qty
          ) || 0
        )
      );

    },
    0
  );

}


/* =========================================================
   تكلفة التوصيل
   ========================================================= */

function calculateDelivery(
  governorate = ""
) {

  const value =
    normalizeText(
      governorate
    );

  if (!value) {

    return 0;

  }

  const alex =
    [
      "الاسكندرية",
      "اسكندرية",
      "alexandria"
    ];

  if (
    alex.some(
      item =>
        value.includes(
          item
        )
    )
  ) {

    return 40;

  }

  return 70;

}


/* =========================================================
   قراءة بيانات العميل
   ========================================================= */

function getCustomerData() {

  const name =
    $(
      "#customerName"
    )?.value?.trim() ||
    "";

  const phone =
    $(
      "#customerPhone"
    )?.value?.trim() ||
    "";

  const governorate =
    $(
      "#governorate"
    )?.value?.trim() ||
    "";

  return {

    name,

    phone,

    governorate

  };

}


/* =========================================================
   التحقق من رقم الهاتف
   ========================================================= */

function validEgyptPhone(
  phone
) {

  const clean =
    String(
      phone || ""
    )
      .replace(
        /[\s-]/g,
        ""
      );

  return (
    /^(01)[0-9]{9}$/.test(
      clean
    ) ||
    /^(201)[0-9]{9}$/.test(
      clean
    )
  );

}


/* =========================================================
   تجهيز رقم الهاتف لواتساب
   ========================================================= */

function normalizeEgyptPhone(
  phone
) {

  let value =
    String(
      phone || ""
    )
      .replace(
        /\D/g,
        ""
      );

  if (
    value.startsWith(
      "01"
    )
  ) {

    value =
      "20" +
      value;

  }

  if (
    value.startsWith(
      "0020"
    )
  ) {

    value =
      value.slice(2);

  }

  return value;

}


/* =========================================================
   طلب واتساب كامل
   ========================================================= */

function buildWhatsAppOrder() {

  const customer =
    getCustomerData();

  const delivery =
    calculateDelivery(
      customer.governorate
    );

  const subtotal =
    cartTotal();

  const total =
    subtotal +
    delivery;

  const lines = [

    "👑 مملكة العطور",

    "CROWN · MAISON DE PARFUM",

    "",

    "🛍️ طلب جديد",

    "--------------------",

    `الاسم: ${
      customer.name ||
      "غير محدد"
    }`,

    `الهاتف: ${
      customer.phone ||
      "غير محدد"
    }`,

    `المحافظة: ${
      customer.governorate ||
      "غير محددة"
    }`,

    ""

  ];


  STATE.cart.forEach(
    (
      item,
      index
    ) => {

      lines.push(

        `${index + 1}) ${item.name}`,

        `الحجم: ${item.size} مل`,

        `التغليف: ${item.packaging}`,

        `الكمية: ${item.qty}`,

        `الإجمالي: ${money(
          cartItemTotal(item)
        )}`,

        ""

      );

    }
  );


  lines.push(

    "--------------------",

    `الإجمالي قبل التوصيل: ${money(
      subtotal
    )}`,

    `التوصيل: ${money(
      delivery
    )}`,

    `الإجمالي النهائي: ${money(
      total
    )}`,

    "",

    "أرغب في تأكيد الطلب مع مملكة العطور."

  );


  return {

    customer,

    subtotal,

    delivery,

    total,

    text:
      lines.join(
        "\n"
      )

  };

}


/* =========================================================
   تنفيذ Checkout
   ========================================================= */

function checkoutWhatsAppAdvanced() {

  if (
    !STATE.cart.length
  ) {

    showToast(
      "السلة فارغة"
    );

    return;

  }


  const customer =
    getCustomerData();


  if (
    customer.phone &&
    !validEgyptPhone(
      customer.phone
    )
  ) {

    showToast(
      "رقم الهاتف المصري غير صحيح"
    );

    return;

  }


  const order =
    buildWhatsAppOrder();


  const customerWhatsApp =
    normalizeEgyptPhone(
      customer.phone
    );


  const target =
    SET.whatsapp;


  const url =
    `https://wa.me/${target}?text=` +
    encodeURIComponent(
      order.text
    );


  window.open(
    url,
    "_blank"
  );


  saveOrderLocallyAdvanced(
    order
  );

}


/* =========================================================
   ربط Checkout
   ========================================================= */

window.checkoutWhatsApp =
  checkoutWhatsAppAdvanced;


/* =========================================================
   حفظ الطلب المتقدم
   ========================================================= */

function saveOrderLocallyAdvanced(
  order
) {

  try {

    const orders =
      getLocalOrdersSafe();


    orders.unshift({

      id:
        `ORD-${Date.now()}`,

      createdAt:
        new Date()
          .toISOString(),

      customer:
        order.customer,

      items:
        clone(
          STATE.cart
        ),

      subtotal:
        order.subtotal,

      delivery:
        order.delivery,

      total:
        order.total,

      status:
        "new"

    });


    localStorage.setItem(

      "crown_orders",

      JSON.stringify(
        orders.slice(
          0,
          200
        )
      )

    );

  } catch (
    error
  ) {

    console.warn(
      "تعذر حفظ الطلب",
      error
    );

  }

}


/* =========================================================
   تحديث المخزون بعد البيع
   ========================================================= */

function decreaseStockAfterOrder() {

  STATE.cart.forEach(
    item => {

      const product =
        STATE.products.find(
          p =>
            p.id ===
            item.productId
        );

      if (!product) {
        return;
      }

      if (
        product.stock ===
        undefined
      ) {
        return;
      }

      product.stock =
        Math.max(
          0,
          Number(
            product.stock
          ) -
          Number(
            item.qty
          )
        );

    }
  );


  saveState();

}


/* =========================================================
   المنتجات قليلة المخزون
   ========================================================= */

function lowStockProducts(
  limit = 5
) {

  return STATE.products
    .filter(
      product =>
        Number(
          product.stock
        ) <= limit
    );

}


/* =========================================================
   تقرير المخزون
   ========================================================= */

function inventoryReport() {

  const products =
    STATE.products;


  const total =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        Number(
          product.stock ||
          0
        ),
      0
    );


  const low =
    lowStockProducts()
      .length;


  const out =
    products.filter(
      product =>
        Number(
          product.stock ||
          0
        ) <= 0
    ).length;


  return {

    products:
      products.length,

    units:
      total,

    lowStock:
      low,

    outOfStock:
      out

  };

}


/* =========================================================
   إحصائيات المتجر
   ========================================================= */

function storeStats() {

  const products =
    STATE.products;


  const active =
    products.filter(
      isPublicProduct
    );


  const men =
    active.filter(
      p =>
        p.gender ===
        "M"
    );


  const women =
    active.filter(
      p =>
        p.gender ===
        "W"
    );


  const oils =
    active.filter(
      p =>
        p.kind ===
        "oil"
    );


  const oriental =
    active.filter(
      p =>
        p.family ===
        "oriental"
    );


  return {

    total:
      products.length,

    active:
      active.length,

    men:
      men.length,

    women:
      women.length,

    oils:
      oils.length,

    oriental:
      oriental.length,

    review:
      reviewProducts()
        .length

  };

}


/* =========================================================
   تحديث إحصائيات الواجهة
   ========================================================= */

function updateStoreStats() {

  const stats =
    storeStats();


  const mapping = {

    total:
      stats.total,

    active:
      stats.active,

    men:
      stats.men,

    women:
      stats.women,

    oils:
      stats.oils,

    oriental:
      stats.oriental,

    review:
      stats.review

  };


  Object.entries(
    mapping
  )
    .forEach(
      (
        [
          key,
          value
        ]
      ) => {

        $$(
          `[data-stat="${key}"]`
        )
          .forEach(
            element => {

              element.textContent =
                value;

            }
          );

      }
    );

}


/* =========================================================
   البحث الذكي باسم الشركة
   ========================================================= */

function searchByManufacturer(
  manufacturer
) {

  STATE.search =
    manufacturer ||
    "";

  STATE.page =
    0;


  $$(
    "[data-search]"
  )
    .forEach(
      input => {

        input.value =
          manufacturer ||
          "";

      }
    );


  renderProducts();

}


/* =========================================================
   البحث الذكي بنوع العطر
   ========================================================= */

function searchByType(
  type
) {

  const value =
    normalizeText(
      type
    );


  STATE.search =
    value;

  STATE.page =
    0;


  $$(
    "[data-search]"
  )
    .forEach(
      input => {

        input.value =
          type;

      }
    );


  renderProducts();

}


/* =========================================================
   بحث ذكي شامل
   ========================================================= */

function smartSearch(
  query
) {

  const q =
    normalizeText(
      query
    );


  if (!q) {

    STATE.search =
      "";

    renderProducts();

    return;

  }


  STATE.search =
    q;


  STATE.page =
    0;


  const aliases = {

    رجالي:
      "M",

    رجال:
      "M",

    حريمي:
      "W",

    نسائي:
      "W",

    نساء:
      "W",

    يونيسكس:
      "U",

    زيوت:
      "oil",

    زيت:
      "oil",

    شرقي:
      "oriental",

    عود:
      "oud",

    مسك:
      "musk"

  };


  const category =
    aliases[q];


  if (
    category
  ) {

    setFilter(
      category
    );

    return;

  }


  renderProducts();

}


/* =========================================================
   مساعد صوتي للبحث
   ========================================================= */

function voiceSearchAssistant() {

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!Recognition) {

    showToast(
      "المتصفح لا يدعم البحث الصوتي"
    );

    return;

  }


  const recognition =
    new Recognition();


  recognition.lang =
    "ar-EG";


  recognition.interimResults =
    false;


  recognition.continuous =
    false;


  showToast(
    "🎙️ قل اسم العطر أو الشركة أو النوع"
  );


  recognition.onresult =
    function (
      event
    ) {

      const text =
        event
          .results?.[0]?.[0]
          ?.transcript ||
        "";


      smartSearch(
        text
      );


      speakText(
        `بحثت لك عن ${text}`
      );

    };


  recognition.onerror =
    function () {

      showToast(
        "حدث خطأ أثناء البحث الصوتي"
      );

    };


  recognition.start();

}


/* =========================================================
   الراوي الصوتي
   ========================================================= */

let VOICE_ENABLED =
  false;


try {

  VOICE_ENABLED =
    localStorage.getItem(
      VOICE_KEY
    ) === "1";

} catch {}


/* =========================================================
   تفعيل / تعطيل الراوي
   ========================================================= */

function setVoiceEnabled(
  enabled
) {

  VOICE_ENABLED =
    Boolean(
      enabled
    );


  try {

    localStorage.setItem(
      VOICE_KEY,
      VOICE_ENABLED
        ? "1"
        : "0"
    );

  } catch {}


  updateVoiceButtons();

}


/* =========================================================
   تحديث زر الراوي
   ========================================================= */

function updateVoiceButtons() {

  $$(
    "[data-voice-toggle]"
  )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          VOICE_ENABLED
        );


        const label =
          button.querySelector(
            "[data-voice-label]"
          );


        if (label) {

          label.textContent =
            VOICE_ENABLED
              ? "الراوي: يعمل"
              : "الراوي: متوقف";

        }

      }
    );

}


/* =========================================================
   تنظيف النص قبل النطق
   ========================================================= */

function cleanSpeechText(
  text
) {

  return String(
    text || ""
  )

    .replace(
      /[|•·*_#~`<>{}[\]()/\\]/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}


/* =========================================================
   النطق
   ========================================================= */

function speakText(
  text,
  language = "ar-EG"
) {

  if (
    !VOICE_ENABLED
  ) {

    return;

  }


  if (
    !(
      "speechSynthesis"
      in window
    )
  ) {

    return;

  }


  const clean =
    cleanSpeechText(
      text
    );


  if (!clean) {
    return;
  }


  window.speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      clean
    );


  utterance.lang =
    language;


  utterance.rate =
    0.9;


  utterance.pitch =
    1;


  utterance.volume =
    1;


  window.speechSynthesis.speak(
    utterance
  );

}


/* =========================================================
   نطق اسم المنتج
   ========================================================= */

function speakProductName(
  product
) {

  if (!product) {
    return;
  }


  const name =
    productName(
      product
    );


  speakText(
    name,
    "ar-EG"
  );

}


/* =========================================================
   تشغيل الراوي عند لمس بطاقة المنتج
   ========================================================= */

function enableProductVoiceEvents() {

  document.addEventListener(
    "pointerover",
    function (
      event
    ) {

      if (
        !VOICE_ENABLED
      ) {
        return;
      }


      const card =
        event.target.closest(
          "[data-product-id]"
        );


      if (!card) {
        return;
      }


      const id =
        card.dataset.productId;


      const product =
        STATE.products.find(
          p =>
            p.id === id
        );


      if (product) {

        speakProductName(
          product
        );

      }

    }
  );

}


/* =========================================================
   تفعيل أحداث الراوي
   ========================================================= */

enableProductVoiceEvents();


/* =========================================================
   الإحصائيات بعد التحميل
   ========================================================= */

setTimeout(
  updateStoreStats,
  500
);


/* =========================================================
   مراقبة تغييرات المتجر
   ========================================================= */

let statsRefreshTimer =
  null;


function scheduleStatsRefresh() {

  clearTimeout(
    statsRefreshTimer
  );


  statsRefreshTimer =
    setTimeout(
      updateStoreStats,
      150
    );

}


/* =========================================================
   إعادة تعريف saveState لإضافة الإحصائيات
   ========================================================= */

const originalSaveState =
  saveState;


window.saveMamlakaState =
  function () {

    originalSaveState();

    scheduleStatsRefresh();

  };


/* =========================================================
   فحص البيانات قبل الحفظ
   ========================================================= */

function validateProduct(
  product
) {

  const errors =
    [];


  if (
    !product.name
  ) {

    errors.push(
      "اسم المنتج مفقود"
    );

  }


  if (
    !["M", "W", "U"].includes(
      product.gender
    )
  ) {

    errors.push(
      "تصنيف الجنس غير صحيح"
    );

  }


  if (
    !product.family
  ) {

    errors.push(
      "العائلة العطرية مفقودة"
    );

  }


  if (
    !Array.isArray(
      product.sizes
    ) ||
    !product.sizes.length
  ) {

    errors.push(
      "لا توجد مقاسات"
    );

  }


  if (
    Array.isArray(
      product.sizes
    )
  ) {

    product.sizes.forEach(
      size => {

        if (
          !Number.isFinite(
            Number(
              size.ml
            )
          )
        ) {

          errors.push(
            "مقاس غير صحيح"
          );

        }


        if (
          size.price !==
          null &&
          !Number.isFinite(
            Number(
              size.price
            )
          )
        ) {

          errors.push(
            "سعر غير صحيح"
          );

        }

      }
    );

  }


  return {

    valid:
      errors.length === 0,

    errors

  };

}


/* =========================================================
   فحص الكتالوج بالكامل
   ========================================================= */

function validateCatalog() {

  const errors =
    [];

  const duplicateMap =
    new Map();


  STATE.products.forEach(
    (
      product,
      index
    ) => {

      const result =
        validateProduct(
          product
        );


      if (
        !result.valid
      ) {

        errors.push({

          index,

          id:
            product.id,

          name:
            product.name,

          errors:
            result.errors

        });

      }


      const key =
        productDuplicateKey(
          product
        );


      if (key) {

        if (
          duplicateMap.has(
            key
          )
        ) {

          errors.push({

            index,

            id:
              product.id,

            name:
              product.name,

            errors: [
              "منتج مكرر"
            ]

          });

        } else {

          duplicateMap.set(
            key,
            index
          );

        }

      }

    }
  );


  return {

    valid:
      errors.length === 0,

    total:
      STATE.products.length,

    errors

  };

}


/* =========================================================
   تقرير التحقق للإدارة
   ========================================================= */

function showCatalogValidation() {

  if (!ADMIN_AUTH) {
    return;
  }


  const report =
    validateCatalog();


  if (
    report.valid
  ) {

    showToast(
      `الكتالوج سليم: ${report.total} منتج`
    );

    return;

  }


  console.warn(
    "Catalog validation:",
    report
  );


  showToast(
    `يوجد ${report.errors.length} ملاحظة في الكتالوج`
  );

}


/* =========================================================
   منع المنتجات المكررة أثناء الإدخال
   ========================================================= */

function cleanDuplicateProducts() {

  if (!ADMIN_AUTH) {
    return;
  }


  autoBackup(
    "before-duplicate-cleanup"
  );


  const seen =
    new Set();


  const before =
    clone(
      STATE.products
    );


  STATE.products =
    STATE.products.filter(
      product => {

        const key =
          productDuplicateKey(
            product
          );


        if (!key) {
          return true;
        }


        if (
          seen.has(
            key
          )
        ) {

          return false;

        }


        seen.add(
          key
        );


        return true;

      }
    );


  recordChange(
    "تنظيف التكرارات",
    before,
    clone(
      STATE.products
    )
  );


  saveState();

  renderAll();

  renderAdminProducts();


  showToast(
    "تم تنظيف المنتجات المكررة"
  );

}


/* =========================================================
   إنشاء معرف آمن
   ========================================================= */

function makeId(
  prefix = "item"
) {

  return (

    prefix +

    "_" +

    Date.now().toString(
      36
    ) +

    "_" +

    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        8
      )

  );

}


/* =========================================================
   إنشاء منتج جديد من البيانات
   ========================================================= */

function createProduct(
  data = {}
) {

  const product =
    normalizeProductRecord({

      ...data,

      id:
        data.id ||
        makeId(
          "perfume"
        )

    });


  return product;

}


/* =========================================================
   استيراد مصفوفة منتجات مباشرة
   ========================================================= */

function importProductsArray(
  products
) {

  if (!ADMIN_AUTH) {

    return {

      ok:
        false,

      error:
        "غير مصرح"

    };

  }


  if (
    !Array.isArray(
      products
    )
  ) {

    return {

      ok:
        false,

      error:
        "البيانات ليست مصفوفة"

    };

  }


  autoBackup(
    "before-direct-import"
  );


  const before =
    clone(
      STATE.products
    );


  const existing =
    new Set(
      STATE.products.map(
        productDuplicateKey
      )
    );


  let added =
    0;

  let skipped =
    0;


  products.forEach(
    (
      raw,
      index
    ) => {

      const product =
        createProduct(
          raw
        );


      const key =
        productDuplicateKey(
          product
        );


      if (
        !key ||
        existing.has(
          key
        )
      ) {

        skipped++;

        return;

      }


      STATE.products.push(
        product
      );


      existing.add(
        key
      );


      added++;

    }
  );


  recordChange(
    "استيراد منتجات مباشر",
    before,
    clone(
      STATE.products
    )
  );


  saveState();

  renderAll();

  renderAdminProducts();


  return {

    ok:
      true,

    added,

    skipped

  };

}


/* =========================================================
   إظهار تنبيه المخزون
   ========================================================= */

function showInventoryAlerts() {

  if (!ADMIN_AUTH) {
    return;
  }


  const low =
    lowStockProducts();


  if (!low.length) {

    showToast(
      "المخزون جيد ولا توجد تنبيهات"
    );

    return;

  }


  const names =
    low
      .slice(
        0,
        5
      )
      .map(
        product =>
          productName(
            product
          )
      )
      .join(
        "، "
      );


  showToast(
    `تنبيه مخزون: ${names}`
  );

}


/* =========================================================
   حساب تكلفة المنتج
   ========================================================= */

function calculateProductCost(
  product,
  ml
) {

  if (!product) {
    return 0;
  }


  const costTable =
    product.costs ||
    product.cost ||
    {};


  if (
    typeof costTable ===
    "object"
  ) {

    const value =
      costTable[
        String(
          ml
        )
      ];


    if (
      value !==
      undefined
    ) {

      return Number(
        value
      ) || 0;

    }

  }


  return Number(
    product.baseCost ||
    0
  );

}


/* =========================================================
   حساب الربح
   ========================================================= */

function calculateProfit(
  product,
  ml
) {

  const sale =
    getSizePrice(
      product,
      ml
    );


  const cost =
    calculateProductCost(
      product,
      ml
    );


  return (
    sale -
    cost
  );

}


/* =========================================================
   تقرير الأرباح
   ========================================================= */

function profitReport() {

  let revenue =
    0;

  let cost =
    0;


  STATE.cart.forEach(
    item => {

      const product =
        STATE.products.find(
          p =>
            p.id ===
            item.productId
        );


      if (!product) {
        return;
      }


      const qty =
        Number(
          item.qty
        ) || 0;


      revenue +=
        Number(
          item.price
        ) *
        qty;


      cost +=
        calculateProductCost(
          product,
          item.size
        ) *
        qty;

    }
  );


  return {

    revenue,

    cost,

    profit:
      revenue -
      cost

  };

}


/* =========================================================
   واجهة تقرير الإدارة
   ========================================================= */

function renderAdminDashboard() {

  if (!ADMIN_AUTH) {
    return;
  }


  const container =
    $(
      "[data-admin-content]"
    ) ||
    $(
      "#adminContent"
    );


  if (!container) {
    return;
  }


  const stats =
    storeStats();


  const inventory =
    inventoryReport();


  const profit =
    profitReport();


  container.innerHTML = `

    <div class="admin-dashboard">

      <div class="dashboard-cards">

        <div class="dashboard-card">

          <i class="fa-solid fa-bottle-droplet"></i>

          <strong>
            ${stats.total}
          </strong>

          <span>
            إجمالي المنتجات
          </span>

        </div>


        <div class="dashboard-card">

          <i class="fa-solid fa-circle-check"></i>

          <strong>
            ${stats.active}
          </strong>

          <span>
            منتجات نشطة
          </span>

        </div>


        <div class="dashboard-card">

          <i class="fa-solid fa-boxes-stacked"></i>

          <strong>
            ${inventory.units}
          </strong>

          <span>
            وحدات المخزون
          </span>

        </div>


        <div class="dashboard-card">

          <i class="fa-solid fa-triangle-exclamation"></i>

          <strong>
            ${inventory.lowStock}
          </strong>

          <span>
            منخفض المخزون
          </span>

        </div>


        <div class="dashboard-card">

          <i class="fa-solid fa-clock-rotate-left"></i>

          <strong>
            ${stats.review}
          </strong>

          <span>
            يحتاج مراجعة
          </span>

        </div>


        <div class="dashboard-card">

          <i class="fa-solid fa-coins"></i>

          <strong>
            ${money(
              profit.profit
            )}
          </strong>

          <span>
            الربح المحسوب
          </span>

        </div>

      </div>


      <div class="admin-dashboard-actions">

        <button
          type="button"
          onclick="renderAdminProducts()"
        >
          المنتجات
        </button>


        <button
          type="button"
          onclick="renderAdminOrders()"
        >
          الطلبات
        </button>


        <button
          type="button"
          onclick="renderAdminSettings()"
        >
          الإعدادات
        </button>


        <button
          type="button"
          onclick="showInventoryAlerts()"
        >
          تنبيهات المخزون
        </button>


        <button
          type="button"
          onclick="showCatalogValidation()"
        >
          فحص الكتالوج
        </button>


        <button
          type="button"
          onclick="cleanDuplicateProducts()"
        >
          تنظيف التكرار
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   تغيير رمز الإدارة
   ========================================================= */

async function changeAdminPassword(
  oldPassword,
  newPassword
) {

  if (!ADMIN_AUTH) {

    return {

      ok:
        false,

      error:
        "غير مصرح"

    };

  }


  if (
    !newPassword ||
    newPassword.length <
      6
  ) {

    return {

      ok:
        false,

      error:
        "الرمز الجديد يجب أن يكون 6 أحرف أو أرقام على الأقل"

    };

  }


  const valid =
    await verifyAdminPassword(
      oldPassword
    );


  if (!valid) {

    return {

      ok:
        false,

      error:
        "رمز الإدارة الحالي غير صحيح"

    };

  }


  const salt =
    crypto?.randomUUID
      ? crypto.randomUUID()
      : String(
          Math.random()
        );


  const hash =
    await sha256(
      salt +
      "::" +
      newPassword
    );


  localStorage.setItem(
    ADMIN_SALT_KEY,
    salt
  );


  localStorage.setItem(
    ADMIN_HASH_KEY,
    hash
  );


  recordChange(
    "تغيير رمز الإدارة",
    null,
    {
      changed:
        true
    }
  );


  return {

    ok:
      true

  };

}


/* =========================================================
   حماية زر الإدارة عبر ?admin
   ========================================================= */

function checkAdminQuery() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  if (
    params.has(
      "admin"
    )
  ) {

    setTimeout(
      () => {

        openAdmin();

      },
      500
    );

  }

}


/* =========================================================
   تشغيل حماية الإدارة
   ========================================================= */

checkAdminQuery();


/* =========================================================
   مزامنة التخزين بين التبويبات
   ========================================================= */

window.addEventListener(
  "storage",
  function (
    event
  ) {

    if (
      event.key !==
      STORE.key
    ) {

      return;

    }


    try {

      const data =
        JSON.parse(
          event.newValue ||
          "{}"
        );


      if (
        Array.isArray(
          data.products
        )
      ) {

        STATE.products =
          data.products.map(
            normalizeProductRecord
          );

      }


      if (
        Array.isArray(
          data.cart
        )
      ) {

        STATE.cart =
          data.cart;

      }


      if (
        Array.isArray(
          data.wish
        )
      ) {

        STATE.wish =
          data.wish;

      }


      renderAll();

      updateCartUI();

      updateWishUI();

      updateStoreStats();


    } catch (
      error
    ) {

      console.warn(
        "خطأ مزامنة البيانات",
        error
      );

    }

  }
);


/* =========================================================
   إعادة الرسم عند الرجوع للتطبيق
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  function () {

    if (
      document.visibilityState ===
      "visible"
    ) {

      renderProducts();

      updateCartUI();

      updateWishUI();

      updateStoreStats();

    }

  }
);


/* =========================================================
   معالجة الروابط الداخلية
   ========================================================= */

function setupSmoothNavigation() {

  document.addEventListener(
    "click",
    function (
      event
    ) {

      const link =
        event.target.closest(
          'a[href^="#"]'
        );


      if (!link) {
        return;
      }


      const id =
        link.getAttribute(
          "href"
        );


      if (
        !id ||
        id === "#"
      ) {
        return;
      }


      const target =
        document.querySelector(
          id
        );


      if (!target) {
        return;
      }


      event.preventDefault();


      target.scrollIntoView({

        behavior:
          "smooth",

        block:
          "start"

      });

    }
  );

}


setupSmoothNavigation();


/* =========================================================
   قائمة الهاتف
   ========================================================= */

function setupMobileMenu() {

  const toggle =
    $(
      "#navToggle"
    ) ||
    $(
      "[data-nav-toggle]"
    );


  const menu =
    $(
      "#navLinks"
    ) ||
    $(
      "[data-nav-links]"
    );


  if (
    !toggle ||
    !menu
  ) {

    return;

  }


  toggle.addEventListener(
    "click",
    function () {

      menu.classList.toggle(
        "open"
      );


      toggle.classList.toggle(
        "active"
      );

    }
  );


  menu.addEventListener(
    "click",
    function (
      event
    ) {

      const link =
        event.target.closest(
          "a"
        );


      if (link) {

        menu.classList.remove(
          "open"
        );

        toggle.classList.remove(
          "active"
        );

      }

    }
  );

}


setupMobileMenu();


/* =========================================================
   زر البحث
   ========================================================= */

function setupSearchButtons() {

  $$(
    "[data-search-button]"
  )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          function () {

            const input =
              $(
                "[data-search]"
              );


            if (input) {

              input.focus();

              input.select();

            }

          }
        );

      }
    );

}


setupSearchButtons();


/* =========================================================
   تفعيل زر الصوت
   ========================================================= */

document.addEventListener(
  "click",
  function (
    event
  ) {

    const button =
      event.target.closest(
        "[data-voice-toggle]"
      );


    if (!button) {
      return;
    }


    setVoiceEnabled(
      !VOICE_ENABLED
    );


    if (
      VOICE_ENABLED
    ) {

      speakText(
        "تم تشغيل الراوي الصوتي في مملكة العطور"
      );

    }

  }
);


/* =========================================================
   زر البحث الصوتي
   ========================================================= */

document.addEventListener(
  "click",
  function (
    event
  ) {

    const button =
      event.target.closest(
        "[data-voice-search]"
      );


    if (!button) {
      return;
    }


    voiceSearchAssistant();

  }
);


/* =========================================================
   تحديث الراوي
   ========================================================= */

updateVoiceButtons();


/* =========================================================
   تحديث الإحصائيات النهائي
   ========================================================= */

setTimeout(
  () => {

    updateStoreStats();

    refreshCartCounters();

  },
  800
);


/* =========================================================
   أدوات عامة متاحة من Console
   ========================================================= */

window.Mamlaka = {

  STATE,

  STORE,

  settings:
    () =>
      SET,

  products:
    () =>
      STATE.products,

  cart:
    () =>
      STATE.cart,

  stats:
    storeStats,

  inventory:
    inventoryReport,

  validate:
    validateCatalog,

  backup:
    createManualBackup,

  export:
    exportJSON,

  importProducts:
    importProductsArray,

  search:
    smartSearch,

  speak:
    speakText,

  voice:
    setVoiceEnabled

};


/* =========================================================
   توافق مع الأسماء القديمة
   ========================================================= */

window.money =
  money;

window.openCart =
  openCartAnimated;

window.changeCartQty =
  changeCartQty;

window.removeFromCart =
  removeFromCart;

window.setPackaging =
  setPackaging;

window.editProduct =
  editProduct;

window.deleteProduct =
  deleteProduct;

window.renderAdminProducts =
  renderAdminProducts;

window.renderAdminOrders =
  renderAdminOrders;

window.renderAdminSettings =
  renderAdminSettings;

window.saveAdminSettings =
  saveAdminSettings;


/* =========================================================
   نهاية الجزء الثاني
   ========================================================= */