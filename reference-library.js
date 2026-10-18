(() => {
  "use strict";
  const KEY = "mamlaka_reference_sites_v1";
  const sites = [["طيف الإمارات — الموقع العربي الإماراتي","عربي وخليجي","https://ae.taifalemarat.com/ar"],["العربية للعود","عربي وخليجي","https://eg.arabianoud.com/ar"],["أفنان مصر","عربي وخليجي","https://egypt.afnan.com/ar"],["طيف الإمارات","عربي وخليجي","https://sa.taifalemarat.com/"],["الخليج للعطور — النسخة العربية","عربي وخليجي","https://www.alkhaleejscents.com/ar"],["الخليج للعطور","عربي وخليجي","https://www.alkhaleejscents.com/"],["Local Perfumes","عربي وخليجي","https://www.localperfumes.com/"],["Swiss Arabian","عربي وخليجي","https://uae.swissarabian.com/"],["Zimaya","عربي وخليجي","https://uae.zimayaperfumes.com/ar"],["Elmeira","عربي وخليجي","https://elmeira.ae/"],["Sasan Perfumes","عربي وخليجي","https://www.sasanperfumes.com/en"],["Afnan UAE","عربي وخليجي","https://uae.afnan.com/"],["Byredo","فخامة عالمية","https://www.byredo.com/"],["Diptyque","فخامة عالمية","https://www.diptyqueparis.com/"],["Le Labo","فخامة عالمية","https://www.lelabofragrances.com/"],["Maison Francis Kurkdjian","فخامة عالمية","https://www.franciskurkdjian.com/"],["Jo Malone London","فخامة عالمية","https://www.jomalone.com/"],["Creed","فخامة عالمية","https://www.creedfragrance.com/"],["Penhaligon’s","فخامة عالمية","https://www.penhaligons.com/"],["Guerlain","فخامة عالمية","https://www.guerlain.com/"],["Dior","فخامة عالمية","https://www.dior.com/"],["Chanel","فخامة عالمية","https://www.chanel.com/"],["Tom Ford Beauty","فخامة عالمية","https://www.tomfordbeauty.com/"],["YSL Beauty","فخامة عالمية","https://www.yslbeautyus.com/"],["Prada","فخامة عالمية","https://www.prada.com/"],["Armani Beauty","فخامة عالمية","https://www.giorgioarmanibeauty-usa.com/"],["Valentino Beauty","فخامة عالمية","https://www.valentino-beauty.com/"],["Burberry","فخامة عالمية","https://www.burberry.com/"],["Hermès","فخامة عالمية","https://www.hermes.com/"],["Lancôme USA","فخامة عالمية","https://www.lancome-usa.com/"],["Viktor&Rolf","فخامة عالمية","https://www.viktor-rolf.com/"],["Mugler","فخامة عالمية","https://www.mugler.com/"],["Lancôme","فخامة عالمية","https://www.lancome.com/"],["Acqua di Parma","فخامة عالمية","https://www.acquadiparma.com/"],["Molton Brown","فخامة عالمية","https://www.moltonbrown.com/"],["Lush","متاجر ومنصات","https://www.lush.com/"],["Bath & Body Works","متاجر ومنصات","https://www.bathandbodyworks.com/"],["Victoria’s Secret","متاجر ومنصات","https://www.victoriassecret.com/"],["The Body Shop","متاجر ومنصات","https://www.thebodyshop.com/"],["Rituals","متاجر ومنصات","https://www.rituals.com/"],["FragranceX","متاجر ومنصات","https://www.fragrancex.com/"],["FragranceNet","متاجر ومنصات","https://www.fragrancenet.com/"],["Notino","متاجر ومنصات","https://www.notino.com/"],["Sephora","متاجر ومنصات","https://www.sephora.com/"],["Ulta Beauty","متاجر ومنصات","https://www.ulta.com/"],["Harrods","متاجر ومنصات","https://www.harrods.com/"],["Selfridges","متاجر ومنصات","https://www.selfridges.com/"],["Liberty London","متاجر ومنصات","https://www.libertylondon.com/"],["D.S. & Durga","متاجر ومنصات","https://dsanddurga.com/"],["Ffern","متاجر ومنصات","https://ffern.co/"],["Abbott NYC","متاجر ومنصات","https://abbottnyc.com/"],["Zarla — أفكار تصميم العطور","مراجع تصميم","https://www.zarla.com/inspiration/perfume"]];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const readFav = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { return []; } };
  const saveFav = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {} };
  function mount() {
    if (document.getElementById("referenceLibrary")) return;
    const style = document.createElement("style");
    style.textContent = `
      #referenceLibrary{padding:clamp(22px,4vw,48px) clamp(14px,3vw,32px);margin:26px auto;max-width:1240px;background:linear-gradient(135deg,#fffdf7,#f8f0e7);border:1px solid #d7bd83;border-radius:22px;color:#29251f}
      #referenceLibrary *{box-sizing:border-box} #referenceLibrary .ref-head{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
      #referenceLibrary h2{font-size:clamp(24px,4vw,36px);margin:0;color:#73521b} #referenceLibrary p{line-height:1.8;margin:8px 0 18px}
      #referenceLibrary .ref-tools{display:grid;grid-template-columns:minmax(0,1fr) minmax(145px,220px) auto;gap:10px;margin:18px 0}
      #referenceLibrary input,#referenceLibrary select{width:100%;min-width:0;padding:13px 14px;border:1px solid #c8b78f;border-radius:12px;background:#fff;color:#26221c;font:inherit;font-size:16px}
      #referenceLibrary .ref-btn{border:1px solid #98752c;background:#fff8e8;color:#66480e;border-radius:12px;padding:12px 15px;font:inherit;font-weight:700;cursor:pointer}
      #referenceLibrary .ref-count{font-size:14px;color:#675d4b;margin:8px 0 14px}
      #referenceLibrary .ref-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      #referenceLibrary .ref-card{min-width:0;padding:16px;border:1px solid #e0d3b6;background:#fff;border-radius:15px;display:flex;flex-direction:column;gap:9px;box-shadow:0 3px 12px #4935120b}
      #referenceLibrary .ref-card h3{font-size:18px;line-height:1.5;margin:0;color:#29251f;overflow-wrap:anywhere}
      #referenceLibrary .ref-tag{font-size:13px;color:#7d632c} #referenceLibrary .ref-actions{display:flex;gap:8px;align-items:center;margin-top:auto;flex-wrap:wrap}
      #referenceLibrary .ref-open{color:#fff;background:#78591e;border-radius:10px;padding:9px 12px;text-decoration:none;font-weight:700}
      #referenceLibrary .ref-star{padding:8px 11px;border:1px solid #d8c69e;background:#fffaf0;border-radius:10px;color:#684d17;font:inherit;cursor:pointer}
      #referenceLibrary .ref-url{font-size:12px;color:#766f62;overflow-wrap:anywhere;direction:ltr;text-align:left}
      @media(max-width:800px){#referenceLibrary .ref-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#referenceLibrary .ref-tools{grid-template-columns:1fr 1fr}#referenceLibrary .ref-tools input{grid-column:1/-1}}
      @media(max-width:480px){#referenceLibrary{border-radius:15px}#referenceLibrary .ref-grid{grid-template-columns:1fr}#referenceLibrary .ref-tools{grid-template-columns:1fr}#referenceLibrary .ref-tools input{grid-column:auto}}
    `;
    document.head.appendChild(style);
    const section = document.createElement("section");
    section.id = "referenceLibrary"; section.className = "reference-library-section";
    section.innerHTML = `
      <div class="ref-head"><div><h2>مكتبة المواقع المرجعية</h2><p>احفظ مواقع الإلهام، وابحث بالاسم أو نوع التصميم، وافتح أي موقع في تبويب جديد. المفضلة محفوظة على هذا الجهاز.</p></div>
      <button class="ref-btn" id="refOnlyFav" type="button" aria-pressed="false">★ المفضلة فقط</button></div>
      <div class="ref-tools"><input id="refSearch" type="search" placeholder="ابحث عن موقع أو علامة عطرية..." aria-label="البحث في المواقع المرجعية"><select id="refCategory" aria-label="تصنيف المواقع"><option value="">كل التصنيفات</option><option>عربي وخليجي</option><option>فخامة عالمية</option><option>متاجر ومنصات</option><option>مراجع تصميم</option></select><button class="ref-btn" id="refClear" type="button">مسح البحث</button></div>
      <div id="refCount" class="ref-count" aria-live="polite"></div><div id="refGrid" class="ref-grid"></div>`;
    const footer = document.querySelector(".site-footer");
    (footer?.parentNode || document.querySelector("main") || document.body).insertBefore(section, footer || null);
    // The reference library is mounted only inside the owner settings panel.
    const search = section.querySelector("#refSearch"), category = section.querySelector("#refCategory"), grid = section.querySelector("#refGrid"), count = section.querySelector("#refCount"), favOnly = section.querySelector("#refOnlyFav");
    let onlyFav = false;
    function render() {
      const q = search.value.trim().toLocaleLowerCase();
      const favs = readFav();
      const list = sites.map((s,i)=>({s,i})).filter(({s,i}) => (!onlyFav || favs.includes(i)) && (!category.value || s[1]===category.value) && (!q || (s[0]+" "+s[1]+" "+s[2]).toLocaleLowerCase().includes(q)));
      count.textContent = "عرض " + list.length + " من " + sites.length + " موقعًا";
      grid.innerHTML = list.map(({s,i}) => '<article class="ref-card"><span class="ref-tag">'+esc(s[1])+' · '+String(i+1).padStart(2,"0")+'</span><h3>'+esc(s[0])+'</h3><div class="ref-url">'+esc(s[2])+'</div><div class="ref-actions"><a class="ref-open" href="'+esc(s[2])+'" target="_blank" rel="noopener noreferrer">فتح الموقع ↗</a><button type="button" class="ref-star" data-fav="'+i+'" aria-pressed="'+favs.includes(i)+'">'+(favs.includes(i)?"★ محفوظ بالمفضلة":"☆ أضف للمفضلة")+'</button></div></article>').join("") || '<p>لا توجد نتائج مطابقة. جرّب كلمة بحث أخرى.</p>';
    }
    search.addEventListener("input",render); category.addEventListener("change",render);
    favOnly.addEventListener("click",()=>{onlyFav=!onlyFav;favOnly.setAttribute("aria-pressed",String(onlyFav));favOnly.textContent=onlyFav?"عرض كل المواقع":"★ المفضلة فقط";render();});
    section.querySelector("#refClear").addEventListener("click",()=>{search.value="";category.value="";onlyFav=false;favOnly.setAttribute("aria-pressed","false");favOnly.textContent="★ المفضلة فقط";render();search.focus();});
    grid.addEventListener("click",e=>{const b=e.target.closest("[data-fav]");if(!b)return;const i=Number(b.dataset.fav),favs=readFav();saveFav(favs.includes(i)?favs.filter(n=>n!==i):[...favs,i]);render();});
    render();
  }
  window.MamlakaReferenceLibrary = {
    mountInto(target) {
      if (!target) return;
      let section = document.getElementById("referenceLibrary");
      if (!section) { mount(); section = document.getElementById("referenceLibrary"); }
      if (section) target.appendChild(section);
    }
  };
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",mount); else mount();
})();