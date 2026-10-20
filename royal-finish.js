(() => {
  "use strict";
  // Royal finishing pass: legibility, safe navigation handling, accessible controls.
  if (document.getElementById("mamlakat-royal-finish")) return;
  // Visual styling lives only in site-unified.css; avoid runtime style layers.

  // Only flag exact duplicate navigation links; never remove links automatically.
  function checkNavigation() {
    const nav = document.querySelector("nav, .main-nav, .nav-links");
    if (!nav) return;
    const links = [...nav.querySelectorAll("a")];
    const seen = new Set();
    links.forEach(a => {
      const label = (a.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("ar");
      const href = (a.getAttribute("href") || "").trim();
      const key = href + "|" + label;
      if (seen.has(key)) a.dataset.possibleDuplicate = "true";
      else seen.add(key);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", checkNavigation, {once:true});
  else checkNavigation();

  document.querySelectorAll("[data-price-note]").forEach(el => {
    el.textContent = "السعر المرجعي يبدأ من 50 ج.م لكل 3 مل، وقد يختلف حسب نوع العطر وتركيزه وتكلفته.";
  });

  // Give the browser and assistive technology a consistent language direction.
  if (document.documentElement.lang === "ar" && !document.documentElement.dir) {
    document.documentElement.dir = "rtl";
  }
  // Accessible back-to-top control for long mobile storefront pages.
  function installBackToTop() {
    if (document.getElementById("mamlakaBackToTop")) return;
    const button = document.createElement("button");
    button.id = "mamlakaBackToTop";
    button.type = "button";
    button.className = "mamlaka-back-to-top";
    button.setAttribute("aria-label", "العودة إلى أعلى الصفحة");
    button.setAttribute("title", "العودة إلى الأعلى");
    button.innerHTML = '<span aria-hidden="true">↑</span><span class="mamlaka-back-to-top-label">للأعلى</span>';
    button.hidden = true;
    button.addEventListener("click", () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({top: 0, behavior: reduced ? "auto" : "smooth"});
    });
    document.body.appendChild(button);
    let ticking = false;
    const sync = () => { button.hidden = window.scrollY < 520; ticking = false; };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(sync); }
    }, {passive:true});
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installBackToTop, {once:true});
  else installBackToTop();

  console.info("Mamlakat Al-Otor royal finishing pass loaded.");
})();