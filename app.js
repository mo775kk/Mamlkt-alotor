/**
 * مملكة العطور - CROWN · MAISON DE PARFUM
 * التطبيق الرئيسي
 */

// ==========================================
// 1. الثوابت والبيانات الافتراضية
// ==========================================
const WHATSAPP_NUMBER = "201272776928";
const STORAGE_KEY = "mamlaka_data_v2";
const ITEMS_PER_PAGE = 12;

const DEFAULT_PRICES = {
    "3": 50, "5": 75, "10": 100, "22": 130, "30": 150, "50": 200, "100": 450
};

const DEFAULT_COMPANIES = [
    "Lattafa", "Afnan", "Armaf", "Swiss Arabian", "Maison Alhambra", "Mancera", 
    "Dior", "Chanel", "Versace", "Paco Rabanne", "Carolina Herrera", "Yves Saint Laurent", 
    "Giorgio Armani", "Dolce & Gabbana", "Tom Ford", "Creed", "Xerjoff", "Jean Paul Gaultier", 
    "Givenchy", "Hugo Boss", "Calvin Klein", "Lacoste", "Dunhill", "Roberto Cavalli", 
    "Britney Spears", "Victoria's Secret", "Gucci", "Zara", "Ajmal", "Local/Arab"
];

const DEFAULT_CATEGORIES = {
    gender: ["men", "women", "unisex"],
    family: ["fresh", "floral", "woody", "oriental", "sweet", "musky", "citrus", "fruity", "powdery", "spicy", "oud", "amber"]
};

// كتالوج أولي ضخم (عينة ممثلة للأسماء المطلوبة مع تصنيفات واقعية)
// ملاحظة: النظام يدعم آلاف المنتجات. هذه العينة تغطي الأسماء المطلوبة وتظهر الهيكل.
const INITIAL_PERFUMES = [
    { id: 1, name: "يارا كاندي", nameEn: "Yara Candy", company: "Lattafa", gender: "women", family: "sweet", stock: 50, active: true, desc: "عطر حلو وجذاب من لطافة" },
    { id: 2, name: "مانسيرا روز فانيليا", nameEn: "Mancera Rose Vanilla", company: "Mancera", gender: "unisex", family: "oriental", stock: 30, active: true, desc: "مزيج فاخر من الورد والفانيليا" },
    { id: 3, name: "لاكوست روز", nameEn: "Lacoste Rose", company: "Lacoste", gender: "women", family: "floral", stock: 40, active: true },
    { id: 4, name: "لاكوست بلاك", nameEn: "Lacoste Black", company: "Lacoste", gender: "men", family: "woody", stock: 45, active: true },
    { id: 5, name: "لاكوست وايت", nameEn: "Lacoste White", company: "Lacoste", gender: "men", family: "fresh", stock: 40, active: true },
    { id: 6, name: "بيانكو لاتية", nameEn: "Bianco Latte", company: "Giardini di Toscana", gender: "women", family: "sweet", stock: 20, active: true },
    { id: 7, name: "سكاندال", nameEn: "Scandal", company: "Jean Paul Gaultier", gender: "women", family: "sweet", stock: 25, active: true },
    { id: 8, name: "بلاك اكس اس", nameEn: "Black XS", company: "Paco Rabanne", gender: "men", family: "oriental", stock: 35, active: true },
    { id: 9, name: "دنهل دزير بلو", nameEn: "Dunhill Desire Blue", company: "Dunhill", gender: "men", family: "fresh", stock: 30, active: true },
    { id: 10, name: "وصال", nameEn: "Wisal", company: "Ajmal", gender: "unisex", family: "woody", stock: 60, active: true },
    { id: 11, name: "مضاوي", nameEn: "Madaawi", company: "Local/Arab", gender: "women", family: "oriental", stock: 100, active: true },
    { id: 12, name: "مسك الطهارة", nameEn: "Tahara Musk", company: "Local/Arab", gender: "women", family: "musky", stock: 200, active: true },
    { id: 13, name: "كريد افنتوس", nameEn: "Creed Aventus", company: "Creed", gender: "men", family: "fruity", stock: 15, active: true },
    { id: 14, name: "توم فورد بلاك اوركيد", nameEn: "Tom Ford Black Orchid", company: "Tom Ford", gender: "unisex", family: "oriental", stock: 20, active: true },
    { id: 15, name: "سوفاج", nameEn: "Sauvage", company: "Dior", gender: "men", family: "fresh", stock: 50, active: true },
    { id: 16, name: "كوكو شانيل", nameEn: "Coco Chanel", company: "Chanel", gender: "women", family: "floral", stock: 30, active: true },
    { id: 17, name: "وان مليون", nameEn: "1 Million", company: "Paco Rabanne", gender: "men", family: "spicy", stock: 40, active: true },
    { id: 18, name: "جادور", nameEn: "J'adore", company: "Dior", gender: "women", family: "floral", stock: 35, active: true },
    { id: 19, name: "عود اماراتى", nameEn: "Emirati Oud", company: "Swiss Arabian", gender: "unisex", family: "oud", stock: 50, active: true },
    { id: 20, name: "فوياج", nameEn: "Voyage", company: "Armaf", gender: "men", family: "fresh", stock: 60, active: true }
    // ... يمكن إضافة المئات هنا بنفس الهيكل. النظام مصمم ليتعامل مع 1500+ بسلاسة.
];

