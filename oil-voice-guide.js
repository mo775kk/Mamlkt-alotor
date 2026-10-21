(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const status = (message) => { const node=$("#oilVoiceStatus"); if(node) node.textContent=message; };
  const showAnswer = (title, body, extra="") => {
    const node=$("#oilMentorAnswer"); if(!node)return;
    node.replaceChildren();
    const heading=document.createElement("strong"); heading.textContent=title; node.appendChild(heading);
    const paragraph=document.createElement("p"); paragraph.textContent=body; node.appendChild(paragraph);
    if(extra){const note=document.createElement("p");note.textContent=extra;node.appendChild(note);}
  };
  const speak = (text) => {
    if(!("speechSynthesis" in window)){status("الشرح مكتوب؛ القراءة الصوتية غير مدعومة في هذا المتصفح.");return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(String(text||""));
    utterance.lang="ar-EG";utterance.rate=.92;utterance.pitch=1;
    utterance.onstart=()=>status("المرشد يتحدث الآن… اضغط إيقاف الصوت عند الحاجة.");
    utterance.onend=()=>status("انتهى الشرح. يمكنك سؤال المرشد عن نوع آخر.");
    utterance.onerror=()=>status("تعذر تشغيل الصوت؛ يمكنك قراءة الشرح المكتوب.");
    window.speechSynthesis.speak(utterance);
  };
  const guides=[
    {keys:["حمضي","منعش","ليمون","برغموت"],title:"مرشد الحمضيات والانتعاش",text:"العائلة الحمضية غالبًا ما تعطي انطباعًا مشرقًا وحيويًا، وتشيع فيها روائح الليمون والبرغموت والجريب فروت. تناسب محبي البداية النظيفة والخفيفة. قد تساعد قاعدة خشبية أو مسكية على إضافة الدفء، لكن الأداء يختلف من تركيبة لأخرى."},
    {keys:["زهري","وردي","ورد","ياسمين"],title:"مرشد العائلة الزهرية",text:"العائلة الزهرية قد تكون ناعمة وشفافة أو غنية وكريمية. الورد يعطي انطباعًا ورديًا، والياسمين قد يكون أبيض غنيًا. النتيجة النهائية تتغير حسب بقية المكونات، لذا جرّب العينة قبل اعتماد الاختيار."},
    {keys:["مسك","نظيف"],title:"مرشد المسك",text:"المسك قد يعطي إحساسًا ناعمًا ونظيفًا أو دافئًا وبودريًا. كلمة مسك وحدها لا تحدد الرائحة بدقة؛ اطلب عينة وقارنها بعد مرور الوقت."},
    {keys:["عود","خشبي","خشب"],title:"مرشد العود والأخشاب",text:"العائلة الخشبية قد تكون جافة أو كريمية أو راتنجية أو مدخنة. العود قد يبدو عميقًا وشرقيًا، والصندل أنعم وكريميًا، والأرز أكثر جفافًا. لا يمكن استنتاج النوتات الفعلية لزيت المورد من اسمه وحده."},
    {keys:["عنبر","شرقي","توابل"],title:"مرشد الروائح الشرقية",text:"الطابع الشرقي قد يجمع الدفء والتوابل والراتنجات والأخشاب، وقد يكون حلوًا أو جافًا أو دخانيًا. اختبر العينة بكمية صغيرة أولًا."},
    {keys:["حلو","فانيليا","سكر","فانيلا"],title:"مرشد الروائح الحلوة",text:"العائلة الحلوة أو الغورماند قد تذكّر بالفانيليا أو الكراميل أو الحلوى. قد تبدو ثقيلة لبعض الأشخاص؛ جرّبها في الجو الذي ستستخدمها فيه."},
    {keys:["مقدمة","قلب","قاعدة","نوتات"],title:"مرشد هرم النوتات",text:"المقدمة هي الانطباع الأول، والقلب يظهر مع تطور العطر، والقاعدة هي الجانب الذي يبقى لاحقًا. هذا تقسيم وصفي وليس كشفًا للصيغة الكيميائية. إذا لم تكن نوتات الزيت موثقة فلن نخترعها."},
    {keys:["تركيب","جرام","حجم","سعر"],title:"مرشد التركيب والطلب",text:"حدد العائلة التي تفضلها، ثم اختر الزيت وجرّب عينة قبل اعتماد كمية أكبر. السعر الظاهر مرجعي وفق إعدادات المتجر، والتوفر والتكلفة النهائية يحتاجان إلى تأكيد. لا تستخدم الزيت المركز على الجلد دون تعليمات تخفيف مناسبة."}
  ];
  const normalize = (value) => String(value||"").toLocaleLowerCase("ar").normalize("NFKC").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}]+/gu," ").trim();
  function runQuery(query){
    const text=String(query||"").trim();if(!text)return;
    const normalized=normalize(text);
    const guide=guides.find(item=>item.keys.some(key=>normalized.includes(normalize(key))));
    if(guide){showAnswer(guide.title,guide.text);speak(guide.text);return;}
    const search=$("#supplierOilSearch");
    if(search){search.value=text.replace(/^(ابحث عن|دور على|عايز|عاوز|اسم الزيت|الزيت)\s+/,"");search.dispatchEvent(new Event("input",{bubbles:true}));}
    window.setTimeout(()=>{
      const cards=[...document.querySelectorAll("#supplierOilProducts .product-card")];
      if(!cards.length){const message="لم أعثر على نتيجة ظاهرة. تأكد أن كتالوج الموردين مستورد، وجرّب كتابة الاسم بالإنجليزية أو استخدم التصنيفات.";showAnswer("لم يظهر تطابق مؤكد",message);status(message);return;}
      const first=cards[0],name=first.querySelector("h3")?.textContent||"الزيت الأول في نتائج البحث";
      const details=first.querySelector('[data-action="details"]');
      const message="وجدت نتيجة باسم "+name+". افتح زر التفاصيل لمراجعة المعلومات المسجلة. إذا لم تكن النوتات موثقة فسأوضح ذلك بدل تخمينها.";
      showAnswer("مرشد النوع: "+name,message);
      if(details){details.click();window.setTimeout(()=>{
        const modal=$("#modalContent");
        if(!modal)return;
        const description=modal.querySelector(".modal-description")?.textContent||"الوصف غير متوفر.";
        const facts=[...modal.querySelectorAll(".modal-facts p")].map(p=>p.innerText).join(". ");
        const notes=modal.querySelector(".fragrance-note-pyramid")?.innerText||"النوتات العطرية غير موثقة.";
        const speech=[name,description,facts,notes].join(". ");
        const current=$("#oilMentorAnswer");
        if(current){const p=document.createElement("p");p.textContent=speech;current.appendChild(p);}
        speak(speech);
      },100);}
    },120);
  }
  const ask=$("#oilVoiceAsk");
  if(ask)ask.addEventListener("click",()=>{
    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){status("التعرف على الكلام غير متاح في هذا المتصفح. استخدم البحث الكتابي أعلى الكتالوج.");$("#supplierOilSearch")?.focus();return;}
    const recognition=new Recognition();recognition.lang="ar-EG";recognition.interimResults=false;recognition.maxAlternatives=3;
    ask.disabled=true;ask.textContent="🎙 استمع الآن…";status("تحدث الآن: اذكر اسم الزيت أو اسأل عن عائلة عطرية.");
    recognition.onresult=event=>{const transcript=event.results?.[0]?.[0]?.transcript||"";status("سمعت: "+transcript);runQuery(transcript);};
    recognition.onerror=event=>status(event.error==="not-allowed"?"اسمح للمتصفح باستخدام الميكروفون ثم حاول مجددًا.":"لم ألتقط الكلام بوضوح. جرّب مجددًا أو اكتب الاسم.");
    recognition.onend=()=>{ask.disabled=false;ask.textContent="🎙 ابحث وتحدّث صوتيًا";};
    try{recognition.start();}catch{ask.disabled=false;ask.textContent="🎙 ابحث وتحدّث صوتيًا";status("تعذر تشغيل الميكروفون. تحقق من الإذن واتصال HTTPS.");}
  });
  const teach=$("#oilVoiceTeach");
  if(teach)teach.addEventListener("click",()=>{
    const lesson="مرحبًا بك في مرشد الزيوت العطرية بمملكة العطور. أولًا اختر الفئة والعائلة العطرية. ثانيًا ابحث باسم الزيت أو استخدم الميكروفون. ثالثًا افتح التفاصيل وراجع النوتات والمصدر إذا توفرا. رابعًا جرّب عينة قبل الشراء. خامسًا أكد السعر والتوفر مع المتجر. مرشد التصنيف يساعدك في العائلة، ومرشد النوتات يشرح المقدمة والقلب والقاعدة، ومرشد التركيب يوضح الحجم والسعر المرجعي، ومرشد التحقق يميز الموثق من التقديري.";
    showAnswer("خريطة رحلة العميل والمرشدين",lesson,"التصنيف ← البحث الصوتي أو الكتابي ← تفاصيل المنتج ومصدره ← تجربة العينة ← تأكيد الطلب.");
    speak(lesson);
  });
  const stop=$("#oilVoiceStop");if(stop)stop.addEventListener("click",()=>{if("speechSynthesis"in window)window.speechSynthesis.cancel();status("تم إيقاف القراءة الصوتية.");});
  document.addEventListener("click",event=>{
    const link=event.target.closest("[data-scent-family]");if(!link)return;
    const key=normalize(link.dataset.scentFamily||"");const guide=guides.find(item=>item.keys.some(word=>key.includes(normalize(word))));
    if(guide){showAnswer(guide.title,guide.text);}
  });
})();