(() => {
  "use strict";
  // Royal finishing pass: legibility, navigation cleanup, accessible controls.
  const style = document.createElement("style");
  style.id = "mamlakat-royal-finish";
  style.textContent = `
    :root { scroll-behavior: smooth; }
    body { line-height: 1.75; }
    button, input, select, textarea { font: inherit; }
    button, a, input, select { -webkit-tap-highlight-color: transparent; }
    :focus-visible { outline: 2px solid #f1d77a !important; outline-offset: 3px; }
    .section p, .product-card, .product-card p, .muted, small { line-height: 1.8; }
    .section-heading h2, .hero h1 { text-wrap: balance; }
    img { max-width: 100%; }
    @media (max-width: 640px) {
      body { font-size: 16px; }
      .section { padding-inline: 16px; }
      button, .btn, input, select { min-height: 44px; }
      .product-grid { gap: 12px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
  document.head.appendChild(style);

  // Remove repeated category links by normalized visible label while preserving first occurrence.
  function cleanDuplicateNavigation() {
    const nav = document.querySelector("nav, .main-nav, .nav-links");
    if (!nav) return;
    const seen = new Set();
    [...nav.querySelectorAll("a")].forEach(a => {
      const label = (a.textContent || "").replace(/[♛⌂★♡☆]/g, "").replace(/\s+/g, " ").trim().toLocaleLowerCase("ar");
      if (!label) return;
      const href = (a.getAttribute("href") || "").trim();
      const key = href.startsWith("#") ? href : label;
      if (seen.has(key)) a.remove(); else seen.add(key);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cleanDuplicateNavigation, {once:true});
  else cleanDuplicateNavigation();

  // Explain the minimum reference price without implying every fragrance costs the same.
  document.querySelectorAll("[data-price-note]").forEach(el => {
    el.textContent = "السعر المرجعي يبدأ من 50 ج.م لكل 3 مل، وقد يختلف حسب نوع العطر وتركيزه وتكلفته.";
  });
  console.info("Mamlakat Al-Otor royal finishing pass loaded.");
})();