// ==========================================
// 2. إدارة الحالة (State Management)
// ==========================================
let appData = {
    products: [],
    cart: [],
    wishlist: [],
    companies: [...DEFAULT_COMPANIES],
    settings: {
        prices: { ...DEFAULT_PRICES },
        pricingMode: "simple", // 'simple' or 'detailed'
        lang: "ar",
        skipEntry: false
    }
};

// ==========================================
// 3. التهيئة والتحميل (Initialization)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    mergeCatalog();
    setupRoyalExtras();
    setupEntryScreen();
    setupEventListeners();
    renderAll();
    checkLanguage();
});

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // دمج البيانات المحفوظة مع القيم الافتراضية الجديدة لتجنب الأخطاء عند التحديث
            appData = { ...appData, ...parsed, settings: { ...appData.settings, ...parsed.settings } };
        } catch (e) {
            console.error("خطأ في قراءة البيانات", e);
            seedInitialData();
        }
    } else {
        seedInitialData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    updateBadges();
}

function seedInitialData() {
    appData.products = INITIAL_PERFUMES.map((p, index) => ({
        ...p,
        id: Date.now() + index,
        sizes: Object.keys(DEFAULT_PRICES),
        manufactureDate: new Date().toISOString().split('T')[0],
        rating: (4 + Math.random()).toFixed(1),
        image: "" // سيستخدم الصورة الافتراضية
    }));
    saveData();
}

// ==========================================
// 4. شاشة الدخول
// ==========================================
function setupEntryScreen() {
    const entryScreen = document.getElementById("entry-screen");
    const app = document.getElementById("app");
    const enterBtn = document.getElementById("enter-kingdom-btn");
    const skipCheck = document.getElementById("skip-entry-check");

    if (appData.settings.skipEntry) {
        entryScreen.classList.add("fade-out");
        setTimeout(() => entryScreen.classList.add("hidden"), 800);
        return;
    }

    enterBtn.addEventListener("click", () => {
        if (skipCheck.checked) {
            appData.settings.skipEntry = true;
            saveData();
        }
        entryScreen.classList.add("fade-out");
        setTimeout(() => {
            entryScreen.classList.add("hidden");
            app.classList.remove("hidden");
        }, 800);
    });
}

// ==========================================
// 5. العرض والتصيير (Rendering)
// ==========================================
let currentFilters = {
    search: "",
    gender: "all",
    family: "all",
    company: "all",
    size: "all",
    inStock: false,
    hall: "all",
    requested: "all"
};
let currentPage = 1;

function renderAll() {
    renderStats();
    renderFilters();
    renderProducts();
    renderCart();
    renderWishlist();
    renderAdminProducts();
    renderAdminCompanies();
    renderPriceSettings();
    updateBadges();
}

function renderStats() {
    const activeProducts = appData.products.filter(p => p.active).length;
    const statsContainer = document.getElementById("dynamic-stats");
    statsContainer.innerHTML = `
        <div class="stat-item"><h3>${activeProducts}</h3><p data-i18n="stat_products">عطر متاح</p></div>
        <div class="stat-item"><h3>${appData.companies.length}</h3><p data-i18n="stat_companies">شركة مصنعة</p></div>
        <div class="stat-item"><h3>${Object.keys(appData.settings.prices).length}</h3><p data-i18n="stat_sizes">مقاسات مختلفة</p></div>
    `;
}

function renderFilters() {
    // Gender
    const genderContainer = document.getElementById("gender-filters");
    genderContainer.innerHTML = DEFAULT_CATEGORIES.gender.map(g => `
        <label class="checkbox-label">
            <input type="radio" name="gender" value="${g}" onchange="updateFilter('gender', this.value)">
            <span data-i18n="gender_${g}">${getTranslation(`gender_${g}`)}</span>
        </label>
    `).join('') + `<label class="checkbox-label"><input type="radio" name="gender" value="all" checked onchange="updateFilter('gender', 'all')"><span>الكل</span></label>`;

    // Family
    const familyContainer = document.getElementById("family-filters");
    familyContainer.innerHTML = DEFAULT_CATEGORIES.family.map(f => `
        <label class="checkbox-label">
            <input type="radio" name="family" value="${f}" onchange="updateFilter('family', this.value)">
            <span data-i18n="family_${f}">${getTranslation(`family_${f}`)}</span>
        </label>
    `).join('') + `<label class="checkbox-label"><input type="radio" name="family" value="all" checked onchange="updateFilter('family', 'all')"><span>الكل</span></label>`;

    // Company Select
    const companySelect = document.getElementById("company-filter");
    companySelect.innerHTML = `<option value="all">الكل</option>` + 
        appData.companies.map(c => `<option value="${c}">${c}</option>`).join('');

    // Size Select
    const sizeSelect = document.getElementById("size-filter");
    sizeSelect.innerHTML = `<option value="all">الكل</option>` + 
        Object.keys(appData.settings.prices).map(s => `<option value="${s}">${s} مل</option>`).join('');
}

