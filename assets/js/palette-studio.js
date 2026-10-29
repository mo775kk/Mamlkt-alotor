(function(){
"use strict";
const KEY="mamlaka_palette_preset_v1";
const presets=[
 {id:"royal",name:"الملكي الأسود والذهبي",desc:"فخامة كلاسيكية وهوية المتجر الأساسية",swatches:["#090a0c","#d6ad54","#f5d98b"]},
 {id:"emerald",name:"الزمردي الملكي",desc:"أخضر زمردي عميق مع ذهب شامبين",swatches:["#071713","#2d8a70","#e4c77b"]},
 {id:"midnight",name:"الأزرق الليلي",desc:"أزرق ملكي داكن مع فضي دافئ",swatches:["#0a1224","#5279bb","#dce6f5"]},
 {id:"ivory",name:"العاجي الراقي",desc:"خلفية عاجية هادئة ونص داكن ولمسات ذهبية",swatches:["#f4efe4","#b08b48","#25231e"]}
];
const vars={
 royal:{"--bg":"#090a0c","--surface":"#121419","--panel":"#121419","--panel2":"#191b20","--panel-2":"#191b20","--card":"#131519","--field":"#0d0f12","--gold":"#d6ad54","--gold2":"#f5d98b","--ink":"#f7f2e8","--text":"#f7f2e8","--heading":"#f5d98b","--muted":"#c0b8aa","--line":"rgba(214,173,84,.28)","--header-bg":"#090a0c","--footer-bg":"#08090b","--button-bg":"#d6ad54","--button-text":"#19120a","--index-bg":"#101115","--index-card":"#121419","--index-icon":"#f5d98b","--index-border":"rgba(214,173,84,.28)"},
 emerald:{"--bg":"#071713","--surface":"#0e211b","--panel":"#10251e","--panel2":"#173329","--panel-2":"#173329","--card":"#10251e","--field":"#091b15","--gold":"#c9ad62","--gold2":"#e4c77b","--ink":"#f1f4ec","--text":"#f1f4ec","--heading":"#e4c77b","--muted":"#b9c9bf","--line":"rgba(92,171,139,.34)","--header-bg":"#06140f","--footer-bg":"#06140f","--button-bg":"#e4c77b","--button-text":"#15231b","--index-bg":"#0a1c16","--index-card":"#10251e","--index-icon":"#e4c77b","--index-border":"rgba(92,171,139,.34)"},
 midnight:{"--bg":"#0a1224","--surface":"#111d34","--panel":"#111d34","--panel2":"#1a2a46","--panel-2":"#1a2a46","--card":"#111d34","--field":"#0b172b","--gold":"#8faee8","--gold2":"#dce6f5","--ink":"#f1f5fc","--text":"#f1f5fc","--heading":"#dce6f5","--muted":"#b6c4d9","--line":"rgba(143,174,232,.32)","--header-bg":"#080f1f","--footer-bg":"#080f1f","--button-bg":"#c7d7f0","--button-text":"#15223a","--index-bg":"#0d1930","--index-card":"#111d34","--index-icon":"#dce6f5","--index-border":"rgba(143,174,232,.32)"},
 ivory:{"--bg":"#f4efe4","--surface":"#fffaf0","--panel":"#fffaf0","--panel2":"#eee5d5","--panel-2":"#eee5d5","--card":"#fffaf0","--field":"#fffdf8","--gold":"#96702e","--gold2":"#78561e","--ink":"#29251e","--text":"#29251e","--heading":"#78561e","--muted":"#625b50","--line":"rgba(120,86,30,.28)","--header-bg":"#f4efe4","--footer-bg":"#e9dfcd","--button-bg":"#b08b48","--button-text":"#fffaf0","--index-bg":"#eee5d5","--index-card":"#fffaf0","--index-icon":"#78561e","--index-border":"rgba(120,86,30,.28)"}
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