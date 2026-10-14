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