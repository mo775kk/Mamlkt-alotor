/* MAMLKAT AL-OTOR — customer tools (safe, static-site compatible) */
(function () {
  "use strict";
  const REQUESTS_KEY = "mamlaka_missing_product_requests_v1";
  const rootId = "mamlakaCustomerTools";
  const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const readRequests = () => { try { const x = JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); return Array.isArray(x) ? x : []; } catch (_) { return []; } };
  const saveRequests = value => { try { localStorage.setItem(REQUESTS_KEY, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const money = n => Number.isFinite(Number(n)) ? Number(n).toLocaleString("ar-EG") + " ج.م" : "يحتاج تأكيد";
  function mount() {
    if (document.getElementById(rootId)) return;
    const anchor = document.getElementById("homeIndex") || document.getElementById("home") || document.querySelector("main") || document.body;
    const section = document.createElement("section");
    section.id = rootId;
    section.className = "page-section customer-tools-section";
    section.setAttribute("aria-labelledby", "customerToolsTitle");
    section.innerHTML = `
      <div class="customer-tools-heading"><p class="eyebrow">CROWN · MAISON DE PARFUM</p><h2 id="customerToolsTitle">اكتشف اختيارك المثالي</h2><p>أدوات تساعدك على الاختيار وتجهيز الطلب. الأسعار والتوفر لا يُعتمدان إلا بعد مراجعة المتجر.</p></div>
      <div class="customer-tools-grid">
        <article class="customer-tool-card"><h3>مستشار العطور</h3><p>اختر ذوقك لنبحث في الأسماء المسجلة بالكتالوج.</p>
          <label for="ctFamily">الطابع المفضل</label><select id="ctFamily"><option value="">كل الأنواع</option><option>شرقي</option><option>خشبي</option><option>زهري</option><option>حمضي</option><option>مسك</option><option>فانيليا</option><option>غير محدد</option></select>
          <label for="ctGender">مناسب لمن؟</label><select id="ctGender"><option value="">الكل</option><option value="رجالي">رجالي</option><option value="حريمي">حريمي</option><option value="للجنسين">للجنسين</option></select>
          <button type="button" class="btn btn-gold" id="ctRecommend">اعرض الاقتراحات</button><div id="ctRecommendations" class="ct-results" aria-live="polite"></div>
        </article>
        <article class="customer-tool-card"><h3>مقارنة العطور</h3><p>اختر اسمين لمقارنة البيانات المتوفرة دون افتراض معلومات ناقصة.</p>
          <label for="ctCompareA">العطر الأول</label><select id="ctCompareA"><option value="">تحميل الكتالوج…</option></select>
          <label for="ctCompareB">العطر الثاني</label><select id="ctCompareB"><option value="">تحميل الكتالوج…</option></select>
          <button type="button" class="btn btn-outline" id="ctCompare">قارن الآن</button><div id="ctComparison" class="ct-results" aria-live="polite"></div>
        </article>
        <article class="customer-tool-card"><h3>منشئ طلب الهدية</h3><p>جهّز تفاصيل الهدية قبل إرسالها للمتجر.</p>
          <label for="ctOccasion">المناسبة</label><select id="ctOccasion"><option>عيد ميلاد</option><option>زفاف</option><option>ذكرى سنوية</option><option>هدية شكر</option><option>مناسبة أخرى</option></select>
          <label for="ctBudget">الميزانية بالجنيه</label><input id="ctBudget" type="number" min="0" step="10" inputmode="numeric" placeholder="اكتب الميزانية">
          <label for="ctGiftNotes">تفاصيل إضافية</label><textarea id="ctGiftNotes" rows="2" maxlength="500" placeholder="نوع العطر أو التغليف المطلوب"></textarea>
          <button type="button" class="btn btn-gold" id="ctGiftBuild">جهّز طلب الهدية</button><div id="ctGiftResult" class="ct-results" aria-live="polite"></div>
        </article>
        <article class="customer-tool-card"><h3>اطلب صنفًا غير موجود</h3><p>نسجل الطلب على هذا الجهاز، ويمكنك إرساله للمتجر عبر واتساب.</p>
          <label for="ctMissingName">اسم العطر أو الصنف</label><input id="ctMissingName" maxlength="120" placeholder="اكتب الاسم">
          <label for="ctMissingNotes">تفاصيل اختيارية</label><textarea id="ctMissingNotes" rows="2" maxlength="400" placeholder="الشركة أو الحجم المطلوب"></textarea>
          <button type="button" class="btn btn-gold" id="ctMissingSave">سجّل الطلب</button><button type="button" class="btn btn-outline" id="ctMissingExport">تصدير طلباتي المسجلة</button><div id="ctMissingResult" class="ct-results" aria-live="polite"></div>
        </article>
      </div>
      <div class="customer-tool-card ct-faq"><h3>أسئلة شائعة</h3>
        <details><summary>هل كل المنتجات المعروضة متاحة فورًا؟</summary><p>لا. المنتج الذي حالته «يحتاج مراجعة» أو «غير متاح» لا يُعد تأكيدًا للمخزون. يرجى تأكيد التوفر مع المتجر.</p></details>
        <details><summary>هل النوتات العطرية مؤكدة لكل زيت تركيب؟</summary><p>لا. النوتات المرجعية لا تثبت أن زيت مورد بعينه مطابق للعطر المرجعي. يجب مراجعة المطابقة ومصدر المعلومات.</p></details>
        <details><summary>هل السعر النهائي يشمل التغليف والشحن؟</summary><p>يعتمد ذلك على الخيارات المسعرة وتأكيد المتجر. لا يُعرض تقدير ناقص على أنه إجمالي نهائي.</p></details>
        <details><summary>هل طلباتي المسجلة تظهر على أجهزة المتجر؟</summary><p>التسجيل المحلي محفوظ على جهازك ومتصفحك فقط. المزامنة بين الأجهزة تحتاج خدمة خلفية متصلة وآمنة.</p></details>
      </div>`;
    if (anchor === document.body) document.body.appendChild(section); else anchor.insertAdjacentElement("afterend", section);
    let products = [];
    const byId = id => products.find(p => String(p.id) === String(id));
    const selectMarkup = p => '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.nameAr || p.nameEn || p.id) + (p.needsReview ? " — يحتاج مراجعة" : "") + '</option>';
    function fillCompare() {
      ["ctCompareA","ctCompareB"].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        el.innerHTML = '<option value="">اختر منتجًا</option>' + products.map(selectMarkup).join("");
      });
    }
    function productCard(p) {
      const prices = p.prices && typeof p.prices === "object" ? Object.entries(p.prices).map(([s,v]) => escapeHtml(s) + ": " + money(v)).join(" · ") : "";
      const notes = ["topNotes","heartNotes","baseNotes"].map((k,i) => {
        const label = ["مقدمة","قلب","قاعدة"][i], values = Array.isArray(p[k]) ? p[k].filter(Boolean) : [];
        return values.length ? label + ": " + values.map(escapeHtml).join("، ") : "";
      }).filter(Boolean).join(" | ");
      return '<div class="ct-product-result"><strong>' + escapeHtml(p.nameAr || p.nameEn || "اسم غير محدد") + '</strong><p>النوع: ' + escapeHtml(p.productType || "غير محدد") + ' · الفئة: ' + escapeHtml(p.gender || "غير محدد") + '</p><p>العائلة العطرية: ' + escapeHtml(p.family || "غير محدد") + '</p>' + (notes ? '<p>' + notes + '</p>' : '<p>النوتات: تحتاج إلى مصدر ومراجعة</p>') + (prices ? '<p>الأسعار المسجلة: ' + prices + '</p>' : '<p>السعر: يحتاج تأكيد</p>') + '<p class="ct-status">' + (p.available === true && !p.needsReview ? "متاح حسب بيانات الكتالوج" : p.available === false ? "التوفر غير مؤكد — راجع المتجر" : "حالة التوفر تحتاج مراجعة") + '</p></div>';
    }
    const button = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
    button("ctRecommend", () => {
      const family = (document.getElementById("ctFamily") || {}).value || "", gender = (document.getElementById("ctGender") || {}).value || "";
      const list = products.filter(p => (!gender || String(p.gender || "").includes(gender)) && (!family || family === "غير محدد" ? !family || !p.family || p.family === "غير محدد" : String(p.family || "").includes(family))).slice(0,6);
      const target = document.getElementById("ctRecommendations"); if (target) target.innerHTML = list.length ? list.map(productCard).join("") : "<p>لا توجد نتائج مطابقة في البيانات الحالية. جرّب اختيارًا آخر أو اطلب الصنف من المتجر.</p>";
    });
    button("ctCompare", () => {
      const a = byId((document.getElementById("ctCompareA") || {}).value), b = byId((document.getElementById("ctCompareB") || {}).value), target = document.getElementById("ctComparison");
      if (!target) return;
      if (!a || !b) { target.textContent = "اختر منتجين لإجراء المقارنة."; return; }
      target.innerHTML = '<div class="ct-compare-grid">' + productCard(a) + productCard(b) + '</div>';
    });
    button("ctGiftBuild", () => {
      const occasion = (document.getElementById("ctOccasion") || {}).value || "مناسبة أخرى";
      const budgetRaw = (document.getElementById("ctBudget") || {}).value || "", budget = Number(budgetRaw);
      const notes = (document.getElementById("ctGiftNotes") || {}).value || "";
      const target = document.getElementById("ctGiftResult"); if (!target) return;
      if (!budgetRaw || !Number.isFinite(budget) || budget <= 0) { target.textContent = "اكتب ميزانية صحيحة بالجنيه."; return; }
      const message = "طلب هدية — مملكة العطور\nالمناسبة: " + occasion + "\nالميزانية: " + budget + " جنيه\nالتفاصيل: " + (notes.trim() || "لم تُحدد") + "\nيرجى تأكيد المنتجات والتغليف والتكلفة النهائية.";
      target.innerHTML = '<p>تم تجهيز ملخص الطلب. السعر النهائي والتوفر يحتاجان تأكيد المتجر.</p><button type="button" class="btn btn-gold" id="ctGiftWhatsApp">إرسال الملخص إلى واتساب</button>';
      const wa = document.getElementById("ctGiftWhatsApp"); if (wa) wa.addEventListener("click", () => window.open("https://wa.me/201272776928?text=" + encodeURIComponent(message), "_blank", "noopener"));
    });
    button("ctMissingSave", () => {
      const nameEl = document.getElementById("ctMissingName"), notesEl = document.getElementById("ctMissingNotes"), target = document.getElementById("ctMissingResult");
      const name = (nameEl && nameEl.value || "").trim(), notes = (notesEl && notesEl.value || "").trim();
      if (!target) return;
      if (!name) { target.textContent = "اكتب اسم الصنف أولًا."; return; }
      const rows = readRequests(); rows.push({name,notes,createdAt:new Date().toISOString(),status:"pending"});
      if (!saveRequests(rows)) { target.textContent = "تعذر الحفظ على هذا الجهاز. يمكنك إرسال الطلب عبر واتساب."; return; }
      target.innerHTML = '<p>تم تسجيل الطلب محليًا على هذا الجهاز. لإرساله للمتجر اضغط هنا.</p><button type="button" class="btn btn-gold" id="ctMissingWhatsApp">إرسال الطلب إلى واتساب</button>';
      const wa = document.getElementById("ctMissingWhatsApp");
      if (wa) wa.addEventListener("click", () => window.open("https://wa.me/201272776928?text=" + encodeURIComponent("طلب صنف غير موجود — مملكة العطور\nالصنف: " + name + "\nالتفاصيل: " + (notes || "لا توجد") + "\nيرجى تأكيد التوفر والسعر."), "_blank", "noopener"));
      if (nameEl) nameEl.value = ""; if (notesEl) notesEl.value = "";
    });
    button("ctMissingExport", () => {
      const rows = readRequests(), target = document.getElementById("ctMissingResult");
      if (!rows.length) { if (target) target.textContent = "لا توجد طلبات مسجلة على هذا الجهاز حتى الآن."; return; }
      const blob = new Blob([JSON.stringify(rows,null,2)],{type:"application/json;charset=utf-8"}), url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = "mamlaka-missing-product-requests.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      if (target) target.textContent = "تم تجهيز ملف تصدير الطلبات المسجلة على هذا الجهاز.";
    });
    fetch("data/products.json").then(r => { if (!r.ok) throw new Error("catalog"); return r.json(); }).then(data => {
      products = Array.isArray(data.products) ? data.products.filter(p => p && (p.nameAr || p.nameEn)) : [];
      fillCompare();
    }).catch(() => {
      ["ctCompareA","ctCompareB"].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = '<option value="">تعذر تحميل الكتالوج</option>'; });
      const t = document.getElementById("ctRecommendations"); if (t) t.textContent = "تعذر تحميل الكتالوج حاليًا.";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true}); else mount();
})();