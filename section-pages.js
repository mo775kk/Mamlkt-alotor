/* MAMLKAT AL-OTOR — standalone section pages
   Keeps the existing single-file content and app behavior; changes navigation presentation only. */
(() => {
  "use strict";
  if (window.__mamlakaSectionPagesV1) return;
  window.__mamlakaSectionPagesV1 = true;

  const main = document.querySelector("main");
  const header = document.querySelector(".site-header");
  if (!main || !header) return;

  const sectionIds = new Set([
    "home","homeIndex","ready","oils","oil-catalog","scent-classification",
    "blend","bakhoor","gift","advisor","visit","quiz","homeCatalog"
  ]);
  const originalHidden = new Map();
  let activeId = "";

  const titleFor = (section) => {
    const h = section?.querySelector("h1,h2,h3");
    return (h?.textContent || section?.getAttribute("aria-label") || "تفاصيل المملكة").trim();
  };

  function ensureNavigation() {
    if (!document.getElementById("sectionPageToolbar")) {
      const bar = document.createElement("section");
      bar.id = "sectionPageToolbar";
      bar.className = "section-page-toolbar";
      bar.setAttribute("aria-label", "التنقل داخل الموقع");
      bar.innerHTML = '<button type="button" class="section-page-back" id="sectionPageBack"><span aria-hidden="true">→</span> الرئيسية</button><div class="section-page-heading"><small>مملكة العطور · MAMLKAT AL-OTOR</small><h1 id="sectionPageTitle">تفاصيل القسم</h1><p id="sectionPageSubtitle">تصفح القسم بشكل مستقل</p></div><span class="section-page-mark" aria-hidden="true">♛</span>';
      main.insertBefore(bar, main.firstChild);
      bar.querySelector("#sectionPageBack").addEventListener("click", () => navigate("home"));
    }
    if (!document.getElementById("sectionPageEnd")) {
      const end = document.createElement("div");
      end.id = "sectionPageEnd";
      end.className = "section-page-end";
      end.innerHTML = '<span class="section-end-line" aria-hidden="true"></span><p>وصلت إلى نهاية هذا القسم</p><button type="button" id="sectionPageEndBack">العودة إلى الصفحة الرئيسية ↑</button>';
      const footer = document.querySelector(".site-footer");
      if (footer) footer.parentNode.insertBefore(end, footer);
      else document.body.append(end);
      end.querySelector("button").addEventListener("click", () => navigate("home"));
    }
  }

  function allPageSections() {
    return [...main.children].filter(el => el.id !== "sectionPageToolbar" && el.id !== "sectionPageEnd");
  }

  function navigate(id, replace = false) {
    if (!sectionIds.has(id)) return;
    const section = document.getElementById(id);
    if (!section || !main.contains(section)) return;
    const host = section.closest("section") || section;
    if (!host || !main.contains(host)) return;
    ensureNavigation();
    const bar = document.getElementById("sectionPageToolbar");
    const end = document.getElementById("sectionPageEnd");
    activeId = id;
    document.body.classList.toggle("section-page-mode", id !== "home");
    const isHome = id === "home";
    allPageSections().forEach(el => {
      if (!originalHidden.has(el)) originalHidden.set(el, el.hidden);
      el.hidden = isHome ? originalHidden.get(el) : el !== host;
    });
    bar.hidden = isHome;
    end.hidden = isHome;
    if (!isHome) {
      document.getElementById("sectionPageTitle").textContent = titleFor(host);
      document.getElementById("sectionPageSubtitle").textContent = "عرض مستقل للقسم · يمكنك استخدام السلة من الشريط العلوي";
      if (host.parentNode === main) main.insertBefore(bar, host);
      if (end.parentNode !== document.body) document.body.appendChild(end);
      const footer = document.querySelector(".site-footer");
      if (footer && end.nextElementSibling !== footer) footer.parentNode.insertBefore(end, footer);
    }
    const url = new URL(window.location.href);
    url.hash = id === "home" ? "home" : id;
    if (replace) history.replaceState({sectionPage:id}, "", url);
    else if (window.location.hash !== "#" + id) history.pushState({sectionPage:id}, "", url);
    const nav = document.getElementById("mainNav");
    nav?.classList.remove("open");
    document.getElementById("menuToggle")?.setAttribute("aria-expanded", "false");
    window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
    const progress = document.getElementById("scrollProgress");
    if (progress) progress.style.transform = "scaleX(0)";
  }

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!sectionIds.has(id)) return;
    const target = document.getElementById(id);
    if (!target || !main.contains(target)) return;
    event.preventDefault();
    navigate(id);
  });

  window.addEventListener("popstate", () => {
    const id = decodeURIComponent(location.hash.slice(1) || "home");
    navigate(sectionIds.has(id) ? id : "home", true);
  });
  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1) || "home");
    if (sectionIds.has(id) && id !== activeId) navigate(id, true);
  });

  ensureNavigation();
  const initial = decodeURIComponent(location.hash.slice(1) || "home");
  navigate(sectionIds.has(initial) ? initial : "home", true);
})();
