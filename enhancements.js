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
})();