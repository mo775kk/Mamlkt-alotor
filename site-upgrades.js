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
        const report = { schemaVersion: 2, generatedAt: new Date().toISOString(), source: "data/products.json",
          summary: { total: products.length, duplicateIds: duplicateIds.length, duplicateNames: duplicateNames.length, missingName: missingName.length, missingSource: missingSource.length, missingNotePyramid: missingPyramid.length, missingPrice: missingPrice.length, missingImage: missingImage.length, notAvailable: notAvailable.length, needsReview },
          duplicateIds, duplicateNames, missingName, missingSource, missingNotePyramid: missingPyramid, missingPrice, missingImage, notAvailable };
        output.innerHTML = "<strong>نتيجة فحص الكتالوج</strong><p>إجمالي المنتجات: " + report.summary.total + " · معرّفات مكررة: " + duplicateIds.length + " · أسماء محتملة التكرار: " + duplicateNames.length + " · بلا مصدر: " + missingSource.length + " · هرم عطري ناقص: " + missingPyramid.length + "</p><p>بلا سعر: " + missingPrice.length + " · بلا صورة: " + missingImage.length + " · غير معتمد للبيع: " + notAvailable.length + " · تحتاج مراجعة: " + needsReview + "</p><p class=\"admin-note\">غياب السعر أو الصورة تنبيه لإكمال البيانات، وليس إذنًا بتخمينها. التكرار بالاسم تنبيه للمراجعة فقط؛ قد توجد إصدارات مختلفة بالاسم المتشابه. لم يتم تعديل أي بيانات.</p>";
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