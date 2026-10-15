(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const clean = value => String(value ?? "").trim();
  const normalizePhone = value => String(value || "201272776928").replace(/\D/g, "");
  function initGiftPlanner() {
    const section = $("#gift");
    const copy = section?.querySelector(".gift-copy");
    if (!copy || $("#royalGiftPlanner")) return;
    const panel = document.createElement("form");
    panel.id = "royalGiftPlanner";
    panel.className = "royal-gift-planner";
    panel.innerHTML = "\n<div class=\"royal-gift-heading\"><span aria-hidden=\"true\">♛</span><div><h3>صمّم هديتك الملكية</h3><p>جهّز طلبًا واضحًا لتأكيد الخيارات والسعر مع المتجر.</p></div></div>\n<div class=\"royal-gift-grid\">\n<label>لمن الهدية؟<select name=\"recipient\" required><option value=\"\">اختر</option><option>رجالي</option><option>نسائي</option><option>للجنسين</option><option>طفل / طفلة</option></select></label>\n<label>المناسبة<select name=\"occasion\" required><option value=\"\">اختر المناسبة</option><option>عيد ميلاد</option><option>ذكرى زواج</option><option>خطوبة أو زفاف</option><option>هدية شكر</option><option>عيد أو مناسبة دينية</option><option>هدية بدون مناسبة</option></select></label>\n<label>الميزانية التقريبية<select name=\"budget\" required><option value=\"\">اختر الميزانية</option><option>أقل من 150 جنيه</option><option>150–300 جنيه</option><option>300–600 جنيه</option><option>600–1000 جنيه</option><option>أكثر من 1000 جنيه</option><option>أريد معرفة الخيارات أولًا</option></select></label>\n<label>نوع الهدية<select name=\"kind\" required><option value=\"\">اختر النوع</option><option>عطر جاهز</option><option>زيت عطري أو تركيب</option><option>عود وبخور</option><option>مجموعة متنوعة</option><option>اترك الاختيار للمستشار</option></select></label>\n<label class=\"royal-gift-wide\">التغليف<select name=\"packaging\"><option>أريد معرفة التغليف المتاح</option><option>تغليف ملكي أسود وذهبي</option><option>علبة هدايا بسيطة</option><option>بدون تغليف إضافي</option></select></label>\n<label class=\"royal-gift-wide\">رسالة الإهداء (اختياري)<textarea name=\"message\" rows=\"2\" maxlength=\"220\" placeholder=\"اكتب رسالة قصيرة تُرفق مع الهدية\"></textarea></label>\n</div>\n<button class=\"btn btn-gold\" type=\"submit\">تجهيز طلب الهدية عبر واتساب</button>\n<small class=\"royal-gift-note\">الاختيارات مبدئية؛ التوفر والسعر النهائي والتغليف يؤكدها المتجر قبل الطلب.</small>\n<p class=\"royal-gift-status\" id=\"royalGiftStatus\" role=\"status\" aria-live=\"polite\"></p>";
    copy.append(panel);
    panel.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(panel);
      const fields = ["recipient", "occasion", "budget", "kind"];
      if (fields.some(key => !clean(data.get(key)))) {
        $("#royalGiftStatus", panel).textContent = "أكمل الاختيارات المطلوبة أولًا.";
        return;
      }
      const message = [
        "مرحبًا مملكة العطور، أريد تجهيز هدية عطرية.",
        "لمن الهدية: " + clean(data.get("recipient")),
        "المناسبة: " + clean(data.get("occasion")),
        "الميزانية: " + clean(data.get("budget")),
        "نوع الهدية: " + clean(data.get("kind")),
        "التغليف: " + clean(data.get("packaging")),
        clean(data.get("message")) ? "رسالة الإهداء: " + clean(data.get("message")) : "",
        "يرجى اقتراح المتاح وتأكيد السعر النهائي قبل اعتماد الطلب."
      ].filter(Boolean).join("\n");
      const phone = normalizePhone(localStorage.getItem("mamlaka_admin_whatsapp_v1"));
      if (!phone) {
        $("#royalGiftStatus", panel).textContent = "رقم واتساب غير مضبوط. راجع إعدادات المتجر.";
        return;
      }
      const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
      const win = window.open(url, "_blank", "noopener");
      if (!win) {
        $("#royalGiftStatus", panel).textContent = "تعذر فتح واتساب تلقائيًا. اسمح بفتح النافذة أو أعد المحاولة.";
      } else {
        $("#royalGiftStatus", panel).textContent = "تم تجهيز الرسالة. راجع التفاصيل والسعر مع المتجر قبل التأكيد.";
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGiftPlanner);
  else initGiftPlanner();
})();