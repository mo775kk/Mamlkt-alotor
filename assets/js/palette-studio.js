(function(){
"use strict";
const KEY="mamlaka_palette_preset_v1";
const presets=[
 {id:"royal",name:"الملكي الأسود والذهبي",desc:"فخامة كلاسيكية وهوية المتجر الأساسية",swatches:["#090a0c","#d6ad54","#f5d98b"]},
 {id:"emerald",name:"الزمردي الملكي",desc:"أخضر زمردي عميق مع ذهب شامبين",swatches:["#071713","#2d8a70","#e4c77b"]},
 {id:"midnight",name:"الأزرق الليلي",desc:"أزرق ملكي داكن مع فضي دافئ",swatches:["#0a1224","#5279bb","#dce6f5"]},
 {id:"ivory",name:"العاجي الراقي",desc:"خلفية عاجية هادئة ونص داكن ولمسات ذهبية",swatches:["#f4efe4","#b08b48","#25231e"]},
 {id:"burgundy",name:"العنابي الملكي",desc:"عنابي عميق مع نحاسي وذهبي معتّق",swatches:["#210b13","#8f3048","#d8b36a"]},
 {id:"rose",name:"الوردي المخملي",desc:"وردي غباري وفحمي ولمسة شامبين",swatches:["#21171c","#b77e8d","#ead6b8"]},
 {id:"desert",name:"رمال الصحراء",desc:"درجات الرمل والجلد والبني الدافئ",swatches:["#302319","#b58a5a","#f0dfc1"]},
 {id:"graphite",name:"الجرافيت الفضي",desc:"فحمي عصري مع فضي بارد",swatches:["#15181d","#697581","#e2e7ec"]}
];
const vars={
 royal:{"--bg":"#090a0c","--surface":"#121419","--panel":"#121419","--panel2":"#191b20","--panel-2":"#191b20","--card":"#131519","--field":"#0d0f12","--gold":"#d6ad54","--gold2":"#f5d98b","--ink":"#f7f2e8","--text":"#f7f2e8","--heading":"#f5d98b","--muted":"#c0b8aa","--line":"rgba(214,173,84,.28)","--header-bg":"#090a0c","--footer-bg":"#08090b","--button-bg":"#d6ad54","--button-text":"#19120a","--index-bg":"#101115","--index-card":"#121419","--index-icon":"#f5d98b","--index-border":"rgba(214,173,84,.28)"},
 emerald:{"--bg":"#071713","--surface":"#0e211b","--panel":"#10251e","--panel2":"#173329","--panel-2":"#173329","--card":"#10251e","--field":"#091b15","--gold":"#c9ad62","--gold2":"#e4c77b","--ink":"#f1f4ec","--text":"#f1f4ec","--heading":"#e4c77b","--muted":"#b9c9bf","--line":"rgba(92,171,139,.34)","--header-bg":"#06140f","--footer-bg":"#06140f","--button-bg":"#e4c77b","--button-text":"#15231b","--index-bg":"#0a1c16","--index-card":"#10251e","--index-icon":"#e4c77b","--index-border":"rgba(92,171,139,.34)"},
 midnight:{"--bg":"#0a1224","--surface":"#111d34","--panel":"#111d34","--panel2":"#1a2a46","--panel-2":"#1a2a46","--card":"#111d34","--field":"#0b172b","--gold":"#8faee8","--gold2":"#dce6f5","--ink":"#f1f5fc","--text":"#f1f5fc","--heading":"#dce6f5","--muted":"#b6c4d9","--line":"rgba(143,174,232,.32)","--header-bg":"#080f1f","--footer-bg":"#080f1f","--button-bg":"#c7d7f0","--button-text":"#15223a","--index-bg":"#0d1930","--index-card":"#111d34","--index-icon":"#dce6f5","--index-border":"rgba(143,174,232,.32)"},
 ivory:{"--bg":"#f4efe4","--surface":"#fffaf0","--panel":"#fffaf0","--panel2":"#eee5d5","--panel-2":"#eee5d5","--card":"#fffaf0","--field":"#fffdf8","--gold":"#96702e","--gold2":"#78561e","--ink":"#29251e","--text":"#29251e","--heading":"#78561e","--muted":"#625b50","--line":"rgba(120,86,30,.28)","--header-bg":"#f4efe4","--footer-bg":"#e9dfcd","--button-bg":"#b08b48","--button-text":"#fffaf0","--index-bg":"#eee5d5","--index-card":"#fffaf0","--index-icon":"#78561e","--index-border":"rgba(120,86,30,.28)"}

 burgundy:{"--bg":"#210b13","--surface":"#30111d","--panel":"#30111d","--panel2":"#421927","--panel-2":"#421927","--card":"#30111d","--field":"#260d17","--gold":"#c68a72","--gold2":"#e6c58d","--ink":"#fff2e9","--text":"#fff2e9","--heading":"#e6c58d","--muted":"#d2b7b4","--line":"rgba(198,138,114,.32)","--header-bg":"#1a0810","--footer-bg":"#1a0810","--button-bg":"#d8b36a","--button-text":"#261018","--index-bg":"#260d17","--index-card":"#30111d","--index-icon":"#e6c58d","--index-border":"rgba(198,138,114,.32)"},
 rose:{"--bg":"#21171c","--surface":"#302128","--panel":"#302128","--panel2":"#42303a","--panel-2":"#42303a","--card":"#302128","--field":"#271b22","--gold":"#c99aa7","--gold2":"#ead6b8","--ink":"#fbf1f2","--text":"#fbf1f2","--heading":"#ead6b8","--muted":"#d0bfc5","--line":"rgba(183,126,141,.34)","--header-bg":"#1b1217","--footer-bg":"#1b1217","--button-bg":"#ead6b8","--button-text":"#2b1b23","--index-bg":"#271b22","--index-card":"#302128","--index-icon":"#ead6b8","--index-border":"rgba(183,126,141,.34)"},
 desert:{"--bg":"#302319","--surface":"#403023","--panel":"#403023","--panel2":"#55402f","--panel-2":"#55402f","--card":"#403023","--field":"#35271d","--gold":"#c49a69","--gold2":"#f0dfc1","--ink":"#fff4e3","--text":"#fff4e3","--heading":"#f0dfc1","--muted":"#d5c0a5","--line":"rgba(197,154,105,.34)","--header-bg":"#281d14","--footer-bg":"#281d14","--button-bg":"#d9b486","--button-text":"#2e2017","--index-bg":"#35271d","--index-card":"#403023","--index-icon":"#f0dfc1","--index-border":"rgba(197,154,105,.34)"},
 graphite:{"--bg":"#15181d","--surface":"#20252c","--panel":"#20252c","--panel2":"#2a313a","--panel-2":"#2a313a","--card":"#20252c","--field":"#191e24","--gold":"#9eabb8","--gold2":"#e2e7ec","--ink":"#f4f6f8","--text":"#f4f6f8","--heading":"#e2e7ec","--muted":"#bbc4ce","--line":"rgba(158,171,184,.32)","--header-bg":"#111419","--footer-bg":"#111419","--button-bg":"#d2dbe3","--button-text":"#1b2229","--index-bg":"#191e24","--index-card":"#20252c","--index-icon":"#e2e7ec","--index-border":"rgba(158,171,184,.32)"}
};
function apply(id){
 if(!vars[id])id="royal";
 const root=document.documentElement;root.setAttribute("data-palette",id);
 Object.entries(vars[id]).forEach(([k,v])=>root.style.setProperty(k,v));
 try{localStorage.setItem(KEY,id)}catch(_){}
 const status=document.getElementById("mamlakaPaletteStatus");if(status)status.textContent="التصميم الحالي: "+presets.find(p=>p.id===id).name;
 document.querySelectorAll("[data-mamlaka-palette]").forEach(b=>{const active=b.dataset.mamlakaPalette===id;b.setAttribute("aria-pressed",String(active));b.classList.toggle("is-active",active)});
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",vars[id]["--bg"]);
}
function mount(){
 if(document.getElementById("mamlakaPalettePicker"))return;
 const anchor=document.getElementById("homeIndex")||document.getElementById("home")||document.querySelector("main");
 if(!anchor)return;
 const section=document.createElement("section");section.id="mamlakaPalettePicker";section.className="page-section palette-picker";section.setAttribute("aria-labelledby","mamlakaPaletteTitle");
 section.innerHTML='<div class="palette-picker-head"><span class="palette-kicker">MAMLKAT AL-OTOR · STYLE STUDIO</span><h2 id="mamlakaPaletteTitle">اختر أجواء مملكتك</h2><p>أربعة تنسيقات متناسقة، تتغير مباشرة وتحفظ اختيارك على هذا الجهاز.</p></div><div class="palette-options">'+presets.map(p=>'<button type="button" class="palette-option" data-mamlaka-palette="'+p.id+'" aria-pressed="false"><span class="palette-swatches">'+p.swatches.map(c=>'<i style="background:'+c+'"></i>').join("")+'</span><strong>'+p.name+'</strong><small>'+p.desc+'</small><span class="palette-selected">✓ التصميم المختار</span></button>').join("")+'</div><p id="mamlakaPaletteStatus" class="palette-status" aria-live="polite"></p>';
 anchor.insertAdjacentElement("afterend",section);
 section.querySelectorAll("[data-mamlaka-palette]").forEach(b=>b.addEventListener("click",()=>apply(b.dataset.mamlakaPalette)));
 let saved="royal";try{saved=localStorage.getItem(KEY)||"royal"}catch(_){}apply(saved);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();