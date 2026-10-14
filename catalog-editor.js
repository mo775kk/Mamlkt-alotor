/* MAMLKAT AL-OTOR: editable supplier catalog, classifications and prices */
(() => {
'use strict';
const KEY='mamlaka_supplier_catalog_v1', TAXKEY='mamlaka_catalog_taxonomy_config_v1';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaultConfig={
 retailBlendPrices:[{size:'3 مل',price:50},{size:'5 مل',price:75},{size:'10 مل',price:100},{size:'22 مل',price:130},{size:'30 مل',price:150},{size:'50 مل',price:200},{size:'100 مل',price:450}],
 productTypes:[{id:'ready',labelAr:'عطر جاهز'},{id:'oil',labelAr:'زيت عطري مركز / تركيب'},{id:'bakhoor',labelAr:'عود وبخور'},{id:'gift',labelAr:'هدايا وتغليف'},{id:'diffuser',labelAr:'زيت فواحة'}],
 categories:[{id:'MEN',labelAr:'رجالي'},{id:'WOMEN',labelAr:'نسائي'},{id:'UNISEX',labelAr:'للجنسين'},{id:'ORIENTAL',labelAr:'شرقي'},{id:'KIDS',labelAr:'أطفال'},{id:'DIFFUSER',labelAr:'فواحات'}],
 families:[
 {id:'حمضي ومنعش',labelEn:'Citrus / Fresh',nature:'منعش وخفيف أو مائي أو حمضي',notes:'حمضيات أو فواكه منعشة؛ نوتات مائية/خضراء محتملة؛ مسك أو أخشاب في القاعدة.'},
 {id:'زهري ووردي',labelEn:'Floral / Rose',nature:'زهري من ناعم وبودري إلى غني ووردي',notes:'ورد أو زهور بيضاء بحسب الإصدار؛ مسك أو أخشاب محتملة في القاعدة.'},
 {id:'مسكي ونظيف',labelEn:'Musk / Clean',nature:'ناعم ونظيف وقريب من رائحة الجلد',notes:'مسك؛ قطن نظيف؛ أخشاب ناعمة محتملة.'},
 {id:'حلو وفانيليا',labelEn:'Gourmand / Sweet',nature:'حلو؛ قد يميل للفانيليا أو الكراميل أو القهوة أو الفاكهة',notes:'فانيليا أو حلوى؛ قهوة/فاكهة محتملة؛ عنبر أو مسك في القاعدة.'},
 {id:'عنبر وشرقي',labelEn:'Amber / Oriental',nature:'دافئ وغني وقد يكون راتنجيًا أو متبلًا أو بخوريًا',notes:'عنبر أو توابل محتملة؛ راتنجات/بخور؛ أخشاب أو مسك.'},
 {id:'عود وخشبي',labelEn:'Oud / Woody',nature:'خشبي دافئ؛ قد يكون جافًا أو راتنجيًا أو مدخنًا',notes:'أخشاب؛ عود/صندل حسب الإصدار؛ راتنجات أو توابل محتملة.'},
 {id:'جلدي وتبغي',labelEn:'Leather / Tobacco',nature:'جلدي أو مدخن أو تبغي ودافئ',notes:'جلد أو تبغ كطابع عطري؛ توابل/أخشاب؛ عنبر أو فانيليا محتملة.'},
 {id:'عطري وأخضر',labelEn:'Aromatic / Green',nature:'أخضر أو عشبي أو عطري ونظيف',notes:'أعشاب أو أوراق خضراء؛ لافندر/توابل محتملة؛ أخشاب أو مسك.'},
 {id:'غير محدد',labelEn:'Unclassified',nature:'يلزم تقييم العينة أو الرجوع إلى بيانات المورد',notes:'التصنيف غير مؤكد من الاسم وحده.'}
 ]};
const loadConfig=()=>{try{return {...defaultConfig,...JSON.parse(localStorage.getItem(TAXKEY)||'{}')}}catch{return structuredClone(defaultConfig)}};
const saveConfig=c=>localStorage.setItem(TAXKEY,JSON.stringify(c));
const readCatalog=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return d&&Array.isArray(d.products)?d:null}catch{return null}};
const saveCatalog=d=>{d.taxonomyConfig=loadConfig();d.metadata=d.metadata||{};d.metadata.lastEditedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(d))};
const prices=[['1 كجم','price_1kg'],['500 جم','price_500g'],['250 جم','price_250g'],['125 جم','price_125g'],['50 جم','price_50g']];
const num=v=>v===''||v==null?null:Number(v);
function mount(){
 const nav=$('.admin-tabs'),content=$('#adminContent'); if(!nav||!content||$('#catalogEditorPage'))return;
 const tab=document.createElement('button');tab.type='button';tab.dataset.tab='catalog-editor';tab.textContent='إدارة الأنواع والأسعار';nav.append(tab);
 const page=document.createElement('section');page.className='admin-page hidden';page.dataset.page='catalog-editor';page.id='catalogEditorPage';
 page.innerHTML=`
 <h3>إدارة التصنيف والأنواع والأسعار</h3>
 <p class="admin-note">عدّل البيانات من النماذج ثم اضغط حفظ. تغييرات الكتالوج تحفظ في هذا المتصفح فقط؛ صدّر نسخة JSON احتياطية بعد كل تحديث، ثم يمكن استيرادها في متصفح آخر.</p>
 <div class="admin-actions"><button type="button" class="btn btn-gold" id="ceExport">تصدير الكتالوج بعد التعديل</button><button type="button" class="btn btn-outline" id="ceImportBtn">استيراد نسخة كتالوج</button><input id="ceImportFile" type="file" accept=".json,application/json" hidden><button type="button" class="btn btn-outline" id="ceNewProduct">إضافة نوع زيت جديد</button></div>
 <div class="admin-grid"><label>ابحث بالاسم أو الكود<input id="ceSearch" placeholder="اكتب اسم العطر أو كود المورد"></label><label>اختيار المنتج للتعديل<select id="ceProduct"></select></label></div>
 <div id="ceStatus" class="admin-note" aria-live="polite"></div>
 <form id="ceProductForm" class="admin-form">
 <h4>بيانات النوع والأسعار</h4><div class="admin-grid">
 <label>الاسم الإنجليزي<input id="ceNameEn" required></label><label>الاسم العربي<input id="ceNameAr"></label><label>كود المورد / SKU<input id="ceSku" required></label>
 <label>القسم<select id="ceCategory"></select></label><label>خط المورد<select id="ceLine"><option value="Golden">Golden</option><option value="Niche">Niche</option><option value="Local">محلي</option><option value="Custom">مخصص</option></select></label><label>العائلة العطرية<select id="ceFamily"></select></label>
 <label>نوع المنتج<select id="ceType"></select></label><label>طبيعة الرائحة<input id="ceNature" placeholder="مثال: خشبي دافئ وناعم"></label><label>النوتات/الطابع العام<input id="ceNotes" placeholder="علوي، وسطى، قاعدية بعد التحقق"></label>
 </div><h4>أسعار المورد (جنيه مصري — قبل الضريبة)</h4><div class="admin-grid">${prices.map(([label,key])=>`<label>${label}<input type="number" min="0" step="0.01" id="ce_${key}" inputmode="decimal"></label>`).join('')}
 <label>نسبة الضريبة %<input id="ceVatRate" type="number" min="0" max="100" step="0.1" value="14"></label>
 </div><div class="admin-actions"><button class="btn btn-gold" type="submit">حفظ بيانات النوع والأسعار</button><button class="btn btn-outline" type="button" id="ceDeleteProduct">حذف النوع من الكتالوج</button></div></form>
 <hr><h3>إدارة قوائم التصنيف</h3><div class="admin-grid">
 <label>نوع القائمة<select id="ceListType"><option value="families">العائلات العطرية</option><option value="categories">الأقسام</option><option value="productTypes">أنواع المنتجات</option></select></label>
 <label>العنصر الحالي للتعديل<select id="ceListItem"></select></label><label>الاسم العربي / المعروض<input id="ceListLabel"></label><label>الاسم الإنجليزي أو المعرّف<input id="ceListEn"></label>
 <label>طبيعة الرائحة / الوصف<input id="ceListNature"></label><label>النوتات / التفاصيل<input id="ceListNotes"></label>
 </div><div class="admin-actions"><button class="btn btn-gold" id="ceSaveList" type="button">حفظ عنصر التصنيف</button><button class="btn btn-outline" id="ceAddList" type="button">عنصر تصنيف جديد</button><button class="btn btn-outline" id="ceDeleteList" type="button">حذف العنصر المحدد</button><button class="btn btn-outline" id="ceExportTax" type="button">تصدير ملف التصنيف JSON</button></div>
 <h3>أسعار بيع التركيب حسب الحجم</h3><p class="admin-note">هذه أسعار بيع التجزئة المرجعية للتركيب، منفصلة عن تكلفة زيت المورد. عدّلها واحفظها ثم صدّر ملف التصنيف والكتالوج.</p><div id="ceRetailPrices" class="admin-grid"></div><div class="admin-actions"><button class="btn btn-gold" id="ceSaveRetailPrices" type="button">حفظ أسعار بيع التركيب</button></div><p class="admin-note">تعديل أسماء الأقسام أو العائلات يحدّث إعدادات الكتالوج المحلي. لإظهار أي تصنيف أو سعر جديد في واجهة المتجر العامة، يلزم ربط إعداداته بواجهة البيع؛ الحفظ الحالي يحدّث ملف الكتالوج وإعداداته القابلة للتصدير.</p>`;
 content.append(page);
 const style=document.createElement('style');style.textContent='#catalogEditorPage .admin-form{margin-top:16px;border:1px solid #d4af3744;border-radius:12px;padding:14px}#catalogEditorPage h4{margin:14px 0 8px;color:#f1d77a}#catalogEditorPage .admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:12px 0}#catalogEditorPage label{display:flex;flex-direction:column;gap:5px;font-size:13px}#catalogEditorPage input,#catalogEditorPage select{width:100%;min-width:0;padding:10px;border:1px solid #d4af3755;border-radius:8px;background:#14120e;color:#f8f0d4}#catalogEditorPage .admin-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}#catalogEditorPage hr{border:0;border-top:1px solid #d4af3744;margin:24px 0}';document.head.append(style);
 let selectedIndex=-1;
 const config=()=>loadConfig();
 function fillSelects(){
 const c=config();
 const rp=$('#ceRetailPrices'); if(rp) rp.innerHTML=(c.retailBlendPrices||[]).map((x,i)=>`<label>سعر ${esc(x.size)}<input type="number" min="0" step="0.01" data-retail-index="${i}" value="${Number(x.price)||0}"></label>`).join('');
 $('#ceCategory').innerHTML=c.categories.map(x=>`<option value="${esc(x.id)}">${esc(x.labelAr)} (${esc(x.id)})</option>`).join('');
 $('#ceFamily').innerHTML=c.families.map(x=>`<option value="${esc(x.id)}">${esc(x.id)}</option>`).join('');
 $('#ceType').innerHTML=c.productTypes.map(x=>`<option value="${esc(x.id)}">${esc(x.labelAr)}</option>`).join('');
 refreshListItems();
 }
 function catalog(){return readCatalog()}
 function refreshProducts(){
 const d=catalog(),q=($('#ceSearch').value||'').toLowerCase().trim(),sel=$('#ceProduct'),old=sel.value;
 if(!d){sel.innerHTML='<option value="">استورد كتالوج الموردين أولًا</option>';$('#ceStatus').textContent='لم يتم استيراد كتالوج الموردين بعد. استخدم زر الاستيراد أو افتح تبويب كتالوج الموردين.';return}
 const matches=d.products.map((p,i)=>({p,i})).filter(({p})=>!q||[p.name_ar,p.name_en,p.sku].some(v=>String(v||'').toLowerCase().includes(q)));
 sel.innerHTML=matches.map(({p,i})=>`<option value="${i}">${esc(p.name_ar||p.name_en)} — ${esc(p.sku||'بدون كود')}</option>`).join('')||'<option value="">لا توجد نتائج</option>';
 if([...sel.options].some(o=>o.value===old))sel.value=old;
 selectedIndex=Number(sel.value);$('#ceStatus').textContent=`عدد المنتجات في الكتالوج: ${d.products.length} · المطابق للبحث: ${matches.length}`;
 if(sel.value!=='')loadProduct(Number(sel.value));
 }
 function loadProduct(i){
 const d=catalog();if(!d||!d.products[i])return;selectedIndex=i;const p=d.products[i];
 $('#ceNameEn').value=p.name_en||'';$('#ceNameAr').value=p.name_ar||'';$('#ceSku').value=p.sku||'';
 $('#ceCategory').value=p.category||config().categories[0]?.id||'MEN';$('#ceLine').value=p.line||'Golden';
 $('#ceFamily').value=p.scentFamily||p.chemicalProfileId||config().families[config().families.length-1]?.id||'غير محدد';
 $('#ceType').value=p.productType||'oil';$('#ceNature').value=p.scentNature||'';$('#ceNotes').value=p.scentNotesProfile||'';
 $('#ceVatRate').value=Number(p.vat_rate??14);
 prices.forEach(([label,key])=>$('#ce_'+key).value=p[key]??'');
 }
 function refreshListItems(){
 const c=config(),type=$('#ceListType').value,arr=c[type]||[];
 $('#ceListItem').innerHTML=arr.map((x,i)=>`<option value="${i}">${esc(x.labelAr||x.id)}${x.id&&x.id!==(x.labelAr||'')?' — '+esc(x.id):''}</option>`).join('')||'<option value="">لا توجد عناصر</option>';
 loadListItem(Number($('#ceListItem').value));
 }
 function loadListItem(i){
 const c=config(),arr=c[$('#ceListType').value]||[],x=arr[i];if(!x){$('#ceListLabel').value='';$('#ceListEn').value='';$('#ceListNature').value='';$('#ceListNotes').value='';return}
 $('#ceListLabel').value=x.id||x.labelAr||'';$('#ceListEn').value=x.labelEn||x.labelAr||'';$('#ceListNature').value=x.nature||'';$('#ceListNotes').value=x.notes||'';
 }
 $('#ceProduct').addEventListener('change',()=>{if($('#ceProduct').value!=='')loadProduct(Number($('#ceProduct').value))});
 $('#ceSearch').addEventListener('input',refreshProducts);
 $('#ceProductForm').addEventListener('submit',e=>{
 e.preventDefault();const d=catalog();if(!d){alert('استورد كتالوج الموردين أولًا');return}
 const i=selectedIndex,p=i>=0&&d.products[i]?d.products[i]:{};
 const sku=$('#ceSku').value.trim();if(!sku){alert('أدخل كودًا أو معرفًا فريدًا للنوع');return}
 if(d.products.some((x,j)=>j!==i&&String(x.sku||'').toLowerCase()===sku.toLowerCase())){alert('هذا الكود موجود بالفعل؛ اختر كودًا مختلفًا.');return}
 Object.assign(p,{name_en:$('#ceNameEn').value.trim(),name_ar:$('#ceNameAr').value.trim(),sku,category:$('#ceCategory').value,line:$('#ceLine').value,scentFamily:$('#ceFamily').value,chemicalProfileId:$('#ceFamily').value,productType:$('#ceType').value,scentNature:$('#ceNature').value.trim(),scentNotesProfile:$('#ceNotes').value.trim(),currency:'EGP',vat_rate:num($('#ceVatRate').value)??14});
 prices.forEach(([label,key])=>{p[key]=num($('#ce_'+key).value);p[key+'_vat']=p[key]==null?null:Math.round(p[key]*(1+(p.vat_rate/100))*100)/100});
 if(i<0){if(d.products.some(x=>String(x.name_en||'').toLowerCase()===p.name_en.toLowerCase())){alert('اسم المنتج موجود بالفعل؛ عدّل المنتج الحالي بدل التكرار.');return}d.products.push(p);selectedIndex=d.products.length-1}else d.products[i]=p;
 saveCatalog(d);refreshProducts();$('#ceProduct').value=String(selectedIndex);loadProduct(selectedIndex);alert('تم حفظ بيانات النوع والأسعار في هذا المتصفح. صدّر نسخة احتياطية لحفظها خارج الجهاز.');
 });
 $('#ceNewProduct').addEventListener('click',()=>{selectedIndex=-1;$('#ceProduct').value='';$('#ceNameEn').value='';$('#ceNameAr').value='';$('#ceSku').value='';$('#ceNature').value='';$('#ceNotes').value='';prices.forEach(([l,k])=>$('#ce_'+k).value='');$('#ceStatus').textContent='إضافة نوع جديد: املأ الحقول ثم اضغط حفظ.'});
 $('#ceDeleteProduct').addEventListener('click',()=>{const d=catalog();if(!d||selectedIndex<0||!d.products[selectedIndex]){alert('اختر منتجًا لحذفه');return}if(!confirm('حذف هذا النوع من الكتالوج المحلي؟'))return;d.products.splice(selectedIndex,1);saveCatalog(d);selectedIndex=-1;refreshProducts();alert('تم الحذف من النسخة المحلية.');});
 $('#ceListType').addEventListener('change',refreshListItems);$('#ceListItem').addEventListener('change',()=>loadListItem(Number($('#ceListItem').value)));
 $('#ceAddList').addEventListener('click',()=>{$('#ceListItem').value='';$('#ceListLabel').value='';$('#ceListEn').value='';$('#ceListNature').value='';$('#ceListNotes').value='';$('#ceListLabel').focus()});
 $('#ceSaveList').addEventListener('click',()=>{
 const c=config(),type=$('#ceListType').value,arr=c[type]||[],i=Number($('#ceListItem').value),label=$('#ceListLabel').value.trim(),en=$('#ceListEn').value.trim();
 if(!label){alert('اكتب اسم العنصر أولًا');return}
 const item=type==='families'?{id:label,labelEn:en||label,nature:$('#ceListNature').value.trim(),notes:$('#ceListNotes').value.trim()}:{id:en||label,labelAr:label,labelEn:en||label};
 if(type==='families'){item.labelAr=label}
 if($('#ceListItem').value!==''&&arr[i])arr[i]=item;else arr.push(item);
 c[type]=arr;saveConfig(c);
 const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}
 fillSelects();$('#ceListType').value=type;refreshListItems();alert('تم حفظ عنصر التصنيف محليًا. صدّر ملف التصنيف والكتالوج للاحتفاظ بالتغييرات.');
 });
 $('#ceDeleteList').addEventListener('click',()=>{
 const c=config(),type=$('#ceListType').value,arr=c[type]||[],i=Number($('#ceListItem').value);if(!arr[i]){alert('اختر عنصرًا للحذف');return}
 if(!confirm('حذف عنصر التصنيف المحدد؟'))return;arr.splice(i,1);c[type]=arr;saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}fillSelects();
 });
 function download(name,data){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200)}
 $('#ceExport').addEventListener('click',()=>{const d=catalog();if(!d){alert('استورد الكتالوج أولًا');return}d.taxonomyConfig=config();download('mamlakat-al-otor-catalog-updated.json',d)});
 $('#ceSaveRetailPrices').addEventListener('click',()=>{const c=config();c.retailBlendPrices=(c.retailBlendPrices||[]).map((x,i)=>({...x,price:num($(`[data-retail-index="${i}"]`)?.value)??0}));saveConfig(c);const d=catalog();if(d){d.taxonomyConfig=c;saveCatalog(d)}alert('تم حفظ أسعار بيع التركيب في إعدادات الكتالوج المحلي. صدّر ملف JSON للاحتفاظ بها.');});
 $('#ceExportTax').addEventListener('click',()=>download('mamlakat-al-otor-taxonomy-updated.json',{schemaVersion:1,language:'ar',...config(),importantNotice:'التصنيف وصفي وليس تحليلًا مخبريًا. لا تعتبر أمثلة المواد الكيميائية مكونات مؤكدة لأي منتج.'}));
 $('#ceImportBtn').addEventListener('click',()=>$('#ceImportFile').click());
 $('#ceImportFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.products)||!d.metadata)throw Error('ملف الكتالوج غير صحيح');if(!confirm('استبدال الكتالوج المحلي بـ '+d.products.length+' منتجًا؟'))return;localStorage.setItem(KEY,JSON.stringify(d));if(d.taxonomyConfig){saveConfig({...defaultConfig,...d.taxonomyConfig})}refreshProducts();alert('تم استيراد الكتالوج.')}catch(err){alert(err.message||'تعذر الاستيراد')}finally{e.target.value=''}});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-tab="catalog-editor"]');if(!b)return;nav.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));content.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('hidden',x.dataset.page==='catalog-editor'?false:true));fillSelects();refreshProducts()});
 fillSelects();refreshProducts();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();