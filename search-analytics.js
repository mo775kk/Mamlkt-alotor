(() => {
  "use strict";
  const KEY="mamlaka_search_history_v1";
  const WA_KEY="mamlaka_admin_whatsapp_v1";
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}};
  const write=rows=>{try{localStorage.setItem(KEY,JSON.stringify(rows.slice(-500)));return true}catch(e){console.warn("Search history unavailable",e);return false}};
  const wa=()=>String(localStorage.getItem(WA_KEY)||"201272776928").replace(/\D/g,"");
  const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let timer=0,lastSignature="";
  function recordSearch(){
    const input=document.getElementById("productSearch");if(!input)return;
    const query=input.value.trim();if(query.length<2)return;
    const message=document.getElementById("resultsMessage");
    const resultText=message?.textContent||"";
    const match=resultText.match(/(\d+)\s+منتج/);
    const count=match?Number(match[1]):null;
    const signature=query+"|"+(document.getElementById("genderFilter")?.value||"")+"|"+(document.getElementById("familyFilter")?.value||"")+"|"+String(count);
    if(signature===lastSignature)return;lastSignature=signature;
    const rows=read();rows.push({query,createdAt:new Date().toISOString(),resultCount:count,gender:document.getElementById("genderFilter")?.value||"",family:document.getElementById("familyFilter")?.value||"",page:location.hash||"#home"});
    if(!write(rows))return;
    renderAdminHistory();
  }
  function queueRecord(){clearTimeout(timer);timer=setTimeout(recordSearch,700)}
  function makeWhatsappButton(){
    const input=document.getElementById("productSearch"),results=document.getElementById("resultsMessage");
    if(!input||!results||document.getElementById("sendSearchWhatsapp"))return;
    const button=document.createElement("button");button.id="sendSearchWhatsapp";button.type="button";button.className="btn btn-outline";button.style.marginBlock="12px";button.textContent="إرسال عبارة البحث والنتائج إلى واتساب";
    results.insertAdjacentElement("afterend",button);
    button.addEventListener("click",()=>{
      const query=input.value.trim();if(!query){input.focus();return}
      const cards=Array.from(document.querySelectorAll("#readyProducts .product-card, #readyProducts [data-product-id], #readyProducts article")).slice(0,8);
      const names=cards.map(el=>(el.querySelector("h3,h4,.product-name,[data-product-name]")?.textContent||"").trim()).filter(Boolean).slice(0,8);
      const count=(document.getElementById("resultsMessage")?.textContent||"").trim();
      const message=["مرحبًا مملكة العطور، أبحث عن: "+query,count,names.length?"أسماء ظاهرة: "+names.join("، "):"", "أرجو تأكيد التوفر والسعر. "].filter(Boolean).join("\n");
      window.open("https://wa.me/"+wa()+"?text="+encodeURIComponent(message),"_blank","noopener");
    });
  }
  function renderAdminHistory(){
    const host=document.getElementById("searchHistoryPanel");if(!host)return;
    const rows=read().slice().reverse();
    const counts=new Map();rows.forEach(r=>counts.set(r.query,(counts.get(r.query)||0)+1));
    const popular=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10);
    host.innerHTML='<div class="admin-grid"><div class="admin-note"><strong>عمليات مسجلة على هذا الجهاز</strong><br>'+rows.length+'</div><div class="admin-note"><strong>عبارات مختلفة</strong><br>'+counts.size+'</div></div>'+
      '<h4>أكثر عبارات البحث تكرارًا</h4>'+(popular.length?'<ol>'+popular.map(([q,n])=>'<li>'+safe(q)+' — '+n+' مرة</li>').join("")+'</ol>':'<p class="admin-note">لم تُسجّل عمليات بحث بعد.</p>')+
      '<h4>أحدث عمليات البحث</h4>'+(rows.length?'<div class="search-history-list">'+rows.slice(0,50).map(r=>'<div class="admin-note"><strong>'+safe(r.query)+'</strong><br><small>'+safe(new Date(r.createdAt).toLocaleString("ar-EG"))+' · النتائج: '+safe(r.resultCount??"غير محدد")+'</small></div>').join("")+'</div>':'')+
      '<div class="admin-actions"><button type="button" class="btn btn-gold" id="exportSearchHistory">تصدير سجل البحث JSON</button><button type="button" class="btn btn-outline" id="clearSearchHistory">مسح السجل المحلي</button></div>'+
      '<p class="admin-note">هذا سجل محلي في المتصفح الحالي، ولا يحتوي على هوية الزائر أو رقم هاتفه. لا يظهر سجل أجهزة الزوار الأخرى هنا دون قاعدة بيانات مشتركة.</p>';
    document.getElementById("exportSearchHistory")?.addEventListener("click",()=>{
      const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),searches:read()},null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mamlaka-search-history.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    document.getElementById("clearSearchHistory")?.addEventListener("click",()=>{if(!confirm("مسح سجل البحث المحفوظ على هذا الجهاز؟"))return;write([]);renderAdminHistory()});
  }
  function addAdminPage(){
    const nav=document.querySelector("#adminLayer .admin-tabs"),content=document.getElementById("adminContent");
    if(!nav||!content)return;
    if(!nav.querySelector('[data-tab="searches"]')){
      const btn=document.createElement("button");btn.type="button";btn.dataset.tab="searches";btn.textContent="سجل البحث";nav.appendChild(btn);
      const page=document.createElement("section");page.className="admin-page hidden";page.dataset.page="searches";
      page.innerHTML='<h3>سجل عمليات البحث</h3><p class="admin-note">يسجل الموقع عبارة البحث ووقت تنفيذها وعدد النتائج المتاح، لمساعدتك في معرفة العطور المطلوبة وما يحتاج إلى مراجعة في الكتالوج.</p><div id="searchHistoryPanel"></div>';
      content.appendChild(page);
      btn.addEventListener("click",()=>{nav.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b===btn));content.querySelectorAll("[data-page]").forEach(p=>p.classList.toggle("hidden",p===page));renderAdminHistory()});
    }
  }
  function init(){
    const input=document.getElementById("productSearch");if(input){input.addEventListener("input",queueRecord);input.addEventListener("change",queueRecord)}
    ["genderFilter","familyFilter"].forEach(id=>document.getElementById(id)?.addEventListener("change",queueRecord));
    const message=document.getElementById("resultsMessage");if(message)new MutationObserver(()=>{makeWhatsappButton();queueRecord()}).observe(message,{childList:true,subtree:true,characterData:true});
    makeWhatsappButton();addAdminPage();renderAdminHistory();
    const watchLayer=()=>{const layer=document.getElementById("adminLayer");if(layer&&!layer.dataset.searchAnalyticsObserved){layer.dataset.searchAnalyticsObserved="1";new MutationObserver(()=>{addAdminPage();renderAdminHistory()}).observe(layer,{childList:true,subtree:true});addAdminPage();renderAdminHistory()}};
    watchLayer();
    new MutationObserver(watchLayer).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();