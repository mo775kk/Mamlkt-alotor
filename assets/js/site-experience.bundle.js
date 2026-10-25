
/* ===== MODULE 1: site-upgrades.js ===== */
;
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const FILES_KEY = "mamlaka_file_library_v1";
  const BACKGROUNDS_KEY = "mamlaka_section_backgrounds_v1";
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const read = (key, fallback) => { try { const x=JSON.parse(localStorage.getItem(key)); return x ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  function recordLatestJson(name, action, details = {}) {
    const meta = { name, action, at: new Date().toISOString(), ...details };
    try { localStorage.setItem("mamlaka_recent_json_file_v1", JSON.stringify(meta)); } catch {}
    document.dispatchEvent(new CustomEvent("mamlaka:json-file-updated", { detail: meta }));
  }
  const toast = message => {
    const el=$("#toast");
    if(el){el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),3200);}
    else alert(message);
  };
  const fileBytes = file => file.size < 1024 ? file.size+" B" : file.size < 1024*1024 ? (file.size/1024).toFixed(1)+" KB" : (file.size/1024/1024).toFixed(2)+" MB";
  const download = (name, data, type="application/json;charset=utf-8") => {
    const blob = data instanceof Blob ? data : new Blob([data],{type});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  };
  const catalogKeys = ["mamlaka_custom_products_v1","mamlaka_supplier_oils_v1","mamlaka_catalog_taxonomy_config_v1","mamlaka_theme_v1","mamlaka_admin_whatsapp_v1","mamlaka_store_name_v1","mamlaka_cart_v1","mamlaka_favorites_v1","mamlaka_requests_v1","mamlaka_inventory_accounting_v1"];
  function summarize(data){
    if(Array.isArray(data)) return {count:data.length,kind:"قائمة سجلات"};
    if(data && typeof data==="object"){
      for(const key of ["products","items","records","oils","categories","orders","customers"]){
        if(Array.isArray(data[key])) return {count:data[key].length,kind:"سجلات: "+key};
      }
      return {count:Object.keys(data).length,kind:"حقول / إعدادات"};
    }
    return {count:0,kind:typeof data};
  }
  function library(){return read(FILES_KEY,[]).filter(x=>x && x.id && x.name);}
  function saveLibrary(items){write(FILES_KEY,items);}
  function ensureFileManager(){
    const page=$('[data-page="data"]');
    if(!page || $("#royalFileManager")) return;
    const section=document.createElement("section");
    section.id="royalFileManager";
    section.className="royal-manager";
    section.innerHTML=`
      <hr><h3>مركز الملفات والبيانات</h3>
      <p class="admin-note">عاين ملف JSON قبل استيراده، واحتفظ بسجل الملفات. حذف سجل الملف من المكتبة لا يحذف المنتجات التي سبق استيرادها.</p>
      <div class="royal-file-toolbar">
        <label class="btn btn-outline file-label">اختيار ملف JSON<input id="royalJsonFile" type="file" accept=".json,application/json"></label>
        <button type="button" class="btn btn-gold" id="royalExportAll">معاينة وتصدير نسخة كاملة</button>
        <button type="button" class="btn btn-outline" id="royalExportProducts">تصدير المنتجات فقط</button>
        <button type="button" class="btn btn-outline" id="royalCatalogAudit">فحص جودة كتالوج الموقع</button>
      </div>
      <div id="royalFilePreview" class="royal-file-preview hidden"></div>
      <div id="royalCatalogAuditResult" class="royal-file-preview hidden" aria-live="polite"></div>
      <h4>مكتبة الملفات المستوردة والمصدّرة</h4>
      <div id="royalLatestFile" class="royal-latest-file" aria-live="polite"></div>
      <div class="royal-file-search"><input id="royalFileSearch" type="search" placeholder="ابحث باسم الملف أو نوع البيانات..."></div>
      <div id="royalFileList" class="royal-file-list"></div>
      <hr><h3>مكتبة الصور الملكية والخلفيات</h3>
      <p class="admin-note">يمكن تغيير خلفية قسم مستقل. الصور التي تُحفظ بصيغة محلية تُخزّن في هذا المتصفح فقط؛ احتفظ بنسخة JSON/الصور خارج المتصفح عند الحاجة.</p>
      <div class="royal-bg-controls">
        <label>القسم المراد تعديل خلفيته<select id="royalBgTarget">
          <option value="body">خلفية الموقع العامة</option><option value="#home">الواجهة الرئيسية</option><option value=".site-header">رأس الموقع</option><option value=".quick-start-section">ابدأ رحلتك العطرية</option><option value=".category-section">أبواب المملكة</option><option value="#ready">العطور الجاهزة</option><option value="#oils">قسم الزيوت والتركيب</option><option value="#oil-catalog">كتالوج الزيوت</option><option value="#scent-classification">العائلات العطرية</option><option value="#blend">مختبر التركيب</option><option value="#bakhoor">العود والبخور</option><option value="#gift">الهدايا</option><option value="#advisor">مستشار العطور</option><option value="#visit">التواصل</option><option value=".site-footer">تذييل الموقع</option><option value=".admin-panel">لوحة الإدارة</option><option value="__custom__">عنصر آخر بالموقع (محدد CSS)</option>
        </select></label>
        <label class="royal-custom-target hidden" id="royalCustomTargetWrap">محدد العنصر CSS<input id="royalCustomTarget" type="text" placeholder=".product-card أو #element-id"><small>اكتب محدد عنصر موجودًا في الصفحة، مثل #ready أو .product-card.</small></label><label>لون الخلفية<input id="royalBgColor" type="color" value="#0a0a0a"></label>
        <label class="file-label btn btn-outline">رفع صورة خلفية<input id="royalBgImage" type="file" accept="image/png,image/jpeg,image/webp"></label>
        <label>درجة التعتيم <input id="royalBgOverlay" type="range" min="0" max="90" value="55"></label>
        <div id="royalBgPreview" class="royal-bg-preview">معاينة الخلفية</div>
        <div class="royal-file-toolbar"><button class="btn btn-gold" id="royalBgSave" type="button">حفظ خلفية هذا القسم</button><button class="btn btn-outline" id="royalBgReset" type="button">إرجاع الخلفية الافتراضية</button></div>
        <p class="admin-note">ملاحظة: الخلفيات والصور المحفوظة عبر localStorage لا تتزامن بين الأجهزة، وقد تتجاوز سعة التخزين إذا كانت الصور كبيرة. لعرضها لكل الزوار، أضف الصور إلى مستودع الموقع أو استخدم خدمة تخزين عامة مناسبة.</p>
      </div>`;
    page.append(section);
    bindFileManager();
    renderFileList();
    bindBackgroundManager();
  }
  function bindFileManager(){
    $("#royalJsonFile")?.addEventListener("change", async e=>{
      const file=e.target.files?.[0]; if(!file)return;
      if(file.size>10*1024*1024){toast("حجم الملف أكبر من 10 ميجابايت. قسّم الملف أو استخدم أداة استيراد مناسبة.");e.target.value="";return;}
      try{
        const raw=await file.text(), data=JSON.parse(raw), sum=summarize(data);
        const id="file-"+Date.now()+"-"+Math.random().toString(36).slice(2,7);
        $("#royalFilePreview").classList.remove("hidden");
        $("#royalFilePreview").innerHTML=`<div class="royal-file-head"><div><strong>${esc(file.name)}</strong><small>${esc(fileBytes(file))} · ${esc(sum.kind)} · ${sum.count} سجل</small></div><button type="button" class="small-btn" id="royalClosePreview">إغلاق المعاينة</button></div><div class="royal-json-tools"><button type="button" class="small-btn primary" id="royalImportMerge">استيراد ودمج</button><button type="button" class="small-btn danger" id="royalImportReplace">استبدال البيانات المحددة</button><button type="button" class="small-btn" id="royalDownloadOriginal">تنزيل الملف</button></div><pre class="royal-json-preview" dir="ltr"></pre><p class="admin-note">الدمج يحافظ على السجلات الحالية ويحدّث المطابق. الاستبدال يمسح مجموعة المنتجات المحلية المحددة فقط، وينزّل نسخة احتياطية قبل التنفيذ. النسخة الاحتياطية تُحفظ على جهازك ولا تُرفع إلى GitHub.</p>`;
        $(".royal-json-preview").textContent=JSON.stringify(data,null,2).slice(0,60000)+(JSON.stringify(data,null,2).length>60000?"\n… تم اختصار المعاينة للملفات الكبيرة":"");
        $("#royalClosePreview").onclick=()=>$("#royalFilePreview").classList.add("hidden");
        $("#royalDownloadOriginal").onclick=()=>download(file.name,raw);
        const runImport=mode=>{try{importData(data,file.name,raw,id,mode);e.target.value="";}catch(err){toast("تعذر الاستيراد: "+err.message)}};
         $("#royalImportMerge").onclick=()=>runImport("merge");
         $("#royalImportReplace").onclick=()=>{if(confirm("تنبيه: الاستبدال قد يحذف منتجات محلية حالية من المجموعة المستهدفة. سيتم تنزيل نسخة احتياطية أولًا. هل تريد المتابعة؟"))runImport("replace")};
        const items=library();items.unshift({id,name:file.name,size:file.size,importedAt:new Date().toISOString(),kind:sum.kind,count:sum.count,status:"جاهز للمعاينة",content:raw});
        saveLibrary(items.slice(0,100));renderFileList();
      }catch(err){$("#royalFilePreview").classList.remove("hidden");$("#royalFilePreview").innerHTML=`<strong>ملف JSON غير صالح</strong><p>${esc(err.message)}</p><p class="admin-note">لم يتم تغيير أي بيانات.</p>`;toast("الملف غير صالح ولم يتم استيراده.");}
    });
    $("#royalExportAll")?.addEventListener("click",()=>{
      const data={schemaVersion:2,exportedAt:new Date().toISOString(),store:"MAMLKAT AL-OTOR",storageType:"browser-local-export",localStorage:{}};
      catalogKeys.forEach(k=>{const v=localStorage.getItem(k);if(v!==null){try{data.localStorage[k]=JSON.parse(v)}catch{data.localStorage[k]=v}}});
      data.products=read("mamlaka_custom_products_v1",[]);
      data.theme=read("mamlaka_theme_v1",{});
      showExportPreview("mamlaka-full-backup.json",data);
    });
    $("#royalExportProducts")?.addEventListener("click",()=>showExportPreview("mamlaka-products.json",{schemaVersion:1,exportedAt:new Date().toISOString(),products:read("mamlaka_custom_products_v1",[])}));
    $("#royalCatalogAudit")?.addEventListener("click", async () => {
      const output = $("#royalCatalogAuditResult");
      output.classList.remove("hidden");
      output.textContent = "جارٍ فحص كتالوج الموقع…";
      try {
        const response = await fetch("data/products.json", { cache: "no-cache" });
        if (!response.ok) throw new Error("تعذر قراءة ملف الكتالوج: HTTP " + response.status);
        const payload = await response.json();
        const products = Array.isArray(payload) ? payload : payload?.products;
        if (!Array.isArray(products)) throw new Error("صيغة الملف لا تحتوي مصفوفة products.");
        const normalize = value => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
        const idCounts = new Map(), nameCounts = new Map();
        products.forEach(p => {
          const id = normalize(p.id); if (id) idCounts.set(id, (idCounts.get(id) || 0) + 1);
          const name = normalize(p.nameEn || p.name_en || p.nameAr || p.name_ar);
          if (name) nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
        });
        const duplicateIds = products.filter(p => normalize(p.id) && idCounts.get(normalize(p.id)) > 1).map(p => ({ id: p.id, name: p.nameEn || p.nameAr || "" }));
        const duplicateNames = products.filter(p => {
          const name = normalize(p.nameEn || p.name_en || p.nameAr || p.name_ar);
          return name && nameCounts.get(name) > 1;
        }).map(p => ({ id: p.id || "", name: p.nameEn || p.name_en || p.nameAr || p.name_ar || "" }));
        const missingName = products.filter(p => !(p.nameAr || p.name_ar || p.nameEn || p.name_en)).map(p => p.id || "(بدون معرّف)");
        const missingSource = products.filter(p => !(p.sourceUrl || p.source_url)).map(p => p.id || p.nameEn || p.nameAr || "(منتج بلا اسم)");
        const missingPyramid = products.filter(p => !Array.isArray(p.topNotes || p.notes_top) || !(p.topNotes || p.notes_top).length || !Array.isArray(p.heartNotes || p.notes_heart) || !(p.heartNotes || p.notes_heart).length || !Array.isArray(p.baseNotes || p.notes_base) || !(p.baseNotes || p.notes_base).length).map(p => p.id || p.nameEn || p.nameAr || "(منتج بلا اسم)");
        const hasPrice = p => {
          const direct = Number(p.price);
          if (p.price != null && Number.isFinite(direct) && direct > 0) return true;
          const prices = p.prices && typeof p.prices === "object" ? Object.values(p.prices) : [];
          return prices.some(value => value != null && Number.isFinite(Number(value)) && Number(value) > 0);
        };
        const missingPrice = products.filter(p => !hasPrice(p)).map(p => p.id || p.nameEn || p.nameAr || "(منتج بلا اسم)");
        const missingImage = products.filter(p => !(p.image || p.imageUrl || p.image_url)).map(p => p.id || p.nameEn || p.nameAr || "(منتج بلا اسم)");
        const notAvailable = products.filter(p => p.available !== true || p.needsReview !== false).map(p => p.id || p.nameEn || p.nameAr || "(منتج بلا اسم)");
        const needsReview = products.filter(p => p.needsReview === true || p.notesStatus === "needs-review" || p.notesStatus === "needsReview").length;
        const hasPyramid = p => [p.topNotes || p.notes_top, p.heartNotes || p.notes_heart, p.baseNotes || p.notes_base].every(notes => Array.isArray(notes) && notes.length > 0);
        const oils = products.filter(p => p.productType === "oil");
        const ready = products.filter(p => p.productType === "ready");
        const completeOils = oils.filter(hasPyramid);
        const completeReady = ready.filter(hasPyramid);
        const referenceNotes = products.filter(p => p.notesStatus === "reference-fragrance-notes" && hasPyramid(p));
        const verifiedNotes = products.filter(p => p.verified === true && !p.needsReview && hasPyramid(p));
        const noteCoverage = {
          oils: { total: oils.length, withPyramid: completeOils.length, withoutPyramid: oils.length - completeOils.length },
          ready: { total: ready.length, withPyramid: completeReady.length, withoutPyramid: ready.length - completeReady.length },
          referenceOnly: referenceNotes.length,
          verifiedPyramids: verifiedNotes.length
        };
        const report = { schemaVersion: 3, generatedAt: new Date().toISOString(), source: "data/products.json",
          summary: { total: products.length, duplicateIds: duplicateIds.length, duplicateNames: duplicateNames.length, missingName: missingName.length, missingSource: missingSource.length, missingNotePyramid: missingPyramid.length, missingPrice: missingPrice.length, missingImage: missingImage.length, notAvailable: notAvailable.length, needsReview, noteCoverage },
          duplicateIds, duplicateNames, missingName, missingSource, missingNotePyramid: missingPyramid, missingPrice, missingImage, notAvailable };
        output.innerHTML = "<strong>نتيجة فحص الكتالوج</strong><p>إجمالي المنتجات: " + report.summary.total + " · معرّفات مكررة: " + duplicateIds.length + " · أسماء محتملة التكرار: " + duplicateNames.length + " · بلا مصدر: " + missingSource.length + " · هرم عطري ناقص: " + missingPyramid.length + "</p><p>بلا سعر: " + missingPrice.length + " · بلا صورة: " + missingImage.length + " · غير معتمد للبيع: " + notAvailable.length + " · تحتاج مراجعة: " + needsReview + "</p><h4>تغطية النوتات العطرية</h4><p>الزيوت: " + completeOils.length + " من " + oils.length + " لها هرم عطري كامل؛ ينقص " + (oils.length-completeOils.length) + ". العطور الجاهزة: " + completeReady.length + " من " + ready.length + "؛ ينقص " + (ready.length-completeReady.length) + ".</p><p>نوتات مرجعية تحتاج مراجعة مطابقة الزيت: " + referenceNotes.length + " · نوتات موثقة ومعتمدة: " + verifiedNotes.length + ".</p><button type=\"button\" class=\"btn btn-outline\" id=\"royalDownloadCatalogAudit\">تنزيل تقرير الفحص JSON</button><p class=\"admin-note\">النوتات المرجعية تصف العطر الأصلي المحتمل وليست إثباتًا لتركيبة زيت المورد. غياب السعر أو الصورة تنبيه لإكمال البيانات، وليس إذنًا بتخمينها. لم يتم تعديل أي بيانات.</p>";
        $("#royalDownloadCatalogAudit")?.addEventListener("click", () => download("mamlakat-catalog-audit.json", report));
      } catch (error) { output.textContent = "تعذر فحص الكتالوج: " + error.message + " — لم يتم تعديل البيانات."; }
    });
    $("#royalFileSearch")?.addEventListener("input",renderFileList);
  }
  function importData(data,name,raw,id,mode="merge"){
    if(data && Array.isArray(data.items) && Array.isArray(data.sales) && Array.isArray(data.expenses) && String(data.store||"").toUpperCase()==="MAMLKAT AL-OTOR"){
      if(mode==="replace") saveLocalBackup("قبل استبدال دفتر المخزون والحسابات");
      const current=read("mamlaka_inventory_accounting_v1",{items:[],sales:[],expenses:[],movements:[]});
      if(!confirm("تم التعرف على تقرير المخزون والحسابات. "+(mode==="replace"?"سيتم استبدال دفتر الحسابات بعد تنزيل نسخة احتياطية.":"سيتم دمج الأصناف والعمليات دون تكرار المعرفات.")+" هل تريد المتابعة؟"))return;
      let ledger;
      if(mode==="replace") ledger={items:data.items,sales:data.sales,expenses:data.expenses,movements:Array.isArray(data.movements)?data.movements:[]};
      else {
        const mergeById=(a,b)=>{const map=new Map((Array.isArray(a)?a:[]).map((x,i)=>[String(x.id||x.itemId||x.name||("old-"+i)),x]));(Array.isArray(b)?b:[]).forEach((x,i)=>{const key=String(x.id||x.itemId||x.name||("new-"+i));if(!map.has(key))map.set(key,x)});return [...map.values()]};
        ledger={items:mergeById(current.items,data.items),sales:mergeById(current.sales,data.sales),expenses:mergeById(current.expenses,data.expenses),movements:mergeById(current.movements,data.movements)};
      }
      write("mamlaka_inventory_accounting_v1",ledger);updateFileStatus(id,mode==="replace"?"تم استبدال دفتر الحسابات":"تم دمج دفتر الحسابات");recordLatestJson(name,"import",{kind:"دفتر المخزون والحسابات",records:(data.items||[]).length+(data.sales||[]).length+(data.expenses||[]).length});toast("تم استيراد دفتر المخزون والحسابات. راجع الأرصدة والتقارير.");return;
    }
    let records=Array.isArray(data)?data:Array.isArray(data.products)?data.products:Array.isArray(data.oils)?data.oils:Array.isArray(data.items)?data.items:Array.isArray(data.records)?data.records:null;
    if(data && data.localStorage && typeof data.localStorage==="object"){
      const keys=Object.keys(data.localStorage).filter(k=>catalogKeys.includes(k));
      if(!keys.length){toast("لم توجد مفاتيح بيانات معروفة في النسخة الاحتياطية.");return;}
      const summary=keys.map(k=>k+": "+(Array.isArray(data.localStorage[k])?data.localStorage[k].length+" سجل":"إعدادات")).join("\n");
      if(mode==="replace") saveLocalBackup("قبل استبدال النسخة الاحتياطية");
      if(!confirm("وضع العملية: "+(mode==="replace"?"استبدال المفاتيح الموجودة في الملف بعد تنزيل نسخة احتياطية":"دمج المنتجات واستيراد الإعدادات")+".\nالمفاتيح:\n"+summary+"\nهل تريد المتابعة؟"))return;
      keys.forEach(k=>{
        const incoming=data.localStorage[k];
        if(k==="mamlaka_custom_products_v1" && Array.isArray(incoming) && mode==="merge"){
          const existing=read(k,[]), map=new Map(existing.map(x=>[String(x.id||x.nameEn||x.nameAr).trim().toLowerCase(),x]));
          incoming.forEach((x,i)=>{const key=String(x.id||x.nameEn||x.nameAr||("record-"+i)).trim().toLowerCase();if(key)map.set(key,{...(map.get(key)||{}),...x})});
          write(k,[...map.values()]);
        }else localStorage.setItem(k,JSON.stringify(incoming));
      });
      updateFileStatus(id,mode==="replace"?"تم الاستيراد بالاستبدال":"تم الاستيراد بالدمج");recordLatestJson(name,"import",{kind:"نسخة احتياطية",keys:keys.length});document.dispatchEvent(new Event("mamlaka:products-updated"));toast("تم استيراد البيانات المعروفة. راجع الموقع قبل المتابعة.");return;
    }
    if(!records){toast("لم أتعرف على قائمة سجلات. يجب أن يحتوي JSON على مصفوفة أو products أو oils أو items أو records.");return;} const supplierLike=(Array.isArray(data.products)&&data.products.some(p=>p&&("sku" in p||"price_1kg" in p||"price_500g" in p)))||Array.isArray(data.oils); if(supplierLike){if(!confirm("يبدو أن هذا ملف كتالوج موردين. سيتم حفظه في كتالوج الموردين المحلي دون استبدال منتجات المتجر. هل تريد المتابعة؟"))return;write("mamlaka_supplier_catalog_v1",{...data,products:records,_sourceFileId:id,_sourceFileName:name});updateFileStatus(id,"تم الاستيراد إلى كتالوج الموردين","supplierCatalog");recordLatestJson(name,"import",{kind:"كتالوج الموردين",products:records.length});toast("تم استيراد كتالوج الموردين إلى التخزين المحلي. راجع النتائج قبل الاستخدام.");return;}
    if(records.some(x=>!x || typeof x!=="object" || Array.isArray(x))){toast("توجد سجلات غير صالحة؛ لم يتم الاستيراد.");return;}
    if(mode==="replace") saveLocalBackup("قبل استبدال المنتجات");
    if(!confirm("تم العثور على "+records.length+" سجل. "+(mode==="replace"?"سيتم استبدال قائمة المنتجات المحلية بالكامل بعد تنزيل نسخة احتياطية.":"سيتم دمج السجلات وتحديث المطابق منها.")+" هل تريد المتابعة؟"))return;
    const existing=mode==="replace"?[]:read("mamlaka_custom_products_v1",[]), map=new Map();
    [...existing,...records].forEach((p,i)=>{
      const key=String(p.id||p.nameEn||p.nameAr||p.name||("record-"+i)).trim().toLowerCase();
      if(key)map.set(key,{...(map.get(key)||{}),...p});
    });
    write("mamlaka_custom_products_v1",[...map.values()]);
    updateFileStatus(id,mode==="replace"?"تم الاستبدال":"تم الدمج");recordLatestJson(name,"import",{products:records.length});document.dispatchEvent(new Event("mamlaka:products-updated"));
    toast((mode==="replace"?"تم استبدال المنتجات بـ ":"تم دمج ")+records.length+" سجلًا. تحقق من الأسعار والبيانات قبل البيع.");
  }
  function saveLocalBackup(label){
    const snapshot={schemaVersion:2,exportedAt:new Date().toISOString(),store:"MAMLKAT AL-OTOR",backupReason:label,storageType:"browser-local-backup",localStorage:{}};
    catalogKeys.forEach(k=>{const value=localStorage.getItem(k);if(value!==null){try{snapshot.localStorage[k]=JSON.parse(value)}catch{snapshot.localStorage[k]=value}}});
    download("mamlaka-auto-backup-"+new Date().toISOString().replace(/[:.]/g,"-")+".json",JSON.stringify(snapshot,null,2));
  }
  function updateFileStatus(id,status,importTarget){const a=library().map(x=>x.id===id?{...x,status,...(importTarget?{importTarget}: {})}:x);saveLibrary(a);renderFileList();}
  function renderFileList(){
    const box=$("#royalFileList");if(!box)return;
    const q=($("#royalFileSearch")?.value||"").toLowerCase();
    const allFiles=library().sort((a,b)=>new Date(b.importedAt||0)-new Date(a.importedAt||0));
    const latest=$("#royalLatestFile");
    if(latest){const newest=allFiles[0];latest.innerHTML=newest?`<strong>أحدث ملف محفوظ</strong><span>${esc(newest.name)}</span><small>${esc(new Date(newest.importedAt).toLocaleString("ar-EG"))} · ${esc(newest.status||"محفوظ")}</small>`:`<span>لم تتم إضافة ملفات بعد.</span>`;}
    const items=allFiles.filter(x=>(x.name+" "+x.kind+" "+x.status).toLowerCase().includes(q));
    box.innerHTML=items.length?items.map(x=>`<article class="royal-file-card"><span class="royal-file-icon">JSON</span><div class="royal-file-meta"><strong>${esc(x.name)}</strong><small>${esc(x.kind)} · ${Number(x.count)||0} سجل · ${esc(fileBytes({size:Number(x.size)||0}))}</small><small>${esc(new Date(x.importedAt).toLocaleString("ar-EG"))} · ${esc(x.status||"محفوظ")}</small></div><div class="royal-file-actions"><button type="button" class="small-btn" data-file-open="${esc(x.id)}">فتح</button><button type="button" class="small-btn" data-file-download="${esc(x.id)}">تنزيل</button>${x.importTarget==="supplierCatalog"?`<button type="button" class="small-btn danger" data-file-delete-catalog="${esc(x.id)}">حذف كتالوج المورد</button>`:""}<button type="button" class="small-btn danger" data-file-delete="${esc(x.id)}">حذف السجل</button></div></article>`).join(""):'<p class="admin-note">لا توجد ملفات في المكتبة حتى الآن. اختر ملف JSON للبدء.</p>';
    $$("[data-file-open]",box).forEach(b=>b.onclick=()=>{const x=library().find(f=>f.id===b.dataset.fileOpen);if(!x)return;$("#royalFilePreview").classList.remove("hidden");$("#royalFilePreview").innerHTML=`<div class="royal-file-head"><div><strong>${esc(x.name)}</strong><small>${esc(x.status)} · ${esc(x.kind)}</small></div><button class="small-btn" id="royalClosePreview">إغلاق</button></div><pre class="royal-json-preview" dir="ltr"></pre>`;$(".royal-json-preview").textContent=JSON.stringify(JSON.parse(x.content),null,2).slice(0,60000);$("#royalClosePreview").onclick=()=>$("#royalFilePreview").classList.add("hidden");});
    $$("[data-file-download]",box).forEach(b=>b.onclick=()=>{const x=library().find(f=>f.id===b.dataset.fileDownload);if(x)download(x.name,x.content)});
    $$("[data-file-delete-catalog]",box).forEach(b=>b.onclick=()=>{const x=library().find(f=>f.id===b.dataset.fileDeleteCatalog);if(!x)return;const catalog=read("mamlaka_supplier_catalog_v1",null);if(!catalog||catalog._sourceFileId!==x.id){toast("لا يمكن ربط هذا الملف بكتالوج المورد الحالي؛ لم تُحذف أي بيانات.");return;}if(!confirm("حذف كتالوج المورد المستورد من الملف «"+x.name+"»؟ سيُحذف هذا الكتالوج المحلي فقط، ولن تُحذف منتجات المتجر الأخرى."))return;localStorage.removeItem("mamlaka_supplier_catalog_v1");saveLibrary(library().map(f=>f.id===x.id?{...f,status:"حُذف كتالوج المورد المحلي"}:f));renderFileList();toast("تم حذف كتالوج المورد المحلي المرتبط بهذا الملف.");});
    $$("[data-file-delete]",box).forEach(b=>b.onclick=()=>{const x=library().find(f=>f.id===b.dataset.fileDelete);if(!x)return;if(!confirm("حذف سجل الملف «"+x.name+"» من المكتبة؟ لن تُحذف المنتجات التي سبق استيرادها."))return;saveLibrary(library().filter(f=>f.id!==x.id));renderFileList();toast("تم حذف سجل الملف من المكتبة.");});
  }
  function showExportPreview(name,data){
    const preview=$("#royalFilePreview");preview.classList.remove("hidden");
    const raw=JSON.stringify(data,null,2);
    preview.innerHTML=`<div class="royal-file-head"><div><strong>${esc(name)}</strong><small>معاينة قبل التنزيل · ${raw.length.toLocaleString("ar-EG")} حرف</small></div><button type="button" class="small-btn" id="royalClosePreview">إغلاق</button></div><pre class="royal-json-preview" dir="ltr"></pre><button type="button" class="btn btn-gold" id="royalConfirmExport">تنزيل ملف JSON</button>`;
    $(".royal-json-preview").textContent=raw.slice(0,60000)+(raw.length>60000?"\n… تم اختصار المعاينة":"");
    $("#royalClosePreview").onclick=()=>preview.classList.add("hidden");
    $("#royalConfirmExport").onclick=()=>{download(name,raw);const items=library();items.unshift({id:"export-"+Date.now(),name,size:new Blob([raw]).size,importedAt:new Date().toISOString(),kind:"ملف مُصدّر",count:summarize(data).count,status:"تم التصدير",content:raw});saveLibrary(items.slice(0,100));renderFileList();recordLatestJson(name,"export",{records:summarize(data).count});toast("تم تنزيل نسخة JSON وتسجيلها في المكتبة.");};
  }
  function bindBackgroundManager(){
    const select=$("#royalBgTarget");if(!select)return;
    const all=()=>read(BACKGROUNDS_KEY,{});
    function preview(){const t=select.value, item=all()[t]||{};$("#royalBgColor").value=item.color||"#0a0a0a";$("#royalBgOverlay").value=Math.round((item.overlay??.55)*100);const box=$("#royalBgPreview");box.style.backgroundColor=$("#royalBgColor").value;box.style.backgroundImage=item.image?"linear-gradient(rgba(0,0,0,"+$("#royalBgOverlay").value/100+"),rgba(0,0,0,"+$("#royalBgOverlay").value/100+")),url("+JSON.stringify(item.image)+")":"none";box.textContent=item.image?"معاينة صورة الخلفية":"معاينة اللون";$("#royalBgImage").value="";}
    select.addEventListener("change",preview);$("#royalCustomTarget")?.addEventListener("input",preview);$("#royalBgColor").addEventListener("input",preview);$("#royalBgOverlay").addEventListener("input",preview);
    $("#royalBgImage").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;if(!/^image\/(png|jpeg|webp)$/.test(f.type)){toast("استخدم صورة JPG أو PNG أو WebP.");return;}if(f.size>2*1024*1024){toast("الصورة أكبر من 2 ميجابايت؛ اضغطها قبل الرفع.");e.target.value="";return;}const reader=new FileReader();reader.onload=()=>{const t=target();if(!t||t==="__custom__"){toast("حدد عنصر CSS صالحًا أولًا.");return;}try{document.querySelector(t)}catch{toast("محدد CSS غير صالح.");return;}const items=all();items[t]={...(items[t]||{}),image:String(reader.result),color:$("#royalBgColor").value,overlay:Number($("#royalBgOverlay").value)/100};write(BACKGROUNDS_KEY,items);preview();$("#royalBgPreview").style.backgroundImage="linear-gradient(rgba(0,0,0,"+$("#royalBgOverlay").value/100+"),rgba(0,0,0,"+$("#royalBgOverlay").value/100+")),url("+JSON.stringify(String(reader.result))+")";$("#royalBgPreview").textContent="تم تحميل الصورة للمعاينة";};reader.readAsDataURL(f);});
    $("#royalBgSave").addEventListener("click",()=>{const t=target();if(!t){toast("حدد عنصرًا صالحًا لتغيير خلفيته.");return;}try{if(!document.querySelector(t)){toast("لم يتم العثور على العنصر المحدد.");return;}}catch{toast("محدد CSS غير صالح.");return;}const items=all(),old=items[t]||{};items[t]={...old,color:$("#royalBgColor").value,overlay:Number($("#royalBgOverlay").value)/100};write(BACKGROUNDS_KEY,items);applyBackground(t,items[t]);toast("تم حفظ خلفية هذا القسم في المتصفح الحالي.");});
    $("#royalBgReset").addEventListener("click",()=>{const t=target();if(!t)return;const items=all();delete items[t];write(BACKGROUNDS_KEY,items);applyBackground(t,null);preview();toast("تمت استعادة خلفية القسم الافتراضية.");});
    preview();
  }
  function applyBackground(target,item){
    let el=target==="body"?document.body:$(target);
    if(!el)return;
    if(!item){el.style.removeProperty("background-color");el.style.removeProperty("background-image");el.style.removeProperty("--section-overlay");return;}
    el.style.backgroundColor=item.color||"#0a0a0a";
    if(item.image)el.style.backgroundImage="linear-gradient(rgba(0,0,0,"+Number(item.overlay||.55)+"),rgba(0,0,0,"+Number(item.overlay||.55)+")),url("+JSON.stringify(item.image)+")";
    else el.style.backgroundImage="none";
    el.style.backgroundSize="cover";el.style.backgroundPosition="center";el.style.backgroundRepeat="no-repeat";
  }
  function applySavedBackgrounds(){const all=read(BACKGROUNDS_KEY,{});Object.entries(all).forEach(([target,item])=>applyBackground(target,item));}
  function addTaxonomyGuide(){
    if($("#royalScentGuide"))return;
    const section=document.createElement("section");section.id="royalScentGuide";section.className="section royal-scent-guide";
    section.innerHTML=`<div class="section-heading"><div><p class="eyebrow">THE PERFUMERY ATLAS</p><h2>دليل العائلات والأنواع العطرية</h2></div><p>شرح مبسّط لطبيعة كل عائلة، مع التنبيه إلى أن الوصف النهائي لكل عطر يعتمد على بيانات موثوقة للمنتج المحدد.</p></div><div class="royal-scent-grid">
      <article><div class="scent-visual floral">✿</div><h3>العطور الزهرية والوردية</h3><p>تدور حول الورد والياسمين وزهر البرتقال والبنفسج وغيرها. قد تكون ناعمة ورومانسية أو غنية وكثيفة حسب التركيبة.</p><small>مناسبة لمحبي الروائح الزهرية والأنثوية، وقد توجد أيضًا في عطور مشتركة.</small></article>
      <article><div class="scent-visual citrus">☼</div><h3>العطور الحمضية والمنعشة</h3><p>تستخدم عادةً روائح البرغموت والليمون واليوسفي والجريب فروت. تعطي انطباعًا مشرقًا وخفيفًا، وغالبًا ما تناسب النهار والطقس الدافئ.</p><small>الانتعاش لا يعني بالضرورة ثباتًا ضعيفًا؛ ذلك يعتمد على التركيبة.</small></article>
      <article><div class="scent-visual woody">♜</div><h3>العطور الخشبية والعود</h3><p>تضم أخشاب الأرز والصندل والفيتيفر والعود. تتراوح بين خشب جاف ونظيف وخشب كريمي أو دخاني أو شرقي عميق.</p><small>شائعة في العطور الرجالية والمشتركة والشرقية.</small></article>
      <article><div class="scent-visual amber">✧</div><h3>العطور الشرقية والعنبرية</h3><p>قد تجمع العنبر والراتنجات والتوابل والفانيليا والبلسمات، وتمنح إحساسًا دافئًا وغنيًا. كلمة «عنبر» قد تصف طابعًا عطريًا ولا تعني بالضرورة مادة طبيعية بعينها.</p><small>تلائم غالبًا الأجواء المسائية والطقس المعتدل أو البارد.</small></article>
      <article><div class="scent-visual musk">◇</div><h3>المسك والنظافة</h3><p>روائح ناعمة ونظيفة أو قطنية أو جلدية خفيفة، وقد تكون بودرية أو دافئة. تختلف طبيعتها كثيرًا حسب نوع المسك والمواد المصاحبة.</p><small>تظهر في عطور يومية وعطور طبقات وتعطير الملابس.</small></article>
      <article><div class="scent-visual sweet">❋</div><h3>الحلوة والفانيليا والغورماند</h3><p>تذكّر بالفانيليا والكراميل واللوز والشوكولاتة والحلوى أو القهوة. قد تكون دسمة أو خفيفة بحسب توازن المكونات.</p><small>محبوبة في العطور الدافئة، لكن الحلاوة ليست حكرًا على عطور النساء.</small></article>
      <article><div class="scent-visual fruity">❀</div><h3>الفاكهية</h3><p>قد تتضمن التفاح والكمثرى والخوخ والتوت والمانجو والفواكه الحمراء. تمنح إحساسًا عصيريًا أو مرحًا، وغالبًا ما تمتزج بالزهور أو المسك.</p><small>اسم الفاكهة في التسويق لا يثبت وجود مستخلص طبيعي منها.</small></article>
      <article><div class="scent-visual marine">≈</div><h3>البحرية والمائية</h3><p>تعطي انطباع الهواء البحري والندى والانتعاش المائي، وقد تتداخل مع الحمضيات أو الأخشاب أو الروائح المعدنية.</p><small>مناسبة لمن يفضّل إحساسًا منعشًا ونظيفًا.</small></article>
      <article><div class="scent-visual green">❧</div><h3>العطرية والخضراء</h3><p>قد تشمل اللافندر وإكليل الجبل والريحان والمريمية والأوراق الخضراء. تتراوح من عشبية نظيفة إلى حادة أو ترابية.</p><small>تظهر كثيرًا في العطور الكلاسيكية والمنعشة.</small></article>
      <article><div class="scent-visual leather">▤</div><h3>الجلدية والتبغية</h3><p>تعطي إيحاء الجلد المدبوغ أو الدخان أو أوراق التبغ أو الأخشاب الداكنة. قد تكون ناعمة ومخمليّة أو قوية وجافة.</p><small>غالبًا ما تظهر في عطور مسائية أو ذات طابع مميز.</small></article>
      <article><div class="scent-visual powder">✥</div><h3>البودرية</h3><p>إحساس ناعم يشبه البودرة أو المكياج أو بعض الروائح النظيفة، وقد ينتج عن السوسن أو البنفسج أو المسك أو مواد عطرية أخرى.</p><small>قد تكون هادئة أو كلاسيكية أو كريمية.</small></article>
      <article><div class="scent-visual spicy">✣</div><h3>التوابل</h3><p>تشمل إيحاءات الفلفل والهيل والقرفة والقرنفل والزعفران وغيرها. قد تضيف حرارة أو حدة أو عمقًا إلى التركيبات الشرقية والخشبية.</p><small>الطابع المتبّل قد يكون دافئًا أو منعشًا بحسب المكونات.</small></article>
      <article><div class="scent-visual chypre">♧</div><h3>الشيبرية</h3><p>اتجاه عطري تقليدي يوازن عادةً افتتاحية حمضية مع قلب زهري أو عطري وقاعدة خشبية/طحلبية أو بدائل حديثة لها.</p><small>تحتاج تسمية «شيبر» إلى معرفة تركيب العطر، ولا تُستنتج من الاسم وحده.</small></article>
      <article><div class="scent-visual fougere">♙</div><h3>الفوجير</h3><p>عائلة كلاسيكية قد تجمع اللافندر والنوتات العطرية والطحلبية والكومارينية، وتظهر في عدد كبير من العطور الرجالية التقليدية والحديثة.</p><small>قد تكون نظيفة أو عشبية أو خشبية.</small></article>
      <article><div class="scent-visual incense">♨</div><h3>البخور والراتنجات</h3><p>إيحاءات اللبان والمرّ والبخور والراتنجات والدخان، وغالبًا ما تمتزج بالأخشاب أو العنبر أو التوابل.</p><small>تختلف رائحة البخور المحترق عن رائحة العطر المصمم ليحاكيه.</small></article>
      <article><div class="scent-visual floral">♛</div><h3>المشتركة Unisex</h3><p>ليست عائلة عطرية مستقلة، بل وصف لعطور تُسوّق أو تُختار لتناسب مختلف الأذواق. يمكن أن تكون خشبية أو حمضية أو زهرية أو شرقية.</p><small>الاختيار الشخصي أهم من التصنيف التسويقي.</small></article>
    </div><p class="admin-note">مهم: هذه أوصاف عامة للعائلات وليست بيانات مؤكدة لكل منتج. لا تُنسب نوتات محددة إلى عطر في الكتالوج إلا بعد التحقق من مصدره.</p>`;
    const target=$("#scent-classification")||$("#ready");if(target)target.insertAdjacentElement("afterend",section);
  }
  function init(){
    ensureFileManager();addTaxonomyGuide();applySavedBackgrounds();
    // When settings panel is opened later, its data page exists already; ensure enhancement remains attached.
    document.addEventListener("click",e=>{if(e.target.closest("#settingsShortcut"))setTimeout(()=>{ensureFileManager();renderFileList();},50);});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
;

/* ===== MODULE 2: royal-gift-planner.js ===== */
;
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
      window.open(url, "_blank", "noopener,noreferrer");
      const status = $("#royalGiftStatus", panel);
      status.textContent = "تم تجهيز الرسالة. راجع السعر والتوفر قبل التأكيد. ";
      const fallback = document.createElement("a");
      fallback.href = url;
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      fallback.textContent = "فتح واتساب يدويًا";
      status.append(fallback);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGiftPlanner);
  else initGiftPlanner();
})();
;

