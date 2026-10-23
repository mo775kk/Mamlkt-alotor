#!/usr/bin/env node
/**
 * Lightweight, dependency-free smoke checks for MAMLKAT AL-OTOR.
 * Run from the repository root: node scripts/smoke-check.mjs
 * Static integrity checks only; this does not replace browser interaction tests.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { inflateSync } from "node:zlib";

const root = process.cwd();
const failures = [];
const pass = [];
const report = (ok, message) => (ok ? pass : failures).push(message);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

try {
  const html = read("index.html");
  report(!/\\n\s*<(?:link|script)\b/.test(html), "index.html has no literal backslash-n before link/script tags");
  const untypedButtons = [...html.matchAll(/<button\b(?![^>]*\btype\s*=)[^>]*>/gi)];
  report(untypedButtons.length === 0, untypedButtons.length ? "Buttons missing explicit type: " + untypedButtons.length : "All static buttons declare an explicit type");
  const refs = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>/g)]
    .map((m) => m[1])
    .filter((url) => !/^(?:https?:|data:|#|\/\/)/i.test(url))
    .map((url) => url.split("?")[0].split("#")[0])
    .filter(Boolean);
  const missing = [...new Set(refs)].filter((ref) => !fs.existsSync(path.join(root, ref)));
  report(missing.length === 0, missing.length ? "Missing local linked files: " + missing.join(", ") : "All local CSS/JS references in index.html exist");
} catch (e) {
  report(false, "Unable to validate index.html: " + e.message);
}


try {
  const html = read("index.html");
  const manifest = JSON.parse(read("manifest.webmanifest"));
  const worker = read("sw.js");
  report(html.includes('id="installAppBtn"') && html.includes("beforeinstallprompt"),
    "Storefront exposes an install-app action");
  report(html.includes("navigator.serviceWorker.register(") && /sw\.js\?v=[^\x27"]+/.test(html) && worker.includes('addEventListener("fetch"'),
    "PWA service worker is registered and handles requests");
  report(manifest.display === "standalone" && manifest.name && manifest.start_url && manifest.icons?.length && manifest.theme_color === "#F0F2F4",
    "PWA manifest contains app identity, launch URL, display mode and icon");
  const themeBootstrap = read("theme-persistence.js");
  const settingsSource = read("settings.js");
  report(themeBootstrap.includes('root.setAttribute("data-theme",mode)') &&
    !themeBootstrap.includes('root.setAttribute("data-theme","light")') &&
    !themeBootstrap.includes('localStorage.setItem(MODE_KEY,JSON.stringify(theme))') &&
    !read("settings.js").includes('localStorage.setItem("mamlaka_theme",JSON.stringify(theme))'),
    "Theme mode remains a light/dark string and saved dark mode is restored without being overwritten by palette settings");

  report(/theme-persistence\.js\?v=[^\x27"]+/.test(html) &&
    themeBootstrap.includes('mamlaka_theme_v1') &&
    themeBootstrap.includes('mamlaka_visual_tuning_v1') &&
    themeBootstrap.includes('addEventListener("storage"'),
    "Saved palette, theme mode and display settings are restored across visits");
  report(settingsSource.includes('themePresets.design03,...JSON.parse(localStorage.getItem("mamlaka_theme_v1")||"{}")') &&
    settingsSource.includes('const visualValues={brightness:"cfgBrightness"') &&
    settingsSource.includes('wa.value.replace(/\\D/g,"")'),
    "Emergency settings save uses the current neutral palette, validates the WhatsApp number and preserves display controls");
  report(settingsSource.includes('"mamlaka_visual_tuning_v1"') &&
    settingsSource.includes('"mamlaka_theme",') && settingsSource.includes("legacyGreen") && settingsSource.includes("cfgMobileDesign") && settingsSource.includes("cfgWebDesign") &&
    settingsSource.includes('localStorage.getItem("mamlaka_visual_tuning_v1")!==raw'),
    "Color and display settings are verified on save and included in local backups");
  const iconFiles = (manifest.icons || []).map((icon) => icon.src).filter(Boolean);
  report(iconFiles.length >= 2 && iconFiles.every((src) => fs.existsSync(path.join(root, src))),
    "PWA manifest icon paths resolve to local files");
  const rasterSizes = new Set((manifest.icons || []).filter((icon) => icon.type === "image/png").map((icon) => icon.sizes));
  report(rasterSizes.has("192x192") && rasterSizes.has("512x512"),
    "PWA manifest includes 192px and 512px PNG install-icon fallbacks");
  const pngCrcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; pngCrcTable[n] = c >>> 0; }
  const pngCrc32 = (bytes) => { let c = 0xffffffff; for (const byte of bytes) c = pngCrcTable[(c ^ byte) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const validPng = (file, expectedSize) => {
    try {
      const png = fs.readFileSync(path.join(root, file));
      if (png.length < 45 || !png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return false;
      let offset = 8, width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0, ended = false;
      const imageData = [];
      while (offset + 12 <= png.length) {
        const length = png.readUInt32BE(offset);
        if (offset + 12 + length > png.length) return false;
        const type = png.toString("ascii", offset + 4, offset + 8);
        const payload = png.subarray(offset + 8, offset + 8 + length);
        const expectedCrc = png.readUInt32BE(offset + 8 + length);
        if (pngCrc32(png.subarray(offset + 4, offset + 8 + length)) !== expectedCrc) return false;
        if (type === "IHDR") { width = payload.readUInt32BE(0); height = payload.readUInt32BE(4); bitDepth = payload[8]; colorType = payload[9]; interlace = payload[12]; }
        if (type === "IDAT") imageData.push(payload);
        offset += 12 + length;
        if (type === "IEND") { ended = true; break; }
      }
      if (!ended || offset !== png.length || width !== expectedSize || height !== expectedSize || interlace !== 0 || !imageData.length) return false;
      const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType];
      if (!channels) return false;
      const decoded = inflateSync(Buffer.concat(imageData));
      return decoded.length === (Math.ceil(width * bitDepth * channels / 8) + 1) * height;
    } catch { return false; }
  };
  report(validPng("assets/images/app-icon-192.png", 192),
    "192px PNG install icon has valid chunks, checksums and image data");
  report(validPng("assets/images/app-icon-512.png", 512),
    "512px PNG install icon has valid chunks, checksums and image data");
  report(/const CACHE_NAME = "mamlakat-al-otor-shell-v\d+[^"]*"/.test(worker) &&
    worker.includes('BASE_PATH + "assets/images/app-icon-192.png"') &&
    worker.includes('BASE_PATH + "assets/images/app-icon-512.png"'),
    "PWA service worker pre-caches both raster install icons in the current shell");
  report(String(manifest.scope || "").startsWith("./") && String(manifest.start_url || "").startsWith("./"),
    "PWA start URL and scope are relative to the GitHub Pages project path");
  const head = html.split(/<\/head>/i, 1)[0];
  report(head.includes("window.addEventListener('beforeinstallprompt'") &&
    head.includes("window.addEventListener('appinstalled'") &&
    head.includes("showHelp()") && head.includes("navigator.serviceWorker.register"),
    "PWA install lifecycle listeners are registered in the document head before UI scripts");
  report(html.includes("event.preventDefault()") && html.includes("promptEventNow.prompt()") &&
    html.includes("promptEventNow.userChoice") && html.includes("button.addEventListener('click', async"),
    "Install button captures and invokes the browser-native install prompt and handles completion");
  report(html.includes("button.hidden = standalone()") && html.includes("pwaInstallHelp") &&
    html.includes("showHelp()") && html.includes("homeInstallShortcut"),
    "Install action stays available and offers browser-specific guidance when native install prompt is withheld");
  report(html.includes("id=\"pwaHelpSteps\"") && html.includes("إضافة إلى الشاشة الرئيسية"),
    "Install fallback explains Android/iOS steps in an accessible dialog");
  const browserThemeColor = html.match(/<meta\s+name="theme-color"\s+content="([^"]+)"/i)?.[1];
  report(Boolean(browserThemeColor) && browserThemeColor.toLowerCase() === String(manifest.theme_color || "").toLowerCase() &&
    /^#[0-9a-f]{6}$/i.test(browserThemeColor),
    "Browser and installed-app theme colors match the active unified palette");
  report(/site-unified\.css\?v=[^"]+/.test(html) && read("site-unified.css").includes("MAMLKAT AL-OTOR — unified design system v4") && (read("site-unified.css").match(/Original source:/g)||[]).length===1,
  "Single unified design stylesheet is linked with a cache-buster");
report(/sw\.js\?v=[^\x27"]+/.test(html) && /const CACHE_NAME = "mamlakat-al-otor-shell-v\d+[^"]*"/.test(read("sw.js")),
  "Service worker URL and cache shell version are synchronized");

} catch (e) {
  report(false, "Unable to validate PWA install files: " + e.message);
}

try {
  const html = read("index.html");
  const app = read("app.js");
  const cartCss = read("site-unified.css");
  report(cartCss.includes("#cartDrawer .cart-item-facts dd{margin:0;color:var(--heading)") && cartCss.includes("#cartDrawer .cart-line-actions .remove-btn") && cartCss.includes("@media(max-width:380px)"),
    "Cart item names, size/price/quantity totals and action controls have readable responsive styles");
  report(!html.includes('id="cartHeaderShortcut"') && !app.includes('bind("#cartHeaderShortcut", "click",openDrawer)') && app.includes('bind("#cartShortcut", "click",openDrawer)'),
    "The cart drawer is opened only from the homepage directory shortcut; no duplicate header cart action remains");
  report(app.includes('const bind = (selector, eventName, handler, options) => { const el = $(selector); if (el) el.addEventListener(eventName, handler, options); }'),
    "app.js shared event binder checks that an element exists before attaching listeners");
  report(app.includes('const mainNav=$("#mainNav"), menuToggle=$("#menuToggle")') &&
    app.includes('if(mainNav){mainNav.querySelectorAll("a").forEach'),
    "Mobile navigation links are bound only when the navigation element exists");
  report(app.includes('bind("#menuToggle","click",()=>{if(!mainNav||!menuToggle)return;') &&
    app.includes('mainNav.classList.toggle("open")'),
    "Mobile menu toggle checks both the menu and navigation elements before use");
  report(app.includes('const contactWhatsapp=$("#contactWhatsapp");if(contactWhatsapp)contactWhatsapp.href=') &&
    app.includes('const languageToggle=$("#languageToggle");if(languageToggle)languageToggle.textContent='),
    "WhatsApp and language controls tolerate optional/missing elements");
  report(app.includes('const voiceButton=$("#voiceSearch");if(!voiceButton)return;') &&
    app.includes('if(search){search.value=e.results[0][0].transcript;renderProducts();}'),
    "Voice search checks its button and search field before updating them");
  report(app.includes('familyFilter=$("#supplierOilFamily");if(!familyFilter)return;') &&
    app.includes('input=$("#advisorInput");if(!input)return;'),
    "Scent-family and advisor shortcut handlers guard dependent form fields");
} catch (e) {
  report(false, "Unable to validate null-safe event bindings: " + e.message);
}

try {
  const cloud = read("supabase-cloud.js");
  const config = read("supabase-config.js");
  report(cloud.includes("mamlaka[_-]?(?:cart|wishlist|favorites?)(?:[_-].*)?") &&
    cloud.includes(".*session.*") && cloud.includes(".*password.*") &&
    cloud.includes(".*secret.*") && cloud.includes(".*credential.*") &&
    cloud.includes("mamlaka_favorites_v1") && cloud.includes("privateDataCleanup"),
    "Cloud sync excludes cart, wishlist/favorites, sessions and sensitive credential keys");
  report(/url:\s*"https:\/\/[a-z0-9-]+\.supabase\.co"/i.test(config) &&
    /anonKey:\s*"(?:sb_publishable_|eyJ)[^"]+"/.test(config) &&
    !/\b(?:anonKey|url)\s*:\s*"[^"]*(?:service_role|sb_secret_)/i.test(config),
    "Supabase browser config uses a public key and contains no service-role/secret key");
} catch (e) {
  report(false, "Unable to validate cloud persistence security: " + e.message);
}

try {
  const app = read("app.js");
  const html = read("index.html");
  report(app.includes("const referenceFragranceNotes =") &&
    app.includes("khamrahqahwa:") && app.includes("asadzanzibar:") && app.includes("asadbourbon:") &&
    app.includes("function applyReferenceFragranceNotes(product)") &&
    app.includes('product.notesStatus = "reference-fragrance-notes"') &&
    app.includes("لا تؤكد تركيبة زيت المورد"),
    "Official-brand reference notes cover five matched fragrances and preserve the supplier-oil disclaimer");
  report(app.includes("product.topNotes = reference.topNotes.slice()") &&
    app.includes("if (hasPyramid) return product") &&
    app.includes("publicCatalogProducts.forEach(applyReferenceFragranceNotes)") &&
    app.includes("oilProducts.forEach(applyReferenceFragranceNotes)"),
    "Reference notes fill only missing note pyramids and do not overwrite existing researched notes");
  report(/app\.js\?v=20261023-reference-notes-v1/.test(html),
    "Storefront loads the new reference-note logic with a refreshed cache version");
} catch (e) {
  report(false, "Unable to validate sourced reference fragrance notes: " + e.message);
}

try {
  const settings = read("settings.js");
  report(settings.includes('id="cfgBackgroundImage" type="hidden" value="none"') &&
    settings.includes('verified.backgroundImage!=="none"') &&
    settings.includes("تُزامَن الإعدادات والمنتجات القابلة للمزامنة") &&
    !settings.includes('id="cfgBackgroundUpload"'),
    "Settings keep page backgrounds disabled while preserving authenticated cloud synchronization");
} catch (e) {
  report(false, "Unable to validate cloud storage guidance: " + e.message);
}

const jsFiles = ["app.js", "ai-service.js", "settings.js", "enhancements.js", "supplier-catalog.js", "catalog-editor.js", "site-upgrades.js", "royal-gift-planner.js", "inventory-accounting.js", "royal-interactions.js", "royal-finish.js", "section-folds.js", "blending-atelier.js"];
for (const file of jsFiles) {
  try {
    new vm.Script(read(file), { filename: file });
    report(true, file + " parses successfully");
  } catch (e) {
    report(false, file + " syntax error: " + e.message);
  }
}

try {
  const upgrades = read("site-upgrades.js");
  report(upgrades.includes("const missingPrice = products.filter") &&
    upgrades.includes("const missingImage = products.filter") &&
    upgrades.includes("const notAvailable = products.filter"),
    "Catalog audit reports missing prices, missing images and unapproved products");
  report(upgrades.includes("schemaVersion: 3") && upgrades.includes("missingPrice, missingImage, notAvailable"),
    "Catalog audit exports the expanded diagnostic fields");
  report(upgrades.includes("noteCoverage") && upgrades.includes("completeOils") &&
    upgrades.includes("completeReady") && upgrades.includes("royalDownloadCatalogAudit") &&
    upgrades.includes("mamlakat-catalog-audit.json"),
    "Catalog audit separates oil/ready-fragrance note coverage and exports a JSON report");
  const auditPayload = JSON.parse(read("data/products.json"));
  const auditProducts = Array.isArray(auditPayload) ? auditPayload : auditPayload?.products;
  if (!Array.isArray(auditProducts)) throw new Error("data/products.json has no products array");
  const houses = auditProducts.filter(p => p.productType === "oil" && p.referenceHouseSource === "supplier-name-suffix" && p.referenceHouse);
  report(houses.length >= 350 && auditProducts.filter(p => p.productType === "oil").every(p => p.nameAr && p.nameEn),
    "Supplier fragrance names retain their display names while extracted fashion houses are stored separately (" + houses.length + ")");
  const appCode = read("app.js");
  report(appCode.includes("p.referenceHouse") && appCode.includes("p.referenceSearchAliases") && appCode.includes("دار العطر المرجعي"),
    "Fragrance house and alias metadata participates in search and product details");
  report(auditProducts.filter(p => p.notesStatus && p.sourceUrl && p.verified === false && p.needsReview === true).length >= 75,
    "Sourced fragrance reference notes remain marked unverified until the oil-to-reference match is reviewed");
  report(read("index.html").includes("site-upgrades.js?v=20261016-note-coverage3"),
    "Catalog note-coverage audit is linked with a fresh cache-buster");
} catch (e) {
  report(false, "Unable to validate catalog audit diagnostics: " + e.message);
}

try {
  const data = JSON.parse(read("data/products.json"));
  const products = Array.isArray(data) ? data : data.products;
  report(Array.isArray(products), "data/products.json contains a product array");
  if (Array.isArray(products)) {
    const ids = products.map((p) => String(p.id || "").trim());
    report(ids.every(Boolean), "Every catalog product has an id");
    report(new Set(ids).size === ids.length, "Catalog product ids are unique");
    const invalidVerified = products.filter((p) =>
      (p.verified === true || String(p.notesStatus || "").startsWith("verified")) &&
      (!p.sourceUrl || !Array.isArray(p.topNotes) || !p.topNotes.length ||
       !Array.isArray(p.heartNotes) || !p.heartNotes.length ||
       !Array.isArray(p.baseNotes) || !p.baseNotes.length)
    );
    report(invalidVerified.length === 0,
      invalidVerified.length ? "Verified notes missing source/pyramid: " + invalidVerified.map((p) => p.id).join(", ") :
      "Verified fragrance pyramids include source URLs and top/heart/base notes");
  }
} catch (e) {
  report(false, "data/products.json invalid: " + e.message);
}

try {
  const data = JSON.parse(read("data/products.json"));
  const products = Array.isArray(data) ? data : data.products;
  const oils = products.filter((p) => p.productType === "oil");
  const sourcedOilNotes = oils.filter((p) =>
    p.notesStatus === "reference-fragrance-notes" &&
    /^https:\/\//i.test(String(p.sourceUrl || "")) &&
    Array.isArray(p.topNotes) && p.topNotes.length &&
    Array.isArray(p.heartNotes) && p.heartNotes.length &&
    Array.isArray(p.baseNotes) && p.baseNotes.length &&
    p.verified === false && p.needsReview === true
  );
  report(sourcedOilNotes.length >= 20,
    "Oil catalog includes sourced reference note pyramids with review flags (" + sourcedOilNotes.length + ")");
  const app = read("app.js");
  report(app.includes("noteDisclaimer") && app.includes("لم نعثر على نوتات موثوقة") &&
    app.includes("لم تُوثق بعد"),
    "Product details explain note sources and clearly flag missing researched notes");
  const html = read("index.html");
  report(/app\.js\?v=[^"]+/.test(html),
    "Current storefront application script is linked with a cache-buster");
} catch (e) {
  report(false, "Unable to validate fragrance-note research coverage: " + e.message);
}

try {
  const data = JSON.parse(read("data/products.json"));
  const products = Array.isArray(data) ? data : data.products;
  const oils = products.filter((p) => p.productType === "oil");
  const ready = products.filter((p) => p.productType === "ready");
  const hasPyramid = (p) => [p.topNotes, p.heartNotes, p.baseNotes].some((notes) => Array.isArray(notes) && notes.length);
  const sourced = products.filter((p) =>
    p.notesStatus === "reference-fragrance-notes" && /^https:\/\//i.test(String(p.sourceUrl || "")) &&
    Array.isArray(p.topNotes) && p.topNotes.length &&
    Array.isArray(p.heartNotes) && p.heartNotes.length &&
    Array.isArray(p.baseNotes) && p.baseNotes.length &&
    p.verified === false && p.needsReview === true
  );
  report(oils.length === 589 && ready.length === 17,
    "Oil and ready-fragrance catalog counts remain intact");
  report(sourced.length >= 50,
    "Catalog includes at least 50 sourced reference fragrance pyramids with review flags (" + sourced.length + ")");
  report(oils.filter(hasPyramid).length >= 50 && ready.filter(hasPyramid).length >= 15,
    "Oil and ready-fragrance note coverage remains populated");
  const app = read("app.js");
  report(app.includes("noteDisclaimer") && app.includes("لم نعثر على نوتات موثوقة") &&
    app.includes("لم تُوثق بعد"),
    "Product details explain note sources and clearly flag missing researched notes");
  const html = read("index.html");
  report(/app\.js\?v=[^"]+/.test(html) && /site-unified\.css\?v=[^"]+/.test(html),
    "Storefront app and visual layer use explicit cache-busters");
  report(/const CACHE_NAME = "mamlakat-al-otor-shell-v\d+[^"]*"/.test(read("sw.js")),
    "PWA cache version is refreshed to deliver the updated catalog");
} catch (e) {
  report(false, "Unable to validate fragrance-note research coverage: " + e.message);
}

try {
  const bridge = read("ai-service.js");
  const worker = read("ai-worker/src/index.js");
  const workerConfig = read("ai-worker/wrangler.toml");
  report(bridge.includes("window.MamlakaAI") && bridge.includes("/api/ask"),
    "AI frontend bridge exposes the advisor endpoint");
  report(!/sk-[A-Za-z0-9]{20,}/.test(bridge) && !/OPENAI_API_KEY\\s*[:=]/.test(bridge),
    "AI frontend contains no embedded provider API key");
  report(worker.includes("env.OPENAI_API_KEY") && worker.includes("store:false") &&
    worker.includes("Access-Control-Allow-Origin") && worker.includes("recommendedProductIds"),
    "AI Worker uses a server-side secret, non-stored requests and product-ID filtering");
  report(workerConfig.includes("name = \"mamlakat-al-otor-ai\"") &&
    workerConfig.includes("OPENAI_MODEL") && workerConfig.includes("ALLOWED_ORIGINS"),
    "AI Worker deployment configuration declares model and allowed origins");
} catch (e) {
  report(false, "Unable to validate AI advisor integration: " + e.message);
}

try {
  const settings = read("settings.js");
  report(!/\$\(["\'][^"\']+["\']\)\.addEventListener\(/.test(settings),
    "Admin settings guards selector-based event bindings against missing optional elements");
  const html = read("index.html");
  const finish = read("site-unified.css");
  const themeStudio = read("site-unified.css");
  report(settings.includes('dp={"3":50,"5":75,"10":100,"22":130,"30":100,"50":150,"100":300}') &&
    settings.includes("mamlaka_catalog_taxonomy_config_v1") && html.includes('id="blendSize"'),
    "Oil-only/spray retail price defaults are consistent between owner controls and customer guide");
  const catalogEditor = read("catalog-editor.js");
  const blendingAtelier = read("blending-atelier.js");
  const priceConfig = JSON.parse(read("data/catalog-configuration.json"));
  const pricesBySize = Object.fromEntries((priceConfig.retailBlendPrices || []).map(item => [String(item.size).match(/[0-9]+/)?.[0], Number(item.price)]));
  report(pricesBySize["3"] === 50 && pricesBySize["5"] === 75 && pricesBySize["10"] === 100 &&
    pricesBySize["22"] === 130 && pricesBySize["30"] === 100 && pricesBySize["50"] === 150 && pricesBySize["100"] === 300,
    "Shared catalog configuration uses the current approved blend-size prices");
  report(catalogEditor.includes("{size:'30 مل',price:100},{size:'50 مل',price:150},{size:'100 مل',price:300}") &&
    blendingAtelier.includes("var defaults={'3':50,'5':75,'10':100,'22':130,'30':100,'50':150,'100':300}"),
    "Admin catalog editor and blending atelier fallback prices match the shared configuration");


  report(settings.includes("data-copy-secret=\"CLOUDFLARE_API_TOKEN\"") &&
    settings.includes("data-copy-secret=\"CLOUDFLARE_ACCOUNT_ID\"") &&
    settings.includes("data-copy-secret=\"OPENAI_API_KEY\""),
    "AI deployment settings expose copy controls for all three required secret names");
  report(settings.includes("settings/secrets/actions") &&
    settings.includes("actions/workflows/deploy-ai-worker.yml") &&
    settings.includes("navigator.clipboard"),
    "AI deployment guide links to GitHub secrets and workflow and wires copy interaction");
  report(settings.includes("setTimeout(()=>controller.abort(),10000)") &&
    settings.includes("data.configured!==true") && settings.includes("AbortError") &&
    settings.includes("لا يختبر إجابة نموذج AI نفسها"),
    "AI connection diagnostics handle timeouts, missing server secrets and health-check limitations");
  report(/settings\.js\?v=[^"]+/.test(html) &&
    /site-unified\.css\?v=[^"]+/.test(html) &&
    finish.includes(".home-index-install-card") && themeStudio.includes("MAMLKAT AL-OTOR — unified design system v4") && !themeStudio.includes("--finish-rose"),
    "Current settings, theme-studio and finishing styles are linked and present");
} catch (e) {
  report(false, "Unable to validate AI deployment settings: " + e.message);
}


try {
  const html = read("index.html");
  const pages = read("section-pages.js");
  const folds = read("section-folds.js");
  report(pages.includes('el.hidden = isHome ? originalHidden.get(el) : el !== host;'),
    "Returning home restores the complete homepage instead of hiding all sections");
  report(folds.includes("section.id==='homeIndex'"),
    "The main directory is excluded from collapsible section details");
  const header = html.slice(html.indexOf('<div class="header-actions">'),html.indexOf('</div>',html.indexOf('<div class="header-actions">')));
  report((html.match(/id="cartShortcut"/g) || []).length === 1 &&
    (html.match(/id="cartCount"/g) || []).length === 1 && !header.includes("cartShortcut") && !header.includes("cartHeaderShortcut") && !html.includes('id="headerCartCount"'),
    "Cart has one entry and one counter, located on the homepage directory rather than the header");
} catch (e) {
  report(false, "Unable to validate homepage navigation and cart placement: " + e.message);
}

try {
  const html = read("index.html");
  const css = read("site-unified.css");
  report(css.includes(".compact-selected-price{display:inline!important") &&
    css.includes("grid-template-columns:minmax(0,1fr) auto"),
    "Selected size and price remain visible together on very narrow phones");
  report(/site-unified\.css\?v=[^"]+/.test(html),
    "Royal bright release stylesheet is linked through a fresh cache-buster");
} catch (e) {
  report(false, "Unable to validate narrow-phone size/price visibility: " + e.message);
}

try {
  const html = read("index.html");
  const css = read("site-unified.css");
  const pages = read("section-pages.js");
  const settings = read("settings.js");
  report(html.includes('data-theme="light"') && css.includes("MAMLKAT AL-OTOR — unified design system v4") &&
    css.includes("--bg:#F0F2F4") && css.includes("--gold:#586B7A") && css.includes("--heading:#263541") && (css.match(/Original source:/g)||[]).length===1 && css.includes("background-image:none!important") && settings.includes('value="mobile-02" selected') && settings.includes('value="web-02" selected'),
    "Unified storefront palette uses neutral colors and removes accumulated legacy stylesheet layers");
  report(/section-pages\.js\?v=[^"]+/.test(html) &&
    pages.includes('end.id = "sectionPageEnd"') && html.includes('id="cartDrawer"') &&
    html.includes('id="modalBackdrop"'),
    "Standalone section navigation, full-page cart and product details remain wired");
} catch (e) {
  report(false, "Unable to validate royal release theme and navigation: " + e.message);
}

try {
  const settings = read("settings.js");
  const html = read("index.html");
  report(settings.includes('let runtimeThemeStyle=document.getElementById("mamlaka-runtime-theme")') &&
    settings.includes('runtimeThemeStyle.textContent=') &&
    settings.includes('.site-header{background:color-mix') &&
    settings.includes('.site-footer{background:var(--footer-bg)') &&
    settings.includes('.search-box,.toolbar select,.blend-step select') &&
    settings.includes('write(THEME_KEY,x)'),
    "Theme palette applies across storefront, header/footer, cards, inputs and persists the full color object");
  report(/settings\.js\?v=[^"]+/.test(html),
    "Full-site theme fix is loaded with a fresh settings.js cache-buster");
} catch (e) {
  report(false, "Unable to validate full-site theme application: " + e.message);
}



try {
  const html = read("index.html");
  const app = read("app.js");
  const css = read("site-unified.css");
  const pages = read("section-pages.js");
  const oilShowcase = html.indexOf("<!-- اكتشف العطور والزيوت -->");
  const categoryDoors = html.indexOf("<!-- أبواب المملكة -->");
  report(oilShowcase >= 0 && categoryDoors >= 0 && oilShowcase < categoryDoors,
    "Oil catalogue showcase appears near the beginning of the homepage before category doors");
  report(app.includes("function supplierRetailRate(p)") &&
    app.includes('String(p?.supplierCategory||"").toUpperCase()==="ORIENTAL"') &&
    app.includes('displayFamily(p.family||p.scentFamily||"",p.nameAr||p.nameEn||"")') &&
    app.includes("supplierRetailRate(p)"),
    "Supplier oil cards classify fragrance family and use retail gram tiers");
  report(app.includes('localStorage.getItem("mamlaka_catalog_taxonomy_config_v1")') &&
    app.includes("pricing.orientalPremium") && app.includes("pricing.oriental"),
    "Oil gram pricing follows saved admin values for French, oriental and premium oriental tiers");
  report(app.includes('p.supplierSku||p.sku||"غير محدد"') &&
    app.includes('اختيار الزيت للتركيب') &&
    app.includes('oilSelect.value=id;closeModal();location.hash="#blend"'),
    "Supplier oil details show supplier identifiers and the modal CTA opens the blending selector");
  report(css.includes(".product-card-supplier-oil .product-visual{height:180px") &&
    css.includes(".home-oil-showcase .home-showcase-visual{height:148px"),
    "Oil product cards use larger, readable product visuals on desktop and mobile");
  report(app.includes('<span class="product-image-note">رسم توضيحي</span>') &&
    app.includes('قائمة المورد لا تتضمن صورة العبوة التجارية'),
    "Oil image labels identify representative visuals rather than original supplier packaging");
  report(pages.includes("const scrollPositions = new Map()") &&
    pages.includes("scrollPositions.set(activeId, window.scrollY || 0)") &&
    pages.includes('window.scrollTo({top:y,behavior:"auto"})'),
    "Section back navigation restores the previous section's scroll position");
  report(/app\.js\?v=[^"]+/.test(html) &&
    /site-unified\.css\?v=[^"]+/.test(html) &&
    /section-pages\.js\?v=[^"]+/.test(html),
    "Oil cards, layout and section-history fixes use fresh cache-busters");
  const oilData = JSON.parse(read("oil-catalog-public.json"));
  report(Array.isArray(oilData.products) && oilData.products.length === 589 &&
    oilData.products.every(p => p.supplierSku && p.nameAr && p.supplierCategory),
    "Public supplier oil catalogue contains all 589 sourced products with names, codes and categories");
  const researchedSkus = ["N1020267","N1020259","O1030177","O1030172","O1030173","O1030180","R1010198","R1010073","R1010202","R1010206","R1010011"];
  const researched = oilData.products.filter(p => researchedSkus.includes(p.sku));
  report(researched.length === researchedSkus.length &&
    researched.every(p => p.image && /^https:\\/\\//i.test(p.image) &&
      /^https:\\/\\//i.test(p.sourceUrl || "") &&
      Array.isArray(p.topNotes) && p.topNotes.length &&
      Array.isArray(p.heartNotes) && p.heartNotes.length &&
      Array.isArray(p.baseNotes) && p.baseNotes.length &&
      ["verified-brand-source","needs-variant-confirmation"].includes(p.notesStatus) &&
      (p.notesStatus !== "needs-variant-confirmation" || p.variantNote) &&
      p.notesDisclaimer && p.imageDisclaimer &&
      p.available === false && p.needsReview === true),
    "Eleven exact supplier catalog matches have sourced bottle references and documented fragrance-note status without changing stock/availability");
} catch (e) {
  report(false, "Unable to validate oil catalogue and section navigation: " + e.message);
}

try {
  const settings = read("settings.js");
  const html = read("index.html");
  const worker = read("sw.js");
  report(settings.includes('wa.value.replace(/\\D/g,"")'),
    "Emergency settings save strips non-digits from WhatsApp numbers");
  const registrationIsCurrent = html.includes("register('./sw.js?v=20261023-pwa-assets-v16')");
  report(registrationIsCurrent && worker.includes("pwa-assets"),
    "HTML service-worker registration and worker shell cache use the same release version");
} catch (e) {
  report(false, "Unable to validate emergency settings and PWA cache regression: " + e.message);
}

for (const message of pass) console.log("PASS  " + message);
for (const message of failures) console.error("FAIL  " + message);
console.log("\n" + pass.length + " passed; " + failures.length + " failed.");
if (failures.length) process.exitCode = 1;