function getFilteredProducts() {
    return appData.products.filter(p => {
        if (!p.active) return false;
        if (currentFilters.inStock && p.stock <= 0) return false;
        if (currentFilters.gender !== "all" && p.gender !== currentFilters.gender) return false;
        if (currentFilters.family !== "all" && p.family !== currentFilters.family) return false;
        if (currentFilters.company !== "all" && p.company !== currentFilters.company) return false;
        if (currentFilters.size !== "all" && !p.sizes.includes(currentFilters.size)) return false;
        if (!matchesHall(p) || !matchesRequested(p)) return false;
        
        if (currentFilters.search) {
            const q = currentFilters.search.toLowerCase();
            return p.name.toLowerCase().includes(q) || 
                   (p.nameEn && p.nameEn.toLowerCase().includes(q)) || 
                   p.company.toLowerCase().includes(q) ||
                   p.family.toLowerCase().includes(q);
        }
        return true;
    });
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

    const grid = document.getElementById("products-grid");
    grid.innerHTML = paginated.map(p => createProductCard(p)).join('');

    // Pagination
    const pagination = document.getElementById("pagination");
    if (totalPages > 1) {
        let pagesHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        pagination.innerHTML = pagesHtml;
    } else {
        pagination.innerHTML = '';
    }
}

function createProductCard(p) {
    const isWished = appData.wishlist.includes(p.id);
    const price = startingPrice(p); // أقل سعر متاح للمنتج
    
    return `
        <div class="product-card" data-narrate="${p.name}|${p.nameEn || ''}|${p.company}">
            <button class="wishlist-toggle ${isWished ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
                <i class="${isWished ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <img src="${p.image || 'https://via.placeholder.com/300x300/1a1a20/d4af37?text=CROWN'}" alt="${p.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-company">${p.company}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-price">يبدأ من ${price} جنيه</div>
                <div class="product-actions">
                    <button class="btn-gold small" onclick="openProductModal(${p.id})">التفاصيل</button>
                    <button class="btn-outline small" onclick="quickAddToCart(${p.id})"><i class="fas fa-cart-plus"></i></button>
                </div>
            </div>
        </div>
    `;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    document.getElementById("store").scrollIntoView({ behavior: "smooth" });
}

// ==========================================
// 6. التفاعلات والأحداث (Event Listeners)
// ==========================================
function setupEventListeners() {
    // Search
    document.getElementById("search-input").addEventListener("input", (e) => {
        currentFilters.search = e.target.value;
        currentPage = 1;
        renderProducts();
    });

    // In Stock Filter
    document.getElementById("in-stock-only").addEventListener("change", (e) => {
        currentFilters.inStock = e.target.checked;
        currentPage = 1;
        renderProducts();
    });

    // Company & Size Filters
    document.getElementById("company-filter").addEventListener("change", (e) => updateFilter('company', e.target.value));
    document.getElementById("size-filter").addEventListener("change", (e) => updateFilter('size', e.target.value));

    // Reset Filters
    document.getElementById("reset-filters").addEventListener("click", () => {
        currentFilters = { search: "", gender: "all", family: "all", company: "all", size: "all", inStock: false };
        document.getElementById("search-input").value = "";
        document.getElementById("in-stock-only").checked = false;
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.querySelectorAll('input[type="radio"][value="all"]').forEach(r => r.checked = true);
        document.getElementById("company-filter").value = "all";
        document.getElementById("size-filter").value = "all";
        currentPage = 1;
        renderProducts();
    });

    // Modals
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest(".modal").classList.remove("active");
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    });

    // Cart & Wishlist Toggles
    document.getElementById("cart-btn").addEventListener("click", () => document.getElementById("cart-modal").classList.add("active"));
    document.getElementById("wishlist-btn").addEventListener("click", () => document.getElementById("wishlist-modal").classList.add("active"));
    document.getElementById("clear-cart").addEventListener("click", () => {
        if(confirm("هل أنت متأكد من تفريغ السلة؟")) {
            appData.cart = [];
            saveData();
            renderCart();
        }
    });
    document.getElementById("checkout-whatsapp").addEventListener("click", sendWhatsAppOrder);

    // Admin Toggle
    document.getElementById("admin-toggle-btn").addEventListener("click", () => {
        const pass = prompt("أدخل رمز الدخول للوحة الإدارة (افتراضي: admin):");
        if (pass === "admin") {
            document.getElementById("admin-modal").classList.add("active");
            renderAdminProducts();
        } else if (pass) {
            alert("رمز الدخول غير صحيح");
        }
    });

    // Admin Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.tab).classList.add("active");
        });
    });

    // Product Form
    document.getElementById("product-form").addEventListener("submit", handleProductSubmit);
    document.getElementById("add-product-btn").addEventListener("click", () => {
        document.getElementById("product-form").reset();
        document.getElementById("edit-product-id").value = "";
        document.getElementById("product-form-title").innerText = "إضافة عطر جديد";
        populateFormSelects();
        document.getElementById("product-form-modal").classList.add("active");
    });
    document.querySelectorAll(".close-form").forEach(btn => {
        btn.addEventListener("click", () => document.getElementById("product-form-modal").classList.remove("active"));
    });

    // Admin Actions
    document.getElementById("add-company-btn").addEventListener("click", addCompany);
    document.getElementById("save-settings-btn").addEventListener("click", saveSettings);
    document.getElementById("export-json-btn").addEventListener("click", exportJSON);
    document.getElementById("import-json-file").addEventListener("change", importJSON);

    // Language Toggle
    document.getElementById("lang-toggle").addEventListener("click", toggleLanguage);

    // Voice Search
    document.getElementById("voice-search-btn").addEventListener("click", startVoiceSearch);

    // Consultant Wizard
    setupConsultant();
}

function updateFilter(key, value) {
    currentFilters[key] = value;
    currentPage = 1;
    renderProducts();
}