/* ===== MODULE 3: inventory-accounting.js ===== */
;
/* MAMLKAT AL-OTOR — local inventory and accounting */
(() => {
"use strict";
const KEY="mamlaka_inventory_accounting_v1",$=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>(Number(n)||0).toLocaleString("ar-EG",{style:"currency",currency:"EGP",maximumFractionDigits:2});
const read=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||"null");return d&&Array.isArray(d.items)&&Array.isArray(d.sales)&&Array.isArray(d.expenses)?d:{items:[],sales:[],expenses:[]}}catch{return{items:[],sales:[],expenses:[]}}};
const write=d=>localStorage.setItem(KEY,JSON.stringify(d));
const keyName=s=>"item-"+String(s||"").trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,80);
const dayKey=v=>{const d=new Date(v);return[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const today=()=>dayKey(new Date()),monthKey=v=>String(v||"").slice(0,7);
const toast=s=>{const t=$("#toast");if(t){t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}else alert(s)};
function mount(){
const content=$("#adminContent"),nav=content&&content.querySelector(".admin-tabs");if(!content||!nav||$("#iaPage"))return;
const tab=document.createElement("button");tab.type="button";tab.dataset.tab="inventory-accounting";tab.textContent="المخزون والحسابات";nav.append(tab);
const page=document.createElement("section");page.id="iaPage";page.className="admin-page hidden";page.dataset.page="inventory-accounting";
page.innerHTML=[
'<h3>المخزون والحسابات</h3><p class="admin-note">دفتر محلي في هذا المتصفح فقط؛ لا تُرسل المبيعات إلى الخادم أو واتساب تلقائيًا. صدّر نسخة احتياطية بانتظام.</p>',
'<div class="ia-metrics" id="iaMetrics"></div><div class="ia-stock-alert" id="iaLowStockAlert" aria-live="polite"></div><div class="ia-columns">',
'<form id="iaStockForm" class="ia-card"><h4>توريد / إضافة مخزون</h4><label>اسم المنتج<input name="name" list="iaNames" required maxlength="160" placeholder="اسم العطر أو الزيت أو البخور"></label><datalist id="iaNames"></datalist>',
'<label>المورد / الشركة<input name="supplier" list="iaSuppliers" maxlength="120" placeholder="مثال: لوزي، مان، تكنو، اليجاس، ماربة"><datalist id="iaSuppliers"><option value="لوزي"></option><option value="مان"></option><option value="تكنو"></option><option value="اليجاس"></option><option value="ماربة"></option></datalist></label><p id="iaSupplierCostHint" class="admin-note" aria-live="polite">اختَر الصنف والمورد لعرض آخر تكلفة شراء مسجلة إن وُجدت.</p><div class="admin-grid"><label>نوع المنتج<select name="type"><option value="ready">عطر جاهز</option><option value="oil">زيت عطري / تركيب</option><option value="bakhoor">عود وبخور</option><option value="gift">هدايا وتغليف</option><option value="other">أخرى</option></select></label><label>الكمية المضافة<input name="qty" type="number" min="0.001" step="0.001" required></label><label>تكلفة شراء الوحدة ج.م<input name="cost" type="number" min="0" step="0.01" required></label><label>شحن التوريد بالكامل ج.م<input name="shipping" type="number" min="0" step="0.01" value="0"></label><label>مصروفات إضافية للتوريد ج.م<input name="extraCost" type="number" min="0" step="0.01" value="0"></label><label>سعر البيع للوحدة ج.م<input name="price" type="number" min="0" step="0.01" placeholder="0 إذا لم يُحدد"></label></div><p class="admin-note">تُضاف حصة الشحن والمصروفات الإضافية إلى تكلفة الوحدة، ويُحدّث متوسط تكلفة المخزون عند تكرار التوريد.</p><button class="btn btn-gold" type="submit">حفظ التوريد</button></form>',
'<form id="iaSaleForm" class="ia-card"><h4>تسجيل بيع</h4><label>الصنف المتاح<select name="itemId" id="iaSaleItem" required></select></label><div class="admin-grid"><label>الكمية المباعة<input name="qty" type="number" min="0.001" step="0.001" required></label><label>سعر البيع للوحدة ج.م<input name="price" type="number" min="0.01" step="0.01" required></label></div><label>ملاحظة أو رقم الطلب<input name="note" maxlength="180" placeholder="اختياري"></label><button class="btn btn-gold" type="submit">تسجيل البيع وخصم المخزون</button><p class="admin-note">لا يسمح ببيع كمية أكبر من الرصيد. مبيعات واتساب غير المسجلة هنا لا تُحتسب تلقائيًا.</p></form>',
'<form id="iaExpenseForm" class="ia-card"><h4>تسجيل مصروف</h4><div class="admin-grid"><label>نوع المصروف<select name="category"><option>شحن وتوصيل</option><option>إيجار ومكان</option><option>تغليف</option><option>مشتريات تشغيلية</option><option>تسويق</option><option>أجور</option><option>أخرى</option></select></label><label>المبلغ ج.م<input name="amount" type="number" min="0.01" step="0.01" required></label></div><label>الوصف<input name="note" maxlength="180" required></label><button class="btn btn-outline" type="submit">حفظ المصروف</button></form></div>',
'<div class="ia-card"><div class="ia-heading"><h4>رصيد المخزون</h4><div class="ia-actions"><button type="button" class="btn btn-outline" id="iaImportTrigger">استيراد نسخة JSON</button><input id="iaImportFile" type="file" accept=".json,application/json" hidden><button type="button" class="btn btn-outline" id="iaExport">تصدير الحسابات JSON</button></div></div><div class="ia-table-wrap"><table class="ia-table"><thead><tr><th>الصنف</th><th>النوع</th><th>الرصيد</th><th>تكلفة الوحدة</th><th>سعر البيع</th><th>قيمة المخزون</th><th></th></tr></thead><tbody id="iaStockRows"></tbody></table></div><p id="iaEmptyStock" class="admin-note hidden">لا توجد أصناف. أضف توريدًا أولًا.</p></div>',
'<div class="ia-card"><div class="ia-heading"><h4>سجل العمليات</h4><div class="ia-filters"><label>الفترة<select id="iaPeriod"><option value="today">اليوم</option><option value="month" selected>الشهر الحالي</option><option value="all">كل السجل</option></select></label><button type="button" class="btn btn-outline" id="iaCsv">تصدير CSV</button></div></div><div class="ia-table-wrap"><table class="ia-table"><thead><tr><th>التاريخ</th><th>النوع</th><th>التفاصيل</th><th>الإيراد/المصروف</th><th>تكلفة البضاعة</th><th>ربح البيع</th><th></th></tr></thead><tbody id="iaLedger"></tbody></table></div><p id="iaEmptyLedger" class="admin-note hidden">لا توجد عمليات في هذه الفترة.</p></div>',
'<p class="admin-note">ربح البيع = قيمة البيع − تكلفة البضاعة المباعة. صافي النتيجة التقديري = ربح البيع − المصروفات المسجلة. لا يشمل ضرائب أو التزامات غير مسجلة.</p>'
].join("");content.append(page);
nav.addEventListener("click",e=>{const b=e.target.closest('[data-tab="inventory-accounting"]');if(!b)return;nav.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));content.querySelectorAll("[data-page]").forEach(x=>x.classList.toggle("hidden",x!==page));render()});
$("#iaStockForm").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget,d=read(),v=Object.fromEntries(new FormData(f)),name=String(v.name||"").trim(),supplier=String(v.supplier||"").trim(),qty=Number(v.qty),purchaseUnitCost=Number(v.cost),shippingTotal=Number(v.shipping)||0,extraCostTotal=Number(v.extraCost)||0,price=Number(v.price)||0;if(!name||!(qty>0)||!(purchaseUnitCost>=0)||!(shippingTotal>=0)||!(extraCostTotal>=0)||!(price>=0)){toast("راجع الاسم والكمية والتكلفة والشحن والمصروفات.");return}const landedUnitCost=purchaseUnitCost+(shippingTotal+extraCostTotal)/qty,id=keyName(name),old=d.items.find(x=>x.id===id),now=new Date().toISOString();if(old){const total=Number(old.qty)+qty;old.unitCost=(Number(old.qty)*Number(old.unitCost)+qty*landedUnitCost)/total;old.qty=total;if(price>0)old.salePrice=price;old.type=v.type;old.updatedAt=now}else d.items.push({id,name,type:v.type,qty,unitCost:landedUnitCost,salePrice:price,createdAt:now,updatedAt:now});d.movements=d.movements||[];d.movements.push({id:"m-"+Date.now(),type:"stock-in",itemId:id,name,supplier:supplier||"غير محدد",qty,purchaseUnitCost,shippingTotal,extraCostTotal,unitCost:landedUnitCost,totalLandedCost:landedUnitCost*qty,createdAt:now});write(d);f.reset();render();toast("تم حفظ التوريد وحساب تكلفة الوحدة بعد الشحن والمصروفات.")});
const intakeForm=$("#iaStockForm"),supplierCostHint=$("#iaSupplierCostHint"),normalizeCostKey=v=>String(v||"").trim().toLocaleLowerCase("ar");function suggestSupplierCost(){if(!intakeForm)return;const name=normalizeCostKey(intakeForm.elements.name.value),supplier=normalizeCostKey(intakeForm.elements.supplier.value),costInput=intakeForm.elements.cost;if(!name||!supplier){if(supplierCostHint)supplierCostHint.textContent="اختَر الصنف والمورد لعرض آخر تكلفة شراء مسجلة إن وُجدت.";if(costInput.dataset.supplierAutofill==="1"){costInput.value="";delete costInput.dataset.supplierAutofill}return}const previous=(read().movements||[]).filter(x=>x.type==="stock-in"&&normalizeCostKey(x.name)===name&&normalizeCostKey(x.supplier)===supplier).sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")))[0];if(!previous){if(supplierCostHint)supplierCostHint.textContent="لا توجد تكلفة سابقة مسجلة لهذا الصنف لدى هذا المورد؛ أدخل سعر الشراء الحالي.";if(costInput.dataset.supplierAutofill==="1"){costInput.value="";delete costInput.dataset.supplierAutofill}return}const lastCost=Number(previous.purchaseUnitCost??previous.unitCost);if(supplierCostHint)supplierCostHint.textContent="آخر شراء مسجل من "+String(previous.supplier||supplier)+" بسعر "+money(lastCost)+" للوحدة بتاريخ "+(previous.createdAt?new Date(previous.createdAt).toLocaleDateString("ar-EG"):"غير محدد")+". الشحن والمصروفات الإضافية تُدخل من جديد لكل توريد.";if(!costInput.value||costInput.dataset.supplierAutofill==="1"){costInput.value=String(lastCost);costInput.dataset.supplierAutofill="1"}}intakeForm?.elements.name.addEventListener("input",suggestSupplierCost);intakeForm?.elements.supplier.addEventListener("input",suggestSupplierCost);intakeForm?.elements.cost.addEventListener("input",()=>{delete intakeForm.elements.cost.dataset.supplierAutofill});
$("#iaSaleForm").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget,d=read(),v=Object.fromEntries(new FormData(f)),item=d.items.find(x=>x.id===v.itemId),qty=Number(v.qty),price=Number(v.price);if(!item||!(qty>0)||!(price>0)){toast("اختر صنفًا وأدخل كمية وسعرًا صحيحين.");return}if(qty>Number(item.qty)){toast("الكمية أكبر من الرصيد المتاح: "+item.qty);return}const cost=Number(item.unitCost)||0,now=new Date().toISOString();item.qty=Math.round((Number(item.qty)-qty)*1000)/1000;item.updatedAt=now;d.sales.push({id:"s-"+Date.now(),itemId:item.id,name:item.name,qty,unitPrice:price,revenue:qty*price,unitCost:cost,cost:qty*cost,profit:qty*(price-cost),note:String(v.note||"").trim(),createdAt:now});d.movements=d.movements||[];d.movements.push({id:"m-"+Date.now(),type:"sale",itemId:item.id,name:item.name,qty:-qty,createdAt:now});write(d);f.reset();render();toast("تم تسجيل البيع وخصم الكمية.")});
$("#iaSaleItem").addEventListener("change",()=>{const item=read().items.find(x=>x.id===$("#iaSaleItem").value),price=$("#iaSaleForm [name=price]");price.value=item&&Number(item.salePrice)>0?item.salePrice:""});
$("#iaExpenseForm").addEventListener("submit",e=>{e.preventDefault();const f=e.currentTarget,d=read(),v=Object.fromEntries(new FormData(f)),amount=Number(v.amount);if(!(amount>0)||!String(v.note||"").trim()){toast("أدخل مبلغًا ووصفًا صحيحين.");return}d.expenses.push({id:"e-"+Date.now(),category:String(v.category),amount,note:String(v.note).trim(),createdAt:new Date().toISOString()});write(d);f.reset();render();toast("تم حفظ المصروف.")});
$("#iaPeriod").addEventListener("change",render);
$("#iaExport").addEventListener("click",()=>{const d=read();download("mamlakat-inventory-accounting-"+today()+".json",JSON.stringify({schemaVersion:1,store:"MAMLKAT AL-OTOR",exportedAt:new Date().toISOString(),...d},null,2))});
$("#iaImportTrigger").addEventListener("click",()=>$("#iaImportFile").click());
$("#iaImportFile").addEventListener("change",async e=>{
 const file=e.currentTarget.files?.[0];if(!file)return;
 try{
  if(file.size>10*1024*1024)throw Error("حجم الملف أكبر من 10 ميجابايت.");
  const raw=JSON.parse(await file.text());
  const incoming=raw?.localStorage?.[KEY]||raw?.inventoryAccounting||raw;
  if(!incoming||!Array.isArray(incoming.items)||!Array.isArray(incoming.sales)||!Array.isArray(incoming.expenses))throw Error("ملف غير صالح: يجب أن يحتوي على items وsales وexpenses.");
  const cleanItems=incoming.items.every(x=>x&&typeof x==="object"&&typeof x.id==="string"&&typeof x.name==="string"&&Number.isFinite(Number(x.qty))&&Number(x.qty)>=0&&Number.isFinite(Number(x.unitCost))&&Number(x.unitCost)>=0);
  const cleanSales=incoming.sales.every(x=>x&&typeof x==="object"&&typeof x.id==="string"&&typeof x.name==="string"&&Number.isFinite(Number(x.revenue))&&Number.isFinite(Number(x.cost)));
  const cleanExpenses=incoming.expenses.every(x=>x&&typeof x==="object"&&typeof x.id==="string"&&Number.isFinite(Number(x.amount))&&Number(x.amount)>=0);
  if(!cleanItems||!cleanSales||!cleanExpenses)throw Error("الملف يحتوي على سجلات ناقصة أو قيم غير صحيحة.");
  if(!confirm("سيتم استبدال بيانات المخزون والحسابات الحالية بهذه النسخة. صدّر نسخة من بياناتك الحالية أولًا إن احتجت إليها. هل تريد المتابعة؟"))return;
  const next={items:incoming.items,sales:incoming.sales,expenses:incoming.expenses,movements:Array.isArray(incoming.movements)?incoming.movements:[]};
  write(next);render();toast("تم استيراد نسخة الحسابات بنجاح.");
 }catch(err){toast(err.message||"تعذر استيراد الملف.");}
 finally{e.currentTarget.value="";}
});
$("#iaCsv").addEventListener("click",()=>{const d=read(),rows=[["date","kind","description","quantity","revenue_or_expense_EGP","cogs_EGP","gross_profit_EGP","supplier","purchase_unit_cost_EGP","shipping_EGP","extra_cost_EGP","note"]];d.sales.forEach(x=>rows.push([x.createdAt,"sale",x.name,x.qty,x.revenue,x.cost,x.profit,"","","", "",x.note||""]));d.expenses.forEach(x=>rows.push([x.createdAt,"expense",x.category,"",x.amount,"","","","","","",x.note||""]));(d.movements||[]).filter(x=>x.type==="stock-in").forEach(x=>rows.push([x.createdAt,"stock-in",x.name,x.qty,"",Number(x.totalLandedCost??(Number(x.unitCost||0)*Number(x.qty||0))),"",x.supplier||"غير محدد",x.purchaseUnitCost??x.unitCost,x.shippingTotal||0,x.extraCostTotal||0,"تُحسب تكلفة الوحدة بعد الشحن والمصروفات الإضافية"]));download("mamlakat-ledger-"+today()+".csv","\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n"),"text/csv;charset=utf-8")});
$("#iaStockRows").addEventListener("click",e=>{const b=e.target.closest("[data-delete-stock]");if(!b)return;const d=read(),item=d.items.find(x=>x.id===b.dataset.deleteStock);if(!item||!confirm("حذف الصنف من الرصيد الحالي؟ تبقى المبيعات القديمة محفوظة."))return;d.items=d.items.filter(x=>x.id!==item.id);write(d);render();toast("تم حذف الصنف من الرصيد الحالي.")});
$("#iaLedger").addEventListener("click",e=>{const b=e.target.closest("[data-delete-expense]");if(!b)return;const d=read();if(!confirm("حذف سجل المصروف؟"))return;d.expenses=d.expenses.filter(x=>x.id!==b.dataset.deleteExpense);write(d);render();toast("تم حذف المصروف.")});
render();
}
function download(name,data,type="application/json;charset=utf-8"){const u=URL.createObjectURL(new Blob([data],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function render(){
const d=read(),period=$("#iaPeriod")?.value||"month",within=v=>period==="all"||(period==="today"&&dayKey(v)===today())||(period==="month"&&monthKey(v)===monthKey(today()));
const sales=d.sales.filter(x=>within(x.createdAt)),expenses=d.expenses.filter(x=>within(x.createdAt)),revenue=sales.reduce((s,x)=>s+Number(x.revenue||0),0),cogs=sales.reduce((s,x)=>s+Number(x.cost||0),0),gross=revenue-cogs,exp=expenses.reduce((s,x)=>s+Number(x.amount||0),0),stockValue=d.items.reduce((s,x)=>s+Number(x.qty||0)*Number(x.unitCost||0),0);
$("#iaMetrics").innerHTML=[["إيراد المبيعات",revenue],["تكلفة البضاعة المباعة",cogs],["ربح البيع قبل المصروفات",gross],["المصروفات المسجلة",exp],["صافي النتيجة التقديري",gross-exp],["قيمة المخزون الحالية",stockValue]].map(x=>'<div class="ia-metric"><small>'+esc(x[0])+'</small><strong>'+money(x[1])+'</strong></div>').join("");
 const lowStock=d.items.filter(x=>Number(x.qty)<=3);$("#iaLowStockAlert").innerHTML=lowStock.length?'<strong>تنبيه مخزون منخفض (3 وحدات أو أقل)</strong><p>'+lowStock.map(x=>esc(x.name)+' — المتبقي: '+esc(x.qty)).join(" · ")+'</p>':'<strong>حالة المخزون</strong><p>لا توجد أصناف عند حد التنبيه (3 وحدات أو أقل).</p>';
let names=[];try{names=JSON.parse(localStorage.getItem("mamlaka_custom_products_v1")||"[]").map(p=>p.nameAr||p.nameEn||p.name).filter(Boolean)}catch{}$("#iaNames").innerHTML=[...new Set([...names,...d.items.map(x=>x.name)])].map(n=>'<option value="'+esc(n)+'"></option>').join("");
const sel=$("#iaSaleItem"),avail=d.items.filter(x=>Number(x.qty)>0),previous=sel.value;sel.innerHTML=avail.length?avail.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+' — الرصيد '+esc(x.qty)+'</option>').join(""):'<option value="">لا يوجد مخزون متاح</option>';const chosen=avail.find(x=>x.id===previous)||avail[0];if(chosen){sel.value=chosen.id;const p=$("#iaSaleForm [name=price]");if(!p.value||p.dataset.auto==="1"){p.value=Number(chosen.salePrice)>0?chosen.salePrice:"";p.dataset.auto="1"}}
$("#iaStockRows").innerHTML=d.items.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(({ready:"عطر جاهز",oil:"زيت / تركيب",bakhoor:"عود وبخور",gift:"هدايا",other:"أخرى"})[x.type]||x.type)+'</td><td>'+esc(x.qty)+'</td><td>'+money(x.unitCost)+'</td><td>'+money(x.salePrice)+'</td><td>'+money(Number(x.qty)*Number(x.unitCost))+'</td><td><button class="small-btn danger" type="button" data-delete-stock="'+esc(x.id)+'">حذف</button></td></tr>').join("");$("#iaEmptyStock").classList.toggle("hidden",d.items.length>0);
const stockIns=(d.movements||[]).filter(x=>x.type==="stock-in"&&within(x.createdAt)).map(x=>({id:x.id,kind:"stock-in",date:x.createdAt,name:x.name,amount:0,cost:Number(x.totalLandedCost??(Number(x.unitCost||0)*Number(x.qty||0))),profit:0,note:"المورد: "+(x.supplier||"غير محدد")+" | شراء الوحدة: "+money(x.purchaseUnitCost??x.unitCost)+" | الشحن: "+money(x.shippingTotal||0)+" | مصروفات إضافية: "+money(x.extraCostTotal||0),label:"توريد مخزون"}));const ledger=[...sales.map(x=>({id:x.id,kind:"sale",date:x.createdAt,name:x.name,amount:x.revenue,cost:x.cost,profit:x.profit,note:x.note||"",label:"مبيعات"})),...expenses.map(x=>({id:x.id,kind:"expense",date:x.createdAt,name:x.category,amount:x.amount,cost:0,profit:0,note:x.note||"",label:"مصروف"})),...stockIns].sort((a,b)=>b.date.localeCompare(a.date));
$("#iaLedger").innerHTML=ledger.map(x=>'<tr><td>'+esc(new Date(x.date).toLocaleString("ar-EG"))+'</td><td>'+x.label+'</td><td>'+esc(x.name)+(x.note?'<small class="ia-note">'+esc(x.note)+'</small>':"")+'</td><td>'+money(x.amount)+'</td><td>'+money(x.cost)+'</td><td>'+money(x.profit)+'</td><td>'+(x.kind==="expense"?'<button type="button" class="small-btn danger" data-delete-expense="'+esc(x.id)+'">حذف</button>':"—")+'</td></tr>').join("");$("#iaEmptyLedger").classList.toggle("hidden",ledger.length>0);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
;

/* ===== MODULE 4: royal-interactions.js ===== */
;
/* MAMLKAT AL-OTOR — gentle royal interactions; no external libraries */
(() => {
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===true;
  function installUtilities(){
    if(!$("#royalScrollProgress")){
      const progress=document.createElement("div");progress.id="royalScrollProgress";progress.setAttribute("aria-hidden","true");document.body.append(progress);
    }
    if(!$("#royalBackTop")){
      const top=document.createElement("button");top.id="royalBackTop";top.type="button";top.setAttribute("aria-label","العودة إلى أعلى الصفحة");top.title="العودة إلى أعلى الصفحة";
      top.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
      top.addEventListener("click",()=>window.scrollTo({top:0,behavior:reduced?"auto":"smooth"}));document.body.append(top);
    }
    if(!$("#royalMotionStatus")){
      const status=document.createElement("span");status.id="royalMotionStatus";status.className="visually-hidden";status.setAttribute("aria-live","polite");document.body.append(status);
    }
  }
  function updateScroll(){
    const root=document.documentElement,range=root.scrollHeight-window.innerHeight,progress=range>0?Math.min(100,Math.max(0,window.scrollY/range*100)):0;
    const bar=$("#royalScrollProgress");if(bar)bar.style.width=progress+"%";
    const top=$("#royalBackTop");if(top)top.classList.toggle("is-visible",window.scrollY>480);
    const header=$(".site-header");if(header)header.classList.toggle("is-scrolled",window.scrollY>12);
  }
  function setupReveal(){
    const targets=$$(".section,.trust-strip,.split-feature,.hero,.site-footer,.product-card,.category-card");
    targets.forEach((el,i)=>{if(el.id==="home"||el.classList.contains("hero"))return;el.classList.add("royal-reveal");el.style.transitionDelay=(i%4)*45+"ms";});
    if(reduced||!("IntersectionObserver" in window)){targets.forEach(el=>el.classList.add("is-in-view"));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-in-view");observer.unobserve(entry.target);}
    }),{threshold:.08,rootMargin:"0px 0px -24px 0px"});
    targets.forEach(el=>observer.observe(el));
    const productRoot=$("#readyProducts");
    if(productRoot&&"MutationObserver" in window){
      new MutationObserver(()=>productRoot.querySelectorAll(".product-card:not(.royal-reveal)").forEach((el,i)=>{
        el.classList.add("royal-reveal");el.style.transitionDelay=(i%4)*35+"ms";observer.observe(el);
      })).observe(productRoot,{childList:true});
    }
  }
  function setupNav(){
    const nav=$("#mainNav"),toggle=$("#menuToggle");
    if(!nav||!toggle)return;
    const close=()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","فتح القائمة");};
    toggle.addEventListener("click",()=>{const open=nav.classList.contains("open");toggle.setAttribute("aria-label",open?"إغلاق القائمة":"فتح القائمة");});
    nav.addEventListener("click",e=>{if(e.target.closest("a"))close();});
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape")close();
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
        const input=$("#productSearch");if(input){e.preventDefault();input.focus();$("#ready")?.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}
      }
    });
    if("IntersectionObserver" in window&&!reduced){
      const links=$$("#mainNav a[data-nav]");
      const sections=links.map(a=>$(a.getAttribute("href"))).filter(Boolean);
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        links.forEach(a=>{const active=a.getAttribute("href")==="#"+entry.target.id;a.classList.toggle("active",active);if(active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
      }),{rootMargin:"-25% 0px -60% 0px",threshold:0});
      sections.forEach(s=>observer.observe(s));
    }
  }
  function setupButtonFeedback(){
    document.addEventListener("click",e=>{
      const target=e.target.closest(".btn,.small-btn,.category-card,#royalBackTop");
      if(!target||reduced||target.disabled||target.tagName==="A"&&target.getAttribute("href")?.startsWith("#"))return;
      const rect=target.getBoundingClientRect(),diameter=Math.min(Math.max(rect.width,rect.height)*1.2,100);
      const ripple=document.createElement("span");ripple.className="royal-ripple";ripple.style.width=diameter+"px";ripple.style.height=diameter+"px";
      ripple.style.left=(e.clientX?e.clientX-rect.left-diameter/2:rect.width/2-diameter/2)+"px";
      ripple.style.top=(e.clientY?e.clientY-rect.top-diameter/2:rect.height/2-diameter/2)+"px";
      const prior=getComputedStyle(target).position;if(prior==="static")target.style.position="relative";target.style.overflow="hidden";target.append(ripple);setTimeout(()=>ripple.remove(),650);
    });
  }
  function setupImageFallbacks(){
    $$("img").forEach(img=>{
      if(img.dataset.royalFallback==="1")return;
      img.dataset.royalFallback="1";
      img.addEventListener("error",()=>{
        if(img.classList.contains("hero-image")){$(".hero")?.classList.add("hero-image-missing");return;}
        img.classList.add("royal-image-missing");
      },{once:true});
    });
  }
  function init(){
    installUtilities();setupNav();setupImageFallbacks();updateScroll();
    window.addEventListener("scroll",updateScroll,{passive:true});
    window.addEventListener("resize",updateScroll,{passive:true});
    document.addEventListener("mamlaka:products-updated",()=>{setupImageFallbacks();});
    document.addEventListener("mamlaka:supplier-catalog-updated",()=>{setupImageFallbacks();});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
;

/* ===== MODULE 5: royal-finish.js ===== */
;
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
;

/* ===== MODULE 6: section-folds.js ===== */
;
/* Accessible compact section controls for Mamlakat Al-Otor */
(function(){
  'use strict';
  function setupFold(section, index){
    if(!section || section.id==='homeIndex' || section.dataset.foldReady==='true') return;
    var heading=section.querySelector(':scope > .section-heading');
    if(!heading) return;
    var children=Array.from(section.children);
    var content=document.createElement('div');
    content.className='section-fold-content';
    content.id='section-fold-content-'+index;
    content.hidden=false;
    children.forEach(function(node){
      if(node!==heading) content.appendChild(node);
    });
    var title=heading.querySelector('h2,h3');
    var titleText=title ? title.textContent.trim() : 'تفاصيل القسم';
    var copy=Array.from(heading.children).find(function(node){return node!==title && !node.contains(title);});
    if(copy && copy.parentElement===heading && !copy.classList.contains('section-heading-copy')){
      var titleWrap=document.createElement('div');
      titleWrap.className='section-heading-copy';
      heading.insertBefore(titleWrap,heading.firstChild);
      Array.from(heading.children).forEach(function(node){
        if(node!==titleWrap && node.tagName!=='BUTTON') titleWrap.appendChild(node);
      });
    }
    var button=document.createElement('button');
    button.type='button';
    button.className='section-fold-toggle';
    button.setAttribute('aria-expanded','true');
    button.setAttribute('aria-controls',content.id);
    button.innerHTML='<span class="fold-label">إخفاء التفاصيل</span><span class="fold-chevron" aria-hidden="true">⌃</span>';
    section.classList.add('section-is-open');
    button.addEventListener('click',function(){
      var opening=button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(opening));
      content.hidden=!opening;
      button.querySelector('.fold-label').textContent=opening?'إخفاء التفاصيل':'عرض التفاصيل';
      if(opening) section.classList.add('section-is-open'); else section.classList.remove('section-is-open');
    });
    heading.appendChild(button);
    section.appendChild(content);
    section.dataset.foldReady='true';
  }
  function init(){
    var sections=Array.from(document.querySelectorAll('main section.section, main section.products-section, main section.blend-section, main section.advisor-section, main section.gift-section, main section.category-section, main .taxonomy-public-section'));
    sections.forEach(function(section,index){setupFold(section,index+1);});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
;

/* ===== MODULE 7: blending-atelier.js ===== */
;
/* Interactive blending atelier: progressive guidance, family shortcuts, live summary. */
(function(){
'use strict';
function init(){
 var section=document.getElementById('blend'),panel=section&&section.querySelector('.blend-panel');
 if(!section||!panel||section.dataset.blendAtelierReady==='1')return;
 section.dataset.blendAtelierReady='1';
 var oil=document.getElementById('blendOil'),family=document.getElementById('blendScent'),size=document.getElementById('blendSize'),bottle=document.getElementById('blendBottle');
 if(!oil||!family||!size||!bottle)return;
 var intro=document.createElement('div');intro.className='blend-intro';intro.innerHTML='<div class="blend-intro-card"><h3>اصنع بصمتك العطرية</h3><p>اختَر طابع الرائحة، ثم الحجم والعبوة. يمكنك تحديد زيت من الكتالوج أو ترك الاختيار للمتجر، وبعدها أضف طلبك للسلة وأرسله عبر واتساب للمراجعة.</p></div><div class="blend-intro-card"><h3>اختيار واضح قبل الطلب</h3><p>السعر الظاهر تقديري وفق قائمة البيع المسجلة. لا نعرض سعر المورد للعميل، ويؤكد المتجر التوفر والتكلفة النهائية قبل تجهيز التركيبة.</p></div>';
 var steps=document.createElement('div');steps.className='blend-steps';steps.setAttribute('aria-label','خطوات تركيب العطر');steps.innerHTML='<div class="blend-step-chip"><b>١</b><span>حدّد العائلة العطرية</span></div><div class="blend-step-chip"><b>٢</b><span>اختر الزيت والحجم</span></div><div class="blend-step-chip"><b>٣</b><span>راجع الطلب وأضفه للسلة</span></div>';
 var heading=section.querySelector('.section-heading');if(!heading)return;heading.insertAdjacentElement('afterend',intro);intro.insertAdjacentElement('afterend',steps);
 var familyStep=family.closest('.blend-step');
 if(familyStep){familyStep.classList.add('blend-family-picker');var label=familyStep.querySelector('label');var shortcuts=document.createElement('div');shortcuts.className='blend-family-options';shortcuts.setAttribute('aria-label','اختيارات سريعة للعائلة العطرية');var choices=[['شرقي','شرقي دافئ'],['خشبي','خشبي أنيق'],['زهري','زهري ناعم'],['منعش','منعش وحيوي'],['حلو','حلو وفانيليا'],['مسكي','مسكي نظيف'],['عود وخشبي','عود وخشبي'],['حمضي ومنعش','حمضي ومنعش']];
 choices.forEach(function(item){var b=document.createElement('button');b.type='button';b.className='blend-family-option';b.textContent=item[1];b.dataset.family=item[0];b.setAttribute('aria-pressed',String(family.value===item[0]));b.addEventListener('click',function(){family.value=item[0];family.dispatchEvent(new Event('change',{bubbles:true}));sync()});shortcuts.appendChild(b)});(label||familyStep).insertAdjacentElement('afterend',shortcuts)}
 var live=document.createElement('div');live.className='blend-live-summary';live.setAttribute('aria-live','polite');var summary=panel.querySelector('.blend-summary');if(summary)summary.insertAdjacentElement('afterend',live);
 var note=document.createElement('p');note.className='blend-footnote';note.textContent='تنبيه: اختيار العائلة يصف الطابع المرغوب ولا يعني خلط زيوت متعددة تلقائيًا. تفاصيل المكونات النهائية يراجعها المتجر معك.';panel.appendChild(note);
 function esc(v){return String(v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function refreshPrice(){var defaults={'3':50,'5':75,'10':100,'22':130,'30':100,'50':150,'100':300};try{var cfg=JSON.parse(localStorage.getItem('mamlaka_catalog_taxonomy_config_v1')||'null');if(cfg&&Array.isArray(cfg.retailBlendPrices)){cfg.retailBlendPrices.forEach(function(item){var n=String(item.size||'').match(/[0-9]+/),v=Number(item.price);if(n&&Number.isFinite(v)&&v>=50)defaults[n[0]]=v})}}catch(e){}var el=document.getElementById('blendPrice'),value=defaults[String(size.value)]||50;if(el)el.textContent=value.toLocaleString('ar-EG')+' ج.م';return value}
 function sync(){var selectedOil=oil.options[oil.selectedIndex];var oilName=selectedOil&&selectedOil.value?selectedOil.textContent:'اختيار الزيت بمساعدة المتجر';var sizeText=size.options[size.selectedIndex]?size.options[size.selectedIndex].textContent:size.value+' مل';var bottleText=bottle.options[bottle.selectedIndex]?bottle.options[bottle.selectedIndex].textContent:bottle.value;var amount=refreshPrice();live.innerHTML='<span>✧ <b>الطابع:</b> '+esc(family.options[family.selectedIndex]?.textContent||family.value)+'</span><span>◈ <b>الزيت:</b> '+esc(oilName)+'</span><span>◇ <b>الحجم:</b> '+esc(sizeText)+'</span><span>♢ <b>العبوة:</b> '+esc(bottleText)+'</span><span>ج.م <b>السعر المرجعي:</b> '+amount.toLocaleString('ar-EG')+'</span>';Array.prototype.forEach.call(section.querySelectorAll('.blend-family-option'),function(b){b.setAttribute('aria-pressed',String(b.dataset.family===family.value))})}
 [oil,family,size,bottle].forEach(function(el){el.addEventListener('change',sync)});document.addEventListener('mamlaka:products-updated',sync);document.addEventListener('mamlaka:supplier-catalog-updated',sync);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
;