/* Mamlakat Al-Otor — accessible brand marquee and gentle hero parallax */
(function(){
 "use strict";
 var defaults=[
  {text:"CROWN · MAISON DE PARFUM",lang:"en"},
  {text:"مملكة العطور",lang:"ar"},
  {text:"عطور · زيوت · عود · مسك",lang:"ar"},
  {text:"صُنع ليُذكر · CRAFTED TO BE REMEMBERED",lang:"ar"}
 ];
 var KEY="mamlaka_marquee_items_v1";
 function readItems(){try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(saved)){var valid=saved.map(function(x){return typeof x==="string"?{text:x,lang:/[\u0600-\u06FF]/.test(x)?"ar":"en"}:{text:String(x.text||""),lang:x.lang==="ar"?"ar":"en"};}).filter(function(x){return x.text.trim();});if(valid.length)return valid;}}catch(e){}return defaults;}
 function build(){
  var track=document.getElementById("marqueeTrack");if(!track)return;
  var items=readItems();
  function group(){var frag=document.createDocumentFragment();items.forEach(function(item){var wrap=document.createElement("span");wrap.className="mamlaka-marquee-item";wrap.lang=item.lang;wrap.textContent=item.text;var seal=document.createElement("i");seal.className="mamlaka-marquee-seal";seal.setAttribute("aria-hidden","true");wrap.appendChild(seal);frag.appendChild(wrap);});return frag;}
  track.replaceChildren(group(),group());track.setAttribute("aria-hidden","true");
  track.style.animationDirection=document.documentElement.dir==="rtl"?"reverse":"normal";
 }
 function initParallax(){
  var hero=document.getElementById("home"),img=hero&&hero.querySelector(".hero-image");
  if(!hero||!img||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var ticking=false;
  function update(){if(ticking)return;ticking=true;window.requestAnimationFrame(function(){var rect=hero.getBoundingClientRect();if(rect.bottom>0&&rect.top<window.innerHeight){var offset=Math.max(-28,Math.min(28,-rect.top*.12));img.style.translate="0 "+offset+"px";}ticking=false;});}
  window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update,{passive:true});update();
 }
 function touchPause(){var bar=document.querySelector(".mamlaka-marquee"),track=document.getElementById("marqueeTrack");if(!bar||!track)return;var timer;bar.addEventListener("touchstart",function(){bar.classList.add("is-paused");clearTimeout(timer);},{passive:true});function resume(){clearTimeout(timer);timer=setTimeout(function(){bar.classList.remove("is-paused");},500);}bar.addEventListener("touchend",resume,{passive:true});bar.addEventListener("touchcancel",resume,{passive:true});}
 document.addEventListener("DOMContentLoaded",function(){build();initParallax();touchPause();var lang=document.getElementById("languageToggle");if(lang)lang.addEventListener("click",function(){window.setTimeout(build,0);});});
 window.MamlakaMarquee={refresh:build,storageKey:KEY,defaults:defaults};
})();