// ==========================================
// 7. منطق السلة والمفضلة
// ==========================================
function toggleWishlist(id) {
    const index = appData.wishlist.indexOf(id);
    if (index > -1) {
        appData.wishlist.splice(index, 1);
    } else {
        appData.wishlist.push(id);
    }
    saveData();
    renderProducts(); // لتحديث أيقونة القلب
    renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById("wishlist-items");
    const wishedProducts = appData.products.filter(p => appData.wishlist.includes(p.id));
    container.innerHTML = wishedProducts.length ? wishedProducts.map(p => createProductCard(p)).join('') : '<p class="text-center">المفضلة فارغة</p>';
}

function quickAddToCart(id) {
    const product = appData.products.find(p => p.id === id);
    if (!product) return;
    
    const defaultSize = "30";
    const price = appData.settings.prices[defaultSize] || 150;
    
    const existing = appData.cart.find(item => item.id === id && item.size === defaultSize);
    if (existing) {
        existing.qty++;
    } else {
        appData.cart.push({ id, size: defaultSize, qty: 1, price });
    }
    saveData();
    renderCart();
    alert("تمت الإضافة للسلة");
}

function renderCart() {
    const container = document.getElementById("cart-items");
    let total = 0;
    
    if (appData.cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">السلة فارغة</p>';
    } else {
        container.innerHTML = appData.cart.map((item, index) => {
            const product = appData.products.find(p => p.id === item.id);
            if (!product) return '';
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p>${product.company} | ${item.size} مل</p>
                        <p>${item.price} جنيه × ${item.qty}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                        <button class="qty-btn" style="color:var(--danger); margin-right:10px;" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }
    document.getElementById("cart-total").innerText = total;
}

function updateCartQty(index, change) {
    appData.cart[index].qty += change;
    if (appData.cart[index].qty <= 0) {
        appData.cart.splice(index, 1);
    }
    saveData();
    renderCart();
}

function removeFromCart(index) {
    appData.cart.splice(index, 1);
    saveData();
    renderCart();
}

function sendWhatsAppOrder() {
    if (appData.cart.length === 0) return;
    
    let message = "*طلب جديد من مملكة العطور*%0a%0a";
    let total = 0;
    
    appData.cart.forEach(item => {
        const product = appData.products.find(p => p.id === item.id);
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `▪️ *${product.name}* (${product.company})%0a`;
        message += `   المقاس: ${item.size} مل | الكمية: ${item.qty}%0a`;
        message += `   السعر: ${itemTotal} جنيه%0a%0a`;
    });
    
    message += `*الإجمالي الكلي: ${total} جنيه*%0a`;
    message += `العنوان: الإسكندرية — شارع خالد بن الوليد`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function updateBadges() {
    document.getElementById("cart-count").innerText = appData.cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("wishlist-count").innerText = appData.wishlist.length;
}

// ==========================================
// 8. تفاصيل المنتج
// ==========================================
function openProductModal(id) {
    const p = appData.products.find(prod => prod.id === id);
    if (!p) return;
    
    const container = document.getElementById("product-details-container");
    const defaultSize = p.sizes[0] || "30";
    const currentPrice = appData.settings.prices[defaultSize] || 0;
    
    container.innerHTML = `
        <div class="product-detail-header">
            <img src="${p.image || 'https://via.placeholder.com/400x400/1a1a20/d4af37?text=CROWN'}" class="detail-image">
            <div>
                <span class="product-company">${p.company}</span>
                <h2>${p.name} ${p.nameEn ? `(${p.nameEn})` : ''}</h2>
                <div class="detail-meta">
                    <span data-i18n="gender_${p.gender}">${getTranslation(`gender_${p.gender}`)}</span>
                    <span data-i18n="family_${p.family}">${getTranslation(`family_${p.family}`)}</span>
                    <span>المخزون: ${p.stock}</span>
                    <span>التقييم: ⭐ ${p.rating || '4.5'}</span>
                </div>
                <p style="color:var(--text-secondary); margin: 1rem 0;">${p.desc || 'عطر فاخر من مملكة العطور'}</p>
                
                <h4>اختر المقاس:</h4>
                <div class="size-selector" id="modal-sizes">
                    ${p.sizes.map(s => `
                        <button class="size-option ${s === defaultSize ? 'active' : ''}" 
                                onclick="selectSize(this, ${p.id}, '${s}', ${appData.settings.prices[s] || 0})">
                            ${s} مل - ${appData.settings.prices[s] || 0} ج.م
                        </button>
                    `).join('')}
                </div>
                
                <h3 id="modal-price-display" style="color:var(--gold); margin: 1rem 0;">${currentPrice} جنيه</h3>
                
                <div style="display:flex; gap:1rem; margin-top:1.5rem;">
                    <button class="btn-gold" onclick="addToCartFromModal(${p.id})" style="flex:2;">أضف للسلة</button>
                    <button class="btn-outline" onclick="toggleWishlist(${p.id}); openProductModal(${p.id});" style="flex:1;">
                        <i class="${appData.wishlist.includes(p.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Store current selection in dataset for cart addition
    container.dataset.currentSize = defaultSize;
    container.dataset.currentPrice = currentPrice;
    
    document.getElementById("product-modal").classList.add("active");
}

function selectSize(btn, productId, size, price) {
    document.querySelectorAll(".size-option").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("modal-price-display").innerText = `${price} جنيه`;
    
    const container = document.getElementById("product-details-container");
    container.dataset.currentSize = size;
    container.dataset.currentPrice = price;
}

function addToCartFromModal(productId) {
    const container = document.getElementById("product-details-container");
    const size = container.dataset.currentSize;
    const price = parseInt(container.dataset.currentPrice);
    
    const existing = appData.cart.find(item => item.id === productId && item.size === size);
    if (existing) {
        existing.qty++;
    } else {
        appData.cart.push({ id: productId, size, qty: 1, price });
    }
    saveData();
    renderCart();
    document.getElementById("product-modal").classList.remove("active");
    alert("تمت الإضافة للسلة");
}

// ==========================================
// 9. لوحة الإدارة (Admin Panel)
// ==========================================
function renderAdminProducts() {
    const tbody = document.getElementById("admin-products-list");
    tbody.innerHTML = appData.products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.company}</td>
            <td>${p.stock}</td>
            <td>${p.active ? '<span style="color:var(--success)">نشط</span>' : '<span style="color:var(--danger)">معطل</span>'}</td>
            <td>
                <button class="btn-outline small" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-outline small" style="color:var(--danger); border-color:var(--danger);" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateFormSelects() {
    const compSelect = document.getElementById("p-company");
    compSelect.innerHTML = appData.companies.map(c => `<option value="${c}">${c}</option>`).join('');
    
    const famSelect = document.getElementById("p-family");
    famSelect.innerHTML = DEFAULT_CATEGORIES.family.map(f => `<option value="${f}">${getTranslation(`family_${f}`)}</option>`).join('');
}

function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("edit-product-id").value;
    const name = document.getElementById("p-name").value.trim();
    const nameEn = document.getElementById("p-name-en").value.trim();
    const company = document.getElementById("p-company").value;
    const gender = document.getElementById("p-gender").value;
    const family = document.getElementById("p-family").value;
    const stock = parseInt(document.getElementById("p-stock").value) || 0;
    const desc = document.getElementById("p-desc").value;
    const image = document.getElementById("p-image").value;

    // منع التكرار
    const isDuplicate = appData.products.some(p => 
        p.id !== parseInt(id) && 
        (p.name.toLowerCase() === name.toLowerCase() || 
         (nameEn && p.nameEn && p.nameEn.toLowerCase() === nameEn.toLowerCase())) &&
        p.company === company
    );

    if (isDuplicate) {
        alert("⚠️ هذا العطر موجود بالفعل في المملكة بنفس الاسم والشركة.");
        return;
    }

    if (id) {
        // تعديل
        const index = appData.products.findIndex(p => p.id === parseInt(id));
        if (index > -1) {
            appData.products[index] = { ...appData.products[index], name, nameEn, company, gender, family, stock, desc, image };
        }
    } else {
        // إضافة جديد
        const newProduct = {
            id: Date.now(),
            name, nameEn, company, gender, family, stock, desc, image,
            active: true,
            sizes: Object.keys(appData.settings.prices),
            manufactureDate: new Date().toISOString().split('T')[0],
            rating: "5.0"
        };
        appData.products.push(newProduct);
    }

    saveData();
    document.getElementById("product-form-modal").classList.remove("active");
    renderAll();
}

function editProduct(id) {
    const p = appData.products.find(prod => prod.id === id);
    if (!p) return;
    
    populateFormSelects();
    document.getElementById("edit-product-id").value = p.id;
    document.getElementById("p-name").value = p.name;
    document.getElementById("p-name-en").value = p.nameEn || "";
    document.getElementById("p-company").value = p.company;
    document.getElementById("p-gender").value = p.gender;
    document.getElementById("p-family").value = p.family;
    document.getElementById("p-stock").value = p.stock;
    document.getElementById("p-desc").value = p.desc || "";
    document.getElementById("p-image").value = p.image || "";
    document.getElementById("product-form-title").innerText = "تعديل بيانات العطر";
    
    document.getElementById("product-form-modal").classList.add("active");
}

function deleteProduct(id) {
    if (confirm("هل أنت متأكد من حذف هذا العطر نهائياً؟")) {
        appData.products = appData.products.filter(p => p.id !== id);
        // إزالة من السلة والمفضلة أيضاً
        appData.cart = appData.cart.filter(item => item.id !== id);
        appData.wishlist = appData.wishlist.filter(wid => wid !== id);
        saveData();
        renderAll();
    }
}

function renderAdminCompanies() {
    const list = document.getElementById("admin-companies-list");
    list.innerHTML = appData.companies.map((c, idx) => `
        <li>
            <span>${c}</span>
            <button class="btn-outline small" style="color:var(--danger); border-color:var(--danger);" onclick="deleteCompany(${idx})"><i class="fas fa-trash"></i></button>
        </li>
    `).join('');
}

function addCompany() {
    const input = document.getElementById("new-company-name");
    const name = input.value.trim();
    if (name && !appData.companies.includes(name)) {
        appData.companies.push(name);
        input.value = "";
        saveData();
        renderAdminCompanies();
        renderFilters(); // لتحديث فلتر المتجر
    }
}

function deleteCompany(idx) {
    if (confirm("حذف هذه الشركة؟")) {
        appData.companies.splice(idx, 1);
        saveData();
        renderAdminCompanies();
        renderFilters();
    }
}

function renderPriceSettings() {
    const container = document.getElementById("price-settings-container");
    container.innerHTML = Object.entries(appData.settings.prices).map(([size, price]) => `
        <div class="form-group">
            <label>${size} مل</label>
            <input type="number" class="price-input" data-size="${size}" value="${price}">
        </div>
    `).join('');
    
    document.getElementById("pricing-mode-setting").value = appData.settings.pricingMode;
}

function saveSettings() {
    const inputs = document.querySelectorAll(".price-input");
    inputs.forEach(input => {
        appData.settings.prices[input.dataset.size] = parseInt(input.value) || 0;
    });
    appData.settings.pricingMode = document.getElementById("pricing-mode-setting").value;
    saveData();
    alert("تم حفظ الإعدادات بنجاح");
    renderAll();
}

// ==========================================
// 10. النسخ الاحتياطي (Backup & Restore)
// ==========================================
function exportJSON() {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamlaka_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!imported.products || !Array.isArray(imported.products)) {
                throw new Error("ملف غير صالح");
            }
            
            // دمج آمن لمنع التكرار
            let addedCount = 0;
            imported.products.forEach(newP => {
                const isDup = appData.products.some(p => 
                    p.name.toLowerCase() === newP.name.toLowerCase() && p.company === newP.company
                );
                if (!isDup) {
                    newP.id = Date.now() + Math.random(); // ضمان عدم تعارض IDs
                    appData.products.push(newP);
                    addedCount++;
                }
            });
            
            // تحديث القوائم الأخرى إذا كانت موجودة
            if (imported.companies) {
                imported.companies.forEach(c => {
                    if (!appData.companies.includes(c)) appData.companies.push(c);
                });
            }
            
            saveData();
            renderAll();
            alert(`تم الاستيراد بنجاح! تمت إضافة ${addedCount} عطر جديد (تم تجاهل المكرر).`);
        } catch (err) {
            alert("خطأ: الملف غير صالح أو تالف.");
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

// ==========================================
// 11. المساعد الصوتي والبحث
// ==========================================
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("عذراً، متصفحك لا يدعم البحث الصوتي. يرجى استخدام البحث النصي.");
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.interimResults = false;
    
    const btn = document.getElementById("voice-search-btn");
    btn.style.color = "var(--danger)";
    btn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("search-input").value = transcript;
        currentFilters.search = transcript;
        currentPage = 1;
        renderProducts();
        document.getElementById("store").scrollIntoView({ behavior: "smooth" });
    };
    
    recognition.onerror = (event) => {
        console.error("Voice error", event.error);
        alert("لم يتم التعرف على الصوت، يرجى المحاولة مرة أخرى أو استخدام الكتابة.");
    };
    
    recognition.onend = () => {
        btn.style.color = "";
        btn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
}

// ==========================================
// 12. مستشار العطور
// ==========================================
let consultantAnswers = {};

function setupConsultant() {
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const step = btn.closest(".wizard-step").dataset.step;
            const value = btn.dataset.value;
            consultantAnswers[step] = value;
            
            // Move to next step
            const currentStepEl = btn.closest(".wizard-step");
            currentStepEl.classList.remove("active");
            
            const nextStep = parseInt(step) + 1;
            const nextStepEl = document.querySelector(`.wizard-step[data-step="${nextStep}"]`);
            if (nextStepEl) {
                nextStepEl.classList.add("active");
            } else {
                showConsultantResults();
            }
        });
    });
    
    document.getElementById("restart-consultant").addEventListener("click", () => {
        consultantAnswers = {};
        document.querySelectorAll(".wizard-step").forEach(s => s.classList.remove("active"));
        document.querySelector(".wizard-step[data-step='1']").classList.add("active");
    });
}

function showConsultantResults() {
    const step4 = document.querySelector(".wizard-step[data-step='4']");
    step4.classList.add("active");
    
    // منطق التصفية بناءً على الإجابات
    let results = appData.products.filter(p => p.active);
    
    if (consultantAnswers["1"]) {
        results = results.filter(p => p.gender === consultantAnswers["1"] || p.gender === "unisex");
    }
    if (consultantAnswers["2"]) {
        // مطابقة تقريبية للعائلة العطرية
        results = results.filter(p => p.family === consultantAnswers["2"] || p.family.includes(consultantAnswers["2"]));
    }
    
    // خلط النتائج لأخذ عينة عشوائية إذا كانت كثيرة
    results = results.sort(() => 0.5 - Math.random()).slice(0, 6);
    
    const container = document.getElementById("consultant-results");
    if (results.length > 0) {
        container.innerHTML = results.map(p => createProductCard(p)).join('');
    } else {
        container.innerHTML = '<p>لم نجد تطابقاً دقيقاً، لكننا ننصحك بزيارة المتجر لاستكشاف المزيد.</p>';
    }
}

// ==========================================
// 13. الترجمة واللغة
// ==========================================
const translations = {
    ar: {
        nav_home: "الرئيسية", nav_store: "المتجر", nav_consultant: "مستشار العطور", nav_contact: "تواصل معنا",
        hero_title: "عطور تُخلّد لحظاتك", hero_desc: "اكتشف تشكيلة ملكية من أفخم العطور العالمية والشرقية، مختارة بعناية لتناسب شخصيتك.",
        btn_discover: "اكتشف العطور", btn_consultant: "مستشار العطور",
        store_title: "كتالوج العطور", search_placeholder: "ابحث عن اسم العطر، الشركة، أو العائلة العطرية...",
        filters_title: "تصفية النتائج", filter_gender: "التصنيف", filter_family: "العائلة العطرية",
        filter_company: "الشركة / المصدر", filter_size: "المقاس", filter_in_stock: "الوفر فقط", btn_reset: "إعادة ضبط",
        gender_men: "رجالي", gender_women: "حريمي", gender_unisex: "مشترك",
        family_fresh: "منعش", family_floral: "زهري", family_woody: "خشبي", family_oriental: "شرقي",
        family_sweet: "حلو", family_musky: "مسكي", family_citrus: "حمضي", family_fruity: "فواكه",
        family_powdery: "بودري", family_spicy: "توابل", family_oud: "عود", family_amber: "عنبر",
        stat_products: "عطر متاح", stat_companies: "شركة مصنعة", stat_sizes: "مقاسات مختلفة",
        cart_title: "سلة المشتريات", cart_total: "الإجمالي:", btn_clear_cart: "تفريغ السلة", btn_checkout_wa: "إرسال الطلب عبر واتساب",
        wishlist_title: "المفضلة", consultant_title: "مستشار العطور الملكي",
        q1_gender: "لمن العطر؟", opt_men: "رجالي", opt_women: "حريمي", opt_unisex: "مشترك",
        q2_vibe: "ما الطابع الذي تفضله؟", opt_fresh: "منعش", opt_floral: "زهري", opt_woody: "خشبي", opt_oriental: "شرقي", opt_sweet: "حلو", opt_musky: "مسكي",
        q3_occasion: "ما المناسبة؟", opt_daily: "يومي", opt_work: "عمل", opt_evening: "سهرة", opt_summer: "صيف", opt_winter: "شتاء",
        consultant_result: "اقتراحاتنا لك", btn_restart: "بدء من جديد"
    },
    en: {
        nav_home: "Home", nav_store: "Store", nav_consultant: "Consultant", nav_contact: "Contact",
        hero_title: "Perfumes That Timeless Your Moments", hero_desc: "Discover a royal collection of the finest global and oriental perfumes.",
        btn_discover: "Discover Perfumes", btn_consultant: "Perfume Consultant",
        store_title: "Perfume Catalog", search_placeholder: "Search by name, company, or scent family...",
        filters_title: "Filter Results", filter_gender: "Gender", filter_family: "Scent Family",
        filter_company: "Company / Source", filter_size: "Size", filter_in_stock: "In Stock Only", btn_reset: "Reset",
        gender_men: "Men", gender_women: "Women", gender_unisex: "Unisex",
        family_fresh: "Fresh", family_floral: "Floral", family_woody: "Woody", family_oriental: "Oriental",
        family_sweet: "Sweet", family_musky: "Musky", family_citrus: "Citrus", family_fruity: "Fruity",
        family_powdery: "Powdery", family_spicy: "Spicy", family_oud: "Oud", family_amber: "Amber",
        stat_products: "Available Perfumes", stat_companies: "Brands", stat_sizes: "Sizes",
        cart_title: "Shopping Cart", cart_total: "Total:", btn_clear_cart: "Clear Cart", btn_checkout_wa: "Order via WhatsApp",
        wishlist_title: "Wishlist", consultant_title: "Royal Perfume Consultant",
        q1_gender: "Who is it for?", opt_men: "Men", opt_women: "Women", opt_unisex: "Unisex",
        q2_vibe: "Preferred Vibe?", opt_fresh: "Fresh", opt_floral: "Floral", opt_woody: "Woody", opt_oriental: "Oriental", opt_sweet: "Sweet", opt_musky: "Musky",
        q3_occasion: "Occasion?", opt_daily: "Daily", opt_work: "Work", opt_evening: "Evening", opt_summer: "Summer", opt_winter: "Winter",
        consultant_result: "Our Recommendations", btn_restart: "Start Over"
    }
};

function toggleLanguage() {
    appData.settings.lang = appData.settings.lang === "ar" ? "en" : "ar";
    saveData();
    checkLanguage();
}

function checkLanguage() {
    const lang = appData.settings.lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.getElementById("lang-toggle").innerText = lang === "ar" ? "EN" : "AR";
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
        const key = el.getAttribute("data-i18n-ph");
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

function getTranslation(key) {
    const lang = appData.settings.lang;
    return translations[lang][key] || key;
}

// ==========================================
// 11. إضافات ملكية (تضاف فوق الموجود دون حذف أي وظيفة)
// ==========================================
const OLD_BEFORE_YEAR = 2015;   // قاعة القديم: إصدار قبل هذه السنة
const NEW_FROM_YEAR = 2022;     // قاعة الجديد: إصدار من هذه السنة

function normName(s) { return (s || "").toString().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ").trim().toLowerCase(); }
function productYear(p) { return p.releaseYear || parseInt((p.manufactureDate || "").slice(0, 4)) || 0; }
function isOil(p) { return /oil|زيت|زيوت/i.test((p.type || "") + " " + (p.name || "") + " " + (p.categories || []).join(" ")); }
function startingPrice(p) {
    const own = p.prices ? Object.values(p.prices).map(Number).filter(Boolean) : [];
    if (own.length) return Math.min(...own);
    const g = Object.values(appData.settings.prices).map(Number).filter(Boolean);
    return g.length ? Math.min(...g) : 150;
}
function matchesHall(p) {
    const h = currentFilters.hall, y = productYear(p);
    if (h === "all") return true;
    if (h === "featured") return !!p.featured;
    if (h === "old") return y && y < OLD_BEFORE_YEAR;
    if (h === "new") return y >= NEW_FROM_YEAR;
    return true;
}
function matchesRequested(p) {
    const r = currentFilters.requested;
    if (r === "all") return true;
    if (r === "oil") return isOil(p);
    if (r === "men") return p.gender === "men" || p.gender === "unisex";
    if (r === "women") return p.gender === "women" || p.gender === "unisex";
    if (r === "oriental") return p.family === "oriental" || p.family === "oud" || /شرقي/.test(p.familyAr || "");
    return true;
}

// دمج الكتالوج الخارجي بدون تكرار (العطور الجديدة تظهر للمالك للمراجعة)
async function mergeCatalog() {
    try {
        const res = await fetch("catalog.merged.json", { cache: "no-cache" });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.products || []);
        const seen = new Set(appData.products.map(p => normName(p.name)));
        let added = 0;
        list.forEach(item => {
            const key = normName(item.name);
            if (!key || seen.has(key)) return;
            seen.add(key);
            appData.products.push({ ...item, id: item.id || (Date.now() + added), sizes: (item.sizes || []).map(String), stock: item.stock || 0, active: item.active !== false });
            if (item.company && !appData.companies.includes(item.company)) appData.companies.push(item.company);
            added++;
        });
        if (added) { saveData(); renderAll(); }
    } catch (e) { console.warn("تعذر تحميل الكتالوج", e); }
}

function setupRoyalExtras() {
    // شريط القاعات والأكثر طلباً
    const grid = document.getElementById("products-grid");
    if (grid && !document.getElementById("hall-bar")) {
        const bar = document.createElement("div");
        bar.id = "hall-bar";
        bar.className = "hall-bar";
        const chips = [
            ["hall", "all", "كل القاعات"], ["hall", "featured", "قاعة المميز"], ["hall", "new", "قاعة الجديد"], ["hall", "old", "قاعة القديم"],
            ["requested", "men", "الأكثر طلباً: رجالي"], ["requested", "women", "الأكثر طلباً: حريمي"], ["requested", "oriental", "الأكثر طلباً: شرقي"], ["requested", "oil", "زيوت عطرية"]
        ];
        bar.innerHTML = chips.map(c => `<button class="hall-chip" data-k="${c[0]}" data-v="${c[1]}">${c[2]}</button>`).join("");
        grid.parentNode.insertBefore(bar, grid);
        bar.addEventListener("click", e => {
            const b = e.target.closest(".hall-chip"); if (!b) return;
            const k = b.dataset.k, v = b.dataset.v;
            currentFilters[k] = (currentFilters[k] === v && v !== "all") ? "all" : v;
            currentPage = 1;
            bar.querySelectorAll(".hall-chip").forEach(x => x.classList.toggle("active", currentFilters[x.dataset.k] === x.dataset.v && x.dataset.v !== "all"));
            renderProducts();
        });
    }
    // الإدارة مخفية عن الزوار: ضغطة مطولة على الشعار أو ?admin
    const gear = document.getElementById("admin-toggle-btn");
    if (gear) {
        gear.classList.add("owner-only");
        const reveal = () => gear.classList.remove("owner-only");
        if (location.search.includes("admin")) reveal();
        const logo = document.querySelector(".logo");
        let t;
        if (logo) {
            ["mousedown", "touchstart"].forEach(ev => logo.addEventListener(ev, () => { t = setTimeout(reveal, 1500); }, { passive: true }));
            ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(ev => logo.addEventListener(ev, () => clearTimeout(t)));
        }
    }
    // الراوي الصوتي (عربي/إنجليزي) عند اللمس أو المرور
    const actions = document.querySelector(".header-actions");
    if (actions && !document.getElementById("narrator-btn") && "speechSynthesis" in window) {
        const nb = document.createElement("button");
        nb.id = "narrator-btn"; nb.className = "icon-btn"; nb.title = "الراوي الصوتي";
        nb.innerHTML = '<i class="fas fa-volume-xmark"></i>';
        actions.insertBefore(nb, actions.firstChild);
        let on = false, last = "";
        nb.addEventListener("click", () => {
            on = !on; speechSynthesis.cancel();
            nb.classList.toggle("active", on);
            nb.innerHTML = `<i class="fas ${on ? "fa-volume-high" : "fa-volume-xmark"}"></i>`;
        });
        const speak = e => {
            if (!on) return;
            const c = e.target.closest("[data-narrate]"); if (!c) return;
            const [ar, en, co] = c.dataset.narrate.split("|");
            const lang = appData.settings.lang === "en" && en ? "en-US" : "ar-SA";
            const text = (lang === "en-US" ? en : ar + " من " + co).replace(/[^\p{L}\p{N}\s]/gu, " ");
            if (text === last) return; last = text;
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 0.95;
            speechSynthesis.speak(u);
        };
        document.addEventListener("mouseover", speak);
        document.addEventListener("touchstart", speak, { passive: true });
    }
    // فاصل السيف الملكي
    const hero = document.querySelector(".hero-section");
    if (hero && !document.getElementById("sword-divider")) {
        const d = document.createElement("div");
        d.id = "sword-divider"; d.className = "sword-divider";
        d.innerHTML = '<svg viewBox="0 0 400 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20h160M230 20h160"/><path d="M175 6l50 28M225 6l-50 28"/><circle cx="200" cy="20" r="6" fill="currentColor"/></g></svg>';
        hero.after(d);
    }
}
